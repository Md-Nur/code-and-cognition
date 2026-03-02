"use server";

import { revalidatePath } from "next/cache";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { Role, Prisma } from "@prisma/client";
import { withProxyValidation } from "@/lib/api-handler";
import { sendMail } from "@/lib/mailer";
import { proposalEmailHtml } from "@/app/components/emails/ConsultationEmails";
import { createNotification } from "@/lib/notifications";

const proposalCreateSchema = z.object({
  bookingId: z.string().min(1),
  scopeSummary: z.string().min(1),
  milestones: z.array(z.string().min(1)).min(1),
  deliverables: z.array(z.string().min(1)).optional().default([]),
  budgetBDT: z.number().nonnegative().optional().nullable(),
  budgetUSD: z.number().nonnegative().optional().nullable(),
  currency: z.enum(["BDT", "USD"]),
  estimatedDays: z.number().int().nonnegative().optional().nullable(),
  paymentTerms: z.string().optional().nullable(),
  contractText: z.string().optional().nullable(),
  notes: z.string().optional().nullable(),
  title: z.string().optional().nullable(),
});

const proposalIdSchema = z.object({
  proposalId: z.string().min(1),
});

export const createProposalForBooking = withProxyValidation(
  async (input: z.infer<typeof proposalCreateSchema>) => {
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
        paymentTerms: data.paymentTerms ?? null,
        contractText: data.contractText ?? null,
        notes: data.notes ?? null,
        title: data.title ?? null,
        status: "DRAFT",
        viewToken: crypto.randomUUID(),
      },
    });

    revalidatePath("/dashboard/proposals");

    await prisma.booking.update({
      where: { id: booking.id },
      data: {
        proposalId: proposal.id,
        status: "QUALIFIED",
      },
    });

    const clientUser = await prisma.user.findUnique({
      where: { email: booking.clientEmail },
    });

    if (clientUser) {
      // Notification removed
    }

    return { ok: true, proposal } as const;
  },
  { requiredRole: Role.FOUNDER }
);

export const sendProposal = withProxyValidation(
  async (input: z.infer<typeof proposalIdSchema>) => {
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
        // Notification removed
      }

      await prisma.booking.update({
        where: { id: proposal.booking.id },
        data: { status: "PROPOSAL_SENT" },
      });

      try {
        await sendMail(
          proposal.booking.clientEmail,
          "Proposal Ready for Review - Code & Cognition",
          proposalEmailHtml(
            proposal.booking.clientName,
            `${process.env.NEXT_PUBLIC_APP_URL || "https://www.codencognition.com"}/proposal/view/${proposal.viewToken}`
          )
        );
      } catch (error) {
        console.error("Failed to send proposal email:", error);
      }
    }

    revalidatePath("/dashboard/proposals");
    return { ok: true, proposal } as const;
  },
  { requiredRole: Role.FOUNDER }
);

const proposalApproveSchema = z.object({
  proposalId: z.string().min(1),
  finderId: z.string().optional(),
  memberAssignments: z.array(z.object({
    userId: z.string().min(1),
    share: z.number().min(0).max(100),
  })).optional(),
});

export const approveProposal = withProxyValidation(
  async (input: z.infer<typeof proposalApproveSchema>) => {
    const session = await auth();
    if (!session) {
      return { ok: false, error: "Unauthorized" } as const;
    }

    const validation = proposalApproveSchema.safeParse(input);
    if (!validation.success) {
      return { ok: false, error: validation.error.format() } as const;
    }

    const { proposalId, finderId: providedFinderId, memberAssignments } = validation.data;

    const proposal = await prisma.proposal.findUnique({
      where: { id: proposalId },
      include: { booking: { include: { service: true } } },
    });

    if (!proposal || !proposal.booking) {
      return { ok: false, error: "Proposal booking not found" } as const;
    }

    const booking = proposal.booking;

    const finderId = providedFinderId ||
      (session.user.role === Role.FOUNDER || session.user.role === Role.CO_FOUNDER
        ? session.user.id
        : (await prisma.user.findFirst({ where: { role: Role.FOUNDER } }))?.id);

    if (!finderId) {
      return { ok: false, error: "No finder available" } as const;
    }

    const projectTitle = proposal.title || `${booking.service?.title || "Consultation Project"} - ${booking.clientName}`;

    // Perform inside a transaction to ensure atomicity
    const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // 1. Create the Project
      const project = await tx.project.create({
        data: {
          title: projectTitle,
          bookingId: booking.id,
          finderId,
          scope: proposal.scopeSummary,
          workspaceUrl: `/project/${proposal.viewToken}`, // Use the same token for portal
          workspaceStatus: "PENDING",
          companyFundRatio: 0.20,
          finderFeeRatio: 0.10,
          milestones: {
            create: proposal.milestones.map((milestoneTitle: string, index: number) => ({
              title: milestoneTitle,
              order: index,
              status: "PENDING",
            })),
          },
        },
      });

      // 2. Assign Team
      if (memberAssignments && memberAssignments.length > 0) {
        await tx.projectMember.createMany({
          data: memberAssignments.map(m => ({
            projectId: project.id,
            userId: m.userId,
            share: m.share,
          })),
        });
      } else {
        // Default: Finder as initial member with 70% share of execution pool
        await tx.projectMember.create({
          data: {
            projectId: project.id,
            userId: finderId,
            share: 70,
          },
        });
      }

      // 3. Update Proposal
      const updatedProposal = await tx.proposal.update({
        where: { id: proposal.id },
        data: {
          status: "APPROVED",
          approved: true,
          approvedAt: new Date(),
          signedAt: new Date(),
          projectId: project.id,
        },
      });

      // 4. Update Booking
      await tx.booking.update({
        where: { id: booking.id },
        data: { status: "CLOSED_WON" },
      });

      // 5. Log Activity
      await tx.activityLog.create({
        data: {
          projectId: project.id,
          userId: session.user.id,
          action: "PROJECT_STARTED",
        },
      });

      return { proposal: updatedProposal, project };
    });

    return { ok: true, ...result } as const;
  },
  { requiredRole: [Role.FOUNDER, Role.CO_FOUNDER] }
);

