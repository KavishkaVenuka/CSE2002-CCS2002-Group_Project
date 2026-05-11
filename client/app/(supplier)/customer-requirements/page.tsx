"use client"

import { useState, useMemo } from "react"
import { 
  FileText, Clock, Send, CheckCircle, Search, 
  ChevronDown, Eye, Download
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

// ─── DATA ──────────────────────────────────────────────────────────────────
const REQUIREMENTS_DATA = [
  { id: "REQ-20240115", customer: "Acme Corp", items: 3, qty: "1000 units", delivery: "2024-02-15", docs: 2, status: "new" },
  { id: "REQ-20240114", customer: "XYZ Industries", items: 5, qty: "1500 units", delivery: "2024-02-10", docs: 1, status: "quoted" },
  { id: "REQ-20240113", customer: "Tech Solutions", items: 2, qty: "500 units", delivery: "2024-02-20", docs: 3, status: "in-progress" },
  { id: "REQ-20240112", customer: "Global Enterprises", items: 4, qty: "2000 units", delivery: "2024-02-25", docs: 2, status: "completed" },
]

const STAT_CARDS = [
  { title: "New Requests", count: 1, icon: FileText, color: "bg-nb-cyan" },
  { title: "Quoted", count: 1, icon: Clock, color: "bg-nb-yellow" },
  { title: "In Progress", count: 1, icon: Send, color: "bg-[#c084fc]" },
  { title: "Completed", count: 1, icon: CheckCircle, color: "bg-nb-green" },
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

      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
        <Panel title="All Requirements" noTopPad badge={filteredRequirements.length}>
          <div className="flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b-[3px] border-black bg-white">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder="Search requirements..." 
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
                  <option>New</option>
                  <option>Quoted</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1.2fr_1fr_1fr] gap-4 px-5 py-3 border-b-[2px] border-black bg-black text-white font-display font-black text-xs uppercase tracking-widest min-w-[1000px]">
                <div>Requirement ID</div>
                <div>Customer Name</div>
                <div>Items</div>
                <div>Total Qty</div>
                <div>Expected Delivery</div>
                <div>Uploaded Docs</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="flex flex-col min-w-[1000px]">
                {filteredRequirements.map((req, i) => (
                  <div 
                    key={req.id}
                    className={`
                      grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1.2fr_1fr_1fr] gap-4 items-center px-5 py-4
                      ${i < filteredRequirements.length - 1 ? "border-b-[2px] border-black" : ""}
                      odd:bg-white even:bg-nb-bg hover:bg-nb-yellow transition-colors duration-100
                    `}
                  >
                    <div className="font-mono text-sm font-bold text-black">{req.id}</div>
                    <div className="font-body text-sm text-black">{req.customer}</div>
                    <div className="font-mono text-sm text-black">{req.items} items</div>
                    <div className="font-mono text-sm text-black">{req.qty}</div>
                    <div className="font-mono text-sm text-black">{req.delivery}</div>
                    
                    <div>
                      <button className="flex items-center justify-center gap-2 px-3 py-1 bg-white border-[2px] border-black text-nb-cyan font-mono font-bold text-xs hover:bg-gray-100 transition-colors">
                        <Download size={14} strokeWidth={2.5} />
                        {req.docs}
                      </button>
                    </div>

                    <div>
                      <span className={`px-2 py-0.5 border-[2px] border-black text-black font-mono font-bold text-xs ${BADGE_MAP[req.status]}`}>
                        {req.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black hover:bg-gray-100 transition-colors" title="View Details">
                        <Eye size={16} strokeWidth={2} />
                      </button>
                      {req.status === "new" && (
                        <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black hover:bg-gray-100 transition-colors" title="Send Quotation">
                          <Send size={16} strokeWidth={2} />
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
