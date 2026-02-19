import { prisma } from "@/lib/prisma";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import ProjectList from "../components/public/ProjectList";
import type { Metadata } from "next";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
    title: "Portfolio | Code & Cognition",
    description: "Explore our portfolio of digital products built for ambitious brands worldwide.",
};

export default async function ProjectsPage() {
    const session = await auth();
    const [projects, services] = await Promise.all([
        prisma.portfolioItem.findMany({
            include: {
                service: {
                    select: {
                        title: true
                    }
                }
            },
            orderBy: { createdAt: "desc" },
        }),
        prisma.service.findMany({
            where: { status: "ACTIVE" },
            select: {
                id: true,
                title: true,
            },
            orderBy: { createdAt: "asc" },
        })
    ]);

    return (
        <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white pt-32">
            <Navbar user={session?.user} />
            <ProjectList initialProjects={projects as any} services={services} />
            <Footer />
        </main>
    );
}
