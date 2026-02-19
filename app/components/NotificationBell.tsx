"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

interface Notification {
    id: string;
    title: string;
    message: string;
    type: string;
    link?: string;
    isRead: boolean;
    createdAt: string;
}

export default function NotificationBell() {
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    const unreadCount = notifications.filter((n) => !n.isRead).length;

    const fetchNotifications = async () => {
        try {
            const res = await fetch("/api/notifications");
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (error) {
            console.error("Failed to fetch notifications:", error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        // Simple polling every 30 seconds
        const interval = setInterval(fetchNotifications, 30000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const markAsRead = async (id: string) => {
        try {
            const res = await fetch(`/api/notifications/${id}`, {
                method: "PATCH",
            });
            if (res.ok) {
                setNotifications((prev) =>
                    prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
                );
            }
        } catch (error) {
            console.error("Failed to mark notification as read:", error);
        }
    };

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
                aria-label="Notifications"
            >
                <svg
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.73 21a2 2 0 0 1-3.46 0" />
                </svg>
                {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-agency-accent text-[10px] font-bold text-white">
                        {unreadCount}
                    </span>
                )}
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto rounded-xl bg-agency-black border border-white/10 shadow-2xl z-50 animate-in fade-in slide-in-from-top-2">
                    <div className="p-4 border-b border-white/10 flex justify-between items-center">
                        <h3 className="font-semibold text-sm">Notifications</h3>
                        {unreadCount > 0 && (
                            <span className="text-[10px] text-agency-accent uppercase font-bold tracking-widest">
                                {unreadCount} New
                            </span>
                        )}
                    </div>
                    <div className="divide-y divide-white/5">
                        {notifications.length === 0 ? (
                            <div className="p-8 text-center text-gray-500 text-sm">
                                No notifications yet
                            </div>
                        ) : (
                            notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`p-4 transition-colors hover:bg-white/5 cursor-pointer border-l-2 ${!notification.isRead ? "bg-white/[0.02] border-agency-accent" : "border-transparent opacity-70"
                                        }`}
                                    onClick={() => markAsRead(notification.id)}
                                >
                                    <div className="flex justify-between items-start mb-1 gap-2">
                                        <div className="flex-1">
                                            <p className="text-sm font-semibold text-gray-200">
                                                {notification.title}
                                            </p>
                                            <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">
                                                {notification.message}
                                            </p>
                                        </div>
                                        <span className="text-[10px] text-gray-500 whitespace-nowrap pt-1">
                                            {new Date(notification.createdAt).toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase tracking-widest ${notification.type === 'MESSAGE_NEW' ? 'bg-blue-500/20 text-blue-400' :
                                                notification.type === 'BOOKING_NEW' ? 'bg-green-500/20 text-green-400' :
                                                    notification.type === 'PROJECT_STATUS_CHANGE' ? 'bg-purple-500/20 text-purple-400' :
                                                        'bg-gray-500/20 text-gray-400'
                                            }`}>
                                            {notification.type.replace('_', ' ')}
                                        </span>
                                        {notification.link && (
                                            <Link
                                                href={notification.link}
                                                className="text-[10px] text-agency-accent hover:underline font-bold uppercase tracking-widest"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setIsOpen(false);
                                                    markAsRead(notification.id);
                                                }}
                                            >
                                                View
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}
