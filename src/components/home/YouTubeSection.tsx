import { ArrowRight, Scissors, Video } from "lucide-react";

export default function YouTubeSection() {
  return (
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

  )
}