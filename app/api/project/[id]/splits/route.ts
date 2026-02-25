import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withProjectAuth } from "@/lib/api-handler";
import { Role } from "@prisma/client";

export const PUT = withProjectAuth(async (req, { params, project }, session) => {
    try {
        // Only Founders can change split ratios
        if (session.user.role !== Role.FOUNDER) {
            return NextResponse.json({ error: "Forbidden: Only founders can change split ratios" }, { status: 403 });
        }

        const { companyFundRatio, finderFeeRatio } = await req.json();

        if (typeof companyFundRatio !== "number" || typeof finderFeeRatio !== "number") {
            return NextResponse.json({ error: "Invalid ratio values" }, { status: 400 });
        }

        if (companyFundRatio < 0 || finderFeeRatio < 0 || (companyFundRatio + finderFeeRatio) > 1) {
            return NextResponse.json({ error: "Ratios must be between 0 and 1, and sum to <= 1" }, { status: 400 });
        }

        const updatedProject = await prisma.project.update({
            where: { id: project.id },
            data: {
                companyFundRatio,
                finderFeeRatio,
            }
        });

        // Log this important financial change
        await prisma.activityLog.create({
            data: {
                projectId: project.id,
                userId: session.user.id,
                action: `updated split ratios to ${companyFundRatio * 100}% Company Fund, ${finderFeeRatio * 100}% Finder Fee, ${(1 - companyFundRatio - finderFeeRatio) * 100}% Execution Pool.`,
            }
        });

        return NextResponse.json(updatedProject);
    } catch (e: any) {
        return NextResponse.json({ error: e.message }, { status: 500 });
    }
}, { allowClient: false });
