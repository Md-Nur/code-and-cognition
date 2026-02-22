import { sendMail } from "./mailer";
import {
    qualifiedLeadEmailHtml,
    proposalSentEmailHtml,
    closedWonEmailHtml
} from "@/app/components/emails/AutomatedEmails";

export async function triggerStatusEmail(
    status: string,
    clientEmail: string,
    clientName: string,
    serviceTitle: string
) {
    let subject = "";
    let html = "";

    switch (status) {
        case "QUALIFIED":
            subject = "Great news: Your consultation request is qualified!";
            html = qualifiedLeadEmailHtml(clientName, serviceTitle);
            break;
        case "PROPOSAL_SENT":
            subject = "Project Proposal Ready - Code & Cognition";
            html = proposalSentEmailHtml(clientName, serviceTitle);
            break;
        case "CLOSED_WON":
            subject = "Welcome to Code & Cognition - Getting Started";
            html = closedWonEmailHtml(clientName, serviceTitle);
            break;
        default:
            return; // No automated email for other statuses
    }

    try {
        await sendMail(clientEmail, subject, html);
        console.log(`Automated ${status} email sent to ${clientEmail}`);
    } catch (error) {
        console.error(`Failed to send automated ${status} email:`, error);
    }
}
