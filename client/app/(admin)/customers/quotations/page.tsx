'use client';

import { useState, useEffect, useMemo } from 'react';
import { AdminSidebar } from "@/components/admin/Sidebar";
import {
  Send,
  Search,
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  BarChart3,
  Loader2,
  AlertCircle,
  RefreshCw,
  Package,
  User,
  Building,
  FileText,
  Banknote
} from 'lucide-react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

// ─── Types ────────────────────────────────────────────────────────────────────

interface QuotationItem {
  name: string;
  productID?: string;
  quantity: number;
  unit?: string;
  price?: number;
  unitPrice?: number;
  totalPrice?: number;
  description?: string;
}

interface Quotation {
  _id: string;
  quotationID: string;
  sq_id?: string;
  name: string;
  email: string;
  items: QuotationItem[];
  date: string;
  createdAt?: string;
  status: 'draft' | 'pending' | 'accepted' | 'rejected' | string;
  total: number;
  total_estimate?: number;
  subtotal?: number;
  tax_amount?: number;
  currency?: string;
  notes?: string;
  validUntil?: string;
  payment_terms?: string;
  delivery_timeline?: string;
  quotationType?: string;
}

// ─── Helper ───────────────────────────────────────────────────────────────────

const BACKEND = 'http://localhost:5900';

const STATUS_MAP: Record<string, { label: string; cls: string }> = {
  draft:     { label: 'Draft',     cls: 'bg-slate-200 text-nb-black border-nb-black' },
  pending:   { label: 'Pending',   cls: 'bg-nb-yellow text-nb-black border-nb-black' },
  quoted:    { label: 'Quoted',    cls: 'bg-nb-cyan text-nb-black border-nb-black' },
  accepted:  { label: 'Accepted',  cls: 'bg-nb-green text-nb-black border-nb-black' },
  delivered: { label: 'Delivered', cls: 'bg-purple-300 text-nb-black border-nb-black' },
  rejected:  { label: 'Rejected',  cls: 'bg-nb-red text-white border-nb-black' },
};

function getStatusCls(status: string) {
  return STATUS_MAP[status?.toLowerCase()]?.cls ?? 'bg-slate-200 text-nb-black border-nb-black';
}
function getStatusLabel(status: string) {
  return STATUS_MAP[status?.toLowerCase()]?.label ?? status;
}

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

// ─── Component ────────────────────────────────────────────────────────────────

