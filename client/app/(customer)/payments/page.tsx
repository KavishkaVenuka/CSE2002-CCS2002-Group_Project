"use client"

import { useState, useEffect } from "react"
import { DollarSign, CreditCard, Clock, Upload, X, Save, Send, ChevronDown, Loader2, CheckCircle } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { getCustomerInvoices, submitPayment } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Invoice {
  _id: string;
  invoiceID: string;
  orderID: string;
  total: number;
  date: string;
  due_date?: string;
  status: string;
}

export default function PaymentsPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("")
  const [paymentMethod, setPaymentMethod] = useState("bank")
  const [transactionId, setTransactionId] = useState("")
  const [notes, setNotes] = useState("")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const userDataString = localStorage.getItem('user')
        const userData = userDataString ? JSON.parse(userDataString) : {}
        const email = userData.email || localStorage.getItem('userEmail')
        
        if (!email) {
          toast.error("User email not found. Please log in again.")
          setIsLoading(false)
          return
        }

        const res: any = await getCustomerInvoices(email)
        const allInvoices = res?.invoices || res || []
        const unpaid = allInvoices.filter((i: Invoice) => i.status.toLowerCase() === 'unpaid')
        setInvoices(unpaid)

        const queryParams = new URLSearchParams(window.location.search)
        const urlInvoiceId = queryParams.get('invoiceId')
        if (urlInvoiceId && unpaid.some((i: Invoice) => i.invoiceID === urlInvoiceId)) {
          setSelectedInvoiceId(urlInvoiceId)
        }
      } catch (err) {
        console.error("Error fetching invoices:", err)
        toast.error("Failed to load pending invoices")
      } finally {
        setIsLoading(false)
      }
    }

    fetchInvoices()
  }, [])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setUploadedFile(e.target.files[0])
    }
  }

  const handleSubmit = async () => {
    if (!selectedInvoiceId || !transactionId || !uploadedFile) {
      toast.error("Please fill all required fields and upload proof")
      return
    }

    try {
      setIsSubmitting(true)
      await submitPayment(selectedInvoiceId, {
        paymentMethod,
        transactionID: transactionId,
        notes,
        paymentProof: uploadedFile
      })
      setShowSuccessModal(true)
    } catch (err: any) {
      console.error("Payment submission error:", err)
      toast.error(err.message || "Failed to submit payment details")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReset = () => {
    setSelectedInvoiceId("")
    setPaymentMethod("bank")
    setTransactionId("")
    setNotes("")
    setUploadedFile(null)
  }

  const selectedInvoice = invoices.find(i => i.invoiceID === selectedInvoiceId)

  return (
    <>
      <DashboardHeader title="Payments" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg relative">

        {isLoading && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 gap-3">
             <Loader2 className="w-10 h-10 animate-spin text-black" />
             <p className="font-body font-bold text-sm uppercase tracking-wider text-black">Loading pending invoices...</p>
          </div>
        )}

        {/* ── PENDING INVOICES ─────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center gap-3">
            <DollarSign size={18} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Pending Invoices</h2>
          </div>
          <div className="p-5 space-y-4">
            {invoices.length === 0 && !isLoading ? (
              <p className="text-center font-mono text-sm text-gray-500 py-4">No pending invoices found.</p>
            ) : (
              invoices.map(inv => (
                <div
                  key={inv._id}
                  onClick={() => setSelectedInvoiceId(inv.invoiceID)}
                  className={`border-[2px] border-black p-5 flex justify-between items-center cursor-pointer transition-all duration-100 ${selectedInvoiceId === inv.invoiceID ? "bg-nb-yellow shadow-[3px_3px_0px_0px_#000] translate-x-[1px] translate-y-[1px]" : "bg-white hover:bg-nb-yellow/30"}`}
                >
                  <div>
                    <p className="font-display font-black text-sm text-black">{inv.invoiceID}</p>
                    <p className="font-mono text-xs text-gray-600 mt-1">Order: {inv.orderID}</p>
                    <p className="font-mono text-xs text-gray-600">Due: {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : 'N/A'}</p>
                  </div>
                  <div className="text-right space-y-2">
                    <p className="font-display font-black text-xl text-black">LKR {inv.total.toLocaleString()}</p>
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-nb-yellow border-[2px] border-black font-mono font-bold text-[10px] uppercase">
                      <Clock size={10} strokeWidth={2.5} /> Pending
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </section>

        {/* ── SUBMIT PAYMENT ───────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center gap-3">
            <CreditCard size={18} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Submit Payment</h2>
          </div>
          <div className="p-6 space-y-6">

            {/* Invoice selector */}
            <div className="space-y-2">
              <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                Select Invoice <span className="text-nb-red">*</span>
              </label>
              <div className="relative">
                <select
                  value={selectedInvoiceId}
                  onChange={e => setSelectedInvoiceId(e.target.value)}
                  className="w-full appearance-none px-4 py-3 bg-nb-yellow border-[2px] border-black font-body font-bold text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all cursor-pointer"
                >
                  <option value="">Choose invoice to pay…</option>
                  {invoices.map(inv => (
                    <option key={inv._id} value={inv.invoiceID}>{inv.invoiceID} — LKR {inv.total.toLocaleString()}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={16} strokeWidth={2.5} />
              </div>
            </div>

            {selectedInvoice && (
              <>
                {/* Summary info */}
                <div className="grid grid-cols-2 border-[2px] border-black overflow-hidden">
                  <div className="p-4 border-r-[2px] border-black bg-nb-cyan/20">
                    <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">Invoice ID</p>
                    <p className="font-display font-black text-base text-black">{selectedInvoice.invoiceID}</p>
                  </div>
                  <div className="p-4 bg-nb-green/20">
                    <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">Amount to Pay</p>
                    <p className="font-display font-black text-xl text-black">LKR {selectedInvoice.total.toLocaleString()}</p>
                  </div>
                </div>

                {/* Payment method */}
                <div className="space-y-2">
                  <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                    Payment Method <span className="text-nb-red">*</span>
                  </label>
                  <div className="relative">
                    <select 
                      value={paymentMethod}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-full appearance-none px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all cursor-pointer"
                    >
                      <option value="bank">Bank Transfer</option>
                      <option value="card">Credit Card</option>
                      <option value="check">Check</option>
                      <option value="cash">Cash in Hand</option>
                      <option value="other">Other</option>
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={16} strokeWidth={2.5} />
                  </div>
                </div>

                {/* Transaction ID */}
                <div className="space-y-2">
                  <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                    {paymentMethod === 'cash' ? 'Reference (Optional)' : 'Transaction ID'} <span className="text-nb-red">*</span>
                  </label>
                  <input
                    type="text"
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value)}
                    placeholder={paymentMethod === 'cash' ? "e.g. Handed to [Name]" : "Enter transaction reference number"}
                    className="w-full px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Notes */}
                <div className="space-y-2">
                  <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">Notes (Optional)</label>
                  <textarea
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Add any additional notes…"
                    rows={3}
                    className="w-full px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black resize-vertical shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all placeholder:text-gray-400"
                  />
                </div>

                {/* Upload proof */}
                <div className="space-y-2">
                  <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                    Upload Payment Proof <span className="text-nb-red">*</span>
                  </label>
                  <div className={`border-[2px] border-dashed border-black py-10 flex flex-col items-center gap-4 transition-all cursor-pointer ${uploadedFile ? 'bg-nb-green/20 border-solid' : 'bg-nb-bg hover:bg-nb-cyan/20 hover:border-nb-cyan'}`}>
                    <input
                      type="file"
                      id="file-upload"
                      className="hidden"
                      onChange={handleFileUpload}
                      accept="image/*,.pdf"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center gap-4 w-full">
                      {uploadedFile ? (
                        <>
                          <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                            <CheckCircle size={20} strokeWidth={2.5} className="text-black" />
                          </div>
                          <div className="text-center">
                            <p className="font-display font-black text-sm text-black">{uploadedFile.name}</p>
                            <p className="font-body text-xs text-gray-500 mt-1">File attached successfully.</p>
                          </div>
                          <div className="px-4 py-2 bg-white border-[2px] border-black font-body font-bold text-xs uppercase text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                            Change File
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
                            <Upload size={20} strokeWidth={2.5} className="text-black" />
                          </div>
                          <div className="text-center">
                            <p className="font-display font-black text-sm text-black">Click to upload or drag and drop</p>
                            <p className="font-body text-xs text-gray-500 mt-1">PDF, PNG, JPG (Max 5MB)</p>
                          </div>
                          <div className="px-4 py-2 bg-white border-[2px] border-black font-body font-bold text-xs uppercase text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all">
                            Choose File
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                {/* Footer actions */}
                <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t-[3px] border-black">
                  <button
                    onClick={handleReset}
                    disabled={isSubmitting}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white text-black font-body font-bold text-sm border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all disabled:opacity-50"
                  >
                    <X size={16} strokeWidth={2.5} /> Reset
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={isSubmitting || !transactionId || !uploadedFile}
                    className="flex items-center justify-center gap-2 px-6 py-2.5 bg-black text-white font-display font-black text-sm uppercase tracking-widest border-[2px] border-black shadow-[4px_4px_0px_0px_#4ade80] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all disabled:opacity-50 disabled:shadow-[4px_4px_0px_0px_#64748b]"
                  >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} strokeWidth={2.5} />} 
                    Submit Payment
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6" onClick={() => setShowSuccessModal(false)}>
          <div className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_#000] w-full max-w-sm overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="bg-nb-green px-6 py-6 flex flex-col items-center justify-center border-b-[4px] border-black">
              <div className="w-16 h-16 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] rounded-full flex items-center justify-center mb-4">
                <CheckCircle size={32} strokeWidth={3} className="text-black" />
              </div>
              <h2 className="font-display font-black text-2xl text-black uppercase tracking-wider text-center">Success!</h2>
            </div>
            <div className="p-6 text-center space-y-6">
              <p className="font-body text-sm text-black">
                Your payment proof has been submitted successfully. Our team will verify it and update your invoice status shortly.
              </p>
              <button 
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/customer/invoices')
                }}
                className="w-full px-4 py-3 bg-black text-white font-display font-black text-sm uppercase tracking-widest border-[2px] border-black shadow-[4px_4px_0px_0px_#4ade80] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Back to Invoices
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}