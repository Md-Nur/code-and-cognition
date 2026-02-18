import Navbar from "./components/public/Navbar";
import Hero from "./components/public/Hero";
import ServicesGrid from "./components/public/ServicesGrid";
import BookingForm from "./components/public/BookingForm";
import Footer from "./components/public/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white">
      <Navbar />
      <Hero />
      <ServicesGrid />

      {/* Process Section */}
      <section id="process" className="section-container py-20 border-t border-white/5">
        <div className="text-center mb-16">
          <span className="section-tag mb-4">How We Work</span>
          <h2 className="text-4xl font-bold tracking-tight">The Cognitive Process</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: "01", title: "Discovery", desc: "We analyze your goals and user needs to chart the perfect course." },
            { step: "02", title: "Creation", desc: "Design and development with focus on aesthetics and performance." },
            { step: "03", title: "Launch", desc: "Rigorous testing and deployment to ensure a flawless liftoff." }
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
