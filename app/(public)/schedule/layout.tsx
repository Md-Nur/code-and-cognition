import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Schedule Strategic Consultation | Code & Cognition",
    description: "We partner with ambitious companies to build intelligent, scalable digital platforms. Apply for a consultation to discuss your challenges.",
    openGraph: {
        title: "Schedule Strategic Consultation | Code & Cognition",
        description: "Apply for a consultation to discuss your technical challenges and ensure maximum value during our call.",
        images: ["/og-image.png"],
    },
    twitter: {
        card: "summary_large_image",
        title: "Schedule Consultation | Code & Cognition",
        description: "We partner with ambitious companies to build intelligent, scalable digital platforms.",
        images: ["/og-image.png"],
    },
};

export default function ScheduleLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return <>{children}</>;
}
