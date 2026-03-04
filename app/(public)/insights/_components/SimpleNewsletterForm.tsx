"use client";

import { useState, useTransition } from "react";
import { subscribeToNewsletter } from "@/app/actions/subscribers";
import { CheckCircle2 } from "lucide-react";

export default function SimpleNewsletterForm() {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState<{ success?: string; error?: string } | null>(null);
    const [isPending, startTransition] = useTransition();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);

        startTransition(async () => {
            const formData = new FormData();
            formData.append("email", email);
            const result = await subscribeToNewsletter(formData);

            if (result.success) {
                setEmail("");
                setMessage({ success: result.success });
            } else {
                setMessage({ error: result.error });
            }
        });
    };

    if (message?.success) {
        return (
            <div className="flex items-center justify-center gap-3 py-4 text-agency-accent animate-fade-in">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-bold text-sm">{message.success}</span>
            </div>
        );
    }

    return (
        <div className="w-full">
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
                <input
                    type="email"
                    required
                    name="email"
                    disabled={isPending}
                    placeholder="Enter your business email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field grow bg-white/5 border-white/10 disabled:opacity-50"
                />
                <button
                    type="submit"
                    disabled={isPending}
                    className="btn-brand whitespace-nowrap px-8 disabled:opacity-50"
                >
                    {isPending ? "Subscribing..." : "Subscribe"}
                </button>
            </form>
            {message?.error && (
                <p className="mt-3 text-red-500 text-xs font-medium text-left animate-fade-in">
                    {message.error}
                </p>
            )}
        </div>
    );
}
