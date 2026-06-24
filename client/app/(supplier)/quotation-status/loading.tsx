"use client"

import { FileText, Clock, CheckCircle, XCircle, ClipboardList } from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

export default function Loading() {
  const STAT_CARDS_SKELETON = [
    { title: "Total Submitted", icon: FileText, color: "bg-nb-cyan/30" },
    { title: "Pending Review", icon: Clock, color: "bg-nb-yellow/30" },
    { title: "Approved", icon: CheckCircle, color: "bg-nb-green/30" },
    { title: "Rejected", icon: XCircle, color: "bg-red-400/30" },
  ]

  return (
    <>
      <Header title="Quotation Status" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
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
                <div className="h-6 w-24 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel
          title="Submitted Quotations"
          icon={<ClipboardList size={20} className="text-nb-cyan" />}
          noTopPad
          badge={
            <div className="flex items-center gap-3">
              {/* Search placeholder */}
              <div className="w-44 sm:w-64 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
              {/* Dropdown select placeholder */}
              <div className="w-24 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
              {/* Refresh button placeholder */}
              <div className="w-8 h-8 bg-white border-[2px] border-black rounded-none shimmer"></div>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[140px_180px_1fr_140px_120px_100px] gap-4 px-6 py-4 border-b-[3px] border-black bg-gray-50 text-gray-400 font-display font-black text-[10px] uppercase tracking-widest min-w-[900px]">
              <div>Quotation ID</div>
              <div>Requirement Ref</div>
              <div>Total Amount</div>
              <div>Date Submitted</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>

            <div className="flex flex-col min-w-[900px] min-h-[200px]">
              {[1, 2, 3, 4, 5].map((item, i) => (
                <div
                  key={i}
                  className={`
                    grid grid-cols-[140px_180px_1fr_140px_120px_100px] gap-4 items-center px-6 py-5
                    ${i < 4 ? "border-b-[2px] border-black" : ""}
                    bg-white
                  `}
                >
                  {/* Quotation ID */}
                  <div className="h-4 w-24 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
                  {/* Requirement Ref */}
                  <div className="h-4 w-20 bg-gray-200 border border-black/10 rounded-none shimmer"></div>
                  {/* Total Amount */}
                  <div className="h-4 w-28 bg-gray-300 border border-black/10 rounded-none shimmer"></div>
                  {/* Date Submitted */}
                  <div className="h-4 w-24 bg-gray-200 border border-black/10 rounded-none shimmer"></div>

                  {/* Status Badge */}
                  <div>
                    <div className="w-16 h-5 bg-gray-200 border-[2px] border-black shadow-nb-sm shimmer"></div>
                  </div>

                  {/* Actions Buttons */}
                  <div className="flex items-center justify-end gap-2">
                    <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]"></div>
                    <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]"></div>
                  </div>
                </div>
              ))}
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
