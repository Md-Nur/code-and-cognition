import { UTMParams } from "./types";

/**
 * Generates a unique event ID for deduplication (Meta CAPI).
 * Uses crypto.randomUUID if available, else falls back to a pseudo-random generator.
 */
export const generateEventId = (): string => {
    if (typeof window !== "undefined" && window.crypto && window.crypto.randomUUID) {
        return window.crypto.randomUUID();
    }
    // Fallback for older browsers
    return "10000000-1000-4000-8000-100000000000".replace(/[018]/g, (c) =>
        (
            Number(c) ^
            (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (Number(c) / 4)))
        ).toString(16)
    );
};

/**
 * Retrieves stored UTM parameters from localStorage safely.
 */
export const getStoredUTMs = (): UTMParams => {
    if (typeof window === "undefined") return {};

    try {
        const raw = localStorage.getItem("analytics_utms");
        if (raw) {
            return JSON.parse(raw) as UTMParams;
        }
    } catch (error) {
        console.warn("Failed to parse UTMs from storage");
    }

    return {};
};
