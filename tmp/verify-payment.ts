import { prisma } from "../lib/prisma";
import { processPaymentSplit } from "../lib/splitEngine";

async function testCPODirectPayment() {
    console.log("Starting verification...");

    // 1. Get a project with members
    const project = await prisma.project.findFirst({
        where: {
            status: "ACTIVE",
            members: { some: { role: "EXECUTION" } }
        },
        include: { members: true }
    });

    if (!project) {
        console.error("No active project with execution members found for testing.");
        return;
    }

    console.log(`Testing with project: ${project.title} (${project.id})`);

    // 2. Simulate the new POST logic
    const amount = 1000;
    const currency = "BDT";

    console.log(`Creating payment of ${amount} ${currency}...`);
    const payment = await prisma.payment.create({
        data: {
            projectId: project.id,
            currency,
            amountBDT: amount,
            note: "Verification Test Payment",
            status: "APPROVED",
            executedAt: new Date()
        },
    });

    console.log(`Payment created: ${payment.id}, status: ${payment.status}`);

    // 3. Trigger split engine (as the POST handler now does)
    console.log("Processing split...");
    const result = await processPaymentSplit(payment.id);
    console.log("Split result:", result);

    // 4. Verify ledger entries
    const entries = await prisma.ledgerEntry.findMany({
        where: { paymentId: payment.id }
    });

    console.log(`Found ${entries.length} ledger entries.`);
    if (entries.length > 0) {
        console.log("Verification SUCCESS: Ledger entries created immediately.");
    } else {
        console.error("Verification FAILURE: No ledger entries created.");
    }

    // Cleanup (optional, but good for local dev)
    // await prisma.ledgerEntry.deleteMany({ where: { paymentId: payment.id } });
    // await prisma.payment.delete({ where: { id: payment.id } });
}

testCPODirectPayment()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
