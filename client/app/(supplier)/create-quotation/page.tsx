"use client"

import { useState } from "react"
import { 
  Send, Plus, Trash2, ChevronLeft, Calendar, 
  Clock, FileText, CreditCard, Save, Info,
  PlusCircle
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import Link from "next/link"

export default function CreateQuotationPage() {
  const [items, setItems] = useState([
    { id: 1, description: "", quantity: 1, unit: "Units", rate: 0, total: 0 },
  ])

  const subtotal = items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  const tax = subtotal * 0.10
  const grandTotal = subtotal + tax

  const addItem = () => {
    setItems([...items, { id: Date.now(), description: "", quantity: 1, unit: "Units", rate: 0, total: 0 }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  return (
    <>
      <Header title="Create Quotation" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        <div className="max-w-4xl mx-auto">
          <Panel 
            title="Quotation Details" 
            icon={<PlusCircle size={20} className="text-nb-cyan" />}
            badge="QUO-2024-001"
          >
          
          {/* Breadcrumbs */}
          <div className="flex items-center gap-4">
            <Link 
              href="/customer-requirements"
              className="flex items-center gap-2 px-4 py-2 bg-white border-[3px] border-black shadow-nb font-body font-bold text-sm text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px]"
            >
              <ChevronLeft size={16} strokeWidth={3} />
              Back to Requirements
            </Link>
            <div className="h-8 w-[2px] bg-black/20"></div>
            <p className="font-body text-sm font-bold text-gray-500 italic">Quoting for REQ-9920: Silk Thread Supply</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              
              {/* Line Items Panel */}
              <Panel 
                title="Line Items" 
                badge={
                  <button 
                    onClick={addItem}
                    className="flex items-center gap-1 bg-nb-green border-[2px] border-black px-3 py-1 font-display font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                  >
                    <Plus size={12} strokeWidth={3} />
                    Add Item
                  </button>
                }
              >
                <div className="p-0">
                  <div className="grid grid-cols-[2fr_100px_150px_1fr_40px] gap-4 px-6 py-3 bg-black text-white font-display font-black text-[10px] uppercase tracking-widest">
                    <div>Item Name</div>
                    <div className="text-center">Qty</div>
                    <div>Unit Price</div>
                    <div className="text-right">Total</div>
                    <div></div>
                  </div>
                  
                  <div className="divide-y-[3px] divide-black">
                    {items.map((item) => (
                      <div key={item.id} className="grid grid-cols-[2fr_100px_150px_1fr_40px] gap-4 p-6 items-start bg-white">
                        <div className="space-y-1">
                          <input 
                            type="text" 
                            placeholder="Enter item name..."
                            className="w-full font-body font-bold text-sm outline-none bg-transparent placeholder:text-gray-400 placeholder:italic"
                          />
                        </div>

                        <div className="flex flex-col items-center gap-1">
                          <input 
                            type="number" 
                            defaultValue={item.quantity}
                            className="w-full text-center font-mono font-black text-sm bg-gray-100 border-[2px] border-black p-1 outline-none"
                          />
                          <span className="font-display font-black text-[8px] uppercase text-gray-400">Units</span>
                        </div>

                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display font-black text-[10px] text-gray-400">LKR</span>
                          <input 
                            type="number" 
                            placeholder="0.00"
                            className="w-full pl-12 pr-3 py-2 bg-gray-100 border-[2px] border-black font-mono font-bold text-sm outline-none"
                          />
                        </div>

                        <div className="pt-2 text-right">
                          <span className="font-display font-black text-sm">LKR {item.total.toFixed(2)}</span>
                        </div>

                        <button 
                          onClick={() => removeItem(item.id)}
                          className="pt-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={18} strokeWidth={2.5} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </Panel>

              {/* Notes & Terms Panel */}
              <Panel title="Notes & Terms">
                <div className="p-6 space-y-4">
                  <div className="space-y-2">
                    <label className="font-display font-black text-[10px] uppercase tracking-widest text-gray-400">General Notes / Terms & Conditions</label>
                    <textarea 
                      placeholder="Specify warranty, quality standards, or any specific conditions..."
                      className="w-full h-40 p-4 bg-white border-[3px] border-black font-body text-sm shadow-nb focus:shadow-none transition-all outline-none resize-none placeholder:italic"
                    />
                  </div>
                </div>
              </Panel>
            </div>

            {/* ── RIGHT COLUMN ──────────────────────────────────────────── */}
            <div className="space-y-8">
              
              {/* Timeline & Terms */}
              <Panel title="Timeline & Terms">
                <div className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label className="font-display font-black text-[10px] uppercase tracking-tighter flex items-center gap-2 text-black">
                      <Calendar size={12} strokeWidth={3} /> Valid Until *
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 bg-gray-100 border-[2px] border-black font-body text-sm outline-none shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-display font-black text-[10px] uppercase tracking-tighter flex items-center gap-2 text-black">
                      <Clock size={12} strokeWidth={3} /> Expected Delivery *
                    </label>
                    <input 
                      type="date" 
                      className="w-full px-4 py-2 bg-gray-100 border-[2px] border-black font-body text-sm outline-none shadow-[2px_2px_0px_0px_#000]"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="font-display font-black text-[10px] uppercase tracking-tighter flex items-center gap-2 text-black">
                      <CreditCard size={12} strokeWidth={3} /> Payment Terms *
                    </label>
                    <select className="w-full px-4 py-2 bg-gray-100 border-[2px] border-black font-body text-sm outline-none shadow-[2px_2px_0px_0px_#000] appearance-none cursor-pointer">
                      <option>Net 30 Days</option>
                      <option>Net 15 Days</option>
                      <option>Advance Payment</option>
                      <option>Cash on Delivery</option>
                    </select>
                  </div>
                </div>
              </Panel>

              {/* Financial Summary */}
              <div className="bg-black text-white border-[3px] border-black p-6 shadow-nb space-y-6">
                <div className="flex items-center gap-2 pb-4 border-b border-white/20">
                  <FileText size={18} className="text-nb-green" />
                  <h3 className="font-display font-black text-sm uppercase tracking-widest">Financial Summary</h3>
                </div>

                <div className="space-y-4 font-mono">
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>Subtotal</span>
                    <span className="text-white">LKR {subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center text-xs text-gray-400">
                    <span>VAT / Tax (10%)</span>
                    <span className="text-white">LKR {tax.toLocaleString()}</span>
                  </div>
                  <div className="pt-4 border-t-[2px] border-white/20 flex justify-between items-end">
                    <div className="space-y-1">
                      <p className="font-display font-black text-[10px] uppercase tracking-tighter text-nb-green">Grand Total</p>
                      <p className="font-display font-black text-2xl tracking-tighter">LKR {grandTotal.toLocaleString()}</p>
                    </div>
                    <div className="px-2 py-1 bg-nb-green text-black font-display font-black text-[10px] rounded-sm">LKR</div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="space-y-4">
                <button className="group w-full py-4 bg-nb-green text-black border-[3px] border-black font-display font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px]">
                  Submit Quotation
                  <Send size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                <button className="w-full py-3 bg-white text-black border-[3px] border-black font-display font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px]">
                  Save as Draft
                  <Save size={16} />
                </button>
              </div>

              {/* Info Tip */}
              <div className="bg-nb-yellow p-4 border-[3px] border-black shadow-nb flex gap-3">
                <Info size={24} className="shrink-0" strokeWidth={3} />
                <p className="font-body text-[11px] font-bold leading-tight">
                  Submission will lock this quotation. You can edit it from the ``Quotation Status`` page until reviewed.
                </p>
              </div>

            </div>
          </div>
        </Panel>
      </div>
    </main>
    </>
  )
}

