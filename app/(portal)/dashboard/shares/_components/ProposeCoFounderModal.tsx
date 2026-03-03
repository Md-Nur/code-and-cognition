"use client";

import { useState, useEffect } from "react";
import { X, UserPlus, Target, AlertCircle, Loader2 } from "lucide-react";
import { Role, User } from "@prisma/client";

interface ProposeCoFounderModalProps {
    onClose: () => void;
    onSuccess: () => void;
}

export default function ProposeCoFounderModal({ onClose, onSuccess }: ProposeCoFounderModalProps) {
    const [contractors, setContractors] = useState<User[]>([]);
    const [selectedUserId, setSelectedUserId] = useState("");
    const [targetShare, setTargetShare] = useState("5");
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        async function fetchContractors() {
            try {
                const res = await fetch("/api/admin/users");
                if (res.ok) {
                    const data = await res.json();
                    // Filter contractors who have been around for > 3 months
                    const threeMonthsAgo = new Date();
                    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

                    const eligible = data.filter((u: User) =>
                        u.role === Role.CONTRACTOR &&
                        new Date(u.createdAt) <= threeMonthsAgo
                    );
                    setContractors(eligible);
                }
            } catch (err) {
                console.error(err);
                setError("Failed to fetch contractors");
            } finally {
                setIsLoading(false);
            }
        }
        fetchContractors();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/admin/shares/proposals", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId: selectedUserId,
                    targetShare: parseFloat(targetShare)
                })
            });

            if (res.ok) {
                onSuccess();
                onClose();
            } else {
                const data = await res.json();
                setError(data.error || "Failed to create proposal");
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md z-[100] flex items-center justify-center p-4">
            <div
                className="bg-agency-black border border-white/10 w-full max-w-lg rounded-[2.5rem] overflow-hidden shadow-2xl animate-in zoom-in-95 duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className="p-8 pb-0 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-agency-accent/10 flex items-center justify-center text-agency-accent">
                            <UserPlus className="w-6 h-6" />
                        </div>
                        <div>
                            <h2 className="text-xl font-display font-semibold text-white">Propose Co-Founder</h2>
                            <p className="text-gray-500 text-sm">Elevate a contractor to co-founder status</p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-white/5 rounded-full text-gray-400 hover:text-white transition-colors"
                    >
                        <X className="w-6 h-6" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-8 space-y-6">
                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 p-4 rounded-2xl flex items-center gap-3 text-red-500 text-sm animate-in fade-in slide-in-from-top-2">
                            <AlertCircle className="w-5 h-5 shrink-0" />
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Select Eligible Contractor</label>
                        <select
                            required
                            value={selectedUserId}
                            onChange={(e) => setSelectedUserId(e.target.value)}
                            className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-agency-accent/50 focus:border-agency-accent/50 transition-all appearance-none cursor-pointer"
                        >
                            <option value="" disabled className="bg-agency-black">Choose a member...</option>
                            {contractors.map(u => (
                                <option key={u.id} value={u.id} className="bg-agency-black">
                                    {u.name} ({new Date(u.createdAt).toLocaleDateString()})
                                </option>
                            ))}
                        </select>
                        <p className="text-[10px] text-gray-500 ml-1">Only contractors with 3+ months tenure are eligible.</p>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-500 ml-1">Initial Share (%)</label>
                        <div className="relative">
                            <Target className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                            <input
                                type="number"
                                step="0.1"
                                min="0.1"
                                max="100"
                                required
                                value={targetShare}
                                onChange={(e) => setTargetShare(e.target.value)}
                                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-5 py-4 text-white focus:outline-none focus:ring-2 focus:ring-agency-accent/50 focus:border-agency-accent/50 transition-all"
                                placeholder="e.g. 5.0"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting || isLoading || contractors.length === 0}
                        className="w-full btn-brand rounded-2xl py-4 font-bold tracking-tight disabled:opacity-50 disabled:cursor-not-allowed group transition-all"
                    >
                        {isSubmitting ? (
                            <Loader2 className="w-5 h-5 animate-spin mx-auto" />
                        ) : (
                            "Launch Consensus Vote"
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
