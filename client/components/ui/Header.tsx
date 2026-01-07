"use client";

import React, { useState } from "react";
import { Search, Bell, Command } from "lucide-react"; // Added Command icon

export default function Header() {
    return (
        <header className="flex items-center justify-between px-6 py-4 bg-[#0f1218] border-b border-gray-800 sticky top-0 z-50">
            
            {/* Search Container */}
            <div className="flex-1 max-w-md"> 
                <div className="relative group">
                    {/* The "Glow" Background - appears on focus */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg opacity-0 group-focus-within:opacity-100 transition duration-500 blur opacity-20"></div>
                    
                    <div className="relative flex items-center bg-[#1c1f26] rounded-lg border border-gray-800 group-focus-within:border-transparent transition-all duration-300">
                        
                        {/* Search Icon (Animated) */}
                        <Search className="ml-3 text-gray-500 w-4 h-4 group-focus-within:text-blue-400 group-focus-within:scale-110 transition-all duration-300" />
                        
                        <input
                            type="text"
                            placeholder="Search..."
                            className="w-full bg-transparent text-gray-200 text-sm py-2.5 pl-3 pr-12 outline-none placeholder:text-gray-600"
                        />

                        {/* Visual Shortcut Badge */}
                        <div className="absolute right-2 flex items-center pointer-events-none">
                            <span className="flex items-center gap-1 bg-[#2a2e37] border border-gray-700 rounded px-1.5 py-0.5 text-[10px] font-mono text-gray-400">
                                <Command className="w-3 h-3" /> K
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-4 ml-4">
                <button className="relative text-gray-400 hover:text-white transition-colors p-2 rounded-full hover:bg-[#1c1f26]">
                    <Bell className="w-5 h-5" />
                    <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border border-[#0f1218] animate-pulse"></span>
                </button>             
            </div>
        </header>
    );
}