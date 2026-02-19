import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { senderId } = await req.json();

        if (!senderId) {
            return NextResponse.json({ error: "Sender ID is required" }, { status: 400 });
        }

        await prisma.message.updateMany({
            where: {
                senderId: senderId,
                receiverId: session.user.id,
                isRead: false,
            },
            data: {
                isRead: true,
            },
        });

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Error marking messages as read:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
