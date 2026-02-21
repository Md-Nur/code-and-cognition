import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { canAccessProject, isRoleAllowed } from "@/lib/rbac";

type Params = { params: Promise<{ id: string }> };

/** GET /api/admin/projects/:id/change-requests  — list all CRs for a project */
export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: projectId } = await params;

  // Only FOUNDER or project members may view CRs
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const canAccess = canAccessProject(session.user, project, {
    allowClient: false,
  });
  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const crs = await prisma.changeRequest.findMany({
    where: { projectId },
    include: { requestedBy: { select: { name: true, role: true } } },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(crs);
}

/** POST /api/admin/projects/:id/change-requests  — create a CR (FOUNDER or CONTRACTOR) */
export async function POST(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: projectId } = await params;

  // Only FOUNDER or CONTRACTOR (project member) can create
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: { members: true },
  });
  if (!project)
    return NextResponse.json({ error: "Not found" }, { status: 404 });

  const canAccess = canAccessProject(session.user, project, {
    allowClient: false,
  });
  if (!canAccess) {
    return NextResponse.json(
      {
        error:
          "Forbidden — only Founders/Contractors can create change requests",
      },
      { status: 403 },
    );
  }

  const body = await req.json();
  const { title, description, estimatedTimeImpact, estimatedBudgetImpact } =
    body;

  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required" },
      { status: 400 },
    );
  }

  const cr = await prisma.changeRequest.create({
    data: {
      projectId,
      requestedById: session.user.id,
      title,
      description,
      estimatedTimeImpact: estimatedTimeImpact ?? 0,
      estimatedBudgetImpact: estimatedBudgetImpact ?? 0,
    },
    include: { requestedBy: { select: { name: true, role: true } } },
  });

  // Log to project activity
  await prisma.activityLog.create({
    data: {
      projectId,
      userId: session.user.id,
      action: `submitted a change request: "${title}"`,
    },
  });

  return NextResponse.json(cr, { status: 201 });
}

/** PATCH /api/admin/projects/:id/change-requests  — approve or reject a CR */
export async function PATCH(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id: projectId } = await params;
  const body = await req.json();
  const { crId, status } = body;

  if (!crId || !["APPROVED", "REJECTED"].includes(status)) {
    return NextResponse.json(
      { error: "crId and valid status (APPROVED|REJECTED) required" },
      { status: 400 },
    );
  }

  // Only FOUNDER can approve/reject (acting as the client-side representative)
  if (!isRoleAllowed(session.user, [Role.FOUNDER])) {
    return NextResponse.json(
      {
        error:
          "Forbidden — only Founders can approve or reject change requests",
      },
      { status: 403 },
    );
  }

  const cr = await prisma.changeRequest.update({
    where: { id: crId, projectId },
    data: {
      status,
      clientApprovalAt: new Date(),
    },
    include: { requestedBy: { select: { name: true } } },
  });

  // Log to project activity on approval
  await prisma.activityLog.create({
    data: {
      projectId,
      userId: session.user.id,
      action: `${status === "APPROVED" ? "approved" : "rejected"} the change request: "${cr.title}"`,
    },
  });

  return NextResponse.json(cr);
}
