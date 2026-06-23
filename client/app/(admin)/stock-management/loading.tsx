'use client';

import React from 'react';
import { AdminSidebar } from "@/components/admin/Sidebar";
import { Package } from 'lucide-react';

export default function StockManagementLoading() {
  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-x-hidden">

        {/* Page Header Skeleton */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-nb-white border-2 border-nb-black p-6 shadow-nb">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-6 h-6 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              <div className="h-4 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="h-10 w-72 bg-[#d4ede9] border-2 border-nb-black shimmer mb-3"></div>
            <div className="h-4 w-96 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <div className="h-10 w-32 bg-nb-cyan border-2 border-nb-black shimmer"></div>
            <div className="h-10 w-40 bg-nb-green border-2 border-nb-black shimmer"></div>
            <div className="h-10 w-40 bg-nb-yellow border-2 border-nb-black shimmer"></div>
          </div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Cyan Card */}
          <div className="nb-card bg-nb-cyan p-6 border-2 border-nb-black">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
            </div>
            <div>
              <div className="h-3 w-32 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
              <div className="h-10 w-48 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
              <div className="h-4 w-40 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>
          </div>

          {/* Red Card */}
          <div className="nb-card bg-nb-red p-6 border-2 border-nb-black">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
            </div>
            <div>
              <div className="h-3 w-32 bg-white/30 border-2 border-nb-black shimmer mb-3"></div>
              <div className="h-10 w-20 bg-white/30 border-2 border-nb-black shimmer mb-2"></div>
              <div className="h-4 w-40 bg-white/30 border-2 border-nb-black shimmer"></div>
            </div>
          </div>

          {/* Green Card */}
          <div className="nb-card bg-nb-green p-6 border-2 border-nb-black">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
            </div>
            <div>
              <div className="h-3 w-32 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
              <div className="h-10 w-32 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
              <div className="h-4 w-48 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>
          </div>
        </div>

        {/* Inventory Items Table Skeleton */}
        <div className="nb-card bg-nb-white border-2 border-nb-black">
          <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
            <div className="h-5 w-40 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
            <div className="h-3 w-64 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>

          {/* Search & Filter Skeleton */}
          <div className="p-6 border-b-2 border-nb-black flex flex-col md:flex-row gap-4 bg-white">
            <div className="flex-1 relative">
              <div className="h-12 w-full bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="w-full md:w-64 h-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>

          {/* Table Skeleton */}
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b-2 border-nb-black bg-nb-bg">
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Item Name</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Category</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Quantity</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Cost Price</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Selling Price</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Profit Margin</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Status</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5, 6].map((rowIndex) => (
                  <tr key={rowIndex} className="border-b-2 border-nb-black bg-white">
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                        <div className="h-4 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="h-5 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-16 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-6 w-20 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-6 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer mx-auto"></div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-2 justify-center">
                        <div className="w-10 h-10 bg-nb-cyan border-2 border-nb-black shimmer"></div>
                        <div className="w-10 h-10 bg-nb-red border-2 border-nb-black shimmer"></div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -600px 0;
          }
          100% {
            background-position: 600px 0;
          }
        }

        .shimmer {
          background-image: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
          background-position: -600px 0;
        }
      `}</style>
    </div>
  );
}
