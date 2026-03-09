import { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Shield, Scale, FileText } from "lucide-react";

export const metadata: Metadata = {
    title: "Legal Disclosure | Code & Cognition",
    description: "Company information, intellectual property rights, and governing law for Code & Cognition.",
    openGraph: {
        title: "Legal Disclosure | Code & Cognition",
        description: "Company information, intellectual property rights, and governing law for Code & Cognition.",
        images: ["/og-image.png"],
    },
};

export default function LegalPage() {
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
                        <Scale className="w-6 h-6" />
                    </div>
                    <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">Legal Disclosure</h1>
                </div>

                <div className="prose prose-invert prose-agency max-w-none">
                    <section className="mb-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Company Information</h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            Code & Cognition is a premium digital agency specializing in architectural high-performance digital systems,
                            intelligent automation, and growth systems for global enterprise leaders.
                        </p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-white font-semibold mb-2">Registration</h3>
                                <p className="text-gray-400 text-sm">Registered in Dhaka, Bangladesh.</p>
                            </div>
                            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
                                <h3 className="text-white font-semibold mb-2">Contact</h3>
                                <p className="text-gray-400 text-sm">info@codencognition.com</p>
                            </div>
                        </div>
                    </section>

                    <section className="mb-12 border-t border-white/5 pt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Intellectual Property Rights</h2>
                        <p className="text-gray-400 leading-relaxed mb-4">
                            All content, code, designs, strategies, and assets created by Code & Cognition remain the exclusive
                            intellectual property of the company, unless explicitly transferred via written agreement.
                        </p>
                        <p className="text-gray-400 leading-relaxed">
                            Unauthorized use, reproduction, or distribution of any materials on this website or delivered
                            as part of our services is strictly prohibited.
                        </p>
                    </section>

                    <section className="mb-12 border-t border-white/5 pt-12">
                        <h2 className="text-2xl font-bold text-white mb-6">Governing Law</h2>
                        <p className="text-gray-400 leading-relaxed">
                            These terms and any disputes arising from the use of our services or website shall be governed
                            by and construed in accordance with the laws of Bangladesh. Any legal actions shall be
                            subject to the exclusive jurisdiction of the courts in Bangladesh.
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
