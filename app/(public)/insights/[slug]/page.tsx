import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Calendar, Share2 } from "lucide-react";

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const article = await prisma.article.findUnique({
        where: { slug: params.slug },
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
                        <button className="ml-auto p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors">
                            <Share2 className="w-4 h-4" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Content Section */}
            <section className="py-20">
                <div className="section-container">
                    <div className="max-w-4xl mx-auto">
                        <div className="prose prose-invert prose-lg max-w-none text-gray-400 leading-relaxed">
                            {/* In a real app we'd render markdown or HTML from the article.content */}
                            <p className="text-xl text-white font-medium mb-12 leading-relaxed">
                                {article.excerpt || "Architecting digital systems that truly move the needle requires more than just technical proficiency. It demands a deep understanding of business outcomes and operational scalability."}
                            </p>

                            {/* Placeholder for content since we don't have a content editor yet */}
                            <div className="space-y-8">
                                <p>
                                    As digital operations become increasingly complex, the role of strategic architecture becomes paramount. We've identified several key pillars that define high-performing systems in 2026. The shift towards autonomous agents and integrated AI layers is no longer a luxury but a fundamental requirement for market leadership.
                                </p>

                                <h3 className="text-2xl font-bold text-white pt-8">The Convergence of Logic and Experience</h3>
                                <p>
                                    Technical debt is often viewed through the lens of code quality, but the most destructive form of debt is architectural mismatch. When a technical stack isn't aligned with the business's growth trajectory, it creates friction that slows down innovation.
                                </p>

                                <div className="bg-white/[0.03] border-l-4 border-agency-accent p-8 rounded-r-3xl my-12">
                                    <p className="text-white italic text-lg mb-0">
                                        "Strategy without execution is a hallucination. Execution without strategy is a nightmare. Architecture is the bridge that turns one into the other."
                                    </p>
                                </div>

                                <p>
                                    Moving forward, our focus continues to be on building foundationally sound platforms that allow for rapid iteration without sacrificing stability. This involves a rigorous process of discovery, architectural planning, and iterative deployment.
                                </p>
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
