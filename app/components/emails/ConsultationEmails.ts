export const clientConfirmationEmailHtml = (clientName: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { border: 1px solid #eaeaea; border-radius: 12px; padding: 40px; background-color: #ffffff; box-shadow: 0 4px 12px rgba(0,0,0,0.05); }
        .header { margin-bottom: 32px; border-bottom: 1px solid #eaeaea; padding-bottom: 24px; }
        .logo-text { font-size: 18px; font-weight: 800; letter-spacing: -0.02em; color: #000; margin-bottom: 8px; }
        .logo-accent { color: #0070f3; }
        h1 { font-size: 24px; font-weight: 700; color: #111; margin: 0; }
        .content { font-size: 16px; color: #444; margin-bottom: 32px; }
        .cta-container { text-align: center; margin: 32px 0; }
        .button { background-color: #000; color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 15px; display: inline-block; transition: all 0.2s ease; }
        .steps { background-color: #f9f9f9; border-radius: 8px; padding: 24px; margin: 24px 0; }
        .step-item { margin-bottom: 12px; font-size: 14px; display: flex; align-items: flex-start; }
        .step-number { background: #000; color: #fff; width: 20px; height: 20px; border-radius: 50%; display: inline-block; text-align: center; font-size: 12px; margin-right: 12px; flex-shrink: 0; line-height: 20px; }
        .footer { margin-top: 40px; padding-top: 24px; border-top: 1px solid #eaeaea; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="margin-bottom: 24px;">
                <img src="https://www.codencognition.com/Main-Logo.png" alt="Code & Cognition Logo" width="40" height="40" style="display: block;">
            </div>
            <div class="logo-text">Code<span class="logo-accent">&</span>Cognition</div>
            <h1>Strategic Consultation Request</h1>
        </div>
        <div class="content">
            <p>Hi ${clientName},</p>
            <p>We've successfully received your qualification details. To ensure we provide maximum strategic value during our session, our founding team will review your core challenges before we connect.</p>
            
            <p><strong>Next Step:</strong> To finalize our session, please select a convenient time on our secure booking page. This ensures your slot is reserved on our executive calendar.</p>

            <div class="cta-container">
                <a href="https://calendly.com/codencognition-bd/cosultation-of-code-cognition" class="button">Confirm Consultation Time</a>
            </div>

            <div class="steps">
                <h4 style="margin-top: 0; margin-bottom: 16px; font-size: 14px; text-transform: uppercase; letter-spacing: 0.05em; color: #888;">Next Steps</h4>
                <div class="step-item"><span class="step-number">1</span> <div>Select a dedicated time on our executive calendar.</div></div>
                <div class="step-item"><span class="step-number">2</span> <div>Our team reviews your submission for vertical alignment.</div></div>
                <div class="step-item"><span class="step-number">3</span> <div>Receive a tailored agenda via a calendar invitation.</div></div>
            </div>

            <p>We look forward to discussing your digital objectives and how we can best support your growth.</p>
        </div>
        <div class="footer">
            <p>Regards,</p>
            <strong>The Code & Cognition Team</strong><br>
            <a href="https://codencognition.com" style="color: #666; text-decoration: none;">codencognition.com</a>
        </div>
    </div>
</body>
</html>
`;

export const founderNotificationEmailHtml = (
    clientName: string,
    email: string,
    company: string,
    industry: string,
    revenue: string,
    budget: string,
    timeline: string,
    problem: string
) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { border: 1px solid #eaeaea; border-radius: 8px; padding: 24px; background-color: #fafafa; }
        .header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 2px solid #ccc; }
        h1 { font-size: 20px; margin: 0; color: #000; }
        .tag { display: inline-block; padding: 4px 8px; background: #e0f2fe; color: #0284c7; border-radius: 4px; font-size: 12px; font-weight: bold; margin-bottom: 12px; }
        .label { font-weight: 600; color: #555; font-size: 14px; display: block; margin-top: 16px; }
        .value { margin-top: 4px; font-size: 15px; color: #111; background: #fff; padding: 12px; border: 1px solid #eaeaea; border-radius: 6px; white-space: pre-wrap; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <span class="tag">NEW QUALIFICATION FORM</span>
            <h1>Strategic Consultation Request</h1>
        </div>
        
        <div>
            <span class="label">Contact Detail</span>
            <div class="value">
                <strong>Name:</strong> ${clientName}<br>
                <strong>Email:</strong> <a href="mailto:${email}">${email}</a><br>
                <strong>Company:</strong> ${company}<br>
                <strong>Industry:</strong> ${industry}
            </div>

            <span class="label">Financials & Timeline</span>
            <div class="value">
                <strong>Revenue:</strong> ${revenue}<br>
                <strong>Budget:</strong> ${budget}<br>
                <strong>Timeline:</strong> ${timeline}
            </div>

            <span class="label">Core Problem Statement</span>
            <div class="value">${problem}</div>
            
            <p style="margin-top: 24px; font-size: 13px; color: #666;">
                Check the admin dashboard for full discovery details and to manage the lead status.
            </p>
        </div>
    </div>
</body>
</html>
`;

export const proposalEmailHtml = (clientName: string, proposalUrl: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
        .container { border: 1px solid #eaeaea; border-radius: 8px; padding: 32px; background-color: #ffffff; text-align: center; }
        .header { margin-bottom: 24px; padding-bottom: 16px; border-bottom: 1px solid #eaeaea; }
        h1 { font-size: 24px; font-weight: 700; color: #111; margin: 0; }
        .content { font-size: 16px; color: #444; text-align: left; }
        .button { display: inline-block; background-color: #000; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 6px; font-weight: bold; margin-top: 24px; }
        .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #eaeaea; font-size: 14px; color: #666; text-align: left; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div style="margin-bottom: 20px; text-align: center;">
                <img src="https://www.codencognition.com/Main-Logo.png" alt="Code & Cognition Logo" width="40" height="40" style="display: inline-block;">
            </div>
            <h1>Your Project Proposal</h1>
        </div>
        <div class="content">
            <p>Hi ${clientName},</p>
            <p>We've prepared a comprehensive proposal outlining our recommended approach, timeline, and investment for your project.</p>
            <p>Please review the details at your earliest convenience.</p>
            <div style="text-align: center;">
                <a href="${proposalUrl}" class="button">Review Proposal</a>
            </div>
        </div>
        <div class="footer">
            <p>Best regards,</p>
            <strong>The Code & Cognition Team</strong><br>
            <a href="https://codencognition.com" style="color: #666;">codencognition.com</a>
        </div>
    </div>
</body>
</html>
`;
