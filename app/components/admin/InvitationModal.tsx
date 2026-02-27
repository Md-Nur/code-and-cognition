"use client";

import { useState } from "react";
import { UserPlus, X, CheckCircle2, Copy, Trash2, ShieldCheck } from "lucide-react";
import { Role } from "@prisma/client";

interface Invitation {
    id: string;
    email: string;
    role: Role;
    token: string;
    expiresAt: string;
}

export default function InvitationModal({
    onClose,
    onSuccess
}: {
    onClose: () => void;
    onSuccess: () => void;
}) {
    const [email, setEmail] = useState("");
    const [role, setRole] = useState<Role>(Role.CONTRACTOR);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/invitations", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, role }),
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to create invitation");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[60] flex items-center justify-center p-4">
            <div className="glass-panel w-full max-w-md p-0 rounded-3xl overflow-hidden animate-fade-in-up border-white/10 shadow-[0_0_50px_rgba(230,255,0,0.1)]">
                <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/[0.02]">
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                        <UserPlus className="w-5 h-5 text-agency-accent" />
                        Invite New Member
                    </h3>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full transition-colors text-gray-500 hover:text-white">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="input-label">Email Address</label>
                        <input
                            type="email"
                            required
                            className="input-field"
                            placeholder="colleague@agency.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="input-label">Role</label>
                        <select
                            className="select-field"
                            value={role}
                            onChange={(e) => setRole(e.target.value as Role)}
                        >
                            <option value={Role.CONTRACTOR}>Contractor (Staff)</option>
                            <option value={Role.CO_FOUNDER}>Co-Founder (Admin)</option>
                            <option value={Role.FOUNDER}>Founder (Owner)</option>
                        </select>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-2 px-1">
                            {role === Role.FOUNDER ? "Full ownership and financial access" :
                                role === Role.CO_FOUNDER ? "Administrative access to projects and teams" :
                                    "Access to assigned projects and personal ledger"}
                        </p>
                    </div>

                    {error && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 text-xs text-center">
                            {error}
                        </div>
                    )}

                    <div className="flex gap-4 pt-4 border-t border-white/5">
                        <button type="button" onClick={onClose} className="btn-outline flex-1 rounded-2xl py-3">
                            Cancel
                        </button>
                        <button type="submit" disabled={isSubmitting} className="btn-brand flex-1 rounded-2xl py-3 gap-2">
                            {isSubmitting ? "Sending..." : (
                                <>
                                    <CheckCircle2 className="w-4 h-4" />
                                    Send Invite
                                </>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
