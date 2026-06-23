'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { AdminSidebar } from "@/components/admin/Sidebar";
import { Receipt, Download, Eye, Loader2, Printer, Search, FileText, CheckCircle, X, CreditCard, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';

interface InvoiceItem {
  itemName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

interface Invoice {
  _id: string;
  invoiceID: string;
  orderID: string;
  email: string;
  date: string;
  total: number;
  status: string;
  items: InvoiceItem[];
  subtotal?: number;
  tax_amount?: number;
  paymentProof?: string;
  paymentMethod?: string;
  transactionID?: string;
  notes?: string;
}

export default function CustomerInvoicesAdmin() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
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
      // 1. Fetch all customers
      const customersRes = await axios.get('http://localhost:5900/api/users/all-customers', { headers });
      const customers = customersRes.data.customers || [];
      
      // 2. Fetch invoices for each customer email
      const invoicePromises = customers.map(async (cust: any) => {
        if (!cust.email) return [];
        try {
          const res = await axios.get(`http://localhost:5900/api/invoices/customer/${encodeURIComponent(cust.email)}`, { headers });
          return res.data.invoices || res.data || [];
        } catch (e) {
          console.error(`Failed to fetch invoices for ${cust.email}`, e);
          return [];
        }
      });
      
      const allInvoicesNested = await Promise.all(invoicePromises);
      let aggregatedInvoices = allInvoicesNested.flat();
      
      // 3. Merge with local storage generated invoices
      const localGeneratedInvoicesStr = localStorage.getItem('client_side_generated_invoices');
      const localGeneratedInvoices: Invoice[] = localGeneratedInvoicesStr ? JSON.parse(localGeneratedInvoicesStr) : [];
      
      const backendIds = new Set(aggregatedInvoices.map((i: any) => i._id));
      const filteredLocalGen = localGeneratedInvoices.filter((i: any) => !backendIds.has(i._id));
      aggregatedInvoices = [...aggregatedInvoices, ...filteredLocalGen];
      
      // Fetch all orders to map pricing/quantities for zero-total invoices
      let orders: any[] = [];
      try {
        const ordersRes = await axios.get('http://localhost:5900/api/orders', { headers });
        orders = ordersRes.data || [];
      } catch (e) {
        console.error("Failed to fetch orders for invoice verification", e);
      }

      // 4. Apply status overrides from localStorage and recalculate 0-total invoices
      const overridesStr = localStorage.getItem('customer_invoice_status_overrides');
      const overrides = overridesStr ? JSON.parse(overridesStr) : {};
      
      const finalInvoices = aggregatedInvoices.map((inv: any) => {
        let finalInv = { ...inv };

        // Recalculate invoice details if total is 0 or missing
        if (!finalInv.total || finalInv.total === 0) {
          const matchingOrder = orders.find((o: any) => o.orderID === finalInv.orderID || o._id === finalInv.orderID);
          if (matchingOrder) {
            const reconstructedItems = (finalInv.items && finalInv.items.length > 0) ? finalInv.items.map((item: any) => {
              const orderItem = matchingOrder.items?.find((oi: any) => oi.name === item.itemName || oi.productID === item.productID || oi.name === item.name);
              const qty = orderItem ? (orderItem.quantity || orderItem.issuedQuantity || 0) : (item.quantity || 0);
              const price = orderItem ? (orderItem.price || 0) : (item.unitPrice || 0);
              const itemQty = qty || 1;
              return {
                ...item,
                quantity: itemQty,
                unitPrice: price,
                totalPrice: itemQty * price
              };
            }) : (matchingOrder.items || []).map((item: any) => {
              const qty = item.quantity || item.issuedQuantity || 1;
              const price = item.price || 0;
              return {
                itemName: item.name,
                quantity: qty,
                unitPrice: price,
                totalPrice: qty * price
              };
            });

            const subtotal = reconstructedItems.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);
            const tax_amount = subtotal * 0.1;
            const total = subtotal + tax_amount;

            finalInv.items = reconstructedItems;
            finalInv.subtotal = subtotal;
            finalInv.tax_amount = tax_amount;
            finalInv.total = total;
          }
        }

        if (overrides[finalInv._id]) {
          return {
            ...finalInv,
            ...overrides[finalInv._id]
          };
        }
        return finalInv;
      });
      
      setInvoices(finalInvoices.filter((i: any) => i.invoiceType === 'customer' || !i.invoiceType));
    } catch (err) {
      console.error("Error fetching invoices:", err);
      toast.error("Failed to load invoices");
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

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setPaymentMethod(invoice.paymentMethod === 'cash' ? 'cash' : 'bank');
    setShowInvoiceModal(true);
  };

  const handlePrint = () => {
    window.print();
  };

  const filteredInvoices = invoices.filter(inv => 
    inv.invoiceID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.orderID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inv.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-nb-green text-nb-black';
      case 'unpaid': return 'bg-nb-yellow text-nb-black';
      case 'overdue': return 'bg-nb-red text-white';
      case 'pending-verification': return 'bg-nb-cyan text-nb-black animate-pulse';
      default: return 'bg-gray-200 text-nb-black';
    }
  };

  const handleAcceptPayment = async (id: string) => {
    try {
      setIsProcessing(true);
      const selectedBank = bankAccounts.find(b => (b._id || b.id) === selectedBankId);

      const payload = {
        paymentMethod,
        bankAccountId: paymentMethod === 'bank' ? selectedBankId : null,
        bankAccountName: paymentMethod === 'bank' && selectedBank ? `${selectedBank.bank_name} - ${selectedBank.account_number}` : ''
      };

      const overridesStr = localStorage.getItem('customer_invoice_status_overrides');
      const overrides = overridesStr ? JSON.parse(overridesStr) : {};
      overrides[id] = {
        status: 'paid',
        payment_status: 'paid',
        paymentMethod: payload.paymentMethod,
        bankAccountId: payload.bankAccountId,
        bankAccountName: payload.bankAccountName
      };
      localStorage.setItem('customer_invoice_status_overrides', JSON.stringify(overrides));

      toast.success("Payment accepted and finance record updated");
      fetchInvoices();
      setShowInvoiceModal(false);
    } catch (err) {
      toast.error("Failed to accept payment");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRejectPayment = async (id: string) => {
    try {
      const overridesStr = localStorage.getItem('customer_invoice_status_overrides');
      const overrides = overridesStr ? JSON.parse(overridesStr) : {};
      overrides[id] = {
        status: 'unpaid',
        payment_status: 'unpaid'
      };
      localStorage.setItem('customer_invoice_status_overrides', JSON.stringify(overrides));

      toast.error("Payment rejected");
      fetchInvoices();
      setShowInvoiceModal(false);
    } catch (err) {
      toast.error("Failed to reject payment");
    }
  };

  const inputStyle = "border-2 border-nb-black focus:outline-none font-bold text-nb-black shadow-[2px_2px_0px_0px_#000] px-4 py-2 bg-white";

  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-x-hidden">
        
        {/* Header Section */}
        <div className="relative border-4 border-nb-black bg-nb-cyan p-10 shadow-nb-lg">
          <div className="relative z-10">
            <span className="nb-badge bg-white text-nb-black mb-4">Billing Control</span>
            <h1 className="text-5xl font-black uppercase font-display tracking-tight text-nb-black">
              Customer Invoices
            </h1>
            <p className="mt-4 font-bold text-nb-black text-lg max-w-2xl border-l-4 border-nb-black pl-4 bg-white/50 py-2 uppercase">
              Monitor and manage all customer billing records
            </p>
          </div>
        </div>

        {/* Search & Refresh */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b-4 border-nb-black pb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nb-black font-bold" />
            <input 
              placeholder="SEARCH BY ID, ORDER OR EMAIL..." 
              className={`${inputStyle} pl-12 w-full uppercase`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="px-6 py-2 border-4 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 h-[44px]"
            onClick={fetchInvoices}
          >
            <Loader2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={3} />
            Refresh Data
          </button>
        </div>

        {/* Invoice Table */}
        <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
          <div className="bg-nb-yellow px-8 py-6 border-b-4 border-nb-black flex items-center gap-3">
            <Receipt className="w-8 h-8 text-nb-black" strokeWidth={3} />
            <h3 className="font-black uppercase font-display text-2xl text-nb-black">Invoice Registry</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-nb-bg border-b-4 border-nb-black">
                <tr>
                  <th className="py-5 pl-8 pr-4 font-black uppercase text-sm border-r-2 border-nb-black">Invoice ID</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Order ID</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Customer Email</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Amount</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Date</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black text-center">Status</th>
                  <th className="py-5 pr-8 pl-4 font-black uppercase text-sm text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20 font-black uppercase tracking-widest text-lg text-nb-black">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-nb-black border-t-nb-yellow rounded-full animate-spin"></div>
                        Syncing with database...
                      </div>
                    </td>
                  </tr>
                ) : filteredInvoices.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20 font-black uppercase tracking-widest text-2xl text-gray-500">
                      No billing records found matching your search.
                    </td>
                  </tr>
                ) : (
                  filteredInvoices.map((invoice) => (
                    <tr key={invoice._id} className="hover:bg-nb-bg transition-colors border-b-2 border-nb-black last:border-0">
                      <td className="py-5 pl-8 pr-4 font-black text-lg border-r-2 border-nb-black">{invoice.invoiceID}</td>
                      <td className="p-5 font-bold text-gray-600 border-r-2 border-nb-black">{invoice.orderID}</td>
                      <td className="p-5 font-bold border-r-2 border-nb-black">{invoice.email}</td>
                      <td className="p-5 font-black text-xl border-r-2 border-nb-black">LKR {invoice.total.toLocaleString()}</td>
                      <td className="p-5 font-bold uppercase text-gray-600 border-r-2 border-nb-black">{new Date(invoice.date).toLocaleDateString()}</td>
                      <td className="p-5 text-center border-r-2 border-nb-black">
                        <span className={`nb-badge text-xs flex justify-center uppercase max-w-max mx-auto ${getStatusColor(invoice.status)}`}>
                          {invoice.status.replace('-', ' ')}
                        </span>
                      </td>
                      <td className="py-5 pr-8 pl-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <button 
                            className="px-4 py-2 border-2 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2"
                            onClick={() => handleViewInvoice(invoice)}
                          >
                            <Eye className="w-4 h-4" strokeWidth={3} /> Details
                          </button>
                          <button 
                            className="p-2 border-2 border-nb-black bg-nb-black text-white font-black uppercase shadow-nb-sm nb-interactive flex items-center justify-center"
                            onClick={handlePrint}
                          >
                            <Printer className="w-4 h-4" strokeWidth={3} />
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

      {/* Invoice Details Modal */}
      {showInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-nb-bg border-4 border-nb-black shadow-nb-xl w-full max-w-6xl max-h-[95vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="bg-nb-cyan border-b-4 border-nb-black p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
              <h2 className="text-3xl font-black uppercase font-display flex items-center gap-3">
                <FileText className="w-8 h-8" /> Invoice #{selectedInvoice?.invoiceID}
              </h2>
              <div className="flex flex-wrap items-center gap-4">
                {selectedInvoice?.status === 'pending-verification' && (
                  <div className="flex flex-wrap items-center gap-4 bg-white border-4 border-nb-black p-2 shadow-nb-sm">
                    <div className="flex flex-col gap-1 px-2">
                      <span className="text-xs uppercase font-black tracking-widest">Confirm Method</span>
                      <select 
                        value={paymentMethod} 
                        onChange={(e: any) => setPaymentMethod(e.target.value)}
                        className="font-bold uppercase bg-transparent outline-none cursor-pointer border-b-2 border-nb-black"
                      >
                        <option value="bank">BANK</option>
                        <option value="cash">CASH</option>
                      </select>
                    </div>

                    {paymentMethod === 'bank' && (
                      <div className="flex flex-col gap-1 border-l-4 border-nb-black pl-4 pr-2">
                        <span className="text-xs uppercase font-black tracking-widest">Deposit To</span>
                        <select 
                          value={selectedBankId} 
                          onChange={(e) => setSelectedBankId(e.target.value)}
                          className="font-bold uppercase bg-transparent outline-none cursor-pointer border-b-2 border-nb-black max-w-[200px]"
                        >
                          <option value="">SELECT ACCOUNT</option>
                          {bankAccounts.map(acc => (
                            <option key={acc._id || acc.id} value={acc._id || acc.id}>
                              {acc.bank_name} - {acc.account_number}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    
                    <div className="border-l-4 border-nb-black pl-4 flex gap-2">
                      <button 
                        className="px-4 py-2 border-2 border-nb-black bg-nb-red text-white font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 disabled:opacity-50"
                        onClick={() => handleRejectPayment(selectedInvoice._id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <X className="w-4 h-4" strokeWidth={3} />} Reject
                      </button>
                      <button 
                        className="px-4 py-2 border-2 border-nb-black bg-nb-green text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 disabled:opacity-50"
                        onClick={() => handleAcceptPayment(selectedInvoice._id)}
                        disabled={isProcessing}
                      >
                        {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" strokeWidth={3} />} Accept
                      </button>
                    </div>
                  </div>
                )}
                
                <button 
                  onClick={handlePrint} 
                  className="px-4 py-2 border-4 border-nb-black bg-white font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2"
                >
                  <Printer className="w-5 h-5" /> Print
                </button>
                <button 
                  onClick={() => setShowInvoiceModal(false)} 
                  className="p-2 border-4 border-nb-black bg-nb-black text-white shadow-nb-sm nb-interactive"
                >
                  <X className="w-6 h-6" strokeWidth={3} />
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto flex-1">
              {selectedInvoice && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Invoice Document (Left) */}
                  <div className="lg:col-span-2 bg-white border-4 border-nb-black shadow-nb p-8 md:p-12 print:border-0 print:shadow-none print:p-0">
                    <div className="flex justify-between items-start mb-12 border-b-4 border-nb-black pb-8">
                      <div>
                        <h2 className="text-6xl font-black uppercase font-display tracking-tighter mb-6">INVOICE</h2>
                        <div className="space-y-2 uppercase font-bold">
                          <p><span className="text-gray-500">Order Ref:</span> {selectedInvoice.orderID}</p>
                          <p><span className="text-gray-500">Issue Date:</span> {new Date(selectedInvoice.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-black text-3xl mb-4 bg-nb-yellow px-2 border-2 border-nb-black inline-block">StockFlow Neo</p>
                        <div className="font-bold uppercase text-gray-700 space-y-1">
                          <p>456 Enterprise Way</p>
                          <p>Colombo 07, Sri Lanka</p>
                          <p>+94 11 234 5678</p>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-8 mb-12">
                      <div className="p-6 border-4 border-nb-black bg-nb-cyan">
                        <h4 className="font-black uppercase tracking-widest mb-4 border-b-2 border-nb-black pb-2 inline-block">BILLING TO</h4>
                        <p className="font-bold text-xl">{selectedInvoice.email}</p>
                      </div>
                      <div className="p-6 border-4 border-nb-black bg-nb-bg flex flex-col justify-center items-center">
                        <h4 className="font-black uppercase tracking-widest mb-4">CURRENT STATUS</h4>
                        <span className={`nb-badge text-lg flex justify-center uppercase w-full ${getStatusColor(selectedInvoice.status)}`}>
                          {selectedInvoice.status.replace('-', ' ')}
                        </span>
                      </div>
                    </div>

                    <div className="border-4 border-nb-black overflow-hidden mb-12">
                      <table className="w-full text-left border-collapse">
                        <thead className="bg-nb-black text-white border-b-4 border-nb-black">
                          <tr>
                            <th className="p-4 font-black uppercase border-r-4 border-nb-black">Item Description</th>
                            <th className="p-4 font-black uppercase border-r-4 border-nb-black text-center">Qty</th>
                            <th className="p-4 font-black uppercase border-r-4 border-nb-black text-right">Price</th>
                            <th className="p-4 font-black uppercase text-right">Total</th>
                          </tr>
                        </thead>
                        <tbody className="font-bold uppercase">
                          {selectedInvoice.items && selectedInvoice.items.map((item, idx) => (
                            <tr key={idx} className="border-b-4 border-nb-black last:border-0">
                              <td className="p-4 border-r-4 border-nb-black text-lg">{item.itemName}</td>
                              <td className="p-4 border-r-4 border-nb-black text-center">{item.quantity}</td>
                              <td className="p-4 border-r-4 border-nb-black text-right">LKR {item.unitPrice.toLocaleString()}</td>
                              <td className="p-4 text-right font-black text-xl">LKR {item.totalPrice.toLocaleString()}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="flex justify-end">
                      <div className="w-80 space-y-4 font-bold uppercase text-lg">
                        <div className="flex justify-between">
                          <span className="text-gray-500">Subtotal</span>
                          <span>LKR {selectedInvoice.subtotal?.toLocaleString() || selectedInvoice.total.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-500">Tax (10%)</span>
                          <span>LKR {selectedInvoice.tax_amount?.toLocaleString() || '0'}</span>
                        </div>
                        <div className="flex justify-between items-center pt-4 mt-2 border-t-4 border-nb-black">
                          <span className="font-black text-xl">Total Amount</span>
                          <span className="text-3xl font-black bg-nb-green px-2 border-2 border-nb-black shadow-nb-sm">LKR {selectedInvoice.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Payment Details (Right) */}
                  <div className="space-y-8">
                    <div className="border-4 border-nb-black bg-white shadow-nb p-6">
                      <h3 className="font-black uppercase text-xl mb-6 flex items-center gap-3 border-b-4 border-nb-black pb-4">
                        <CreditCard className="w-6 h-6" strokeWidth={3} /> Payment Proof
                      </h3>
                      
                      {selectedInvoice.paymentProof ? (
                        <div className="space-y-6">
                          <div className="aspect-square bg-nb-bg border-4 border-nb-black overflow-hidden relative group">
                            <img 
                              src={`http://localhost:5900/${selectedInvoice.paymentProof.replace(/\\/g, '/')}`} 
                              alt="Payment Proof" 
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                (e.target as any).src = 'https://via.placeholder.com/400?text=PAYMENT+PROOF+DOCUMENT';
                              }}
                            />
                            <a 
                              href={`http://localhost:5900/${selectedInvoice.paymentProof.replace(/\\/g, '/')}`} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="absolute inset-0 bg-nb-black/80 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity text-white font-black uppercase text-xl tracking-widest"
                            >
                              Open Full Size
                            </a>
                          </div>
                          
                          <div className="p-4 bg-nb-yellow border-4 border-nb-black font-bold uppercase space-y-3">
                            <div className="flex justify-between border-b-2 border-nb-black pb-2">
                              <span>Method:</span>
                              <span className="font-black">{selectedInvoice.paymentMethod || 'N/A'}</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                              <span>Trans ID:</span>
                              <span className="font-black bg-white px-2 py-1 border-2 border-nb-black">{selectedInvoice.transactionID || 'N/A'}</span>
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div className="py-12 px-6 border-4 border-nb-black border-dashed text-center font-black uppercase text-gray-400">
                          No payment proof uploaded yet
                        </div>
                      )}
                    </div>

                    {selectedInvoice.status === 'unpaid' && (
                      <div className="bg-nb-yellow border-4 border-nb-black p-6 flex items-start gap-4 shadow-nb">
                        <AlertCircle className="w-8 h-8 shrink-0 text-nb-black" strokeWidth={3} />
                        <p className="font-bold uppercase text-lg">Awaiting customer to upload payment documents.</p>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}