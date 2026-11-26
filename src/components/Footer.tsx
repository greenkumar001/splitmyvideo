import { Scissors } from "lucide-react";

export default function Footer() {
  return (
    <section className="bg-[#0b1120] px-5 py-12 text-white">

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

    </section>
  )
}