import Link from "next/link";
import { type ReactNode } from "react";

export interface NavLinkProps {
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
            className={`group relative text-[14px] font-medium tracking-wide whitespace-nowrap transition-colors duration-300 ${isActive ? "text-white" : "text-white/70 hover:text-white"
                } ${className ?? ""}`}
        >
            {children}
            <span
                className={`absolute -bottom-1.5 left-0 h-px bg-white transition-all duration-300 ease-out ${isActive
                    ? "w-full opacity-100"
                    : "w-0 opacity-0 group-hover:w-full group-hover:opacity-100"
                    }`}
            />
        </Link>
    );
}
