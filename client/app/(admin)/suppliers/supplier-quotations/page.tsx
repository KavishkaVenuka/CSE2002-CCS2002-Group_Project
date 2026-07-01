"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  Send,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Loader2,
  RefreshCw,
  FileText,
  Package,
  ChevronsUpDown,
  X
} from 'lucide-react';

interface QuotationItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  unit?: string;
  notes?: string;
}

interface Quotation {
  _id: string;
  quotationID?: string;
  supplierEmail?: string;
  companyName?: string;
  status: string;
  total?: number;
  total_estimate?: number;
  totalAmount?: number;
  subtotal?: number;
  tax_amount?: number;
  createdAt: string;
  items: QuotationItem[];
  notes?: string;
  quotationType?: string;
}

export default function SupplierQuotationsAdmin() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<Quotation | null>(null);

  const getAuthHeader = () => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      const token = user?.token || localStorage.getItem('token') || '';
      return token ? { Authorization: `Bearer ${token}` } : {};
    } catch { return {}; }
  };

  const fetchQuotations = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('http://localhost:5900/api/suppliers/quotations/all', { headers: getAuthHeader() });
      setQuotations(res.data.quotations || res.data || []);
    } catch (err) {
      console.error('Failed to load quotations:', err);
      toast.error('Failed to load supplier quotations');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchQuotations(); }, []);


  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':  return 'bg-nb-green text-black';
      case 'rejected':  return 'bg-nb-red text-white';
      case 'pending':   return 'bg-nb-yellow text-black';
      case 'submitted': return 'bg-nb-cyan text-black';
      case 'draft':     return 'bg-gray-200 text-black';
      default:          return 'bg-gray-200 text-black';
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await axios.put(`http://localhost:5900/api/suppliers/quotations/accept/${id}`, {}, { headers: getAuthHeader() });
      toast.success('Quotation approved');
      fetchQuotations();
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to approve quotation');
    }
  };

  const handleReject = async (id: string) => {
    try {
      await axios.put(`http://localhost:5900/api/suppliers/quotations/reject/${id}`, {}, { headers: getAuthHeader() });
      toast.error('Quotation rejected');
      fetchQuotations();
      setShowModal(false);
    } catch (err) {
      toast.error('Failed to reject quotation');
    }
  };


  const filtered = quotations.filter(q => {
    const queryLower = searchTerm.toLowerCase();
    const matchSearch =
      (q.quotationID || q._id).toLowerCase().includes(queryLower) ||
      (q.supplierEmail || '').toLowerCase().includes(queryLower) ||
      (q.companyName || '').toLowerCase().includes(queryLower);
    const matchStatus = statusFilter === 'all' || q.status?.toLowerCase() === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
        
        {/* Header */}
        <div className="relative border-4 border-black bg-nb-cyan p-8 md:p-10 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Send className="w-6 h-6 text-black" />
              </div>
              <span className="bg-white border-2 border-black font-mono font-bold text-xs uppercase px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Quotation Review</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-black uppercase font-display tracking-tight text-black mb-4">
              Supplier Quotations
            </h1>
            <p className="font-bold text-black text-lg max-w-2xl border-l-4 border-black pl-4 bg-white/50 py-2 uppercase">
              Review and approve or reject supplier price quotations
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black font-bold" />
            <input
              placeholder="SEARCH BY ID, EMAIL..."
              className="pl-12 w-full border-2 border-black bg-nb-bg h-14 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all uppercase"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-48">
              <select 
                value={statusFilter} 
                onChange={e => setStatusFilter(e.target.value)}
                className="w-full border-2 border-black h-14 px-4 bg-nb-yellow font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none appearance-none cursor-pointer uppercase nb-interactive"
              >
                <option value="all">ALL STATUS</option>
                <option value="pending">PENDING</option>
                <option value="submitted">SUBMITTED</option>
                <option value="approved">APPROVED</option>
                <option value="rejected">REJECTED</option>
                <option value="draft">DRAFT</option>
              </select>
              <ChevronsUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
            </div>
            <button 
              className="w-14 h-14 border-2 border-black bg-white flex items-center justify-center hover:bg-nb-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all shrink-0"
              onClick={fetchQuotations}
            >
              <RefreshCw className={`w-6 h-6 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="bg-black text-white px-6 py-4 border-b-4 border-black flex items-center gap-3">
            <Send className="w-6 h-6 text-nb-yellow" />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Supplier Quotations ({filtered.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-nb-bg border-b-4 border-black">
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Quotation ID</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Supplier</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center whitespace-nowrap">Items</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Total Amount</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center whitespace-nowrap">Status</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Date</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="h-64 text-center py-20 bg-white">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-black" />
                      <p className="text-black text-sm font-black uppercase tracking-widest">Loading Quotations...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="h-40 text-center font-mono font-bold text-gray-500 bg-white p-8 uppercase tracking-widest">
                      No supplier quotations found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(q => (
                    <tr key={q._id} className="hover:bg-nb-cyan/20 transition-colors border-b-4 border-black last:border-b-0 bg-white">
                      <td className="p-5 font-mono text-xs font-bold border-r-4 border-black">
                        {q._id || q.quotationID || q._id.slice(-8).toUpperCase()}
                      </td>
                      <td className="p-5 border-r-4 border-black">
                        <div className="text-sm font-black uppercase tracking-wide">{q.supplierEmail || q.companyName || '—'}</div>
                      </td>
                      <td className="p-5 text-center border-r-4 border-black">
                        <span className="inline-flex items-center justify-center w-8 h-8 bg-black border-2 border-black text-white font-black text-sm shadow-[2px_2px_0px_0px_rgba(0,0,0,0.5)]">
                          {q.items?.length || 0}
                        </span>
                      </td>
                      <td className="p-5 font-black text-lg border-r-4 border-black">
                        LKR {(q.total || q.total_estimate || q.totalAmount || q.subtotal || 0).toLocaleString()}
                      </td>
                      <td className="p-5 text-center border-r-4 border-black">
                        <span className={`inline-block ${getStatusColor(q.status)} border-2 border-black font-mono text-[10px] font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                          {q.status || '—'}
                        </span>
                      </td>
                      <td className="p-5 font-mono text-xs font-bold border-r-4 border-black">
                        {new Date(q.createdAt).toLocaleDateString()}
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="bg-white border-2 border-black h-10 px-4 inline-flex items-center justify-center font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-cyan hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            onClick={() => { setSelected(q); setShowModal(true); }}
                          >
                            <Eye className="w-4 h-4 mr-2" /> View
                          </button>
                          {(q.status === 'pending' || q.status === 'submitted') && (
                            <>
                              <button
                                className="bg-nb-green border-2 border-black h-10 px-3 inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-green-500 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-black"
                                onClick={() => handleApprove(q._id)}
                              >
                                <CheckCircle className="w-5 h-5" />
                              </button>
                              <button
                                className="bg-nb-red border-2 border-black h-10 px-3 inline-flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-red-600 hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all text-white"
                                onClick={() => handleReject(q._id)}
                              >
                                <XCircle className="w-5 h-5" />
                              </button>
                            </>
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

      {/* Detail Modal */}
      {showModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="bg-nb-yellow border-b-4 border-black p-8 flex justify-between items-center sticky top-0 z-20">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <FileText className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">Quotation Details</h2>
                </div>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-nb-red hover:text-white transition-colors nb-interactive shrink-0"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 bg-white overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-nb-bg">
                <div className="p-6 border-b-4 md:border-b-0 border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Quotation ID</p>
                  <p className="font-mono text-sm font-bold text-black">{selected._id || selected.quotationID || selected._id.slice(-8).toUpperCase()}</p>
                </div>
                <div className="p-6 border-b-4 md:border-b-0 md:border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Submitted</p>
                  <p className="font-mono text-sm font-bold text-black">{new Date(selected.createdAt).toLocaleString()}</p>
                </div>
                <div className="p-6 border-b-4 md:border-b-0 border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Supplier</p>
                  <p className="font-mono text-sm font-bold text-black">{selected.supplierEmail || selected.companyName || '—'}</p>
                </div>
                <div className="p-6 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Status</p>
                  <span className={`inline-block ${getStatusColor(selected.status)} border-2 border-black font-mono text-[10px] font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                    {selected.status || '—'}
                  </span>
                </div>
              </div>

              {/* Quotation Items */}
              <div>
                <h3 className="font-black uppercase text-sm tracking-widest flex items-center gap-3 bg-black text-white p-4 border-4 border-black">
                  <Package className="w-5 h-5 text-nb-yellow" />
                  Quoted Items
                </h3>
                <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-nb-bg border-b-4 border-black">
                        <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black">Item</th>
                        <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center">Qty</th>
                        <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black text-right">Unit Price</th>
                        <th className="p-4 font-black text-xs uppercase tracking-widest text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items?.length > 0 ? (
                        selected.items.map((item, idx) => (
                          <tr key={idx} className="border-b-4 border-black last:border-b-0 hover:bg-nb-yellow/20 transition-colors">
                            <td className="p-4 border-r-4 border-black font-bold text-sm uppercase">{item.itemName}</td>
                            <td className="p-4 border-r-4 border-black text-center">
                              <span className="inline-block bg-nb-cyan border-2 border-black font-mono font-bold text-sm px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                                {item.quantity} <span className="text-[10px] uppercase ml-1">{item.unit || ''}</span>
                              </span>
                            </td>
                            <td className="p-4 border-r-4 border-black text-right font-mono font-bold text-sm">LKR {item.unitPrice.toLocaleString()}</td>
                            <td className="p-4 text-right font-mono font-black text-lg text-nb-green">LKR {item.totalPrice.toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="text-center font-mono font-bold text-gray-500 bg-white p-8 uppercase tracking-widest">
                            No items listed in this quotation
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
                
                <div className="flex justify-end mt-8">
                  <div className="bg-nb-bg border-4 border-black p-6 min-w-[320px] space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between font-bold uppercase text-sm">
                      <span>Subtotal</span>
                      <span className="font-mono">LKR {(selected.subtotal || 0).toLocaleString()}</span>
                    </div>
                    {selected.tax_amount !== undefined && (
                      <div className="flex justify-between font-bold uppercase text-sm">
                        <span>Tax</span>
                        <span className="font-mono">LKR {selected.tax_amount.toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between font-black uppercase text-2xl border-t-4 border-black pt-4">
                      <span>Total</span>
                      <span className="text-nb-green drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">LKR {(selected.total || selected.total_estimate || selected.totalAmount || selected.subtotal || 0).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              </div>

              {selected.notes && (
                <div className="p-6 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] mt-8">
                  <p className="text-xs font-black uppercase tracking-widest mb-2 border-b-2 border-black pb-2">Notes</p>
                  <p className="font-mono font-bold text-sm whitespace-pre-wrap">{selected.notes}</p>
                </div>
              )}
            </div>

            <div className="p-8 border-t-4 border-black bg-white flex justify-end gap-4 sticky bottom-0 z-20">
              <button 
                className="bg-white border-4 border-black h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-bg transition-colors nb-interactive" 
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
              {(selected.status === 'pending' || selected.status === 'submitted') && (
                <>
                  <button
                    className="bg-nb-red text-white border-4 border-black h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
                    onClick={() => handleReject(selected._id)}
                  >
                    <XCircle className="w-5 h-5" /> Reject
                  </button>
                  <button
                    className="bg-nb-green text-black border-4 border-black h-14 px-10 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center gap-2"
                    onClick={() => handleApprove(selected._id)}
                  >
                    <CheckCircle className="w-5 h-5" /> Approve
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}