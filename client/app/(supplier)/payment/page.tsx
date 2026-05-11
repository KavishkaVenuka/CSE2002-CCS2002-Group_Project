"use client"

import { useState, useMemo } from "react"
import { 
  CreditCard, Clock, CheckCircle, 
  Search, ChevronDown, RefreshCw, Wallet,
  XCircle, TrendingUp, ArrowUpRight
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

// ─── DATA ──────────────────────────────────────────────────────────────────
const PAYMENTS_DATA: any[] = [] 

const STAT_CARDS = [
  { title: "TOTAL RECEIVED", amount: "LKR 0", color: "bg-nb-green", label: "LIVE", icon: TrendingUp },
  { title: "IN SETTLEMENT", amount: "LKR 0", color: "bg-nb-yellow", label: "LIVE", icon: Clock },
  { title: "TRANSACTIONS", amount: "0", color: "bg-nb-cyan", label: "LIVE", icon: RefreshCw },
  { title: "UNSUCCESSFUL", amount: "0", color: "bg-red-400", label: "LIVE", icon: XCircle },
]

export default function PaymentStatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredPayments = useMemo(() => {
    return PAYMENTS_DATA.filter((pay) => {
      const matchesSearch = 
        pay?.id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pay?.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        pay?.status?.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <>
      <Header title="Payment Status" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3.5px] border-black shadow-nb p-7 relative group nb-interactive"
            >
              <div className="absolute top-5 right-5 flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 border-[1.5px] border-black/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-nb-green animate-pulse"></span>
                <span className="font-mono font-bold text-[8px] text-gray-400 uppercase tracking-tighter">{stat.label}</span>
              </div>

              <div className={`w-14 h-14 border-[2.5px] border-black flex items-center justify-center mb-8 shadow-nb-sm ${stat.color} rounded-xl`}>
                <stat.icon size={26} className="text-black" strokeWidth={2.5} />
              </div>
              
              <div className="mt-2">
                <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                <h3 className="font-display font-black text-4xl text-black leading-none tracking-tight">{stat.amount}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel 
          title="Transaction Ledger" 
          icon={<Wallet size={18} className="text-nb-cyan" />}
          noTopPad 
          badge={
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search IDs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-50 border-[2.5px] border-black/5 focus:border-black font-body text-xs outline-none transition-all w-48 sm:w-64"
                />
              </div>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border-[2.5px] border-black/5 focus:border-black font-body font-bold text-xs text-black outline-none cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={14} strokeWidth={3} />
              </div>
              <button className="p-2 bg-gray-50 border-[2.5px] border-black/5 hover:border-black hover:bg-white transition-all group">
                <RefreshCw size={14} strokeWidth={3} className="text-black/40 group-hover:text-black transition-colors" />
              </button>
            </div>
          }
        >
          <div className="flex flex-col min-h-[450px]">
            {/* Table Header */}
            <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 px-8 py-6 border-b-[2.5px] border-black/5 text-gray-400 font-display font-black text-[10px] uppercase tracking-[0.2em]">
              <div>TX ID</div>
              <div>Order/Invoice</div>
              <div>Amount</div>
              <div>Method</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            
            {/* Table Content */}
            <div className="flex-1 flex flex-col">
              {filteredPayments.length > 0 ? (
                filteredPayments.map((pay, i) => (
                  <div 
                    key={pay.id}
                    className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 items-center px-8 py-6 border-b border-black/5 hover:bg-nb-bg/30 transition-colors"
                  >
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center p-24 text-center bg-gray-50/30">
                  <div className="w-20 h-20 bg-white border-[3px] border-black shadow-nb flex items-center justify-center mb-6">
                    <Wallet size={32} className="text-gray-200" strokeWidth={1} />
                  </div>
                  <p className="font-body font-bold text-sm text-gray-400 italic tracking-wide">No payment records discovered.</p>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </main>
    </>
  )
}
