"use client";

import React from "react";
import { FileText, CreditCard, Truck, Bell, X, CheckCheck } from "lucide-react";

type NotificationType = "quotation" | "payment" | "delivery" | "system";

interface Notification {
    id: string;
    type: NotificationType;
    title: string;
    message?: string;
    timestamp: string;
    isRead: boolean;
}

const notifications: Notification[] = [
    {
        id: "1",
        type: "quotation",
        title: "New quotation received for REQ-101",
        timestamp: "1h ago",
        isRead: false,
    },
    {
        id: "2",
        type: "payment",
        title: "Payment reminder for Order #12340",
        timestamp: "3h ago",
        isRead: false,
    },
    {
        id: "3",
        type: "delivery",
        title: "Order #12345 delivered successfully",
        timestamp: "1d ago",
        isRead: true,
    },
    {
        id: "4",
        type: "system",
        title: "System maintenance scheduled",
        message: "Maintenance will start at 12:00 AM.",
        timestamp: "2d ago",
        isRead: true,
    }
];

export default function NotificationPanel() {

    const getIcon = (type: NotificationType) => {
        switch (type) {
            case "quotation":
                return <FileText className="w-5 h-5 text-blue-400" />;
            case "payment":
                return <CreditCard className="w-5 h-5 text-red-400" />;
            case "delivery":
                return <Truck className="w-5 h-5 text-green-400" />;
            case "system":
            default:
                return <Bell className="w-5 h-5 text-gray-400" />;
        }
    };

    const getBgColor = (type: NotificationType) => {
        switch (type) {
            case "quotation":
                return "bg-blue-500/10";
            case "payment":
                return "bg-red-500/10";
            case "delivery":
                return "bg-green-500/10";
            case "system":
            default:
                return "bg-gray-500/10";
        }
    };

    return (
        <div className="w-[480px] bg-[#0f1218] rounded-3xl border border-gray-800 shadow-2xl overflow-hidden flex flex-col h-[500px]">
            {/* Header */}
            <div className="p-5 border-b border-gray-800/50 flex justify-between items-center sticky top-0 bg-[#0f1218]/95 backdrop-blur-sm z-10">
                <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-white text-lg">Notifications</h3>
                    <span className="bg-blue-500/20 text-blue-400 text-xs font-bold px-2 py-0.5 rounded-full">
                        {notifications.filter(n => !n.isRead).length}
                    </span>
                </div>
                <button className="text-gray-400 hover:text-white transition-colors p-1 hover:bg-gray-800 rounded-full" aria-label="Mark all as read">
                    <CheckCheck className="w-4 h-4" />
                </button>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto p-3 space-y-2 custom-scrollbar">
                {notifications.map((notif) => (
                    <div
                        key={notif.id}
                        className={`group relative p-4 rounded-2xl flex gap-4 transition-all duration-200 cursor-pointer border border-transparent hover:border-gray-800 hover:bg-[#1a1d24] ${!notif.isRead ? "bg-[#161920]" : ""
                            }`}
                    >
                        {/* Icon/Avatar */}
                        <div className={`shrink-0 w-10 h-10 rounded-full ${getBgColor(notif.type)} flex items-center justify-center mt-1`}>
                            {getIcon(notif.type)}
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                            <div className="flex justify-between items-start gap-2">
                                <h4 className={`text-sm font-medium leading-tight ${!notif.isRead ? "text-gray-100" : "text-gray-400"}`}>
                                    {notif.title}
                                </h4>
                                {!notif.isRead && (
                                    <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5 animate-pulse" />
                                )}
                            </div>

                            {notif.message && (
                                <p className="text-xs text-gray-500 mt-1 line-clamp-2">
                                    {notif.message}
                                </p>
                            )}

                            <p className="text-xs text-gray-600 mt-2 font-medium">
                                {notif.timestamp}
                            </p>
                        </div>
                    </div>
                ))}

                {/* Empty State (if needed, currently hidden since we have data) */}
                {notifications.length === 0 && (
                    <div className="flex flex-col items-center justify-center h-full text-center p-6 text-gray-500">
                        <Bell className="w-12 h-12 mb-3 opacity-20" />
                        <p>No new notifications</p>
                    </div>
                )}
            </div>

            {/* Footer */}
            <div className="p-3 border-t border-gray-800/50 text-center">
                <button className="text-xs font-medium text-gray-500 hover:text-blue-400 transition-colors py-1">
                    View all notifications
                </button>
            </div>
        </div>
    );
}