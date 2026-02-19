import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const PATCH = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        const body = await req.json();
        const { title, amountBDT, amountUSD, category, date, note } = body;

        const expense = await prisma.expense.update({
            where: { id },
            data: {
                ...(title && { title }),
                ...(amountBDT !== undefined && { amountBDT: parseFloat(amountBDT) }),
                ...(amountUSD !== undefined && { amountUSD: amountUSD ? parseFloat(amountUSD) : null }),
                ...(category !== undefined && { category }),
                ...(date && { date: new Date(date) }),
                ...(note !== undefined && { note })
            }
        });

        return ApiResponse.success(expense);
    } catch (error) {
        console.error("Update Expense Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);

export const DELETE = withAuth(async (req: Request, { params }: { params: Promise<{ id: string }> }) => {
    try {
        const { id } = await params;
        await prisma.expense.delete({
            where: { id }
        });
        return ApiResponse.success({ message: "Expense deleted successfully" });
    } catch (error) {
        console.error("Delete Expense Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
