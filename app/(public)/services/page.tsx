import type { Metadata } from "next";
import CorePillars from "@/app/components/public/CorePillars";
import HowWeWork from "@/app/components/public/HowWeWork";
import BookingForm from "@/app/components/public/BookingForm";

export const metadata: Metadata = {
    title: "Services | Code & Cognition — Digital Product Studio",
    description: "Enterprise-grade digital platforms, intelligent automation, and performance growth systems for ambitious brands.",
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
    return (
        <main>
            <CorePillars />
            <HowWeWork />
            <BookingForm />
        </main>
    );
}
