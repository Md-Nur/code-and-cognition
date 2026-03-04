"use client";

import { useEffect } from "react";
import { trackCaseStudyView } from "@/lib/analytics";

export default function CaseStudyTracker({ slug }: { slug: string }) {
    useEffect(() => {
        trackCaseStudyView(slug);
    }, [slug]);

    return null;
}
