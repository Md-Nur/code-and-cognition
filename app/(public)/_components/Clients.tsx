"use client";

import { Client } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";

export default function Clients({ clients }: { clients: Client[] }) {
    if (clients.length === 0) return null;

    // Double the clients to create a seamless loop
    const displayClients = [...clients, ...clients, ...clients];

    return (
        <section className="py-20 border-t border-white/5 bg-agency-black overflow-hidden">
            <div className="section-container text-center mb-20 animate-fade-in">
                <span className="section-tag">
                    Trusted by Ambitious Brands
                </span>
                <h2 className="text-5xl md:text-7xl font-extrabold text-white mb-8 tracking-tight">
                    Our Official Partners
                </h2>
            </div>

            <div className="relative flex overflow-hidden group py-10">
                {/* Horizontal Marquee Animation */}
                <div className="flex animate-marquee group-hover:pause-marquee whitespace-nowrap justify-center">
                    {displayClients.map((client, i) => (
                        <div
                            key={`${client.id}-${i}`}
                            className="flex flex-col items-center justify-center mx-16 md:mx-24 min-w-[200px] h-48 opacity-30 hover:opacity-100 transition-all duration-500 grayscale hover:grayscale-0"
                        >
                            {client.website ? (
                                <Link href={client.website} target="_blank" rel="noopener noreferrer" title={client.name} className="flex flex-col items-center">
                                    <Image
                                        src={client.logoUrl}
                                        alt={client.name}
                                        className="max-h-20 w-auto object-contain mb-4"
                                        width={200}
                                        height={200}
                                    />
                                    <span className="text-white text-lg font-medium tracking-wide">
                                        {client.name}
                                    </span>
                                </Link>
                            ) : (
                                <div className="flex flex-col items-center">
                                    <Image
                                        src={client.logoUrl}
                                        alt={client.name}
                                        className="max-h-20 w-auto object-contain mb-4"
                                        width={200}
                                        height={200}
                                    />
                                    <span className="text-white text-lg font-medium tracking-wide">
                                        {client.name}
                                    </span>
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Gradient Fades for Smooth Edges */}
                <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-agency-black to-transparent z-10 pointers-none"></div>
                <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-agency-black to-transparent z-10 pointers-none"></div>
            </div>

            <style jsx>{`
                @keyframes marquee {
                    0% { transform: translateX(0); }
                    100% { transform: translateX(-33.33%); }
                }
                .animate-marquee {
                    animation: marquee 40s linear infinite;
                }
                .pause-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </section>
    );
}
