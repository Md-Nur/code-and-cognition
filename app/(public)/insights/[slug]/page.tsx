import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";
import { PremiumMarkdown } from "@/components/shared/PremiumMarkdown";
import { ShareButton } from "@/components/shared/ShareButton";
import { calculateReadingTime } from "@/lib/utils/reading-time";
import { ReadingProgressBar } from "@/components/shared/ReadingProgressBar";
import { TableOfContents } from "@/components/shared/TableOfContents";
import Image from "next/image";
import SimpleNewsletterForm from "../_components/SimpleNewsletterForm";

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
        twitter: {
            card: "summary_large_image",
            title: article.title,
            description: article.excerpt || undefined,
            images: article.thumbnailUrl ? [article.thumbnailUrl] : ["/og-image.png"],
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

    const readingTime = calculateReadingTime(article.content + (article.excerpt || ""));

    return (
        <main className="bg-agency-black min-h-screen pb-32 selection:bg-agency-accent selection:text-white relative">
            <ReadingProgressBar />

            {/* Hero Section */}
            <div className="relative pt-32 pb-20 overflow-hidden border-b border-white/5">
                {/* Background Effects */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl px-4 pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-agency-accent/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-[-10%] left-[-10%] w-[400px] h-[400px] bg-agency-accent/5 rounded-full blur-[100px]" />
                </div>

                <div className="section-container relative z-10">
                    <Link
                        href="/insights"
                        className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-white transition-colors group mb-12"
                    >
                        <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
                        Back to Insights
                    </Link>

                    <div className="grid lg:grid-cols-12 gap-12 items-end">
                        <div className="lg:col-span-8">
                            <div className="flex flex-wrap items-center gap-4 mb-8">
                                <span className="section-tag mb-0 lowercase first-letter:uppercase tracking-normal font-medium py-1">
                                    {article.category}
                                </span>
                                <div className="h-3 w-px bg-white/10" />
                                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2">
                                    <Calendar className="w-3 h-3" />
                                    {article.publishedAt.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                                </span>
                                <div className="h-3 w-px bg-white/10 hidden sm:block" />
                                <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 hidden sm:flex">
                                    <Clock className="w-3 h-3" />
                                    {readingTime} Min Read
                                </span>
                            </div>

                            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-12 strategic-heading">
                                {article.title}
                            </h1>

                            <div className="flex items-center justify-between gap-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-agency-accent font-bold text-sm shadow-xl">
                                        CC
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-white text-xs font-bold uppercase tracking-widest">Code & Cognition</span>
                                        <span className="text-gray-500 text-[10px] uppercase tracking-wider font-medium">Strategic Analysis</span>
                                    </div>
                                </div>
                                <ShareButton title={article.title} text={article.excerpt || "Read our latest insight"} />
                            </div>
                        </div>

                        {article.thumbnailUrl && (
                            <div className="lg:col-span-4 hidden lg:block">
                                <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-white/10 shadow-huge group">
                                    <Image
                                        src={article.thumbnailUrl}
                                        alt={article.title}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                        sizes="(max-width: 1024px) 100vw, 33vw"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-agency-black/80 via-transparent to-transparent opacity-60" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-24">
                <div className="section-container">
                    <div className="grid lg:grid-cols-12 gap-16">
                        {/* Sidebar */}
                        <aside className="lg:col-span-3 hidden lg:block">
                            <div className="sticky top-32 space-y-12">
                                <TableOfContents />

                                <div className="px-4 pt-12 border-t border-white/5">
                                    <h3 className="text-white text-xs font-bold uppercase tracking-widest mb-6">Share Insight</h3>
                                    <div className="flex items-center gap-3">
                                        <ShareButton title={article.title} text={article.excerpt || "Read our latest insight"} />
                                    </div>
                                </div>
                            </div>
                        </aside>

                        {/* Article Text */}
                        <div className="lg:col-span-9">
                            <div className="max-w-3xl">
                                {article.excerpt && (
                                    <p className="text-xl md:text-2xl text-white font-medium mb-16 leading-relaxed opacity-90">
                                        {article.excerpt}
                                    </p>
                                )}
                                <div className="premium-markdown">
                                    <PremiumMarkdown content={article.content} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Articles Section */}
            <RelatedArticles currentSlug={slug} category={article.category} />

            {/* Newsletter CTA */}
            <section className="py-24 border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-x-0 bottom-0 h-[300px] bg-gradient-to-t from-agency-accent/5 to-transparent pointer-events-none" />
                <div className="section-container relative z-10">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="text-3xl font-bold text-white mb-6">Stay Ahead of the Curve</h2>
                        <p className="text-gray-400 mb-10">
                            Join our monthly mailing list for exclusive strategic insights on AI, automation, and enterprise digital operations.
                        </p>
                        <SimpleNewsletterForm />
                    </div>
                </div>
            </section>
        </main>
    );
}

async function RelatedArticles({ currentSlug, category }: { currentSlug: string; category: string }) {
    const related = await prisma.article.findMany({
        where: {
            category,
            NOT: { slug: currentSlug },
        },
        take: 2,
        orderBy: { publishedAt: 'desc' },
    });

    if (related.length === 0) return null;

    return (
        <section className="py-24 border-t border-white/5">
            <div className="section-container">
                <div className="flex items-end justify-between mb-12">
                    <div>
                        <span className="section-tag mb-4">Continue Reading</span>
                        <h2 className="text-3xl font-bold text-white">Related Insights</h2>
                    </div>
                    <Link href="/insights" className="text-agency-accent text-sm font-bold uppercase tracking-widest hover:text-white transition-colors">
                        View All
                    </Link>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                    {related.map((item) => (
                        <Link
                            key={item.id}
                            href={`/insights/${item.slug}`}
                            className="group premium-card p-1 overflow-hidden"
                        >
                            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                                {item.thumbnailUrl && (
                                    <Image
                                        src={item.thumbnailUrl}
                                        alt={item.title}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                )}
                                <div className="absolute inset-0 bg-agency-black/20 group-hover:bg-transparent transition-colors" />
                            </div>
                            <div className="p-6">
                                <span className="text-[10px] font-bold text-agency-accent uppercase tracking-widest mb-3 block">
                                    {item.category}
                                </span>
                                <h3 className="text-xl text-white group-hover:text-agency-accent transition-colors mb-4 line-clamp-2">
                                    {item.title}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2">
                                    {item.excerpt}
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>
        </section>
    );
}
