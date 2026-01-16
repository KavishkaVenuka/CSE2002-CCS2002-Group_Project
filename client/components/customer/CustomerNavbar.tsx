"use client";

import React from "react";
import {
    LayoutDashboard,
    Send,
    FileText,
    ShoppingBag,
    CreditCard,
    MessageSquare,
    User,
    Settings,
    LogOut,
    Layers,
    Truck,
    Receipt,
    CheckCircle
} from "lucide-react";

export default function CustomerNavbar() {
    const menuItems = [
        { name: "Dashboard", icon: LayoutDashboard, active: true },
        { name: "Send Requirements", icon: Send, active: false },
        { name: "Quotations", icon: FileText, active: false },
        { name: "Delivery Tracking", icon: Truck, active: false },
        { name: "Invoices", icon: Receipt, active: false },
        { name: "My Orders", icon: ShoppingBag, active: false },
        { name: "Payments", icon: CreditCard, active: false },
        { name: "Order Confirmation", icon: CheckCircle, active: false },
    ];

    return (
        <div className="min-h-screen bg-[#0a0c10] p-4 flex">
            {/* Sidebar Container */}
            <div className="w-72 bg-[#0f1218] rounded-3xl border border-gray-800 flex flex-col p-6 shadow-2xl relative overflow-hidden">

                {/* Background Visuals (Subtle) */}
                <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-blue-900/10 to-transparent pointer-events-none" />

                {/* Header / Logo */}
                <div className="flex items-center gap-3 mb-10 relative z-10 px-2">
                    <div className="bg-gradient-to-br from-blue-600 to-cyan-600 p-2.5 rounded-xl shadow-lg shadow-blue-500/20">
                        <Layers className="w-6 h-6 text-white" />
                    </div>
                    <div>
                        <h1 className="text-white font-bold text-lg tracking-wide">Vertex<span className="text-blue-400">Pro</span></h1>
                    </div>
                </div>

                {/* Navigation Items */}
                <nav className="flex-1 space-y-2 relative z-10">
                    {menuItems.map((item, index) => (
                        <button
                            key={index}
                            className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-300 group ${item.active
                                ? "bg-gradient-to-r from-blue-600/20 to-cyan-600/10 border border-blue-500/20 text-blue-400"
                                : "text-gray-400 hover:text-white hover:bg-[#1c1f26]"
                                }`}
                        >
                            <item.icon
                                className={`w-5 h-5 transition-colors ${item.active ? "text-blue-400" : "text-gray-400 group-hover:text-white"
                                    }`}
                            />
                            <span className="font-medium text-sm">{item.name}</span>
                            {item.active && (
                                <div className="absolute right-0 w-1 h-8 bg-blue-500 rounded-l-full blur-[2px]" />
                            )}
                        </button>
                    ))}
                </nav>

                {/* Bottom Section */}
                <div className="mt-8 pt-6 border-t border-gray-800 space-y-4 relative z-10">

                    {/* Collapse/Expand (Optional visual from screenshot lookalike) */}
                    {/* <div className="absolute -right-3 top-[-50px]">
               <button className="bg-[#1c1f26] border border-gray-700 p-1 rounded-md text-gray-400 hover:text-white">
                   <ChevronLeft size={16}/>
               </button>
           </div> */}

                    {/* User Profile */}
                    <div className="flex items-center gap-3 px-2 group cursor-pointer">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-700 to-gray-600 p-[1px]">
                            <div className="w-full h-full rounded-full bg-[#1c1f26] flex items-center justify-center overflow-hidden">
                                {/* Placeholder Avatar */}
                                <User className="w-5 h-5 text-gray-400 group-hover:text-blue-400 transition-colors" />
                            </div>
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-medium text-gray-200 group-hover:text-white transition-colors">Kavishka V.</h4>
                            <p className="text-xs text-gray-500">View Profile</p>
                        </div>
                    </div>

                    {/* Logout */}
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all duration-300">
                        <LogOut className="w-5 h-5" />
                        <span className="font-medium text-sm">Log Out</span>
                    </button>
                </div>
            </div>
        </div>
    );
}
