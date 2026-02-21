"use client";

import { useState, useEffect, useCallback } from "react";
import { debounce } from "lodash";
import Link from "next/link";



type ServiceType = {
    id: string;
    slug: string;
    title: string;
    description: string;
    thumbnailUrl?: string | null;
    portfolioItems: { id: string; title: string; imageUrl: string | null }[];
};

const TIERS = [
    { key: "basic" as const, label: "Basic", bdtKey: "basePriceBDT" as const, usdKey: "basePriceUSD" as const, color: "text-blue-400" },
    { key: "plus" as const, label: "Plus", bdtKey: "mediumPriceBDT" as const, usdKey: "mediumPriceUSD" as const, color: "text-agency-accent" },
    { key: "pro" as const, label: "Pro", bdtKey: "proPriceBDT" as const, usdKey: "proPriceUSD" as const, color: "text-purple-400" },
];

function ServiceCard({ service }: { service: ServiceType }) {
   
    const [activeTier, setActiveTier] = useState<"basic" | "plus" | "pro">("basic");

    return (
        <div className="glass-panel p-6 sm:p-8 rounded-2xl flex flex-col h-full group hover:border-agency-accent/50 transition-all">
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

            {/* Previous Work Showcase */}
            {service.portfolioItems && service.portfolioItems.length > 0 && (
                <div className="mb-6 p-4 bg-white/5 rounded-xl border border-white/5">
                    <h4 className="text-[10px] uppercase font-bold tracking-widest text-agency-accent mb-4 px-1">Portfolio Showcase</h4>
                    <div className="grid grid-cols-3 xs:grid-cols-3 gap-2">
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

            <div className="mt-auto pt-6 border-t border-white/5 flex flex-col gap-3">
                <Link
                    href={`/services/${service.slug}`}
                    className="w-full flex items-center justify-center gap-2 py-3 rounded-full text-sm font-bold border border-white/10 hover:border-agency-accent/50 hover:bg-white/5 transition-all"
                >
                    Explore Services
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M5 12h14M12 5l7 7-7 7" />
                    </svg>
                </Link>
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
    const [services, setServices] = useState<ServiceType[]>(initialServices);
    const [searchQuery, setSearchQuery] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [isExpanded, setIsExpanded] = useState(false);

    const fetchServices = async (query: string) => {
        setIsLoading(true);
        try {
            const res = await fetch(`/api/services?q=${encodeURIComponent(query)}`);
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } catch (error) {
            console.error("Error fetching services:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Debounced search logic
    const debouncedFetch = useCallback(
        debounce((query: string) => fetchServices(query), 500),
        []
    );

    useEffect(() => {
        if (searchQuery) {
            debouncedFetch(searchQuery);
        } else {
            setServices(initialServices);
        }
    }, [searchQuery, initialServices, debouncedFetch]);

    return (
        <section id="services" className="section-container pt-12 pb-24">
            {/* Search Bar */}
            <div className="max-w-xl mx-auto mb-16 relative group">
                <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
                    <svg className={`w-5 h-5 transition-colors ${isLoading ? "text-agency-accent animate-pulse" : "text-gray-500 group-focus-within:text-agency-accent"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                </div>
                <input
                    type="text"
                    placeholder="Search for services or sub-services (e.g. SEO, Social Media...)"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-agency-accent/50 focus:bg-white/10 transition-all placeholder:text-gray-600 font-medium"
                />
                {isLoading && (
                    <div className="absolute right-4 top-1/2 -translate-y-1/2">
                        <div className="w-5 h-5 border-2 border-agency-accent/30 border-t-agency-accent rounded-full animate-spin"></div>
                    </div>
                )}
            </div>

            {services.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {(searchQuery || isExpanded ? services : services.slice(0, 3)).map((service) => (
                            <ServiceCard key={service.id} service={service} />
                        ))}
                    </div>

                    {!searchQuery && services.length > 3 && (
                        <div className="mt-16 text-center">
                            <button
                                onClick={() => setIsExpanded(!isExpanded)}
                                className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-white/5 border border-white/10 hover:border-agency-accent/50 hover:bg-white/10 transition-all font-bold group"
                            >
                                {isExpanded ? (
                                    <>
                                        Show Less
                                        <svg className="w-5 h-5 rotate-180 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </>
                                ) : (
                                    <>
                                        View All Services
                                        <svg className="w-5 h-5 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                        </svg>
                                    </>
                                )}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="text-center py-20 bg-white/5 rounded-3xl border border-dashed border-white/10">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4">
                        <svg className="w-8 h-8 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.172 9.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </div>
                    <h3 className="text-xl font-bold mb-2">No results found</h3>
                    <p className="text-gray-500">We couldn't find any services matching "{searchQuery}"</p>
                    <button
                        onClick={() => setSearchQuery("")}
                        className="mt-6 text-agency-accent font-bold hover:underline"
                    >
                        Clear search
                    </button>
                </div>
            )}
        </section>
    );
}
