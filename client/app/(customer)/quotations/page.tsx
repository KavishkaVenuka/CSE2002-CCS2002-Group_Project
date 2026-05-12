"use client"

import { useState } from "react"
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Search, Eye, Check, X, ChevronDown } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const QUOTATIONS = [
  { id: "QT-20240115", reqRef: "REQ-20240110", date: "2024-01-15", expiryDate: "2024-01-25", items: 3, amount: "$15,000", status: "pending" },
  { id: "QT-20240112", reqRef: "REQ-20240108", date: "2024-01-12", expiryDate: "2024-01-22", items: 5, amount: "$22,000", status: "accepted" },
  { id: "QT-20240110", reqRef: "REQ-20240105", date: "2024-01-10", expiryDate: "2024-01-20", items: 2, amount: "$8,500", status: "rejected" },
  { id: "QT-20240108", reqRef: "REQ-20240103", date: "2024-01-08", expiryDate: "2024-01-15", items: 4, amount: "$18,000", status: "expired" },
]

const STAT_CARDS = [
  { label: "Pending",  count: 1, icon: Clock,       color: "bg-nb-yellow" },
  { label: "Accepted", count: 1, icon: CheckCircle2, color: "bg-nb-green"  },
  { label: "Rejected", count: 1, icon: XCircle,      color: "bg-nb-red"   },
  { label: "Expired",  count: 1, icon: AlertCircle,  color: "bg-gray-300" },
]

const BADGE: Record<string, string> = {
  pending:  "bg-nb-yellow",
  accepted: "bg-nb-green",
  rejected: "bg-nb-red",
  expired:  "bg-gray-300",
}

const BADGE_ICON: Record<string, React.ElementType> = {
  pending:  Clock,
  accepted: CheckCircle2,
  rejected: XCircle,
  expired:  AlertCircle,
}

export default function QuotationsPage() {
  const [selectedQuotation, setSelectedQuotation] = useState<(typeof QUOTATIONS)[0] | null>(null)

  return (
    <>
      <DashboardHeader title="Quotations" />

      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">

        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((s) => (
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

        {/* ── TABLE PANEL ───────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          {/* Panel header */}
          <div className="bg-black px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={18} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">All Quotations</h2>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <input
                  type="text"
                  placeholder="Search quotations…"
                  className="pl-9 pr-4 py-2 bg-white border-[2px] border-white font-body text-sm focus:outline-none shadow-[2px_2px_0px_0px_#fff] w-52"
                />
              </div>
              {/* Filter */}
              <div className="relative">
                <select className="appearance-none pl-3 pr-8 py-2 bg-nb-yellow border-[2px] border-white font-body font-bold text-sm text-black focus:outline-none cursor-pointer shadow-[2px_2px_0px_0px_#fff]">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                  <option>Expired</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[140px_140px_110px_110px_70px_110px_120px_110px] gap-0 px-5 py-3 border-b-[2px] border-black bg-nb-bg min-w-[900px]">
              {["Quotation ID","Req. Ref","Date","Expiry","Items","Amount","Status","Actions"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>

            <div className="min-w-[900px]">
              {QUOTATIONS.map((q, i) => {
                const Icon = BADGE_ICON[q.status]
                return (
                  <div
                    key={q.id}
                    className={`grid grid-cols-[140px_140px_110px_110px_70px_110px_120px_110px] gap-0 items-center px-5 py-4 hover:bg-nb-yellow/20 transition-colors ${i < QUOTATIONS.length - 1 ? "border-b-[2px] border-black" : ""}`}
                  >
                    <div className="font-mono text-sm font-bold text-black">{q.id}</div>
                    <div className="font-mono text-xs text-black">{q.reqRef}</div>
                    <div className="font-mono text-xs text-black">{q.date}</div>
                    <div className="font-mono text-xs text-black">{q.expiryDate}</div>
                    <div className="font-body text-sm text-black">{q.items}</div>
                    <div className="font-display font-black text-sm text-black">{q.amount}</div>
                    <div>
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase ${BADGE[q.status]}`}>
                        <Icon size={10} strokeWidth={2.5} /> {q.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedQuotation(q)}
                        className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        title="View"
                      >
                        <Eye size={14} strokeWidth={2.5} />
                      </button>
                      {q.status === "pending" && (
                        <>
                          <button className="w-8 h-8 flex items-center justify-center bg-nb-green border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Accept">
                            <Check size={14} strokeWidth={2.5} />
                          </button>
                          <button className="w-8 h-8 flex items-center justify-center bg-nb-red border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Reject">
                            <X size={14} strokeWidth={2.5} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </section>
      </main>

      {/* ── MODAL ─────────────────────────────────────────────────────── */}
      {selectedQuotation && (
        <div
          className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6"
          onClick={() => setSelectedQuotation(null)}
        >
          <div
            className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_#000] w-full max-w-2xl overflow-hidden flex flex-col max-h-[85vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="bg-black px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <FileText size={18} strokeWidth={2.5} className="text-white" />
                <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Quotation Details</h2>
              </div>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-white text-black hover:bg-nb-red hover:border-nb-red transition-colors"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            {/* Modal body */}
            <div className="overflow-y-auto p-6 space-y-6">
              {/* Meta grid */}
              <div className="grid grid-cols-2 gap-4">
                {[
                  ["Quotation ID", selectedQuotation.id],
                  ["Date", selectedQuotation.date],
                  ["Expiry Date", selectedQuotation.expiryDate],
                  ["Status", selectedQuotation.status.toUpperCase()],
                ].map(([label, value]) => (
                  <div key={label} className="border-[2px] border-black p-4 bg-nb-bg">
                    <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                    <p className="font-display font-black text-sm text-black">{value}</p>
                  </div>
                ))}
              </div>

              {/* Items table */}
              <div className="border-[2px] border-black overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_80px_100px] bg-black px-4 py-2">
                  {["Item","Qty","Unit Price","Total"].map(h => (
                    <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-white">{h}</div>
                  ))}
                </div>
                {[
                  ["Product A - Electronics","500","$250","$125,000"],
                  ["Product B - Furniture","300","$180","$54,000"],
                  ["Product C - Textiles","200","$45","$9,000"],
                ].map(([name, qty, price, total], i) => (
                  <div key={i} className={`grid grid-cols-[1fr_80px_80px_100px] px-4 py-3 ${i < 2 ? "border-b-[2px] border-black" : ""}`}>
                    <div className="font-body text-sm text-black">{name}</div>
                    <div className="font-mono text-xs text-black">{qty}</div>
                    <div className="font-mono text-xs text-black">{price}</div>
                    <div className="font-display font-black text-sm text-black">{total}</div>
                  </div>
                ))}
              </div>

              {/* Summary */}
              <div className="flex justify-end">
                <div className="w-64 space-y-3">
                  {[["Subtotal","$134,000"],["Tax (10%)","$13,400"]].map(([l,v]) => (
                    <div key={l} className="flex justify-between font-body text-sm">
                      <span className="text-gray-600">{l}</span><span className="font-bold">{v}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center border-t-[3px] border-black pt-3">
                    <span className="font-display font-black text-sm uppercase">Total</span>
                    <span className="font-display font-black text-xl text-black">$147,400</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}