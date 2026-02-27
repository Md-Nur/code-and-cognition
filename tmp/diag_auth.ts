import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('--- RECENT SECURITY LOGS ---')
    const logs = await prisma.securityLog.findMany({
        orderBy: { createdAt: 'desc' },
        take: 10
    })
    console.table(logs)

    console.log('\n--- CLIENT USERS ---')
    const users = await prisma.user.findMany({
        where: { role: 'CLIENT' },
        select: { id: true, name: true, email: true, role: true }
    })
    console.table(users)

    console.log('\n--- ACTIVE MAGIC TOKENS ---')
    const tokens = await prisma.magicToken.findMany({
        where: { expiresAt: { gt: new Date() }, used: false },
        orderBy: { createdAt: 'desc' },
        take: 5
    })
    console.table(tokens)
}

main()
    .catch(console.error)
    .finally(() => prisma.$disconnect())
