// Standardized Analytics Events (matching Meta/GA4 standard events where possible)
export enum AnalyticsEvent {
    PAGE_VIEW = "PageView",
    LEAD = "Lead",
    CONTACT = "Contact",
    VIEW_CONTENT = "ViewContent",
}

// Custom parameters for tracking context
export interface CustomParams {
    page_category?: string;
    service_name?: string;
    industry?: string;
    [key: string]: any;
}

// UTM parameters structure
export interface UTMParams {
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_term?: string;
    utm_content?: string;
}

// Full tracking payload generic type
export interface TrackingPayload {
    eventName: AnalyticsEvent;
    eventId?: string; // Crucial for Meta Deduplication
    customData?: CustomParams;
    utmData?: UTMParams;
    url?: string;
}
