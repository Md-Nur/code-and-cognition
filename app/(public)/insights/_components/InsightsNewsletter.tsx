'use client';

import { useState, useTransition } from 'react';
import { Send, CheckCircle2 } from 'lucide-react';
import { subscribeToNewsletter } from '@/app/actions/subscribers';

export default function InsightsNewsletter() {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState<{ success?: string; error?: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append('email', email);
            const result = await subscribeToNewsletter(formData);

            if (result.success) {
                setEmail('');
                setMessage({ success: result.success });
            } else {
                setMessage({ error: result.error });
            }
        });
    };

    return (
        <section className="py-20 mt-20">
            <div className="section-container">
                <div className="relative overflow-hidden rounded-[40px] border border-white/10 bg-white/[0.02] p-12 md:p-20 text-center glass-panel">
                    {/* Background Decorative Elements */}
                    <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden opacity-20">
                        <div className="absolute -top-24 -left-24 w-96 h-96 bg-agency-accent/20 rounded-full blur-[100px]" />
                        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-agency-accent/10 rounded-full blur-[100px]" />
                    </div>

                    <div className="relative z-10 max-w-2xl mx-auto">
                        <span className="text-agency-accent font-bold uppercase tracking-[0.3em] text-[10px] mb-6 block">
                            The Intelligence Report
                        </span>
                        <h2 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                            Get the latest insights <br className="hidden md:block" /> delivered to your inbox
                        </h2>
                        <p className="text-gray-400 text-lg mb-10 leading-relaxed">
                            Join a community of digital leaders. Subscribe to receive our curated analysis on automation, technical strategy, and enterprise growth.
                        </p>

                        {message?.success ? (
                            <div className="flex flex-col items-center gap-4 animate-fade-in">
                                <CheckCircle2 className="w-12 h-12 text-agency-accent" />
                                <p className="text-white font-bold">{message.success}</p>
                            </div>
                        ) : (
                            <div className="max-w-md mx-auto">
                                <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                                    <input
                                        type="email"
                                        required
                                        name="email"
                                        disabled={isPending}
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-6 py-4 focus:border-agency-accent/50 focus:outline-none text-white placeholder-gray-600 transition-all duration-300 focus:bg-white/[0.08] disabled:opacity-50"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isPending}
                                        className="group relative flex items-center justify-center gap-2 px-8 py-4 bg-white text-black font-bold rounded-2xl hover:scale-105 active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:hover:scale-100"
                                    >
                                        {isPending ? 'Subscribing...' : 'Subscribe'}
                                        {!isPending && <Send className="w-4 h-4 transition-transform group-hover:translate-x-1" />}
                                    </button>
                                </form>
                                {message?.error && (
                                    <p className="mt-4 text-red-500 text-sm font-medium animate-fade-in">{message.error}</p>
                                )}
                            </div>
                        )}

                        <p className="mt-8 text-gray-600 text-[10px] uppercase tracking-widest font-medium">
                            NO SPAM. JUST PURE INTELLIGENCE. UNFOLLOW AT ANY TIME.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
