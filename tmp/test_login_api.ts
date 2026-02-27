async function main() {
    const email = "codencognition.bd@gmail.com";
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

    console.log(`--- SIMULATING MAGIC LINK REQUEST FOR ${email} ---`);

    const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
    });

    const data = await response.json();
    console.log(`Response status: ${response.status}`);
    console.log(`Response body: ${JSON.stringify(data, null, 2)}`);
}

main().catch(console.error);
