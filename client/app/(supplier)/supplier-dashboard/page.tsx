"use client"

import { Package, ClipboardList, CreditCard, Search, Bell, Plus, ShoppingCart, DollarSign } from "lucide-react"
import { GlobalStatCard } from "@/components/common/GlobalStatCard"
import { Panel } from "@/components/common/Panel"
import { Header } from "@/components/supplier/Header"

// ─── Data ────────────────────────────────────────────────────────────────────
const REQUIREMENTS = [
  { id: "REQ-20240115", customer: "Acme Corp",       date: "2024-01-15", status: "new",         items: 3 },
  { id: "REQ-20240114", customer: "XYZ Industries",  date: "2024-01-14", status: "quoted",      items: 5 },
  { id: "REQ-20240113", customer: "Tech Solutions",  date: "2024-01-13", status: "in-progress", items: 2 },
]

const ORDERS = [
  { id: "ORD-20240115", customer: "Acme Corp",       date: "2024-01-15", status: "dispatched", amount: 147400 },
  { id: "ORD-20240114", customer: "XYZ Industries",  date: "2024-01-14", status: "ready",      amount: 165200 },
  { id: "ORD-20240113", customer: "Tech Solutions",  date: "2024-01-13", status: "preparing",  amount:  89500 },
]

const PAYMENTS = [
  { payId: "PAY-20240114", ordId: "ORD-20240114", customer: "XYZ Industries",    amount: 165200, due: "2024-02-13", status: "pending" },
  { payId: "PAY-20240112", ordId: "ORD-20240112", customer: "Global Enterprises", amount: 201000, due: "2024-02-11", status: "pending" },
]

// ─── Badge helpers ────────────────────────────────────────────────────────────
const REQ_BADGE: Record<string, { bg: string; label: string }> = {
  "new":         { bg: "bg-nb-cyan",   label: "new" },
  "quoted":      { bg: "bg-nb-green",  label: "quoted" },
  "in-progress": { bg: "bg-nb-yellow", label: "in-progress" },
}
const ORD_BADGE: Record<string, { bg: string; label: string }> = {
  "dispatched": { bg: "bg-nb-green",  label: "dispatched" },
  "ready":      { bg: "bg-nb-cyan",   label: "ready" },
  "preparing":  { bg: "bg-nb-orange", label: "preparing" },
}

