import { ArrowRight, Scissors } from "lucide-react";

export default function FinalCTA() {
  return (
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
  )
}