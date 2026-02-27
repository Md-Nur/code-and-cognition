import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const userCount = await prisma.user.count();
        return NextResponse.json({ setupRequired: userCount === 0 });
    } catch (error) {
        return NextResponse.json({ error: "Storage error" }, { status: 500 });
    }
}
