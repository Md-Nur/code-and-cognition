"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function subscribeToNewsletter(formData: FormData) {
    const email = formData.get("email") as string;

    if (!email || !email.includes("@")) {
        return { error: "Please enter a valid business email." };
    }

    try {
        const existing = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existing) {
            return { error: "You are already subscribed to our newsletter." };
        }

        await prisma.subscriber.create({
            data: { email },
        });

        revalidatePath("/dashboard/subscribers");

        return { success: "Thank you for subscribing! You'll stay ahead of the curve." };
    } catch (error) {
        console.error("Subscription error:", error);
        return { error: "Something went wrong. Please try again later." };
    }
}

export async function getSubscribers() {
    try {
        const subscribers = await prisma.subscriber.findMany({
            orderBy: { createdAt: "desc" },
        });
        return { subscribers };
    } catch (error) {
        console.error("Error fetching subscribers:", error);
        return { error: "Failed to fetch subscribers." };
    }
}

export async function deleteSubscriber(id: string) {
    try {
        await prisma.subscriber.delete({
            where: { id },
        });
        revalidatePath("/dashboard/subscribers");
        return { success: "Subscriber deleted successfully." };
    } catch (error) {
        console.error("Error deleting subscriber:", error);
        return { error: "Failed to delete subscriber." };
    }
}
