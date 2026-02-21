"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { Role } from "@prisma/client";

const proposalCreateSchema = z.object({
  bookingId: z.string().min(1),
  scopeSummary: z.string().min(1),
  milestones: z.array(z.string().min(1)).min(1),
  deliverables: z.array(z.string().min(1)).optional().default([]),
  budgetBDT: z.number().positive().optional().nullable(),
  budgetUSD: z.number().positive().optional().nullable(),
  currency: z.enum(["BDT", "USD"]).optional(),
  estimatedDays: z.number().int().positive().optional().nullable(),
  notes: z.string().optional().nullable(),
});

const proposalIdSchema = z.object({
  proposalId: z.string().min(1),
});

async function requireFounder() {
  const session = await auth();
  if (!session || session.user.role !== Role.FOUNDER) {
    return { ok: false, error: "Forbidden" } as const;
  }
  return { ok: true, session } as const;
}

export async function createProposalForBooking(
  input: z.infer<typeof proposalCreateSchema>,
) {
  const authResult = await requireFounder();
  if (!authResult.ok) return authResult;

  const validation = proposalCreateSchema.safeParse(input);
  if (!validation.success) {
    return { ok: false, error: validation.error.format() } as const;
  }

  const data = validation.data;

  const booking = await prisma.booking.findUnique({
    where: { id: data.bookingId },
    include: { service: true },
  });

  if (!booking) {
    return { ok: false, error: "Booking not found" } as const;
  }

  const proposal = await prisma.proposal.create({
    data: {
      scopeSummary: data.scopeSummary,
      deliverables: data.deliverables.length
        ? data.deliverables
        : data.milestones,
      milestones: data.milestones,
      budgetBDT: data.budgetBDT ?? null,
      budgetUSD: data.budgetUSD ?? null,
      currency: data.currency ?? "BDT",
      estimatedDays: data.estimatedDays ?? null,
      notes: data.notes ?? null,
    },
  });

  await prisma.booking.update({
    where: { id: booking.id },
    data: {
      proposalId: proposal.id,
      status: "REVIEWED",
    },
  });

  const clientUser = await prisma.user.findUnique({
    where: { email: booking.clientEmail },
  });

  if (clientUser) {
    await createNotification({
      userId: clientUser.id,
      title: "Proposal Drafted",
      message: `A proposal draft is ready for ${booking.service.title}.`,
      type: "SYSTEM",
      link: `/services`,
    });
  }

  return { ok: true, proposal } as const;
}

export async function sendProposal(input: z.infer<typeof proposalIdSchema>) {
  const authResult = await requireFounder();
  if (!authResult.ok) return authResult;

  const validation = proposalIdSchema.safeParse(input);
  if (!validation.success) {
    return { ok: false, error: validation.error.format() } as const;
  }

  const proposal = await prisma.proposal.update({
    where: { id: validation.data.proposalId },
    data: { status: "SENT" },
    include: { booking: true },
  });

  if (proposal.booking) {
    const clientUser = await prisma.user.findUnique({
      where: { email: proposal.booking.clientEmail },
    });

    if (clientUser) {
      await createNotification({
        userId: clientUser.id,
        title: "Proposal Sent",
        message: "Your proposal is ready for review.",
        type: "SYSTEM",
        link: `/services`,
      });
    }
  }

  return { ok: true, proposal } as const;
}

export async function approveProposal(input: z.infer<typeof proposalIdSchema>) {
  const session = await auth();
  if (!session) {
    return { ok: false, error: "Unauthorized" } as const;
  }

  const validation = proposalIdSchema.safeParse(input);
  if (!validation.success) {
    return { ok: false, error: validation.error.format() } as const;
  }

  const proposal = await prisma.proposal.findUnique({
    where: { id: validation.data.proposalId },
    include: { booking: { include: { service: true } } },
  });

  if (!proposal || !proposal.booking) {
    return { ok: false, error: "Proposal booking not found" } as const;
  }

  const finderId =
    session.user.role === Role.FOUNDER
      ? session.user.id
      : (await prisma.user.findFirst({ where: { role: Role.FOUNDER } }))?.id;

  if (!finderId) {
    return { ok: false, error: "No founder available" } as const;
  }

  const projectTitle = `${proposal.booking.service.title} - ${proposal.booking.clientName}`;

  const project = await prisma.project.create({
    data: {
      title: projectTitle,
      bookingId: proposal.booking.id,
      finderId,
      scope: proposal.scopeSummary,
    },
  });

  const updatedProposal = await prisma.proposal.update({
    where: { id: proposal.id },
    data: {
      status: "APPROVED",
      approved: true,
      approvedAt: new Date(),
      projectId: project.id,
    },
  });

  await prisma.booking.update({
    where: { id: proposal.booking.id },
    data: { status: "CONVERTED" },
  });

  return { ok: true, proposal: updatedProposal, project } as const;
}

export async function rejectProposal(input: z.infer<typeof proposalIdSchema>) {
  const authResult = await requireFounder();
  if (!authResult.ok) return authResult;

  const validation = proposalIdSchema.safeParse(input);
  if (!validation.success) {
    return { ok: false, error: validation.error.format() } as const;
  }

  const proposal = await prisma.proposal.update({
    where: { id: validation.data.proposalId },
    data: { status: "REJECTED", approved: false, approvedAt: null },
    include: { booking: true },
  });

  if (proposal.booking) {
    await prisma.booking.update({
      where: { id: proposal.booking.id },
      data: { status: "REJECTED" },
    });
  }

  return { ok: true, proposal } as const;
}
