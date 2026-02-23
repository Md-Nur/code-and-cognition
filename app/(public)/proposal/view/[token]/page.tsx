import { notFound } from "next/navigation";
import { getProposalByToken } from "@/app/actions/proposals";
import PublicProposalReview from "@/app/components/public/PublicProposalReview";

interface PageProps {
    params: Promise<{ token: string }>;
}

export default async function PublicProposalPage({ params }: PageProps) {
    const { token } = await params;

    if (!token) notFound();

    const proposal = await getProposalByToken(token);

    if (!proposal) {
        notFound();
    }

    return (
        <div className="container mx-auto px-4 py-12 my-12">
            <PublicProposalReview proposal={proposal} />
        </div>
    );
}
