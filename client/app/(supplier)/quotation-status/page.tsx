"use client"

import { useState, useMemo } from "react"
import { 
  Clock, CheckCircle, XCircle, Search, 
  ChevronDown, Eye, Edit
} from "lucide-react"
import { Panel } from "@/components/common/Panel"
import { Header } from "@/components/supplier/Header"

// ─── DATA ──────────────────────────────────────────────────────────────────
const QUOTATION_DATA = [
  { id: "QT-20240115", reqId: "REQ-20240115", customer: "Acme Corp", amount: "$147,400", date: "2024-01-15", status: "pending", notes: "-" },
  { id: "QT-20240114", reqId: "REQ-20240114", customer: "XYZ Industries", amount: "$165,200", date: "2024-01-14", status: "approved", notes: "Approved with standard terms" },
  { id: "QT-20240113", reqId: "REQ-20240113", customer: "Tech Solutions", amount: "$89,500", date: "2024-01-13", status: "rejected", notes: "Price too high, please revise" },
  { id: "QT-20240112", reqId: "REQ-20240112", customer: "Global Enterprises", amount: "$201,000", date: "2024-01-12", status: "approved", notes: "-" },
]

const STAT_CARDS = [
  { title: "Pending", count: 1, icon: Clock, color: "bg-nb-yellow" },
  { title: "Approved", count: 2, icon: CheckCircle, color: "bg-nb-green" },
  { title: "Rejected", count: 1, icon: XCircle, color: "bg-nb-red" },
]

const BADGE_MAP: Record<string, string> = {
  "pending": "bg-nb-yellow",
  "approved": "bg-nb-green",
  "rejected": "bg-nb-red",
}

export default function QuotationStatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredQuotations = useMemo(() => {
    return QUOTATION_DATA.filter((quote) => {
      const matchesSearch = 
        quote.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.reqId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quote.customer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        quote.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <>
      <Header title="Quotation Status" />

      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex flex-col gap-4 nb-interactive"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${stat.color}`}>
                  <stat.icon size={16} strokeWidth={2.5} className="text-black" />
                </div>
                <span className="font-body font-bold text-sm text-gray-700">{stat.title}</span>
              </div>
              <div className="font-display font-black text-3xl text-black">
                {stat.count}
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN PANEL & CONTROLS ─────────────────────────────────── */}
        <Panel title="Submitted Quotations" noTopPad badge={filteredQuotations.length}>
          <div className="flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b-[3px] border-black bg-white">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder="Search quotations..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                />
              </div>
              <div className="relative w-full sm:w-40">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body font-bold text-sm text-black outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[1.2fr_1.2fr_1.5fr_1fr_1fr_1fr_1.5fr_1fr] gap-4 px-5 py-3 border-b-[2px] border-black bg-black text-white font-display font-black text-xs uppercase tracking-widest min-w-[1000px]">
                <div>Quotation ID</div>
                <div>Requirement ID</div>
                <div>Customer Name</div>
                <div>Total Amount</div>
                <div>Date</div>
                <div>Status</div>
                <div>Admin Notes</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="flex flex-col min-w-[1000px]">
                {filteredQuotations.map((quote, i) => (
                  <div 
                    key={quote.id}
                    className={`
                      grid grid-cols-[1.2fr_1.2fr_1.5fr_1fr_1fr_1fr_1.5fr_1fr] gap-4 items-center px-5 py-4
                      ${i < filteredQuotations.length - 1 ? "border-b-[2px] border-black" : ""}
                      odd:bg-white even:bg-nb-bg hover:bg-nb-yellow transition-colors duration-100
                    `}
                  >
                    <div className="font-mono text-sm font-bold text-black">{quote.id}</div>
                    <div className="font-mono text-sm text-gray-600">{quote.reqId}</div>
                    <div className="font-body text-sm text-black">{quote.customer}</div>
                    <div className="font-mono text-sm text-black">{quote.amount}</div>
                    <div className="font-mono text-sm text-black">{quote.date}</div>

                    <div>
                      <span className={`px-2 py-0.5 border-[2px] border-black text-black font-mono font-bold text-xs ${BADGE_MAP[quote.status]}`}>
                        {quote.status}
                      </span>
                    </div>
                    
                    <div className="font-body text-sm text-gray-600 truncate" title={quote.notes}>
                      {quote.notes}
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black hover:bg-gray-100 transition-colors" title="View Quotation">
                        <Eye size={16} strokeWidth={2} />
                      </button>
                      {quote.status === "rejected" && (
                        <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black hover:bg-gray-100 transition-colors" title="Edit Quotation">
                          <Edit size={16} strokeWidth={2} />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </main>
    </>
  )
}
