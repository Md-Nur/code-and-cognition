import type { Metadata } from "next";
import Navbar from "../components/public/Navbar";
import ServicesGrid from "../components/public/ServicesGrid";
import Footer from "../components/public/Footer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Services Hub | Code & Cognition",
    description: "Explore our wide range of digital services, from web development to digital marketing and beyond.",
};

export const dynamic = 'force-dynamic';

export default async function ServicesHub() {
    const session = await auth();
    const services = await prisma.service.findMany({
        where: { status: "ACTIVE" },
        include: {
            subCategories: {
                select: {
                    id: true,
                    title: true,
                    description: true,
                    imageUrl: true,
                    basePriceBDT: true,
                    basePriceUSD: true,
                    mediumPriceBDT: true,
                    mediumPriceUSD: true,
                    proPriceBDT: true,
                    proPriceUSD: true,
                }
            },
            portfolioItems: {
                select: {
                    id: true,
                    title: true,
                    imageUrl: true,
                },
                take: 3,
            }
        },
        orderBy: { createdAt: "asc" },
    }) as any;

    return (
        <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white">
            <Navbar user={session?.user} />

            <section className="pt-32 pb-12 bg-gradient-to-b from-agency-accent/10 to-transparent">
                <div className="section-container text-center">
                    <span className="section-tag mb-4">Our Expertise</span>
                    <h1 className="text-4xl md:text-7xl font-bold tracking-tight mb-6">Our <span className="text-agency-accent">Services</span> Hub</h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        We provide end-to-end digital solutions designed to help your business thrive in the modern landscape.
                    </p>
                </div>
            </section>

            <ServicesGrid initialServices={services} />

            <Footer />
        </main>
    );
}
