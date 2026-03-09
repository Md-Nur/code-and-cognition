import type { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowUpRight, Zap, Target, Cpu, CheckCircle2 } from "lucide-react";

export const metadata: Metadata = {
    title: "Our Services | Code & Cognition — Digital Solutions for Business",
    description: "Helping businesses grow with AI solutions, digital marketing, video editing, and app/web development.",
    openGraph: {
        title: "Our Services | Code & Cognition",
        description: "Expert digital solutions including AI, marketing, video, and development to help your business grow.",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Our Services | Code & Cognition",
        description: "Smart digital solutions for modern growth: AI, marketing, video editing, and development.",
        images: ["/og-image.png"],
    },
};

const IconMap: { [key: string]: any } = {
    "Digital Platforms": Target,
    "Intelligent Automation": Cpu,
    "Growth Systems": Zap,
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
    const services = await prisma.service.findMany({
        where: { status: "ACTIVE" },
        orderBy: { order: "asc" },
    });

    const categories = [
        {
            id: "core-capabilities",
            name: "Core Capabilities",
            slug: "core",
            description: "Offering AI, marketing, video editing, app and web development to help you grow safely and quickly.",
            services: services,
        }
    ];

    return (
        <main className="bg-agency-black min-h-screen pb-32 selection:bg-agency-accent selection:text-white pt-40">
            <div className="section-container">
                {/* Header */}
                <header className="max-w-4xl mb-32">
                    <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                        Our Capabilities
                    </span>
                    <h1 className="text-5xl md:text-8xl font-bold tracking-tight text-white mb-12 leading-[1.05]">
                        Smart Tech for <br /> Your Growth.
                    </h1>
                    <p className="text-gray-400 text-xl md:text-2xl leading-relaxed max-w-3xl">
                        We don't do "generic". We build custom solutions like AI, video, marketing, and development that actually help your business grow.
                    </p>
                </header>

                {/* Categories & Services */}
                <div className="space-y-48">
                    {categories.map((category) => {
                        const Icon = IconMap[category.name] || Target;
                        return (
                            <section key={category.id} id={category.slug} className="scroll-mt-40">
                                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
                                    <div className="lg:col-span-4 lg:sticky lg:top-40 h-fit">
                                        <div className="w-16 h-16 rounded-2xl bg-agency-accent/10 flex items-center justify-center text-agency-accent mb-8">
                                            <Icon className="w-8 h-8" />
                                        </div>
                                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-8 leading-tight">
                                            {category.name}
                                        </h2>
                                        <p className="text-gray-400 text-lg leading-relaxed mb-12">
                                            {category.description}
                                        </p>
                                        <div className="flex flex-col gap-4">
                                            <Link
                                                href="/contact"
                                                className="btn-brand inline-flex items-center justify-center gap-2 px-8 py-4 w-fit"
                                            >
                                                Request Proposal <ArrowUpRight className="w-4 h-4" />
                                            </Link>
                                            <p className="text-sm text-gray-500">
                                                Or contact sales directly at <a href="mailto:sales@codencognition.com" className="text-white hover:text-agency-accent transition-colors font-medium">sales@codencognition.com</a>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="lg:col-span-8 space-y-12">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                            {category.services.map((service) => (
                                                <div
                                                    key={service.id}
                                                    className="p-10 rounded-[40px] border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-500 group"
                                                >
                                                    <h3 className="text-2xl font-bold text-white mb-6 group-hover:text-agency-accent transition-colors">
                                                        {service.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm leading-relaxed mb-10">
                                                        {service.overview || service.description}
                                                    </p>

                                                    <div className="space-y-4 mb-10">
                                                        {[
                                                            "Smart Architecture",
                                                            "Custom Building",
                                                            "Ongoing Support"
                                                        ].map(deliverable => (
                                                            <div key={deliverable} className="flex items-center gap-3 text-[11px] font-bold uppercase tracking-widest text-white/30">
                                                                <CheckCircle2 className="w-4 h-4 text-agency-accent/40" />
                                                                {deliverable}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <Link
                                                        href={`/services/${service.slug}`}
                                                        className="text-xs font-bold uppercase tracking-widest text-white/40 hover:text-white transition-colors"
                                                    >
                                                        Learn More
                                                    </Link>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </section>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
