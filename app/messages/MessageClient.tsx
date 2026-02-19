"use client";

import { useState } from "react";
import MessageList from "@/app/components/messaging/MessageList";
import ChatWindow from "@/app/components/messaging/ChatWindow";

interface MessageClientProps {
    currentUser: {
        id: string;
        name: string;
        email: string;
        role: string;
    };
}

export default function MessageClient({ currentUser }: MessageClientProps) {
    const [selectedUser, setSelectedUser] = useState<{ id: string; name: string } | null>(null);

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
                <MessageList
                    currentUserId={currentUser.id}
                    onSelectConversation={(id, name) => setSelectedUser({ id, name })}
                />
            </div>
            <div className="md:col-span-2">
                {selectedUser ? (
                    <ChatWindow
                        currentUserId={currentUser.id}
                        receiverId={selectedUser.id}
                        receiverName={selectedUser.name}
                    />
                ) : (
                    <div className="h-[500px] flex items-center justify-center bg-agency-black border border-white/10 rounded-xl text-gray-500">
                        Select a conversation to start chatting
                    </div>
                )}
            </div>
        </div>
    );
}
