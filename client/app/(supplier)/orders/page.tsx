"use client"

import { useState, useMemo } from "react"
import { 
  ShoppingCart, Search, ChevronDown, Clock, 
  Truck, CheckCircle, Eye, Download, RefreshCw, 
  Package, Send, CheckSquare
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

// ─── DATA ──────────────────────────────────────────────────────────────────
const ORDERS_DATA = [
  { id: "ORD-20240115", customer: "Acme Corp", items: "3 items", amount: "LKR 147,400", date: "2024-01-15", status: "dispatched" },
  { id: "ORD-20240114", customer: "XYZ Industries", items: "5 items", amount: "LKR 165,200", date: "2024-01-14", status: "ready" },
  { id: "ORD-20240113", customer: "Tech Solutions", items: "2 items", amount: "LKR 89,500", date: "2024-01-13", status: "preparing" },
  { id: "ORD-20240112", customer: "Global Enterprises", items: "4 items", amount: "LKR 201,000", date: "2024-01-12", status: "acknowledged" },
  { id: "ORD-20240111", customer: "Tech Innovations", items: "3 items", amount: "LKR 125,000", date: "2024-01-11", status: "pending" },
]

const STAT_CARDS = [
  { title: "Pending", value: "1", icon: Clock, color: "bg-gray-200" },
  { title: "Acknowledged", value: "1", icon: Send, color: "bg-nb-yellow" },
  { title: "Preparing", value: "1", icon: Package, color: "bg-[#c084fc]" },
  { title: "Ready", value: "1", icon: CheckCircle, color: "bg-nb-cyan" },
  { title: "Dispatched", value: "1", icon: Truck, color: "bg-nb-green" },
]

const BADGE_MAP: Record<string, string> = {
  "pending": "bg-gray-200",
  "acknowledged": "bg-nb-yellow",
  "preparing": "bg-[#c084fc]",
  "ready": "bg-nb-cyan",
  "dispatched": "bg-nb-green",
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredOrders = useMemo(() => {
    return ORDERS_DATA.filter((order) => {
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        order.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  const renderActionIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <CheckSquare size={14} strokeWidth={3} />
      case "acknowledged":
        return <Package size={14} strokeWidth={3} />
      case "preparing":
        return <CheckCircle size={14} strokeWidth={3} />
      case "ready":
        return <Truck size={14} strokeWidth={3} />
      default:
        return null
    }
  }

  return (
    <>
      <Header title="Order Management" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3px] border-black shadow-nb p-5 flex flex-col gap-3 nb-interactive"
            >
              <div className={`w-10 h-10 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${stat.color}`}>
                <stat.icon size={20} strokeWidth={3} className="text-black" />
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
          title="All Orders" 
          noTopPad
          badge={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={14} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-gray-100 border-[2px] border-black font-body text-xs outline-none focus:bg-white transition-colors w-44 sm:w-64"
                />
              </div>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-gray-100 border-[2px] border-black font-display font-black text-[10px] uppercase outline-none cursor-pointer focus:bg-white transition-colors"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Acknowledged</option>
                  <option>Preparing</option>
                  <option>Ready</option>
                  <option>Dispatched</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} strokeWidth={3} />
              </div>
              <button className="p-1.5 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-gray-100">
                <RefreshCw size={14} strokeWidth={3} />
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_140px_100px] gap-4 px-6 py-4 border-b-[3px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[1000px]">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Items</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="flex flex-col min-w-[1000px]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, i) => (
                  <div 
                    key={order.id}
                    className={`
                      grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_140px_100px] gap-4 items-center px-6 py-5
                      ${i < filteredOrders.length - 1 ? "border-b-[2px] border-black" : ""}
                      bg-white hover:bg-nb-bg transition-colors duration-100 group
                    `}
                  >
                    <div className="font-mono text-sm font-black text-black underline decoration-black/20 group-hover:decoration-black">{order.id}</div>
                    <div className="font-body text-sm font-bold text-black">{order.customer}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{order.items}</div>
                    <div className="font-display font-black text-sm text-black">{order.amount}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{order.date}</div>
                    
                    <div>
                      <span className={`px-3 py-1 border-[2px] border-black text-black font-display font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_#000] ${BADGE_MAP[order.status]}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="View Details">
                        <Eye size={14} strokeWidth={3} />
                      </button>
                      {order.status !== "dispatched" && (
                        <button className="w-8 h-8 flex items-center justify-center bg-nb-yellow border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Update Status">
                          {renderActionIcon(order.status)}
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-white">
                  <div className="w-16 h-16 bg-nb-bg border-[3px] border-black flex items-center justify-center shadow-nb -rotate-3">
                    <ShoppingCart size={32} className="text-gray-400" strokeWidth={2} />
                  </div>
                  <p className="font-body font-bold text-sm text-gray-400 italic">No orders found.</p>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </main>
    </>
  )
}
