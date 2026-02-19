import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import MessageClient from "./MessageClient";

export default async function MessagesPage() {
    const session = await auth();

    if (!session) {
        redirect("/login");
    }

    return (
        <main className="min-h-screen pt-32 pb-20 bg-agency-black text-white">
            <div className="section-container">
                <header className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
                        Messages
                    </h1>
                    <p className="text-gray-400 max-w-2xl">
                        Connect with the Code & Cognition team and manage your project discussions.
                    </p>
                </header>

                <MessageClient currentUser={session.user} />
            </div>
        </main>
    );
}
