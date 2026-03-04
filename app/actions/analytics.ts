"use server";

import { TrackingPayload } from "@/lib/analytics/types";
import { headers } from "next/headers";

const META_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;
const META_CAPI_TOKEN = process.env.META_CAPI_TOKEN;

export async function trackServerEvent(payload: TrackingPayload) {
    if (!META_PIXEL_ID || !META_CAPI_TOKEN) {
        console.warn("Meta CAPI credentials missing, skipping server event.");
        return { success: false, reason: "Missing credentials" };
    }

    try {
        const headersList = await headers();
        const clientIp = headersList.get("x-forwarded-for") || headersList.get("x-real-ip");
        const userAgent = headersList.get("user-agent");
        const currentUrl = headersList.get("referer") || payload.url;

        // Meta expects unix timestamp in seconds
        const eventTime = Math.floor(Date.now() / 1000);

        // Required User Data for CAPI (even if just IP/UA)
        const userData = {
            client_ip_address: clientIp,
            client_user_agent: userAgent,
        };

        const customData = {
            ...payload.customData,
            ...payload.utmData,
        };

        const capiPayload = {
            data: [
                {
                    event_name: payload.eventName,
                    event_time: eventTime,
                    action_source: "website",
                    event_id: payload.eventId, // Crucial: Must match exactly what browser fbq sends
                    event_source_url: currentUrl,
                    user_data: userData,
                    custom_data: Object.keys(customData).length > 0 ? customData : undefined,
                },
            ],
        };

        const response = await fetch(`https://graph.facebook.com/v19.0/${META_PIXEL_ID}/events`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                ...capiPayload,
                access_token: META_CAPI_TOKEN,
            }),
        });

        if (!response.ok) {
            const errBody = await response.text();
            console.error("Meta CAPI error:", errBody);
            return { success: false, reason: "API Error" };
        }

        return { success: true };
    } catch (error) {
        console.error("Failed to send Meta CAPI event:", error);
        return { success: false, reason: "Exception caught" };
    }
}
