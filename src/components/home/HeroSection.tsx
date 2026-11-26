import { ArrowRight, CheckCircle2, Globe2, Play, Scissors, ShieldCheck, Sparkles } from "lucide-react";

export default function HeroSection() {
  return (
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
  )
}