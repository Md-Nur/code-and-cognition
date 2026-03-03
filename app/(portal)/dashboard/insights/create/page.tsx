import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "@/components/dashboard/ArticleForm";

export default function CreateInsightPage() {
    return (
        <div className="max-w-4xl mx-auto space-y-12 pb-20">
            <div className="space-y-4">
                <Link
                    href="/dashboard/insights"
                    className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-white uppercase tracking-widest transition-colors group"
                >
                    <ArrowLeft className="w-3 h-3 mr-2 group-hover:-translate-x-1 transition-transform" />
                    Back to All Insights
                </Link>
                <div className="pt-2">
                    <h1 className="text-4xl font-display font-medium tracking-tight text-white mb-2">
                        Draft New Insight
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Create a new strategic perspective or technical deep-dive.
                    </p>
                </div>
            </div>

            <div className="premium-card p-8 md:p-12">
                <ArticleForm />
            </div>
        </div>
    );
}
