"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";

type AdminShellProps = {
  children: React.ReactNode;
};

export default function AdminShell({ children }: AdminShellProps) {
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "/", icon: "🏠" },
    { name: "Dashboard", href: "/admin", icon: "📊" },
    { name: "Services", href: "/admin/services", icon: "🛠️" },
    { name: "Testimonials", href: "/admin/testimonials", icon: "💬" },
    { name: "Clients", href: "/admin/clients", icon: "🏢" },
    { name: "Projects", href: "/admin/projects", icon: "🚀" },
    { name: "Portfolio", href: "/admin/portfolio", icon: "🎨" },
    { name: "Payments", href: "/admin/payments", icon: "💰" },
    { name: "Expenses", href: "/admin/expenses", icon: "💸" },
    { name: "Ledger", href: "/admin/ledger", icon: "📈" },
    { name: "Users", href: "/admin/users", icon: "👥" },
    { name: "Bookings", href: "/admin/bookings", icon: "📩" },
    { name: "Profile", href: "/admin/profile", icon: "👤" },
  ];

  return (
    <div className="min-h-screen bg-agency-black flex">
      {/* Mobile Header */}
      <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-agency-gray/80 backdrop-blur-md border-b border-white/5 flex items-center justify-between px-6 z-50">
        <Link href="/admin" className="flex items-center gap-2 shrink-0">
          <Image
            src="/Main-Logo.png"
            alt="Code & Cognition Logo"
            width={32}
            height={32}
            className="w-auto h-7"
            priority
          />
          <span className="text-xl font-display font-bold tracking-tight whitespace-nowrap">
            Code<span className="text-agency-accent">&</span>Cognition
          </span>
        </Link>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 text-gray-400 hover:text-white"
        >
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
            {isSidebarOpen ? (
              <path d="M18 6L6 18M6 6l12 12" />
            ) : (
              <path d="M3 12h18M3 6h18M3 18h18" />
            )}
          </svg>
        </button>
      </header>

      {/* Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-55 lg:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`fixed top-0 left-0 w-64 h-full bg-agency-gray/50 border-r border-white/5 p-6 flex flex-col z-60 lg:z-40 transition-transform duration-300 lg:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="hidden lg:block">
          <Link
            href="/admin"
            className="flex items-center gap-2 mb-10 shrink-0"
          >
            <Image
              src="/Main-Logo.png"
              alt="Code & Cognition Logo"
              width={32}
              height={32}
              className="w-auto h-7"
              priority
            />
            <span className="text-xl font-display font-bold tracking-tight whitespace-nowrap">
              Code<span className="text-agency-accent">&</span>Cognition
            </span>
          </Link>
        </div>
        <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4 mt-2">
          Management
        </span>

        <nav className="flex-1 space-y-1 overflow-y-auto custom-scrollbar">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setIsSidebarOpen(false)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? "bg-agency-accent/10 text-agency-accent border border-agency-accent/20"
                    : "text-gray-400 hover:text-white hover:bg-white/5"
                }`}
              >
                <span>{item.icon}</span>
                {item.name}
              </Link>
            );
          })}
        </nav>

        <div className="mt-auto pt-6 border-t border-white/5">
          <button
            onClick={async () => {
              await fetch("/api/auth/logout", { method: "POST" });
              window.location.href = "/login";
            }}
            className="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <span>🚪</span>
            Log Out
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-8 pt-24 lg:pt-8 min-h-screen">
        <div className="max-w-7xl mx-auto">{children}</div>
      </main>
    </div>
  );
}
