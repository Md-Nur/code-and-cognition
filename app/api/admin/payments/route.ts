import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { processPaymentSplit } from "@/lib/splitEngine";
import { NextResponse } from "next/server";
import { z } from "zod";
import { Role, Currency } from "@prisma/client";

const paymentSchema = z.object({
    projectId: z.string().min(1),
    amount: z.number().positive(),
    currency: z.nativeEnum(Currency),
    note: z.string().optional(),
});

export async function GET() {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const payments = await prisma.payment.findMany({
        include: { project: true },
        orderBy: { paidAt: "desc" },
    });
    return NextResponse.json(payments);
}

export async function POST(req: Request) {
    const session = await auth();
    if (session?.user?.role !== Role.FOUNDER) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const body = await req.json();
        const validation = paymentSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: validation.error.format() }, { status: 400 });
        }

        const { projectId, amount, currency, note } = validation.data;

        // Create Payment Record
        const payment = await prisma.payment.create({
            data: {
                projectId,
                currency,
                amountBDT: currency === "BDT" ? amount : null,
                amountUSD: currency === "USD" ? amount : null,
                note,
            },
        });

        // Trigger Split Engine
        await processPaymentSplit(payment.id);

        return NextResponse.json(payment, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
