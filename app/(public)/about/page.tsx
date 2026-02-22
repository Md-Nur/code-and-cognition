import Link from "next/link";
import { MoveRight, Shield, Zap, Target } from "lucide-react";

export default function AboutPage() {
    return (
        <main className="bg-agency-black min-h-screen pb-32 selection:bg-agency-accent selection:text-white">
            {/* Hero Section */}
            <section className="pt-48 pb-32 relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-agency-accent/5 rounded-full blur-[120px] opacity-30" />
                <div className="section-container relative z-10">
                    <div className="max-w-4xl">
                        <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                            Our Narrative
                        </span>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-12 leading-[1.05]">
                            Architecting <br /> the Invisible.
                        </h1>
                        <p className="text-gray-400 text-xl md:text-2xl leading-relaxed max-w-3xl">
                            Code & Cognition is a premium digital product studio dedicated to technical excellence and strategic execution. We believe that the best digital products are those that think—bridging the gap between human intuition and machine precision.
                        </p>
                    </div>
                </div>
            </section>

            {/* Philosophy Section */}
            <section className="py-24 border-t border-white/5">
                <div className="section-container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="space-y-12">
                            <div>
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Technical Strategy as a Service</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    We don't just build features; we architect systems. Every line of code we write and every interface we design is rooted in a deep understanding of your business objectives. We specialize in high-ticket digital operations where the cost of failure is high and the need for precision is paramount.
                                </p>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                                    <Target className="w-8 h-8 text-agency-accent mb-6" />
                                    <h3 className="text-white font-bold mb-3">Outcome Focused</h3>
                                    <p className="text-gray-500 text-sm">Every engagement is defined by measurable business results, not just technical milestones.</p>
                                </div>
                                <div className="p-8 rounded-3xl bg-white/5 border border-white/5">
                                    <Shield className="w-8 h-8 text-agency-accent mb-6" />
                                    <h3 className="text-white font-bold mb-3">Enterprise Ready</h3>
                                    <p className="text-gray-500 text-sm">Architecture designed for scalability, security, and long-term maintainability.</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative aspect-square rounded-[60px] overflow-hidden border border-white/10">
                            <div className="absolute inset-0 bg-gradient-to-br from-agency-accent/20 to-transparent z-10" />
                            <div className="w-full h-full bg-agency-black flex items-center justify-center p-20">
                                <span className="text-white/5 font-bold uppercase tracking-[2em] text-4xl -rotate-45 whitespace-nowrap">Excellence</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section className="py-24 bg-white/[0.01] border-t border-white/5">
                <div className="section-container text-center">
                    <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                        The Cognition Framework
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-20">
                        How We Architect Success
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Discovery & Logic", desc: "We deconstruct your business challenges to identify the core technical requirements and strategic opportunities." },
                            { step: "02", title: "Architectural Planning", desc: "A rigorous design phase where we define the system architecture, data models, and user journeys." },
                            { step: "03", title: "Precision Execution", desc: "Founder-led implementation focusing on clean code, performant interfaces, and scalable infrastructure." }
                        ].map((item) => (
                            <div key={item.step} className="p-12 rounded-[40px] border border-white/5 bg-agency-black relative group text-left">
                                <span className="text-5xl font-bold text-white/2 mb-8 block group-hover:text-agency-accent/10 transition-colors">{item.step}</span>
                                <h3 className="text-2xl font-bold text-white mb-6 underline decoration-agency-accent decoration-2 underline-offset-8">{item.title}</h3>
                                <p className="text-gray-400 leading-relaxed">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-32 border-t border-white/5 relative overflow-hidden">
                <div className="section-container relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-12">Let's Build Something Meaningful</h2>
                    <Link href="/contact" className="btn-brand inline-flex items-center gap-3 px-10 py-5 rounded-2xl text-lg">
                        Start Your Engagement <MoveRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </main>
    );
}
