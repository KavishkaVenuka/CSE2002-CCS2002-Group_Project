'use client';

import { Wallet, Building2, Banknote } from 'lucide-react';
import { AdminSidebar } from "@/components/admin/Sidebar";

export default function FinanceManagementLoading() {
  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 p-8 overflow-x-hidden">

        {/* Header Skeleton */}
        <div className="bg-nb-yellow border-4 border-nb-black p-8 shadow-nb mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-8 h-8 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            <div className="h-5 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>
          <div className="h-12 w-64 bg-[#d4ede9] border-2 border-nb-black shimmer mb-4"></div>
          <div className="h-4 w-96 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
        </div>

        {/* Stats Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6 mb-8">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="bg-nb-cyan border-4 border-nb-black p-6 shadow-nb">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 bg-nb-white border-2 border-nb-black shimmer"></div>
                <div className="h-4 w-24 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
              </div>
              <div className="h-8 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
            </div>
          ))}
        </div>

        {/* Bank Accounts Section Skeleton */}
        <div className="bg-white border-4 border-nb-black shadow-nb mb-8">
          <div className="bg-nb-orange border-b-4 border-nb-black p-6">
            <div className="h-6 w-64 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>
          <div className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-nb-bg border-4 border-nb-black p-5 shadow-[4px_4px_0px_0px_#000]">
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="flex-1">
                      <div className="h-4 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                      <div className="h-3 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                      <div className="h-3 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </div>
                  </div>
                  <div className="bg-white border-2 border-nb-black p-3 shadow-nb-sm">
                    <div className="h-2 w-20 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                    <div className="h-6 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Forms Section Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Add Entry Form */}
          <div className="bg-white border-4 border-nb-black shadow-nb">
            <div className="bg-nb-blue border-b-4 border-nb-black p-6">
              <div className="h-6 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="p-8 space-y-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i}>
                  <div className="h-3 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                  <div className="h-12 w-full bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                </div>
              ))}
              <div className="h-12 w-full bg-nb-yellow border-2 border-nb-black shimmer"></div>
            </div>
          </div>

          {/* Recent Finance Log */}
          <div className="bg-white border-4 border-nb-black shadow-nb">
            <div className="bg-nb-purple border-b-4 border-nb-black p-6">
              <div className="h-6 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>
            <div className="p-8 space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-nb-bg border-4 border-nb-black">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="w-12 h-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-3 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      <div className="h-2 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </div>
                  </div>
                  <div className="h-6 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer ml-4"></div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Table Section Skeleton */}
        <div className="bg-white border-4 border-nb-black shadow-nb">
          <div className="bg-nb-yellow border-b-4 border-nb-black p-6">
            <div className="h-6 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>
          <div className="p-6 border-b-4 border-nb-black flex flex-col md:flex-row gap-4 bg-nb-bg">
            <div className="flex-1 h-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            <div className="w-full md:w-64 h-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-nb-gray text-nb-black">
                  <th className="p-4 border-b-4 border-nb-black h-10"></th>
                  <th className="p-4 border-b-4 border-nb-black h-10"></th>
                  <th className="p-4 border-b-4 border-nb-black h-10"></th>
                  <th className="p-4 border-b-4 border-nb-black h-10"></th>
                  <th className="p-4 border-b-4 border-nb-black h-10"></th>
                  <th className="p-4 border-b-4 border-nb-black h-10"></th>
                  <th className="p-4 border-b-4 border-nb-black h-10"></th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((i) => (
                  <tr key={i} className="border-b border-nb-black/20">
                    <td className="p-4"><div className="h-4 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                    <td className="p-4"><div className="h-4 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                    <td className="p-4"><div className="h-4 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                    <td className="p-4"><div className="h-4 w-36 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                    <td className="p-4"><div className="h-4 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                    <td className="p-4"><div className="h-4 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer"></div></td>
                    <td className="p-4 text-right"><div className="h-8 w-8 bg-nb-red border-2 border-nb-black shimmer ml-auto"></div></td>
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
