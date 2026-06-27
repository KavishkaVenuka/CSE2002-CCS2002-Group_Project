"use client"

import {
  FileText, Search, Filter, ChevronDown,
  RotateCcw, Eye, Download, ArrowRight,
  Clock, CheckCircle2, XCircle
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

export default function Loading() {
  const STAT_CARDS_SKELETON = [
    { title: "New Requests", icon: FileText, color: "bg-nb-cyan/30" },
    { title: "In Progress", icon: Clock, color: "bg-nb-yellow/30" },
    { title: "Completed", icon: CheckCircle2, color: "bg-nb-green/30" },
    { title: "Rejected", icon: XCircle, color: "bg-red-400/30" },
  ]

  return (
    <>
      <Header title="Customer Requirements" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb] relative">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS_SKELETON.map((stat, i) => (
            <div
              key={i}
              className="bg-white border-[3px] border-black shadow-nb p-6 flex items-center gap-4 relative"
            >
              <div className={`w-12 h-12 border-[2px] border-black flex items-center justify-center shadow-nb-sm ${stat.color}`}>
                <stat.icon size={24} strokeWidth={2.5} className="text-black/40" />
              </div>
              <div className="space-y-1.5 flex-1">
                <p className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">{stat.title}</p>
                <div className="h-7 w-12 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel
          title="Open Procurement Requirements"
          icon={<FileText size={20} className="text-nb-cyan" />}
          noTopPad
          badge={
            <div className="w-8 h-6 bg-black/10 border-[2px] border-black rounded-none shimmer animate-pulse" />
          }
        >
          <div className="flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b-[3px] border-black bg-white">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={14} strokeWidth={2.5} />
                  <div className="w-full h-9 bg-[#fdfcfb] border-[2px] border-black shadow-nb-sm flex items-center pl-9 text-gray-400 font-body text-sm select-none">
                    Search requirements...
                  </div>
                </div>
                <div className="relative w-full sm:w-48">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={14} strokeWidth={2.5} />
                  <div className="w-full h-9 bg-nb-bg border-[2px] border-black shadow-nb-sm flex items-center pl-9 font-body font-bold text-sm text-black/40 select-none">
                    All Status
                  </div>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={16} strokeWidth={2.5} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-white border-[2px] border-black shadow-nb-sm text-black/40">
                  <RotateCcw size={18} strokeWidth={2.5} className="animate-spin" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_120px_100px_100px] gap-4 px-6 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[1100px]">
                <div>Requirement ID</div>
                <div>Customer</div>
                <div>Qty</div>
                <div>Delivery</div>
                <div>Docs</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="flex flex-col min-w-[1100px]">
                {[1, 2, 3, 4, 5].map((item, idx) => (
                  <div
                    key={idx}
                    className={`
                      grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_120px_100px_100px] gap-4 items-center px-6 py-5
                      ${idx < 4 ? "border-b-[2px] border-black" : ""}
                      bg-white
                    `}
                  >
                    {/* Requirement ID */}
                    <div className="h-4 w-24 bg-gray-200 border border-black/10 rounded-none shimmer"></div>

                    {/* Customer */}
                    <div className="space-y-1.5">
                      <div className="h-4 w-40 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
                      <div className="h-3 w-56 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
                    </div>

                    {/* Qty */}
                    <div className="h-4 w-12 bg-gray-200 border border-black/10 rounded-none shimmer"></div>

                    {/* Delivery */}
                    <div className="h-4 w-20 bg-gray-200 border border-black/10 rounded-none shimmer"></div>

                    {/* Docs */}
                    <div>
                      <div className="flex items-center gap-2 px-2 py-1 bg-gray-100 border-[2px] border-black w-14 h-6 opacity-60">
                        <Download size={12} strokeWidth={3} className="text-black/40" />
                        <div className="h-3 w-4 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
                      </div>
                    </div>

                    {/* Status */}
                    <div>
                      <div className="w-16 h-6 border-[2px] border-black bg-gray-200 shadow-nb-sm shimmer"></div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end gap-3 col-span-2">
                      <div className="w-9 h-9 bg-white border-[2px] border-black shadow-nb-sm flex items-center justify-center">
                        <Eye size={18} strokeWidth={2.5} className="text-black/40" />
                      </div>
                      <div className="w-9 h-9 bg-gray-100 border-[2px] border-black shadow-nb-sm flex items-center justify-center">
                        <ArrowRight size={18} strokeWidth={2.5} className="text-black/40" />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Panel>
      </main>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            background-position: -600px 0;
          }
          100% {
            background-position: 600px 0;
          }
        }

        .shimmer {
          background-image: linear-gradient(
            90deg,
            transparent,
            rgba(255, 255, 255, 0.4),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 2s infinite linear;
          background-position: -600px 0;
        }
      `}</style>
    </>
  )
}
