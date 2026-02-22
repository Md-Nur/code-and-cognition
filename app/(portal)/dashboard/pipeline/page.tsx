"use client";

import { useEffect, useState } from "react";
import { Booking, Service } from "@prisma/client";
import Link from "next/link";
import { MoreHorizontal, Mail, FileText, User, Plus } from "lucide-react";

type BookingWithRelations = Booking & { service: Service };

const STAGES = [
    { id: "NEW", label: "New Leads", color: "bg-amber-500" },
    { id: "QUALIFIED", label: "Qualified", color: "bg-blue-500" },
    { id: "PROPOSAL_SENT", label: "Proposal Sent", color: "bg-purple-500" },
    { id: "CLOSED_WON", label: "Closed Won", color: "bg-green-500" },
    { id: "CLOSED_LOST", label: "Closed Lost", color: "bg-gray-500" },
];

export default function CRMPipelinePage() {
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
        // Optimistic update
        setBookings(prev => prev.map(b => b.id === id ? { ...b, status: status as any } : b));

        await fetch("/api/admin/bookings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
    }

    if (loading) return <div className="p-10 text-center text-gray-500">Loading pipeline...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold">CRM Pipeline</h1>
                    <p className="text-sm text-gray-500">Visual sales funnel and lead progression</p>
                </div>
                <Link href="/dashboard/bookings" className="btn-brand flex items-center gap-2">
                    <Plus className="w-4 h-4" /> Add Lead
                </Link>
            </div>

            <div className="flex gap-6 overflow-x-auto pb-6 min-h-[70vh]">
                {STAGES.map((stage) => (
                    <div key={stage.id} className="flex-shrink-0 w-80 flex flex-col gap-4">
                        <div className="flex items-center justify-between px-2">
                            <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${stage.color}`} />
                                <h3 className="font-bold text-sm uppercase tracking-wider">{stage.label}</h3>
                                <span className="text-xs text-gray-500 bg-white/5 px-2 py-0.5 rounded-full">
                                    {bookings.filter(b => b.status === stage.id).length}
                                </span>
                            </div>
                        </div>

                        <div className="flex-grow bg-white/[0.02] border border-white/5 rounded-2xl p-3 flex flex-col gap-3">
                            {bookings.filter(b => b.status === stage.id).length === 0 ? (
                                <div className="py-10 text-center text-xs text-gray-600 italic">
                                    No leads in this stage
                                </div>
                            ) : (
                                bookings.filter(b => b.status === stage.id).map(booking => (
                                    <div
                                        key={booking.id}
                                        className="glass-panel p-4 rounded-xl border border-white/5 hover:border-white/10 transition-all group relative"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-[10px] text-gray-500">
                                                {new Date(booking.createdAt).toLocaleDateString()}
                                            </span>
                                            <div className="dropdown dropdown-end">
                                                <div tabIndex={0} role="button" className="p-1 hover:bg-white/5 rounded">
                                                    <MoreHorizontal className="w-3 h-3 text-gray-500" />
                                                </div>
                                                <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-52 border border-white/10 mt-1">
                                                    {STAGES.filter(s => s.id !== stage.id).map(s => (
                                                        <li key={s.id}>
                                                            <button onClick={() => updateStatus(booking.id, s.id)} className="text-xs">
                                                                Move to {s.label}
                                                            </button>
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>

                                        <h4 className="font-bold text-sm mb-1 line-clamp-1">{booking.service.title}</h4>

                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="w-5 h-5 rounded-full bg-agency-accent/20 flex items-center justify-center text-[10px] font-bold">
                                                {booking.clientName.charAt(0)}
                                            </div>
                                            <span className="text-xs text-gray-400 truncate">{booking.clientName}</span>
                                        </div>

                                        <div className="flex items-center justify-between pt-3 border-t border-white/5">
                                            <span className="text-xs font-bold text-agency-accent">
                                                ${booking.budgetUSD?.toLocaleString() || "0"}
                                            </span>
                                            <div className="flex gap-2">
                                                <Link href={`mailto:${booking.clientEmail}`} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                                                    <Mail className="w-3.5 h-3.5" />
                                                </Link>
                                                {stage.id === "QUALIFIED" && (
                                                    <Link href={`/dashboard/proposals/new?bookingId=${booking.id}`} className="p-1.5 hover:bg-white/5 rounded-lg text-gray-500 hover:text-white transition-colors">
                                                        <FileText className="w-3.5 h-3.5" />
                                                    </Link>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
