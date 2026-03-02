"use client";

import { useState, useMemo } from "react";
import CaseStudyCard from "@/app/components/public/CaseStudyCard";
import IndustryFilter from "@/app/components/public/IndustryFilter";
import { caseStudies } from "@/lib/data/case-studies";
import { MoveRight } from "lucide-react";

export default function CaseStudiesListing() {
    const [activeIndustry, setActiveIndustry] = useState<string | null>(null);

    const industries = useMemo(() => {
        const set = new Set(caseStudies.map((cs) => cs.industry));
        return Array.from(set);
    }, []);

    const filteredCaseStudies = useMemo(() => {
        if (!activeIndustry) return caseStudies;
        return caseStudies.filter((cs) => cs.industry === activeIndustry);
    }, [activeIndustry]);

    return (
        <section className="py-24 relative overflow-hidden">
            {/* Background Glows */}
            <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-agency-accent/5 blur-[120px] rounded-full pointer-events-none" />
            <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-white/5 blur-[120px] rounded-full pointer-events-none" />

            <div className="section-container relative z-10">
                {/* Header Section */}
                <div className="max-w-4xl mx-auto text-center mb-20 animate-fade-in">
                    <span className="section-tag">Case Studies</span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
                        Strategic <span className="text-agency-accent">Impact</span>, Measured.
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl leading-relaxed max-w-2xl mx-auto">
                        Explore our portfolio of enterprise transformations, where high-performance engineering meets strategic digital architectural design.
                    </p>
                </div>

                {/* Filter Section */}
                <div className="mb-16 animate-slide-up animation-delay-100">
                    <IndustryFilter
                        industries={industries}
                        activeIndustry={activeIndustry}
                        onIndustryChange={setActiveIndustry}
                    />
                </div>

                {/* Grid Section */}
                {filteredCaseStudies.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-slide-up animation-delay-200">
                        {filteredCaseStudies.map((cs) => (
                            <CaseStudyCard key={cs.id} caseStudy={cs} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 premium-card animate-fade-in">
                        <div className="max-w-md mx-auto">
                            <h3 className="text-3xl font-bold text-white mb-4">No Case Studies Found</h3>
                            <p className="text-gray-500 mb-8">
                                We're currently expanding our portfolio in this industry. Check back soon for new enterprise success stories.
                            </p>
                            <button
                                onClick={() => setActiveIndustry(null)}
                                className="btn-brand"
                            >
                                View All Case Studies
                            </button>
                        </div>
                    </div>
                )}

                {/* Infinite Scroll / More Button (Mocked) */}
                {filteredCaseStudies.length > 0 && (
                    <div className="mt-20 text-center animate-fade-in animation-delay-500">
                        <button className="btn-outline group">
                            Load More
                            <MoveRight className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                        </button>
                    </div>
                )}
            </div>
        </section>
    );
}
