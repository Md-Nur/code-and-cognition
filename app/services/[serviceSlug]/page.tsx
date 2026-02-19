import type { Metadata } from "next";
import Navbar from "../../components/public/Navbar";
import Footer from "../../components/public/Footer";
import SubCategoryCard from "../../components/public/SubCategoryCard";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: Promise<{ serviceSlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { serviceSlug } = await params;
    const service = await prisma.service.findUnique({
        where: { slug: serviceSlug },
    });

    if (!service) return { title: "Service Not Found" };

    return {
        title: `${service.title} | Services | Code & Cognition`,
        description: service.description,
    };
}

export default async function ServiceDetailPage({ params }: PageProps) {
    const { serviceSlug } = await params;
    const session = await auth();

    const service = await prisma.service.findUnique({
        where: { slug: serviceSlug },
        include: {
            subCategories: {
                orderBy: { title: "asc" },
            },
        },
    });

    if (!service) notFound();

    return (
        <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white">
            <Navbar user={session?.user} />

            <section className="pt-32 pb-20 border-b border-white/5 bg-gradient-to-b from-agency-accent/5 to-transparent">
                <div className="section-container">
                    <Link
                        href="/services"
                        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-agency-accent mb-8 transition-colors"
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M19 12H5M12 19l-7-7 7-7" />
                        </svg>
                        Back to Services
                    </Link>

                    <div className="flex flex-col gap-12">
                        {/* Image above Heading */}
                        <div className="w-full max-w-4xl aspect-[21/9] rounded-3xl overflow-hidden glass-panel border border-white/10 shadow-2xl">
                            {service.thumbnailUrl ? (
                                <img src={service.thumbnailUrl} alt={service.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-800 text-6xl font-bold uppercase tracking-tighter">
                                    {service.title[0]}
                                </div>
                            )}
                        </div>

                        <div className="max-w-3xl">
                            <span className="section-tag mb-4">Service Category</span>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{service.title}</h1>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                {service.description}
                            </p>
                            <a href="#solutions" className="btn-brand">
                                Explore {service.title}
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            <section id="solutions" className="py-24">
                <div className="section-container">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="text-3xl font-bold">Solutions Provided</h2>
                            <p className="text-gray-500 mt-2">Choose a specific service to see details and pricing.</p>
                        </div>
                    </div>

                    {service.subCategories.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {service.subCategories.map((sub) => (
                                <SubCategoryCard
                                    key={sub.id}
                                    serviceSlug={service.slug}
                                    subCategory={sub as any}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                            <p className="text-gray-500">No specific services found in this category yet.</p>
                        </div>
                    )}
                </div>
            </section>

            <Footer />
        </main>
    );
}
