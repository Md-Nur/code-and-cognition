import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CaseStudiesListing from "@/app/components/public/CaseStudiesListing";


export const metadata: Metadata = {
    title: "Case Studies | Code & Cognition",
    description: "Enterprise transformations and strategic digital architectural design.",
};

export default async function CaseStudiesPage() {
    const caseStudies = await prisma.caseStudy.findMany({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
    });

    return (
        <main className="bg-black min-h-screen pt-32 selection:bg-agency-accent selection:text-white">
            <CaseStudiesListing initialCaseStudies={JSON.parse(JSON.stringify(caseStudies))} />
        </main>
    );
}
