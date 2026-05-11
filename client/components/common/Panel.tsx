"use client"

import React from "react"

interface PanelProps {
  title: string
  children: React.ReactNode
  noTopPad?: boolean
  badge?: React.ReactNode
  icon?: React.ReactNode
  dark?: boolean
}

export function Panel({ title, children, noTopPad = false, badge, icon, dark = false }: PanelProps) {
  return (
    <section className={`${dark ? "bg-black" : "bg-white"} border-[3px] border-black shadow-nb overflow-hidden`}>
      <div className={`${dark ? "bg-black border-white/10" : "bg-white border-black"} px-6 py-4 border-b-[2.5px] flex items-center justify-between`}>
        <div className="flex items-center gap-3">
          {icon && <div className="flex-shrink-0">{icon}</div>}
          <h2 className={`font-display font-black text-sm uppercase tracking-[0.15em] ${dark ? "text-white" : "text-black"}`}>
            {title}
          </h2>
        </div>
        {badge !== undefined && (
          <div className="flex-shrink-0">
            {badge}
          </div>
        )}
      </div>
      <div className={`${noTopPad ? "" : "p-6"} ${dark ? "text-white" : "text-black"}`}>
        {children}
      </div>
    </section>
  )
}
