"use client"

import { useState, useMemo } from "react"
import { 
  ShoppingCart, Search, ChevronDown, Clock, 
  Truck, CheckCircle, Eye, Download, RefreshCw, 
  Package
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

// ─── DATA ──────────────────────────────────────────────────────────────────
const ORDERS_DATA = [
  { id: "PO-8842", amount: "LKR 22,500.00", orderDate: "2024-02-11", expectedDelivery: "2024-02-25", status: "confirmed" },
  { id: "PO-8835", amount: "LKR 12,400.00", orderDate: "2024-02-09", expectedDelivery: "2024-02-23", status: "dispatched" },
  { id: "PO-8829", amount: "LKR 8,900.00", orderDate: "2024-02-05", expectedDelivery: "2024-02-19", status: "delivered" },
]

const STAT_CARDS = [
  { title: "Total Orders", value: "12", icon: ShoppingCart, color: "bg-nb-cyan" },
  { title: "Confirmed", value: "5", icon: CheckCircle, color: "bg-nb-yellow" },
  { title: "Dispatched", value: "3", icon: Truck, color: "bg-nb-cyan" },
  { title: "Delivered", value: "4", icon: Package, color: "bg-nb-green" },
]

const STATUS_BADGE: Record<string, string> = {
  "confirmed": "bg-nb-yellow",
  "dispatched": "bg-nb-cyan",
  "delivered": "bg-nb-green",
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredOrders = useMemo(() => {
    return ORDERS_DATA.filter((order) => {
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = 
        statusFilter === "All Status" || 
        order.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

  return (
    <>
      <Header title="Order Management" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3px] border-black shadow-nb p-5 flex flex-col gap-3 nb-interactive"
            >
              <div className={`w-10 h-10 rounded-lg border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${stat.color}`}>
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
          title="Purchase Orders" 
          noTopPad
          badge={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={14} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search PO ID..." 
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
                  <option>Confirmed</option>
                  <option>Dispatched</option>
                  <option>Delivered</option>
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
            <div className="grid grid-cols-[140px_1fr_140px_180px_140px_100px] gap-4 px-6 py-4 border-b-[3px] border-black bg-gray-50 text-gray-400 font-display font-black text-[10px] uppercase tracking-widest min-w-[900px]">
              <div>PO ID</div>
              <div>Amount</div>
              <div>Order Date</div>
              <div>Expected Delivery</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="flex flex-col min-w-[900px]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((order, i) => (
                  <div 
                    key={order.id}
                    className={`
                      grid grid-cols-[140px_1fr_140px_180px_140px_100px] gap-4 items-center px-6 py-5
                      ${i < filteredOrders.length - 1 ? "border-b-[2px] border-black" : ""}
                      bg-white hover:bg-nb-bg transition-colors duration-100 group
                    `}
                  >
                    <div className="font-mono text-sm font-black text-black underline decoration-black/20 group-hover:decoration-black">{order.id}</div>
                    <div className="font-display font-black text-sm text-black">{order.amount}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{order.orderDate}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{order.expectedDelivery}</div>
                    
                    <div>
                      <span className={`px-3 py-1 border-[2px] border-black text-black font-display font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_#000] ${STATUS_BADGE[order.status]}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="View Details">
                        <Eye size={14} strokeWidth={3} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Download Invoice">
                        <Download size={14} strokeWidth={3} />
                      </button>
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

