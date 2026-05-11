"use client"

import { useState, useMemo } from "react"
import { 
<<<<<<< HEAD
  FileText, Search, Filter, ChevronDown, 
  ArrowRight, Clock, CheckCircle2, AlertCircle,
  Calendar, RotateCcw, Package
=======
  FileText, Clock, Send, CheckCircle, Search, 
  ChevronDown, Eye, Download
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

// ─── DATA ──────────────────────────────────────────────────────────────────
const REQUIREMENTS_DATA = [
<<<<<<< HEAD
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
=======
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
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
}

export default function CustomerRequirementsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredRequirements = useMemo(() => {
    return REQUIREMENTS_DATA.filter((req) => {
      const matchesSearch = 
        req.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
<<<<<<< HEAD
        req.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
        req.items.toLowerCase().includes(searchQuery.toLowerCase())
=======
        req.customer.toLowerCase().includes(searchQuery.toLowerCase())
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        req.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <>
      <Header title="Customer Requirements" />

<<<<<<< HEAD
      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
=======
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
<<<<<<< HEAD
              className="bg-white border-[3px] border-black shadow-nb p-6 flex items-center gap-4 relative group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-sm transition-all"
            >
              <div className={`w-12 h-12 border-[2px] border-black flex items-center justify-center shadow-nb-sm ${stat.color}`}>
                <stat.icon size={24} strokeWidth={2.5} className="text-black" />
              </div>
              <div>
                <p className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">{stat.title}</p>
                <h3 className="font-display font-black text-3xl text-black leading-none">{stat.count}</h3>
=======
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
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
              </div>
            </div>
          ))}
        </div>

<<<<<<< HEAD
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
=======
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
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
<<<<<<< HEAD
              <div className="grid grid-cols-[140px_200px_1fr_140px_140px_100px] gap-4 px-6 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[1000px]">
                <div>Requirement ID</div>
                <div>Customer</div>
                <div>Items Summary</div>
                <div>Date Submitted</div>
=======
              <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_1.5fr_1.2fr_1fr_1fr] gap-4 px-5 py-3 border-b-[2px] border-black bg-black text-white font-display font-black text-xs uppercase tracking-widest min-w-[1000px]">
                <div>Requirement ID</div>
                <div>Customer Name</div>
                <div>Items</div>
                <div>Total Qty</div>
                <div>Expected Delivery</div>
                <div>Uploaded Docs</div>
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="flex flex-col min-w-[1000px]">
<<<<<<< HEAD
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
=======
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
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
              </div>
            </div>
          </div>
        </Panel>
      </main>
    </>
  )
}
