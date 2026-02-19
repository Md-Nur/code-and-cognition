"use client";

import { useState } from "react";

type SubCategory = {
    id: string;
    title: string;
    description?: string | null;
    imageUrl?: string | null;
    basePriceBDT: number;
    basePriceUSD: number;
    mediumPriceBDT: number;
    mediumPriceUSD: number;
    proPriceBDT: number;
    proPriceUSD: number;
};

type ServiceType = {
    id: string;
    title: string;
    description: string;
    thumbnailUrl?: string | null;
    subCategories: SubCategory[];
    portfolioItems: { id: string; title: string; imageUrl: string | null }[];
};

const TIERS = [
    { key: "basic" as const, label: "Basic", bdtKey: "basePriceBDT" as const, usdKey: "basePriceUSD" as const, color: "text-blue-400" },
    { key: "plus" as const, label: "Plus", bdtKey: "mediumPriceBDT" as const, usdKey: "mediumPriceUSD" as const, color: "text-agency-accent" },
    { key: "pro" as const, label: "Pro", bdtKey: "proPriceBDT" as const, usdKey: "proPriceUSD" as const, color: "text-purple-400" },
];

function ServiceCard({ service }: { service: ServiceType }) {
    const [activeSub, setActiveSub] = useState<SubCategory | null>(
        service.subCategories[0] ?? null
    );
    const [activeTier, setActiveTier] = useState<"basic" | "plus" | "pro">("basic");

    return (
        <div className="glass-panel p-8 rounded-2xl flex flex-col h-full group hover:border-agency-accent/50 transition-all">
            {/* Thumbnail */}
            <div className="mb-6 overflow-hidden rounded-xl bg-white/5 aspect-video relative">
                {service.thumbnailUrl ? (
                    <img
                        src={service.thumbnailUrl}
                        alt={service.title}
                        className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10 font-bold text-4xl uppercase tracking-tighter">
                        {service.title[0]}
                    </div>
                )}
            </div>

            <h3 className="text-2xl font-bold mb-2">{service.title}</h3>
            <p className="text-gray-400 mb-6 text-sm line-clamp-2">{service.description}</p>

            {/* Sub-service tabs */}
            {service.subCategories.length > 0 && (
                <>
                    <div className="flex flex-wrap gap-2 mb-4">
                        {service.subCategories.map((sub) => (
                            <button
                                key={sub.id}
                                onClick={() => setActiveSub(sub)}
                                className={`text-[11px] px-3 py-1.5 rounded-full border font-semibold uppercase tracking-wider transition-all ${activeSub?.id === sub.id
                                    ? "border-agency-accent bg-agency-accent/10 text-agency-accent"
                                    : "border-white/10 bg-white/5 text-gray-400 hover:border-white/20"
                                    }`}
                            >
                                {sub.title}
                            </button>
                        ))}
                    </div>

                    {/* Tier toggle + Price display */}
                    {activeSub && (
                        <div className="mb-6 p-4 rounded-xl bg-white/5 border border-white/5">
                            {activeSub.description && (
                                <p className="text-xs text-gray-500 mb-3">{activeSub.description}</p>
                            )}
                            <div className="flex gap-1 mb-4 p-1 bg-white/5 rounded-lg">
                                {TIERS.map((tier) => (
                                    <button
                                        key={tier.key}
                                        onClick={() => setActiveTier(tier.key)}
                                        className={`flex-1 text-[11px] font-bold uppercase py-1.5 rounded-md transition-all ${activeTier === tier.key
                                            ? "bg-white/10 text-white"
                                            : "text-gray-500 hover:text-gray-300"
                                            }`}
                                    >
                                        {tier.label}
                                    </button>
                                ))}
                            </div>
                            {TIERS.filter(t => t.key === activeTier).map((tier) => (
                                <div key={tier.key} className="flex items-end justify-between">
                                    <div>
                                        <div className="text-xs text-gray-500 uppercase font-semibold">Starting at</div>
                                        <div className={`text-2xl font-bold ${tier.color}`}>
                                            ৳{activeSub[tier.bdtKey].toLocaleString()}
                                        </div>
                                        <div className="text-xs text-gray-500">${activeSub[tier.usdKey]}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {/* Previous Work Showcase */}
            {service.portfolioItems && service.portfolioItems.length > 0 && (
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-agency-accent mb-4 px-1">Portfolio Showcase</h4>
                    <div className="grid grid-cols-3 gap-2">
                        {service.portfolioItems.map((item) => (
                            <div key={item.id} className="aspect-square rounded-lg bg-white/10 overflow-hidden relative group/item">
                                {item.imageUrl ? (
                                    <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover transition-transform group-hover/item:scale-110" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-500">No Image</div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="mt-auto pt-6 border-t border-white/5">
                <a
                    href="#contact"
                    className="btn-brand w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold"
                >
                    Get Started
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </a>
            </div>
        </div>
    );
}

export default function ServicesGrid({ initialServices }: { initialServices: ServiceType[] }) {
    const [services] = useState<ServiceType[]>(initialServices);

    return (
        <section id="services" className="section-container pt-12 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <ServiceCard key={service.id} service={service} />
                ))}
            </div>
        </section>
    );
}
