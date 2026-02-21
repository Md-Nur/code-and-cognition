"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useRef, useState, type ReactNode } from "react";
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
      setIsScrolled(window.scrollY > 10);
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
    <nav
      className={`sticky top-0 z-100 transition-all duration-300 ${
        isScrolled || isMenuOpen
          ? "bg-agency-black/90 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)]"
          : "bg-transparent"
      }`}
      aria-label="Primary"
    >
      <div
        className={`section-container flex items-center justify-between ${isScrolled || isMenuOpen ? "py-3" : "py-5"}`}
      >
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <Image
            src="/Main-Logo.png"
            alt="Code & Cognition Logo"
            width={40}
            height={40}
            className="w-auto h-7 sm:h-8"
            priority
          />
          <span className="text-base sm:text-lg font-display font-semibold tracking-tight whitespace-nowrap">
            Code <span className="text-agency-accent">&</span> Cognition
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-8">
          <ServicesDropdown
            isOpen={isServicesOpen}
            setIsOpen={setIsServicesOpen}
            groups={servicesGroups}
          />
          {navLinks.map((link) => (
            <NavLink
              key={link.name}
              href={link.href}
              isActive={pathname === link.href}
            >
              {link.name}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/#contact"
            className="hidden md:inline-flex items-center justify-center rounded-lg bg-white/95 text-agency-black px-4 py-2 text-sm font-semibold shadow-sm shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/30"
          >
            Book Consultation
          </Link>

          {user && (
            <Link
              href="/messages"
              className="relative hidden md:inline-flex p-2 text-white/70 hover:text-white transition-colors"
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
              >
                <path d="m3 21 1.9-5.7a8.5 8.5 0 1 1 3.8 3.8z" />
              </svg>
              {unreadMessages > 0 && (
                <span className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-agency-accent text-[10px] font-bold text-white ring-2 ring-agency-black">
                  {unreadMessages}
                </span>
              )}
            </Link>
          )}

          {user && <NotificationBell />}

          {user ? (
            <Link
              href="/admin/profile"
              className="hidden md:inline-flex text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/login"
              className="hidden md:inline-flex text-sm font-medium text-white/70 hover:text-white transition-colors"
            >
              Login
            </Link>
          )}

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="inline-flex items-center justify-center p-2 text-white/70 hover:text-white transition-colors lg:hidden"
            aria-label="Toggle menu"
            aria-expanded={isMenuOpen}
          >
            {isMenuOpen ? (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            ) : (
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M3 12h18M3 6h18M3 18h18" />
              </svg>
            )}
          </button>
        </div>
      </div>

      <MobileNav
        isOpen={isMenuOpen}
        onClose={() => setIsMenuOpen(false)}
        navLinks={navLinks}
        servicesGroups={servicesGroups}
        user={user}
        unreadMessages={unreadMessages}
      />
    </nav>
  );
}

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
      className={`relative text-sm font-medium tracking-wide transition-colors ${
        isActive ? "text-white after:w-full" : "text-white/70 hover:text-white"
      } after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/70 after:transition-all after:duration-300 hover:after:w-full ${className ?? ""}`}
    >
      {children}
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
  const panelId = "services-mega-menu";

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

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        onFocus={() => setIsOpen(true)}
        className={`relative text-sm font-medium tracking-wide transition-colors ${isOpen ? "text-white" : "text-white/70 hover:text-white"} after:absolute after:left-0 after:-bottom-2 after:h-px after:w-0 after:bg-white/70 after:transition-all after:duration-300 hover:after:w-full`}
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls={panelId}
      >
        <span className="inline-flex items-center gap-2">
          Services
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={`transition-transform ${isOpen ? "rotate-180" : "rotate-0"}`}
          >
            <path d="m6 9 6 6 6-6" />
          </svg>
        </span>
      </button>

      <div
        id={panelId}
        className={`absolute left-1/2 top-[calc(100%+18px)] w-[min(960px,92vw)] -translate-x-1/2 rounded-2xl border border-white/10 bg-agency-black/95 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition-all duration-300 ${
          isOpen
            ? "opacity-100 translate-y-0 pointer-events-auto"
            : "opacity-0 translate-y-2 pointer-events-none"
        }`}
      >
        <div className="grid gap-8 p-8 md:grid-cols-3">
          {groups.map((group) => (
            <div key={group.title} className="space-y-4">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                {group.title}
              </p>
              <div className="space-y-3">
                {group.items.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsOpen(false)}
                    className="group block rounded-xl border border-white/5 bg-white/5 px-4 py-3 transition-all duration-300 hover:border-white/10 hover:bg-white/10"
                  >
                    <div className="text-sm font-semibold text-white group-hover:text-white">
                      {item.name}
                    </div>
                    <div className="text-xs text-white/60 mt-1">
                      {item.description}
                    </div>
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

interface MobileNavProps {
  isOpen: boolean;
  onClose: () => void;
  navLinks: { name: string; href: string }[];
  servicesGroups: {
    title: string;
    items: { name: string; description: string; href: string }[];
  }[];
  user?: NavbarProps["user"];
  unreadMessages: number;
}

export function MobileNav({
  isOpen,
  onClose,
  navLinks,
  servicesGroups,
  user,
  unreadMessages,
}: MobileNavProps) {
  return (
    <div
      className={`fixed inset-0 z-90 bg-agency-black/95 backdrop-blur-lg transition-transform duration-500 lg:hidden ${isOpen ? "translate-x-0" : "translate-x-full"}`}
      role="dialog"
      aria-modal="true"
    >
      <div className="flex h-full flex-col px-6 pb-10 pt-24">
        <div className="space-y-10 overflow-y-auto">
          <div className="space-y-6">
            <Link
              href="/services"
              onClick={onClose}
              className="text-3xl font-semibold tracking-tight text-white"
            >
              Services
            </Link>
            <div className="space-y-6">
              {servicesGroups.map((group) => (
                <div key={group.title} className="space-y-3">
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-white/50">
                    {group.title}
                  </p>
                  {group.items.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={onClose}
                      className="flex items-start justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white">
                          {item.name}
                        </p>
                        <p className="text-xs text-white/60 mt-1">
                          {item.description}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            {navLinks.map((link) => (
              <NavLink
                key={link.name}
                href={link.href}
                onClick={onClose}
                className="text-2xl font-semibold text-white"
              >
                {link.name}
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-8 space-y-4">
          {user && (
            <Link
              href="/messages"
              onClick={onClose}
              className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm font-semibold text-white"
            >
              Messages
              {unreadMessages > 0 && (
                <span className="flex h-6 w-6 items-center justify-center rounded-full bg-agency-accent text-xs font-bold text-white">
                  {unreadMessages}
                </span>
              )}
            </Link>
          )}

          {user ? (
            <Link
              href="/admin/profile"
              onClick={onClose}
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              Profile
            </Link>
          ) : (
            <Link
              href="/login"
              onClick={onClose}
              className="text-sm font-semibold text-white/70 hover:text-white transition-colors"
            >
              Login
            </Link>
          )}

          <Link
            href="/#contact"
            onClick={onClose}
            className="inline-flex items-center justify-center rounded-lg bg-white/95 text-agency-black px-4 py-3 text-sm font-semibold shadow-sm shadow-black/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md hover:shadow-black/30"
          >
            Book Consultation
          </Link>
        </div>
      </div>
    </div>
  );
}
