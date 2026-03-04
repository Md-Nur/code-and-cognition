import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CaseStudiesListing from "./_components/CaseStudiesListing";


export async function generateMetadata(): Promise<Metadata> {
    const latestCaseStudy = await prisma.caseStudy.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: { createdAt: "desc" },
    });

    return {
        title: "Case Studies | Code & Cognition",
        description: "Enterprise transformations and strategic digital architectural design.",
        openGraph: {
            images: latestCaseStudy?.coverImage ? [latestCaseStudy.coverImage] : [],
        },
        twitter: {
            card: "summary_large_image",
            images: latestCaseStudy?.coverImage ? [latestCaseStudy.coverImage] : [],
        },
    };
}

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
