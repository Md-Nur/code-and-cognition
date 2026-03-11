import Link from "next/link";
import { MoveRight, Cpu, Activity } from "lucide-react";

export default function HeroSection() {
    return (
        <section className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden bg-agency-black">

            {/* ── Architectural Ambience ─────────────────────────────────────── */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                {/* Primary radial glow — top right */}
                <div className="absolute -top-[20%] -right-[10%] w-[80vw] h-[80vw] max-w-[900px] max-h-[900px] rounded-full bg-agency-accent/15 blur-[180px] opacity-60" />
                {/* Secondary soft glow — bottom left */}
                <div className="absolute -bottom-[20%] -left-[10%] w-[60vw] h-[60vw] max-w-[700px] max-h-[700px] rounded-full bg-white/[0.03] blur-[140px]" />

                {/* Digital grid — fades at edges */}
                <div
                    className="absolute inset-0"
                    style={{
                        backgroundImage: `
                            linear-gradient(to right, rgba(255,255,255,0.025) 1px, transparent 1px),
                            linear-gradient(to bottom, rgba(255,255,255,0.025) 1px, transparent 1px)
                        `,
                        backgroundSize: "56px 56px",
                        WebkitMaskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, #000 20%, transparent 85%)",
                        maskImage: "radial-gradient(ellipse 90% 90% at 50% 50%, #000 20%, transparent 85%)",
                    }}
                />

                {/* Vertical light beams */}
                <div className="absolute top-0 left-[18%] w-px h-full bg-gradient-to-b from-transparent via-agency-accent/25 to-transparent" />
                <div className="absolute top-0 right-[22%] w-px h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />

                {/* Angled volumetric rays */}
                <div className="absolute -top-32 left-[10%] w-[600px] h-[150%] bg-gradient-to-b from-transparent via-agency-accent/5 to-transparent -rotate-[35deg] blur-3xl" />
                <div className="absolute -top-32 right-[5%] w-[400px] h-[120%] bg-gradient-to-b from-transparent via-white/[0.03] to-transparent rotate-[35deg] blur-2xl" />

                {/* Horizon line */}
                <div className="absolute top-[62%] left-0 w-full h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
            </div>

            {/* ── Main Content ──────────────────────────────────────────────── */}
            <div className="section-container relative z-10 w-full">
                <div className="flex flex-col xl:flex-row items-center gap-16 xl:gap-20">

                    {/* Left — Copy & CTA */}
                    <div className="flex-1 text-center xl:text-left max-w-3xl mx-auto xl:mx-0">

                        {/* Status badge */}
                        <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-agency-accent/10 border border-agency-accent/20 backdrop-blur-lg mb-8 animate-fade-in">
                            <span className="relative flex h-2 w-2 shrink-0">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-agency-accent opacity-60" />
                                <span className="relative inline-flex h-2 w-2 rounded-full bg-agency-accent" />
                            </span>
                            <span className="text-[10px] sm:text-xs font-bold uppercase tracking-[0.3em] text-agency-accent">
                                Smart Planning &amp; Skilled Building
                            </span>
                        </div>

                        {/* Headline */}
                        <h1 className="text-4xl xs:text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-extrabold strategic-heading text-white leading-[1.04] mb-6 sm:mb-7 animate-slide-up">
                            Smart Digital
                            <br className="block" />
                            <span
                                className="bg-clip-text text-transparent"
                                style={{
                                    backgroundImage: "linear-gradient(135deg, #ffffff 0%, #93c5fd 50%, #3b82f6 100%)",
                                }}
                            >
                                Solutions for Business
                            </span>
                        </h1>

                        {/* Sub-copy */}
                        <p className="text-gray-400 text-lg sm:text-xl leading-relaxed max-w-2xl mb-11 animate-slide-up animation-delay-200 mx-auto xl:mx-0 px-2 sm:px-0">
                            We provide AI solutions, video editing, digital marketing, and web development to help your business grow.
                        </p>

                        {/* CTAs */}
                        <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-4 sm:gap-5 animate-slide-up animation-delay-300 px-4 sm:px-0">
                            <Link
                                href="/schedule"
                                className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-full bg-white text-black font-bold text-sm sm:text-base transition-all duration-300 hover:scale-[1.02] hover:shadow-[0_0_40px_rgba(255,255,255,0.25)] active:scale-[0.98] w-full sm:w-auto overflow-hidden"
                            >
                                Book a Free Meeting
                                <MoveRight className="w-4 h-4 shrink-0 group-hover:translate-x-1 transition-transform" />
                            </Link>
                            <Link
                                href="/case-studies"
                                className="inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-full border border-white/10 text-white font-bold text-sm sm:text-base transition-all duration-300 hover:bg-white/5 hover:border-white/25 w-full sm:w-auto backdrop-blur-sm"
                            >
                                <Activity className="w-4 h-4 text-agency-accent" />
                                See Our Work
                            </Link>
                        </div>

                        {/* Stats row */}
                        <div className="mt-12 sm:mt-14 pt-8 border-t border-white/[0.07] grid grid-cols-3 gap-2 sm:gap-8 animate-fade-in animation-delay-500 max-w-lg mx-auto xl:mx-0">
                            {[
                                { value: "99.98%", label: "Uptime SLA" },
                                { value: "3.4×", label: "Growth Speed" },
                                { value: "< 48h", label: "How Fast We Build" },
                            ].map((stat) => (
                                <div key={stat.label} className="text-center xl:text-left">
                                    <div className="text-lg xs:text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-none px-1">
                                        {stat.value}
                                    </div>
                                    <div className="text-[9px] sm:text-xs text-gray-500 font-semibold uppercase tracking-wider sm:tracking-[0.15em] mt-1.5 px-1">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Right — Execution Engine Visual */}
                    <div className="flex-1 relative w-full max-w-[560px] xl:max-w-[620px] animate-fade-in animation-delay-300 px-4 sm:px-0">

                        {/* Corner bracket decorations */}
                        <div className="absolute -top-3 -left-3 w-5 h-5 border-t-2 border-l-2 border-agency-accent/40 rounded-tl-sm z-20" />
                        <div className="absolute -top-3 -right-3 w-5 h-5 border-t-2 border-r-2 border-agency-accent/40 rounded-tr-sm z-20" />
                        <div className="absolute -bottom-3 -left-3 w-5 h-5 border-b-2 border-l-2 border-white/20 rounded-bl-sm z-20" />
                        <div className="absolute -bottom-3 -right-3 w-5 h-5 border-b-2 border-r-2 border-white/20 rounded-br-sm z-20" />

                        {/* Main glassmorphic card */}
                        <div className="relative aspect-square rounded-3xl bg-white/[0.02] border border-white/[0.07] backdrop-blur-2xl shadow-[0_40px_80px_rgba(0,0,0,0.6)] overflow-hidden group">

                            {/* Card inner glow */}
                            <div className="absolute inset-0 bg-gradient-to-br from-agency-accent/8 via-transparent to-transparent" />
                            <div className="absolute -top-24 -right-24 w-56 h-56 bg-agency-accent/20 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />

                            {/* Code texture watermark */}
                            <div
                                className="absolute inset-0 p-8 font-mono text-[10px] text-agency-accent/[0.06] leading-[1.8] pointer-events-none select-none overflow-hidden whitespace-pre"
                                aria-hidden="true"
                            >{`const engine = new ExecutionCore({
  topology: "mesh",
  resilience: 0.9999,
  nodes: spawn.all(),
});
engine.on("signal", handleEvent);
await engine.init();
// [OK] Core ready — 0x7FA3C2`}</div>

                            {/* ── Central SVG network ── */}
                            <div className="absolute inset-0 flex items-center justify-center">
                                <div className="relative w-72 h-72 flex items-center justify-center">

                                    {/* Orbit rings */}
                                    <div className="absolute inset-0 rounded-full border border-white/[0.06] border-dashed animate-[spin_30s_linear_infinite]" />
                                    <div className="absolute inset-4 rounded-full border border-agency-accent/15 animate-[spin_20s_linear_infinite_reverse]" />
                                    <div className="absolute inset-10 rounded-full border border-white/[0.08] border-dashed animate-[spin_12s_linear_infinite]" />

                                    {/* Spoke lines */}
                                    <svg className="absolute inset-0 w-full h-full" viewBox="0 0 288 288" fill="none">
                                        {[0, 51.4, 102.8, 154.3, 205.7, 257.1, 308.6].map((deg, i) => (
                                            <line
                                                key={i}
                                                x1="144" y1="144"
                                                x2={144 + 130 * Math.cos((deg - 90) * Math.PI / 180)}
                                                y2={144 + 130 * Math.sin((deg - 90) * Math.PI / 180)}
                                                stroke="rgba(59,130,246,0.12)"
                                                strokeWidth="1"
                                                strokeDasharray="3 6"
                                            />
                                        ))}
                                        {/* Outer node dots */}
                                        {[0, 51.4, 102.8, 154.3, 205.7, 257.1, 308.6].map((deg, i) => (
                                            <circle
                                                key={`dot-${i}`}
                                                cx={144 + 130 * Math.cos((deg - 90) * Math.PI / 180)}
                                                cy={144 + 130 * Math.sin((deg - 90) * Math.PI / 180)}
                                                r="3.5"
                                                fill="#3b82f6"
                                                opacity="0.5"
                                            >
                                                <animate
                                                    attributeName="opacity"
                                                    values="0.3;0.9;0.3"
                                                    dur={`${2.5 + i * 0.4}s`}
                                                    repeatCount="indefinite"
                                                    begin={`${i * 0.3}s`}
                                                />
                                                <animate
                                                    attributeName="r"
                                                    values="3;5;3"
                                                    dur={`${2.5 + i * 0.4}s`}
                                                    repeatCount="indefinite"
                                                    begin={`${i * 0.3}s`}
                                                />
                                            </circle>
                                        ))}
                                    </svg>

                                    {/* Pulsing core aura */}
                                    <div className="absolute w-28 h-28 rounded-full bg-agency-accent/10 animate-ping" style={{ animationDuration: "3s" }} />
                                    <div className="absolute w-20 h-20 rounded-full bg-agency-accent/20 animate-ping" style={{ animationDuration: "2s", animationDelay: "0.5s" }} />

                                    {/* Core orb */}
                                    <div
                                        className="relative w-16 h-16 rounded-full flex items-center justify-center border border-agency-accent/40 shadow-[0_0_40px_rgba(59,130,246,0.5),inset_0_0_20px_rgba(59,130,246,0.1)]"
                                        style={{
                                            background: "radial-gradient(circle at 40% 35%, rgba(147,197,253,0.25) 0%, rgba(59,130,246,0.15) 50%, rgba(29,78,216,0.2) 100%)",
                                        }}
                                    >
                                        <Cpu className="w-7 h-7 text-white/90" />
                                    </div>
                                </div>
                            </div>

                            {/* ── Floating UI Panels ── */}

                            {/* Top-left: Deploy log */}
                            <div className="absolute top-6 left-5 sm:top-9 sm:left-8 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 animate-float shadow-xl w-44 sm:w-52">
                                <div className="flex items-center gap-2 mb-2.5">
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-400 shadow-[0_0_6px_#4ade80]" />
                                    <span className="text-[9px] font-bold text-agency-accent uppercase tracking-widest opacity-80">Deploy.Log</span>
                                </div>
                                <div className="space-y-1 font-mono text-[9px] sm:text-[10px]">
                                    <div className="text-gray-500"><span className="text-gray-600">&gt;</span> Init core... <span className="text-green-400">✓ OK</span></div>
                                    <div className="text-gray-500"><span className="text-gray-600">&gt;</span> Sync nodes... <span className="text-green-400">✓ OK</span></div>
                                    <div className="text-agency-accent"><span className="text-agency-accent/50">&gt;</span> Scaling...</div>
                                </div>
                            </div>

                            {/* Bottom-right: Velocity metric */}
                            <div className="absolute bottom-6 right-5 sm:bottom-9 sm:right-8 bg-black/50 backdrop-blur-xl border border-white/10 rounded-2xl px-4 py-3 animate-float animation-delay-500 shadow-xl w-40 sm:w-48">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Velocity</span>
                                    <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse shadow-[0_0_6px_#22c55e]" />
                                </div>
                                <div className="text-2xl sm:text-3xl font-extrabold text-white leading-none tracking-tight mb-2.5">
                                    3.4<span className="text-base text-agency-accent font-bold">×</span>
                                </div>
                                {/* Progress bar */}
                                <div className="h-1 w-full rounded-full bg-white/[0.08] overflow-hidden">
                                    <div className="h-full w-[84%] rounded-full bg-gradient-to-r from-blue-600 to-agency-accent relative overflow-hidden">
                                        <div className="absolute inset-0 bg-white/30 -translate-x-full animate-[marquee-right_2s_linear_infinite]" />
                                    </div>
                                </div>
                                <div className="text-[9px] text-gray-500 mt-1.5 font-medium">YoY Growth Index</div>
                            </div>

                            {/* Right edge: Uptime tag */}
                            <div className="absolute top-1/2 -translate-y-1/2 right-4 sm:right-7 bg-agency-accent/10 backdrop-blur-xl border border-agency-accent/25 rounded-xl px-3 py-2 animate-float animation-delay-200 shadow-lg">
                                <div className="flex items-center gap-2">
                                    <div className="w-1 h-4 rounded-full bg-agency-accent animate-pulse" />
                                    <div>
                                        <div className="text-[9px] text-agency-accent/70 font-bold uppercase tracking-widest leading-none mb-0.5">SLA</div>
                                        <div className="text-xs font-extrabold text-white tracking-tight">99.98%</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* External ambient glows */}
                        <div className="absolute -top-12 -right-12 w-48 h-48 bg-agency-accent/10 rounded-full blur-3xl pointer-events-none" />
                        <div className="absolute -bottom-10 -left-10 w-36 h-36 bg-agency-accent/5 rounded-full blur-2xl pointer-events-none" />
                    </div>

                </div>
            </div>
        </section>
    );
}
