"use client"

import { useState } from "react"
import { 
  Package, FileText, Plus, Trash2, UploadCloud, 
  Edit3, ChevronDown, Send, Clock, AlertCircle,
  CheckCircle2, XCircle, ArrowRight
} from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { Panel } from "@/components/common/Panel"

interface RequirementItem {
  id: number
  name: string
  quantity: string
  unit: string
  deliveryDate: string
  notes: string
}

export default function SendRequirements() {
  const [items, setItems] = useState<RequirementItem[]>([
    { id: 1, name: "", quantity: "", unit: "Units", deliveryDate: "", notes: "" }
  ])

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now(), name: "", quantity: "",
      unit: "Units", deliveryDate: "", notes: ""
    }])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length === 1) return
    setItems(items.filter(item => item.id !== id))
  }

  const handleChange = (id: number, field: keyof RequirementItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  return (
    <>
      <DashboardHeader title="Procurement" dateString="Thursday, 24 April 2026" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        
        {/* ── PREMIUM HEADER BANNER ───────────────────────────────────── */}
        <div className="bg-black border-[4px] border-black shadow-[8px_8px_0px_0px_#A5E6DC] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A5E6DC]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 font-mono text-[10px] text-[#A5E6DC] uppercase tracking-widest">
                Customer Portal V2.0
              </div>
              <h1 className="font-display font-black text-5xl text-white">
                Requirement <span className="text-[#A5E6DC]">Intelligence</span>
              </h1>
              <p className="font-body text-sm text-gray-400 max-w-xl">
                Streamline your procurement process by sending detailed requirements directly to our administration for rapid quotation and fulfillment.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 border-[2px] border-white/10 flex flex-col items-center justify-center min-w-[160px]">
              <span className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest mb-1">Health Score</span>
              <span className="font-display font-black text-4xl text-[#22c55e]">98%</span>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Sent", value: "0", icon: <Send size={20} />, color: "bg-nb-cyan" },
            { label: "Quoted", value: "0", icon: <CheckCircle2 size={20} />, color: "bg-nb-green" },
            { label: "Pending", value: "0", icon: <Clock size={20} />, color: "bg-nb-yellow" },
            { label: "Rejected", value: "0", icon: <XCircle size={20} />, color: "bg-nb-red" }
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} border-[3px] border-black shadow-nb p-6 flex items-center gap-5 nb-interactive`}>
              <div className="w-12 h-12 bg-white border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                {stat.icon}
              </div>
              <div>
                <p className="font-display font-black text-[10px] text-black uppercase tracking-widest">{stat.label}</p>
                <h3 className="font-display font-black text-3xl text-black">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── NEW REQUEST SECTION ──────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black flex items-center justify-center border-[2px] border-black shadow-[3px_3px_0px_0px_#A5E6DC]">
                <Plus size={20} className="text-white" strokeWidth={3} />
              </div>
              <h2 className="font-display font-black text-2xl text-black">Draft New Request</h2>
            </div>
            <button 
              onClick={handleAddItem}
              className="px-6 py-3 bg-white border-[3px] border-black font-display font-black text-xs uppercase tracking-widest shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Add New Line Item
            </button>
          </div>

          <div className="bg-white border-[4px] border-black shadow-nb overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_150px_1fr_60px] gap-4 px-6 py-4 bg-black text-white font-display font-black text-[10px] uppercase tracking-widest">
              <div>Product Selection</div>
              <div>Quantity</div>
              <div>Delivery Deadline</div>
              <div>Specifications / Notes</div>
              <div className="text-right">Action</div>
            </div>

            <div className="divide-y-[2px] divide-black">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[1fr_120px_150px_1fr_60px] gap-4 px-6 py-6 items-start bg-white">
                  {/* Product */}
                  <div className="relative">
                    <select
                      value={item.name}
                      onChange={e => handleChange(item.id, "name", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors appearance-none"
                    >
                      <option value="">Select Product...</option>
                      <option value="Laptop">Industrial Laptop</option>
                      <option value="Monitor">4K Monitor</option>
                      <option value="Raw Silk">Premium Raw Silk</option>
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      value={item.quantity}
                      onChange={e => handleChange(item.id, "quantity", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-mono text-sm outline-none focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Deadline */}
                  <input
                    type="date"
                    value={item.deliveryDate}
                    onChange={e => handleChange(item.id, "deliveryDate", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-mono text-xs outline-none focus:bg-white transition-colors"
                  />

                  {/* Notes */}
                  <input
                    type="text"
                    placeholder="e.g. Color requirements..."
                    value={item.notes}
                    onChange={e => handleChange(item.id, "notes", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors"
                  />

                  {/* Delete */}
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length === 1}
                      className="text-nb-red hover:scale-110 transition-transform disabled:opacity-20"
                    >
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── DISPATCH FOOTER ─────────────────────────────────────────── */}
        <div className="bg-nb-cyan border-[4px] border-black shadow-nb p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h3 className="font-display font-black text-2xl text-black">Ready to dispatch?</h3>
            <p className="font-body text-sm font-bold text-black/60">Double-check your quantities and deadlines before submission.</p>
          </div>
          <button className="flex items-center gap-3 px-8 py-4 bg-black text-white font-display font-black text-sm uppercase tracking-widest border-[2px] border-black shadow-[6px_6px_0px_0px_#fff] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all">
            Dispatch Requirement <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>

        {/* ── ACTIVITY LOG ────────────────────────────────────────────── */}
        <Panel 
          title="Activity Log" 
          icon={<Clock size={18} className="text-black" />}
          badge={<span className="font-mono text-[10px] font-black text-gray-400">LIVE UPDATES</span>}
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[150px_1fr_150px_100px] gap-4 px-6 py-4 bg-gray-100 border-b-[2px] border-black font-display font-black text-[10px] uppercase tracking-widest">
              <div>Reference ID</div>
              <div>Timestamp</div>
              <div>Current Status</div>
              <div className="text-right">Actions</div>
            </div>
            <div className="p-12 flex flex-col items-center justify-center gap-4 bg-white">
              <div className="w-10 h-10 border-[4px] border-nb-cyan border-t-black animate-spin" />
              <p className="font-mono text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading history...</p>
            </div>
          </div>
        </Panel>

      </main>
    </>
  )
}