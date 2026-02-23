export const clientConfirmationEmailHtml = (clientName: string) => `
<!DOCTYPE html>
<html>
<head>
    <style>
        body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; line-height: 1.6; color: #333; max-w-xl; margin: 0 auto; padding: 20px; }
        .container { border: 1px solid #eaeaea; border-radius: 8px; padding: 32px; background-color: #ffffff; }
        .header { margin-bottom: 24px; border-bottom: 1px solid #eaeaea; padding-bottom: 16px; }
        h1 { font-size: 24px; font-weight: 700; color: #111; margin: 0; }
        .content { font-size: 16px; color: #444; }
        .footer { margin-top: 32px; padding-top: 24px; border-top: 1px solid #eaeaea; font-size: 14px; color: #666; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Request Received: Strategic Consultation</h1>
        </div>
        <div class="content">
            <p>Hi ${clientName},</p>
            <p>Thank you for requesting a strategic consultation with Code & Cognition.</p>
            <p>We have successfully received your qualification details. If you haven't already selected a time on our calendar, please do so via the booking page. Our founding team will review your core challenges to ensure we provide maximum value during our call.</p>
            <p>We look forward to speaking with you and exploring how we can accelerate your digital objectives.</p>
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
