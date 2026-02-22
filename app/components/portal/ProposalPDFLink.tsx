"use client";

import dynamic from "next/dynamic";
import { Download } from "lucide-react";
import { ProposalPDF } from "@/app/components/pdf/ProposalPDF";

// Dynamically import PDFDownloadLink to avoid SSR issues
const PDFDownloadLink = dynamic(
    () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
    { ssr: false, loading: () => <span className="opacity-50">Loading...</span> }
);

interface ProposalPDFLinkProps {
    proposal: any;
    booking: any;
    label?: string;
}

export default function ProposalPDFLink({ proposal, booking, label = "Download PDF" }: ProposalPDFLinkProps) {
    const fileName = `Proposal_${booking.clientName.replace(/\s+/g, '_')}_${formatDate(new Date())}.pdf`;

    function formatDate(date: Date) {
        return date.toISOString().split('T')[0];
    }

    return (
        <PDFDownloadLink
            document={<ProposalPDF proposal={proposal} booking={booking} />}
            fileName={fileName}
            className="flex items-center gap-2 text-agency-accent hover:underline"
        >
            {({ loading }) => (
                <>
                    <Download className={`w-4 h-4 ${loading ? 'animate-pulse' : ''}`} />
                    <span className="text-xs font-bold uppercase tracking-widest">{loading ? "Preparing..." : label}</span>
                </>
            )}
        </PDFDownloadLink>
    );
}
