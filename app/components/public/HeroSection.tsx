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
                            <span className="truncate whitespace-normal leading-tight">Strategic Intelligence &amp; Execution</span>
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
                            <Link href="/case-studies" className="btn-outline w-full sm:w-auto">
                                View Engagements
                            </Link>
                        </div>
                    </div>

                    {/* ─── Hero Graphic ─────────────────────────────────────────────── */}
                    <div className="flex-1 relative w-full aspect-square max-w-[580px] animate-fade-in animation-delay-500 mt-10 lg:mt-0 px-4 sm:px-0">
                        <div className="relative w-full h-full premium-card overflow-hidden flex items-center justify-center group rounded-3xl">
                            {/* Subtle gradient overlay */}
                            <div className="absolute inset-0 bg-linear-to-br from-agency-accent/10 via-transparent to-white/[0.02]" />

                            {/* ── SVG Network Visualization ── */}
                            <svg
                                viewBox="0 0 480 480"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-[85%] h-[85%] relative z-10"
                                aria-hidden="true"
                            >
                                <defs>
                                    {/* Accent gradient */}
                                    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.6" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </radialGradient>
                                    <radialGradient id="nodeGlowA" cx="50%" cy="50%" r="50%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </radialGradient>
                                    {/* Line gradient */}
                                    <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                                        <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.5" />
                                        <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                                    </linearGradient>
                                    <linearGradient id="lineGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
                                        <stop offset="0%" stopColor="#ffffff" stopOpacity="0" />
                                        <stop offset="50%" stopColor="#ffffff" stopOpacity="0.1" />
                                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                                    </linearGradient>
                                    {/* Animated dash pattern */}
                                    <filter id="glow">
                                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                    <filter id="glowStrong">
                                        <feGaussianBlur stdDeviation="5" result="coloredBlur" />
                                        <feMerge>
                                            <feMergeNode in="coloredBlur" />
                                            <feMergeNode in="SourceGraphic" />
                                        </feMerge>
                                    </filter>
                                </defs>

                                {/* ── Outer orbit ring ── */}
                                <circle
                                    cx="240" cy="240" r="210"
                                    stroke="rgba(255,255,255,0.04)"
                                    strokeWidth="1"
                                    strokeDasharray="4 10"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 240 240"
                                        to="360 240 240"
                                        dur="60s"
                                        repeatCount="indefinite"
                                    />
                                </circle>

                                {/* ── Mid orbit ring ── */}
                                <circle
                                    cx="240" cy="240" r="160"
                                    stroke="rgba(59,130,246,0.12)"
                                    strokeWidth="1"
                                    strokeDasharray="2 14"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="360 240 240"
                                        to="0 240 240"
                                        dur="40s"
                                        repeatCount="indefinite"
                                    />
                                </circle>

                                {/* ── Inner orbit ring ── */}
                                <circle
                                    cx="240" cy="240" r="105"
                                    stroke="rgba(59,130,246,0.2)"
                                    strokeWidth="0.5"
                                    strokeDasharray="6 8"
                                >
                                    <animateTransform
                                        attributeName="transform"
                                        type="rotate"
                                        from="0 240 240"
                                        to="360 240 240"
                                        dur="25s"
                                        repeatCount="indefinite"
                                    />
                                </circle>

                                {/* ── Connection lines (spokes) ── */}
                                {/* Top-right node to center */}
                                <line x1="240" y1="240" x2="348" y2="114" stroke="url(#lineGrad)" strokeWidth="0.8">
                                    <animate attributeName="opacity" values="0.3;0.9;0.3" dur="3s" repeatCount="indefinite" />
                                </line>
                                {/* Bottom-right node to center */}
                                <line x1="240" y1="240" x2="370" y2="340" stroke="url(#lineGrad)" strokeWidth="0.8">
                                    <animate attributeName="opacity" values="0.5;1;0.5" dur="2.5s" repeatCount="indefinite" begin="0.6s" />
                                </line>
                                {/* Left node to center */}
                                <line x1="240" y1="240" x2="100" y2="290" stroke="url(#lineGrad)" strokeWidth="0.8">
                                    <animate attributeName="opacity" values="0.3;0.8;0.3" dur="4s" repeatCount="indefinite" begin="1s" />
                                </line>
                                {/* Top-left node to center */}
                                <line x1="240" y1="240" x2="130" y2="130" stroke="url(#lineGrad2)" strokeWidth="0.8">
                                    <animate attributeName="opacity" values="0.2;0.7;0.2" dur="3.5s" repeatCount="indefinite" begin="0.4s" />
                                </line>
                                {/* Bottom node to center */}
                                <line x1="240" y1="240" x2="240" y2="400" stroke="url(#lineGrad2)" strokeWidth="0.8">
                                    <animate attributeName="opacity" values="0.3;0.7;0.3" dur="2.8s" repeatCount="indefinite" begin="1.2s" />
                                </line>
                                {/* Cross connections between nodes */}
                                <line x1="130" y1="130" x2="348" y2="114" stroke="rgba(59,130,246,0.08)" strokeWidth="0.5">
                                    <animate attributeName="opacity" values="0.1;0.4;0.1" dur="5s" repeatCount="indefinite" />
                                </line>
                                <line x1="100" y1="290" x2="240" y2="400" stroke="rgba(255,255,255,0.05)" strokeWidth="0.5">
                                    <animate attributeName="opacity" values="0.1;0.3;0.1" dur="6s" repeatCount="indefinite" begin="1s" />
                                </line>
                                <line x1="370" y1="340" x2="240" y2="400" stroke="rgba(59,130,246,0.07)" strokeWidth="0.5">
                                    <animate attributeName="opacity" values="0.1;0.5;0.1" dur="4s" repeatCount="indefinite" begin="0.8s" />
                                </line>

                                {/* ── Traveling pulses on lines ── */}
                                {/* Pulse on line to top-right node */}
                                <circle r="2" fill="#3b82f6" opacity="0" filter="url(#glow)">
                                    <animateMotion
                                        dur="2.5s"
                                        repeatCount="indefinite"
                                        path="M240,240 L348,114"
                                    />
                                    <animate attributeName="opacity" values="0;1;1;0" dur="2.5s" repeatCount="indefinite" />
                                </circle>
                                {/* Pulse on line to bottom-right */}
                                <circle r="2" fill="#3b82f6" opacity="0" filter="url(#glow)">
                                    <animateMotion
                                        dur="2s"
                                        repeatCount="indefinite"
                                        begin="0.8s"
                                        path="M240,240 L370,340"
                                    />
                                    <animate attributeName="opacity" values="0;1;1;0" dur="2s" repeatCount="indefinite" begin="0.8s" />
                                </circle>
                                {/* Pulse on line to left */}
                                <circle r="1.5" fill="#ffffff" opacity="0" filter="url(#glow)">
                                    <animateMotion
                                        dur="3.2s"
                                        repeatCount="indefinite"
                                        begin="1.4s"
                                        path="M240,240 L100,290"
                                    />
                                    <animate attributeName="opacity" values="0;0.7;0.7;0" dur="3.2s" repeatCount="indefinite" begin="1.4s" />
                                </circle>
                                {/* Pulse going bottom */}
                                <circle r="1.5" fill="#3b82f6" opacity="0" filter="url(#glow)">
                                    <animateMotion
                                        dur="2.8s"
                                        repeatCount="indefinite"
                                        begin="0.3s"
                                        path="M240,240 L240,400"
                                    />
                                    <animate attributeName="opacity" values="0;0.9;0.9;0" dur="2.8s" repeatCount="indefinite" begin="0.3s" />
                                </circle>

                                {/* ── Core glow ── */}
                                <circle cx="240" cy="240" r="55" fill="url(#coreGlow)">
                                    <animate attributeName="r" values="50;60;50" dur="4s" repeatCount="indefinite" />
                                    <animate attributeName="opacity" values="0.7;1;0.7" dur="4s" repeatCount="indefinite" />
                                </circle>

                                {/* ── Hexagonal grid pattern (inner decoration) ── */}
                                <g opacity="0.12" stroke="#3b82f6" strokeWidth="0.5">
                                    <polygon points="240,200 265,213 265,240 240,253 215,240 215,213" fill="none" />
                                    <polygon points="240,175 278,197 278,240 240,262 202,240 202,197" fill="none" />
                                </g>

                                {/* ── Core center ── */}
                                <circle cx="240" cy="240" r="20" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.6)" strokeWidth="0.8" filter="url(#glow)">
                                    <animate attributeName="r" values="18;22;18" dur="3s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="240" cy="240" r="6" fill="#3b82f6" filter="url(#glowStrong)">
                                    <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite" />
                                </circle>
                                <circle cx="240" cy="240" r="2.5" fill="#ffffff" />

                                {/* ── Outer nodes ── */}
                                {/* Top-right node */}
                                <g filter="url(#glow)">
                                    <circle cx="348" cy="114" r="12" fill="rgba(59,130,246,0.15)" stroke="rgba(59,130,246,0.5)" strokeWidth="0.8">
                                        <animate attributeName="r" values="11;14;11" dur="3s" repeatCount="indefinite" />
                                    </circle>
                                    <circle cx="348" cy="114" r="4" fill="#3b82f6">
                                        <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
                                    </circle>
                                </g>

                                {/* Bottom-right node */}
                                <g filter="url(#glow)">
                                    <circle cx="370" cy="340" r="10" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.4)" strokeWidth="0.8">
                                        <animate attributeName="r" values="9;13;9" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                                    </circle>
                                    <circle cx="370" cy="340" r="3.5" fill="#3b82f6">
                                        <animate attributeName="opacity" values="0.6;1;0.6" dur="3.5s" repeatCount="indefinite" begin="0.5s" />
                                    </circle>
                                </g>

                                {/* Left node */}
                                <g filter="url(#glow)">
                                    <circle cx="100" cy="290" r="9" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.8">
                                        <animate attributeName="r" values="8;11;8" dur="4s" repeatCount="indefinite" begin="1s" />
                                    </circle>
                                    <circle cx="100" cy="290" r="3" fill="rgba(255,255,255,0.7)">
                                        <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" begin="1s" />
                                    </circle>
                                </g>

                                {/* Top-left node */}
                                <g filter="url(#glow)">
                                    <circle cx="130" cy="130" r="8" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.8">
                                        <animate attributeName="r" values="7;10;7" dur="4.5s" repeatCount="indefinite" begin="0.3s" />
                                    </circle>
                                    <circle cx="130" cy="130" r="2.5" fill="rgba(255,255,255,0.5)">
                                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="4.5s" repeatCount="indefinite" begin="0.3s" />
                                    </circle>
                                </g>

                                {/* Bottom node */}
                                <g filter="url(#glow)">
                                    <circle cx="240" cy="400" r="10" fill="rgba(59,130,246,0.12)" stroke="rgba(59,130,246,0.35)" strokeWidth="0.8">
                                        <animate attributeName="r" values="9;12;9" dur="3s" repeatCount="indefinite" begin="1.2s" />
                                    </circle>
                                    <circle cx="240" cy="400" r="3.5" fill="#3b82f6">
                                        <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" begin="1.2s" />
                                    </circle>
                                </g>

                                {/* ── Grid texture (bottom-right corner) ── */}
                                <g opacity="0.06" stroke="white" strokeWidth="0.5">
                                    {[0, 1, 2, 3, 4].map(row =>
                                        [0, 1, 2, 3, 4].map(col => (
                                            <rect
                                                key={`${row}-${col}`}
                                                x={340 + col * 16}
                                                y={350 + row * 16}
                                                width="12"
                                                height="12"
                                                rx="1"
                                            />
                                        ))
                                    )}
                                </g>

                                {/* ── Scatter dots (top area) ── */}
                                {[
                                    { cx: 70, cy: 80, r: 1.5, delay: "0s" },
                                    { cx: 95, cy: 55, r: 1, delay: "0.4s" },
                                    { cx: 420, cy: 75, r: 1.5, delay: "0.8s" },
                                    { cx: 440, cy: 105, r: 1, delay: "1s" },
                                    { cx: 55, cy: 400, r: 1.5, delay: "0.6s" },
                                    { cx: 410, cy: 420, r: 1, delay: "1.4s" },
                                ].map((dot, i) => (
                                    <circle key={i} cx={dot.cx} cy={dot.cy} r={dot.r} fill="rgba(59,130,246,0.6)">
                                        <animate attributeName="opacity" values="0.3;1;0.3" dur="3s" repeatCount="indefinite" begin={dot.delay} />
                                    </circle>
                                ))}
                            </svg>

                            {/* ── Floating Metadata Panels ── */}
                            <div className="absolute top-6 left-4 sm:top-10 sm:left-8 glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl animate-float">
                                <div className="flex items-center gap-2 mb-0.5">
                                    <span className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                                    <div className="text-[7px] sm:text-[9px] text-agency-accent font-black uppercase tracking-widest opacity-70">System Uptime</div>
                                </div>
                                <div className="text-sm sm:text-base font-bold text-white tracking-tight">99.98%</div>
                            </div>

                            <div className="absolute bottom-8 right-4 sm:bottom-12 sm:right-8 glass-panel px-3 py-2 sm:px-4 sm:py-2.5 rounded-xl animate-float animation-delay-500">
                                <div className="text-[7px] sm:text-[9px] text-agency-accent font-black uppercase tracking-widest opacity-70 mb-0.5">Yield Velocity</div>
                                <div className="text-sm sm:text-base font-bold text-white tracking-tight">3.4× YoY</div>
                            </div>

                            <div className="absolute top-1/2 -translate-y-1/2 right-3 sm:right-6 glass-panel px-2.5 py-2 sm:px-3.5 sm:py-2.5 rounded-xl animate-float animation-delay-200">
                                <div className="text-[7px] sm:text-[9px] text-agency-accent font-black uppercase tracking-widest opacity-70 mb-0.5">Entropy</div>
                                <div className="text-xs sm:text-sm font-bold text-white tracking-tight">0.042%</div>
                            </div>
                        </div>

                        {/* External accent glow */}
                        <div className="absolute -top-10 -right-10 w-40 h-40 bg-agency-accent/10 rounded-full blur-3xl" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-agency-accent/5 rounded-full blur-2xl" />
                    </div>
                </div>
            </div>
        </section>
    );
}
