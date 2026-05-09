"use client"

import { T, mono } from "@/lib/tokens"

interface OrderRowProps {
  order: {
    id: string
    date: string
    items: number
    amount: number
    status: string
  }
  status: {
    color: string
    bg: string
    label: string
  }
  isLast: boolean
}

export function OrderRow({ order, status, isLast }: OrderRowProps) {
  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 48px 90px 100px",
      padding: "13px 20px",
      alignItems: "center",
      borderBottom: isLast ? "none" : `1px solid ${T.borderLight}`,
    }}>
      {/* ID + date */}
      <div>
        <div style={{
          fontFamily: mono,
          fontSize: 12.5, fontWeight: 500,
          color: T.t1, letterSpacing: "-0.01em",
        }}>
          {order.id}
        </div>
        <div style={{ fontSize: 11, color: T.t3, marginTop: 3 }}>
          {order.date}
        </div>
      </div>

      {/* Items */}
      <div style={{
        fontSize: 13, color: T.t2,
        textAlign: "center",
      }}>
        {order.items}
      </div>

      {/* Amount */}
      <div style={{
        fontFamily: mono,
        fontSize: 13, fontWeight: 500, color: T.t1,
        textAlign: "right", letterSpacing: "-0.01em",
      }}>
        ${order.amount.toLocaleString()}
      </div>

      {/* Status badge */}
      <div style={{ textAlign: "right" }}>
        <span style={{
          display: "inline-block",
          padding: "3px 10px", borderRadius: 100,
          fontSize: 11, fontWeight: 600,
          background: status.bg, color: status.color,
          letterSpacing: "0.01em",
        }}>
          {status.label}
        </span>
      </div>
    </div>
  )
}
