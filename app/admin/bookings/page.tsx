"use client";

import { useEffect, useState } from "react";
import { Booking, Service } from "@prisma/client";

type BookingWithRelations = Booking & { service: Service };

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        const res = await fetch("/api/admin/bookings");
        if (res.ok) setBookings(await res.json());
        setLoading(false);
    }

    async function updateStatus(id: string, status: string) {
        // Optimistic Update
        setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));

        await fetch("/api/admin/bookings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">Booking Requests</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-500 col-span-3 text-center py-10">Loading requests...</p>
                ) : bookings.length === 0 ? (
                    <p className="text-gray-500 col-span-3 text-center py-10">No pending bookings.</p>
                ) : bookings.map((booking) => (
                    <div key={booking.id} className="glass-panel p-6 rounded-xl flex flex-col hover:border-white/20 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-xs px-2 py-1 rounded border uppercase font-bold tracking-wider ${booking.status === "PENDING" ? "border-yellow-500/30 text-yellow-400 bg-yellow-500/10" :
                                booking.status === "REVIEWED" ? "border-green-500/30 text-green-400 bg-green-500/10" :
                                    "border-red-500/30 text-red-400 bg-red-500/10"
                                }`}>
                                {booking.status}
                            </span>
                            <span className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-1">{booking.service.title}</h3>
                        <p className="text-sm text-gray-400 mb-4">Budget: ${booking.budgetUSD?.toLocaleString()}</p>

                        <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-agency-accent/20 flex items-center justify-center font-bold text-xs">
                                {booking.clientName.charAt(0)}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{booking.clientName}</p>
                                <p className="text-xs text-gray-500">{booking.clientEmail}</p>
                            </div>
                        </div>

                        {booking.message && (
                            <p className="text-sm text-gray-400 italic mb-6 flex-grow">"{booking.message}"</p>
                        )}

                        <div className="mt-auto grid grid-cols-2 gap-3 pt-4 border-t border-white/5">
                            {booking.status === "PENDING" && (
                                <>
                                    <button
                                        onClick={() => updateStatus(booking.id, "REJECTED")}
                                        className="btn-outline text-xs py-2 hover:bg-red-500/10 hover:text-red-400 hover:border-red-500/30"
                                    >
                                        Reject
                                    </button>
                                    <button
                                        onClick={() => updateStatus(booking.id, "REVIEWED")}
                                        className="btn-brand text-xs py-2"
                                    >
                                        Approve
                                    </button>
                                </>
                            )}
                            {booking.status === "REVIEWED" && (
                                <button className="btn-outline text-xs py-2 col-span-2">
                                    Create Project →
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
