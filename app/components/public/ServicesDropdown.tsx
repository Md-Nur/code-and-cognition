"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { type ServiceGroup } from "./nav-config";

export interface ServicesDropdownProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    groups: ServiceGroup[];
}

export function ServicesDropdown({
    isOpen,
    setIsOpen,
    groups,
}: ServicesDropdownProps) {
    const dropdownRef = useRef<HTMLDivElement>(null);
    const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const panelId = "services-mega-menu";

    const handleMouseLeave = () => {
        closeTimeoutRef.current = setTimeout(() => {
            setIsOpen(false);
        }, 150);
    };

    const handleMouseEnter = () => {
        if (closeTimeoutRef.current) {
            clearTimeout(closeTimeoutRef.current);
            closeTimeoutRef.current = null;
        }
        setIsOpen(true);
    };

    useEffect(() => {
        if (!isOpen) return;

        const handleClickOutside = (event: globalThis.MouseEvent) => {
            if (
                dropdownRef.current &&
                !dropdownRef.current.contains(event.target as Node)
            ) {
                setIsOpen(false);
            }
        };

        const handleEscape = (event: globalThis.KeyboardEvent) => {
            if (event.key === "Escape") {
                setIsOpen(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEscape);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEscape);
        };
    }, [isOpen, setIsOpen]);

    useEffect(() => {
        return () => {
            if (closeTimeoutRef.current) {
                clearTimeout(closeTimeoutRef.current);
            }
        };
    }, []);

    return (
        <div
            className="relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            ref={dropdownRef}
        >
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                onFocus={() => setIsOpen(true)}
                className={`group relative flex items-center gap-1.5 text-[14px] font-medium tracking-wide transition-colors duration-300 outline-none ${isOpen ? "text-white" : "text-white/70 hover:text-white"
                    }`}
                aria-expanded={isOpen}
                aria-haspopup="true"
                aria-controls={panelId}
            >
                Services
                <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className={`transition-transform duration-300 ease-out ${isOpen
                        ? "-rotate-180 text-white"
                        : "rotate-0 text-white/50 group-hover:text-white/80"
                        }`}
                >
                    <path d="m6 9 6 6 6-6" />
                </svg>
                <span
                    className={`absolute -bottom-1.5 left-0 h-px bg-white transition-all duration-300 ease-out ${isOpen
                        ? "w-full opacity-100"
                        : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                        }`}
                />
            </button>

            {/* Mega Menu Panel */}
            <div
                id={panelId}
                className={`absolute left-1/2 top-full mt-[28px] w-[850px] -translate-x-1/2 rounded-2xl border border-white/5 bg-agency-black/95 backdrop-blur-2xl shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-top pointer-events-none before:absolute before:-top-6 before:left-0 before:h-6 before:w-full ${isOpen
                    ? "opacity-100 scale-100 pointer-events-auto translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2"
                    }`}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
            >
                <div className="grid grid-cols-3 gap-x-8 p-10 relative overflow-hidden">
                    {/* Subtle background glow effect */}
                    <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-full bg-agency-accent/5 blur-[100px] rounded-full pointer-events-none" />

                    {groups.map((group) => (
                        <div
                            key={group.title}
                            className="relative z-10 flex flex-col gap-y-6"
                        >
                            <h3 className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/40 flex items-center gap-3">
                                {group.title}
                            </h3>
                            <div className="flex flex-col gap-y-2">
                                {group.items.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className="group/item flex flex-col gap-y-1.5 rounded-xl p-3 -mx-3 transition-colors duration-300 hover:bg-white/[0.04]"
                                    >
                                        <span className="text-sm font-medium text-white/90 group-hover/item:text-white transition-colors">
                                            {item.name}
                                        </span>
                                        <span className="text-[13px] text-white/60 leading-relaxed transition-colors group-hover/item:text-white/80">
                                            {item.description}
                                        </span>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
