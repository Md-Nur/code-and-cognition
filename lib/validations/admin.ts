import { z } from "zod";
import { Role, Currency } from "@prisma/client";

export const userSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    role: z.nativeEnum(Role).default(Role.CONTRACTOR),
});

export const paymentSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    amount: z.number().positive("Amount must be positive"),
    currency: z.nativeEnum(Currency),
    note: z.string().optional(),
});

export const bookingUpdateSchema = z.object({
    status: z.string().min(1),
});

export const bookingCreateSchema = z.object({
    clientName: z.string().min(1),
    clientEmail: z.string().email(),
    clientPhone: z.string().optional().nullable(),
    serviceId: z.string().min(1),
    budgetBDT: z.number().optional().nullable(),
    budgetUSD: z.number().optional().nullable(),
    message: z.string().optional().nullable(),
});

export const projectSchema = z.object({
    title: z.string().min(1),
    bookingId: z.string().optional().nullable(),
    finderId: z.string().min(1),
    status: z.enum(["ACTIVE", "COMPLETED", "CANCELLED"]).optional(),
});

export const serviceSchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    description: z.string().min(1),
    thumbnailUrl: z.string().optional().nullable(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const subcategorySchema = z.object({
    title: z.string().min(1),
    slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    serviceId: z.string().min(1),
    description: z.string().optional().nullable(),
    imageUrl: z.string().optional().nullable(),
    basePriceBDT: z.number().optional().nullable(),
    basePriceUSD: z.number().optional().nullable(),
    mediumPriceBDT: z.number().optional().nullable(),
    mediumPriceUSD: z.number().optional().nullable(),
    proPriceBDT: z.number().optional().nullable(),
    proPriceUSD: z.number().optional().nullable(),
    mediumDescription: z.string().optional().nullable(),
    proDescription: z.string().optional().nullable(),
});

export const testimonialSchema = z.object({
    name: z.string().min(1),
    role: z.string().optional().nullable(),
    company: z.string().optional().nullable(),
    content: z.string().min(1),
    avatarUrl: z.string().optional().nullable(),
    rating: z.number().min(1).max(5).default(5),
    order: z.number().default(0),
});

export const clientSchema = z.object({
    name: z.string().min(1),
    logoUrl: z.string().min(1),
    website: z.string().optional().nullable(),
    order: z.number().default(0),
});
