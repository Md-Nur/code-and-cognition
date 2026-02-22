"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { User, Booking, Service } from "@prisma/client";

function CreateProjectForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const bookingId = searchParams.get("bookingId");

    const [founders, setFounders] = useState<User[]>([]);
    const [bookings, setBookings] = useState<Booking[]>([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        title: "",
        finderId: "",
        bookingId: bookingId || "",
        status: "ACTIVE",
    });

    useEffect(() => {
        async function fetchData() {
            try {
                const [usersRes, bookingsRes] = await Promise.all([
                    fetch("/api/admin/users"),
                    fetch("/api/admin/bookings"),
                ]);

                if (usersRes.ok) {
                    const users: User[] = await usersRes.json();
                    setFounders(users.filter(u => u.role === "FOUNDER"));
                }
                if (bookingsRes.ok) {
                    const allBookings: (Booking & { service: Service })[] = await bookingsRes.json();
                    setBookings(allBookings);

                    // If bookingId is provided, pre-fill title
                    if (bookingId) {
                        const booking = allBookings.find(b => b.id === bookingId);
                        if (booking) {
                            setFormData(prev => ({
                                ...prev,
                                title: `${booking.service.title} - ${booking.clientName}`,
                            }));
                        }
                    }
                }
            } catch (error) {
                console.error("Fetch Error:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, [bookingId]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        try {
            const res = await fetch("/api/admin/projects", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    bookingId: formData.bookingId || null,
                }),
            });

            if (res.ok) {
                router.push("/admin/projects");
            } else {
                const err = await res.json();
                alert(`Error: ${err.message || "Failed to create project"}`);
            }
        } catch (error) {
            console.error(error);
            alert("An unexpected error occurred");
        } finally {
            setSubmitting(false);
        }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading form data...</div>;

    return (
        <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
            <div>
                <h1 className="text-3xl font-bold tracking-tight mb-2">Create New Project</h1>
                <p className="text-gray-400">Set up a new workspace for an approved booking or manual entry.</p>
            </div>

            <form onSubmit={handleSubmit} className="glass-panel p-8 rounded-2xl space-y-6">
                <div className="space-y-2">
                    <label className="input-label">Project Title</label>
                    <input
                        type="text"
                        required
                        className="input-field"
                        placeholder="e.g. Web Development for Client Name"
                        value={formData.title}
                        onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="input-label">Project Finder (Founder)</label>
                        <select
                            required
                            className="select-field"
                            value={formData.finderId}
                            onChange={(e) => setFormData(prev => ({ ...prev, finderId: e.target.value }))}
                        >
                            <option value="">Select a founder...</option>
                            {founders.map(f => (
                                <option key={f.id} value={f.id}>{f.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="input-label">Project Status</label>
                        <select
                            className="select-field"
                            value={formData.status}
                            onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                        >
                            <option value="ACTIVE">Active</option>
                            <option value="COMPLETED">Completed</option>
                            <option value="CANCELLED">Cancelled</option>
                        </select>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="input-label">Link to Booking (Optional)</label>
                    <select
                        className="select-field"
                        value={formData.bookingId}
                        onChange={(e) => setFormData(prev => ({ ...prev, bookingId: e.target.value }))}
                    >
                        <option value="">No booking link</option>
                        {bookings.map(b => (
                            <option key={b.id} value={b.id}>
                                {b.clientName} - {(b as any).service.title} ({new Date(b.createdAt).toLocaleDateString()})
                            </option>
                        ))}
                    </select>
                    <p className="text-[10px] text-gray-500 italic">Linking a booking helps track the project source.</p>
                </div>

                <div className="flex gap-4 pt-4 border-t border-white/5">
                    <button
                        type="button"
                        onClick={() => router.back()}
                        className="btn-outline flex-1"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
                        className="btn-brand flex-1"
                    >
                        {submitting ? "Creating..." : "Create Project"}
                    </button>
                </div>
            </form>
        </div>
    );
}

export default function NewProjectPage() {
    return (
        <Suspense fallback={<div className="p-8 text-center text-gray-500">Loading...</div>}>
            <CreateProjectForm />
        </Suspense>
    );
}
