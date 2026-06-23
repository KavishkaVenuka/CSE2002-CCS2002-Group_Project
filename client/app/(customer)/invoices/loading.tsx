'use client';

import React from 'react';
import { CheckCircle2, DollarSign, Package, PlusCircle, Receipt } from "lucide-react";
import { DashboardHeader } from "@/components/customer/DashboardHeader";

export default function InvoicesLoading() {
  return (
    <>
      <DashboardHeader title="Invoices" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg relative">

        {/* ── STAT CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Paid Invoices */}
          <div className="bg-nb-green border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Paid Invoices</p>
              <div className="h-8 w-12 bg-[#d4ede9] border-[2px] border-black mt-1 shimmer rounded-none"></div>
            </div>
          </div>

          {/* Unpaid Invoices */}
          <div className="bg-nb-yellow border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
              <DollarSign size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Unpaid Invoices</p>
              <div className="h-8 w-12 bg-[#d4ede9] border-[2px] border-black mt-1 shimmer rounded-none"></div>
            </div>
          </div>

          {/* Awaiting Generation */}
          <div className="bg-nb-cyan border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
              <Package size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div className="flex-1">
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Awaiting Generation</p>
              <div className="h-8 w-12 bg-[#d4ede9] border-[2px] border-black mt-1 shimmer rounded-none"></div>
            </div>
          </div>
        </div>

        {/* ── PENDING DELIVERIES TABLE SKELETON ────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center gap-3">
            <PlusCircle size={18} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Deliveries Awaiting Invoice</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[200px_150px_150px_1fr] px-5 py-3 border-b-[2px] border-black bg-nb-bg min-w-[700px]">
              {["Order ID", "Delivery Date", "Status", "Action"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>
            <div className="min-w-[700px]">
              {[1, 2].map((rowIndex, i) => (
                <div key={rowIndex} className={`grid grid-cols-[200px_150px_150px_1fr] items-center px-5 py-4 bg-white ${i < 1 ? "border-b-[2px] border-black" : ""}`}>
                  {/* Order ID */}
                  <div className="h-4 w-32 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                  {/* Delivery Date */}
                  <div className="h-4 w-20 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                  {/* Status */}
                  <div>
                    <div className="h-6 w-20 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                  </div>
                  {/* Action button */}
                  <div>
                    <div className="w-36 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] shimmer rounded-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ALL INVOICES TABLE SKELETON ────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center gap-3">
            <Receipt size={18} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Invoice History</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[150px_140px_110px_120px_110px_1fr] px-5 py-3 border-b-[2px] border-black bg-nb-bg min-w-[760px]">
              {["Invoice ID","Order Ref","Date","Amount","Status","Actions"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>
            <div className="min-w-[760px]">
              {[1, 2, 3, 4].map((rowIndex, i) => (
                <div key={rowIndex} className={`grid grid-cols-[150px_140px_110px_120px_110px_1fr] items-center px-5 py-4 bg-white ${i < 3 ? "border-b-[2px] border-black" : ""}`}>
                  {/* Invoice ID */}
                  <div className="h-4 w-28 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                  {/* Order Ref */}
                  <div className="h-4 w-24 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                  {/* Date */}
                  <div className="h-4 w-20 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                  {/* Amount */}
                  <div className="h-4 w-24 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                  {/* Status */}
                  <div>
                    <div className="h-6 w-20 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                  </div>
                  {/* Actions */}
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] shimmer rounded-none"></div>
                    <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] shimmer rounded-none"></div>
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
