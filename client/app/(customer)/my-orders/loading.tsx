'use client';

import React from 'react';
import { Clock, Package, Send, Truck, CheckCircle2, ShoppingBag, Search } from "lucide-react";
import { DashboardHeader } from "@/components/customer/DashboardHeader";

export default function MyOrdersLoading() {
  const STAT_CARDS = [
    { label: "pending", icon: Clock, color: "bg-gray-200" },
    { label: "processing", icon: Package, color: "bg-nb-orange" },
    { label: "dispatched", icon: Send, color: "bg-[#E9D5FF]" },
    { label: "in-transit", icon: Truck, color: "bg-nb-cyan" },
    { label: "delivered", icon: CheckCircle2, color: "bg-nb-green" },
  ];

  return (
    <>
      <DashboardHeader title="My Orders" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg relative">

        {/* ── STAT CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className={`${s.color} border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-3`}>
              <div className="w-11 h-11 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
                <s.icon size={20} strokeWidth={2.5} className="text-black" />
              </div>
              <div className="flex-1">
                <p className="font-body font-bold text-[10px] text-black uppercase tracking-wider capitalize">{s.label.replace("-", " ")}</p>
                <div className="h-6 w-10 bg-[#d4ede9] border-[2px] border-black mt-1 shimmer rounded-none"></div>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE PANEL ────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden relative">
          <div className="bg-black px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">All Orders</h2>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <div className="w-full sm:w-48 h-[38px] bg-white border-[2px] border-white shadow-[2px_2px_0px_0px_#fff] shimmer"></div>
              </div>
              {/* Filter */}
              <div className="relative">
                <div className="w-28 h-[38px] bg-nb-yellow border-[2px] border-white shadow-[2px_2px_0px_0px_#fff] shimmer"></div>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto min-h-[300px]">
            <div className="grid grid-cols-[1.4fr_1.2fr_1fr_70px_110px_110px_60px] px-6 py-3 border-b-[2px] border-black bg-nb-bg min-w-[900px]">
              {["Order ID", "Quotation Ref", "Order Date", "Items", "Amount", "Status", "Action"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>

            <div className="min-w-[900px]">
              {[1, 2, 3, 4].map((rowIndex, i) => (
                <div
                  key={rowIndex}
                  className={`grid grid-cols-[1.4fr_1.2fr_1fr_70px_110px_110px_60px] gap-6 items-center px-6 py-4 bg-white ${i < 3 ? "border-b-[2px] border-black" : ""}`}
                >
                  {/* Order ID */}
                  <div className="h-4 w-28 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Quotation Ref */}
                  <div className="h-4 w-24 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Order Date */}
                  <div className="h-4 w-20 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Items */}
                  <div className="h-4 w-8 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Amount */}
                  <div className="h-4 w-24 bg-[#d4ede9] border-[2px] border-black shimmer"></div>

                  {/* Status */}
                  <div>
                    <div className="h-6 w-24 bg-[#d4ede9] border-[2px] border-black shimmer"></div>
                  </div>

                  {/* Action */}
                  <div>
                    <div className="w-8 h-8 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] shimmer"></div>
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
