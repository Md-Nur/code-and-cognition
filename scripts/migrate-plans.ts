import { PricingType, Status } from '@prisma/client';
import { prisma } from '../lib/prisma';

async function main() {
    const subCategories = await prisma.subCategory.findMany();
    console.log(`Found ${subCategories.length} sub-categories to migrate...`);

    for (const sub of subCategories) {
        if (sub.basePriceBDT > 0 || sub.basePriceUSD > 0) {
            const name = `${sub.title} - Implementation`;
            await prisma.engagementModel.upsert({
                where: {
                    serviceId_name: {
                        serviceId: sub.serviceId,
                        name: name,
                    },
                },
                update: {},
                create: {
                    serviceId: sub.serviceId,
                    name: name,
                    description: sub.description || 'Basic Implementation',
                    pricingType: PricingType.FIXED,
                    basePriceBDT: sub.basePriceBDT,
                    basePriceUSD: sub.basePriceUSD,
                    deliverables: [],
                    status: Status.ACTIVE,
                },
            });
            console.log(`Created EngagementModel: ${name}`);
        }

        if (sub.mediumPriceBDT > 0 || sub.mediumPriceUSD > 0) {
            const name = `${sub.title} - Optimization`;
            await prisma.engagementModel.upsert({
                where: {
                    serviceId_name: {
                        serviceId: sub.serviceId,
                        name: name,
                    },
                },
                update: {},
                create: {
                    serviceId: sub.serviceId,
                    name: name,
                    description: sub.mediumDescription || 'Optimization and Enhancements',
                    pricingType: PricingType.FIXED,
                    basePriceBDT: sub.mediumPriceBDT,
                    basePriceUSD: sub.mediumPriceUSD,
                    deliverables: [],
                    status: Status.ACTIVE,
                },
            });
            console.log(`Created EngagementModel: ${name}`);
        }

        if (sub.proPriceBDT > 0 || sub.proPriceUSD > 0) {
            const name = `${sub.title} - Strategy`;
            await prisma.engagementModel.upsert({
                where: {
                    serviceId_name: {
                        serviceId: sub.serviceId,
                        name: name,
                    },
                },
                update: {},
                create: {
                    serviceId: sub.serviceId,
                    name: name,
                    description: sub.proDescription || 'Comprehensive Strategy and Retainer',
                    pricingType: PricingType.RETAINER,
                    basePriceBDT: sub.proPriceBDT,
                    basePriceUSD: sub.proPriceUSD,
                    deliverables: [],
                    status: Status.ACTIVE,
                },
            });
            console.log(`Created EngagementModel: ${name}`);
        }
    }

    console.log('Migration completed.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
