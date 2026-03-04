import { prisma } from "@/lib/prisma";
import { initiateAamarPayPayment } from "@/lib/aamarpay";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const { proposalToken, email } = await req.json();

        if (!proposalToken || !email) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const proposal = await prisma.proposal.findUnique({
            where: { viewToken: proposalToken },
            include: { booking: true },
        });

        if (!proposal || !proposal.booking) {
            return NextResponse.json({ error: "Proposal not found" }, { status: 404 });
        }

        if (proposal.booking.clientEmail.toLowerCase() !== email.toLowerCase()) {
            return NextResponse.json({ error: "Email verification failed" }, { status: 403 });
        }

        if (proposal.status === "APPROVED") {
            return NextResponse.json({ error: "Proposal already approved" }, { status: 400 });
        }

        const amount = (proposal.currency === "USD" ? proposal.budgetUSD : proposal.budgetBDT) || 0;

        if (amount <= 0) {
            return NextResponse.json({ error: "Invalid proposal amount" }, { status: 400 });
        }

        const tran_id = `PROP_${proposal.id.substring(0, 8)}_${Date.now()}`;
        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.codencognition.com";

        const paymentParams = {
            tran_id,
            amount: amount.toFixed(2),
            currency: proposal.currency as "BDT" | "USD",
            desc: `Proposal Payment: ${proposal.title || "Project"}`,
            cus_name: proposal.booking.clientName,
            cus_email: proposal.booking.clientEmail,
            cus_phone: proposal.booking.clientPhone || "01700000000", // Fallback phone as it's mandatory
            success_url: `${appUrl}/api/payments/aamarpay/callback`,
            fail_url: `${appUrl}/api/payments/aamarpay/callback`,
            cancel_url: `${appUrl}/api/payments/aamarpay/callback`,
            opt_a: proposal.id, // Store proposal ID for callback
            opt_b: proposalToken,
            cus_add1: "House 1, Road 1", // Mandatory field for AamarPay
            cus_city: "Dhaka",           // Mandatory field for AamarPay
            cus_country: "Bangladesh",    // Mandatory field for AamarPay
        };

        const result = await initiateAamarPayPayment(paymentParams);

        return NextResponse.json({ payment_url: result.payment_url });
    } catch (error: any) {
        console.error("AamarPay Initiation Error:", error);
        return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
}
