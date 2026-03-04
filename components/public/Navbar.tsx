"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import NotificationBell from "@/components/NotificationBell";
import { NavLink } from "./NavLink";

import { MobileNav } from "./MobileNav";
import { navLinks } from "./nav-config";

// Types
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

  const [unreadMessages, setUnreadMessages] = useState(0);
  const pathname = usePathname();

  const fetchUnreadCount = useCallback(async () => {
    try {
      const res = await fetch("/api/messages/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnreadMessages(data.count);
      }
    } catch (error) {
      alert("Failed to fetch unread count");
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);

    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 30000);
      return () => {
        window.removeEventListener("scroll", handleScroll);
        clearInterval(interval);
      };
    }

    return () => window.removeEventListener("scroll", handleScroll);
  }, [user, fetchUnreadCount]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  return (
    <div className="drawer drawer-end">
      <input
        id="mobile-drawer"
        type="checkbox"
        className="drawer-toggle"
        checked={isMenuOpen}
        onChange={(e) => setIsMenuOpen(e.target.checked)}
      />
      <div className="drawer-content flex flex-col">
        <nav
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${isScrolled || isMenuOpen
            ? "bg-black/90 backdrop-blur-2xl border-b border-white/[0.05] py-4"
            : "bg-transparent py-6 lg:py-8"
            }`}
          aria-label="Primary"
        >
          <div className="section-container">
            <div className="flex items-center justify-between">
              {/* Logo - Left */}
              <div className="flex-shrink-0 lg:flex-1 flex items-center justify-start">
                <Link
                  href="/"
                  className="flex items-center gap-2 sm:gap-3 lg:gap-4 shrink-0 group"
                >
                  <Image
                    src="/Main-Logo.png"
                    alt="Code & Cognition Logo"
                    width={32}
                    height={32}
                    className="w-auto h-7 sm:h-8 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <span className="text-base sm:text-lg font-bold tracking-tight text-white hidden xs:block">
                    Code<span className="text-agency-accent font-black">&</span>Cognition
                  </span>
                </Link>
              </div>

              {/* Main Navigation - Center */}
              <div className="hidden lg:flex flex-[2] items-center justify-center gap-10">
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    href={link.href}
                    isActive={
                      pathname === link.href ||
                      (pathname.startsWith(link.href) && link.href !== "/")
                    }
                  >
                    <span className="text-[11px] font-black uppercase tracking-[0.2em]">
                      {link.name}
                    </span>
                  </NavLink>
                ))}
              </div>

              {/* CTA & Profile - Right */}
              <div className="flex-shrink-0 lg:flex-1 flex items-center justify-end gap-x-3 sm:gap-x-4 lg:gap-x-6">
                {user && <span className="hidden md:block"><NotificationBell /></span>}

                {user && (
                  <Link
                    href="/dashboard/profile"
                    className="hidden lg:inline-flex text-[11px] font-black uppercase tracking-[0.2em] text-white/50 hover:text-white transition-colors"
                  >
                    Account
                  </Link>
                )}

                <Link
                  href="/schedule"
                  className="hidden lg:inline-flex btn-brand scale-90 xxl:scale-100 whitespace-nowrap"
                >
                  Apply Now
                </Link>

                <label
                  htmlFor="mobile-drawer"
                  className="inline-flex items-center justify-center p-2 pt-2.5 text-white/80 hover:text-white transition-colors lg:hidden z-[100] relative focus:outline-none cursor-pointer flex-shrink-0"
                  aria-label="Toggle menu"
                >
                  <div className="relative w-6 h-[16px] flex flex-col justify-between overflow-hidden">
                    <span
                      className={`w-full h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? "rotate-45 translate-y-[7.25px]" : ""
                        }`}
                    />
                    <span
                      className={`w-full h-[1.5px] bg-current rounded-full transition-all duration-300 ${isMenuOpen ? "opacity-0 translate-x-4" : "opacity-100"
                        }`}
                    />
                    <span
                      className={`w-full h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? "-rotate-45 -translate-y-[7.25px]" : ""
                        }`}
                    />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <MobileNav
        isOpen={isMenuOpen}
        setIsOpen={setIsMenuOpen}
        user={user}
        unreadMessages={unreadMessages}
        navLinks={navLinks}
      />
    </div>
  );
}

