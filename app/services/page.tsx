import type { Metadata } from "next";
import Navbar from "../components/public/Navbar";
import Footer from "../components/public/Footer";
import ServicesSolutions from "../components/public/ServicesSolutions";
import { auth } from "@/lib/auth";

export const metadata: Metadata = {
  title: "Services | Code & Cognition",
  description:
    "Structured digital execution for growth-focused companies across platforms, automation, and growth systems.",
};

export const dynamic = "force-dynamic";

export default async function ServicesHub() {
  const session = await auth();

  return (
    <main className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white">
      <Navbar user={session?.user} />

      <ServicesSolutions />

      <Footer />
    </main>
  );
}
