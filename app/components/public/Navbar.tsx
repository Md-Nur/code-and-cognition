"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import NotificationBell from "@/app/components/NotificationBell";

interface NavbarProps {
    user?: {
        id: string;
        email: string;
        role: string;
        name: string;
    } | null;
}

export default function Navbar({ user }: NavbarProps) {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [mounted, setMounted] = useState(false);
    const pathname = usePathname();

    useEffect(() => {
        setMounted(true);
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const navLinks = [
        { name: "Home", href: "/" },
        { name: "Services", href: "/services" },
        { name: "Portfolio", href: "/portfolio" },
        { name: "Process", href: "/#process" },
        { name: "Track My Order", href: "/track-order" },
        { name: "About Us", href: "/about" },
        { name: "View Cart 🛒", href: "/cart" },
    ];

    if (!mounted) return null;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled || isMenuOpen
                ? "bg-agency-black/95 backdrop-blur-md border-b border-white/10 py-3 sm:py-4"
                : "bg-transparent py-4 sm:py-6"
                }`}
        >
            <div className="section-container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                    <Image
                        src="/Main-Logo.png"
                        alt="Code & Cognition Logo"
                        width={40}
                        height={40}
                        className="w-auto h-7 sm:h-8"
                        priority
                    />
                    <span className="text-lg sm:text-xl font-display font-bold tracking-tight whitespace-nowrap">
                        Code<span className="text-agency-accent">&</span>Cognition
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    {user && (
                        <Link
                            href="/messages"
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            Messages
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-2 sm:gap-4">
                    <Link href="/#contact" className="hidden md:inline-flex btn-brand text-sm">
                        Start a Project
                    </Link>

                    {user && <NotificationBell />}

                    {user?.role === "FOUNDER" ? (
                        <Link href="/admin" className="hidden md:inline-flex text-sm font-medium text-agency-accent hover:text-white transition-colors">
                            Admin
                        </Link>
                    ) : (
                        <Link href="/login" className="hidden md:inline-flex text-sm font-medium text-gray-400 hover:text-white transition-colors">
                            Login
                        </Link>
                    )}

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="p-2 text-gray-400 hover:text-white md:hidden"
                        aria-label="Toggle menu"
                    >
                        {isMenuOpen ? (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M18 6L6 18M6 6l12 12" />
                            </svg>
                        ) : (
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M3 12h18M3 6h18M3 18h18" />
                            </svg>
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            <div
                className={`fixed inset-0 bg-agency-black z-40 transition-transform duration-500 md:hidden ${isMenuOpen ? "translate-x-0" : "translate-x-full"
                    }`}
            >
                <div className="flex flex-col h-full pt-28 pb-12 px-6 gap-8 overflow-y-auto">
                    <div className="flex flex-col gap-6">
                        {navLinks.map((link) => (
                            <Link
                                key={link.name}
                                href={link.href}
                                onClick={() => setIsMenuOpen(false)}
                                className="text-3xl font-bold tracking-tight hover:text-agency-accent transition-colors"
                            >
                                {link.name}
                            </Link>
                        ))}
                        {user && (
                            <Link
                                href="/messages"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-3xl font-bold tracking-tight hover:text-agency-accent transition-colors"
                            >
                                Messages
                            </Link>
                        )}
                    </div>

                    <div className="mt-8">
                        <h4 className="text-xs uppercase font-bold tracking-widest text-agency-accent mb-6">Connect With Us</h4>
                        <div className="flex flex-wrap gap-4">
                            {[
                                {
                                    name: "Email", href: "mailto:codencognition.bd@gmail.com", icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" /><polyline points="22,6 12,13 2,6" />
                                        </svg>
                                    )
                                },
                                {
                                    name: "YouTube", href: "https://www.youtube.com/@CodeNCognitionBD", icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: "LinkedIn", href: "https://www.linkedin.com/company/codencognition", icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.454C23.205 24 24 23.227 24 22.271V1.729C24 .774 23.205 0 22.225 0z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: "Instagram", href: "https://www.instagram.com/codencognition.bd/", icon: (
                                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
                                            <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                                        </svg>
                                    )
                                },
                                {
                                    name: "Threads", href: "https://www.threads.com/@codencognition.bd", icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M12.554 11.89c-.646.012-1.072.272-1.22.747-.147.47.012.8.293 1.01.288.21.72.253 1.25.105.41-.115.88-.344 1.413-.687.01-.19.01-.383 0-.58-.012-.67-.28-1.14-.81-1.42-.5-.26-1.134-.14-1.926.34-.167.1-.337.21-.505.325.01-.013.02-.027.03-.04.493-.65.753-1.4.78-2.246.01-.32-.012-.6-.067-.837-.102-.455-.38-.722-.843-.81-.468-.09-.893.106-1.287.59-.395.485-.62 1.155-.675 2.01-.044.64.067 1.204.333 1.693.268.49.52.81 1.05 1.012-.01.01-.02.022-.03.033-.42.457-.63.953-.63 1.488 0 .54.186 1.017.558 1.433.37.416.892.624 1.564.624.717 0 1.298-.22 1.742-.663.444-.442.666-.994.666-1.656 0-.083-.004-.166-.012-.248.887.493 1.83.74 2.828.74 1.082 0 1.956-.237 2.623-.71.667-.474 1.04-1.164 1.12-2.07.033-.364.03-.73 0-1.096-.13-1.636-.8-2.91-2.01-3.82-1.21-.91-2.97-1.365-5.28-1.365-2.288 0-4.045.545-5.275 1.635-1.23 1.09-1.845 2.625-1.845 4.604 0 1.98.614 3.515 1.844 4.605 1.23 1.09 3.01 1.635 5.343 1.635.794 0 1.527-.066 2.198-.2.67-.132 1.25-.333 1.74-.602v1.734c-.4.2-.872.378-1.417.534-.545.156-1.212.234-2.0.234-3.033 0-5.385-.79-7.056-2.37-1.67-1.582-2.506-3.79-2.506-6.626s.836-5.045 2.506-6.626c1.672-1.582 4.024-2.373 7.056-2.373 2.94 0 5.176.625 6.71 1.875 1.533 1.25 2.373 3.047 2.518 5.39.02.262.02.525 0 .788-.047.88-.344 1.565-.89 2.052-.547.487-1.284.73-2.21.73-.834 0-1.53-.18-2.09-.54l-.063.15c-.41.537-1.01.805-1.8.805-.646 0-1.152-.182-1.517-.546-.364-.363-.532-.83-.503-1.4zm-.205-1.385c.133-.31.393-.457.78-.44.387.015.65.174.79.474.14.3.176.7-.107 1.05-.282.35-.615.42-.998.406-.382-.014-.627-.14-.73-.427-.103-.287-.1-.66.26-.963zm.04-3.156c.002-.4.1-.734.293-1.002.193-.267.43-.376.712-.326.28.05.503.25.666.6.163.35.215.816.215 1.397a4.26 4.26 0 0 1-.163 1.1c-.023.11-.053.22-.09.33-.245-.07-.487-.19-.727-.365-.33-.24-.59-.57-.78-.99-.19-.424-.223-.84-.126-.744z" />
                                        </svg>
                                    )
                                },
                                {
                                    name: "X", href: "https://x.com/codencognition", icon: (
                                        <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                            <path d="M18.901 1.153h3.68l-8.04 9.19L24 22.846h-7.406l-5.8-7.584-6.638 7.584H.474l8.6-9.83L0 1.154h7.594l5.243 6.932L18.901 1.153zM17.61 20.644h2.039L6.486 3.24H4.298L17.61 20.644z" />
                                        </svg>
                                    )
                                },
                            ].map((social) => (
                                <Link
                                    key={social.name}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-agency-accent hover:text-white transition-colors cursor-pointer group"
                                    title={social.name}
                                >
                                    <div className="text-gray-400 group-hover:text-white transition-colors">
                                        {social.icon}
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>

                    <div className="flex flex-col gap-4 mt-auto">
                        {user?.role === "FOUNDER" ? (
                            <Link
                                href="/admin"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl font-medium text-agency-accent hover:text-white transition-colors"
                            >
                                Admin
                            </Link>
                        ) : (
                            <Link
                                href="/login"
                                onClick={() => setIsMenuOpen(false)}
                                className="text-xl font-medium text-gray-400 hover:text-white transition-colors"
                            >
                                Login
                            </Link>
                        )}
                        <Link
                            href="/#contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="btn-brand text-center py-4"
                        >
                            Start a Project
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
