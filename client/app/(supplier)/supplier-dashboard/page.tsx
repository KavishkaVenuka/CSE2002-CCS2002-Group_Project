"use client"

import {
  Package, FileText, Clock, Banknote,
  ArrowRight, ClipboardList, ShoppingCart,
  CreditCard
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import Link from "next/link"

const STATS = [
  { title: "New Requirements", amount: "12", color: "bg-nb-cyan", icon: ClipboardList, badge: "Live" },
  { title: "Pending Quotations", amount: "5", color: "bg-nb-yellow", icon: Clock, badge: "Live" },
  { title: "Active Orders", amount: "8", color: "bg-nb-green", icon: Package, badge: "Live" },
  { title: "Total Revenue", amount: "LKR 450K", color: "bg-nb-orange", icon: Banknote, badge: "MTD" },
]

export default function SupplierDashboardPage() {
  return (
    <>
      <Header title="Supplier Dashboard" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STATS ROW ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3.5px] border-black shadow-nb p-7 relative group nb-interactive"
            >
              <div className="absolute top-5 right-5 flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 border-[1.5px] border-black/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-nb-green animate-pulse"></span>
                <span className="font-mono font-bold text-[8px] text-gray-400 uppercase tracking-tighter">{stat.badge}</span>
              </div>

              <div className={`w-14 h-14 border-[2.5px] border-black flex items-center justify-center mb-8 shadow-nb-sm ${stat.color} rounded-xl`}>
                <stat.icon size={26} className="text-black" strokeWidth={2.5} />
              </div>

              <div className="space-y-1">
                <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">
                  {stat.title}
                </p>
                <h3 className="font-display font-black text-4xl text-black leading-none tracking-tight">
                  {stat.amount}
                </h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── RECENT ACTIVITY ROW ───────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <Panel 
            title="Recent Requirements" 
            icon={<ClipboardList size={18} className="text-nb-cyan" />}
            noTopPad 
            badge={
              <Link href="/customer-requirements" className="font-mono font-bold text-[10px] uppercase bg-black text-white px-3 py-1.5 hover:bg-nb-cyan hover:text-black transition-colors border-[2px] border-black">
                See All
              </Link>
            }
          >
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-gray-50/50">
              <div className="w-20 h-20 bg-white border-[3px] border-black shadow-nb flex items-center justify-center mb-6 rotate-3">
                <FileText size={40} className="text-gray-200" strokeWidth={1} />
              </div>
              <p className="font-body font-bold text-sm text-gray-400 italic">
                No recent requirements discovered.
              </p>
            </div>
          </Panel>

          <Panel 
            title="Recent Orders" 
            icon={<Package size={18} className="text-nb-green" />}
            noTopPad 
            badge={
              <Link href="/orders" className="font-mono font-bold text-[10px] uppercase bg-black text-white px-3 py-1.5 hover:bg-nb-green hover:text-black transition-colors border-[2px] border-black">
                View Orders
              </Link>
            }
          >
            <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-gray-50/50">
              <div className="w-20 h-20 bg-white border-[3px] border-black shadow-nb flex items-center justify-center mb-6 -rotate-3">
                <ShoppingCart size={40} className="text-gray-200" strokeWidth={1} />
              </div>
              <p className="font-body font-bold text-sm text-gray-400 italic">
                No active orders at this time.
              </p>
            </div>
          </Panel>
        </div>

        {/* ── PENDING PAYMENTS ──────────────────────────────────────── */}
        <Panel 
          title="Pending Payments" 
          icon={<CreditCard size={18} className="text-nb-yellow" />}
          noTopPad 
          badge={
            <Link href="/invoice-submission" className="font-mono font-bold text-[10px] uppercase bg-black text-white px-3 py-1.5 hover:bg-nb-yellow hover:text-black transition-colors border-[2px] border-black">
              Manage Billing
            </Link>
          }
        >
          <div className="overflow-x-auto bg-gray-50/30">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b-[2.5px] border-black/5">
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Bill ID</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Order Ref</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Due Date</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td colSpan={5} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-white border-[2.5px] border-black/10 flex items-center justify-center mb-5 rounded-full">
                        <Banknote size={28} className="text-gray-200" strokeWidth={1} />
                      </div>
                      <p className="font-body font-bold text-sm text-gray-300 italic">
                        All payments are currently up to date.
                      </p>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </Panel>
      </main>
    </>
  )
}

