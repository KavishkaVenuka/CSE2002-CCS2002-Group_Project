"use client"

import { useState } from "react"
import { DollarSign, CreditCard, Clock, Upload, X, Save, Send, ChevronDown } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const PENDING_INVOICES = [
  { id: "INV-20240114", orderRef: "ORD-20240114", dueDate: "2024-02-13", amount: "$22,000" },
  { id: "INV-20240112", orderRef: "ORD-20240112", dueDate: "2024-02-11", amount: "$18,000" },
]

export default function PaymentsPage() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("INV-20240114")
  const selectedInvoice = PENDING_INVOICES.find(i => i.id === selectedInvoiceId)

  return (
    <>
      <DashboardHeader title="Payments" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">

        {/* ── PENDING INVOICES ─────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center gap-3">
            <DollarSign size={18} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Pending Invoices</h2>
          </div>
          <div className="p-5 space-y-4">
            {PENDING_INVOICES.map(inv => (
              <div
                key={inv.id}
                onClick={() => setSelectedInvoiceId(inv.id)}
                className={`border-[2px] border-black p-5 flex justify-between items-center cursor-pointer transition-all duration-100 ${selectedInvoiceId === inv.id ? "bg-nb-yellow shadow-[3px_3px_0px_0px_#000] translate-x-[1px] translate-y-[1px]" : "bg-white hover:bg-nb-yellow/30"}`}
              >
                <div>
                  <p className="font-display font-black text-sm text-black">{inv.id}</p>
                  <p className="font-mono text-xs text-gray-600 mt-1">Order: {inv.orderRef}</p>
                  <p className="font-mono text-xs text-gray-600">Due: {inv.dueDate}</p>
                </div>
                <div className="text-right space-y-2">
                  <p className="font-display font-black text-xl text-black">{inv.amount}</p>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-nb-yellow border-[2px] border-black font-mono font-bold text-[10px] uppercase">
                    <Clock size={10} strokeWidth={2.5} /> Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── SUBMIT PAYMENT ───────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center gap-3">
            <CreditCard size={18} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Submit Payment</h2>
          </div>
          <div className="p-6 space-y-6">

            {/* Invoice selector */}
            <div className="space-y-2">
              <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                Select Invoice <span className="text-nb-red">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedInvoiceId}
                  onChange={e => setSelectedInvoiceId(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-nb-yellow border-[2px] border-black font-body font-bold text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all cursor-pointer"
                >
                  <option value="">Choose invoice to pay…</option>
                  {PENDING_INVOICES.map(inv => (
                    <option key={inv.id} value={inv.id}>{inv.id} — {inv.amount}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={16} strokeWidth={2.5} />
              </div>
            </div>

            {selectedInvoice && (
              <>
                {/* Summary info */}
                <div className="grid grid-cols-2 border-[2px] border-black overflow-hidden">
                  <div className="p-4 border-r-[2px] border-black bg-nb-cyan/20">
                    <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">Invoice ID</p>
                    <p className="font-display font-black text-base text-black">{selectedInvoice.id}</p>
                  </div>
                  <div className="p-4 bg-nb-green/20">
                    <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">Amount to Pay</p>
                    <p className="font-display font-black text-xl text-black">{selectedInvoice.amount}</p>
                  </div>
                </div>

                {/* Payment method */}
                <div className="space-y-2">
                  <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                    Payment Method <span className="text-nb-red">*</span>
                  </label>
                  <div className="relative">
                    <select className="w-full appearance-none px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all cursor-pointer">
                      <option>Bank Transfer</option>
                      <option>Credit Card</option>
                      <option>Check</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={16} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="space-y-2">
                  <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                    Transaction ID <span className="text-nb-red">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Enter transaction reference number"
                    className="w-full px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">Notes (Optional)</label>
                  <textarea
                    placeholder="Add any additional notes…"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black resize-vertical shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Upload proof */}
                <div className="space-y-2">
                  <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                    Upload Payment Proof <span className="text-nb-red">*</span>
                  </label>
                  <div className="border-[2px] border-dashed border-black py-10 flex flex-col items-center gap-4 bg-nb-bg hover:bg-nb-cyan/20 hover:border-nb-cyan transition-all cursor-pointer">
                    <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                      <Upload size={20} strokeWidth={2.5} className="text-black" />
                    </div>
                    <div className="text-center">
                      <p className="font-display font-black text-sm text-black">Click to upload or drag and drop</p>
                      <p className="font-body text-xs text-gray-500 mt-1">PDF, PNG, JPG (Max 5MB)</p>
                    </div>
                    <button className="px-4 py-2 bg-white border-[2px] border-black font-body font-bold text-xs uppercase text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                      Choose File
                    </button>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex justify-end gap-3 pt-4 border-t-[3px] border-black">
                  <button
                    onClick={() => setSelectedInvoiceId("")}
                    className="flex items-center gap-2 px-4 py-2.5 bg-white text-black font-body font-bold text-sm border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all"
                  >
                    <X size={16} strokeWidth={2.5} /> Reset
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-nb-cyan text-black font-body font-bold text-sm border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all">
                    <Save size={16} strokeWidth={2.5} /> Save Draft
                  </button>
                  <button className="flex items-center gap-2 px-4 py-2.5 bg-black text-white font-display font-black text-sm uppercase tracking-widest border-[2px] border-black shadow-[4px_4px_0px_0px_#4ade80] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    <Send size={16} strokeWidth={2.5} /> Submit Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>
    </>
  )
}