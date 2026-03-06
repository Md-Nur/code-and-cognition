"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { UserPlus, ShieldCheck, ArrowRight, Loader2 } from "lucide-react";

function RegisterForm() {
    const router = useRouter();
    const searchParams = useSearchParams();

    // States
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isSetupMode, setIsSetupMode] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    // Form inputs
    const [name, setName] = useState("");
    const [email, setEmail] = useState(searchParams.get("email") || "");
    const [password, setPassword] = useState("");
    const token = searchParams.get("token");

    useEffect(() => {
        async function checkSetup() {
            try {
                // 1. Check if setup is required
                const setupRes = await fetch("/api/auth/setup-check");
                const setupData = await setupRes.json();
                setIsSetupMode(setupData.setupRequired);

                // 2. If token is present, fetch invitation details to pre-fill email
                if (token) {
                    const inviteRes = await fetch(`/api/auth/invitation?token=${token}`);
                    const inviteData = await inviteRes.json();
                    
                    if (inviteRes.ok) {
                        setEmail(inviteData.data.email);
                    } else {
                        // Redirect if token is invalid
                        router.push(`/login?error=${inviteData.error || "Invalid invitation token"}`);
                        return;
                    }
                } else if (!setupData.setupRequired) {
                    // Registration requires an invitation if not in setup mode
                    router.push("/login?error=Registration requires an invitation");
                    return;
                }
            } catch (err) {
                setError("Something went wrong");
            } finally {
                setIsLoading(false);
            }
        }
        checkSetup();
    }, [router, token]);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError("");
        setIsSubmitting(true);

        try {
            const res = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ name, email, password, token }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.error || "Registration failed");
            }

            // Successfully registered
            router.push("/login?success=Registration successful. Please sign in.");
        } catch (err: any) {
            setError(err.message);
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-agency-accent animate-spin" />
            </div>
        );
    }

    return (
        <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md mx-auto animate-fade-in-up shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <div className="text-center mb-8">
                <Link href="/" className="text-2xl font-display font-bold tracking-tight mb-2 block text-white">
                    Code<span className="text-agency-accent">&</span>Cognition
                </Link>
                <div className="flex items-center justify-center gap-2 mb-1">
                    {isSetupMode ? (
                        <ShieldCheck className="w-5 h-5 text-agency-accent" />
                    ) : (
                        <UserPlus className="w-5 h-5 text-agency-accent" />
                    )}
                    <h2 className="text-xl font-medium text-white">
                        {isSetupMode ? "Founder Setup" : "Join the Team"}
                    </h2>
                </div>
                <p className="text-gray-400 text-sm">
                    {isSetupMode
                        ? "Create the first administrator account"
                        : "Complete your profile to join the workspace"}
                </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                    <label className="input-label">Full Name</label>
                    <input
                        type="text"
                        required
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="input-field"
                        placeholder="John Doe"
                        autoFocus
                    />
                </div>

                <div>
                    <label className="input-label">Email Address</label>
                    <input
                        type="email"
                        required
                        value={email}
                        readOnly={!!token}
                        onChange={(e) => setEmail(e.target.value)}
                        className={`input-field ${token ? 'opacity-70 cursor-not-allowed' : ''}`}
                        placeholder="hello@company.com"
                    />
                </div>

                <div>
                    <label className="input-label">Create Password</label>
                    <input
                        type="password"
                        required
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="input-field"
                        placeholder="••••••••"
                        minLength={6}
                    />
                    <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-wider">At least 6 characters required</p>
                </div>

                {error && (
                    <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="btn-brand w-full justify-center group"
                >
                    {isSubmitting ? "Generating Account..." : isSetupMode ? "Setup Agency" : "Join Agency"}
                    {!isSubmitting && <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                </button>
            </form>

            <div className="mt-8 pt-6 border-t border-white/5 text-center">
                <Link href="/login" className="text-sm text-gray-500 hover:text-white transition-colors">
                    Already have an account? <span className="text-agency-accent">Sign In</span>
                </Link>
            </div>
        </div>
    );
}

export default function RegisterPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center p-12">
                <Loader2 className="w-8 h-8 text-agency-accent animate-spin" />
            </div>
        }>
            <RegisterForm />
        </Suspense>
    );
}
