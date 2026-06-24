'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import {
  FileText,
  Search,
  Eye,
  Download,
  Truck,
  CheckCircle,
  Package,
  Users,
  Calendar,
  MapPin,
  Phone,
  Mail,
  Hash,
  Clock,
  Edit,
  XCircle,
  AlertCircle,
  CheckCircle2,
  Sparkles,
  Send,
  ShoppingBag,
  Printer,
  X
} from 'lucide-react';

interface CustomerOrder {
  id: string;
  customer: string;
  email?: string;
  phonenumber?: string;
  address?: string;
  quotationRef: string;
  orderDate: string;
  totalItems: number;
  totalAmount: number;
  status: string;
  items?: any[];
  _id?: string;
}

interface OrderItem {
  id: number;
  name: string;
  orderedQty: number;
  receivedQty: number;
  damagedQty: number;
  unitPrice: number;
  warehouse: string;
  confirmed: boolean;
}

interface TimelineStep {
  name: string;
  status: 'completed' | 'current' | 'pending';
  date?: string;
  notes?: string;
}

const orderItems: OrderItem[] = [
  { id: 1, name: 'Product A - Electronics', orderedQty: 500, receivedQty: 0, damagedQty: 0, unitPrice: 250, warehouse: '', confirmed: false },
  { id: 2, name: 'Product B - Furniture', orderedQty: 300, receivedQty: 0, damagedQty: 0, unitPrice: 180, warehouse: '', confirmed: false },
  { id: 3, name: 'Product C - Textiles', orderedQty: 200, receivedQty: 0, damagedQty: 0, unitPrice: 45, warehouse: '', confirmed: false },
];

