"use client";

import { useState, useEffect } from "react";
import { UserPlus, Mail, Trash2, Copy, ShieldCheck, Clock, CheckCircle2 } from "lucide-react";
import { Role, User, LedgerBalance } from "@prisma/client";
import InvitationModal from "./InvitationModal";

interface Invitation {
    id: string;
    email: string;
    role: Role;
    token: string;
    expiresAt: string;
}

interface UserWithMeta extends User {
    _count: { memberProjects: number, activityLogs: number };
    ledgerBalance: LedgerBalance | null;
}

export default function UserManagementView({
    initialUsers
}: {
    initialUsers: UserWithMeta[]
}) {
    const [users, setUsers] = useState(initialUsers);
    const [invitations, setInvitations] = useState<Invitation[]>([]);
    const [showInviteModal, setShowInviteModal] = useState(false);
    const [isLoadingInvites, setIsLoadingInvites] = useState(true);

    async function fetchInvitations() {
        try {
            const res = await fetch("/api/admin/invitations");
            if (res.ok) {
                const data = await res.json();
                setInvitations(data);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoadingInvites(false);
        }
    }

    useEffect(() => {
        fetchInvitations();
    }, []);

    async function deleteInvitation(id: string) {
        if (!confirm("Are you sure you want to cancel this invitation?")) return;
        try {
            const res = await fetch(`/api/admin/invitations?id=${id}`, { method: "DELETE" });
            if (res.ok) fetchInvitations();
        } catch (err) {
            console.error(err);
        }
    }

    const copyInviteLink = (token: string) => {
        const url = `${window.location.origin}/register?token=${token}`;
        navigator.clipboard.writeText(url);
        alert("Invitation link copied to clipboard!");
    };

    const roleColors: Record<string, string> = {
        FOUNDER: "bg-agency-accent/10 text-agency-accent border-agency-accent/20",
        CO_FOUNDER: "bg-purple-500/10 text-purple-400 border-purple-500/20",
        CONTRACTOR: "bg-blue-500/10 text-blue-400 border-blue-500/20",
        CLIENT: "bg-gray-500/10 text-gray-400 border-gray-500/20",
    };

    return (
        <div className="space-y-8">
            <div className="flex items-center justify-between bg-white/[0.02] p-6 rounded-3xl border border-white/5">
                <div>
                    <h1 className="text-2xl md:text-3xl font-display font-medium tracking-tight text-white">Team Management</h1>
                    <p className="text-gray-500 text-sm mt-1">{users.length} registered members, {invitations.length} pending invites.</p>
                </div>
                <button
                    onClick={() => setShowInviteModal(true)}
                    className="btn-brand rounded-2xl px-6 py-3 gap-2"
                >
                    <UserPlus className="w-4 h-4" />
                    Invite Member
                </button>
            </div>

            {invitations.length > 0 && (
                <div className="space-y-4 animate-fade-in-up">
                    <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        Pending Invitations
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {invitations.map((invite) => (
                            <div key={invite.id} className="glass-panel p-5 rounded-2xl border-agency-accent/10 flex flex-col justify-between">
                                <div className="flex justify-between items-start mb-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center text-gray-400">
                                            <Mail className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <p className="text-white font-medium text-sm truncate max-w-[150px]">{invite.email}</p>
                                            <span className={`text-[9px] px-2 py-0.5 rounded-full border font-bold uppercase tracking-widest ${roleColors[invite.role]}`}>
                                                {invite.role}
                                            </span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => deleteInvitation(invite.id)}
                                        className="p-2 hover:bg-red-500/10 rounded-full text-gray-500 hover:text-red-500 transition-colors"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => copyInviteLink(invite.token)}
                                        className="flex-1 text-[10px] font-bold uppercase tracking-widest bg-white/5 hover:bg-white/10 transition-colors py-2 rounded-xl text-gray-300 flex items-center justify-center gap-2"
                                    >
                                        <Copy className="w-3.5 h-3.5" />
                                        Copy Link
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            <div className="space-y-4">
                <h2 className="text-sm font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4" />
                    Registered Members
                </h2>
                <div className="glass-panel overflow-hidden rounded-3xl border border-white/5">
                    <div className="table-container">
                        <table className="w-full text-sm min-w-[800px]">
                            <thead>
                                <tr className="border-b border-white/5 bg-white/[0.01]">
                                    <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Member</th>
                                    <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Role</th>
                                    <th className="text-left p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500 hidden md:table-cell">Projects</th>
                                    <th className="text-right p-5 text-[10px] font-bold uppercase tracking-widest text-gray-500">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {users.map((user) => (
                                    <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
                                        <td className="p-5">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-xl bg-agency-accent/10 border border-white/10 flex items-center justify-center text-xs font-bold text-agency-accent shrink-0">
                                                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-white">{user.name}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="p-5">
                                            <span className={`text-[10px] px-3 py-1 rounded-full border font-bold uppercase tracking-widest ${roleColors[user.role]}`}>
                                                {user.role}
                                            </span>
                                        </td>
                                        <td className="p-5 hidden md:table-cell text-gray-400 font-mono text-xs">{user._count.memberProjects} Projects</td>
                                        <td className="p-5 text-right text-gray-500 text-xs font-mono">
                                            {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {showInviteModal && (
                <InvitationModal
                    onClose={() => setShowInviteModal(false)}
                    onSuccess={fetchInvitations}
                />
            )}
        </div>
    );
}
