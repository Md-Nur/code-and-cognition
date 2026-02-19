import type { Metadata } from "next";
import Navbar from "../../../components/public/Navbar";
import Footer from "../../../components/public/Footer";
import BookingForm from "../../../components/public/BookingForm";
import ClientPricingSwitcher from "../../../components/public/ClientPricingSwitcher";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { notFound } from "next/navigation";
import Link from "next/link";

interface PageProps {
    params: Promise<{ serviceSlug: string; subCategorySlug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { subCategorySlug } = await params;
    const sub = await prisma.subCategory.findUnique({
        where: { slug: subCategorySlug },
    });

    if (!sub) return { title: "Service Not Found" };

    return {
        title: `${sub.title} | Code & Cognition`,
        description: sub.description,
    };
}

export default async function SubCategoryDetailPage({ params }: PageProps) {
    const { serviceSlug, subCategorySlug } = await params;
    const session = await auth();

    const subCategory = await prisma.subCategory.findUnique({
        where: { slug: subCategorySlug },
        include: {
            service: true,
            portfolioItems: {
                take: 6,
                orderBy: { createdAt: "desc" }
            }
        },
    });

    if (!subCategory || subCategory.service.slug !== serviceSlug) notFound();

    const TIERS = [
        {
            key: "basic",
            label: "Basic",
            bdt: subCategory.basePriceBDT,
            usd: subCategory.basePriceUSD,
            description: subCategory.description,
            color: "text-blue-400",
            bg: "bg-blue-500/10",
            border: "border-blue-500/20"
        },
        {
            key: "plus",
            label: "Plus",
            bdt: subCategory.mediumPriceBDT,
            usd: subCategory.mediumPriceUSD,
            description: subCategory.mediumDescription || subCategory.description,
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
            description: subCategory.proDescription || subCategory.description,
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
                        <Link href={`/services/${serviceSlug}`} className="hover:text-agency-accent transition-colors">{subCategory.service.title}</Link>
                        <span>/</span>
                        <span className="text-white font-medium">{subCategory.title}</span>
                    </nav>

                    <div className="flex flex-col gap-12">
                        {/* Image above Heading */}
                        <div className="w-full max-w-5xl aspect-video sm:aspect-[21/9] rounded-[2rem] overflow-hidden glass-panel border border-white/10 shadow-2xl relative group">
                            {subCategory.imageUrl ? (
                                <img src={subCategory.imageUrl} alt={subCategory.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-white/5 text-gray-700 text-8xl font-bold uppercase tracking-tighter">
                                    {subCategory.title[0]}
                                </div>
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-agency-black via-transparent to-transparent opacity-60"></div>
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-1 gap-12">
                            <div>
                                <span className="section-tag mb-4">Service Detail</span>
                                <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-12">{subCategory.title}</h1>

                                {/* Dynamic Pricing Switcher */}
                                <ClientPricingSwitcher tiers={TIERS} />
                            </div>
                        </div>
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
