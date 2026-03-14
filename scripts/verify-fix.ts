import dotenv from "dotenv";
dotenv.config();

import { transporter } from "../lib/mailer";


async function verifyFix() {
    console.log("Verifying fix by importing transporter from lib/mailer.ts...");
    
    // Cast to any to access host, port, etc. for debugging
    const options = transporter.options as any;
    console.log("Configuration used:");
    console.log("Host:", options.host);
    console.log("Port:", options.port);
    console.log("Secure:", options.secure);

    try {
        console.log("Verifying connection...");
        await transporter.verify();
        console.log("SMTP connection verified successfully with the new configuration!");
    } catch (error) {
        console.error("SMTP verification failed after fix:", error);
        process.exit(1);
    }
}

verifyFix();
