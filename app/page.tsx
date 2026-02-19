import type { Metadata } from "next";
import Navbar from "./components/public/Navbar";
import Hero from "./components/public/Hero";
import ServicesGrid from "./components/public/ServicesGrid";
import BookingForm from "./components/public/BookingForm";
import Footer from "./components/public/Footer";

export const metadata: Metadata = {
  title: "Home | Code & Cognition — Digital Product Studio",
  description: "We build digital products that think. Web development, UI/UX design, video production, and growth marketing for ambitious brands.",
};

export const dynamic = 'force-dynamic';

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export default async function Home() {
  const session = await auth();
  const services = await prisma.service.findMany({
    where: { status: "ACTIVE" },
    include: {
      subCategories: {
        select: {
          id: true,
          title: true,
          description: true,
          imageUrl: true,
          basePriceBDT: true,
          basePriceUSD: true,
          mediumPriceBDT: true,
          mediumPriceUSD: true,
          proPriceBDT: true,
          proPriceUSD: true,
        }
      },
      portfolioItems: {
        select: {
          id: true,
          title: true,
          imageUrl: true,
        },
        take: 3,
      }
    },
    orderBy: { createdAt: "asc" },
  }) as any;

  return (
    <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white">
      <Navbar user={session?.user} />
      <Hero />
      <ServicesGrid initialServices={services} />

      {/* Process Section */}
      <section id="process" className="section-container py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <span className="section-tag mb-4">Our Methodology</span>
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Our Working Process</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">We follow a proven approach to ensure your project's success, from initial idea to final launch and beyond.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Discover & Strategize", desc: "We learn about your business goals and what your customers need to create a clear plan for your project." },
            { step: "02", title: "Design & Build", desc: "We create high-quality, easy-to-use products that look great and work perfectly across all devices." },
            { step: "03", title: "Launch & Support", desc: "We help you launch and stay by your side to ensure everything runs smoothly as your business grows." }
          ].map((item) => (
            <div key={item.step} className="glass-panel p-8 rounded-2xl relative group hover:border-agency-accent/50 transition-colors">
              <div className="text-6xl font-display font-bold text-white/5 mb-6 group-hover:text-agency-accent/10 transition-colors">{item.step}</div>
              <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
              <p className="text-gray-400">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <BookingForm />
      <Footer />
    </main>
  );
}
