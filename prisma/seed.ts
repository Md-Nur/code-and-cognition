import { Role, Status } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

import { prisma } from '../lib/prisma'

async function main() {
    const hashedPassword = await bcrypt.hash('admin123', 10)

    // 1. Seed Founder User
    const founder = await prisma.user.upsert({
        where: { email: 'admin@codeandcognition.com' },
        update: {},
        create: {
            name: 'Founder',
            email: 'admin@codeandcognition.com',
            passwordHash: hashedPassword,
            role: Role.FOUNDER,
        },
    })

    console.log({ founder })

    // 2. Seed Services
    const services = [
        {
            title: 'Web Application Development',
            description: 'Full-stack web applications built with Next.js and Node.js.',
            basePriceBDT: 50000,
            basePriceUSD: 500,
            status: Status.ACTIVE,
        },
        {
            title: 'UI/UX Design',
            description: 'Modern, user-centric interface design and prototyping.',
            basePriceBDT: 30000,
            basePriceUSD: 300,
            status: Status.ACTIVE,
        },
        {
            title: 'Mobile App Development',
            description: 'Cross-platform mobile apps using React Native or Flutter.',
            basePriceBDT: 60000,
            basePriceUSD: 600,
            status: Status.ACTIVE,
        },
        {
            title: 'API Integration & Systems',
            description: 'Backend systems, API development, and third-party integrations.',
            basePriceBDT: 40000,
            basePriceUSD: 400,
            status: Status.ACTIVE,
        },
    ]

    for (const service of services) {
        await prisma.service.create({
            data: service,
        })
    }

    console.log('Seeding finished.')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