export default function SupplierDashboard() {
  return (
    <>
      <Header title="Supplier Dashboard" />

      {/* ── Main Content ────────────────────────────────────────────── */}
      <main className="flex-1 overflow-auto p-6 flex flex-col gap-6 bg-nb-bg">

        {/* ── KPI STAT CARDS ──────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Total Orders — Cyan */}
          <GlobalStatCard
            iconSvgOrEmoji={<Package className="w-6 h-6 text-white" />}
            introTitle="New Requirements"
            orderCount={24}
            monetaryValue="Rs.48k"
            footerText="+3 this week"
            themeClasses={{
              cardBackground:          "bg-nb-cyan",
              iconContainerBackground: "bg-black",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-[#0E7490]",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#155E75]",
              footerText:              "text-white",
            }}
          />

          {/* Pending Quotations — Yellow */}
          <GlobalStatCard
            iconSvgOrEmoji={<ClipboardList className="w-6 h-6 text-white" />}
            introTitle="Pending Quotations"
            orderCount={8}
            monetaryValue="Rs.12k"
            footerText="+2 new today"
            themeClasses={{
              cardBackground:          "bg-nb-yellow",
              iconContainerBackground: "bg-black",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-[#713F12]",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#a16207]",
              footerText:              "text-white",
            }}
          />

          {/* Earnings — Green */}
          <GlobalStatCard
            iconSvgOrEmoji={<CreditCard className="w-6 h-6 text-white" />}
            introTitle="Total Revenue"
            orderCount={12}
            monetaryValue="Rs.124k"
            footerText="+Rs.8k this month"
            themeClasses={{
              cardBackground:          "bg-nb-green",
              iconContainerBackground: "bg-black",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-[#166534]",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#14532D]",
              footerText:              "text-white",
            }}
          />
        </section>

        {/* ── SECTION DIVIDER ─────────────────────────────────────────── */}
        <div className="nb-divider" />

        {/* ── 2-COLUMN GRID: RECENT REQUIREMENTS & RECENT ORDERS ──────── */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Requirements */}
          <div>
            <h2 className="font-display font-black text-xl text-black mb-4">
              Recent Requirements
            </h2>
            <Panel title="Recent Requirements" noTopPad badge={REQUIREMENTS.length}>
              <div className="flex flex-col">
                {REQUIREMENTS.map((req, i) => {
                  const badge = REQ_BADGE[req.status] || { bg: "bg-white", label: req.status }
                  return (
                    <div
                      key={req.id}
                      className={`
                        flex items-center justify-between p-4
                        ${i < REQUIREMENTS.length - 1 ? "border-b-[2px] border-black" : ""}
                        odd:bg-white even:bg-nb-bg hover:bg-nb-yellow
                        transition-colors duration-100 cursor-pointer
                      `}
                    >
                      <div>
                        <div className="font-mono font-bold text-sm text-black">{req.id}</div>
                        <div className="font-body text-xs text-gray-500 mt-1">{req.customer}</div>
                        <div className="font-mono text-xs text-gray-400 mt-0.5">{req.date}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-0.5 border-[2px] border-black text-black font-mono font-bold text-xs ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="font-mono text-xs text-black">{req.items} items</span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>
          </div>

          {/* Recent Orders */}
          <div>
            <h2 className="font-display font-black text-xl text-black mb-4">
              Recent Orders
            </h2>
            <Panel title="Recent Orders" noTopPad badge={ORDERS.length}>
              <div className="flex flex-col">
                {ORDERS.map((ord, i) => {
                  const badge = ORD_BADGE[ord.status] || { bg: "bg-white", label: ord.status }
                  return (
                    <div
                      key={ord.id}
                      className={`
                        flex items-center justify-between p-4
                        ${i < ORDERS.length - 1 ? "border-b-[2px] border-black" : ""}
                        odd:bg-white even:bg-nb-bg hover:bg-nb-yellow
                        transition-colors duration-100 cursor-pointer
                      `}
                    >
                      <div>
                        <div className="font-mono font-bold text-sm text-black">{ord.id}</div>
                        <div className="font-body text-xs text-gray-500 mt-1">{ord.customer}</div>
                        <div className="font-mono text-xs text-gray-400 mt-0.5">{ord.date}</div>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        <span className={`px-2 py-0.5 border-[2px] border-black text-black font-mono font-bold text-xs ${badge.bg}`}>
                          {badge.label}
                        </span>
                        <span className="font-mono font-bold text-sm text-black">
                          Rs.{ord.amount.toLocaleString()}
                        </span>
                      </div>
                    </div>
                  )
                })}
              </div>
            </Panel>
          </div>
        </section>

        {/* ── PENDING PAYMENTS ────────────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black text-xl text-black mb-4">
            Pending Payments
          </h2>
          <Panel title="Pending Payments" noTopPad badge={PAYMENTS.length}>
            <div className="overflow-x-auto">
              {/* Header */}
              <div className="grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_100px] gap-4 px-5 py-3 border-b-[2px] border-black bg-black text-white font-display font-black text-xs uppercase tracking-widest min-w-[700px]">
                <div>Payment ID</div>
                <div>Order ID</div>
                <div>Customer</div>
                <div>Amount</div>
                <div>Due Date</div>
                <div className="text-right">Status</div>
              </div>
              {/* Rows */}
              <div className="flex flex-col min-w-[700px]">
                {PAYMENTS.map((pay, i) => (
                  <div
                    key={pay.payId}
                    className={`
                      grid grid-cols-[1fr_1fr_1.5fr_1fr_1fr_100px] gap-4 items-center px-5 py-4
                      ${i < PAYMENTS.length - 1 ? "border-b-[2px] border-black" : ""}
                      odd:bg-white even:bg-nb-bg hover:bg-nb-yellow
                      transition-colors duration-100 cursor-pointer
                    `}
                  >
                    <div className="font-mono text-sm font-bold text-black">{pay.payId}</div>
                    <div className="font-mono text-sm font-bold text-nb-cyan hover:underline decoration-2">{pay.ordId}</div>
                    <div className="font-body text-sm text-black">{pay.customer}</div>
                    <div className="font-mono text-sm font-bold text-black">Rs.{pay.amount.toLocaleString()}</div>
                    <div className="font-mono text-sm text-black">{pay.due}</div>
                    <div className="flex justify-end">
                      <span className="px-2 py-0.5 bg-nb-yellow border-[2px] border-black text-black font-mono font-bold text-xs">
                        {pay.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Panel>
        </section>

      </main>
    </>
  )
}