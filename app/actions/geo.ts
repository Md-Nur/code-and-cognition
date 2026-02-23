"use server";

import { headers } from "next/headers";

/**
 * Detects the user's country from request headers.
 * Works with platforms like Vercel (x-vercel-ip-country), 
 * Cloudflare (cf-ipcountry), and some other CDNs.
 * Returns the ISO 3166-1 alpha-2 country code or null.
 */
export async function getUserCountry() {
    const headerList = await headers();

    // Check common Geo-IP headers
    const country =
        headerList.get("x-vercel-ip-country") ||
        headerList.get("cf-ipcountry") ||
        headerList.get("x-visitor-country");

    return country;
}
