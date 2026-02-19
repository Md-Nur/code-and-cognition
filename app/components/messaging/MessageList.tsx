"use client";

import { useState, useEffect } from "react";

interface Conversation {
    userId: string;
    userName: string;
    lastMessage: string;
    timestamp: string;
    unread: boolean;
}

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    isRead: boolean;
    sender: { id: string; name: string };
    receiver: { id: string; name: string };
}

interface MessageListProps {
    currentUserId: string;
    onSelectConversation: (userId: string, userName: string) => void;
}

export default function MessageList({ currentUserId, onSelectConversation }: MessageListProps) {
    const [conversations, setConversations] = useState<Conversation[]>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const res = await fetch("/api/messages");
                if (res.ok) {
                    const messages: Message[] = await res.json();

                    // Group messages into conversations
                    const convMap = new Map<string, Conversation>();

                    messages.forEach(msg => {
                        const otherUser = msg.senderId === currentUserId ? msg.receiver : msg.sender;
                        if (!convMap.has(otherUser.id)) {
                            convMap.set(otherUser.id, {
                                userId: otherUser.id,
                                userName: otherUser.name,
                                lastMessage: msg.content,
                                timestamp: msg.createdAt,
                                unread: !msg.isRead && msg.receiverId === currentUserId
                            });
                        }
                    });

                    setConversations(Array.from(convMap.values()));
                }
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        fetchMessages();
        const interval = setInterval(fetchMessages, 10000);
        return () => clearInterval(interval);
    }, [currentUserId]);

    return (
        <div className="bg-agency-black border border-white/10 rounded-xl overflow-hidden h-[500px]">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="font-semibold text-gray-200">Messages</h3>
            </div>
            <div className="divide-y divide-white/5 overflow-y-auto h-[calc(500px-57px)]">
                {conversations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500 text-sm">
                        No conversations yet
                    </div>
                ) : (
                    conversations.map((conv) => (
                        <div
                            key={conv.userId}
                            onClick={() => onSelectConversation(conv.userId, conv.userName)}
                            className="p-4 hover:bg-white/5 cursor-pointer transition-colors"
                        >
                            <div className="flex justify-between items-start mb-1">
                                <h4 className="text-sm font-medium text-gray-200">{conv.userName}</h4>
                                <span className="text-[10px] text-gray-500">
                                    {new Date(conv.timestamp).toLocaleDateString()}
                                </span>
                            </div>
                            <div className="flex justify-between items-center">
                                <p className="text-xs text-gray-400 truncate max-w-[150px]">
                                    {conv.lastMessage}
                                </p>
                                {conv.unread && (
                                    <span className="w-2 h-2 rounded-full bg-agency-accent"></span>
                                )}
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
