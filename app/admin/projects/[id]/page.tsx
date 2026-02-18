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

    useEffect(() => {
        async function fetchProject() {
            if (!params?.id) return;
            try {
                const res = await fetch(`/api/admin/projects/${params.id}`);
                if (res.ok) {
                    const data = await res.json();
                    setProject(data);
                } else {
                    console.error("Failed to fetch project");
                }
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        }
        fetchProject();
    }, [params.id]);

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
                <button className="btn-outline">Edit Project</button>
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
                            <button className="text-xs text-agency-accent hover:text-white">+ Add Member</button>
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
                                </div>
                            ))}
                            {project.members.length === 0 && (
                                <p className="text-gray-500 text-sm italic">No execution members assigned yet.</p>
                            )}
                        </div>
                    </div>
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
