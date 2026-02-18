"use client";

import { useEffect, useState } from "react";
import { Service } from "@prisma/client";

export default function AdminServicesPage() {
    const [services, setServices] = useState<Service[]>([]);
    const [loading, setLoading] = useState(true);

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
        // Optimistic update
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
            // Revert on failure
            fetchServices();
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">Services Management</h1>
                <button className="btn-brand">
                    + Add Service
                </button>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left p-4">Title</th>
                            <th className="text-left p-4">Price (BDT)</th>
                            <th className="text-left p-4">Price (USD)</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-8">Loading services...</td></tr>
                        ) : services.map((service) => (
                            <tr key={service.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium">{service.title}</td>
                                <td className="p-4">৳{service.basePriceBDT.toLocaleString()}</td>
                                <td className="p-4">${service.basePriceUSD.toLocaleString()}</td>
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
                                    <button className="text-gray-400 hover:text-white mr-3 transition-colors">Edit</button>
                                    <button className="text-red-400 hover:text-red-300 transition-colors">Delete</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
