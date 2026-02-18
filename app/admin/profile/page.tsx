"use client";

import { useState } from "react";
import { ApiResponse } from "@/lib/api-handler";

export default function ProfilePage() {
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: "", text: "" });
    const [formData, setFormData] = useState({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    async function handlePasswordChange(e: React.FormEvent) {
        e.preventDefault();
        setMessage({ type: "", text: "" });

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage({ type: "error", text: "New passwords do not match" });
            return;
        }

        setLoading(true);
        try {
            const res = await fetch("/api/auth/profile/password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    currentPassword: formData.currentPassword,
                    newPassword: formData.newPassword,
                }),
            });

            const data = await res.json();
            if (res.ok) {
                setMessage({ type: "success", text: "Password updated successfully!" });
                setFormData({ currentPassword: "", newPassword: "", confirmPassword: "" });
            } else {
                setMessage({ type: "error", text: data.error || "Failed to update password" });
            }
        } catch (error) {
            setMessage({ type: "error", text: "An error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="space-y-8 animate-fade-in">
            <header>
                <h1 className="text-3xl font-bold mb-2">My Profile</h1>
                <p className="text-gray-400">Manage your account settings and security.</p>
            </header>

            <div className="max-w-2xl">
                <div className="glass-panel p-8 rounded-2xl">
                    <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                        <span className="p-2 bg-agency-accent/10 rounded-lg text-agency-accent">🔐</span>
                        Security Settings
                    </h2>

                    <form onSubmit={handlePasswordChange} className="space-y-6">
                        {message.text && (
                            <div className={`p-4 rounded-xl text-sm font-medium ${message.type === "success" ? "bg-green-500/10 text-green-400 border border-green-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
                                }`}>
                                {message.text}
                            </div>
                        )}

                        <div>
                            <label className="input-label">Current Password</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                value={formData.currentPassword}
                                onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="input-label">New Password</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                value={formData.newPassword}
                                onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                            />
                        </div>

                        <div>
                            <label className="input-label">Confirm New Password</label>
                            <input
                                type="password"
                                required
                                className="input-field"
                                value={formData.confirmPassword}
                                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                            />
                        </div>

                        <div className="pt-4">
                            <button
                                type="submit"
                                disabled={loading}
                                className="btn-brand w-full"
                            >
                                {loading ? "Updating..." : "Update Password"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
