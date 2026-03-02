"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";

interface LocalTimeProps {
    date: string | Date;
    formatStr?: string;
    className?: string;
    showTime?: boolean;
}

export default function LocalTime({
    date,
    formatStr = "MMM d, yyyy",
    className = "",
    showTime = false
}: LocalTimeProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    const dateObj = typeof date === "string" ? new Date(date) : date;

    // Server-side / Initial render (GMT 0 or raw ISO string if not mounted)
    if (!mounted) {
        // We render a simple span to avoid hydration mismatch
        // We can use a simplified format that doesn't depend on client locale
        return <span className={className}>{format(dateObj, formatStr)}</span>;
    }

    // Client-side render (Local browser time)
    const finalFormat = showTime ? `${formatStr}, h:mm a` : formatStr;

    return (
        <span className={className}>
            {format(dateObj, finalFormat)}
        </span>
    );
}
