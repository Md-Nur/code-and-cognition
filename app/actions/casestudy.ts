"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

const caseStudySchema = z.object({
    title: z.string().min(1, "Title is required"),
    slug: z.string().min(1, "Slug is required").regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    industry: z.string().min(1, "Industry is required"),
    clientName: z.string().optional(),
    summary: z.string().min(1, "Summary is required"),
    challenge: z.string().min(1, "Challenge is required"),
    approach: z.string().min(1, "Approach is required"),
    solution: z.string().min(1, "Solution is required"),
    results: z.string().min(1, "Results is required"),
    highlightMetric: z.string().optional(),
    techStack: z.array(z.string()).min(1, "At least one tech stack is required"),
    coverImage: z.string().optional(),
    architectureImage: z.string().optional(),
    status: z.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
    publishDate: z.date().optional(),
    isFeatured: z.boolean().default(false),
    seoTitle: z.string().optional(),
    seoDescription: z.string().optional(),
});

type CaseStudyInput = z.infer<typeof caseStudySchema>;

export async function createCaseStudy(data: CaseStudyInput) {
    try {
        const validatedData = caseStudySchema.parse(data);

        // Check for unique slug
        const existing = await prisma.caseStudy.findUnique({
            where: { slug: validatedData.slug },
        });

        if (existing) {
            return { success: false, error: "A case study with this slug already exists." };
        }

        const caseStudy = await prisma.caseStudy.create({
            data: validatedData,
        });

        revalidatePath("/dashboard/case-studies");
        revalidatePath("/case-studies");

        return { success: true, data: caseStudy };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: error.message || "Failed to create case study" };
    }
}

export async function updateCaseStudy(id: string, data: Partial<CaseStudyInput>) {
    try {
        // We only validate the fields that are present
        const updateSchema = caseStudySchema.partial();
        const validatedData = updateSchema.parse(data);

        if (validatedData.slug) {
            const existing = await prisma.caseStudy.findUnique({
                where: { slug: validatedData.slug },
            });
            if (existing && existing.id !== id) {
                return { success: false, error: "A case study with this slug already exists." };
            }
        }

        const caseStudy = await prisma.caseStudy.update({
            where: { id },
            data: validatedData,
        });

        revalidatePath("/dashboard/case-studies");
        revalidatePath("/case-studies");
        revalidatePath(`/case-studies/${caseStudy.slug}`);

        return { success: true, data: caseStudy };
    } catch (error: any) {
        if (error instanceof z.ZodError) {
            return { success: false, error: error.issues[0].message };
        }
        return { success: false, error: error.message || "Failed to update case study" };
    }
}

export async function deleteCaseStudy(id: string) {
    try {
        await prisma.caseStudy.delete({
            where: { id },
        });

        revalidatePath("/dashboard/case-studies");
        revalidatePath("/case-studies");

        return { success: true };
    } catch (error: any) {
        return { success: false, error: error.message || "Failed to delete case study" };
    }
}
