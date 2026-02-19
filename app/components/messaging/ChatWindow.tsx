"use client";

import { useState, useEffect } from "react";

interface Message {
    id: string;
    content: string;
    senderId: string;
    receiverId: string;
    createdAt: string;
    sender: { name: string };
}

interface ChatWindowProps {
    currentUserId: string;
    receiverId: string;
    receiverName: string;
}

export default function ChatWindow({ currentUserId, receiverId, receiverName }: ChatWindowProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const fetchMessages = async () => {
        try {
            const res = await fetch("/api/messages");
            if (res.ok) {
                const data = await res.json();
                // Filter messages for this specific conversation
                const conversation = data.filter(
                    (m: Message) =>
                        (m.senderId === currentUserId && m.receiverId === receiverId) ||
                        (m.senderId === receiverId && m.receiverId === currentUserId)
                );
                setMessages(conversation.reverse());
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        }
    };

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 5000);
        return () => clearInterval(interval);
    }, [receiverId]);

    const sendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || loading) return;

        setLoading(true);
        try {
            const res = await fetch("/api/messages", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage, receiverId }),
            });

            if (res.ok) {
                const sentMsg = await res.json();
                setMessages((prev) => [...prev, sentMsg]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[500px] bg-agency-black border border-white/10 rounded-xl overflow-hidden">
            <div className="p-4 border-b border-white/10 bg-white/5">
                <h3 className="font-semibold text-gray-200">{receiverName}</h3>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-[80%] p-3 rounded-2xl text-sm ${msg.senderId === currentUserId
                                ? "bg-agency-accent text-white rounded-tr-none"
                                : "bg-white/10 text-gray-200 rounded-tl-none"
                                }`}
                        >
                            <p>{msg.content}</p>
                            <span className="text-[10px] opacity-70 mt-1 block">
                                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-agency-accent transition-colors"
                />
                <button
                    type="submit"
                    disabled={loading}
                    className="btn-brand px-4 py-2 text-sm disabled:opacity-50"
                >
                    Send
                </button>
            </form>
        </div>
    );
}
