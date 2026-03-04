import Link from "next/link";
import { Mail, MessageSquare, Globe } from "lucide-react";
import WhatsAppLink from "@/components/shared/WhatsAppLink";

export default function ContactPage() {
    return (
        <main className="bg-agency-black min-h-screen pb-32 selection:bg-agency-accent selection:text-white">
            {/* Header */}
            <section className="pt-48 pb-20 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-agency-accent/5 rounded-full blur-[120px] opacity-20" />
                <div className="section-container relative z-10">
                    <div className="max-w-3xl">
                        <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-4 block">
                            Engagement
                        </span>
                        <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
                            Schedule Strategic <br /> Consultation
                        </h1>
                        <p className="text-gray-400 text-xl leading-relaxed">
                            Ready to transform your digital operations? Share your objectives and we'll architect a tailored roadmap for your success.
                        </p>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="section-container">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-12">
                            <div>
                                <h3 className="text-xs font-bold uppercase tracking-widest text-white/40 mb-8">Direct Communication</h3>
                                <div className="space-y-8">
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-agency-accent group-hover:scale-110 transition-transform">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Email (Sales)</span>
                                            <a href="mailto:sales@codencognition.com" className="text-white font-medium hover:text-agency-accent transition-colors">sales@codencognition.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-agency-accent group-hover:scale-110 transition-transform">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1">WhatsApp</span>
                                            <WhatsAppLink href="https://wa.me/8801603012448" className="text-white font-medium hover:text-agency-accent transition-colors">+880 1603012448</WhatsAppLink>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-agency-accent group-hover:scale-110 transition-transform">
                                            <Globe className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Based In</span>
                                            <span className="text-white font-medium">Remote First / Dhaka, BD</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8 rounded-[40px] bg-white/[0.02] border border-white/5">
                                <h4 className="text-white font-bold mb-4">Engagement Note</h4>
                                <p className="text-gray-400 text-sm leading-relaxed">
                                    We prioritize deep, meaningful partnerships over high-volume transactions. Every proposal is carefully architected by our technical founders to ensure maximum strategic alignment.
                                </p>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="lg:col-span-2">
                            <div className="glass-panel p-8 md:p-16 rounded-[40px] border border-white/10 relative overflow-hidden flex flex-col items-center justify-center text-center h-full">
                                <div className="absolute top-0 right-0 w-64 h-64 bg-agency-accent/10 blur-[80px] rounded-full" />
                                <div className="relative z-10 max-w-md">
                                    <h2 className="text-3xl font-bold text-white mb-6">Ready to Scale?</h2>
                                    <p className="text-gray-400 mb-10 leading-relaxed">Fill out our strategic qualification form to help us understand your core challenges, and you'll be able to immediately select a consultation time.</p>
                                    <Link
                                        href="/schedule"
                                        className="btn-brand px-10 py-5 rounded-full text-base font-bold shadow-2xl shadow-agency-accent/20 inline-flex items-center gap-3 hover:-translate-y-1 transition-transform w-full justify-center"
                                    >
                                        Apply for Consultation
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
