import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createNotification } from "@/lib/notifications";

const bookingSchema = z.object({
  clientName: z.string().min(1),
  clientEmail: z.string().email(),
  clientPhone: z.string().optional(),
  serviceId: z.string().min(1), // the parent Service id
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

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const validation = bookingSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.format() },
        { status: 400 },
      );
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

    // Notify founders
    const founders = await prisma.user.findMany({
      where: { role: "FOUNDER" },
    });

    for (const founder of founders) {
      await createNotification({
        userId: founder.id,
        title: "New Booking Request",
        message: `${clientName} has requested a new booking.`,
        type: "BOOKING_NEW",
        link: `/admin/bookings`,
      });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
