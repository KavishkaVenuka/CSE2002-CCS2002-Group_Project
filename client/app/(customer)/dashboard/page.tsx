import React from "react";
import CustomerNavbar from "@/components/customer/CustomerNavbar";
import Header from "@/components/ui/Header";
import StatCard from "@/components/customer/dashboard/StatCard";
import { FileText, FileClock, CreditCard, Truck } from "lucide-react";
import NotificationPanel from "@/components/dashboard/NotificationPanel";

export default function CustomerDashboard() {
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
                            <h2 className="text-3xl font-semibold text-gray-100">Dashboard</h2>
                            <p className="text-gray-400 mt-1">Welcome back, Kavishka.</p>
                        </div>
                    </header>

                    <div className="flex flex-col xl:flex-row gap-6 items-start">
                        {/* Left Column: Stats & Activity */}
                        <div className="flex-1 flex flex-col gap-8 w-full">
                            {/* Dashboard Content Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <StatCard
                                    title="Active Orders"
                                    value="3"
                                    icon={<FileText className="w-6 h-6" />}
                                    variant="blue"
                                />
                                <StatCard
                                    title="Pending Quotations"
                                    value="2"
                                    icon={<FileClock className="w-6 h-6" />}
                                    variant="orange"
                                />
                                <StatCard
                                    title="Payments Due"
                                    value="$1,200"
                                    icon={<CreditCard className="w-6 h-6" />}
                                    variant="red"
                                />
                                <StatCard
                                    title="Recently Delivered Items"
                                    value="5"
                                    icon={<Truck className="w-6 h-6" />}
                                    variant="green"
                                />
                            </div>

                            {/* Recent Activity Section */}
                            <div className="bg-[#0f1218] rounded-3xl border border-gray-800 shadow-xl p-8">
                                <h3 className="text-xl font-semibold text-gray-100 mb-6">Recent Activity</h3>
                                <div className="space-y-4">
                                    {[1, 2, 3].map((i) => (
                                        <div key={i} className="flex items-center justify-between p-4 bg-[#1c1f26]/50 rounded-2xl border border-gray-800/50 hover:border-gray-700 transition-colors">
                                            <div className="flex items-center gap-4">
                                                <div className="w-12 h-12 rounded-xl bg-blue-900/20 flex items-center justify-center text-blue-400">
                                                    {/* Icon placeholder */}
                                                    <div className="w-6 h-6 border-2 border-current rounded-md"></div>
                                                </div>
                                                <div>
                                                    <h4 className="font-medium text-gray-200">Order #293{i} Placed</h4>
                                                    <p className="text-sm text-gray-500">2 hours ago</p>
                                                </div>
                                            </div>
                                            <span className="text-sm font-medium text-gray-400">$1,200.00</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Notification Panel */}
                        <div className="shrink-0 w-full xl:w-auto">
                            <NotificationPanel />
                        </div>
                    </div>

                </div>
            </main>
        </div>
    );
}
