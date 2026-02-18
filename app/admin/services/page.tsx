"use client";

import { useEffect, useState } from "react";
import { Service, SubCategory } from "@prisma/client";

type ServiceWithSubs = Service & { subCategories: SubCategory[] };

export default function AdminServicesPage() {
    const [services, setServices] = useState<ServiceWithSubs[]>([]);
    const [loading, setLoading] = useState(true);
    const [addingSubTo, setAddingSubTo] = useState<string | null>(null);
    const [newSubTitle, setNewSubTitle] = useState("");

    useEffect(() => {
        fetchServices();
    }, []);

    async function fetchServices() {
        try {
            const res = await fetch("/api/admin/services");
            if (res.ok) {
                const data = await res.json();
                setServices(data);
            }
        } finally {
            setLoading(false);
        }
    }

    async function toggleStatus(service: Service) {
        const newStatus = service.status === "ACTIVE" ? "INACTIVE" : "ACTIVE";
        setServices(services.map(s => s.id === service.id ? { ...s, status: newStatus } : s));

        try {
            await fetch(`/api/admin/services/${service.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
        } catch (error) {
            console.error("Failed to update status", error);
            fetchServices();
        }
    }

    async function addSubCategory(serviceId: string) {
        if (!newSubTitle.trim()) return;

        try {
            const res = await fetch("/api/admin/subcategories", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newSubTitle, serviceId }),
            });
            if (res.ok) {
                setNewSubTitle("");
                setAddingSubTo(null);
                fetchServices();
            }
        } catch (error) {
            console.error("Failed to add sub-category", error);
        }
    }

    async function deleteSubCategory(id: string) {
        if (!confirm("Are you sure?")) return;
        try {
            const res = await fetch(`/api/admin/subcategories/${id}`, { method: "DELETE" });
            if (res.ok) fetchServices();
        } catch (error) {
            console.error("Failed to delete", error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold font-display">Services Management</h1>
                <button className="btn-brand">
                    + Add New Service
                </button>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl border border-white/5">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left p-4">Service & Sub-categories</th>
                            <th className="text-left p-4">Base Price</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={4} className="text-center py-20 text-gray-500">Loading services...</td></tr>
                        ) : services.map((service) => (
                            <tr key={service.id} className="border-b border-white/5 group hover:bg-white/[0.02] transition-colors">
                                <td className="p-4">
                                    <div className="font-bold text-lg mb-2">{service.title}</div>
                                    <div className="flex flex-wrap gap-2 items-center">
                                        {service.subCategories.map(sub => (
                                            <span key={sub.id} className="text-[10px] uppercase font-bold py-1 px-2 rounded bg-white/5 border border-white/10 flex items-center gap-2 group/sub">
                                                {sub.title}
                                                <button
                                                    onClick={() => deleteSubCategory(sub.id)}
                                                    className="text-red-500 opacity-0 group-hover/sub:opacity-100 hover:text-red-400 transition-opacity"
                                                >
                                                    ×
                                                </button>
                                            </span>
                                        ))}
                                        {addingSubTo === service.id ? (
                                            <div className="flex items-center gap-2">
                                                <input
                                                    autoFocus
                                                    className="text-[10px] bg-agency-black border border-agency-accent/50 rounded px-2 py-1 outline-none w-32"
                                                    value={newSubTitle}
                                                    onChange={(e) => setNewSubTitle(e.target.value)}
                                                    onKeyDown={(e) => e.key === "Enter" && addSubCategory(service.id)}
                                                />
                                                <button onClick={() => addSubCategory(service.id)} className="text-green-500 text-xs">✓</button>
                                                <button onClick={() => setAddingSubTo(null)} className="text-gray-500 text-xs">×</button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => setAddingSubTo(service.id)}
                                                className="text-[10px] uppercase font-bold text-agency-accent hover:underline"
                                            >
                                                + Add Sub-cat
                                            </button>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="text-sm font-medium">৳{service.basePriceBDT.toLocaleString()}</div>
                                    <div className="text-xs text-gray-500">${service.basePriceUSD.toLocaleString()}</div>
                                </td>
                                <td className="p-4">
                                    <button
                                        onClick={() => toggleStatus(service)}
                                        className={`text-xs px-2 py-1 rounded border transition-colors ${service.status === "ACTIVE"
                                            ? "border-green-500/30 text-green-400 bg-green-500/10 hover:bg-green-500/20"
                                            : "border-red-500/30 text-red-400 bg-red-500/10 hover:bg-red-500/20"
                                            }`}
                                    >
                                        {service.status}
                                    </button>
                                </td>
                                <td className="text-right p-4">
                                    <div className="flex justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button className="text-xs font-bold text-gray-400 hover:text-white uppercase tracking-wider">Edit</button>
                                        <button className="text-xs font-bold text-red-400 hover:text-red-300 uppercase tracking-wider">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
