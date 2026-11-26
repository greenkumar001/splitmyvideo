import { Download, MonitorPlay, Scissors, ShieldCheck, Smartphone, Zap } from "lucide-react";

export default function FeaturesSection() {
  return (
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
  )
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