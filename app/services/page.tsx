import type { Metadata } from "next";
import Navbar from "../components/public/Navbar";
import CorePillars from "../components/public/CorePillars";
import HowWeWork from "../components/public/HowWeWork";
import BookingForm from "../components/public/BookingForm";
import Footer from "../components/public/Footer";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Services | Code & Cognition — Digital Product Studio",
    description: "Enterprise-grade digital platforms, intelligent automation, and performance growth systems for ambitious brands.",
};

export const dynamic = 'force-dynamic';

export default async function ServicesPage() {
    const session = await auth();

    return (
        <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white">
            <Navbar user={session?.user} />
            <CorePillars />
            <HowWeWork />
            <BookingForm />
            <Footer />
        </main>
    );
}
