"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { toast } from 'sonner';
import {
  Truck,
  Search,
  Eye,
  Loader2,
  RefreshCw,
  CheckCircle,
  Clock,
  Package,
  AlertCircle,
  X
} from 'lucide-react';

interface OrderItem {
  productID: string;
  name: string;
  quantity: number;
  issuedQuantity: number;
  receivedQuantity?: number;
  rejectedQuantity?: number;
  price?: number;
}

interface PurchaseOrder {
  _id: string;
  po_id: string;
  supplierEmail: string;
  name?: string;
  status: string;
  total: number;
  date: string;
  expectedDeliveryDate?: string;
  items: OrderItem[];
  orderType: string;
}

export default function SupplierDeliveryTracking() {
  const [orders, setOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<PurchaseOrder | null>(null);
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [receivedQtys, setReceivedQtys] = useState<{ [key: string]: number }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5900/api/supplier-orders');
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error('Failed to load orders:', err);
      toast.error('Failed to load supplier delivery data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered':    return 'bg-nb-green text-black';
      case 'dispatched':   return 'bg-nb-cyan text-black';
      case 'confirmed':    return 'bg-blue-400 text-black';
      case 'pending':      return 'bg-nb-yellow text-black';
      case 'rejected':     return 'bg-nb-red text-white';
      default:             return 'bg-gray-200 text-black';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'delivered': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'dispatched':
      case 'confirmed': return <Truck className="w-4 h-4 mr-1" />;
      default:          return <Clock className="w-4 h-4 mr-1" />;
    }
  };

  const getProgress = (order: PurchaseOrder) => {
    const totalItems = order.items?.length || 0;
    const receivedItems = order.items?.filter(i => (i.receivedQuantity || 0) > 0).length || 0;
    return { received: receivedItems, total: totalItems };
  };

  const filtered = orders.filter(o => {
    const q = searchTerm.toLowerCase();
    return (
      (o.po_id || '').toLowerCase().includes(q) ||
      (o.supplierEmail || '').toLowerCase().includes(q) ||
      (o.status || '').toLowerCase().includes(q)
    );
  });

  // Stats
  const delivered  = orders.filter(o => o.status === 'delivered').length;
  const dispatched = orders.filter(o => o.status === 'dispatched').length;
  const pending    = orders.filter(o => o.status === 'pending' || o.status === 'confirmed').length;

  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-x-hidden">
        
        {/* Header - Neo Brutalist style */}
        <div className="relative border-4 border-black bg-blue-400 p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Truck className="w-5 h-5 text-black" />
              </div>
              <span className="bg-white border-2 border-black font-mono font-bold text-[10px] uppercase px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Logistics Tracking</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase font-display tracking-tight text-black mb-2">
              Supplier Delivery Tracking
            </h1>
            <p className="font-bold text-black text-sm max-w-2xl border-l-4 border-black pl-3 bg-white/50 py-1.5 uppercase">
              Monitor all supplier purchase orders and delivery statuses.
            </p>
          </div>
        </div>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Orders', value: `${orders.length}`, icon: Package, bg: 'bg-white' },
            { label: 'Delivered', value: `${delivered}`, icon: CheckCircle, bg: 'bg-nb-green' },
            { label: 'In Transit', value: `${dispatched}`, icon: Truck, bg: 'bg-nb-cyan' },
            { label: 'Pending', value: `${pending}`, icon: Clock, bg: 'bg-nb-yellow' },
          ].map((card, i) => (
            <div key={i} className={`border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${card.bg}`}>
              <div className="w-12 h-12 bg-black border-2 border-black rounded-none flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-sm font-black uppercase tracking-widest text-black mb-1">{card.label}</h3>
              <p className="text-4xl font-black text-black">{card.value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black font-bold" />
            <input
              placeholder="SEARCH BY PO ID, SUPPLIER..."
              className="pl-12 w-full border-2 border-black bg-nb-bg h-14 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all uppercase"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="w-full md:w-auto h-14 px-6 border-2 border-black bg-white flex items-center justify-center hover:bg-nb-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-black uppercase tracking-widest"
            onClick={fetchOrders}
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* Table */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="bg-black text-white px-6 py-4 border-b-4 border-black flex items-center gap-3">
            <Truck className="w-6 h-6 text-nb-yellow" />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Purchase Order Delivery Status ({filtered.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-nb-bg border-b-4 border-black">
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">PO ID</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Supplier</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Total Value</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center whitespace-nowrap">Progress</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center whitespace-nowrap">Status</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Order Date</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Expected By</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="h-64 text-center py-20 bg-white">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-black" />
                      <p className="text-black text-sm font-black uppercase tracking-widest">Loading delivery data...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-40 text-center font-mono font-bold text-gray-500 bg-white p-8 uppercase tracking-widest">
                      No purchase orders found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(order => {
                    const prog = getProgress(order);
                    return (
                      <tr key={order._id} className="hover:bg-nb-cyan/20 transition-colors border-b-4 border-black last:border-b-0 bg-white">
                        <td className="p-5 font-mono text-sm font-bold border-r-4 border-black">{order.po_id}</td>
                        <td className="p-5 border-r-4 border-black font-black uppercase tracking-wide text-sm">{order.supplierEmail}</td>
                        <td className="p-5 border-r-4 border-black font-black text-lg">LKR {order.total?.toLocaleString() || '—'}</td>
                        <td className="p-5 text-center border-r-4 border-black">
                          <div className="flex items-center justify-center gap-3">
                            <div className="flex-1 max-w-[80px] bg-white border-2 border-black h-4 relative overflow-hidden">
                              <div
                                className="bg-nb-green h-full border-r-2 border-black transition-all"
                                style={{ width: prog.total > 0 ? `${(prog.received / prog.total) * 100}%` : '0%' }}
                              />
                            </div>
                            <span className="text-xs font-black w-8 whitespace-nowrap">
                              {prog.received}/{prog.total}
                            </span>
                          </div>
                        </td>
                        <td className="p-5 text-center border-r-4 border-black">
                          <span className={`inline-flex items-center ${getStatusColor(order.status)} border-2 border-black font-mono text-[10px] font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                            {getStatusIcon(order.status)}{order.status}
                          </span>
                        </td>
                        <td className="p-5 text-sm font-bold border-r-4 border-black">
                          {new Date(order.date).toLocaleDateString()}
                        </td>
                        <td className="p-5 text-sm font-bold border-r-4 border-black">
                          {order.expectedDeliveryDate
                            ? new Date(order.expectedDeliveryDate).toLocaleDateString()
                            : '—'
                          }
                        </td>
                        <td className="p-5 text-right">
                          <button
                            className="bg-white border-2 border-black h-10 px-4 inline-flex items-center justify-center font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            onClick={() => { setSelected(order); setShowModal(true); }}
                          >
                            <Eye className="w-4 h-4 mr-2" /> Details
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Detail Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="bg-nb-cyan border-b-4 border-black p-6 md:p-8 flex justify-between items-center sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Truck className="w-6 h-6 text-black" />
                </div>
                <div>
                  <h2 className="text-2xl md:text-3xl font-black uppercase tracking-tight">Purchase Order: <span className="font-mono text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">{selected.po_id}</span></h2>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-nb-red hover:text-white transition-colors nb-interactive shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-6 md:p-8 space-y-8 bg-white overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-nb-bg">
                <div className="p-4 border-b-4 md:border-b-0 border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Supplier</p>
                  <p className="font-bold text-sm text-black uppercase tracking-wide">{selected.supplierEmail}</p>
                </div>
                <div className="p-4 border-b-4 md:border-b-0 md:border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Order Date</p>
                  <p className="font-mono text-sm font-bold text-black">{new Date(selected.date).toLocaleDateString()}</p>
                </div>
                <div className="p-4 border-b-4 md:border-b-0 border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Expected Delivery</p>
                  <p className="font-mono text-sm font-bold text-black">
                    {selected.expectedDeliveryDate
                      ? new Date(selected.expectedDeliveryDate).toLocaleDateString()
                      : 'Not specified'}
                  </p>
                </div>
                <div className="p-4 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Status</p>
                  <span className={`inline-flex items-center ${getStatusColor(selected.status)} border-2 border-black font-mono text-[10px] font-bold px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                    {getStatusIcon(selected.status)}{selected.status}
                  </span>
                </div>
              </div>

              <div className="flex justify-end mt-4">
                  <div className="bg-nb-bg border-4 border-black p-4 inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-widest">Total Value</span>
                      <span className="text-3xl font-black text-black">LKR {selected.total?.toLocaleString() || '—'}</span>
                    </div>
                  </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-black uppercase text-sm tracking-widest flex items-center gap-3 bg-black text-white p-4 border-4 border-black">
                  <Package className="w-5 h-5 text-nb-yellow" />
                  Order Items & Delivery Progress
                </h3>
                <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-nb-bg border-b-4 border-black">
                        <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black">Item</th>
                        <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center">Ordered Qty</th>
                        <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center">Received Qty</th>
                        <th className="p-4 font-black text-xs uppercase tracking-widest text-center">Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items?.map((item, idx) => {
                        const pct = item.quantity > 0 ? Math.min(100, ((item.receivedQuantity || 0) / item.quantity) * 100) : 0;
                        return (
                          <tr key={idx} className="border-b-4 border-black last:border-b-0 hover:bg-nb-yellow/20 transition-colors bg-white">
                            <td className="p-4 border-r-4 border-black font-bold text-sm uppercase">{item.name}</td>
                            <td className="p-4 border-r-4 border-black text-center font-bold">
                              {item.quantity}
                            </td>
                            <td className="p-4 border-r-4 border-black text-center font-black text-lg">
                              {item.receivedQuantity || 0}
                            </td>
                            <td className="p-4 text-center">
                              <div className="flex items-center justify-center gap-3">
                                <div className="w-32 bg-white border-2 border-black h-4 relative overflow-hidden">
                                  <div
                                    className={`h-full border-r-2 border-black transition-all ${pct >= 100 ? 'bg-nb-green' : 'bg-nb-cyan'}`}
                                    style={{ width: `${pct}%` }}
                                  />
                                </div>
                                <span className="text-xs font-black w-10 text-right">{Math.round(pct)}%</span>
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {selected.status === 'dispatched' && (
                <div className="space-y-4">
                  <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                    <Truck className="w-6 h-6 shrink-0 text-blue-500" />
                    <p className="text-sm font-bold uppercase">Shipment is in transit. Awaiting delivery confirmation.</p>
                  </div>
                  <button 
                    className="w-full h-14 bg-nb-green border-4 border-black text-black font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center gap-2"
                    onClick={() => {
                      const initial: { [key: string]: number } = {};
                      selected.items.forEach(item => {
                        initial[item.productID] = item.issuedQuantity || item.quantity;
                      });
                      setReceivedQtys(initial);
                      setShowReceiveModal(true);
                    }}
                  >
                    <CheckCircle className="w-5 h-5" />
                    Confirm Items Received
                  </button>
                </div>
              )}
              {selected.status === 'pending' && (
                <div className="p-4 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center gap-3">
                  <AlertCircle className="w-6 h-6 shrink-0 text-nb-yellow" />
                  <p className="text-sm font-bold uppercase">Order is awaiting supplier acknowledgment and dispatch.</p>
                </div>
              )}

            </div>

            <div className="p-6 md:p-8 border-t-4 border-black bg-white flex justify-end sticky bottom-0 z-20">
              <button 
                className="bg-white border-4 border-black h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-bg transition-colors nb-interactive" 
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Receive Modal */}
      {showReceiveModal && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl my-8 relative flex flex-col">
            <div className="bg-nb-green border-b-4 border-black p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <CheckCircle className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Confirm Delivery</h2>
              </div>
              <button 
                onClick={() => setShowReceiveModal(false)}
                className="w-10 h-10 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-nb-red hover:text-white transition-colors nb-interactive shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6">
              <p className="font-bold text-sm uppercase bg-nb-yellow p-4 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                Verify the items received from the supplier. Specify the accepted quantity; the difference will be marked as rejected.
              </p>
              
              <div className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[500px]">
                  <thead>
                    <tr className="bg-nb-bg border-b-4 border-black">
                      <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black">Item Name</th>
                      <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center">Dispatched Qty</th>
                      <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black w-32">Received Qty</th>
                      <th className="p-4 font-black text-xs uppercase tracking-widest text-center text-nb-red">Rejected</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selected?.items?.map((item) => (
                      <tr key={item.productID} className="border-b-4 border-black last:border-b-0 bg-white">
                        <td className="p-4 font-bold uppercase text-sm border-r-4 border-black">{item.name}</td>
                        <td className="p-4 text-center font-black text-lg border-r-4 border-black bg-gray-50">{item.issuedQuantity || 0}</td>
                        <td className="p-4 border-r-4 border-black">
                          <input 
                            type="number"
                            min="0"
                            max={item.issuedQuantity || 0}
                            value={receivedQtys[item.productID] ?? (item.issuedQuantity || 0)}
                            onChange={(e) => {
                              const val = parseInt(e.target.value) || 0;
                              setReceivedQtys(prev => ({ ...prev, [item.productID]: Math.min(val, item.issuedQuantity || 0) }));
                            }}
                            className="w-full h-10 border-2 border-black font-bold text-center focus:outline-none focus:bg-nb-cyan/10"
                          />
                        </td>
                        <td className="p-4 text-center font-black text-xl text-nb-red bg-nb-red/10">
                          {(item.issuedQuantity || 0) - (receivedQtys[item.productID] ?? (item.issuedQuantity || 0))}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="p-6 border-t-4 border-black bg-nb-bg flex flex-col sm:flex-row gap-4">
              <button 
                className="flex-1 bg-white border-4 border-black h-14 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors nb-interactive"
                onClick={() => setShowReceiveModal(false)}
              >
                Cancel
              </button>
              <button 
                className="flex-1 bg-black text-white border-4 border-black h-14 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                disabled={isSubmitting}
                onClick={async () => {
                  if (!selected) return;
                  try {
                    setIsSubmitting(true);
                    const itemsToUpdate = selected.items.map(item => {
                      const received = receivedQtys[item.productID] ?? (item.issuedQuantity || 0);
                      return {
                        productID: item.productID,
                        receivedQuantity: received,
                        rejectedQuantity: (item.issuedQuantity || 0) - received
                      };
                    });
                    await axios.put(`http://localhost:5900/api/supplier-orders/${selected._id}/confirm-delivery`, {
                      items: itemsToUpdate
                    });
                    toast.success("Delivery confirmed successfully");
                    setShowReceiveModal(false);
                    setShowModal(false);
                    fetchOrders();
                  } catch (err) {
                    toast.error("Failed to confirm delivery");
                  } finally {
                    setIsSubmitting(false);
                  }
                }}
              >
                {isSubmitting ? <Loader2 className="w-5 h-5 animate-spin" /> : "Finalize Reception"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}