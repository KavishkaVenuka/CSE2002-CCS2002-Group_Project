"use client"

import { LucideIcon, ArrowUpRight } from "lucide-react"
import { T, font } from "@/lib/tokens"

interface StatCardProps {
  stat: {
    label: string
    value: number | string
    delta: string
    positive: boolean
    icon: LucideIcon
    color: string
    bg: string
  }
}

export function StatCard({ stat }: StatCardProps) {
  const { label, value, delta, positive, icon: Icon, color, bg } = stat
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 11,
      padding: "20px 20px 18px",
      display: "flex", flexDirection: "column", gap: 14,
      position: "relative", overflow: "hidden",
    }}>
      {/* Top row: icon + arrow */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{
          width: 38, height: 38, borderRadius: 10,
          background: bg,
          display: "flex", alignItems: "center", justifyContent: "center",
        }}>
          <Icon size={18} color={color} strokeWidth={1.75} />
        </div>
        <button style={{
          color: T.t3, background: "none", border: "none",
          cursor: "pointer", padding: 4, borderRadius: 6,
          display: "flex",
        }}>
          <ArrowUpRight size={14} strokeWidth={1.75} />
        </button>
      </div>

      {/* Value + label */}
      <div>
        <div style={{
          fontSize: 32, fontWeight: 700, color: T.t1,
          letterSpacing: "-0.055em", lineHeight: 1,
          fontFamily: font,
        }}>
          {value}
        </div>
        <div style={{
          fontSize: 12, color: T.t3, marginTop: 7,
          fontWeight: 500, letterSpacing: "-0.005em",
        }}>
          {label}
        </div>
      </div>

      {/* Delta */}
      <div style={{
        fontSize: 11.5,
        color: positive ? color : T.red,
        fontWeight: 600,
        letterSpacing: "0.005em",
      }}>
        {delta}
      </div>

      {/* Subtle accent line at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        height: 2.5,
        background: color,
        opacity: 0.18,
        borderRadius: "0 0 11px 11px",
      }} />
    </div>
  )
}
