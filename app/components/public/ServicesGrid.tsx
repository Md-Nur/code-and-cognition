"use client";

import { useEffect, useState } from "react";
import { Service } from "@prisma/client";

// Partial type for frontend display since we might not fetch everything
type ServiceType = Pick<Service, "id" | "title" | "description" | "basePriceBDT" | "basePriceUSD" | "thumbnailUrl">;

export default function ServicesGrid() {
    const [services, setServices] = useState<ServiceType[]>([]);
    const [loading, setLoading] = useState(true);
    const [currency, setCurrency] = useState<"BDT" | "USD">("BDT");

    useEffect(() => {
        async function fetchServices() {
            try {
                const res = await fetch("/api/services");
                if (res.ok) {
                    const data = await res.json();
                    setServices(data);
                }
            } catch (error) {
                console.error("Failed to fetch services", error);
            } finally {
                setLoading(false);
            }
        }
        fetchServices();
    }, []);

    return (
        <section id="services" className="section-container py-20">
            <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
                <div>
                    <span className="section-tag mb-4">Our Expertise</span>
                    <h2 className="text-4xl font-bold tracking-tight">Services & Pricing</h2>
                </div>

                {/* Currency Toggle */}
                <div className="currency-toggle">
                    <button
                        onClick={() => setCurrency("BDT")}
                        className={`currency-btn ${currency === "BDT" ? "active" : ""}`}
                    >
                        BDT ৳
                    </button>
                    <button
                        onClick={() => setCurrency("USD")}
                        className={`currency-btn ${currency === "USD" ? "active" : ""}`}
                    >
                        USD $
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="glass-card h-80 animate-pulse bg-white/5" />
                    ))}
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {services.map((service) => (
                        <div key={service.id} className="glass-card p-6 flex flex-col h-full group hover:shadow-xl transition-all duration-300">
                            <div className="h-12 w-12 bg-agency-accent/10 rounded-lg flex items-center justify-center mb-6 text-2xl group-hover:scale-110 transition-transform">
                                🚀
                            </div>

                            <h3 className="text-xl font-bold mb-3">{service.title}</h3>
                            <p className="text-gray-400 text-sm mb-6 flex-grow">{service.description}</p>

                            <div className="mt-auto pt-6 border-t border-white/5 flex items-center justify-between">
                                <div>
                                    <span className="text-xs text-gray-500 uppercase font-semibold">Starting at</span>
                                    <div className="text-xl font-bold text-agency-accent">
                                        {currency === "BDT"
                                            ? `৳${service.basePriceBDT.toLocaleString()}`
                                            : `$${service.basePriceUSD.toLocaleString()}`
                                        }
                                    </div>
                                </div>

                                <button className="btn-ghost p-2 rounded-full hover:bg-agency-accent hover:text-white">
                                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M5 12h14M12 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}
