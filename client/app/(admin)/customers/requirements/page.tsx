'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { AdminSidebar } from "@/components/admin/Sidebar";
import { toast } from 'sonner';
import { 
  FileText, 
  FilePlus, 
  Send, 
  Loader2, 
  XCircle, 
  ClipboardList, 
  Clock, 
  CheckCircle2, 
  ArrowUpRight 
} from 'lucide-react';

const API = 'http://localhost:5900/api/requirements';

const STATUS_STYLES: Record<string, string> = {
  pending:     'bg-nb-yellow',
  quoted:      'bg-nb-cyan',
  accepted:    'bg-nb-green',
  in_progress: 'bg-nb-orange',
  delivered:   'bg-nb-green',
  completed:   'bg-nb-green',
  rejected:    'bg-nb-red',
};

const STATUS_LABELS: Record<string, string> = {
  pending:   'Pending',
  quoted:    'Sent',
  accepted:  'Accepted',
  delivered: 'Delivered',
  rejected:  'Rejected',
};

export default function CustomerRequests() {
  const router = useRouter();
  const [requirements, setRequirements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, pending: 0, in_progress: 0, completed: 0, rejected: 0 });
  const [activeTab, setActiveTab] = useState('all');
  
  const [viewingReq, setViewingReq] = useState<any | null>(null);
  const [rejectingId, setRejectingId] = useState<string | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejecting, setRejecting] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchAll = async () => {
    try {
      setLoading(true);
      const headers = getAuthHeader();
      const [reqRes, statsRes] = await Promise.all([
        axios.get(API, { headers }),
        axios.get(`${API}/stats`, { headers }),
      ]);
      if (reqRes.data.success) setRequirements(reqRes.data.requirements);
      if (statsRes.data.success) setStats(statsRes.data.stats);
    } catch (e) {
      console.error(e);
      toast.error("Failed to load customer requirements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAll(); }, []);

  const handleReject = async (id: string) => {
    if (!rejectReason.trim()) { toast.error('Please enter a rejection reason.'); return; }
    setRejecting(true);
    try {
      await axios.patch(`${API}/${id}/status`, { status: 'rejected', rejectReason }, { headers: getAuthHeader() });
      setRejectingId(null);
      setRejectReason('');
      toast.success("Requirement rejected");
      if (viewingReq && viewingReq.id === id) {
          setViewingReq({ ...viewingReq, status: 'rejected' });
      }
      await fetchAll();
    } catch (e) {
      console.error(e);
      toast.error('Failed to reject requirement.');
    } finally {
      setRejecting(false);
    }
  };

  const filtered = activeTab === 'all' ? requirements : requirements.filter(r => r.status === activeTab);

  const statCards = [
    { label: 'Total Received', value: stats.total,      icon: <ClipboardList className="h-8 w-8" />, color: 'bg-nb-cyan' },
    { label: 'In Progress',   value: stats.in_progress, icon: <Send className="h-8 w-8" />,        color: 'bg-nb-yellow' },
    { label: 'Pending Review',value: stats.pending,     icon: <Clock className="h-8 w-8" />,        color: 'bg-nb-orange' },
    { label: 'Completed',     value: stats.completed,   icon: <CheckCircle2 className="h-8 w-8" />, color: 'bg-nb-green' },
    { label: 'Rejected',      value: stats.rejected,    icon: <XCircle className="h-8 w-8" />,      color: 'bg-nb-red text-white' },
  ];

  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-x-hidden">
        
        {/* Header Section */}
        <div className="relative border-4 border-nb-black bg-nb-cyan p-10 shadow-nb-lg">
          <div className="relative z-10 flex flex-col items-start">
            <span className="nb-badge bg-white text-nb-black mb-4">Admin Portal</span>
            <h1 className="text-5xl font-black uppercase font-display tracking-tight text-nb-black">
              Customer <span className="bg-nb-yellow px-2 border-2 border-nb-black shadow-nb-sm ml-2">Requests</span>
            </h1>
            <p className="mt-4 font-bold text-nb-black max-w-xl text-lg border-l-4 border-nb-black pl-4 bg-white/50 py-2">
              Manage and process all customer requirements in real-time.
            </p>
          </div>
        </div>

        {/* Stats Boxes Section */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
          {statCards.map((s) => (
            <div key={s.label} className={`nb-card nb-interactive p-6 flex flex-col justify-between ${s.label === 'Rejected' ? 'text-white bg-nb-red' : 'bg-white'}`}>
              <div className="flex items-start justify-between mb-4">
                <div className={`flex h-16 w-16 items-center justify-center border-4 border-nb-black shadow-nb-sm ${s.color}`}>
                  {s.icon}
                </div>
                <ArrowUpRight className="h-6 w-6" />
              </div>
              <div>
                <p className="font-mono text-xs font-bold uppercase tracking-widest opacity-80">{s.label}</p>
                <h3 className="text-4xl font-black font-display mt-2">{s.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-4">
          {['all', 'pending', 'quoted', 'delivered'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-3 font-bold uppercase text-sm border-2 border-nb-black transition-all nb-interactive shadow-nb-sm ${
                activeTab === tab ? 'bg-nb-black text-white' : 'bg-white text-nb-black hover:bg-nb-bg'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Table Card */}
        <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
          <div className="bg-nb-yellow border-b-4 border-nb-black px-8 py-6 flex items-center justify-between">
            <h3 className="font-black uppercase font-display text-2xl flex items-center gap-3">
              <ClipboardList className="h-8 w-8" /> Requirement Log
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead className="bg-nb-bg border-b-4 border-nb-black">
                <tr>
                  <th className="py-5 pl-8 pr-4 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Req ID</th>
                  <th className="p-5 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Customer</th>
                  <th className="p-5 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Items Summary</th>
                  <th className="p-5 font-mono text-sm font-bold uppercase border-r-2 border-nb-black">Status</th>
                  <th className="py-5 pr-8 pl-4 font-mono text-sm font-bold uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan={5} className="text-center py-20 border-b-2 border-nb-black"><Loader2 className="animate-spin mx-auto text-nb-black h-12 w-12" /></td></tr>
                ) : filtered.length === 0 ? (
                  <tr><td colSpan={5} className="text-center py-20 font-bold uppercase border-b-2 border-nb-black text-gray-500">No requirements discovered.</td></tr>
                ) : filtered.map((req) => (
                  <tr key={req.id} className="hover:bg-nb-bg transition-colors border-b-2 border-nb-black last:border-0">
                    <td className="py-5 pl-8 pr-4 font-bold text-lg border-r-2 border-nb-black whitespace-nowrap">{req.requirementId}</td>
                    <td className="p-5 border-r-2 border-nb-black">
                      <div className="font-bold text-lg">{req.customerName}</div>
                      <div className="font-mono text-xs uppercase bg-nb-black text-white inline-block px-2 py-1 mt-1 border-2 border-nb-black">{req.companyName}</div>
                    </td>
                    <td className="p-5 font-medium border-r-2 border-nb-black max-w-[250px] truncate">{req.itemSummary}</td>
                    <td className="p-5 border-r-2 border-nb-black">
                      <span className={`nb-badge ${STATUS_STYLES[req.status] || 'bg-gray-200'} ${req.status === 'rejected' ? 'text-white' : 'text-nb-black'}`}>
                        {STATUS_LABELS[req.status] ?? req.status}
                      </span>
                    </td>
                    <td className="py-5 pr-8 pl-4 text-right">
                      <div className="flex justify-end gap-3">
                        <button 
                          onClick={() => setViewingReq(req)}
                          className="px-4 py-2 border-2 border-nb-black bg-white text-nb-black font-bold uppercase text-xs shadow-nb-sm nb-interactive flex items-center gap-2"
                        >
                          <FileText className="w-4 h-4" /> View
                        </button>
                        
                        {req.status !== 'rejected' && (
                          <button
                            onClick={() => router.push('/create-quotation?reqId=' + req.id)}
                            disabled={req.status !== 'pending'}
                            className={`px-4 py-2 border-2 border-nb-black font-bold uppercase text-xs flex items-center gap-2 shadow-nb-sm transition-all ${
                              req.status === 'pending' 
                              ? 'bg-nb-green text-nb-black nb-interactive' 
                              : 'bg-gray-200 text-gray-500 cursor-not-allowed translate-y-[2px] shadow-none'
                            }`}
                          >
                            <FilePlus className="h-4 w-4" /> 
                            {req.status === 'pending' ? 'Quote' : 'Quoted'}
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Replacement for View Details */}
        {viewingReq && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
            <div className="bg-white border-4 border-nb-black shadow-nb-xl w-full max-w-3xl max-h-[90vh] flex flex-col">
              
              <div className="bg-nb-yellow border-b-4 border-nb-black p-6 sm:p-8 flex justify-between items-start">
                <div>
                  <h2 className="text-3xl font-black uppercase font-display text-nb-black mb-2">Requirement Details</h2>
                  <span className="nb-badge bg-white text-nb-black text-sm">{viewingReq.requirementId}</span>
                </div>
                <button 
                  onClick={() => setViewingReq(null)} 
                  className="bg-white border-2 border-nb-black p-2 shadow-nb-sm nb-interactive hover:bg-nb-red hover:text-white transition-colors"
                >
                  <XCircle className="w-8 h-8" />
                </button>
              </div>
              
              <div className="p-6 sm:p-8 overflow-y-auto space-y-8 bg-nb-bg">
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                   <div className="nb-card p-5 bg-white">
                      <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-2">Customer</p>
                      <p className="text-2xl font-black uppercase">{viewingReq.customerName}</p>
                      <p className="text-sm font-bold uppercase mt-1 px-2 py-1 bg-nb-black text-white inline-block border-2 border-nb-black">{viewingReq.companyName}</p>
                   </div>
                   <div className="nb-card p-5 bg-white">
                      <p className="font-mono text-xs font-bold uppercase text-gray-500 mb-2">Status</p>
                      <span className={`nb-badge text-sm ${STATUS_STYLES[viewingReq.status]} ${viewingReq.status === 'rejected' ? 'text-white' : 'text-nb-black'}`}>
                        {STATUS_LABELS[viewingReq.status] ?? viewingReq.status.toUpperCase()}
                      </span>
                      <p className="text-sm font-bold mt-4 border-t-2 border-nb-black pt-2">
                        Submitted: {new Date(viewingReq.createdAt).toLocaleDateString()}
                      </p>
                   </div>
                </div>

                <div className="border-4 border-nb-black bg-white overflow-x-auto shadow-nb">
                  <table className="w-full text-left border-collapse min-w-[500px]">
                    <thead className="bg-nb-cyan border-b-4 border-nb-black">
                      <tr>
                        <th className="p-4 font-mono text-sm uppercase font-bold border-r-2 border-nb-black">Item</th>
                        <th className="p-4 font-mono text-sm uppercase font-bold text-center border-r-2 border-nb-black">Qty</th>
                        <th className="p-4 font-mono text-sm uppercase font-bold text-right">Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {viewingReq.items?.map((item: any, i: number) => (
                        <tr key={i} className="border-b-2 border-nb-black last:border-0 hover:bg-nb-bg transition-colors">
                          <td className="p-4 border-r-2 border-nb-black">
                            <p className="text-lg font-bold">{item.itemName}</p>
                            {item.notes && (
                              <p className="text-sm font-medium mt-2 bg-gray-100 p-2 border-l-4 border-nb-black">
                                Note: {item.notes}
                              </p>
                            )}
                          </td>
                          <td className="p-4 text-center border-r-2 border-nb-black">
                            <span className="text-2xl font-black">{item.quantity}</span>
                            <span className="block font-mono text-xs font-bold uppercase mt-1">{item.unit}</span>
                          </td>
                          <td className="p-4 text-right font-bold uppercase text-sm">
                            {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'IMMEDIATE'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {viewingReq.status !== 'rejected' && (
                  <div className="nb-card p-6 bg-nb-red border-4 border-nb-black shadow-nb">
                    <p className="font-black uppercase text-xl text-white flex items-center gap-2 mb-4">
                      <XCircle className="h-6 w-6" /> Reject This Requirement
                    </p>
                    {rejectingId === viewingReq.id ? (
                      <div className="space-y-4">
                        <textarea
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="ENTER REASON FOR REJECTION..."
                          className="w-full min-h-[100px] p-4 border-4 border-nb-black bg-white font-bold text-nb-black uppercase focus:outline-none focus:ring-4 focus:ring-nb-black resize-none"
                        />
                        <div className="flex gap-4 justify-end">
                          <button 
                            onClick={() => { setRejectingId(null); setRejectReason(''); }}
                            className="px-6 py-3 border-4 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive"
                          >
                            Cancel
                          </button>
                          <button
                            disabled={rejecting}
                            onClick={() => handleReject(viewingReq.id)}
                            className="px-6 py-3 border-4 border-nb-black bg-nb-black text-white font-black uppercase shadow-nb-sm nb-interactive disabled:opacity-50 disabled:transform-none disabled:shadow-nb-sm"
                          >
                            {rejecting ? 'REJECTING...' : 'CONFIRM REJECT'}
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button 
                        onClick={() => setRejectingId(viewingReq.id)} 
                        className="w-full px-6 py-4 border-4 border-nb-black bg-white text-nb-black font-black uppercase text-lg shadow-nb-sm nb-interactive hover:bg-gray-100"
                      >
                        Initiate Rejection
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}