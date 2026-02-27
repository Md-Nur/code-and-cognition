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
    const [companyFundRatio, setCompanyFundRatio] = useState(initialCompanyFundRatio * 100);
    const [finderFeeRatio, setFinderFeeRatio] = useState(initialFinderFeeRatio * 100);
    const [members, setMembers] = useState<Member[]>(initialMembers);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const executionPoolRatio = Math.max(0, 100 - companyFundRatio - finderFeeRatio);

    const addMember = (role: ProjectMemberRole) => {
        setMembers([...members, { userId: "", role, share: 0 }]);
    };

    const removeMember = (index: number) => {
        setMembers(members.filter((_, i) => i !== index));
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
            const res = await fetch(`/api/admin/projects/${projectId}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    companyFundRatio: companyFundRatio / 100,
                    finderFeeRatio: finderFeeRatio / 100,
                    members: members.map(m => ({
                        userId: m.userId,
                        role: m.role,
                        share: m.share
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
            console.error(error);
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
                    <input
                        type="number"
                        value={companyFundRatio}
                        onChange={(e) => setCompanyFundRatio(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-agency-accent/50 transition-colors"
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] uppercase font-bold tracking-widest text-gray-500 flex items-center gap-2">
                        Finder Pool % <Info className="w-3 h-3" />
                    </label>
                    <input
                        type="number"
                        value={finderFeeRatio}
                        onChange={(e) => setFinderFeeRatio(Number(e.target.value))}
                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-agency-accent/50 transition-colors"
                    />
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
                        <UserCheck className="w-4 h-4 text-emerald-500" /> Finders
                    </h4>
                    <button
                        onClick={() => addMember("FINDER")}
                        className="text-[10px] font-bold uppercase tracking-widest text-agency-accent hover:text-white transition-colors flex items-center gap-1"
                    >
                        <Plus className="w-3 h-3" /> Add Finder
                    </button>
                </div>

                <div className="space-y-3">
                    {finders.map((member, i) => (
                        <div key={i} className="flex gap-3 items-center animate-fade-in">
                            <select
                                value={member.userId}
                                onChange={(e) => updateMember(members.indexOf(member), { userId: e.target.value })}
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-agency-accent/50"
                            >
                                <option value="">Select User</option>
                                {allUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                            <div className="w-32 flex items-center gap-2">
                                <input
                                    type="number"
                                    value={member.share}
                                    onChange={(e) => updateMember(members.indexOf(member), { share: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
                                    placeholder="Weight"
                                />
                                <span className="text-[10px] text-gray-500 font-mono">
                                    {totalFinderShare > 0 ? ((member.share / totalFinderShare) * 100).toFixed(0) : 0}%
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
                    {finders.length === 0 && (
                        <p className="text-xs text-gray-600 italic">No finders assigned. (Pool will go to legacy finder if set)</p>
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
                                className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-agency-accent/50"
                            >
                                <option value="">Select User</option>
                                {allUsers.map(u => (
                                    <option key={u.id} value={u.id}>{u.name} ({u.role})</option>
                                ))}
                            </select>
                            <div className="w-32 flex items-center gap-2">
                                <input
                                    type="number"
                                    value={member.share}
                                    onChange={(e) => updateMember(members.indexOf(member), { share: Number(e.target.value) })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-white text-sm"
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
