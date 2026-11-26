
import { FFmpeg } from "@ffmpeg/ffmpeg";
import {
  saveClip,
  getStorageInfo,
  type StoredClip,
} from "@/lib/video-storage";
export class SplitVideoError extends Error {
  constructor(
    message: string,
    public clips: StoredClip[]
  ) {
    super(message);
    this.name = "SplitVideoError";
  }
}
function getVideoErrorMessage(error: unknown): string {
  const message =
    error instanceof Error ? error.message : String(error);

  const lowerMessage = message.toLowerCase();

  if (
    lowerMessage.includes("memory") ||
    lowerMessage.includes("out of memory") ||
    lowerMessage.includes("allocation failed") ||
    lowerMessage.includes("abort")
  ) {
    return (
      "Your browser ran out of memory while processing this video. " +
      "Try a smaller video or shorter clips, and close other browser tabs."
    );
  }

  if (
    lowerMessage.includes("quota") ||
    lowerMessage.includes("storage") ||
    lowerMessage.includes("space")
  ) {
    return (
      "Browser storage is insufficient. Delete old clips or free up storage."
    );
  }

  return message || "Video processing failed. Please try another video.";
}
let ffmpeg: FFmpeg | null = null;
let isLoaded = false;

export async function getFFmpeg(onStatus?: (message: string) => void) {
  if (!ffmpeg) {
    ffmpeg = new FFmpeg();
  }

  if (!isLoaded) {
    onStatus?.("Loading video engine...");

    await ffmpeg.load({
      coreURL: "/ffmpeg/ffmpeg-core.js",
      wasmURL: "/ffmpeg/ffmpeg-core.wasm",
    });

    isLoaded = true;
  }

  return ffmpeg;
}

export async function splitVideo(
  file: File,
  duration: number,
  onProgress?: (progress: number) => void,
  onStatus?: (message: string) => void,
  trimStart = 0,
  trimEnd?: number
): Promise<StoredClip[]> {
  if (!(file instanceof File) || file.size <= 0) {
  throw new Error("Please select a valid video file.");
}

if (!Number.isFinite(duration) || duration <= 0) {
  throw new Error("Please select a valid clip duration.");
}

onStatus?.("Checking available browser storage...");

const storageInfo = await getStorageInfo();

if (
  storageInfo &&
  storageInfo.available < file.size
) {
  throw new Error(
    "Not enough estimated browser storage available. " +
    "Please free up browser storage or use a smaller video."
  );
}
  const engine = await getFFmpeg(onStatus);

  const mountPoint = `/input_${Date.now()}`;
  const safeFileName = file.name.replace(/[\\/]/g, "_") || "input_video";
  const inputPath = `${mountPoint}/${safeFileName}`;

  let mounted = false;

  onStatus?.("Reading video metadata...");
  onProgress?.(0);

  const videoDuration = await new Promise<number>((resolve, reject) => {
    const video = document.createElement("video");
    const url = URL.createObjectURL(file);

    video.preload = "metadata";

    video.onloadedmetadata = () => {
      URL.revokeObjectURL(url);
      resolve(video.duration);
    };

    video.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Could not read video duration."));
    };

    video.src = url;
  });

 if (!Number.isFinite(videoDuration) || videoDuration <= 0) {
  throw new Error("Invalid video duration.");
}

const selectedStart = trimStart;
const selectedEnd = trimEnd ?? videoDuration;

if (
  !Number.isFinite(selectedStart) ||
  !Number.isFinite(selectedEnd) ||
  selectedStart < 0 ||
  selectedEnd > videoDuration ||
  selectedEnd <= selectedStart
) {
  throw new Error("Invalid trim range.");
}

const totalParts = Math.ceil(
  (selectedEnd - selectedStart) / duration
);
  const results: StoredClip[] = [];
  let completed = false;

  let currentPart = 0;
  let progressListenerAttached = false;

const handleProgress = ({ progress }: { progress: number }) => {
  const overall = ((currentPart + progress) / totalParts) * 100;
  onProgress?.(Math.min(99, Math.round(overall)));
};

  try {
    onStatus?.("Preparing browser storage...");

    await engine.createDir(mountPoint);

    await engine.mount(
      "WORKERFS" as unknown as Parameters<typeof engine.mount>[0],
      { files: [file] },
      mountPoint
    );

    mounted = true;

    onStatus?.("Original video mounted successfully.");

   engine.on("progress", handleProgress);
progressListenerAttached = true;

    for (let i = 0; i < totalParts; i++) {
     const start = selectedStart + i * duration;

const clipDuration = Math.min(
  duration,
  selectedEnd - start
);

      const outputName = `part_${String(i + 1).padStart(3, "0")}.mp4`;

      onStatus?.(`Creating clip ${i + 1} of ${totalParts}...`);

      const exitCode = await engine.exec([
        "-ss", String(start),
        "-i", inputPath,
        "-t", String(clipDuration),
        "-map", "0:v:0",
        "-map", "0:a?",
       "-c:v", "libx264",
"-preset", "ultrafast",
"-threads", "1",
"-filter_threads", "1",
"-filter_complex_threads", "1",
"-crf", "23",
        "-pix_fmt", "yuv420p",
        "-c:a", "aac",
        "-b:a", "128k",
        "-movflags", "+faststart",
        outputName,
      ]);

      if (exitCode !== 0) {
        throw new Error(`Failed to create clip ${i + 1}.`);
      }

   
try {
  onStatus?.(`Saving clip ${i + 1} to browser storage...`);

  const data = await engine.readFile(outputName);

  if (typeof data === "string") {
    throw new Error("Invalid video output.");
  }

  const blob = new Blob(
    [data as unknown as BlobPart],
    { type: "video/mp4" }
  );

  const storedClip = await saveClip(blob, outputName);

  results.push(storedClip);
} finally {
  // Remove only the current output file.
  await engine.deleteFile(outputName).catch(() => {});
}


      currentPart = i + 1;
      onProgress?.(Math.round((currentPart / totalParts) * 100));
    }

    onStatus?.("All clips saved successfully!");
    onProgress?.(100);
completed = true;
    return results;
  }   catch (error) {
    if (results.length > 0) {
    const message = getVideoErrorMessage(error);

      throw new SplitVideoError(message, results);
    }

   throw new Error(getVideoErrorMessage(error));
  }  
finally {
  if (progressListenerAttached) {
    engine.off("progress", handleProgress);
  }

  if (mounted) {
    await engine.unmount(mountPoint).catch(() => {});
  }

  await engine.deleteDir(mountPoint).catch(() => {});

  if (!completed && results.length > 0) {
    onStatus?.(
      `${results.length} clips saved. Some clips could not be created.`
    );
  }
}

  
}

export type { StoredClip as SplitResult };
