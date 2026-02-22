import BookingForm from "@/app/components/public/BookingForm";
import { Mail, MessageSquare, Globe } from "lucide-react";

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
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1">Email</span>
                                            <a href="mailto:hello@codeandcognition.com" className="text-white font-medium hover:text-agency-accent transition-colors">hello@codeandcognition.com</a>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-6 group">
                                        <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-agency-accent group-hover:scale-110 transition-transform">
                                            <MessageSquare className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <span className="text-gray-500 text-[10px] font-bold uppercase tracking-widest block mb-1">WhatsApp</span>
                                            <a href="#" className="text-white font-medium hover:text-agency-accent transition-colors">+880 1XXX XXXXXX</a>
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

                        {/* Booking Form */}
                        <div className="lg:col-span-2">
                            <div className="glass-panel p-8 md:p-12 rounded-[40px] border border-white/10 relative overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 bg-agency-accent/10 blur-[60px] rounded-full" />
                                <div className="relative z-10">
                                    <BookingForm />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
}
