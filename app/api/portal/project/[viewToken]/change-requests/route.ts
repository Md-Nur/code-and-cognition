import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { z } from "zod";

type Params = { params: Promise<{ viewToken: string }> };

const patchSchema = z.object({
    crId: z.string().min(1, "Change request ID is required"),
    status: z.enum(["APPROVED", "REJECTED"]),
});

/** GET /api/portal/project/:viewToken/change-requests  — list all CRs for a project */
export async function GET(_req: Request, { params }: Params) {
    const { viewToken } = await params;

    const project = await prisma.project.findUnique({
        where: { viewToken },
        select: { id: true },
    });

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const crs = await prisma.changeRequest.findMany({
        where: { projectId: project.id },
        include: { requestedBy: { select: { name: true, role: true } } },
        orderBy: { createdAt: "desc" },
    });

    // Check if the current user is an EXECUTION member
    const session = await auth();
    let isExecutionMember = false;
    if (session?.user) {
        const member = await prisma.projectMember.findFirst({
            where: {
                projectId: project.id,
                userId: (session.user as any).id,
                role: "EXECUTION",
            }
        });
        isExecutionMember = !!member;
    }

    return NextResponse.json({ crs, isExecutionMember });
}

/** PATCH /api/portal/project/:viewToken/change-requests  — approve or reject a CR (client only) */
export async function PATCH(req: Request, { params }: Params) {
    const session = await auth();
    const { viewToken } = await params;

    const body = await req.json();
    const validation = patchSchema.safeParse(body);
    if (!validation.success) {
        return NextResponse.json(
            { error: validation.error.issues[0]?.message || "Invalid request data" },
            { status: 400 },
        );
    }

    const { crId, status } = validation.data;

    const project = await prisma.project.findUnique({
        where: { viewToken },
        include: { booking: { select: { clientEmail: true } } },
    });

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    // Only EXECUTION members can approve/reject
    let isAuthorized = false;

    if (session?.user) {
        const user = session.user as { id: string; email: string; role: string };
        const projectMember = await prisma.projectMember.findFirst({
            where: {
                projectId: project.id,
                userId: user.id,
                role: "EXECUTION",
            },
        });
        if (projectMember) {
            isAuthorized = true;
        }
    }

    if (!isAuthorized) {
        return NextResponse.json(
            { error: "Forbidden: Only execution members assigned to this project can respond to change requests" },
            { status: 403 }
        );
    }

    const cr = await prisma.$transaction(async (tx) => {
        const updatedCr = await tx.changeRequest.update({
            where: { id: crId, projectId: project.id },
            data: {
                status,
                clientApprovalAt: new Date(),
            },
            include: { requestedBy: { select: { name: true } } },
        });

        if (status === "APPROVED" && updatedCr.estimatedTimeImpact > 0) {
            const currentProject = await tx.project.findUnique({
                where: { id: project.id },
                select: { endDate: true },
            });

            if (currentProject?.endDate) {
                await tx.project.update({
                    where: { id: project.id },
                    data: {
                        endDate: new Date(
                            currentProject.endDate.getTime() +
                            updatedCr.estimatedTimeImpact * 60 * 60 * 1000
                        ),
                    },
                });
            }
        }

        return updatedCr;
    });

    // Log to project activity on approval
    await prisma.activityLog.create({
        data: {
            projectId: project.id,
            action: `Client ${status === "APPROVED" ? "approved" : "rejected"} the change request: "${cr.title}"`,
        },
    });

    return NextResponse.json(cr);
}
