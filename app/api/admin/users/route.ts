import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import * as bcrypt from 'bcryptjs';
import { Role } from "@prisma/client";
import { userSchema } from "@/lib/validations/admin";

export const GET = withAuth(async () => {
    const users = await prisma.user.findMany({
        orderBy: { createdAt: "desc" },
        select: {
            id: true,
            name: true,
            email: true,
            role: true,
            isCFO: true,
            createdAt: true,
            ledgerBalance: true,
        },
    });
    return ApiResponse.success(users);
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();

        // Handle CFO Designation
        if (body.action === "SET_CFO") {
            const { userId } = body;
            const targetUser = await prisma.user.findUnique({ where: { id: userId } });
            if (!targetUser || targetUser.role !== Role.FOUNDER) {
                return ApiResponse.error("Only a Founder can be designated as CFO", 400);
            }

            await prisma.$transaction([
                prisma.user.updateMany({
                    where: { isCFO: true },
                    data: { isCFO: false }
                }),
                prisma.user.update({
                    where: { id: userId },
                    data: { isCFO: true }
                })
            ]);
            return ApiResponse.success({ message: "CFO designated successfully" });
        }

        const validation = userSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const { name, email, password, role } = validation.data;
        const passwordHash = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                passwordHash,
                role,
            },
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                isCFO: true,
            },
        });

        return ApiResponse.success(user, 201);
    } catch (error) {
        return ApiResponse.error("Internal Server Error or Email Exists", 500);
    }
}, Role.FOUNDER);
