import { withEmailLayout } from "./EmailLayout";

export const qualifiedLeadEmailHtml = (clientName: string, serviceTitle: string) => {
    const content = `
        <p>Hello ${clientName},</p>
        <p>Excellent news: We've reviewed your request for <strong>${serviceTitle}</strong> and believe it fits our expertise perfectly.</p>
        
        <div class="highlight-box">
            Our founding team is currently preparing a strategic overview for our upcoming discussion.
        </div>

        <p>One of our lead strategists will reach out shortly to schedule a deep-dive call and discuss how we can help you achieve your objectives.</p>
        
        <p>In the meantime, feel free to visit our website to explore some of our latest case studies and digital solutions.</p>
    `;
    return withEmailLayout("Consultation Qualified", content);
};

export const proposalSentEmailHtml = (clientName: string, serviceTitle: string) => {
    const content = `
        <p>Hi ${clientName},</p>
        <p>Your custom project proposal for <strong>${serviceTitle}</strong> is now ready for your review.</p>
        
        <p>We've outlined a comprehensive roadmap designed to address your core challenges and drive significant growth for your business.</p>

        <div class="highlight-box">
            You can view, download, and approve the proposal directly through your secure client dashboard.
        </div>

        <div style="text-align: center;">
            <a href="https://www.codencognition.com/dashboard/proposals" class="button">View Your Proposal</a>
        </div>

        <p>We're excited about the possibility of working together on this project.</p>
    `;
    return withEmailLayout("Project Proposal Ready", content);
};

export const closedWonEmailHtml = (clientName: string, serviceTitle: string) => {
    const content = `
        <p>Welcome aboard, ${clientName}!</p>
        <p>We're thrilled to officially begin our partnership on <strong>${serviceTitle}</strong>. It's an honor to support your business's digital evolution.</p>
        
        <div class="highlight-box">
            <strong>What's Happening Now:</strong> Our engineering and design teams are currently provisioning your dedicated project workspace and internal communication channels.
        </div>

        <p>You'll receive a follow-up email within the next 24 hours with your workspace access credentials and a scheduled date for our project kickoff meeting.</p>
        
        <p>We're looking forward to building something extraordinary together.</p>
    `;
    return withEmailLayout("Welcome to Code & Cognition", content);
};
