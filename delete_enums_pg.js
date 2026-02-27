require('dotenv').config();
const { Client } = require('pg');

const connectionString = process.env.DATABASE_URL;

async function main() {
    console.log("Connecting using:", connectionString.substring(0, 30) + '...');
    const client = new Client({ connectionString });
    await client.connect();

    try {
        const res = await client.query("DELETE FROM \"Notification\" WHERE type IN ('BOOKING_STATUS_CHANGE', 'PROJECT_NEW', 'PROJECT_STATUS_CHANGE', 'SYSTEM');");
        console.log(`Deleted ${res.rowCount} rows`);
    } catch (err) {
        console.error("Error executing query:", err);
    } finally {
        await client.end();
    }
}

main().catch(console.error);
