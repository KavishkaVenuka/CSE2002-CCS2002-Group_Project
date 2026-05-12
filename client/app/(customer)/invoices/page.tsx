"use client"

import { useState } from "react"
import { CheckCircle2, DollarSign, FileWarning, Receipt, Eye, Download, FileText, Printer, X } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const INVOICES = [
  { id: "INV-20240115", orderRef: "ORD-20240115", date: "2024-01-15", amount: "$15,000", status: "paid" },
  { id: "INV-20240114", orderRef: "ORD-20240114", date: "2024-01-14", amount: "$22,000", status: "unpaid" },
  { id: "INV-20240113", orderRef: "ORD-20240113", date: "2024-01-13", amount: "$8,500",  status: "paid" },
  { id: "INV-20240112", orderRef: "ORD-20240112", date: "2024-01-12", amount: "$18,000", status: "overdue" },
]

const STAT_CARDS = [
  { label: "Paid",    count: 2, icon: CheckCircle2, color: "bg-nb-green"  },
  { label: "Unpaid",  count: 1, icon: DollarSign,   color: "bg-nb-yellow" },
  { label: "Overdue", count: 1, icon: FileWarning,   color: "bg-nb-red"   },
]

const BADGE: Record<string, string> = {
  paid:    "bg-nb-green",
  unpaid:  "bg-nb-yellow",
  overdue: "bg-nb-red",
}

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<(typeof INVOICES)[0] | null>(null)

  return (
    <>
      <DashboardHeader title="Invoices" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">

        {/* ── STAT CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {STAT_CARDS.map(s => (
            <div key={s.label} className={`${s.color} border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4 nb-interactive`}>
              <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
                <s.icon size={22} strokeWidth={2.5} className="text-black" />
              </div>
              <div>
                <p className="font-body font-bold text-xs text-black uppercase tracking-wider">{s.label}</p>
                <h3 className="font-display font-black text-3xl text-black leading-none">{s.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE PANEL ────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center gap-3">
            <Receipt size={18} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">All Invoices</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[150px_140px_110px_110px_120px_110px] px-5 py-3 border-b-[2px] border-black bg-nb-bg min-w-[760px]">
              {["Invoice ID","Order Ref","Date","Amount","Status","Actions"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>
            <div className="min-w-[760px]">
              {INVOICES.map((inv, i) => (
                <div key={inv.id} className={`grid grid-cols-[150px_140px_110px_110px_120px_110px] items-center px-5 py-4 hover:bg-nb-yellow/20 transition-colors ${i < INVOICES.length - 1 ? "border-b-[2px] border-black" : ""}`}>
                  <div className="font-mono text-sm font-bold text-black">{inv.id}</div>
                  <div className="font-mono text-xs text-black">{inv.orderRef}</div>
                  <div className="font-mono text-xs text-black">{inv.date}</div>
                  <div className="font-display font-black text-sm text-black">{inv.amount}</div>
                  <div>
                    <span className={`px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase ${BADGE[inv.status]}`}>
                      {inv.status}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setSelectedInvoice(inv)}
                      className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                      title="View"
                    >
                      <Eye size={14} strokeWidth={2.5} />
                    </button>
                    <button
                      className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                      title="Download"
                    >
                      <Download size={14} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* ── INVOICE MODAL ──────────────────────────────────────── */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_#000] w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="bg-black px-6 py-4 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <FileText size={18} strokeWidth={2.5} className="text-white" />
                <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Invoice Preview</h2>
              </div>
              <div className="flex items-center gap-3">
                <button className="flex items-center gap-2 px-3 py-1.5 bg-white border-[2px] border-white font-body font-bold text-xs text-black hover:bg-nb-yellow transition-colors">
                  <Printer size={14} strokeWidth={2.5} /> Print
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="w-8 h-8 flex items-center justify-center bg-nb-red border-[2px] border-white text-white hover:bg-white hover:text-nb-red transition-colors">
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Invoice body */}
            <div className="overflow-y-auto p-8 flex justify-center">
              <div className="w-full max-w-2xl bg-white border-[2px] border-black p-10 space-y-8">
                {/* Invoice head */}
                <div className="flex justify-between items-start">
                  <div>
                    <h1 className="font-display font-black text-4xl tracking-widest text-black mb-4">INVOICE</h1>
                    <div className="space-y-1 font-mono text-sm text-gray-600">
                      <div>Invoice #: <span className="text-black font-bold">{selectedInvoice.id}</span></div>
                      <div>Date: <span className="text-black font-bold">{selectedInvoice.date}</span></div>
                      <div>Order #: <span className="text-black font-bold">{selectedInvoice.orderRef}</span></div>
                    </div>
                  </div>
                  <div className="text-right font-body text-sm text-gray-600 space-y-1">
                    <div className="font-display font-black text-base text-black">Supplier Company</div>
                    <div>456 Supplier Avenue</div>
                    <div>New York, NY 10002</div>
                    <div>+1 234 567 8901</div>
                  </div>
                </div>

                {/* Bill to */}
                <div className="border-[2px] border-black p-4 bg-nb-bg w-2/3">
                  <p className="font-display font-black text-[10px] uppercase tracking-widest mb-2">Bill To:</p>
                  <p className="font-body font-bold text-sm text-black">Your Company Name</p>
                  <p className="font-body text-sm text-gray-600">123 Business Street, Suite 400<br/>New York, NY 10001</p>
                </div>

                {/* Items */}
                <div className="border-[2px] border-black overflow-hidden">
                  <div className="grid grid-cols-[1fr_60px_90px_90px] bg-black px-4 py-2">
                    {["Item","Qty","Unit Price","Total"].map(h => (
                      <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-white">{h}</div>
                    ))}
                  </div>
                  {[["Product A - Electronics","500","$250","$125,000"],["Product B - Furniture","300","$180","$54,000"],["Product C - Textiles","200","$45","$9,000"]].map(([name,qty,price,total],i) => (
                    <div key={i} className={`grid grid-cols-[1fr_60px_90px_90px] px-4 py-3 ${i < 2 ? "border-b-[2px] border-black" : ""}`}>
                      <div className="font-body text-sm text-black">{name}</div>
                      <div className="font-mono text-xs text-black">{qty}</div>
                      <div className="font-mono text-xs text-black">{price}</div>
                      <div className="font-display font-black text-sm text-black">{total}</div>
                    </div>
                  ))}
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-60 space-y-3">
                    {[["Subtotal","$134,000"],["Tax (10%)","$13,400"]].map(([l,v]) => (
                      <div key={l} className="flex justify-between font-body text-sm">
                        <span className="text-gray-600">{l}</span><span className="font-bold">{v}</span>
                      </div>
                    ))}
                    <div className="flex justify-between items-center border-t-[3px] border-black pt-3">
                      <span className="font-display font-black text-sm uppercase">Total</span>
                      <span className="font-display font-black text-xl">$147,400</span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t-[2px] border-dashed border-black pt-6">
                  <p className="font-body font-bold text-sm text-black">Thank you for your business!</p>
                  <p className="font-body text-xs text-gray-500 mt-1">Payment due within 30 days.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}