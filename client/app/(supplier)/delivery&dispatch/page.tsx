"use client"

import { useState } from "react"
import { Truck, ChevronDown, Package, Send, ClipboardList, User, Car, RotateCcw } from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

export default function DeliverDispatchPage() {
  const [selectedOrder, setSelectedOrder] = useState("")

  return (
    <>
      <Header title="Delivery & Dispatch" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN (1/3) ────────────────────────────────────── */}
          <div className="space-y-8">
            {/* Select Order */}
            <Panel title="Select Order" icon={<Package size={18} className="text-nb-green" />}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">Order Reference</label>
                  <div className="relative">
                    <select 
                      value={selectedOrder}
                      onChange={(e) => setSelectedOrder(e.target.value)}
                      className="w-full appearance-none px-4 py-3 bg-white border-[2px] border-black font-body text-sm outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer"
                    >
                      <option value="">Select an order</option>
                      <option value="ORD-8842">ORD-8842 (Modern Fabrics)</option>
                      <option value="ORD-8821">ORD-8821 (Satin Smooth)</option>
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={16} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Panel>

            {/* Item Fulfillment */}
            <Panel title="Item Fulfillment" icon={<ClipboardList size={18} className="text-nb-cyan" />} dark>
              <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-12 h-12 bg-white/10 border-[2px] border-white/20 flex items-center justify-center shadow-nb-sm">
                  <RotateCcw size={20} className="text-white/20" />
                </div>
                <p className="font-body text-sm text-white/40 italic">
                  {selectedOrder ? "Loading fulfillment data..." : "Select an order to see progress"}
                </p>
              </div>
            </Panel>
          </div>

          {/* ── RIGHT COLUMN (2/3) ───────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dispatch Information */}
            <Panel title="Dispatch Information" icon={<Send size={18} className="text-nb-cyan" />}>
              <div className="p-8 space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Car size={14} strokeWidth={3} />
                      Vehicle Number *
                    </label>
                    <input 
                      type="text" 
                      placeholder="e.g. WP-ABC-1234" 
                      className="w-full px-4 py-3 bg-white border-[2px] border-black font-body text-sm outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} strokeWidth={3} />
                      Driver Name *
                    </label>
                    <input 
                      type="text" 
                      placeholder="Enter driver name" 
                      className="w-full px-4 py-3 bg-white border-[2px] border-black font-body text-sm outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">Delivery Notes</label>
                  <textarea 
                    rows={4}
                    placeholder="Add special instructions for delivery..." 
                    className="w-full px-4 py-3 bg-white border-[2px] border-black font-body text-sm outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t-[2px] border-black/5">
                  <button className="flex items-center gap-3 px-8 py-4 bg-nb-green text-black font-display font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-green-400">
                    Finalize Dispatch
                    <Send size={18} strokeWidth={3} />
                  </button>
                </div>
              </div>
            </Panel>

            {/* Itemized Transit Status */}
            <Panel title="Itemized Transit Status" icon={<Truck size={18} className="text-nb-yellow" />}>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-8 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest">
                  <div>Product</div>
                  <div>Ordered</div>
                  <div>In Transit</div>
                  <div>Received</div>
                </div>
                <div className="p-16 flex flex-col items-center justify-center text-center">
                   <div className="w-16 h-16 bg-gray-50 border-[2px] border-black shadow-nb flex items-center justify-center mb-4">
                    <Truck size={32} className="text-gray-300" />
                  </div>
                  <p className="font-body text-sm text-gray-400 italic">No progress data available</p>
                </div>
              </div>
            </Panel>
          </div>

        </div>
      </main>
    </>
  )
}
