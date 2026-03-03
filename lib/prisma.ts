// Last updated: 2026-03-03T01:17:00Z - Forcing Prisma Client refresh
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const globalForPrisma = globalThis as unknown as {
    prisma: PrismaClient | undefined;
};

// Force a re-instantiation to pick up new models in dev
if (process.env.NODE_ENV !== "production") {
    globalForPrisma.prisma = undefined;
}

export const prisma =
    globalForPrisma.prisma ??
    (() => {
        const pool = new Pool({
            connectionString: process.env.DATABASE_URL,
        });
        const adapter = new PrismaPg(pool);
        const client = new PrismaClient({ adapter });
        return client;
    })();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
