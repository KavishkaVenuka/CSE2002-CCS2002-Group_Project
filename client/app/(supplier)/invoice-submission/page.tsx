"use client"

import { useState, useRef, useEffect } from "react"
import { 
  FileText, Send, Info, AlertTriangle, 
  CheckCircle2, RefreshCw, Calendar, 
  ClipboardCheck, CreditCard, Upload, X, File,
  ChevronDown, ArrowRight
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import { getInvoiceableOrders, getMyInvoices, getOrderDetails, createInvoice } from "@/lib/api"

export default function InvoiceSubmissionPage() {
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState("")
  const [selectedOrderDetail, setSelectedOrderDetail] = useState<any>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)
  const [dueDate, setDueDate] = useState("")
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)
  const [submittedBillId, setSubmittedBillId] = useState("")
  const [submittedInvoices, setSubmittedInvoices] = useState<any[]>([])
  const [isLoadingInvoices, setIsLoadingInvoices] = useState(false)

  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
    }
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation()
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true)
      const res = await getInvoiceableOrders()
      setOrders(res.orders || [])
    } catch (err: any) {
      console.error("Failed to load orders:", err)
      toast.error(err.message || "Failed to load available orders")
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const fetchInvoices = async () => {
    try {
      setIsLoadingInvoices(true)
      const res = await getMyInvoices()
      setSubmittedInvoices(res.invoices || [])
    } catch (err) {
      console.error("Failed to load submitted invoices:", err)
    } finally {
      setIsLoadingInvoices(false)
    }
  }

  useEffect(() => {
    fetchOrders()
    fetchInvoices()
  }, [])

  useEffect(() => {
    if (!selectedOrder) {
      setSelectedOrderDetail(null)
      return
    }
    const fetchDetail = async () => {
      try {
        setIsLoadingDetail(true)
        const found = orders.find(o => o.po_id === selectedOrder)
        if (!found) return
        const res = await getOrderDetails(found.id || found._id)
        setSelectedOrderDetail(res.order || (res as any))
      } catch (err) {
        console.error("Failed to load order detail:", err)
      } finally {
        setIsLoadingDetail(false)
      }
    }
    fetchDetail()
  }, [selectedOrder, orders])

  const computedItems = selectedOrderDetail?.items?.map((item: any) => ({
    productID: item.productID,
    name: item.name,
    qty: item.receivedQuantity || item.quantity || 0,
    price: item.price || 0,
    total: (item.receivedQuantity || item.quantity || 0) * (item.price || 0),
  })) || []

  const subtotal = computedItems.reduce((s: number, i: any) => s + i.total, 0)
  const tax = subtotal * 0.1
  const grandTotal = subtotal + tax

  const handleSubmit = async () => {
    if (!selectedOrder || !dueDate) {
      toast.error("Please select an order and set a due date")
      return
    }

    try {
      setIsSubmitting(true)
      const payload = {
        purchaseOrderRef: selectedOrder,
        items: computedItems.map((i: any) => ({
          productID: i.productID,
          name: i.name,
          quantity: i.qty,
          unitPrice: i.price,
          totalPrice: i.total,
        })),
        subtotal,
        tax,
        grandTotal,
        dueDate,
        notes,
      }

      // If the backend supported file uploads for invoices we could add it here
      const res: any = await createInvoice(payload)
      setSubmittedBillId(res.invoice?.bill_id || res.bill_id || "N/A")
      setShowSuccessModal(true)
      fetchInvoices()
      fetchOrders()
    } catch (err: any) {
      console.error("Submit error:", err)
      toast.error(err.message || "Failed to submit invoice")
    } finally {
      setIsSubmitting(false)
    }
  }

  const resetForm = () => {
    setSelectedOrder("")
    setSelectedOrderDetail(null)
    setDueDate("")
    setNotes("")
    setSelectedFile(null)
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      <Header title="Invoice Submission" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ── LEFT COLUMN (2/3) ────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Context */}
              <Panel title="Order Information" icon={<ClipboardCheck size={18} className="text-nb-green" />}>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">Select Purchase Order *</label>
                      <div className="relative">
                        <select 
                          value={selectedOrder}
                          onChange={(e) => setSelectedOrder(e.target.value)}
                          disabled={isLoadingOrders}
                          className="w-full appearance-none px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <option value="">{isLoadingOrders ? "Loading..." : "Select an order"}</option>
                          {orders.map(o => (
                            <option key={o.id || o._id} value={o.po_id}>
                              {o.label || o.po_id}
                            </option>
                          ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">Payment Due Date *</label>
                      <div className="relative">
                        <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                        <input 
                          type="date" 
                          value={dueDate}
                          onChange={e => setDueDate(e.target.value)}
                          className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-mono text-sm outline-none focus:bg-white transition-colors appearance-none"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Warning Alert if no order selected */}
                  {!selectedOrder && (
                    <div className="p-4 bg-nb-yellow/20 border-[2px] border-black border-dashed flex gap-4 items-start">
                      <AlertTriangle size={20} className="text-nb-yellow shrink-0 mt-0.5" strokeWidth={3} />
                      <p className="font-body text-xs font-bold leading-relaxed">
                        Please select a Purchase Order to begin invoicing. Only dispatched or delivered orders will appear here.
                      </p>
                    </div>
                  )}

                  {/* Order Details Preview */}
                  {selectedOrder && selectedOrderDetail && (
                    <div className="p-4 bg-green-50 border-[2px] border-black shadow-[4px_4px_0px_0px_#000] flex flex-col md:flex-row items-start md:items-center gap-4">
                      <div className="w-12 h-12 bg-white border-[2px] border-black flex items-center justify-center shadow-nb-sm">
                        <FileText className="w-6 h-6 text-black" />
                      </div>
                      <div className="flex-1">
                        <p className="font-display font-black text-[10px] uppercase text-gray-500 tracking-widest">Verified Order Ref</p>
                        <p className="font-display font-black text-lg text-black">{selectedOrderDetail.po_id}</p>
                      </div>
                      <div className="text-left md:text-right">
                        <p className="font-display font-black text-[10px] uppercase text-gray-500 tracking-widest">Customer</p>
                        <p className="font-body text-sm font-bold text-black">{selectedOrderDetail.name || 'Hardware Admin'}</p>
                      </div>
                    </div>
                  )}
                </div>
              </Panel>

              {/* Itemized List */}
              {selectedOrder && (
                <Panel title="Billable Line Items" icon={<FileText size={18} className="text-nb-cyan" />}>
                  <div className="overflow-x-auto">
                    {isLoadingDetail ? (
                      <div className="p-16 flex flex-col items-center justify-center text-center animate-pulse">
                        <p className="font-display font-black text-sm uppercase tracking-widest text-gray-400">Extracting order data...</p>
                      </div>
                    ) : computedItems.length === 0 ? (
                      <div className="p-16 flex flex-col items-center justify-center text-center">
                        <p className="font-body text-sm text-gray-400 italic">No confirmed items found.</p>
                      </div>
                    ) : (
                      <>
                        <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-8 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[600px]">
                          <div>Item Description</div>
                          <div className="text-center">Qty Received</div>
                          <div className="text-right">Unit Price</div>
                          <div className="text-right">Subtotal</div>
                        </div>
                        <div className="min-w-[600px]">
                          {computedItems.map((item: any, idx: number) => (
                            <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-8 py-4 border-b-[2px] border-black/5 items-center hover:bg-gray-50 transition-colors">
                              <div className="font-bold text-sm text-black">{item.name}</div>
                              <div className="text-center font-display font-black text-gray-400">{item.qty}</div>
                              <div className="text-right text-gray-600 text-xs font-mono font-bold">LKR {item.price.toLocaleString()}</div>
                              <div className="text-right font-black text-black font-mono">LKR {item.total.toLocaleString()}</div>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </Panel>
              )}

              {/* PDF Upload Section */}
              <Panel title="Upload Invoice PDF (Optional)" icon={<Upload size={18} className="text-nb-orange" />}>
                <div className="p-8 space-y-6">
                  <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                  />

                  <div 
                    onClick={triggerFileInput}
                    className={`
                      border-[3px] border-dashed border-black p-12 flex flex-col items-center justify-center gap-4 
                      transition-all cursor-pointer nb-interactive
                      ${selectedFile ? 'bg-nb-green/10 border-nb-green' : 'bg-gray-50 hover:bg-nb-yellow/10'}
                    `}
                  >
                    {selectedFile ? (
                      <>
                        <div className="w-16 h-16 bg-nb-green border-[2px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000]">
                          <CheckCircle2 size={32} strokeWidth={2.5} className="text-black" />
                        </div>
                        <div className="text-center">
                          <p className="font-display font-black text-lg text-black mb-1">
                            File Selected!
                          </p>
                          <p className="font-mono text-sm font-bold bg-white px-3 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center gap-2 max-w-xs truncate mx-auto">
                            <File size={14} className="shrink-0" /> <span className="truncate">{selectedFile.name}</span>
                            <button 
                              onClick={clearFile}
                              className="ml-2 hover:text-red-500 transition-colors shrink-0"
                            >
                              <X size={14} strokeWidth={3} />
                            </button>
                          </p>
                        </div>
                      </>
                    ) : (
                      <>
                        <Upload size={40} strokeWidth={2} className="text-black" />
                        <div className="text-center">
                          <p className="font-display font-black text-base text-black mb-1">
                            Click to upload your invoice PDF
                          </p>
                          <p className="font-body text-sm text-gray-400">
                            Maximum file size: 10MB
                          </p>
                        </div>
                        <button className="mt-2 px-8 py-3 bg-white border-[3px] border-black font-display font-black text-xs uppercase tracking-widest shadow-nb-sm active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all">
                          Browse Files
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </Panel>

              {/* Administrative Notes */}
              <Panel title="Administrative Notes" icon={<FileText size={18} className="text-nb-cyan" />}>
                <div className="p-8">
                  <textarea 
                    rows={4}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Payment instructions, bank details, or delivery remarks..." 
                    className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors resize-none"
                  />
                </div>
              </Panel>
            </div>

            {/* ── RIGHT COLUMN (1/3) ────────────────────────── */}
            <div className="space-y-8 relative">
              <div className="sticky top-8 space-y-8">
                {/* Totals Sidebar */}
                <Panel title="Invoice Totals" dark icon={<FileText size={18} className="text-white" />} noTopPad>
                  <div className="p-8 space-y-6">
                    <div className="space-y-4">
                      <div className="flex justify-between items-center text-white/40 font-body text-sm font-bold">
                        <span>Subtotal</span>
                        <span className="font-mono font-black text-white">LKR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex justify-between items-center text-white/40 font-body text-sm font-bold">
                        <span>Estimated Tax (10%)</span>
                        <span className="font-mono font-black text-white">LKR {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t-[2px] border-white/10">
                      <p className="font-display font-black text-[10px] text-nb-green uppercase tracking-widest mb-2">Grand Total</p>
                      <h3 className="font-display font-black text-3xl xl:text-4xl text-white">LKR {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</h3>
                    </div>

                    <button 
                      onClick={handleSubmit}
                      disabled={!selectedOrder || !dueDate || computedItems.length === 0 || isSubmitting}
                      className="w-full py-4 bg-nb-green text-black font-display font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 border-[3px] border-black shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? "Submitting..." : "Finalize & Submit"}
                      {!isSubmitting && <Send size={18} strokeWidth={3} />}
                    </button>

                    <button 
                      onClick={resetForm}
                      className="w-full text-center font-display font-black text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors"
                    >
                      Reset Form
                    </button>
                  </div>
                </Panel>

                {/* Info Alert */}
                <div className="p-5 bg-white border-[3px] border-black shadow-nb flex gap-4">
                  <div className="bg-nb-cyan border-[2px] border-black p-2 h-fit shrink-0">
                    <Info size={18} className="text-black" strokeWidth={3} />
                  </div>
                  <p className="font-body text-[10px] font-bold leading-tight">
                    Invoices can only be created for orders that have been successfully dispatched or delivered. Ensure the customer has acknowledged the items before billing.
                  </p>
                </div>
              </div>
            </div>

          </div>

          {/* ── RECENT SUBMISSIONS ─────────────────────────────────── */}
          <Panel 
            title="Recent Invoice Submissions" 
            icon={<CreditCard size={18} className="text-nb-yellow" />}
            badge={<RefreshCw onClick={fetchInvoices} size={16} strokeWidth={3} className={`text-black cursor-pointer hover:rotate-180 transition-transform duration-500 ${isLoadingInvoices ? 'animate-spin' : ''}`} />}
          >
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[140px_1fr_140px_180px_140px] gap-4 px-8 py-4 border-b-[2px] border-black bg-gray-50 text-gray-400 font-display font-black text-[10px] uppercase tracking-widest min-w-[800px]">
                <div>Bill ID</div>
                <div>PO Ref</div>
                <div>Date</div>
                <div className="text-right">Amount</div>
                <div className="text-center">Status</div>
              </div>
              
              {isLoadingInvoices ? (
                <div className="p-16 flex flex-col items-center justify-center text-center animate-pulse">
                  <p className="font-display font-black text-sm uppercase tracking-widest text-gray-400">Loading invoices...</p>
                </div>
              ) : submittedInvoices.length === 0 ? (
                <div className="p-16 flex flex-col items-center justify-center text-center">
                  <p className="font-body text-sm text-gray-400 italic">No previous submissions found.</p>
                </div>
              ) : (
                <div className="min-w-[800px]">
                  {submittedInvoices.slice(0, 5).map((inv: any) => (
                    <div key={inv._id || inv.id} className="grid grid-cols-[140px_1fr_140px_180px_140px] gap-4 px-8 py-4 border-b-[2px] border-black/5 items-center hover:bg-gray-50 transition-colors">
                      <div className="font-mono text-xs font-bold text-black">{inv.bill_id || inv.id?.slice(-6).toUpperCase()}</div>
                      <div className="font-bold text-sm text-gray-600">{inv.purchaseOrderRef || inv.orderRef}</div>
                      <div className="font-body text-xs text-gray-500">{new Date(inv.date).toLocaleDateString()}</div>
                      <div className="text-right font-mono font-black text-black">LKR {(inv.total || inv.amount || 0).toLocaleString()}</div>
                      <div className="text-center">
                        <span className={`px-3 py-1 border-[2px] font-display font-black text-[10px] uppercase shadow-nb-sm ${
                          inv.payment_status === 'paid' || inv.status === 'paid' 
                            ? 'bg-nb-green text-black border-black' 
                            : 'bg-nb-yellow text-black border-black'
                        }`}>
                          {inv.payment_status || inv.status || 'Pending'}
                        </span>
                      </div>
                    </div>
                  ))}
                  {submittedInvoices.length > 5 && (
                    <div className="p-4 bg-gray-50 text-center">
                      <button 
                        onClick={() => router.push('/payments')} 
                        className="font-display font-black text-[10px] text-black uppercase tracking-widest flex items-center justify-center gap-2 mx-auto hover:text-nb-green transition-colors"
                      >
                        View All Submissions <ArrowRight size={14} strokeWidth={3} />
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Panel>

        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-nb-green border-b-[3px] border-black flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-[3px] border-black shadow-nb flex items-center justify-center rounded-full mb-4">
                <CheckCircle2 size={32} strokeWidth={3} className="text-black" />
              </div>
              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-black">Invoice Created!</h2>
              <p className="font-body text-sm text-black/80 mt-2 font-bold">
                Your billing request has been processed and sent for administrative verification.
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="p-4 bg-gray-50 border-[2px] border-black shadow-nb-sm space-y-3">
                <div className="flex justify-between items-center border-b-[2px] border-black/5 pb-2">
                  <span className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Invoice ID</span>
                  <span className="font-mono font-black text-sm text-black">{submittedBillId}</span>
                </div>
                <div className="flex justify-between items-center border-b-[2px] border-black/5 pb-2">
                  <span className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Total Bill</span>
                  <span className="font-mono font-black text-sm text-black">LKR {grandTotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Status</span>
                  <span className="px-2 py-1 bg-nb-yellow border-[2px] border-black font-display font-black text-[10px] uppercase shadow-nb-sm">
                    Awaiting Review
                  </span>
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    resetForm()
                  }}
                  className="flex-1 py-3 bg-white text-black font-display font-black text-xs uppercase tracking-widest border-[3px] border-black shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-gray-100"
                >
                  Submit New
                </button>
                <button
                  onClick={() => {
                    setShowSuccessModal(false)
                    router.push('/payments')
                  }}
                  className="flex-1 py-3 bg-black text-white font-display font-black text-xs uppercase tracking-widest border-[3px] border-black shadow-nb hover:bg-gray-800 transition-colors flex items-center justify-center gap-2"
                >
                  View History <ArrowRight size={14} strokeWidth={3} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

