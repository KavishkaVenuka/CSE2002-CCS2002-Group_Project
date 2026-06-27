"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import {
  CreditCard,
  Search,
  Eye,
  CheckCircle,
  Clock,
  XCircle,
  Loader2,
  RefreshCw,
  Banknote,
  FileText,
  X
} from 'lucide-react';

interface SupplierPayment {
  _id: string;
  transaction_id: string;
  type: string;
  category: string;
  relatedEntity: string;
  amount: number;
  paymentMethod: string;
  bankAccountName?: string;
  date: string;
  status: string;
  notes?: string;
  receiptUrl?: string;
}

export default function SupplierPaymentsAdmin() {
  const [payments, setPayments] = useState<SupplierPayment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<SupplierPayment | null>(null);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();
      const res = await axios.get('http://localhost:5900/api/supplier-payments', { headers });
      setPayments(res.data.payments || []);
    } catch (err) {
      console.error('Error fetching supplier payments:', err);
      toast.error('Failed to load supplier payment data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchPayments(); }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-nb-green text-black';
      case 'pending':   return 'bg-nb-yellow text-black';
      case 'failed':    return 'bg-nb-red text-white';
      default:          return 'bg-gray-200 text-black';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4 mr-1" />;
      case 'pending':   return <Clock className="w-4 h-4 mr-1" />;
      case 'failed':    return <XCircle className="w-4 h-4 mr-1" />;
      default:          return null;
    }
  };

  const filtered = payments.filter(p => {
    const q = searchTerm.toLowerCase();
    const matchSearch =
      (p.transaction_id || '').toLowerCase().includes(q) ||
      (p.relatedEntity || '').toLowerCase().includes(q) ||
      (p.category || '').toLowerCase().includes(q);
    const matchStatus = statusFilter === 'all' || p.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Summary stats
  const totalPaid    = payments.filter(p => p.status === 'completed').reduce((s, p) => s + p.amount, 0);
  const totalPending = payments.filter(p => p.status === 'pending').reduce((s, p) => s + p.amount, 0);
  const totalFailed  = payments.filter(p => p.status === 'failed').length;

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
        
        {/* Header - Neo Brutalist style */}
        <div className="relative border-4 border-black bg-blue-400 p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <CreditCard className="w-5 h-5 text-black" />
              </div>
              <span className="bg-white border-2 border-black font-mono font-bold text-[10px] uppercase px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Outbound Payments</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase font-display tracking-tight text-black mb-2">
              Supplier Payments
            </h1>
            <p className="font-bold text-black text-sm max-w-2xl border-l-4 border-black pl-3 bg-white/50 py-1.5 uppercase">
              All payments made to suppliers from the business.
            </p>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Paid Out', value: `LKR ${totalPaid.toLocaleString()}`, icon: CheckCircle, bg: 'bg-nb-green' },
            { label: 'Pending', value: `LKR ${totalPending.toLocaleString()}`, icon: Clock, bg: 'bg-nb-yellow' },
            { label: 'All Transactions', value: `${payments.length}`, icon: FileText, bg: 'bg-white' },
            { label: 'Failed', value: `${totalFailed}`, icon: XCircle, bg: 'bg-nb-red text-white' },
          ].map((card, i) => (
            <div key={i} className={`border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] ${card.bg}`}>
              <div className="w-12 h-12 bg-black border-2 border-black rounded-none flex items-center justify-center mb-4 shadow-[2px_2px_0px_0px_rgba(255,255,255,1)]">
                <card.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className={`text-sm font-black uppercase tracking-widest mb-1 ${card.bg.includes('text-white') ? 'text-white' : 'text-black'}`}>{card.label}</h3>
              <p className={`text-2xl font-black ${card.bg.includes('text-white') ? 'text-white' : 'text-black'}`}>{card.value}</p>
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black font-bold" />
            <input
              placeholder="SEARCH BY ID, SUPPLIER..."
              className="pl-12 w-full border-2 border-black bg-nb-bg h-14 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all uppercase"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <select 
              value={statusFilter} 
              onChange={e => setStatusFilter(e.target.value)}
              className="w-full md:w-48 h-14 border-2 border-black bg-nb-bg font-bold uppercase text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] px-4 focus:outline-none"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="failed">Failed</option>
            </select>
            <button 
              className="h-14 px-6 border-2 border-black bg-white flex items-center justify-center hover:bg-nb-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-black uppercase tracking-widest shrink-0"
              onClick={fetchPayments}
            >
              <RefreshCw className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="bg-black text-white px-6 py-4 border-b-4 border-black flex items-center gap-3">
            <CreditCard className="w-6 h-6 text-nb-yellow" />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Payment Transactions ({filtered.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-nb-bg border-b-4 border-black">
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Transaction ID</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Supplier</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Category</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Amount</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Method</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center whitespace-nowrap">Status</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Date</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={8} className="h-64 text-center py-20 bg-white">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-black" />
                      <p className="text-black text-sm font-black uppercase tracking-widest">Syncing with database...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-40 text-center font-mono font-bold text-gray-500 bg-white p-8 uppercase tracking-widest">
                      No supplier payment records found.
                    </td>
                  </tr>
                ) : (
                  filtered.map(p => (
                    <tr key={p._id} className="hover:bg-nb-cyan/20 transition-colors border-b-4 border-black last:border-b-0 bg-white">
                      <td className="p-5 font-mono text-sm font-bold border-r-4 border-black">{p.transaction_id || '—'}</td>
                      <td className="p-5 border-r-4 border-black font-black uppercase tracking-wide text-sm">{p.relatedEntity}</td>
                      <td className="p-5 border-r-4 border-black font-bold uppercase text-sm">{p.category}</td>
                      <td className="p-5 border-r-4 border-black font-black text-lg">LKR {p.amount.toLocaleString()}</td>
                      <td className="p-5 border-r-4 border-black font-bold uppercase text-sm">{p.paymentMethod}</td>
                      <td className="p-5 text-center border-r-4 border-black">
                        <span className={`inline-flex items-center ${getStatusColor(p.status)} border-2 border-black font-mono text-[10px] font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                          {getStatusIcon(p.status)}{p.status}
                        </span>
                      </td>
                      <td className="p-5 text-sm font-bold border-r-4 border-black">{new Date(p.date).toLocaleDateString()}</td>
                      <td className="p-5 text-right">
                        <button
                          className="bg-white border-2 border-black h-10 px-4 inline-flex items-center justify-center font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                          onClick={() => { setSelected(p); setShowModal(true); }}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View
                        </button>
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
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-2xl my-8 relative flex flex-col">
            <div className="bg-nb-cyan border-b-4 border-black p-6 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Banknote className="w-5 h-5 text-black" />
                </div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">Supplier Payment Details</h2>
              </div>
              <button 
                onClick={() => setShowModal(false)}
                className="w-10 h-10 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-nb-red hover:text-white transition-colors nb-interactive shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 space-y-6 bg-white overflow-y-auto">
              <div className="grid grid-cols-2 gap-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-nb-bg">
                {[
                  { label: 'Transaction ID', value: selected.transaction_id || '—' },
                  { label: 'Supplier', value: selected.relatedEntity },
                  { label: 'Category', value: selected.category },
                  { label: 'Method', value: selected.paymentMethod },
                  { label: 'Bank', value: selected.bankAccountName || '—' },
                  { label: 'Date', value: new Date(selected.date).toLocaleDateString() },
                ].map((row, i) => (
                  <div key={i} className="p-4 border-b-4 border-black last:border-b-0 even:border-l-4 even:border-l-black">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">{row.label}</p>
                    <p className="font-bold text-sm text-black">{row.value}</p>
                  </div>
                ))}
                
                <div className="col-span-2 p-4 border-t-4 border-black bg-white flex justify-between items-center">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest mb-2">Status</p>
                    <span className={`inline-flex items-center ${getStatusColor(selected.status)} border-2 border-black font-mono text-sm font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                      {getStatusIcon(selected.status)}{selected.status}
                    </span>
                  </div>
                  <div className="text-right">
                    <p className="text-[10px] font-black uppercase tracking-widest mb-1">Amount</p>
                    <p className="font-black text-2xl">LKR {selected.amount.toLocaleString()}</p>
                  </div>
                </div>
              </div>

              {selected.notes && (
                <div className="p-4 bg-nb-yellow border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <p className="font-black text-[10px] uppercase tracking-widest mb-2 border-b-2 border-black inline-block">Notes</p>
                  <p className="font-bold text-sm whitespace-pre-wrap">{selected.notes}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t-4 border-black bg-nb-bg flex justify-end">
              <button 
                className="bg-white border-4 border-black h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-100 transition-colors nb-interactive"
                onClick={() => setShowModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}