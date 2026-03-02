import type { Metadata } from "next";
import CaseStudiesListing from "@/app/components/public/CaseStudiesListing";

export const metadata: Metadata = {
    title: "Case Studies | Code & Cognition",
    description: "Enterprise transformations and strategic digital architectural design.",
};

export default function CaseStudiesPage() {
    return (
        <main className="bg-black min-h-screen pt-32 selection:bg-agency-accent selection:text-white">
            <CaseStudiesListing />
        </main>
    );
}
