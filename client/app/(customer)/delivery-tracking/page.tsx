"use client"

import { useState } from "react"
import { Package, MapPin, Truck, CheckCircle2, Clock, UploadCloud, Calendar, ChevronDown } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const ORDERS = [
  { id: "ORD-20240114", date: "Jan 14, 2024", amount: "$22,000", status: "In Transit", items: 5, tracking: "TRK-2024-5678", estDelivery: "January 17, 2024", address: "123 Business Street, Suite 400\nNew York, NY 10001" },
  { id: "ORD-20240115", date: "Jan 15, 2024", amount: "$15,000", status: "Delivered",  items: 3, tracking: "TRK-2024-5679", estDelivery: "January 16, 2024", address: "456 Tech Park\nAustin, TX 78701" },
]

const TIMELINE = [
  { label: "Quotation Accepted", sub: "Quotation accepted and order created", time: "2024-01-14 10:00 AM", done: true },
  { label: "Order Created",      sub: "Order confirmed by supplier",           time: "2024-01-14 10:15 AM", done: true },
  { label: "Dispatched",         sub: "Package dispatched from warehouse",     time: "2024-01-15 09:00 AM", done: true },
  { label: "In Transit",         sub: "Package in transit — ETA 1 day",       time: "2024-01-15 03:00 PM", done: false, active: true },
  { label: "Delivered",          sub: "Awaiting delivery",                     time: "",                    done: false },
]

export default function DeliveryTrackingPage() {
  const [selectedOrderId, setSelectedOrderId] = useState("ORD-20240114")
  const order = ORDERS.find(o => o.id === selectedOrderId) || ORDERS[0]

  return (
    <>
      <DashboardHeader title="Delivery Tracking" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">

        {/* ── ORDER SELECTOR ────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-6">
          <div className="flex items-center gap-3 mb-4">
            <Package size={20} strokeWidth={2.5} className="text-black" />
            <h2 className="font-display font-black text-sm uppercase tracking-widest">Select Order to Track</h2>
          </div>
          <div className="relative">
            <select
              value={selectedOrderId}
              onChange={e => setSelectedOrderId(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-nb-yellow border-[2px] border-black font-body font-bold text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all cursor-pointer"
            >
              {ORDERS.map(o => (
                <option key={o.id} value={o.id}>{o.id} — {o.date} — {o.amount}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={16} strokeWidth={2.5} />
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
                ["Tracking Number", order.tracking],
                ["Estimated Delivery", order.estDelivery],
                ["Delivery Address", order.address],
              ].map(([label, value]) => (
                <div key={label} className="border-l-[3px] border-nb-cyan pl-4">
                  <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                  <p className="font-body font-bold text-sm text-black whitespace-pre-wrap">{value}</p>
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
                ["Order ID", order.id],
                ["Total Items", `${order.items} items`],
                ["Order Amount", order.amount],
              ].map(([label, value]) => (
                <div key={label} className="border-l-[3px] border-nb-green pl-4">
                  <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                  <p className="font-body font-bold text-sm text-black">{value}</p>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── DELIVERY TIMELINE ─────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-5 py-3 flex items-center gap-3">
            <Truck size={16} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Delivery Timeline</h2>
          </div>
          <div className="p-6 space-y-4">
            {TIMELINE.map((step, i) => (
              <div key={i} className="flex gap-4">
                {/* Step indicator */}
                <div className="flex flex-col items-center">
                  <div className={`w-8 h-8 border-[2px] border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] ${step.done ? "bg-nb-green" : step.active ? "bg-nb-cyan" : "bg-white"}`}>
                    {step.done
                      ? <CheckCircle2 size={16} strokeWidth={2.5} className="text-black" />
                      : step.active
                      ? <Clock size={16} strokeWidth={2.5} className="text-black" />
                      : <div className="w-2 h-2 bg-gray-400" />
                    }
                  </div>
                  {i < TIMELINE.length - 1 && (
                    <div className={`w-0.5 flex-1 mt-1 min-h-[24px] ${step.done ? "bg-nb-green" : "bg-gray-300"}`} />
                  )}
                </div>
                {/* Step content */}
                <div className={`flex-1 border-[2px] border-black p-4 mb-4 ${step.done ? "bg-nb-green/20" : step.active ? "bg-nb-cyan/30" : "bg-nb-bg"}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-display font-black text-sm text-black">{step.label}</p>
                      <p className="font-body text-xs text-gray-600 mt-1">{step.sub}</p>
                    </div>
                    {step.time && (
                      <span className="flex items-center gap-1 font-mono text-[10px] font-bold text-black shrink-0">
                        <Calendar size={10} strokeWidth={2.5} /> {step.time}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── UPLOAD PROOF ──────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-5 py-3 flex items-center gap-3">
            <UploadCloud size={16} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Upload Delivery Proof</h2>
          </div>
          <div className="p-6">
            <p className="font-body text-sm text-gray-600 mb-4">If you received partial delivery or have concerns</p>
            <div className="border-[2px] border-dashed border-black py-12 flex flex-col items-center gap-4 bg-nb-bg hover:bg-nb-cyan/20 hover:border-nb-cyan transition-all cursor-pointer">
              <div className="w-14 h-14 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                <UploadCloud size={24} strokeWidth={2.5} className="text-black" />
              </div>
              <div className="text-center">
                <p className="font-display font-black text-sm text-black">Click to upload or drag and drop</p>
                <p className="font-body text-xs text-gray-500 mt-1">SVG, PNG, JPG or PDF (max. 10MB)</p>
              </div>
            </div>
          </div>
        </section>

      </main>
    </>
  )
}