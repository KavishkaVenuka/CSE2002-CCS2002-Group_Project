"use client"

import { Search, Bell, Plus } from "lucide-react"
import Link from "next/link"

interface DashboardHeaderProps {
  title: string
  dateString?: string
}

export function DashboardHeader({ title }: DashboardHeaderProps) {
  return (
    <header className="h-20 bg-white border-b-[3px] border-black flex items-center justify-between px-8 sticky top-0 z-40 flex-shrink-0">
      {/* Page title */}
      <h1 className="font-display font-black text-2xl text-black uppercase tracking-tight">
        {title}
      </h1>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 text-black" size={16} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search orders, quotes…"
            className="pl-10 pr-4 py-2 bg-white border-[2px] border-black font-body text-sm placeholder:text-gray-500 focus:outline-none shadow-[2px_2px_0px_0px_#000] focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-100"
          />
        </div>

        {/* Notification bell */}
        <button className="relative w-10 h-10 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100">
          <Bell size={18} strokeWidth={2.5} />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-nb-red border-[2px] border-black flex items-center justify-center text-[8px] font-bold text-white leading-none">
            3
          </span>
        </button>

        {/* Primary CTA */}
        <Link
          href="/send-requirements"
          className="flex items-center gap-2 px-4 py-2 bg-nb-green text-black font-display font-black text-xs uppercase tracking-widest border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all duration-100"
        >
          <Plus size={16} strokeWidth={3} />
          New Requirement
        </Link>
      </div>
    </header>
  )
}
