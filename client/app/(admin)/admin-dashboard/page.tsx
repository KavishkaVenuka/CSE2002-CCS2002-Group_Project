'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  LineChart, Line, PieChart,
  Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import {
  Banknote, TrendingUp, TrendingDown,Package, AlertTriangle, Clock,
  ArrowUpRight, Users, Truck,
  FileText, ShoppingBag, RefreshCw, Loader2
} from 'lucide-react';
import axios from 'axios';
import { AdminSidebar } from "@/components/admin/Sidebar";

interface DashboardStats {
  totalRevenue: number;
  totalExpenses: number;
  totalProfit: number;
  lowStockAlerts: number;
  pendingCustomerRequests: number;
  pendingSupplierRequests: number;
  salesTrend: { month: string; revenue: number }[];
  expenseData: { name: string; value: number; color: string }[];
  recentActivities: any[];
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  const fetchStats = async () => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5900/api/dashboard/admin-stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(res.data.stats);
    } catch (err) {
      console.error('Failed to fetch dashboard stats:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const kpis = [
    {
      label: 'Total Revenue',
      value: stats ? `LKR ${stats.totalRevenue.toLocaleString()}` : 'LKR 0',
      change: '+12.5%',
      trend: 'up',
      icon: Banknote,
      bgColor: 'bg-nb-green',
      description: 'vs last month'
    },
    {
      label: 'Total Profit',
      value: stats ? `LKR ${stats.totalProfit.toLocaleString()}` : 'LKR 0',
      change: '+8.2%',
      trend: 'up',
      icon: TrendingUp,
      bgColor: 'bg-nb-cyan',
      description: 'vs last month'
    },
    {
      label: 'Total Expenses',
      value: stats ? `LKR ${stats.totalExpenses.toLocaleString()}` : 'LKR 0',
      change: '-3.1%',
      trend: 'down',
      icon: TrendingDown,
      bgColor: 'bg-nb-yellow',
      description: 'vs last month'
    },
    {
      label: 'Low Stock Alerts',
      value: stats ? stats.lowStockAlerts.toString() : '0',
      change: '',
      trend: 'alert',
      icon: AlertTriangle,
      bgColor: 'bg-nb-red',
      description: 'items need restock'
    },
  ];

  const pendingRequests = [
    { label: 'Pending Customer Requests', value: stats ? stats.pendingCustomerRequests.toString() : '0', icon: Users, bgColor: 'bg-nb-cyan', link: '/customer-requests' },
    { label: 'Pending Supplier Requests', value: stats ? stats.pendingSupplierRequests.toString() : '0', icon: Truck, bgColor: 'bg-nb-green', link: '/purchase-orders' },
  ];

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed':
      case 'paid':
        return 'bg-nb-green text-black border-black';
      case 'processing':
      case 'confirmed':
        return 'bg-nb-cyan text-black border-black';
      case 'pending':
      case 'unpaid':
        return 'bg-nb-yellow text-black border-black';
      case 'alert':
      case 'failed':
        return 'bg-nb-red text-black border-black';
      default:
        return 'bg-white text-black border-black';
    }
  };

  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-x-hidden">
        {isLoading ? (
          // Skeleton Loading UI
          <>
            {/* Page Header Skeleton */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-nb-white border-2 border-nb-black p-2 shadow-nb">
              <div>
                <div className="h-10 w-64 bg-[#d4ede9] border-2 border-nb-black shimmer mb-3"></div>
                <div className="h-5 w-96 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              </div>
              <div className="h-10 w-32 bg-nb-yellow border-2 border-nb-black shimmer"></div>
            </div>

            {/* KPI Cards Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Green Card */}
              <div className="nb-card bg-nb-green p-6 border-2 border-nb-black">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
                  <div className="w-16 h-6 bg-nb-white border-2 border-nb-black shimmer"></div>
                </div>
                <div>
                  <div className="h-3 w-24 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
                  <div className="h-10 w-40 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
                  <div className="h-4 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
                </div>
              </div>

              {/* Cyan Card */}
              <div className="nb-card bg-nb-cyan p-6 border-2 border-nb-black">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
                  <div className="w-16 h-6 bg-nb-white border-2 border-nb-black shimmer"></div>
                </div>
                <div>
                  <div className="h-3 w-24 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
                  <div className="h-10 w-40 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
                  <div className="h-4 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
                </div>
              </div>

              {/* Yellow Card */}
              <div className="nb-card bg-nb-yellow p-6 border-2 border-nb-black">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
                  <div className="w-16 h-6 bg-nb-white border-2 border-nb-black shimmer"></div>
                </div>
                <div>
                  <div className="h-3 w-24 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
                  <div className="h-10 w-40 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
                  <div className="h-4 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
                </div>
              </div>

              {/* Red Card */}
              <div className="nb-card bg-nb-red p-6 border-2 border-nb-black">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
                  <div className="w-16 h-6 bg-nb-white border-2 border-nb-black shimmer"></div>
                </div>
                <div>
                  <div className="h-3 w-24 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
                  <div className="h-10 w-40 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
                  <div className="h-4 w-32 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
                </div>
              </div>
            </div>

            {/* Pending Requests Skeleton */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[1, 2].map((i) => (
                <div key={i} className="nb-card bg-nb-white p-6 border-2 border-nb-black flex items-center justify-between">
                  <div className="flex items-center gap-5">
                    <div className="w-14 h-14 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    <div>
                      <div className="h-3 w-40 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
                      <div className="h-8 w-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                    </div>
                  </div>
                  <div className="w-12 h-12 bg-nb-yellow border-2 border-nb-black shimmer"></div>
                </div>
              ))}
            </div>

            {/* Charts Section Skeleton */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Sales Trend Chart */}
              <div className="nb-card bg-nb-white border-2 border-nb-black flex flex-col">
                <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
                  <div className="h-5 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-end justify-around h-72 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((i) => (
                      <div key={i} className="flex flex-col items-center gap-2">
                        <div className={`w-12 bg-[#d4ede9] border-2 border-nb-black shimmer`} style={{ height: `${Math.random() * 200 + 60}px` }}></div>
                        <div className="h-3 w-8 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Expense Breakdown Chart */}
              <div className="nb-card bg-nb-white border-2 border-nb-black flex flex-col">
                <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
                  <div className="h-5 w-48 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                </div>
                <div className="p-6 flex-1 flex items-center justify-center">
                  <div className="w-64 h-64 rounded-none border-4 border-nb-black bg-[#d4ede9] shimmer relative flex items-center justify-center">
                    <div className="absolute w-40 h-40 border-4 border-nb-bg bg-nb-white"></div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activities Table Skeleton */}
            <div className="nb-card bg-nb-white border-2 border-nb-black">
              <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
                <div className="h-5 w-40 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              </div>
              <div className="p-0 overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[800px]">
                  <thead>
                    <tr className="border-b-2 border-nb-black bg-nb-bg">
                      <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Type</th>
                      <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Entity</th>
                      <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Description</th>
                      <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-right">Amount</th>
                      <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Status</th>
                      <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-right">Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[1, 2, 3, 4].map((rowIndex) => (
                      <tr key={rowIndex} className="border-b-2 border-nb-black">
                        <td className="p-4">
                          <div className="h-4 w-16 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                        </td>
                        <td className="p-4">
                          <div className="h-4 w-20 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                        </td>
                        <td className="p-4">
                          <div className="h-4 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="h-4 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer ml-auto"></div>
                        </td>
                        <td className="p-4 text-center">
                          <div className="h-6 w-20 bg-[#d4ede9] border-2 border-nb-black shimmer mx-auto"></div>
                        </td>
                        <td className="p-4 text-right">
                          <div className="h-4 w-16 bg-[#d4ede9] border-2 border-nb-black shimmer ml-auto"></div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Quick Links Skeleton */}
            <div className="nb-card bg-nb-white border-2 border-nb-black">
              <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
                <div className="h-5 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              </div>
              <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                {['bg-nb-cyan', 'bg-nb-green', 'bg-nb-orange', 'bg-nb-yellow'].map((color, idx) => (
                  <div key={idx} className={`${color} border-2 border-nb-black p-6 flex flex-col items-start gap-4`}>
                    <div className="w-10 h-10 bg-nb-white border-2 border-nb-black shimmer"></div>
                    <div className="h-4 w-24 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
                  </div>
                ))}
              </div>
            </div>

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
        ) : (
          <>
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 bg-nb-white border-2 border-nb-black p-2 shadow-nb">
              <div>
                <h1 className="text-4xl font-display font-black text-nb-black tracking-tight uppercase">Admin Dashboard</h1>
                <p className="text-nb-black font-bold mt-1 uppercase text-sm tracking-widest">Business intelligence and performance overview</p>
              </div>
              <button
                onClick={fetchStats}
                className="nb-interactive bg-nb-yellow border-2 border-nb-black px-4 py-2 text-nb-black font-bold flex items-center gap-2 shadow-nb-sm"
              >
                <RefreshCw className={`w-5 h-5`} strokeWidth={2.5} />
                REFRESH DATA
              </button>
            </div>

            {/* KPI Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {kpis.map((kpi) => (
              <div key={kpi.label} className={`nb-card ${kpi.bgColor} p-6 relative flex flex-col justify-between`}>
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shadow-nb-sm flex items-center justify-center">
                    <kpi.icon className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
                  </div>
                  {kpi.change && (
                    <span className="nb-badge bg-nb-white">
                      {kpi.change}
                    </span>
                  )}
                </div>
                <div>
                  <h3 className="text-xs font-black text-nb-black/80 uppercase tracking-widest mb-1">{kpi.label}</h3>
                  <p className="text-4xl font-display font-black text-nb-black mb-1">{kpi.value}</p>
                  <p className="text-sm font-bold text-nb-black/80">{kpi.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Pending Requests */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {pendingRequests.map((req) => (
              <div key={req.label} className={`nb-card bg-nb-white p-6 flex items-center justify-between`}>
                <div className="flex items-center gap-5">
                  <div className={`w-14 h-14 ${req.bgColor} border-2 border-nb-black shadow-nb-sm flex items-center justify-center`}>
                    <req.icon className="w-7 h-7 text-nb-black" strokeWidth={2.5} />
                  </div>
                  <div>
                    <p className="text-xs font-black text-nb-black/70 uppercase tracking-widest">{req.label}</p>
                    <p className="text-3xl font-display font-black text-nb-black">{req.value}</p>
                  </div>
                </div>
                <button 
                  onClick={() => router.push(req.link)}
                  className="nb-interactive bg-nb-yellow border-2 border-nb-black p-3 shadow-nb-sm"
                  aria-label={`View ${req.label}`}
                >
                  <ArrowUpRight className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
                </button>
              </div>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Sales Trend */}
            <div className="nb-card bg-nb-white flex flex-col">
              <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
                <h2 className="text-lg font-display font-black uppercase tracking-widest text-nb-black flex items-center gap-2">
                  <TrendingUp className="w-5 h-5" strokeWidth={2.5} />
                  Sales Trend (Revenue)
                </h2>
              </div>
              <div className="p-6 flex-1">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={stats?.salesTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#000" vertical={false} />
                    <XAxis dataKey="month" stroke="#000" fontSize={12} tickLine={false} axisLine={{ stroke: '#000', strokeWidth: 2 }} fontWeight="bold" />
                    <YAxis stroke="#000" fontSize={12} tickLine={false} axisLine={{ stroke: '#000', strokeWidth: 2 }} tickFormatter={(val) => `LKR ${val / 1000}K`} fontWeight="bold" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #000',
                        borderRadius: '0',
                        boxShadow: '4px 4px 0px 0px #000',
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                      itemStyle={{ color: '#000', fontWeight: 'bold' }}
                    />
                    <Line
                      type="stepBefore"
                      dataKey="revenue"
                      stroke="#000"
                      strokeWidth={4}
                      dot={{ fill: '#FACC15', r: 6, strokeWidth: 2, stroke: '#000' }}
                      activeDot={{ r: 8, fill: '#4ADE80', stroke: '#000', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Expense Breakdown */}
            <div className="nb-card bg-nb-white flex flex-col">
              <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
                <h2 className="text-lg font-display font-black uppercase tracking-widest text-nb-black flex items-center gap-2">
                  <Banknote className="w-5 h-5" strokeWidth={2.5} />
                  Expense Breakdown
                </h2>
              </div>
              <div className="p-6 flex-1">
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={stats?.expenseData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={0}
                      dataKey="value"
                      label={({ name, percent }: any) => `${name} (${(percent * 100).toFixed(0)}%)`}
                      stroke="#000"
                      strokeWidth={2}
                    >
                      {stats?.expenseData?.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color || '#4ADE80'} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#fff',
                        border: '2px solid #000',
                        borderRadius: '0',
                        boxShadow: '4px 4px 0px 0px #000',
                        color: '#000',
                        fontWeight: 'bold',
                      }}
                    />
                    <Legend wrapperStyle={{ fontWeight: 'bold' }} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Activities */}
          <div className="nb-card bg-nb-white">
            <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
              <h2 className="text-lg font-display font-black uppercase tracking-widest text-nb-black flex items-center gap-2">
                <Clock className="w-5 h-5" strokeWidth={2.5} />
                Recent Activities
              </h2>
            </div>
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[800px]">
                <thead>
                  <tr className="border-b-2 border-nb-black bg-nb-bg">
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Type</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Entity</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Description</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-right">Amount</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Status</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-right">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {stats?.recentActivities?.map((activity) => (
                    <tr key={activity.id} className="border-b-2 border-nb-black hover:bg-nb-yellow/10 transition-colors">
                      <td className="p-4 font-bold text-nb-black text-sm">{activity.type}</td>
                      <td className="p-4 text-nb-black font-bold text-sm">{activity.entity}</td>
                      <td className="p-4 text-nb-black text-sm font-medium">{activity.description}</td>
                      <td className="p-4 text-right font-black text-nb-black text-sm">
                        {activity.amount ? `LKR ${activity.amount.toLocaleString()}` : '-'}
                      </td>
                      <td className="p-4 text-center">
                        <span className={`nb-badge ${getStatusColor(activity.status)}`}>
                          {activity.status}
                        </span>
                      </td>
                      <td className="p-4 text-right text-[11px] font-bold text-nb-black uppercase">{activity.time}</td>
                    </tr>
                  ))}
                  {(!stats?.recentActivities || stats.recentActivities.length === 0) && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-nb-black font-bold border-b-2 border-nb-black last:border-0">No recent activities found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Quick Links */}
          <div className="nb-card bg-nb-white">
            <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
              <h2 className="text-lg font-display font-black uppercase tracking-widest text-nb-black">Quick Links</h2>
            </div>
            <div className="p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/stock" className="nb-interactive bg-nb-cyan border-2 border-nb-black p-6 flex flex-col items-start gap-4 shadow-nb-sm">
                <div className="bg-nb-white border-2 border-nb-black p-2 shadow-[2px_2px_0px_0px_#000]">
                  <Package className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
                </div>
                <span className="text-nb-black font-black uppercase tracking-wide">Stock Management</span>
              </Link>
              <Link href="/customer-requests" className="nb-interactive bg-nb-green border-2 border-nb-black p-6 flex flex-col items-start gap-4 shadow-nb-sm">
                <div className="bg-nb-white border-2 border-nb-black p-2 shadow-[2px_2px_0px_0px_#000]">
                  <FileText className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
                </div>
                <span className="text-nb-black font-black uppercase tracking-wide">Customer Requests</span>
              </Link>
              <Link href="/purchase-orders" className="nb-interactive bg-nb-orange border-2 border-nb-black p-6 flex flex-col items-start gap-4 shadow-nb-sm">
                <div className="bg-nb-white border-2 border-nb-black p-2 shadow-[2px_2px_0px_0px_#000]">
                  <ShoppingBag className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
                </div>
                <span className="text-nb-black font-black uppercase tracking-wide">Purchase Orders</span>
              </Link>
              <Link href="/payments" className="nb-interactive bg-nb-yellow border-2 border-nb-black p-6 flex flex-col items-start gap-4 shadow-nb-sm">
                <div className="bg-nb-white border-2 border-nb-black p-2 shadow-[2px_2px_0px_0px_#000]">
                  <Banknote className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
                </div>
                <span className="text-nb-black font-black uppercase tracking-wide">Payments</span>
              </Link>
            </div>
          </div>
        </>
        )}
      </div>
    </div>
  );
}