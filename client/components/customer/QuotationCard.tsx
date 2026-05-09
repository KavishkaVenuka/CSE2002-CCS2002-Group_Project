"use client"

import { Clock } from "lucide-react"
import { T, font, mono } from "@/lib/tokens"

interface QuotationProps {
  q: {
    id: string
    req: string
    amount: number
    expires: string
  }
}

export function QuotationCard({ q }: QuotationProps) {
  return (
    <div style={{
      border: `1px solid ${T.primaryBorder}`,
      borderLeft: `3px solid ${T.primary}`,
      borderRadius: 9,
      padding: "14px 16px",
      background: T.primaryBg,
    }}>
      {/* Header row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
        marginBottom: 12,
      }}>
        <div>
          <div style={{
            fontFamily: mono,
            fontSize: 12.5, fontWeight: 500,
            color: T.t1, letterSpacing: "-0.01em",
          }}>
            {q.id}
          </div>
          <div style={{ fontSize: 11, color: T.t2, marginTop: 3 }}>
            Ref: {q.req}
          </div>
        </div>
        <div style={{
          fontFamily: mono,
          fontSize: 16, fontWeight: 700,
          color: T.t1, letterSpacing: "-0.03em",
        }}>
          ${q.amount.toLocaleString()}
        </div>
      </div>

      {/* Footer row */}
      <div style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 5 }}>
          <Clock size={11} color={T.t3} strokeWidth={1.75} />
          <span style={{ fontSize: 11, color: T.t3 }}>
            Expires {q.expires}
          </span>
        </div>
        <button style={{
          padding: "5px 14px", borderRadius: 7,
          background: T.primary, color: "#fff",
          border: "none", cursor: "pointer",
          fontSize: 12, fontWeight: 600,
          fontFamily: font, letterSpacing: "-0.01em",
        }}>
          Review →
        </button>
      </div>
    </div>
  )
}
