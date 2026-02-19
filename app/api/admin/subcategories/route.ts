import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { subcategorySchema } from "@/lib/validations/admin";

export const POST = withAuth(async (req) => {
    try {
        const body = await req.json();
        const validation = subcategorySchema.safeParse(body);

        if (!validation.success) {
            return ApiResponse.error(JSON.stringify(validation.error.format()));
        }

        const { title, serviceId, description, imageUrl, basePriceBDT, basePriceUSD, mediumPriceBDT, mediumPriceUSD, proPriceBDT, proPriceUSD } = validation.data;

        const subCategory = await prisma.subCategory.create({
            data: { title, serviceId, description, imageUrl, basePriceBDT, basePriceUSD, mediumPriceBDT, mediumPriceUSD, proPriceBDT, proPriceUSD },
        });

        return ApiResponse.success(subCategory, 201);
    } catch (error) {
        console.error("Subcategory Create Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
