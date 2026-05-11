"use client"

import {
  FileText, Package, AlertCircle,
} from "lucide-react"
import { STATUS_MAP } from "@/lib/tokens"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { Panel } from "@/components/common/Panel"
import { OrderRow } from "@/components/customer/OrderRow"
import { QuotationCard } from "@/components/customer/QuotationCard"
import { ActivityItem } from "@/components/customer/ActivityItem"
import { GlobalStatCard } from "@/components/common/GlobalStatCard"

// ─── Data ────────────────────────────────────────────────────────────────────
const ORDERS = [
  { id: "ORD-20240115", items: 3, amount: 15000, status: "delivered", date: "Jan 15, 2024" },
  { id: "ORD-20240114", items: 5, amount: 22000, status: "in-transit", date: "Jan 14, 2024" },
  { id: "ORD-20240113", items: 2, amount: 8500, status: "dispatched", date: "Jan 13, 2024" },
]

const QUOTATIONS = [
  { id: "QT-20240115", req: "REQ-20240110", amount: 15000, expires: "Jan 25, 2024" },
  { id: "QT-20240112", req: "REQ-20240108", amount: 22000, expires: "Jan 22, 2024" },
]

const ACTIVITY = [
  { text: "Order ORD-20240115 delivered successfully", time: "2 hours ago", type: "green" },
  { text: "New quotation received for REQ-20240110", time: "5 hours ago", type: "blue" },
  { text: "Payment confirmed for INV-20240113", time: "1 day ago", type: "amber" },
  { text: "Order ORD-20240114 dispatched", time: "2 days ago", type: "amber" },
]

export default function CustomerDashboard() {
  return (
    <>
      <DashboardHeader title="Dashboard" dateString="Thursday, 24 April 2026" />

      {/* Scrollable content */}
      <main className="flex-1 overflow-auto p-6 flex flex-col gap-6 bg-nb-bg">

        {/* ── KPI STAT CARDS ──────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

          {/* Active Orders — Yellow */}
          <GlobalStatCard
            iconSvgOrEmoji={<Package className="w-6 h-6 text-white" />}
            introTitle="Active Orders"
            orderCount={5}
            monetaryValue="Rs.1000"
            footerText="+2 this week"
            themeClasses={{
              cardBackground: "bg-nb-yellow",
              iconContainerBackground: "bg-black",
              titleTextColor: "text-black",
              orderCountContainer: "bg-white",
              orderCountText: "text-black",
              monetaryContainer: "bg-[#713F12]",
              monetaryText: "text-white",
              footerContainer: "bg-[#a16207]",
              footerText: "text-white",
            }}
          />

          {/* Pending Quotations — Cyan */}
          <GlobalStatCard
            iconSvgOrEmoji={<FileText className="w-6 h-6 text-white" />}
            introTitle="Pending Quotations"
            orderCount={3}
            monetaryValue="Rs.1000"
            footerText="+1 new today"
            themeClasses={{
              cardBackground: "bg-nb-cyan",
              iconContainerBackground: "bg-black",
              titleTextColor: "text-black",
              orderCountContainer: "bg-white",
              orderCountText: "text-black",
              monetaryContainer: "bg-[#0E7490]",
              monetaryText: "text-white",
              footerContainer: "bg-[#155E75]",
              footerText: "text-white",
            }}
          />

          {/* Pending Payment — Orange/Red */}
          <GlobalStatCard
            iconSvgOrEmoji={<AlertCircle className="w-6 h-6 text-white" />}
            introTitle="Pending Payment"
            orderCount={2}
            monetaryValue="Rs.1000"
            footerText="Requires action"
            themeClasses={{
              cardBackground: "bg-nb-orange",
              iconContainerBackground: "bg-black",
              titleTextColor: "text-black",
              orderCountContainer: "bg-white",
              orderCountText: "text-black",
              monetaryContainer: "bg-nb-red",
              monetaryText: "text-white",
              footerContainer: "bg-[#991B1B]",
              footerText: "text-white",
            }}
          />
        </section>

        {/* ── SECTION DIVIDER ─────────────────────────────────────────── */}
        <div className="nb-divider" />

        {/* ── RECENT ACTIVITY ─────────────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black text-xl text-black mb-4">
            Recent Activity
          </h2>
          <Panel title="Recent Activity" noTopPad>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4">
              {ACTIVITY.map((item, i) => (
                <ActivityItem
                  key={i}
                  item={item}
                  isLast={i === ACTIVITY.length - 1}
                />
              ))}
            </div>
          </Panel>
        </section>

        {/* ── RECENT ORDERS ───────────────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black text-xl text-black mb-4">
            Recent Orders
          </h2>
          <Panel title="Recent Orders" badge={ORDERS.length} noTopPad>
            {/* Table header */}
            <div className="grid grid-cols-[1fr_48px_90px_110px] px-5 py-2 border-b-[2px] border-black bg-nb-bg">
              {["Order ID", "Items", "Amount", "Status"].map((col) => (
                <div
                  key={col}
                  className="font-display font-black text-xs uppercase tracking-widest text-black"
                >
                  {col}
                </div>
              ))}
            </div>
            {ORDERS.map((order, i) => (
              <OrderRow
                key={order.id}
                order={order}
                status={STATUS_MAP[order.status as keyof typeof STATUS_MAP] ?? { color: "#000", bg: "#F5F0E8", label: order.status }}
                isLast={i === ORDERS.length - 1}
              />
            ))}
          </Panel>
        </section>

        {/* ── QUOTATIONS ──────────────────────────────────────────────── */}
        <section>
          <h2 className="font-display font-black text-xl text-black mb-4">
            Open Quotations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {QUOTATIONS.map((q) => (
              <QuotationCard key={q.id} q={q} />
            ))}
          </div>
        </section>

      </main>
    </>
  )
}