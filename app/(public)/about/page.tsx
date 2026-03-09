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
                            We Build Better <br /> Digital Solutions.
                        </h1>
                        <p className="text-gray-400 text-xl md:text-2xl leading-relaxed max-w-3xl">
                            Code &amp; Cognition provides AI, marketing, video editing, and web development with a focus on quality and smart planning. We build digital products that bridge the gap between human intuition and machine precision.
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
                                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Smart Tech Planning</h2>
                                <p className="text-gray-400 text-lg leading-relaxed">
                                    We don't just build features; we build systems. Every line of code and every design is based on your business goals. We focus on high-quality work where precision is most important.
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

                        <div className="relative aspect-square rounded-[60px] overflow-hidden border border-white/10 bg-agency-black">
                            {/* Ambient glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-agency-accent/20 via-transparent to-purple-900/10" />

                            {/* Content */}
                            <div className="relative z-10 w-full h-full flex flex-col justify-between p-10">
                                {/* Header */}
                                <div>
                                    <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] block mb-3">Our Standard</span>
                                    <h3 className="text-white text-3xl font-bold leading-tight">Built on <br />Uncompromising<br />Excellence</h3>
                                </div>

                                {/* Principles */}
                                <div className="space-y-4">
                                    {[
                                        { icon: "⬡", label: "Precision Engineering", desc: "Every system built to last" },
                                        { icon: "◈", label: "Relentless Velocity", desc: "Speed without sacrificing craft" },
                                        { icon: "◉", label: "Radical Integrity", desc: "Transparent in every decision" },
                                    ].map((item) => (
                                        <div key={item.label} className="flex items-center gap-4 p-4 rounded-2xl bg-white/5 border border-white/5 backdrop-blur-sm">
                                            <span className="text-agency-accent text-2xl leading-none w-8 flex-shrink-0 text-center">{item.icon}</span>
                                            <div>
                                                <p className="text-white text-sm font-semibold">{item.label}</p>
                                                <p className="text-gray-500 text-xs">{item.desc}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Stat */}
                                <div className="flex items-end gap-3 pt-2 border-t border-white/5">
                                    <span className="text-5xl font-bold text-white leading-none">5.0</span>
                                    <div>
                                        <div className="flex gap-0.5 mb-1">
                                            {[...Array(5)].map((_, i) => (
                                                <svg key={i} className="w-3.5 h-3.5 text-agency-accent fill-current" viewBox="0 0 20 20"><path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z" /></svg>
                                            ))}
                                        </div>
                                        <p className="text-gray-500 text-xs">Average client satisfaction</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Methodology Section */}
            <section className="py-24 bg-white/[0.01] border-t border-white/5">
                <div className="section-container text-center">
                    <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                        How We Work
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-20">
                        How We Architect Success
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { step: "01", title: "Plan & Think", desc: "We look at your business challenges to find the best technical and strategic path." },
                            { step: "02", title: "Design the System", desc: "A careful design phase where we plan the architecture and user experience." },
                            { step: "03", title: "Execute it Right", desc: "Expert building with a focus on clean code and fast, reliable software." }
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
