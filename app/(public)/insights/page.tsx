import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MoveRight, Clock, User } from "lucide-react";
import Image from "next/image";

export const dynamic = 'force-dynamic';

export default async function InsightsPage() {
    const articles = await prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
    });

    const featuredArticle = articles.find(a => a.isFeatured) || articles[0];
    const regularArticles = articles.filter(a => a.id !== featuredArticle?.id);

    return (
        <main className="bg-agency-black min-h-screen pb-32 selection:bg-agency-accent selection:text-white">
            {/* Header Section */}
            <section className="pt-40 pb-20 border-b border-white/5 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-agency-accent/5 rounded-full blur-[120px] opacity-20" />
                <div className="section-container relative z-10">
                    <div className="max-w-3xl">
                        <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                            Knowledge & Perspectives
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
                            Strategic Intelligence <br /> for Digital Leaders
                        </h1>
                        <p className="text-gray-400 text-xl leading-relaxed">
                            Deep dives into technical excellence, enterprise automation, and the future of digital-first business operations.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            {featuredArticle && (
                <section className="py-20">
                    <div className="section-container">
                        <Link
                            href={`/insights/${featuredArticle.slug}`}
                            className="group block relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-12 md:p-16 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="px-4 py-1 rounded-full bg-agency-accent/10 text-agency-accent text-[10px] font-bold uppercase tracking-widest">
                                            Featured Insight
                                        </span>
                                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {featuredArticle.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 group-hover:text-agency-accent transition-colors leading-tight">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-gray-400 text-lg leading-relaxed mb-12 line-clamp-3">
                                        {featuredArticle.excerpt || "Strategic perspectives on architecting digital success through technical leadership and operational excellence."}
                                    </p>
                                    <div className="flex items-center gap-3 text-white/40 group-hover:text-white transition-colors text-xs font-bold uppercase tracking-widest">
                                        Read Full Analysis <MoveRight className="w-4 h-4" />
                                    </div>
                                </div>
                                <div className="relative aspect-square lg:aspect-auto min-h-[400px] overflow-hidden">
                                    {featuredArticle.thumbnailUrl ? (
                                        <Image
                                            src={featuredArticle.thumbnailUrl}
                                            alt={featuredArticle.title}
                                            fill
                                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent flex items-center justify-center">
                                            <span className="text-white/5 font-bold uppercase tracking-[1em] text-4xl -rotate-12">Cognition</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Article Grid */}
            <section className="py-20 border-t border-white/5">
                <div className="section-container">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                        {regularArticles.length > 0 ? regularArticles.map((article) => (
                            <Link key={article.id} href={`/insights/${article.slug}`} className="group block">
                                <div className="mb-8 overflow-hidden rounded-3xl aspect-[16/9] bg-white/5 border border-white/10 relative">
                                    {article.thumbnailUrl ? (
                                        <Image
                                            src={article.thumbnailUrl}
                                            alt={article.title}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
                                            <span className="text-white/5 font-bold uppercase tracking-[0.5em] text-xs">Insight</span>
                                        </div>
                                    )}
                                </div>
                                <span className="text-agency-accent font-bold uppercase tracking-widest text-[10px] mb-4 block">
                                    {article.category}
                                </span>
                                <h3 className="text-2xl font-bold text-white mb-6 leading-snug group-hover:text-agency-accent transition-colors">
                                    {article.title}
                                </h3>
                                <div className="flex items-center justify-between text-gray-500 font-bold text-[10px] uppercase tracking-widest">
                                    <span>{article.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                                    <span className="flex items-center gap-2 group-hover:text-white transition-colors">
                                        Details <MoveRight className="w-4 h-4" />
                                    </span>
                                </div>
                            </Link>
                        )) : (
                            <div className="lg:col-span-3 text-center py-20 border-2 border-dashed border-white/5 rounded-[40px]">
                                <p className="text-gray-500">No additional insights available yet. Check back soon for new analysis.</p>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
}
