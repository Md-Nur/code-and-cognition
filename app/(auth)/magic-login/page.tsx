"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function MagicLoginContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "error" | "success">("loading");
    const [message, setMessage] = useState("Verifying your secure link...");

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid or missing token.");
            return;
        }

        const verifyToken = async () => {
            try {
                const res = await fetch("/api/auth/magic-verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (!res.ok) {
                    setStatus("error");
                    setMessage(data.error || "Failed to verify token.");
                    return;
                }

                setStatus("success");
                setMessage("Login successful! Redirecting to dashboard...");

                setTimeout(() => {
                    router.push("/dashboard");
                    router.refresh();
                }, 1500);
            } catch (error) {
                setStatus("error");
                setMessage("Something went wrong during verification.");
            }
        };

        verifyToken();
    }, [token, router]);

    return (
        <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4">
            <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md mx-auto animate-fade-in-up text-center border border-agency-accent/20">
                <div className="mb-8">
                    <Link href="/" className="text-2xl font-display font-bold tracking-tight text-white">
                        Code<span className="text-agency-accent">&</span>Cognition
                    </Link>
                </div>

                <div className="flex flex-col items-center justify-center space-y-4">
                    {status === "loading" && (
                        <>
                            <Loader2 className="w-12 h-12 text-agency-accent animate-spin" />
                            <h2 className="text-xl font-medium text-white">Authenticating</h2>
                            <p className="text-gray-400 text-sm">{message}</p>
                        </>
                    )}

                    {status === "error" && (
                        <>
                            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-2">
                                <AlertCircle className="w-8 h-8 text-red-500" />
                            </div>
                            <h2 className="text-xl font-medium text-red-100">Login Failed</h2>
                            <p className="text-red-400/80 text-sm mb-6">{message}</p>
                            <Link href="/login" className="btn-brand">
                                Return to Login
                            </Link>
                        </>
                    )}

                    {status === "success" && (
                        <>
                            <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mb-2">
                                <CheckCircle2 className="w-8 h-8 text-green-500" />
                            </div>
                            <h2 className="text-xl font-medium text-white">Welcome Back!</h2>
                            <p className="text-green-400/80 text-sm">{message}</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function MagicLoginPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#050505] flex items-center justify-center"><Loader2 className="w-8 h-8 text-agency-accent animate-spin" /></div>}>
            <MagicLoginContent />
        </Suspense>
    );
}
