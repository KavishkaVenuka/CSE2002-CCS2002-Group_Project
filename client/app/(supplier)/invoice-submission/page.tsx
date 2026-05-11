"use client"

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

  return (
    <>
      <Header title="Invoice Submission" />
      
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
      </main>
    </>
  )
}
