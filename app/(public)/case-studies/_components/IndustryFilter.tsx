"use client";

interface IndustryFilterProps {
    industries: string[];
    activeIndustry: string | null;
    onIndustryChange: (industry: string | null) => void;
}

export default function IndustryFilter({ industries, activeIndustry, onIndustryChange }: IndustryFilterProps) {
    return (
        <div className="flex flex-wrap gap-3 justify-center">
            <button
                onClick={() => onIndustryChange(null)}
                className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${activeIndustry === null
                        ? "bg-white text-black border-white shadow-brand"
                        : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                    }`}
            >
                All Industries
            </button>
            {industries.map((industry) => (
                <button
                    key={industry}
                    onClick={() => onIndustryChange(industry)}
                    className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-widest transition-all duration-300 border ${activeIndustry === industry
                            ? "bg-white text-black border-white shadow-brand"
                            : "bg-white/5 text-gray-400 border-white/10 hover:border-white/30 hover:text-white"
                        }`}
                >
                    {industry}
                </button>
            ))}
        </div>
    );
}
