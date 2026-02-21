import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import { ProjectBriefPDF } from "@/app/components/pdf/ProjectBriefPDF";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ viewToken: string }> }
) {
    const { viewToken } = await params;

    try {
        const project = await prisma.project.findUnique({
            where: { viewToken },
            include: {
                booking: true,
                milestones: {
                    orderBy: { order: "asc" },
                },
            },
        });

        if (!project) {
            return new Response("Project not found", { status: 404 });
        }

        // @ts-ignore
        const stream = await renderToStream(<ProjectBriefPDF project={project} />);

        return new Response(stream as any, {
            headers: {
                "Content-Type": "application/pdf",
                "Content-Disposition": `attachment; filename="Project_Brief_${project.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}.pdf"`,
            },
        });
    } catch (error) {
        console.error("PDF Generation Error:", error);
        return new Response("Failed to generate PDF", { status: 500 });
    }
}
