import { useEffect, useState } from "react";
import { Booking, Service } from "@prisma/client";
import Link from "next/link";

type BookingWithRelations = Booking & { service: Service; project: { id: string } | null };

export default function AdminBookingsPage() {
    const [bookings, setBookings] = useState<BookingWithRelations[]>([]);
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState({
        clientName: "",
        clientEmail: "",
        clientPhone: "",
        serviceId: "",
        budgetUSD: "",
        message: "",
    });

    useEffect(() => {
        fetchBookings();
        fetchServices();
    }, []);

    async function fetchBookings() {
        const res = await fetch("/api/admin/bookings");
        if (res.ok) setBookings(await res.json());
        setLoading(false);
    }

    async function fetchServices() {
        const res = await fetch("/api/admin/services");
        if (res.ok) setServices(await res.json());
    }

    async function updateStatus(id: string, status: string) {
        setBookings(bookings.map(b => b.id === id ? { ...b, status: status as any } : b));
        await fetch("/api/admin/bookings", {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id, status }),
        });
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/bookings", {
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
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Booking Requests</h1>
                <button onClick={() => setShowModal(true)} className="btn-brand">
                    + Add Manual Booking
                </button>
            </div>

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
                                booking.project ? (
                                    <Link
                                        href={`/admin/projects/${booking.project.id}`}
                                        className="btn-outline text-xs py-2 col-span-2 text-center"
                                    >
                                        View Project →
                                    </Link>
                                ) : (
                                    <Link
                                        href={`/admin/projects/new?bookingId=${booking.id}`}
                                        className="btn-brand text-xs py-2 col-span-2 text-center"
                                    >
                                        Create Project →
                                    </Link>
                                )
                            )}
                            {booking.status === "REJECTED" && (
                                <button
                                    onClick={() => updateStatus(booking.id, "PENDING")}
                                    className="btn-outline text-xs py-2 col-span-2"
                                >
                                    Restore to Pending
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Manual Booking Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-6 rounded-xl animate-fade-in-up">
                        <h2 className="text-xl font-bold mb-4">Add Manual Booking</h2>
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
                                    className="select-field"
                                    value={formData.serviceId}
                                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                >
                                    <option value="">Choose a service...</option>
                                    {services.map(s => (
                                        <option key={s.id} value={s.id}>{s.title}</option>
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
                                    Create Booking
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
