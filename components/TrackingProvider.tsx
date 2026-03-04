"use client";

import { useEffect, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";
import Script from "next/script";
import { GA_TRACKING_ID, FB_PIXEL_ID, trackPageView } from "@/lib/analytics";

export default function TrackingProvider() {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [hasConsent, setHasConsent] = useState<boolean | null>(null);

    // Load initial consent state
    useEffect(() => {
        const storedConsent = localStorage.getItem("analytics_consent");
        if (storedConsent === "true") {
            setHasConsent(true);
        } else if (storedConsent === "false") {
            setHasConsent(false);
        } else {
            // Show banner if no consent is recorded
            setHasConsent(null);
        }
    }, []);

    // Track page views on route change if consent is given
    useEffect(() => {
        if (hasConsent && pathname) {
            const url = pathname + searchParams.toString();
            trackPageView(url);
        }
    }, [pathname, searchParams, hasConsent]);

    const handleAccept = () => {
        localStorage.setItem("analytics_consent", "true");
        setHasConsent(true);
        const url = pathname + searchParams.toString();
        // Track the current page immediately upon consent
        trackPageView(url);
    };

    const handleDecline = () => {
        localStorage.setItem("analytics_consent", "false");
        setHasConsent(false);
    };

    return (
        <>
            {/* Meta Pixel Setup */}
            {hasConsent && FB_PIXEL_ID && (
                <>
                    <Script
                        id="fb-pixel"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                !function(f,b,e,v,n,t,s)
                {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
                n.callMethod.apply(n,arguments):n.queue.push(arguments)};
                if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
                n.queue=[];t=b.createElement(e);t.async=!0;
                t.src=v;s=b.getElementsByTagName(e)[0];
                s.parentNode.insertBefore(t,s)}(window, document,'script',
                'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '${FB_PIXEL_ID}');
              `,
                        }}
                    />
                </>
            )}

            {/* GA4 Setup */}
            {hasConsent && GA_TRACKING_ID && (
                <>
                    <Script
                        strategy="afterInteractive"
                        src={`https://www.googletagmanager.com/gtag/js?id=${GA_TRACKING_ID}`}
                    />
                    <Script
                        id="ga4"
                        strategy="afterInteractive"
                        dangerouslySetInnerHTML={{
                            __html: `
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${GA_TRACKING_ID}', {
                  page_path: window.location.pathname,
                });
              `,
                        }}
                    />
                </>
            )}

            {/* Cookie Consent Banner */}
            {hasConsent === null && (
                <div className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6 bg-agency-black/95 backdrop-blur-md border-t border-white/10 shadow-2xl animate-fade-in">
                    <div className="container mx-auto max-w-6xl flex flex-col md:flex-row items-center justify-between gap-6">
                        <div className="text-sm text-gray-400">
                            We use functional and analytical tracking (Google Analytics and Meta Pixel) to improve your experience and measure engagement.
                            You can review our <a href="/privacy" className="text-agency-accent hover:underline">Privacy Policy</a> to learn more.
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            <button
                                onClick={handleDecline}
                                className="px-5 py-2 rounded-full border border-white/20 text-white text-sm font-medium hover:bg-white/5 transition-colors"
                            >
                                Decline
                            </button>
                            <button
                                onClick={handleAccept}
                                className="px-5 py-2 rounded-full bg-agency-accent text-white text-sm font-bold shadow-lg shadow-agency-accent/20 hover:scale-105 transition-transform"
                            >
                                Accept Tracking
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
