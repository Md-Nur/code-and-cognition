"use client";

import { useEffect, useState } from "react";
import { User, Role } from "@prisma/client";

export default function AdminUsersPage() {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [formData, setFormData] = useState<{
        name: string;
        email: string;
        password: string;
        role: Role;
    }>({
        name: "",
        email: "",
        password: "", // Only for creation
        role: Role.CONTRACTOR,
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        const res = await fetch("/api/admin/users");
        if (res.ok) setUsers(await res.json());
        setLoading(false);
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const res = await fetch("/api/admin/users", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (res.ok) {
                setShowModal(false);
                fetchUsers();
                setFormData({ name: "", email: "", password: "", role: Role.CONTRACTOR });
            } else {
                alert("Failed to create user. Email might be duplicate.");
            }
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">User Management</h1>
                <button onClick={() => setShowModal(true)} className="btn-brand">
                    + Invite User
                </button>
            </div>

            <div className="glass-panel overflow-hidden rounded-xl">
                <table className="data-table">
                    <thead>
                        <tr>
                            <th className="text-left p-4">Name</th>
                            <th className="text-left p-4">Email</th>
                            <th className="text-left p-4">Role</th>
                            <th className="text-left p-4">Joined At</th>
                            <th className="text-right p-4">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {loading ? (
                            <tr><td colSpan={5} className="text-center py-8">Loading users...</td></tr>
                        ) : users.map((user) => (
                            <tr key={user.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                <td className="p-4 font-medium flex items-center gap-3">
                                    <div className="w-8 h-8 rounded-full bg-agency-accent/20 flex items-center justify-center text-xs font-bold">
                                        {user.name.charAt(0)}
                                    </div>
                                    {user.name}
                                </td>
                                <td className="p-4 text-gray-400">{user.email}</td>
                                <td className="p-4">
                                    <span className={`text-xs px-2 py-1 rounded border ${user.role === "FOUNDER"
                                        ? "border-purple-500/30 text-purple-400 bg-purple-500/10"
                                        : "border-blue-500/30 text-blue-400 bg-blue-500/10"
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="p-4 text-sm text-gray-500">
                                    {new Date(user.createdAt).toLocaleDateString()}
                                </td>
                                <td className="text-right p-4">
                                    <button className="text-gray-400 hover:text-white mr-3 transition-colors">Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal Overlay */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="glass-panel w-full max-w-md p-6 rounded-xl animate-fade-in-up">
                        <h2 className="text-xl font-bold mb-4">Invite New User</h2>

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                                <label className="input-label">Full Name</label>
                                <input
                                    type="text"
                                    required
                                    className="input-field"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="input-label">Email Address</label>
                                <input
                                    type="email"
                                    required
                                    className="input-field"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="input-label">Temporary Password</label>
                                <input
                                    type="password"
                                    required
                                    className="input-field"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="input-label">Role</label>
                                <select
                                    className="select-field"
                                    value={formData.role}
                                    onChange={(e) => setFormData({ ...formData, role: e.target.value as Role })}
                                >
                                    <option value="CONTRACTOR">Contractor</option>
                                    <option value="FOUNDER">Founder (Admin)</option>
                                </select>
                            </div>

                            <div className="flex gap-4 pt-2">
                                <button type="button" onClick={() => setShowModal(false)} className="btn-outline flex-1">
                                    Cancel
                                </button>
                                <button type="submit" className="btn-brand flex-1">
                                    Create User
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
