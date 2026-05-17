"use client"

import { ReactNode } from "react"
import { ChevronRight } from "lucide-react"

interface PanelProps {
  title: string
  badge?: ReactNode
  icon?: ReactNode
  children: ReactNode
  noTopPad?: boolean
}

export function Panel({ title, badge, icon, children, noTopPad }: PanelProps) {
  return (
    <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
      {/* Panel header — black bar like common/Panel */}
      <div className="bg-black px-6 py-4 flex items-center justify-between border-b-[2px] border-black">
        <div className="flex items-center gap-3">
          {icon && <span>{icon}</span>}
          <span className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">
            {title}
          </span>
          {badge !== undefined && (
            <span className="bg-white text-black px-2 py-0.5 font-mono font-bold text-[10px] border-[2px] border-white">
              {badge}
            </span>
          )}
        </div>
        <button className="flex items-center gap-1 text-xs text-white/70 font-body font-bold uppercase tracking-wider hover:text-white transition-colors">
          View all <ChevronRight size={13} strokeWidth={2.5} />
        </button>
      </div>

      {/* Panel body */}
      <div className={noTopPad ? "" : "p-6"}>
        {children}
      </div>
    </section>
  )
}
