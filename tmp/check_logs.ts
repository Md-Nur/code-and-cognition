import { prisma } from "../lib/prisma";

async function main() {
    console.log("--- RECENT SECURITY LOGS ---");
    const logs = await prisma.securityLog.findMany({
        take: 10,
        orderBy: {
            createdAt: 'desc'
        }
    });
    console.log(JSON.stringify(logs, null, 2));

    console.log("\n--- RECENT MAGIC TOKENS ---");
    const tokens = await prisma.magicToken.findMany({
        take: 5,
        orderBy: {
            createdAt: 'desc'
        }
    });
    console.log(JSON.stringify(tokens, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
