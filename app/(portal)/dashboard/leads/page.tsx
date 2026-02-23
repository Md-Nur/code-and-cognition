"use client";

import { useEffect, useState } from "react";
import { Booking, Service } from "@prisma/client";
import Link from "next/link";

type BookingWithRelations = Booking & { service: Service | null; project: { id: string } | null; discovery: any };

export default function LeadsDatabasePage() {
    const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState<string>("ALL");
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        serviceId: "",
        budgetUSD: "",
        message: "",
    });

    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState<"date" | "budget">("date");
    const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

    useEffect(() => {
        fetchBookings();
        fetchServices();
    }, []);

    const filteredBookings = bookings
        .filter(b => filterStatus === "ALL" || b.status === filterStatus)
        .filter(b =>
            b.clientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.clientEmail.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.service?.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            b.discovery?.companyName?.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => {
            if (sortBy === "date") {
                const dateA = new Date(a.createdAt).getTime();
                const dateB = new Date(b.createdAt).getTime();
                return sortOrder === "desc" ? dateB - dateA : dateA - dateB;
            } else {
                const budgetA = a.budgetUSD || 0;
                const budgetB = b.budgetUSD || 0;
                return sortOrder === "desc" ? budgetB - budgetA : budgetA - budgetB;
            }
        });

    async function fetchBookings() {
        const res = await fetch("/api/admin/leads");
        if (res.ok) setBookings(await res.json());
        setLoading(false);
    }

    async function fetchServices() {
        const res = await fetch("/api/admin/services");
        if (res.ok) setServices(await res.json());
    }

    async function updateStatus(id: string, status: string) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));
        await fetch("/api/admin/leads", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/leads", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    budgetUSD: parseFloat(formData.budgetUSD) || 0,
                }),
            });

            if (res.ok) {
                setShowModal(false);
                fetchBookings();
                setFormData({
                    clientName: "",
                    clientEmail: "",
                    clientPhone: "",
                    serviceId: "",
                    budgetUSD: "",
                    message: "",
                });
            } else {
                alert("Failed to create booking");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold">Lead Database / CRM</h1>
                    <p className="text-sm text-gray-500">Manage your strategic sales pipeline and conversion funnel</p>
                </div>
                <button onClick={() => setShowModal(true)} className="btn-brand w-full sm:w-auto">
                    + Add Manual Lead
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                    <input
                        type="text"
                        placeholder="Search by client name, email, or service..."
                        className="input-field w-full"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="flex gap-2">
                    <select
                        className="input-field flex-1"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                    >
                        <option value="date" className="bg-[#0f1117] text-[#e2e8f0]">Sort by Date</option>
                        <option value="budget" className="bg-[#0f1117] text-[#e2e8f0]">Sort by Budget</option>
                    </select>
                    <button
                        onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
                        className="btn-outline px-3"
                    >
                        {sortOrder === "asc" ? "↑" : "↓"}
                    </button>
                </div>
            </div>

            <div className="flex flex-wrap gap-2 pb-2">
                {["ALL", "NEW", "QUALIFIED", "PROPOSAL_SENT", "CLOSED_WON", "CLOSED_LOST"].map((status) => (
                    <button
                        key={status}
                        onClick={() => setFilterStatus(status)}
                        className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterStatus === status
                            ? "bg-agency-accent text-white"
                            : "bg-white/5 text-gray-400 hover:bg-white/10"
                            }`}
                    >
                        {status.replace("_", " ")}
                    </button>
                ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <p className="text-gray-500 col-span-3 text-center py-10">Loading leads...</p>
                ) : filteredBookings.length === 0 ? (
                    <p className="text-gray-500 col-span-3 text-center py-10">No leads found.</p>
                ) : filteredBookings.map((booking) => (
                    <div key={booking.id} className="glass-panel p-6 rounded-xl flex flex-col hover:border-white/20 transition-colors">
                        <div className="flex justify-between items-start mb-4">
                            <span className={`text-[10px] px-2 py-0.5 rounded border uppercase font-bold tracking-wider ${(booking.status as string) === "NEW" ? "border-amber-500/30 text-amber-400 bg-amber-500/10" :
                                (booking.status as string) === "QUALIFIED" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                                    (booking.status as string) === "PROPOSAL_SENT" ? "border-purple-500/30 text-purple-400 bg-purple-500/10" :
                                        (booking.status as string) === "CLOSED_WON" ? "border-green-500/30 text-green-400 bg-green-500/10" :
                                            "border-gray-500/30 text-gray-400 bg-gray-500/10"
                                }`}>
                                {booking.status.replace("_", " ")}
                            </span>
                            <span className="text-[10px] text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</span>
                        </div>

                        <h3 className="font-bold text-lg mb-1">
                            {booking.discovery?.companyName || booking?.service?.title || "New Lead"}
                        </h3>
                        <p className="text-sm text-gray-400 mb-4">
                            Budget: {booking.discovery?.budgetRange || (booking.budgetUSD ? `$${booking.budgetUSD.toLocaleString()}` : "Not specified")}
                        </p>

                        <div className="flex items-center gap-3 mb-4 p-3 bg-white/5 rounded-lg">
                            <div className="w-8 h-8 rounded-full bg-agency-accent/20 flex items-center justify-center font-bold text-xs uppercase">
                                {booking.clientName?.charAt(0) || "?"}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{booking.clientName}</p>
                                <p className="text-xs text-gray-500">{booking.clientEmail}</p>
                                {booking.clientPhone && <p className="text-xs text-gray-500">{booking.clientPhone}</p>}
                            </div>
                        </div>

                        {booking.discovery?.problemStatement ? (
                            <div className="text-sm text-gray-400 mb-6 flex-grow space-y-1">
                                <p className="line-clamp-3"><strong>Challenge:</strong> {booking.discovery.problemStatement}</p>
                                {booking.discovery.industry && <p><strong>Industry:</strong> {booking.discovery.industry}</p>}
                                {booking.discovery.revenueRange && <p><strong>Annual Revenue:</strong> {booking.discovery.revenueRange}</p>}
                                {booking.discovery.timeline && <p><strong>Timeline:</strong> {booking.discovery.timeline}</p>}
                                {booking.discovery.additionalNotes && <p className="mt-1 line-clamp-3"><strong>Additional Notes:</strong> {booking.discovery.additionalNotes}</p>}
                            </div>
                        ) : booking.message ? (
                            <p className="text-sm text-gray-400 italic mb-6 flex-grow line-clamp-3">"{booking.message}"</p>
                        ) : (
                            <div className="mb-6 flex-grow"></div>
                        )}

                        <div className="mt-auto pt-4 border-t border-white/5 space-y-3">
                            <div className="grid grid-cols-2 gap-2">
                                {(booking.status as string) === "NEW" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(booking.id, "CLOSED_LOST")}
                                            className="btn-outline text-[10px] py-2 px-2 hover:bg-red-500/10 hover:text-red-400 whitespace-nowrap"
                                        >
                                            Discard
                                        </button>
                                        <button
                                            onClick={() => updateStatus(booking.id, "QUALIFIED")}
                                            className="btn-brand text-[10px] py-2 px-2 whitespace-nowrap"
                                        >
                                            Qualify
                                        </button>
                                    </>
                                )}
                                {(booking.status as string) === "QUALIFIED" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(booking.id, "CLOSED_LOST")}
                                            className="btn-outline text-[10px] py-2 px-2 whitespace-nowrap"
                                        >
                                            Lose Lead
                                        </button>
                                        <Link
                                            href={`/dashboard/proposals/new?bookingId=${booking.id}`}
                                            className="btn-brand text-[10px] py-2 px-2 text-center whitespace-nowrap"
                                        >
                                            Create Proposal
                                        </Link>
                                    </>
                                )}
                                {(booking.status as string) === "PROPOSAL_SENT" && (
                                    <>
                                        <button
                                            onClick={() => updateStatus(booking.id, "CLOSED_LOST")}
                                            className="btn-outline text-[10px] py-2 px-2 whitespace-nowrap"
                                        >
                                            Closed Lost
                                        </button>
                                        <button
                                            onClick={() => updateStatus(booking.id, "CLOSED_WON")}
                                            className="btn-brand text-[10px] py-2 px-2 whitespace-nowrap"
                                        >
                                            Closed Won
                                        </button>
                                    </>
                                )}
                                {(booking.status as string) === "CLOSED_WON" && (
                                    booking.project ? (
                                        <Link
                                            href={`/dashboard/projects/${booking.project.id}`}
                                            className="btn-outline text-[10px] py-2 col-span-2 text-center"
                                        >
                                            View Project →
                                        </Link>
                                    ) : (
                                        <button
                                            className="btn-brand text-[10px] py-2 col-span-2"
                                            onClick={() => alert("Please convert this won lead into a project from the project management section or we can add a quick convert here.")}
                                        >
                                            Convert to Project
                                        </button>
                                    )
                                )}
                                {(booking.status as string) === "CLOSED_LOST" && (
                                    <button
                                        onClick={() => updateStatus(booking.id, "NEW")}
                                        className="btn-outline text-[10px] py-2 col-span-2"
                                    >
                                        Re-open Lead
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Manual Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-6 rounded-xl animate-fade-in-up">
                        <h2 className="text-xl font-bold mb-4">Add Manual Lead</h2>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Client Name</label>
                                    <input
                                        type="text"
                                        required
                                        className="input-field"
                                        value={formData.clientName}
                                        onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                                    />
                                </div>
                                <div>
                                    <label className="input-label">Client Email</label>
                                    <input
                                        type="email"
                                        required
                                        className="input-field"
                                        value={formData.clientEmail}
                                        onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Select Service</label>
                                <select
                                    required
                                    className="input-field appearance-none"
                                    value={formData.serviceId}
                                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                >
                                    <option value="" className="bg-[#0f1117] text-[#e2e8f0]">Choose a service...</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id} className="bg-[#0f1117] text-[#e2e8f0]">{s.title}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="input-label">Estimated Budget (USD)</label>
                                <input
                                    type="number"
                                    className="input-field"
                                    value={formData.budgetUSD}
                                    onChange={(e) => setFormData({ ...formData, budgetUSD: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="input-label">Project Details</label>
                                <textarea
                                    className="input-field min-h-[100px]"
                                    value={formData.message}
                                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                />
                            </div>
                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-brand flex-1">
                                    Create Lead
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
