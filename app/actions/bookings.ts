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
    data: { status: "REVIEWED" },
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
      revenueRange: z.string().min(1),
      budgetRange: z.string().min(1),
      problemStatement: z.string().min(1),
      timeline: z.string().min(1),
      additionalNotes: z.string().optional(),
    })
    .optional(),
});

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
      message: discovery?.problemStatement || discovery?.additionalNotes || "Strategic Consultation Request",
      status: "PENDING",
    },
  });

  const founders = await prisma.user.findMany({
    where: { role: "FOUNDER" },
  });

  await Promise.all(
    founders.map((founder) =>
      createNotification({
        userId: founder.id,
        title: "New Consultation Request",
        message: `${clientName} ${discovery?.companyName ? `from ${discovery?.companyName}` : ''} requested a strategic consultation.`,
        type: "BOOKING_NEW",
        link: `/admin/bookings`,
      }),
    ),
  );

  return { ok: true, booking } as const;
}
