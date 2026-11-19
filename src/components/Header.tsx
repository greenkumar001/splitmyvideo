
import Link from "next/link";
import { Scissors, ShieldCheck } from "lucide-react";

export default function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <div className="rounded-xl bg-blue-600 p-2 text-white">
            <Scissors size={22} />
          </div>
          <span className="text-xl font-bold tracking-tight text-gray-900">
            SplitMy<span className="text-blue-600">Video</span>
          </span>
        </Link>

        <nav className="hidden items-center gap-7 text-sm font-medium text-gray-600 md:flex">
          <a href="#how-it-works" className="hover:text-blue-600">
            How it works
          </a>
          <a href="#features" className="hover:text-blue-600">
            Features
          </a>
          {/* <a
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="flex items-center gap-2 hover:text-blue-600"
          >
            <Github size={17} />
            Open Source
          </a> */}
        </nav>

        <div className="hidden items-center gap-2 rounded-full bg-green-50 px-3 py-2 text-xs font-semibold text-green-700 sm:flex">
          <ShieldCheck size={16} />
          Free & Private
        </div>
      </div>
    </header>
  );
}
