	import React from "react";
	import CustomerNavbar from "@/components/customer/CustomerNavbar";

	export default function CustomerDashboard() {
	    return (
		<div className="min-h-screen bg-[#0a0c10] flex text-white font-sans">
		    {/* Sidebar Navigation */}
		    <CustomerNavbar />

		    {/* Main Content Area */}
		    <main className="flex-1 p-8 overflow-y-auto h-screen">
		        {/* Top Bar / Header Area */}
		        <header className="flex justify-between items-center mb-10">
		            <div>
		                <h2 className="text-3xl font-semibold text-gray-100">Dashboard</h2>
		                <p className="text-gray-400 mt-1">Welcome back, Kavishka.</p>
		            </div>

		            {/* Placeholder for search/notifications or other header items */}
		            <div className="flex gap-4">
		                <div className="w-10 h-10 rounded-full bg-[#1c1f26] border border-gray-800 animate-pulse"></div>
		                <div className="w-10 h-10 rounded-full bg-[#1c1f26] border border-gray-800 animate-pulse"></div>
		            </div>
		        </header>

		        {/* Dashboard Content Grid */}
		        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
		            {/* Statistic Card 1 */}
		            <div className="bg-[#0f1218] p-6 rounded-3xl border border-gray-800 shadow-xl">
		                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Orders</h3>
		                <div className="text-4xl font-bold text-white mb-4">1,248</div>
		                <div className="text-sm text-green-400 flex items-center gap-1">
		                    <span>+12.5%</span>
		                    <span className="text-gray-500">vs last month</span>
		                </div>
		            </div>

		            {/* Statistic Card 2 */}
		            <div className="bg-[#0f1218] p-6 rounded-3xl border border-gray-800 shadow-xl">
		                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Pending Quotes</h3>
		                <div className="text-4xl font-bold text-white mb-4">8</div>
		                <div className="text-sm text-blue-400 flex items-center gap-1">
		                    <span>Active</span>
		                    <span className="text-gray-500">requests</span>
		                </div>
		            </div>

		            {/* Statistic Card 3 */}
		            <div className="bg-[#0f1218] p-6 rounded-3xl border border-gray-800 shadow-xl">
		                <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-2">Total Spent</h3>
		                <div className="text-4xl font-bold text-white mb-4">$42.5k</div>
		                <div className="text-sm text-gray-500 flex items-center gap-1">
		                    <span>Updated just now</span>
		                </div>
		            </div>
		        </div>


		        {/* Recent Activity Section */}
		        <div className="mt-8 bg-[#0f1218] rounded-3xl border border-gray-800 shadow-xl p-8">
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

		    </main>
		</div>
	    );
	}
