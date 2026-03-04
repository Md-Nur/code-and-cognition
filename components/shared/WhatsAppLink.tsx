"use client";

import { trackContactClick } from "@/lib/analytics";
import React, { AnchorHTMLAttributes } from "react";

interface WhatsAppLinkProps extends AnchorHTMLAttributes<HTMLAnchorElement> {
    href: string;
    children: React.ReactNode;
}

export default function WhatsAppLink({ href, children, ...props }: WhatsAppLinkProps) {
    const handleClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
        trackContactClick();
        if (props.onClick) {
            props.onClick(e);
        }
    };

    return (
        <a href={href} onClick={handleClick} {...props}>
            {children}
        </a>
    );
}
