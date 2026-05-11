"use client"

import { useState, useMemo } from "react"
import { 
  CheckCircle, Clock, FileText, AlertCircle, 
  Search, ChevronDown, Eye, Download, DollarSign,
  Filter
} from "lucide-react"
import { Panel } from "@/components/common/Panel"
import { Header } from "@/components/supplier/Header"

// ─── DATA ──────────────────────────────────────────────────────────────────
const PAYMENTS_DATA = [
  { id: "PAY-20240115", orderId: "ORD-20240115", customer: "Acme Corp", amount: "$147,400", method: "Bank Transfer", status: "completed", date: "2024-01-15" },
  { id: "PAY-20240114", orderId: "ORD-20240114", customer: "XYZ Industries", amount: "$165,200", method: "Credit Card", status: "pending", date: "2024-01-14" },
  { id: "PAY-20240113", orderId: "ORD-20240113", customer: "Tech Solutions", amount: "$89,500", method: "Online Payment", status: "completed", date: "2024-01-13" },
  { id: "PAY-20240112", orderId: "ORD-20240112", customer: "Global Enterprises", amount: "$201,000", method: "Bank Transfer", status: "failed", date: "2024-01-12" },
]

const STAT_CARDS = [
  { title: "Received", value: "$236,900", icon: CheckCircle, color: "bg-nb-green" },
  { title: "Pending", value: "$165,200", icon: Clock, color: "bg-nb-yellow" },
  { title: "Total Payments", value: "4", icon: FileText, color: "bg-nb-cyan" },
  { title: "Failed", value: "1", icon: AlertCircle, color: "bg-red-400" },
]

const STATUS_BADGE: Record<string, string> = {
  "completed": "bg-nb-green",
  "pending": "bg-nb-yellow",
  "failed": "bg-red-400",
}

export default function PaymentStatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredPayments = useMemo(() => {
    return PAYMENTS_DATA.filter((payment) => {
      const matchesSearch = 
        payment.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        payment.customer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        payment.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <>
      <Header title="Payment Status" />

      <main className="flex-1 overflow-auto p-6 space-y-8 bg-nb-bg">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex flex-col gap-4 nb-interactive"
            >
              <div className="flex items-center justify-between">
                <div className={`w-12 h-12 rounded-full border-[2.5px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000] ${stat.color}`}>
                  <stat.icon size={24} strokeWidth={2.5} className="text-black" />
                </div>
              </div>
              <div>
                <div className="font-body font-bold text-sm text-gray-600 mb-1 tracking-tight">{stat.title}</div>
                <div className="font-display font-black text-3xl text-black uppercase">
                  {stat.value}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── ALL PAYMENTS PANEL ────────────────────────────────────── */}
        <Panel title="All Payments" noTopPad badge={filteredPayments.length}>
          <div className="flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b-[3px] border-black bg-white">
              <div className="relative w-full sm:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder="Search payments, orders, or customers..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_#000] font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                />
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center gap-2 font-display font-black text-xs text-black uppercase tracking-wider">
                  <Filter size={14} strokeWidth={3} /> Filter:
                </div>
                <div className="relative w-40">
                  <select 
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-2.5 bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_#000] font-body font-bold text-sm text-black outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none cursor-pointer"
                  >
                    <option>All Status</option>
                    <option>Completed</option>
                    <option>Pending</option>
                    <option>Failed</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={18} strokeWidth={2.5} />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[1.2fr_1.2fr_1.5fr_1fr_1.2fr_1fr_1fr_0.8fr] gap-4 px-6 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-xs uppercase tracking-widest min-w-[1100px]">
                <div>Payment ID</div>
                <div>Order ID</div>
                <div>Customer</div>
                <div>Amount</div>
                <div>Method</div>
                <div>Status</div>
                <div>Date</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="flex flex-col min-w-[1100px]">
                {filteredPayments.map((payment, i) => (
                  <div 
                    key={payment.id}
                    className={`
                      grid grid-cols-[1.2fr_1.2fr_1.5fr_1fr_1.2fr_1fr_1fr_0.8fr] gap-4 items-center px-6 py-5
                      ${i < filteredPayments.length - 1 ? "border-b-[2px] border-black" : ""}
                      odd:bg-white even:bg-nb-bg hover:bg-nb-yellow transition-colors duration-100
                    `}
                  >
                    <div className="font-mono text-sm font-bold text-black">{payment.id}</div>
                    <div className="font-mono text-sm text-gray-600">{payment.orderId}</div>
                    <div className="font-body font-bold text-sm text-black">{payment.customer}</div>
                    <div className="font-mono font-black text-sm text-black">{payment.amount}</div>
                    <div className="font-body text-sm text-black">{payment.method}</div>

                    <div>
                      <span className={`px-3 py-1 border-[2.5px] border-black text-black font-display font-black text-[10px] uppercase tracking-tighter ${STATUS_BADGE[payment.status]}`}>
                        {payment.status}
                      </span>
                    </div>

                    <div className="font-mono text-sm text-black">{payment.date}</div>

                    <div className="flex items-center justify-end gap-2">
                      <button className="w-9 h-9 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="View Details">
                        <Eye size={18} strokeWidth={2.5} />
                      </button>
                      <button className="w-9 h-9 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Download Invoice">
                        <Download size={18} strokeWidth={2.5} />
                      </button>
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
