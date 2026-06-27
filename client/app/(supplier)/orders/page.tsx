"use client"

import { useState, useMemo, useEffect } from "react"
import { 
  ShoppingCart, Search, ChevronDown, Clock, 
  Truck, CheckCircle, Eye, Download, RefreshCw, 
  Package, Send, CheckSquare, Loader2, X, AlertCircle
} from "lucide-react"
import { Header } from "@/components/supplier/Header"
import { Panel } from "@/components/common/Panel"
import { getSupplierOrders, getSupplierOrderStats, acknowledgeOrder, getOrderDetails } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import Loading from "./loading"

const BADGE_MAP: Record<string, string> = {
  "pending": "bg-gray-200",
  "acknowledged": "bg-nb-yellow",
  "confirmed": "bg-nb-yellow",
  "preparing": "bg-[#c084fc]",
  "ready": "bg-nb-cyan",
  "dispatched": "bg-nb-green",
  "delivered": "bg-green-400",
}

interface Stats {
  total: number;
  pending: number;
  confirmed: number;
  dispatched: number;
  delivered: number;
}

export default function OrdersPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState("All Status")

  const [orders, setOrders] = useState<any[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const [showDetailsModal, setShowDetailsModal] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null)
  const [isLoadingDetail, setIsLoadingDetail] = useState(false)

  const [showAcknowledgeModal, setShowAcknowledgeModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true)
      const statusParam = statusFilter === "All Status" ? undefined : statusFilter.toLowerCase()
      
      const [ordersRes, statsRes] = await Promise.all([
        getSupplierOrders({ status: statusParam }),
        getSupplierOrderStats()
      ])

      setOrders(ordersRes.orders || [])
      setStats(statsRes.stats as any)
    } catch (err: any) {
      console.error('Failed to load orders:', err)
      toast.error('Failed to load orders')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [statusFilter])

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const qId = order.po_id || order.id || order._id || ""
      const qCust = order.customerName || order.customer || ""
      const q = searchQuery.toLowerCase()
      
      const matchesSearch = 
        qId.toLowerCase().includes(q) ||
        qCust.toLowerCase().includes(q)

      return matchesSearch
    })
  }, [orders, searchQuery])

  const openDetails = async (order: any) => {
    setSelectedOrder(order);
    setShowDetailsModal(true);
    try {
      setIsLoadingDetail(true);
      const res = await getOrderDetails(order._id || order.id);
      if (res.order) {
        setSelectedOrder({ ...order, ...res.order });
      }
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch full order details");
    } finally {
      setIsLoadingDetail(false);
    }
  }

  const handleAcknowledge = async () => {
    if (!selectedOrder) return;
    try {
      setIsProcessing(true);
      await acknowledgeOrder(selectedOrder._id || selectedOrder.id);
      toast.success('Order acknowledged successfully');
      setShowAcknowledgeModal(false);
      fetchData();
    } catch (err: any) {
      toast.error('Failed to acknowledge order');
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePrepareDispatch = (orderId: string) => {
    router.push(`/delivery&dispatch?orderId=${orderId}`);
  };

  const STAT_CARDS = [
    { title: "Total Orders", value: stats?.total?.toString() || "0", icon: ShoppingCart, color: "bg-gray-200" },
    { title: "Pending", value: stats?.pending?.toString() || "0", icon: Clock, color: "bg-nb-yellow" },
    { title: "Confirmed", value: stats?.confirmed?.toString() || "0", icon: CheckCircle, color: "bg-[#c084fc]" },
    { title: "Dispatched", value: stats?.dispatched?.toString() || "0", icon: Truck, color: "bg-nb-green" },
    { title: "Delivered", value: stats?.delivered?.toString() || "0", icon: Package, color: "bg-nb-cyan" },
  ]

  if (isLoading && orders.length === 0) {
    return <Loading />
  }

  return (
    <>
      <Header title="Order Management" />

      <main className="flex-1 overflow-auto p-8 space-y-10 bg-[#fdfcfb]">
        {/* ── STAT CARDS ────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {STAT_CARDS.map((stat, i) => (
            <div 
              key={i} 
              className="bg-white border-[3px] border-black shadow-nb p-5 flex flex-col gap-3 nb-interactive"
            >
              <div className={`w-10 h-10 border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] ${stat.color}`}>
                <stat.icon size={20} strokeWidth={3} className="text-black" />
              </div>
              <div>
                <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest">{stat.title}</p>
                <h3 className="font-display font-black text-2xl text-black leading-none">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── MAIN TABLE ────────────────────────────────────────────── */}
        <Panel 
          title="All Orders" 
          noTopPad
          badge={
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black" size={14} strokeWidth={3} />
                <input 
                  type="text" 
                  placeholder="Search orders..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-1.5 bg-gray-100 border-[2px] border-black font-body text-xs outline-none focus:bg-white transition-colors w-44 sm:w-64"
                />
              </div>
              <div className="relative">
                <select 
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-1.5 bg-gray-100 border-[2px] border-black font-display font-black text-[10px] uppercase outline-none cursor-pointer focus:bg-white transition-colors"
                >
                  <option>All Status</option>
                  <option>Pending</option>
                  <option>Confirmed</option>
                  <option>Dispatched</option>
                  <option>Delivered</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" size={14} strokeWidth={3} />
              </div>
              <button onClick={fetchData} className="p-1.5 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all active:bg-gray-100">
                <RefreshCw size={14} strokeWidth={3} className={isLoading ? "animate-spin" : ""} />
              </button>
            </div>
          }
        >
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_140px_100px] gap-4 px-6 py-4 border-b-[3px] border-black bg-black text-white font-display font-black text-[10px] uppercase tracking-widest min-w-[1000px]">
              <div>Order ID</div>
              <div>Customer</div>
              <div>Items</div>
              <div>Amount</div>
              <div>Date</div>
              <div>Status</div>
              <div className="text-right">Actions</div>
            </div>
            
            <div className="flex flex-col min-w-[1000px] min-h-[200px]">
              {isLoading ? (
                <div className="flex-1 flex flex-col items-center justify-center space-y-4 bg-white py-12">
                  <Loader2 size={32} className="animate-spin text-black" />
                  <p className="font-display font-black text-xs text-gray-400 uppercase tracking-widest">Loading...</p>
                </div>
              ) : filteredOrders.length > 0 ? (
                filteredOrders.map((order, i) => (
                  <div 
                    key={order._id || order.id}
                    className={`
                      grid grid-cols-[140px_1.5fr_1fr_1fr_1fr_140px_100px] gap-4 items-center px-6 py-5
                      ${i < filteredOrders.length - 1 ? "border-b-[2px] border-black" : ""}
                      bg-white hover:bg-nb-bg transition-colors duration-100 group
                    `}
                  >
                    <div className="font-mono text-sm font-black text-black underline decoration-black/20 group-hover:decoration-black">{order.po_id || order.id || 'PO-NEW'}</div>
                    <div className="font-body text-sm font-bold text-black">{order.customerName || order.customer}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{order.items?.length ? `${order.items.length} items` : (order.items || '0 items')}</div>
                    <div className="font-display font-black text-sm text-black">LKR {Number(order.total || order.amount || 0).toLocaleString()}</div>
                    <div className="font-mono text-xs font-bold text-gray-500">{new Date(order.date).toLocaleDateString()}</div>
                    
                    <div>
                      <span className={`px-3 py-1 border-[2px] border-black text-black font-display font-black text-[9px] uppercase shadow-[2px_2px_0px_0px_#000] ${BADGE_MAP[order.status?.toLowerCase()] || 'bg-gray-200'}`}>
                        {order.status}
                      </span>
                    </div>

                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => openDetails(order)}
                        className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" 
                        title="View Details"
                      >
                        <Eye size={14} strokeWidth={3} />
                      </button>
                      {order.status?.toLowerCase() === "pending" && (
                        <button 
                          onClick={() => {
                            setSelectedOrder(order)
                            setShowAcknowledgeModal(true)
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-nb-yellow border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" 
                          title="Acknowledge Order"
                        >
                          <CheckSquare size={14} strokeWidth={3} />
                        </button>
                      )}
                      {(order.status?.toLowerCase() === "confirmed" || order.status?.toLowerCase() === "preparing" || order.status?.toLowerCase() === "acknowledged") && (
                        <button 
                          onClick={() => handlePrepareDispatch(order._id || order.id)}
                          className="w-8 h-8 flex items-center justify-center bg-nb-cyan border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all" 
                          title="Prepare Dispatch"
                        >
                          <Truck size={14} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-20 flex flex-col items-center justify-center space-y-4 bg-white">
                  <div className="w-16 h-16 bg-nb-bg border-[3px] border-black flex items-center justify-center shadow-nb -rotate-3">
                    <ShoppingCart size={32} className="text-gray-400" strokeWidth={2} />
                  </div>
                  <p className="font-body font-bold text-sm text-gray-400 italic">No orders found.</p>
                </div>
              )}
            </div>
          </div>
        </Panel>
      </main>

      {/* ── DETAILS MODAL ────────────────────────────────────────────── */}
      {showDetailsModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-2xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-6 border-b-[3px] border-black bg-nb-cyan">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                  <ShoppingCart size={20} className="text-black" />
                </div>
                <h2 className="font-display font-black text-xl text-black">Order #{selectedOrder?.po_id || selectedOrder?.id}</h2>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)}
                className="w-10 h-10 bg-white border-[2px] border-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all active:bg-gray-100"
              >
                <X size={20} className="text-black" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto bg-[#fdfcfb]">
              {isLoadingDetail ? (
                <div className="py-20 flex flex-col items-center justify-center space-y-4">
                  <Loader2 size={40} className="animate-spin text-black" />
                  <p className="font-display font-black text-sm uppercase tracking-widest text-gray-500">Loading Details...</p>
                </div>
              ) : selectedOrder ? (
                <div className="space-y-8">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Order Date</p>
                      <p className="font-mono text-sm font-black text-black">{new Date(selectedOrder.date).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Expected Delivery</p>
                      <p className="font-mono text-sm font-black text-black">{selectedOrder.expectedDeliveryDate ? new Date(selectedOrder.expectedDeliveryDate).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div className="p-4 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Total Amount</p>
                      <p className="font-display font-black text-lg text-black">LKR {Number(selectedOrder.total || selectedOrder.amount || 0).toLocaleString()}</p>
                    </div>
                    <div className="p-4 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      <p className="font-display font-black text-[10px] text-gray-400 uppercase tracking-widest mb-1">Payment Terms</p>
                      <p className="font-body text-sm font-bold text-black">{selectedOrder.payment_terms || 'Net 30'}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-display font-black text-xs text-black uppercase tracking-widest mb-4 flex items-center gap-2">
                      <Package size={16} />
                      Items ({selectedOrder.items?.length || 0})
                    </h4>
                    <div className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                      <div className="overflow-x-auto">
                        <table className="w-full">
                          <thead className="bg-gray-50 border-b-[3px] border-black">
                            <tr>
                              <th className="px-4 py-3 text-left font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Item</th>
                              <th className="px-4 py-3 text-center font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Qty</th>
                              <th className="px-4 py-3 text-right font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Price</th>
                              <th className="px-4 py-3 text-right font-display font-black text-[10px] text-gray-500 uppercase tracking-widest">Subtotal</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y-[2px] divide-black/10">
                            {Array.isArray(selectedOrder.items) && selectedOrder.items.map((item: any, idx: number) => (
                              <tr key={idx} className="hover:bg-nb-bg transition-colors">
                                <td className="px-4 py-3 font-display font-bold text-sm text-black">{item.name}</td>
                                <td className="px-4 py-3 text-center font-mono font-bold text-sm text-black">{item.quantity}</td>
                                <td className="px-4 py-3 text-right font-mono font-bold text-sm text-gray-600">LKR {Number(item.price || 0).toLocaleString()}</td>
                                <td className="px-4 py-3 text-right font-mono font-black text-sm text-black">LKR {Number((item.price || 0) * (item.quantity || 0)).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>

                  {selectedOrder.status?.toLowerCase() === 'pending' && (
                    <div className="flex justify-end pt-4">
                      <button 
                        onClick={() => {
                          setShowDetailsModal(false)
                          setShowAcknowledgeModal(true)
                        }}
                        className="px-6 py-3 bg-nb-yellow border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-display font-black text-sm uppercase flex items-center gap-2"
                      >
                        <CheckSquare size={18} strokeWidth={3} />
                        Acknowledge Order
                      </button>
                    </div>
                  )}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

      {/* ── ACKNOWLEDGE MODAL ────────────────────────────────────────────── */}
      {showAcknowledgeModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-md flex flex-col">
            <div className="p-8 flex flex-col items-center text-center space-y-6">
              <div className="w-20 h-20 bg-nb-yellow border-[3px] border-black flex items-center justify-center shadow-[4px_4px_0px_0px_#000] rotate-3">
                <AlertCircle size={40} className="text-black" strokeWidth={2.5} />
              </div>
              <div>
                <h2 className="font-display font-black text-2xl text-black uppercase">Acknowledge Order</h2>
                <p className="font-body text-sm text-gray-600 mt-2">
                  Acknowledge order <span className="font-mono font-bold text-black border-b-2 border-black">{selectedOrder?.po_id || selectedOrder?.id}</span> and begin preparation?
                </p>
              </div>

              <div className="bg-nb-bg border-[2px] border-black p-4 text-xs font-body font-bold text-black text-left w-full shadow-[2px_2px_0px_0px_#000]">
                By acknowledging, you confirm receipt of this purchase order and commit to fulfilling the items listed within the expected delivery timeline.
              </div>

              <div className="flex gap-4 w-full pt-4">
                <button
                  onClick={() => setShowAcknowledgeModal(false)}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-display font-black text-sm uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAcknowledge}
                  disabled={isProcessing}
                  className="flex-1 py-3 bg-nb-cyan border-[3px] border-black shadow-[4px_4px_0px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all font-display font-black text-sm uppercase flex items-center justify-center gap-2"
                >
                  {isProcessing ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} strokeWidth={3} />}
                  Confirm
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