export const rejectProposal = withProxyValidation(
  async (input: z.infer<typeof proposalIdSchema>) => {
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
        data: { status: "CLOSED_LOST" },
      });
    }

    return { ok: true, proposal } as const;
  },
  { requiredRole: Role.FOUNDER } // Actually, clients reject too? Assuming Founders for now from previous `requireFounder()`
);

export const getProposalByToken = async (token: string) => {
  if (!token) return null;

  const proposal = await prisma.proposal.findUnique({
    where: { viewToken: token },
    include: {
      booking: {
        include: { service: true }
      }
    }
  });

  return proposal;
};

export const approveProposalByToken = async (token: string, email: string) => {
  // Verify the proposal by token
  const proposal = await prisma.proposal.findUnique({
    where: { viewToken: token },
    include: { booking: { include: { service: true } } }
  });

  if (!proposal || !proposal.booking) {
    return { ok: false, error: "Proposal not found" } as const;
  }

  // Verify identity by email (double verification: token in URL + email)
  if (proposal.booking.clientEmail.toLowerCase() !== email.toLowerCase()) {
    return { ok: false, error: "Email verification failed. Please use the email associated with this proposal." } as const;
  }

  if (proposal.status === "APPROVED") {
    return { ok: false, error: "This proposal has already been approved." } as const;
  }

  const booking = proposal.booking;

  // Find the founder to assign as the project finder
  const founder = await prisma.user.findFirst({ where: { role: Role.FOUNDER } });
  if (!founder) {
    return { ok: false, error: "No founder available to start the project." } as const;
  }

  const projectTitle = proposal.title || `${booking.service?.title || "Consultation Project"} - ${booking.clientName}`;

  // Perform inside a transaction to ensure atomicity
  const result = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    // 1. Create the Project
    const project = await tx.project.create({
      data: {
        title: projectTitle,
        bookingId: booking.id,
        finderId: founder.id,
        scope: proposal.scopeSummary,
        workspaceUrl: `/project/${proposal.viewToken}`,
        workspaceStatus: "PENDING",
        companyFundRatio: 0.20,
        finderFeeRatio: 0.10,
        milestones: {
          create: proposal.milestones.map((milestoneTitle: string, index: number) => ({
            title: milestoneTitle,
            order: index,
            status: "PENDING",
          })),
        },
      },
    });

    // 2. Assign Founder as initial team member with 70% execution share
    await tx.projectMember.create({
      data: {
        projectId: project.id,
        userId: founder.id,
        share: 70,
      },
    });

    // 3. Update Proposal to APPROVED
    const updatedProposal = await tx.proposal.update({
      where: { id: proposal.id },
      data: {
        status: "APPROVED",
        approved: true,
        approvedAt: new Date(),
        signedAt: new Date(),
        projectId: project.id,
      },
    });

    // 4. Update Booking status
    await tx.booking.update({
      where: { id: booking.id },
      data: { status: "CLOSED_WON" },
    });

    // 5. Log Activity
    await tx.activityLog.create({
      data: {
        projectId: project.id,
        userId: founder.id,
        action: "PROJECT_STARTED",
      },
    });

    return { proposal: updatedProposal, project };
  });

  // Notify Admins
  try {
    const admins = await prisma.user.findMany({
      where: {
        role: {
          in: [Role.FOUNDER, Role.CO_FOUNDER],
        },
      },
    });

    for (const admin of admins) {
      await createNotification({
        userId: admin.id,
        title: "Project Accepted",
        message: `${booking.clientName} has accepted the proposal for ${result.project.title}.`,
        type: "PROPOSAL_APPROVED",
        link: `/dashboard/projects/${result.project.id}`,
      });
    }
  } catch (error) {
    console.error("Failed to create admin notification:", error);
  }

  // Send Magic Link to Client for Project Access
  try {
    const magicLinkUrl = `${process.env.NEXT_PUBLIC_APP_URL || "https://www.codencognition.com"}/project/${result.project.viewToken}`;
    await sendMail(
      booking.clientEmail,
      `Your Project is Active: ${result.project.title}`,
      `<div style="font-family: sans-serif; padding: 20px;">
          <h2>Project Successfully Initialized</h2>
          <p>Hi ${booking.clientName},</p>
          <p>The proposal for <strong>${booking.service?.title || "your project"}</strong> has been approved. Your project workspace is now ready.</p>
          <p>Click the secure link below to access your project dashboard:</p>
          <a href="${magicLinkUrl}" style="display: inline-block; padding: 10px 20px; background-color: #E6FF00; color: #000; text-decoration: none; font-weight: bold; border-radius: 5px;">Access Project Dashboard</a>
          <p style="color: #666; font-size: 12px; margin-top: 20px;">You can use this link anytime to view project progress, milestones, and messages.</p>
        </div>`
    );
  } catch (error) {
    console.error("Failed to send project access magic link email:", error);
  }

  return { ok: true, ...result } as const;
};

