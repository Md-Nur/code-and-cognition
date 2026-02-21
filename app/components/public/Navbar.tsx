"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import NotificationBell from "@/app/components/NotificationBell";

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

  const fetchUnreadCount = async () => {
    try {
      const res = await fetch("/api/messages/unread-count");
      if (res.ok) {
        const data = await res.json();
        setUnreadMessages(data.count);
      }
    } catch (error) {
      console.error("Failed to fetch unread count:", error);
    }
  };

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
  }, [user]);

  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isMenuOpen]);

  const navLinks = [
    { name: "Process", href: "/#process" },
    { name: "Case Studies", href: "/portfolio" },
    { name: "About", href: "/#about" },
    { name: "Insights", href: "/insights" },
    { name: "Contact", href: "/#contact" },
  ];

  const servicesGroups = [
    {
      title: "Digital Platforms",
      items: [
        {
          name: "Web Experiences",
          description: "High-trust corporate sites and portals.",
          href: "/services",
        },
        {
          name: "Product Platforms",
          description: "Scalable client-facing platforms.",
          href: "/services",
        },
        {
          name: "Commerce Systems",
          description: "Revenue-ready digital storefronts.",
          href: "/services",
        },
      ],
    },
    {
      title: "Intelligent Automation",
      items: [
        {
          name: "AI Operations",
          description: "Automate workflows and decisions.",
          href: "/services",
        },
        {
          name: "Data Intelligence",
          description: "Unify analytics and reporting.",
          href: "/services",
        },
        {
          name: "Process Orchestration",
          description: "Reduce manual handoffs.",
          href: "/services",
        },
      ],
    },
    {
      title: "Growth Systems",
      items: [
        {
          name: "Demand Strategy",
          description: "Positioning and go-to-market.",
          href: "/services",
        },
        {
          name: "Conversion Design",
          description: "Experience-led growth programs.",
          href: "/services",
        },
        {
          name: "Lifecycle Journeys",
          description: "Retention and expansion systems.",
          href: "/services",
        },
      ],
    },
  ];

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
                <Link href="/" className="flex items-center gap-2 lg:gap-3 shrink-0 group">
                  <Image
                    src="/Main-Logo.png"
                    alt="Code & Cognition Logo"
                    width={40}
                    height={40}
                    className="w-auto h-7 sm:h-8 transition-transform duration-500 group-hover:scale-105"
                    priority
                  />
                  <span className="text-[15px] sm:text-lg font-display font-medium tracking-tight whitespace-nowrap text-white">
                    Code <span className="text-agency-accent font-semibold">&</span> Cognition
                  </span>
                </Link>
              </div>

              {/* Main Navigation - Center */}
              <div className="hidden lg:flex flex-1 items-center justify-center gap-9">
                <ServicesDropdown
                  isOpen={isServicesOpen}
                  setIsOpen={setIsServicesOpen}
                  groups={servicesGroups}
                />
                {navLinks.map((link) => (
                  <NavLink
                    key={link.name}
                    href={link.href}
                    isActive={pathname === link.href || (pathname.startsWith(link.href) && link.href !== '/')}
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
                    <span className={`w-full h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? 'rotate-45 translate-y-[7.25px]' : ''}`} />
                    <span className={`w-full h-[1.5px] bg-current rounded-full transition-all duration-300 ${isMenuOpen ? 'opacity-0 translate-x-4' : 'opacity-100'}`} />
                    <span className={`w-full h-[1.5px] bg-current rounded-full transition-all duration-300 origin-center ${isMenuOpen ? '-rotate-45 -translate-y-[7.25px]' : ''}`} />
                  </div>
                </label>
              </div>
            </div>
          </div>
        </nav>
      </div>

      <div className="drawer-side z-[60]">
        <label htmlFor="mobile-drawer" aria-label="close sidebar" className="drawer-overlay"></label>
        <div className="min-h-full w-full max-w-sm bg-agency-black border-l border-white/5 shadow-2xl flex flex-col">
          <div className="flex-1 overflow-y-auto custom-scrollbar px-8 pt-24 pb-12 flex flex-col gap-y-12">
            <div className="flex flex-col gap-y-10">
              <div className="flex flex-col gap-y-6">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30">
                  Menu
                </span>
                <div className="flex flex-col gap-y-5">
                  {navLinks.map((link) => (
                    <Link
                      key={link.name}
                      href={link.href}
                      onClick={() => setIsMenuOpen(false)}
                      className="text-3xl font-display font-medium tracking-tight text-white/80 hover:text-white transition-colors"
                    >
                      {link.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="h-px w-full bg-white/5" />

              <div className="flex flex-col gap-y-8">
                <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/30">
                  Services
                </span>
                {servicesGroups.map((group) => (
                  <div key={group.title} className="flex flex-col gap-y-5">
                    <p className="text-[13px] font-medium text-white/50">
                      {group.title}
                    </p>
                    <div className="flex flex-col gap-y-4 pl-4 border-l border-white/10">
                      {group.items.map((item) => (
                        <Link
                          key={item.name}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex flex-col gap-y-1 group"
                        >
                          <span className="text-[15px] font-medium text-white/80 group-hover:text-white transition-colors">
                            {item.name}
                          </span>
                          <span className="text-[13px] text-white/40 group-hover:text-white/60 transition-colors">
                            {item.description}
                          </span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-auto pt-10 flex flex-col gap-y-4">
              {user && (
                <Link
                  href="/messages"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.02] px-5 py-4 text-sm font-medium text-white/90 transition-colors hover:bg-white/[0.04]"
                >
                  Messages
                  {unreadMessages > 0 && (
                    <span className="flex h-5 w-5 items-center justify-center rounded-full bg-agency-accent text-[10px] font-bold text-white shadow-sm">
                      {unreadMessages}
                    </span>
                  )}
                </Link>
              )}

              <div className="grid grid-cols-2 gap-x-4">
                {user ? (
                  <Link
                    href="/admin/profile"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.03] transition-colors"
                  >
                    Profile
                  </Link>
                ) : (
                  <Link
                    href="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.03] transition-colors"
                  >
                    Login
                  </Link>
                )}

                <Link
                  href="/#contact"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center justify-center rounded-xl bg-white text-agency-black px-4 py-3.5 text-sm font-semibold shadow-sm transition-transform active:scale-95"
                >
                  Book Consultation
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Components
// ─────────────────────────────────────────────────────────────────────────────

interface NavLinkProps {
  href: string;
  children: ReactNode;
  isActive?: boolean;
  onClick?: () => void;
  className?: string;
}

export function NavLink({
  href,
  children,
  isActive,
  onClick,
  className,
}: NavLinkProps) {
  return (
    <Link
      href={href}
      onClick={onClick}
      className={`group relative text-[14px] font-medium tracking-wide transition-colors duration-300 ${isActive ? "text-white" : "text-white/70 hover:text-white"
        } ${className ?? ""}`}
    >
      {children}
      <span
        className={`absolute -bottom-1.5 left-0 h-px bg-white transition-all duration-300 ease-out ${isActive ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
          }`}
      />
    </Link>
  );
}

interface ServicesDropdownProps {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  groups: {
    title: string;
    items: { name: string; description: string; href: string }[];
  }[];
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

    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
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
          className={`transition-transform duration-300 ease-out ${isOpen ? "-rotate-180 text-white" : "rotate-0 text-white/50 group-hover:text-white/80"
            }`}
        >
          <path d="m6 9 6 6 6-6" />
        </svg>
        <span
          className={`absolute -bottom-1.5 left-0 h-px bg-white transition-all duration-300 ease-out ${isOpen ? "w-full opacity-100" : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
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
            <div key={group.title} className="relative z-10 flex flex-col gap-y-6">
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
