'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { CreditCard, Loader2, Calendar, Banknote, Search, Eye, CheckCircle, X, FileText, AlertCircle } from 'lucide-react';
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
  total: number;
  date: string;
  status: string;
  items: InvoiceItem[];
  subtotal?: number;
  tax_amount?: number;
  paymentMethod?: string;
  transactionID?: string;
  paymentProof?: string;
  notes?: string;
  updatedAt?: string;
}

export default function CustomerPaymentsAdmin() {
  const [payments, setPayments] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [bankAccounts, setBankAccounts] = useState<any[]>([]);
  const [selectedBankAccountId, setSelectedBankAccountId] = useState<string>('');

  const fetchPayments = async () => {
    try {
      setIsLoading(true);
      const token = typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user') || '{}')?.token || localStorage.getItem('token') || '') : '';
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      // 1. Fetch all customers
      const customersRes = await axios.get('http://localhost:5900/api/users/all-customers', config);
      const customers = customersRes.data.customers || [];
      
      // 2. Fetch invoices for each customer email
      const invoicePromises = customers.map(async (cust: any) => {
        if (!cust.email) return [];
        try {
          const res = await axios.get(`http://localhost:5900/api/invoices/customer/${encodeURIComponent(cust.email)}`, config);
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
        const ordersRes = await axios.get('http://localhost:5900/api/orders', config);
        orders = ordersRes.data || [];
      } catch (e) {
        console.error("Failed to fetch orders for invoice verification", e);
      }

      // 4. Apply status overrides from localStorage and recalculate 0-total invoices
      const overridesStr = localStorage.getItem('customer_invoice_status_overrides');
      const overrides = overridesStr ? JSON.parse(overridesStr) : {};
      
      const finalInvoices = aggregatedInvoices.map((inv: any) => {
        let finalInv = { ...inv };

        // Always recalculate invoice details to apply pre-tax logic
        let reconstructedItems = finalInv.items && finalInv.items.length > 0 ? finalInv.items : [];
        const matchingOrder = orders.find((o: any) => o.orderID === finalInv.orderID || o._id === finalInv.orderID);
        
        if (reconstructedItems.length === 0) {
          if (matchingOrder) {
            reconstructedItems = (matchingOrder.items || []).map((item: any) => {
              const qty = item.quantity || item.issuedQuantity || 1;
              const price = Math.round((item.price || 0) / 1.1);
              return {
                itemName: item.name,
                quantity: qty,
                unitPrice: price,
                totalPrice: qty * price
              };
            });
          }
        } else {
          reconstructedItems = reconstructedItems.map((item: any) => {
            const orderItem = matchingOrder?.items?.find((oi: any) => oi.name === item.itemName || oi.productID === item.productID || oi.name === item.name);
            const qty = item.quantity || 0;
            const price = orderItem && orderItem.price ? Math.round(orderItem.price / 1.1) : (item.unitPrice || 0);
            return {
              ...item,
              quantity: qty,
              unitPrice: price,
              totalPrice: qty * price
            };
          });
        }

        const subtotal = reconstructedItems.reduce((sum: number, item: any) => sum + (item.totalPrice || 0), 0);
        const tax_amount = subtotal * 0.1;
        const total = subtotal + tax_amount;

        finalInv.items = reconstructedItems;
        finalInv.subtotal = subtotal;
        finalInv.tax_amount = tax_amount;
        finalInv.total = total;

        if (overrides[finalInv._id]) {
          return {
            ...finalInv,
            ...overrides[finalInv._id]
          };
        }
        return finalInv;
      });

      const paymentRecords = finalInvoices.filter((i: any) => 
        (i.invoiceType === 'customer' || !i.invoiceType) && (i.status === 'paid' || i.status === 'pending-verification' || i.transactionID)
      );
      setPayments(paymentRecords);
    } catch (err) {
      console.error("Error fetching payments:", err);
      toast.error("Failed to load payment transactions");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchBankAccounts = async () => {
    try {
      const token = typeof window !== 'undefined' ? (JSON.parse(localStorage.getItem('user') || '{}')?.token || localStorage.getItem('token') || '') : '';
      const response = await axios.get('http://localhost:5900/api/bankAccounts/getBankAccounts', { headers: { Authorization: `Bearer ${token}` } });
      const accounts = response.data.bankAccounts || [];
      setBankAccounts(accounts);
      if (accounts.length > 0) {
        setSelectedBankAccountId(accounts[0]._id);
      }
    } catch (err) {
      console.error("Error fetching bank accounts:", err);
    }
  };

  useEffect(() => {
    fetchPayments();
    fetchBankAccounts();
  }, []);

  const handleAcceptPayment = async (id: string) => {
    const isCash = selectedInvoice?.paymentMethod?.toLowerCase() === 'cash';
    if (!isCash && !selectedBankAccountId) {
      toast.error("Please select a bank account for this deposit");
      return;
    }

    try {
      const selectedBank = bankAccounts.find(b => b._id === selectedBankAccountId);
      
      const overridesStr = localStorage.getItem('customer_invoice_status_overrides');
      const overrides = overridesStr ? JSON.parse(overridesStr) : {};
      overrides[id] = {
        status: 'paid',
        payment_status: 'paid',
        paymentMethod: selectedInvoice?.paymentMethod,
        bankAccountId: isCash ? null : selectedBankAccountId,
        bankAccountName: isCash ? '' : `${selectedBank?.bank_name} - ${selectedBank?.account_number}`
      };
      localStorage.setItem('customer_invoice_status_overrides', JSON.stringify(overrides));

      toast.success("Payment accepted successfully");
      fetchPayments();
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to accept payment");
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
      fetchPayments();
      setShowModal(false);
    } catch (err) {
      toast.error("Failed to reject payment");
    }
  };

  const filteredPayments = payments.filter(p => 
    p.invoiceID.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.transactionID && p.transactionID.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid':
        return <span className="nb-badge bg-nb-green text-nb-black uppercase text-xs w-full text-center">Completed</span>;
      case 'pending-verification':
        return <span className="nb-badge bg-nb-yellow text-nb-black uppercase text-xs w-full text-center animate-pulse">Pending Review</span>;
      default:
        return <span className="nb-badge bg-gray-200 text-nb-black uppercase text-xs w-full text-center">Awaiting Proof</span>;
    }
  };

  const inputStyle = "border-2 border-nb-black focus:outline-none font-bold text-nb-black shadow-[2px_2px_0px_0px_#000] px-4 py-2 bg-white";

  return (
    <>
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
        
        {/* Header */}
        <div className="relative border-4 border-nb-black bg-nb-cyan p-10 shadow-nb-lg">
          <div className="relative z-10">
            <span className="nb-badge bg-white text-nb-black mb-4">Financial Records</span>
            <h1 className="text-5xl font-black uppercase font-display tracking-tight text-nb-black">
              Payment Transactions
            </h1>
            <p className="mt-4 font-bold text-nb-black text-lg max-w-2xl border-l-4 border-nb-black pl-4 bg-white/50 py-2 uppercase">
              Review and audit all customer payment history
            </p>
          </div>
        </div>

        {/* Search & Refresh */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between border-b-4 border-nb-black pb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-nb-black font-bold" />
            <input 
              placeholder="SEARCH BY INVOICE, EMAIL OR TXN ID..." 
              className={`${inputStyle} pl-12 w-full uppercase h-[44px]`}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button 
            className="px-6 py-2 border-4 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 h-[44px]"
            onClick={fetchPayments}
          >
            <Loader2 className={`w-5 h-5 ${isLoading ? 'animate-spin' : ''}`} strokeWidth={3} />
            Refresh Log
          </button>
        </div>

        {/* Table */}
        <div className="border-4 border-nb-black bg-white shadow-nb-xl overflow-hidden">
          <div className="bg-nb-cyan px-8 py-6 border-b-4 border-nb-black flex items-center gap-3">
            <Banknote className="w-8 h-8 text-nb-black" strokeWidth={3} />
            <h3 className="font-black uppercase font-display text-2xl text-nb-black">Transaction Log</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead className="bg-nb-bg border-b-4 border-nb-black">
                <tr>
                  <th className="py-5 pl-8 pr-4 font-black uppercase text-sm border-r-2 border-nb-black">Transaction Date</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Invoice ID</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Customer Email</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">Amount</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black">TXN Ref</th>
                  <th className="p-5 font-black uppercase text-sm border-r-2 border-nb-black text-center">Status</th>
                  <th className="py-5 pr-8 pl-4 font-black uppercase text-sm text-right">Action</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20 font-black uppercase tracking-widest text-lg text-nb-black">
                      <div className="flex flex-col items-center gap-4">
                        <div className="w-12 h-12 border-4 border-nb-black border-t-nb-yellow rounded-full animate-spin"></div>
                        Syncing transactions...
                      </div>
                    </td>
                  </tr>
                ) : filteredPayments.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-20 font-black uppercase tracking-widest text-2xl text-gray-500">
                      No transaction records found.
                    </td>
                  </tr>
                ) : (
                  filteredPayments.map((payment) => (
                    <tr key={payment._id} className="hover:bg-nb-bg transition-colors border-b-2 border-nb-black last:border-0">
                      <td className="py-5 pl-8 pr-4 font-bold text-gray-600 border-r-2 border-nb-black uppercase">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-nb-black" />
                          {new Date(payment.updatedAt || payment.date).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="p-5 font-black text-lg border-r-2 border-nb-black">{payment.invoiceID}</td>
                      <td className="p-5 font-bold border-r-2 border-nb-black">{payment.email}</td>
                      <td className="p-5 font-black text-xl border-r-2 border-nb-black">LKR {payment.total.toLocaleString()}</td>
                      <td className="p-5 font-bold text-gray-600 uppercase border-r-2 border-nb-black">{payment.transactionID || 'N/A'}</td>
                      <td className="p-5 border-r-2 border-nb-black">
                        <div className="flex justify-center">{getStatusBadge(payment.status)}</div>
                      </td>
                      <td className="py-5 pr-8 pl-4 text-right">
                        <button 
                          className="px-4 py-2 border-2 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 ml-auto"
                          onClick={() => {
                            setSelectedInvoice(payment);
                            setShowModal(true);
                          }}
                        >
                          <Eye className="w-4 h-4" strokeWidth={3} /> Verify
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

      {/* Verification Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-nb-bg border-4 border-nb-black shadow-nb-xl w-full max-w-6xl max-h-[95vh] flex flex-col">
            
            <div className="bg-nb-yellow border-b-4 border-nb-black p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 shrink-0">
              <h2 className="text-3xl font-black uppercase font-display flex items-center gap-3">
                <FileText className="w-8 h-8" /> Payment Verification
              </h2>
              
              <div className="flex gap-4 items-end flex-wrap">
                {selectedInvoice?.status === 'pending-verification' && (
                  <>
                    {selectedInvoice?.paymentMethod?.toLowerCase() !== 'cash' && (
                      <div className="flex flex-col gap-1 px-4 border-l-4 border-nb-black bg-white py-1">
                        <span className="text-xs uppercase font-black tracking-widest">Deposit to Bank Account</span>
                        <select 
                          className="font-bold uppercase bg-transparent outline-none cursor-pointer border-b-2 border-nb-black"
                          value={selectedBankAccountId}
                          onChange={(e) => setSelectedBankAccountId(e.target.value)}
                        >
                          <option value="">SELECT ACCOUNT...</option>
                          {bankAccounts.map(bank => (
                            <option key={bank._id} value={bank._id}>
                              {bank.bank_name} - {bank.account_number}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}
                    <div className="flex gap-2">
                      <button 
                        className="px-4 py-2 border-4 border-nb-black bg-nb-red text-white font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 h-full"
                        onClick={() => handleRejectPayment(selectedInvoice._id)}
                      >
                        <X className="w-5 h-5" strokeWidth={3} /> Reject
                      </button>
                      <button 
                        className="px-4 py-2 border-4 border-nb-black bg-nb-green text-nb-black font-black uppercase shadow-nb-sm nb-interactive flex items-center gap-2 h-full"
                        onClick={() => handleAcceptPayment(selectedInvoice._id)}
                      >
                        <CheckCircle className="w-5 h-5" strokeWidth={3} /> Accept
                      </button>
                    </div>
                  </>
                )}
                <button 
                  onClick={() => setShowModal(false)} 
                  className="p-2 border-4 border-nb-black bg-nb-black text-white shadow-nb-sm nb-interactive h-full ml-auto"
                >
                  <X className="w-6 h-6" strokeWidth={3} />
                </button>
              </div>
            </div>

            <div className="p-8 overflow-y-auto flex-1">
              {selectedInvoice && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Left Column - Details */}
                  <div className="space-y-8">
                    <div className="border-4 border-nb-black bg-white shadow-nb p-8">
                      <h3 className="font-black uppercase tracking-widest text-xl mb-6 border-b-4 border-nb-black pb-2">Payment Details</h3>
                      <div className="grid grid-cols-2 gap-6 uppercase font-bold text-lg">
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Method</p>
                          <p className="font-black bg-nb-bg px-2 border-2 border-nb-black inline-block">{selectedInvoice.paymentMethod || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Reference ID</p>
                          <p className="font-black">{selectedInvoice.transactionID || 'N/A'}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Amount</p>
                          <p className="font-black text-2xl text-nb-green">LKR {selectedInvoice.total.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-gray-500 text-sm mb-1">Customer</p>
                          <p className="truncate" title={selectedInvoice.email}>{selectedInvoice.email}</p>
                        </div>
                      </div>
                      {selectedInvoice.notes && (
                        <div className="pt-6 mt-6 border-t-4 border-nb-black">
                          <p className="text-gray-500 text-sm font-bold uppercase mb-2">Customer Notes</p>
                          <p className="font-bold uppercase bg-nb-bg p-4 border-2 border-nb-black">{selectedInvoice.notes}</p>
                        </div>
                      )}
                    </div>

                    <div className="border-4 border-nb-black overflow-hidden bg-white shadow-nb">
                       <table className="w-full text-left border-collapse">
                          <thead className="bg-nb-black text-white border-b-4 border-nb-black">
                            <tr>
                              <th className="p-4 font-black uppercase border-r-4 border-nb-black">Item</th>
                              <th className="p-4 font-black uppercase border-r-4 border-nb-black text-center">Qty</th>
                              <th className="p-4 font-black uppercase text-right">Total</th>
                            </tr>
                          </thead>
                          <tbody className="font-bold uppercase">
                            {selectedInvoice.items.map((item, idx) => (
                              <tr key={idx} className="border-b-4 border-nb-black last:border-0 hover:bg-nb-bg">
                                <td className="p-4 border-r-4 border-nb-black">{item.itemName}</td>
                                <td className="p-4 border-r-4 border-nb-black text-center">{item.quantity}</td>
                                <td className="p-4 text-right">LKR {item.totalPrice.toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                       </table>
                    </div>
                  </div>

                  {/* Right Column - Proof */}
                  <div className="space-y-4">
                    <h3 className="font-black uppercase tracking-widest text-xl bg-nb-cyan border-4 border-nb-black p-4 inline-block shadow-nb mb-2">Submitted Proof</h3>
                    {selectedInvoice.paymentProof ? (
                      <div className="aspect-auto min-h-[400px] bg-white border-4 border-nb-black overflow-hidden relative group shadow-nb">
                        <img 
                          src={`http://localhost:5900/${selectedInvoice.paymentProof.replace(/\\/g, '/')}`} 
                          alt="Proof" 
                          className="w-full h-full object-cover p-2"
                          onError={(e) => {
                            (e.target as any).src = 'https://via.placeholder.com/400?text=PROOF+NOT+FOUND';
                          }}
                        />
                        <a 
                          href={`http://localhost:5900/${selectedInvoice.paymentProof.replace(/\\/g, '/')}`} 
                          target="_blank" 
                          rel="noreferrer"
                          className="absolute inset-0 bg-nb-black/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white font-black uppercase tracking-widest text-xl"
                        >
                          View Original Image
                        </a>
                      </div>
                    ) : (
                      <div className="h-[400px] bg-white border-4 border-nb-black border-dashed flex flex-col items-center justify-center text-gray-400 font-black uppercase text-xl p-6 text-center">
                        <AlertCircle className="w-16 h-16 mb-4" />
                        No proof document uploaded
                      </div>
                    )}
                  </div>

                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}