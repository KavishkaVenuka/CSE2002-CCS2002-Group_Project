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
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedQuotation(null)}
        >
          <div
            className="bg-nb-bg border-[4px] border-black shadow-[12px_12px_0px_0px_#000] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            {/* ── MODAL HEADER ── */}
            <div className="bg-black px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-nb-yellow border-[2px] border-nb-yellow flex items-center justify-center">
                  <FileText size={16} strokeWidth={2.5} className="text-black" />
                </div>
                <div>
                  <h2 className="font-display font-black text-base text-white uppercase tracking-[0.12em] leading-none">
                    Quotation Details
                  </h2>
                  <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                    {selectedQuotation.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="w-9 h-9 flex items-center justify-center bg-white border-[2px] border-white text-black hover:bg-nb-red hover:border-nb-red hover:text-white transition-colors"
                title="Close"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            {/* ── MODAL BODY ── */}
            <div className="overflow-y-auto flex-1">

              {/* ── META INFO STRIP ── */}
              <div className="grid grid-cols-4 border-b-[3px] border-black">
                {[
                  { label: "Quotation ID", value: selectedQuotation.id,         mono: true  },
                  { label: "Date",         value: selectedQuotation.date,        mono: true  },
                  { label: "Expiry Date",  value: selectedQuotation.expiryDate,  mono: true  },
                  { label: "Status",       value: selectedQuotation.status,      mono: false },
                ].map(({ label, value, mono }, i) => (
                  <div
                    key={label}
                    className={`p-4 bg-white ${i < 3 ? "border-r-[2px] border-black" : ""}`}
                  >
                    <p className="font-body font-bold text-[9px] uppercase tracking-[0.15em] text-gray-500 mb-1">
                      {label}
                    </p>
                    {label === "Status" ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase shadow-[2px_2px_0px_0px_#000] ${BADGE[value]}`}>
                        {(() => { const Icon = BADGE_ICON[value]; return <Icon size={9} strokeWidth={2.5} />; })()}
                        {value}
                      </span>
                    ) : (
                      <p className={`${mono ? "font-mono" : "font-display font-black"} text-xs text-black break-all`}>
                        {value}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              {/* ── SECTION LABEL ── */}
              <div className="px-6 pt-5 pb-3 flex items-center gap-3">
                <div className="h-[3px] w-4 bg-black" />
                <span className="font-display font-black text-[11px] uppercase tracking-[0.15em] text-black">
                  Line Items
                </span>
                <div className="h-[3px] flex-1 bg-black" />
              </div>

              {/* ── ITEMS TABLE ── */}
              <div className="mx-6 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                {/* Table header */}
                <div className="grid grid-cols-[1fr_80px_90px_110px] bg-black px-4 py-2.5">
                  {["Item / Description", "Qty", "Unit Price", "Total"].map(h => (
                    <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-white">
                      {h}
                    </div>
                  ))}
                </div>
                {/* Table rows */}
                {[
                  { name: "Product A — Electronics", qty: "500 units", price: "$250.00", total: "$125,000" },
                  { name: "Product B — Furniture",   qty: "300 units", price: "$180.00", total: "$54,000"  },
                  { name: "Product C — Textiles",    qty: "200 units", price: "$45.00",  total: "$9,000"   },
                ].map((row, i, arr) => (
                  <div
                    key={i}
                    className={`grid grid-cols-[1fr_80px_90px_110px] px-4 py-3.5 bg-white hover:bg-nb-yellow/10 transition-colors ${i < arr.length - 1 ? "border-b-[2px] border-black" : ""}`}
                  >
                    <div className="font-body text-sm font-medium text-black">{row.name}</div>
                    <div className="font-mono text-xs text-black">{row.qty}</div>
                    <div className="font-mono text-xs text-black">{row.price}</div>
                    <div className="font-display font-black text-sm text-black">{row.total}</div>
                  </div>
                ))}
              </div>

              {/* ── TOTALS PANEL ── */}
              <div className="mx-6 mt-4 mb-6 flex justify-end">
                <div className="w-72 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                  <div className="bg-black px-4 py-2">
                    <span className="font-display font-black text-[10px] uppercase tracking-widest text-white">
                      Summary
                    </span>
                  </div>
                  <div className="bg-white divide-y-[2px] divide-black">
                    {[
                      { label: "Subtotal",   value: "$134,000" },
                      { label: "Tax (10%)",  value: "$13,400"  },
                    ].map(({ label, value }) => (
                      <div key={label} className="flex justify-between items-center px-4 py-3">
                        <span className="font-body text-xs text-gray-600 uppercase tracking-wide">{label}</span>
                        <span className="font-mono text-sm font-bold text-black">{value}</span>
                      </div>
                    ))}
                    {/* Grand total */}
                    <div className="flex justify-between items-center px-4 py-4 bg-nb-yellow border-t-[3px] border-black">
                      <span className="font-display font-black text-xs uppercase tracking-widest text-black">Total</span>
                      <span className="font-display font-black text-2xl text-black">$147,400</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* ── MODAL FOOTER ── */}
            <div className="shrink-0 border-t-[3px] border-black bg-white px-6 py-4 flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                Req. Ref: <span className="text-black font-bold">{selectedQuotation.reqRef}</span>
              </p>
              <div className="flex items-center gap-3">
                {selectedQuotation.status === "pending" && (
                  <>
                    <button className="flex items-center gap-2 px-4 py-2 bg-nb-green border-[2px] border-black shadow-[3px_3px_0px_0px_#000] font-display font-black text-xs uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                      <Check size={13} strokeWidth={3} />
                      Accept
                    </button>
                    <button className="flex items-center gap-2 px-4 py-2 bg-nb-red border-[2px] border-black shadow-[3px_3px_0px_0px_#000] font-display font-black text-xs uppercase tracking-wider text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                      <X size={13} strokeWidth={3} />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedQuotation(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_#000] font-display font-black text-xs uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}