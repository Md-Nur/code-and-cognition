export const qualifiedLeadEmailHtml = (clientName: string, serviceTitle: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #000;">Hello ${clientName},</h2>
        <p>We've reviewed your request for <strong>${serviceTitle}</strong> and believe it fits our expertise perfectly.</p>
        <p>One of our lead strategists will reach out shortly to schedule a deep-dive call.</p>
        <p>Best regards,<br>The Code & Cognition Team</p>
    </div>
`;

export const proposalSentEmailHtml = (clientName: string, serviceTitle: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #000;">Hi ${clientName},</h2>
        <p>Your custom proposal for <strong>${serviceTitle}</strong> is now ready for review.</p>
        <p>You can view and approve it directly through your dashboard.</p>
        <p>Best regards,<br>The Code & Cognition Team</p>
    </div>
`;

export const closedWonEmailHtml = (clientName: string, serviceTitle: string) => `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
        <h2 style="color: #000;">Welcome aboard, ${clientName}!</h2>
        <p>We're thrilled to officially start working on <strong>${serviceTitle}</strong>.</p>
        <p>Our team is currently setting up your project workspace. You'll receive another update once everything is ready.</p>
        <p>Best regards,<br>The Code & Cognition Team</p>
    </div>
`;
