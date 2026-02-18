import type { Metadata } from "next";
import "./globals.css";
import { SessionProvider } from "next-auth/react";

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
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
