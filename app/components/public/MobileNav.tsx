import Link from "next/link";
import { type NavLinkConfig, type ServiceGroup } from "./nav-config";

export interface MobileNavProps {
    isOpen: boolean;
    setIsOpen: (value: boolean) => void;
    user?: {
        id: string;
        email: string;
        role: string;
        name: string;
    } | null;
    unreadMessages: number;
    navLinks: NavLinkConfig[];
    servicesGroups: ServiceGroup[];
}

export function MobileNav({
    isOpen,
    setIsOpen,
    user,
    unreadMessages,
    navLinks,
    servicesGroups,
}: MobileNavProps) {
    return (
        <div className="drawer-side z-[60]">
            <label
                htmlFor="mobile-drawer"
                aria-label="close sidebar"
                className="drawer-overlay"
            ></label>
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
                                        onClick={() => setIsOpen(false)}
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
                                                onClick={() => setIsOpen(false)}
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
                                onClick={() => setIsOpen(false)}
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
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.03] transition-colors"
                                >
                                    Profile
                                </Link>
                            ) : (
                                <Link
                                    href="/login"
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center rounded-xl border border-white/10 bg-transparent px-4 py-3.5 text-sm font-medium text-white/80 hover:text-white hover:bg-white/[0.03] transition-colors"
                                >
                                    Login
                                </Link>
                            )}

                            <Link
                                href="/#contact"
                                onClick={() => setIsOpen(false)}
                                className="flex items-center justify-center rounded-xl bg-white text-agency-black px-4 py-3.5 text-sm font-semibold shadow-sm transition-transform active:scale-95"
                            >
                                Book Consultation
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
