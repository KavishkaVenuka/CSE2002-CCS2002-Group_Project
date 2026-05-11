"use client"

import { useState, useMemo } from "react"
import { 
  FileText, Search, Filter, ChevronDown, 
  ArrowRight, Clock, CheckCircle2, AlertCircle,
  Calendar, RotateCcw, Package, Send, Eye, Download
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

// ─── DATA ──────────────────────────────────────────────────────────────────
const REQUIREMENTS_DATA = [
  { id: "REQ-20240115", customer: "Acme Corp", items: 3, itemsDetail: "Raw Silk - 200m, Cotton Thread - 50 units", qty: "1000 units", delivery: "2024-02-15", docs: 2, status: "new" },
  { id: "REQ-20240114", customer: "XYZ Industries", items: 5, itemsDetail: "Linen Fabric - 500m", qty: "1500 units", delivery: "2024-02-10", docs: 1, status: "quoted" },
  { id: "REQ-20240113", customer: "Tech Solutions", items: 2, itemsDetail: "Synthetic Yarn - 100kg", qty: "500 units", delivery: "2024-02-20", docs: 3, status: "in-progress" },
  { id: "REQ-20240112", customer: "Global Enterprises", items: 4, itemsDetail: "Organic Cotton - 300m", qty: "2000 units", delivery: "2024-02-25", docs: 2, status: "completed" },
]

const STAT_CARDS = [
  { title: "New Requests", count: 1, icon: FileText, color: "bg-nb-cyan" },
  { title: "Quoted", count: 1, icon: Clock, color: "bg-nb-yellow" },
  { title: "In Progress", count: 1, icon: Send, color: "bg-[#c084fc]" },
  { title: "Completed", count: 1, icon: CheckCircle2, color: "bg-nb-green" },
]

const BADGE_MAP: Record<string, string> = {
  "new": "bg-nb-cyan",
  "quoted": "bg-nb-yellow",
  "in-progress": "bg-[#c084fc]",
  "completed": "bg-nb-green",
}

export default function CustomerRequirementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredRequirements = useMemo(() => {
    return REQUIREMENTS_DATA.filter((req) => {
      const matchesSearch = 
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.customer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        req.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <>
      <Header title="Customer Requirements" />

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
                <p className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">{stat.title}</p>
                <h3 className="font-display font-black text-3xl text-black leading-none">{stat.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel 
          title="Open Procurement Requirements" 
          icon={<FileText size={20} className="text-nb-cyan" />}
          noTopPad 
          badge={filteredRequirements.length}
        >
          <div className="flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b-[3px] border-black bg-white">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                  <input 
                    type="text" 
                    placeholder="Search requirements..." 
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#fdfcfb] border-[2px] border-black shadow-nb-sm font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none"
                  />
                </div>
                <div className="relative w-full sm:w-48">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none pl-9 pr-10 py-2 bg-nb-bg border-[2px] border-black shadow-nb-sm font-body font-bold text-sm text-black outline-none transition-all duration-100 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none cursor-pointer"
                  >
                    <option>All Status</option>
                    <option>New</option>
                    <option>Quoted</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button className="p-2.5 bg-white border-[2px] border-black shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Refresh">
                  <RotateCcw size={18} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_120px_100px_100px] gap-4 px-6 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[1100px]">
                <div>Requirement ID</div>
                <div>Customer</div>
                <div>Qty</div>
                <div>Delivery</div>
                <div>Docs</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="flex flex-col min-w-[1100px]">
                {filteredRequirements.length > 0 ? (
                  filteredRequirements.map((req, i) => (
                    <div 
                      key={req.id}
                      className={`
                        grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_120px_100px_100px] gap-4 items-center px-6 py-5
                        ${i < filteredRequirements.length - 1 ? "border-b-[2px] border-black" : ""}
                        bg-white hover:bg-nb-bg transition-colors duration-100
                      `}
                    >
                      <div className="font-mono text-sm font-black text-black">{req.id}</div>
                      <div className="font-body font-bold text-sm text-black">
                        {req.customer}
                        <div className="font-body text-[10px] text-gray-400 font-normal truncate max-w-[200px]" title={req.itemsDetail}>
                          {req.itemsDetail}
                        </div>
                      </div>
                      <div className="font-mono text-xs font-bold text-black">{req.qty}</div>
                      <div className="font-mono text-xs font-bold text-black">{req.delivery}</div>
                      
                      <div>
                        <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 border-[2px] border-black text-black font-mono font-bold text-[10px] hover:bg-white transition-all">
                          <Download size={12} strokeWidth={3} />
                          {req.docs}
                        </button>
                      </div>

                      <div>
                        <span className={`px-3 py-1 border-[2px] border-black text-black font-mono font-black text-[10px] uppercase shadow-nb-sm ${BADGE_MAP[req.status]}`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-3 col-span-2">
                        <button className="w-9 h-9 flex items-center justify-center bg-white border-[2px] border-black hover:bg-nb-cyan transition-colors shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none" title="View Details">
                          <Eye size={18} strokeWidth={2.5} />
                        </button>
                        {req.status === "new" && (
                          <button className="w-9 h-9 flex items-center justify-center bg-nb-green border-[2px] border-black hover:bg-green-400 transition-colors shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none" title="Send Quotation">
                            <ArrowRight size={18} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-24 text-center bg-white">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-nb-bg border-[3px] border-black shadow-nb flex items-center justify-center mb-4">
                        <Package size={32} className="text-gray-400" />
                      </div>
                      <p className="font-body font-bold text-sm text-gray-400 italic">No requirements found.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>
      </main>
    </>
  )
}