export default function CustomerOrders() {
  const [orders, setOrders] = useState<CustomerOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedOrderData, setSelectedOrderData] = useState<CustomerOrder | null>(null);
  const [items, setItems] = useState<OrderItem[]>([]);
  const [currentStatus, setCurrentStatus] = useState<string>('pending');
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  useEffect(() => {
    if (selectedOrderData?.items) {
      setItems(
        selectedOrderData.items.map((item, idx) => ({
          id: idx + 1,
          name: item.name,
          orderedQty: item.quantity || 0,
          receivedQty: item.quantity || 0,
          damagedQty: 0,
          unitPrice: Math.round(item.price / 1.1),
          warehouse: '',
          confirmed: false,
        }))
      );
    } else {
      setItems([]);
    }
  }, [selectedOrderData]);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5900/api/orders');
      
      const trackingStr = localStorage.getItem('client_side_delivery_tracking_v1');
      const tracking = trackingStr ? JSON.parse(trackingStr) : {};
      
      const updatedOrders = response.data.map((d: any) => {
        let orderWithTracking = { ...d };
        
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

      setOrders(updatedOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  const timeline: TimelineStep[] = [
    { name: 'Quotation Accepted', status: 'completed', date: '2024-01-14 10:00 AM', notes: 'Customer accepted quotation' },
    { name: 'Goods Prepared', status: 'completed', date: '2024-01-14 02:30 PM', notes: 'Order prepared for delivery' },
    { name: 'Dispatched', status: 'completed', date: '2024-01-15 09:00 AM', notes: 'Package dispatched to customer' },
    { name: 'In Transit', status: 'current', date: '2024-01-15 03:00 PM', notes: 'Package in transit - ETA 1 day' },
    { name: 'Delivered', status: 'pending', notes: 'Awaiting delivery confirmation' },
    { name: 'Stock Updated', status: 'pending', notes: 'Pending delivery completion' },
  ];

  const updateItemField = (id: number, field: keyof OrderItem, value: any) => {
    setItems(items.map(item =>
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const handleConfirmDelivery = () => {
    setShowReceiveModal(false);
    setShowSuccessModal(true);
    setCurrentStatus('completed');
  };

  const handleGenerateInvoice = () => {
    setShowInvoiceModal(true);
  };

  const handleDownloadInvoice = () => {
    alert('Invoice downloaded successfully!');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-nb-green text-nb-black';
      case 'in-transit': return 'bg-nb-cyan text-nb-black';
      case 'dispatched': return 'bg-purple-300 text-nb-black';
      case 'partially-delivered': return 'bg-nb-yellow text-nb-black';
      case 'pending': return 'bg-gray-200 text-nb-black';
      default: return 'bg-gray-200 text-nb-black';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-transit': return <Truck className="w-4 h-4" />;
      case 'dispatched': return <Send className="w-4 h-4" />;
      case 'pending': return <Clock className="w-4 h-4" />;
      default: return null;
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.customer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const canGenerateInvoice = currentStatus !== 'pending';
  const canUpdateStatus = currentStatus !== 'completed';
  const canConfirmDelivery = currentStatus === 'in-transit' || currentStatus === 'dispatched';
  const canEditOrder = currentStatus === 'pending';

  const inputStyle = "border-2 border-nb-black focus:outline-none font-bold text-nb-black shadow-[2px_2px_0px_0px_#000] px-4 py-2 bg-white uppercase";

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
        
        {/* Header */}
        <div className="relative border-4 border-nb-black bg-nb-cyan p-10 shadow-nb-lg">
          <div className="relative z-10">
            <span className="nb-badge bg-white text-nb-black mb-4">Customer Management</span>
            <h1 className="text-5xl font-black uppercase font-display tracking-tight text-nb-black">
              Customer Orders
            </h1>
            <p className="mt-4 font-bold text-nb-black text-lg max-w-2xl border-l-4 border-nb-black pl-4 bg-white/50 py-2 uppercase">
              Manage orders, track deliveries, and generate invoices
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row gap-4 border-b-4 border-nb-black pb-4">
          <button
            onClick={() => setActiveTab('list')}
            className={`px-6 py-3 border-4 border-nb-black font-black uppercase tracking-widest text-lg flex items-center gap-2 transition-all ${
              activeTab === 'list' ? 'bg-nb-yellow shadow-nb translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <FileText className="w-5 h-5" strokeWidth={3} /> Orders List
          </button>
          <button
            onClick={() => setActiveTab('view')}
            className={`px-6 py-3 border-4 border-nb-black font-black uppercase tracking-widest text-lg flex items-center gap-2 transition-all ${
              activeTab === 'view' ? 'bg-nb-yellow shadow-nb translate-x-[-2px] translate-y-[-2px]' : 'bg-white hover:bg-gray-100'
            }`}
          >
            <Eye className="w-5 h-5" strokeWidth={3} /> Order Details
          </button>
        </div>

        {/* Section 1: Orders List */}
        {activeTab === 'list' && (
          <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
            <div className="bg-nb-cyan border-b-4 border-nb-black px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <h3 className="font-black uppercase font-display text-2xl flex items-center gap-3">
                <ShoppingBag className="w-8 h-8" /> Customer Orders List
              </h3>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nb-black font-bold" />
                  <input
                    placeholder="SEARCH ORDERS..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`${inputStyle} pl-10 w-64`}
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className={`${inputStyle} w-48 appearance-none cursor-pointer`}
                >
                  <option value="all">ALL STATUS</option>
                  <option value="pending">PENDING</option>
                  <option value="dispatched">DISPATCHED</option>
                  <option value="in-transit">IN TRANSIT</option>
                  <option value="partially-delivered">PARTIAL</option>
                  <option value="completed">COMPLETED</option>
                </select>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead className="bg-nb-bg border-b-4 border-nb-black">
                  <tr>
                    <th className="py-5 pl-8 pr-4 font-black uppercase text-sm border-r-2 border-nb-black">Order #</th>
                    <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Customer Name</th>
                    <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Quotation Ref</th>
                    <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Order Date</th>
                    <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Items</th>
                    <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Total Amount</th>
                    <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Status</th>
                    <th className="py-5 pr-8 pl-4 font-black uppercase text-sm text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr>
                      <td colSpan={8} className="text-center py-20 font-black uppercase tracking-widest text-lg text-nb-black border-t-2 border-nb-black">
                        <div className="flex flex-col items-center gap-4">
                          <div className="w-12 h-12 border-4 border-nb-black border-t-nb-yellow rounded-full animate-spin"></div>
                          Loading orders...
                        </div>
                      </td>
                    </tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-20 font-black uppercase tracking-widest text-2xl text-gray-500 border-t-2 border-nb-black">
                        No orders found.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-nb-bg transition-colors border-b-2 border-nb-black last:border-0">
                        <td className="py-5 pl-8 pr-4 font-black text-lg border-r-2 border-nb-black">{order.id}</td>
                        <td className="p-5 font-bold text-lg border-r-2 border-nb-black">{order.customer}</td>
                        <td className="p-5 font-bold uppercase text-gray-600 border-r-2 border-nb-black">{order.quotationRef}</td>
                        <td className="p-5 font-bold uppercase text-gray-600 border-r-2 border-nb-black">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="p-5 font-black text-lg border-r-2 border-nb-black">{order.totalItems}</td>
                        <td className="p-5 font-black text-lg border-r-2 border-nb-black">LKR {order.totalAmount.toLocaleString()}</td>
                        <td className="p-5 border-r-2 border-nb-black">
                          <span className={`nb-badge text-sm flex items-center gap-2 w-max ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status.replace('-', ' ')}
                          </span>
                        </td>
                        <td className="py-5 pr-8 pl-4 text-right">
                          <button 
                            className="px-4 py-2 border-2 border-nb-black bg-white text-nb-black font-bold shadow-nb-sm nb-interactive flex justify-center w-full max-w-[80px] ml-auto"
                            onClick={() => {
                              setSelectedOrderData(order);
                              setCurrentStatus(order.status);
                              setActiveTab('view');
                            }}
                          >
                            <Eye className="w-5 h-5" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Section 2: Order Details & Invoice */}
        {activeTab === 'view' && (
          <div className="space-y-8">
            <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
              <div className="bg-nb-yellow border-b-4 border-nb-black px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-black uppercase font-display text-2xl flex items-center gap-3">
                  <FileText className="w-8 h-8" /> Order Details & Invoice
                </h3>
                <div className="flex gap-4">
                  <button 
                    onClick={handleGenerateInvoice}
                    disabled={!canGenerateInvoice}
                    className="px-4 py-2 border-4 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Eye className="w-5 h-5" /> View Invoice
                  </button>
                  <button 
                    onClick={handleDownloadInvoice}
                    disabled={!canGenerateInvoice}
                    className="px-4 py-2 border-4 border-nb-black bg-nb-cyan text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Download className="w-5 h-5" /> Download PDF
                  </button>
                </div>
              </div>

              <div className="p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {/* Invoice Info */}
                  <div className="bg-nb-bg p-6 border-4 border-nb-black shadow-nb">
                    <h3 className="font-black uppercase tracking-widest text-xl mb-4 flex items-center gap-2">
                      <Hash className="w-6 h-6" /> Invoice Information
                    </h3>
                    <div className="space-y-4 text-lg font-bold uppercase">
                      <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                        <span className="text-gray-600">Invoice #</span>
                        <span className="text-nb-black">INV-{selectedOrderData?.id?.replace('ORD-', '') || '---'}</span>
                      </div>
                      <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                        <span className="text-gray-600">Order #</span>
                        <span className="text-nb-black">{selectedOrderData?.id || '---'}</span>
                      </div>
                      <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                        <span className="text-gray-600">Order Date</span>
                        <span className="text-nb-black">{selectedOrderData ? new Date(selectedOrderData.orderDate).toLocaleDateString() : '---'}</span>
                      </div>
                      <div className="flex justify-between pb-2">
                        <span className="text-gray-600">Quotation Ref</span>
                        <span className="text-nb-black">{selectedOrderData?.quotationRef || '---'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Customer Details */}
                  <div className="bg-nb-cyan p-6 border-4 border-nb-black shadow-nb">
                    <h3 className="font-black uppercase tracking-widest text-xl mb-4 flex items-center gap-2">
                      <Users className="w-6 h-6" /> Customer Details
                    </h3>
                    <div className="space-y-4 text-lg font-bold">
                      <div className="text-3xl font-black uppercase">{selectedOrderData?.customer || '---'}</div>
                      <div className="flex items-start gap-3 uppercase">
                        <MapPin className="w-6 h-6 shrink-0 mt-1" />
                        <span>{selectedOrderData?.address || 'ADDRESS NOT PROVIDED'}</span>
                      </div>
                      <div className="flex items-center gap-3 uppercase">
                        <Phone className="w-6 h-6 shrink-0" />
                        <span>{selectedOrderData?.phonenumber || 'PHONE NOT PROVIDED'}</span>
                      </div>
                      <div className="flex items-center gap-3 uppercase">
                        <Mail className="w-6 h-6 shrink-0" />
                        <span className="bg-white px-2 py-1 border-2 border-nb-black text-sm">{selectedOrderData?.email || 'EMAIL NOT PROVIDED'}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Itemized List */}
                <div className="border-4 border-nb-black overflow-hidden">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-100 border-b-4 border-nb-black">
                      <tr>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black">Item</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center">Quantity</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-right">Unit Price</th>
                        <th className="p-4 font-black uppercase text-sm text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrderData?.items?.map((item, idx) => {
                        const preTaxPrice = Math.round(item.price / 1.1);
                        return (
                          <tr key={idx} className="border-b-2 border-nb-black last:border-0 hover:bg-nb-bg">
                            <td className="p-4 font-bold text-lg border-r-2 border-nb-black">{item.name}</td>
                            <td className="p-4 font-black text-xl text-center border-r-2 border-nb-black">{item.quantity} units</td>
                            <td className="p-4 font-bold text-lg text-right border-r-2 border-nb-black">LKR {preTaxPrice.toLocaleString()}</td>
                            <td className="p-4 font-black text-xl text-right">LKR {(item.quantity * preTaxPrice).toLocaleString()}</td>
                          </tr>
                        );
                      })}
                      {(!selectedOrderData?.items || selectedOrderData.items.length === 0) && (
                        <tr>
                          <td colSpan={4} className="text-center py-12 font-black uppercase tracking-widest text-gray-500">No items in this order</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Invoice Summary */}
                <div className="mt-8 flex justify-end">
                  {(() => {
                    const subtotal = selectedOrderData?.items?.reduce((sum, item) => sum + ((item.quantity || 0) * Math.round(item.price / 1.1)), 0) || 0;
                    const tax = Math.round(subtotal * 0.1);
                    const total = subtotal + tax;
                    return (
                      <div className="border-4 border-nb-black bg-white shadow-nb p-6 w-full md:w-96">
                        <div className="space-y-4 uppercase font-bold text-lg">
                          <div className="flex justify-between">
                            <span>Subtotal</span>
                            <span>LKR {subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Tax (10%)</span>
                            <span>LKR {tax.toLocaleString()}</span>
                          </div>
                          <div className="h-1 bg-nb-black" />
                          <div className="flex justify-between text-2xl font-black">
                            <span>Total</span>
                            <span className="bg-nb-green px-2 border-2 border-nb-black shadow-nb-sm">LKR {total.toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            {/* Section 3: Delivery Tracking Timeline */}
            <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
              <div className="bg-purple-300 border-b-4 border-nb-black px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-black uppercase font-display text-2xl flex items-center gap-3">
                  <Truck className="w-8 h-8" /> Delivery Tracking Timeline
                </h3>
              </div>
              <div className="p-8">
                <div className="relative border-l-4 border-nb-black ml-6 space-y-10 py-4">
                  {timeline.map((step, index) => (
                    <div key={index} className="relative pl-10">
                      {/* Node */}
                      <div className={`absolute -left-[26px] top-1 w-12 h-12 border-4 border-nb-black flex items-center justify-center
                        ${step.status === 'completed' ? 'bg-nb-green text-nb-black shadow-nb-sm' : 
                          step.status === 'current' ? 'bg-nb-yellow text-nb-black shadow-nb animate-pulse' : 
                          'bg-gray-200 text-gray-400'}`}
                      >
                        {step.status === 'completed' ? <CheckCircle className="w-6 h-6" strokeWidth={3} /> : 
                         step.status === 'current' ? <Clock className="w-6 h-6" strokeWidth={3} /> : 
                         <div className="w-3 h-3 bg-nb-black rounded-full" />}
                      </div>

                      {/* Content */}
                      <div className={`p-6 border-4 border-nb-black ${step.status === 'current' ? 'bg-nb-yellow shadow-nb' : 'bg-nb-bg'}`}>
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                          <h4 className="font-black uppercase tracking-widest text-xl">{step.name}</h4>
                          {step.date && <span className="bg-white border-2 border-nb-black px-2 py-1 font-bold text-xs uppercase">{step.date}</span>}
                        </div>
                        <p className="font-bold uppercase text-gray-700">{step.notes}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Section 4: Goods Receipt & Stock Update */}
            <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
              <div className="bg-nb-yellow border-b-4 border-nb-black px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="font-black uppercase font-display text-2xl flex items-center gap-3">
                  <Package className="w-8 h-8" /> Confirm Delivery & Stock Update
                </h3>
              </div>
              <div className="p-8">
                <div className="border-4 border-nb-black overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[800px]">
                    <thead className="bg-gray-100 border-b-4 border-nb-black">
                      <tr>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center">Confirm</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black">Item Name</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center">Ordered</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center">Delivered</th>
                        <th className="p-4 font-black uppercase text-sm border-r-2 border-nb-black text-center">Damaged</th>
                        <th className="p-4 font-black uppercase text-sm">Warehouse Location</th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-nb-bg transition-colors border-b-2 border-nb-black last:border-0">
                          <td className="p-4 text-center border-r-2 border-nb-black">
                            <input
                              type="checkbox"
                              className="w-6 h-6 border-2 border-nb-black accent-nb-black cursor-pointer shadow-[2px_2px_0px_0px_#000]"
                              checked={item.confirmed}
                              onChange={(e) => updateItemField(item.id, 'confirmed', e.target.checked)}
                            />
                          </td>
                          <td className="p-4 font-bold text-lg border-r-2 border-nb-black">{item.name}</td>
                          <td className="p-4 font-black text-xl text-center border-r-2 border-nb-black">{item.orderedQty}</td>
                          <td className="p-4 text-center border-r-2 border-nb-black">
                            <input
                              type="number"
                              value={item.receivedQty}
                              onChange={(e) => updateItemField(item.id, 'receivedQty', parseInt(e.target.value) || 0)}
                              className={`${inputStyle} w-24 text-center mx-auto`}
                            />
                          </td>
                          <td className="p-4 text-center border-r-2 border-nb-black">
                            <input
                              type="number"
                              value={item.damagedQty}
                              onChange={(e) => updateItemField(item.id, 'damagedQty', parseInt(e.target.value) || 0)}
                              className={`${inputStyle} w-24 text-center mx-auto`}
                            />
                          </td>
                          <td className="p-4">
                            <select
                              value={item.warehouse}
                              onChange={(e) => updateItemField(item.id, 'warehouse', e.target.value)}
                              className={`${inputStyle} w-full cursor-pointer appearance-none`}
                            >
                              <option value="">SELECT...</option>
                              <option value="warehouse-a">WAREHOUSE A</option>
                              <option value="warehouse-b">WAREHOUSE B</option>
                              <option value="warehouse-c">WAREHOUSE C</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="mt-8 p-6 bg-nb-red text-white border-4 border-nb-black shadow-nb">
                  <div className="flex items-start gap-4">
                    <AlertCircle className="w-8 h-8 shrink-0" strokeWidth={3} />
                    <div>
                      <p className="font-black uppercase tracking-widest text-xl mb-2">Important Notice</p>
                      <p className="font-bold text-lg uppercase">
                        Confirming delivery will automatically update stock quantities. 
                        Items will be deducted from inventory. Please verify all quantities before proceeding.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Section 5: Actions */}
            <div className="border-4 border-nb-black bg-white shadow-nb p-6 flex flex-wrap gap-4 justify-end">
              <button
                onClick={handleGenerateInvoice}
                disabled={!canGenerateInvoice}
                className="px-6 py-3 border-4 border-nb-black font-black uppercase flex items-center gap-2 bg-nb-bg shadow-nb-sm disabled:opacity-50 nb-interactive"
              >
                <FileText className="w-5 h-5" /> Generate Invoice
              </button>
              <button
                disabled={!canUpdateStatus}
                className="px-6 py-3 border-4 border-nb-black font-black uppercase flex items-center gap-2 bg-purple-300 shadow-nb-sm disabled:opacity-50 nb-interactive"
              >
                <Truck className="w-5 h-5" /> Update Status
              </button>
              <button
                disabled={!canConfirmDelivery}
                onClick={() => setShowReceiveModal(true)}
                className="px-6 py-3 border-4 border-nb-black font-black uppercase flex items-center gap-2 bg-nb-green shadow-nb-sm disabled:opacity-50 nb-interactive"
              >
                <CheckCircle className="w-5 h-5" /> Confirm Delivery
              </button>
              <button
                disabled={!canEditOrder}
                className="px-6 py-3 border-4 border-nb-black font-black uppercase flex items-center gap-2 bg-nb-red text-white shadow-nb-sm disabled:opacity-50 nb-interactive"
              >
                <XCircle className="w-5 h-5" /> Cancel Order
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Invoice Preview Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white border-4 border-nb-black shadow-nb-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            <div className="bg-nb-yellow border-b-4 border-nb-black p-6 flex justify-between items-center shrink-0">
              <h2 className="text-3xl font-black uppercase font-display flex items-center gap-3">
                <FileText className="w-8 h-8" /> Invoice Preview
              </h2>
              <div className="flex gap-4">
                <button onClick={handleDownloadInvoice} className="bg-white border-2 border-nb-black px-4 py-2 font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2">
                  <Printer className="w-5 h-5" /> Print
                </button>
                <button onClick={() => setShowInvoiceModal(false)} className="bg-nb-red text-white border-2 border-nb-black p-2 shadow-nb-sm nb-interactive">
                  <X className="w-6 h-6" />
                </button>
              </div>
            </div>
            
            <div className="p-8 overflow-y-auto bg-nb-bg flex-1">
              <div className="bg-white p-12 border-4 border-nb-black shadow-nb">
                <div className="flex justify-between items-start mb-12">
                  <div>
                    <h2 className="text-5xl font-black font-display uppercase tracking-tighter mb-4">INVOICE</h2>
                    <div className="font-bold uppercase space-y-1">
                      <p>Invoice #: INV-{selectedOrderData?.id?.replace('ORD-', '') || '---'}</p>
                      <p>Date: {selectedOrderData ? new Date(selectedOrderData.orderDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '---'}</p>
                      <p>Order #: {selectedOrderData?.id || '---'}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <h3 className="text-2xl font-black uppercase mb-4">StockFlow Neo</h3>
                    <div className="font-bold uppercase space-y-1">
                      <p>456 Enterprise Way</p>
                      <p>Colombo 07, Sri Lanka</p>
                      <p>+94 11 234 5678</p>
                      <p>info@stockflow.com</p>
                    </div>
                  </div>
                </div>

                <div className="mb-12 border-4 border-nb-black p-6 bg-nb-cyan inline-block min-w-[300px]">
                  <h4 className="font-black uppercase tracking-widest text-xl mb-4 border-b-4 border-nb-black pb-2 inline-block">BILL TO:</h4>
                  <div className="font-bold uppercase space-y-1 text-lg">
                    <p className="text-2xl font-black">{selectedOrderData?.customer || '---'}</p>
                    <p>{selectedOrderData?.address || 'ADDRESS NOT PROVIDED'}</p>
                    <p>{selectedOrderData?.phonenumber || 'PHONE NOT PROVIDED'}</p>
                    <p>{selectedOrderData?.email || 'EMAIL NOT PROVIDED'}</p>
                  </div>
                </div>

                <table className="w-full mb-12 border-4 border-nb-black text-left">
                  <thead className="bg-nb-black text-white border-b-4 border-nb-black">
                    <tr>
                      <th className="py-4 px-6 font-black uppercase border-r-4 border-nb-black">ITEM</th>
                      <th className="py-4 px-6 font-black uppercase text-right border-r-4 border-nb-black">QTY</th>
                      <th className="py-4 px-6 font-black uppercase text-right border-r-4 border-nb-black">UNIT PRICE</th>
                      <th className="py-4 px-6 font-black uppercase text-right">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="font-bold uppercase text-lg">
                    {items.map((item) => (
                      <tr key={item.id} className="border-b-4 border-nb-black">
                        <td className="py-4 px-6 border-r-4 border-nb-black">{item.name}</td>
                        <td className="py-4 px-6 border-r-4 border-nb-black text-right">{item.orderedQty}</td>
                        <td className="py-4 px-6 border-r-4 border-nb-black text-right">LKR {item.unitPrice}</td>
                        <td className="py-4 px-6 text-right">LKR {(item.orderedQty * item.unitPrice).toLocaleString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                <div className="flex justify-end mb-12">
                  {(() => {
                    const modalSubtotal = items.reduce((sum, item) => sum + (item.orderedQty * item.unitPrice), 0);
                    const modalTax = Math.round(modalSubtotal * 0.1);
                    const modalTotal = modalSubtotal + modalTax;
                    return (
                      <div className="w-80 space-y-4 font-bold uppercase text-xl">
                        <div className="flex justify-between">
                          <span>Subtotal</span>
                          <span>LKR {modalSubtotal.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Tax (10%)</span>
                          <span>LKR {modalTax.toLocaleString()}</span>
                        </div>
                        <div className="border-t-4 border-nb-black pt-4 flex justify-between font-black text-3xl">
                          <span>TOTAL</span>
                          <span className="bg-nb-green px-2 border-2 border-nb-black shadow-nb-sm">LKR {modalTotal.toLocaleString()}</span>
                        </div>
                      </div>
                    );
                  })()}
                </div>

                <div className="border-t-4 border-nb-black pt-6 font-bold uppercase text-center">
                  <p className="text-xl font-black mb-2">Thank you for your business!</p>
                  <p>Payment due within 30 days. Please make checks payable to StockFlow Neo.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirm Delivery Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white border-4 border-nb-black shadow-nb-xl w-full max-w-lg flex flex-col">
            <div className="bg-nb-yellow border-b-4 border-nb-black p-6 flex justify-between items-center shrink-0">
              <h2 className="text-2xl font-black uppercase font-display flex items-center gap-3">
                <AlertCircle className="w-8 h-8" /> Confirm Delivery
              </h2>
            </div>
            <div className="p-8 font-bold uppercase">
              <p className="text-xl mb-6">
                You are about to confirm delivery for Order <span className="bg-nb-cyan px-2 border-2 border-nb-black inline-block">{selectedOrderData?.id || 'ORD-20240114'}</span>.
              </p>
              <div className="bg-nb-bg border-4 border-nb-black p-6 mb-6">
                <h4 className="font-black text-xl mb-4 border-b-4 border-nb-black pb-2 inline-block">WHAT WILL HAPPEN:</h4>
                <ul className="space-y-3">
                  <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-nb-green" strokeWidth={3} /> Stock will be deducted</li>
                  <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-nb-green" strokeWidth={3} /> Activity log updated</li>
                  <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-nb-green" strokeWidth={3} /> Status marked "Completed"</li>
                  <li className="flex items-center gap-3"><CheckCircle className="w-6 h-6 text-nb-green" strokeWidth={3} /> Customer notified</li>
                </ul>
              </div>
              <p className="text-lg">Are you sure you want to proceed?</p>
            </div>
            <div className="flex p-6 border-t-4 border-nb-black gap-4 bg-gray-50">
              <button onClick={() => setShowReceiveModal(false)} className="flex-1 border-4 border-nb-black bg-white font-black uppercase py-4 shadow-nb nb-interactive">
                Cancel
              </button>
              <button onClick={handleConfirmDelivery} className="flex-1 border-4 border-nb-black bg-nb-green font-black uppercase py-4 shadow-nb nb-interactive">
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white border-4 border-nb-black shadow-nb-xl w-full max-w-lg flex flex-col items-center p-10 text-center">
            <div className="w-24 h-24 bg-nb-green border-4 border-nb-black shadow-nb flex items-center justify-center mb-6 rounded-none">
              <CheckCircle className="w-12 h-12 text-nb-black" strokeWidth={3} />
            </div>
            <h2 className="text-4xl font-black uppercase font-display text-nb-black mb-4">Delivery Confirmed!</h2>
            <p className="text-lg font-bold uppercase text-gray-700 mb-8 border-l-4 border-nb-black pl-4 bg-gray-100 py-3 text-left w-full">
              Order has been marked as delivered and stock has been updated successfully.
            </p>
            
            <div className="w-full bg-nb-bg border-4 border-nb-black p-6 mb-8 text-left font-bold uppercase text-lg space-y-3">
              <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                <span>Order #</span>
                <span className="font-black">{selectedOrderData?.id || 'ORD-20240114'}</span>
              </div>
              <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                <span>Items Delivered</span>
                <span className="font-black">{selectedOrderData?.items?.length || 0} ITEMS</span>
              </div>
              <div className="flex justify-between border-b-2 border-gray-300 pb-2">
                <span>Total Quantity</span>
                <span className="font-black">{selectedOrderData?.items?.reduce((sum, item) => sum + (item.quantity || 0), 0)?.toLocaleString() || 0} UNITS</span>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span>Status</span>
                <span className="bg-nb-green px-2 border-2 border-nb-black">COMPLETED</span>
              </div>
            </div>

            <button
              onClick={() => { setShowSuccessModal(false); setActiveTab('list'); }}
              className="w-full py-4 border-4 border-nb-black bg-nb-cyan text-nb-black font-black uppercase shadow-nb nb-interactive text-xl"
            >
              Back to Orders List
            </button>
          </div>
        </div>
      )}
    </>
  );
}