"use client";

import { useState } from "react";
import { ProjectStatus, ProjectHealth } from "@prisma/client";
import { CheckCircle2, Truck, AlertCircle, Save, Loader2 } from "lucide-react";

interface ProjectAdminActionsProps {
    projectId: string;
    currentStatus: ProjectStatus;
    currentHealth: ProjectHealth;
}

export default function ProjectAdminActions({ projectId, currentStatus, currentHealth }: ProjectAdminActionsProps) {
    const [status, setStatus] = useState<ProjectStatus>(currentStatus);
    const [health, setHealth] = useState<ProjectHealth>(currentHealth);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    async function handleUpdate() {
        setLoading(true);
        setSuccess(false);
        try {
            const res = await fetch(`/api/admin/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, health }),
            });
            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                window.location.reload(); // Refresh to update activity logs and other UI
            } else {
                alert("Failed to update project");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-6">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                <Save className="w-4 h-4 text-agency-accent" /> Admin Operations
            </h3>

            <div className="space-y-4">
                <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-2">Project Status</label>
                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { val: "ACTIVE", label: "Active", icon: Loader2 },
                            { val: "DELIVERED", label: "Delivered", icon: Truck },
                            { val: "COMPLETED", label: "Completed", icon: CheckCircle2 },
                            { val: "CANCELLED", label: "Cancelled", icon: AlertCircle },
                        ].map((s) => (
                            <button
                                key={s.val}
                                onClick={() => setStatus(s.val as ProjectStatus)}
                                className={`flex items-center gap-2 px-3 py-2 rounded-xl text-xs transition-all border ${status === s.val
                                        ? "bg-agency-accent/10 border-agency-accent text-agency-accent"
                                        : "bg-white/5 border-transparent text-gray-400 hover:bg-white/10"
                                    }`}
                            >
                                <s.icon className={`w-3.5 h-3.5 ${status === s.val ? "animate-spin-slow" : ""}`} />
                                {s.label}
                            </button>
                        ))}
                    </div>
                </div>

                <div>
                    <label className="text-[10px] uppercase tracking-wider text-gray-500 block mb-2">Project Health</label>
                    <div className="grid grid-cols-3 gap-2">
                        {[
                            { val: "GREEN", label: "Green", color: "text-emerald-500" },
                            { val: "YELLOW", label: "Yellow", color: "text-amber-500" },
                            { val: "RED", label: "Red", color: "text-rose-500" },
                        ].map((h) => (
                            <button
                                key={h.val}
                                onClick={() => setHealth(h.val as ProjectHealth)}
                                className={`px-3 py-2 rounded-xl text-xs transition-all border ${health === h.val
                                        ? "bg-white/10 border-white/20 text-white"
                                        : "bg-white/5 border-transparent text-gray-500 hover:bg-white/10"
                                    }`}
                            >
                                <span className={`inline-block w-2 h-2 rounded-full mr-2 ${h.val === "GREEN" ? "bg-emerald-500" : h.val === "YELLOW" ? "bg-amber-500" : "bg-rose-500"
                                    }`} />
                                {h.label}
                            </button>
                        ))}
                    </div>
                </div>

                <button
                    onClick={handleUpdate}
                    disabled={loading || (status === currentStatus && health === currentHealth)}
                    className="w-full btn-brand py-3 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
                    {success ? "Changes Saved!" : "Save Updates"}
                </button>
            </div>
        </div>
    );
}
