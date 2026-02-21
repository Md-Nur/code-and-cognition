"use client";

import { CheckCircle2, Search, Target, Rocket, ShieldCheck, Zap } from "lucide-react";

const STEPS = [
    {
        title: "Discovery",
        icon: Search,
        description: "In-depth extraction of business objectives, market dynamics, and operational bottlenecks.",
    },
    {
        title: "Strategy",
        icon: Target,
        description: "Architecting a tailored roadmap focused on high-leverage outcomes and technical feasibility.",
    },
    {
        title: "Development",
        icon: Zap,
        description: "Agile execution of modular platforms and intelligent systems with enterprise-grade quality.",
    },
    {
        title: "Testing",
        icon: ShieldCheck,
        description: "Rigorous performance validation, security audits, and user acceptance testing.",
    },
    {
        title: "Deployment",
        icon: Rocket,
        description: "Seamless orchestration of production rollouts with zero-downtime protocols.",
    },
    {
        title: "Optimization",
        icon: CheckCircle2,
        description: "Continuous data-driven refinement to ensure sustained growth and peak operational ROI.",
    },
];

export default function HowWeWork() {
    return (
        <section className="py-32 bg-agency-black relative overflow-hidden">
            <div className="section-container">
                <div className="max-w-3xl mb-24">
                    <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                        Methodology
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        A Proven System for <br /> Predictable Outcomes
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                        Our operating model ensures transparency, speed, and precision at every stage of the engagement.
                    </p>
                </div>

                <div className="relative">
                    {/* Connector Line */}
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-gradient-to-r from-agency-accent/50 via-white/10 to-transparent hidden lg:block -translate-y-1/2" />

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 relative z-10">
                        {STEPS.map((step, index) => (
                            <div key={step.title} className="group flex flex-col items-center lg:items-start text-center lg:text-left">
                                <div className="w-16 h-16 rounded-full bg-agency-black border border-white/10 flex items-center justify-center mb-8 group-hover:border-agency-accent/50 group-hover:bg-agency-accent/5 transition-all duration-500 relative">
                                    <step.icon className="w-6 h-6 text-gray-400 group-hover:text-agency-accent transition-colors" />
                                    <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[10px] font-bold text-white/40">
                                        {index + 1}
                                    </div>
                                </div>

                                <h3 className="text-xl font-bold mb-4 text-white">{step.title}</h3>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    {step.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    );
}
