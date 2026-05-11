"use client"

import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

interface PanelProps {
  title: string
  badge?: number | string
  badgeColor?: string
  badgeBg?: string
  children: ReactNode
  noTopPad?: boolean
}

export function Panel({ title, badge, children, noTopPad }: PanelProps) {
  return (
    <div
      className="border-[3px] border-black shadow-[6px_6px_0px_0px_#000000] overflow-hidden bg-white"
    >
      {/* ── Panel Header — black bar ──────────────────────────────── */}
      <div
        className="
          flex items-center justify-between
          px-5 py-3
          bg-black
          border-b-[2px] border-black
        "
      >
        <div className="flex items-center gap-3">
          <span className="font-display font-black text-sm text-white tracking-tight uppercase">
            {title}
          </span>
          {badge !== undefined && (
            <span className="
              font-mono text-xs font-bold text-black bg-nb-yellow
              px-2 py-0.5
              border-[2px] border-white
              shadow-[1px_1px_0px_0px_#fff]
            ">
              {badge}
            </span>
          )}
        </div>

        <button className="
          flex items-center gap-1
          px-3 py-1
          bg-nb-yellow text-black
          font-body font-bold text-xs
          border-[2px] border-nb-yellow
          shadow-[2px_2px_0px_0px_#fff]
          nb-interactive
        ">
          View all <ChevronRight size={12} strokeWidth={2.5} />
        </button>
      </div>

      {/* ── Panel Body ─────────────────────────────────────────────── */}
      <div style={{ paddingTop: noTopPad ? 0 : undefined }}>
        {children}
      </div>
    </div>
  )
}
