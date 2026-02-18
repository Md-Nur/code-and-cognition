import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
    clientName: z.string().min(1),
    clientEmail: z.string().email(),
    serviceId: z.string().min(1),
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

        const { clientName, clientEmail, serviceId, budget, message } = validation.data;

        const booking = await prisma.booking.create({
            data: {
                clientName,
                clientEmail,
                serviceId,
                budgetUSD: budget, // Assuming input is USD for now based on form
                message,
                status: "PENDING",
            },
        });

        return NextResponse.json(booking, { status: 201 });
    } catch (error) {
        console.error("Error creating booking:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
