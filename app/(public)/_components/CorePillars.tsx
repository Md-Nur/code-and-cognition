import { Layout, Cpu, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const STRATEGIC_MAP: { [key: string]: { label: string; icon: any } } = {
    "Digital Platforms": { label: "Industrial-Grade Platforms", icon: Layout },
    "Intelligent Automation": { label: "Autonomous Operations", icon: Cpu },
    "Growth Systems": { label: "Result Engineering", icon: TrendingUp },
};

export default async function CorePillars() {
    const categories = [
        { id: "1", name: "Digital Platforms", description: "Industrial-grade web applications and digital ecosystems built for scale and performance.", slug: "digital-platforms" },
        { id: "2", name: "Intelligent Automation", description: "Custom AI integrations and workflow automations to reduce operational overhead.", slug: "intelligent-automation" },
        { id: "3", name: "Growth Systems", description: "Data-driven technical marketing and conversion optimization infrastructure.", slug: "growth-systems" }
    ];

    return (
        <section className="py-40 bg-black relative">
            <div className="section-container">
                <div className="max-w-3xl mb-32">
                    <span className="section-tag">
                        Capabilities
                    </span>
                    <h2 className="text-5xl md:text-7xl font-extrabold strategic-heading text-white mb-8">
                        Precision-Engineered <br />
                        <span className="text-gradient">Growth Infrastructure</span>
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl">
                        We deliver the technical foundation required to scale high-ticket operations with algorithmic precision and architectural integrity.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
                    {categories.map((category) => {
                        const strategic = STRATEGIC_MAP[category.name] || { label: category.name, icon: Layout };
                        const Icon = strategic.icon;

                        return (
                            <div
                                key={category.id}
                                className="group premium-card p-12 flex flex-col items-start min-h-[420px]"
                            >
                                <div className="w-12 h-12 rounded-2xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-agency-accent mb-10 group-hover:bg-agency-accent group-hover:text-white transition-all duration-500 shadow-2xl">
                                    <Icon className="w-5 h-5" />
                                </div>

                                <h3 className="text-2xl font-bold mb-6 text-white group-hover:text-gradient transition-all">
                                    {strategic.label}
                                </h3>

                                <p className="text-gray-400 text-sm leading-relaxed mb-12 flex-grow">
                                    {category.description}
                                </p>

                                <Link
                                    href={`/services#${category.slug}`}
                                    className="inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.2em] text-white/40 group-hover:text-white transition-all"
                                >
                                    Explore Methodology
                                    <ArrowUpRight className="w-4 h-4" />
                                </Link>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

