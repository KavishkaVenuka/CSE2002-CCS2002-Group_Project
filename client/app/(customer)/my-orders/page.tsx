"use client"

import { useState, useEffect } from "react"
import { Clock, Package, Send, Truck, CheckCircle2, ShoppingBag, Search, ChevronDown, Eye, X } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import MyOrdersLoading from "./loading"


interface Order {
  _id: string;
  orderID: string;
  quotationRef: string;
  orderDate: string;
  totalItems: number;
  totalAmount: number;
  status: 'pending' | 'processing' | 'dispatched' | 'in-transit' | 'delivered';
  customerID: string;
}

const STAT_CONFIG: Record<string, { color: string; icon: React.ElementType }> = {
  pending: { color: "bg-gray-200", icon: Clock },
  processing: { color: "bg-nb-orange", icon: Package },
  dispatched: { color: "bg-[#E9D5FF]", icon: Send },
  "in-transit": { color: "bg-nb-cyan", icon: Truck },
  delivered: { color: "bg-nb-green", icon: CheckCircle2 },
}

export default function MyOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("All Status");
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [selectedOrderData, setSelectedOrderData] = useState<Order | null>(null);

  const [stats, setStats] = useState({
    pending: 0,
    processing: 0,
    dispatched: 0,
    "in-transit": 0,
    delivered: 0
  });

  useEffect(() => {
    const fetchOrdersAndStats = async () => {
      const userDataString = localStorage.getItem("user");
      const userData = userDataString ? JSON.parse(userDataString) : null;
      // The Order model stores customerId as ObjectId (MongoDB _id), NOT the business ID (e.g. CUST000006).
      // So we must use the MongoDB _id from the user object, falling back to email.
      const mongoId = userData?._id || userData?.id;
      const userEmail = userData?.email || localStorage.getItem("userEmail");
      const fetchId = mongoId || userEmail;

      if (!fetchId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const API_BASE = process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") || "http://localhost:5900";
        const res = await fetch(`${API_BASE}/api/orders/customer/${fetchId}`);
        if (!res.ok) {
          throw new Error(`Failed to fetch orders: ${res.status}`);
        }
        const fetchedOrders: Order[] = await res.json();
        setOrders(fetchedOrders);
        console.log("Orders fetched for", fetchId, ":", fetchedOrders);

        // Compute stats locally to avoid multiple API calls
        const newStats = {
          pending: 0,
          processing: 0,
          dispatched: 0,
          "in-transit": 0,
          delivered: 0
        };

        fetchedOrders.forEach((order) => {
          if (newStats[order.status as keyof typeof newStats] !== undefined) {
            newStats[order.status as keyof typeof newStats]++;
          }
        });

        setStats(newStats);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrdersAndStats();
  }, []);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = order.orderID?.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === "All Status" || order.status.toLowerCase() === statusFilter.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <MyOrdersLoading />;
  }

  return (
    <>
      <DashboardHeader title="My Orders" />
      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg relative">

        {/* ── STAT CARDS ─────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-5">
          {Object.entries(STAT_CONFIG).map(([key, cfg]) => (
            <div key={key} className={`${cfg.color} border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-3 nb-interactive`}>
              <div className="w-11 h-11 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center shrink-0">
                <cfg.icon size={20} strokeWidth={2.5} className="text-black" />
              </div>
              <div>
                <p className="font-body font-bold text-[10px] text-black uppercase tracking-wider capitalize">{key.replace("-", " ")}</p>
                <h3 className="font-display font-black text-2xl text-black leading-none">{stats[key as keyof typeof stats] || 0}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* ── TABLE PANEL ────────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden relative">
          <div className="bg-black px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <ShoppingBag size={18} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">All Orders</h2>
            </div>
            <div className="flex items-center gap-3 w-full sm:w-auto">
              <div className="relative flex-1 sm:flex-none">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={14} strokeWidth={2.5} />
                <input
                  type="text"
                  placeholder="Search orders…"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 pr-4 py-2 bg-white border-[2px] border-white font-body text-sm focus:outline-none w-full sm:w-48"
                />
              </div>
              <div className="relative">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-nb-yellow border-[2px] border-white font-body font-bold text-sm text-black focus:outline-none cursor-pointer"
                >
                  <option value="All Status">All Status</option>
                  <option value="pending">Pending</option>
                  <option value="processing">Processing</option>
                  <option value="dispatched">Dispatched</option>
                  <option value="in-transit">In Transit</option>
                  <option value="delivered">Delivered</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-black" size={14} strokeWidth={2.5} />
              </div>
            </div>
          </div>

          <div className="overflow-x-auto min-h-[300px]">
            <div className="grid grid-cols-[1.4fr_1.2fr_1fr_70px_110px_110px_60px] px-6 py-3 border-b-[2px] border-black bg-nb-bg min-w-[900px]">
              {["Order ID", "Quotation Ref", "Order Date", "Items", "Amount", "Status", "Action"].map(h => (
                <div key={h} className="font-display font-black text-[10px] uppercase tracking-widest text-black">{h}</div>
              ))}
            </div>
            <div className="min-w-[900px]">
              {filteredOrders.length > 0 ? (
                filteredOrders.map((ord, i) => {
                  const cfg = STAT_CONFIG[ord.status] || { color: "bg-gray-200", icon: Clock };
                  const StatusIcon = cfg.icon;
                  return (
                    <div key={ord._id} className={`grid grid-cols-[1.4fr_1.2fr_1fr_70px_110px_110px_60px] items-center px-6 py-4 hover:bg-nb-yellow/20 transition-colors ${i < filteredOrders.length - 1 ? "border-b-[2px] border-black" : ""}`}>
                      <div className="font-mono text-sm font-bold text-black">{ord.orderID}</div>
                      <div className="font-mono text-xs text-black">{ord.quotationRef || "N/A"}</div>
                      <div className="font-mono text-xs text-black">{new Date(ord.orderDate).toLocaleDateString()}</div>
                      <div className="font-body text-sm text-black">{ord.totalItems}</div>
                      <div className="font-display font-black text-sm text-black">LKR {ord.totalAmount?.toLocaleString()}</div>
                      <div>
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 border-[2px] border-black font-mono font-bold text-[10px] uppercase ${cfg.color}`}>
                          <StatusIcon size={10} strokeWidth={2.5} /> {ord.status}
                        </span>
                      </div>
                      <div>
                        <button
                          onClick={() => {
                            setSelectedOrderData(ord);
                            setShowDetailsModal(true);
                          }}
                          className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-none transition-all"
                        >
                          <Eye size={14} strokeWidth={2.5} className="text-black" />
                        </button>
                      </div>
                    </div>
                  )
                })
              ) : (
                <div className="p-10 text-center flex flex-col items-center gap-3">
                  <ShoppingBag size={40} className="text-black/20" strokeWidth={1} />
                  <p className="font-body font-bold text-sm text-black/50">No orders found.</p>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ── DETAILS MODAL ──────────────────────────────────────── */}
        {showDetailsModal && selectedOrderData && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white border-[3px] border-black shadow-[8px_8px_0px_0px_#000] w-full max-w-md">
              <div className="flex items-center justify-between p-4 border-b-[3px] border-black bg-nb-yellow">
                <h3 className="font-display font-black text-lg uppercase tracking-wider">Order Information</h3>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] hover:translate-y-[2px] hover:shadow-none transition-all"
                >
                  <X size={16} strokeWidth={3} />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="p-4 bg-nb-bg border-[2px] border-black space-y-3 font-mono text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-black/60 font-bold uppercase text-xs">Order Reference</span>
                    <span className="font-bold">{selectedOrderData.orderID}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-black/60 font-bold uppercase text-xs">Customer ID</span>
                    <span>{selectedOrderData.customerID}</span>
                  </div>
                  <div className="flex justify-between items-center pt-3 border-t-[2px] border-black border-dashed">
                    <span className="font-bold uppercase text-xs">Total Bill</span>
                    <span className="text-lg font-black font-display bg-nb-cyan px-2 py-1 border-[2px] border-black shadow-[2px_2px_0px_0px_#000]">
                      LKR {selectedOrderData.totalAmount?.toLocaleString()}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => setShowDetailsModal(false)}
                  className="w-full py-3 bg-black text-white font-display font-black uppercase tracking-widest hover:bg-black/90 transition-colors"
                >
                  Close View
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </>
  )
}