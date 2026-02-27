import { prisma } from "./prisma";
import crypto from "crypto";

export function getFingerprint(userAgent: string | undefined, ip: string): string {
    const data = `${userAgent || "unknown"}-${ip}`;
    return crypto.createHash("sha256").update(data).digest("hex").substring(0, 16);
}

export async function isSuspiciousActivity(ip: string): Promise<boolean> {
    const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000);

    const failureCount = await prisma.securityLog.count({
        where: {
            ip,
            status: { in: ["FAILURE", "FAIL_NOT_FOUND", "INVALID_TOKEN", "EXPIRED"] },
            createdAt: { gte: fiveMinutesAgo },
        }
    });

    return failureCount >= 3;
}

export async function getMagicLinkCooldown(email: string): Promise<number> {
    const oneMinuteAgo = new Date(Date.now() - 60 * 1000);

    const lastRequest = await prisma.securityLog.findFirst({
        where: {
            email,
            action: "MAGIC_LINK_REQUEST",
            createdAt: { gte: oneMinuteAgo },
        },
        orderBy: { createdAt: "desc" }
    });

    if (!lastRequest) return 0;

    const elapsed = Date.now() - lastRequest.createdAt.getTime();
    return Math.max(0, 60 - Math.floor(elapsed / 1000));
}
