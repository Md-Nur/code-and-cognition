import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: parseInt(process.env.SMTP_PORT || "587"),
    secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
});

export const DEFAULT_FROM_EMAIL = process.env.SMTP_FROM || '"Code & Cognition" <hello@codeandcognition.com>';
export const FOUNDER_EMAIL = process.env.FOUNDER_EMAIL || "hello@codeandcognition.com";

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
        console.log("Message sent: %s", info.messageId);
        return true;
    } catch (error) {
        console.error("Error sending email:", error);
        return false;
    }
}
