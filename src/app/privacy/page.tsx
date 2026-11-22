
import type { Metadata } from "next";
import PrivacyContent from "@/components/privacy/PrivacyContent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Read the SplitMyVideo Privacy Policy to understand browser-based video processing, YouTube integration, Google authorization, and data handling.",
  alternates: {
    canonical: "/privacy",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function PrivacyPage() {
  return <PrivacyContent />;
}
