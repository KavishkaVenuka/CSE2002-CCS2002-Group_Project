"use client"

// Status badge color map — vibrant flat fills, black borders
const STATUS_STYLES: Record<string, { bg: string; text: string }> = {
  delivered:    { bg: "#4ADE80", text: "#000" },
  "in-transit": { bg: "#22D3EE", text: "#000" },
  dispatched:   { bg: "#FACC15", text: "#000" },
  confirmed:    { bg: "#4ADE80", text: "#000" },
  overdue:      { bg: "#EF4444", text: "#fff" },
  pending:      { bg: "#FACC15", text: "#000" },
}

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
  const badge = STATUS_STYLES[order.status] ?? { bg: "#F5F0E8", text: "#000" }

  return (
    <div
      className={`
        grid grid-cols-[1fr_48px_90px_110px]
        items-center
        px-5 py-3
        ${!isLast ? "border-b-[2px] border-black" : ""}
        odd:bg-white even:bg-nb-bg
        hover:bg-nb-yellow transition-colors duration-100
      `}
    >
      {/* Order ID + Date */}
      <div>
        <div className="font-mono text-sm font-bold text-black tracking-tight">
          {order.id}
        </div>
        <div className="font-body text-xs text-gray-500 mt-0.5">{order.date}</div>
      </div>

      {/* Items count */}
      <div className="font-body text-sm text-black text-center">
        {order.items}
      </div>

      {/* Amount */}
      <div className="font-mono text-sm font-bold text-black text-right">
        Rs.{order.amount.toLocaleString()}
      </div>

      {/* Status Badge */}
      <div className="flex justify-end">
        <span
          className="nb-badge"
          style={{ background: badge.bg, color: badge.text }}
        >
          {status.label}
        </span>
      </div>
    </div>
  )
}
