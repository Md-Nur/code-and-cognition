import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, MoveRight, CheckCircle2 } from "lucide-react";

export default async function CaseStudyPage({ params }: { params: { slug: string } }) {
    // Note: PortfolioItem doesn't have a slug yet in the schema I see, 
    // but the user's request mentioned /[slug]. I'll use id as slug for now or 
    // find workaround if title-based slug isn't there. 
    // Actually, looking at schema again, PortfolioItem only has id. 
    // I'll use ID as the identifier.

    const project = await prisma.portfolioItem.findUnique({
        where: { id: params.slug },
        include: { service: true }
    });

    if (!project) {
        notFound();
    }

    return (
        <main className="bg-agency-black min-h-screen selection:bg-agency-accent selection:text-white">
            {/* Header / Back Link */}
            <div className="section-container pt-32 pb-12">
                <Link
                    href="/case-studies"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Case Studies
                </Link>
            </div>

            {/* Hero Section */}
            <section className="pb-24">
                <div className="section-container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                                Case Study: {project.service.title}
                            </span>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-8 leading-tight">
                                {project.title}
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
                                {project.description}
                            </p>

                            <div className="flex flex-wrap gap-3 mb-12">
                                {project.technologies.map((tech) => (
                                    <span key={tech} className="px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-medium text-white/70">
                                        {tech}
                                    </span>
                                ))}
                            </div>

                            {project.projectUrl && (
                                <a
                                    href={project.projectUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn-brand inline-flex items-center gap-2"
                                >
                                    Visit Live Project <MoveRight className="w-4 h-4" />
                                </a>
                            )}
                        </div>

                        <div className="relative aspect-[4/3] rounded-[40px] overflow-hidden border border-white/10 group">
                            {project.imageUrl ? (
                                <Image
                                    src={project.imageUrl}
                                    alt={project.title}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                            ) : (
                                <div className="w-full h-full bg-gradient-to-br from-white/5 to-transparent flex items-center justify-center">
                                    <span className="text-white/10 font-bold uppercase tracking-[1em] text-2xl -rotate-12">Cognition</span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Strategic Content (Mocked fields as schema is minimal) */}
            <section className="py-24 border-t border-white/5 bg-white/[0.01]">
                <div className="section-container">
                    <div className="max-w-3xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-8">Strategic Objective</h2>
                        <p className="text-gray-400 text-lg leading-relaxed mb-12">
                            The primary focus for this engagement was to architect a solution that balances technical performance with enterprise scalability. We focused on reducing operational friction while maximizing digital output.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                            {[
                                "Architecture Modernization",
                                "Performance Optimization",
                                "Workflow Automation",
                                "Scalable Design Language"
                            ].map((item) => (
                                <div key={item} className="flex items-start gap-4 p-6 rounded-2xl bg-white/5 border border-white/5">
                                    <CheckCircle2 className="w-6 h-6 text-agency-accent shrink-0" />
                                    <span className="text-white font-medium">{item}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Call to Action */}
            <section className="py-32 border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-agency-accent/5 blur-[120px] rounded-full" />
                </div>
                <div className="section-container relative z-10 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-8">Ready to Architect Your Success?</h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto mb-16">
                        Schedule a strategic consultation to discuss how we can apply a similar methodology to your unique business objectives.
                    </p>
                    <div className="max-w-xl mx-auto text-center">
                        <Link
                            href="/schedule"
                            className="btn-brand px-12 py-5 rounded-full text-lg font-bold shadow-2xl shadow-agency-accent/20 inline-flex items-center gap-3 hover:-translate-y-1 transition-transform w-full justify-center"
                        >
                            Schedule Strategic Consultation
                            <MoveRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </main>
    );
}
