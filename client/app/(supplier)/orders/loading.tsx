"use client"

import { ShoppingCart, Clock, CheckCircle, Truck, Package } from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

export default function Loading() {
  const STAT_CARDS_SKELETON = [
    { title: "Total Orders", icon: ShoppingCart, color: "bg-gray-200" },
    { title: "Pending", icon: Clock, color: "bg-nb-yellow/30" },
    { title: "Confirmed", icon: CheckCircle, color: "bg-[#c084fc]/30" },
    { title: "Dispatched", icon: Truck, color: "bg-nb-green/30" },
    { title: "Delivered", icon: Package, color: "bg-nb-cyan/30" },
  ]

  return (
    <>
      <Header title="Order Management" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STAT_CARDS_SKELETON.map((stat, i) => (
            <div
              key={i}
              className="bg-white border-[3px] border-black shadow-nb p-5 flex flex-col gap-3 rounded-none"
            >
              <div className={`w-10 h-10 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${stat.color}`}>
                <stat.icon size={20} strokeWidth={3} className="text-black/40" />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <div className="h-6 w-16 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel
          title="All Orders"
          noTopPad
          badge={
            <div className="flex items-center gap-3">
              {/* Search placeholder */}
              <div className="w-44 sm:w-64 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
              {/* Select Status Dropdown placeholder */}
              <div className="w-24 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
              {/* Refresh button placeholder */}
              <div className="w-8 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_140px_100px] gap-4 px-6 py-4 border-b-[3px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[1000px]">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Items</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="flex flex-col min-w-[1000px] min-h-[200px]">
              {[1, 2, 3, 4, 5].map((item, i) => (
                <div
                  key={i}
                  className={`
                    grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_140px_100px] gap-4 items-center px-6 py-5
                    ${i < 4 ? "border-b-[2px] border-black" : ""}
                    bg-white
                  `}
                >
                  {/* Order ID */}
                  <div className="h-4 w-24 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
                  {/* Customer */}
                  <div className="h-4 w-40 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
                  {/* Items */}
                  <div className="h-4 w-12 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
                  {/* Amount */}
                  <div className="h-4 w-24 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
                  {/* Date */}
                  <div className="h-4 w-20 bg-gray-200 border border-black/10 rounded-none shimmer"></div>

                  {/* Status Badge */}
                  <div>
                    <div className="w-16 h-5 bg-gray-200 border-[2px] border-black shadow-nb-sm shimmer"></div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]"></div>
                    <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]"></div>
                  </div>
                </div>
              ))}
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
