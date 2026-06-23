"use client"

import { useState, useEffect } from "react"
import { Package, MapPin, Truck, CheckCircle2, Clock, Calendar, ChevronDown, CheckCircle, Loader2, X, Send, AlertCircle } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { getCustomerOrders, confirmDelivery } from "@/lib/api"

interface OrderItem {
  productID: string;
  name: string;
  price: number;
  quantity: number;
  issuedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  image: string;
}

interface Order {
  _id: string;
  orderID: string;
  status: string;
  orderDate: string;
  totalAmount: number;
  items?: OrderItem[];
  delivery?: {
    trackingNumber?: string;
    estimatedDeliveryDate?: string;
    deliveryAddress?: string;
  };
  statusDates?: any;
}

interface TimelineStep {
  name: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  notes?: string;
}

export default function DeliveryTrackingPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrderId, setSelectedOrderId] = useState<string>("")
  const [loading, setLoading] = useState(true)
  
  const [confirmModalOpen, setConfirmModalOpen] = useState(false)
  const [receivedData, setReceivedData] = useState<{ [key: string]: number }>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const fetchOrders = async () => {
    const userDataString = localStorage.getItem('user');
    const userData = userDataString ? JSON.parse(userDataString) : null;
    const customerId = localStorage.getItem('customID') || userData?.customID || userData?.id || userData?._id;
    const userEmail = userData?.email || localStorage.getItem('userEmail');
    const fetchId = customerId || userEmail;

    if (!fetchId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const fetchedOrders = await getCustomerOrders(fetchId) as unknown as Order[];
      
      const trackingStr = localStorage.getItem('client_side_delivery_tracking_v1');
      const tracking = trackingStr ? JSON.parse(trackingStr) : {};
      
      const updatedOrders = fetchedOrders.map((o: any) => {
        let orderWithTracking = { ...o };
        
        // Merge tracking info
        const orderId = o.orderID || o.id || o._id;
        const savedOrder = tracking[orderId] || tracking[o._id] || tracking[o.orderID];
        if (savedOrder && savedOrder.items) {
          orderWithTracking.items = (o.items || []).map((item: any) => {
            const savedItem = savedOrder.items[item.productID];
            if (savedItem) {
              return {
                ...item,
                issuedQuantity: typeof savedItem.issuedQuantity === 'number' ? savedItem.issuedQuantity : item.issuedQuantity,
                receivedQuantity: typeof savedItem.receivedQuantity === 'number' ? savedItem.receivedQuantity : item.receivedQuantity,
                rejectedQuantity: typeof savedItem.rejectedQuantity === 'number' ? savedItem.rejectedQuantity : item.rejectedQuantity,
                restocked: typeof savedItem.restocked === 'boolean' ? savedItem.restocked : item.restocked,
              };
            }
            return item;
          });
        }
        return orderWithTracking;
      });

      setOrders(updatedOrders);
      if (updatedOrders.length > 0 && !selectedOrderId) {
        setSelectedOrderId(updatedOrders[0]._id);
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const selectedOrder = orders.find(o => o._id === selectedOrderId);

  const handleOpenConfirmModal = () => {
    if (!selectedOrder || !selectedOrder.items) return;
    const initialData: { [key: string]: number } = {};
    selectedOrder.items.forEach(item => {
      initialData[item.productID] = item.issuedQuantity || item.quantity;
    });
    setReceivedData(initialData);
    setConfirmModalOpen(true);
  };

  const handleReceivedChange = (productID: string, value: number, max: number) => {
    setReceivedData(prev => ({
      ...prev,
      [productID]: Math.min(Math.max(0, value), max)
    }));
  };

  const handleSubmitConfirmation = async () => {
    if (!selectedOrder) return;
    try {
      setIsSubmitting(true);
      const receivedItems = Object.entries(receivedData).map(([productID, receivedQuantity]) => ({
        productID,
        receivedQuantity
      }));

      await confirmDelivery(selectedOrder._id, { receivedItems });

      // Save confirmation items to localStorage
      const trackingStr = localStorage.getItem('client_side_delivery_tracking_v1');
      const tracking = trackingStr ? JSON.parse(trackingStr) : {};
      const orderId = selectedOrder.orderID || selectedOrder._id;
      if (!tracking[orderId]) {
        tracking[orderId] = { items: {} };
      }
      if (!tracking[selectedOrder._id]) {
        tracking[selectedOrder._id] = { items: {} };
      }

      (selectedOrder.items || []).forEach((item) => {
        const rQty = receivedData[item.productID] ?? (item.issuedQuantity || item.quantity);
        const issuedQty = item.issuedQuantity || item.quantity;
        const rejQty = Math.max(0, issuedQty - rQty);
        
        const itemTracking = {
          issuedQuantity: issuedQty,
          receivedQuantity: rQty,
          rejectedQuantity: rejQty,
        };

        tracking[orderId].items[item.productID] = itemTracking;
        tracking[selectedOrder._id].items[item.productID] = itemTracking;
      });

      localStorage.setItem('client_side_delivery_tracking_v1', JSON.stringify(tracking));

      alert("Delivery confirmed successfully");
      setConfirmModalOpen(false);
      fetchOrders();
    } catch (err) {
      console.error("Error confirming delivery:", err);
      alert("Failed to confirm delivery");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTimeline = (status: string | undefined, statusDates?: any): TimelineStep[] => {
    if (!status) return [];
    const s = status.toLowerCase();
    
    return [
      { name: 'Order Placed', status: 'completed', date: selectedOrder?.orderDate ? new Date(selectedOrder.orderDate).toLocaleDateString() : '' },
      { name: 'Processing', status: (s === 'pending' || s === 'processing') ? 'current' : 'completed' },
      { name: 'Dispatched', status: (s === 'dispatched' || s === 'partially-issued') ? 'current' : (s === 'in-transit' || s === 'delivered' || s === 'completed' ? 'completed' : 'pending'), 
        date: statusDates?.dispatchedDate ? new Date(statusDates.dispatchedDate).toLocaleDateString() : undefined },
      { name: 'In Transit', status: s === 'in-transit' ? 'current' : (s === 'delivered' || s === 'completed' ? 'completed' : 'pending'),
        date: statusDates?.inTransitDate ? new Date(statusDates.inTransitDate).toLocaleDateString() : undefined },
      { name: 'Delivered', status: (s === 'delivered' || s === 'completed') ? 'completed' : 'pending',
        date: statusDates?.deliveredDate ? new Date(statusDates.deliveredDate).toLocaleDateString() : undefined },
    ];
  };

  const timeline = selectedOrder ? getTimeline(selectedOrder.status, selectedOrder.statusDates) : [];

  if (loading && orders.length === 0) {
    return (
      <>
        <DashboardHeader title="Delivery Tracking" />
        <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg flex items-center justify-center">
          <div className="flex flex-col items-center gap-3">
             <Loader2 className="w-10 h-10 animate-spin text-black" />
             <p className="font-body font-bold text-sm uppercase tracking-wider text-black">Syncing Deliveries...</p>
          </div>
        </main>
      </>
    )
  }

  return (
    <>
      <DashboardHeader title="Delivery Tracking" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg relative">

        {/* ── ORDER SELECTOR ────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-6 relative">
          <div className="flex items-center gap-3 mb-4">
            <Package size={20} strokeWidth={2.5} className="text-black" />
            <h2 className="font-display font-black text-sm uppercase tracking-widest">Select Order to Track</h2>
          </div>
          <div className="relative">
            <select
              value={selectedOrderId}
              onChange={e => setSelectedOrderId(e.target.value)}
              className="w-full appearance-none px-4 py-3 bg-nb-yellow border-[2px] border-black font-body font-bold text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all cursor-pointer"
            >
              {orders.length === 0 ? (
                <option value="">No orders found</option>
              ) : (
                orders.map(o => (
                  <option key={o._id} value={o._id}>{o.orderID} — {o.orderDate ? new Date(o.orderDate).toLocaleDateString() : ''} — {o.status}</option>
                ))
              )}
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={16} strokeWidth={2.5} />
          </div>
        </section>

        {selectedOrder ? (
          <>
            {/* ── DETAILS GRID ──────────────────────────────────────── */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Delivery details */}
              <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                <div className="bg-black px-5 py-3 flex items-center gap-3">
                  <MapPin size={16} strokeWidth={2.5} className="text-white" />
                  <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Delivery Details</h2>
                </div>
                <div className="p-5 space-y-5">
                  {[
                    ["Tracking Number", selectedOrder.delivery?.trackingNumber || "Awaiting Dispatch"],
                    ["Estimated Delivery", selectedOrder.delivery?.estimatedDeliveryDate ? new Date(selectedOrder.delivery.estimatedDeliveryDate).toLocaleDateString() : "To be announced"],
                    ["Delivery Address", selectedOrder.delivery?.deliveryAddress || "Address on file"],
                  ].map(([label, value]) => (
                    <div key={label} className="border-l-[3px] border-nb-cyan pl-4">
                      <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                      <p className="font-body font-bold text-sm text-black whitespace-pre-wrap">{value}</p>
                    </div>
                  ))}
                </div>
              </section>

              {/* Order summary */}
              <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                <div className="bg-black px-5 py-3 flex items-center gap-3">
                  <Package size={16} strokeWidth={2.5} className="text-white" />
                  <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Order Summary</h2>
                </div>
                <div className="p-5 space-y-5">
                  {[
                    ["Order ID", selectedOrder.orderID],
                    ["Total Items", `${selectedOrder.items?.length || 0} items`],
                    ["Order Amount", `LKR ${selectedOrder.totalAmount?.toLocaleString() || 0}`],
                  ].map(([label, value]) => (
                    <div key={label} className="border-l-[3px] border-nb-green pl-4">
                      <p className="font-body font-bold text-[10px] uppercase tracking-widest text-gray-500 mb-1">{label}</p>
                      <p className="font-body font-bold text-sm text-black">{value}</p>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            {/* ── DELIVERY TIMELINE ─────────────────────────────────── */}
            <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
              <div className="bg-black px-5 py-3 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <Truck size={16} strokeWidth={2.5} className="text-white" />
                  <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Delivery Timeline</h2>
                </div>
                {(selectedOrder.status.toLowerCase() === 'dispatched' || 
                  selectedOrder.status.toLowerCase() === 'in-transit' ||
                  selectedOrder.status.toLowerCase() === 'partially-issued') && (
                  <button 
                    onClick={handleOpenConfirmModal}
                    className="flex items-center gap-2 px-3 py-1.5 bg-nb-green border-[2px] border-black font-body font-bold text-[10px] uppercase tracking-widest text-black hover:translate-y-[2px] hover:shadow-none shadow-[2px_2px_0px_0px_#000] transition-all"
                  >
                    <CheckCircle size={12} strokeWidth={2.5} />
                    Confirm Receipt
                  </button>
                )}
              </div>
              <div className="p-6 space-y-4">
                {timeline.map((step, i) => (
                  <div key={i} className="flex gap-4">
                    {/* Step indicator */}
                    <div className="flex flex-col items-center">
                      <div className={`w-8 h-8 border-[2px] border-black flex items-center justify-center shrink-0 shadow-[2px_2px_0px_0px_#000] ${step.status === 'completed' ? "bg-nb-green" : step.status === 'current' ? "bg-nb-cyan" : "bg-white"}`}>
                        {step.status === 'completed'
                          ? <CheckCircle2 size={16} strokeWidth={2.5} className="text-black" />
                          : step.status === 'current'
                          ? <Clock size={16} strokeWidth={2.5} className="text-black" />
                          : <div className="w-2 h-2 bg-gray-400" />
                        }
                      </div>
                      {i < timeline.length - 1 && (
                        <div className={`w-0.5 flex-1 mt-1 min-h-[24px] ${step.status === 'completed' ? "bg-nb-green" : "bg-gray-300"}`} />
                      )}
                    </div>
                    {/* Step content */}
                    <div className={`flex-1 border-[2px] border-black p-4 mb-4 ${step.status === 'completed' ? "bg-nb-green/20" : step.status === 'current' ? "bg-nb-cyan/30" : "bg-nb-bg"}`}>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="font-display font-black text-sm text-black">{step.name}</p>
                          <p className="font-body text-xs text-gray-600 mt-1">{step.notes || (step.status === 'completed' ? 'Completed' : step.status === 'current' ? 'Currently in this stage' : 'Awaiting')}</p>
                        </div>
                        {step.date && (
                          <span className="flex items-center gap-1 font-mono text-[13px] font-bold text-black shrink-0">
                            <Calendar size={10} strokeWidth={2.5} /> {step.date}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── RECEIVED ITEMS STATUS ─────────────────────────────────── */}
            {selectedOrder.status.toLowerCase() === 'delivered' && selectedOrder.items && (
              <section className="bg-white border-[3px] border-black shadow-[4px_4px_0px_0px_#000] overflow-hidden">
                <div className="bg-black px-5 py-3 flex items-center gap-3">
                  <Package size={16} strokeWidth={2.5} className="text-white" />
                  <h2 className="font-display font-black text-xs text-white uppercase tracking-[0.15em]">Received Items Details</h2>
                </div>
                <div className="overflow-x-auto">
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-6 py-3 border-b-[2px] border-black bg-nb-bg min-w-[600px]">
                    {["Item", "Issued", "Accepted", "Rejected"].map(h => (
                      <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
                    ))}
                  </div>
                  <div className="min-w-[600px]">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className={`grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-4 hover:bg-nb-yellow/20 transition-colors ${idx < selectedOrder.items!.length - 1 ? "border-b-[2px] border-black" : ""}`}>
                        <div className="font-mono text-sm font-bold text-black">{item.name}</div>
                        <div className="font-mono text-sm text-black">{item.issuedQuantity || item.quantity}</div>
                        <div className="font-mono text-sm font-bold text-nb-green">{item.receivedQuantity || 0}</div>
                        <div className="font-mono text-sm font-bold text-red-500">{item.rejectedQuantity || 0}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            )}
          </>
        ) : (
          <div className="text-center py-12 text-black/50 font-body font-bold text-sm">
            Select an order above to track its status.
          </div>
        )}
      </main>

      {/* ── CONFIRM RECEIPT MODAL ──────────────────────────────────────── */}
      {confirmModalOpen && selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-3xl max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between p-4 border-b-[3px] border-black bg-nb-yellow shrink-0">
              <h3 className="font-display font-black text-lg uppercase tracking-wider flex items-center gap-2">
                <CheckCircle size={18} strokeWidth={3} className="text-black" />
                Confirm Delivery Receipt
              </h3>
              <button 
                onClick={() => setConfirmModalOpen(false)}
                className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-none transition-all"
              >
                <X size={16} strokeWidth={3} />
              </button>
            </div>
            
            <div className="p-6 overflow-y-auto space-y-6">
              <p className="font-body text-sm font-bold text-black">
                Please verify the items received. If any item is missing or damaged, you can reject the specific quantity.
              </p>

              <div className="border-[2px] border-black overflow-x-auto shadow-[4px_4px_0px_0px_#000]">
                <div className="grid grid-cols-[2fr_1fr_1fr_1fr] px-4 py-3 border-b-[2px] border-black bg-nb-bg min-w-[500px]">
                  {["Item Name", "Issued Qty", "Accepted Qty", "Rejected"].map(h => (
                    <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
                  ))}
                </div>
                <div className="min-w-[500px]">
                  {selectedOrder.items?.map((item, idx) => {
                    const maxQty = item.issuedQuantity || item.quantity;
                    const currentValue = receivedData[item.productID] ?? maxQty;
                    return (
                      <div key={item.productID} className={`grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-4 py-3 ${idx < selectedOrder.items!.length - 1 ? "border-b-[2px] border-black" : ""}`}>
                        <div className="font-mono text-xs font-bold text-black">{item.name}</div>
                        <div className="font-mono text-sm text-black pl-2">{maxQty}</div>
                        <div className="pr-4">
                          <input 
                            type="number"
                            min="0"
                            max={maxQty}
                            value={currentValue}
                            onChange={(e) => handleReceivedChange(item.productID, parseInt(e.target.value) ?? 0, maxQty)}
                            className="w-full px-2 py-1 bg-white border-[2px] border-black font-mono text-sm shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-none transition-all"
                          />
                        </div>
                        <div className="font-mono text-sm font-bold text-red-500 pl-2">
                          {maxQty - currentValue}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="p-4 bg-nb-orange border-[2px] border-black shadow-[4px_4px_0px_0px_#000] flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-black shrink-0 mt-0.5" />
                <p className="font-body text-xs font-bold text-black leading-relaxed">
                  WARNING: Once you submit this confirmation, the record will be final. Any rejected items will be reported back to the administrator.
                </p>
              </div>
            </div>

            <div className="p-4 border-t-[3px] border-black bg-nb-bg flex justify-end gap-3 shrink-0">
              <button 
                onClick={() => setConfirmModalOpen(false)}
                className="px-6 py-2 bg-white border-[2px] border-black font-display font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSubmitConfirmation} 
                disabled={isSubmitting}
                className="flex items-center gap-2 px-6 py-2 bg-black text-white font-display font-black text-xs uppercase tracking-widest hover:bg-black/90 transition-colors disabled:opacity-50"
              >
                {isSubmitting ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
                Submit Confirmation
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}