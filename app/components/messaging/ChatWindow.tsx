"use client";

import { useState, useEffect, useRef } from "react";

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
    const scrollRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    };

    const markAsRead = async () => {
        try {
            await fetch("/api/messages/read", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ senderId: receiverId }),
            });
        } catch (error) {
            console.error("Failed to mark messages as read:", error);
        }
    };

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
                const sortedMessages = conversation.reverse();
                setMessages(sortedMessages);

                // If there are unread messages from the other user, mark them as read
                const hasUnread = conversation.some((m: any) => !m.isRead && m.receiverId === currentUserId);
                if (hasUnread) {
                    markAsRead();
                }
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

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

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
                setTimeout(scrollToBottom, 100);
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-[600px] bg-agency-black border border-white/10 rounded-xl overflow-hidden shadow-2xl">
            <div className="p-4 border-b border-white/10 bg-white/5 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-agency-accent/20 flex items-center justify-center text-agency-accent font-bold text-xs">
                        {receiverName.charAt(0).toUpperCase()}
                    </div>
                    <h3 className="font-semibold text-gray-200">{receiverName}</h3>
                </div>
            </div>

            <div
                ref={scrollRef}
                className="flex-1 overflow-y-auto p-4 space-y-4 scroll-smooth"
            >
                {messages.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-center p-8">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500">
                                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                            </svg>
                        </div>
                        <p className="text-gray-500 text-sm">No messages yet. Say hello!</p>
                    </div>
                ) : (
                    messages.map((msg) => (
                        <div
                            key={msg.id}
                            className={`flex ${msg.senderId === currentUserId ? "justify-end" : "justify-start"}`}
                        >
                            <div
                                className={`max-w-[80%] p-3 px-4 rounded-2xl text-sm shadow-sm ${msg.senderId === currentUserId
                                        ? "bg-agency-accent text-white rounded-tr-none"
                                        : "bg-white/10 text-gray-200 rounded-tl-none border border-white/5"
                                    }`}
                            >
                                <p className="leading-relaxed">{msg.content}</p>
                                <span className="text-[10px] opacity-60 mt-1.5 block text-right font-medium">
                                    {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                </span>
                            </div>
                        </div>
                    ))
                )}
            </div>

            <form onSubmit={sendMessage} className="p-4 border-t border-white/10 bg-white/5 flex gap-2">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-agency-accent transition-all duration-300"
                />
                <button
                    type="submit"
                    disabled={loading || !newMessage.trim()}
                    className="btn-brand px-6 py-2 text-sm disabled:opacity-50 disabled:grayscale transition-all"
                >
                    {loading ? (
                        <span className="flex items-center gap-2">
                            <span className="w-3 h-3 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                            Sending
                        </span>
                    ) : (
                        "Send"
                    )}
                </button>
            </form>
        </div>
    );
}
