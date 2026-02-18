import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import bcrypt from "bcryptjs";

export const POST = withAuth(async (req: Request, context: any, session: any) => {
    try {
        const { currentPassword, newPassword } = await req.json();

        if (!currentPassword || !newPassword) {
            return ApiResponse.error("Current and new passwords are required");
        }

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return ApiResponse.error("User not found", 404);
        }

        const isValid = await bcrypt.compare(currentPassword, user.passwordHash);
        if (!isValid) {
            return ApiResponse.error("Incorrect current password", 400);
        }

        const newHash = await bcrypt.hash(newPassword, 10);
        await prisma.user.update({
            where: { id: user.id },
            data: { passwordHash: newHash },
        });

        return ApiResponse.success({ message: "Password updated successfully" });
    } catch (error) {
        console.error("Password Update Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
});
