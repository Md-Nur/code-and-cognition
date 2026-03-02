import { CaseStudyForm } from "@/components/dashboard/CaseStudyForm";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { notFound } from "next/navigation";

export default async function EditCaseStudyPage({ params }: { params: { id: string } }) {
    const caseStudy = await prisma.caseStudy.findUnique({
        where: { id: params.id },
    });

    if (!caseStudy) {
        notFound();
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col gap-4">
                <Link
                    href="/dashboard/case-studies"
                    className="inline-flex items-center text-xs font-bold text-gray-500 hover:text-white transition-colors uppercase tracking-[0.2em] w-fit"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Case Studies
                </Link>
                <div>
                    <h1 className="text-3xl font-display font-medium tracking-tight text-white mb-1">
                        Edit Case Study
                    </h1>
                    <p className="text-gray-500 text-sm">
                        Refine the success story for <span className="text-white font-medium">{caseStudy.title}</span>.
                    </p>
                </div>
            </div>

            <div className="premium-card p-8 md:p-12">
                <CaseStudyForm initialData={caseStudy} isEditing />
            </div>
        </div>
    );
}
