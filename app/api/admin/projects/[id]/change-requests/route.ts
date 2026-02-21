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

