import { prisma } from "./prisma";
import { NotificationType } from "@prisma/client";

export async function createNotification({
    userId,
    title,
    message,
    type,
    link,
}: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
}) {
    try {
        const notification = await prisma.notification.create({
            data: {
                userId,
                title,
                message,
                type,
                link,
            },
        });
        return notification;
    } catch (error) {
        console.error("Error creating notification:", error);
        return null;
    }
}
