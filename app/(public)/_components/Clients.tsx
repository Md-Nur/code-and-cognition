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
                <div className="flex animate-marquee group-hover:pause-marquee whitespace-nowrap justify-center items-center py-4">
                    {displayClients.map((client, i) => (
                        <div
                            key={`${client.id}-${i}`}
                            className="premium-card group/card flex flex-col items-center justify-center mx-6 md:mx-10 min-w-[240px] h-40 p-6 relative overflow-hidden"
                        >
                            {/* Subtle hover gradient inside the card */}
                            <div className="absolute inset-0 bg-gradient-to-t from-white/5 to-transparent opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 rounded-3xl" />

                            {client.website ? (
                                <Link href={client.website} target="_blank" rel="noopener noreferrer" title={client.name} className="flex flex-col items-center justify-center w-full h-full relative z-10 gap-4">
                                    <Image
                                        src={client.logoUrl}
                                        alt={client.name}
                                        className="max-h-[60px] w-auto object-contain brightness-0 invert opacity-50 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-500"
                                        width={200}
                                        height={200}
                                    />
                                    <span className="text-white/90 text-xs font-semibold tracking-widest uppercase text-center opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500">
                                        {client.name}
                                    </span>
                                </Link>
                            ) : (
                                <div className="flex flex-col items-center justify-center w-full h-full relative z-10 gap-4">
                                    <Image
                                        src={client.logoUrl}
                                        alt={client.name}
                                        className="max-h-[60px] w-auto object-contain brightness-0 invert opacity-50 group-hover/card:opacity-100 group-hover/card:scale-105 transition-all duration-500"
                                        width={200}
                                        height={200}
                                    />
                                    <span className="text-white/90 text-xs font-semibold tracking-widest uppercase text-center opacity-0 translate-y-2 group-hover/card:opacity-100 group-hover/card:translate-y-0 transition-all duration-500">
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
        </section>
    );
}
