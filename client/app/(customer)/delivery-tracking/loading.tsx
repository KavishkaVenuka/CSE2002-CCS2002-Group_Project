'use client';

import React from 'react';
import { Package, MapPin, Truck, CheckCircle2, Clock, Calendar } from "lucide-react";
import { DashboardHeader } from "@/components/customer/DashboardHeader";

export default function DeliveryTrackingLoading() {
  return (
    <>
      <DashboardHeader title="Delivery Tracking" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg relative">

        {/* ── ORDER SELECTOR ────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <Package size={20} strokeWidth={2.5} className="text-black" />
            <h2 className="font-display font-black text-sm uppercase tracking-widest">Select Order to Track</h2>
          </div>
          <div className="relative">
            <div className="w-full h-11 bg-nb-yellow border-[2px] border-black shadow-[2px_2px_0px_0px_#000] shimmer rounded-none"></div>
          </div>
        </section>

        {/* ── DETAILS GRID ──────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Delivery details */}
          <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            <div className="bg-black px-5 py-3 flex items-center gap-3">
              <MapPin size={16} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Delivery Details</h2>
            </div>
            <div className="p-5 space-y-5">
              {[
                "Tracking Number",
                "Estimated Delivery",
                "Delivery Address",
              ].map((label) => (
                <div key={label} className="border-l-[3px] border-nb-cyan pl-4 space-y-1">
                  <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                  <div className="h-4 w-40 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                </div>
              ))}
            </div>
          </section>

          {/* Order summary */}
          <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
            <div className="bg-black px-5 py-3 flex items-center gap-3">
              <Package size={16} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Order Summary</h2>
            </div>
            <div className="p-5 space-y-5">
              {[
                "Order ID",
                "Total Items",
                "Order Amount",
              ].map((label) => (
                <div key={label} className="border-l-[3px] border-nb-green pl-4 space-y-1">
                  <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                  <div className="h-4 w-32 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── DELIVERY TIMELINE ─────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <Truck size={16} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Delivery Timeline</h2>
            </div>
          </div>
          <div className="p-6 space-y-4">
            {[
              { name: 'Order Placed', status: 'completed' },
              { name: 'Processing', status: 'completed' },
              { name: 'Dispatched', status: 'current' },
              { name: 'In Transit', status: 'pending' },
              { name: 'Delivered', status: 'pending' },
            ].map((step, i) => (
              <div key={i} className="flex gap-4">
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 border-[2px] border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] ${step.status === 'completed' ? "bg-nb-green" : step.status === 'current' ? "bg-nb-cyan" : "bg-white"}`}>
                    {step.status === 'completed'
                      ? <CheckCircle2 size={16} strokeWidth={2.5} className="text-black" />
                      : step.status === 'current'
                      ? <Clock size={16} strokeWidth={2.5} className="text-black" />
                      : <div className="w-2 h-2 bg-gray-400" />
                    }
                  </div>
                  {i < 4 && (
                    <div className={`w-0.5 flex-1 mt-1 min-h-[24px] ${step.status === 'completed' ? "bg-nb-green" : "bg-gray-300"}`} />
                  )}
                </div>
                {/* Step content */}
                <div className={`flex-1 border-[2px] border-black p-4 mb-4 ${step.status === 'completed' ? "bg-nb-green/20" : step.status === 'current' ? "bg-nb-cyan/30" : "bg-nb-bg"} space-y-2`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display font-black text-sm text-black">{step.name}</p>
                      <div className="h-4 w-40 bg-[#d4ede9] border-[2px] border-black mt-1.5 shimmer rounded-none"></div>
                    </div>
                    {step.status === 'completed' && (
                      <span className="flex items-center gap-1 font-mono text-[13px] font-bold text-black shrink-0">
                        <Calendar size={10} strokeWidth={2.5} /> <div className="h-4 w-16 bg-[#d4ede9] border-[2px] border-black shimmer rounded-none"></div>
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
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
