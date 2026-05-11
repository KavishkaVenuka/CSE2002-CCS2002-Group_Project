"use client"

import { useState, useMemo } from "react"
import { 
  FileText, Search, Filter, ChevronDown, 
  ArrowRight, Clock, CheckCircle2, AlertCircle,
  Calendar, RotateCcw, Package
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

// ─── DATA ──────────────────────────────────────────────────────────────────
const REQUIREMENTS_DATA = [
  { id: "REQ-9920", customer: "Modern Fabrics Ltd", items: "Raw Silk - 200m, Cotton Thread - 50 units", date: "2024-02-10", status: "New" },
  { id: "REQ-9918", customer: "Urban Stitch Co", items: "Linen Fabric - 500m", date: "2024-02-08", status: "In Progress" },
  { id: "REQ-9915", customer: "Loom & Thread", items: "Synthetic Yarn - 100kg", date: "2024-02-05", status: "Completed" },
  { id: "REQ-9912", customer: "Satin Smooth", items: "Organic Cotton - 300m", date: "2024-02-01", status: "Rejected" },
]

const STAT_CARDS = [
  { title: "New Requests", count: 0, icon: FileText, color: "bg-nb-cyan" },
  { title: "In Progress", count: 0, icon: Clock, color: "bg-nb-yellow" },
  { title: "Completed", count: 0, icon: CheckCircle2, color: "bg-nb-green" },
  { title: "Rejected", count: 0, icon: AlertCircle, color: "bg-nb-red" },
]

const STATUS_BADGE: Record<string, string> = {
  "New": "bg-nb-cyan",
  "In Progress": "bg-nb-yellow",
  "Completed": "bg-nb-green",
  "Rejected": "bg-nb-red",
}

export default function CustomerRequirementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredRequirements = useMemo(() => {
    return REQUIREMENTS_DATA.filter((req) => {
      const matchesSearch = 
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.items.toLowerCase().includes(searchQuery.toLowerCase())
      
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
                    <option>In Progress</option>
                    <option>Completed</option>
                    <option>Rejected</option>
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
              <div className="grid grid-cols-[140px_200px_1fr_140px_140px_100px] gap-4 px-6 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[1000px]">
                <div>Requirement ID</div>
                <div>Customer</div>
                <div>Items Summary</div>
                <div>Date Submitted</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="flex flex-col min-w-[1000px]">
                {filteredRequirements.length > 0 ? (
                  filteredRequirements.map((req, i) => (
                    <div 
                      key={req.id}
                      className={`
                        grid grid-cols-[140px_200px_1fr_140px_140px_100px] gap-4 items-center px-6 py-5
                        ${i < filteredRequirements.length - 1 ? "border-b-[2px] border-black" : ""}
                        bg-white hover:bg-nb-yellow/5 transition-colors duration-100
                      `}
                    >
                      <div className="font-mono text-sm font-black text-black">{req.id}</div>
                      <div className="font-body font-bold text-sm text-black">{req.customer}</div>
                      <div className="font-body font-bold text-xs text-gray-600 truncate" title={req.items}>
                        {req.items}
                      </div>
                      <div className="font-mono text-xs text-black">{req.date}</div>
                      
                      <div>
                        <span className={`px-3 py-1 border-[2px] border-black text-black font-mono font-black text-[10px] uppercase shadow-nb-sm ${STATUS_BADGE[req.status]}`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-3">
                        <button className="w-9 h-9 flex items-center justify-center bg-white border-[2px] border-black hover:bg-nb-green transition-colors shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none" title="Create Quotation">
                          <ArrowRight size={18} strokeWidth={2.5} />
                        </button>
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
