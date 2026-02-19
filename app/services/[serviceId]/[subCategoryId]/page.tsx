import type { Metadata } from "next";
import Navbar from "../../../components/public/Navbar";
import Footer from "../../../components/public/Footer";
import BookingForm from "../../../components/public/BookingForm";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: Promise<{ serviceId: string; subCategoryId: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { subCategoryId } = await params;
    const sub = await prisma.subCategory.findUnique({
        where: { id: subCategoryId },
    });

    if (!sub) return { title: "Service Not Found" };

    return {
        title: `${sub.title} | Code & Cognition`,
        description: sub.description,
    };
}

export default async function SubCategoryDetailPage({ params }: PageProps) {
    const { serviceId, subCategoryId } = await params;
    const session = await auth();

    const subCategory = await prisma.subCategory.findUnique({
        where: { id: subCategoryId },
        include: {
            service: true,
            portfolioItems: {
                take: 6,
                orderBy: { createdAt: "desc" }
            }
        },
    });

    if (!subCategory || subCategory.serviceId !== serviceId) notFound();

    const TIERS = [
        {
            key: "basic",
            label: "Basic",
            bdt: subCategory.basePriceBDT,
            usd: subCategory.basePriceUSD,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            key: "plus",
            label: "Plus",
            bdt: subCategory.mediumPriceBDT,
            usd: subCategory.mediumPriceUSD,
            color: "text-agency-accent",
            bg: "bg-agency-accent/10",
            border: "border-agency-accent/20",
            featured: true
        },
        {
            key: "pro",
            label: "Pro",
            bdt: subCategory.proPriceBDT,
            usd: subCategory.proPriceUSD,
            color: "text-purple-400",
            bg: "bg-purple-500/10",
            border: "border-purple-500/20"
        },
    ];

    return (
        <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white">
            <Navbar user={session?.user} />

            {/* Hero Section */}
            <section className="pt-32 pb-20 border-b border-white/5 bg-gradient-to-b from-agency-accent/10 to-transparent">
                <div className="section-container">
                    <nav className="flex items-center gap-2 text-sm text-gray-500 mb-8 overflow-x-auto whitespace-nowrap pb-2 scrollbar-none">
                        <Link href="/services" className="hover:text-agency-accent transition-colors">Services</Link>
                        <span>/</span>
                        <Link href={`/services/${serviceId}`} className="hover:text-agency-accent transition-colors">{subCategory.service.title}</Link>
                        <span>/</span>
                        <span className="text-white font-medium">{subCategory.title}</span>
                    </nav>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <span className="section-tag mb-4">Service Detail</span>
                            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">{subCategory.title}</h1>
                            <p className="text-gray-400 text-lg leading-relaxed mb-8">
                                {subCategory.description}
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <a href="#pricing" className="btn-brand">View Pricing</a>
                                <a href="#contact" className="px-8 py-4 rounded-full font-bold border border-white/10 hover:border-agency-accent transition-all">Free Consultation</a>
                            </div>
                        </div>
                        <div className="relative aspect-video rounded-3xl overflow-hidden glass-panel border border-white/10">
                            {subCategory.imageUrl ? (
                                <img src={subCategory.imageUrl} alt={subCategory.title} className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-700 text-6xl font-bold uppercase tracking-tighter">
                                    {subCategory.title[0]}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Tiers */}
            <section id="pricing" className="py-24 border-b border-white/5">
                <div className="section-container">
                    <div className="text-center mb-16">
                        <span className="section-tag mb-4">Flexible Options</span>
                        <h2 className="text-4xl font-bold">Project Tiers & Pricing</h2>
                        <p className="text-gray-500 mt-4 max-w-2xl mx-auto">We offer tiered pricing to match your project size and business goals. Choose the one that fits your needs.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {TIERS.map((tier) => (
                            <div
                                key={tier.key}
                                className={`glass-panel p-8 rounded-3xl flex flex-col relative transition-transform hover:scale-[1.02] ${tier.featured ? 'border-agency-accent/50 ring-1 ring-agency-accent/20' : 'border-white/5'}`}
                            >
                                {tier.featured && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-agency-accent text-white text-[10px] uppercase font-bold px-4 py-1.5 rounded-full tracking-widest shadow-xl shadow-agency-accent/20">
                                        Most Popular
                                    </div>
                                )}
                                <div className="mb-8">
                                    <h3 className="text-2xl font-bold mb-2">{tier.label}</h3>
                                    <div className="flex items-baseline gap-2 mt-4">
                                        <span className={`text-4xl font-bold ${tier.color}`}>৳{tier.bdt.toLocaleString()}</span>
                                        <span className="text-gray-500">BDT</span>
                                    </div>
                                    <div className="text-gray-500 text-sm mt-1">Approx. ${tier.usd} USD</div>
                                </div>

                                <ul className="space-y-4 mb-10 flex-grow">
                                    {[1, 2, 3, 4].map((i) => (
                                        <li key={i} className="flex items-start gap-3 text-sm text-gray-400">
                                            <svg className={`w-5 h-5 mt-0.5 shrink-0 ${tier.color}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>Tier-specific feature {i} to be defined based on project requirements.</span>
                                        </li>
                                    ))}
                                </ul>

                                <a href="#contact" className={`w-full py-4 rounded-full font-bold text-center transition-all ${tier.featured ? 'btn-brand' : 'bg-white/5 border border-white/10 hover:border-agency-accent hover:bg-agency-accent/5'}`}>
                                    Get Started
                                </a>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Portfolio Showcase */}
            {subCategory.portfolioItems.length > 0 && (
                <section className="py-24 bg-white/2">
                    <div className="section-container">
                        <div className="flex items-center justify-between mb-12">
                            <div>
                                <h2 className="text-3xl font-bold">Recent Projects</h2>
                                <p className="text-gray-500 mt-2">See how we've helped other clients with {subCategory.title}.</p>
                            </div>
                            <Link href="/portfolio" className="text-agency-accent font-bold hover:underline hidden sm:block">View All Projects</Link>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {subCategory.portfolioItems.map((item) => (
                                <div key={item.id} className="group relative rounded-2xl overflow-hidden aspect-square glass-panel border border-white/5">
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-500">No Image</div>
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-agency-black via-agency-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex flex-col justify-end p-8">
                                        <h4 className="text-xl font-bold text-white mb-2">{item.title}</h4>
                                        <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            <BookingForm />
            <Footer />
        </main>
    );
}
