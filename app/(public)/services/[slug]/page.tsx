import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MoveRight, CheckCircle2, Shield, Zap, Target } from "lucide-react";
import BookingForm from "@/app/components/public/BookingForm";

export default async function ServiceDetailPage({ params }: { params: { slug: string } }) {
    const service = await prisma.service.findUnique({
        where: { slug: params.slug },
        include: {
            category: true,
            engagementModels: {
                where: { status: "ACTIVE" },
                orderBy: { order: "asc" }
            }
        }
    });

    if (!service) {
        notFound();
    }

    return (
        <main className="bg-agency-black min-h-screen pb-32 selection:bg-agency-accent selection:text-white">
            {/* Nav */}
            <div className="section-container pt-32 pb-12">
                <Link
                    href="/services"
                    className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-white transition-colors group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to All Services
                </Link>
            </div>

            {/* Hero */}
            <section className="pb-24">
                <div className="section-container">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-center">
                        <div className="max-w-2xl">
                            <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                                {service.category.name}
                            </span>
                            <h1 className="text-4xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
                                {service.title}
                            </h1>
                            <p className="text-gray-400 text-lg md:text-xl leading-relaxed mb-10">
                                {service.positioningText || service.description}
                            </p>
                            <Link href="#request-proposal" className="btn-brand inline-flex items-center gap-3 px-8 py-4">
                                Request Proposal <MoveRight className="w-4 h-4" />
                            </Link>
                        </div>

                        <div className="grid grid-cols-1 gap-6">
                            {[
                                { title: "Strategic Discovery", desc: "Rigorous analysis of business requirements and technical constraints.", icon: Target },
                                { title: "Custom Architecture", desc: "Bespoke system design tailored for enterprise scalability.", icon: Zap },
                                { title: "Managed Execution", desc: "Founder-led implementation with precision and transparency.", icon: Shield },
                            ].map((item, i) => (
                                <div key={i} className="p-8 rounded-3xl bg-white/5 border border-white/5 flex gap-6 items-start">
                                    <div className="w-12 h-12 rounded-xl bg-agency-accent/10 flex items-center justify-center text-agency-accent shrink-0">
                                        <item.icon className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-bold mb-2">{item.title}</h3>
                                        <p className="text-gray-500 text-sm leading-relaxed">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Methodology Content */}
            <section className="py-24 border-t border-white/5 bg-white/[0.01]">
                <div className="section-container">
                    <div className="max-w-4xl mx-auto">
                        <h2 className="text-3xl font-bold text-white mb-12">Our Methodology</h2>
                        <div className="space-y-12">
                            <p className="text-gray-400 text-lg leading-relaxed">
                                {service.overview || "We approach every engagement with a mindset focused on long-term scalability and immediate operational impact. Our methodology is designed to reduce technical debt while accelerating market readiness."}
                            </p>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                {service.engagementModels.length > 0 ? service.engagementModels.map(model => (
                                    <div key={model.id} className="p-10 rounded-[40px] border border-white/5 bg-agency-black group">
                                        <h4 className="text-xl font-bold text-white mb-6 group-hover:text-agency-accent transition-colors">{model.name}</h4>
                                        <p className="text-gray-500 text-sm mb-8 leading-relaxed">{model.description}</p>
                                        <ul className="space-y-4">
                                            {model.deliverables.map(item => (
                                                <li key={item} className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-widest text-white/30">
                                                    <CheckCircle2 className="w-4 h-4 text-agency-accent/40" />
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )) : (
                                    <div className="md:col-span-2 p-10 rounded-[40px] border border-dashed border-white/10 text-center">
                                        <p className="text-gray-500">Customized engagement models available upon consultation.</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Request Proposal Section */}
            <section id="request-proposal" className="py-32 border-t border-white/5 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-agency-accent/5 blur-[120px] rounded-full" />
                </div>
                <div className="section-container relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <h2 className="text-4xl md:text-5xl font-bold text-white">Initiate Strategic Request</h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            Share your objectives for {service.title} and receive a tailored proposal architected by our founders.
                        </p>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/10">
                            <BookingForm />
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
