import { sendMail } from "./mailer";
import {
    newInsightEmailHtml,
    qualifiedLeadEmailHtml,
    proposalSentEmailHtml,
    closedWonEmailHtml
} from "@/components/emails/AutomatedEmails";
import { prisma } from "./prisma";

export async function triggerNewInsightEmail(
    title: string,
    excerpt: string,
    slug: string
) {
    try {
        const subscribers = await prisma.subscriber.findMany({
            select: { email: true }
        });

        if (subscribers.length === 0) return;

        const subject = `New Insight: ${title}`;
        const html = newInsightEmailHtml(title, excerpt, slug);

        // Send emails in batches to avoid overwhelming the SMTP server
        const BATCH_SIZE = 10;
        for (let i = 0; i < subscribers.length; i += BATCH_SIZE) {
            const batch = subscribers.slice(i, i + BATCH_SIZE);
            const emailPromises = batch.map(sub =>
                sendMail(sub.email, subject, html)
            );
            await Promise.all(emailPromises);

            // Subtle delay between batches if list is large
            if (subscribers.length > BATCH_SIZE && i + BATCH_SIZE < subscribers.length) {
                await new Promise(resolve => setTimeout(resolve, 500));
            }
        }

        console.log(`[AUTOMATION] New insight notification sent to ${subscribers.length} subscribers.`);
    } catch (error) {
        console.error("[AUTOMATION] Failed to send new insight notifications:", error);
    }
}

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
