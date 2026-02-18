import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    (() => {
        try {
            console.log("Initializing PrismaClient with Driver Adapter...", {
                urlExists: !!process.env.DATABASE_URL,
                NODE_ENV: process.env.NODE_ENV
            });
            const pool = new Pool({ connectionString: process.env.DATABASE_URL });
            const adapter = new PrismaPg(pool);
            return new PrismaClient({ adapter });
        } catch (e) {
            console.error("Prisma Init Failed:", e);
            throw e;
        }
    })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
