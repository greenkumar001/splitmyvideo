import { Upload, Scissors, Download } from "lucide-react"
export default function HowItWorks() {
  return (
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
  )
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