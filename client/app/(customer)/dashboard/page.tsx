import React from "react";
import CustomerNavbar from "@/components/customer/CustomerNavbar";
import Header from "@/components/ui/Header";
import StatCard from "@/components/customer/dashboard/StatCard";
import { FileText, FileClock, CreditCard, Truck } from "lucide-react";
import RequirementRequestTable from "@/components/customer/dashboard/RequestTable";
import TrackingTimeline from "@/components/customer/dashboard/TrackingTimeline"
import QuotationChart from "@/components/customer/dashboard/QuotationChart"

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
                        {/* LEFT COLUMN: Main Content */}
                        <div className="flex-1 flex flex-col gap-8 w-full">
                            {/* 1. Stats Grid */}
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

                            {/* 2. Activity Section: Table + Timeline */}
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
                                <div className="lg:col-span-2 w-full">
                                    <RequirementRequestTable />
                                </div>
                                <div className="lg:col-span-1 w-full">
                                    <TrackingTimeline />
                                </div>
                            </div>
                        </div>

                        {/* RIGHT COLUMN: Sidebar (Chart + Notifications) */}
                        <div className="w-full xl:w-[320px] shrink-0 flex flex-col gap-6">
                            <QuotationChart />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
