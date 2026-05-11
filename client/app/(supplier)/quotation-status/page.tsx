"use client"

import { useState, useMemo } from "react"
import { 
  Search, ChevronDown, Clock, CheckCircle, 
  XCircle, Eye, Download, RefreshCw, FileText,
  ClipboardList
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

// ─── DATA ──────────────────────────────────────────────────────────────────
const QUOTATIONS_DATA = [
  { id: "QT-7721", requirementId: "REQ-9920", customer: "Modern Fabrics Ltd", date: "2024-02-10", totalAmount: "LKR 22,500.00", status: "pending" },
  { id: "QT-7720", requirementId: "REQ-9918", customer: "Urban Stitch Co", date: "2024-02-08", totalAmount: "LKR 8,400.00", status: "approved" },
  { id: "QT-7719", requirementId: "REQ-9915", customer: "Loom & Thread", date: "2024-02-05", totalAmount: "LKR 15,200.00", status: "rejected" },
]

const STAT_CARDS = [
  { title: "Total Submitted", value: "LKR 46,100", icon: FileText, color: "bg-nb-cyan" },
  { title: "Pending Review", value: "5", icon: Clock, color: "bg-nb-yellow" },
  { title: "Approved", value: "4", icon: CheckCircle, color: "bg-nb-green" },
  { title: "Rejected", value: "3", icon: XCircle, color: "bg-red-400" },
]

const BADGE_MAP: Record<string, string> = {
  "pending": "bg-nb-yellow",
  "approved": "bg-nb-green",
  "rejected": "bg-red-400",
}

export default function QuotationStatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredQuotations = useMemo(() => {
    return QUOTATIONS_DATA.filter((qt) => {
      const matchesSearch = 
        qt.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        qt.requirementId.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        qt.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <>
      <Header title="Quotation Status" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3px] border-black shadow-nb p-6 flex items-center gap-4 relative group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-sm transition-all"
            >
              <div className={`w-12 h-12 border-[2px] border-black flex items-center justify-center shadow-nb-sm ${stat.color}`}>
                <stat.icon size={24} strokeWidth={2.5} className="text-black" />
              </div>
              <div>
                <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="font-display font-black text-2xl text-black leading-none">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel 
          title="Submitted Quotations" 
          icon={<ClipboardList size={20} className="text-nb-cyan" />}
          noTopPad
          badge={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={14} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search IDs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border-[2px] border-black font-body text-xs outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all w-44 sm:w-64"
                />
              </div>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-white border-[2px] border-black font-display font-black text-[10px] uppercase outline-none cursor-pointer focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={14} strokeWidth={3} />
              </div>
              <button className="p-1.5 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-gray-100">
                <RefreshCw size={14} strokeWidth={3} />
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[140px_140px_1fr_140px_120px_100px] gap-4 px-6 py-4 border-b-[3px] border-black bg-gray-50 text-gray-400 font-display font-black text-[10px] uppercase tracking-widest min-w-[900px]">
              <div>Quotation ID</div>
              <div>Requirement Ref</div>
              <div>Total Amount</div>
              <div>Date Submitted</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="flex flex-col min-w-[900px]">
              {filteredQuotations.length > 0 ? (
                filteredQuotations.map((qt, i) => (
                  <div 
                    key={qt.id}
                    className={`
                      grid grid-cols-[140px_140px_1fr_140px_120px_100px] gap-4 items-center px-6 py-5
                      ${i < filteredQuotations.length - 1 ? "border-b-[2px] border-black" : ""}
                      bg-white hover:bg-nb-bg transition-colors duration-100 group
                    `}
                  >
                    <div className="font-mono text-sm font-black text-black underline decoration-black/20 group-hover:decoration-black">{qt.id}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{qt.requirementId}</div>
                    <div className="font-display font-black text-sm text-black">{qt.totalAmount}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{qt.date}</div>
                    
                    <div>
                      <span className={`px-3 py-1 border-[2px] border-black text-black font-display font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_#000] ${BADGE_MAP[qt.status]}`}>
                        {qt.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="View Details">
                        <Eye size={14} strokeWidth={3} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Download PDF">
                        <Download size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-white">
                  <div className="w-16 h-16 bg-nb-bg border-[3px] border-black flex items-center justify-center shadow-nb rotate-3">
                    <Search size={32} className="text-gray-400" strokeWidth={2} />
                  </div>
                  <p className="font-body font-bold text-sm text-gray-400 italic">No quotations found.</p>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </main>
    </>
  )
}
