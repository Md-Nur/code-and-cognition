import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code & Cognition — Digital Agency",
  description:
    "We build digital products that think. Web development, UI/UX design, video production, and growth marketing for ambitious brands.",
  keywords: "digital agency, web development, UI/UX design, Bangladesh, Code and Cognition",
  metadataBase: new URL("https://codeandcognition.com"),
  openGraph: {
    title: "Code & Cognition — Digital Product Studio",
    description: "We build digital products that think. Strategic web development, UI/UX design, and scalable products.",
    url: "https://codencognition.com",
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
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        {children}
      </body>
    </html>
  );
}
