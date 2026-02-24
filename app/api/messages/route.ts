import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { createNotification } from "@/lib/notifications";
import { NotificationType } from "@prisma/client";
import { z } from "zod";
import { rateLimit, getIp } from "@/lib/rate-limit";

const messageSchema = z.object({
    content: z
        .string()
        .min(1, "Message cannot be empty")
        .max(5000, "Message cannot exceed 5000 characters")
        .trim(),
    receiverId: z.string().min(1, "Receiver ID is required"),
});

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
        take: 100, // Cap the number of messages returned
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

    // Rate limit: 30 messages per minute per user
    const { success } = rateLimit(`messages:${session.user.id}`, 30, 60 * 1000);
    if (!success) {
        return NextResponse.json(
            { error: "You are sending messages too quickly. Please slow down." },
            { status: 429 }
        );
    }

    try {
        const body = await req.json();
        const validation = messageSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.issues[0]?.message || "Invalid message data" },
                { status: 400 }
            );
        }

        const { content, receiverId } = validation.data;

        // Prevent messaging yourself
        if (receiverId === session.user.id) {
            return NextResponse.json(
                { error: "Cannot send a message to yourself" },
                { status: 400 }
            );
        }

        // Verify the receiver exists
        const receiver = await prisma.user.findUnique({
            where: { id: receiverId },
            select: { id: true },
        });
        if (!receiver) {
            return NextResponse.json({ error: "Receiver not found" }, { status: 404 });
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
            link: "/messages",
        });

        return NextResponse.json(message);
    } catch (error) {
        console.error("Error sending message:", error);
        return NextResponse.json({ error: "Failed to send message" }, { status: 500 });
    }
}
