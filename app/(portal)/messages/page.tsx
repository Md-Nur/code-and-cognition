import { auth } from "@/lib/auth";
import MessageClient from "@/app/components/messaging/MessageClient";

export default async function MessagesPage() {
    const session = await auth();

    return (
        <div className="section-container pt-32 pb-20 text-white">
            <header className="mb-12">
                <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight mb-4">
                    Messages
                </h1>
                <p className="text-gray-400 max-w-2xl">
                    Connect with the Code & Cognition team and manage your project discussions.
                </p>
            </header>

            <MessageClient currentUser={session!.user} />
        </div>
    );
}
