"use client"

<<<<<<< HEAD
import { useState } from "react"
import { 
  FileText, Send, Info, AlertTriangle, 
  CheckCircle2, RefreshCw, Calendar, 
  ClipboardCheck, CreditCard
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

export default function InvoiceSubmissionPage() {
  const [selectedOrder, setSelectedOrder] = useState("")
=======
import { useState, useRef } from "react"
import { 
  FileText, Upload, Calendar, ChevronDown, 
  Send, X, Search, File, CheckCircle2
} from "lucide-react"
import { Panel } from "@/components/common/Panel"
import { Header } from "@/components/supplier/Header"

export default function InvoiceSubmissionPage() {
  const [selectedOrder, setSelectedOrder] = useState("")
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
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f

  return (
    <>
      <Header title="Invoice Submission" />
<<<<<<< HEAD

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        <div className="max-w-7xl mx-auto space-y-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* ── LEFT COLUMN (2/3) ────────────────────────────────── */}
            <div className="lg:col-span-2 space-y-8">
              {/* Order Context */}
              <Panel title="Order Context" icon={<ClipboardCheck size={18} className="text-nb-green" />}>
                <div className="p-8 space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-2">
                      <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">Select Purchase Order *</label>
                      <select 
                        value={selectedOrder}
                        onChange={(e) => setSelectedOrder(e.target.value)}
                        className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors"
                      >
                        <option value="">Select an order</option>
                        <option value="PO-8842">PO-8842 (Modern Fabrics)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">Payment Due Date *</label>
                      <div className="relative">
                        <input 
                          type="date" 
                          className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-mono text-sm outline-none focus:bg-white transition-colors"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Warning Alert */}
                  <div className="p-4 bg-nb-yellow/20 border-[2px] border-black border-dashed flex gap-4 items-start">
                    <AlertTriangle size={20} className="text-nb-yellow shrink-0 mt-0.5" strokeWidth={3} />
                    <p className="font-body text-xs font-bold leading-relaxed">
                      No orders available for invoicing. Ensure orders are marked as <span className="underline italic">Delivered</span> or <span className="underline italic">Dispatched</span>.
                    </p>
                  </div>
                </div>
              </Panel>

              {/* Administrative Notes */}
              <Panel title="Administrative Notes" icon={<FileText size={18} className="text-nb-cyan" />}>
                <div className="p-8">
                  <textarea 
                    rows={6}
                    placeholder="Payment instructions, bank details, or delivery remarks..." 
                    className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors resize-none"
                  />
                </div>
              </Panel>
            </div>

            {/* ── RIGHT COLUMN (1/3) ────────────────────────── */}
            <div className="space-y-8">
              {/* Totals Sidebar (Refined Light) */}
              <Panel title="Invoice Totals" dark icon={<FileText size={18} className="text-black" />} noTopPad>
                <div className="p-8 space-y-6">
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-white/40 font-body text-sm font-bold">
                      <span>Subtotal</span>
                      <span className="font-mono font-black text-white">LKR 0.00</span>
                    </div>
                    <div className="flex justify-between items-center text-white/40 font-body text-sm font-bold">
                      <span>Estimated Tax (10%)</span>
                      <span className="font-mono font-black text-white">LKR 0.00</span>
                    </div>
                  </div>

                  <div className="pt-6 border-t-[2px] border-white/10">
                    <p className="font-display font-black text-[10px] text-nb-green uppercase tracking-widest mb-2">Grand Total</p>
                    <h3 className="font-display font-black text-4xl text-white">LKR 0.00</h3>
                  </div>

                  <button className="w-full py-4 bg-nb-green text-black font-display font-black uppercase text-sm tracking-widest flex items-center justify-center gap-3 border-[3px] border-black shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-green-400">
                    Finalize & Submit
                    <Send size={18} strokeWidth={3} />
                  </button>

                  <button className="w-full text-center font-display font-black text-[10px] text-white/30 uppercase tracking-widest hover:text-white transition-colors">
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

          {/* ── RECENT SUBMISSIONS ─────────────────────────────────── */}
          <Panel 
            title="Recent Invoice Submissions" 
            icon={<CreditCard size={18} className="text-nb-yellow" />}
            badge={<RefreshCw size={14} strokeWidth={3} className="text-black cursor-pointer hover:rotate-180 transition-transform duration-500" />}
          >
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[140px_1fr_140px_180px_140px] gap-4 px-8 py-4 border-b-[2px] border-black bg-gray-50 text-gray-400 font-display font-black text-[10px] uppercase tracking-widest min-w-[800px]">
                <div>Bill ID</div>
                <div>PO Ref</div>
                <div>Date</div>
                <div>Amount</div>
                <div>Status</div>
              </div>
              <div className="p-16 flex flex-col items-center justify-center text-center">
                <p className="font-body text-sm text-gray-400 italic">No previous submissions found.</p>
              </div>
            </div>
          </Panel>

        </div>
=======
      
      <main className="flex-1 overflow-auto p-6 space-y-8 bg-nb-bg">
        {/* ── INVOICE INFORMATION ────────────────────────────────────────────── */}
        <Panel title="Invoice Information" noTopPad>
          <div className="p-6 bg-white flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col gap-2">
                <label className="font-body font-bold text-sm text-black">Select Order *</label>
                <div className="relative">
                  <select 
                    value={selectedOrder}
                    onChange={(e) => setSelectedOrder(e.target.value)}
                    className="w-full appearance-none pl-4 pr-10 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm text-black outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none cursor-pointer"
                  >
                    <option value="" disabled>Choose order...</option>
                    <option value="ORD-20240115">ORD-20240115 - Acme Corp</option>
                    <option value="ORD-20240114">ORD-20240114 - XYZ Industries</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-body font-bold text-sm text-black">Invoice Number *</label>
                <input 
                  type="text" 
                  placeholder="INV-XXXX"
                  className="w-full px-4 py-2 bg-gray-100 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm text-gray-700 outline-none cursor-not-allowed"
                  readOnly
                  value="INV-2024-089"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-body font-bold text-sm text-black">Invoice Date *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm text-black outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none appearance-none"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <label className="font-body font-bold text-sm text-black">Due Date *</label>
                <div className="relative">
                  <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                  <input 
                    type="date" 
                    className="w-full px-4 py-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] font-body text-sm text-black outline-none transition-all duration-100 focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none appearance-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </Panel>

        {/* ── UPLOAD INVOICE PDF ────────────────────────────────────────────── */}
        <Panel title="Upload Invoice PDF" noTopPad>
          <div className="p-6 bg-white flex flex-col gap-6">
            
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
                border-[3px] border-dashed border-black p-10 flex flex-col items-center justify-center gap-4 
                transition-colors cursor-pointer nb-interactive
                ${selectedFile ? 'bg-nb-green/10 border-nb-green' : 'bg-nb-bg hover:bg-nb-yellow'}
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
                    <p className="font-mono text-sm font-bold bg-white px-3 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center gap-2">
                      <File size={14} /> {selectedFile.name}
                      <button 
                        onClick={clearFile}
                        className="ml-2 hover:text-red-500 transition-colors"
                      >
                        <X size={14} strokeWidth={3} />
                      </button>
                    </p>
                  </div>
                </>
              ) : (
                <>
                  <Upload size={32} strokeWidth={2} className="text-black" />
                  <div className="text-center">
                    <p className="font-body font-bold text-base text-black mb-1">
                      Upload your invoice PDF
                    </p>
                    <p className="font-body text-sm text-gray-600">
                      PDF format only (Max 10MB)
                    </p>
                  </div>
                  <button className="mt-2 px-6 py-2 bg-white border-[2px] border-black font-body font-bold text-sm shadow-[2px_2px_0px_0px_#000]">
                    Choose File
                  </button>
                </>
              )}
            </div>

            <div className="flex flex-col gap-2">
              <label className="font-body font-bold text-sm text-black">Additional Notes</label>
              <textarea 
                placeholder="Add any additional notes..." 
                rows={3}
                className="w-full px-4 py-3 bg-white border-[2px] border-black shadow-[4px_4px_0px_0px_#000] font-body text-sm placeholder:text-gray-500 outline-none transition-all duration-100 focus:translate-x-[4px] focus:translate-y-[4px] focus:shadow-none resize-y"
              ></textarea>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row items-center justify-end gap-4 mt-4 pt-6 border-t-[3px] border-black">
              <button 
                onClick={() => {
                  setSelectedOrder("")
                  setSelectedFile(null)
                  if (fileInputRef.current) fileInputRef.current.value = ""
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border-[3px] border-black px-6 py-3 font-display font-black text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none"
              >
                <X size={18} strokeWidth={2.5} />
                Reset
              </button>
              <button className="w-full sm:w-auto flex items-center justify-center gap-2 bg-nb-green border-[3px] border-black px-8 py-3 font-display font-black text-black shadow-[4px_4px_0px_0px_#000] transition-all duration-100 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#000] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none">
                <Send size={18} strokeWidth={2.5} />
                Submit Invoice
              </button>
            </div>
            
          </div>
        </Panel>
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
      </main>
    </>
  )
}
<<<<<<< HEAD

=======
>>>>>>> 49e02909b531e5dc0065d6d7086be57ba9239f3f
