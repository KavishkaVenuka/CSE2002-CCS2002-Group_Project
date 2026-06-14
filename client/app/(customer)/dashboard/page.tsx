"use client"

import { useState, useEffect } from "react"
import {
  FileText, AlertCircle, ShoppingCart, 
  CheckCircle2, Clock, ArrowUpRight,
  ChevronRight, CreditCard, Banknote, Package
} from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { Panel } from "@/components/ui/Panel"
import { GlobalStatCard } from "@/components/common/GlobalStatCard"
import { getCustomerDashboardStats, type CustomerDashboardStats } from "@/lib/api"

export default function CustomerDashboard() {
  const [stats, setStats] = useState<CustomerDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        const data = await getCustomerDashboardStats()
        setStats(data)
      } catch (err) {
        console.error('Failed to fetch customer stats:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [])

  if (loading || !stats) {
    return (
      <div className="flex h-screen items-center justify-center bg-nb-bg font-display font-black text-2xl uppercase tracking-widest text-black">
        Loading Dashboard...
      </div>
    )
  }

  return (
    <>
      <DashboardHeader title="Customer Portal" dateString={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <GlobalStatCard
            iconSvgOrEmoji={<ShoppingCart className="w-6 h-6 text-black" />}
            introTitle="Active Orders"
            orderCount={stats.activeOrders}
            monetaryValue=""
            footerText="Currently in progress"
            themeClasses={{
              cardBackground:          "bg-nb-cyan",
              iconContainerBackground: "bg-white",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-black",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#0891b2]",
              footerText:              "text-white font-bold",
            }}
          />

          <GlobalStatCard
            iconSvgOrEmoji={<FileText className="w-6 h-6 text-black" />}
            introTitle="Pending Quotations"
            orderCount={stats.pendingQuotationsCount}
            monetaryValue=""
            footerText="Awaiting your review"
            themeClasses={{
              cardBackground:          "bg-nb-yellow",
              iconContainerBackground: "bg-white",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-black",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#ca8a04]",
              footerText:              "text-white font-bold",
            }}
          />

          <GlobalStatCard
            iconSvgOrEmoji={<CheckCircle2 className="w-6 h-6 text-black" />}
            introTitle="Delivered Items"
            orderCount={stats.deliveredOrders}
            monetaryValue=""
            footerText="Total fulfillment"
            themeClasses={{
              cardBackground:          "bg-nb-green",
              iconContainerBackground: "bg-white",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-black",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#16a34a]",
              footerText:              "text-white font-bold",
            }}
          />

          <GlobalStatCard
            iconSvgOrEmoji={<CreditCard className="w-6 h-6 text-black" />}
            introTitle="Due Payment"
            orderCount={stats.pendingPayments.length}
            monetaryValue={`Rs. ${stats.duePayment || 0}`}
            footerText="Requires action"
            themeClasses={{
              cardBackground:          "bg-nb-orange",
              iconContainerBackground: "bg-white",
              titleTextColor:          "text-black",
              orderCountContainer:     "bg-white",
              orderCountText:          "text-black",
              monetaryContainer:       "bg-nb-red",
              monetaryText:            "text-white",
              footerContainer:         "bg-[#dc2626]",
              footerText:              "text-white font-bold",
            }}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN (2/3) ────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Pending Payments Table */}
            <Panel 
              title="Pending Payments" 
              icon={<CreditCard size={18} className="text-nb-red" />}
              badge={<span className="text-nb-red underline">Manage Billing</span>}
            >
              <div className="overflow-x-auto">
                <div className="grid grid-cols-[120px_1fr_120px_120px_100px] gap-4 px-6 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[600px]">
                  <div>Bill ID</div>
                  <div>Order Ref</div>
                  <div>Amount</div>
                  <div>Due Date</div>
                  <div className="text-right">Status</div>
                </div>
                {stats.pendingPayments.length === 0 ? (
                  <div className="px-6 py-8 text-center font-mono text-sm font-bold text-gray-500 bg-white">
                    No pending payments at the moment.
                  </div>
                ) : (
                  stats.pendingPayments.map((payment, i) => (
                    <div 
                      key={payment.id}
                      className={`
                        grid grid-cols-[120px_1fr_120px_120px_100px] gap-4 items-center px-6 py-4
                        ${i < stats.pendingPayments.length - 1 ? "border-b-[2px] border-black" : ""}
                        bg-white hover:bg-nb-red/5 transition-colors
                      `}
                    >
                      <div className="font-mono text-sm font-black text-black">{payment.id}</div>
                      <div className="font-body text-sm font-bold text-gray-600">{payment.orderRef}</div>
                      <div className="font-display font-black text-sm text-black">{payment.amount}</div>
                      <div className="font-mono text-xs font-bold text-gray-400">{payment.dueDate || "N/A"}</div>
                      <div className="text-right">
                        <span className="px-2 py-0.5 bg-nb-red border-[2px] border-black font-mono text-[9px] font-black uppercase text-white shadow-[2px_2px_0px_0px_#000]">
                          {payment.status}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Panel>

            {/* Open Quotations */}
            <section className="space-y-4">
              <div className="flex justify-between items-end">
                <h2 className="font-display font-black text-2xl text-black">Pending Quotations</h2>
                <button className="flex items-center gap-2 font-display font-black text-xs uppercase tracking-widest hover:translate-x-1 transition-transform">
                  View All <ChevronRight size={16} />
                </button>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {stats.recentQuotations.length === 0 ? (
                  <div className="col-span-1 md:col-span-2 p-8 border-[3px] border-black bg-white shadow-nb text-center font-mono text-sm font-bold text-gray-500">
                    No pending quotations.
                  </div>
                ) : (
                  stats.recentQuotations.map((q) => (
                    <div key={q.id} className="bg-white border-[3px] border-black shadow-nb p-6 nb-interactive">
                      <div className="flex justify-between items-start mb-6">
                        <div>
                          <p className="font-mono text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{q.id} • {q.date}</p>
                          <h4 className="font-display font-black text-xl text-black">{q.supplier || "Unknown Supplier"}</h4>
                          <p className="font-body text-xs text-gray-500 mt-1">{q.items} items</p>
                        </div>
                        <span className="px-3 py-1 bg-nb-yellow border-[2px] border-black font-mono text-[10px] font-black uppercase shadow-[3px_3px_0px_0px_#000]">
                          {q.status}
                        </span>
                      </div>
                      <div className="flex justify-between items-center pt-5 border-t-[3px] border-black border-dashed">
                        <div>
                          <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Quote</p>
                          <span className="font-display font-black text-2xl text-black">{q.amount}</span>
                        </div>
                        <button className="bg-black text-white p-3 border-[2px] border-black shadow-[4px_4px_0px_0px_#A5E6DC] hover:shadow-none hover:translate-x-[4px] hover:translate-y-[4px] transition-all">
                          <ArrowUpRight size={20} strokeWidth={3} />
                        </button>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          </div>

          {/* ── RIGHT COLUMN (1/3) ────────────────────────── */}
          <div className="space-y-8">
            {/* Recent Activity */}
            <Panel title="Recent Activity" icon={<Clock size={18} className="text-nb-cyan" />}>
              <div className="p-6 flex flex-col gap-4">
                {(!stats.recentActivity || stats.recentActivity.length === 0) ? (
                  <div className="text-center font-mono text-sm font-bold text-gray-500 bg-white p-4 border-[2px] border-black">
                    No recent activity.
                  </div>
                ) : (
                  stats.recentActivity.map((activity: any, i: number) => {
                    const Icon = activity.icon === 'Banknote' ? Banknote : 
                                 activity.icon === 'Package' ? Package : 
                                 activity.icon === 'FileText' ? FileText : Clock;
                    
                    const colorMap: Record<string, string> = {
                      blue: 'bg-nb-cyan',
                      green: 'bg-nb-green',
                      red: 'bg-nb-red',
                      yellow: 'bg-nb-yellow',
                      purple: 'bg-nb-pink',
                    };
                    
                    const bgColor = colorMap[activity.color?.toLowerCase()] || 'bg-white';
                    
                    return (
                      <div 
                        key={i} 
                        className="flex items-start gap-4 p-4 border-[2px] border-black bg-white hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000] transition-all nb-interactive"
                      >
                        <div className={`w-10 h-10 border-[2px] border-black flex items-center justify-center ${bgColor} shadow-[2px_2px_0px_0px_#000]`}>
                          <Icon size={20} className="text-black" />
                        </div>
                        <div className="flex-1">
                          <p className="font-display font-black text-sm text-black">{activity.message}</p>
                          <p className="font-mono text-[10px] font-bold text-gray-500 uppercase mt-1">{activity.time}</p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            </Panel>

            {/* Help/Support Box */}
            <div className="p-6 bg-nb-cyan border-[3px] border-black shadow-nb flex flex-col gap-4">
              <div className="w-12 h-12 bg-white border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                <AlertCircle size={24} className="text-black" />
              </div>
              <h4 className="font-display font-black text-lg text-black">Need Support?</h4>
              <p className="font-body text-xs font-bold leading-relaxed text-black/70">
                Having issues with an order or payment? Contact your dedicated account manager.
              </p>
              <button className="w-full py-3 bg-black text-white font-display font-black text-xs uppercase tracking-widest border-[2px] border-black shadow-[4px_4px_0px_0px_#FFFFFF] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                Open Support Ticket
              </button>
            </div>
          </div>

        </div>

      </main>
    </>
  )
}