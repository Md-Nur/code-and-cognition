"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export default function Hero() {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
            {/* Background Elements */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-agency-accent/20 rounded-full blur-[120px] opacity-30 animate-pulse-glow" />
                <div className="absolute bottom-0 right-0 w-[800px] h-[600px] bg-purple-500/10 rounded-full blur-[100px] opacity-20" />
            </div>

            <div className="section-container relative z-10 w-full">
                <div className="max-w-4xl mx-auto text-center">
                    <div className={`transition-all duration-700 transform ${mounted ? "translate-y-0 opacity-100" : "translate-y-10 opacity-0"}`}>
                        <span className="section-tag mb-6">Digital Agency</span>

                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8 leading-[1.1]">
                            We build digital products <br className="hidden md:block" />
                            that <span className="text-gradient">think</span>.
                        </h1>

                        <p className="text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Code & Cognition is a full-service digital agency specializing in high-performance web development, intelligent UI/UX design, and data-driven growth strategies.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link href="#contact" className="btn-brand text-lg px-8 py-4 w-full sm:w-auto">
                                Start a Project
                            </Link>
                            <Link href="#work" className="btn-outline text-lg px-8 py-4 w-full sm:w-auto">
                                View Our Work
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M7 13l5 5 5-5M7 6l5 5 5-5" />
                </svg>
            </div>
        </section>
    );
}
