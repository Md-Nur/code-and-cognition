import { prisma } from "@/lib/prisma";
import { withAuth, ApiResponse } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const GET = withAuth(async () => {
    try {
        const expenses = await prisma.expense.findMany({
            orderBy: { date: "desc" }
        });
        return ApiResponse.success(expenses);
    } catch (error) {
        console.error("Fetch Expenses Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);

export const POST = withAuth(async (req: Request) => {
    try {
        const body = await req.json();
        const { title, amountBDT, amountUSD, category, date, note } = body;

        if (!title || amountBDT === undefined) {
            return ApiResponse.error("Title and BDT amount are required", 400);
        }

        const expense = await prisma.expense.create({
            data: {
                title,
                amountBDT: parseFloat(amountBDT),
                amountUSD: amountUSD ? parseFloat(amountUSD) : null,
                category,
                date: date ? new Date(date) : new Date(),
                note
            }
        });

        return ApiResponse.success(expense, 201);
    } catch (error) {
        console.error("Create Expense Error:", error);
        return ApiResponse.error("Internal Server Error", 500);
    }
}, Role.FOUNDER);
