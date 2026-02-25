"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Loader2, AlertCircle, CheckCircle2 } from "lucide-react";

function VerifyContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams.get("token");

    const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
    const [message, setMessage] = useState("Verifying your secure link...");
    const hasAttempted = useRef(false);

    useEffect(() => {
        if (!token) {
            setStatus("error");
            setMessage("Invalid login link. No token provided.");
            return;
        }

        if (hasAttempted.current) return;
        hasAttempted.current = true;

        const verifyToken = async () => {
            try {
                const res = await fetch("/api/auth/verify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ token }),
                });

                const data = await res.json();

                if (res.ok) {
                    setStatus("success");
                    setMessage("Authentication successful! Redirecting...");
                    setTimeout(() => {
                        router.push("/dashboard");
                        router.refresh();
                    }, 1500);
                } else {
                    setStatus("error");
                    setMessage(data.error || "Failed to verify the login link.");
                }
            } catch (err) {
                console.error("Verification error:", err);
                setStatus("error");
                setMessage("A network error occurred.");
            }
        };

        verifyToken();
    }, [token, router]);

    return (
        <div className="flex flex-col items-center justify-center py-8">
            {status === "loading" && (
                <>
                    <Loader2 className="w-12 h-12 text-agency-accent animate-spin mb-6" />
                    <h2 className="text-xl font-medium text-white mb-2">Authenticating</h2>
                </>
            )}

            {status === "success" && (
                <>
                    <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6">
                        <CheckCircle2 className="w-8 h-8 text-emerald-500" />
                    </div>
                    <h2 className="text-xl font-medium text-white mb-2">Welcome Back</h2>
                </>
            )}

            {status === "error" && (
                <>
                    <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mb-6">
                        <AlertCircle className="w-8 h-8 text-red-500" />
                    </div>
                    <h2 className="text-xl font-medium text-white mb-2">Access Denied</h2>
                </>
            )}

            <p className={`text-sm ${status === "error" ? "text-red-400" : "text-gray-400"}`}>
                {message}
            </p>

            {status === "error" && (
                <Link href="/login" className="mt-8 btn-brand w-full justify-center">
                    Return to Login
                </Link>
            )}
        </div>
    );
}

export default function VerifyPage() {
    return (
        <div className="glass-panel p-8 md:p-12 rounded-2xl w-full max-w-md mx-auto text-center transform scale-100 transition-all shadow-[0_0_40px_rgba(0,0,0,0.5)]">
            <Link href="/" className="text-xl font-display font-medium tracking-tight mb-8 block text-white/50 hover:text-white transition-colors">
                Code<span className="text-agency-accent">&</span>Cognition
            </Link>

            <Suspense fallback={
                <div className="flex flex-col items-center justify-center py-8">
                    <Loader2 className="w-12 h-12 text-agency-accent animate-spin mb-6" />
                    <h2 className="text-xl font-medium text-white mb-2">Preparing...</h2>
                </div>
            }>
                <VerifyContent />
            </Suspense>
        </div>
    );
}
