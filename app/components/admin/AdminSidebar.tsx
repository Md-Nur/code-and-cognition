"use client";

import { usePathname } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";

const navItems = [
    { href: "/admin", label: "Dashboard", icon: "📊", exact: true },
    { href: "/admin/services", label: "Services", icon: "🛠️" },
    { href: "/admin/bookings", label: "Bookings", icon: "📥" },
    { href: "/admin/projects", label: "Projects", icon: "📁" },
    { href: "/admin/payments", label: "Payments", icon: "💳" },
    { href: "/admin/ledger", label: "Ledger & Analytics", icon: "📈" },
    { href: "/admin/users", label: "Team", icon: "👥" },
];

export default function AdminSidebar() {
    const pathname = usePathname();
    const { data: session } = useSession();

    const isActive = (href: string, exact?: boolean) =>
        exact ? pathname === href : pathname.startsWith(href);

    return (
        <aside className="admin-sidebar">
            {/* Logo */}
            <div
                style={{
                    padding: "24px 20px",
                    borderBottom: "1px solid var(--color-border)",
                }}
            >
                <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                        style={{
                            width: 36,
                            height: 36,
                            borderRadius: 10,
                            background: "var(--gradient-brand)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "1.1rem",
                        }}
                    >
                        ⚡
                    </div>
                    <div>
                        <div className="font-display" style={{ fontWeight: 700, fontSize: "0.9rem", color: "var(--color-text)" }}>
                            Code &amp; Cognition
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>Admin Portal</div>
                    </div>
                </Link>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: "16px 12px", display: "flex", flexDirection: "column", gap: "4px" }}>
                <div style={{ fontSize: "0.7rem", fontWeight: 600, color: "var(--color-text-subtle)", textTransform: "uppercase", letterSpacing: "0.08em", padding: "8px 4px", marginBottom: "4px" }}>
                    Management
                </div>
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={`sidebar-link ${isActive(item.href, item.exact) ? "active" : ""}`}
                    >
                        <span style={{ fontSize: "1rem" }}>{item.icon}</span>
                        {item.label}
                    </Link>
                ))}
            </nav>

            {/* User Info */}
            <div
                style={{
                    padding: "16px 12px",
                    borderTop: "1px solid var(--color-border)",
                }}
            >
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "10px 12px",
                        background: "var(--color-bg-elevated)",
                        borderRadius: "10px",
                        marginBottom: "8px",
                    }}
                >
                    <div
                        style={{
                            width: 32,
                            height: 32,
                            borderRadius: "50%",
                            background: "var(--gradient-brand)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "0.9rem",
                            fontWeight: 700,
                            color: "white",
                            flexShrink: 0,
                        }}
                    >
                        {session?.user?.name?.[0] ?? "A"}
                    </div>
                    <div style={{ minWidth: 0 }}>
                        <div style={{ fontSize: "0.85rem", fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                            {session?.user?.name ?? "Admin"}
                        </div>
                        <div style={{ fontSize: "0.7rem", color: "var(--color-text-muted)" }}>
                            {session?.user?.role === "FOUNDER" ? "Founder" : "Contractor"}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => signOut({ callbackUrl: "/login" })}
                    className="sidebar-link"
                    style={{ width: "100%", border: "none", background: "none", textAlign: "left" }}
                >
                    <span>🚪</span> Sign Out
                </button>
            </div>
        </aside>
    );
}
