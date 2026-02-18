"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";


export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const navItems = [
        { name: "Dashboard", href: "/admin", icon: "📊" },
        { name: "Services", href: "/admin/services", icon: "🛠️" },
        { name: "Projects", href: "/admin/projects", icon: "🚀" },
        { name: "Portfolio", href: "/admin/portfolio", icon: "🎨" },
        { name: "Payments", href: "/admin/payments", icon: "💰" },
        { name: "Ledger", href: "/admin/ledger", icon: "📈" },
        { name: "Users", href: "/admin/users", icon: "👥" },
        { name: "Bookings", href: "/admin/bookings", icon: "📩" },
    ];

    return (
        <div className="min-h-screen bg-agency-black flex">
            <aside className="fixed top-0 left-0 w-64 h-full bg-agency-gray/50 border-r border-white/5 p-6 flex flex-col z-50">
                <Link href="/admin" className="text-xl font-display font-bold tracking-tight mb-10">
                    Code<span className="text-agency-accent">&</span>Cognition
                </Link>
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-4">Management</span>

                <nav className="flex-1 space-y-1">
                    {navItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${isActive
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

            <main className="flex-1 ml-64 p-8">
                <div className="max-w-7xl mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
}
