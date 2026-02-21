"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Project, User, Booking, Payment, LedgerEntry, ProjectMember, Milestone, MilestoneStatus, ActivityLog } from "@prisma/client";

type ProjectDetails = Project & {
    finder: User;
    booking: Booking | null;
    members: (ProjectMember & { user: User })[];
    payments: (Payment & { splits: LedgerEntry[] })[];
    milestones: Milestone[];
    activityLogs: (ActivityLog & { user: { name: string } | null })[];
};

export default function AdminProjectDetailsPage() {
    const params = useParams();
    const [project, setProject] = useState<ProjectDetails | null>(null);
    const [loading, setLoading] = useState(true);
    const [allUsers, setAllUsers] = useState<User[]>([]);
    const [showMemberModal, setShowMemberModal] = useState(false);
    const [memberFormData, setMemberFormData] = useState({ userId: "", share: 0 });

    const [showMilestoneModal, setShowMilestoneModal] = useState(false);
    const [milestoneFormData, setMilestoneFormData] = useState({ title: "", description: "", order: 0 });
    const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);

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

    async function handleHealthChange(newHealth: string) {
        try {
            const res = await fetch(`/api/admin/projects/${project?.id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ health: newHealth }),
            });
            if (res.ok) {
                const updated = await fetch(`/api/admin/projects/${project?.id}`).then(r => r.json());
                setProject(updated);
            }
        } catch (e) { console.error(e); }
    }

    async function handleMilestoneSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const url = `/api/admin/projects/${project?.id}/milestones`;
            const method = editingMilestoneId ? "PATCH" : "POST";
            const body = editingMilestoneId
                ? { ...milestoneFormData, id: editingMilestoneId }
                : milestoneFormData;

            const res = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });
            if (res.ok) {
                setShowMilestoneModal(false);
                setEditingMilestoneId(null);
                setMilestoneFormData({ title: "", description: "", order: (project?.milestones.length || 0) + 1 });
                const updated = await fetch(`/api/admin/projects/${project?.id}`).then(r => r.json());
                setProject(updated);
            }
        } catch (e) { console.error(e); }
    }

    async function handleMilestoneStatusUpdate(milestoneId: string, status: MilestoneStatus) {
        try {
            const res = await fetch(`/api/admin/projects/${project?.id}/milestones`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id: milestoneId, status }),
            });
            if (res.ok) {
                const updated = await fetch(`/api/admin/projects/${project?.id}`).then(r => r.json());
                setProject(updated);
            }
        } catch (e) { console.error(e); }
    }

    async function handleMilestoneDelete(milestoneId: string) {
        if (!confirm("Delete this milestone?")) return;
        try {
            const res = await fetch(`/api/admin/projects/${project?.id}/milestones?id=${milestoneId}`, {
                method: "DELETE",
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
                        <div className="flex gap-2">
                            <span className={`text-xs px-2 py-1 rounded border ${project.status === "ACTIVE" ? "border-blue-500/30 text-blue-400 bg-blue-500/10" :
                                project.status === "COMPLETED" ? "border-green-500/30 text-green-400 bg-green-500/10" :
                                    "border-gray-500/30 text-gray-400 bg-gray-500/10"
                                }`}>
                                {project.status}
                            </span>
                            <select
                                value={project.health}
                                onChange={(e) => handleHealthChange(e.target.value)}
                                className={`text-xs px-2 py-0.5 rounded border bg-transparent cursor-pointer font-semibold ${project.health === "GREEN" ? "border-emerald-500/30 text-emerald-400" :
                                    project.health === "YELLOW" ? "border-amber-500/30 text-amber-400" :
                                        "border-rose-500/30 text-rose-400"
                                    }`}
                            >
                                <option value="GREEN" className="bg-gray-900">Health: GREEN</option>
                                <option value="YELLOW" className="bg-gray-900">Health: YELLOW</option>
                                <option value="RED" className="bg-gray-900">Health: RED</option>
                            </select>
                        </div>
                    </div>
                    <p className="text-gray-400 text-sm">Created on {new Date(project.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                    {project.status === "ACTIVE" && (
                        <button
                            onClick={() => handleStatusChange("COMPLETED")}
                            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-2 rounded-lg text-sm font-bold transition-colors shadow-lg shadow-emerald-600/20"
                        >
                            Mark Complete
                        </button>
                    )}
                    <button className="btn-outline">Edit</button>
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

                    {/* Project Milestones */}
                    <div className="glass-panel p-6 rounded-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold">Project Milestones</h3>
                            <button
                                onClick={() => {
                                    setEditingMilestoneId(null);
                                    setMilestoneFormData({ title: "", description: "", order: project.milestones.length + 1 });
                                    setShowMilestoneModal(true);
                                }}
                                className="btn-brand text-xs px-3 py-1.5"
                            >
                                + Add Milestone
                            </button>
                        </div>

                        <div className="space-y-4">
                            {project.milestones.length === 0 ? (
                                <p className="text-gray-500 text-sm italic text-center py-4">No milestones defined for this project.</p>
                            ) : (
                                project.milestones.map((m) => (
                                    <div key={m.id} className="group p-4 bg-white/5 rounded-xl border border-white/5 hover:border-white/10 transition-all">
                                        <div className="flex justify-between items-start gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-2 mb-1">
                                                    <span className={`w-2 h-2 rounded-full ${m.status === "COMPLETED" ? "bg-emerald-500" :
                                                        m.status === "IN_PROGRESS" ? "bg-blue-500 animate-pulse" :
                                                            "bg-gray-600"
                                                        }`} />
                                                    <h4 className="font-bold text-sm">{m.title}</h4>
                                                </div>
                                                {m.description && <p className="text-xs text-gray-500 line-clamp-2">{m.description}</p>}
                                            </div>
                                            <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <select
                                                    value={m.status}
                                                    onChange={(e) => handleMilestoneStatusUpdate(m.id, e.target.value as MilestoneStatus)}
                                                    className="text-[10px] bg-gray-800 border border-white/10 rounded px-1.5 py-1 outline-none"
                                                >
                                                    <option value="PENDING">Pending</option>
                                                    <option value="IN_PROGRESS">In Progress</option>
                                                    <option value="COMPLETED">Completed</option>
                                                </select>
                                                <button
                                                    onClick={() => {
                                                        setEditingMilestoneId(m.id);
                                                        setMilestoneFormData({
                                                            title: m.title,
                                                            description: m.description || "",
                                                            order: m.order
                                                        });
                                                        setShowMilestoneModal(true);
                                                    }}
                                                    className="p-1 hover:text-blue-400 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                                </button>
                                                <button
                                                    onClick={() => handleMilestoneDelete(m.id)}
                                                    className="p-1 hover:text-rose-500 transition-colors"
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
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
                    {/* Milestone Modal */}
                    {showMilestoneModal && (
                        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                            <div className="glass-panel w-full max-w-sm p-6 rounded-xl animate-fade-in-up">
                                <h3 className="text-lg font-bold mb-4">{editingMilestoneId ? "Edit Milestone" : "Add Milestone"}</h3>
                                <form onSubmit={handleMilestoneSubmit} className="space-y-4">
                                    <div>
                                        <label className="input-label">Title</label>
                                        <input
                                            required
                                            className="input-field"
                                            placeholder="e.g., UI Design Completion"
                                            value={milestoneFormData.title}
                                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, title: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Description (Optional)</label>
                                        <textarea
                                            className="input-field h-24"
                                            placeholder="What will be delivered?"
                                            value={milestoneFormData.description}
                                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, description: e.target.value })}
                                        />
                                    </div>
                                    <div>
                                        <label className="input-label">Display Order</label>
                                        <input
                                            type="number"
                                            required
                                            className="input-field"
                                            value={milestoneFormData.order}
                                            onChange={(e) => setMilestoneFormData({ ...milestoneFormData, order: parseInt(e.target.value) })}
                                        />
                                    </div>
                                    <div className="flex gap-4 pt-2">
                                        <button type="button" onClick={() => setShowMilestoneModal(false)} className="btn-outline flex-1">
                                            Cancel
                                        </button>
                                        <button type="submit" className="btn-brand flex-1">
                                            {editingMilestoneId ? "Update" : "Create"}
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right Column: Financials & Sharing */}
                <div className="space-y-8">
                    {/* Magic Link Sharing */}
                    <div className="glass-panel p-6 rounded-xl border-agency-accent/20 bg-agency-accent/5">
                        <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-agency-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" /></svg>
                            Client Portal
                        </h3>
                        <p className="text-xs text-gray-400 mb-4">Share this magic link with your client. No password required.</p>
                        <div className="flex gap-2">
                            <input
                                readOnly
                                className="input-field text-xs bg-black/40"
                                value={`${window.location.origin}/portal/project/${project.viewToken}`}
                            />
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/portal/project/${project.viewToken}`);
                                    alert("Link copied to clipboard!");
                                }}
                                className="p-2 bg-agency-accent/20 text-agency-accent rounded-lg hover:bg-agency-accent hover:text-white transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" /></svg>
                            </button>
                        </div>
                    </div>

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

                    <div className="glass-panel p-6 rounded-xl">
                        <h3 className="text-lg font-bold mb-4">Activity Feed</h3>
                        <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                            {project.activityLogs.map((log) => (
                                <div key={log.id} className="border-b border-white/5 pb-3 last:border-0 last:pb-0">
                                    <p className="text-xs">
                                        <span className="font-bold text-agency-accent">{log.user?.name || "System"}</span> {log.action}
                                    </p>
                                    <p className="text-[10px] text-gray-500 mt-1">{new Date(log.createdAt).toLocaleString()}</p>
                                </div>
                            ))}
                            {project.activityLogs.length === 0 && (
                                <p className="text-gray-500 text-sm">No activity recorded yet.</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
