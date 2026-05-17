"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  Search, ChevronDown, Clock, CheckCircle, 
  XCircle, Eye, Download, RefreshCw, FileText,
  ClipboardList, Package, AlertCircle, X, Loader2
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import { getSupplierQuotationsTable, getSupplierQuotationsStats, getQuotationDetails } from "@/lib/api"
import { toast } from "sonner"

const BADGE_MAP: Record<string, string> = {
  "pending": "bg-nb-yellow",
  "approved": "bg-nb-green",
  "rejected": "bg-red-400",
}

interface Stats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}

export default function QuotationStatusPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")
  
  const [quotations, setQuotations] = useState<any[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  
  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedQuotation, setSelectedQuotation] = useState<any | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const statusParam = statusFilter === "All Status" ? undefined : statusFilter.toLowerCase()
      
      const [quotRes, statsRes] = await Promise.all([
        getSupplierQuotationsTable({ status: statusParam }),
        getSupplierQuotationsStats()
      ])

      setQuotations(quotRes.quotations || [])
      setStats(statsRes.stats as any)
    } catch (err: any) {
      console.error('Failed to load quotations:', err)
      toast.error('Failed to load quotations')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter])

  const filteredQuotations = useMemo(() => {
    return quotations.filter((qt) => {
      const qId = qt.sq_id || qt.quotationID || qt.id || ""
      const rId = qt.requirementId || qt.requirementRef || ""
      const q = searchQuery.toLowerCase()
      
      return (
        qId.toLowerCase().includes(q) ||
        rId.toLowerCase().includes(q)
      )
    })
  }, [quotations, searchQuery])

  const handleViewDetails = async (id: string) => {
    try {
      setIsLoadingDetail(true)
      setShowDetailsModal(true)
      const res = await getQuotationDetails(id)
      setSelectedQuotation(res.quotation)
    } catch (err: any) {
      toast.error('Failed to load quotation details')
      setShowDetailsModal(false)
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const STAT_CARDS = [
    { title: "Total Submitted", value: stats ? `LKR ${(quotations.reduce((s,q) => s + (Number(q.total || q.totalAmount) || 0), 0)).toLocaleString()}` : "LKR 0", icon: FileText, color: "bg-nb-cyan" },
    { title: "Pending Review", value: stats?.pending?.toString() || "0", icon: Clock, color: "bg-nb-yellow" },
    { title: "Approved", value: stats?.approved?.toString() || "0", icon: CheckCircle, color: "bg-nb-green" },
    { title: "Rejected", value: stats?.rejected?.toString() || "0", icon: XCircle, color: "bg-red-400" },
  ]

  return (
    <>
      <Header title="Quotation Status" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3px] border-black shadow-nb p-6 flex items-center gap-4 relative group hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-nb-sm transition-all"
            >
              <div className={`w-12 h-12 border-[2px] border-black flex items-center justify-center shadow-nb-sm ${stat.color}`}>
                <stat.icon size={24} strokeWidth={2.5} className="text-black" />
              </div>
              <div>
                <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="font-display font-black text-2xl text-black leading-none">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel 
          title="Submitted Quotations" 
          icon={<ClipboardList size={20} className="text-nb-cyan" />}
          noTopPad
          badge={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={14} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search IDs..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-white border-[2px] border-black font-body text-xs outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all w-44 sm:w-64"
                />
              </div>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-white border-[2px] border-black font-display font-black text-[10px] uppercase outline-none cursor-pointer focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Approved</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={14} strokeWidth={3} />
              </div>
              <button onClick={fetchData} className="p-1.5 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-gray-100">
                <RefreshCw size={14} strokeWidth={3} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[140px_140px_1fr_140px_120px_100px] gap-4 px-6 py-4 border-b-[3px] border-black bg-gray-50 text-gray-400 font-display font-black text-[10px] uppercase tracking-widest min-w-[900px]">
              <div>Quotation ID</div>
              <div>Requirement Ref</div>
              <div>Total Amount</div>
              <div>Date Submitted</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="flex flex-col min-w-[900px] min-h-[200px]">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-white py-12">
                  <Loader2 size={32} className="animate-spin text-black" />
                  <p className="font-display font-black text-xs text-gray-400 uppercase tracking-widest">Loading...</p>
                </div>
              ) : filteredQuotations.length > 0 ? (
                filteredQuotations.map((qt, i) => (
                  <div 
                    key={qt._id || qt.id}
                    className={`
                      grid grid-cols-[140px_140px_1fr_140px_120px_100px] gap-4 items-center px-6 py-5
                      ${i < filteredQuotations.length - 1 ? "border-b-[2px] border-black" : ""}
                      bg-white hover:bg-nb-bg transition-colors duration-100 group
                    `}
                  >
                    <div className="font-mono text-sm font-black text-black underline decoration-black/20 group-hover:decoration-black">{qt.sq_id || qt.quotationID || qt.id}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{qt.requirementId || qt.requirementRef || 'Direct'}</div>
                    <div className="font-display font-black text-sm text-black">LKR {Number(qt.total || qt.totalAmount || 0).toLocaleString()}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{new Date(qt.date).toLocaleDateString()}</div>
                    
                    <div>
                      <span className={`px-3 py-1 border-[2px] border-black text-black font-display font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_#000] ${BADGE_MAP[qt.status?.toLowerCase()] || 'bg-gray-200'}`}>
                        {qt.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleViewDetails(qt._id || qt.id)}
                        className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" 
                        title="View Details"
                      >
                        <Eye size={14} strokeWidth={3} />
                      </button>
                      <button className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Download PDF">
                        <Download size={14} strokeWidth={3} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-white py-12">
                  <div className="w-16 h-16 bg-nb-bg border-[3px] border-black flex items-center justify-center shadow-nb rotate-3">
                    <Search size={32} className="text-gray-400" strokeWidth={2} />
                  </div>
                  <p className="font-body font-bold text-sm text-gray-400 italic">No quotations found.</p>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </main>

      {/* ── MODAL ────────────────────────────────────────────── */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-3xl max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b-[3px] border-black bg-nb-cyan">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <FileText size={20} className="text-black" />
                </div>
                <h2 className="font-display font-black text-xl text-black">Quotation Details</h2>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-gray-100"
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto bg-[#fdfcfb]">
              {isLoadingDetail ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={40} className="animate-spin text-black" />
                  <p className="font-display font-black text-sm uppercase tracking-widest text-gray-500">Loading Details...</p>
                </div>
              ) : selectedQuotation ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="p-4 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Quote ID</p>
                      <p className="font-mono text-sm font-black text-black">{selectedQuotation.sq_id || selectedQuotation.quotationID || selectedQuotation.id}</p>
                    </div>
                    <div className="p-4 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Requirement</p>
                      <p className="font-mono text-sm font-black text-black">{selectedQuotation.requirementId || 'Direct'}</p>
                    </div>
                    <div className="p-4 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Submitted On</p>
                      <p className="font-mono text-sm font-black text-black">{new Date(selectedQuotation.date).toLocaleDateString()}</p>
                    </div>
                    <div className="p-4 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Status</p>
                      <span className={`inline-block px-3 py-1 border-[2px] border-black text-black font-display font-black text-[10px] uppercase shadow-[2px_2px_0px_0px_#000] ${BADGE_MAP[selectedQuotation.status?.toLowerCase()] || 'bg-gray-200'}`}>
                        {selectedQuotation.status}
                      </span>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display font-black text-xs text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Package size={16} />
                      Quoted Items
                    </h4>
                    <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b-[3px] border-black">
                            <tr>
                              <th className="px-4 py-3 text-left font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Item</th>
                              <th className="px-4 py-3 text-center font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Qty</th>
                              <th className="px-4 py-3 text-right font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Unit Price</th>
                              <th className="px-4 py-3 text-right font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-[2px] divide-black/10">
                            {selectedQuotation.items?.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-nb-bg transition-colors">
                                <td className="px-4 py-3 font-display font-bold text-sm text-black">{item.itemName}</td>
                                <td className="px-4 py-3 text-center font-mono font-bold text-sm text-black">{item.quantity} {item.unit}</td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-sm text-gray-600">LKR {Number(item.unitPrice || 0).toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-mono font-black text-sm text-black">LKR {Number(item.subtotal || 0).toLocaleString()}</td>
                              </tr>
                            ))}
                            <tr className="bg-nb-bg/50 border-t-[3px] border-black">
                              <td colSpan={3} className="px-4 py-4 text-right font-display font-black text-xs uppercase tracking-widest text-black">Grand Total</td>
                              <td className="px-4 py-4 text-right font-display font-black text-lg text-black">
                                LKR {Number(selectedQuotation.total || selectedQuotation.totalAmount || 0).toLocaleString()}
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {(selectedQuotation.adminNotes || selectedQuotation.notes) && (
                    <div className={`p-4 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex gap-4 ${
                      selectedQuotation.status?.toLowerCase() === 'rejected' ? 'bg-red-100' : 'bg-nb-green/20'
                    }`}>
                      <AlertCircle size={24} className={selectedQuotation.status?.toLowerCase() === 'rejected' ? 'text-red-500' : 'text-green-600'} />
                      <div>
                        <p className="font-display font-black text-[10px] uppercase tracking-widest mb-1 text-black">Admin Feedback</p>
                        <p className="font-body font-bold text-sm text-black">
                          {selectedQuotation.adminNotes || selectedQuotation.notes}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="py-20 text-center">
                  <p className="font-display font-black text-sm text-gray-500 uppercase tracking-widest">No details found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
