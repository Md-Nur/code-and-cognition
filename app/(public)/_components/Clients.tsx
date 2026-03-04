"use client";

import { Client } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function Clients({ clients }: { clients: Client[] }) {
    if (clients.length === 0) return null;

    // Triple for a seamless infinite loop
    const display = [...clients, ...clients, ...clients];

    return (
        <section className="relative py-24 border-t border-white/5 bg-agency-black overflow-hidden group/section">
            {/* Ambient glow - slightly more spread */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60%] h-[300px] bg-agency-accent/5 rounded-full blur-[140px]" />
            </div>

            {/* Main Content Container with Max Width */}
            <div className="max-w-[1600px] mx-auto relative z-10">
                {/* Header */}
                <div className="section-container text-center mb-16 relative z-10">
                    <p className="text-[12px] font-bold uppercase tracking-[0.4em] text-white/40 mb-4">
                        Trusted by industry leaders
                    </p>
                    <div className="flex items-center justify-center gap-6">
                        <div className="flex-1 max-w-[150px] h-px bg-gradient-to-r from-transparent to-white/10" />
                        <span className="text-white/20 text-xs">◆</span>
                        <div className="flex-1 max-w-[150px] h-px bg-gradient-to-l from-transparent to-white/10" />
                    </div>
                </div>

                {/* Marquee track */}
                <div className="relative overflow-hidden">
                    <div className="flex animate-marquee-left hover:pause-marquee py-4">
                        {display.map((client, i) => (
                            <LogoCard key={`${client.id}-${i}`} client={client} />
                        ))}
                    </div>

                    {/* Edge fades - wider for smoother transition */}
                    <div className="absolute inset-y-0 left-0 w-40 md:w-64 bg-gradient-to-r from-agency-black via-agency-black/80 to-transparent z-10 pointer-events-none" />
                    <div className="absolute inset-y-0 right-0 w-40 md:w-64 bg-gradient-to-l from-agency-black via-agency-black/80 to-transparent z-10 pointer-events-none" />
                </div>
            </div>
        </section>
    );
}

/* ─── Logo Card ─────────────────────────────────────────────────────────────── */
function LogoCard({ client }: { client: Client }) {
    const card = (
        <div className="group/logo flex flex-col items-center justify-center gap-4 mx-6 w-[220px] h-[130px] shrink-0 rounded-2xl border border-white/[0.08] bg-white/[0.03] transition-all duration-500 hover:border-agency-accent/30 hover:bg-white/[0.06] hover:-translate-y-1">
            {/* Subtle highlight effect */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover/logo:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-agency-accent/[0.05] to-transparent pointer-events-none" />

            <div className="relative h-12 flex items-center justify-center w-full px-6">
                <Image
                    src={client.logoUrl}
                    alt={client.name}
                    className="max-h-full max-w-full w-auto object-contain opacity-70 group-hover/logo:opacity-100 transition-all duration-500 scale-110 group-hover/logo:scale-125"
                    width={150}
                    height={50}
                />
            </div>
            <span className="text-[12px] font-bold uppercase tracking-[0.2em] text-white/40 group-hover/logo:text-white/80 transition-colors duration-500 text-center px-4 leading-tight">
                {client.name}
            </span>
        </div>
    );

    if (client.website) {
        return (
            <Link href={client.website} target="_blank" rel="noopener noreferrer" className="block outline-none">
                {card}
            </Link>
        );
    }

    return card;
}
