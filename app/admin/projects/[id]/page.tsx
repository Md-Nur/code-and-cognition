"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project, User, Booking, Payment, LedgerEntry, ProjectMember } from "@prisma/client";

type ProjectDetails = Project & {
    finder: User;
    booking: Booking | null;
    members: (ProjectMember & { user: User })[];
    payments: (Payment & { splits: LedgerEntry[] })[];
};

export default function AdminProjectDetailsPage() {
    const params = useParams();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [memberFormData, setMemberFormData] = useState({ userId: "", share: 0 });

    useEffect(() => {
        async function fetchProject() {
            if (!params?.id) return;
            try {
                const res = await fetch(`/api/admin/projects/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProject(data);
                }
            } finally {
                setLoading(false);
            }
        }
        fetchProject();

        async function fetchUsers() {
            const res = await fetch("/api/admin/users");
            if (res.ok) setAllUsers(await res.json());
        }
        fetchUsers();
    }, [params.id]);

    async function handleAddMember(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch(`/api/admin/projects/${project?.id}/members`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(memberFormData),
            });
            if (res.ok) {
                setShowMemberModal(false);
                // Refresh project data
                const updated = await fetch(`/api/admin/projects/${project?.id}`).then(r => r.json());
                setProject(updated);
            }
        } catch (e) { console.error(e); }
    }

    async function handleRemoveMember(userId: string) {
        if (!confirm("Remove this member?")) return;
        try {
            const res = await fetch(`/api/admin/projects/${project?.id}/members?userId=${userId}`, {
                method: "DELETE",
            });
            if (res.ok) {
                const updated = await fetch(`/api/admin/projects/${project?.id}`).then(r => r.json());
                setProject(updated);
            }
        } catch (e) { console.error(e); }
    }

    async function handleStatusChange(newStatus: string) {
        if (!confirm(`Change project status to ${newStatus}?`)) return;
        try {
            const res = await fetch(`/api/admin/projects/${project?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status: newStatus }),
            });
            if (res.ok) {
                const updated = await fetch(`/api/admin/projects/${project?.id}`).then(r => r.json());
                setProject(updated);
            }
        } catch (e) { console.error(e); }
    }

    if (loading) return <div className="p-8 text-center text-gray-500">Loading project details...</div>;
    if (!project) return <div className="p-8 text-center text-red-500">Project not found.</div>;

    return (
        <div className="space-y-8 animate-fade-in-up">
            {/* Header */}
            <div className="flex justify-between items-start">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <h1 className="text-3xl font-bold tracking-tight">{project.title}</h1>
                        <span className={`text-xs px-2 py-1 rounded border ${project.status === "ACTIVE" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                            project.status === "COMPLETED" ? "border-green-500/30 text-green-400 bg-green-500/10" :
                                "border-gray-500/30 text-gray-400 bg-gray-500/10"
                            }`}>
                            {project.status}
                        </span>
                    </div>
                    <p className="text-gray-400 text-sm">Created on {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    {project.status === "ACTIVE" && (
                        <button
                            onClick={() => handleStatusChange("COMPLETED")}
                            className="btn-brand"
                        >
                            Mark as Completed
                        </button>
                    )}
                    <button className="btn-outline">Edit Project</button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column: Details & Team */}
                <div className="space-y-8 lg:col-span-2">

                    {/* Project Info */}
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-4">Project Information</h3>
                        <dl className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                                <dt className="text-gray-500">Finder</dt>
                                <dd className="font-medium">{project.finder.name}</dd>
                            </div>
                            <div>
                                <dt className="text-gray-500">Booking Source</dt>
                                <dd className="font-medium">{project.booking ? "Online Booking" : "Direct / Manual"}</dd>
                            </div>
                            {project.booking && (
                                <div className="col-span-2 mt-2 pt-2 border-t border-white/5">
                                    <dt className="text-gray-500">Initial Request</dt>
                                    <dd className="text-gray-400 italic">"{project.booking.message}"</dd>
                                </div>
                            )}
                        </dl>
                    </div>

                    {/* Team Members */}
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">Execution Team</h3>
                            <button
                                onClick={() => setShowMemberModal(true)}
                                className="text-xs text-agency-accent hover:text-white"
                            >
                                + Add Member
                            </button>
                        </div>
                        <div className="space-y-3">
                            {project.members.map((member) => (
                                <div key={member.id} className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/5">
                                    <div className="flex items-center gap-3">
                                        <div className="w-8 h-8 rounded-full bg-agency-accent/20 flex items-center justify-center font-bold text-xs">
                                            {member.user.name.charAt(0)}
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium">{member.user.name}</p>
                                            <p className="text-xs text-gray-500">{member.user.role} • {member.share}% Share</p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => handleRemoveMember(member.userId)}
                                        className="text-gray-600 hover:text-red-400 transition-colors"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                            {project.members.length === 0 && (
                                <p className="text-gray-500 text-sm italic">No execution members assigned yet.</p>
                            )}
                        </div>
                    </div>

                    {/* Add Member Modal */}
                    {showMemberModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="glass-panel w-full max-w-sm p-6 rounded-xl animate-fade-in-up">
                                <h3 className="text-lg font-bold mb-4">Assign Team Member</h3>
                                <form onSubmit={handleAddMember} className="space-y-4">
                                    <div>
                                        <label className="input-label">Select User</label>
                                        <select
                                            required
                                            className="select-field"
                                            value={memberFormData.userId}
                                            onChange={(e) => setMemberFormData({ ...memberFormData, userId: e.target.value })}
                                        >
                                            <option value="">Choose a user...</option>
                                            {allUsers.map(u => (
                                                <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                            ))}
                                        </select>
                                    </div>
                                    <div>
                                        <label className="input-label">Profit Share (%)</label>
                                        <input
                                            type="number"
                                            required
                                            min="0"
                                            max="100"
                                            className="input-field"
                                            value={memberFormData.share}
                                            onChange={(e) => setMemberFormData({ ...memberFormData, share: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <button type="button" onClick={() => setShowMemberModal(false)} className="btn-outline flex-1">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-brand flex-1">
                                            Add to Team
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Financials */}
                <div className="space-y-8">
                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-4">Financial Overview</h3>
                        <div className="space-y-4">
                            <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-lg">
                                <p className="text-xs text-green-400 mb-1">Total Revenue (BDT)</p>
                                <p className="text-2xl font-bold text-green-400">
                                    ৳{project.payments.reduce((sum, p) => sum + (p.amountBDT || 0), 0).toLocaleString()}
                                </p>
                            </div>
                            <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
                                <p className="text-xs text-blue-400 mb-1">Total Revenue (USD)</p>
                                <p className="text-2xl font-bold text-blue-400">
                                    ${project.payments.reduce((sum, p) => sum + (p.amountUSD || 0), 0).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-4">Payment History</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {project.payments.map((payment) => (
                                <div key={payment.id} className="border-b border-white/5 pb-4 last:border-0 last:pb-0">
                                    <div className="flex justify-between items-start mb-1">
                                        <span className="text-sm font-medium">
                                            {payment.amountBDT ? `৳${payment.amountBDT.toLocaleString()}` : `$${payment.amountUSD?.toLocaleString()}`}
                                        </span>
                                        <span className="text-xs text-gray-500">{new Date(payment.paidAt).toLocaleDateString()}</span>
                                    </div>
                                    <p className="text-xs text-gray-500 mb-2">{payment.note || "No note"}</p>

                                    {/* Splits Mini-View */}
                                    <div className="space-y-1">
                                        {payment.splits.map((split) => (
                                            <div key={split.id} className="flex justify-between text-[10px] text-gray-400">
                                                <span>{split.type}</span>
                                                <span>{split.amountBDT ? `৳${split.amountBDT}` : `$${split.amountUSD}`}</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                            {project.payments.length === 0 && (
                                <p className="text-gray-500 text-sm">No payments recorded.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
