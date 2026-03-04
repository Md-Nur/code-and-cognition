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
    // We'll rely on our TrackingProvider to set this item
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

    // Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "PageView");
    }
};

// -------------------------------------------------------------
// Custom Events
// -------------------------------------------------------------

export const trackLead = () => {
    if (!isTrackingEnabled()) return;

    // GA4
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "generate_lead", {
            event_category: "engagement",
            event_label: "Consultation Request",
        });
    }

    // Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Lead");
    }
};

export const trackContactClick = () => {
    if (!isTrackingEnabled()) return;

    // GA4
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "contact", {
            event_category: "engagement",
            event_label: "WhatsApp Click",
        });
    }

    // Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "Contact");
    }
};

export const trackCaseStudyView = (slug: string) => {
    if (!isTrackingEnabled()) return;

    // GA4
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "view_case_study", {
            event_category: "engagement",
            event_label: slug,
        });
    }

    // Meta Pixel
    if (typeof window !== "undefined" && window.fbq) {
        window.fbq("track", "ViewContent", {
            content_name: slug,
            content_category: "Case Study",
        });
    }
};
