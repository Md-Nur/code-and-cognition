"use client";

import Link from "next/link";
import { Linkedin, Mail, ArrowUp } from "lucide-react";

export default function LandingFooter() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-agency-black border-t border-white/5 pt-24 pb-12">
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="lg:col-span-1">
                        <Link href="/" className="inline-block mb-10">
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Code<span className="text-agency-accent">&</span>Cognition
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Architecting high-performance digital systems for global enterprise leaders. Focused on outcomes, powered by intelligence.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Pillars</h4>
                        <ul className="space-y-4">
                            <li><Link href="/services#platforms" className="text-gray-500 hover:text-white transition-colors text-sm">Digital Platforms</Link></li>
                            <li><Link href="/services#automation" className="text-gray-500 hover:text-white transition-colors text-sm">Intelligent Automation</Link></li>
                            <li><Link href="/services#growth" className="text-gray-500 hover:text-white transition-colors text-sm">Growth Systems</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Navigation</h4>
                        <ul className="space-y-4">
                            <li><Link href="/portfolio" className="text-gray-500 hover:text-white transition-colors text-sm">Portfolio</Link></li>
                            <li><Link href="/insights" className="text-gray-500 hover:text-white transition-colors text-sm">Insights</Link></li>
                            <li><Link href="/#consultation" className="text-gray-500 hover:text-white transition-colors text-sm">Contact</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-bold text-sm uppercase tracking-widest mb-8">Connect</h4>
                        <div className="flex flex-col gap-6">
                            <a href="mailto:hello@codencognition.com" className="group flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-sm">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-agency-accent/50 group-hover:text-agency-accent transition-all">
                                    <Mail className="w-4 h-4" />
                                </div>
                                hello@codencognition.com
                            </a>
                            <a href="https://linkedin.com/company/codencognition" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-sm">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-agency-accent/50 group-hover:text-agency-accent transition-all">
                                    <Linkedin className="w-4 h-4" />
                                </div>
                                LinkedIn Profile
                            </a>
                        </div>
                    </div>
                </div>

                <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-8">
                    <div className="text-gray-600 text-xs flex items-center gap-6">
                        <span>© {currentYear} Code & Cognition</span>
                        <Link href="/legal" className="hover:text-gray-400 transition-colors">Legal Disclosure</Link>
                        <Link href="/privacy" className="hover:text-gray-400 transition-colors">Privacy Policy</Link>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-4 text-xs font-bold uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-colors"
                    >
                        Back to top
                        <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-agency-accent/50 group-hover:text-agency-accent transition-all">
                            <ArrowUp className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    );
}
