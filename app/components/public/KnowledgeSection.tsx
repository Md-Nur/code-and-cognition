import { MoveRight } from "lucide-react";
import Link from "next/link";

const INSIGHTS = [
    {
        category: "AI & Automation",
        title: "The Architecture of Intelligent Systems: Scaling Beyond Human Limitations",
        date: "Feb 15, 2026",
    },
    {
        category: "Product Strategy",
        title: "Outcome-Driven Execution: Why Tech Stack Choice is Only 20% of Success",
        date: "Feb 10, 2026",
    },
    {
        category: "Growth",
        title: "Building Resilient Digital Operations for High-Ticket B2B Markets",
        date: "Feb 05, 2026",
    },
];

export default function KnowledgeSection() {
    return (
        <section className="py-32 bg-agency-black">
            <div className="section-container">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="max-w-2xl">
                        <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                            Insights
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            Strategic Intelligence & <br /> Thought Leadership
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            We share our perspectives on the intersection of technical excellence, enterprise automation, and business growth.
                        </p>
                    </div>
                    <Link
                        href="/insights"
                        className="btn-outline px-8 py-4 rounded-full text-sm font-bold group"
                    >
                        Explore All Insights
                    </Link>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {INSIGHTS.map((insight) => (
                        <div key={insight.title} className="group cursor-pointer">
                            <div className="mb-8 overflow-hidden rounded-3xl aspect-[16/9] bg-white/5 border border-white/10">
                                {/* Mock Image Placeholder */}
                                <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                    <span className="text-white/10 font-bold uppercase tracking-[0.5em]">Cognition</span>
                                </div>
                            </div>
                            <span className="text-agency-accent font-bold uppercase tracking-widest text-[10px] mb-4 block">
                                {insight.category}
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-6 leading-snug group-hover:text-agency-accent transition-colors">
                                {insight.title}
                            </h3>
                            <div className="flex items-center justify-between text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                <span>{insight.date}</span>
                                <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                                    Read Insight <MoveRight className="w-4 h-4" />
                                </span>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
