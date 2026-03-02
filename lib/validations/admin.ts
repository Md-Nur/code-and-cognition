import { z } from "zod";
import { Role, Currency } from "@prisma/client";

export const userSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    email: z.string().email("Invalid email address").max(200, "Email too long"),
    password: z.string().min(6, "Password must be at least 6 characters").max(128, "Password too long"),
    role: z.nativeEnum(Role).default(Role.CONTRACTOR),
});

export const paymentSchema = z.object({
    projectId: z.string().min(1, "Project ID is required"),
    amount: z.number().positive("Amount must be positive").max(10_000_000, "Amount exceeds limit"),
    currency: z.nativeEnum(Currency),
    note: z.string().max(1000, "Note too long").optional(),
});

export const bookingUpdateSchema = z.object({
    status: z.enum(["NEW", "QUALIFIED", "PROPOSAL_SENT", "CLOSED_WON", "CLOSED_LOST"]),
});



export const projectSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    bookingId: z.string().optional().nullable(),
    finderId: z.string().min(1, "Finder ID is required"),
    status: z.enum(["ACTIVE", "COMPLETED", "DELIVERED", "CANCELLED"]).optional(),
});

export const serviceSchema = z.object({
    title: z.string().min(1, "Title is required").max(200, "Title too long"),
    slug: z.string().min(1).max(100).regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase letters, numbers, and hyphens"),
    description: z.string().min(1, "Description is required").max(5000, "Description too long"),
    thumbnailUrl: z.string().url("Invalid URL").optional().nullable(),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const testimonialSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    role: z.string().max(100, "Role too long").optional().nullable(),
    company: z.string().max(100, "Company too long").optional().nullable(),
    content: z.string().min(1, "Content is required").max(2000, "Content too long"),
    avatarUrl: z.string().url("Invalid URL").optional().nullable(),
    rating: z.number().int().min(1).max(5).default(5),
    order: z.number().int().nonnegative().default(0),
});

export const clientSchema = z.object({
    name: z.string().min(1, "Name is required").max(100, "Name too long"),
    logoUrl: z.string().min(1, "Logo URL is required").max(500, "URL too long"),
    website: z.string().url("Invalid URL").max(500, "URL too long").optional().nullable(),
    order: z.number().int().nonnegative().default(0),
});
