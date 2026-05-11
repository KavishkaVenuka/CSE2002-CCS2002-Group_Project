"use client"

import {
  FileText, Package, AlertCircle,
} from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { Panel } from "@/components/ui/Panel"
import { ActivityItem } from "@/components/customer/ActivityItem"
import { GlobalStatCard } from "@/components/common/GlobalStatCard"

// ─── Data ─────────────────────────────────────────────────────────────────────
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

      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">

        {/* ── GLOBAL STAT CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Active Orders */}
          <GlobalStatCard
            iconSvgOrEmoji={<Package className="w-6 h-6 text-black" />}
            introTitle="Active Orders"
            orderCount={5}
            monetaryValue="Rs.1000"
            footerText="+2 this week"
            themeClasses={{
              cardBackground:          "bg-nb-yellow",
              iconContainerBackground: "bg-white",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-[#713F12]",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#92400E]",
              footerText:              "text-white font-bold",
            }}
          />

          {/* Pending Quotations */}
          <GlobalStatCard
            iconSvgOrEmoji={<FileText className="w-6 h-6 text-black" />}
            introTitle="Pending Quotations"
            orderCount={3}
            monetaryValue="Rs.1000"
            footerText="+1 new today"
            themeClasses={{
              cardBackground:          "bg-nb-cyan",
              iconContainerBackground: "bg-white",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-[#0E7490]",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#0C4A6E]",
              footerText:              "text-white font-bold",
            }}
          />

          {/* Pending Payment */}
          <GlobalStatCard
            iconSvgOrEmoji={<AlertCircle className="w-6 h-6 text-black" />}
            introTitle="Pending Payment"
            orderCount={2}
            monetaryValue="Rs.1000"
            footerText="Requires action"
            themeClasses={{
              cardBackground:          "bg-nb-orange",
              iconContainerBackground: "bg-white",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-nb-red",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#B91C1C]",
              footerText:              "text-white font-bold",
            }}
          />
        </div>

        {/* ── RECENT ACTIVITY ────────────────────────────────────────────── */}
        <Panel title="Recent Activity" noTopPad>
          <div className="grid grid-cols-1 md:grid-cols-4">
            {ACTIVITY.map((item, i) => (
              <ActivityItem
                key={i}
                item={item}
                isLast={i === ACTIVITY.length - 1}
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