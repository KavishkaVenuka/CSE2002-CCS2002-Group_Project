"use client"

import { Search, Bell, Plus, User } from "lucide-react"
import Link from "next/link"

interface HeaderProps {
  title: string
}

export function Header({ title }: HeaderProps) {
  return (
    <header className="h-20 bg-white border-b-[3px] border-black flex items-center justify-between px-8 sticky top-0 z-40">
      <div className="flex items-center gap-4">
        <h1 className="font-display font-black text-2xl text-black uppercase tracking-tight">{title}</h1>
      </div>

      <div className="flex items-center gap-6">
        {/* Search Bar */}
        <div className="hidden md:flex items-center relative">
          <Search className="absolute left-3 text-black" size={16} strokeWidth={2.5} />
          <input
            type="text"
            placeholder="Search everything..."
            className="pl-10 pr-4 py-2 bg-nb-bg border-[2px] border-black rounded-none font-body text-sm placeholder:text-gray-500 focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center gap-4">
          <Link
            href="/create-quotation"
            className="hidden sm:flex items-center gap-2 bg-nb-green border-[2px] border-black px-4 py-2 font-display font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
          >
            <Plus size={16} strokeWidth={3} />
            New Quotation
          </Link>

          <button className="relative w-10 h-10 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:bg-nb-bg transition-colors">
            <Bell size={18} strokeWidth={2.5} />
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 border-[2px] border-black rounded-full flex items-center justify-center text-[8px] font-bold text-white">
              3
            </span>
          </button>

          <div className="h-8 w-[2px] bg-black/10 mx-2"></div>

          <button className="flex items-center gap-3 pl-1 pr-3 py-1 bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
            <div className="w-8 h-8 bg-nb-cyan border-[2px] border-black flex items-center justify-center">
              <User size={16} strokeWidth={2.5} />
            </div>
            <div className="hidden lg:block text-left">
              <p className="font-display font-black text-[10px] uppercase leading-none">Apex Textiles</p>
              <p className="font-body text-[9px] text-gray-500 font-bold">Premium Supplier</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  )
}
