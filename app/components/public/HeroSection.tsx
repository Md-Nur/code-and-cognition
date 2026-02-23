"use client";

import Link from "next/link";
import { MoveRight } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-black">
            {/* Architectural Ambience */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[70%] h-[70%] bg-agency-accent/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-white/[0.02] rounded-full blur-[120px]" />
            </div>

            <div className="section-container relative z-10">
                <div className="flex flex-col lg:flex-row items-center gap-20">
                    <div className="flex-1 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 sm:gap-3 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/[0.03] border border-white/[0.08] text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.2em] sm:tracking-[0.4em] text-agency-accent mb-6 sm:mb-10 animate-fade-in text-center">
                            <span className="h-1 w-1 shrink-0 rounded-full bg-agency-accent shadow-[0_0_8px_#3b82f6]" />
                            <span className="truncate whitespace-normal leading-tight">Strategic Intelligence & Execution</span>
                        </div>

                        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold strategic-heading text-white mb-6 sm:mb-8 animate-slide-up leading-tight">
                            Architecting the <br className="hidden sm:block" />
                            <span className="text-gradient">Future of Execution</span>
                        </h1>

                        <p className="text-gray-400 text-base sm:text-lg md:text-xl leading-relaxed max-w-2xl px-2 sm:px-0 mb-10 sm:mb-14 animate-slide-up animation-delay-200 mx-auto lg:mx-0">
                            We build high-performance digital ecosystems for growth-focused enterprises, transforming technical complexity into sustainable competitive advantage.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 sm:gap-6 animate-slide-up animation-delay-300 w-full px-4 sm:px-0">
                            <Link href="/schedule" className="btn-brand group w-full sm:w-auto">
                                <span className="flex items-center justify-center gap-3">
                                    Start Strategic Consultation
                                    <MoveRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                </span>
                            </Link>
                            <Link href="/portfolio" className="btn-outline w-full sm:w-auto">
                                View Engagements
                            </Link>
                        </div>
                    </div>

                    <div className="flex-1 relative w-full aspect-square max-w-[550px] animate-fade-in animation-delay-500 mt-10 lg:mt-0 px-4 sm:px-0">
                        {/* High-End Architectural Visual */}
                        <div className="relative w-full h-full premium-card overflow-hidden flex items-center justify-center group rounded-3xl">
                            <div className="absolute inset-0 bg-linear-to-br from-agency-accent/10 via-transparent to-white/[0.02]" />

                            {/* Neural/Geometric Mesh (Simplified but Powerful) */}
                            <div className="relative w-48 h-48 sm:w-64 sm:h-64">
                                <div className="absolute inset-0 border-[0.5px] border-white/20 rounded-full animate-[spin_20s_linear_infinite]" />
                                <div className="absolute inset-4 border-[0.5px] border-white/10 rounded-full animate-[spin_15s_linear_infinite_reverse]" />
                                <div className="absolute inset-8 border-[0.5px] border-agency-accent/30 rounded-full animate-[spin_10s_linear_infinite]" />

                                {/* Core Glow */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 sm:w-12 sm:h-12 bg-agency-accent rounded-full blur-2xl opacity-40 group-hover:opacity-60 transition-opacity" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-white rounded-full shadow-[0_0_15px_#3b82f6]" />
                            </div>

                            {/* Floating Metadata Indicators */}
                            <div className="absolute top-8 left-4 sm:top-12 sm:left-12 glass-panel px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl animate-float">
                                <div className="text-[6px] sm:text-[8px] text-agency-accent font-black uppercase tracking-widest opacity-60">System Entropy</div>
                                <div className="text-xs sm:text-sm font-bold text-white tracking-tight">0.042%</div>
                            </div>

                            <div className="absolute bottom-10 right-4 sm:bottom-16 sm:right-12 glass-panel px-3 py-1.5 sm:px-4 sm:py-2 rounded-xl animate-float animation-delay-500">
                                <div className="text-[6px] sm:text-[8px] text-agency-accent font-black uppercase tracking-widest opacity-60">Yield Velocity</div>
                                <div className="text-xs sm:text-sm font-bold text-white tracking-tight">3.4x / YoY</div>
                            </div>
                        </div>

                        {/* External Accents */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-agency-accent/10 rounded-full blur-3xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}

