"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useState, useCallback } from "react";
import { usePathname } from "next/navigation";
import NotificationBell from "@/app/components/NotificationBell";
import { NavLink } from "./NavLink";
import { ServicesDropdown } from "./ServicesDropdown";
import { MobileNav } from "./MobileNav";
import { navLinks, servicesGroups } from "./nav-config";

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
  const [isServicesOpen, setIsServicesOpen] = useState(false);
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
      console.error("Failed to fetch unread count:", error);
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
          className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ease-out ${isScrolled || isMenuOpen
            ? "bg-agency-black/85 backdrop-blur-xl shadow-sm border-b border-white/5 py-3"
            : "bg-transparent py-5 lg:py-6"
            }`}
          aria-label="Primary"
        >
          <div className="max-w-7xl mx-auto px-5 lg:px-8">
            <div className="flex items-center justify-between">
              {/* Logo - Left */}
              <div className="flex-1 flex items-center justify-start">
                <Link
                  href="/"
                  className="flex items-center gap-2 lg:gap-3 shrink-0 group"
                >
                  <Image
                    src="/Main-Logo.png"
                    alt="Code & Cognition Logo"
                    width={40}
                    height={40}
                    className="w-auto h-7 sm:h-8 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <span className="text-[15px] sm:text-lg font-display font-medium tracking-tight whitespace-nowrap text-white">
                    Code <span className="text-agency-accent font-semibold">&</span>{" "}
                    Cognition
                  </span>
                </Link>
              </div>

              {/* Main Navigation - Center */}
              <div className="hidden lg:flex flex-[2] items-center justify-center gap-7">
                <ServicesDropdown
                  isOpen={isServicesOpen}
                  setIsOpen={setIsServicesOpen}
                  groups={servicesGroups}
                />
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    href={link.href}
                    isActive={
                      pathname === link.href ||
                      (pathname.startsWith(link.href) && link.href !== "/")
                    }
                  >
                    {link.name}
                  </NavLink>
                ))}
              </div>

              {/* CTA & Profile - Right */}
              <div className="flex-1 flex items-center justify-end gap-x-3 lg:gap-x-5">
                {user && (
                  <Link
                    href="/messages"
                    className="relative hidden md:inline-flex p-2 text-white/80 hover:text-white transition-colors group"
                    aria-label="Messages"
                  >
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="transition-transform duration-300 group-hover:-translate-y-0.5"
                    >
                      <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
                    </svg>
                    {unreadMessages > 0 && (
                      <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-agency-accent text-[10px] font-bold text-white ring-2 ring-agency-black shadow-sm">
                        {unreadMessages}
                      </span>
                    )}
                  </Link>
                )}

                {user && <NotificationBell />}

                {user ? (
                  <Link
                    href="/admin/profile"
                    className="hidden md:inline-flex text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    className="hidden md:inline-flex text-sm font-medium text-white/80 hover:text-white transition-colors"
                  >
                    Login
                  </Link>
                )}

                <Link
                  href="/#contact"
                  className="hidden md:inline-flex items-center justify-center rounded-lg bg-white text-agency-black px-5 py-2 lg:py-2.5 text-sm font-medium shadow-[0_4px_14px_0_rgba(255,255,255,0.1)] transition-all duration-300 hover:bg-white/90 hover:shadow-[0_6px_20px_rgba(255,255,255,0.15)] hover:-translate-y-0.5"
                >
                  Book Consultation
                </Link>

                <label
                  htmlFor="mobile-drawer"
                  className="inline-flex items-center justify-center p-2 text-white/80 hover:text-white transition-colors lg:hidden z-[100] relative focus:outline-none cursor-pointer"
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
        servicesGroups={servicesGroups}
      />
    </div>
  );
}
