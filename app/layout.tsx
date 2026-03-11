import type { Metadata } from "next";
import { Suspense } from "react";
import TrackingProvider from "@/components/TrackingProvider";
import NextTopLoader from "nextjs-toploader";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code & Cognition — Strategic Digital Execution",
  description:
    "We architect the future of execution. High-performance digital platforms, autonomous operations, and result engineering for enterprise growth.",
  keywords: "strategic digital execution, industrial-grade platforms, autonomous operations, result engineering, Code & Cognition",
  metadataBase: new URL("https://www.codencognition.com"),
  openGraph: {
    title: "Code & Cognition — Strategic Digital Execution",
    description: "We architect the future of execution. High-performance digital platforms, autonomous operations, and result engineering for enterprise growth.",
    url: "https://www.codencognition.com",
    siteName: "Code & Cognition",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Code & Cognition — Digital Agency",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Code & Cognition — Digital Agency",
    description: "We build digital products that think. Strategic web development, UI/UX design, and scalable products.",
    images: ["/og-image.png"],
    site: "@codencognition",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased">
        <NextTopLoader color="#3b82f6" height={3} showSpinner={false} />
        <Suspense fallback={null}>
          <TrackingProvider />
        </Suspense>
        {children}
      </body>
    </html>
  );
}
