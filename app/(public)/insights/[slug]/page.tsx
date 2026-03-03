import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import { PremiumMarkdown } from "@/components/shared/PremiumMarkdown";
import { ShareButton } from "@/components/shared/ShareButton";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
        where: { slug },
    });

    if (!article) {
        return {
            title: "Article Not Found | Code & Cognition",
        };
    }

    return {
        title: `${article.title} | Code & Cognition`,
        description: article.excerpt || `Read our latest insight: ${article.title}`,
        openGraph: {
            title: article.title,
            description: article.excerpt || undefined,
            images: article.thumbnailUrl ? [article.thumbnailUrl] : [],
        },
    };
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const article = await prisma.article.findUnique({
        where: { slug },
    });

    if (!article) {
        notFound();
    }

    return (
        <main className="bg-agency-black min-h-screen pb-32 selection:bg-agency-accent selection:text-white">
            {/* Header / Nav */}
            <div className="section-container pt-32 pb-12 overflow-hidden">
                <Link
                    href="/insights"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group mb-12"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to All Insights
                </Link>

                <div className="max-w-4xl">
                    <div className="flex flex-wrap items-center gap-6 mb-8">
                        <span className="px-4 py-1 rounded-full bg-white/5 border border-white/10 text-agency-accent text-[10px] font-bold uppercase tracking-widest">
                            {article.category}
                        </span>
                        <div className="h-4 w-px bg-white/10" />
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                            <Calendar className="w-3 h-3" />
                            {article.publishedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                        </span>
                        <div className="h-4 w-px bg-white/10 hidden sm:block" />
                        <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hidden sm:flex">
                            <Clock className="w-3 h-3" />
                            8 Min Read
                        </span>
                    </div>

                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-12 leading-[1.1]">
                        {article.title}
                    </h1>

                    <div className="flex items-center gap-6 pb-12 border-b border-white/5">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-agency-accent/20 border border-agency-accent/20 flex items-center justify-center text-agency-accent font-bold text-xs">
                                CC
                            </div>
                            <div className="flex flex-col">
                                <span className="text-white text-xs font-bold uppercase tracking-widest">Code & Cognition</span>
                                <span className="text-gray-500 text-xs">Technical Strategy Team</span>
                            </div>
                        </div>
                        <ShareButton title={article.title} text={article.excerpt || "Read our latest insight"} />
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-20">
                <div className="section-container">
                    <div className="max-w-4xl mx-auto">
                        <div>
                            {article.excerpt && (
                                <p className="text-xl text-white font-medium mb-12 leading-relaxed">
                                    {article.excerpt}
                                </p>
                            )}
                            <div className="mt-8">
                                <PremiumMarkdown content={article.content} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter CTA */}
            <section className="py-24 border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-agency-accent/5 to-transparent pointer-events-none" />
                <div className="section-container relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Stay Ahead of the Curve</h2>
                        <p className="text-gray-400 mb-10">
                            Join our monthly mailing list for exclusive strategic insights on AI, automation, and enterprise digital operations.
                        </p>
                        <form className="flex flex-col sm:flex-row gap-4">
                            <input
                                type="email"
                                placeholder="Enter your business email"
                                className="input-field grow bg-white/5 border-white/10"
                            />
                            <button className="btn-brand whitespace-nowrap px-8">Subscribe</button>
                        </form>
                    </div>
                </div>
            </section>
        </main>
    );
}
