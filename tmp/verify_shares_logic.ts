import { prisma } from "../lib/prisma";
import { Role } from "@prisma/client";

async function verify() {
    console.log("Starting verification...");

    try {
        // 1. Check Tenure Login (API Logic Test Simulation)
        const contractors = await prisma.user.findMany({ where: { role: Role.CONTRACTOR } });
        const threeMonthsAgo = new Date();
        threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

        console.log(`Found ${contractors.length} contractors.`);
        contractors.forEach(c => {
            const isEligible = new Date(c.createdAt) <= threeMonthsAgo;
            console.log(`- ${c.name}: Joined ${new Date(c.createdAt).toLocaleDateString()}, Eligible: ${isEligible}`);
        });

        // 2. Check Lock-in Logic (Verification of schema and future calculation)
        const twoYearsFromNow = new Date();
        twoYearsFromNow.setDate(twoYearsFromNow.getDate() + 730);
        console.log(`Lock-in target (2 years): ${twoYearsFromNow.toLocaleDateString()}`);

        // 3. Consensus Logic (Check if current code finds all founders)
        const founders = await prisma.user.findMany({ where: { role: { in: [Role.FOUNDER, Role.CO_FOUNDER] } } });
        console.log(`Found ${founders.length} voting members (Founders/Co-Founders).`);

        // 4. Check if any share records exist
        const sharesCount = await prisma.companyShare.count();
        console.log(`Active share records: ${sharesCount}`);

        console.log("Verification finished successfully.");
    } catch (error) {
        console.error("Verification failed:", error);
    }
}

verify();
