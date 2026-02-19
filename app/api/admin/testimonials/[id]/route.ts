import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { testimonialSchema } from "@/lib/validations/admin";

export const PUT = withAuth(async (req, { params }) => {
    try {
        const { id } = await params;
        const body = await req.json();
        const validation = testimonialSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const testimonial = await prisma.testimonial.update({
            where: { id },
            data: validation.data as any,
        });
        return ApiResponse.success(testimonial);
    } catch (error) {
        console.error("Testimonial Update Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);

export const DELETE = withAuth(async (req, { params }) => {
    try {
        const { id } = await params;
        await prisma.testimonial.delete({
            where: { id },
        });
        return ApiResponse.success(null, 204);
    } catch (error) {
        console.error("Testimonial Delete Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
