import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import { canAccessProject } from "@/lib/rbac";
import { getNextAction } from "@/lib/next-action";
import { z } from "zod";

const projectUpdateSchema = z.object({
  status: z.enum(["ACTIVE", "COMPLETED", "DELIVERED", "CANCELLED"]).optional(),
  health: z.enum(["GREEN", "YELLOW", "RED"]).optional(),
  companyFundRatio: z.number().min(0).max(1).optional(),
  finderFeeRatio: z.number().min(0).max(1).optional(),
  members: z.array(z.object({
    userId: z.string(),
    role: z.enum(["FINDER", "EXECUTION"]),
    share: z.number().min(0)
  })).optional(),
  title: z.string().min(1).optional(),
}).refine((d) => d.status !== undefined || d.health !== undefined || d.companyFundRatio !== undefined || d.finderFeeRatio !== undefined || d.members !== undefined || d.title !== undefined, {
  message: "At least one update property must be provided",
});

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
    health: project.health,
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

  const validation = projectUpdateSchema.safeParse(body);
  if (!validation.success) {
    return NextResponse.json(
      { error: validation.error.issues[0]?.message || "Invalid update data" },
      { status: 400 },
    );
  }

  const { status, health, companyFundRatio, finderFeeRatio, members, title } = validation.data;

  if (members) {
    const finders = members.filter((m) => m.role === "FINDER");
    if (finders.length > 1) {
      return NextResponse.json(
        { error: "Only one finder is allowed per project" },
        { status: 400 }
      );
    }
  }

  try {
    const project = await prisma.$transaction(async (tx) => {
      // 1. Update project basic info and ratios
      const updatedProject = await tx.project.update({
        where: { id },
        data: {
          ...(status && { status }),
          ...(health && { health }),
          ...(title && { title }),
          companyFundRatio: 0.2,
          finderFeeRatio: 0.1,
        },
        include: {
          booking: true,
        },
      });

      // 2. Update members if provided
      if (members) {
        // Delete existing members and recreate
        await tx.projectMember.deleteMany({
          where: { projectId: id },
        });

        if (members.length > 0) {
          await tx.projectMember.createMany({
            data: members.map((m) => ({
              projectId: id,
              userId: m.userId,
              role: m.role,
              share: m.share,
            })),
          });
        }
      }

      return updatedProject;
    });

    // Automation: If COMPLETED or DELIVERED, notify relevant users
    if (status === "COMPLETED" || status === "DELIVERED") {
      const isCompleted = status === "COMPLETED";



      // Notify members and founders
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

      const title = isCompleted ? "Project Completed" : "Project Delivered";
      const message = isCompleted
        ? `Project "${project.title}" has been marked as completed.`
        : `Project "${project.title}" has been marked as delivered. Final review is now pending.`;

      for (const user of uniqueUsers) {
        // Notification removed
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
