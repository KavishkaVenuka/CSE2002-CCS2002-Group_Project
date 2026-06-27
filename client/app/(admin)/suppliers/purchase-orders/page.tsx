"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  FileText,
  Search,
  Eye,
  Building2,
  Package,
  ShoppingCart,
  Loader2,
  RefreshCw,
  Phone,
  Mail
} from 'lucide-react';

interface PurchaseOrder {
  id: string;
  po_id: string;
  supplier: string;
  orderDate: string;
  expectedDelivery: string;
  totalItems: number;
  totalAmount: number;
  status: string;
  items: any[];
}

export default function PurchaseOrders() {
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [activeTab, setActiveTab] = useState('list');
  const [selectedPO, setSelectedPO] = useState<PurchaseOrder | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5900/api/supplier-orders', {
        headers: getAuthHeader()
      });
      setPurchaseOrders(res.data.orders || []);
    } catch (err: any) {
      toast.error('Failed to load purchase orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      setIsUpdatingStatus(true);
      await axios.put(`http://localhost:5900/api/supplier-orders/${id}/status`, 
        { status: newStatus }, 
        { headers: getAuthHeader() }
      );
      toast.success(`Order updated to ${newStatus}`);
      fetchOrders();
      if (selectedPO?.id === id) {
        setSelectedPO({ ...selectedPO, status: newStatus });
      }
    } catch (err: any) {
      toast.error('Failed to update order status');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'completed': return 'bg-green-400 border-black';
      case 'dispatched': return 'bg-cyan-400 border-black';
      case 'in-transit': return 'bg-orange-400 border-black';
      case 'pending': return 'bg-yellow-400 border-black';
      case 'confirmed': return 'bg-blue-400 border-black';
      default: return 'bg-gray-200 border-black';
    }
  };

  const filteredOrders = purchaseOrders.filter(order => {
    const matchesSearch = order.po_id.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          order.supplier.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
        {/* Header - Neo Brutalist style */}
        <div className="relative border-4 border-black bg-nb-cyan p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <ShoppingCart className="w-5 h-5 text-black" />
              </div>
              <span className="bg-white border-2 border-black font-mono font-bold text-[10px] uppercase px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Procurement</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase font-display tracking-tight text-black mb-2">
              Purchase Orders
            </h1>
            <p className="font-bold text-black text-sm max-w-2xl border-l-4 border-black pl-3 bg-white/50 py-1.5 uppercase">
              Track inventory restocking, supplier fulfillments, and delivery progress.
            </p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-4 mb-8">
          <button 
            onClick={() => setActiveTab('list')}
            className={`px-8 py-4 border-4 border-black font-bold uppercase transition-all ${activeTab === 'list' ? 'bg-black text-white shadow-none' : 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'}`}
          >
            Active Orders
          </button>
          <button 
            onClick={() => setActiveTab('view')}
            disabled={!selectedPO}
            className={`px-8 py-4 border-4 border-black font-bold uppercase transition-all ${!selectedPO ? 'opacity-50 cursor-not-allowed bg-gray-200' : ''} ${activeTab === 'view' ? 'bg-black text-white shadow-none' : 'bg-white text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px]'}`}
          >
            Order Details
          </button>
        </div>

        {activeTab === 'list' && (
          <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 mb-8 pb-8 border-b-4 border-black">
              <div className="flex items-center gap-4">
                <div className="bg-yellow-400 p-3 border-4 border-black">
                  <FileText className="w-8 h-8 text-black" />
                </div>
                <h2 className="font-black text-3xl uppercase">Purchase Ledger</h2>
              </div>
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full xl:w-auto">
                <input
                  type="text"
                  placeholder="Search PO or supplier..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full sm:w-80 px-4 py-4 border-4 border-black font-bold focus:outline-none bg-white"
                />
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-56 px-4 py-4 border-4 border-black font-bold uppercase bg-white cursor-pointer"
                >
                  <option value="all">ALL STATUS</option>
                  <option value="pending">PENDING</option>
                  <option value="confirmed">CONFIRMED</option>
                  <option value="dispatched">DISPATCHED</option>
                  <option value="completed">COMPLETED</option>
                </select>
                <button 
                  onClick={fetchOrders} 
                  className="bg-cyan-400 border-4 border-black p-4 flex items-center justify-center shrink-0 w-full sm:w-auto hover:bg-cyan-500"
                >
                  <RefreshCw className={`w-6 h-6 text-black ${isLoading ? 'animate-spin' : ''}`} />
                </button>
              </div>
            </div>

            <div className="border-4 border-black overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-white uppercase text-sm">
                    <th className="p-5 border-b-4 border-black">PO Ref</th>
                    <th className="p-5 border-b-4 border-black border-l-4">Supplier</th>
                    <th className="p-5 border-b-4 border-black border-l-4">Date</th>
                    <th className="p-5 border-b-4 border-black border-l-4">Total Value</th>
                    <th className="p-5 border-b-4 border-black border-l-4 text-center">Status</th>
                    <th className="p-5 border-b-4 border-black border-l-4 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {isLoading ? (
                    <tr><td colSpan={6} className="p-16 text-center"><Loader2 className="w-12 h-12 animate-spin mx-auto text-black" /></td></tr>
                  ) : filteredOrders.length === 0 ? (
                    <tr><td colSpan={6} className="p-16 text-center font-bold uppercase text-lg">No purchase orders found.</td></tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="border-b-4 border-black hover:bg-yellow-100 transition-colors">
                        <td className="p-5 font-bold text-lg">{order.po_id}</td>
                        <td className="p-5 border-l-4 border-black">
                          <span className="font-bold text-lg">{order.supplier}</span>
                        </td>
                        <td className="p-5 border-l-4 border-black font-bold">{new Date(order.orderDate).toLocaleDateString()}</td>
                        <td className="p-5 border-l-4 border-black font-bold">LKR {order.totalAmount.toLocaleString()}</td>
                        <td className="p-5 border-l-4 border-black text-center">
                          <span className={`px-3 py-1 font-bold border-2 ${getStatusColor(order.status)}`}>
                            {order.status.toUpperCase()}
                          </span>
                        </td>
                        <td className="p-5 border-l-4 border-black text-center">
                          <button 
                            onClick={() => {
                              setSelectedPO(order);
                              setActiveTab('view');
                            }}
                            className="bg-white border-4 border-black p-2 hover:bg-cyan-400"
                          >
                            <Eye className="w-6 h-6 text-black" />
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

        {activeTab === 'view' && selectedPO && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-8">
              <div className="border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex justify-between items-center mb-8 border-b-4 border-black pb-8">
                  <h2 className="font-black text-3xl uppercase">Line Items</h2>
                  <div className="bg-black text-white font-bold py-2 px-4 border-2 border-black">
                    {selectedPO.items?.length || 0} ITEMS
                  </div>
                </div>
                
                <div className="border-4 border-black">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-gray-100 uppercase text-sm">
                        <th className="p-4 border-b-4 border-black border-r-4">Product</th>
                        <th className="p-4 border-b-4 border-black border-r-4 text-center">Qty</th>
                        <th className="p-4 border-b-4 border-black border-r-4 text-right">Price</th>
                        <th className="p-4 border-b-4 border-black text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedPO.items?.map((item: any, idx: number) => (
                        <tr key={idx} className="border-b-4 border-black font-bold">
                          <td className="p-4 border-r-4 border-black">{item.name}</td>
                          <td className="p-4 text-center border-r-4 border-black">{item.quantity}</td>
                          <td className="p-4 text-right border-r-4 border-black">LKR {item.price?.toLocaleString()}</td>
                          <td className="p-4 text-right bg-yellow-200">LKR {(item.quantity * item.price).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="border-4 border-black p-8 bg-gray-50 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-black text-2xl uppercase mb-6 border-b-4 border-black pb-4">Administrative Controls</h2>
                <div className="flex flex-wrap gap-4">
                  <button 
                    onClick={() => handleUpdateStatus(selectedPO.id, 'confirmed')}
                    disabled={isUpdatingStatus || selectedPO.status === 'confirmed'}
                    className="bg-green-400 border-4 border-black font-bold uppercase px-8 py-4 hover:bg-green-500 disabled:opacity-50"
                  >
                    Confirm Order
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(selectedPO.id, 'cancelled')}
                    disabled={isUpdatingStatus || selectedPO.status === 'cancelled'}
                    className="bg-red-500 text-white border-4 border-black font-bold uppercase px-8 py-4 hover:bg-red-600 disabled:opacity-50"
                  >
                    Cancel Order
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(selectedPO.id, 'completed')}
                    disabled={isUpdatingStatus || selectedPO.status === 'completed'}
                    className="bg-black text-white border-4 border-black font-black uppercase px-10 py-4 hover:bg-gray-800 disabled:opacity-50"
                  >
                    Mark as Received
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="border-4 border-black bg-black text-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="p-6 border-b-4 border-white">
                  <h2 className="font-bold uppercase tracking-widest text-cyan-400">Order Summary</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between font-bold">
                    <span>Status</span>
                    <span className={`px-2 border-2 ${getStatusColor(selectedPO.status)} text-black`}>{selectedPO.status.toUpperCase()}</span>
                  </div>
                  <div className="flex justify-between font-bold">
                    <span>Grand Total</span>
                    <span className="text-2xl text-yellow-400">LKR {selectedPO.totalAmount.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="border-4 border-black p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <h2 className="font-black text-xl uppercase mb-6 border-b-4 border-black pb-4">Supplier Profile</h2>
                <div className="flex items-center gap-4 mb-6">
                  <div className="bg-cyan-400 p-4 border-4 border-black">
                    <Building2 className="w-8 h-8" />
                  </div>
                  <p className="font-black text-xl">{selectedPO.supplier}</p>
                </div>
                <div className="space-y-4 font-bold">
                  <div className="flex items-center gap-3 border-2 border-black p-3 bg-white">
                    <Mail className="w-5 h-5" />
                    <span>contact@supplier.com</span>
                  </div>
                  <div className="flex items-center gap-3 border-2 border-black p-3 bg-white">
                    <Phone className="w-5 h-5" />
                    <span>+94 77 123 4567</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}