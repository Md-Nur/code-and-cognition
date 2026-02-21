"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-[90vh] flex items-center pt-32 pb-20 overflow-hidden bg-agency-black">
            {/* Background Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-agency-accent/5 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/5 rounded-full blur-[100px]" />
            </div>

            <div className="section-container relative z-10 text-center lg:text-left flex flex-col lg:flex-row items-center gap-16">
                <div className="flex-1 max-w-3xl">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold uppercase tracking-[0.2em] text-agency-accent mb-8 animate-fade-in">
                        <span className="h-1.5 w-1.5 rounded-full bg-agency-accent animate-pulse" />
                        AI-Driven Digital Excellence
                    </div>

                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight text-white leading-[1.05] mb-8 animate-slide-up">
                        Structured Digital Execution for <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-white/40">Growth-Focused</span> Companies
                    </h1>

                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mb-12 animate-slide-up animation-delay-200">
                        We architect platform, automation, and performance systems that transform enterprise complexity into measurable growth and sustainable competitive advantage.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center gap-6 animate-slide-up animation-delay-300">
                        <Link
                            href="#consultation"
                            className="btn-brand px-10 py-5 rounded-full text-base font-bold shadow-2xl shadow-agency-accent/20 group w-full sm:w-auto"
                        >
                            <span className="flex items-center justify-center gap-3">
                                Schedule Strategic Consultation
                                <MoveRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </span>
                        </Link>
                        <Link
                            href="/portfolio"
                            className="px-10 py-5 rounded-full text-base font-bold text-white/70 hover:text-white border border-white/10 hover:border-white/30 hover:bg-white/5 transition-all w-full sm:w-auto"
                        >
                            Explore Our Work
                        </Link>
                    </div>
                </div>

                <div className="flex-1 relative w-full aspect-square max-w-[600px] animate-fade-in animation-delay-500">
                    <div className="absolute inset-0 bg-gradient-to-br from-agency-accent/20 to-transparent rounded-[60px] blur-3xl opacity-20" />
                    <div className="relative w-full h-full rounded-[60px] border border-white/10 bg-white/[0.02] backdrop-blur-sm overflow-hidden p-8 flex items-center justify-center">
                        {/* Abstract Visual Representing AI/Tech */}
                        <div className="relative w-full h-full">
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-32 h-32 bg-agency-accent rounded-full opacity-20 blur-2xl animate-pulse" />
                            <div className="grid grid-cols-5 gap-4 h-full opacity-20">
                                {[...Array(25)].map((_, i) => (
                                    <div key={i} className="border border-white/10 rounded-lg flex items-center justify-center">
                                        <div className="w-1 h-1 bg-white/20 rounded-full" />
                                    </div>
                                ))}
                            </div>
                            {/* Simulated Data Lines */}
                            <div className="absolute inset-0 overflow-hidden">
                                <div className="absolute top-[20%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-agency-accent/30 to-transparent -translate-x-full animate-flow-horizontal" />
                                <div className="absolute top-[50%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-agency-accent/50 to-transparent -translate-x-full animate-flow-horizontal animation-delay-1000" />
                                <div className="absolute top-[80%] left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-agency-accent/20 to-transparent -translate-x-full animate-flow-horizontal animation-delay-2000" />
                            </div>
                        </div>
                        <div className="absolute bottom-10 left-10 p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                            <div className="text-xs text-agency-accent font-bold uppercase tracking-widest mb-1">Efficiency Gain</div>
                            <div className="text-3xl font-bold text-white">+142%</div>
                        </div>
                        <div className="absolute top-10 right-10 p-6 rounded-2xl bg-black/40 border border-white/10 backdrop-blur-md">
                            <div className="text-xs text-agency-accent font-bold uppercase tracking-widest mb-1">Revenue Growth</div>
                            <div className="text-3xl font-bold text-white">3.4x</div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
