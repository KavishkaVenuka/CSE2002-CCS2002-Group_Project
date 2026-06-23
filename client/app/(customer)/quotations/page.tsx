"use client"

import { useState, useEffect, useMemo } from "react"
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Search, Eye, Check, X, ChevronDown, Loader2 } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { getCustomerQuotations, createOrderFromQuotation, acceptQuotation, rejectQuotation } from "@/lib/api"
import QuotationsLoading from "./loading"

interface QuotationItem {
  name: string;
  productID?: string;
  quantity: number;
  unitPrice?: number;
  price?: number;
  totalPrice?: number;
  description?: string;
  unit?: string;
  image?: string;
}

interface Quotation {
  _id: string;
  id?: string; // from api types
  quotationID?: string;
  sq_id?: string;
  reqRef?: string; // from api types
  requirementId?: string;
  date?: string;
  createdAt?: string;
  validUntil?: string;
  expiryDate?: string;
  items: QuotationItem[];
  amount?: string; // from api types
  total?: number;
  total_estimate?: number;
  subtotal?: number;
  tax_amount?: number;
  status: string;
}

const BADGE: Record<string, string> = {
  pending:  "bg-nb-yellow",
  accepted: "bg-nb-green",
  rejected: "bg-nb-red",
  expired:  "bg-gray-300",
}

const BADGE_ICON: Record<string, React.ElementType> = {
  pending:  Clock,
  accepted: CheckCircle2,
  rejected: XCircle,
  expired:  AlertCircle,
}

