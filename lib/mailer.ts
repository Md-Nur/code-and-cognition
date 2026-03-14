import nodemailer from "nodemailer";

const SMTP_PORT = parseInt(process.env.SMTP_PORT || "465");
const SMTP_SECURE = process.env.SMTP_SECURE === "true" || (SMTP_PORT === 465 && process.env.SMTP_SECURE !== "false");

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: SMTP_PORT,
    secure: SMTP_SECURE,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const DEFAULT_FROM_EMAIL = process.env.SMTP_FROM || '"Code & Cognition" <codencognition@gmail.com>';
export const SMTP_USER = process.env.SMTP_USER || "codencognition.bd@gmail.com";

export async function sendMail(to: string, subject: string, html: string) {
    if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
        console.warn("SMTP_USER or SMTP_PASS is missing. Email skipped.");
        return false;
    }

    try {
        const info = await transporter.sendMail({
            from: DEFAULT_FROM_EMAIL,
            to,
            subject,
            html,
        });
        console.log(`[MAILER] Message sent successfully to ${to}. ID: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`[MAILER] CRITICAL: Failed to send email to ${to}:`, error);
        return false;
    }
}
