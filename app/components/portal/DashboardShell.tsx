"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Role } from "@prisma/client";
import {
    LayoutDashboard,
    Settings,
    Users,
    FolderKanban,
    FileText,
    CreditCard,
    TrendingUp,
    Wrench,
    Briefcase,
    LogOut,
    Menu,
    X,
    User as UserIcon,
    Target,
    Wallet,
    MessageSquare
} from "lucide-react";

import dynamic from "next/dynamic";

const NotificationBell = dynamic(() => import("@/app/components/NotificationBell"), { ssr: false });

interface DashboardShellProps {
    children: React.ReactNode;
    user: {
        id: string;
        email: string;
        role: Role;
        isCFO: boolean;
        name: string;
    };
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
    const pathname = usePathname();
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    const getNavItems = (user: { role: Role; isCFO: boolean }) => {
        const role = user.role;
        const common = [
            { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
            { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
            { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
        ];

        let items = [];

        if (role === Role.FOUNDER || role === Role.CO_FOUNDER) {
            items = [
                { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
                { name: "Lead Database", href: "/dashboard/leads", icon: Target },
                { name: "Proposals", href: "/dashboard/proposals", icon: FileText },
                { name: "Projects", href: "/dashboard/projects", icon: FolderKanban },
                { name: "Clients", href: "/dashboard/clients", icon: Briefcase },
                { name: "Insights", href: "/dashboard/insights", icon: FileText },
                { name: "Subscribers", href: "/dashboard/subscribers", icon: Users },
                { name: "Case Studies", href: "/dashboard/case-studies", icon: FileText },
                { name: "Services", href: "/dashboard/services", icon: Wrench },
                { name: "Expenses", href: "/dashboard/expenses", icon: CreditCard },
                { name: "Ledger", href: "/dashboard/ledger", icon: TrendingUp },
                { name: "Payments", href: "/dashboard/payments", icon: CreditCard },
                { name: "Withdrawals", href: "/dashboard/withdrawals", icon: Wallet },
                { name: "Users", href: "/dashboard/users", icon: Users },
                { name: "Testimonials", href: "/dashboard/testimonials", icon: MessageSquare },
                { name: "Shares", href: "/dashboard/shares", icon: FileText },
                { name: "Profile", href: "/dashboard/profile", icon: UserIcon },
            ];
        } else if (role === Role.CONTRACTOR) {
            items = [
                ...common,
                { name: "Lead Database", href: "/dashboard/leads", icon: Target },
                { name: "Withdrawals", href: "/dashboard/withdrawals", icon: Wallet },
            ];
        } else {
            items = common;
        }

        if (user.isCFO && !items.some(i => i.name === "Payments")) {
            // Insert Payments before Profile or at the end
            const profileIndex = items.findIndex(i => i.name === "Profile");
            if (profileIndex !== -1) {
                items.splice(profileIndex, 0, { name: "Payments", href: "/dashboard/payments", icon: CreditCard });
            } else {
                items.push({ name: "Payments", href: "/dashboard/payments", icon: CreditCard });
            }
        }

        return items;
    };

    const navItems = getNavItems(user);

    return (
        <div className="min-h-screen bg-agency-black flex text-white selection:bg-agency-accent selection:text-white">
            {/* Mobile Header */}
            <header className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-agency-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between px-6 z-50">
                <Link href="/dashboard" className="flex items-center gap-2">
                    <Image
                        src="/Main-Logo.png"
                        alt="Logo"
                        width={28}
                        height={28}
                        className="w-auto h-6"
                        priority
                    />
                    <span className="text-lg font-display font-medium tracking-tight">
                        Code <span className="text-agency-accent font-semibold">&</span> Cognition
                    </span>
                </Link>
                <div className="flex items-center gap-2">
                    <NotificationBell />
                    <button
                        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                        className="p-2 text-gray-400 hover:text-white transition-colors"
                    >
                        {isSidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </header>

            {/* Sidebar Overlay */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[60] lg:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* Desktop & Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 w-64 h-full bg-agency-black border-r border-white/5 p-6 flex flex-col z-[70] lg:z-40 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
            >
                <div className="hidden lg:flex mb-10 items-center justify-between">
                    <Link href="/dashboard" className="flex items-center gap-2">
                        <Image
                            src="/Main-Logo.png"
                            alt="Logo"
                            width={32}
                            height={32}
                            className="w-auto h-7"
                            priority
                        />
                        <span className="text-xl font-display font-medium tracking-tight">
                            Code <span className="text-agency-accent font-semibold">&</span> Cognition
                        </span>
                    </Link>
                    <NotificationBell />
                </div>

                <div className="mb-4">
                    <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.2em] px-4">
                        {user.role} Portal
                    </span>
                </div>

                <nav className="flex-1 space-y-1.5 overflow-y-auto custom-scrollbar -mx-2 px-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href || (pathname.startsWith(item.href) && item.href !== "/dashboard");

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                onClick={() => setIsSidebarOpen(false)}
                                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-300 ${isActive
                                    ? "bg-agency-accent/10 text-agency-accent border border-agency-accent/20"
                                    : "text-gray-400 hover:text-white hover:bg-white/5 border border-transparent"
                                    }`}
                            >
                                <Icon className={`w-4 h-4 ${isActive ? "text-agency-accent" : "text-gray-500 group-hover:text-white"}`} />
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>

                <div className="mt-6 pt-6 border-t border-white/5 space-y-4">
                    <div className="flex items-center gap-3 px-4 py-2">
                        <div className="w-8 h-8 rounded-full bg-agency-accent/20 flex items-center justify-center text-agency-accent font-bold text-[10px]">
                            {(user?.name || "U").split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="flex flex-col min-w-0">
                            <span className="text-xs font-bold truncate">{user?.name || "User"}</span>
                            <span className="text-[10px] text-gray-500 truncate">{user.email}</span>
                        </div>
                    </div>

                    <button
                        onClick={async () => {
                            await fetch("/api/auth/logout", { method: "POST" });
                            window.location.href = "/login";
                        }}
                        className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 transition-colors group"
                    >
                        <LogOut className="w-4 h-4 text-red-400/50 group-hover:text-red-400 transition-colors" />
                        Sign Out
                    </button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 min-w-0 lg:ml-64 p-5 md:p-8 pt-24 lg:pt-8 min-h-screen bg-[#050505]">
                <div className="max-w-[1600px] mx-auto animate-in fade-in slide-in-from-bottom-4 duration-700">
                    {children}
                </div>
            </main>
        </div>
    );
}