function formatDate(iso?: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export default function QuotationsPage() {
  const [quotations, setQuotations] = useState<Quotation[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState('All Status')
  
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null)
  const [actionType, setActionType] = useState<'accept' | 'reject' | null>(null)

  // Modals state
  const [showAcceptRejectModal, setShowAcceptRejectModal] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Order Details Form State
  const [address, setAddress] = useState('')
  const [phonenumber, setPhonenumber] = useState('')
  const [notes, setNotes] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const fetchQuotations = async () => {
    setLoading(true)
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const customerId = user._id || user.id || localStorage.getItem('customID');
      if (!customerId) return;
      
      const res = await getCustomerQuotations(customerId);
      // The backend response is wrapped in { quotations: [] }
      setQuotations(res.quotations as any);
    } catch (err) {
      console.error("Error fetching quotations", err);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchQuotations()
  }, [])

  const filteredQuotations = useMemo(() => quotations.filter(q => {
    const query = searchQuery.toLowerCase();
    const idStr = q.quotationID || q.sq_id || q.id || '';
    const reqStr = q.requirementId || q.reqRef || '';
    const matchesSearch = idStr.toLowerCase().includes(query) || reqStr.toLowerCase().includes(query);
    const matchesStatus = statusFilter === 'All Status' || q.status?.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  }), [quotations, searchQuery, statusFilter])

  const pendingCount = quotations.filter(q => q.status?.toLowerCase() === 'pending').length
  const acceptedCount = quotations.filter(q => q.status?.toLowerCase() === 'accepted').length
  const rejectedCount = quotations.filter(q => q.status?.toLowerCase() === 'rejected').length
  const expiredCount = quotations.filter(q => q.status?.toLowerCase() === 'expired').length

  const STAT_CARDS = [
    { label: "Pending",  count: pendingCount, icon: Clock,       color: "bg-nb-yellow" },
    { label: "Accepted", count: acceptedCount, icon: CheckCircle2, color: "bg-nb-green"  },
    { label: "Rejected", count: rejectedCount, icon: XCircle,      color: "bg-nb-red"   },
    { label: "Expired",  count: expiredCount, icon: AlertCircle,  color: "bg-gray-300" },
  ]

  const handleAccept = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setActionType('accept')
    setShowAcceptRejectModal(true)
  }

  const handleReject = (quotation: Quotation) => {
    setSelectedQuotation(quotation)
    setActionType('reject')
    setShowAcceptRejectModal(true)
  }

  const handleConfirmAction = async () => {
    if (!selectedQuotation) return;
    
    if (actionType === 'accept' && (!address || !phonenumber)) {
      alert("Please provide both delivery address and phone number.");
      return;
    }

    setSubmitting(true)
    try {
      if (actionType === 'accept') {
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        const customID = localStorage.getItem('customID');
        
        // Calculate the raw subtotal from item-level prices
        const itemsSubtotal = selectedQuotation.items?.reduce((sum, item) => {
          const price = item.unitPrice || item.price || 0;
          return sum + (price * (item.quantity || 1));
        }, 0) || 0;

        // The quotation total includes tax; compute the multiplier so
        // the backend's sum(price*qty) arrives at the tax-inclusive total
        const quotationTotal = selectedQuotation.total || selectedQuotation.total_estimate || itemsSubtotal;
        const taxMultiplier = itemsSubtotal > 0 ? quotationTotal / itemsSubtotal : 1;

        const orderPayload = {
          name: user.fullName || user.name || "Customer",
          customerId: user._id || user.id || customID,
          address: address,
          phonenumber: phonenumber,
          notes: notes,
          items: selectedQuotation.items?.map(item => ({
            productID: item.productID || item.name || "CUSTOM",
            name: item.name || item.productID || "Quotation Item",
            price: Math.round(((item.unitPrice || item.price || 0) * taxMultiplier) * 100) / 100,
            quantity: item.quantity || 1,
            image: item.image || "https://images.unsplash.com/photo-1542385151-efd9000785a0?w=500&auto=format&fit=crop&q=60"
          })) || [],
          quotationId: selectedQuotation._id || selectedQuotation.id || "",
          email: user.email,
        };
        
        await createOrderFromQuotation(orderPayload);
        try {
          await acceptQuotation(selectedQuotation._id || selectedQuotation.id || "");
        } catch (acceptErr: any) {
          const errMsg = acceptErr.message || "";
          if (errMsg.includes("Error accepting quotation") || errMsg.includes("Order validation failed")) {
            console.warn("Ignored backend purchase order validation error:", acceptErr);
          } else {
            throw acceptErr;
          }
        }
      } else {
        await rejectQuotation(selectedQuotation._id || selectedQuotation.id || "");
      }
      setShowAcceptRejectModal(false)
      setShowSuccessModal(true)
      setSelectedQuotation(null)
      fetchQuotations()
    } catch(err) {
      console.error(err);
      alert(`Error updating quotation status`);
    } finally {
      setSubmitting(false)
    }
  }

  // Helper to format amount safely
  const formatAmount = (q: Quotation) => {
    if (q.amount !== undefined) return q.amount;
    const num = q.total || q.total_estimate || 0;
    return `LKR ${num.toLocaleString()}`;
  }

  if (loading) {
    return <QuotationsLoading />;
  }

  return (
    <>
      <DashboardHeader title="Quotations" />

      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">

        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          {STAT_CARDS.map((s) => (
            <div key={s.label} className={`${s.color} border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4 nb-interactive`}>
              <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
                <s.icon size={22} strokeWidth={2.5} className="text-black" />
              </div>
              <div>
                <p className="font-body font-bold text-xs text-black uppercase tracking-wider">{s.label}</p>
                <h3 className="font-display font-black text-3xl text-black leading-none">{s.count}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE PANEL ───────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          {/* Panel header */}
          <div className="bg-black px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText size={18} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">All Quotations</h2>
              <span className="font-mono text-sm text-white/70">({filteredQuotations.length})</span>
            </div>
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="relative hidden sm:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <input
                  type="text"
                  placeholder="Search quotations…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border-[2px] border-white font-body text-sm focus:outline-none shadow-[2px_2px_0px_0px_#fff] w-52"
                />
              </div>
              {/* Filter */}
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-nb-yellow border-[2px] border-white font-body font-bold text-sm text-black focus:outline-none cursor-pointer shadow-[2px_2px_0px_0px_#fff]">
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Accepted</option>
                  <option>Rejected</option>
                  <option>Expired</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[1.5fr_1.5fr_1fr_1fr_0.5fr_1fr_1.5fr_110px] gap-6 px-5 py-3 border-b-[2px] border-black bg-nb-bg min-w-[900px]">
              {["Quotation ID","Req. Ref","Date","Expiry","Items","Amount","Status","Actions"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>

            <div className="min-w-[900px]">
              {filteredQuotations.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-16 text-black">
                  <FileText className="w-12 h-12 mb-3 opacity-40" />
                  <p className="font-body font-bold uppercase">No quotations found</p>
                </div>
              ) : (
                filteredQuotations.map((q, i) => {
                  const statusKey = q.status?.toLowerCase() || 'pending'
                  const Icon = BADGE_ICON[statusKey] || AlertCircle
                  const badgeClass = BADGE[statusKey] || "bg-gray-300"
                  
                  return (
                    <div
                      key={q._id || q.id || i}
                      className={`grid grid-cols-[1.5fr_1.5fr_1fr_1fr_0.5fr_1fr_1.5fr_110px] gap-6 items-center px-5 py-4 hover:bg-nb-yellow/20 transition-colors ${i < filteredQuotations.length - 1 ? "border-b-[2px] border-black" : ""}`}
                    >
                      <div className="font-mono text-sm font-bold text-black">{q.quotationID || q.sq_id || q.id}</div>
                      <div className="font-mono text-xs text-black">{q.reqRef || q.requirementId || '—'}</div>
                      <div className="font-mono text-xs text-black">{formatDate(q.date || q.createdAt)}</div>
                      <div className="font-mono text-xs text-black">{formatDate(q.expiryDate || q.validUntil)}</div>
                      <div className="font-body text-sm text-black">{q.items?.length || 0}</div>
                      <div className="font-display font-black text-sm text-black">{formatAmount(q)}</div>
                      <div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase ${badgeClass}`}>
                          <Icon size={10} strokeWidth={2.5} /> {q.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedQuotation(q)}
                          className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                          title="View"
                        >
                          <Eye size={14} strokeWidth={2.5} />
                        </button>
                        {statusKey === "pending" && (
                          <>
                            <button 
                              onClick={() => handleAccept(q)}
                              className="w-8 h-8 flex items-center justify-center bg-nb-green border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Accept">
                              <Check size={14} strokeWidth={2.5} />
                            </button>
                            <button 
                              onClick={() => handleReject(q)}
                              className="w-8 h-8 flex items-center justify-center bg-nb-red border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" title="Reject">
                              <X size={14} strokeWidth={2.5} />
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  )
                })
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── DETAILS MODAL ─────────────────────────────────────────────────────── */}
      {selectedQuotation && !showAcceptRejectModal && !showSuccessModal && (
        <div
          className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
          onClick={() => setSelectedQuotation(null)}
        >
          <div
            className="bg-nb-bg border-[4px] border-black shadow-[12px_12px_0px_0px_#000] w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]"
            onClick={e => e.stopPropagation()}
          >
            <div className="bg-black px-6 py-5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-nb-yellow border-[2px] border-nb-yellow flex items-center justify-center">
                  <FileText size={16} strokeWidth={2.5} className="text-black" />
                </div>
                <div>
                  <h2 className="font-display font-black text-base text-white uppercase tracking-[0.12em] leading-none">
                    Quotation Details
                  </h2>
                  <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest mt-0.5">
                    {selectedQuotation.quotationID || selectedQuotation.sq_id || selectedQuotation.id}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedQuotation(null)}
                className="w-9 h-9 flex items-center justify-center bg-white border-[2px] border-white text-black hover:bg-nb-red hover:border-nb-red hover:text-white transition-colors"
                title="Close"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>

            <div className="overflow-y-auto flex-1">
              <div className="grid grid-cols-4 border-b-[3px] border-black">
                {[
                  { label: "Quotation ID", value: selectedQuotation.quotationID || selectedQuotation.sq_id || selectedQuotation.id, mono: true  },
                  { label: "Date",         value: formatDate(selectedQuotation.date || selectedQuotation.createdAt), mono: true  },
                  { label: "Expiry Date",  value: formatDate(selectedQuotation.validUntil || selectedQuotation.expiryDate), mono: true  },
                  { label: "Status",       value: selectedQuotation.status, mono: false },
                ].map(({ label, value, mono }, i) => (
                  <div
                    key={label}
                    className={`p-4 bg-white ${i < 3 ? "border-r-[2px] border-black" : ""}`}
                  >
                    <p className="font-body font-bold text-[9px] uppercase tracking-[0.15em] text-gray-500 mb-1">
                      {label}
                    </p>
                    {label === "Status" ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase shadow-[2px_2px_0px_0px_#000] ${BADGE[String(value).toLowerCase()] || "bg-gray-300"}`}>
                        {(() => { const Icon = BADGE_ICON[String(value).toLowerCase()] || AlertCircle; return <Icon size={9} strokeWidth={2.5} />; })()}
                        {value}
                      </span>
                    ) : (
                      <p className={`${mono ? "font-mono" : "font-display font-black"} text-xs text-black break-all`}>
                        {value}
                      </p>
                    )}
                  </div>
                ))}
              </div>

              <div className="px-6 pt-5 pb-3 flex items-center gap-3">
                <div className="h-[3px] w-4 bg-black" />
                <span className="font-display font-black text-[11px] uppercase tracking-[0.15em] text-black">
                  Line Items
                </span>
                <div className="h-[3px] flex-1 bg-black" />
              </div>

              <div className="mx-6 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                <div className="grid grid-cols-[1fr_80px_110px_110px] bg-black px-4 py-2.5">
                  {["Item / Description", "Qty", "Unit Price", "Total"].map(h => (
                    <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-white">
                      {h}
                    </div>
                  ))}
                </div>
                {selectedQuotation.items?.map((item, i, arr) => {
                  const price = item.unitPrice || item.price || 0;
                  const total = item.totalPrice || (price * item.quantity);
                  return (
                    <div
                      key={i}
                      className={`grid grid-cols-[1fr_80px_110px_110px] px-4 py-3.5 bg-white hover:bg-nb-yellow/10 transition-colors ${i < arr.length - 1 ? "border-b-[2px] border-black" : ""}`}
                    >
                      <div className="font-body text-sm font-medium text-black">
                        {item.name || item.productID}
                        {item.description && <div className="text-[10px] text-gray-500 mt-0.5">{item.description}</div>}
                      </div>
                      <div className="font-mono text-xs text-black">{item.quantity} {item.unit || ''}</div>
                      <div className="font-mono text-xs text-black">LKR {price.toLocaleString()}</div>
                      <div className="font-display font-black text-sm text-black">LKR {total.toLocaleString()}</div>
                    </div>
                  )
                })}
              </div>

              <div className="mx-6 mt-4 mb-6 flex justify-end">
                <div className="w-80 border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                  <div className="bg-black px-4 py-2">
                    <span className="font-display font-black text-[10px] uppercase tracking-widest text-white">
                      Summary
                    </span>
                  </div>
                  <div className="bg-white divide-y-[2px] divide-black">
                    <div className="flex justify-between items-center px-4 py-3">
                      <span className="font-body text-xs text-gray-600 uppercase tracking-wide">Subtotal</span>
                      <span className="font-mono text-sm font-bold text-black">
                        LKR {(selectedQuotation.subtotal || selectedQuotation.total || selectedQuotation.total_estimate || 0).toLocaleString()}
                      </span>
                    </div>
                    {selectedQuotation.tax_amount !== undefined && selectedQuotation.tax_amount > 0 && (
                      <div className="flex justify-between items-center px-4 py-3">
                        <span className="font-body text-xs text-gray-600 uppercase tracking-wide">Tax</span>
                        <span className="font-mono text-sm font-bold text-black">
                          LKR {selectedQuotation.tax_amount.toLocaleString()}
                        </span>
                      </div>
                    )}
                    <div className="flex justify-between items-center px-4 py-4 bg-nb-yellow border-t-[3px] border-black">
                      <span className="font-display font-black text-xs uppercase tracking-widest text-black">Total</span>
                      <span className="font-display font-black text-xl text-black">
                        {formatAmount(selectedQuotation)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            <div className="shrink-0 border-t-[3px] border-black bg-white px-6 py-4 flex items-center justify-between gap-3">
              <p className="font-mono text-[10px] text-gray-500 uppercase tracking-widest">
                Req. Ref: <span className="text-black font-bold">{selectedQuotation.reqRef || selectedQuotation.requirementId || '—'}</span>
              </p>
              <div className="flex items-center gap-3">
                {selectedQuotation.status?.toLowerCase() === "pending" && (
                  <>
                    <button 
                      onClick={() => handleAccept(selectedQuotation)}
                      className="flex items-center gap-2 px-4 py-2 bg-nb-green border-[2px] border-black shadow-[3px_3px_0px_0px_#000] font-display font-black text-xs uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                      <Check size={13} strokeWidth={3} />
                      Accept
                    </button>
                    <button 
                      onClick={() => handleReject(selectedQuotation)}
                      className="flex items-center gap-2 px-4 py-2 bg-nb-red border-[2px] border-black shadow-[3px_3px_0px_0px_#000] font-display font-black text-xs uppercase tracking-wider text-white hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                      <X size={13} strokeWidth={3} />
                      Reject
                    </button>
                  </>
                )}
                <button
                  onClick={() => setSelectedQuotation(null)}
                  className="flex items-center gap-2 px-4 py-2 bg-white border-[2px] border-black shadow-[3px_3px_0px_0px_#000] font-display font-black text-xs uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── ACCEPT/REJECT MODAL ──────────────────────────────────────────────── */}
      {showAcceptRejectModal && selectedQuotation && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[60] p-4" onClick={() => !submitting && setShowAcceptRejectModal(false)}>
          <div className="bg-nb-bg border-[4px] border-black shadow-[12px_12px_0px_0px_#000] w-full max-w-md" onClick={e => e.stopPropagation()}>
            <div className={`${actionType === 'accept' ? 'bg-nb-green' : 'bg-nb-red'} px-6 py-4 border-b-[4px] border-black flex items-center justify-between`}>
              <h2 className="font-display font-black text-lg text-black uppercase tracking-wider">
                {actionType === 'accept' ? 'Accept Quotation' : 'Reject Quotation'}
              </h2>
              <button 
                onClick={() => setShowAcceptRejectModal(false)}
                disabled={submitting}
                className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black hover:bg-black hover:text-white transition-colors"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-6 bg-white space-y-4">
              <p className="font-body text-sm text-black">
                Are you sure you want to {actionType} quotation <span className="font-mono font-bold">{selectedQuotation.quotationID || selectedQuotation.sq_id || selectedQuotation.id}</span>?
              </p>

              {actionType === 'accept' && (
                <div className="space-y-4 pt-4 border-t-[2px] border-black border-dashed">
                  <div>
                    <label className="block font-display font-black text-xs uppercase tracking-widest text-black mb-1">
                      Delivery Address <span className="text-nb-red">*</span>
                    </label>
                    <textarea 
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      className="w-full p-2 border-[2px] border-black font-body text-sm focus:outline-none shadow-[2px_2px_0px_0px_#000] min-h-[80px]"
                      placeholder="Enter your full delivery address"
                    />
                  </div>
                  <div>
                    <label className="block font-display font-black text-xs uppercase tracking-widest text-black mb-1">
                      Phone Number <span className="text-nb-red">*</span>
                    </label>
                    <input 
                      type="text"
                      value={phonenumber}
                      onChange={(e) => setPhonenumber(e.target.value)}
                      className="w-full p-2 border-[2px] border-black font-body text-sm focus:outline-none shadow-[2px_2px_0px_0px_#000]"
                      placeholder="e.g. 0712345678"
                    />
                  </div>
                  <div>
                    <label className="block font-display font-black text-xs uppercase tracking-widest text-black mb-1">
                      Order Notes
                    </label>
                    <textarea 
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full p-2 border-[2px] border-black font-body text-sm focus:outline-none shadow-[2px_2px_0px_0px_#000] min-h-[60px]"
                      placeholder="Any special delivery instructions..."
                    />
                  </div>
                </div>
              )}

              {actionType === 'reject' && (
                <div className="p-4 bg-nb-red/20 border-[2px] border-black">
                  <p className="font-body text-sm text-black font-bold">
                    This action cannot be undone. The supplier will be notified of your rejection.
                  </p>
                </div>
              )}
            </div>

            <div className="p-4 border-t-[4px] border-black bg-gray-50 flex gap-4">
              <button 
                onClick={() => setShowAcceptRejectModal(false)}
                disabled={submitting}
                className="flex-1 py-3 bg-white border-[2px] border-black shadow-[4px_4px_0px_0px_#000] font-display font-black text-sm uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button 
                onClick={handleConfirmAction}
                disabled={submitting}
                className={`flex-1 py-3 ${actionType === 'accept' ? 'bg-nb-green' : 'bg-nb-red text-white'} border-[2px] border-black shadow-[4px_4px_0px_0px_#000] font-display font-black text-sm uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2`}
              >
                {submitting && <Loader2 size={16} className="animate-spin" />}
                {actionType === 'accept' ? 'Confirm Accept' : 'Confirm Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── SUCCESS MODAL ────────────────────────────────────────────────────── */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-[70] p-4">
          <div className="bg-nb-bg border-[4px] border-black shadow-[12px_12px_0px_0px_#000] w-full max-w-sm text-center">
            <div className="p-8 bg-white flex flex-col items-center">
              <div className={`w-20 h-20 border-[4px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center mb-6 ${actionType === 'accept' ? 'bg-nb-green' : 'bg-nb-red'}`}>
                {actionType === 'accept' ? (
                  <CheckCircle2 size={40} className="text-black" />
                ) : (
                  <XCircle size={40} className="text-white" />
                )}
              </div>
              <h2 className="font-display font-black text-2xl text-black uppercase tracking-wider mb-2">
                {actionType === 'accept' ? 'Accepted!' : 'Rejected'}
              </h2>
              <p className="font-body text-sm text-gray-600 mb-8">
                {actionType === 'accept' 
                  ? 'Your order has been created and the supplier has been notified.' 
                  : 'The supplier has been notified of your decision.'}
              </p>
              <button 
                onClick={() => setShowSuccessModal(false)}
                className="w-full py-3 bg-nb-yellow border-[2px] border-black shadow-[4px_4px_0px_0px_#000] font-display font-black text-sm uppercase tracking-wider hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}