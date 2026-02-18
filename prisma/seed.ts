import { Role, Status } from '@prisma/client'
import * as bcrypt from 'bcryptjs'

import { prisma } from '../lib/prisma'

async function main() {
    const hashedPassword = await bcrypt.hash('tor duida bici te pori', 10)

    // 1. Seed Founder User
    const founder = await prisma.user.upsert({
        where: { email: 'codencognition.bd@gmail.com' },
        update: {},
        create: {
            name: 'Founder',
            email: 'codencognition.bd@gmail.com',
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
            mediumPriceBDT: 150000,
            mediumPriceUSD: 1500,
            proPriceBDT: 300000,
            proPriceUSD: 3000,
            status: Status.ACTIVE,
        },
        {
            title: 'UI/UX Design',
            description: 'Modern, user-centric interface design and prototyping.',
            basePriceBDT: 30000,
            basePriceUSD: 300,
            mediumPriceBDT: 80000,
            mediumPriceUSD: 800,
            proPriceBDT: 150000,
            proPriceUSD: 1500,
            status: Status.ACTIVE,
        },
        {
            title: 'Mobile App Development',
            description: 'Cross-platform mobile apps using React Native or Flutter.',
            basePriceBDT: 60000,
            basePriceUSD: 600,
            mediumPriceBDT: 180000,
            mediumPriceUSD: 1800,
            proPriceBDT: 350000,
            proPriceUSD: 3500,
            status: Status.ACTIVE,
        },
        {
            title: 'API Integration & Systems',
            description: 'Backend systems, API development, and third-party integrations.',
            basePriceBDT: 40000,
            basePriceUSD: 400,
            mediumPriceBDT: 120000,
            mediumPriceUSD: 1200,
            proPriceBDT: 250000,
            proPriceUSD: 2500,
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
