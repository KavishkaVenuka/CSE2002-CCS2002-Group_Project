"use client"

import { ClipboardList, Package, CreditCard } from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

export default function SupplierDashboardLoading() {
  return (
    <>
      <Header title="Supplier Dashboard" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STATS ROW SKELETON ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[
            { color: "bg-nb-cyan/30" },
            { color: "bg-nb-yellow/30" },
            { color: "bg-nb-green/30" },
            { color: "bg-nb-orange/30" },
          ].map((stat, i) => (
            <div
              key={i}
              className="bg-white border-[3.5px] border-black shadow-nb p-7 relative rounded-none"
            >
              {/* Top-right badge placeholder */}
              <div className="absolute top-5 right-5 w-10 h-4 bg-gray-200 border-[1.5px] border-black/10 rounded-none shimmer"></div>

              {/* Icon box placeholder */}
              <div className={`w-14 h-14 border-[2.5px] border-black flex items-center justify-center mb-8 shadow-nb-sm ${stat.color} rounded-none shimmer`} />

              {/* Text details placeholder */}
              <div className="space-y-2">
                <div className="h-3 w-28 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
                <div className="h-9 w-20 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── RECENT ACTIVITY ROW SKELETON ──────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Panel
            title="Recent Requirements"
            icon={<ClipboardList size={18} className="text-nb-cyan" />}
            noTopPad
            badge={
              <div className="w-16 h-7 bg-black/10 border-[2px] border-black rounded-none shimmer" />
            }
          >
            <div className="divide-y-[2px] divide-black/5 bg-gray-50/30">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon placeholder */}
                    <div className="w-10 h-10 bg-nb-cyan/20 border-2 border-black/10 rounded-none shimmer flex items-center justify-center" />
                    {/* Details */}
                    <div className="space-y-2">
                      <div className="h-3 w-20 bg-gray-200 border border-black/10 rounded-none shimmer" />
                      <div className="h-4 w-32 bg-gray-300 border border-black/10 rounded-none shimmer" />
                      <div className="h-3 w-40 bg-gray-200 border border-black/10 rounded-none shimmer" />
                    </div>
                  </div>
                  {/* Arrow placeholder */}
                  <div className="w-8 h-8 rounded-none border-2 border-black/10 bg-gray-100 shimmer" />
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            title="Recent Orders"
            icon={<Package size={18} className="text-nb-green" />}
            noTopPad
            badge={
              <div className="w-24 h-7 bg-black/10 border-[2px] border-black rounded-none shimmer" />
            }
          >
            <div className="divide-y-[2px] divide-black/5 bg-gray-50/30">
              {[1, 2, 3].map((i) => (
                <div key={i} className="p-6 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    {/* Icon placeholder */}
                    <div className="w-10 h-10 bg-nb-green/20 border-2 border-black/10 rounded-none shimmer flex items-center justify-center" />
                    {/* Details */}
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-gray-200 border border-black/10 rounded-none shimmer" />
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-16 bg-gray-300 border border-black/10 rounded-none shimmer" />
                        <div className="h-4 w-12 bg-gray-200 border border-black/10 rounded-none shimmer" />
                      </div>
                    </div>
                  </div>
                  {/* Arrow placeholder */}
                  <div className="w-8 h-8 rounded-none border-2 border-black/10 bg-gray-100 shimmer" />
                </div>
              ))}
            </div>
          </Panel>
        </div>

        {/* ── PENDING PAYMENTS SKELETON ─────────────────────────────── */}
        <Panel
          title="Pending Payments"
          icon={<CreditCard size={18} className="text-nb-yellow" />}
          noTopPad
          badge={
            <div className="w-28 h-7 bg-black/10 border-[2px] border-black rounded-none shimmer" />
          }
        >
          <div className="overflow-x-auto bg-gray-50/30">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-[2.5px] border-black/5">
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Bill ID</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Due Date</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3].map((i) => (
                  <tr key={i} className="border-b-[2px] border-black/5">
                    <td className="px-8 py-5">
                      <div className="h-4 w-24 bg-gray-200 border border-black/10 rounded-none shimmer" />
                    </td>
                    <td className="px-8 py-5">
                      <div className="h-4 w-20 bg-gray-300 border border-black/10 rounded-none shimmer" />
                    </td>
                    <td className="px-8 py-5">
                      <div className="h-4 w-28 bg-gray-200 border border-black/10 rounded-none shimmer" />
                    </td>
                    <td className="px-8 py-5">
                      <div className="h-7 w-20 bg-black/10 border-[2px] border-black rounded-none shimmer" />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Panel>
      </main>

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
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 2s infinite linear;
          background-position: -600px 0;
        }
      `}</style>
    </>
  )
}
