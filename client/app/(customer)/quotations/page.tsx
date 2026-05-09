"use client"

import { useState } from "react"
import { Clock, CheckCircle2, XCircle, AlertCircle, FileText, Search, Eye, Check, X, X as CloseIcon } from "lucide-react"
import { T, font } from "@/lib/tokens"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const QUOTATIONS = [
  { id: "QT-20240115", reqRef: "REQ-20240110", date: "2024-01-15", expiryDate: "2024-01-25", items: 3, amount: "$15,000", status: "pending" },
  { id: "QT-20240112", reqRef: "REQ-20240108", date: "2024-01-12", expiryDate: "2024-01-22", items: 5, amount: "$22,000", status: "accepted" },
  { id: "QT-20240110", reqRef: "REQ-20240105", date: "2024-01-10", expiryDate: "2024-01-20", items: 2, amount: "$8,500", status: "rejected" },
  { id: "QT-20240108", reqRef: "REQ-20240103", date: "2024-01-08", expiryDate: "2024-01-15", items: 4, amount: "$18,000", status: "expired" },
]

export default function QuotationsPage() {
  const [selectedQuotation, setSelectedQuotation] = useState<any>(null);

  return (
    <>
      <DashboardHeader title="Quotations" dateString="Thursday, 24 April 2026" />
      <main style={{
        flex: 1, overflow: "auto",
        padding: "24px 28px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {/* STATS ROW */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, minmax(0, 1fr))",
          gap: 16,
        }}>
           {/* Card 1: Pending */}
           <div style={{
             background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
             padding: "20px", display: "flex", flexDirection: "column", gap: 12,
             boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
           }}>
             <div style={{
               width: 38, height: 38, borderRadius: 10,
               background: T.amberBg, display: "flex", alignItems: "center", justifyContent: "center"
             }}>
               <Clock size={18} color={T.amber} />
             </div>
             <div>
               <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Pending</div>
               <div style={{ fontSize: 24, color: T.t1, fontWeight: 700, marginTop: 4, fontFamily: font }}>1</div>
             </div>
           </div>
           
           {/* Card 2: Accepted */}
           <div style={{
             background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
             padding: "20px", display: "flex", flexDirection: "column", gap: 12,
             boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
           }}>
             <div style={{
               width: 38, height: 38, borderRadius: 10,
               background: T.greenBg, display: "flex", alignItems: "center", justifyContent: "center"
             }}>
               <CheckCircle2 size={18} color={T.green} />
             </div>
             <div>
               <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Accepted</div>
               <div style={{ fontSize: 24, color: T.t1, fontWeight: 700, marginTop: 4, fontFamily: font }}>1</div>
             </div>
           </div>

           {/* Card 3: Rejected */}
           <div style={{
             background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
             padding: "20px", display: "flex", flexDirection: "column", gap: 12,
             boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
           }}>
             <div style={{
               width: 38, height: 38, borderRadius: 10,
               background: T.redBg, display: "flex", alignItems: "center", justifyContent: "center"
             }}>
               <XCircle size={18} color={T.red} />
             </div>
             <div>
               <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Rejected</div>
               <div style={{ fontSize: 24, color: T.t1, fontWeight: 700, marginTop: 4, fontFamily: font }}>1</div>
             </div>
           </div>

           {/* Card 4: Expired */}
           <div style={{
             background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
             padding: "20px", display: "flex", flexDirection: "column", gap: 12,
             boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
           }}>
             <div style={{
               width: 38, height: 38, borderRadius: 10,
               background: T.surface, display: "flex", alignItems: "center", justifyContent: "center"
             }}>
               <AlertCircle size={18} color={T.t3} />
             </div>
             <div>
               <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Expired</div>
               <div style={{ fontSize: 24, color: T.t1, fontWeight: 700, marginTop: 4, fontFamily: font }}>1</div>
             </div>
           </div>
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
              <FileText size={20} color={T.ink} />
              <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>All Quotations</h2>
            </div>
            
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <div style={{
                display: "flex", alignItems: "center", gap: 8,
                background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
                padding: "8px 12px", width: 220
              }}>
                <Search size={14} color={T.t3} />
                <input 
                  type="text" 
                  placeholder="Search quotations..." 
                  style={{
                    background: "transparent", border: "none", outline: "none",
                    fontSize: 13, color: T.t1, width: "100%", fontFamily: font
                  }}
                />
              </div>
              <div style={{ position: "relative" }}>
                 <select style={{
                   background: T.surface, border: `1px solid ${T.border}`, borderRadius: 8,
                   padding: "8px 32px 8px 14px", fontSize: 13, color: T.t2, outline: "none",
                   fontFamily: font, cursor: "pointer", appearance: "none"
                 }}>
                   <option>All Status</option>
                   <option>Pending</option>
                   <option>Accepted</option>
                   <option>Rejected</option>
                   <option>Expired</option>
                 </select>
                 <div style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.t3 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                 </div>
              </div>
            </div>
          </div>
          
          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontFamily: font }}>
              <thead>
                <tr style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Quotation ID</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Requirement Ref</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Date</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Expiry Date</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Items</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Total Amount</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Status</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2, textAlign: "right" }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {QUOTATIONS.map((q, idx) => {
                  let badgeBg, badgeColor, badgeBorder, badgeText;
                  if (q.status === 'pending') { badgeBg = T.amberBg; badgeColor = T.amber; badgeBorder = T.amber; badgeText = "Pending" }
                  else if (q.status === 'accepted') { badgeBg = T.greenBg; badgeColor = T.green; badgeBorder = T.green; badgeText = "Accepted" }
                  else if (q.status === 'rejected') { badgeBg = T.redBg; badgeColor = T.red; badgeBorder = T.redBg; badgeText = "Rejected" }
                  else { badgeBg = T.surface; badgeColor = T.t3; badgeBorder = T.border; badgeText = "Expired" }
                  
                  return (
                    <tr key={q.id} style={{ borderBottom: idx === QUOTATIONS.length - 1 ? "none" : `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "16px 24px", fontSize: 13, fontWeight: 600, color: T.t1 }}>{q.id}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{q.reqRef}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{q.date}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{q.expiryDate}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{q.items} items</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, fontWeight: 600, color: T.t1 }}>{q.amount}</td>
                      <td style={{ padding: "16px 24px" }}>
                         <span style={{ 
                           display: "inline-flex", alignItems: "center", gap: 6,
                           background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`,
                           padding: "4px 10px", borderRadius: 16, fontSize: 11, fontWeight: 600,
                           letterSpacing: "0.02em"
                         }}>
                            {q.status === 'pending' && <Clock size={11} strokeWidth={2.5} />}
                            {q.status === 'accepted' && <CheckCircle2 size={11} strokeWidth={2.5} />}
                            {q.status === 'rejected' && <XCircle size={11} strokeWidth={2.5} />}
                            {q.status === 'expired' && <AlertCircle size={11} strokeWidth={2.5} />}
                            {badgeText}
                         </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                         <div style={{ display: "flex", alignItems: "center", justifyContent: "flex-end", gap: 8 }}>
                           <button 
                             onClick={() => setSelectedQuotation(q)}
                             style={{ 
                             background: "transparent", border: `1px solid ${T.borderLight}`, borderRadius: 8,
                             width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                             cursor: "pointer", color: T.t3, transition: "all 0.2s"
                           }} title="View">
                             <Eye size={14} />
                           </button>
                           
                           {q.status === 'pending' && (
                             <>
                               <button style={{ 
                                   background: "transparent", border: `1px solid ${T.borderLight}`, borderRadius: 8,
                                   width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                                   cursor: "pointer", color: T.t2, transition: "all 0.2s"
                               }} title="Accept">
                                   <Check size={14} />
                               </button>
                               
                               <button style={{ 
                                   background: "transparent", border: `1px solid ${T.redBg}`, borderRadius: 8,
                                   width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                                   cursor: "pointer", color: T.red, transition: "all 0.2s"
                               }} title="Reject">
                                   <X size={14} />
                               </button>
                             </>
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

      {/* Modal Overlay Component */}
      {selectedQuotation && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(26,58,92,0.4)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 24
        }} onClick={() => setSelectedQuotation(null)}>
          <div style={{
            background: T.card, borderRadius: 16, width: "100%", maxWidth: 640,
            boxShadow: "0 10px 40px rgba(26,58,92,0.15)", overflow: "hidden",
            display: "flex", flexDirection: "column", fontFamily: font
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: `1px solid ${T.borderLight}` }}>
               <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                 <FileText size={18} color={T.ink} />
                 <h2 style={{ fontSize: 16, fontWeight: 700, color: T.t1, margin: 0 }}>Quotation Details</h2>
               </div>
               <button onClick={() => setSelectedQuotation(null)} style={{
                 background: "transparent", border: `1px solid ${T.border}`, borderRadius: 8,
                 width: 30, height: 30, display: "flex", alignItems: "center", justifyContent: "center",
                 cursor: "pointer", color: T.t3, transition: "background 0.2s"
               }} onMouseOver={(e) => e.currentTarget.style.background = T.surface} onMouseOut={(e) => e.currentTarget.style.background = "transparent"}>
                 <CloseIcon size={16} />
               </button>
            </div>
            
            <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 24, maxHeight: "75vh", overflowY: "auto" }}>
              <div style={{ 
                background: T.surface, borderRadius: 12, padding: "20px 24px",
                display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 
              }}>
                <div>
                  <div style={{ fontSize: 12, color: T.t3, marginBottom: 4 }}>Quotation ID</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{selectedQuotation.id}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: T.t3, marginBottom: 4 }}>Date</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{selectedQuotation.date}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: T.t3, marginBottom: 4 }}>Expiry Date</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{selectedQuotation.expiryDate}</div>
                </div>
                <div>
                  <div style={{ fontSize: 12, color: T.t3, marginBottom: 6 }}>Status</div>
                  {/* Status Badge */}
                  {(() => {
                    let badgeBg, badgeColor, badgeBorder, badgeText;
                    const status = selectedQuotation.status;
                    if (status === 'pending') { badgeBg = T.amberBg; badgeColor = T.amber; badgeBorder = T.amber; badgeText = "Pending" }
                    else if (status === 'accepted') { badgeBg = T.greenBg; badgeColor = T.green; badgeBorder = T.green; badgeText = "Accepted" }
                    else if (status === 'rejected') { badgeBg = T.redBg; badgeColor = T.red; badgeBorder = T.redBg; badgeText = "Rejected" }
                    else { badgeBg = T.card; badgeColor = T.t3; badgeBorder = T.border; badgeText = "Expired" }
                    return (
                      <span style={{ 
                         display: "inline-flex", alignItems: "center", gap: 6,
                         background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`,
                         padding: "4px 10px", borderRadius: 16, fontSize: 11, fontWeight: 600,
                         letterSpacing: "0.02em"
                      }}>
                          {status === 'pending' && <Clock size={11} strokeWidth={2.5} />}
                          {status === 'accepted' && <CheckCircle2 size={11} strokeWidth={2.5} />}
                          {status === 'rejected' && <XCircle size={11} strokeWidth={2.5} />}
                          {status === 'expired' && <AlertCircle size={11} strokeWidth={2.5} />}
                          {badgeText}
                      </span>
                    )
                  })()}
                </div>
              </div>

              {/* Items Table */}
              <div style={{ border: `1px solid ${T.borderLight}`, borderRadius: 12, overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: `1px solid ${T.borderLight}`, background: T.card }}>
                      <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Item</th>
                      <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Quantity</th>
                      <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Unit Price</th>
                      <th style={{ padding: "12px 16px", fontSize: 12, fontWeight: 600, color: T.t2, textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t1 }}>Product A - Electronics</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t2 }}>500</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t2 }}>$250</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t1, fontWeight: 500, textAlign: "right" }}>$125,000</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t1 }}>Product B - Furniture</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t2 }}>300</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t2 }}>$180</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t1, fontWeight: 500, textAlign: "right" }}>$54,000</td>
                    </tr>
                    <tr>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t1 }}>Product C - Textiles</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t2 }}>200</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t2 }}>$45</td>
                      <td style={{ padding: "14px 16px", fontSize: 13, color: T.t1, fontWeight: 500, textAlign: "right" }}>$9,000</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Summary Bottom */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                 <div style={{ width: 300, display: "flex", flexDirection: "column", gap: 12, paddingRight: 16 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: T.t2 }}>Subtotal:</span>
                      <span style={{ fontSize: 13, color: T.t1, fontWeight: 500 }}>$134,000</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: T.t2 }}>Tax (10%):</span>
                      <span style={{ fontSize: 13, color: T.t1, fontWeight: 500 }}>$13,400</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${T.borderLight}` }}>
                      <span style={{ fontSize: 14, color: T.ink, fontWeight: 600 }}>Total:</span>
                      <span style={{ fontSize: 15, color: T.primary, fontWeight: 700 }}>$147,400</span>
                    </div>
                 </div>
              </div>
            </div>
            
          </div>
        </div>
      )}
    </>
  )
}