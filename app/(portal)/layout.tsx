import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const session = await auth();

    if (!session?.user) {
        redirect("/login");
    }

    return (
        <div className="min-h-screen bg-agency-black">
            {children}
        </div>
    );
}
