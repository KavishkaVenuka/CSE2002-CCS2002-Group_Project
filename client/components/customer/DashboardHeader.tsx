"use client"

import { Search, Bell, Plus } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  dateString?: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="
      h-16 flex-shrink-0
      flex items-center justify-between
      px-6 gap-4
      bg-white
      border-b-[3px] border-black
    ">
      {/* Page Title */}
      <h1 className="font-display font-black text-2xl text-black tracking-tight flex-1 min-w-0">
        {title}
      </h1>

      <div className="flex items-center gap-3 flex-shrink-0">
        {/* Search */}
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none"
            size={14}
            strokeWidth={2.5}
          />
          <input
            type="text"
            placeholder="Search orders, quotes…"
            className="
              pl-9 pr-4 py-2 w-52
              bg-white
              border-[2px] border-black
              shadow-[2px_2px_0px_0px_#000]
              font-body text-sm text-black placeholder:text-gray-500
              outline-none
              transition-all duration-100
              focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none
            "
          />
        </div>

        {/* Notification Bell */}
        <button className="
          w-10 h-10
          flex items-center justify-center
          bg-white
          border-[2px] border-black
          shadow-[2px_2px_0px_0px_#000]
          nb-interactive
          relative
        ">
          <Bell size={16} strokeWidth={2} />
          <div className="
            absolute top-2 right-2
            w-1.5 h-1.5 bg-nb-red
            border-[1.5px] border-white
            allow-rounded
          " />
        </button>

        {/* Primary CTA */}
        <Link href="/send-requirements">
          <button className="
            flex items-center gap-2 px-4 py-2
            bg-black text-white
            font-body font-bold text-sm
            border-[2px] border-black
            shadow-[4px_4px_0px_0px_#000]
            nb-interactive
          ">
            <Plus size={14} strokeWidth={2.5} />
            New Requirement
          </button>
        </Link>
      </div>
    </header>
  )
}
