'use client';

import React from 'react';
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Search } from "lucide-react";
import { DashboardHeader } from "@/components/customer/DashboardHeader";

export default function QuotationsLoading() {
  const STAT_CARDS = [
    { label: "Pending", icon: Clock, color: "bg-nb-yellow" },
    { label: "Accepted", icon: CheckCircle2, color: "bg-nb-green" },
    { label: "Rejected", icon: XCircle, color: "bg-nb-red" },
    { label: "Expired", icon: AlertCircle, color: "bg-gray-300" },
  ];

  return (
    <>
      <DashboardHeader title="Quotations" />

      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className={`${s.color} border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4`}>
              <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
                <s.icon size={22} strokeWidth={2.5} className="text-black" />
              </div>
              <div className="flex-1">
                <p className="font-body font-bold text-xs text-black uppercase tracking-wider">{s.label}</p>
                <div className="h-8 w-12 bg-black/10 border-[2px] border-black mt-1 shimmer"></div>
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
              <div className="h-4 w-8 bg-white/20 border-[2px] border-white/20 shimmer rounded-none"></div>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <div className="w-52 h-[38px] bg-white border-[2px] border-white shadow-[2px_2px_0px_0px_#fff] shimmer"></div>
              </div>
              {/* Filter */}
              <div className="relative">
                <div className="w-28 h-[38px] bg-nb-yellow border-[2px] border-white shadow-[2px_2px_0px_0px_#fff] shimmer"></div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_0.5fr_1fr_1.5fr_110px] gap-6 px-5 py-3 border-b-[2px] border-black bg-nb-bg min-w-[900px]">
              {["Quotation ID", "Req. Ref", "Date", "Expiry", "Items", "Amount", "Status", "Actions"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>

            <div className="min-w-[900px]">
              {[1, 2, 3, 4].map((rowIndex, i) => (
                <div
                  key={rowIndex}
                  className={`grid grid-cols-[1.5fr_1.5fr_1fr_1fr_0.5fr_1fr_1.5fr_110px] gap-6 items-center px-5 py-4 bg-white ${i < 3 ? "border-b-[2px] border-black" : ""}`}
                >
                  {/* Quotation ID */}
                  <div className="h-4 w-28 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Req. Ref */}
                  <div className="h-4 w-24 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Date */}
                  <div className="h-4 w-20 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Expiry */}
                  <div className="h-4 w-20 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Items */}
                  <div className="h-4 w-8 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Amount */}
                  <div className="h-4 w-24 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Status */}
                  <div>
                    <div className="h-6 w-24 bg-[#d4ede9] border-[2px] border-black shimmer"></div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] shimmer"></div>
                    <div className="w-8 h-8 bg-nb-green border-[2px] border-black shadow-[2px_2px_0px_0px_#000] shimmer"></div>
                    <div className="w-8 h-8 bg-nb-red border-[2px] border-black shadow-[2px_2px_0px_0px_#000] shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
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
            rgba(255, 255, 255, 0.3),
            transparent
          );
          background-size: 200px 100%;
          animation: shimmer 2s infinite;
          background-position: -600px 0;
        }
      `}</style>
    </>
  );
}
