const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
    await prisma.$executeRaw`DELETE FROM "Notification" WHERE type IN ('BOOKING_STATUS_CHANGE', 'PROJECT_NEW', 'PROJECT_STATUS_CHANGE', 'SYSTEM')`;
    console.log('Done');
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
