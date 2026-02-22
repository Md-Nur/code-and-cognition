import type { Metadata } from "next";
import Navbar from "@/app/components/public/Navbar";
import Footer from "@/app/components/public/Footer";
import { auth } from "@/lib/auth";

export default async function PublicLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    return (
        <div className="min-h-screen bg-agency-black selection:bg-agency-accent selection:text-white relative">
            <Navbar user={session?.user} />
            {children}
            <Footer />
        </div>
    );
}
