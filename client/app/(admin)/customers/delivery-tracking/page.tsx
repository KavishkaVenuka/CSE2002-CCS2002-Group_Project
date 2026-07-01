'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Truck, CheckCircle, Clock, Package, Loader2, Send, AlertCircle, Receipt, X } from 'lucide-react';
import { toast } from 'sonner';

// 1. Define the Data Interface
interface OrderItem {
  productID: string;
  name: string;
  price: number;
  quantity: number;
  issuedQuantity: number;
  receivedQuantity: number;
  rejectedQuantity: number;
  restocked: boolean;
  image: string;
}

interface Delivery {
  id: string; // This is the orderID (e.g., ORD-001)
  _id: string; // MongoDB ID
  customer: string;
  email?: string;
  status: string;
  orderDate: string;
  totalAmount: number;
  totalItems: number;
  items: OrderItem[];
  invoiced: boolean;
}

export default function CustomerDeliveryTracking() {
  const router = useRouter();
  const [deliveries, setDeliveries] = useState<Delivery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedOrder, setSelectedOrder] = useState<Delivery | null>(null);
  const [issueModalOpen, setIssueModalOpen] = useState(false);
  const [issuingData, setIssuingData] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getAuthHeader = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token || localStorage.getItem('token') || '';
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch { return {}; }
  };

  // 2. Fetch Data Logic
  const fetchDeliveries = async () => {
    try {
      setIsLoading(true);
      const response = await axios.get('http://localhost:5900/api/orders', { headers: getAuthHeader() });

      
      const invoicedOrdersStr = localStorage.getItem('client_side_invoiced_orders');
      const invoicedOrders = invoicedOrdersStr ? JSON.parse(invoicedOrdersStr) : {};
      
      const trackingStr = localStorage.getItem('client_side_delivery_tracking_v1');
      const tracking = trackingStr ? JSON.parse(trackingStr) : {};
      
      const updatedDeliveries = response.data.map((d: any) => {
        let orderWithTracking = { ...d };
        if (invoicedOrders[d._id] || invoicedOrders[d.id]) {
          orderWithTracking.invoiced = true;
        }
        
        // Merge tracking info
        const orderId = d.id || d._id;
        const savedOrder = tracking[orderId] || tracking[d._id];
        if (savedOrder && savedOrder.items) {
          orderWithTracking.items = d.items.map((item: any) => {
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
      
      setDeliveries(updatedDeliveries);
      setError(null);
    } catch (err) {
      console.error("Error fetching deliveries:", err);
      setError('Failed to load delivery data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDeliveries();
  }, []);

  const handleOpenIssueModal = (order: Delivery) => {
    setSelectedOrder(order);
    const initialIssuingData: { [key: string]: number } = {};
    order.items.forEach(item => {
      initialIssuingData[item.productID] = 0; // Default to 0
    });
    setIssuingData(initialIssuingData);
    setIssueModalOpen(true);
  };

  const handleIssuingChange = (productID: string, value: number, max: number) => {
    setIssuingData(prev => ({
      ...prev,
      [productID]: Math.min(Math.max(0, value), max)
    }));
  };

  const handleSubmitIssuing = async () => {
    if (!selectedOrder) return;

    try {
      setIsSubmitting(true);
      const issuedItems = Object.entries(issuingData)
        .filter(([_, qty]) => qty > 0)
        .map(([productID, quantityToIssue]) => ({
          productID,
          quantityToIssue
        }));

      if (issuedItems.length === 0) {
        toast.error("Please specify items to issue");
        setIsSubmitting(false);
        return;
      }

      await axios.put(`http://localhost:5900/api/orders/${selectedOrder._id}/issue-items`, {
        issuedItems
      }, { headers: getAuthHeader() });

      // Save to localStorage
      const trackingStr = localStorage.getItem('client_side_delivery_tracking_v1');
      const tracking = trackingStr ? JSON.parse(trackingStr) : {};
      const orderId = selectedOrder.id || selectedOrder._id;
      if (!tracking[orderId]) {
        tracking[orderId] = { items: {} };
      }
      if (!tracking[selectedOrder._id]) {
        tracking[selectedOrder._id] = { items: {} };
      }

      selectedOrder.items.forEach((item) => {
        const quantityToIssue = issuingData[item.productID] || 0;
        const currentIssued = item.issuedQuantity || 0;
        const newIssued = currentIssued + quantityToIssue;
        
        const itemTracking = {
          issuedQuantity: newIssued,
          receivedQuantity: item.receivedQuantity || 0,
          rejectedQuantity: item.rejectedQuantity || 0,
          restocked: item.restocked || false,
        };

        tracking[orderId].items[item.productID] = itemTracking;
        tracking[selectedOrder._id].items[item.productID] = itemTracking;
      });

      localStorage.setItem('client_side_delivery_tracking_v1', JSON.stringify(tracking));

      toast.success("Stock issued successfully");
      setIssueModalOpen(false);
      fetchDeliveries(); // Refresh data
    } catch (err) {
      console.error("Error issuing stock:", err);
      toast.error("Failed to issue stock");
    } finally {
      setIsSubmitting(false);
    }
  };

  const [restockLoading, setRestockLoading] = useState<string | null>(null);

  const handleRestock = async (orderId: string, productID: string) => {
    try {
      setRestockLoading(`${orderId}-${productID}`);
      const response = await axios.put(`http://localhost:5900/api/orders/restock-rejected/${orderId}`, {
        productID
      }, { headers: getAuthHeader() });
      
      if (response.data) {
        // Update localStorage
        const trackingStr = localStorage.getItem('client_side_delivery_tracking_v1');
        if (trackingStr) {
          const tracking = JSON.parse(trackingStr);
          const deliveryObj = deliveries.find(d => d._id === orderId || d.id === orderId);
          const ids = [orderId];
          if (deliveryObj) {
            ids.push(deliveryObj.id);
            ids.push(deliveryObj._id);
          }
          ids.forEach(id => {
            if (tracking[id] && tracking[id].items && tracking[id].items[productID]) {
              tracking[id].items[productID].restocked = true;
            }
          });
          localStorage.setItem('client_side_delivery_tracking_v1', JSON.stringify(tracking));
        }

        toast.success("Item restocked and added back to inventory");
        fetchDeliveries();
      }
    } catch (err: any) {
      console.error("Error restocking:", err);
      const errorMsg = err.response?.data?.message || "Failed to restock item";
      toast.error(errorMsg);
    } finally {
      setRestockLoading(null);
    }
  };

  const handleCreateInvoice = async (order: Delivery) => {
    try {
      setIsSubmitting(true);
      
      // Calculate total based on received items
      let calculatedTotal = 0;
      const invoiceItems = order.items.map(item => {
        const qty = item.receivedQuantity || item.quantity || 0;
        const price = item.price || 0;
        const itemTotal = qty * price;
        calculatedTotal += itemTotal;
        return {
          itemName: item.name,
          quantity: qty,
          unitPrice: price,
          totalPrice: itemTotal
        };
      });

      const tax = calculatedTotal * 0.1; // 10% tax
      const grandTotal = calculatedTotal + tax;

      // Construct a mockup of invoice object
      const mockInvoice = {
        _id: `mock-${Date.now()}`,
        invoiceID: `INV-${Date.now()}`,
        orderID: order.id,
        email: (order.email || order.customer || '').toLowerCase(),
        date: new Date().toISOString(),
        total: grandTotal,
        status: "unpaid",
        invoiceType: "customer",
        payment_status: "unpaid",
        items: invoiceItems,
        subtotal: calculatedTotal,
        tax_amount: tax,
        due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      // 1. Save invoice to client_side_generated_invoices in localStorage
      const localGeneratedInvoicesStr = localStorage.getItem('client_side_generated_invoices');
      const localGeneratedInvoices = localGeneratedInvoicesStr ? JSON.parse(localGeneratedInvoicesStr) : [];
      localGeneratedInvoices.push(mockInvoice);
      localStorage.setItem('client_side_generated_invoices', JSON.stringify(localGeneratedInvoices));

      // 2. Mark order as invoiced locally
      const invoicedOrdersStr = localStorage.getItem('client_side_invoiced_orders');
      const invoicedOrders = invoicedOrdersStr ? JSON.parse(invoicedOrdersStr) : {};
      invoicedOrders[order._id] = true;
      invoicedOrders[order.id] = true;
      localStorage.setItem('client_side_invoiced_orders', JSON.stringify(invoicedOrders));

      toast.success(`Invoice created successfully for ${order.id}`);
      fetchDeliveries(); // Refresh status
      router.push('/customers/invoices');
    } catch (err: any) {
      console.error("Error creating invoice:", err);
      toast.error("Failed to create invoice");
    } finally {
      setIsSubmitting(false);
    }
  };

  // 3. Derived Stats
  const stats = [
    { label: 'Total Orders', count: deliveries.length, bg: 'bg-nb-cyan', icon: Truck },
    { label: 'In Transit', count: deliveries.filter(d => d.status === 'in-transit').length, bg: 'bg-nb-yellow', icon: Clock },
    { label: 'Delivered', count: deliveries.filter(d => d.status === 'delivered').length, bg: 'bg-nb-green', icon: CheckCircle },
    { label: 'Pending Dispatch', count: deliveries.filter(d => d.status === 'pending' || d.status === 'partially-issued').length, bg: 'bg-purple-300', icon: Package },
  ];

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <span className="nb-badge bg-nb-green text-nb-black">DELIVERED</span>;
      case 'in-transit':
        return <span className="nb-badge bg-nb-yellow text-nb-black">IN TRANSIT</span>;
      case 'dispatched':
        return <span className="nb-badge bg-purple-300 text-nb-black">DISPATCHED</span>;
      case 'partially-issued':
        return <span className="nb-badge bg-orange-300 text-nb-black">PARTIAL</span>;
      default:
        return <span className="nb-badge bg-gray-200 text-nb-black uppercase">{status}</span>;
    }
  };

  const getProgress = (order: Delivery) => {
    const totalOrdered = order.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalIssued = order.items.reduce((sum, item) => sum + (item.issuedQuantity || 0), 0);
    return totalOrdered > 0 ? (totalIssued / totalOrdered) * 100 : 0;
  };

  // Show order in rejections section if it has ANY rejections (even if already restocked, until it is invoiced/resolved)
  const rejectedDeliveries = deliveries.filter(d => d.items.some(item => (item.rejectedQuantity || 0) > 0));

  const inputStyle = "border-2 border-nb-black focus:outline-none font-bold text-nb-black shadow-[2px_2px_0px_0px_#000] px-4 py-2 bg-white";

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
        
        {/* Header Section */}
        <div className="relative border-4 border-nb-black bg-nb-cyan p-10 shadow-nb-lg">
          <div className="relative z-10">
            <span className="nb-badge bg-white text-nb-black mb-4">Customer Management</span>
            <h1 className="text-5xl font-black uppercase font-display tracking-tight text-nb-black">
              Delivery Tracking
            </h1>
            <p className="mt-4 font-bold text-nb-black text-lg max-w-2xl border-l-4 border-nb-black pl-4 bg-white/50 py-2 uppercase">
              Track order delivery status and issue stock for dispatch
            </p>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {stats.map((stat) => (
            <div key={stat.label} className={`border-4 border-nb-black ${stat.bg} p-6 shadow-nb flex flex-col justify-between`}>
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 bg-white border-4 border-nb-black flex items-center justify-center shadow-nb-sm">
                  <stat.icon className="w-6 h-6 text-nb-black" strokeWidth={3} />
                </div>
              </div>
              <div>
                <h3 className="text-sm font-black uppercase tracking-widest text-nb-black mb-1">{stat.label}</h3>
                <p className="text-4xl font-black text-nb-black font-display">
                  {isLoading ? "..." : stat.count}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Rejected Items Handling */}
        {rejectedDeliveries.length > 0 && (
          <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
            <div className="bg-nb-red px-8 py-6 border-b-4 border-nb-black flex items-center gap-3">
              <AlertCircle className="w-8 h-8 text-white" strokeWidth={3} />
              <h3 className="font-black uppercase font-display text-2xl text-white">Delivery Exceptions & Rejections</h3>
            </div>
            <div className="p-8 space-y-6 bg-red-50">
              {rejectedDeliveries.map(order => {
                const hasPendingRestock = order.items.some(i => (i.rejectedQuantity || 0) > 0 && !i.restocked);
                return (
                  <div key={order._id} className="border-4 border-nb-black bg-white shadow-nb p-6">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b-4 border-nb-black">
                      <div>
                        <div className="font-black text-2xl uppercase tracking-tight text-nb-black mb-1">
                          Order: <span className="bg-nb-yellow px-2 border-2 border-nb-black">{order.id}</span> - {order.customer}
                        </div>
                        <div className="font-bold text-gray-500 uppercase">Status: {order.status}</div>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="font-bold text-sm uppercase bg-white border-2 border-nb-black px-3 py-1 shadow-nb-sm">
                          {new Date(order.orderDate).toLocaleDateString()}
                        </span>
                        {!hasPendingRestock && !order.invoiced && (
                          <button 
                            className="px-4 py-2 border-4 border-nb-black bg-nb-cyan text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2"
                            onClick={() => handleCreateInvoice(order)}
                          >
                            <Receipt className="w-5 h-5" />
                            Create Invoice
                          </button>
                        )}
                      </div>
                    </div>
                    
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-nb-bg border-b-4 border-nb-black">
                          <tr>
                            <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black">Item Name</th>
                            <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center">Issued</th>
                            <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center text-nb-red">Rejected</th>
                            <th className="p-4 font-black uppercase text-sm text-right">Action</th>
                          </tr>
                        </thead>
                        <tbody>
                          {order.items.filter(i => (i.rejectedQuantity || 0) > 0).map(item => (
                            <tr key={item.productID} className="border-b-2 border-nb-black last:border-0 hover:bg-nb-bg">
                              <td className="p-4 font-bold text-lg border-r-2 border-nb-black">{item.name}</td>
                              <td className="p-4 font-black text-xl text-center border-r-2 border-nb-black">{item.issuedQuantity}</td>
                              <td className="p-4 font-black text-xl text-center text-nb-red border-r-2 border-nb-black">{item.rejectedQuantity}</td>
                              <td className="p-4 text-right">
                                {item.restocked ? (
                                  <span className="nb-badge bg-nb-green text-nb-black flex justify-center items-center gap-2 max-w-max ml-auto">
                                    <CheckCircle className="w-4 h-4" strokeWidth={3} /> Restocked
                                  </span>
                                ) : (
                                  <button 
                                    className="px-4 py-2 border-2 border-nb-black bg-nb-green text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center justify-center gap-2 ml-auto"
                                    onClick={() => handleRestock(order._id, item.productID)}
                                    disabled={restockLoading === `${order._id}-${item.productID}`}
                                  >
                                    {restockLoading === `${order._id}-${item.productID}` ? (
                                      <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                      <>
                                        <CheckCircle className="w-5 h-5" strokeWidth={3} />
                                        Accept & Restock
                                      </>
                                    )}
                                  </button>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Main Table */}
        <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
          <div className="bg-nb-yellow px-8 py-6 border-b-4 border-nb-black flex items-center gap-3">
            <Truck className="w-8 h-8 text-nb-black" strokeWidth={3} />
            <h3 className="font-black uppercase font-display text-2xl text-nb-black">Delivery Status</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-nb-bg border-b-4 border-nb-black">
                <tr>
                  <th className="py-5 pl-8 pr-4 font-black uppercase text-sm border-r-2 border-nb-black">Order ID</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Customer</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Status</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Issuing Progress</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Date</th>
                  <th className="py-5 pr-8 pl-4 font-black uppercase text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 font-black uppercase tracking-widest text-lg text-nb-black">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-nb-black border-t-nb-yellow rounded-full animate-spin"></div>
                        Loading deliveries...
                      </div>
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 font-black uppercase tracking-widest text-2xl text-nb-red">
                      {error}
                    </td>
                  </tr>
                ) : deliveries.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-20 font-black uppercase tracking-widest text-2xl text-gray-500">
                      No orders found.
                    </td>
                  </tr>
                ) : (
                  deliveries.map((delivery) => (
                    <tr key={delivery._id} className="hover:bg-nb-bg transition-colors border-b-2 border-nb-black last:border-0">
                      <td className="py-5 pl-8 pr-4 font-black text-lg border-r-2 border-nb-black">{delivery.id}</td>
                      <td className="p-5 font-bold text-lg border-r-2 border-nb-black">{delivery.customer}</td>
                      <td className="p-5 border-r-2 border-nb-black">
                        {getStatusBadge(delivery.status)}
                      </td>
                      <td className="p-5 border-r-2 border-nb-black">
                        <div className="flex flex-col gap-2">
                          <span className="text-sm font-black uppercase">
                            {Math.round(getProgress(delivery))}% Issued
                          </span>
                          <div className="w-32 h-3 bg-white border-2 border-nb-black shadow-[2px_2px_0px_0px_#000] overflow-hidden">
                            <div 
                              className="h-full bg-nb-cyan border-r-2 border-nb-black" 
                              style={{ width: `${getProgress(delivery)}%` }}
                            />
                          </div>
                        </div>
                      </td>
                      <td className="p-5 font-bold uppercase text-gray-600 border-r-2 border-nb-black">{new Date(delivery.orderDate).toLocaleDateString()}</td>
                      <td className="py-5 pr-8 pl-4 text-right">
                        <div className="flex justify-end">
                          {delivery.status.toLowerCase() === 'delivered' ? (
                            !delivery.invoiced && (
                              <button 
                                onClick={() => handleCreateInvoice(delivery)}
                                className="px-4 py-2 border-2 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2"
                              >
                                <Receipt className="w-5 h-5" />
                                Create Invoice
                              </button>
                            )
                          ) : (
                            <button 
                              disabled={delivery.status.toLowerCase() === 'dispatched'}
                              onClick={() => handleOpenIssueModal(delivery)}
                              className="px-4 py-2 border-2 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 disabled:opacity-50"
                            >
                              <Package className="w-5 h-5" />
                              Issue Stock
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Issue Stock Modal */}
      {issueModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white border-4 border-nb-black shadow-nb-xl w-full max-w-2xl flex flex-col max-h-[90vh]">
            <div className="bg-nb-cyan border-b-4 border-nb-black p-6 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-black uppercase font-display flex items-center gap-3">
                <Package className="w-8 h-8" /> Issue Stock: {selectedOrder?.id}
              </h2>
              <button onClick={() => setIssueModalOpen(false)} className="bg-white border-2 border-nb-black p-1 shadow-nb-sm nb-interactive">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto bg-nb-bg flex-1">
              <div className="border-4 border-nb-black bg-white shadow-nb overflow-hidden mb-6">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-100 border-b-4 border-nb-black">
                    <tr>
                      <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black">Item Name</th>
                      <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center">Ordered</th>
                      <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center">Issued</th>
                      <th className="p-4 font-black uppercase text-sm text-center">Issue Now</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedOrder?.items.map((item) => (
                      <tr key={item.productID} className="border-b-2 border-nb-black last:border-0 hover:bg-nb-bg">
                        <td className="p-4 font-bold text-lg border-r-2 border-nb-black">{item.name}</td>
                        <td className="p-4 font-black text-xl text-center border-r-2 border-nb-black">{item.quantity}</td>
                        <td className="p-4 font-black text-xl text-center border-r-2 border-nb-black">{item.issuedQuantity || 0}</td>
                        <td className="p-4 text-center">
                          <input 
                            type="number"
                            min="0"
                            max={item.quantity - (item.issuedQuantity || 0)}
                            value={issuingData[item.productID] || 0}
                            onChange={(e) => handleIssuingChange(item.productID, parseInt(e.target.value) || 0, item.quantity - (item.issuedQuantity || 0))}
                            className={`${inputStyle} w-24 text-center mx-auto`}
                            disabled={item.issuedQuantity >= item.quantity}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="p-6 bg-nb-yellow border-4 border-nb-black shadow-nb flex items-start gap-4">
                <AlertCircle className="w-8 h-8 shrink-0 text-nb-black" strokeWidth={3} />
                <p className="font-bold text-lg uppercase text-nb-black">
                  Specify the quantities you are issuing for delivery. Once all items are fully issued, the order status will change to "Dispatched".
                </p>
              </div>
            </div>

            <div className="flex p-6 border-t-4 border-nb-black gap-4 bg-gray-50 shrink-0">
              <button onClick={() => setIssueModalOpen(false)} className="flex-1 border-4 border-nb-black bg-white font-black uppercase py-4 shadow-nb nb-interactive">
                Cancel
              </button>
              <button 
                onClick={handleSubmitIssuing} 
                disabled={isSubmitting}
                className="flex-1 border-4 border-nb-black bg-nb-green font-black uppercase py-4 shadow-nb nb-interactive flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-6 h-6 animate-spin" />
                    Processing...
                  </>
                ) : (
                  <>
                    <Send className="w-6 h-6" />
                    Confirm Issue
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}