"use client"

import { useState } from "react"
import { Clock, Package, Send, Truck, CheckCircle2, ShoppingBag, Search, ChevronDown, Eye, X } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const ORDERS = [
  { id: "ORD-20240115", quoteRef: "QT-20240110", date: "2024-01-15", items: "3 items", amount: "$15,000", status: "delivered" },
  { id: "ORD-20240114", quoteRef: "QT-20240109", date: "2024-01-14", items: "5 items", amount: "$22,000", status: "in-transit" },
  { id: "ORD-20240113", quoteRef: "QT-20240108", date: "2024-01-13", items: "2 items", amount: "$8,500",  status: "dispatched" },
  { id: "ORD-20240112", quoteRef: "QT-20240107", date: "2024-01-12", items: "4 items", amount: "$18,000", status: "processing" },
  { id: "ORD-20240111", quoteRef: "QT-20240106", date: "2024-01-11", items: "3 items", amount: "$12,500", status: "pending" },
]

const STAT_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  pending:      { color: "bg-gray-200",  icon: Clock },
  processing:   { color: "bg-nb-orange", icon: Package },
  dispatched:   { color: "bg-[#E9D5FF]", icon: Send },
  "in-transit": { color: "bg-nb-cyan",   icon: Truck },
  delivered:    { color: "bg-nb-green",  icon: CheckCircle2 },
}

export default function MyOrdersPage() {
  return (
    <>
      <DashboardHeader title="My Orders" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">

        {/* ── STAT CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {Object.entries(STAT_CONFIG).map(([key, cfg]) => (
            <div key={key} className={`${cfg.color} border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-3 nb-interactive`}>
              <div className="w-11 h-11 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
                <cfg.icon size={20} strokeWidth={2.5} className="text-black" />
              </div>
              <div>
                <p className="font-body font-bold text-[10px] text-black uppercase tracking-wider capitalize">{key.replace("-"," ")}</p>
                <h3 className="font-display font-black text-2xl text-black leading-none">1</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE PANEL ────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">All Orders</h2>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <input type="text" placeholder="Search orders…" className="pl-9 pr-4 py-2 bg-white border-[2px] border-white font-body text-sm focus:outline-none w-48" />
              </div>
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 bg-nb-yellow border-[2px] border-white font-body font-bold text-sm text-black focus:outline-none cursor-pointer">
                  <option>All Status</option><option>Pending</option><option>Processing</option>
                  <option>Dispatched</option><option>In Transit</option><option>Delivered</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto">
            <div className="grid grid-cols-[1.4fr_1.2fr_1fr_70px_110px_150px_110px] px-6 py-3 border-b-[2px] border-black bg-nb-bg min-w-[900px]">
              {["Order ID","Quotation Ref","Order Date","Items","Amount","Status"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>
            <div className="min-w-[900px]">
              {ORDERS.map((ord, i) => {
                const cfg = STAT_CONFIG[ord.status]
                const StatusIcon = cfg.icon
                return (
                  <div key={ord.id} className={`grid grid-cols-[1.4fr_1.2fr_1fr_70px_110px_150px_110px] items-center px-6 py-4 hover:bg-nb-yellow/20 transition-colors ${i < ORDERS.length - 1 ? "border-b-[2px] border-black" : ""}`}>
                    <div className="font-mono text-sm font-bold text-black">{ord.id}</div>
                    <div className="font-mono text-xs text-black">{ord.quoteRef}</div>
                    <div className="font-mono text-xs text-black">{ord.date}</div>
                    <div className="font-body text-sm text-black">{ord.items}</div>
                    <div className="font-display font-black text-sm text-black">{ord.amount}</div>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase ${cfg.color}`}>
                        <StatusIcon size={10} strokeWidth={2.5} /> {ord.status}
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}