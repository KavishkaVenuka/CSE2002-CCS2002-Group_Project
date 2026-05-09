"use client"

import { Clock, Package, Send, Truck, CheckCircle2, ShoppingBag, Search, ChevronDown, Eye, X } from "lucide-react"
import { T, font } from "@/lib/tokens"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const ORDERS = [
  { id: "ORD-20240115", quoteRef: "QT-20240110", date: "2024-01-15", items: "3 items", amount: "$15,000", status: "delivered" },
  { id: "ORD-20240114", quoteRef: "QT-20240109", date: "2024-01-14", items: "5 items", amount: "$22,000", status: "in-transit" },
  { id: "ORD-20240113", quoteRef: "QT-20240108", date: "2024-01-13", items: "2 items", amount: "$8,500", status: "dispatched" },
  { id: "ORD-20240112", quoteRef: "QT-20240107", date: "2024-01-12", items: "4 items", amount: "$18,000", status: "processing" },
  { id: "ORD-20240111", quoteRef: "QT-20240106", date: "2024-01-11", items: "3 items", amount: "$12,500", status: "pending" },
]

const STAT_CONFIG = {
  pending: { color: "#6B7280", bg: "#F3F4F6", icon: Clock },
  processing: { color: T.amber, bg: T.amberBg, icon: Package },
  dispatched: { color: "#A855F7", bg: "#F3E8FF", icon: Send },
  "in-transit": { color: "#3B82F6", bg: "#EFF6FF", icon: Truck },
  delivered: { color: T.green, bg: T.greenBg, icon: CheckCircle2 }
}

export default function MyOrdersPage() {
  return (
    <>
      <DashboardHeader title="My Orders" dateString="Thursday, 24 April 2026" />
      <main style={{
        flex: 1, overflow: "auto",
        padding: "24px 28px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {/* STATS ROW */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(5, minmax(0, 1fr))",
          gap: 16,
        }}>
          {Object.entries(STAT_CONFIG).map(([key, config]) => {
            const Icon = config.icon;
            return (
              <div key={key} style={{
                background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
                padding: "20px", display: "flex", flexDirection: "column", gap: 12,
                boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
              }}>
                <div style={{
                  width: 38, height: 38, borderRadius: 10,
                  background: config.bg, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <Icon size={18} color={config.color} />
                </div>
                <div>
                  <div style={{ fontSize: 13, color: T.t2, fontWeight: 500, textTransform: "capitalize" }}>{key.replace("-", " ")}</div>
                  <div style={{ fontSize: 24, color: T.t1, fontWeight: 700, marginTop: 4, fontFamily: font }}>1</div>
                </div>
              </div>
            )
          })}
        </div>

        {/* ── TABLE PANEL ─────────────────────────────────────────────────── */}
        <div style={{
          background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
          boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
        }}>
           {/* Header Area */}
          <div style={{ 
            padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between",
            borderBottom: `1px solid ${T.borderLight}`
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <ShoppingBag size={20} color={T.ink} />
              <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>All Orders</h2>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
               <div style={{ 
                 display: "flex", alignItems: "center", gap: 8, background: T.surface, 
                 border: `1px solid ${T.borderLight}`, borderRadius: 8, padding: "8px 12px", width: 240
               }}>
                 <Search size={16} color={T.t3} />
                 <input type="text" placeholder="Search orders..." style={{ 
                   background: "transparent", border: "none", outline: "none", fontSize: 13, color: T.t1, width: "100%", fontFamily: font
                 }} />
               </div>
               
               <div style={{ 
                 display: "flex", alignItems: "center", gap: 8, background: T.surface, 
                 border: `1px solid ${T.borderLight}`, borderRadius: 8, padding: "8px 12px", cursor: "pointer"
               }}>
                 <span style={{ fontSize: 13, color: T.t1, fontWeight: 500 }}>All Status</span>
                 <ChevronDown size={14} color={T.t2} />
               </div>
            </div>
          </div>
          
          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontFamily: font }}>
              <thead>
                <tr style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Order ID</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Quotation Ref</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Order Date</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Total Items</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Total Amount</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Status</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {ORDERS.map((ord, idx) => {
                  const sConf = STAT_CONFIG[ord.status as keyof typeof STAT_CONFIG];
                  const StatusIcon = sConf.icon;
                  return (
                    <tr key={ord.id} style={{ borderBottom: idx === ORDERS.length - 1 ? "none" : `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t1 }}>{ord.id}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{ord.quoteRef}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{ord.date}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{ord.items}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t1 }}>{ord.amount}</td>
                      <td style={{ padding: "16px 24px" }}>
                         <span style={{ 
                           display: "inline-flex", alignItems: "center", gap: 6,
                           background: sConf.bg, color: sConf.color, border: `1px solid ${sConf.color}40`,
                           padding: "4px 10px", borderRadius: 16, fontSize: 11, fontWeight: 600,
                         }}>
                            <StatusIcon size={12} strokeWidth={2.5} />
                            {ord.status}
                         </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                         <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                           <button style={{ 
                             background: "transparent", border: `1px solid ${T.borderLight}`, borderRadius: 8,
                             width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                             cursor: "pointer", color: T.t3, transition: "background 0.2s"
                           }} onMouseOver={(e) => e.currentTarget.style.background = T.surface} onMouseOut={(e) => e.currentTarget.style.background = "transparent"} title="View">
                             <Eye size={14} />
                           </button>

                           {ord.status === "pending" && (
                             <button style={{ 
                               background: "transparent", border: `1px solid ${T.red}40`, borderRadius: 8,
                               width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                               cursor: "pointer", color: T.red, transition: "background 0.2s"
                             }} onMouseOver={(e) => e.currentTarget.style.background = T.redBg} onMouseOut={(e) => e.currentTarget.style.background = "transparent"} title="Cancel Order">
                               <X size={14} />
                             </button>
                           )}
                         </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </>
  )
}