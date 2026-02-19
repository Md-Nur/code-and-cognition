import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";
import { createNotification } from "@/lib/notifications";

const bookingSchema = z.object({
    clientName: z.string().min(1),
    clientEmail: z.string().email(),
    serviceId: z.string().min(1),               // the parent Service id
    subCategoryId: z.string().optional(),        // the chosen sub-service id (optional for backward compat)
    budget: z.number().positive(),
    message: z.string().optional(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const validation = bookingSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { clientName, clientEmail, serviceId, subCategoryId, budget, message } = validation.data;

        const booking = await prisma.booking.create({
            data: {
                clientName,
                clientEmail,
                serviceId,
                budgetBDT: budget,
                message: subCategoryId
                    ? `[Sub-service: ${subCategoryId}] ${message ?? ""}`.trim()
                    : message,
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
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
