import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

export const prisma =
    globalForPrisma.prisma ??
    (() => {
        try {
            console.log("Initializing PrismaClient...", {
                urlExists: !!process.env.DATABASE_URL,
                NODE_ENV: process.env.NODE_ENV
            });
            return new PrismaClient();
        } catch (e) {
            console.error("Prisma Init Failed:", e);
            throw e;
        }
    })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
