import { FFmpeg } from "@ffmpeg/ffmpeg";

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

export type SplitResult = {
  name: string;
  blob: Blob;
};

export async function splitVideo(
  file: File,
  duration: number,
  onProgress?: (progress: number) => void,
  onStatus?: (message: string) => void
): Promise<SplitResult[]> {
  const engine = await getFFmpeg(onStatus);

  const inputName = "input_video";
  const outputFiles: string[] = [];

  onStatus?.("Reading video...");
  onProgress?.(0);

  const fileData = new Uint8Array(await file.arrayBuffer());
  await engine.writeFile(inputName, fileData);

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

  const totalParts = Math.ceil(videoDuration / duration);
  const results: SplitResult[] = [];

  let currentPart = 0;

  engine.on("progress", ({ progress }) => {
    const overall = ((currentPart + progress) / totalParts) * 100;
    onProgress?.(Math.min(99, Math.round(overall)));
  });

  try {
    for (let i = 0; i < totalParts; i++) {
      const start = i * duration;
      const clipDuration = Math.min(duration, videoDuration - start);
      const outputName = `part_${String(i + 1).padStart(3, "0")}.mp4`;

      onStatus?.(`Creating clip ${i + 1} of ${totalParts}...`);

      const exitCode = await engine.exec([
        "-ss", String(start),
        "-i", inputName,
        "-t", String(clipDuration),
        "-map", "0:v:0",
        "-map", "0:a?",
        "-c:v", "libx264",
        "-preset", "ultrafast",
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

      const data = await engine.readFile(outputName);

      if (typeof data === "string") {
        throw new Error("Invalid video output.");
      }

      const outputData = new ArrayBuffer(data.byteLength);
      new Uint8Array(outputData).set(data);

      results.push({
        name: outputName,
        blob: new Blob([outputData], { type: "video/mp4" }),
      });

      outputFiles.push(outputName);
      await engine.deleteFile(outputName);

      currentPart = i + 1;
      onProgress?.(Math.round((currentPart / totalParts) * 100));
    }

    onStatus?.("Video splitting complete!");
    return results;
  } finally {
    await engine.deleteFile(inputName).catch(() => {});
    onProgress?.(100);
  }
}
