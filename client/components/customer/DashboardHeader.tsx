"use client"

import { Search, Bell, Plus } from "lucide-react"
import { T, font } from "@/lib/tokens"

interface DashboardHeaderProps {
  title: string
  dateString: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header style={{
      background: T.card,
      borderBottom: `1px solid ${T.border}`,
      padding: "0 28px",
      height: 62,
      display: "flex", alignItems: "center", gap: 14,
      flexShrink: 0,
    }}>
      {/* Page title */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 16, fontWeight: 700, color: T.t1,
          letterSpacing: "-0.035em",
        }}>
          {title}
        </div>
      </div>

      {/* Search */}
      <div style={{
        display: "flex", alignItems: "center", gap: 8,
        background: T.surface,
        border: `1px solid ${T.border}`,
        borderRadius: 8, padding: "8px 13px",
        width: 220, flexShrink: 0,
      }}>
        <Search size={13} color={T.t3} strokeWidth={1.75} />
        <span style={{ fontSize: 13, color: T.t3 }}>
          Search orders, quotes…
        </span>
      </div>

      {/* Notification bell */}
      <button style={{
        width: 38, height: 38, borderRadius: 9,
        background: T.surface,
        border: `1px solid ${T.border}`,
        display: "flex", alignItems: "center", justifyContent: "center",
        cursor: "pointer", position: "relative", flexShrink: 0,
      }}>
        <Bell size={15} color={T.t2} strokeWidth={1.75} />
        <div style={{
          position: "absolute", top: 9, right: 9,
          width: 6, height: 6, borderRadius: "50%",
          background: T.red, border: "1.5px solid #fff",
        }} />
      </button>

      {/* Primary CTA */}
      <button style={{
        display: "flex", alignItems: "center", gap: 7,
        padding: "9px 17px", borderRadius: 8,
        background: T.primary, color: "#fff",
        border: "none", cursor: "pointer",
        fontSize: 13, fontWeight: 600,
        fontFamily: font, letterSpacing: "-0.015em",
        flexShrink: 0,
      }}>
        <Plus size={13} strokeWidth={2.5} />
        New Requirement
      </button>
    </header>
  )
}
