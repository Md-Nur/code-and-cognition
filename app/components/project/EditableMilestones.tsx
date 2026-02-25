"use client";

import { useState } from "react";
import { CheckCircle2, CircleDashed, Clock, Plus, Trash2, Edit2, ShieldAlert } from "lucide-react";

export default function EditableMilestones({ projectId, initialMilestones, userRole }: { projectId: string; initialMilestones: any[]; userRole: string }) {
    const [milestones, setMilestones] = useState(initialMilestones);
    const [isAdding, setIsAdding] = useState(false);
    const [newTitle, setNewTitle] = useState("");
    const [newDesc, setNewDesc] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editDesc, setEditDesc] = useState("");

    const canEdit = userRole !== "CLIENT";

    const handleAdd = async () => {
        if (!newTitle.trim() || isSaving) return;
        setIsSaving(true);
        try {
            const res = await fetch(`/api/project/${projectId}/milestones`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title: newTitle, description: newDesc }),
            });
            if (res.ok) {
                const newMs = await res.json();
                setMilestones([...milestones, newMs]);
                setNewTitle("");
                setNewDesc("");
                setIsAdding(false);
            }
        } catch (error) {
            console.error("Failed to add milestone:", error);
        } finally {
            setIsSaving(false);
        }
    };

    const handleStatusUpdate = async (id: string, newStatus: string) => {
        if (!canEdit) return;
        try {
            const res = await fetch(`/api/project/${projectId}/milestones`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, status: newStatus }),
            });
            if (res.ok) {
                const updated = await res.json();
                setMilestones(milestones.map(m => m.id === id ? updated : m));
            }
        } catch (error) {
            console.error("Failed to update status:", error);
        }
    };

    const handleSaveEdit = async (id: string) => {
        if (!editTitle.trim()) return;
        try {
            const res = await fetch(`/api/project/${projectId}/milestones`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ id, title: editTitle, description: editDesc }),
            });
            if (res.ok) {
                const updated = await res.json();
                setMilestones(milestones.map(m => m.id === id ? updated : m));
                setEditingId(null);
            }
        } catch (error) {
            console.error("Failed to save edit:", error);
        }
    };

    return (
        <div className="space-y-4">
            {milestones.length === 0 && !isAdding && (
                <div className="text-center py-12 bg-white/[0.02] border border-white/5 rounded-2xl">
                    <p className="text-gray-500 text-sm mb-4">No milestones defined yet.</p>
                    {canEdit && (
                        <button onClick={() => setIsAdding(true)} className="px-4 py-2 bg-white/10 hover:bg-white/15 text-white rounded-lg text-sm font-medium transition-colors inline-block">
                            Create First Milestone
                        </button>
                    )}
                </div>
            )}

            {milestones.map((milestone) => {
                const isCompleted = milestone.status === "COMPLETED";
                const isInProgress = milestone.status === "IN_PROGRESS";
                const isEditing = editingId === milestone.id;

                if (isEditing) {
                    return (
                        <div key={milestone.id} className="p-5 rounded-2xl border border-white/10 bg-white/5 space-y-4">
                            <input
                                value={editTitle}
                                onChange={(e) => setEditTitle(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-agency-accent"
                                placeholder="Milestone Title"
                            />
                            <textarea
                                value={editDesc}
                                onChange={(e) => setEditDesc(e.target.value)}
                                className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-agency-accent min-h-[80px]"
                                placeholder="Description (Optional)"
                            />
                            <div className="flex gap-3 justify-end">
                                <button onClick={() => setEditingId(null)} className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
                                <button onClick={() => handleSaveEdit(milestone.id)} className="px-4 py-2 bg-agency-accent hover:bg-agency-accent/90 text-agency-dark rounded-xl text-xs font-semibold transition-colors">Save</button>
                            </div>
                        </div>
                    );
                }

                return (
                    <div key={milestone.id} className={`group flex items-start gap-4 p-5 rounded-2xl border transition-all ${isCompleted ? "bg-emerald-500/5 border-emerald-500/20" : isInProgress ? "bg-blue-500/5 border-blue-500/20" : "bg-white/[0.02] border-white/5"}`}>
                        <button
                            disabled={!canEdit}
                            onClick={() => {
                                const nextStatus = isCompleted ? "PENDING" : isInProgress ? "COMPLETED" : "IN_PROGRESS";
                                handleStatusUpdate(milestone.id, nextStatus);
                            }}
                            className={`mt-0.5 shrink-0 transition-colors ${!canEdit ? "cursor-default opacity-80" : "hover:scale-110 active:scale-95"} ${isCompleted ? "text-emerald-500" : isInProgress ? "text-blue-500" : "text-gray-600 hover:text-gray-400"}`}
                        >
                            {isCompleted ? <CheckCircle2 className="w-5 h-5" /> : isInProgress ? <Clock className="w-5 h-5 animate-pulse" /> : <CircleDashed className="w-5 h-5" />}
                        </button>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-white">{milestone.title}</p>
                            {milestone.description && <p className="text-xs text-gray-500 mt-1 leading-relaxed">{milestone.description}</p>}
                        </div>

                        {canEdit && (
                            <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2 shrink-0">
                                <button
                                    onClick={() => { setEditingId(milestone.id); setEditTitle(milestone.title); setEditDesc(milestone.description || ""); }}
                                    className="p-1.5 text-gray-500 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
                                >
                                    <Edit2 className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        )}

                        <span className={`text-[10px] font-bold uppercase tracking-widest shrink-0 mt-1 ${isCompleted ? "text-emerald-500" : isInProgress ? "text-blue-500" : "text-gray-600"}`}>
                            {milestone.status.replace("_", " ")}
                        </span>
                    </div>
                );
            })}

            {canEdit && !isAdding && milestones.length > 0 && (
                <button
                    onClick={() => setIsAdding(true)}
                    className="w-full py-4 border border-dashed border-white/10 hover:border-white/20 hover:bg-white/[0.02] rounded-2xl text-xs font-semibold text-gray-400 hover:text-white transition-all flex items-center justify-center gap-2"
                >
                    <Plus className="w-4 h-4" /> Add Milestone
                </button>
            )}

            {isAdding && (
                <div className="p-5 rounded-2xl border border-agency-accent/30 bg-agency-accent/5 space-y-4">
                    <input
                        value={newTitle}
                        onChange={(e) => setNewTitle(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-agency-accent"
                        placeholder="Milestone Title"
                        autoFocus
                    />
                    <textarea
                        value={newDesc}
                        onChange={(e) => setNewDesc(e.target.value)}
                        className="w-full bg-black/50 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-agency-accent min-h-[80px]"
                        placeholder="Description (Optional)"
                    />
                    <div className="flex gap-3 justify-end">
                        <button onClick={() => { setIsAdding(false); setNewTitle(""); setNewDesc(""); }} className="px-4 py-2 text-xs font-medium text-gray-400 hover:text-white transition-colors">Cancel</button>
                        <button onClick={handleAdd} disabled={!newTitle.trim() || isSaving} className="px-4 py-2 bg-agency-accent hover:bg-agency-accent/90 text-agency-dark disabled:opacity-50 disabled:cursor-not-allowed rounded-xl text-xs font-semibold transition-colors">Add Milestone</button>
                    </div>
                </div>
            )}

            {!canEdit && (
                <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl flex gap-3 text-blue-400 items-start">
                    <ShieldAlert className="w-5 h-5 shrink-0 mt-0.5" />
                    <p className="text-xs leading-relaxed">
                        Milestones and progress tracking are managed by your agency team. You will be notified when milestones are completed or updated.
                    </p>
                </div>
            )}
        </div>
    );
}
