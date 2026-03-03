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

    await prisma.service.upsert({
        where: { slug: "enterprise-digital-ecosystems" },
        update: {
            title: "Enterprise Digital Ecosystems",
            description: "Scalable, enterprise-grade digital ecosystems designed as the operational foundation.",
            overview: "We architect and deploy scalable, enterprise-grade digital ecosystems designed as the operational foundation for modern businesses.",
            positioningText: "Focus on operational resilience, infinite scalability, and cloud-native modernization.",
            order: 1,
        },
        create: {
            title: "Enterprise Digital Ecosystems",
            slug: "enterprise-digital-ecosystems",
            description: "Scalable, enterprise-grade digital ecosystems designed as the operational foundation.",
            overview: "We architect and deploy scalable, enterprise-grade digital ecosystems designed as the operational foundation for modern businesses.",
            positioningText: "Focus on operational resilience, infinite scalability, and cloud-native modernization.",
            order: 1,
        },
    });

    await prisma.service.upsert({
        where: { slug: "strategic-ai-integration" },
        update: {
            title: "Strategic AI Integration",
            description: "Advanced machine learning and algorithmic modeling to synthesize data into actionable strategy.",
            overview: "We leverage advanced machine learning and algorithmic modeling to synthesize data into actionable strategy.",
            positioningText: "Enhancing strategic precision, driving efficiency at scale, and securing predictive advantages.",
            order: 2,
        },
        create: {
            title: "Strategic AI Integration",
            slug: "strategic-ai-integration",
            description: "Advanced machine learning and algorithmic modeling to synthesize data into actionable strategy.",
            overview: "We leverage advanced machine learning and algorithmic modeling to synthesize data into actionable strategy.",
            positioningText: "Enhancing strategic precision, driving efficiency at scale, and securing predictive advantages.",
            order: 2,
        },
    });

    await prisma.service.upsert({
        where: { slug: "growth-acceleration-framework" },
        update: {
            title: "Growth Acceleration Framework",
            description: "Comprehensive framework fusing content engineering with rigorous distribution strategies.",
            overview: "A comprehensive framework that fuses high-impact content engineering with rigorous distribution strategies.",
            positioningText: "Driving revenue acceleration, capturing market dominance, and delivering quantifiable ROI.",
            order: 3,
        },
        create: {
            title: "Growth Acceleration Framework",
            slug: "growth-acceleration-framework",
            description: "Comprehensive framework fusing content engineering with rigorous distribution strategies.",
            overview: "A comprehensive framework that fuses high-impact content engineering with rigorous distribution strategies.",
            positioningText: "Driving revenue acceleration, capturing market dominance, and delivering quantifiable ROI.",
            order: 3,
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
