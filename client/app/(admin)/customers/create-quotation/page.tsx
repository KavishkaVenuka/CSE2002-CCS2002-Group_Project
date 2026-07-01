'use client';

import { useState, useEffect, Suspense } from 'react';
import axios from 'axios';
import { useRouter, useSearchParams } from 'next/navigation';
import { PriceInput } from '@/components/ui/PriceInput';
import {
  Send,
  Save,
  XCircle,
  CheckCircle,
  FileText,
  Package,
  ArrowLeft,
  ClipboardList,
  User,
  Building2,
  Hash,
  Calendar,
} from 'lucide-react';

interface PriceItem {
  id: number;
  itemName: string;
  quantity: number;
  unit: string;
  deliveryDate?: string;
  notes?: string;
  unitPrice: string;
  total: number;
}

function CreateQuotationContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const reqId = searchParams.get('reqId');

  const [requirement, setRequirement] = useState<any>(null);
  const [items, setItems] = useState<PriceItem[]>([]);
  const [isLoadingReq, setIsLoadingReq] = useState(true);

  const [quotationDetails, setQuotationDetails] = useState({
    quotationId: 'QT-' + Date.now().toString().slice(-6),
    creationDate: new Date().toISOString().split('T')[0],
    expiryDate: '',
    priority: 'medium',
  });

  const [generalNotes, setGeneralNotes] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  useEffect(() => {
    const fetchRequirement = async () => {
      if (!reqId) {
        setIsLoadingReq(false);
        return;
      }
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5900/api/requirements', {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        const reqs = res.data.requirements || res.data.data || [];
        const found = reqs.find((r: any) => r.id === reqId || r._id === reqId || r.requirementId === reqId);
        
        if (found) {
          setRequirement(found);
          if (found.items && found.items.length > 0) {
            setItems(found.items.map((item: any, idx: number) => ({
              id: idx + 1,
              itemName: item.itemName || '',
              quantity: Number(item.quantity) || 1,
              unit: item.unit || 'pcs',
              deliveryDate: item.deliveryDate,
              notes: item.notes,
              unitPrice: '',
              total: 0,
            })));
          }
        }
      } catch (err) {
        console.error("Error fetching requirement:", err);
      } finally {
        setIsLoadingReq(false);
      }
    };
    fetchRequirement();
  }, [reqId]);

  // Update unit price & recalculate total
  const updatePrice = (id: number, value: string) => {
    setItems(items.map(item => {
      if (item.id === id) {
        const price = parseFloat(value) || 0;
        return { ...item, unitPrice: value, total: price * item.quantity };
      }
      return item;
    }));
  };

  const subtotal = items.reduce((sum, item) => sum + item.total, 0);
  const taxRate = 0.1;
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  const handleSubmit = async (action: 'send' | 'draft') => {
    // 1. Validation
    if (items.some(item => !item.unitPrice || parseFloat(item.unitPrice) <= 0)) {
      alert('Please enter a unit price for all items');
      return;
    }
    if (!quotationDetails.expiryDate) {
      alert('Please set an expiry date');
      return;
    }

    // 2. Formatting
    const quotationData = {
      requirementId: requirement?.id || requirement?._id,
      items: items.map(item => ({
        itemName: item.itemName,
        quantity: item.quantity,
        unit: item.unit,
        unitPrice: parseFloat(item.unitPrice),
        totalPrice: item.total,
        description: item.notes || ""
      })),
      subtotal: subtotal,
      tax_amount: tax,
      total_estimate: total,
      currency: "LKR",
      notes: generalNotes,
      validUntil: quotationDetails.expiryDate,
      delivery_timeline: "3-5 Business Days",
      payment_terms: "Net 30",
      status: action === 'draft' ? 'draft' : 'pending'
    };

    try {
      const token = localStorage.getItem('token');
      
      const response = await axios.post('http://localhost:5900/api/quotations/create-supplier-quotation', quotationData, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (response.data.success) {
        setShowSuccessModal(true);
      }
    } catch (error: any) {
      console.error("Submission Error:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Something went wrong!");
    }
  };

  const inputStyle = "w-full border-2 border-nb-black bg-white focus:outline-none p-3 font-bold text-nb-black shadow-[2px_2px_0px_0px_#000]";

  return (
    <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">
      
      {/* Header */}
      <div className="relative border-4 border-nb-black bg-nb-cyan p-4 shadow-nb-lg">
        <div className="relative z-10 flex flex-col items-start gap-2">
          <button
            onClick={() => router.push('/customers/requirements')}
            className="flex items-center gap-2 text-nb-black font-black uppercase tracking-widest text-xs hover:underline"
          >
            <ArrowLeft className="w-4 h-4" /> Back to Customer Requests
          </button>
          <span className="nb-badge bg-white text-nb-black text-xs py-0.5 px-2">Admin Portal</span>
          <h1 className="text-3xl font-black uppercase font-display tracking-tight text-nb-black">
            Create Quotation
          </h1>
          <p className="mt-0.5 font-bold text-nb-black text-base border-l-4 border-nb-black pl-3 bg-white/50 py-0.5 max-w-2xl">
            Set prices for the customer requirement and send the quotation.
          </p>
        </div>
      </div>

      {isLoadingReq ? (
        <div className="p-10 border-4 border-nb-black bg-white shadow-nb text-center font-black uppercase tracking-widest text-xl">
          Loading requirement details...
        </div>
      ) : requirement ? (
        <div className="space-y-8">
          
          {/* Requirement Reference Card */}
          <div className="border-4 border-nb-black bg-white shadow-nb overflow-hidden">
            <div className="bg-nb-yellow px-8 py-4 border-b-4 border-nb-black flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-nb-black" strokeWidth={2.5} />
              <h3 className="text-nb-black font-black text-xl uppercase tracking-widest">Requirement Reference</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2"><Hash className="w-4 h-4"/>Req ID</p>
                  <p className="text-xl font-black text-nb-black">{requirement.requirementId || requirement.id}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2"><User className="w-4 h-4"/>Customer</p>
                  <p className="text-xl font-black text-nb-black">{requirement.customerName}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2"><Building2 className="w-4 h-4"/>Company</p>
                  <p className="text-lg font-bold text-nb-black bg-gray-100 p-2 border-2 border-nb-black inline-block">{requirement.companyName || '—'}</p>
                </div>
                <div>
                  <p className="text-xs font-black uppercase tracking-widest text-gray-500 mb-1 flex items-center gap-2"><Calendar className="w-4 h-4"/>Received On</p>
                  <p className="text-lg font-black text-nb-black">
                    {requirement.createdAt ? new Date(requirement.createdAt).toLocaleDateString() : '—'}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Quotation Details */}
          <div className="border-4 border-nb-black bg-white shadow-nb overflow-hidden">
            <div className="bg-nb-cyan px-8 py-4 border-b-4 border-nb-black flex items-center gap-3">
              <FileText className="h-6 w-6 text-nb-black" strokeWidth={2.5} />
              <h3 className="text-nb-black font-black text-xl uppercase tracking-widest">Quotation Details</h3>
            </div>
            <div className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-nb-black block mb-2">Quotation ID</label>
                  <input
                    value={quotationDetails.quotationId}
                    disabled
                    className={`${inputStyle} bg-gray-100 cursor-not-allowed text-gray-500`}
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-nb-black block mb-2">Creation Date</label>
                  <input
                    type="date"
                    value={quotationDetails.creationDate}
                    disabled
                    className={`${inputStyle} bg-gray-100 cursor-not-allowed text-gray-500`}
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-nb-black block mb-2">
                    Expiry Date <span className="text-nb-red">*</span>
                  </label>
                  <input
                    type="date"
                    value={quotationDetails.expiryDate}
                    onChange={(e) => setQuotationDetails({ ...quotationDetails, expiryDate: e.target.value })}
                    className={inputStyle}
                    min={quotationDetails.creationDate}
                  />
                </div>
                <div>
                  <label className="text-xs font-black uppercase tracking-widest text-nb-black block mb-2">Priority</label>
                  <select
                    value={quotationDetails.priority}
                    onChange={(e) => setQuotationDetails({ ...quotationDetails, priority: e.target.value })}
                    className={`${inputStyle} appearance-none cursor-pointer`}
                  >
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Items Pricing Table */}
          <div className="border-4 border-nb-black bg-white shadow-nb overflow-hidden">
            <div className="bg-nb-black px-8 py-4 border-b-4 border-nb-black flex items-center gap-3">
              <Package className="h-6 w-6 text-white" strokeWidth={2.5} />
              <h3 className="text-white font-black text-xl uppercase tracking-widest">Items — Enter Prices</h3>
            </div>
            <div>
              {items.length === 0 ? (
                <div className="p-10 text-center font-black uppercase tracking-widest text-gray-500">
                  No items found in this requirement.
                </div>
              ) : (
                <>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                      <thead className="bg-gray-100 border-b-4 border-nb-black">
                        <tr>
                          <th className="py-4 pl-8 font-black uppercase text-nb-black border-r-2 border-nb-black text-sm">#</th>
                          <th className="p-4 font-black uppercase text-nb-black border-r-2 border-nb-black text-sm">Item Name</th>
                          <th className="p-4 text-center font-black uppercase text-nb-black border-r-2 border-nb-black text-sm">Qty</th>
                          <th className="p-4 text-center font-black uppercase text-nb-black border-r-2 border-nb-black text-sm">Unit</th>
                          <th className="p-4 text-center font-black uppercase text-nb-black border-r-2 border-nb-black text-sm">Delivery Date</th>
                          <th className="p-4 font-black uppercase text-nb-black border-r-2 border-nb-black text-sm">Notes</th>
                          <th className="p-4 font-black uppercase text-nb-cyan bg-nb-black border-r-2 border-nb-black text-sm">Unit Price (LKR) *</th>
                          <th className="p-4 text-right pr-8 font-black uppercase text-nb-black text-sm">Total (LKR)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {items.map((item, idx) => (
                          <tr key={item.id} className="hover:bg-nb-bg transition-colors border-b-2 border-nb-black last:border-b-4 last:border-nb-black">
                            <td className="py-5 pl-8 font-black text-xl border-r-2 border-nb-black">{idx + 1}</td>

                            <td className="p-4 border-r-2 border-nb-black">
                              <div className="text-lg font-bold text-nb-black">{item.itemName}</div>
                            </td>

                            <td className="p-4 text-center border-r-2 border-nb-black">
                              <span className="inline-flex items-center justify-center bg-white border-2 border-nb-black shadow-nb-sm px-4 py-2 text-xl font-black text-nb-black">
                                {item.quantity}
                              </span>
                            </td>

                            <td className="p-4 text-center border-r-2 border-nb-black">
                              <span className="text-sm font-bold uppercase text-gray-500">{item.unit}</span>
                            </td>

                            <td className="p-4 text-center text-sm font-bold text-nb-black border-r-2 border-nb-black">
                              {item.deliveryDate ? new Date(item.deliveryDate).toLocaleDateString() : 'IMMEDIATE'}
                            </td>

                            <td className="p-4 text-sm font-bold text-gray-500 max-w-[200px] truncate border-r-2 border-nb-black">
                              {item.notes || '—'}
                            </td>

                            <td className="p-4 bg-gray-50 border-r-2 border-nb-black">
                              <div className="relative">
                                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-nb-black font-black text-sm">LKR</span>
                                <PriceInput
                                  value={item.unitPrice}
                                  onChange={(e) => updatePrice(item.id, e.target.value)}
                                  placeholder="0.00"
                                  className="pl-12 w-full border-2 border-nb-black bg-white focus:outline-none p-2 font-black text-lg text-nb-black shadow-[2px_2px_0px_0px_#000]"
                                />
                              </div>
                            </td>

                            <td className="p-4 text-right pr-8">
                              <span className="font-black text-xl text-nb-black">
                                {item.total > 0 ? `LKR ${item.total.toFixed(2)}` : '—'}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Totals */}
                  <div className="flex justify-end p-8 bg-nb-bg">
                    <div className="w-full md:w-96 space-y-4 bg-white border-4 border-nb-black shadow-nb p-6">
                      <div className="flex justify-between font-bold uppercase text-lg text-nb-black">
                        <span>Subtotal</span>
                        <span>LKR {subtotal.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between font-bold uppercase text-lg text-nb-red">
                        <span>Tax (VAT 10%)</span>
                        <span>+ LKR {tax.toFixed(2)}</span>
                      </div>
                      <div className="h-1 bg-nb-black my-4" />
                      <div className="flex justify-between text-2xl">
                        <span className="font-black text-nb-black uppercase">Total</span>
                        <span className="font-black bg-nb-green px-2 border-2 border-nb-black shadow-nb-sm">LKR {total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="border-4 border-nb-black bg-white shadow-nb overflow-hidden">
            <div className="bg-nb-yellow px-8 py-4 border-b-4 border-nb-black flex items-center gap-3">
              <FileText className="h-6 w-6 text-nb-black" strokeWidth={2.5} />
              <h3 className="text-nb-black font-black text-xl uppercase tracking-widest">Notes to Customer</h3>
            </div>
            <div className="p-8">
              <textarea
                value={generalNotes}
                onChange={(e) => setGeneralNotes(e.target.value)}
                placeholder="ADD ANY ADDITIONAL TERMS, DELIVERY CONDITIONS, OR SPECIAL INSTRUCTIONS..."
                className="w-full min-h-[150px] border-4 border-nb-black bg-white focus:outline-none p-4 font-bold text-nb-black shadow-[4px_4px_0px_0px_#000] resize-y uppercase"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-end pt-4">
            <button
              onClick={() => router.push('/customers/requirements')}
              className="px-8 py-4 border-4 border-nb-black bg-white text-nb-black font-black uppercase text-lg shadow-nb hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 nb-interactive"
            >
              <XCircle className="w-6 h-6" /> Cancel
            </button>
            <button
              onClick={() => handleSubmit('draft')}
              className="px-8 py-4 border-4 border-nb-black bg-nb-cyan text-nb-black font-black uppercase text-lg shadow-nb transition-colors flex items-center justify-center gap-3 nb-interactive"
            >
              <Save className="w-6 h-6" /> Save as Draft
            </button>
            <button
              onClick={() => handleSubmit('send')}
              className="px-8 py-4 border-4 border-nb-black bg-nb-green text-nb-black font-black uppercase text-lg shadow-nb transition-colors flex items-center justify-center gap-3 nb-interactive"
            >
              <Send className="w-6 h-6" /> Send Quotation
            </button>
          </div>
        </div>
      ) : (
        <div className="p-10 border-4 border-nb-black bg-nb-yellow shadow-nb text-center font-black uppercase tracking-widest text-xl text-nb-black">
          No requirement reference found. Please navigate from the Customer Requests page.
        </div>
      )}

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
          <div className="bg-white border-4 border-nb-black shadow-nb-xl w-full max-w-lg flex flex-col items-center p-10 text-center">
            <div className="w-24 h-24 bg-nb-green border-4 border-nb-black shadow-nb flex items-center justify-center mb-6 rounded-none">
              <CheckCircle className="w-12 h-12 text-nb-black" strokeWidth={3} />
            </div>
            
            <h2 className="text-4xl font-black uppercase font-display text-nb-black mb-4">Quotation Sent!</h2>
            
            <p className="text-lg font-bold text-gray-700 mb-8 border-l-4 border-nb-black pl-4 bg-gray-100 py-3 text-left w-full">
              Quotation <span className="text-nb-black font-black uppercase bg-nb-cyan px-1 border-2 border-nb-black inline-block">{quotationDetails.quotationId}</span> has been sent to{' '}
              <span className="text-nb-black font-black uppercase">{requirement?.customerName}</span>.
            </p>
            
            <div className="flex flex-col sm:flex-row w-full gap-4">
              <button
                onClick={() => { setShowSuccessModal(false); router.push('/customers/requirements'); }}
                className="flex-1 px-4 py-4 border-4 border-nb-black bg-white text-nb-black font-black uppercase shadow-nb nb-interactive"
              >
                Back to Requests
              </button>
              <button
                onClick={() => { setShowSuccessModal(false); router.push('/customers/quotations'); }}
                className="flex-1 px-4 py-4 border-4 border-nb-black bg-nb-black text-white font-black uppercase shadow-nb nb-interactive"
              >
                View Quotations
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function AdminCreateQuotation() {
  return (
    <>
      <Suspense fallback={<div className="flex-1 p-8 font-black uppercase tracking-widest text-xl">Loading...</div>}>
        <CreateQuotationContent />
      </Suspense>
    </>
  );
}