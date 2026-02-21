import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log("Starting seed...");

    // 1. Digital Platforms
    const digitalPlatforms = await prisma.serviceCategory.upsert({
        where: { slug: "digital-platforms" },
        update: {
            name: "Digital Platforms",
            description: "Transforming complexity into resilient performance.",
            order: 1,
        },
        create: {
            name: "Digital Platforms",
            slug: "digital-platforms",
            description: "Transforming complexity into resilient performance.",
            order: 1,
        },
    });

    await prisma.service.upsert({
        where: { slug: "enterprise-digital-ecosystems" },
        update: {
            categoryId: digitalPlatforms.id,
            title: "Enterprise Digital Ecosystems",
            description: "Scalable, enterprise-grade digital ecosystems designed as the operational foundation.",
            overview: "We architect and deploy scalable, enterprise-grade digital ecosystems designed as the operational foundation for modern businesses.",
            positioningText: "Focus on operational resilience, infinite scalability, and cloud-native modernization.",
            order: 1,
        },
        create: {
            categoryId: digitalPlatforms.id,
            title: "Enterprise Digital Ecosystems",
            slug: "enterprise-digital-ecosystems",
            description: "Scalable, enterprise-grade digital ecosystems designed as the operational foundation.",
            overview: "We architect and deploy scalable, enterprise-grade digital ecosystems designed as the operational foundation for modern businesses.",
            positioningText: "Focus on operational resilience, infinite scalability, and cloud-native modernization.",
            order: 1,
        },
    });

    // 2. Intelligent Automation
    const intelligentAutomation = await prisma.serviceCategory.upsert({
        where: { slug: "intelligent-automation" },
        update: {
            name: "Intelligent Automation",
            description: "Precision-engineered intelligence for the modern enterprise.",
            order: 2,
        },
        create: {
            name: "Intelligent Automation",
            slug: "intelligent-automation",
            description: "Precision-engineered intelligence for the modern enterprise.",
            order: 2,
        },
    });

    await prisma.service.upsert({
        where: { slug: "strategic-ai-integration" },
        update: {
            categoryId: intelligentAutomation.id,
            title: "Strategic AI Integration",
            description: "Advanced machine learning and algorithmic modeling to synthesize data into actionable strategy.",
            overview: "We leverage advanced machine learning and algorithmic modeling to synthesize data into actionable strategy.",
            positioningText: "Enhancing strategic precision, driving efficiency at scale, and securing predictive advantages.",
            order: 1,
        },
        create: {
            categoryId: intelligentAutomation.id,
            title: "Strategic AI Integration",
            slug: "strategic-ai-integration",
            description: "Advanced machine learning and algorithmic modeling to synthesize data into actionable strategy.",
            overview: "We leverage advanced machine learning and algorithmic modeling to synthesize data into actionable strategy.",
            positioningText: "Enhancing strategic precision, driving efficiency at scale, and securing predictive advantages.",
            order: 1,
        },
    });

    // 3. Performance Growth Systems
    const growthSystems = await prisma.serviceCategory.upsert({
        where: { slug: "performance-growth-systems" },
        update: {
            name: "Performance Growth Systems",
            description: "Synthesizing content engineering with data-driven results.",
            order: 3,
        },
        create: {
            name: "Performance Growth Systems",
            slug: "performance-growth-systems",
            description: "Synthesizing content engineering with data-driven results.",
            order: 3,
        },
    });

    await prisma.service.upsert({
        where: { slug: "growth-acceleration-framework" },
        update: {
            categoryId: growthSystems.id,
            title: "Growth Acceleration Framework",
            description: "Comprehensive framework fusing content engineering with rigorous distribution strategies.",
            overview: "A comprehensive framework that fuses high-impact content engineering with rigorous distribution strategies.",
            positioningText: "Driving revenue acceleration, capturing market dominance, and delivering quantifiable ROI.",
            order: 1,
        },
        create: {
            categoryId: growthSystems.id,
            title: "Growth Acceleration Framework",
            slug: "growth-acceleration-framework",
            description: "Comprehensive framework fusing content engineering with rigorous distribution strategies.",
            overview: "A comprehensive framework that fuses high-impact content engineering with rigorous distribution strategies.",
            positioningText: "Driving revenue acceleration, capturing market dominance, and delivering quantifiable ROI.",
            order: 1,
        },
    });

    console.log("Seed completed successfully.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
