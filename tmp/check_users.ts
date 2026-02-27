import { prisma } from "../lib/prisma";

async function main() {
    console.log("--- EXISTING USERS ---");
    const users = await prisma.user.findMany({
        select: {
            email: true,
            role: true,
            name: true
        }
    });
    console.log(JSON.stringify(users, null, 2));

    console.log("\n--- SUCCESSFUL MAGIC LINK REQUESTS ---");
    const successLogs = await prisma.securityLog.findMany({
        where: {
            action: "MAGIC_LINK_REQUEST",
            status: "SUCCESS"
        },
        take: 5,
        orderBy: {
            createdAt: 'desc'
        }
    });
    console.log(JSON.stringify(successLogs, null, 2));
}

main()
    .catch(e => console.error(e))
    .finally(async () => await prisma.$disconnect());
