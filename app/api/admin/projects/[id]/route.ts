import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { canAccessProject } from "@/lib/rbac";
import { createNotification } from "@/lib/notifications";
import { getNextAction } from "@/lib/next-action";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;

  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      finder: true,
      booking: true,
      members: {
        include: { user: true },
      },
      payments: {
        orderBy: { paidAt: "desc" },
        include: { splits: true },
      },
      milestones: {
        orderBy: { order: "asc" },
      },
      activityLogs: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { user: { select: { name: true } } },
      },
    },
  });

  if (!project) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 });
  }

  const canAccess = canAccessProject(session.user, project, {
    allowClient: false,
  });
  if (!canAccess) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const pendingChangeRequests = await prisma.changeRequest.count({
    where: { projectId: id, status: "PENDING" },
  });

  const nextAction = getNextAction({
    status: project.status,
    milestones: project.milestones,
    booking: project.booking,
    payments: project.payments,
    pendingChangeRequests,
  });

  return NextResponse.json({ ...project, nextAction });
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const session = await auth();
  if (!session?.user || session.user.role !== Role.FOUNDER) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const body = await req.json();
  const { status, health } = body;

  if (!status && !health) {
    return NextResponse.json(
      { error: "No update data provided" },
      { status: 400 },
    );
  }

  try {
    const project = await prisma.project.update({
      where: { id },
      data: {
        ...(status && { status }),
        ...(health && { health }),
      },
      include: {
        booking: true,
      },
    });

    // Automation: If COMPLETED, move to Portfolio
    if (status === "COMPLETED") {
      // Check if already exists in portfolio to avoid duplicates (optional but good)
      const existing = await prisma.portfolioItem.findFirst({
        where: { title: project.title },
      });

      if (!existing) {
        await prisma.portfolioItem.create({
          data: {
            title: project.title,
            description:
              project.booking?.message || "Successfully completed project.",
            serviceId: project.booking?.serviceId || "unassigned",
            technologies: [],
            isFeatured: false,
          },
        });

        // Notify members and founders about completion
        const members = await prisma.projectMember.findMany({
          where: { projectId: id },
          include: { user: true },
        });

        const founders = await prisma.user.findMany({
          where: { role: "FOUNDER" },
        });

        const notifyUsers = [...members.map((m) => m.user), ...founders];

        // Deduplicate by ID
        const uniqueUsers = Array.from(
          new Map(notifyUsers.map((u) => [u.id, u])).values(),
        );

        for (const user of uniqueUsers) {
          await createNotification({
            userId: user.id,
            title: "Project Completed",
            message: `Project "${project.title}" has been marked as completed.`,
            type: "PROJECT_STATUS_CHANGE",
            link: `/admin/projects/${id}`,
          });
        }
      }
    }

    return NextResponse.json(project);
  } catch (error) {
    console.error("Failed to update project", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
