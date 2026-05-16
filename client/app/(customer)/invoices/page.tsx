"use client"

import { useState, useEffect } from "react"
import { CheckCircle2, DollarSign, Package, Receipt, Eye, Download, FileText, Printer, X, Loader2, PlusCircle, CreditCard } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { getCustomerOrders, getCustomerInvoices, createInvoiceFromOrder } from "@/lib/api"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

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
  date: string;
  total: number;
  status: string;
  items: InvoiceItem[];
  subtotal?: number;
  tax_amount?: number;
}

interface Order {
  _id: string;
  orderID: string;
  status: string;
  orderDate: string;
  totalAmount: number;
  invoiced: boolean;
  items: any[];
}

const BADGE: Record<string, string> = {
  paid: "bg-nb-green",
  unpaid: "bg-nb-yellow",
  overdue: "bg-nb-red",
}

export default function InvoicesPage() {
  const router = useRouter()
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [pendingOrders, setPendingOrders] = useState<Order[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [isGenerating, setIsGenerating] = useState<string | null>(null)
  const [userData, setUserData] = useState<any>(null)

  const fetchData = async () => {
    const userDataString = localStorage.getItem('user')
    const parsedUser = userDataString ? JSON.parse(userDataString) : null
    setUserData(parsedUser)
    
    const userEmail = parsedUser?.email || localStorage.getItem('userEmail')
    const customerId = parsedUser?.id || parsedUser?._id || localStorage.getItem('customID') || localStorage.getItem('customerId')

    if (!customerId) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      
      const orders = await getCustomerOrders(customerId) as unknown as Order[]
      const deliveredNotInvoiced = orders.filter((o: Order) => 
        o.status.toLowerCase() === 'delivered' && !o.invoiced
      )
      setPendingOrders(deliveredNotInvoiced)

      let effectiveEmail = userEmail
      if (!effectiveEmail && orders.length > 0) {
        effectiveEmail = (orders[0] as any).email || effectiveEmail
      }

      if (effectiveEmail) {
        // Based on the working code, backend returns array directly or inside {invoices: []}
        // Fallback robust extraction
        const invResponse: any = await getCustomerInvoices(effectiveEmail)
        setInvoices(invResponse?.invoices || invResponse || [])
      }
    } catch (err) {
      console.error("Error fetching data:", err)
      toast.error("Failed to load invoice data")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const handleGenerateInvoice = async (orderId: string) => {
    try {
      setIsGenerating(orderId)
      await createInvoiceFromOrder(orderId)
      toast.success("Invoice generated successfully")
      fetchData() // Refresh
    } catch (err) {
      console.error("Error generating invoice:", err)
      toast.error("Failed to generate invoice")
    } finally {
      setIsGenerating(null)
    }
  }

  const handleDownload = () => {
    window.print()
  }

  const getStatusColor = (status: string) => {
    return BADGE[status.toLowerCase()] || "bg-gray-200"
  }

  const paidCount = invoices.filter(i => i.status.toLowerCase() === 'paid').length
  const unpaidCount = invoices.filter(i => i.status.toLowerCase() === 'unpaid').length
  const pendingCount = pendingOrders.length

  return (
    <>
      <DashboardHeader title="Invoices" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg relative">
        
        {loading && invoices.length === 0 && pendingOrders.length === 0 && (
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-white/80 z-10 gap-3">
             <Loader2 className="w-10 h-10 animate-spin text-black" />
             <p className="font-body font-bold text-sm uppercase tracking-wider text-black">Syncing Bills...</p>
          </div>
        )}

        {/* ── STAT CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-nb-green border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4 nb-interactive">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
              <CheckCircle2 size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div>
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Paid Invoices</p>
              <h3 className="font-display font-black text-3xl text-black leading-none">{paidCount}</h3>
            </div>
          </div>

          <div className="bg-nb-yellow border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4 nb-interactive">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
              <DollarSign size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div>
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Unpaid Invoices</p>
              <h3 className="font-display font-black text-3xl text-black leading-none">{unpaidCount}</h3>
            </div>
          </div>

          <div className="bg-nb-cyan border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4 nb-interactive">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
              <Package size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div>
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Awaiting Generation</p>
              <h3 className="font-display font-black text-3xl text-black leading-none">{pendingCount}</h3>
            </div>
          </div>
        </div>

        {/* ── PENDING DELIVERIES TABLE ────────────────────────────────────────── */}
        {pendingOrders.length > 0 && (
          <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
            <div className="bg-black px-6 py-4 flex items-center gap-3">
              <PlusCircle size={18} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Deliveries Awaiting Invoice</h2>
            </div>
            <div className="overflow-x-auto">
              <div className="grid grid-cols-[200px_150px_150px_1fr] px-5 py-3 border-b-[2px] border-black bg-nb-bg min-w-[700px]">
                {["Order ID", "Delivery Date", "Status", "Action"].map(h => (
                  <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
                ))}
              </div>
              <div className="min-w-[700px]">
                {pendingOrders.map((order, i) => (
                  <div key={order._id} className={`grid grid-cols-[200px_150px_150px_1fr] items-center px-5 py-4 hover:bg-nb-cyan/20 transition-colors ${i < pendingOrders.length - 1 ? "border-b-[2px] border-black" : ""}`}>
                    <div className="font-mono text-sm font-bold text-black">{order.orderID}</div>
                    <div className="font-mono text-xs text-black">{new Date(order.orderDate).toLocaleDateString()}</div>
                    <div>
                      <span className="px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase bg-nb-green">
                        Received
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleGenerateInvoice(order._id)}
                        disabled={isGenerating === order._id}
                        className="px-3 py-1.5 flex items-center justify-center gap-2 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-body font-bold text-xs uppercase disabled:opacity-50"
                      >
                        {isGenerating === order._id ? (
                          <Loader2 size={14} className="animate-spin" />
                        ) : (
                          <FileText size={14} strokeWidth={2.5} />
                        )}
                        Generate Invoice
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ── ALL INVOICES TABLE ────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">
          <div className="bg-black px-6 py-4 flex items-center gap-3">
            <Receipt size={18} strokeWidth={2.5} className="text-white" />
            <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Invoice History</h2>
          </div>
          <div className="overflow-x-auto">
            <div className="grid grid-cols-[150px_140px_110px_120px_110px_1fr] px-5 py-3 border-b-[2px] border-black bg-nb-bg min-w-[760px]">
              {["Invoice ID","Order Ref","Date","Amount","Status","Actions"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>
            <div className="min-w-[760px]">
              {invoices.length === 0 ? (
                <div className="p-10 text-center flex flex-col items-center gap-3">
                  <Receipt size={40} className="text-black/20" strokeWidth={1} />
                  <p className="font-body font-bold text-sm text-black/50">No invoices found.</p>
                </div>
              ) : (
                invoices.map((inv, i) => (
                  <div key={inv._id} className={`grid grid-cols-[150px_140px_110px_120px_110px_1fr] items-center px-5 py-4 hover:bg-nb-yellow/20 transition-colors ${i < invoices.length - 1 ? "border-b-[2px] border-black" : ""}`}>
                    <div className="font-mono text-sm font-bold text-black">{inv.invoiceID}</div>
                    <div className="font-mono text-xs text-black">{inv.orderID}</div>
                    <div className="font-mono text-xs text-black">{new Date(inv.date).toLocaleDateString()}</div>
                    <div className="font-display font-black text-sm text-black">LKR {inv.total?.toLocaleString() || '0'}</div>
                    <div>
                      <span className={`px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase ${getStatusColor(inv.status)}`}>
                        {inv.status}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSelectedInvoice(inv)}
                        className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        title="View"
                      >
                        <Eye size={14} strokeWidth={2.5} />
                      </button>
                      <button
                        className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all"
                        title="Download"
                        onClick={handleDownload}
                      >
                        <Download size={14} strokeWidth={2.5} />
                      </button>
                      {inv.status.toLowerCase() === 'unpaid' && (
                        <button
                          onClick={() => router.push(`/customer/payments?invoiceId=${inv.invoiceID}`)}
                          className="px-3 h-8 flex items-center justify-center gap-1 bg-nb-green border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all font-body font-bold text-[10px] uppercase"
                          title="Pay Now"
                        >
                          <CreditCard size={14} strokeWidth={2.5} />
                          Pay
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ── INVOICE MODAL ──────────────────────────────────────── */}
      {selectedInvoice && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-6" onClick={() => setSelectedInvoice(null)}>
          <div className="bg-white border-[4px] border-black shadow-[10px_10px_0px_0px_#000] w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col" onClick={e => e.stopPropagation()}>
            {/* Modal header */}
            <div className="bg-black px-6 py-4 flex items-center justify-between shrink-0 print:hidden">
              <div className="flex items-center gap-3">
                <FileText size={18} strokeWidth={2.5} className="text-white" />
                <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">Invoice Details</h2>
              </div>
              <div className="flex items-center gap-3">
                <button onClick={handleDownload} className="flex items-center gap-2 px-3 py-1.5 bg-white border-[2px] border-white font-body font-bold text-xs text-black hover:bg-nb-yellow transition-colors">
                  <Printer size={14} strokeWidth={2.5} /> Print
                </button>
                <button onClick={() => setSelectedInvoice(null)} className="w-8 h-8 flex items-center justify-center bg-nb-red border-[2px] border-white text-white hover:bg-white hover:text-nb-red transition-colors">
                  <X size={16} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Invoice body */}
            <div className="overflow-y-auto p-8 flex justify-center bg-nb-bg print:p-0 print:bg-white">
              <div className="w-full max-w-3xl bg-white border-[2px] border-black p-10 space-y-8 print:border-0 print:shadow-none">
                {/* Invoice head */}
                <div className="flex justify-between items-start border-b-[3px] border-black pb-8">
                  <div>
                    <h1 className="font-display font-black text-5xl tracking-widest text-black mb-6">INVOICE</h1>
                    <div className="space-y-1 font-mono text-sm text-black">
                      <div className="flex gap-2"><span className="font-bold w-24">Invoice #:</span> {selectedInvoice.invoiceID}</div>
                      <div className="flex gap-2"><span className="font-bold w-24">Date:</span> {new Date(selectedInvoice.date).toLocaleDateString()}</div>
                      <div className="flex gap-2"><span className="font-bold w-24">Order #:</span> {selectedInvoice.orderID}</div>
                    </div>
                  </div>
                  <div className="text-right font-body text-sm text-black space-y-1">
                    <div className="inline-flex items-center gap-2 mb-4 bg-black text-white px-4 py-2 border-[2px] border-black shadow-[4px_4px_0px_0px_#000]">
                      <Receipt className="w-5 h-5" />
                      <span className="font-display font-black uppercase tracking-wider">Business Solution</span>
                    </div>
                    <div className="font-mono text-xs">
                      <div>456 Enterprise Way</div>
                      <div>Colombo 07, Sri Lanka</div>
                      <div>+94 11 234 5678</div>
                      <div>billing@bms.com</div>
                    </div>
                  </div>
                </div>

                {/* Bill to & Status */}
                <div className="grid grid-cols-2 gap-8">
                  <div className="border-[2px] border-black p-5 bg-nb-bg shadow-[4px_4px_0px_0px_#000]">
                    <p className="font-display font-black text-[10px] uppercase tracking-widest mb-3">Bill To:</p>
                    <p className="font-body font-bold text-lg text-black">{userData?.name || "Valued Customer"}</p>
                    <p className="font-mono text-sm text-black mt-1">{userData?.email}</p>
                    <p className="font-mono text-sm text-black mt-1">{userData?.address || "Address on file"}</p>
                  </div>
                  <div className="border-[2px] border-black p-5 bg-nb-yellow/30 shadow-[4px_4px_0px_0px_#000] flex flex-col justify-center">
                    <p className="font-display font-black text-[10px] uppercase tracking-widest mb-3">Payment Status:</p>
                    <div>
                      <span className={`px-3 py-1 border-[2px] border-black font-mono font-bold text-sm uppercase ${getStatusColor(selectedInvoice.status)}`}>
                        {selectedInvoice.status}
                      </span>
                    </div>
                    <p className="font-mono text-xs text-black mt-3">
                      Due Date: {new Date(new Date(selectedInvoice.date).getTime() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Items */}
                <div className="border-[3px] border-black overflow-hidden shadow-[6px_6px_0px_0px_#000]">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-black text-white">
                        <th className="p-4 font-display font-black text-[10px] uppercase tracking-widest">Description</th>
                        <th className="p-4 font-display font-black text-[10px] uppercase tracking-widest text-center">Qty</th>
                        <th className="p-4 font-display font-black text-[10px] uppercase tracking-widest text-right">Unit Price</th>
                        <th className="p-4 font-display font-black text-[10px] uppercase tracking-widest text-right">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedInvoice.items?.map((item, idx) => (
                        <tr key={idx} className={`font-mono text-sm text-black ${idx !== selectedInvoice.items.length - 1 ? 'border-b-[2px] border-black' : ''} hover:bg-nb-yellow/20`}>
                          <td className="p-4 font-body font-bold">{item.itemName}</td>
                          <td className="p-4 text-center">{item.quantity}</td>
                          <td className="p-4 text-right">LKR {item.unitPrice?.toLocaleString() || '0'}</td>
                          <td className="p-4 text-right font-bold">LKR {item.totalPrice?.toLocaleString() || '0'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Totals */}
                <div className="flex justify-end">
                  <div className="w-80 space-y-4 p-5 bg-nb-bg border-[3px] border-black shadow-[6px_6px_0px_0px_#000]">
                    <div className="flex justify-between font-mono text-sm border-b-[2px] border-black border-dashed pb-2">
                      <span className="font-bold uppercase">Subtotal</span>
                      <span>LKR {selectedInvoice.subtotal?.toLocaleString() || selectedInvoice.total?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between font-mono text-sm border-b-[2px] border-black border-dashed pb-2">
                      <span className="font-bold uppercase">Tax (10%)</span>
                      <span>LKR {selectedInvoice.tax_amount?.toLocaleString() || '0'}</span>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="font-display font-black text-sm uppercase">Grand Total</span>
                      <span className="font-display font-black text-2xl bg-nb-cyan px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                        LKR {selectedInvoice.total?.toLocaleString() || '0'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Footer */}
                <div className="text-center border-t-[3px] border-black pt-8 mt-8">
                  <p className="font-display font-black text-lg text-black uppercase tracking-wider mb-2">Thank you for your business!</p>
                  <p className="font-mono font-bold text-xs bg-nb-yellow inline-block px-3 py-1 border-[2px] border-black">Please process payment within 30 days</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}