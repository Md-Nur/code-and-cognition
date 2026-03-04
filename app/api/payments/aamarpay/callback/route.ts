import { prisma } from "@/lib/prisma";
import { verifyAamarPayPayment } from "@/lib/aamarpay";
import { finalizeProposalApproval } from "@/app/actions/proposals";
import { processPaymentSplit } from "@/lib/splitEngine";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const formData = await req.formData();
        const pay_status = formData.get("pay_status");
        const mer_txnid = formData.get("mer_txnid")?.toString();
        const amount = formData.get("amount")?.toString();
        const currency = formData.get("currency")?.toString();
        const opt_a = formData.get("opt_a")?.toString(); // proposalId
        const opt_b = formData.get("opt_b")?.toString(); // proposalToken

        if (!mer_txnid || !opt_a || !opt_b) {
            console.error("AamarPay Callback: Missing mandatory fields", { mer_txnid, opt_a, opt_b });
            return NextResponse.json({ error: "Invalid callback data" }, { status: 400 });
        }

        const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://www.codencognition.com";

        if (pay_status !== "Successful") {
            console.warn("AamarPay Payment Failed or Cancelled:", pay_status, mer_txnid);
            return NextResponse.redirect(`${appUrl}/proposal/view/${opt_b}?payment=failed&status=${pay_status}`, 303);
        }

        // Double Verify with AamarPay API
        const verification = await verifyAamarPayPayment(mer_txnid);

        if (verification.pay_status !== "Successful") {
            console.error("AamarPay Verification Failed:", verification);
            return NextResponse.redirect(`${appUrl}/proposal/view/${opt_b}?payment=failed&reason=verification_failed`, 303);
        }

        // Finalize Proposal and Create Project
        const { project } = await finalizeProposalApproval(opt_a);

        if (project) {
            // Create Payment Record
            const payment = await prisma.payment.create({
                data: {
                    projectId: project.id,
                    amountBDT: currency === "BDT" ? parseFloat(amount || "0") : null,
                    amountUSD: currency === "USD" ? parseFloat(amount || "0") : null,
                    currency: (currency as any) || "BDT",
                    status: "APPROVED",
                    executedAt: new Date(),
                    note: `Online Payment via AamarPay (TXN: ${mer_txnid})`,
                }
            });

            // Trigger Split Engine
            try {
                await processPaymentSplit(payment.id);
            } catch (splitError) {
                console.error("Split Engine Error after AamarPay Payment:", splitError);
                // We don't fail the whole request since project and payment are already created
            }
        }

        return NextResponse.redirect(`${appUrl}/proposal/view/${opt_b}?payment=success`, 303);
    } catch (error: any) {
        console.error("AamarPay Callback Error:", error);
        // In case of error during callback, redirecting back to proposal seems safest
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
