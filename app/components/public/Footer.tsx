"use client";

import Link from "next/link";
import Image from "next/image";
import { Linkedin, Mail, ArrowUp, Facebook, Youtube, Instagram, Twitter } from "lucide-react";

export default function Footer() {
    const currentYear = new Date().getFullYear();

    const scrollToTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <footer className="bg-black border-t border-white/[0.05] pt-32 pb-16">
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-20 mb-32">
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-4 mb-10 group">
                            <Image
                                src="/Main-Logo.png"
                                alt="Code & Cognition Logo"
                                width={32}
                                height={32}
                                className="w-auto h-8 transition-transform duration-500 group-hover:scale-105"
                            />
                            <span className="text-2xl font-bold tracking-tight text-white">
                                Code<span className="text-agency-accent">&</span>Cognition
                            </span>
                        </Link>
                        <p className="text-gray-500 text-sm leading-relaxed max-w-xs">
                            Architecting high-performance digital systems for global enterprise leaders. Engineered for yield, powered by intelligence.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10">Capabilities</h4>
                        <ul className="space-y-5">
                            <li><Link href="/services#platforms" className="text-gray-500 hover:text-white transition-all text-xs font-semibold">Industrial-Grade Platforms</Link></li>
                            <li><Link href="/services#automation" className="text-gray-500 hover:text-white transition-all text-xs font-semibold">Autonomous Operations</Link></li>
                            <li><Link href="/services#growth" className="text-gray-500 hover:text-white transition-all text-xs font-semibold">Result Engineering</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10">Intelligence</h4>
                        <ul className="space-y-5">
                            <li><Link href="/portfolio" className="text-gray-500 hover:text-white transition-all text-xs font-semibold">Engagements</Link></li>
                            <li><Link href="/insights" className="text-gray-500 hover:text-white transition-all text-xs font-semibold">Deep Dives</Link></li>
                            <li><Link href="/about" className="text-gray-500 hover:text-white transition-all text-xs font-semibold">Our DNA</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-10">Strategic Access</h4>
                        <div className="flex flex-col gap-8">
                            <a href="mailto:codencognition.bd@gmail.com" className="group flex items-center gap-4 text-gray-500 hover:text-white transition-all text-xs font-semibold">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-agency-accent group-hover:text-white transition-all duration-500">
                                    <Mail className="w-4 h-4" />
                                </div>
                                Inquiry
                            </a>
                            <div className="flex items-center gap-4">
                                {[
                                    { icon: Linkedin, href: "https://linkedin.com/company/codencognition" },
                                    { icon: Facebook, href: "https://www.facebook.com/CodeNCognition" },
                                    { icon: Youtube, href: "https://www.youtube.com/@CodeNCognitionBD" },
                                    { icon: Instagram, href: "https://www.instagram.com/codencognition.bd/" }
                                ].map((social, i) => (
                                    <a key={i} href={social.href} target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center text-gray-500 hover:bg-white/[0.08] hover:text-white transition-all duration-300">
                                        <social.icon className="w-4 h-4" />
                                    </a>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-16 border-t border-white/[0.05] flex flex-col md:flex-row justify-between items-center gap-10">
                    <div className="flex items-center gap-10">
                        <span className="text-gray-600 text-[10px] font-black uppercase tracking-widest">© {currentYear} C&C</span>
                        <div className="flex gap-8">
                            <Link href="/legal" className="text-gray-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider">Legal</Link>
                            <Link href="/privacy" className="text-gray-600 hover:text-white transition-colors text-[10px] font-bold uppercase tracking-wider">Privacy</Link>
                        </div>
                    </div>

                    <button
                        onClick={scrollToTop}
                        className="group flex items-center gap-5 text-[10px] font-black uppercase tracking-[0.3em] text-gray-500 hover:text-white transition-all"
                    >
                        Ascend
                        <div className="w-12 h-12 rounded-full bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-agency-accent group-hover:text-white transition-all duration-500">
                            <ArrowUp className="w-4 h-4" />
                        </div>
                    </button>
                </div>
            </div>
        </footer>
    );
}

