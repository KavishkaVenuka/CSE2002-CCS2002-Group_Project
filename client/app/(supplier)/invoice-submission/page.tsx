"use client"

import { useState, useRef } from "react"
import { 
  FileText, Send, Info, AlertTriangle, 
  CheckCircle2, RefreshCw, Calendar, 
  ClipboardCheck, CreditCard, Upload, X, File,
  ChevronDown
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"

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

  const resetForm = () => {
    setSelectedOrder("")
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
                          className="w-full appearance-none px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors cursor-pointer"
                        >
                          <option value="">Select an order</option>
                          <option value="PO-8842">PO-8842 (Modern Fabrics)</option>
                          <option value="ORD-20240115">ORD-20240115 - Acme Corp</option>
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
                </div>
              </Panel>

              {/* PDF Upload Section */}
              <Panel title="Upload Invoice PDF" icon={<Upload size={18} className="text-nb-orange" />}>
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
                    placeholder="Payment instructions, bank details, or delivery remarks..." 
                    className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors resize-none"
                  />
                </div>
              </Panel>
            </div>

            {/* ── RIGHT COLUMN (1/3) ────────────────────────── */}
            <div className="space-y-8">
              {/* Totals Sidebar */}
              <Panel title="Invoice Totals" dark icon={<FileText size={18} className="text-white" />} noTopPad>
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
      </main>
    </>
  )
}
