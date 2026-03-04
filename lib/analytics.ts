import { AnalyticsEvent, CustomParams } from "./analytics/types";
import { generateEventId, getStoredUTMs } from "./analytics/utils";
import { trackServerEvent } from "@/app/actions/analytics";

export const GA_TRACKING_ID = process.env.NEXT_PUBLIC_GA_ID;
export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID;

// Declare global types
declare global {
    interface Window {
        gtag: (...args: any[]) => void;
        fbq: (...args: any[]) => void;
    }
}

// Helper to check if tracking is permitted
const isTrackingEnabled = () => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("analytics_consent") === "true";
};

// -------------------------------------------------------------
// Core Events
// -------------------------------------------------------------

export const trackPageView = (url: string) => {
    if (!isTrackingEnabled()) return;

    // GA4
    if (typeof window !== "undefined" && window.gtag && GA_TRACKING_ID) {
        window.gtag("config", GA_TRACKING_ID, {
            page_path: url,
        });
    }

    // Meta Pixel (Client)
    const eventId = generateEventId();
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", AnalyticsEvent.PAGE_VIEW, {}, { eventID: eventId });
    }

    // Meta CAPI (Server)
    // PageViews are usually best kept client-side due to volume, but you can enable this.
    // trackServerEvent({ eventName: AnalyticsEvent.PAGE_VIEW, eventId, url });
};

// -------------------------------------------------------------
// Custom Events
// -------------------------------------------------------------

export const trackLead = (customParams?: CustomParams) => {
    if (!isTrackingEnabled()) return;

    const utmData = getStoredUTMs();
    const eventId = generateEventId();
    const mergedParams = { ...customParams, ...utmData };

    // GA4
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
            event_category: "engagement",
            ...mergedParams,
        });
    }

    // Meta Pixel (Browser)
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", AnalyticsEvent.LEAD, mergedParams, { eventID: eventId });
    }

    // Meta CAPI (Server)
    trackServerEvent({
        eventName: AnalyticsEvent.LEAD,
        eventId,
        customData: customParams,
        utmData,
        url: typeof window !== "undefined" ? window.location.href : undefined,
    });
};

export const trackContactClick = (customParams?: CustomParams) => {
    if (!isTrackingEnabled()) return;

    const utmData = getStoredUTMs();
    const eventId = generateEventId();
    const mergedParams = { ...customParams, ...utmData };

    // GA4
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "contact", {
            event_category: "engagement",
            ...mergedParams,
        });
    }

    // Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", AnalyticsEvent.CONTACT, mergedParams, { eventID: eventId });
    }

    // Meta CAPI
    trackServerEvent({
        eventName: AnalyticsEvent.CONTACT,
        eventId,
        customData: customParams,
        utmData,
        url: typeof window !== "undefined" ? window.location.href : undefined,
    });
};

export const trackCaseStudyView = (slug: string, customParams?: CustomParams) => {
    if (!isTrackingEnabled()) return;

    const eventId = generateEventId();
    const params = { content_name: slug, content_category: "Case Study", ...customParams };

    // GA4
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "view_case_study", {
            event_category: "engagement",
            event_label: slug,
            ...customParams,
        });
    }

    // Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", AnalyticsEvent.VIEW_CONTENT, params, { eventID: eventId });
    }

    // Meta CAPI
    trackServerEvent({
        eventName: AnalyticsEvent.VIEW_CONTENT,
        eventId,
        customData: params,
        url: typeof window !== "undefined" ? window.location.href : undefined,
    });
};
