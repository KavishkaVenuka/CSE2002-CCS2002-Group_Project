"use client"

import { useState, useMemo } from "react"
import { 
  Clock, Send, Package, CheckCircle, Truck, 
  Search, ChevronDown, Eye, CheckSquare,
  Check, Circle, Upload, Calendar
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

const PROGRESS_STEPS = [
  { id: 1, title: "Order Received", desc: "Order confirmed from customer", time: "2024-01-14 10:00 AM", status: "completed" },
  { id: 2, title: "Goods Prepared", desc: "All items packed and ready", time: "2024-01-14 02:30 PM", status: "completed" },
  { id: 3, title: "Dispatched", desc: "Enter dispatch details", time: null, status: "active" },
  { id: 4, title: "In Transit", desc: "Awaiting dispatch", time: null, status: "pending" },
  { id: 5, title: "Delivered", desc: "Awaiting delivery confirmation", time: null, status: "pending" },
]

const BADGE_MAP: Record<string, string> = {
  "pending": "bg-gray-200",
  "acknowledged": "bg-nb-yellow",
  "preparing": "bg-[#c084fc]",
  "ready": "bg-nb-cyan",
  "dispatched": "bg-nb-green",
}

export default function DeliverAndDispatchPage() {
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
      case "pending": return <CheckSquare size={16} strokeWidth={2} />
      case "acknowledged": return <Package size={16} strokeWidth={2} />
      case "preparing": return <CheckCircle size={16} strokeWidth={2} />
      case "ready": return <Truck size={16} strokeWidth={2} />
      default: return null
    }
  }

  return (
    <>
      <Header title="Deliver & Dispatch" />

      <main className="flex-1 overflow-auto p-6 space-y-8 bg-nb-bg">
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
              </div>
            </div>
          ))}
        </div>

        {/* ── ALL ORDERS TABLE ───────────────────────────────────────── */}
        <Panel title="All Orders" noTopPad badge={filteredOrders.length}>
          <div className="flex flex-col">
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
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
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
            </div>
          </div>
        </Panel>

        {/* ── DELIVERY PROGRESS ──────────────────────────────────────── */}
        <Panel title="Delivery Progress" noTopPad>
          <div className="p-6 bg-white flex flex-col relative">
            <div className="absolute left-11 top-10 bottom-10 w-0.5 bg-black" />
            
            {PROGRESS_STEPS.map((step, i) => {
              const isCompleted = step.status === "completed"
              const isActive = step.status === "active"
              const isPending = step.status === "pending"

              let icon = <Circle size={16} strokeWidth={3} className="text-gray-400" />
              let iconBg = "bg-white border-gray-300"
              let cardStyle = "bg-white border-gray-300 shadow-none"

              if (isCompleted) {
                icon = <Check size={16} strokeWidth={3} className="text-black" />
                iconBg = "bg-nb-green border-black shadow-[2px_2px_0px_0px_#000]"
                cardStyle = "bg-nb-green border-black shadow-[4px_4px_0px_0px_#000]"
              } else if (isActive) {
                icon = <Clock size={16} strokeWidth={3} className="text-black" />
                iconBg = "bg-nb-yellow border-black shadow-[2px_2px_0px_0px_#000]"
                cardStyle = "bg-nb-yellow border-black shadow-[4px_4px_0px_0px_#000]"
              }

              return (
                <div key={step.id} className="relative flex gap-6 z-10 mb-6 last:mb-0 items-start">
                  <div className={`w-10 h-10 rounded-full border-[2px] flex items-center justify-center flex-shrink-0 mt-1 ${iconBg}`}>
                    {icon}
                  </div>
                  <div className={`flex-1 flex flex-col md:flex-row md:items-center justify-between border-[3px] p-5 ${cardStyle}`}>
                    <div>
                      <h3 className={`font-display font-black text-lg ${isPending ? 'text-gray-500' : 'text-black'}`}>
                        {step.title}
                      </h3>
                      <p className={`font-body text-sm mt-1 ${isPending ? 'text-gray-400' : 'text-black'}`}>
                        {step.desc}
                      </p>
                    </div>
                    {step.time && (
                      <div className="mt-3 md:mt-0 font-mono text-xs font-bold text-black bg-white px-3 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                        {step.time}
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </Panel>

        {/* ── DISPATCH DETAILS FORM ──────────────────────────────────── */}
        <Panel title="Dispatch Details" noTopPad>
          <div className="p-6 bg-white flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-body font-bold text-sm text-black">Tracking Number *</label>
                <input 
                  type="text" 
                  placeholder="Enter tracking number" 
                  className="w-full px-4 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-body font-bold text-sm text-black">Vehicle Number *</label>
                <input 
                  type="text" 
                  placeholder="Enter vehicle number" 
                  className="w-full px-4 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-body font-bold text-sm text-black">Driver Name *</label>
                <input 
                  type="text" 
                  placeholder="Enter driver name" 
                  className="w-full px-4 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-body font-bold text-sm text-black">Dispatch Date *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm text-black outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none appearance-none"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-body font-bold text-sm text-black">Delivery Notes</label>
              <textarea 
                placeholder="Add delivery instructions or special notes..." 
                rows={3}
                className="w-full px-4 py-3 bg-white border-[2px] border-black shadow-[4px_4px_0px_0px_#000] font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none resize-y"
              ></textarea>
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-body font-bold text-sm text-black">Upload Delivery Note / Invoice</label>
              <div className="border-[3px] border-dashed border-black bg-nb-bg p-8 flex flex-col items-center justify-center gap-4 hover:bg-nb-yellow transition-colors cursor-pointer nb-interactive">
                <Upload size={32} strokeWidth={2} className="text-black" />
                <p className="font-body text-sm text-black text-center">
                  <span className="font-bold underline">Click to upload</span> delivery documents
                </p>
                <button className="px-4 py-2 bg-white border-[2px] border-black font-body font-bold text-sm shadow-[2px_2px_0px_0px_#000]">
                  Choose File
                </button>
              </div>
            </div>

            <div className="flex justify-end mt-4">
              <button className="flex items-center gap-2 bg-nb-green border-[3px] border-black px-6 py-3 font-display font-black text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                <Send size={18} strokeWidth={2.5} />
                Mark as Dispatched
              </button>
            </div>
          </div>
        </Panel>
      </main>
    </>
  )
}
