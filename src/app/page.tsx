"use client";
import { useEffect, useState } from "react";
import {
  ShieldCheck,
  Zap,
  Download,
  Scissors,
  LockKeyhole,
  Sparkles,
  ArrowRight,
  FileVideo,
  LoaderCircle,
  Clock3,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

import Header from "@/components/Header";
import VideoUploader from "@/components/VideoUploader";
import SplitControls from "@/components/SplitControls";
import VideoResults from "@/components/VideoResults";
import { splitVideo, type SplitResult } from "@/lib/ffmpeg";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(15);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState<SplitResult[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);

  useEffect(() => {
    if (!file) {
      setPreviewUrl("");
      return;
    }

    const url = URL.createObjectURL(file);
    setPreviewUrl(url);

    return () => URL.revokeObjectURL(url);
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

    // Temporary safety limit for this browser-based development build.
    // Large-file support needs further memory engineering.
    if (file.size > 250 * 1024 * 1024) {
      setError(
        "This development version is not ready for videos above 250 MB. " +
        "Please test with a smaller video first to avoid browser memory crashes."
      );
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
        setStatus
      );

      setResults(clips);
      setStatus("All clips created successfully!");
    } catch (err) {
      console.error("Video splitting error:", err);

      setError(
        err instanceof Error
          ? err.message
          : "Video processing failed. Please try another video."
      );
    } finally {
      setProcessing(false);
    }
  }

  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-[#f7f8fc] text-[#101828]"
    >
      <Header />

      {/* HERO */}
      <section className="relative px-5 pb-12 pt-16 sm:pt-24">
        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[420px] w-[850px] -translate-x-1/2 rounded-full bg-blue-100/50 blur-[120px]" />

        <div className="relative mx-auto max-w-5xl text-center">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <Sparkles size={15} className="text-blue-600" />
            <span className="text-xs font-bold tracking-wide text-blue-700">
              FREE ONLINE VIDEO TOOL
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-400" />
            <span className="text-xs font-medium text-gray-500">
              No registration
            </span>
          </div>

          <h1 className="text-5xl font-black leading-[1.12] tracking-[-2px] text-[#101828] sm:text-7xl">
            Your videos.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Perfectly split.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-500 sm:text-lg">
            Turn long videos into perfectly sized clips.
            Simple, private and without watermarks.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-7 text-sm font-medium text-gray-600">
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-500" />
              100% Free
            </span>
            <span className="flex items-center gap-2">
              <ShieldCheck size={17} className="text-green-500" />
              Private processing
            </span>
            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-500" />
              No watermark
            </span>
          </div>
        </div>
      </section>

      {/* WORKSPACE */}
      <section className="px-4 pb-24 sm:px-6">
        <div className="mx-auto max-w-6xl">
          <div className="overflow-hidden rounded-[28px] border border-gray-200/80 bg-white shadow-[0_20px_70px_rgba(15,23,42,0.08)]">

            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-gray-100 px-6 py-5 sm:px-9">
              <div>
                <div className="flex items-center gap-2">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-blue-600 text-white">
                    <Scissors size={19} />
                  </div>
                  <h2 className="text-lg font-extrabold">
                    Video workspace
                  </h2>
                </div>
                <p className="mt-1 pl-11 text-xs text-gray-400">
                  Upload, customize and split your video
                </p>
              </div>

              <div className="flex items-center gap-2 rounded-full border border-green-100 bg-green-50 px-3 py-2">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                <span className="text-xs font-bold text-green-700">
                  {processing ? "Processing" : "Ready"}
                </span>
              </div>
            </div>

            <div className="grid gap-8 p-5 sm:p-9 lg:grid-cols-[1.35fr_0.85fr]">

              {/* VIDEO UPLOAD */}
              <div className="space-y-5">
                <div>
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-gray-800">
                      01. Upload your video
                    </h3>
                    <span className="text-xs text-gray-400">
                      Select a file
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

                <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-blue-50/60 p-4">
                  <div className="rounded-xl bg-white p-2 text-blue-600 shadow-sm">
                    <LockKeyhole size={19} />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-800">
                      Your video stays on your device
                    </p>
                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Processing happens locally in your browser.
                      The original video is not uploaded to our server.
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
                    <Clock3 size={17} className="text-gray-400" />
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

                <div className="rounded-2xl bg-[#111827] p-5 text-white shadow-lg">
                  <div className="flex items-center gap-2 text-blue-300">
                    <Scissors size={18} />
                    <span className="text-xs font-bold uppercase tracking-widest">
                      Your configuration
                    </span>
                  </div>

                  <div className="mt-5">
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

                  <div className="my-5 h-px bg-white/10" />

                  <div className="flex items-center justify-between gap-3 text-sm">
                    <span className="text-gray-400">Selected video</span>
                    <span className="max-w-[150px] truncate font-semibold">
                      {file ? file.name : "Not selected"}
                    </span>
                  </div>
                </div>

                {/* ACTUAL SPLIT BUTTON */}
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
              </div>
            </div>

            {/* PROCESSING STATUS */}
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
                    <p className="font-bold">Processing issue</p>
                    <p className="mt-1 text-sm leading-6">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* SUCCESS */}
            {results.length > 0 && !processing && (
              <div className="border-t border-green-100 bg-green-50/40 px-6 py-6 sm:px-9">
                <div className="mb-5 flex items-center gap-2">
                  <CheckCircle2 className="text-green-600" size={22} />
                  <div>
                    <h3 className="font-bold text-gray-900">
                      Video split successfully!
                    </h3>
                    <p className="text-xs text-gray-500">
                      {results.length} video clips are ready.
                    </p>
                  </div>
                </div>

                <VideoResults results={results} />
              </div>
            )}

          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="border-t border-gray-200 bg-white px-5 py-24">
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-xl text-center">
            <span className="text-xs font-bold uppercase tracking-[3px] text-blue-600">
              WHY SPLITMYVIDEO
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need.
              <br />
              Nothing you don't.
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <Feature
              icon={<ShieldCheck size={25} />}
              title="Privacy comes first"
              description="Your videos are processed locally in your browser."
            />
            <Feature
              icon={<Scissors size={25} />}
              title="Split your way"
              description="Choose a duration or enter your own custom timing."
            />
            <Feature
              icon={<Download size={25} />}
              title="Download with ease"
              description="Download individual clips or collect them in a ZIP."
            />
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1120] px-5 py-8 text-white">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-5 sm:flex-row">
          <div>
            <p className="font-extrabold">SplitMyVideo</p>
            <p className="text-xs text-gray-500">
              Free. Simple. Open source.
            </p>
          </div>

          {/* <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-white"
          >
            <Github size={17} />
            Open source
          </a> */}
        </div>

        <div className="mx-auto mt-8 max-w-6xl border-t border-white/10 pt-6 text-center text-xs text-gray-500">
          © 2026 SplitMyVideo. Built by Acustard Technologies.
        </div>
      </footer>
    </main>
  );
}

function Feature({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="group rounded-3xl border border-gray-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
        {icon}
      </div>
      <h3 className="mt-7 text-lg font-extrabold">{title}</h3>
      <p className="mt-3 text-sm leading-7 text-gray-500">
        {description}
      </p>
    </div>
  );
}
