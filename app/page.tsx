import type { Metadata } from "next";
import Navbar from "./components/public/Navbar";
import HeroSection from "./components/public/HeroSection";
import CorePillars from "./components/public/CorePillars";
import HowWeWork from "./components/public/HowWeWork";
import CaseStudies from "./components/public/CaseStudies";
import Testimonials from "./components/public/Testimonials";
import KnowledgeSection from "./components/public/KnowledgeSection";
import Footer from "./components/public/Footer";
import BookingForm from "./components/public/BookingForm";
import Clients from "./components/public/Clients";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Premium AI Digital Agency | Code & Cognition",
  description: "Structured digital execution for growth-focused companies. We architect platform, automation, and performance systems that drive measurable business results.",
};

export const dynamic = 'force-dynamic';

export default async function LandingPage() {
  const session = await auth();

  // Fetch Clients for the marquee
  const clients = await prisma.client.findMany({
    orderBy: { order: "asc" },
  });

  return (
    <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white relative">
      <Navbar user={session?.user} />

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
          <BookingForm />
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </main>
  );
}
