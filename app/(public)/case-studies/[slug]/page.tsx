import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MoveRight, Layers, Target, Shield, Cpu, Zap, BarChart3, ChevronRight } from "lucide-react";
import ReactMarkdown from "react-markdown";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ slug: string }>;
}): Promise<Metadata> {
    const { slug } = await params;
    const project = await prisma.caseStudy.findUnique({
        where: { slug },
    });

    if (!project) {
        return {
            title: "Case Study Not Found | Code & Cognition",
        };
    }

    return {
        title: `${project.title} | Case Study | Code & Cognition`,
        description: project.summary,
        openGraph: {
            title: project.title,
            description: project.summary,
            images: project.coverImage ? [project.coverImage] : [],
        },
    };
}

export default async function CaseStudyPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;

    const project = await prisma.caseStudy.findUnique({
        where: {
            slug,
            status: "PUBLISHED"
        }
    });

    if (!project) {
        notFound();
    }

    const sections = [
        { id: "summary", title: "Overview", icon: Target },
        { id: "challenge", title: "The Challenge", icon: Shield },
        { id: "approach", title: "Our Approach", icon: Layers },
        { id: "solution", title: "The Solution", icon: Zap },
        { id: "results", title: "Results & Impact", icon: BarChart3 },
    ];

    return (
        <main className="bg-black min-h-screen pt-32 selection:bg-agency-accent selection:text-white pb-24">
            {/* Hero Section */}
            <section className="relative h-[80vh] min-h-[600px] flex items-center overflow-hidden border-b border-white/5">
                <div className="absolute inset-0 z-0">
                    {project.coverImage && (
                        <Image
                            src={project.coverImage}
                            alt={project.title}
                            fill
                            className="object-cover opacity-40 grayscale hover:grayscale-0 transition-all duration-1000"
                            priority
                        />
                    )}
                    <div className="absolute inset-0 bg-linear-to-b from-black via-black/60 to-black" />
                </div>

                <div className="section-container relative z-10 w-full">
                    <div className="max-w-4xl">
                        <Link
                            href="/case-studies"
                            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors mb-12 group"
                        >
                            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                            Back to Case Studies
                        </Link>

                        <div className="flex items-center gap-4 mb-6">
                            <span className="section-tag mb-0">{project.industry}</span>
                            <div className="h-px w-12 bg-white/20" />
                            <span className="text-white/40 text-[10px] font-bold uppercase tracking-[0.2em]">Execution Case Study</span>
                        </div>

                        <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight leading-[1.1]">
                            {project.title}
                        </h1>

                        <p className="text-xl md:text-2xl text-agency-accent font-medium leading-relaxed max-w-2xl border-l-2 border-agency-accent pl-8">
                            {project.summary}
                        </p>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/20 animate-bounce">
                    <span className="text-[10px] uppercase tracking-[0.5em] font-bold">Scroll</span>
                    <div className="w-px h-12 bg-white/20" />
                </div>
            </section>

            <div className="section-container mt-24">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                    {/* Sticky Sidebar (TOC) */}
                    <aside className="lg:col-span-3 hidden lg:block">
                        <div className="sticky top-40 space-y-8">
                            <div>
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Contents</h4>
                                <nav className="flex flex-col gap-4">
                                    {sections.map((section) => (
                                        <a
                                            key={section.id}
                                            href={`#${section.id}`}
                                            className="group flex items-center gap-3 text-sm text-gray-500 hover:text-white transition-colors"
                                        >
                                            <div className="w-2 h-2 rounded-full bg-agency-accent/0 group-hover:bg-agency-accent transition-all" />
                                            {section.title}
                                        </a>
                                    ))}
                                </nav>
                            </div>

                            <div className="pt-8 border-t border-white/5">
                                <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/40 mb-6">Tech Stack</h4>
                                <div className="flex flex-wrap gap-2">
                                    {project.techStack.map((tech) => (
                                        <span key={tech} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] text-white/70 font-medium">
                                            {tech}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </aside>

                    {/* Content Sections */}
                    <div className="lg:col-span-9 space-y-32">
                        {sections.map((section) => {
                            const content = (project as any)[section.id];
                            if (!content && section.id !== "solution") return null; // Solution is mapped from implementation logic but exists in Prisma
                            const Icon = section.icon;

                            return (
                                <section key={section.id} id={section.id} className="scroll-mt-40 animate-fade-in">
                                    <div className="flex items-center gap-4 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-agency-accent/10 border border-agency-accent/20 flex items-center justify-center text-agency-accent">
                                            <Icon className="w-6 h-6" />
                                        </div>
                                        <h2 className="text-3xl font-bold text-white tracking-tight">{section.title}</h2>
                                    </div>

                                    <div className="prose prose-invert max-w-none">
                                        <div className="text-lg text-gray-400 leading-relaxed">
                                            <ReactMarkdown>{content}</ReactMarkdown>
                                        </div>
                                    </div>

                                    {section.id === "solution" && project.architectureImage && (
                                        <div className="mt-12 relative aspect-video rounded-3xl overflow-hidden border border-white/10 group">
                                            <Image
                                                src={project.architectureImage}
                                                alt="Technical Architecture Diagram"
                                                fill
                                                className="object-cover transition-transform duration-700 group-hover:scale-105"
                                            />
                                        </div>
                                    )}

                                    {section.id === "results" && (
                                        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
                                            <div className="p-8 premium-card">
                                                <BarChart3 className="w-8 h-8 text-agency-accent mb-4" />
                                                <h4 className="text-2xl font-bold text-white mb-2">{project.highlightMetric}</h4>
                                                <p className="text-sm text-gray-500">Key performance improvement validated post-launch.</p>
                                            </div>
                                            <div className="p-8 bg-white/5 rounded-3xl border border-white/10 flex items-center justify-center">
                                                <div className="text-center">
                                                    <span className="text-white/20 text-4xl font-bold uppercase tracking-widest rotate-12 block">Verified</span>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </section>
                            );
                        })}

                        {/* Mobile Tech Stack (Visible only on small screens) */}
                        <section className="lg:hidden border-t border-white/10 pt-12">
                            <h2 className="text-2xl font-bold text-white mb-8">Tech Stack</h2>
                            <div className="flex flex-wrap gap-3">
                                {project.techStack.map((tech) => (
                                    <span key={tech} className="px-4 py-2 bg-white/5 border border-white/10 rounded-full text-xs text-white/70 font-medium">
                                        {tech}
                                    </span>
                                ))}
                            </div>
                        </section>

                        {/* CTA Section */}
                        <section className="py-24 premium-card p-12 relative overflow-hidden text-center group">
                            <div className="absolute inset-0 bg-agency-accent/5 blur-[100px] pointer-events-none group-hover:bg-agency-accent/10 transition-colors duration-700" />

                            <h2 className="text-4xl font-bold text-white mb-6 relative z-10">Architecting Your Success</h2>
                            <p className="text-gray-400 text-lg max-w-xl mx-auto mb-10 relative z-10">
                                Ready to see similar results for your business? Let's discuss your technical challenges and build something exceptional together.
                            </p>

                            <div className="flex flex-wrap gap-4 justify-center relative z-10">
                                <Link href="/schedule" className="btn-brand">
                                    Start a Project <MoveRight className="ml-2 w-4 h-4" />
                                </Link>
                                <Link href="/services" className="btn-outline group">
                                    Our Services <ChevronRight className="ml-1 w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </Link>
                            </div>
                        </section>
                    </div>
                </div>
            </div>
        </main>
    );
}
