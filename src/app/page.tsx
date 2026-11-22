
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
  Play,
  Globe2,
  MonitorPlay,
  HelpCircle,
  ChevronDown,
  Upload,
  Smartphone,
  Layers3,
  Infinity,
  Video,
} from "lucide-react";

import Header from "@/components/Header";
import VideoUploader from "@/components/VideoUploader";
import SplitControls from "@/components/SplitControls";
import VideoResults from "@/components/VideoResults";

import {
  splitVideo,
  SplitVideoError,
} from "@/lib/ffmpeg";

import {
  getStoredClips,
  type StoredClip,
} from "@/lib/video-storage";

const faqs = [
  {
    question: "How can I split a video online for free?",
    answer:
      "Upload your video to SplitMyVideo, choose your preferred clip duration, and click Split My Video. Your video will be divided into smaller clips that you can preview and download.",
  },
  {
    question: "Is SplitMyVideo free to use?",
    answer:
      "Yes. SplitMyVideo provides free online video splitting without requiring mandatory registration.",
  },
  {
    question: "Are my uploaded videos private?",
    answer:
      "Video splitting happens locally in your browser. Your original video is not uploaded to our video processing server.",
  },
  {
    question: "Can I split videos into 15-second or 30-second clips?",
    answer:
      "Yes. You can choose your preferred clip duration, including 15 seconds, 30 seconds, 60 seconds, or a custom duration.",
  },
  {
    question: "Can I upload split clips directly to YouTube?",
    answer:
      "Yes. Connect your YouTube account using Google authorization, select a generated video clip, add its title and description, and upload it directly to your YouTube channel.",
  },
  {
    question: "Does SplitMyVideo add a watermark?",
    answer:
      "No. The tool does not intentionally add a watermark to your generated video clips.",
  },
];

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [duration, setDuration] = useState(15);
  const [previewUrl, setPreviewUrl] = useState("");
  const [results, setResults] = useState<StoredClip[]>([]);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");
  const [processing, setProcessing] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

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

    if (file.size > 800 * 1024 * 1024) {
      setError(
        "This development version is not ready for videos above 800 MB. Please test with a smaller video first to avoid browser memory crashes."
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
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-[#f8faff] text-[#101828]"
    >
      <Header />

      {/* HERO SECTION */}
      <section className="relative px-5 pb-16 pt-16 sm:pb-24 sm:pt-24">

        <div className="pointer-events-none absolute left-1/2 top-0 -z-0 h-[450px] w-[900px] -translate-x-1/2 rounded-full bg-blue-100/60 blur-[130px]" />

        <div className="relative mx-auto max-w-5xl text-center">

          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white px-4 py-2 shadow-sm">
            <Sparkles size={15} className="text-blue-600" />
            <span className="text-xs font-bold tracking-wide text-blue-700">
              FREE ONLINE VIDEO SPLITTER
            </span>
            <span className="h-1 w-1 rounded-full bg-blue-400" />
            <span className="text-xs font-medium text-gray-500">
              No signup required
            </span>
          </div>

          <h1 className="text-4xl font-black leading-[1.12] tracking-[-2px] sm:text-6xl lg:text-7xl">
            Split Videos Online.
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
              Fast, Free & Easy.
            </span>
          </h1>

          <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-500 sm:text-lg">
            Split large videos into smaller clips in seconds.
            Choose custom durations, preview every clip and download
            your videos without watermarks. Simple, private and
            completely online.
          </p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-7 text-sm font-semibold text-gray-600">

            <span className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-green-500" />
              Free to use
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

          <div className="mt-12 flex flex-wrap justify-center gap-3">
            <a
              href="#workspace"
              className="inline-flex items-center gap-2 rounded-xl bg-blue-600 px-7 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
            >
              <Scissors size={18} />
              Start Splitting
              <ArrowRight size={17} />
            </a>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-xl border border-gray-200 bg-white px-7 py-4 text-sm font-bold text-gray-700 transition hover:border-blue-200 hover:bg-blue-50"
            >
              <Play size={17} />
              How it works
            </a>
          </div>

          <div className="mt-14 flex items-center justify-center gap-3 text-xs font-medium text-gray-400">
            <Globe2 size={15} />
            Works online · No software installation required
          </div>

        </div>
      </section>

      {/* TRUST STRIP */}
      <section className="border-y border-gray-100 bg-white px-5 py-7">
        <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">

          <TrustItem icon={<ShieldCheck />} title="Privacy First" />
          <TrustItem icon={<Zap />} title="Fast Processing" />
          <TrustItem icon={<Layers3 />} title="Multiple Clips" />
          <TrustItem icon={<Download />} title="Easy Downloads" />

        </div>
      </section>

      {/* WORKSPACE */}
      <section id="workspace" className="scroll-mt-20 px-4 py-20 sm:px-6 sm:py-24">

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

      {/* HOW IT WORKS */}
      <section
        id="how-it-works"
        className="border-y border-gray-100 bg-white px-5 py-20 sm:py-24"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto mb-14 max-w-xl text-center">

            <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">
              SIMPLE WORKFLOW
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Split your video in 3 easy steps
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              No complicated editing software. Just upload, customize and download.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-3">

            <StepCard
              number="01"
              icon={<Upload size={25} />}
              title="Upload your video"
              description="Select a video from your device and preview it before splitting."
            />

            <StepCard
              number="02"
              icon={<Scissors size={25} />}
              title="Choose clip duration"
              description="Set your preferred duration and let SplitMyVideo divide your video."
            />

            <StepCard
              number="03"
              icon={<Download size={25} />}
              title="Download your clips"
              description="Preview your generated clips and download the individual video files."
            />

          </div>

        </div>

      </section>

      {/* FEATURES */}
      <section
        id="features"
        className="bg-[#f8faff] px-5 py-20 sm:py-24"
      >

        <div className="mx-auto max-w-6xl">

          <div className="mx-auto mb-14 max-w-xl text-center">

            <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">
              WHY SPLITMYVIDEO
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Everything you need.
              <br />
              Nothing you don't.
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              A simple online video splitting tool designed for creators,
              professionals and everyday video editing tasks.
            </p>

          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <Feature
              icon={<ShieldCheck size={25} />}
              title="Privacy comes first"
              description="Video splitting happens locally in your browser. Your original video is not uploaded to our processing server."
            />

            <Feature
              icon={<Scissors size={25} />}
              title="Split your way"
              description="Choose your preferred clip duration and create smaller video segments from longer recordings."
            />

            <Feature
              icon={<Download size={25} />}
              title="Easy downloads"
              description="Download individual clips or collect your generated video files with convenient download options."
            />

            <Feature
              icon={<Zap size={25} />}
              title="Fast browser processing"
              description="Start splitting videos directly in your browser without installing desktop editing software."
            />

            <Feature
              icon={<MonitorPlay size={25} />}
              title="Creator-friendly workflow"
              description="Prepare smaller clips for YouTube, social media, presentations and other content platforms."
            />

            <Feature
              icon={<Smartphone size={25} />}
              title="Responsive experience"
              description="Enjoy a clean and accessible interface across desktop, tablet and mobile screen sizes."
            />

          </div>

        </div>

      </section>

      {/* YOUTUBE SECTION */}
      <section className="px-5 py-20 sm:py-24">

        <div className="mx-auto max-w-6xl">

          <div className="relative overflow-hidden rounded-[30px] bg-[#101828] px-7 py-12 text-white sm:px-14 sm:py-16">

            <div className="pointer-events-none absolute -right-20 -top-32 h-80 w-80 rounded-full bg-red-500/20 blur-[90px]" />

            <div className="relative grid items-center gap-10 md:grid-cols-[1.2fr_0.8fr]">

              <div>

                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-bold text-gray-300">
                  <Video size={16} className="text-red-500" />
                  MADE FOR VIDEO CREATORS
                </div>

                <h2 className="text-3xl font-black leading-tight sm:text-4xl">
                  Create smaller clips.
                  <br />
                  <span className="text-blue-400">
                    Share your content.
                  </span>
                </h2>

                <p className="mt-5 max-w-xl text-sm leading-7 text-gray-400">
                  Turn long videos into manageable clips for your content workflow.
                  Connect your YouTube account, select a generated clip, add its
                  title and description, and upload it directly to your YouTube channel.
                </p>

                <a
                  href="#workspace"
                  className="mt-8 inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-sm font-bold text-gray-900 transition hover:bg-blue-50"
                >
                  Start creating clips
                  <ArrowRight size={17} />
                </a>

              </div>

              <div className="flex justify-center">

                <div className="relative flex h-52 w-52 items-center justify-center rounded-full border border-white/10 bg-white/5">

                  <div className="absolute inset-5 rounded-full border border-white/10" />

                  <div className="flex h-24 w-24 items-center justify-center rounded-3xl bg-red-600 shadow-2xl shadow-red-900/40">
                    <Video size={52} />
                  </div>

                  <div className="absolute -right-2 top-8 rounded-xl bg-white p-3 text-blue-600 shadow-lg">
                    <Scissors size={22} />
                  </div>

                  <div className="absolute -bottom-2 left-2 rounded-xl bg-white p-3 text-green-600 shadow-lg">
                    <Video size={22} />
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* FAQ */}
      <section
        id="faq"
        className="border-t border-gray-100 bg-white px-5 py-20 sm:py-24"
      >

        <div className="mx-auto max-w-3xl">

          <div className="mb-12 text-center">

            <span className="text-xs font-black uppercase tracking-[3px] text-blue-600">
              FAQ
            </span>

            <h2 className="mt-4 text-3xl font-black tracking-tight sm:text-4xl">
              Frequently asked questions
            </h2>

            <p className="mt-4 text-sm leading-7 text-gray-500">
              Everything you need to know about splitting videos online.
            </p>

          </div>

          <div className="space-y-3">

            {faqs.map((faq, index) => (

              <div
                key={faq.question}
                className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-blue-200"
              >

                <button
                  type="button"
                  onClick={() =>
                    setOpenFaq(openFaq === index ? null : index)
                  }
                  aria-expanded={openFaq === index}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left"
                >

                  <span className="text-sm font-bold text-gray-800">
                    {faq.question}
                  </span>

                  <ChevronDown
                    size={19}
                    className={`shrink-0 text-gray-400 transition-transform ${openFaq === index ? "rotate-180" : ""
                      }`}
                  />

                </button>

                {openFaq === index && (
                  <div className="border-t border-gray-100 px-5 py-5 text-sm leading-7 text-gray-500">
                    {faq.answer}
                  </div>
                )}

              </div>

            ))}

          </div>

        </div>

      </section>

      {/* FINAL CTA */}
      <section className="bg-[#f8faff] px-5 py-20 text-center">

        <div className="mx-auto max-w-2xl">

          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
            <Scissors size={27} />
          </div>

          <h2 className="mt-6 text-3xl font-black tracking-tight sm:text-4xl">
            Ready to split your video?
          </h2>

          <p className="mt-4 text-sm leading-7 text-gray-500">
            Start splitting your videos online. Free, simple and
            without unnecessary complications.
          </p>

          <a
            href="#workspace"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-blue-600 px-8 py-4 text-sm font-bold text-white shadow-lg shadow-blue-200 transition hover:-translate-y-1 hover:bg-blue-700"
          >
            <Scissors size={18} />
            Split My Video
            <ArrowRight size={17} />
          </a>

        </div>

      </section>

      {/* FOOTER */}
      <footer className="bg-[#0b1120] px-5 py-12 text-white">

        <div className="mx-auto max-w-6xl">

          <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">

            <div className="lg:col-span-2">

              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600">
                  <Scissors size={21} />
                </div>

                <span className="text-xl font-black">
                  SplitMyVideo
                </span>
              </div>

              <p className="mt-5 max-w-sm text-sm leading-7 text-gray-400">
                A free online video splitter to divide long videos
                into smaller clips. Simple video processing,
                convenient downloads and privacy-focused design.
              </p>

            </div>

            <div>
              <h3 className="mb-5 text-sm font-bold">
                Explore
              </h3>

              <div className="flex flex-col gap-4 text-sm text-gray-400">
                <a href="#top" className="transition hover:text-white">Home</a>
                <a href="#workspace" className="transition hover:text-white">Video Splitter</a>
                <a href="#features" className="transition hover:text-white">Features</a>
                <a href="#how-it-works" className="transition hover:text-white">How it works</a>
                <a href="#faq" className="transition hover:text-white">FAQ</a>
              </div>

            </div>

            <div>
              <h3 className="mb-5 text-sm font-bold">
                About
              </h3>

              <div className="flex flex-col gap-4 text-sm text-gray-400">
                <a
                  href="/privacy"
                  className="transition hover:text-white"
                >
                  Privacy Policy
                </a>
                <span>Free Online Tool</span>
                <span>Privacy-focused processing</span>
                <span>No Watermark</span>
                <span>Built for Creators</span>
              </div>

            </div>

          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-7 text-center sm:flex-row sm:text-left">

            <p className="text-xs text-gray-500">
              © 2026 SplitMyVideo. All rights reserved.
            </p>

            <p className="text-xs text-gray-500">
              Built with care by <a href="https://acustardtechnologies.com" target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:text-blue-700">
                Acustard Technologies
              </a>
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}

function TrustItem({
  icon,
  title,
}: {
  icon: React.ReactNode;
  title: string;
}) {
  return (
    <div className="flex items-center justify-center gap-3 text-gray-600">
      <div className="text-blue-600">
        {icon}
      </div>

      <span className="text-xs font-bold sm:text-sm">
        {title}
      </span>
    </div>
  );
}

function StepCard({
  number,
  icon,
  title,
  description,
}: {
  number: string;
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-3xl border border-gray-200 bg-white p-8 transition duration-300 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl">

      <div className="flex items-center justify-between">

        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
          {icon}
        </div>

        <span className="text-3xl font-black text-gray-100">
          {number}
        </span>

      </div>

      <h3 className="mt-7 text-lg font-extrabold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {description}
      </p>

    </div>
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

      <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
        {icon}
      </div>

      <h3 className="mt-7 text-lg font-extrabold">
        {title}
      </h3>

      <p className="mt-3 text-sm leading-7 text-gray-500">
        {description}
      </p>

    </div>
  );
}
