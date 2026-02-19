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

export default async function Home() {
  const services = await prisma.service.findMany({
    where: { status: "ACTIVE" },
    include: {
      subCategories: {
        select: {
          id: true,
          title: true,
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
      <Navbar />
      <Hero />
      <ServicesGrid initialServices={services} />

      {/* Process Section */}
      <section id="process" className="section-container py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <span className="section-tag mb-4">Our Methodology</span>
          <h2 className="text-4xl font-bold tracking-tight">The Partnership Process</h2>
          <p className="text-gray-400 mt-4 max-w-2xl mx-auto">We don't just build features; we build solutions that drive measurable growth and long-term value for your business.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Strategic Discovery", desc: "We dive deep into your business objectives and user needs to create a roadmap for success." },
            { step: "02", title: "Precision Creation", desc: "Our team iterates with focus on visual excellence, user engagement, and technical scalability." },
            { step: "03", title: "Seamless Delivery", desc: "Beyond launch, we ensure your product is optimized for performance and ready to scale." }
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
