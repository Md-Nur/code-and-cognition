import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const session = await auth();
        if (!session?.user) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        // Must await params in Next.js 15
        const { id } = await params;

        const notification = await prisma.notification.findUnique({
            where: {
                id,
            }
        });

        if (!notification) {
            return new NextResponse("Not Found", { status: 404 });
        }

        // Ensure user can only mark their own notifications
        if (notification.userId !== session.user.id) {
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const updatedNotification = await prisma.notification.update({
            where: {
                id,
            },
            data: {
                isRead: true
            }
        });

        return NextResponse.json(updatedNotification);
    } catch (error) {
        console.error("[NOTIFICATION_PATCH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}
