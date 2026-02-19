import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { createNotification } from "@/lib/notifications";
import { bookingUpdateSchema, bookingCreateSchema } from "@/lib/validations/admin";

export const GET = withAuth(async () => {
    const bookings = await prisma.booking.findMany({
        include: { service: true, project: true },
        orderBy: { createdAt: "desc" },
    });
    return ApiResponse.success(bookings);
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = bookingCreateSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const booking = await prisma.booking.create({
            data: validation.data,
        });
        return ApiResponse.success(booking, 201);
    } catch (error) {
        console.error("Booking Create Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);

export const PATCH = withAuth(async (req) => {
    try {
        const { id, status } = await req.json();

        const validation = bookingUpdateSchema.safeParse({ status });
        if (!validation.success) {
            return ApiResponse.error("Invalid status");
        }

        const booking = await prisma.booking.update({
            where: { id },
            data: { status },
        });

        // Notify client if they have a user account
        const clientUser = await prisma.user.findUnique({
            where: { email: booking.clientEmail }
        });

        if (clientUser) {
            await createNotification({
                userId: clientUser.id,
                title: "Booking Status Updated",
                message: `Your booking status for "${booking.id}" has been updated to ${status}.`,
                type: "BOOKING_STATUS_CHANGE",
                link: `/services`, // Or a specific booking view if it exists
            });
        }

        return ApiResponse.success(booking);
    } catch (error) {
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
