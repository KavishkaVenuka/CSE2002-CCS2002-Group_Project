"use client"

import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"
import { T, font } from "@/lib/tokens"

interface PanelProps {
  title: string
  badge?: number | string
  badgeColor?: string
  badgeBg?: string
  children: ReactNode
  noTopPad?: boolean
}

export function Panel({ title, badge, badgeColor, badgeBg, children, noTopPad }: PanelProps) {
  return (
    <div style={{
      background: T.card,
      border: `1px solid ${T.border}`,
      borderRadius: 11,
      overflow: "hidden",
    }}>
      {/* Panel header */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "14px 20px",
        borderBottom: `1px solid ${T.border}`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
          <span style={{
            fontSize: 13.5, fontWeight: 700, color: T.t1,
            letterSpacing: "-0.025em",
          }}>
            {title}
          </span>
          {badge !== undefined && (
            <span style={{
              fontSize: 11, fontWeight: 600,
              background: badgeBg, color: badgeColor,
              padding: "2px 8px", borderRadius: 100,
              letterSpacing: "0.01em",
            }}>
              {badge}
            </span>
          )}
        </div>
        <button style={{
          display: "flex", alignItems: "center", gap: 3,
          fontSize: 12, color: T.t3,
          background: "none", border: "none",
          cursor: "pointer", padding: 0,
          fontFamily: font,
        }}>
          View all <ChevronRight size={13} strokeWidth={2} />
        </button>
      </div>

      {/* Panel body */}
      <div style={{ paddingTop: noTopPad ? 0 : undefined }}>
        {children}
      </div>
    </div>
  )
}
