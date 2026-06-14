"use client"

import { useState, useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import {
  Send, Plus, Trash2, ChevronLeft, Calendar,
  Clock, FileText, CreditCard, Save, Info,
  PlusCircle, CheckCircle, AlertCircle
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import Link from "next/link"
import { getMyRequirements, getRequirementDetails, createSupplierQuotation } from "@/lib/api"
import { toast } from "sonner"

export default function CreateQuotationPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const reqIdParam = searchParams.get("reqId")

  const [items, setItems] = useState<any[]>([
    { id: Date.now(), itemName: "", quantity: 1, unit: "Units", unitPrice: "", totalPrice: 0 },
  ])

  const [availableRequirements, setAvailableRequirements] = useState<any[]>([])
  const [selectedRequirementId, setSelectedRequirementId] = useState(reqIdParam || "")
  const [requirementRef, setRequirementRef] = useState("")

  const [deliveryTimeline, setDeliveryTimeline] = useState("")
  const [paymentTerms, setPaymentTerms] = useState("Net 30 Days")
  const [validUntil, setValidUntil] = useState("")
  const [notes, setNotes] = useState("")

  const [isLoadingReqs, setIsLoadingReqs] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  // Fetch requirement details if reqIdParam is provided
  useEffect(() => {
    if (reqIdParam) {
      const fetchReq = async () => {
        try {
          const res = await getRequirementDetails(reqIdParam)
          if (res.requirement) {
            setRequirementRef(res.requirement.requirementId || res.requirement.id)
            if (res.requirement.items && Array.isArray(res.requirement.items)) {
              setItems(res.requirement.items.map((it: any, idx: number) => ({
                id: Date.now() + idx,
                itemName: it.itemName || it.name || "",
                quantity: it.quantity || 1,
                unit: it.unit || "Units",
                unitPrice: "",
                totalPrice: 0
              })))
            }
          }
        } catch (err) {
          console.error("Failed to load requirement details", err)
        }
      }
      fetchReq()
    } else {
      // Fetch pending requirements to select from
      const fetchReqs = async () => {
        try {
          setIsLoadingReqs(true)
          const res = await getMyRequirements({ status: "pending" })
          setAvailableRequirements(res.requirements || [])
        } catch (err) {
          console.error(err)
        } finally {
          setIsLoadingReqs(false)
        }
      }
      fetchReqs()
    }
  }, [reqIdParam])

  const handleSelectRequirement = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const id = e.target.value
    setSelectedRequirementId(id)
    if (!id) {
      setRequirementRef("")
      return
    }

    const selected = availableRequirements.find(r => (r.id || r._id) === id)
    if (selected) {
      setRequirementRef(selected.requirementId || id)
      try {
        const res = await getRequirementDetails(id)
        if (res.requirement && Array.isArray(res.requirement.items)) {
          setItems(res.requirement.items.map((it: any, idx: number) => ({
            id: Date.now() + idx,
            itemName: it.itemName || it.name || "",
            quantity: it.quantity || 1,
            unit: it.unit || "Units",
            unitPrice: "",
            totalPrice: 0
          })))
        }
      } catch (err) {
        console.error(err)
      }
    }
  }

  const subtotal = items.reduce((sum, item) => sum + (Number(item.totalPrice) || 0), 0)
  const tax = subtotal * 0.10
  const grandTotal = subtotal + tax

  const addItem = () => {
    setItems([...items, { id: Date.now(), itemName: "", quantity: 1, unit: "Units", unitPrice: "", totalPrice: 0 }])
  }

  const removeItem = (id: number) => {
    if (items.length > 1) {
      setItems(items.filter(item => item.id !== id))
    }
  }

  const updateItem = (id: number, field: string, value: any) => {
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        const newItem = { ...item, [field]: value }
        if (field === 'unitPrice' || field === 'quantity') {
          const price = parseFloat(field === 'unitPrice' ? value : newItem.unitPrice) || 0
          const qty = parseFloat(field === 'quantity' ? value : newItem.quantity) || 0
          newItem.totalPrice = price * qty
        }
        return newItem
      }
      return item
    }))
  }

  const handleSubmit = async (status: "pending" | "draft" = "pending") => {
    try {
      setIsSubmitting(true)
      const payload: any = {
        requirementId: selectedRequirementId || null,
        items: items.map(i => ({
          itemName: i.itemName,
          quantity: Number(i.quantity),
          unit: i.unit,
          unitPrice: Number(i.unitPrice),
          totalPrice: Number(i.totalPrice)
        })),
        subtotal,
        tax,
        grandTotal,
        deliveryTimeline,
        paymentTerms,
        validUntil,
        notes,
        status // Send status if backend supports it
      }

      await createSupplierQuotation(payload)

      if (status === "pending") {
        setShowSuccessModal(true)
      } else {
        toast.success("Draft saved successfully")
        router.push("/supplier/quotation-status")
      }
    } catch (err: any) {
      console.error(err)
      toast.error(err.message || "Failed to submit quotation")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <>
      <Header title="Create Quotation" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        <div className="max-w-4xl mx-auto relative">
          <Panel
            title="Quotation Details"
            icon={<PlusCircle size={20} className="text-nb-cyan" />}
            badge="NEW"
          >

            {/* Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
              <Link
                href="/customer-requirements"
                className="flex items-center gap-2 px-4 py-2 bg-white border-[3px] border-black shadow-nb font-body font-bold text-sm text-black hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px] w-fit"
              >
                <ChevronLeft size={16} strokeWidth={3} />
                Back to Requirements
              </Link>
              <div className="hidden sm:block h-8 w-[2px] bg-black/20"></div>

              {reqIdParam ? (
                <p className="font-body text-sm font-bold text-gray-500 italic">Quoting for {requirementRef || reqIdParam}</p>
              ) : (
                <div className="flex-1 max-w-sm relative">
                  <select
                    value={selectedRequirementId}
                    onChange={handleSelectRequirement}
                    disabled={isLoadingReqs}
                    className="w-full px-4 py-2 bg-white border-[2px] border-black font-body font-bold text-sm outline-none shadow-[2px_2px_0px_0px_#000] appearance-none cursor-pointer disabled:opacity-50"
                  >
                    <option value="">Select a Pending Requirement</option>
                    {availableRequirements.map(r => (
                      <option key={r.id || r._id} value={r.id || r._id}>{r.requirementId || r.id} - {r.customer || r.customerName}</option>
                    ))}
                  </select>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

              {/* ── LEFT COLUMN ───────────────────────────────────────────── */}
              <div className="lg:col-span-2 space-y-8">

                {/* Line Items Panel */}
                <Panel
                  title="Line Items"
                  badge={
                    <button
                      onClick={addItem}
                      className="flex items-center gap-1 bg-nb-green border-[2px] border-black px-3 py-1 font-display font-black text-[10px] uppercase tracking-wider shadow-[2px_2px_0px_0px_#000] hover:shadow-none hover:translate-x-[1px] hover:translate-y-[1px] transition-all"
                    >
                      <Plus size={12} strokeWidth={3} />
                      Add Item
                    </button>
                  }
                >
                  <div className="p-0">
                    <div className="grid grid-cols-[2fr_100px_150px_1fr_40px] gap-4 px-6 py-3 bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[600px] overflow-x-auto">
                      <div>Item Name</div>
                      <div className="text-center">Qty</div>
                      <div>Unit Price</div>
                      <div className="text-right">Total</div>
                      <div></div>
                    </div>

                    <div className="divide-y-[3px] divide-black min-w-[600px] overflow-x-auto">
                      {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-[2fr_100px_150px_1fr_40px] gap-4 p-6 items-start bg-white">
                          <div className="space-y-1">
                            <input
                              type="text"
                              value={item.itemName}
                              onChange={(e) => updateItem(item.id, 'itemName', e.target.value)}
                              placeholder="Enter item name..."
                              className="w-full font-body font-bold text-sm outline-none bg-transparent placeholder:text-gray-400 placeholder:italic"
                            />
                          </div>

                          <div className="flex flex-col items-center gap-1">
                            <input
                              type="number"
                              value={item.quantity}
                              onChange={(e) => updateItem(item.id, 'quantity', e.target.value)}
                              className="w-full text-center font-mono font-black text-sm bg-gray-100 border-[2px] border-black p-1 outline-none"
                            />
                            <input
                              type="text"
                              value={item.unit}
                              onChange={(e) => updateItem(item.id, 'unit', e.target.value)}
                              className="w-full text-center font-display font-black text-[8px] uppercase text-gray-400 outline-none bg-transparent mt-1"
                              placeholder="Units"
                            />
                          </div>

                          <div className="relative">
                            <span className="absolute left-3 top-1/2 -translate-y-1/2 font-display font-black text-[10px] text-gray-400">LKR</span>
                            <input
                              type="number"
                              value={item.unitPrice}
                              onChange={(e) => updateItem(item.id, 'unitPrice', e.target.value)}
                              placeholder="0.00"
                              className="w-full pl-12 pr-3 py-2 bg-gray-100 border-[2px] border-black font-mono font-bold text-sm outline-none"
                            />
                          </div>

                          <div className="pt-2 text-right">
                            <span className="font-display font-black text-sm">LKR {item.totalPrice.toFixed(2)}</span>
                          </div>

                          <button
                            onClick={() => removeItem(item.id)}
                            className="pt-2 text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <Trash2 size={18} strokeWidth={2.5} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </Panel>

                {/* Notes & Terms Panel */}
                <Panel title="Notes & Terms">
                  <div className="p-6 space-y-4">
                    <div className="space-y-2">
                      <label className="font-display font-black text-[10px] uppercase tracking-widest text-gray-400">General Notes / Terms & Conditions</label>
                      <textarea
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Specify warranty, quality standards, or any specific conditions..."
                        className="w-full h-40 p-4 bg-white border-[3px] border-black font-body text-sm shadow-[2px_2px_0px_0px_#000] focus:shadow-none transition-all outline-none resize-none placeholder:italic"
                      />
                    </div>
                  </div>
                </Panel>
              </div>

              {/* ── RIGHT COLUMN ──────────────────────────────────────────── */}
              <div className="space-y-8">

                {/* Timeline & Terms */}
                <Panel title="Timeline & Terms">
                  <div className="p-6 space-y-6">
                    <div className="space-y-2">
                      <label className="font-display font-black text-[10px] uppercase tracking-tighter flex items-center gap-2 text-black">
                        <Calendar size={12} strokeWidth={3} /> Valid Until *
                      </label>
                      <input
                        type="date"
                        value={validUntil}
                        onChange={(e) => setValidUntil(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-100 border-[2px] border-black font-body text-sm outline-none shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-display font-black text-[10px] uppercase tracking-tighter flex items-center gap-2 text-black">
                        <Clock size={12} strokeWidth={3} /> Expected Delivery *
                      </label>
                      <input
                        type="date"
                        value={deliveryTimeline}
                        onChange={(e) => setDeliveryTimeline(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-100 border-[2px] border-black font-body text-sm outline-none shadow-[2px_2px_0px_0px_#000]"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="font-display font-black text-[10px] uppercase tracking-tighter flex items-center gap-2 text-black">
                        <CreditCard size={12} strokeWidth={3} /> Payment Terms *
                      </label>
                      <select
                        value={paymentTerms}
                        onChange={(e) => setPaymentTerms(e.target.value)}
                        className="w-full px-4 py-2 bg-gray-100 border-[2px] border-black font-body text-sm outline-none shadow-[2px_2px_0px_0px_#000] appearance-none cursor-pointer"
                      >
                        <option value="Net 30 Days">Net 30 Days</option>
                        <option value="Net 15 Days">Net 15 Days</option>
                        <option value="Advance Payment">Advance Payment</option>
                        <option value="Cash on Delivery">Cash on Delivery</option>
                      </select>
                    </div>
                  </div>
                </Panel>

                {/* Financial Summary */}
                <div className="bg-black text-white border-[3px] border-black p-6 shadow-nb space-y-6">
                  <div className="flex items-center gap-2 pb-4 border-b border-white/20">
                    <FileText size={18} className="text-nb-green" />
                    <h3 className="font-display font-black text-sm uppercase tracking-widest">Financial Summary</h3>
                  </div>

                  <div className="space-y-4 font-mono">
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>Subtotal</span>
                      <span className="text-white">LKR {subtotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="flex justify-between items-center text-xs text-gray-400">
                      <span>VAT / Tax (10%)</span>
                      <span className="text-white">LKR {tax.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                    </div>
                    <div className="pt-4 border-t-[2px] border-white/20 flex justify-between items-end">
                      <div className="space-y-1">
                        <p className="font-display font-black text-[10px] uppercase tracking-tighter text-nb-green">Grand Total</p>
                        <p className="font-display font-black text-2xl tracking-tighter">LKR {grandTotal.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                      </div>
                      <div className="px-2 py-1 bg-nb-green text-black font-display font-black text-[10px] rounded-sm">LKR</div>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="space-y-4">
                  <button
                    onClick={() => handleSubmit("pending")}
                    disabled={isSubmitting || items.length === 0 || !validUntil || !deliveryTimeline}
                    className="group w-full py-4 bg-nb-green text-black border-[3px] border-black font-display font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px] disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Quotation"}
                    {!isSubmitting && <Send size={18} className="group-hover:translate-x-1 transition-transform" />}
                  </button>

                  <button
                    onClick={() => handleSubmit("draft")}
                    disabled={isSubmitting || items.length === 0}
                    className="w-full py-3 bg-white text-black border-[3px] border-black font-display font-black uppercase text-xs tracking-widest flex items-center justify-center gap-3 shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:translate-x-[3px] active:translate-y-[3px] disabled:opacity-50"
                  >
                    Save as Draft
                    <Save size={16} />
                  </button>
                </div>

                {/* Info Tip */}
                <div className="bg-nb-yellow p-4 border-[3px] border-black shadow-[2px_2px_0px_0px_#000] flex gap-3">
                  <Info size={24} className="shrink-0" strokeWidth={3} />
                  <p className="font-body text-[11px] font-bold leading-tight">
                    Submission will lock this quotation. You can edit it from the "Quotation Status" page until reviewed.
                  </p>
                </div>

              </div>
            </div>
          </Panel>

          {/* ── SUCCESS MODAL ───────────────────────────────────────────────── */}
          {showSuccessModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
              <div className="bg-[#fdfcfb] border-[3px] border-black shadow-[6px_6px_0px_0px_#000] w-full max-w-md flex flex-col relative animate-in fade-in zoom-in duration-200 p-8 text-center space-y-6">
                <div className="w-20 h-20 bg-nb-green border-[3px] border-black shadow-[4px_4px_0px_0px_#000] flex items-center justify-center mx-auto mb-2">
                  <CheckCircle size={40} className="text-black" />
                </div>

                <h2 className="font-display font-black text-2xl text-black uppercase tracking-wide">Submission Successful!</h2>

                <p className="font-body text-sm font-bold text-gray-600">
                  Your quotation has been sent to the customer and is now awaiting review.
                </p>

                <div className="bg-white border-[3px] border-black p-4 space-y-3 text-left">
                  <div className="flex justify-between text-sm font-body font-bold text-black border-b-[2px] border-black pb-2">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">Total Amount</span>
                    <span>LKR {grandTotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm font-body font-bold text-black border-b-[2px] border-black pb-2">
                    <span className="text-gray-500 uppercase tracking-widest text-[10px]">Status</span>
                    <span className="bg-nb-yellow px-2 py-0.5 border-[2px] border-black text-[10px] font-black uppercase">Awaiting Review</span>
                  </div>
                </div>

                <div className="p-4 bg-gray-100 border-[3px] border-black flex gap-3 text-left items-start">
                  <AlertCircle size={20} className="shrink-0 text-black mt-0.5" />
                  <p className="font-body text-[11px] font-bold leading-tight text-gray-600 italic">
                    You will be notified once the customer accepts or requests revisions.
                  </p>
                </div>

                <button
                  onClick={() => router.push('/supplier/quotation-status')}
                  className="w-full py-4 bg-black text-white border-[3px] border-black font-display font-black uppercase text-sm tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  Go to Quotations
                </button>
              </div>
            </div>
          )}

        </div>
      </main>
    </>
  )
}
