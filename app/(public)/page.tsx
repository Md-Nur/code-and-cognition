import type { Metadata } from "next";
import HeroSection from "@/app/components/public/HeroSection";
import CorePillars from "@/app/components/public/CorePillars";
import HowWeWork from "@/app/components/public/HowWeWork";
import CaseStudies from "@/app/components/public/CaseStudies";
import Testimonials from "@/app/components/public/Testimonials";
import KnowledgeSection from "@/app/components/public/KnowledgeSection";
import Clients from "@/app/components/public/Clients";
import Link from "next/link";

import { prisma } from "@/lib/prisma";

export const metadata: Metadata = {
  title: "Premium AI Digital Agency | Code & Cognition",
  description: "Structured digital execution for growth-focused companies. We architect platform, automation, and performance systems that drive measurable business results.",
};

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  // Fetch Clients for the marquee
  const clients = await prisma.client.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main>
      {/* Hero Section */}
      <HeroSection />

      {/* Social Proof Bar */}
      <Clients clients={clients} />

      {/* Core Capabilities */}
      <CorePillars />

      {/* Process Methodology */}
      <HowWeWork />

      {/* Featured Engagements */}
      <CaseStudies />

      {/* Global Recognition / Social Proof */}
      <Testimonials />

      {/* Strategic Intelligence */}
      <KnowledgeSection />

      {/* Final Conversion Point */}
      <section id="consultation" className="py-24 border-t border-white/5 relative bg-agency-black overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-[-10%] left-[-10%] w-[40%] h-[40%] bg-agency-accent/5 rounded-full blur-[120px]" />
        </div>
        <div className="section-container relative z-10">
          <div className="mb-20 text-center">
            <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
              Contact
            </span>
            <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Schedule Strategic Consultation
            </h2>
            <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
              Share your growth objectives and receive a tailored roadmap aligned to measurable execution outcomes.
            </p>
          </div>
          <div className="flex justify-center mt-12 pb-12">
            <Link
              href="/schedule"
              className="btn-brand px-12 py-5 rounded-full text-lg font-bold shadow-2xl shadow-agency-accent/20 flex items-center gap-3 hover:-translate-y-1 transition-transform"
            >
              Start Your Application
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
