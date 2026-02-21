import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Role } from "@prisma/client";
import React from "react";
import { renderToStream } from "@react-pdf/renderer";
import ProjectBriefDocument, {
  ProjectBriefData,
} from "@/lib/pdf/ProjectBriefDocument";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    // Fetch the project with all necessary relations
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        finder: true,
        booking: true,
        members: {
          include: { user: true },
        },
        milestones: {
          orderBy: { order: "asc" },
        },
      },
    });

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    // Authorization: Check if user has access to this project
    // Allowed: Founders, project finder, or project members
    const isMember = project.members.some((m) => m.userId === session.user.id);
    const isFinder = project.finderId === session.user.id;
    const isFounder = session.user.role === Role.FOUNDER;

    if (!isFounder && !isFinder && !isMember) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Prepare data for PDF
    const pdfData: ProjectBriefData = {
      title: project.title,
      clientName: project.booking?.clientName || "N/A",
      clientEmail: project.booking?.clientEmail,
      scope: project.scope || undefined,
      startDate: project.startDate?.toISOString(),
      endDate: project.endDate?.toISOString(),
      budgetBDT: project.booking?.budgetBDT || undefined,
      budgetUSD: project.booking?.budgetUSD || undefined,
      riskNotes: project.riskNotes || undefined,
      milestones: project.milestones.map((m) => ({
        title: m.title,
        description: m.description || undefined,
        status: m.status,
        order: m.order,
      })),
      createdAt: project.createdAt.toISOString(),
    };

    // Generate PDF
    const stream = await renderToStream(
      React.createElement(ProjectBriefDocument, { data: pdfData }) as any,
    );
    // Create sanitized filename
    const sanitizedTitle = project.title
      .replace(/[^a-z0-9]/gi, "_")
      .toLowerCase();
    const filename = `project_brief_${sanitizedTitle}_${Date.now()}.pdf`;

    // Return PDF as download
    return new NextResponse(stream as any, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${filename}"`,
      },
    });
  } catch (error) {
    console.error("PDF Generation Error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 },
    );
  }
}
