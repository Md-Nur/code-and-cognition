import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import CaseStudiesListing from "./_components/CaseStudiesListing";


export async function generateMetadata(): Promise<Metadata> {
    const latestCaseStudy = await prisma.caseStudy.findFirst({
        where: { status: "PUBLISHED" },
        orderBy: [
            { publishDate: "desc" },
            { createdAt: "desc" }
        ],
    });

    return {
        title: "Our Work | Code & Cognition — Helping Businesses Succeed",
        description: "Helping businesses grow with AI, digital marketing, video editing, and custom development.",
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
        orderBy: [
            { publishDate: "desc" },
            { createdAt: "desc" }
        ],
    });

    return (
        <main className="bg-black min-h-screen pt-32 selection:bg-agency-accent selection:text-white">
            <CaseStudiesListing initialCaseStudies={JSON.parse(JSON.stringify(caseStudies))} />
        </main>
    );
}
