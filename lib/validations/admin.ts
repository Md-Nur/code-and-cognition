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
    description: z.string().min(1),
    basePriceBDT: z.number().min(0),
    basePriceUSD: z.number().min(0),
    mediumPriceBDT: z.number().min(0).default(0),
    mediumPriceUSD: z.number().min(0).default(0),
    proPriceBDT: z.number().min(0).default(0),
    proPriceUSD: z.number().min(0).default(0),
    status: z.enum(["ACTIVE", "INACTIVE"]).optional(),
});

export const subcategorySchema = z.object({
    title: z.string().min(1),
    serviceId: z.string().min(1),
});
