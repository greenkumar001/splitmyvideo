import { ShieldCheck, Zap, Layers3, Download } from "lucide-react";
import TrustItem from "../ui/TrustItem";
export default function TrustStrip() {
  return (
    <section className="border-y border-gray-100 bg-white px-5 py-7">
      <div className="mx-auto grid max-w-5xl grid-cols-2 gap-6 sm:grid-cols-4">

        <TrustItem icon={<ShieldCheck />} title="Privacy First" />
        <TrustItem icon={<Zap />} title="Fast Processing" />
        <TrustItem icon={<Layers3 />} title="Multiple Clips" />
        <TrustItem icon={<Download />} title="Easy Downloads" />

      </div>
    </section>
  )
}