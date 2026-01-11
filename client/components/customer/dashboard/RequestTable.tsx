"use client";

import React from "react";
import { Eye, MoreHorizontal } from "lucide-react";

type RequestStatus = "Pending" | "Processed" | "Fulfilled";

interface RequestItem {
    name: string;
    quantity: number;
}

interface Request {
    id: string;
    items: RequestItem[];
    date: string;
    status: RequestStatus;
}

const mockRequests: Request[] = [
    {
        id: "REQ-101",
        items: [
            { name: "Product A", quantity: 10 },
            { name: "Product B", quantity: 5 },
        ],
        date: "Oct 25, 2023",
        status: "Pending",
    },
    {
        id: "REQ-100",
        items: [
            { name: "Product C", quantity: 50 },
        ],
        date: "Oct 20, 2023",
        status: "Processed",
    },
    {
        id: "REQ-099",
        items: [
            { name: "Product D", quantity: 100 },
        ],
        date: "Oct 15, 2023",
        status: "Fulfilled",
    },
];

export default function RequirementRequestTable() {
    const getStatusStyles = (status: RequestStatus) => {
        switch (status) {
            case "Pending":
                return "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20";
            case "Processed":
                return "bg-blue-500/10 text-blue-500 border border-blue-500/20";
            case "Fulfilled":
                return "bg-green-500/10 text-green-500 border border-green-500/20";
            default:
                return "bg-gray-500/10 text-gray-500 border border-gray-500/20";
        }
    };

    return (
        <div className="bg-[#0f1218] rounded-3xl border border-gray-800 shadow-xl overflow-hidden w-full">
            {/* Header */}
            <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-100">Requirements Requests table</h3>
                <button className="text-gray-400 hover:text-white transition-colors">
                    <MoreHorizontal className="w-5 h-5" />
                </button>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-[#161920] text-gray-200 font-medium uppercase text-xs tracking-wider">
                        <tr>
                            <th scope="col" className="px-6 py-4 rounded-tl-lg">Request ID</th>
                            <th scope="col" className="px-6 py-4">Items</th>
                            <th scope="col" className="px-6 py-4">Quantity</th>
                            <th scope="col" className="px-6 py-4">Date</th>
                            <th scope="col" className="px-6 py-4">Status</th>
                            <th scope="col" className="px-6 py-4 text-center rounded-tr-lg">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                        {mockRequests.map((request) => (
                            <tr key={request.id} className="hover:bg-[#1c1f26]/50 transition-colors group">
                                <td className="px-6 py-4 font-medium text-white">
                                    {request.id}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        {request.items.map((item, idx) => (
                                            <span key={idx} className="block text-gray-300">{item.name}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex flex-col gap-1">
                                        {request.items.map((item, idx) => (
                                            <span key={idx} className="block text-gray-300 font-mono">{item.quantity}</span>
                                        ))}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {request.date}
                                </td>
                                <td className="px-6 py-4">
                                    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${getStatusStyles(request.status)}`}>
                                        {request.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-center">
                                    <button
                                        className="text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 p-2 rounded-full transition-all"
                                        aria-label="View details"
                                    >
                                        <Eye className="w-4 h-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Footer / Empty State */}
            {mockRequests.length === 0 && (
                <div className="p-8 text-center text-gray-500">
                    No requests found.
                </div>
            )}
        </div>
    );
}