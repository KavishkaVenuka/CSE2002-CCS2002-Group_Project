"use client"

import { Clock, RefreshCw, XCircle, Wallet, TrendingUp } from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

export default function Loading() {
  const STAT_CARDS_SKELETON = [
    { title: "TOTAL RECEIVED", icon: TrendingUp, color: "bg-nb-green/30" },
    { title: "IN SETTLEMENT", icon: Clock, color: "bg-nb-yellow/30" },
    { title: "TRANSACTIONS", icon: RefreshCw, color: "bg-nb-cyan/30" },
    { title: "UNSUCCESSFUL", icon: XCircle, color: "bg-red-400/30" },
  ]

  return (
    <>
      <Header title="Payment Status" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STAT_CARDS_SKELETON.map((stat, i) => (
            <div
              key={i}
              className="bg-white border-[3.5px] border-black shadow-nb p-7 relative rounded-none"
            >
              {/* Badge placeholder */}
              <div className="absolute top-5 right-5 w-10 h-4 bg-gray-200 border-[1.5px] border-black/10 rounded-none shimmer"></div>

              {/* Icon container placeholder */}
              <div className={`w-14 h-14 border-[2.5px] border-black flex items-center justify-center mb-8 shadow-nb-sm ${stat.color} rounded-none shimmer`}>
                <stat.icon size={26} className="text-black/40" strokeWidth={2.5} />
              </div>

              {/* Content details placeholder */}
              <div className="mt-2 space-y-1.5">
                <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                <div className="h-9 w-32 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel
          title="Transaction Ledger"
          icon={<Wallet size={18} className="text-nb-cyan" />}
          noTopPad
          badge={
            <div className="flex items-center gap-3">
              {/* Search placeholder */}
              <div className="w-48 sm:w-64 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
              {/* Dropdown status filter placeholder */}
              <div className="w-24 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
              {/* Refresh button placeholder */}
              <div className="w-8 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
            </div>
          }
        >
          <div className="flex flex-col min-h-[450px] overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 px-8 py-6 border-b-[2.5px] border-black/5 text-gray-400 font-display font-black text-[10px] uppercase tracking-[0.2em]">
                <div>TX ID</div>
                <div>Order/Invoice</div>
                <div className="text-right">Amount</div>
                <div className="text-center">Method</div>
                <div className="text-center">Status</div>
                <div className="text-right">Actions</div>
              </div>

              {/* Table Content Skeletons */}
              <div className="flex-1 flex flex-col">
                {[1, 2, 3, 4, 5].map((item, i) => (
                  <div
                    key={i}
                    className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 items-center px-8 py-6 border-b border-black/5 bg-white"
                  >
                    {/* TX ID */}
                    <div className="h-4 w-28 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
                    {/* Order/Invoice details */}
                    <div className="space-y-1.5">
                      <div className="h-4 w-24 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
                      <div className="h-3 w-32 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
                    </div>
                    {/* Amount */}
                    <div className="h-4 w-24 bg-gray-300 border border-black/10 rounded-none shimmer ml-auto"></div>
                    {/* Method */}
                    <div className="flex justify-center">
                      <div className="w-16 h-5 bg-gray-200 border-[2px] border-black shadow-nb-sm shimmer"></div>
                    </div>
                    {/* Status */}
                    <div className="flex justify-center">
                      <div className="w-16 h-5 bg-gray-200 border-[2px] border-black shadow-nb-sm shimmer"></div>
                    </div>
                    {/* Actions */}
                    <div className="flex justify-end">
                      <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
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
