"use client"

import { useState, useEffect, useMemo } from "react"
import { useRouter } from "next/navigation"
import {
  FileText, Search, Filter, ChevronDown,
  ArrowRight, Clock, CheckCircle2,
  RotateCcw, Package, Send, Eye, Download, Loader2, XCircle
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import { getMyRequirements, getRequirementsStats, getRequirementDetails, updateRequirementStatus } from "@/lib/api"
import { toast } from "sonner"

const BADGE_MAP: Record<string, string> = {
  "pending": "bg-nb-cyan",
  "new": "bg-nb-cyan",
  "sent": "bg-nb-cyan",
  "quoted": "bg-nb-yellow",
  "accepted": "bg-nb-yellow",
  "in-progress": "bg-[#c084fc]",
  "delivered": "bg-nb-green",
  "completed": "bg-nb-green",
  "rejected": "bg-red-400 text-white",
}

export default function CustomerRequirementsPage() {
  const router = useRouter()
  const [requirements, setRequirements] = useState<any[]>([])
  const [stats, setStats] = useState<Record<string, number>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const [selectedRequirement, setSelectedRequirement] = useState<any>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const [reqRes, statsRes] = await Promise.all([
        getMyRequirements(),
        getRequirementsStats()
      ])

      const mappedRequirements = (reqRes.requirements || []).map((req: any) => ({
        id: req.id || req._id,
        requirementId: req.requirementId || req.id,
        customer: req.customerName || req.customer || "Unknown Customer",
        itemsDetail: req.itemSummary || req.itemsDetail || "No details",
        qty: req.qty || `${Array.isArray(req.items) ? req.items.length : (req.items || 0)} items`,
        delivery: req.delivery || (req.createdAt ? new Date(req.createdAt).toLocaleDateString() : "N/A"),
        docs: req.attachedDocument ? 1 : (req.docs || 0),
        status: (req.status || "new").toLowerCase(),
      })).filter((req: any) => req.status !== "pending")

      setRequirements(mappedRequirements)
      setStats(statsRes.stats || {})
    } catch (err: any) {
      console.error("Failed to load requirements:", err)
      toast.error(err.message || "Failed to load customer requirements")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleViewDetails = async (id: string) => {
    try {
      setIsLoadingDetail(true)
      const res = await getRequirementDetails(id)
      setSelectedRequirement(res.requirement || requirements.find(r => r.id === id))
    } catch (err: any) {
      console.error(err)
      toast.error("Failed to load details")
      setSelectedRequirement(requirements.find(r => r.id === id))
    } finally {
      setIsLoadingDetail(false)
    }
  }

  const STAT_CARDS = [
    { title: "New Requests", count: stats.new || stats.pending || 0, icon: FileText, color: "bg-nb-cyan" },
    { title: "In Progress", count: stats.in_progress || stats.quoted || 0, icon: Clock, color: "bg-nb-yellow" },
    { title: "Completed", count: stats.completed || stats.delivered || 0, icon: CheckCircle2, color: "bg-nb-green" },
    { title: "Rejected", count: stats.rejected || 0, icon: XCircle, color: "bg-red-400" },
  ]

  const filteredRequirements = useMemo(() => {
    return requirements.filter((req) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch =
        (req.requirementId || "").toLowerCase().includes(q) ||
        (req.customer || "").toLowerCase().includes(q) ||
        (req.itemsDetail || "").toLowerCase().includes(q)

      const matchesStatus =
        statusFilter === "All Status" ||
        req.status === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [searchQuery, statusFilter, requirements])

  return (
    <>
      <Header title="Customer Requirements" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb] relative">
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
                <p className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">{stat.title}</p>
                <h3 className="font-display font-black text-3xl text-black leading-none">{isLoading ? "-" : stat.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel
          title="Open Procurement Requirements"
          icon={<FileText size={20} className="text-nb-cyan" />}
          noTopPad
          badge={filteredRequirements.length}
        >
          <div className="flex flex-col">
            {/* Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 p-4 border-b-[3px] border-black bg-white">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                  <input
                    type="text"
                    placeholder="Search requirements..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-[#fdfcfb] border-[2px] border-black shadow-nb-sm font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none"
                  />
                </div>
                <div className="relative w-full sm:w-48">
                  <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value)}
                    className="w-full appearance-none pl-9 pr-10 py-2 bg-nb-bg border-[2px] border-black shadow-nb-sm font-body font-bold text-sm text-black outline-none transition-all duration-100 focus:translate-x-[1px] focus:translate-y-[1px] focus:shadow-none cursor-pointer"
                  >
                    <option value="All Status">All Status</option>
                    <option value="quoted">Quoted</option>
                    <option value="sent">Sent</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={fetchData}
                  disabled={isLoading}
                  className="p-2.5 bg-white border-[2px] border-black shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all disabled:opacity-50"
                  title="Refresh"
                >
                  <RotateCcw size={18} strokeWidth={2.5} className={isLoading ? "animate-spin" : ""} />
                </button>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_120px_100px_100px] gap-4 px-6 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[1100px]">
                <div>Requirement ID</div>
                <div>Customer</div>
                <div>Qty</div>
                <div>Delivery</div>
                <div>Docs</div>
                <div>Status</div>
                <div className="text-right">Actions</div>
              </div>

              <div className="flex flex-col min-w-[1100px]">
                {isLoading ? (
                  <div className="py-24 text-center bg-white flex flex-col items-center justify-center">
                    <Loader2 size={32} className="text-black animate-spin mb-4" />
                    <p className="font-body font-bold text-sm text-gray-500">Loading requirements...</p>
                  </div>
                ) : filteredRequirements.length > 0 ? (
                  filteredRequirements.map((req, i) => (
                    <div
                      key={req.id}
                      className={`
                        grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_120px_100px_100px] gap-4 items-center px-6 py-5
                        ${i < filteredRequirements.length - 1 ? "border-b-[2px] border-black" : ""}
                        bg-white hover:bg-nb-bg transition-colors duration-100
                      `}
                    >
                      <div className="font-mono text-sm font-black text-black">{req.requirementId}</div>
                      <div className="font-body font-bold text-sm text-black">
                        {req.customer}
                        <div className="font-body text-[10px] text-gray-400 font-normal truncate max-w-[200px]" title={req.itemsDetail}>
                          {req.itemsDetail}
                        </div>
                      </div>
                      <div className="font-mono text-xs font-bold text-black">{req.qty}</div>
                      <div className="font-mono text-xs font-bold text-black">{req.delivery}</div>

                      <div>
                        <button className="flex items-center gap-2 px-2 py-1 bg-gray-100 border-[2px] border-black text-black font-mono font-bold text-[10px] hover:bg-white transition-all">
                          <Download size={12} strokeWidth={3} />
                          {req.docs}
                        </button>
                      </div>

                      <div>
                        <span className={`px-3 py-1 border-[2px] border-black text-black font-mono font-black text-[10px] uppercase shadow-nb-sm ${BADGE_MAP[req.status] || "bg-gray-200"}`}>
                          {req.status}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-3 col-span-2">
                        <button
                          className="w-9 h-9 flex items-center justify-center bg-white border-[2px] border-black hover:bg-nb-cyan transition-colors shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                          title="View Details"
                          onClick={() => handleViewDetails(req.id)}
                        >
                          {isLoadingDetail && selectedRequirement?.id === req.id ? (
                            <Loader2 size={18} className="animate-spin" />
                          ) : (
                            <Eye size={18} strokeWidth={2.5} />
                          )}
                        </button>
                        {(req.status === "new" || req.status === "pending" || req.status === "sent") && (
                          <button
                            className="w-9 h-9 flex items-center justify-center bg-nb-green border-[2px] border-black hover:bg-green-400 transition-colors shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                            title="Create Quotation"
                            onClick={() => {
                              try {
                                sessionStorage.setItem('quotationReqData', JSON.stringify(req));
                                router.push(`/create-quotation?reqId=${req.id}`)
                              } catch (err: any) {
                                console.error(err)
                              }
                            }}
                          >
                            <ArrowRight size={18} strokeWidth={2.5} />
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="py-24 text-center bg-white">
                    <div className="flex flex-col items-center justify-center">
                      <div className="w-16 h-16 bg-nb-bg border-[3px] border-black shadow-nb flex items-center justify-center mb-4">
                        <Package size={32} className="text-gray-400" />
                      </div>
                      <p className="font-body font-bold text-sm text-gray-400 italic">No requirements found.</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Panel>

        {/* ── MODAL ───────────────────────────────────────────────── */}
        {selectedRequirement && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#fdfcfb] border-[3px] border-black shadow-nb w-full max-w-2xl max-h-[90vh] overflow-auto flex flex-col relative animate-in fade-in zoom-in duration-200">
              <div className="flex items-center justify-between p-4 border-b-[3px] border-black bg-white sticky top-0 z-10">
                <div className="flex items-center gap-3">
                  <FileText size={24} className="text-nb-cyan" />
                  <h2 className="font-display font-black text-xl text-black uppercase tracking-wide">Requirement Details</h2>
                </div>
                <button
                  onClick={() => setSelectedRequirement(null)}
                  className="p-1 hover:bg-red-100 border-[2px] border-transparent hover:border-black transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-6 space-y-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 border-[2px] border-black shadow-nb-sm">
                    <p className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest mb-1">Requirement ID</p>
                    <p className="font-mono text-sm font-bold text-black">{selectedRequirement.requirementId || selectedRequirement.id}</p>
                  </div>
                  <div className="bg-white p-4 border-[2px] border-black shadow-nb-sm">
                    <p className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest mb-1">Customer</p>
                    <p className="font-body font-bold text-sm text-black">{selectedRequirement.customer || selectedRequirement.customerName}</p>
                    <p className="font-body text-[10px] text-gray-500">{selectedRequirement.companyName || "N/A"}</p>
                  </div>
                </div>

                <div className="bg-white p-4 border-[2px] border-black shadow-nb-sm">
                  <h3 className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <Package size={14} /> Requested Items
                  </h3>
                  <div className="space-y-3">
                    {(selectedRequirement.items && Array.isArray(selectedRequirement.items)) ? selectedRequirement.items.map((item: any, idx: number) => (
                      <div key={idx} className="flex justify-between items-center pb-2 border-b-2 border-dashed border-gray-200 last:border-0 last:pb-0">
                        <div>
                          <p className="font-body font-bold text-sm text-black">{item.itemName || item.name}</p>
                          <p className="font-body text-xs text-gray-500 italic">{item.notes}</p>
                        </div>
                        <div className="text-right">
                          <p className="font-mono text-sm font-black text-black">{item.quantity} {item.unit}</p>
                        </div>
                      </div>
                    )) : (
                      <p className="font-body text-sm text-black">{selectedRequirement.itemsDetail || selectedRequirement.itemSummary}</p>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 border-t-[3px] border-black bg-white flex justify-end gap-3 mt-auto sticky bottom-0 z-10">
                <button
                  onClick={() => setSelectedRequirement(null)}
                  className="px-6 py-2 bg-gray-100 border-[2px] border-black font-body font-bold text-sm hover:bg-gray-200 transition-colors shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                >
                  Close
                </button>
                {(!selectedRequirement.status || ["new", "pending", "sent"].includes(selectedRequirement.status.toLowerCase())) && (
                  <button
                    onClick={() => {
                      try {
                        const targetId = selectedRequirement.id || selectedRequirement._id;
                        sessionStorage.setItem('quotationReqData', JSON.stringify(selectedRequirement));
                        router.push(`/create-quotation?reqId=${targetId}`)
                      } catch (err: any) {
                        console.error(err)
                      }
                    }}
                    className="px-6 py-2 bg-nb-green border-[2px] border-black font-body font-bold text-sm flex items-center gap-2 hover:bg-green-400 transition-colors shadow-nb-sm hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none"
                  >
                    <Send size={16} /> Prepare Quotation
                  </button>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}

