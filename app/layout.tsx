import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Code & Cognition — Digital Agency",
  description:
    "We build digital products that think. Web development, UI/UX design, video production, and growth marketing for ambitious brands.",
  keywords: "digital agency, web development, UI/UX design, Bangladesh, Code and Cognition",
  openGraph: {
    title: "Code & Cognition — Digital Agency",
    description: "We build digital products that think.",
    type: "website",
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
