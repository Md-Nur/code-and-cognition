
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

async function testConnection() {
    console.log("Testing SMTP connection with settings:");
    console.log("Host:", process.env.SMTP_HOST || "smtp.gmail.com");
    console.log("Port:", process.env.SMTP_PORT || "465");
    console.log("Secure:", process.env.SMTP_SECURE === "true");
    console.log("User:", process.env.SMTP_USER);

    const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "465"),
        secure: false, // Force false to see if it errors
        auth: {

            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
        debug: true, // Enable debug output
        logger: true, // Log to console
    });

    try {
        console.log("Verifying connection...");
        await transporter.verify();
        console.log("SMTP connection verified successfully!");
    } catch (error) {
        console.error("SMTP verification failed:", error);
    }
}

testConnection();
