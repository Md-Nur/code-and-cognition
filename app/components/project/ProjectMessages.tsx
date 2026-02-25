"use client";

import { useState, useEffect, useRef } from "react";
import { format } from "date-fns";
import { Send, User, ChevronDown } from "lucide-react";

export default function ProjectMessages({ projectId, currentUserRole }: { projectId: string; currentUserRole: string }) {
    const [messages, setMessages] = useState<any[]>([]);
    const [newMessage, setNewMessage] = useState("");
    const [isLoading, setIsLoading] = useState(true);
    const [isSending, setIsSending] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const fetchMessages = async () => {
        try {
            const res = await fetch(`/api/project/${projectId}/messages`);
            if (res.ok) {
                const data = await res.json();
                setMessages(data);
            }
        } catch (error) {
            console.error("Failed to fetch messages:", error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchMessages();
        const intervalId = setInterval(fetchMessages, 10000); // rudimentary polling
        return () => clearInterval(intervalId);
    }, [projectId]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newMessage.trim() || isSending) return;

        setIsSending(true);
        try {
            const res = await fetch(`/api/project/${projectId}/messages`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ content: newMessage }),
            });

            if (res.ok) {
                const sentMessage = await res.json();
                setMessages((prev) => [...prev, sentMessage]);
                setNewMessage("");
            }
        } catch (error) {
            console.error("Failed to send message:", error);
        } finally {
            setIsSending(false);
        }
    };

    if (isLoading) {
        return <div className="animate-pulse h-64 bg-white/5 rounded-3xl" />;
    }

    return (
        <div className="glass-panel rounded-3xl border border-white/5 flex flex-col h-[600px]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between shrink-0">
                <div>
                    <h3 className="text-lg font-semibold text-white">Project Messages</h3>
                    <p className="text-xs text-gray-500 mt-1">Chat securely with the team and client.</p>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar">
                {messages.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center space-y-3">
                        <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center">
                            <Send className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-white">No messages yet</p>
                            <p className="text-xs text-gray-500 mt-1">Start the conversation!</p>
                        </div>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        // In a real app, you'd check `msg.senderId === currentUser.id`, 
                        // but since we don't have the user ID readily available in props yet,
                        // we'll stylize based on roles to distinguish them.
                        const isClientMessage = msg.sender.role === "CLIENT";
                        const isSystemOrTeamAction = !isClientMessage && currentUserRole === "CLIENT";

                        return (
                            <div key={msg.id} className={`flex gap-4 ${isSystemOrTeamAction ? "flex-row-reverse" : ""}`}>
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 mt-1 ${isClientMessage ? "bg-amber-500/20 text-amber-500" : "bg-agency-accent/20 text-agency-accent"}`}>
                                    {msg.sender.name.charAt(0).toUpperCase()}
                                </div>
                                <div className={`flex flex-col max-w-[80%] ${isSystemOrTeamAction ? "items-end" : "items-start"}`}>
                                    <div className="flex items-center gap-2 mb-1 px-1">
                                        <span className="text-xs font-medium text-white/80">{msg.sender.name}</span>
                                        <span className="text-[10px] text-gray-500 uppercase tracking-wider">{msg.sender.role}</span>
                                    </div>
                                    <div className={`p-4 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${isSystemOrTeamAction ? "bg-agency-accent text-agency-dark rounded-tr-none" : "bg-white/5 text-white/90 border border-white/5 rounded-tl-none"}`}>
                                        {msg.content}
                                    </div>
                                    <span className="text-[10px] text-gray-600 mt-2 px-1">
                                        {format(new Date(msg.createdAt), "MMM d, h:mm a")}
                                    </span>
                                </div>
                            </div>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            <div className="p-4 border-t border-white/5 shrink-0 bg-white/[0.02]">
                <form onSubmit={handleSendMessage} className="relative flex items-end gap-3">
                    <textarea
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type a message..."
                        className="w-full bg-black/40 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:outline-none focus:ring-1 focus:ring-agency-accent resize-none placeholder:text-gray-600 custom-scrollbar block min-h-[56px] max-h-[160px]"
                        rows={1}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleSendMessage(e);
                            }
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || isSending}
                        className="h-14 w-14 shrink-0 rounded-full bg-agency-accent hover:bg-agency-accent/90 focus:ring-2 focus:ring-agency-accent focus:ring-offset-2 focus:ring-offset-black disabled:opacity-50 disabled:cursor-not-allowed text-agency-dark flex items-center justify-center transition-all group"
                    >
                        {isSending ? (
                            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
                        ) : (
                            <Send className="w-5 h-5 ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
}
