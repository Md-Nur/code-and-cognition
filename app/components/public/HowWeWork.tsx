"use client";

import { Target, Zap, ShieldCheck, Cpu, Code2, LineChart } from "lucide-react";

const STRATEGIC_STEPS = [
    {
        title: "Strategic Extraction",
        icon: Target,
        description: "In-depth identification of high-leverage business objectives and operational bottlenecks.",
    },
    {
        title: "Architectural Planning",
        icon: Cpu,
        description: "Designing scalable digital roadmaps focused on technical feasibility and business yield.",
    },
    {
        title: "Modular Execution",
        icon: Code2,
        description: "Agile development of robust platforms and automated systems with surgical precision.",
    },
    {
        title: "Performance Validation",
        icon: ShieldCheck,
        description: "Rigorous testing and security audits to ensure enterprise-grade stability and security.",
    },
    {
        title: "Deployment Orchestration",
        icon: Zap,
        description: "Seamless integration and transition into production with zero-downtime protocols.",
    },
    {
        title: "Yield Optimization",
        icon: LineChart,
        description: "Continuous data-driven refinement to maximize ROI and operational competence.",
    },
];

export default function HowWeWork() {
    return (
        <section className="py-40 bg-black relative overflow-hidden">
            <div className="section-container">
                <div className="max-w-3xl mb-32">
                    <span className="section-tag">
                        Methodology
                    </span>
                    <h2 className="text-5xl md:text-7xl font-extrabold strategic-heading text-white mb-8">
                        The Physics of <br />
                        <span className="text-gradient">Predictable Yield</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                        Our operating model is designed for transparency and speed, ensuring every engagement translates into measurable business momentum.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {STRATEGIC_STEPS.map((step, index) => (
                        <div key={step.title} className="group premium-card p-10 flex flex-col items-start hover:bg-white/[0.05] transition-all">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-agency-accent group-hover:bg-agency-accent group-hover:text-white transition-all duration-500">
                                    <step.icon className="w-4 h-4" />
                                </div>
                                <span className="text-[10px] font-black text-white/20 tracking-[0.2em]">PHASE 0{index + 1}</span>
                            </div>

                            <h3 className="text-xl font-bold mb-4 text-white group-hover:text-white transition-colors">{step.title}</h3>
                            <p className="text-gray-400 text-sm leading-relaxed">
                                {step.description}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

