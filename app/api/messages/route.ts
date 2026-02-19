import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { NotificationType } from "@prisma/client";

export async function GET() {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const messages = await prisma.message.findMany({
        where: {
            OR: [
                { senderId: session.user.id },
                { receiverId: session.user.id },
            ],
        },
        orderBy: {
            createdAt: "desc",
        },
        include: {
            sender: {
                select: { id: true, name: true, email: true },
            },
            receiver: {
                select: { id: true, name: true, email: true },
            },
        },
    });

    return NextResponse.json(messages);
}

export async function POST(req: Request) {
    const session = await auth();
    if (!session) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    try {
        const { content, receiverId } = await req.json();

        if (!content || !receiverId) {
            return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
        }

        const message = await prisma.message.create({
            data: {
                content,
                senderId: session.user.id,
                receiverId,
            },
            include: {
                sender: {
                    select: { id: true, name: true },
                },
            },
        });

        // Trigger notification for the receiver
        await createNotification({
            userId: receiverId,
            title: "New Message",
            message: `You have a new message from ${message.sender.name}`,
            type: NotificationType.MESSAGE_NEW,
            link: "/messages", // Assuming this will be the route
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
