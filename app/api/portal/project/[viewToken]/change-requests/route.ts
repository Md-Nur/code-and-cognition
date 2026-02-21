import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

type Params = { params: Promise<{ viewToken: string }> };

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

    return NextResponse.json(crs);
}

/** PATCH /api/portal/project/:viewToken/change-requests  — approve or reject a CR */
export async function PATCH(req: Request, { params }: Params) {
    const { viewToken } = await params;
    const body = await req.json();
    const { crId, status } = body;

    if (!crId || !["APPROVED", "REJECTED"].includes(status)) {
        return NextResponse.json(
            { error: "crId and valid status (APPROVED|REJECTED) required" },
            { status: 400 },
        );
    }

    const project = await prisma.project.findUnique({
        where: { viewToken },
        select: { id: true },
    });

    if (!project) return NextResponse.json({ error: "Not found" }, { status: 404 });

    const cr = await prisma.changeRequest.update({
        where: { id: crId, projectId: project.id },
        data: {
            status,
            clientApprovalAt: new Date(),
        },
        include: { requestedBy: { select: { name: true } } },
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
