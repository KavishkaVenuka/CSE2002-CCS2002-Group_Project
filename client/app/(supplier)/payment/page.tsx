"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  CreditCard, Clock, CheckCircle, 
  Search, ChevronDown, RefreshCw, Wallet,
  XCircle, TrendingUp, ArrowUpRight, Eye, AlertCircle, FileText, Receipt, Package, Calendar
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import { toast } from "sonner"
import { getMyPayments, getPaymentStats } from "@/lib/api"

export default function PaymentStatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  
  const [payments, setPayments] = useState<any[]>([])
  const [stats, setStats] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedPayment, setSelectedPayment] = useState<any>(null)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const params: any = {}
      if (statusFilter !== "All Status") {
        params.status = statusFilter.toLowerCase()
      }
      if (searchQuery) {
        params.search = searchQuery
      }

      const [paymentsRes, statsRes] = await Promise.all([
        getMyPayments(params),
        getPaymentStats()
      ])

      setPayments((paymentsRes as any).payments || [])
      setStats((statsRes as any).stats || null)
    } catch (err: any) {
      console.error("Failed to load payments:", err)
      toast.error(err.message || "Failed to load payment data")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter]) // Removing searchQuery from deps to prevent firing on every keystroke

  const filteredPayments = useMemo(() => {
    return payments.filter((pay) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = 
        (pay?.transaction_id || pay?.id || "").toLowerCase().includes(q) ||
        (pay?.purchaseOrderRef || pay?.orderId || "").toLowerCase().includes(q) ||
        (pay?.billRef || "").toLowerCase().includes(q)
      
      const matchesStatus = 
        statusFilter === "All Status" || 
        (pay?.status || "").toLowerCase() === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter, payments])

  const STAT_CARDS = [
    { title: "TOTAL RECEIVED", amount: `LKR ${(stats?.receivedAmount || 0).toLocaleString()}`, color: "bg-nb-green", label: "LIVE", icon: TrendingUp },
    { title: "IN SETTLEMENT", amount: `LKR ${(stats?.pendingAmount || 0).toLocaleString()}`, color: "bg-nb-yellow", label: "LIVE", icon: Clock },
    { title: "TRANSACTIONS", amount: `${stats?.totalPayments || 0}`, color: "bg-nb-cyan", label: "LIVE", icon: RefreshCw },
    { title: "UNSUCCESSFUL", amount: `${stats?.failedPayments || 0}`, color: "bg-red-400", label: "LIVE", icon: XCircle },
  ]

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': 
      case 'paid':
        return 'bg-nb-green text-black border-black';
      case 'pending':   
        return 'bg-nb-yellow text-black border-black';
      case 'failed':    
      case 'rejected':
        return 'bg-red-400 text-black border-black';
      default:          
        return 'bg-gray-200 text-black border-black';
    }
  };

  return (
    <>
      <Header title="Payment Status" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3.5px] border-black shadow-nb p-7 relative group nb-interactive hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              <div className="absolute top-5 right-5 flex items-center gap-1.5 px-2 py-0.5 bg-gray-50 border-[1.5px] border-black/10 rounded-full">
                <span className="w-1.5 h-1.5 rounded-full bg-nb-green animate-pulse"></span>
                <span className="font-mono font-bold text-[8px] text-gray-400 uppercase tracking-tighter">{stat.label}</span>
              </div>

              <div className={`w-14 h-14 border-[2.5px] border-black flex items-center justify-center mb-8 shadow-nb-sm ${stat.color} rounded-xl`}>
                <stat.icon size={26} className="text-black" strokeWidth={2.5} />
              </div>
              
              <div className="mt-2">
                <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-[0.2em] mb-1">{stat.title}</p>
                <h3 className="font-display font-black text-3xl lg:text-4xl text-black leading-none tracking-tight truncate">{stat.amount}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel 
          title="Transaction Ledger" 
          icon={<Wallet size={18} className="text-nb-cyan" />}
          noTopPad 
          badge={
            <div className="flex items-center gap-3">
              <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black/20 group-focus-within:text-black transition-colors" size={14} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search IDs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-gray-50 border-[2.5px] border-black/5 focus:border-black font-body text-xs outline-none transition-all w-48 sm:w-64"
                />
              </div>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-4 pr-10 py-2 bg-gray-50 border-[2.5px] border-black/5 focus:border-black font-body font-bold text-xs text-black outline-none cursor-pointer"
                >
                  <option>All Status</option>
                  <option>Completed</option>
                  <option>Pending</option>
                  <option>Failed</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black/40 pointer-events-none" size={14} strokeWidth={3} />
              </div>
              <button onClick={fetchData} className="p-2 bg-gray-50 border-[2.5px] border-black/5 hover:border-black hover:bg-white transition-all group">
                <RefreshCw size={14} strokeWidth={3} className={`text-black/40 group-hover:text-black transition-colors ${isLoading ? 'animate-spin' : ''}`} />
              </button>
            </div>
          }
        >
          <div className="flex flex-col min-h-[450px] overflow-x-auto">
            <div className="min-w-[800px]">
              {/* Table Header */}
              <div className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 px-8 py-6 border-b-[2.5px] border-black/5 text-gray-400 font-display font-black text-[10px] uppercase tracking-[0.2em]">
                <div>TX ID</div>
                <div>Order/Invoice</div>
                <div className="text-right">Amount</div>
                <div className="text-center">Method</div>
                <div className="text-center">Status</div>
                <div className="text-right">Actions</div>
              </div>
              
              {/* Table Content */}
              <div className="flex-1 flex flex-col">
                {isLoading ? (
                  <div className="flex-1 flex flex-col items-center justify-center p-24 text-center bg-gray-50/30 min-h-[300px] animate-pulse">
                    <div className="w-20 h-20 bg-white border-[3px] border-black shadow-nb flex items-center justify-center mb-6">
                      <RefreshCw size={32} className="text-gray-400 animate-spin" strokeWidth={2} />
                    </div>
                    <p className="font-body font-bold text-sm text-gray-400 tracking-wide uppercase font-display">Syncing transaction data...</p>
                  </div>
                ) : filteredPayments.length > 0 ? (
                  filteredPayments.map((pay, i) => (
                    <div 
                      key={pay.id || i}
                      className="grid grid-cols-[1.2fr_1.2fr_1fr_1fr_1fr_0.8fr] gap-4 items-center px-8 py-6 border-b border-black/5 hover:bg-nb-bg/30 transition-colors group"
                    >
                      <div className="font-mono text-xs font-black text-gray-500 group-hover:text-black transition-colors truncate">
                        {pay.transaction_id || pay.id || '—'}
                      </div>
                      <div className="flex flex-col truncate">
                        <span className="text-sm font-bold text-black truncate">{pay.billRef || pay.orderRef || 'N/A'}</span>
                        <span className="font-display text-[10px] text-gray-400 uppercase font-black tracking-widest truncate">{pay.purchaseOrderRef || pay.orderId || 'Direct'}</span>
                      </div>
                      <div className="text-right font-mono font-black text-black">
                        LKR {(pay.amount || pay.total || 0).toLocaleString()}
                      </div>
                      <div className="text-center flex justify-center">
                        <span className="px-3 py-1 bg-gray-100 border-[2px] border-black font-display font-black text-[10px] uppercase tracking-widest text-black shadow-nb-sm">
                          {pay.paymentMethod || pay.method || 'Unknown'}
                        </span>
                      </div>
                      <div className="text-center flex justify-center">
                        <span className={`px-3 py-1 border-[2px] font-display font-black text-[10px] uppercase shadow-nb-sm flex items-center gap-1 ${getStatusColor(pay.status)}`}>
                          {pay.status}
                        </span>
                      </div>
                      <div className="text-right flex justify-end">
                        <button
                          className="p-2 border-[2px] border-black shadow-nb-sm hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none bg-white transition-all active:bg-gray-100"
                          onClick={() => { setSelectedPayment(pay); setShowDetailsModal(true); }}
                        >
                          <Eye className="w-4 h-4 text-black" />
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-24 text-center bg-gray-50/30 min-h-[300px]">
                    <div className="w-20 h-20 bg-white border-[3px] border-black shadow-nb flex items-center justify-center mb-6">
                      <Wallet size={32} className="text-gray-200" strokeWidth={1} />
                    </div>
                    <p className="font-body font-bold text-sm text-gray-400 italic tracking-wide">No payment records discovered.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>
      </main>

      {/* Details Modal (Neo-Brutalist) */}
      {showDetailsModal && selectedPayment && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-black flex flex-col items-start border-b-[3px] border-black relative">
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="absolute top-6 right-6 text-white/50 hover:text-white transition-colors"
              >
                <XCircle size={24} />
              </button>
              
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-nb-cyan border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                  <Wallet size={20} className="text-black" />
                </div>
                <h2 className="font-display font-black text-2xl uppercase tracking-wider text-white">Payment Receipt</h2>
              </div>
              <span className={`px-3 py-1 border-[2px] font-display font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#000] ${getStatusColor(selectedPayment.status)}`}>
                {selectedPayment.status}
              </span>
            </div>
            
            <div className="p-8 space-y-6 bg-[#fdfcfb]">
              <div className="grid grid-cols-2 gap-4 p-6 bg-white border-[2px] border-black shadow-[4px_4px_0px_0px_#000]">
                {[
                  { label: 'Transaction ID', value: selectedPayment.transaction_id || selectedPayment.id || '—', icon: FileText },
                  { label: 'Invoice / Bill', value: selectedPayment.billRef || selectedPayment.orderRef || '—', icon: Receipt },
                  { label: 'Order Ref', value: selectedPayment.purchaseOrderRef || selectedPayment.orderId || '—', icon: Package },
                  { label: 'Settlement Date', value: selectedPayment.date ? new Date(selectedPayment.date).toLocaleDateString() : 'N/A', icon: Calendar },
                  { label: 'Method', value: selectedPayment.paymentMethod || selectedPayment.method || 'Unknown', icon: CreditCard },
                ].map((row, i) => (
                  <div key={i} className="space-y-1">
                    <div className="flex items-center gap-1.5 text-[10px] font-display font-black uppercase text-gray-500 tracking-widest">
                      <row.icon className="w-3 h-3" strokeWidth={3} />
                      {row.label}
                    </div>
                    <p className="font-mono font-bold text-sm text-black truncate">{row.value}</p>
                  </div>
                ))}
                
                <div className="col-span-2 pt-4 border-t-[2px] border-black/10 mt-2">
                  <p className="text-[10px] font-display font-black uppercase text-nb-green tracking-widest mb-1">Disbursed Amount</p>
                  <p className="text-3xl font-display font-black text-black tracking-tight">
                    LKR {(selectedPayment.amount || selectedPayment.total || 0).toLocaleString()}
                  </p>
                </div>
              </div>

              {selectedPayment.notes && (
                <div className="p-4 bg-nb-yellow border-[2px] border-black shadow-[4px_4px_0px_0px_#000] flex gap-3">
                  <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" strokeWidth={3} />
                  <div>
                    <p className="text-[10px] font-display font-black uppercase text-black tracking-widest mb-1">Transaction Notes</p>
                    <p className="text-xs text-black font-body font-bold leading-relaxed">{selectedPayment.notes}</p>
                  </div>
                </div>
              )}

              <button 
                className="w-full h-12 bg-white text-black font-display font-black text-xs uppercase tracking-widest border-[3px] border-black shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-gray-100" 
                onClick={() => setShowDetailsModal(false)}
              >
                Close Receipt
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
