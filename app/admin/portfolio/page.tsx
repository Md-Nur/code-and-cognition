"use client";

import { useEffect, useState } from "react";
import { PortfolioItem, Service, SubCategory } from "@prisma/client";
import ImageUpload from "@/app/components/admin/ImageUpload";

type ItemWithService = PortfolioItem & {
    service: { title: string },
    subCategory?: { title: string } | null
};

type ServiceWithSubs = Service & { subCategories: SubCategory[] };

export default function AdminPortfolioPage() {
    const [items, setItems] = useState<ItemWithService[]>([]);
    const [services, setServices] = useState<ServiceWithSubs[]>([]);
    const [loading, setLoading] = useState(true);
    const [isAdding, setIsAdding] = useState(false);

    // Form state
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        serviceId: "",
        subCategoryId: "",
        projectUrl: "",
        imageUrl: "",
        technologies: "",
        isFeatured: false
    });

    useEffect(() => {
        fetchData();
    }, []);

    async function fetchData() {
        try {
            const [itemsRes, servicesRes] = await Promise.all([
                fetch("/api/admin/portfolio"),
                fetch("/api/admin/services")
            ]);
            if (itemsRes.ok) {
                const data = await itemsRes.json();
                setItems(data);
            }
            if (servicesRes.ok) {
                const data = await servicesRes.json();
                setServices(data);
            }
        } finally {
            setLoading(false);
        }
    }


    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/portfolio", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    technologies: formData.technologies.split(",").map(t => t.trim()).filter(Boolean),
                    subCategoryId: formData.subCategoryId || null
                }),
            });
            if (res.ok) {
                setIsAdding(false);
                setFormData({
                    title: "",
                    description: "",
                    serviceId: "",
                    subCategoryId: "",
                    projectUrl: "",
                    imageUrl: "",
                    technologies: "",
                    isFeatured: false
                });
                fetchData();
            }
        } catch (error) {
            console.error("Failed to save", error);
        }
    }

    const selectedService = services.find(s => s.id === formData.serviceId);

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold font-display">Portfolio Management</h1>
                <button
                    onClick={() => setIsAdding(!isAdding)}
                    className="btn-brand w-full sm:w-auto"
                >
                    {isAdding ? "Cancel" : "+ Add Portfolio Item"}
                </button>
            </div>

            {isAdding && (
                <div className="glass-panel p-8 rounded-xl border border-agency-accent/20 animate-in fade-in slide-in-from-top-4">
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                            <div>
                                <label className="input-label">Project Title</label>
                                <input
                                    required
                                    className="input-field"
                                    value={formData.title}
                                    onChange={e => setFormData({ ...formData, title: e.target.value })}
                                />
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="input-label">Service Category</label>
                                    <select
                                        required
                                        className="select-field"
                                        value={formData.serviceId}
                                        onChange={e => setFormData({ ...formData, serviceId: e.target.value, subCategoryId: "" })}
                                    >
                                        <option value="">Select a service</option>
                                        {services.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="input-label">Sub-service (Optional)</label>
                                    <select
                                        className="select-field"
                                        value={formData.subCategoryId}
                                        onChange={e => setFormData({ ...formData, subCategoryId: e.target.value })}
                                        disabled={!formData.serviceId}
                                    >
                                        <option value="">Select sub-service</option>
                                        {selectedService?.subCategories.map(sub => (
                                            <option key={sub.id} value={sub.id}>{sub.title}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                            <div>
                                <label className="input-label">Technologies (comma separated)</label>
                                <input
                                    className="input-field"
                                    placeholder="Next.js, Tailwind, Bun"
                                    value={formData.technologies}
                                    onChange={e => setFormData({ ...formData, technologies: e.target.value })}
                                />
                            </div>
                        </div>
                        <div className="space-y-4">
                            <ImageUpload
                                label="Project Image"
                                value={formData.imageUrl}
                                onChange={(url) => setFormData({ ...formData, imageUrl: url })}
                                description="Upload a high-quality cover image for the project."
                            />
                            <div>
                                <label className="input-label">Live Project URL</label>
                                <input
                                    className="input-field"
                                    value={formData.projectUrl}
                                    onChange={e => setFormData({ ...formData, projectUrl: e.target.value })}
                                />
                            </div>
                            <div className="flex items-center gap-2 pt-4">
                                <input
                                    type="checkbox"
                                    id="isFeatured"
                                    checked={formData.isFeatured}
                                    onChange={e => setFormData({ ...formData, isFeatured: e.target.checked })}
                                />
                                <label htmlFor="isFeatured" className="text-sm">Feature on homepage</label>
                            </div>
                        </div>
                        <div className="md:col-span-2">
                            <label className="input-label">Description</label>
                            <textarea
                                required
                                className="input-field min-h-[100px] py-3"
                                value={formData.description}
                                onChange={e => setFormData({ ...formData, description: e.target.value })}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <button
                                type="submit"
                                className="btn-brand w-full"
                            >
                                Save Project
                            </button>
                        </div>
                    </form>
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {items.length === 0 && !loading && (
                    <div className="col-span-3 py-20 text-center text-gray-500 glass-panel rounded-xl">
                        No portfolio items yet.
                    </div>
                )}
                {items.map(item => (
                    <div key={item.id} className="glass-panel p-4 rounded-xl flex flex-col gap-4 border border-white/5">
                        <div className="aspect-video bg-white/5 rounded-lg flex items-center justify-center text-gray-700 font-bold overflow-hidden relative">
                            {item.imageUrl ? (
                                <img src={item.imageUrl} alt={item.title} className="w-full h-full object-cover" />
                            ) : (
                                <span>No Image</span>
                            )}
                            <div className="absolute top-2 right-2">
                                {item.isFeatured && (
                                    <span className="bg-agency-accent text-[10px] font-bold px-2 py-1 rounded text-white">FEATURED</span>
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="flex flex-wrap gap-1 mb-1">
                                <span className="text-[10px] text-agency-accent font-bold uppercase">{item.service.title}</span>
                                {item.subCategory && (
                                    <span className="text-[10px] text-gray-500 font-bold uppercase">• {item.subCategory.title}</span>
                                )}
                            </div>
                            <h3 className="font-bold text-lg">{item.title}</h3>
                            <p className="text-xs text-gray-400 line-clamp-2 mt-1">{item.description}</p>
                        </div>
                        <div className="mt-auto pt-4 border-t border-white/5 flex justify-between">
                            <button className="text-sm font-bold text-gray-400 hover:text-white transition-colors">Edit</button>
                            <button className="text-sm font-bold text-red-400 hover:text-red-300 transition-colors">Delete</button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
