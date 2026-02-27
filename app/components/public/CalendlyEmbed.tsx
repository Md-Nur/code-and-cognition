"use client";

import { useEffect } from "react";

interface CalendlyEmbedProps {
    url: string;
}

export default function CalendlyEmbed({ url }: CalendlyEmbedProps) {
    useEffect(() => {
        const head = document.querySelector("head");
        const script = document.createElement("script");
        script.setAttribute(
            "src",
            "https://assets.calendly.com/assets/external/widget.js",
        );
        head?.appendChild(script);

        return () => {
            head?.removeChild(script);
        };
    }, []);

    return (
        <div
            className="calendly-inline-widget w-full rounded-2xl overflow-hidden bg-base-100"
            data-url={url}
            style={{ width: "100%", height: "700px" }}
        />
    );
}
