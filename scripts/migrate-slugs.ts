import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as dotenv from "dotenv";

dotenv.config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

function slugify(text: string) {
    if (!text) return "unnamed";
    return text
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
}

async function main() {
    console.log("Starting slug migration...");

    // Optional: Clear slugs first in case of corrupt state from previous runs
    console.log("Clearing existing slugs...");
    await prisma.service.updateMany({ data: { slug: null } });
    await prisma.subCategory.updateMany({ data: { slug: null } });

    console.log("Migrating services...");
    const services = await prisma.service.findMany();
    const serviceSlugs = new Set<string>();

    for (const service of services) {
        let slug = slugify(service.title);
        let counter = 1;
        let finalSlug = slug;

        while (serviceSlugs.has(finalSlug)) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        serviceSlugs.add(finalSlug);
        console.log(`Updating service: "${service.title}" -> ${finalSlug}`);
        await prisma.service.update({
            where: { id: service.id },
            data: { slug: finalSlug },
        });
    }

    console.log("Migrating sub-categories...");
    const subCategories = await prisma.subCategory.findMany();
    const subCategorySlugs = new Set<string>();

    for (const subCategory of subCategories) {
        let slug = slugify(subCategory.title);
        let counter = 1;
        let finalSlug = slug;

        while (subCategorySlugs.has(finalSlug)) {
            finalSlug = `${slug}-${counter}`;
            counter++;
        }

        subCategorySlugs.add(finalSlug);
        console.log(`Updating sub-category: "${subCategory.title}" -> ${finalSlug}`);
        try {
            await prisma.subCategory.update({
                where: { id: subCategory.id },
                data: { slug: finalSlug },
            });
        } catch (error: any) {
            console.error(`Failed to update sub-category "${subCategory.title}" with slug "${finalSlug}":`, error.message);
            if (error.code === 'P2002') {
                console.error("Unique constraint violation on:", error.meta?.target);
            }
            throw error;
        }
    }

    console.log("Slug migration completed successfully!");
}

main()
    .catch((e) => {
        console.error("Migration failed:", e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
        await pool.end();
    });
