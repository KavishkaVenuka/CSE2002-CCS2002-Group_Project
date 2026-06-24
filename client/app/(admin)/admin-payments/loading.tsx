'use client';

import {
  CreditCard,
  Building2,
  Receipt,
  Plus,
  Search,
  FileText,
  BarChart3,
  PieChart as PieChartIcon,
  Sparkles,
  Download,
} from 'lucide-react';

export default function PaymentsLoading() {
  return (
    <>

      <main className="flex-1 overflow-y-auto p-8 border-l-4 border-black">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Skeleton */}
          <div className="bg-nb-purple border-4 border-black shadow-[8px_8px_0px_0px_#000] p-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div>
                <h1 className="text-4xl font-black uppercase tracking-tight mb-2 flex items-center gap-3">
                  <CreditCard className="w-10 h-10" />
                  Payments & Transactions
                </h1>
                <p className="text-xl font-bold">
                  Track expenses, supplier payments, customer income, and bank balances
                </p>
              </div>
              <div className="bg-nb-yellow/50 w-44 h-14 border-4 border-black shadow-[4px_4px_0px_0px_#000] shimmer"></div>
            </div>
          </div>

          {/* Stats Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            {/* Card 1: Total Expenses */}
            <div className="bg-nb-pink border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Receipt className="w-6 h-6 text-black" />
                </div>
                <div className="bg-white border-2 border-black w-14 h-7 shadow-[2px_2px_0px_0px_#000] shimmer"></div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Total Expenses</h3>
              <div className="h-8 w-36 bg-black/10 border-2 border-black shimmer"></div>
            </div>

            {/* Card 2: Supplier Payments */}
            <div className="bg-nb-blue border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <div className="bg-white border-2 border-black w-14 h-7 shadow-[2px_2px_0px_0px_#000] shimmer"></div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Supplier Payments</h3>
              <div className="h-8 w-36 bg-black/10 border-2 border-black shimmer"></div>
            </div>

            {/* Card 3: Customer Income */}
            <div className="bg-nb-cyan border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <CreditCard className="w-6 h-6 text-black" />
                </div>
                <div className="bg-white border-2 border-black w-14 h-7 shadow-[2px_2px_0px_0px_#000] shimmer"></div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Customer Income</h3>
              <div className="h-8 w-36 bg-black/10 border-2 border-black shimmer"></div>
            </div>

            {/* Card 4: Cash In Hand */}
            <div className="bg-nb-green border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Cash In Hand</h3>
              <div className="h-8 w-36 bg-black/10 border-2 border-black shimmer"></div>
            </div>

            {/* Card 5: Total Bank Balance */}
            <div className="bg-nb-orange border-4 border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <Building2 className="w-6 h-6 text-black" />
                </div>
                <div className="bg-white border-2 border-black w-14 h-7 shadow-[2px_2px_0px_0px_#000] shimmer"></div>
              </div>
              <h3 className="text-sm font-bold uppercase mb-1">Total Bank Balance</h3>
              <div className="h-8 w-36 bg-black/10 border-2 border-black shimmer"></div>
            </div>
          </div>

          {/* Bank Accounts Grid Skeleton */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
            <div className="bg-nb-yellow border-b-4 border-black p-4 flex items-center gap-2 font-black uppercase text-xl">
              <Building2 className="w-6 h-6" />
              Bank Account Balances
            </div>
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-nb-bg border-4 border-black shadow-[4px_4px_0px_0px_#000] p-4 relative">
                  <div className="h-6 w-24 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] shimmer mb-2"></div>
                  <div className="h-7 w-40 bg-[#d4ede9] border-2 border-black shimmer mb-1"></div>
                  <div className="h-5 w-32 bg-[#d4ede9] border-2 border-black shimmer"></div>
                  <div className="mt-4 border-t-2 border-black pt-4">
                    <div className="h-10 w-44 bg-white border-2 border-black shadow-[2px_2px_0px_0px_#000] shimmer"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment Logs Table Skeleton */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
            <div className="bg-nb-orange border-b-4 border-black p-4 flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-2 font-black uppercase text-xl">
                <FileText className="w-6 h-6" />
                Payment Logs
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-black" />
                  <input
                    disabled
                    placeholder="SEARCH TRANSACTIONS..."
                    className="pl-9 pr-4 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] font-bold uppercase w-64 cursor-not-allowed"
                  />
                </div>
                <select
                  disabled
                  className="px-4 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] font-bold uppercase w-40 appearance-none cursor-not-allowed"
                >
                  <option>ALL TYPES</option>
                </select>
                <select
                  disabled
                  className="px-4 py-2 border-2 border-black bg-white shadow-[2px_2px_0px_0px_#000] font-bold uppercase w-40 appearance-none cursor-not-allowed"
                >
                  <option>ALL STATUS</option>
                </select>
              </div>
            </div>

            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-nb-bg border-b-4 border-black">
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Date</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Txn ID</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Type</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Category</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Related Entity</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Amount</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Method</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Bank Account</th>
                    <th className="p-4 font-black uppercase border-r-2 border-black whitespace-nowrap">Status</th>
                    <th className="p-4 font-black uppercase whitespace-nowrap">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <tr key={i} className="border-b-2 border-black">
                      <td className="p-4 border-r-2 border-black"><div className="h-5 w-24 bg-[#d4ede9] border-2 border-black shimmer"></div></td>
                      <td className="p-4 border-r-2 border-black"><div className="h-5 w-28 bg-[#d4ede9] border-2 border-black shimmer"></div></td>
                      <td className="p-4 border-r-2 border-black">
                        <div className="h-7 w-24 bg-[#d4ede9] border-2 border-black shimmer"></div>
                      </td>
                      <td className="p-4 border-r-2 border-black"><div className="h-5 w-24 bg-[#d4ede9] border-2 border-black shimmer"></div></td>
                      <td className="p-4 border-r-2 border-black"><div className="h-5 w-32 bg-[#d4ede9] border-2 border-black shimmer"></div></td>
                      <td className="p-4 border-r-2 border-black"><div className="h-5 w-28 bg-[#d4ede9] border-2 border-black shimmer"></div></td>
                      <td className="p-4 border-r-2 border-black"><div className="h-5 w-16 bg-[#d4ede9] border-2 border-black shimmer"></div></td>
                      <td className="p-4 border-r-2 border-black"><div className="h-5 w-36 bg-[#d4ede9] border-2 border-black shimmer"></div></td>
                      <td className="p-4 border-r-2 border-black">
                        <div className="h-7 w-24 bg-[#d4ede9] border-2 border-black shimmer"></div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2">
                          <div className="w-8 h-8 bg-[#d4ede9] border-2 border-black shimmer"></div>
                          <div className="w-8 h-8 bg-[#d4ede9] border-2 border-black shimmer"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="p-4 bg-nb-bg border-t-4 border-black flex items-center justify-between font-bold uppercase">
              <div className="h-5 w-64 bg-[#d4ede9] border-2 border-black shimmer"></div>
            </div>
          </div>

          {/* Charts Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Chart 1 Skeleton */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
              <div className="bg-nb-pink border-b-4 border-black p-4 flex items-center justify-between">
                <h3 className="font-black uppercase text-xl flex items-center gap-2">
                  <BarChart3 className="w-6 h-6" /> Payment Distribution
                </h3>
                <div className="h-10 w-28 bg-[#d4ede9] border-2 border-black shimmer"></div>
              </div>
              <div className="p-6 flex items-center justify-center" style={{ height: '348px' }}>
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="flex-1 flex items-end gap-4 px-4 pb-4 border-b-2 border-black">
                    {[35, 60, 45, 80, 50, 70].map((height, i) => (
                      <div key={i} className="flex-1 flex gap-1 items-end h-full">
                        <div className="w-full bg-[#d4ede9] border-2 border-black border-b-0 shimmer" style={{ height: `${height}%` }}></div>
                      </div>
                    ))}
                  </div>
                  <div className="h-6 flex justify-between px-4 mt-2">
                    {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                      <div key={i} className="text-xs font-bold font-mono text-center flex-1">{month}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Chart 2 Skeleton */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden">
              <div className="bg-nb-cyan border-b-4 border-black p-4 flex items-center justify-between">
                <h3 className="font-black uppercase text-xl flex items-center gap-2">
                  <PieChartIcon className="w-6 h-6" /> Expense Breakdown
                </h3>
                <div className="h-10 w-32 bg-[#d4ede9] border-2 border-black shimmer"></div>
              </div>
              <div className="p-6 flex items-center justify-center" style={{ height: '348px' }}>
                <div className="relative w-48 h-48 rounded-full border-4 border-black bg-white flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-[#d4ede9] to-transparent shimmer"></div>
                  <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-black"></div>
                  <div className="absolute left-0 right-0 top-1/2 h-1 bg-black"></div>
                  <div className="w-24 h-24 rounded-full border-4 border-black bg-white z-10"></div>
                </div>
              </div>
            </div>

            {/* Chart 3 Skeleton */}
            <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden lg:col-span-2">
              <div className="bg-nb-purple border-b-4 border-black p-4 flex items-center justify-between">
                <h3 className="font-black uppercase text-xl flex items-center gap-2 text-white">
                  <Sparkles className="w-6 h-6" /> Income vs Expenses Trend
                </h3>
              </div>
              <div className="p-6 flex flex-col justify-between" style={{ height: '348px' }}>
                <div className="flex-1 border-b-2 border-black border-l-2 relative pb-4">
                  <div className="absolute inset-x-0 top-1/4 border-t border-black/10 border-dashed"></div>
                  <div className="absolute inset-x-0 top-2/4 border-t border-black/10 border-dashed"></div>
                  <div className="absolute inset-x-0 top-3/4 border-t border-black/10 border-dashed"></div>

                  <svg className="absolute inset-0 w-full h-full" overflow="visible">
                    <path
                      d="M 50 150 Q 150 80 250 180 T 450 100 T 650 120 T 850 50"
                      fill="none"
                      stroke="#4dff4d"
                      strokeWidth="4"
                      className="opacity-40"
                    />
                    <path
                      d="M 50 180 Q 150 200 250 150 T 450 160 T 650 190 T 850 120"
                      fill="none"
                      stroke="#ff4d4d"
                      strokeWidth="4"
                      className="opacity-40"
                    />
                  </svg>
                </div>
                <div className="h-6 flex justify-between mt-2 pl-4">
                  {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'].map((month, i) => (
                    <div key={i} className="text-xs font-bold font-mono text-center flex-1">{month}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Reports & Export Card Skeleton */}
          <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_#000] overflow-hidden mb-8">
            <div className="bg-nb-green border-b-4 border-black p-4">
              <h3 className="font-black uppercase text-xl flex items-center gap-2">
                <Download className="w-6 h-6" /> Reports & Export
              </h3>
            </div>
            <div className="p-6">
              <p className="font-bold uppercase mb-4">Generate and export financial reports</p>
              <div className="flex gap-4 flex-wrap">
                <button disabled className="bg-nb-cyan px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase flex items-center gap-2 cursor-not-allowed">
                  <Download className="w-5 h-5" /> Export Report
                </button>
                <button disabled className="bg-white px-6 py-3 border-4 border-black shadow-[4px_4px_0px_0px_#000] font-black uppercase flex items-center gap-2 cursor-not-allowed">
                  <FileText className="w-5 h-5" /> Preview Report
                </button>
              </div>
            </div>
          </div>

        </div>
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
