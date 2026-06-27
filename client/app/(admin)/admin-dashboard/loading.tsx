'use client';

import React from 'react';

export default function AdminDashboardLoading() {
  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
        {/* Page Header Skeleton */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-nb-white border-2 border-nb-black p-2 shadow-nb">
          <div>
            <div className="h-10 w-64 bg-[#d4ede9] border-2 border-nb-black shimmer mb-3"></div>
            <div className="h-5 w-96 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>
          <div className="h-10 w-32 bg-nb-yellow border-2 border-nb-black shimmer"></div>
        </div>

        {/* KPI Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Green Card */}
          <div className="nb-card bg-nb-green p-6 border-2 border-nb-black">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
              <div className="w-16 h-6 bg-nb-white border-2 border-nb-black shimmer"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
              <div className="h-10 w-40 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
              <div className="h-4 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>
          </div>

          {/* Cyan Card */}
          <div className="nb-card bg-nb-cyan p-6 border-2 border-nb-black">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
              <div className="w-16 h-6 bg-nb-white border-2 border-nb-black shimmer"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
              <div className="h-10 w-40 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
              <div className="h-4 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>
          </div>

          {/* Yellow Card */}
          <div className="nb-card bg-nb-yellow p-6 border-2 border-nb-black">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
              <div className="w-16 h-6 bg-nb-white border-2 border-nb-black shimmer"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
              <div className="h-10 w-40 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
              <div className="h-4 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>
          </div>

          {/* Red Card */}
          <div className="nb-card bg-nb-red p-6 border-2 border-nb-black">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
              <div className="w-16 h-6 bg-nb-white border-2 border-nb-black shimmer"></div>
            </div>
            <div>
              <div className="h-3 w-24 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
              <div className="h-10 w-40 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
              <div className="h-4 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>
          </div>
        </div>

        {/* Pending Requests Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="nb-card bg-nb-white p-6 border-2 border-nb-black flex items-center justify-between">
              <div className="flex items-center gap-5">
                <div className="w-14 h-14 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                <div>
                  <div className="h-3 w-40 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                  <div className="h-8 w-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                </div>
              </div>
              <div className="w-12 h-12 bg-nb-yellow border-2 border-nb-black shimmer"></div>
            </div>
          ))}
        </div>

        {/* Charts Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <div className="nb-card bg-nb-white border-2 border-nb-black flex flex-col">
            <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
              <div className="h-5 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="p-6 flex-1">
              <div className="flex items-end justify-around h-72 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="flex flex-col items-center gap-2">
                    <div className={`w-12 bg-[#d4ede9] border-2 border-nb-black shimmer`} style={{ height: `${Math.random() * 200 + 60}px` }}></div>
                    <div className="h-3 w-8 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Expense Breakdown Chart */}
          <div className="nb-card bg-nb-white border-2 border-nb-black flex flex-col">
            <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
              <div className="h-5 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="p-6 flex-1 flex items-center justify-center">
              <div className="w-64 h-64 rounded-none border-4 border-nb-black bg-[#d4ede9] shimmer relative flex items-center justify-center">
                <div className="absolute w-40 h-40 border-4 border-nb-bg bg-nb-white"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activities Table Skeleton */}
        <div className="nb-card bg-nb-white border-2 border-nb-black">
          <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
            <div className="h-5 w-40 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>
          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b-2 border-nb-black bg-nb-bg">
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Type</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Entity</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Description</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-right">Amount</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Status</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4].map((rowIndex) => (
                  <tr key={rowIndex} className="border-b-2 border-nb-black">
                    <td className="p-4">
                      <div className="h-4 w-16 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-20 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </td>
                    <td className="p-4">
                      <div className="h-4 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-4 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer ml-auto"></div>
                    </td>
                    <td className="p-4 text-center">
                      <div className="h-6 w-20 bg-[#d4ede9] border-2 border-nb-black shimmer mx-auto"></div>
                    </td>
                    <td className="p-4 text-right">
                      <div className="h-4 w-16 bg-[#d4ede9] border-2 border-nb-black shimmer ml-auto"></div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Quick Links Skeleton */}
        <div className="nb-card bg-nb-white border-2 border-nb-black">
          <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
            <div className="h-5 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>
          <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
            {['bg-nb-cyan', 'bg-nb-green', 'bg-nb-orange', 'bg-nb-yellow'].map((color, idx) => (
              <div key={idx} className={`${color} border-2 border-nb-black p-6 flex flex-col items-start gap-4`}>
                <div className="w-10 h-10 bg-nb-white border-2 border-nb-black shimmer"></div>
                <div className="h-4 w-24 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
              </div>
            ))}
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
    </>
  );
}
