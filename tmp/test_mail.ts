import { sendMail } from "../lib/mailer";

async function main() {
    console.log("--- TESTING EMAIL DELIVERY ---");
    const result = await sendMail(
        "codencognition.bd@gmail.com",
        "Test Email - Code & Cognition",
        "<h1>Test Success</h1><p>If you see this, email sending is working.</p>"
    );
    console.log(`Email result: ${result}`);
}

main().catch(console.error);
