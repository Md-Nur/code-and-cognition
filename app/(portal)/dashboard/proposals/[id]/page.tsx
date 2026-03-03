import { auth } from "@/lib/auth";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ProposalReview from "./_components/ProposalReview";
import { Role } from "@prisma/client";

interface PageProps {
    params: Promise<{ id: string }>;
}

export default async function ProposalDetailPage({ params }: PageProps) {
    const session = await auth();
    if (!session?.user) redirect("/login");

    const { id } = await params;

    const proposal = await prisma.proposal.findUnique({
        where: { id },
        include: {
            booking: {
                include: { service: true }
            }
        }
    });

    if (!proposal) notFound();

    // Access Control: Client can only see their own proposal
    if (session.user.role === Role.CLIENT) {
        if (proposal.booking?.clientEmail !== session.user.email) {
            redirect("/dashboard");
        }
    }

    return (
        <div className="py-8">
            <ProposalReview proposal={proposal} />
        </div>
    );
}
