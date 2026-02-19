"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Project, User, Booking } from "@prisma/client";

type ProjectWithRelations = Project & {
    finder: User;
    booking: Booking | null;
    _count: { members: number; payments: number };
};

export default function AdminProjectsPage() {
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

    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <h1 className="text-2xl font-bold">Projects Management</h1>
                <Link href="/admin/projects/new" className="btn-brand w-full sm:w-auto text-center">
                    + New Project
                </Link>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl table-container">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left p-4">Project Title</th>
                            <th className="text-left p-4">Finder</th>
                            <th className="text-left p-4">Status</th>
                            <th className="text-left p-4">Team Size</th>
                            <th className="text-left p-4">Payments</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={6} className="text-center py-8">Loading projects...</td></tr>
                        ) : projects.length === 0 ? (
                            <tr><td colSpan={6} className="text-center py-8 text-gray-500">No projects found.</td></tr>
                        ) : projects.map((project) => (
                            <tr key={project.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium">
                                    <Link href={`/admin/projects/${project.id}`} className="hover:text-agency-accent hover:underline">
                                        {project.title}
                                    </Link>
                                    <div className="text-xs text-gray-500">{project.booking ? "From Booking" : "Manual Entry"}</div>
                                </td>
                                <td className="p-4">{project.finder?.name || "Unknown"}</td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded border ${project.status === "ACTIVE" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                                        project.status === "COMPLETED" ? "border-green-500/30 text-green-400 bg-green-500/10" :
                                            "border-gray-500/30 text-gray-400 bg-gray-500/10"
                                        }`}>
                                        {project.status}
                                    </span>
                                </td>
                                <td className="p-4">{project._count.members} Members</td>
                                <td className="p-4">{project._count.payments} Payments</td>
                                <td className="text-right p-4">
                                    <Link href={`/admin/projects/${project.id}`} className="text-agency-accent hover:text-white mr-3 transition-colors">
                                        Manage
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
