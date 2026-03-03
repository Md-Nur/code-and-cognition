"use client";

import Image from "next/image";

export default function Loading() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black">
            <div className="relative flex flex-col items-center">
                {/* Logo with subtle float and pulse animation */}
                <div className="relative w-24 h-24 mb-6 animate-float">
                    <Image
                        src="/Main-Logo.png"
                        alt="Code & Cognition Logo"
                        fill
                        className="object-contain"
                        priority
                    />
                    <div className="absolute inset-0 rounded-full bg-white/5 blur-xl animate-pulse -z-10"></div>
                </div>

                {/* Optional Loading Bar */}
                <div className="w-48 h-[2px] bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-linear-to-r from-transparent via-agency-accent to-transparent w-full -translate-x-full animate-[shimmer_2s_infinite]"></div>
                </div>
            </div>

            {/* Background elements to match the site's aesthetic */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-agency-accent/5 rounded-full blur-[120px] pointer-events-none -z-10"></div>
        </div>
    );
}
