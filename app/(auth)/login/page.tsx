"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { MailCheck, KeyRound, ArrowRight } from "lucide-react";

export default function LoginPage() {
    const router = useRouter();
    const [error, setError] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Auth Flow State
    const [requirePassword, setRequirePassword] = useState(false);
    const [magicLinkSent, setMagicLinkSent] = useState(false);

    // Form State
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);
        setError("");

        try {
            const body: any = { email };
            if (requirePassword) {
                body.password = password;
            }

            const res = await fetch("/api/auth/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const data = await res.json();

            if (!res.ok) {
                // If it's a 429 or generic error
                setError(data.error || "An error occurred");
                return;
            }

            // Success responses mapped from backend logic
            if (data.magicLinkSent) {
                setMagicLinkSent(true);
            } else if (data.requirePassword) {
                setRequirePassword(true);
            } else if (data.user) {
                // Successfully authenticated
                router.push("/dashboard");
                router.refresh();
            }
        } catch (err) {
            console.error(err);
            setError("Something went wrong");
        } finally {
            setIsSubmitting(false);
        }
    }

    if (magicLinkSent) {
        return (
            <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md mx-auto animate-fade-in-up text-center border border-agency-accent/20">
                <div className="w-16 h-16 bg-agency-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                    <MailCheck className="w-8 h-8 text-agency-accent" />
                </div>
                <h2 className="text-2xl font-display font-medium text-white mb-2">Check Your Email</h2>
                <p className="text-gray-400 text-sm mb-8 leading-relaxed">
                    We've sent a secure, single-use login link to <br />
                    <span className="text-white font-medium">{email}</span>
                </p>
                <button
                    onClick={() => { setMagicLinkSent(false); setEmail(""); }}
                    className="text-sm text-agency-accent hover:text-white transition-colors"
                >
                    Use a different email
                </button>
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md mx-auto animate-fade-in-up shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-8">
                <Link href="/" className="text-2xl font-display font-bold tracking-tight mb-2 block text-white">
                    Code<span className="text-agency-accent">&</span>Cognition
                </Link>
                <p className="text-gray-400 text-sm">
                    {requirePassword ? "Internal Staff Portal" : "Client & Staff Portal"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="input-label">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={requirePassword}
                        className="input-field disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                        placeholder="hello@company.com"
                    />
                </div>

                {requirePassword && (
                    <div className="animate-fade-in-up">
                        <label className="input-label flex items-center gap-2">
                            <KeyRound className="w-4 h-4 text-agency-accent" /> Password
                        </label>
                        <input
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="input-field focus:ring-agency-accent/50"
                            placeholder="••••••••"
                            autoFocus
                        />
                    </div>
                )}

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`btn-brand w-full justify-center group ${requirePassword ? 'bg-white hover:bg-gray-100 text-black' : ''}`}
                >
                    {isSubmitting
                        ? "Authenticating..."
                        : requirePassword
                            ? "Sign In"
                            : "Continue"}

                    {!isSubmitting && !requirePassword && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center flex flex-col gap-3">
                {requirePassword && (
                    <button
                        onClick={() => { setRequirePassword(false); setPassword(""); setError(""); }}
                        className="text-xs text-gray-500 hover:text-white transition-colors"
                    >
                        Use a different email address?
                    </button>
                )}
                <Link href="/" className="text-sm text-gray-500 hover:text-white transition-colors">
                    ← Back to Website
                </Link>
            </div>
        </div>
    );
}
