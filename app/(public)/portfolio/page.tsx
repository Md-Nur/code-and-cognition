import { prisma } from "@/lib/prisma";
import ProjectList from "@/app/components/public/ProjectList";
import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Portfolio | Code & Cognition",
    description: "Explore our portfolio of digital products built for ambitious brands worldwide.",
};

export default async function ProjectsPage() {
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
        <main className="pt-32">
            <ProjectList initialProjects={projects as any} services={services} />
        </main>
    );
}
