"use client"

import { Clock } from "lucide-react"

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
    <div
      className="
        bg-white
        border-[2px] border-black
        shadow-[4px_4px_0px_0px_#000]
        p-4
        flex flex-col gap-3
      "
    >
      {/* Header row */}
      <div className="flex items-start justify-between">
        <div>
          <div className="font-mono text-sm font-bold text-black tracking-tight">
            {q.id}
          </div>
          <div className="font-body text-xs text-gray-500 mt-0.5">
            Ref: {q.req}
          </div>
        </div>
        <div className="font-mono text-lg font-black text-black">
          Rs.{q.amount.toLocaleString()}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t-[2px] border-black" />

      {/* Footer row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Clock size={11} strokeWidth={2} className="text-gray-500" />
          <span className="font-body text-xs text-gray-500">
            Expires {q.expires}
          </span>
        </div>
        <button className="
          px-4 py-1.5
          bg-black text-white
          font-body font-bold text-xs
          border-[2px] border-black
          shadow-[2px_2px_0px_0px_#000]
          nb-interactive
        ">
          Review →
        </button>
      </div>
    </div>
  )
}
