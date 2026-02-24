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
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

/** PATCH /api/portal/project/:viewToken/change-requests  — approve or reject a CR (client only) */
export async function PATCH(req: Request, { params }: Params) {
    // Must be authenticated
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Only the client for this project or a FOUNDER can approve/reject
    const user = session.user as { id: string; email: string; role: string };
    const isClient = project.booking?.clientEmail?.toLowerCase() === user.email.toLowerCase();
    const isFounder = user.role === "FOUNDER";

    if (!isClient && !isFounder) {
        return NextResponse.json(
            { error: "Forbidden: Only the project client or a founder can respond to change requests" },
            { status: 403 }
        );
    }

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
