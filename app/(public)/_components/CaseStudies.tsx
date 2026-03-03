import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";

export default async function CaseStudies() {
    const cases = await prisma.caseStudy.findMany({
        where: {
            isFeatured: true,
            status: "PUBLISHED"
        },
        take: 3,
        orderBy: { createdAt: "desc" },
    });

    if (cases.length === 0) return null;

    return (
        <section className="py-32 bg-agency-black">
            <div className="section-container">
                <div className="flex flex-col md:flex-row justify-between items-end gap-12 mb-20">
                    <div className="max-w-2xl">
                        <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                            Portfolio
                        </span>
                        <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                            Engineering Value for <br /> Global Market Leaders
                        </h2>
                        <p className="text-gray-400 text-lg leading-relaxed">
                            Explore how we've helped ambitious companies architect digital systems that drive measurable business results.
                        </p>
                    </div>
                    <Link
                        href="/case-studies"
                        className="group flex items-center gap-3 text-sm font-bold uppercase tracking-widest text-white/60 hover:text-white transition-colors"
                    >
                        See All Case Studies
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-agency-accent/50 group-hover:text-agency-accent transition-all">
                            <ArrowUpRight className="w-5 h-5" />
                        </div>
                    </Link>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
                    {cases.map((item) => (
                        <div key={item.id} className="group relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.02]">
                            <div className="aspect-[4/3] overflow-hidden relative">
                                {item.coverImage ? (
                                    <Image
                                        src={item.coverImage}
                                        alt={item.title}
                                        fill
                                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                        className="object-cover transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                                        No Image
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60" />

                                {/* Tech Stack Overlay on Hover */}
                                <div className="absolute inset-0 bg-agency-black/90 p-10 flex flex-col justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                    <span className="text-agency-accent font-bold uppercase tracking-widest text-[10px] mb-6">Tech Stack</span>
                                    <div className="flex flex-wrap gap-3">
                                        {item.techStack.map(tech => (
                                            <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs text-white/70">
                                                {tech}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div className="p-10">
                                <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-agency-accent transition-colors">
                                    {item.title}
                                </h3>
                                <p className="text-gray-400 text-sm leading-relaxed mb-8 line-clamp-2">
                                    {item.summary}
                                </p>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="w-1.5 h-1.5 rounded-full bg-agency-accent" />
                                        <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">{item.highlightMetric || "Growth Performance"}</span>
                                    </div>
                                    <Link
                                        href={`/case-studies/${item.slug}`}
                                        className="text-xs font-bold uppercase tracking-widest text-agency-accent hover:text-white transition-colors"
                                    >
                                        View Case
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
