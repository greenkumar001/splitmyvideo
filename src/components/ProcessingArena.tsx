"use client";
import {
  Activity,
  CheckCircle2,
  Circle,
  Clapperboard,
  Loader2,
  Sparkles,
} from "lucide-react";

type ProcessingArenaProps = {
  progress: number;
  status: string;
  isProcessing: boolean;
};

const stages = [
  "Loading video",
  "Initializing engine",
  "Splitting video",
  "Saving clips",
  "Completed",
];

export default function ProcessingArena({
  progress,
  status,
  isProcessing,
}: ProcessingArenaProps) {
  const currentProgress = Math.min(
    100,
    Math.max(0, progress)
  );
  const normalizedStatus = status.toLowerCase();

  const activeStageIndex =
    normalizedStatus.includes("all clips saved")
      ? 4
      : normalizedStatus.includes("saving clip")
        ? 3
        : normalizedStatus.includes("creating clip")
          ? 2
          : normalizedStatus.includes("loading video engine") ||
            normalizedStatus.includes("preparing browser storage") ||
            normalizedStatus.includes("original video mounted")
            ? 1
            : 0;

  return (
    <main className="fixed inset-0 z-[100] flex min-h-screen flex-col overflow-y-auto bg-[#080B12] text-white">
      <header className="flex items-center justify-between border-b border-white/10 px-6 py-5">
        <div className="flex items-center gap-3">
          <Clapperboard className="h-6 w-6 text-blue-400" />
          <span className="text-lg font-semibold tracking-tight">
            SplitMyVideo
          </span>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-blue-400/20 bg-blue-400/10 px-4 py-2 text-xs text-blue-300">
          <Activity className="h-4 w-4" />
          PROCESSING ARENA
        </div>
      </header>

      <section className="mx-auto flex w-full max-w-5xl flex-1 flex-col justify-center px-6 py-12">
        <div className="mb-12 text-center">
          <div className="mx-auto mb-6 flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl border border-blue-400/20 bg-blue-400/10 shadow-[0_0_60px_rgba(59,130,246,0.12)]">
            <Sparkles className="h-9 w-9 text-blue-400" />
          </div>

          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-blue-400">
            Video processing system
          </p>

          <h1 className="text-3xl font-semibold tracking-tight sm:text-5xl">
            Your video is being transformed.
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-sm leading-6 text-slate-400">
            Sit back while SplitMyVideo processes your video
            and prepares your clips.
          </p>
        </div>

        <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6 shadow-2xl sm:p-10">
          <div className="mb-5 flex items-center justify-between">
            <span className="text-sm text-slate-400">
              Overall progress
            </span>

            <span className="text-2xl font-semibold tabular-nums">
              {Math.round(currentProgress)}%
            </span>
          </div>

          <div className="h-2 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-[width] duration-300"
              style={{ width: `${currentProgress}%` }}
            />
          </div>

          <div className="mt-8 rounded-2xl border border-blue-400/10 bg-blue-400/[0.05] p-5">
            <div className="flex items-center gap-3">
              {isProcessing ? (
                <Loader2 className="h-5 w-5 animate-spin text-blue-400" />
              ) : (
                <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              )}

              <div>
                <p className="text-xs text-slate-500">
                  CURRENT ACTIVITY
                </p>
                <p className="mt-1 text-sm font-medium">
                  {status || "Preparing video processing..."}
                </p>
              </div>
            </div>
          </div>

          <div className="mt-9">
            <p className="mb-5 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Processing stages
            </p>

            <div className="grid gap-4 sm:grid-cols-5">
              {stages.map((stage, index) => {
                const completed = index < activeStageIndex;
                const active = index === activeStageIndex;

                return (
                  <div key={stage} className="flex items-center gap-3 sm:flex-col sm:items-start">
                    {completed ? (
                      <CheckCircle2 className="h-5 w-5 shrink-0 text-emerald-400" />
                    ) : active ? (
                      <Loader2 className="h-5 w-5 shrink-0 animate-spin text-blue-400" />
                    ) : (
                      <Circle className="h-5 w-5 shrink-0 text-slate-600" />
                    )}

                    <span
                      className={`text-xs ${active
                        ? "font-semibold text-blue-300"
                        : completed
                          ? "text-emerald-400"
                          : "text-slate-500"
                        }`}
                    >
                      {stage}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-xs text-slate-500">
          Keep this tab open while your video is processing.
        </p>
      </section>

      <footer className="border-t border-white/10 px-6 py-5 text-center text-xs text-slate-600">
        SPLITMYVIDEO · LOCAL VIDEO PROCESSING
      </footer>
    </main>
  );
}
