import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
    console.log('Cleaning up duplicate services...')

    const services = await prisma.service.findMany()
    const seen = new Set()

    for (const service of services) {
        if (seen.has(service.title)) {
            console.log(`Deleting duplicate: ${service.title} (${service.id})`)
            await prisma.service.delete({ where: { id: service.id } })
        } else {
            seen.add(service.title)
        }
    }

    console.log('Cleanup finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
