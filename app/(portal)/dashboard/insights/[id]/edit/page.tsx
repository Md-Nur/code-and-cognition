import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ArticleForm } from "@/components/dashboard/ArticleForm";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";

interface EditInsightPageProps {
    params: {
        id: string;
    };
}

export default async function EditInsightPage({ params }: EditInsightPageProps) {
    const article = await prisma.article.findUnique({
        where: { id: params.id },
    });

    if (!article) {
        notFound();
    }

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
                        Edit Insight
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Update your strategic perspective or technical deep-dive.
                    </p>
                </div>
            </div>

            <div className="premium-card p-8 md:p-12">
                <ArticleForm initialData={article} isEditing />
            </div>
        </div>
    );
}
