"use client";

import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminSidebar } from '@/components/admin/Sidebar';
import { toast } from 'sonner';
import {
  Receipt,
  Search,
  Eye,
  Loader2,
  Printer,
  CheckCircle,
  X,
  FileText,
  AlertCircle,
  RefreshCw,
} from 'lucide-react';

interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface SupplierInvoice {
  _id: string;
  invoiceID: string;
  bill_id: string;
  orderID: string;
  supplierEmail: string;
  purchaseOrderRef: string;
  date: string;
  due_date?: string;
  total: number;
  subtotal?: number;
  tax_amount?: number;
  status: string;
  payment_status: string;
  items: InvoiceItem[];
  notes?: string;
}

export default function SupplierInvoicesAdmin() {
  const [invoices, setInvoices] = useState<SupplierInvoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<SupplierInvoice | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'bank'>('bank');
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string>('');

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();
      const res = await axios.get('http://localhost:5900/api/supplier-invoices', { headers });
      setInvoices(res.data.invoices || []);
    } catch (err) {
      console.error('Error fetching supplier invoices:', err);
      toast.error('Failed to load supplier invoices');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const res = await axios.get('http://localhost:5900/api/bankAccounts/getBankAccounts', { headers: getAuthHeader() });
      const accounts = Array.isArray(res.data) ? res.data : (res.data.bankAccounts || []);
      setBankAccounts(accounts);
      if (accounts.length > 0) setSelectedBankId(accounts[0]._id || accounts[0].id);
    } catch (err) {
      console.error('Error fetching bank accounts:', err);
    }
  };

  useEffect(() => { 
    fetchInvoices(); 
    fetchBankAccounts();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'paid':     return 'bg-nb-green text-black';
      case 'unpaid':   return 'bg-nb-yellow text-black';
      case 'overdue':  return 'bg-nb-red text-white';
      default:         return 'bg-gray-200 text-black';
    }
  };

  const handleAccept = async (id: string) => {
    try {
      setIsProcessing(true);
      const headers = getAuthHeader();
      
      const selectedBank = bankAccounts.find(b => (b._id || b.id) === selectedBankId);
      
      const payload = {
        paymentMethod,
        bankAccountId: paymentMethod === 'bank' ? selectedBankId : null,
        bankAccountName: paymentMethod === 'bank' && selectedBank ? `${selectedBank.bank_name} - ${selectedBank.account_number}` : ''
      };

      await axios.put(`http://localhost:5900/api/supplier-invoices/accept-payment/${id}`, payload, { headers });
      toast.success('Invoice marked as paid — finance records updated');
      fetchInvoices();
      setShowInvoiceModal(false);
    } catch (err) {
      toast.error('Failed to accept invoice');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleReject = async (id: string) => {
    try {
      setIsProcessing(true);
      const headers = getAuthHeader();
      await axios.put(`http://localhost:5900/api/supplier-invoices/reject-payment/${id}`, {}, { headers });
      toast.error('Invoice rejected — supplier notified to review');
      fetchInvoices();
      setShowInvoiceModal(false);
    } catch (err) {
      toast.error('Failed to reject invoice');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredInvoices = invoices.filter(inv =>
    (inv.bill_id || inv.invoiceID || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.purchaseOrderRef || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (inv.supplierEmail || '').toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-x-hidden">
        
        {/* Header - Neo Brutalist style */}
        <div className="relative border-4 border-black bg-blue-400 p-5 md:p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <Receipt className="w-5 h-5 text-black" />
              </div>
              <span className="bg-white border-2 border-black font-mono font-bold text-[10px] uppercase px-2 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">Supplier Billing</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-black uppercase font-display tracking-tight text-black mb-2">
              Supplier Invoices
            </h1>
            <p className="font-bold text-black text-sm max-w-2xl border-l-4 border-black pl-3 bg-white/50 py-1.5 uppercase">
              Review and process supplier bill submissions.
            </p>
          </div>
        </div>

        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-4 border-black bg-white p-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black font-bold" />
            <input
              placeholder="SEARCH BY BILL ID, PO..."
              className="pl-12 w-full border-2 border-black bg-nb-bg h-14 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all uppercase"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="w-full md:w-auto h-14 px-6 border-2 border-black bg-white flex items-center justify-center hover:bg-nb-yellow shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all font-black uppercase tracking-widest"
            onClick={fetchInvoices}
          >
            <RefreshCw className={`w-5 h-5 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        <div className="border-4 border-black bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="bg-black text-white px-6 py-4 border-b-4 border-black flex items-center gap-3">
            <Receipt className="w-6 h-6 text-nb-yellow" />
            <h2 className="text-lg font-black uppercase tracking-widest">
              Supplier Bill Registry ({filteredInvoices.length})
            </h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-nb-bg border-b-4 border-black">
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Bill ID</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">PO Reference</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Supplier Email</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Amount</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Date</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Due Date</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center whitespace-nowrap">Status</th>
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
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="h-40 text-center font-mono font-bold text-gray-500 bg-white p-8 uppercase tracking-widest">
                      No supplier invoices found.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map(inv => (
                    <tr key={inv._id} className="hover:bg-nb-cyan/20 transition-colors border-b-4 border-black last:border-b-0 bg-white">
                      <td className="p-5 font-mono text-sm font-bold border-r-4 border-black">{inv.bill_id || inv.invoiceID}</td>
                      <td className="p-5 border-r-4 border-black font-black uppercase tracking-wide text-sm">{inv.purchaseOrderRef}</td>
                      <td className="p-5 border-r-4 border-black font-black uppercase tracking-wide text-sm">{inv.supplierEmail}</td>
                      <td className="p-5 border-r-4 border-black font-black text-lg">LKR {inv.total.toLocaleString()}</td>
                      <td className="p-5 text-sm font-bold border-r-4 border-black">{new Date(inv.date).toLocaleDateString()}</td>
                      <td className="p-5 text-sm font-bold border-r-4 border-black">
                        {inv.due_date ? new Date(inv.due_date).toLocaleDateString() : '—'}
                      </td>
                      <td className="p-5 text-center border-r-4 border-black">
                        <span className={`inline-flex items-center ${getStatusColor(inv.payment_status)} border-2 border-black font-mono text-[10px] font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                          {inv.payment_status}
                        </span>
                      </td>
                      <td className="p-5 text-right">
                        <div className="flex gap-2 justify-end">
                          <button
                            className="bg-white border-2 border-black h-10 px-3 inline-flex items-center justify-center font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-yellow hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            onClick={() => { setSelectedInvoice(inv); setShowInvoiceModal(true); }}
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            className="bg-black text-white border-2 border-black h-10 px-3 inline-flex items-center justify-center font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                            onClick={() => window.print()}
                          >
                            <Printer className="w-4 h-4" />
                          </button>
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

      {/* Invoice Detail Modal */}
      {showInvoiceModal && selectedInvoice && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto print:bg-white print:p-0">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-5xl my-8 relative flex flex-col max-h-[95vh] print:border-0 print:shadow-none print:my-0 print:max-h-none">
            <div className="bg-nb-cyan border-b-4 border-black p-6 flex flex-col xl:flex-row justify-between items-center sticky top-0 z-20 gap-4 print:hidden">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <FileText className="w-6 h-6 text-black" />
                </div>
                <h2 className="text-xl md:text-2xl font-black uppercase tracking-tight">
                  Supplier Bill <span className="font-mono text-white drop-shadow-[2px_2px_0px_rgba(0,0,0,1)]">#{selectedInvoice.bill_id || selectedInvoice.invoiceID}</span>
                </h2>
              </div>
              <div className="flex items-center gap-4 flex-wrap justify-end">
                {selectedInvoice.payment_status === 'unpaid' && (
                  <div className="flex items-center gap-4 bg-white p-2 border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] mr-2 flex-wrap">
                    <div className="flex flex-col gap-1">
                      <label className="text-[10px] uppercase font-black tracking-widest px-1">Method</label>
                      <select 
                        value={paymentMethod} 
                        onChange={(e: any) => setPaymentMethod(e.target.value)}
                        className="h-10 border-2 border-black font-bold uppercase text-sm bg-nb-bg px-2 focus:outline-none"
                      >
                        <option value="bank">Bank</option>
                        <option value="cash">Cash</option>
                      </select>
                    </div>

                    {paymentMethod === 'bank' && (
                      <div className="flex flex-col gap-1 min-w-[200px] border-l-4 border-black pl-4">
                        <label className="text-[10px] uppercase font-black tracking-widest px-1">Bank Account</label>
                        <select 
                          value={selectedBankId} 
                          onChange={(e) => setSelectedBankId(e.target.value)}
                          className="h-10 border-2 border-black font-bold uppercase text-sm bg-nb-bg px-2 focus:outline-none"
                        >
                          <option value="">Select account</option>
                          {bankAccounts.map(acc => (
                            <option key={acc._id || acc.id} value={acc._id || acc.id}>
                              {acc.bank_name} - {acc.account_number}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="border-l-4 border-black pl-4 flex gap-2">
                      <button
                        className="h-10 px-4 bg-white border-2 border-black text-nb-red font-black uppercase tracking-widest text-xs hover:bg-nb-red hover:text-white transition-colors flex items-center justify-center disabled:opacity-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        onClick={() => handleReject(selectedInvoice._id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <X className="w-4 h-4 mr-2" />} Reject
                      </button>
                      <button
                        className="h-10 px-4 bg-nb-green border-2 border-black text-black font-black uppercase tracking-widest text-xs hover:bg-green-400 transition-colors flex items-center justify-center disabled:opacity-50 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
                        onClick={() => handleAccept(selectedInvoice._id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle className="w-4 h-4 mr-2" />} Pay
                      </button>
                    </div>
                  </div>
                )}
                <div className="flex gap-2">
                  <button 
                    onClick={() => window.print()} 
                    className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-nb-yellow transition-colors nb-interactive shrink-0"
                  >
                    <Printer className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => setShowInvoiceModal(false)}
                    className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-nb-red hover:text-white transition-colors nb-interactive shrink-0"
                  >
                    <X className="w-6 h-6" />
                  </button>
                </div>
              </div>
            </div>

            <div className="p-6 md:p-8 space-y-8 bg-white overflow-y-auto">
              {/* Invoice Body */}
              <div className="bg-white p-8 md:p-12 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
                <div className="flex flex-col md:flex-row justify-between items-start mb-10 gap-8">
                  <div>
                    <h2 className="text-6xl font-black text-black mb-6 tracking-tighter uppercase">Bill</h2>
                    <div className="space-y-2 text-sm text-black">
                      <p><span className="font-black uppercase text-xs tracking-widest border-b-2 border-black">PO Reference:</span> <span className="font-bold">{selectedInvoice.purchaseOrderRef}</span></p>
                      <p><span className="font-black uppercase text-xs tracking-widest border-b-2 border-black">Issue Date:</span> <span className="font-mono font-bold">{new Date(selectedInvoice.date).toLocaleDateString()}</span></p>
                      {selectedInvoice.due_date && (
                        <p><span className="font-black uppercase text-xs tracking-widest border-b-2 border-black">Due Date:</span> <span className="font-mono font-bold text-nb-red">{new Date(selectedInvoice.due_date).toLocaleDateString()}</span></p>
                      )}
                    </div>
                  </div>
                  <div className="text-left md:text-right">
                    <p className="font-black text-black text-2xl uppercase tracking-widest mb-2 border-4 border-black px-4 py-2 bg-nb-yellow inline-block shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">Supplier Portal</p>
                    <div className="text-sm font-bold uppercase tracking-widest mt-4">
                      <p>From: {selectedInvoice.supplierEmail}</p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
                  <div className="p-6 border-4 border-black bg-nb-bg shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="text-xs font-black text-black uppercase tracking-[0.2em] mb-2">Bill From</h4>
                    <p className="font-bold text-black text-lg">{selectedInvoice.supplierEmail}</p>
                  </div>
                  <div className="p-6 border-4 border-black bg-nb-cyan shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <h4 className="text-xs font-black text-black uppercase tracking-[0.2em] mb-2">Payment Status</h4>
                    <span className={`inline-flex items-center ${getStatusColor(selectedInvoice.payment_status)} border-2 border-black font-mono text-sm font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest mt-1`}>
                      {selectedInvoice.payment_status}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] overflow-hidden mb-8 overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="p-4 text-xs font-black uppercase tracking-widest border-r-4 border-black">Item Description</th>
                        <th className="text-center p-4 text-xs font-black uppercase tracking-widest border-r-4 border-black">Qty</th>
                        <th className="text-right p-4 text-xs font-black uppercase tracking-widest border-r-4 border-black">Unit Price</th>
                        <th className="text-right p-4 text-xs font-black uppercase tracking-widest">Total</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white">
                      {selectedInvoice.items && selectedInvoice.items.length > 0 ? (
                        selectedInvoice.items.map((item, idx) => (
                          <tr key={idx} className="border-b-4 border-black last:border-b-0 hover:bg-nb-yellow/20">
                            <td className="p-4 font-bold text-black border-r-4 border-black uppercase text-sm">{item.itemName}</td>
                            <td className="p-4 text-center font-bold border-r-4 border-black">{item.quantity}</td>
                            <td className="p-4 text-right font-bold border-r-4 border-black">LKR {item.unitPrice.toLocaleString()}</td>
                            <td className="p-4 text-right font-black text-lg">LKR {item.totalPrice.toLocaleString()}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan={4} className="p-8 text-center text-black font-bold uppercase tracking-widest">No items listed</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                <div className="flex justify-end mt-8">
                  <div className="w-full md:w-80 space-y-3 bg-nb-bg border-4 border-black p-6 shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                    <div className="flex justify-between text-sm font-bold uppercase">
                      <span>Subtotal</span>
                      <span className="font-mono">LKR {(selectedInvoice.subtotal || selectedInvoice.total).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-sm font-bold uppercase">
                      <span>Tax (10%)</span>
                      <span className="font-mono">LKR {(selectedInvoice.tax_amount || 0).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-end pt-4 mt-2 border-t-4 border-black">
                      <span className="font-black uppercase text-sm tracking-widest">Total Amount</span>
                      <span className="text-3xl font-black text-black leading-none bg-nb-yellow px-2 border-2 border-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                        LKR {selectedInvoice.total.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedInvoice.notes && (
                <div className="p-6 bg-nb-yellow border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-start gap-4">
                  <AlertCircle className="w-8 h-8 shrink-0 text-black mt-1" />
                  <div>
                    <p className="font-black text-sm uppercase tracking-widest mb-2 border-b-2 border-black inline-block">Notes</p>
                    <p className="font-bold whitespace-pre-wrap">{selectedInvoice.notes}</p>
                  </div>
                </div>
              )}
            </div>

            <div className="p-6 md:p-8 border-t-4 border-black bg-white flex justify-end sticky bottom-0 z-20 print:hidden">
              <button 
                className="bg-white border-4 border-black h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-bg transition-colors nb-interactive" 
                onClick={() => setShowInvoiceModal(false)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}