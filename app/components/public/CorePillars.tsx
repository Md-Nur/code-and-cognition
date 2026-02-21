import { prisma } from "@/lib/prisma";
import { Layout, Cpu, TrendingUp, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const IconMap: { [key: string]: any } = {
    "Digital Platforms": Layout,
    "Intelligent Automation": Cpu,
    "Growth Systems": TrendingUp,
};

export default async function CorePillars() {
    const categories = await prisma.serviceCategory.findMany({
        where: { status: "ACTIVE" },
        orderBy: { order: "asc" },
    });

    return (
        <section className="py-32 bg-agency-black relative">
            <div className="section-container">
                <div className="max-w-3xl mb-20 text-center lg:text-left">
                    <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                        Capabilities
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        Solution Architecture Aligned to Outcomes
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed">
                        We focus on the three core pillars essential for scaling high-ticket digital operations in the AI era.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {categories.map((category) => {
                        const Icon = IconMap[category.name] || Layout;
                        return (
                            <div
                                key={category.id}
                                className="group relative p-10 rounded-[40px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 flex flex-col items-start overflow-hidden"
                            >
                                <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity duration-700">
                                    <Icon className="w-32 h-32" />
                                </div>

                                <div className="w-14 h-14 rounded-2xl bg-agency-accent/10 flex items-center justify-center text-agency-accent mb-8 group-hover:scale-110 transition-transform">
                                    <Icon className="w-7 h-7" />
                                </div>

                                <h3 className="text-2xl font-bold mb-4 text-white group-hover:text-agency-accent transition-colors">
                                    {category.name}
                                </h3>

                                <p className="text-gray-400 text-sm leading-relaxed mb-10 flex-grow">
                                    {category.description}
                                </p>

                                <Link
                                    href={`/services#${category.slug}`}
                                    className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-white/40 group-hover:text-white transition-colors"
                                >
                                    Learn Methodology
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
