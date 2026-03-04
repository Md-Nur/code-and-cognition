"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project, User, Booking } from "@prisma/client";

import { Layout, Users, CreditCard, ArrowRight, ExternalLink } from "lucide-react";

type ProjectWithRelations = Project & {
    finder: User;
    booking: Booking | null;
    _count: { members: number; payments: number };
};

export default function DashboardProjectsPage() {
    const [projects, setProjects] = useState<ProjectWithRelations[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProjects() {
            try {
                const res = await fetch("/api/admin/projects");
                if (res.ok) {
                    const data = await res.json();
                    setProjects(data);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchProjects();
    }, []);

    const getStatusStyles = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return "border-blue-500/30 text-blue-400 bg-blue-500/10";
            case "DELIVERED":
                return "border-amber-500/30 text-amber-400 bg-amber-500/10";
            case "COMPLETED":
                return "border-green-500/30 text-green-400 bg-green-500/10";
            default:
                return "border-gray-500/30 text-gray-400 bg-gray-500/10";
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Layout className="w-6 h-6 text-agency-accent" />
                    Project Pipeline
                </h1>
                <div className="text-sm text-gray-400">
                    {projects.length} Total Projects
                </div>
            </div>

            {loading ? (
                <div className="glass-panel p-12 text-center rounded-2xl">
                    <div className="w-10 h-10 border-4 border-agency-accent/30 border-t-agency-accent rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading projects...</p>
                </div>
            ) : projects.length === 0 ? (
                <div className="glass-panel p-12 text-center rounded-2xl">
                    <p className="text-gray-500">No projects found in the pipeline.</p>
                </div>
            ) : (
                <>
                    {/* Desktop View: Table */}
                    <div className="hidden lg:block glass-panel overflow-hidden rounded-xl">
                        <div className="table-container">
                            <table className="data-table w-full">
                                <thead>
                                    <tr className="bg-white/[0.02]">
                                        <th className="text-left p-4">Project Title</th>
                                        <th className="text-left p-4">Finder</th>
                                        <th className="text-left p-4">Status</th>
                                        <th className="text-left p-4">Team Size</th>
                                        <th className="text-left p-4">Payments</th>
                                        <th className="text-right p-4">Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {projects.map((project) => (
                                        <tr key={project.id} className="border-b border-white/5 hover:bg-white/[0.04] transition-all group">
                                            <td className="p-4">
                                                <div className="flex flex-col">
                                                    <Link href={`/dashboard/projects/${project.id}`} className="font-semibold text-white group-hover:text-agency-accent transition-colors">
                                                        {project.title}
                                                    </Link>
                                                    <span className="text-[10px] text-gray-500 flex items-center gap-1 mt-0.5">
                                                        {project.booking ? "Strategic Booking" : "Direct Entry"}
                                                    </span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2">
                                                    <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-[10px] font-bold">
                                                        {project.finder?.name?.[0] || "?"}
                                                    </div>
                                                    <span className="text-gray-300 text-sm">{project.finder?.name || "No User"}</span>
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider ${getStatusStyles(project.status)}`}>
                                                    {project.status}
                                                </span>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <Users className="w-3.5 h-3.5" />
                                                    {project._count.members}
                                                </div>
                                            </td>
                                            <td className="p-4">
                                                <div className="flex items-center gap-2 text-gray-400 text-sm">
                                                    <CreditCard className="w-3.5 h-3.5" />
                                                    {project._count.payments}
                                                </div>
                                            </td>
                                            <td className="text-right p-4">
                                                <Link
                                                    href={`/dashboard/projects/${project.id}`}
                                                    className="inline-flex items-center gap-1 text-xs font-bold text-agency-accent bg-agency-accent/10 px-3 py-1.5 rounded-lg hover:bg-agency-accent hover:text-white transition-all"
                                                >
                                                    Manage
                                                    <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    {/* Mobile/Tablet View: Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:hidden gap-4">
                        {projects.map((project) => (
                            <div key={project.id} className="glass-panel p-5 rounded-2xl space-y-4 hover:border-white/20 transition-all border-white/5 relative group">
                                <div className="flex justify-between items-start">
                                    <div className="space-y-1">
                                        <h3 className="font-bold text-white group-hover:text-agency-accent transition-colors">
                                            {project.title}
                                        </h3>
                                        <div className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">
                                            Finder: {project.finder?.name || "Unknown"}
                                        </div>
                                    </div>
                                    <span className={`text-[10px] px-2.5 py-1 rounded-full border font-bold uppercase tracking-wider h-fit ${getStatusStyles(project.status)}`}>
                                        {project.status.charAt(0)}
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 space-y-1">
                                        <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                                            <Users className="w-3 h-3" /> MEMBERS
                                        </div>
                                        <div className="text-sm font-bold text-white">{project._count.members}</div>
                                    </div>
                                    <div className="bg-white/[0.02] p-3 rounded-xl border border-white/5 space-y-1">
                                        <div className="text-[10px] text-gray-500 font-bold flex items-center gap-1">
                                            <CreditCard className="w-3 h-3" /> PAYMENTS
                                        </div>
                                        <div className="text-sm font-bold text-white">{project._count.payments}</div>
                                    </div>
                                </div>

                                <div className="pt-2">
                                    <Link
                                        href={`/dashboard/projects/${project.id}`}
                                        className="w-full inline-flex items-center justify-center gap-2 text-sm font-bold text-white bg-white/5 py-3 rounded-xl hover:bg-agency-accent transition-all border border-white/5"
                                    >
                                        Manage Project
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