export default function CustomerQuotations() {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [searchQuery, setSearchQuery]   = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [showDetailsModal, setShowDetailsModal]     = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState<Quotation | null>(null);

  // ── Fetch ──────────────────────────────────────────────────────────────────
  const fetchQuotations = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BACKEND}/api/quotations/all`);
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      if (!data.success) throw new Error(data.message || 'Failed to load quotations');
      setQuotations(data.quotations ?? []);
    } catch (err: any) {
      setError(err.message ?? 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchQuotations(); }, []);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const stats = useMemo(() => ({
    total:     quotations.length,
    pending:   quotations.filter(q => q.status?.toLowerCase() === 'pending').length,
    accepted:  quotations.filter(q => q.status?.toLowerCase() === 'accepted' || q.status?.toLowerCase() === 'quoted').length,
    rejected:  quotations.filter(q => q.status?.toLowerCase() === 'rejected').length,
  }), [quotations]);

  // ── Monthly chart ──────────────────────────────────────────────────────────
  const chartData = useMemo(() => {
    const months: Record<string, { month: string; approved: number; rejected: number }> = {};
    const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

    quotations.forEach(q => {
      const dateStr = q.date || q.createdAt;
      if (!dateStr) return;
      const d = new Date(dateStr);
      const key = `${d.getFullYear()}-${d.getMonth()}`;
      if (!months[key]) {
        months[key] = { month: MONTH_NAMES[d.getMonth()], approved: 0, rejected: 0 };
      }
      if (q.status?.toLowerCase() === 'rejected') months[key].rejected++;
      else months[key].approved++;
    });

    return Object.values(months).slice(-6);
  }, [quotations]);

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered = useMemo(() => quotations.filter(q => {
    const query = searchQuery.toLowerCase();
    const idStr = q.quotationID || q.sq_id || '';
    const nameStr = q.name || '';
    const emailStr = q.email || '';
    
    const matchesSearch =
      idStr.toLowerCase().includes(query) ||
      nameStr.toLowerCase().includes(query) ||
      emailStr.toLowerCase().includes(query);
      
    const matchesStatus = statusFilter === 'all' || q.status?.toLowerCase() === statusFilter;
    return matchesSearch && matchesStatus;
  }), [quotations, searchQuery, statusFilter]);

  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-x-hidden">

        {/* Header */}
        <div className="relative border-4 border-nb-black bg-nb-cyan p-10 shadow-nb-lg">
          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <span className="nb-badge bg-white text-nb-black mb-4">Quotation Management</span>
              <h1 className="text-5xl font-black uppercase font-display tracking-tight text-nb-black">
                Quotations
              </h1>
              <p className="mt-4 font-bold text-nb-black max-w-xl text-lg border-l-4 border-nb-black pl-4 bg-white/50 py-2">
                Manage and track all generated quotations
              </p>
            </div>
            <button
              onClick={fetchQuotations}
              className="px-6 py-3 border-4 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2"
              disabled={loading}
            >
              <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="flex items-center justify-between p-4 bg-nb-red border-4 border-nb-black shadow-nb text-white font-bold">
            <div className="flex items-center gap-3">
              <AlertCircle className="w-6 h-6 flex-shrink-0" />
              <span className="uppercase tracking-widest">{error}</span>
            </div>
            <button onClick={fetchQuotations} className="px-4 py-2 bg-white text-nb-black border-2 border-nb-black uppercase text-sm font-black nb-interactive">
              Retry
            </button>
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[
            { label: 'Total Quotations', count: stats.total,    color: 'bg-nb-cyan',   icon: FileText },
            { label: 'Pending',          count: stats.pending,  color: 'bg-nb-yellow', icon: Clock },
            { label: 'Approved',         count: stats.accepted, color: 'bg-nb-green',  icon: CheckCircle },
            { label: 'Rejected',         count: stats.rejected, color: 'bg-nb-red',    icon: XCircle, textWhite: true },
          ].map((stat) => (
            <div key={stat.label} className={`nb-card nb-interactive p-6 flex flex-col justify-between ${stat.textWhite ? 'text-white' : 'text-nb-black'} ${stat.color}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-16 w-16 items-center justify-center border-4 border-nb-black shadow-nb-sm bg-white`}>
                  <stat.icon className="w-8 h-8 text-nb-black" />
                </div>
              </div>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest opacity-80">{stat.label}</p>
                {loading ? (
                  <div className="h-10 w-16 bg-white/50 border-2 border-nb-black animate-pulse mt-2" />
                ) : (
                  <p className="text-4xl font-black font-display mt-2">{stat.count}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Monthly Chart */}
        <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
          <div className="bg-nb-yellow border-b-4 border-nb-black px-8 py-6 flex items-center justify-between">
            <h3 className="font-black uppercase font-display text-2xl flex items-center gap-3">
              <BarChart3 className="w-8 h-8" /> Quotations Overview (Monthly)
            </h3>
          </div>
          <div className="p-6">
            {loading ? (
              <div className="h-[300px] flex items-center justify-center">
                <Loader2 className="w-12 h-12 animate-spin text-nb-black" />
              </div>
            ) : chartData.length === 0 ? (
              <div className="h-[300px] flex items-center justify-center text-gray-500 font-bold uppercase tracking-widest">
                No data available yet
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#000" vertical={false} />
                  <XAxis dataKey="month" stroke="#000" tick={{fontFamily: 'Space Mono', fontWeight: 700}} />
                  <YAxis stroke="#000" tick={{fontFamily: 'Space Mono', fontWeight: 700}} />
                  <Tooltip contentStyle={{ border: '4px solid #000', borderRadius: 0, boxShadow: '4px 4px 0px 0px #000' }} />
                  <Line type="monotone" dataKey="approved" stroke="#4ADE80" strokeWidth={4} name="Approved" dot={{ strokeWidth: 4, r: 4 }} />
                  <Line type="monotone" dataKey="rejected" stroke="#EF4444" strokeWidth={4} name="Rejected" dot={{ strokeWidth: 4, r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Table */}
        <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
          <div className="bg-nb-cyan border-b-4 border-nb-black px-8 py-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h3 className="font-black uppercase font-display text-2xl flex items-center gap-3">
              <FileText className="w-8 h-8" /> All Quotations
              {!loading && <span className="text-sm border-2 border-nb-black bg-white px-2 py-1 shadow-nb-sm">{filtered.length}</span>}
            </h3>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nb-black font-bold" />
                <input
                  placeholder="SEARCH ID, CUSTOMER..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border-2 border-nb-black font-bold uppercase w-72 focus:outline-none focus:ring-2 focus:ring-nb-black shadow-[2px_2px_0px_0px_#000]"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="pl-4 pr-8 py-2 border-2 border-nb-black font-bold uppercase bg-white cursor-pointer appearance-none focus:outline-none shadow-[2px_2px_0px_0px_#000] w-40"
              >
                <option value="all">ALL STATUS</option>
                <option value="draft">DRAFT</option>
                <option value="pending">PENDING</option>
                <option value="accepted">ACCEPTED</option>
                <option value="rejected">REJECTED</option>
              </select>
            </div>
          </div>
          
          <div className="overflow-x-auto">
            {loading ? (
              <div className="flex items-center justify-center py-20 border-t-2 border-nb-black">
                <Loader2 className="w-12 h-12 animate-spin text-nb-black" />
                <span className="ml-3 font-bold uppercase tracking-widest text-lg">Loading quotations...</span>
              </div>
            ) : filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-gray-500 border-t-2 border-nb-black">
                <FileText className="w-16 h-16 mb-4 text-nb-black" />
                <p className="text-2xl font-black uppercase text-nb-black">No quotations found</p>
                <p className="font-bold mt-2 text-nb-black">Try adjusting your search or filter</p>
              </div>
            ) : (
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-nb-bg border-b-4 border-nb-black">
                  <tr>
                    <th className="py-5 pl-8 pr-4 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Quotation ID</th>
                    <th className="p-5 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Customer</th>
                    <th className="p-5 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Items</th>
                    <th className="p-5 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Total (LKR)</th>
                    <th className="p-5 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Date</th>
                    <th className="p-5 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Status</th>
                    <th className="py-5 pr-8 pl-4 font-mono text-sm font-bold uppercase text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((q) => (
                    <tr key={q._id} className="hover:bg-nb-bg transition-colors border-b-2 border-nb-black last:border-0">
                      <td className="py-5 pl-8 pr-4 font-bold text-lg border-r-2 border-nb-black whitespace-nowrap">{q.quotationID || q.sq_id}</td>
                      <td className="p-5 border-r-2 border-nb-black">
                        <div className="font-bold text-lg">{q.name}</div>
                        <div className="font-mono text-xs uppercase bg-nb-black text-white inline-block px-2 py-1 mt-1 border-2 border-nb-black">{q.email}</div>
                      </td>
                      <td className="p-5 font-bold border-r-2 border-nb-black text-lg">
                        {q.items?.length ?? 0} item{q.items?.length !== 1 ? 's' : ''}
                      </td>
                      <td className="p-5 font-black border-r-2 border-nb-black text-xl">
                        {(q.total || q.total_estimate || 0).toFixed(2)}
                      </td>
                      <td className="p-5 font-bold uppercase border-r-2 border-nb-black">
                        {formatDate(q.date || q.createdAt || '')}
                      </td>
                      <td className="p-5 border-r-2 border-nb-black">
                        <span className={`nb-badge ${getStatusCls(q.status)}`}>
                          {getStatusLabel(q.status)}
                        </span>
                      </td>
                      <td className="py-5 pr-8 pl-4 text-right">
                        <button
                          className="px-4 py-2 border-2 border-nb-black bg-white text-nb-black font-bold uppercase text-xs shadow-nb-sm nb-interactive flex items-center justify-center w-full max-w-[100px] ml-auto gap-2"
                          onClick={() => {
                            setSelectedQuotation(q);
                            setShowDetailsModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" /> View
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>

      {/* Details Modal */}
      {showDetailsModal && selectedQuotation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white border-4 border-nb-black shadow-nb-xl w-full max-w-4xl max-h-[90vh] flex flex-col">
            
            <div className="bg-nb-yellow border-b-4 border-nb-black p-6 sm:p-8 flex justify-between items-start shrink-0">
              <div>
                <h2 className="text-3xl font-black uppercase font-display text-nb-black mb-2 flex items-center gap-3">
                  <FileText className="w-8 h-8" /> Quotation Details
                </h2>
              </div>
              <button 
                onClick={() => setShowDetailsModal(false)} 
                className="bg-white border-2 border-nb-black p-2 shadow-nb-sm nb-interactive hover:bg-nb-red hover:text-white transition-colors"
              >
                <XCircle className="w-8 h-8" />
              </button>
            </div>

            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-nb-bg flex-1">
              
              {/* Meta grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 p-6 border-4 border-nb-black bg-white shadow-nb">
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1">Quotation ID</p>
                  <p className="text-xl font-black uppercase">{selectedQuotation.quotationID || selectedQuotation.sq_id}</p>
                </div>
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1">Status</p>
                  <span className={`nb-badge text-sm ${getStatusCls(selectedQuotation.status)}`}>
                    {getStatusLabel(selectedQuotation.status)}
                  </span>
                </div>
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1 flex items-center gap-1"><User className="w-3 h-3"/>Customer</p>
                  <p className="text-lg font-bold">{selectedQuotation.name}</p>
                </div>
                <div>
                  <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1">Date</p>
                  <p className="text-lg font-bold uppercase">{formatDate(selectedQuotation.date || selectedQuotation.createdAt || '')}</p>
                </div>

                <div className="col-span-2">
                  <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1">Email</p>
                  <p className="text-sm font-bold uppercase mt-1 px-2 py-1 bg-nb-black text-white inline-block border-2 border-nb-black">{selectedQuotation.email}</p>
                </div>
                {selectedQuotation.validUntil && (
                  <div className="col-span-2">
                    <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-1">Valid Until</p>
                    <p className="text-lg font-bold uppercase">{formatDate(selectedQuotation.validUntil)}</p>
                  </div>
                )}
              </div>

              {/* Items list */}
              <div className="border-4 border-nb-black bg-white shadow-nb overflow-hidden">
                <div className="bg-nb-cyan border-b-4 border-nb-black p-4">
                  <h3 className="text-xl font-black uppercase font-display text-nb-black flex items-center gap-2">
                    <Package className="w-6 h-6" />
                    Quoted Items ({selectedQuotation.items?.length ?? 0})
                  </h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead className="bg-gray-100 border-b-4 border-nb-black">
                      <tr>
                        <th className="p-4 font-mono text-sm uppercase font-bold border-r-2 border-nb-black">Item</th>
                        <th className="p-4 font-mono text-sm uppercase font-bold text-center border-r-2 border-nb-black">Qty</th>
                        <th className="p-4 font-mono text-sm uppercase font-bold text-right border-r-2 border-nb-black">Unit Price</th>
                        <th className="p-4 font-mono text-sm uppercase font-bold text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedQuotation.items?.map((item, idx) => {
                        const price = item.unitPrice || item.price || 0;
                        const total = item.totalPrice || (price * item.quantity);
                        return (
                          <tr key={idx} className="border-b-2 border-nb-black last:border-0 hover:bg-nb-bg transition-colors">
                            <td className="p-4 border-r-2 border-nb-black">
                              <p className="text-lg font-bold">{item.name || item.productID}</p>
                              {item.description && (
                                <p className="text-sm font-medium mt-2 bg-gray-100 p-2 border-l-4 border-nb-black">
                                  {item.description}
                                </p>
                              )}
                            </td>
                            <td className="p-4 text-center border-r-2 border-nb-black">
                              <span className="text-2xl font-black">{item.quantity}</span>
                              <span className="block font-mono text-xs font-bold uppercase mt-1">{item.unit || 'units'}</span>
                            </td>
                            <td className="p-4 text-right font-black text-lg border-r-2 border-nb-black">
                              LKR {price.toFixed(2)}
                            </td>
                            <td className="p-4 text-right font-black text-xl text-nb-cyan bg-nb-black">
                              LKR {total.toFixed(2)}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Financial Summary */}
              <div className="flex flex-col md:flex-row justify-end pt-4 gap-6">
                {selectedQuotation.notes && (
                  <div className="flex-1 p-6 border-4 border-nb-black bg-nb-yellow shadow-nb">
                    <p className="font-black uppercase text-xl text-nb-black mb-2 flex items-center gap-2">
                      <FileText className="w-6 h-6" /> Notes
                    </p>
                    <p className="text-sm font-bold uppercase whitespace-pre-wrap">{selectedQuotation.notes}</p>
                  </div>
                )}
                
                <div className="w-full md:w-80 space-y-4 border-4 border-nb-black bg-white p-6 shadow-nb">
                  <div className="flex justify-between font-bold uppercase text-lg">
                    <span>Subtotal</span>
                    <span>LKR {(selectedQuotation.subtotal || selectedQuotation.total || selectedQuotation.total_estimate || 0).toFixed(2)}</span>
                  </div>
                  {selectedQuotation.tax_amount !== undefined && selectedQuotation.tax_amount > 0 && (
                    <div className="flex justify-between font-bold uppercase text-lg text-nb-red">
                      <span>Tax</span>
                      <span>+ LKR {selectedQuotation.tax_amount.toFixed(2)}</span>
                    </div>
                  )}
                  <div className="border-t-4 border-nb-black pt-4 flex justify-between font-black uppercase text-2xl">
                    <span>Total</span>
                    <span className="bg-nb-green px-2 border-2 border-nb-black shadow-nb-sm">LKR {(selectedQuotation.total || selectedQuotation.total_estimate || 0).toFixed(2)}</span>
                  </div>
                </div>
              </div>

            </div>
            
            <div className="p-6 border-t-4 border-nb-black bg-white shrink-0 flex justify-end">
               <button 
                  onClick={() => setShowDetailsModal(false)}
                  className="px-8 py-3 border-4 border-nb-black bg-nb-black text-white font-black uppercase shadow-nb-sm nb-interactive"
               >
                 Close Details
               </button>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}