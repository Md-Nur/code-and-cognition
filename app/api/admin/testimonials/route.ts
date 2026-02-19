import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { testimonialSchema } from "@/lib/validations/admin";

export const GET = withAuth(async () => {
    const testimonials = await prisma.testimonial.findMany({
        orderBy: { order: "asc" },
    });
    return ApiResponse.success(testimonials);
}, Role.FOUNDER);

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = testimonialSchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const testimonial = await prisma.testimonial.create({
            data: validation.data as any,
        });
        return ApiResponse.success(testimonial, 201);
    } catch (error) {
        console.error("Testimonial Create Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
