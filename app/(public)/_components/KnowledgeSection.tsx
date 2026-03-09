import { MoveRight } from "lucide-react";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import Image from "next/image";

export default async function KnowledgeSection() {
    const insights = await prisma.article.findMany({
        orderBy: [
            { isFeatured: 'desc' },
            { publishedAt: 'desc' }
        ],
        take: 3
    });

    return (
        <section className="py-32 bg-agency-black" id="insights">
            <div className="section-container">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="max-w-2xl">
                        <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                            Insights
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            Our Latest Updates &amp; <br /> Tips
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            We share what we've learned about building good tech and growing businesses.
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
                    {insights.map((insight) => (
                        <Link
                            key={insight.id}
                            href={`/insights/${insight.slug}`}
                            className="group cursor-pointer block"
                        >
                            <div className="mb-8 overflow-hidden rounded-3xl aspect-[16/9] bg-white/5 border border-white/10 relative">
                                {insight.thumbnailUrl ? (
                                    <Image
                                        src={insight.thumbnailUrl}
                                        alt={insight.title}
                                        fill
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center group-hover:scale-105 transition-transform duration-700">
                                        <span className="text-white/10 font-bold uppercase tracking-[0.5em]">Cognition</span>
                                    </div>
                                )}
                                {insight.isFeatured && (
                                    <div className="absolute top-4 left-4">
                                        <span className="px-3 py-1 rounded-full bg-agency-accent/10 border border-agency-accent/20 text-agency-accent text-[8px] font-bold uppercase tracking-widest backdrop-blur-sm">
                                            Featured
                                        </span>
                                    </div>
                                )}
                            </div>
                            <span className="text-agency-accent font-bold uppercase tracking-widest text-[10px] mb-4 block">
                                {insight.category}
                            </span>
                            <h3 className="text-2xl font-bold text-white mb-6 leading-snug group-hover:text-agency-accent transition-colors">
                                {insight.title}
                            </h3>
                            <div className="flex items-center justify-between text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                <span>{insight.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                                    Read Insight <MoveRight className="w-4 h-4" />
                                </span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
