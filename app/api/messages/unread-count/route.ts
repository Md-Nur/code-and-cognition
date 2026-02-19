import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const count = await prisma.message.count({
            where: {
                receiverId: session.user.id,
                isRead: false,
            },
        });

        return NextResponse.json({ count });
    } catch (error) {
        console.error("Error fetching unread messages count:", error);
        return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
    }
}
