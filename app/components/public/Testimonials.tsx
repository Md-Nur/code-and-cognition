"use client";

import { useEffect, useState } from "react";
import { Testimonial } from "@prisma/client";

export default function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        if (testimonials.length <= 1) return;
        const interval = setInterval(() => {
            setActiveIndex((current) => (current + 1) % testimonials.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [testimonials.length]);

    if (testimonials.length === 0) return null;

    return (
        <section className="section-container py-24 border-t border-white/5 overflow-hidden">
            <div className="text-center mb-16">
                <span className="section-tag mb-4">Success Stories</span>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">What Our Clients Say</h2>
            </div>

            <div className="relative max-w-4xl mx-auto px-4">
                <div className="relative h-[400px] md:h-[300px]">
                    {testimonials.map((t, i) => (
                        <div
                            key={t.id}
                            className={`absolute inset-0 transition-all duration-700 ease-in-out flex flex-col items-center text-center ${i === activeIndex
                                ? "opacity-100 translate-y-0"
                                : "opacity-0 translate-y-8 pointer-events-none"
                                }`}
                        >
                            <div className="mb-8">
                                <div className="flex justify-center gap-1 text-yellow-500 mb-6">
                                    {[...Array(5)].map((_, i) => (
                                        <span key={i} className={i < t.rating ? "text-yellow-500" : "text-gray-600"}>★</span>
                                    ))}
                                </div>
                                <blockquote className="text-xl md:text-2xl font-medium leading-relaxed text-white">
                                    "{t.content}"
                                </blockquote>
                            </div>

                            <div className="flex items-center gap-4 mt-auto">
                                {t.avatarUrl ? (
                                    <img src={t.avatarUrl} alt={t.name} className="w-14 h-14 rounded-full object-cover border-2 border-agency-accent/20" />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-white/5 flex items-center justify-center text-xl font-bold text-gray-500 border-2 border-agency-accent/20">
                                        {t.name.charAt(0)}
                                    </div>
                                )}
                                <div className="text-left">
                                    <div className="font-bold text-lg text-white">{t.name}</div>
                                    <div className="text-sm text-gray-400 font-medium">
                                        {t.role}{t.company ? ` at ${t.company}` : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Pagination Dots */}
                {testimonials.length > 1 && (
                    <div className="flex justify-center gap-3 mt-12">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => setActiveIndex(i)}
                                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 ${i === activeIndex ? "bg-agency-accent w-8" : "bg-white/20 hover:bg-white/40"
                                    }`}
                                aria-label={`Go to slide ${i + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </section>
    );
}
