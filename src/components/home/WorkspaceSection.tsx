import { useEffect, useState } from "react";
import { AlertCircle, ArrowRight, CheckCircle2, Clock3, FileVideo, LoaderCircle, LockKeyhole, Scissors, Sparkles } from "lucide-react";
import VideoUploader from "@/components/VideoUploader";
import SplitControls from "@/components/SplitControls";
import VideoResults from "@/components/VideoResults";
import ProcessingArena from "@/components/ProcessingArena";

import {
  splitVideo,
  SplitVideoError,
} from "@/lib/ffmpeg";

import {
  getStoredClips,
  type StoredClip,
} from "@/lib/video-storage";

export default function WorkspaceSection() {
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState<StoredClip[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(15);
  const [trimStart, setTrimStart] = useState(0);
  const [trimEnd, setTrimEnd] = useState(0);
  const [videoDuration, setVideoDuration] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function restoreClips() {
      try {
        const savedClips = await getStoredClips();

        if (!cancelled) {
          setResults(savedClips);
        }
      } catch (error) {
        console.error("Could not restore saved clips:", error);

        if (!cancelled) {
          setError(
            "Saved video information could not be read. " +
            "Your existing video files have not been deleted. " +
            "Please avoid clearing browser storage."
          );
        }
      }
    }

    restoreClips();

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      setVideoDuration(0);
      setTrimStart(0);
      setTrimEnd(0);
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    const video = document.createElement("video");
    video.preload = "metadata";

    video.onloadedmetadata = () => {
      const totalDuration = video.duration;

      if (Number.isFinite(totalDuration) && totalDuration > 0) {
        setVideoDuration(totalDuration);
        setTrimStart(0);
        setTrimEnd(totalDuration);
      }
    };

    video.onerror = () => {
      setError("Could not read video duration.");
    };

    video.src = url;

    return () => {
      URL.revokeObjectURL(url);
      video.onloadedmetadata = null;
      video.onerror = null;
      video.removeAttribute("src");
    };
  }, [file]);

  function handleFileSelect(selected: File | null) {
    if (processing) return;

    setFile(selected);
    setResults([]);
    setError("");
    setProgress(0);
    setStatus("");
  }

  async function handleSplit() {
    if (!file || processing) return;

    if (!Number.isInteger(duration) || duration < 1 || duration > 3600) {
      setError("Please select a valid duration between 1 and 3600 seconds.");
      return;
    }

    if (
      !Number.isFinite(trimStart) ||
      !Number.isFinite(trimEnd) ||
      trimStart < 0 ||
      trimEnd > videoDuration ||
      trimEnd <= trimStart
    ) {
      setError("Please select a valid trim range.");
      return;
    }

    setProcessing(true);
    setError("");
    setResults([]);
    setProgress(0);
    setStatus("Preparing video engine...");

    try {
      const clips = await splitVideo(
        file,
        duration,
        setProgress,
        setStatus,
        trimStart,
        trimEnd
      );

      setResults(clips);
      setStatus("All clips created successfully!");
    } catch (err) {
      console.error("Video splitting error:", err);

      if (err instanceof SplitVideoError) {
        setResults(err.clips);

        setError(
          `${err.message} ${err.clips.length} completed clip(s) were saved and are available below.`
        );
      } else {
        setError(
          err instanceof Error
            ? err.message
            : "Video processing failed. Please try another video."
        );
      }
    } finally {
      setProcessing(false);
    }
  }
  return (
    processing ? (
      <ProcessingArena
        progress={progress}
        status={status}
        isProcessing={processing}
      />
    ) : (<section id="workspace" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">

      <div className="mx-auto max-w-6xl">

        <div className="mb-10 text-center">
          <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">
            VIDEO SPLITTING WORKSPACE
          </span>

          <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
            Your video. Your control.
          </h2>

          <p className="mt-3 text-sm leading-7 text-gray-500">
            Upload your video, customize your settings and create
            perfectly sized clips.
          </p>
        </div>

        <div className="overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.07)]">

          {/* WORKSPACE HEADER */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-5 sm:px-9">

            <div>
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
                  <Scissors size={20} />
                </div>

                <h3 className="text-lg font-extrabold">
                  Video workspace
                </h3>
              </div>

              <p className="mt-1 pl-12 text-xs text-gray-400">
                Upload · Customize · Split · Download
              </p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-4 py-2">
              <span className={`h-2 w-2 rounded-full ${processing ? "animate-pulse bg-blue-500" : "bg-green-500"}`} />

              <span className="text-xs font-bold text-green-700">
                {processing ? "Processing" : "Ready to use"}
              </span>
            </div>

          </div>

          {/* MAIN GRID */}
          <div className="grid gap-8 p-5 sm:p-9 lg:grid-cols-[1.35fr_0.85fr]">

            {/* UPLOAD */}
            <div className="space-y-6">

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    01. Upload your video
                  </h3>

                  <span className="text-xs text-gray-400">
                    Video file
                  </span>
                </div>

                <div className="rounded-2xl border border-gray-100 bg-[#fafbff] p-2">
                  <VideoUploader
                    file={file}
                    onFileSelect={handleFileSelect}
                  />
                </div>
              </div>

              {file && previewUrl && (
                <div className="overflow-hidden rounded-2xl border border-gray-200 bg-[#111827]">

                  <div className="flex items-center justify-between px-5 py-4 text-white">
                    <div className="flex items-center gap-2">
                      <FileVideo size={17} />

                      <span className="text-sm font-semibold">
                        Video preview
                      </span>
                    </div>

                    <span className="text-xs text-gray-400">
                      {(file.size / (1024 * 1024)).toFixed(2)} MB
                    </span>
                  </div>

                  <div className="px-3 pb-3">
                    <video
                      src={previewUrl}
                      controls
                      className="max-h-[380px] w-full rounded-xl bg-black"
                    />
                  </div>

                  <div className="truncate border-t border-white/10 px-5 py-3 text-xs text-gray-300">
                    {file.name}
                  </div>

                </div>
              )}

              {/* PRIVACY */}
              <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-5">

                <div className="rounded-xl bg-white p-2 text-blue-600 shadow-sm">
                  <LockKeyhole size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-gray-800">
                    Your privacy matters
                  </p>

                  <p className="mt-1 text-xs leading-6 text-gray-500">
                    Video splitting is processed locally in your browser.
                    Your original video is not uploaded to our processing server.
                  </p>
                </div>

              </div>

            </div>

            {/* SETTINGS */}
            <div className="space-y-5">

              <div>
                <div className="mb-3 flex items-center justify-between">
                  <h3 className="text-sm font-bold text-gray-800">
                    02. Split settings
                  </h3>

                  <Clock3 size={18} className="text-gray-400" />
                </div>

                <div className="rounded-2xl border border-gray-200 bg-white p-3">
                  <SplitControls
                    duration={duration}
                    onChange={(value) => {
                      setDuration(value);
                      setResults([]);
                      setError("");
                    }}
                  />
                </div>
              </div>
              {/* TRIM SETTINGS */}
              {file && videoDuration > 0 && (
                <div className="rounded-2xl border border-gray-200 bg-white p-5">
                  <h3 className="mb-4 text-sm font-bold text-gray-800">
                    03. Trim video
                  </h3>

                  <div className="space-y-4">
                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-600">
                        Start time (seconds)
                      </label>

                      <input
                        type="number"
                        min={0}
                        max={videoDuration}
                        step={0.1}
                        value={trimStart}
                        onChange={(e) =>
                          setTrimStart(Number(e.target.value))
                        }
                        disabled={processing}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                    <div>
                      <label className="mb-2 block text-xs font-semibold text-gray-600">
                        End time (seconds)
                      </label>

                      <input
                        type="number"
                        min={0}
                        max={videoDuration}
                        step={0.1}
                        value={trimEnd}
                        onChange={(e) =>
                          setTrimEnd(Number(e.target.value))
                        }
                        disabled={processing}
                        className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm outline-none focus:border-blue-500"
                      />
                    </div>

                    <p className="text-xs text-gray-500">
                      Total video: {videoDuration.toFixed(2)} seconds
                    </p>

                    <p className="text-xs font-semibold text-blue-600">
                      Selected duration: {Math.max(0, trimEnd - trimStart).toFixed(2)} seconds
                    </p>
                  </div>
                </div>
              )}
              {/* CONFIGURATION */}
              <div className="rounded-2xl bg-[#111827] p-6 text-white shadow-lg">

                <div className="flex items-center gap-2 text-blue-300">
                  <Sparkles size={18} />

                  <span className="text-xs font-bold uppercase tracking-widest">
                    Your configuration
                  </span>
                </div>

                <div className="mt-6">
                  <p className="text-xs text-gray-400">
                    Selected clip duration
                  </p>

                  <div className="mt-1 flex items-end gap-2">
                    <span className="text-5xl font-black">
                      {duration}
                    </span>

                    <span className="pb-1 text-sm text-gray-400">
                      seconds / clip
                    </span>
                  </div>
                </div>

                <div className="my-6 h-px bg-white/10" />

                <div className="flex items-center justify-between gap-3 text-sm">
                  <span className="text-gray-400">
                    Selected video
                  </span>

                  <span className="max-w-[150px] truncate font-semibold">
                    {file ? file.name : "Not selected"}
                  </span>
                </div>

                <div className="mt-4 flex items-center justify-between text-sm">
                  <span className="text-gray-400">
                    Processing
                  </span>

                  <span className="font-semibold text-green-400">
                    {processing ? "In progress" : "Ready"}
                  </span>
                </div>

              </div>

              {/* SPLIT BUTTON */}
              <button
                onClick={handleSplit}
                disabled={!file || processing}
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-base font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-0.5 hover:shadow-xl disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {processing ? (
                  <>
                    <LoaderCircle size={21} className="animate-spin" />
                    Processing video...
                  </>
                ) : (
                  <>
                    <Scissors size={21} />
                    Split My Video
                    <ArrowRight size={18} />
                  </>
                )}
              </button>

              {!file && (
                <p className="text-center text-xs text-gray-400">
                  Upload a video to enable splitting.
                </p>
              )}

              <p className="text-center text-xs leading-5 text-gray-400">
                Free online video splitter · No watermark · No mandatory signup
              </p>

            </div>

          </div>

          {/* PROCESSING */}
          {processing && (
            <div className="border-t border-blue-100 bg-blue-50/60 px-6 py-6 sm:px-9">

              <div className="mb-3 flex flex-wrap items-center justify-between gap-2">

                <div className="flex items-center gap-2 font-bold text-gray-800">
                  <LoaderCircle size={19} className="animate-spin text-blue-600" />
                  Video processing
                </div>

                <span className="text-sm font-bold text-blue-700">
                  {progress}%
                </span>

              </div>

              <div className="h-3 overflow-hidden rounded-full bg-blue-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <p className="mt-3 text-sm text-gray-600">
                {status || "Please wait..."}
              </p>

              <p className="mt-2 text-xs text-gray-400">
                Keep this browser tab open until processing finishes.
              </p>

            </div>
          )}

          {/* ERROR */}
          {error && (
            <div className="border-t border-red-100 bg-red-50 px-6 py-5 sm:px-9">

              <div className="flex items-start gap-3 text-red-700">
                <AlertCircle className="mt-0.5 shrink-0" size={20} />

                <div>
                  <p className="font-bold">
                    Processing issue
                  </p>

                  <p className="mt-1 text-sm leading-6">
                    {error}
                  </p>
                </div>
              </div>

            </div>
          )}

          {/* RESULTS */}
          {results.length > 0 && !processing && (
            <div className="border-t border-green-100 bg-green-50/40 px-6 py-7 sm:px-9">

              <div className="mb-6 flex items-center gap-3">

                <CheckCircle2 className="text-green-600" size={23} />

                <div>
                  <h3 className="font-bold text-gray-900">
                    {error ? "Partial results saved" : "Your video clips are ready!"}
                  </h3>

                  <p className="text-xs text-gray-500">
                    {results.length} video clips created successfully.
                  </p>
                </div>

              </div>

              <VideoResults
                results={results}
                onResultsChange={setResults}
              />

            </div>
          )}

        </div>

      </div>
       </section>
  )
);
}