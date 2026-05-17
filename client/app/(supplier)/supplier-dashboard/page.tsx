"use client"

import {
  Package, FileText, Clock, Banknote,
  ArrowRight, ClipboardList, ShoppingCart,
  CreditCard, Loader2
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import Link from "next/link"
import { useState, useEffect } from "react"
import {
  getSupplierDashboardStats,
  getRecentRequirements,
  getRecentOrders,
  getPendingPayments
} from "@/lib/api"

export default function SupplierDashboardPage() {
  const [stats, setStats] = useState<{ newRequirements: number; pendingQuotations: number; activeOrders: number; totalRevenue: string } | null>(null);
  const [recentRequirements, setRecentRequirements] = useState<Array<{ id: string; requirementId: string; customerName: string; items: string }>>([]);
  const [recentOrders, setRecentOrders] = useState<Array<{ _id: string; po_id: string; status: string; total: string }>>([]);
  const [pendingPayments, setPendingPayments] = useState<Array<{ id: string; amount: string; dueDate: string }>>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const [statsData, reqData, ordersData, paymentsData] = await Promise.all([
          getSupplierDashboardStats(),
          getRecentRequirements(),
          getRecentOrders(),
          getPendingPayments(),
        ]);

        setStats(statsData.stats);
        setRecentRequirements(reqData.recentRequirements || []);
        setRecentOrders(ordersData.recentOrders || []);
        setPendingPayments(paymentsData.pendingPayments || []);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data", err);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) {
    return (
      <>
        <Header title="Supplier Dashboard" />
        <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="w-12 h-12 text-black animate-spin" />
            <p className="font-mono font-bold text-sm tracking-widest uppercase">Loading Dashboard...</p>
          </div>
        </main>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Header title="Supplier Dashboard" />
        <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb] flex items-center justify-center">
          <div className="bg-nb-orange p-6 border-[3px] border-black shadow-nb">
            <h2 className="font-display font-black text-2xl text-black mb-2">Error</h2>
            <p className="font-body text-black font-bold">{error}</p>
          </div>
        </main>
      </>
    );
  }

  const STATS_CARDS = [
    { title: "New Requirements", amount: stats?.newRequirements ?? 0, color: "bg-nb-cyan", icon: ClipboardList, badge: "Live" },
    { title: "Pending Quotations", amount: stats?.pendingQuotations ?? 0, color: "bg-nb-yellow", icon: Clock, badge: "Live" },
    { title: "Active Orders", amount: stats?.activeOrders ?? 0, color: "bg-nb-green", icon: Package, badge: "Live" },
    { title: "Total Revenue", amount: stats?.totalRevenue ?? "0", color: "bg-nb-orange", icon: Banknote, badge: "MTD" },
  ];

  return (
    <>
      <Header title="Supplier Dashboard" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STATS ROW ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STATS_CARDS.map((stat, i) => (
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
            {recentRequirements.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-gray-50/50">
                <div className="w-20 h-20 bg-white border-[3px] border-black shadow-nb flex items-center justify-center mb-6 rotate-3">
                  <FileText size={40} className="text-gray-200" strokeWidth={1} />
                </div>
                <p className="font-body font-bold text-sm text-gray-400 italic">
                  No recent requirements discovered.
                </p>
              </div>
            ) : (
              <div className="divide-y-[2px] divide-black/5 bg-gray-50/30">
                {recentRequirements.map((req, idx) => (
                  <div key={req.id || idx} className="p-6 flex items-center justify-between hover:bg-white transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-nb-cyan/20 border-2 border-black/10 rounded flex items-center justify-center group-hover:border-black group-hover:bg-nb-cyan transition-all">
                        <FileText size={18} className="text-black" />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-xs text-black uppercase tracking-tight">{req.requirementId}</p>
                        <p className="font-body font-semibold text-sm text-gray-500">{req.customerName}</p>
                        <p className="font-body text-xs text-gray-400">
                          {typeof req.items === 'object' && req.items !== null 
                            ? `${(req.items as any).itemName} - ${(req.items as any).quantity} ${(req.items as any).unit}` 
                            : req.items}
                        </p>
                      </div>
                    </div>
                    <Link href={`/customer-requirements`} className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-black flex items-center justify-center group-hover:bg-nb-yellow transition-all">
                      <ArrowRight size={16} className="text-transparent group-hover:text-black" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
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
            {recentOrders.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-24 px-6 text-center bg-gray-50/50">
                <div className="w-20 h-20 bg-white border-[3px] border-black shadow-nb flex items-center justify-center mb-6 -rotate-3">
                  <ShoppingCart size={40} className="text-gray-200" strokeWidth={1} />
                </div>
                <p className="font-body font-bold text-sm text-gray-400 italic">
                  No active orders at this time.
                </p>
              </div>
            ) : (
              <div className="divide-y-[2px] divide-black/5 bg-gray-50/30">
                {recentOrders.map((order, idx) => (
                  <div key={order._id || idx} className="p-6 flex items-center justify-between hover:bg-white transition-colors group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-nb-green/20 border-2 border-black/10 rounded flex items-center justify-center group-hover:border-black group-hover:bg-nb-green transition-all">
                        <Package size={18} className="text-black" />
                      </div>
                      <div>
                        <p className="font-mono font-bold text-xs text-black uppercase tracking-tight">{order.po_id}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className="font-body font-bold text-sm text-black">{order.total}</span>
                          <span className="px-2 py-0.5 bg-gray-200 text-[10px] font-mono font-bold uppercase rounded-full">{order.status}</span>
                        </div>
                      </div>
                    </div>
                    <Link href={`/orders`} className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-black flex items-center justify-center group-hover:bg-nb-cyan transition-all">
                      <ArrowRight size={16} className="text-transparent group-hover:text-black" />
                    </Link>
                  </div>
                ))}
              </div>
            )}
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
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Amount</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Due Date</th>
                  <th className="px-8 py-5 text-left font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em]">Action</th>
                </tr>
              </thead>
              <tbody>
                {pendingPayments.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-8 py-32 text-center">
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
                ) : (
                  pendingPayments.map((payment, idx) => (
                    <tr key={payment.id || idx} className="border-b-[2px] border-black/5 hover:bg-white transition-colors group">
                      <td className="px-8 py-5">
                        <span className="font-mono font-bold text-sm text-black">{payment.id}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-body font-bold text-sm text-black">{payment.amount}</span>
                      </td>
                      <td className="px-8 py-5">
                        <span className="font-body text-sm font-semibold text-gray-500">{payment.dueDate}</span>
                      </td>
                      <td className="px-8 py-5">
                        <Link href={`/invoice-submission`} className="inline-flex items-center gap-2 font-mono font-bold text-[10px] uppercase bg-black text-white px-3 py-1.5 hover:bg-nb-yellow hover:text-black transition-colors border-[2px] border-transparent hover:border-black">
                          Review <ArrowRight size={12} />
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Panel>
      </main>
    </>
  )
}

