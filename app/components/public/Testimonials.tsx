import { prisma } from "@/lib/prisma";
import { Quote } from "lucide-react";

export default async function Testimonials() {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { order: "asc" },
    });

    if (testimonials.length === 0) return null;

    return (
        <section className="py-32 bg-agency-black relative overflow-hidden">
            <div className="section-container">
                <div className="text-center mb-24">
                    <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                        Social Proof
                    </span>
                    <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-white mb-6">
                        Trusted by Industry Pioneers
                    </h2>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
                        We partner with ambitious leaders to deliver technical excellence and sustainable business growth.
                    </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {testimonials.map((t) => (
                        <div
                            key={t.id}
                            className="p-10 rounded-[40px] border border-white/10 bg-white/[0.02] flex flex-col items-start"
                        >
                            <div className="w-12 h-12 rounded-2xl bg-agency-accent/10 flex items-center justify-center text-agency-accent mb-8">
                                <Quote className="w-6 h-6" />
                            </div>

                            <blockquote className="text-lg text-white/90 leading-relaxed mb-10 flex-grow italic">
                                "{t.content}"
                            </blockquote>

                            <div className="flex items-center gap-4">
                                {t.avatarUrl ? (
                                    <img
                                        src={t.avatarUrl}
                                        alt={t.name}
                                        className="w-14 h-14 rounded-full object-cover border border-white/10"
                                    />
                                ) : (
                                    <div className="w-14 h-14 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-xl font-bold text-gray-500">
                                        {t.name.charAt(0)}
                                    </div>
                                )}
                                <div>
                                    <div className="font-bold text-white mb-1">{t.name}</div>
                                    <div className="text-xs text-agency-accent font-bold uppercase tracking-widest">
                                        {t.role} {t.company ? `@ ${t.company}` : ""}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
