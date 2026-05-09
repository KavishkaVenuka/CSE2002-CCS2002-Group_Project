"use client"

import {
  FileText, CheckSquare, Package, AlertCircle,
} from "lucide-react"
import { T, STATUS_MAP } from "@/lib/tokens"
import { StatCard } from "@/components/customer/StatCard"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { Panel } from "@/components/ui/Panel"
import { OrderRow } from "@/components/customer/OrderRow"
import { QuotationCard } from "@/components/customer/QuotationCard"
import { ActivityItem } from "@/components/customer/ActivityItem"
import { GlobalStatCard } from "@/components/ui/GlobalStatCard"

// ─── Data ────────────────────────────────────────────────────────────────────
const STATS = [
  {
    label: "Active Orders",
    value: 5,
    delta: "+2 this week",
    positive: true,
    icon: Package,
    color: T.primary,
    bg: T.primaryBg,
  },
  {
    label: "Pending Quotations",
    value: 3,
    delta: "+1 new today",
    positive: true,
    icon: FileText,
    color: T.blue,
    bg: T.blueBg,
  },
  {
    label: "Delivered",
    value: 12,
    delta: "+3 this month",
    positive: true,
    icon: CheckSquare,
    color: T.green,
    bg: T.greenBg,
  },
  {
    label: "Pending Payment",
    value: 2,
    delta: "Requires action",
    positive: false,
    icon: AlertCircle,
    color: T.red,
    bg: T.redBg,
  },
]

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
      <main style={{
        flex: 1, overflow: "auto",
        padding: "24px 28px",
        display: "flex", flexDirection: "column", gap: 20,
      }}>

        {/* ── GLOBAL STAT CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <GlobalStatCard
            iconSvgOrEmoji={<Package className="w-7 h-7 text-[#56600c]" />}
            introTitle={STATS[0].label}
            orderCount={STATS[0].value as number}
            monetaryValue={STATS[0].value}
            footerText={STATS[0].delta}
            themeClasses={{
              cardBackground: "bg-[#defa08]",
              iconContainerBackground: "bg-[#d1dd6c]",
              titleTextColor: "bg-[#d1dd6c] text-black rounded-2xl px-4 h-14 flex items-center",
              orderCountContainer: "bg-white",
              orderCountText: "text-black",
              monetaryContainer: "bg-[#56600c]",
              monetaryText: "text-white",
              footerContainer: "bg-[#d1dd6c]",
              footerText: "text-[#56600c] font-bold",
            }}
          />
          <GlobalStatCard
            iconSvgOrEmoji={<FileText className="w-7 h-7 text-blue-600" />}
            introTitle={STATS[1].label}
            orderCount={STATS[1].value as number}
            monetaryValue={STATS[1].value}
            footerText={STATS[1].delta}
            themeClasses={{
              cardBackground: "bg-[#A5E6DC]",
              iconContainerBackground: "bg-[#0C4A60]",
              titleTextColor: "bg-[#0C4A60] text-white rounded-2xl px-4 h-14 flex items-center",
              orderCountContainer: "bg-white",
              orderCountText: "text-[#0C4A60]",
              monetaryContainer: "bg-[#1876D1]",
              monetaryText: "text-white",
              footerContainer: "bg-[#0C4A60]",
              footerText: "text-white font-bold",
            }}
          />
          
          <GlobalStatCard
            iconSvgOrEmoji={<AlertCircle className="w-7 h-7 text-rose-600" />}
            introTitle={STATS[3].label}
            orderCount={STATS[3].value as number}
            monetaryValue={STATS[3].value}
            footerText={STATS[3].delta}
            themeClasses={{
              cardBackground: "bg-[#F5C369]",
              iconContainerBackground: "bg-[#99430F]",
              titleTextColor: "bg-[#99430F] text-white rounded-2xl px-4 h-14 flex items-center",
              orderCountContainer: "bg-white",
              orderCountText: "text-[#99430F]",
              monetaryContainer: "bg-[#D32F2F]",
              monetaryText: "text-white",
              footerContainer: "bg-[#99430F]",
              footerText: "text-white font-bold",
            }}
          />
        </div>

        {/* ── RECENT ACTIVITY ────────────────────────────────────────────── */}
        <Panel title="Recent Activity" noTopPad>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          }}>
            {ACTIVITY.map((item, i) => (
              <ActivityItem
                key={i}
                item={item}
                isLast={i === ACTIVITY.length - 1}
              />
            ))}
          </div>
        </Panel>

      </main>
    </>
  )
}