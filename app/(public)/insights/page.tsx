import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { MoveRight, Clock, Sparkles } from "lucide-react";
import Image from "next/image";
import ArticleGrid from "./_components/ArticleGrid";
import InsightsNewsletter from "./_components/InsightsNewsletter";

import { Metadata } from "next";

export const dynamic = 'force-dynamic';

export async function generateMetadata(): Promise<Metadata> {
    const articles = await prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
    });

    const featuredArticle = articles.find(a => a.isFeatured) || articles[0];

    return {
        title: "Insights | Code & Cognition — Our Latest Updates & Tips",
        description: "Tips and guides on AI, digital marketing, and building better websites for your business.",
        openGraph: {
            images: featuredArticle?.thumbnailUrl ? [featuredArticle.thumbnailUrl] : [],
        },
        twitter: {
            card: "summary_large_image",
            images: featuredArticle?.thumbnailUrl ? [featuredArticle.thumbnailUrl] : [],
        },
    };
}

export default async function InsightsPage() {
    const articles = await prisma.article.findMany({
        orderBy: { publishedAt: "desc" },
    });

    const featuredArticle = articles.find(a => a.isFeatured) || articles[0];
    const regularArticles = articles; // Pass all to ArticleGrid for better filtering

    const calculateReadTime = (content: string) => {
        const wordsPerMinute = 200;
        const words = content.split(/\s+/).length;
        return Math.ceil(words / wordsPerMinute);
    };

    return (
        <main className="bg-agency-black min-h-screen pb-32 selection:bg-agency-accent selection:text-white">
            {/* Header Section */}
            <section className="pt-40 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[50%] h-[50%] bg-agency-accent/10 rounded-full blur-[120px] opacity-20 animate-pulse" />
                <div className="absolute -bottom-20 -left-20 w-[30%] h-[30%] bg-agency-accent/5 rounded-full blur-[100px] opacity-10" />

                <div className="section-container relative z-10">
                    <div className="max-w-4xl">
                        <div className="flex items-center gap-3 mb-6 animate-slide-up">
                            <span className="w-8 h-px bg-agency-accent" />
                            <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] block">
                                Our Latest Updates
                            </span>
                        </div>
                        <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-8 leading-[0.9] animate-slide-up animation-delay-100">
                            Smart Tips <br /> <span className="text-white/20 italic">for</span> <br /> Your Business
                        </h1>
                        <p className="text-gray-400 text-xl md:text-2xl leading-relaxed max-w-2xl animate-slide-up animation-delay-200">
                            Tips and guides on AI, digital marketing, and building better websites for your business.
                        </p>
                    </div>
                </div>
            </section>

            {/* Featured Article */}
            {featuredArticle && (
                <section className="py-20 relative">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-agency-accent/5 blur-[150px] pointer-events-none rounded-full opacity-30" />
                    <div className="section-container">
                        <Link
                            href={`/insights/${featuredArticle.slug}`}
                            className="group block relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-700 glass-panel"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-2">
                                <div className="p-10 md:p-16 flex flex-col justify-center">
                                    <div className="flex items-center gap-4 mb-8">
                                        <span className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-agency-accent/10 text-agency-accent text-[10px] font-bold uppercase tracking-widest border border-agency-accent/20">
                                            <Sparkles className="w-3 h-3" />
                                            Featured Insight
                                        </span>
                                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                            <Clock className="w-3 h-3" />
                                            {calculateReadTime(featuredArticle.content)} min read
                                        </span>
                                        <span className="w-1 h-1 bg-white/20 rounded-full" />
                                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
                                            {featuredArticle.publishedAt.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                    </div>
                                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 group-hover:text-agency-accent transition-colors leading-tight tracking-tight">
                                        {featuredArticle.title}
                                    </h2>
                                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-12 line-clamp-3 font-medium">
                                        {featuredArticle.excerpt || "Strategic perspectives on architecting digital success through technical leadership and operational excellence."}
                                    </p>
                                    <span className="flex items-center gap-3 text-white/40 group-hover:text-white transition-all text-xs font-bold uppercase tracking-[0.2em]">
                                        Read More <MoveRight className="w-4 h-4 transition-transform group-hover:translate-x-2" />
                                    </span>
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
                                    <div className="absolute inset-0 bg-linear-to-r from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                                </div>
                            </div>
                        </Link>
                    </div>
                </section>
            )}

            {/* Content Explorer Section */}
            <section className="py-24 border-t border-white/5">
                <div className="section-container">
                    <div className="mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Latest Insights</h2>
                        <p className="text-gray-500">Explore our knowledge base by category or search for specific topics.</p>
                    </div>

                    <ArticleGrid initialArticles={regularArticles} />
                </div>
            </section>

            <InsightsNewsletter />
        </main>
    );
}
