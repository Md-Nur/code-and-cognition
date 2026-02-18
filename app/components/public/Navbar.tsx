"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export default function Navbar() {
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
        { name: "Services", href: "/#services" },
        { name: "Process", href: "/#process" },
        { name: "Work", href: "/#work" },
        { name: "Projects", href: "/projects" },
    ];

    if (!mounted) return null;

    return (
        <nav
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled
                ? "bg-agency-black/80 backdrop-blur-md border-b border-white/10 py-4"
                : "bg-transparent py-6"
                }`}
        >
            <div className="section-container flex items-center justify-between">
                <Link href="/" className="flex items-center gap-2">
                    <Image
                        src="/Main-Logo.png"
                        alt="Code & Cognition Logo"
                        width={40}
                        height={40}
                        className="w-auto h-8"
                        priority
                    />
                    <span className="text-xl font-display font-bold tracking-tight">
                        Code<span className="text-agency-accent">&</span>Cognition
                    </span>
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            className="text-sm font-medium text-gray-300 hover:text-white transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                </div>

                <div className="flex items-center gap-4">
                    <Link href="/#contact" className="hidden md:inline-flex btn-brand text-sm">
                        Start a Project
                    </Link>

                    <Link href="/login" className="hidden md:inline-flex text-sm font-medium text-gray-400 hover:text-white transition-colors">
                        Login
                    </Link>

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
                <div className="flex flex-col h-full pt-24 px-6 gap-8">
                    {navLinks.map((link) => (
                        <Link
                            key={link.name}
                            href={link.href}
                            onClick={() => setIsMenuOpen(false)}
                            className="text-4xl font-bold tracking-tight hover:text-agency-accent transition-colors"
                        >
                            {link.name}
                        </Link>
                    ))}
                    <div className="mt-auto pb-12 flex flex-col gap-4">
                        <Link
                            href="/login"
                            onClick={() => setIsMenuOpen(false)}
                            className="text-xl font-medium text-gray-400"
                        >
                            Login
                        </Link>
                        <Link
                            href="/#contact"
                            onClick={() => setIsMenuOpen(false)}
                            className="btn-brand text-center"
                        >
                            Start a Project
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
}
