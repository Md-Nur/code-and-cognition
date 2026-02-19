"use client";

import { useState } from "react";
import { Service } from "@prisma/client";

// Partial type for frontend display since we might not fetch everything
type ServiceType = Pick<Service, "id" | "title" | "description" | "basePriceBDT" | "basePriceUSD" | "thumbnailUrl"> & {
    subCategories: { id: string, title: string }[],
    portfolioItems: { id: string, title: string, imageUrl: string | null }[]
};

export default function ServicesGrid({ initialServices }: { initialServices: ServiceType[] }) {
    const [services] = useState<ServiceType[]>(initialServices);

    return (
        <section id="services" className="section-container pt-12 pb-24">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service) => (
                    <div key={service.id} className="glass-panel p-8 rounded-2xl flex flex-col h-full group hover:border-agency-accent/50 transition-all">
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

                        <h3 className="text-2xl font-bold mb-3">{service.title}</h3>
                        <p className="text-gray-400 mb-6 line-clamp-2">{service.description}</p>

                        <div className="flex flex-wrap gap-2 mb-8">
                            {service.subCategories.map((sub) => (
                                <span key={sub.id} className="text-[10px] px-2 py-1 rounded bg-white/5 text-gray-400 uppercase tracking-wider font-semibold">
                                    {sub.title}
                                </span>
                            ))}
                        </div>

                        {/* Previous Work Showcase */}
                        {service.portfolioItems && service.portfolioItems.length > 0 && (
                            <div className="mb-8 p-4 bg-white/5 rounded-xl border border-white/5">
                                <h4 className="text-[10px] uppercase font-bold tracking-widest text-agency-accent mb-4 px-1">Previous Work</h4>
                                <div className="grid grid-cols-3 gap-3">
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

                        <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                            <div>
                                <span className="text-xs text-gray-500 uppercase font-semibold">Starting at</span>
                                <div className="text-xl font-bold text-agency-accent">
                                    ৳{service.basePriceBDT.toLocaleString()}
                                </div>
                            </div>

                            <button className="btn-brand px-6 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                                Details
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                    <path d="M5 12h14M12 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
}
