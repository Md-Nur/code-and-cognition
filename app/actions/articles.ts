"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const articleSchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    content: z.string().min(1, "Content is required"),
    excerpt: z.string().optional(),
    category: z.string().min(1, "Category is required"),
    thumbnailUrl: z.string().optional(),
    isFeatured: z.boolean().default(false),
    publishedAt: z.date().optional(),
});

type ArticleInput = z.infer<typeof articleSchema>;

export async function createArticle(data: ArticleInput) {
    try {
        const validatedData = articleSchema.parse(data);

        // Check for unique slug
        const existing = await prisma.article.findUnique({
            where: { slug: validatedData.slug },
        });

        if (existing) {
            return { success: false, error: "An article with this slug already exists." };
        }

        const article = await prisma.article.create({
            data: validatedData,
        });

        revalidatePath("/dashboard/insights");
        revalidatePath("/insights");
        revalidatePath("/");

        return { success: true, data: article };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: error.message || "Failed to create article" };
    }
}

export async function updateArticle(id: string, data: Partial<ArticleInput>) {
    try {
        const updateSchema = articleSchema.partial();
        const validatedData = updateSchema.parse(data);

        if (validatedData.slug) {
            const existing = await prisma.article.findUnique({
                where: { slug: validatedData.slug },
            });
            if (existing && existing.id !== id) {
                return { success: false, error: "An article with this slug already exists." };
            }
        }

        const article = await prisma.article.update({
            where: { id },
            data: validatedData,
        });

        revalidatePath("/dashboard/insights");
        revalidatePath("/insights");
        revalidatePath(`/insights/${article.slug}`);
        revalidatePath("/");

        return { success: true, data: article };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: error.message || "Failed to update article" };
    }
}

export async function deleteArticle(id: string) {
    try {
        await prisma.article.delete({
            where: { id },
        });

        revalidatePath("/dashboard/insights");
        revalidatePath("/insights");
        revalidatePath("/");

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete article" };
    }
}
