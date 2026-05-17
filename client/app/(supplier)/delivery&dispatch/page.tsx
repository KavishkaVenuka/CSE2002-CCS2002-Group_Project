"use client"

import { useState, useEffect } from "react"
import { Truck, ChevronDown, Package, Send, ClipboardList, User, Car, RotateCcw, CheckCircle } from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import { toast } from "sonner"
import { getDispatchList, getDeliveryProgress, dispatchOrder, DispatchProgress } from "@/lib/api"
import { useRouter } from "next/navigation"

export default function DeliverDispatchPage() {
  const router = useRouter()
  
  const [orders, setOrders] = useState<any[]>([])
  const [selectedOrder, setSelectedOrder] = useState("")
  const [progress, setProgress] = useState<{ items: any[] } | null>(null)
  const [issuedQtys, setIssuedQtys] = useState<{ [key: string]: number }>({})
  
  const [isLoadingOrders, setIsLoadingOrders] = useState(true)
  const [isLoadingProgress, setIsLoadingProgress] = useState(false)
  const [isDispatching, setIsDispatching] = useState(false)

  const [vehicleNumber, setVehicleNumber] = useState("")
  const [driverName, setDriverName] = useState("")
  const [deliveryNotes, setDeliveryNotes] = useState("")
  
  const [showSuccessModal, setShowSuccessModal] = useState(false)

  const fetchOrders = async () => {
    try {
      setIsLoadingOrders(true)
      const res = await getDispatchList()
      setOrders(res.orders || [])
      if (!selectedOrder && res.orders?.length > 0) {
        setSelectedOrder(res.orders[0]._id)
      }
    } catch (err: any) {
      toast.error("Failed to load dispatchable orders")
    } finally {
      setIsLoadingOrders(false)
    }
  }

  const fetchProgress = async (id: string) => {
    if (!id) return
    try {
      setIsLoadingProgress(true)
      const res = await getDeliveryProgress(id)
      setProgress(res.progress as any)
      
      const initialQtys: { [key: string]: number } = {}
      if (res.progress?.items) {
        res.progress.items.forEach((item: any) => {
          initialQtys[item.productID] = item.issued || item.ordered
        })
      }
      setIssuedQtys(initialQtys)
    } catch (err: any) {
      console.error("Progress fetch error:", err)
      toast.error("Failed to fetch progress")
    } finally {
      setIsLoadingProgress(false)
    }
  }

  useEffect(() => {
    fetchOrders()
  }, [])

  useEffect(() => {
    if (selectedOrder) {
      fetchProgress(selectedOrder)
    }
  }, [selectedOrder])

  const handleDispatch = async () => {
    if (!selectedOrder) return
    try {
      setIsDispatching(true)
      const dispatchItems = progress?.items.map((item: any) => ({
        productID: item.productID,
        issuedQuantity: issuedQtys[item.productID] || item.ordered
      }))

      await dispatchOrder(selectedOrder, {
        vehicleNumber,
        driverName,
        deliveryNotes,
        items: dispatchItems
      })
      
      setShowSuccessModal(true)
      fetchOrders()
      fetchProgress(selectedOrder)
    } catch (err: any) {
      toast.error(err.message || "Failed to dispatch order")
    } finally {
      setIsDispatching(false)
    }
  }

  const selectedOrderObj = orders.find(o => o._id === selectedOrder)

  // calculations for progress
  const totalItems = progress?.items?.length || 0;
  const receivedItems = progress?.items?.filter(i => Number(i.received) >= Number(i.ordered)).length || 0;
  const fillPercentage = totalItems > 0 ? (receivedItems / totalItems) * 100 : 0;

  return (
    <>
      <Header title="Delivery & Dispatch" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* ── LEFT COLUMN (1/3) ────────────────────────────────────── */}
          <div className="space-y-8">
            {/* Select Order */}
            <Panel title="Select Order" icon={<Package size={18} className="text-nb-green" />}>
              <div className="p-6 space-y-4">
                <div className="space-y-2">
                  <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">Order Reference</label>
                  <div className="relative">
                    <select 
                      value={selectedOrder}
                      onChange={(e) => setSelectedOrder(e.target.value)}
                      disabled={isLoadingOrders}
                      className="w-full appearance-none px-4 py-3 bg-white border-[2px] border-black font-body text-sm outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all cursor-pointer disabled:opacity-50"
                    >
                      <option value="">{isLoadingOrders ? "Loading..." : "Select an order"}</option>
                      {orders.map(o => (
                        <option key={o._id} value={o._id}>{o.po_id || 'PO-NEW'}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={16} strokeWidth={3} />
                  </div>
                </div>
              </div>
            </Panel>

            {/* Item Fulfillment */}
            <Panel title="Item Fulfillment" icon={<ClipboardList size={18} className="text-nb-cyan" />} dark>
              {isLoadingProgress ? (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 border-[2px] border-white/20 flex items-center justify-center shadow-nb-sm animate-spin">
                    <RotateCcw size={20} className="text-white/20" />
                  </div>
                  <p className="font-body text-sm text-white/40 italic">Loading fulfillment data...</p>
                </div>
              ) : progress ? (
                <div className="p-6 space-y-6 text-white">
                  <div className="space-y-4">
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-white/60">Total Line Items</span>
                      <span className="font-bold">{totalItems}</span>
                    </div>
                    <div className="flex justify-between text-sm font-body">
                      <span className="text-white/60">Successfully Received</span>
                      <span className="font-bold text-nb-green">{receivedItems}</span>
                    </div>
                  </div>
                  
                  <div className="pt-4 border-t-[2px] border-white/10">
                    <p className="font-display font-black text-[10px] uppercase text-white/60 mb-3 tracking-widest">Progress Visualization</p>
                    <div className="w-full bg-white/10 h-3 border-[2px] border-white/20 overflow-hidden">
                      <div 
                        className="bg-nb-green h-full transition-all duration-1000" 
                        style={{ width: `${fillPercentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="p-12 flex flex-col items-center justify-center text-center space-y-4">
                  <div className="w-12 h-12 bg-white/10 border-[2px] border-white/20 flex items-center justify-center shadow-nb-sm">
                    <RotateCcw size={20} className="text-white/20" />
                  </div>
                  <p className="font-body text-sm text-white/40 italic">Select an order to see progress</p>
                </div>
              )}
            </Panel>
          </div>

          {/* ── RIGHT COLUMN (2/3) ───────────────────────────────────── */}
          <div className="lg:col-span-2 space-y-8">
            {/* Dispatch Information */}
            <Panel title="Dispatch Information" icon={<Send size={18} className="text-nb-cyan" />}>
              <div className="p-8 space-y-8">
                {selectedOrderObj && (
                  <div className="flex justify-end">
                    <span className="px-3 py-1 bg-green-100 text-green-800 border-[2px] border-green-800 font-display font-black text-[10px] uppercase tracking-widest shadow-nb-sm">
                      {selectedOrderObj.status}
                    </span>
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <Car size={14} strokeWidth={3} />
                      Vehicle Number *
                    </label>
                    <input 
                      type="text" 
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      placeholder="e.g. WP-ABC-1234" 
                      className="w-full px-4 py-3 bg-white border-[2px] border-black font-body text-sm outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest flex items-center gap-2">
                      <User size={14} strokeWidth={3} />
                      Driver Name *
                    </label>
                    <input 
                      type="text" 
                      value={driverName}
                      onChange={(e) => setDriverName(e.target.value)}
                      placeholder="Enter driver name" 
                      className="w-full px-4 py-3 bg-white border-[2px] border-black font-body text-sm outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">Delivery Notes</label>
                  <textarea 
                    rows={4}
                    value={deliveryNotes}
                    onChange={(e) => setDeliveryNotes(e.target.value)}
                    placeholder="Add special instructions for delivery..." 
                    className="w-full px-4 py-3 bg-white border-[2px] border-black font-body text-sm outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-all resize-none"
                  />
                </div>

                <div className="flex justify-end pt-4 border-t-[2px] border-black/5">
                  <button 
                    onClick={handleDispatch}
                    disabled={isDispatching || !selectedOrder || !vehicleNumber || !driverName}
                    className="flex items-center gap-3 px-8 py-4 bg-nb-green text-black font-display font-black text-sm uppercase tracking-widest border-[3px] border-black shadow-nb hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-green-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isDispatching ? "Dispatching..." : "Finalize Dispatch"}
                    {!isDispatching && <Send size={18} strokeWidth={3} />}
                  </button>
                </div>
              </div>
            </Panel>

            {/* Itemized Transit Status */}
            <Panel title="Itemized Transit Status" icon={<Truck size={18} className="text-nb-yellow" />}>
              <div className="overflow-x-auto">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-8 py-4 border-b-[2px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[600px]">
                  <div>Product</div>
                  <div className="text-center">Ordered</div>
                  <div className="text-center">In Transit</div>
                  <div className="text-center">Received</div>
                </div>
                {isLoadingProgress ? (
                   <div className="p-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-gray-50 border-[2px] border-black shadow-nb flex items-center justify-center mb-4 animate-spin">
                      <RotateCcw size={32} className="text-gray-300" />
                    </div>
                    <p className="font-body text-sm text-gray-400 italic">Loading items...</p>
                  </div>
                ) : progress?.items?.length ? (
                  <div className="min-w-[600px]">
                    {progress.items.map((item: any, idx: number) => (
                      <div key={idx} className="grid grid-cols-[2fr_1fr_1fr_1fr] gap-4 px-8 py-4 border-b-[2px] border-black/5 items-center hover:bg-gray-50 transition-colors">
                        <div className="font-bold text-sm text-black">{item.name || item.product}</div>
                        <div className="text-center font-display font-black text-gray-400">{item.ordered}</div>
                        <div className="text-center">
                          <input 
                            type="number"
                            min="0"
                            max={item.ordered}
                            value={issuedQtys[item.productID] ?? item.ordered}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setIssuedQtys(prev => ({ ...prev, [item.productID]: Math.min(val, Number(item.ordered)) }));
                            }}
                            disabled={selectedOrderObj?.status === 'dispatched' || selectedOrderObj?.status === 'delivered'}
                            className="w-20 px-2 py-1 text-center font-bold bg-white border-[2px] border-black focus:shadow-[2px_2px_0px_0px_#000] outline-none transition-all disabled:opacity-50"
                          />
                        </div>
                        <div className="text-center">
                          <span className="px-3 py-1 bg-green-100 text-green-800 border-[2px] border-green-800 font-display font-black text-[10px] shadow-nb-sm">
                            {item.received}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-16 flex flex-col items-center justify-center text-center min-w-[600px]">
                    <div className="w-16 h-16 bg-gray-50 border-[2px] border-black shadow-nb flex items-center justify-center mb-4">
                      <Truck size={32} className="text-gray-300" />
                    </div>
                    <p className="font-body text-sm text-gray-400 italic">No progress data available</p>
                  </div>
                )}
              </div>
            </Panel>
          </div>

        </div>
      </main>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] max-w-md w-full overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="p-8 bg-nb-green border-b-[3px] border-black flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-white border-[3px] border-black shadow-nb flex items-center justify-center rounded-full mb-4">
                <CheckCircle size={32} strokeWidth={3} className="text-black" />
              </div>
              <h2 className="font-display font-black text-2xl uppercase tracking-wider text-black">Dispatch Successful!</h2>
              <p className="font-body text-sm text-black/80 mt-2 font-bold">
                The order has been marked as dispatched. Real-time tracking is now available.
              </p>
            </div>
            
            <div className="p-8 space-y-6">
              <div className="p-4 bg-gray-50 border-[2px] border-black shadow-nb-sm space-y-3">
                <div className="flex justify-between items-center border-b-[2px] border-black/5 pb-2">
                  <span className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Vehicle Number</span>
                  <span className="font-display font-black text-sm text-black">{vehicleNumber}</span>
                </div>
                <div className="flex justify-between items-center border-b-[2px] border-black/5 pb-2">
                  <span className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Driver</span>
                  <span className="font-display font-black text-sm text-black">{driverName}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Time</span>
                  <span className="font-display font-black text-sm text-black">{new Date().toLocaleTimeString()}</span>
                </div>
              </div>

              <button
                onClick={() => {
                  setShowSuccessModal(false)
                  router.push('/orders')
                }}
                className="w-full px-6 py-4 bg-black text-white font-display font-black text-sm uppercase tracking-widest hover:bg-gray-800 transition-colors border-[2px] border-black shadow-nb"
              >
                Go to Orders
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

