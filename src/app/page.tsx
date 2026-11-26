"use client";
import Header from "@/components/Header";
import HeroSection from "@/components/home/HeroSection";
import TrustStrip from "@/components/home/TrustStrip";
import WorkspaceSection from "@/components/home/WorkspaceSection";
import HowItWorks from "@/components/home/HowItWorks";
import FeaturesSection from "@/components/home/FeaturesSection";
import YouTubeSection from "@/components/home/YouTubeSection";
import FAQSection from "@/components/home/FAQSection";
import FinalCTA from "@/components/home/FinalCTA";
import Footer from "@/components/Footer";
export default function Home() {
  return (
    <main
      id="top"
      className="min-h-screen overflow-hidden bg-[#f8faff] text-[#101828]"
    >
      <Header />
      {/* HERO SECTION */}
      <HeroSection />
      {/* TRUST STRIP */}
      <TrustStrip />
      {/* WORKSPACE */}
      <WorkspaceSection />
      {/* HOW IT WORKS */}
      <HowItWorks />
      {/* FEATURES */}
      <FeaturesSection />
      {/* YOUTUBE SECTION */}
      <YouTubeSection />
      {/* FAQ */}
      <FAQSection />
      {/* FINAL CTA */}
      <FinalCTA />
      {/* FOOTER */}
      <Footer />

    </main>
  );
}