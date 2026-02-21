import { prisma } from "@/lib/prisma";
import { renderToStream } from "@react-pdf/renderer";
import { ProjectBriefPDF } from "@/app/components/pdf/ProjectBriefPDF";
import { auth } from "@/auth";
import { canAccessProject } from "@/lib/rbac";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await auth();
    if (!session?.user) {
        return new Response("Unauthorized", { status: 401 });
    }

    const { id } = await params;

    try {
        const project = await prisma.project.findUnique({
            where: { id },
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

        if (!canAccessProject(session.user, project, { allowClient: true })) {
            return new Response("Forbidden", { status: 403 });
        }

        // @ts-ignore: Server-side rendering streams are compatible with Response
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
