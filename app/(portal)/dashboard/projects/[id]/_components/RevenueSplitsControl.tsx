"use client";

import { useState } from "react";
import { User, ProjectMemberRole } from "@prisma/client";
import { Users, Percent, Trash2, Plus, Info, Loader2, Save, UserCheck, Briefcase } from "lucide-react";

interface Member {
    id?: string;
    userId: string;
    role: ProjectMemberRole;
    share: number;
    user?: {
        name: string;
        email: string;
    };
}

interface RevenueSplitsControlProps {
    projectId: string;
    initialCompanyFundRatio: number;
    initialFinderFeeRatio: number;
    initialMembers: Member[];
    allUsers: User[];
}

export default function RevenueSplitsControl({
    projectId,
    initialCompanyFundRatio,
    initialFinderFeeRatio,
    initialMembers,
    allUsers
}: RevenueSplitsControlProps) {
    const companyFundRatio = 20;
    const finderFeeRatio = 10;
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const executionPoolRatio = Math.max(0, 100 - companyFundRatio - finderFeeRatio);

    const addMember = (role: ProjectMemberRole) => {
        if (role === "FINDER") {
            const finders = members.filter(m => m.role === "FINDER");
            if (finders.length >= 1) return; // Max 1 finder
        }

        let newMembers: Member[] = [...members, { userId: "", role, share: 0 }];

        if (role === "FINDER") {
            newMembers = newMembers.map(m =>
                m.role === "FINDER" ? { ...m, share: 10 } : m
            );
        } else if (role === "EXECUTION") {
            const executionMembers = newMembers.filter(m => m.role === "EXECUTION");
            const count = executionMembers.length;
            if (count > 0) {
                const sharePerMember = parseFloat((executionPoolRatio / count).toFixed(2));
                newMembers = newMembers.map(m =>
                    m.role === "EXECUTION" ? { ...m, share: sharePerMember } : m
                );
            }
        }

        setMembers(newMembers);
    };

    const removeMember = (index: number) => {
        const removedRole = members[index].role;
        let newMembers = members.filter((_, i) => i !== index);

        if (removedRole === "EXECUTION") {
            const executionMembers = newMembers.filter(m => m.role === "EXECUTION");
            const count = executionMembers.length;
            if (count > 0) {
                const sharePerMember = parseFloat((executionPoolRatio / count).toFixed(2));
                newMembers = newMembers.map(m =>
                    m.role === "EXECUTION" ? { ...m, share: sharePerMember } : m
                );
            }
        }

        setMembers(newMembers);
    };

    const updateMember = (index: number, updates: Partial<Member>) => {
        const newMembers = [...members];
        newMembers[index] = { ...newMembers[index], ...updates };
        setMembers(newMembers);
    };

    async function handleSave() {
        setLoading(true);
        setSuccess(false);
        try {
            const hasEmptyUser = members.some(m => !m.userId);
            if (hasEmptyUser) {
                alert("All members must have a user selected");
                setLoading(false);
                return;
            }

            // Check for duplicates within each role
            const finderIds = members.filter(m => m.role === "FINDER").map(m => m.userId);
            const executionIds = members.filter(m => m.role === "EXECUTION").map(m => m.userId);

            if (new Set(finderIds).size !== finderIds.length || new Set(executionIds).size !== executionIds.length) {
                alert("The same user cannot be added multiple times to the same role category");
                setLoading(false);
                return;
            }

            const res = await fetch(`/api/admin/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyFundRatio: 0.2, // 20% by default based on UI
                    finderFeeRatio: 0.1,   // 10% by default based on UI
                    members: members.map(m => ({
                        userId: m.userId,
                        role: m.role,
                        share: m.role === "FINDER" ? 10 : m.share
                    }))
                }),
            });

            if (res.ok) {
                setSuccess(true);
                setTimeout(() => setSuccess(false), 3000);
                window.location.reload();
            } else {
                const error = await res.json();
                alert(error.message || "Failed to update revenue splits");
            }
        } catch (error) {
            alert("An error occurred");
        } finally {
            setLoading(false);
        }
    }

    const finders = members.filter(m => m.role === "FINDER");
    const executionTeam = members.filter(m => m.role === "EXECUTION");

    const totalFinderShare = finders.reduce((s, m) => s + m.share, 0);
    const totalExecutionShare = executionTeam.reduce((s, m) => s + m.share, 0);

    return (
        <div className="glass-panel p-8 rounded-3xl border border-white/5 space-y-8">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-agency-accent/10 border border-agency-accent/20 flex items-center justify-center">
                        <Percent className="w-5 h-5 text-agency-accent" />
                    </div>
                    <div>
                        <h3 className="text-lg font-medium text-white">Revenue Splits</h3>
                        <p className="text-xs text-gray-500">Configure how payments are distributed</p>
                    </div>
                </div>
            </div>

            {/* Global Ratios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 flex items-center gap-2">
                        Company Fund % <Info className="w-3 h-3" />
                    </label>
                    <div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-400 font-medium">
                        20%
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 flex items-center gap-2">
                        Finder Pool % <Info className="w-3 h-3" />
                    </label>
                    <div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-400 font-medium">
                        10%
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 flex items-center gap-2">
                        Execution Pool %
                    </label>
                    <div className="w-full bg-white/5 border border-white/5 rounded-xl px-4 py-3 text-gray-400 font-medium">
                        {executionPoolRatio}%
                    </div>
                </div>
            </div>

            {/* Finders Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <UserCheck className="w-4 h-4 text-emerald-500" /> Finder (Max 1)
                    </h4>
                    {finders.length === 0 && (
                        <button
                            onClick={() => addMember("FINDER")}
                            className="text-[10px] font-bold uppercase tracking-widest text-agency-accent hover:text-white transition-colors flex items-center gap-1"
                        >
                            <Plus className="w-3 h-3" /> Add Finder
                        </button>
                    )}
                </div>

                <div className="space-y-3">
                    {finders.map((member, i) => (
                        <div key={i} className="flex gap-3 items-center animate-fade-in">
                            <select
                                value={member.userId}
                                onChange={(e) => updateMember(members.indexOf(member), { userId: e.target.value })}
                                className="flex-1 select-field px-4 py-2 text-sm"
                            >
                                <option value="">Select User</option>
                                {allUsers.map(u => {
                                    const isAlreadySelected = finders.some(f => f.userId === u.id && f.userId !== member.userId);
                                    if (isAlreadySelected) return null;
                                    return (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    );
                                })}
                            </select>
                            <div className="w-32 flex items-center gap-2">
                                <div className="w-full bg-white/5 border border-white/5 rounded-lg px-3 py-2 text-sm text-gray-400 text-center">
                                    10% fixed
                                </div>
                            </div>
                            <button
                                onClick={() => removeMember(members.indexOf(member))}
                                className="p-2 text-gray-500 hover:text-rose-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {finders.length === 0 && (
                        <p className="text-xs text-gray-600 italic">No finder assigned. Pool (10%) will be unallocated or go to legacy finder.</p>
                    )}
                </div>
            </div>

            {/* Execution Team Section */}
            <div className="space-y-4 pt-4 border-t border-white/5">
                <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-blue-500" /> Execution Team
                    </h4>
                    <button
                        onClick={() => addMember("EXECUTION")}
                        className="text-[10px] font-bold uppercase tracking-widest text-agency-accent hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add Member
                    </button>
                </div>

                <div className="space-y-3">
                    {executionTeam.map((member, i) => (
                        <div key={i} className="flex gap-3 items-center animate-fade-in">
                            <select
                                value={member.userId}
                                onChange={(e) => updateMember(members.indexOf(member), { userId: e.target.value })}
                                className="flex-1 select-field px-4 py-2 text-sm"
                            >
                                <option value="">Select User</option>
                                {allUsers.map(u => {
                                    const isAlreadySelected = executionTeam.some(et => et.userId === u.id && et.userId !== member.userId);
                                    if (isAlreadySelected) return null;
                                    return (
                                        <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                    );
                                })}
                            </select>
                            <div className="w-32 flex items-center gap-2">
                                <input
                                    type="number"
                                    value={member.share}
                                    onChange={(e) => updateMember(members.indexOf(member), { share: Number(e.target.value) })}
                                    className="w-full input-field px-3 py-2 text-sm"
                                    placeholder="Weight"
                                />
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {totalExecutionShare > 0 ? ((member.share / totalExecutionShare) * 100).toFixed(0) : 0}%
                                </span>
                            </div>
                            <button
                                onClick={() => removeMember(members.indexOf(member))}
                                className="p-2 text-gray-500 hover:text-rose-500 transition-colors"
                            >
                                <Trash2 className="w-4 h-4" />
                            </button>
                        </div>
                    ))}
                    {executionTeam.length === 0 && (
                        <p className="text-xs text-gray-600 italic">No execution members assigned. Payments will be unallocated.</p>
                    )}
                </div>
            </div>

            <button
                onClick={handleSave}
                disabled={loading || (companyFundRatio + finderFeeRatio > 100)}
                className="w-full btn-brand py-4 rounded-2xl flex items-center justify-center gap-3 disabled:opacity-50"
            >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Save className="w-5 h-5" />}
                <span className="font-bold uppercase tracking-widest text-xs">
                    {success ? "Splits Updated!" : "Save Revenue Config"}
                </span>
            </button>
            {companyFundRatio + finderFeeRatio > 100 && (
                <p className="text-rose-500 text-[10px] text-center font-bold uppercase tracking-widest animate-pulse">
                    Total ratios exceed 100%!
                </p>
            )}
        </div>
    );
}
