"use client";

import { useState } from "react";
import { Share2, Check } from "lucide-react";

export function ShareButton({ title, text }: { title?: string; text?: string }) {
    const [copied, setCopied] = useState(false);

    const handleShare = async () => {
        const shareData = {
            title: title || document.title,
            text: text || "Check out this insight from Code & Cognition",
            url: window.location.href,
        };

        if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                // If the user cancelled, it throws an AbortError. We can ignore it.
                alert("Error sharing");
            }
        } else {
            // Fallback for desktop browsers without Web Share support
            navigator.clipboard.writeText(window.location.href);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    return (
        <button
            onClick={handleShare}
            className="ml-auto p-3 rounded-full bg-white/5 border border-white/10 text-white/40 hover:text-white transition-colors flex items-center gap-2 group relative"
            title="Share this article"
        >
            {copied ? (
                <Check className="w-4 h-4 text-emerald-400" />
            ) : (
                <Share2 className="w-4 h-4 group-hover:scale-110 transition-transform" />
            )}
            {copied && (
                <span className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white/10 text-white text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg whitespace-nowrap backdrop-blur-sm border border-white/10 animate-fade-in-up">
                    Copied!
                </span>
            )}
        </button>
    );
}
