import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { rateLimit, getIp } from "@/lib/rate-limit";

const bookingSchema = z.object({
  clientName: z.string().min(1, "Name is required").max(100, "Name too long"),
  clientEmail: z.string().email("Invalid email").max(200, "Email too long"),
  clientPhone: z.string().max(30, "Phone number too long").optional(),
  serviceId: z.string().min(1, "Service ID is required"),
  discovery: z
    .object({
      companyName: z.string().min(1).max(200),
      role: z.string().min(1).max(100),
      goals: z.string().min(1).max(2000),
      timeline: z.string().min(1).max(200),
      budgetRange: z.string().max(100).optional(),
      currentStack: z.string().max(500).optional(),
      successMetrics: z.string().max(1000).optional(),
      additionalNotes: z.string().max(2000).optional(),
    })
    .optional(),
});

export async function POST(req: Request) {
  // Rate limit: 3 booking submissions per hour per IP to prevent spam
  const ip = getIp(req);
  const { success } = rateLimit(`booking:${ip}`, 3, 60 * 60 * 1000);
  if (!success) {
    return NextResponse.json(
      { error: "Too many requests. Please try again later." },
      { status: 429 }
    );
  }

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

    // Normalize email for consistency
    const normalizedEmail = clientEmail.toLowerCase().trim();

    // Verify the service exists
    const service = await prisma.service.findUnique({
      where: { id: serviceId },
      select: { id: true },
    });
    if (!service) {
      return NextResponse.json({ error: "Invalid service" }, { status: 400 });
    }

    const booking = await prisma.booking.create({
      data: {
        clientName: clientName.trim(),
        clientEmail: normalizedEmail,
        clientPhone: clientPhone?.trim(),
        serviceId,
        discovery,
        status: "NEW",
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}
