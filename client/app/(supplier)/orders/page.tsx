"use client"

import { useState, useMemo } from "react"
import { 
<<<<<<< HEAD
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
=======
  Clock, Send, Package, CheckCircle, Truck, 
  Search, ChevronDown, Eye, CheckSquare
} from "lucide-react"
import { Panel } from "@/components/common/Panel"
import { Header } from "@/components/supplier/Header"

// ─── DATA ──────────────────────────────────────────────────────────────────
const ORDERS_DATA = [
  { id: "ORD-20240115", customer: "Acme Corp", items: "3 items", amount: "$147,400", date: "2024-01-15", status: "dispatched" },
  { id: "ORD-20240114", customer: "XYZ Industries", items: "5 items", amount: "$165,200", date: "2024-01-14", status: "ready" },
  { id: "ORD-20240113", customer: "Tech Solutions", items: "2 items", amount: "$89,500", date: "2024-01-13", status: "preparing" },
  { id: "ORD-20240112", customer: "Global Enterprises", items: "4 items", amount: "$201,000", date: "2024-01-12", status: "acknowledged" },
  { id: "ORD-20240111", customer: "Tech Innovations", items: "3 items", amount: "$125,000", date: "2024-01-11", status: "pending" },
]

const STAT_CARDS = [
  { title: "Pending", count: 1, icon: Clock, color: "bg-gray-200" },
  { title: "Acknowledged", count: 1, icon: Send, color: "bg-nb-yellow" },
  { title: "Preparing", count: 1, icon: Package, color: "bg-[#c084fc]" },
  { title: "Ready", count: 1, icon: CheckCircle, color: "bg-nb-cyan" },
  { title: "Dispatched", count: 1, icon: Truck, color: "bg-nb-green" },
]

const BADGE_MAP: Record<string, string> = {
  "pending": "bg-gray-200",
  "acknowledged": "bg-nb-yellow",
  "preparing": "bg-[#c084fc]",
  "ready": "bg-nb-cyan",
  "dispatched": "bg-nb-green",
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
}

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const filteredOrders = useMemo(() => {
    return ORDERS_DATA.filter((order) => {
<<<<<<< HEAD
      const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase())
=======
      const matchesSearch = 
        order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.customer.toLowerCase().includes(searchQuery.toLowerCase())
      
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
      const matchesStatus = 
        statusFilter === "All Status" || 
        order.status.toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter])

<<<<<<< HEAD
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
=======
  const renderActionIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <CheckSquare size={16} strokeWidth={2} />
      case "acknowledged":
        return <Package size={16} strokeWidth={2} />
      case "preparing":
        return <CheckCircle size={16} strokeWidth={2} />
      case "ready":
        return <Truck size={16} strokeWidth={2} />
      default:
        return null
    }
  }

  return (
    <>
      <Header title="Orders" />

      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-4 flex flex-col gap-3 nb-interactive"
            >
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${stat.color}`}>
                  <stat.icon size={16} strokeWidth={2.5} className="text-black" />
                </div>
              </div>
              <div>
                <div className="font-body font-bold text-xs text-gray-600 mb-1">{stat.title}</div>
                <div className="font-display font-black text-2xl text-black">
                  {stat.count}
                </div>
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
              </div>
            </div>
          ))}
        </div>

<<<<<<< HEAD
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
=======
        {/* ── MAIN PANEL & CONTROLS ─────────────────────────────────── */}
        <Panel title="All Orders" noTopPad badge={filteredOrders.length}>
          <div className="flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b-[3px] border-black bg-white">
              <div className="relative w-full sm:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
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
                  <option>Acknowledged</option>
                  <option>Preparing</option>
                  <option>Ready</option>
                  <option>Dispatched</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_1.5fr_1fr] gap-4 px-5 py-3 border-b-[2px] border-black bg-black text-white font-display font-black text-xs uppercase tracking-widest min-w-[1000px]">
                <div>Order ID</div>
                <div>Customer Name</div>
                <div>Total Items</div>
                <div>Total Amount</div>
                <div>Order Date</div>
                <div>Delivery Status</div>
                <div className="text-right">Actions</div>
              </div>
              
              <div className="flex flex-col min-w-[1000px]">
                {filteredOrders.map((order, i) => (
                  <div 
                    key={order.id}
                    className={`
                      grid grid-cols-[1.2fr_1.5fr_1fr_1fr_1fr_1.5fr_1fr] gap-4 items-center px-5 py-4
                      ${i < filteredOrders.length - 1 ? "border-b-[2px] border-black" : ""}
                      odd:bg-white even:bg-nb-bg hover:bg-nb-yellow transition-colors duration-100
                    `}
                  >
                    <div className="font-mono text-sm font-bold text-black">{order.id}</div>
                    <div className="font-body text-sm text-black">{order.customer}</div>
                    <div className="font-mono text-sm text-black">{order.items}</div>
                    <div className="font-mono text-sm text-black">{order.amount}</div>
                    <div className="font-mono text-sm text-black">{order.date}</div>

                    <div>
                      <span className={`px-2 py-0.5 border-[2px] border-black text-black font-mono font-bold text-xs ${BADGE_MAP[order.status]}`}>
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
<<<<<<< HEAD
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
=======
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black hover:bg-gray-100 transition-colors" title="View Order">
                        <Eye size={16} strokeWidth={2} />
                      </button>
                      {order.status !== "dispatched" && (
                        <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black hover:bg-gray-100 transition-colors" title="Update Status">
                          {renderActionIcon(order.status)}
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
            </div>
          </div>
        </Panel>
      </main>
    </>
  )
}
<<<<<<< HEAD

=======
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
