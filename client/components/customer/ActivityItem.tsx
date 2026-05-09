"use client"

import { T, ACT_DOT } from "@/lib/tokens"

interface ActivityItemProps {
  item: {
    text: string
    time: string
    type: string
  }
  isLast: boolean
}

export function ActivityItem({ item, isLast }: ActivityItemProps) {
  const dotColor = (ACT_DOT as any)[item.type] || T.t3
  return (
    <div style={{
      padding: "16px 20px",
      borderRight: isLast ? "none" : `1px solid ${T.borderLight}`,
      display: "flex", gap: 12, alignItems: "flex-start",
    }}>
      <div style={{
        width: 7, height: 7, borderRadius: "50%",
        background: dotColor, flexShrink: 0, marginTop: 5,
      }} />
      <div>
        <div style={{
          fontSize: 12.5, color: T.t1,
          lineHeight: 1.55, fontWeight: 500,
        }}>
          {item.text}
        </div>
        <div style={{ fontSize: 11, color: T.t3, marginTop: 5 }}>
          {item.time}
        </div>
      </div>
    </div>
  )
}
