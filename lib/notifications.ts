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

export async function createNotificationsBatch(notifications: {
    userId: string;
    title: string;
    message: string;
    type: NotificationType;
    link?: string;
}[]) {
    if (notifications.length === 0) return [];

    try {
        const result = await prisma.notification.createMany({
            data: notifications,
        });
        return result;
    } catch (error) {
        console.error("Error creating notifications batch:", error);
        return null;
    }
}
