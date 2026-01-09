"use client";

import React from "react";

interface StatCardProps {
    title: string;
    value: string | number;
    icon: React.ReactNode;
    variant: "blue" | "orange" | "red" | "green";
}

export default function StatCard({ title, value, icon, variant }: StatCardProps) {

    const variantStyles = {
        blue: {
            iconBg: "bg-blue-500/10",
            iconColor: "text-blue-400",
        },
        orange: {
            iconBg: "bg-orange-500/10",
            iconColor: "text-orange-400",
        },
        red: {
            iconBg: "bg-red-500/10",
            iconColor: "text-red-400",
        },
        green: {
            iconBg: "bg-green-500/10",
            iconColor: "text-green-400",
        }
    };

    const { iconBg, iconColor } = variantStyles[variant];

    return (
        <div className="bg-[#0f1218] p-6 rounded-3xl border border-gray-800 shadow-xl flex flex-col justify-between h-full hover:border-gray-700 transition-colors">
            <h3 className="text-gray-400 text-base font-medium font-sans mb-6">{title}</h3>

            <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full ${iconBg} flex items-center justify-center ${iconColor}`}>
                    {icon}
                </div>
                <div className="text-3xl font-bold text-white">
                    {value}
                </div>
            </div>
        </div>
    );
}