"use client";

import { useState } from "react";

interface Tier {
    key: string;
    label: string;
    bdt: number;
    usd: number;
    description: string | null;
    color: string;
    bg: string;
    border: string;
    featured?: boolean;
}

interface ClientPricingSwitcherProps {
    tiers: Tier[];
}

export default function ClientPricingSwitcher({ tiers }: ClientPricingSwitcherProps) {
    const [activeTier, setActiveTier] = useState<string>(tiers[1]?.key || tiers[0].key); // Default to Plus if available

    const selectedTier = tiers.find(t => t.key === activeTier) || tiers[0];

    return (
        <div className="flex flex-col gap-12">
            {/* Description and Action */}
            <div className="max-w-2xl">
                <div className="flex flex-wrap gap-2 mb-6 p-1.5 bg-white/5 rounded-2xl w-fit border border-white/5">
                    {tiers.map((tier) => (
                        <button
                            key={tier.key}
                            onClick={() => setActiveTier(tier.key)}
                            className={`px-6 py-2.5 rounded-xl text-sm font-bold uppercase tracking-wider transition-all ${activeTier === tier.key
                                ? "bg-agency-accent text-white shadow-lg shadow-agency-accent/20"
                                : "text-gray-500 hover:text-gray-300"
                                }`}
                        >
                            {tier.label}
                        </button>
                    ))}
                </div>

                <div className="min-h-[120px] mb-8">
                    <h3 className="text-2xl font-bold mb-4 flex items-center gap-3">
                        <span className={`w-2 h-2 rounded-full ${selectedTier.color.replace('text-', 'bg-')}`}></span>
                        {selectedTier.label} Package
                    </h3>
                    <p className="text-gray-400 text-lg leading-relaxed animate-in fade-in slide-in-from-left-4 duration-500">
                        {selectedTier.description || "Custom solution tailored to your requirements."}
                    </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-8 p-8 rounded-3xl bg-white/5 border border-white/10 group hover:border-agency-accent/30 transition-all">
                    <div className="text-center sm:text-left">
                        <span className="text-xs uppercase font-bold tracking-widest text-gray-500 block mb-1">Investment</span>
                        <div className="flex items-baseline gap-3">
                            <span className={`text-5xl font-bold ${selectedTier.color}`}>৳{selectedTier.bdt.toLocaleString()}</span>
                            <span className="text-gray-500 font-medium">BDT</span>
                        </div>
                        <div className="text-gray-500 mt-1 font-medium">Approx. ${selectedTier.usd} USD</div>
                    </div>

                    <div className="h-px w-full sm:w-px sm:h-16 bg-white/10"></div>

                    <div className="flex-grow w-full">
                        <a
                            href="#contact"
                            className="btn-brand w-full flex items-center justify-center gap-2 py-5 shadow-xl shadow-agency-accent/10 hover:shadow-agency-accent/30"
                        >
                            Order Now
                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12h14M12 5l7 7-7 7" />
                            </svg>
                        </a>
                    </div>
                </div>
            </div>

            {/* Visual Pricing Tiers Grid for Desktop Comparison */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 opacity-60 hover:opacity-100 transition-opacity duration-700">
                {tiers.map((tier) => (
                    <button
                        key={tier.key}
                        onClick={() => setActiveTier(tier.key)}
                        className={`text-left p-6 rounded-2xl border transition-all ${activeTier === tier.key
                            ? `bg-white/10 ${tier.border} border-opacity-50`
                            : 'bg-transparent border-white/5 hover:border-white/20'}`}
                    >
                        <div className={`text-xs font-bold uppercase tracking-widest mb-4 ${tier.color}`}>{tier.label}</div>
                        <div className="text-xl font-bold mb-1">৳{tier.bdt.toLocaleString()}</div>
                        <div className="text-xs text-gray-500">Starting price</div>
                    </button>
                ))}
            </div>
        </div>
    );
}
