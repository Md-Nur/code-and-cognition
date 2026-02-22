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
        <footer className="bg-agency-black border-t border-white/5 pt-24 pb-12">
            <div className="section-container">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center gap-3 mb-10 group">
                            <Image
                                src="/Main-Logo.png"
                                alt="Code & Cognition Logo"
                                width={32}
                                height={32}
                                className="w-auto h-7 transition-transform duration-500 group-hover:scale-105"
                            />
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
                            <a href="mailto:codencognition.bd@gmail.com" className="group flex items-center gap-3 text-gray-500 hover:text-white transition-colors text-sm">
                                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-agency-accent/50 group-hover:text-agency-accent transition-all">
                                    <Mail className="w-4 h-4" />
                                </div>
                                codencognition.bd@gmail.com
                            </a>
                            <div className="grid grid-cols-3 gap-4">
                                <a href="https://linkedin.com/company/codencognition" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-agency-accent/50 hover:text-agency-accent transition-all" title="LinkedIn">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                                <a href="https://www.facebook.com/CodeNCognition" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-agency-accent/50 hover:text-agency-accent transition-all" title="Facebook">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="https://www.youtube.com/@CodeNCognitionBD" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-agency-accent/50 hover:text-agency-accent transition-all" title="YouTube">
                                    <Youtube className="w-4 h-4" />
                                </a>
                                <a href="https://www.instagram.com/codencognition.bd/" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-agency-accent/50 hover:text-agency-accent transition-all" title="Instagram">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="https://www.threads.net/@codencognition.bd" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-agency-accent/50 hover:text-agency-accent transition-all" title="Threads">
                                    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path d="M12.186 24h-.007c-3.581-.024-6.334-1.205-8.184-3.509C2.35 18.44 1.5 15.586 1.472 12.01v-.017c.03-3.579.879-6.43 2.525-8.482C5.845 1.205 8.6.024 12.18 0h.014c2.746.02 5.043.725 6.826 2.098 1.677 1.29 2.858 3.13 3.509 5.467l-2.04.569c-1.104-3.96-3.898-5.984-8.304-6.015-2.91.022-5.11.936-6.54 2.717C4.307 6.504 3.616 8.914 3.589 12c.027 3.086.718 5.496 2.057 7.164 1.43 1.783 3.631 2.698 6.54 2.717 2.623-.02 4.358-.631 5.8-2.045 1.647-1.613 1.618-3.593 1.09-4.798-.31-.71-.873-1.3-1.634-1.75-.192 1.352-.622 2.446-1.284 3.272-.886 1.102-2.14 1.704-3.73 1.79-1.202.065-2.361-.218-3.259-.801-1.063-.689-1.685-1.74-1.752-2.964-.065-1.19.408-2.285 1.33-3.082.88-.76 2.119-1.207 3.583-1.291a13.853 13.853 0 0 1 3.02.142c-.126-.742-.375-1.332-.75-1.757-.513-.586-1.308-.883-2.359-.89h-.029c-.844 0-1.992.232-2.721 1.32L7.734 7.847c.98-1.454 2.568-2.256 4.478-2.256h.044c3.194.02 5.097 1.975 5.287 5.388.108.046.216.094.321.142 1.49.7 2.58 1.761 3.154 3.07.797 1.82.871 4.79-1.548 7.158-1.85 1.81-4.094 2.628-7.277 2.65Zm1.003-11.69c-.242 0-.487.007-.739.021-1.836.103-2.98.946-2.916 2.143.067 1.256 1.452 1.839 2.784 1.767 1.224-.065 2.818-.543 3.086-3.71a10.5 10.5 0 0 0-2.215-.221z" />
                                    </svg>
                                </a>
                                <a href="https://x.com/codencognition" target="_blank" rel="noopener noreferrer" className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center text-gray-500 hover:text-white hover:border-agency-accent/50 hover:text-agency-accent transition-all" title="X (Twitter)">
                                    <Twitter className="w-4 h-4" />
                                </a>
                            </div>
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
