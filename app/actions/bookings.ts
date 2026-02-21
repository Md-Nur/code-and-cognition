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
  serviceId: z.string().min(1),
  discovery: z
    .object({
      companyName: z.string().min(1),
      role: z.string().min(1),
      goals: z.string().min(1),
      timeline: z.string().min(1),
      budgetRange: z.string().optional(),
      currentStack: z.string().optional(),
      successMetrics: z.string().optional(),
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
      message: discovery?.additionalNotes || discovery?.goals,
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
        title: "New Booking Request",
        message: `${clientName} has requested a new booking.`,
        type: "BOOKING_NEW",
        link: `/admin/bookings`,
      }),
    ),
  );

  return { ok: true, booking } as const;
}
