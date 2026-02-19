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

    // 2. Seed Main Services (no pricing — pricing is on sub-categories)
    const servicesData = [
        {
            title: 'Digital Marketing',
            description: 'Data-driven marketing strategies to grow your brand presence and drive measurable results across all digital channels.',
            status: Status.ACTIVE,
            subCategories: [
                {
                    title: 'Facebook Marketing',
                    description: 'Targeted Facebook ad campaigns to grow your audience and generate leads.',
                    basePriceBDT: 8000, basePriceUSD: 80,
                    mediumPriceBDT: 20000, mediumPriceUSD: 200,
                    proPriceBDT: 40000, proPriceUSD: 400,
                },
                {
                    title: 'Instagram Marketing',
                    description: 'Engaging Instagram content and ad strategies to build brand awareness.',
                    basePriceBDT: 8000, basePriceUSD: 80,
                    mediumPriceBDT: 20000, mediumPriceUSD: 200,
                    proPriceBDT: 40000, proPriceUSD: 400,
                },
                {
                    title: 'YouTube Marketing',
                    description: 'Video marketing and channel growth strategies for YouTube.',
                    basePriceBDT: 12000, basePriceUSD: 120,
                    mediumPriceBDT: 30000, mediumPriceUSD: 300,
                    proPriceBDT: 60000, proPriceUSD: 600,
                },
            ],
        },
        {
            title: 'Advanced SEO',
            description: 'Comprehensive SEO strategies to boost your search rankings and drive organic traffic.',
            status: Status.ACTIVE,
            subCategories: [
                {
                    title: 'On-Page SEO',
                    description: 'Optimize your website content and structure for better search rankings.',
                    basePriceBDT: 10000, basePriceUSD: 100,
                    mediumPriceBDT: 25000, mediumPriceUSD: 250,
                    proPriceBDT: 50000, proPriceUSD: 500,
                },
                {
                    title: 'Off-Page SEO',
                    description: 'Link building and authority development to strengthen domain ranking.',
                    basePriceBDT: 15000, basePriceUSD: 150,
                    mediumPriceBDT: 35000, mediumPriceUSD: 350,
                    proPriceBDT: 70000, proPriceUSD: 700,
                },
                {
                    title: 'Technical SEO',
                    description: 'Site speed, crawlability, and structured data optimization.',
                    basePriceBDT: 20000, basePriceUSD: 200,
                    mediumPriceBDT: 50000, mediumPriceUSD: 500,
                    proPriceBDT: 100000, proPriceUSD: 1000,
                },
            ],
        },
        {
            title: 'Web Application Development',
            description: 'Full-stack web applications built with Next.js and Node.js.',
            status: Status.ACTIVE,
            subCategories: [
                {
                    title: 'Landing Page',
                    description: 'High-converting landing pages with modern design.',
                    basePriceBDT: 15000, basePriceUSD: 150,
                    mediumPriceBDT: 35000, mediumPriceUSD: 350,
                    proPriceBDT: 70000, proPriceUSD: 700,
                },
                {
                    title: 'Full Web Application',
                    description: 'Complete web applications with authentication, dashboard, and APIs.',
                    basePriceBDT: 50000, basePriceUSD: 500,
                    mediumPriceBDT: 150000, mediumPriceUSD: 1500,
                    proPriceBDT: 300000, proPriceUSD: 3000,
                },
                {
                    title: 'E-Commerce Platform',
                    description: 'Online stores with payment integration, inventory management, and analytics.',
                    basePriceBDT: 80000, basePriceUSD: 800,
                    mediumPriceBDT: 200000, mediumPriceUSD: 2000,
                    proPriceBDT: 400000, proPriceUSD: 4000,
                },
            ],
        },
        {
            title: 'UI/UX Design',
            description: 'Modern, user-centric interface design and prototyping.',
            status: Status.ACTIVE,
            subCategories: [
                {
                    title: 'Wireframing',
                    description: 'Low-fidelity wireframes to map out user flows and layouts.',
                    basePriceBDT: 10000, basePriceUSD: 100,
                    mediumPriceBDT: 25000, mediumPriceUSD: 250,
                    proPriceBDT: 50000, proPriceUSD: 500,
                },
                {
                    title: 'UI Design',
                    description: 'High-fidelity UI designs with a complete design system.',
                    basePriceBDT: 30000, basePriceUSD: 300,
                    mediumPriceBDT: 80000, mediumPriceUSD: 800,
                    proPriceBDT: 150000, proPriceUSD: 1500,
                },
            ],
        },
        {
            title: 'Photo Editing & Manipulation',
            description: 'Professional photo retouching, background removal, and complex image manipulation.',
            status: Status.ACTIVE,
            subCategories: [
                {
                    title: 'Background Removal',
                    description: 'Clean, precise background removal for product and portrait photography.',
                    basePriceBDT: 500, basePriceUSD: 5,
                    mediumPriceBDT: 2000, mediumPriceUSD: 20,
                    proPriceBDT: 5000, proPriceUSD: 50,
                },
                {
                    title: 'Photo Retouching',
                    description: 'Skin retouching, color grading, and professional photo enhancement.',
                    basePriceBDT: 1000, basePriceUSD: 10,
                    mediumPriceBDT: 5000, mediumPriceUSD: 50,
                    proPriceBDT: 15000, proPriceUSD: 150,
                },
                {
                    title: 'Photo Manipulation',
                    description: 'Complex compositing and creative photo manipulation.',
                    basePriceBDT: 3000, basePriceUSD: 30,
                    mediumPriceBDT: 10000, mediumPriceUSD: 100,
                    proPriceBDT: 25000, proPriceUSD: 250,
                },
            ],
        },
    ]

    for (const serviceData of servicesData) {
        const { subCategories, ...serviceFields } = serviceData
        const service = await prisma.service.upsert({
            where: { title: serviceFields.title },
            update: { description: serviceFields.description, status: serviceFields.status },
            create: serviceFields,
        })

        for (const sub of subCategories) {
            const existing = await prisma.subCategory.findFirst({
                where: { title: sub.title, serviceId: service.id },
            })
            if (!existing) {
                await prisma.subCategory.create({
                    data: { ...sub, serviceId: service.id },
                })
            } else {
                await prisma.subCategory.update({
                    where: { id: existing.id },
                    data: sub,
                })
            }
        }
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
