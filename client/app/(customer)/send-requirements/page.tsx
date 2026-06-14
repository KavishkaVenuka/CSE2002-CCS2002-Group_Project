"use client"

import { useState, useEffect } from "react"
import { 
  Package, FileText, Plus, Trash2, UploadCloud, 
  Edit3, ChevronDown, Send, Clock, AlertCircle,
  CheckCircle2, XCircle, ArrowRight, Eye, Upload, DownloadCloud, File
} from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { Panel } from "@/components/common/Panel"
import { getCustomerRequirements, getCustomerRequirementsStats, getAvailableStocks, createRequirement, type SupplierRequirement } from "@/lib/api"

interface RequirementItem {
  id: number
  name: string
  quantity: string
  unit: string
  deliveryDate: string
  notes: string
}

export default function SendRequirements() {
  const [items, setItems] = useState<RequirementItem[]>([
    { id: 1, name: "", quantity: "", unit: "Units", deliveryDate: "", notes: "" }
  ])

  // Backend connected state
  const [stats, setStats] = useState({ total: 0, received: 0, pending: 0, rejected: 0 })
  const [sentRequirements, setSentRequirements] = useState<SupplierRequirement[]>([])
  const [availableStocks, setAvailableStocks] = useState<any[]>([])
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [selectedRequirement, setSelectedRequirement] = useState<any>(null)
  const [showViewModal, setShowViewModal] = useState(false)
  
  const [loading, setLoading] = useState(false)
  const [historyLoading, setHistoryLoading] = useState(true)
  const [stocksLoading, setStocksLoading] = useState(true)
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const getCustomerId = () => {
    if (typeof window === "undefined") return ""
    try {
      const user = JSON.parse(localStorage.getItem("user") || "{}")
      return user._id || user.id || ""
    } catch {
      return ""
    }
  }

  const fetchData = async () => {
    const customID = getCustomerId()
    if (!customID) {
      setHistoryLoading(false)
      return
    }
    
    try {
      setHistoryLoading(true)
      const [reqRes, statsRes] = await Promise.all([
        getCustomerRequirements(customID).catch(() => ({ requirements: [] })),
        getCustomerRequirementsStats(customID).catch(() => ({ stats: { total: 0, completed: 0, in_progress: 0, new: 0, rejected: 0 } }))
      ])
      
      setSentRequirements(reqRes.requirements || [])
      
      const s = statsRes.stats || {}
      setStats({
        total: s.total || 0,
        received: (s.completed || 0) + (s.in_progress || 0),
        pending: s.new || 0,
        rejected: s.rejected || 0,
      })
    } catch (error) {
      console.error(error)
    } finally {
      setHistoryLoading(false)
    }
  }

  const fetchStocks = async () => {
    try {
      setStocksLoading(true)
      const data = await getAvailableStocks()
      const itemsArray = Array.isArray(data) ? data : ((data as any).data || (data as any).items || [])
      setAvailableStocks(itemsArray)
    } catch (error) {
      console.error("Error fetching stocks:", error)
    } finally {
      setStocksLoading(false)
    }
  }

  useEffect(() => { 
    fetchData()
    fetchStocks()
  }, [])

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now(), name: "", quantity: "",
      unit: "Units", deliveryDate: "", notes: ""
    }])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length === 1) return
    setItems(items.filter(item => item.id !== id))
  }

  const handleChange = (id: number, field: keyof RequirementItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  const handleSubmit = async () => {
    // Validate
    const invalid = items.some(i => !i.name || !i.quantity || !i.deliveryDate)
    if (invalid) {
      alert("Please fill all required fields (Product, Quantity, Deadline) for each item.")
      return
    }

    setLoading(true)
    try {
      await createRequirement({
        customerId: getCustomerId(),
        requirements: items.map(item => ({
          itemName: item.name,
          quantity: item.quantity,
          unit: item.unit,
          deliveryDate: item.deliveryDate,
          notes: item.notes
        })),
        attachedDocument: uploadedFiles
      })
      
      setShowSuccessModal(true)
      setItems([{ id: Date.now(), name: "", quantity: "", unit: "Units", deliveryDate: "", notes: "" }])
      setUploadedFiles([])
      fetchData()
      
      setTimeout(() => setShowSuccessModal(false), 3000)
    } catch (error) { 
      console.error(error)
      alert("Failed to submit requirement.") 
    } finally { 
      setLoading(false) 
    }
  }

  return (
    <>
      <DashboardHeader title="Procurement" dateString={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })} />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        
        {/* ── SUCCESS NOTIFICATION ────────────────────────────────────── */}
        {showSuccessModal && (
          <div className="bg-nb-green border-[3px] border-black shadow-nb p-4 flex items-center gap-4">
            <CheckCircle2 className="text-black" size={24} />
            <p className="font-display font-black text-black">Requirement submitted successfully!</p>
          </div>
        )}

        {/* ── PREMIUM HEADER BANNER ───────────────────────────────────── */}
        <div className="bg-black border-[4px] border-black shadow-[8px_8px_0px_0px_#A5E6DC] p-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-[#A5E6DC]/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
          
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="space-y-3">
              <div className="inline-block px-3 py-1 bg-white/10 border border-white/20 font-mono text-[10px] text-[#A5E6DC] uppercase tracking-widest">
                Customer Portal V2.0
              </div>
              <h1 className="font-display font-black text-5xl text-white">
                Requirement <span className="text-[#A5E6DC]">Intelligence</span>
              </h1>
              <p className="font-body text-sm text-gray-400 max-w-xl">
                Streamline your procurement process by sending detailed requirements directly to our administration for rapid quotation and fulfillment.
              </p>
            </div>
            
            <div className="p-6 bg-white/5 border-[2px] border-white/10 flex flex-col items-center justify-center min-w-[160px]">
              <span className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest mb-1">Health Score</span>
              <span className="font-display font-black text-4xl text-[#22c55e]">98%</span>
            </div>
          </div>
        </div>

        {/* ── STATS ROW ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { label: "Total Sent", value: stats.total.toString(), icon: <Send size={20} />, color: "bg-nb-cyan" },
            { label: "Quoted", value: stats.received.toString(), icon: <CheckCircle2 size={20} />, color: "bg-nb-green" },
            { label: "Pending", value: stats.pending.toString(), icon: <Clock size={20} />, color: "bg-nb-yellow" },
            { label: "Rejected", value: stats.rejected.toString(), icon: <XCircle size={20} />, color: "bg-nb-red" }
          ].map((stat, i) => (
            <div key={i} className={`${stat.color} border-[3px] border-black shadow-nb p-6 flex items-center gap-5 nb-interactive`}>
              <div className="w-12 h-12 bg-white border-[2px] border-black flex items-center justify-center shadow-[3px_3px_0px_0px_#000]">
                {stat.icon}
              </div>
              <div>
                <p className="font-display font-black text-[10px] text-black uppercase tracking-widest">{stat.label}</p>
                <h3 className="font-display font-black text-3xl text-black">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── NEW REQUEST SECTION ──────────────────────────────────────── */}
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-black flex items-center justify-center border-[2px] border-black shadow-[3px_3px_0px_0px_#A5E6DC]">
                <Plus size={20} className="text-white" strokeWidth={3} />
              </div>
              <h2 className="font-display font-black text-2xl text-black">Draft New Request</h2>
            </div>
            <button 
              onClick={handleAddItem}
              className="px-6 py-3 bg-white border-[3px] border-black font-display font-black text-xs uppercase tracking-widest shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
            >
              Add New Line Item
            </button>
          </div>

          <div className="bg-white border-[4px] border-black shadow-nb overflow-hidden">
            <div className="grid grid-cols-[1fr_120px_150px_1fr_60px] gap-4 px-6 py-4 bg-black text-white font-display font-black text-[10px] uppercase tracking-widest">
              <div>Product Selection</div>
              <div>Quantity</div>
              <div>Delivery Deadline</div>
              <div>Specifications / Notes</div>
              <div className="text-right">Action</div>
            </div>

            <div className="divide-y-[2px] divide-black">
              {items.map((item, index) => (
                <div key={item.id} className="grid grid-cols-[1fr_120px_150px_1fr_60px] gap-4 px-6 py-6 items-start bg-white">
                  {/* Product */}
                  <div className="relative">
                    <select
                      value={item.name}
                      onChange={e => handleChange(item.id, "name", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors appearance-none"
                    >
                      <option value="">Select Product...</option>
                      {stocksLoading ? (
                        <option value="" disabled>Loading stocks...</option>
                      ) : (
                        availableStocks.map((stock: any) => (
                          <option key={stock.id || stock._id || stock.item_name} value={stock.item_name}>
                            {stock.item_name}
                          </option>
                        ))
                      )}
                    </select>
                    <ChevronDown size={16} className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" />
                  </div>

                  {/* Quantity */}
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="0"
                      value={item.quantity}
                      onChange={e => handleChange(item.id, "quantity", e.target.value)}
                      className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-mono text-sm outline-none focus:bg-white transition-colors"
                    />
                  </div>

                  {/* Deadline */}
                  <input
                    type="date"
                    value={item.deliveryDate}
                    onChange={e => handleChange(item.id, "deliveryDate", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-mono text-xs outline-none focus:bg-white transition-colors"
                  />

                  {/* Notes */}
                  <input
                    type="text"
                    placeholder="e.g. Color requirements..."
                    value={item.notes}
                    onChange={e => handleChange(item.id, "notes", e.target.value)}
                    className="w-full px-4 py-3 bg-gray-100 border-[2px] border-black font-body text-sm outline-none focus:bg-white transition-colors"
                  />

                  {/* Delete */}
                  <div className="flex justify-end pt-2">
                    <button 
                      onClick={() => handleRemoveItem(item.id)}
                      disabled={items.length === 1}
                      className="text-nb-red hover:scale-110 transition-transform disabled:opacity-20"
                    >
                      <Trash2 size={20} strokeWidth={2.5} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* File Upload Area */}
            <div className="p-6 bg-gray-50 border-t-[2px] border-black">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <UploadCloud size={24} className="text-black" />
                  <div>
                    <p className="font-display font-black text-sm text-black uppercase tracking-widest">Attach Documents</p>
                    <p className="font-body text-xs text-gray-500">PDF, Excel, or Images (Max 5MB)</p>
                  </div>
                </div>
                <div className="relative">
                  <input 
                    type="file" 
                    multiple 
                    onChange={e => {
                      if (e.target.files) {
                        setUploadedFiles(Array.from(e.target.files))
                      }
                    }}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  />
                  <div className="px-6 py-3 bg-white border-[2px] border-black font-display font-black text-xs uppercase tracking-widest shadow-[3px_3px_0px_0px_#000] flex items-center gap-2 hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all">
                    <Plus size={16} /> Select Files
                  </div>
                </div>
              </div>
              {uploadedFiles.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {uploadedFiles.map((f, i) => (
                    <div key={i} className="flex items-center gap-2 px-3 py-1.5 bg-nb-cyan border-[2px] border-black font-mono text-[10px] font-black">
                      <File size={14} />
                      <span className="truncate max-w-[150px]">{f.name}</span>
                      <button onClick={() => setUploadedFiles(uploadedFiles.filter((_, idx) => idx !== i))} className="ml-1 hover:text-red-600 transition-colors">
                        <XCircle size={14} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── DISPATCH FOOTER ─────────────────────────────────────────── */}
        <div className="bg-nb-cyan border-[4px] border-black shadow-nb p-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="space-y-1">
            <h3 className="font-display font-black text-2xl text-black">Ready to dispatch?</h3>
            <p className="font-body text-sm font-bold text-black/60">Double-check your quantities and deadlines before submission.</p>
          </div>
          <button 
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center gap-3 px-8 py-4 bg-black text-white font-display font-black text-sm uppercase tracking-widest border-[2px] border-black shadow-[6px_6px_0px_0px_#fff] hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-none transition-all disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {loading ? "Dispatching..." : "Dispatch Requirement"} <ArrowRight size={20} strokeWidth={3} />
          </button>
        </div>

        {/* ── ACTIVITY LOG ────────────────────────────────────────────── */}
        <Panel 
          title="Activity Log" 
          icon={<Clock size={18} className="text-black" />}
          badge={<span className="font-mono text-[10px] font-black text-gray-400">LIVE UPDATES</span>}
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[150px_1fr_150px_100px_80px] gap-4 px-6 py-4 bg-gray-100 border-b-[2px] border-black font-display font-black text-[10px] uppercase tracking-widest min-w-[700px]">
              <div>Reference ID</div>
              <div>Items</div>
              <div>Current Status</div>
              <div className="text-right">Quantity</div>
              <div className="text-right">Action</div>
            </div>
            
            {historyLoading ? (
              <div className="p-12 flex flex-col items-center justify-center gap-4 bg-white">
                <div className="w-10 h-10 border-[4px] border-nb-cyan border-t-black animate-spin" />
                <p className="font-mono text-[10px] font-black text-gray-400 uppercase tracking-widest">Loading history...</p>
              </div>
            ) : sentRequirements.length === 0 ? (
              <div className="p-12 text-center bg-white">
                <p className="font-mono text-[10px] font-black text-gray-400 uppercase tracking-widest">No sent requirements found.</p>
              </div>
            ) : (
              <div className="divide-y-[2px] divide-black bg-white min-w-[700px]">
                {sentRequirements.map((req, i) => (
                  <div key={req.id || i} className="grid grid-cols-[150px_1fr_150px_100px_80px] gap-4 px-6 py-4 items-center hover:bg-gray-50 transition-colors">
                    <div className="font-mono text-sm font-black text-black">{req.requirementId || req.id}</div>
                    <div className="font-body text-sm font-bold text-gray-600 truncate">
                      {req.itemsDetail || (Array.isArray(req.items) ? req.items.map((it:any) => it.itemName || it.name).join(", ") : `${req.items} items`)}
                    </div>
                    <div>
                      <span className={`px-2 py-0.5 border-[2px] border-black font-mono text-[9px] font-black uppercase text-black shadow-[2px_2px_0px_0px_#000]
                        ${req.status === 'Completed' || req.status === 'quoted' ? 'bg-nb-green' : 
                          req.status === 'Pending' || req.status === 'new' || req.status === 'pending' ? 'bg-nb-yellow' : 
                          req.status === 'Rejected' || req.status === 'rejected' ? 'bg-nb-red' : 'bg-gray-200'}`
                      }>
                        {req.status === 'quoted' ? 'Received' : req.status}
                      </span>
                    </div>
                    <div className="text-right font-display font-black text-sm text-black">
                      {req.qty || (Array.isArray(req.items) ? req.items.reduce((acc, curr) => acc + Number(curr.quantity || 0), 0) : req.items)}
                    </div>
                    <div className="text-right flex justify-end">
                      <button 
                        onClick={() => {
                          setSelectedRequirement(req)
                          setShowViewModal(true)
                        }}
                        className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all text-gray-600 hover:text-black"
                      >
                        <Eye size={16} strokeWidth={2.5} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </Panel>

      </main>

      {/* ── VIEW REQUIREMENT MODAL ────────────────────────────────────────────── */}
      {showViewModal && selectedRequirement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="w-full max-w-2xl bg-white border-[4px] border-black shadow-nb flex flex-col max-h-[90vh]">
            <div className="flex items-center justify-between px-6 py-4 border-b-[4px] border-black bg-black">
              <h2 className="font-display font-black text-xl text-white flex items-center gap-3">
                <FileText className="text-[#A5E6DC]" size={24} /> 
                {selectedRequirement.requirementId || selectedRequirement.id}
              </h2>
              <button onClick={() => setShowViewModal(false)} className="text-white hover:text-[#A5E6DC] transition-colors">
                <XCircle size={28} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <div className="flex justify-between items-center bg-gray-100 p-4 border-[2px] border-black">
                <div>
                  <p className="font-mono text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Submitted On</p>
                  <p className="font-body font-bold text-black">{new Date(selectedRequirement.createdAt || Date.now()).toLocaleDateString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-mono text-[10px] font-black uppercase tracking-widest text-gray-500 mb-1">Status</p>
                  <span className={`inline-block px-3 py-1 border-[2px] border-black font-mono text-[10px] font-black uppercase shadow-[2px_2px_0px_0px_#000] ${
                    selectedRequirement.status === 'Completed' || selectedRequirement.status === 'quoted' ? 'bg-nb-green text-black' : 
                    selectedRequirement.status === 'Pending' || selectedRequirement.status === 'new' || selectedRequirement.status === 'pending' ? 'bg-nb-yellow text-black' : 
                    selectedRequirement.status === 'Rejected' || selectedRequirement.status === 'rejected' ? 'bg-nb-red text-black' : 'bg-gray-200 text-black'
                  }`}>
                    {selectedRequirement.status === 'quoted' ? 'Received' : selectedRequirement.status}
                  </span>
                </div>
              </div>

              <div>
                <h3 className="font-display font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                  <Package size={16} /> Requested Items
                </h3>
                <div className="border-[2px] border-black divide-y-[2px] divide-black">
                  {Array.isArray(selectedRequirement.items) ? selectedRequirement.items.map((item: any, idx: number) => (
                    <div key={idx} className="p-4 flex justify-between items-center bg-white hover:bg-gray-50">
                      <div>
                        <p className="font-display font-black text-lg text-black">{item.itemName || item.name}</p>
                        <p className="font-body text-xs font-bold text-gray-500">Deadline: {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'N/A'}</p>
                      </div>
                      <div className="text-right">
                        <p className="font-display font-black text-xl text-black">{item.quantity}</p>
                        <p className="font-mono text-[10px] font-black uppercase tracking-widest text-gray-500">{item.unit || 'Units'}</p>
                      </div>
                    </div>
                  )) : (
                    <div className="p-4 bg-white">
                      <p className="font-body font-bold text-gray-600">{selectedRequirement.itemsDetail || `${selectedRequirement.items} items requested`}</p>
                    </div>
                  )}
                </div>
              </div>

              {selectedRequirement.attachedDocument && (
                <div>
                  <h3 className="font-display font-black text-sm uppercase tracking-widest mb-3 flex items-center gap-2">
                    <UploadCloud size={16} /> Attachments
                  </h3>
                  <div className="p-4 border-[2px] border-black bg-nb-cyan/20 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="text-nb-cyan" size={24} />
                      <p className="font-body font-bold text-sm">Attached Document</p>
                    </div>
                    <a 
                      href={`http://localhost:5900/${selectedRequirement.attachedDocument.replace(/\\/g, '/')}`}
                      target="_blank"
                      rel="noreferrer"
                      className="px-4 py-2 bg-white border-[2px] border-black font-display font-black text-xs uppercase shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all flex items-center gap-2"
                    >
                      <DownloadCloud size={16} /> View
                    </a>
                  </div>
                </div>
              )}

              {(selectedRequirement.status === 'rejected' || selectedRequirement.status === 'Rejected') && selectedRequirement.rejectReason && (
                <div className="p-4 border-[2px] border-black bg-nb-red/20 border-l-[8px] border-l-nb-red">
                  <p className="font-display font-black text-xs uppercase tracking-widest text-red-900 mb-1">Rejection Reason</p>
                  <p className="font-body font-bold text-red-800 italic">{selectedRequirement.rejectReason}</p>
                </div>
              )}
            </div>
            
            <div className="p-6 border-t-[4px] border-black bg-gray-50 flex justify-end">
              <button 
                onClick={() => setShowViewModal(false)}
                className="px-8 py-3 bg-white border-[3px] border-black font-display font-black text-xs uppercase tracking-widest shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}