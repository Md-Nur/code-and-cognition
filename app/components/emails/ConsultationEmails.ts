import { withEmailLayout } from "./EmailLayout";

export const clientConfirmationEmailHtml = (clientName: string) => {
    const content = `
        <p>Hi ${clientName},</p>
        <p>We've successfully received your strategy consultation request. Our founding team is already reviewing your core challenges to ensure we provide maximum value during our deep-dive session.</p>
        
        <div class="highlight-box">
            <strong>Next Action Required:</strong> To finalize our session, please select a convenient time on our executive calendar. This ensures your slot is secured and our team can prepare a tailored agenda.
        </div>

        <div style="text-align: center;">
            <a href="https://calendly.com/codencognition-bd/cosultation-of-code-cognition" class="button">Secure Your Consultation Slot</a>
        </div>

        <h3>Our Strategic Process:</h3>
        <ol style="padding-left: 20px;">
            <li style="margin-bottom: 12px;"><strong>Calendar Confirmation:</strong> You select a time that works for your schedule.</li>
            <li style="margin-bottom: 12px;"><strong>Vertical Alignment:</strong> Our team reviews your business context and industry.</li>
            <li style="margin-bottom: 12px;"><strong>Custom Agenda:</strong> We send you a tailored meeting agenda to maximize efficiency.</li>
        </ol>

        <p>We look forward to discussing your digital objectives and how we can best support your growth.</p>
    `;
    return withEmailLayout("Consultation Request Received", content);
};

export const founderNotificationEmailHtml = (
    clientName: string,
    email: string,
    company: string,
    industry: string,
    revenue: string,
    budget: string,
    timeline: string,
    problem: string
) => {
    const content = `
        <div style="background: #e0f2fe; color: #0284c7; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; display: inline-block; margin-bottom: 20px;">
            NEW QUALIFICATION FORM
        </div>
        
        <h3>Contact Details</h3>
        <p style="margin-bottom: 4px;"><strong>Name:</strong> ${clientName}</p>
        <p style="margin-bottom: 4px;"><strong>Email:</strong> <a href="mailto:${email}">${email}</a></p>
        <p style="margin-bottom: 4px;"><strong>Company:</strong> ${company}</p>
        <p style="margin-bottom: 20px;"><strong>Industry:</strong> ${industry}</p>

        <h3>Financials & Timeline</h3>
        <p style="margin-bottom: 4px;"><strong>Revenue:</strong> ${revenue}</p>
        <p style="margin-bottom: 4px;"><strong>Budget:</strong> ${budget}</p>
        <p style="margin-bottom: 20px;"><strong>Timeline:</strong> ${timeline}</p>

        <h3>Core Problem Statement</h3>
        <div style="background: #f8fafc; padding: 16px; border-radius: 8px; border: 1px solid #edf2f7; white-space: pre-wrap;">
            ${problem}
        </div>
        
        <p style="margin-top: 30px; font-size: 14px;">
            <a href="https://www.codencognition.com/dashboard/leads" style="color: #0070f3; font-weight: 600;">View in Admin Dashboard &rarr;</a>
        </p>
    `;
    return withEmailLayout("New Strategic Consultation Lead", content);
};

export const proposalEmailHtml = (clientName: string, proposalUrl: string) => {
    const content = `
        <p>Hi ${clientName},</p>
        <p>We've completed the evaluation of your project requirements and have prepared a comprehensive proposal outlining our recommended approach, architecture, and investment.</p>
        
        <p>This proposal includes:
            <ul style="padding-left: 20px;">
                <li>Detailed Project Scope & Deliverables</li>
                <li>Strategic Implementation Timeline</li>
                <li>Investment Structure & Terms</li>
            </ul>
        </p>

        <div class="highlight-box">
            Please review the details at your earliest convenience to maintain our projected start date.
        </div>

        <div style="text-align: center;">
            <a href="${proposalUrl}" class="button">Review & Approve Proposal</a>
        </div>

        <p style="margin-top: 25px; font-size: 15px; color: #666; border-top: 1px dashed #eee; pt: 20px;">
            <strong>Pro Tip:</strong> You can also <a href="https://www.codencognition.com/login" style="color: #0070f3; font-weight: 600;">login to your Client Dashboard</a> at any time to track project progress, view milestones, and chat securely with our team.
        </p>

        <p>If you have any immediate questions, feel free to reply to this email or book a quick 15-minute sync with us.</p>
    `;
    return withEmailLayout("Your Personalized Project Proposal", content);
};

