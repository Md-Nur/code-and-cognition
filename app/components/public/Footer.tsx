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
                            <li><Link href="/case-studies" className="text-gray-500 hover:text-white transition-all text-xs font-semibold">Engagements</Link></li>
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
                            <Link href="/schedule" className="group flex items-center gap-4 text-gray-500 hover:text-white transition-all text-xs font-semibold">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-center group-hover:bg-agency-accent group-hover:text-white transition-all duration-500">
                                    <svg
                                        width="16"
                                        height="16"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        className="w-4 h-4"
                                    >
                                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                        <line x1="16" y1="2" x2="16" y2="6" />
                                        <line x1="8" y1="2" x2="8" y2="6" />
                                        <line x1="3" y1="10" x2="21" y2="10" />
                                    </svg>
                                </div>
                                Schedule
                            </Link>
                            <div className="flex items-center gap-4">
                                {[
                                    { icon: Linkedin, href: "https://linkedin.com/company/codencognition" },
                                    {
                                        icon: (props: any) => (
                                            <svg {...props} viewBox="0 0 24 24" fill="currentColor">
                                                <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932 6.064-6.932zm-1.292 19.49h2.039L6.486 3.24H4.298l13.311 17.403z" />
                                            </svg>
                                        ),
                                        href: "https://x.com/codencognition"
                                    },
                                    {
                                        icon: (props: any) => (
                                            <svg {...props} viewBox="0 0 192 192" fill="currentColor">
                                                <path d="M141.537 88.9883C140.71 88.5919 139.87 88.2104 139.019 87.8451C137.537 60.5382 122.616 44.905 97.5619 44.745C97.4484 44.7443 97.3355 44.7443 97.222 44.7443C82.2364 44.7443 69.7731 51.1409 62.102 62.7807L75.881 72.2328C81.6116 63.5383 90.6052 61.6848 97.2286 61.6848C97.3051 61.6848 97.3819 61.6848 97.4576 61.6855C105.707 61.7381 111.932 64.1366 115.961 68.814C118.893 72.2193 120.854 76.925 121.825 82.8638C114.511 81.6207 106.601 81.2385 98.145 81.7233C74.3247 83.0954 59.0111 96.9879 60.0396 116.292C60.5615 126.084 65.4397 134.508 73.775 140.011C80.8224 144.663 89.899 146.938 99.3323 146.423C111.79 145.74 121.563 140.987 128.381 132.296C133.559 125.696 136.834 117.143 138.28 106.366C144.217 109.949 148.617 114.664 151.047 120.332C155.179 129.967 155.42 145.8 142.501 158.708C131.182 170.016 117.576 174.908 97.0135 175.059C74.2042 174.89 56.9538 167.575 45.7381 153.317C35.2355 139.966 29.8077 120.682 29.6052 96C29.8077 71.3178 35.2355 52.0336 45.7381 38.6827C56.9538 24.4249 74.2039 17.11 97.0132 16.9405C119.988 17.1113 137.539 24.4614 149.184 38.788C154.894 45.8136 159.199 54.6488 162.037 64.9503L178.184 60.6422C174.744 47.9622 169.331 37.0357 161.965 27.974C147.036 9.60668 125.202 0.195148 97.0695 0H96.9569C68.8816 0.19447 47.2921 9.6418 32.7883 28.0793C19.8819 44.4864 13.2244 67.3157 13.0007 95.9325L13 96L13.0007 96.0675C13.2244 124.684 19.8819 147.514 32.7883 163.921C47.2921 182.358 68.8816 191.806 96.9569 192H97.0695C122.03 191.827 139.624 185.292 154.118 170.811C173.081 151.866 172.51 128.119 166.26 113.541C161.776 103.087 153.227 94.5962 141.537 88.9883ZM98.4405 129.507C88.0005 130.095 77.1544 125.409 76.6196 115.372C76.2232 107.93 81.9158 99.626 99.0812 98.6368C101.047 98.5234 102.976 98.468 104.871 98.468C111.106 98.468 116.939 99.0737 122.242 100.233C120.264 124.935 108.662 128.946 98.4405 129.507Z" />
                                            </svg>
                                        ),
                                        href: "https://www.threads.net/@codencognition.bd"
                                    },
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

