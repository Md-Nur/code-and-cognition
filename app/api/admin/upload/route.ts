import { NextRequest } from "next/server";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";
import { uploadToImgbb } from "@/lib/imgbb";

export const POST = withAuth(async (req: NextRequest, context: any, session: any) => {
    try {
        const formData = await req.formData();
        const file = formData.get("image") as File;

        if (!file) {
            return ApiResponse.error("No image file provided", 400);
        }

        const imageUrl = await uploadToImgbb(file);
        return ApiResponse.success({ imageUrl });
    } catch (error: any) {
        console.error("Upload Error:", error);
        return ApiResponse.error(error.message || "Failed to upload image", 500);
    }
}, Role.FOUNDER);
