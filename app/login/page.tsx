"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        const formData = new FormData(e.currentTarget);
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        try {
            const res = await signIn("credentials", {
                email,
                password,
                redirect: false,
            });

            if (res?.error) {
                setError("Invalid credentials");
            } else {
                router.push("/admin");
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-agency-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[600px] bg-agency-accent/10 rounded-full blur-[120px] opacity-30" />

            <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md relative z-10 animate-fade-in-up">
                <div className="text-center mb-8">
                    <Link href="/" className="text-2xl font-display font-bold tracking-tight mb-2 block">
                        Code<span className="text-agency-accent">&</span>Cognition
                    </Link>
                    <p className="text-gray-400 text-sm">Restricted Access</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="input-label">Email Address</label>
                        <input
                            name="email"
                            type="email"
                            required
                            className="input-field"
                            placeholder="admin@codeandcognition.com"
                        />
                    </div>

                    <div>
                        <label className="input-label">Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            className="input-field"
                            placeholder="••••••••"
                        />
                    </div>

                    {error && (
                        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="btn-brand w-full justify-center"
                    >
                        {isSubmitting ? "Authenticating..." : "Login to Console"}
                    </button>
                </form>

                <div className="mt-6 text-center">
                    <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                        ← Back to Website
                    </Link>
                </div>
            </div>
        </main>
    );
}
