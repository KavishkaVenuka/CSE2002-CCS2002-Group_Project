import React from "react";
import CustomerNavbar from "@/components/customer/CustomerNavbar";
import Header from "@/components/ui/Header";

// Simple internal Skeleton component
const Skeleton = ({ className }: { className?: string }) => (
    <div className={`animate-pulse bg-gray-800/50 rounded-xl ${className}`} />
);

export default function DashboardLoading() {
    return (
        <div className="min-h-screen bg-[#0a0c10] flex text-white font-sans">
            {/* Sidebar Navigation */}
            <CustomerNavbar />

            {/* Main Content Area */}
            <main className="flex-1 flex flex-col h-screen overflow-hidden">
                {/* Header */}
                <Header />

                {/* Scrollable Content */}
                <div className="flex-1 overflow-y-auto p-8">
                    <header className="flex justify-between items-center mb-10">
                        <div>
                            {/* Title Skeleton */}
                            <Skeleton className="h-8 w-48 mb-2" />
                            {/* Subtitle Skeleton */}
                            <Skeleton className="h-4 w-64" />
                        </div>
                    </header>

                    <div className="flex flex-col xl:flex-row gap-6 items-start">
                        {/* LEFT COLUMN: Main Content */}
                        <div className="flex-1 flex flex-col gap-8 w-full">
                            {/* 1. Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {[...Array(4)].map((_, i) => (
                                    <Skeleton key={i} className="h-32 w-full" />
                                ))}
                            </div>

                            {/* 2. Activity Section: Table + Timeline */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                {/* Table Skeleton */}
                                <div className="lg:col-span-2 w-full">
                                    <div className="bg-[#0f1218] border border-gray-800 rounded-3xl p-6">
                                        <div className="flex justify-between mb-6">
                                            <Skeleton className="h-6 w-32" />
                                            <Skeleton className="h-8 w-24 rounded-full" />
                                        </div>
                                        <div className="space-y-4">
                                            {[...Array(5)].map((_, i) => (
                                                <Skeleton key={i} className="h-12 w-full" />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {/* Timeline Skeleton */}
                                <div className="lg:col-span-1 w-full">
                                    <div className="bg-[#0f1218] border border-gray-800 rounded-3xl p-6 h-[400px]">
                                        <Skeleton className="h-6 w-40 mb-6" />
                                        <div className="space-y-6">
                                            {[...Array(4)].map((_, i) => (
                                                <div key={i} className="flex gap-4">
                                                    <Skeleton className="h-10 w-1 bg-gray-800" />
                                                    <div className="flex-1">
                                                        <Skeleton className="h-4 w-24 mb-2" />
                                                        <Skeleton className="h-10 w-full" />
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Chart + Notifications) */}
                        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
                            {/* Chart Skeleton */}
                            <div className="bg-[#0f1218] border border-gray-800 rounded-3xl p-6 h-[400px] flex flex-col items-center justify-center">
                                <Skeleton className="h-48 w-48 rounded-full mb-6" />
                                <Skeleton className="h-4 w-32 mb-2" />
                                <Skeleton className="h-8 w-24" />
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}