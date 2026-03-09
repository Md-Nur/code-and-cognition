import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Lock, Eye } from "lucide-react";

export const metadata: Metadata = {
    title: "Privacy Policy | Code & Cognition",
    description: "At Code & Cognition, we respect your privacy and are committed to protecting the personal data you share with us.",
    openGraph: {
        title: "Privacy Policy | Code & Cognition",
        description: "At Code & Cognition, we respect your privacy and are committed to protecting the personal data you share with us.",
        images: ["/og-image.png"],
    },
};

export default function PrivacyPage() {
    return (
        <main className="min-h-screen bg-agency-black pt-32 pb-24">
            <div className="section-container max-w-4xl">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-500 hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                    Back to Home
                </Link>

                <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 rounded-xl bg-agency-accent/10 border border-agency-accent/20 flex items-center justify-center text-agency-accent">
                        <Shield className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Privacy Policy</h1>
                </div>

                <div className="prose prose-invert prose-agency max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Commitment to Privacy</h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            At Code & Cognition, we respect your privacy and are committed to protecting the personal data you share with us.
                            This policy outlines how we handle information collected through our website and services.
                        </p>
                    </section>

                    <section className="mb-12 border-t border-white/5 pt-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Eye className="w-5 h-5 text-agency-accent" />
                            Data Collection
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            We may collect personal information when you:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>Contact us via email or integrated contact forms.</li>
                            <li>Request a consultation or proposal.</li>
                            <li>Interact with our digital platforms and services.</li>
                        </ul>
                        <p className="text-gray-400 mt-4">
                            This information may include your name, email address, company name, and project details.
                        </p>
                    </section>

                    <section className="mb-12 border-t border-white/5 pt-12">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
                            <Lock className="w-5 h-5 text-agency-accent" />
                            Data Usage & Protection
                        </h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Your data is used strictly for:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 text-gray-400">
                            <li>Responding to your inquiries and providing requested services.</li>
                            <li>Improving our website and user experience.</li>
                            <li>Maintaining project communication and records.</li>
                        </ul>
                        <p className="text-gray-400 mt-4">
                            We implement industry-standard security measures to protect your information from unauthorized access,
                            disclosure, or alteration. We do not sell or lease your personal data to third parties.
                        </p>
                    </section>

                    <section className="mb-12 border-t border-white/5 pt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Confidentiality</h2>
                        <p className="text-gray-400 leading-relaxed">
                            As part of our commitment to professional excellence, all project-related communications, data,
                            and proprietary business information shared with Code & Cognition are treated with the
                            highest level of confidentiality.
                        </p>
                    </section>

                    <section className="mb-12 border-t border-white/5 pt-12 text-sm text-gray-500 italic">
                        <p>Last updated: February 22, 2026</p>
                    </section>
                </div>
            </div>
        </main>
    );
}
