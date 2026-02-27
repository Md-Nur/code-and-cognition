"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { auth } from "@/lib/auth";

export async function markBookingAsReviewedAction(bookingId: string) {
  const session = await auth();
  if (!session || session.user.role !== "FOUNDER") {
    return { ok: false, error: "Unauthorized" } as const;
  }

  const booking = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: "QUALIFIED" },
  });

  return { ok: true, booking } as const;
}

const bookingActionSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  serviceId: z.string().optional(),
  discovery: z
    .object({
      companyName: z.string().min(1),
      industry: z.string().min(1),
      revenueRange: z.string().optional(),
      budgetRange: z.string().min(1),
      problemStatement: z.string().min(1),
      timeline: z.string().min(1),
      additionalNotes: z.string().optional(),
    })
    .optional(),
});

import { sendMail } from "@/lib/mailer";
import { clientConfirmationEmailHtml, founderNotificationEmailHtml } from "@/app/components/emails/ConsultationEmails";

export async function createBookingAction(
  input: z.infer<typeof bookingActionSchema>,
) {
  const validation = bookingActionSchema.safeParse(input);
  if (!validation.success) {
    return { ok: false, error: validation.error.format() } as const;
  }

  const { clientName, clientEmail, clientPhone, serviceId, discovery } =
    validation.data;

  const booking = await prisma.booking.create({
    data: {
      clientName,
      clientEmail,
      clientPhone,
      serviceId,
      discovery,
      status: "NEW",
    },
  });

  const founders = await prisma.user.findMany({
    where: { role: "FOUNDER" },
  });

  // 1. In-App Notifications
  await Promise.all(
    founders.map((founder) =>
      createNotification({
        userId: founder.id,
        title: "New Consultation Request",
        message: `${clientName} ${discovery?.companyName ? `from ${discovery?.companyName}` : ''} requested a strategic consultation.`,
        type: "BOOKING_NEW",
        link: `/dashboard/leads`,
      }),
    ),
  );

  // 2. Email Delivery (Non-blocking)
  try {
    // Send Confirmation to Client
    await sendMail(
      clientEmail,
      "Consultation Request Received - Code & Cognition",
      clientConfirmationEmailHtml(clientName)
    );

    // Send Notification to Founders
    const founderEmails = founders.map(f => f.email).join(",");
    const notificationTo = process.env.FOUNDER_EMAIL || founderEmails || "codencognition.bd@gmail.com";

    await sendMail(
      notificationTo,
      `New Lead: ${discovery?.companyName || clientName}`,
      founderNotificationEmailHtml(
        clientName,
        clientEmail,
        discovery?.companyName || "N/A",
        discovery?.industry || "N/A",
        discovery?.revenueRange || "N/A",
        discovery?.budgetRange || "N/A",
        discovery?.timeline || "N/A",
        discovery?.problemStatement || "N/A"
      )
    );
  } catch (error) {
    console.error("Failed to send SMTP emails:", error);
    // We don't fail the booking if emails fail
  }

  return { ok: true, booking } as const;
}
