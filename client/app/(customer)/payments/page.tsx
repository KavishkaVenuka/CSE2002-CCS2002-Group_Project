"use client"

import { useState } from "react"
import { DollarSign, CreditCard, Clock, Upload, X as CloseIcon, Save, Send } from "lucide-react"
import { T, font } from "@/lib/tokens"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const PENDING_INVOICES = [
  { id: "INV-20240114", orderRef: "ORD-20240114", dueDate: "2024-02-13", amount: "$22,000", status: "pending" },
  { id: "INV-20240112", orderRef: "ORD-20240112", dueDate: "2024-02-11", amount: "$18,000", status: "pending" }
]

export default function PaymentsPage() {
  const [selectedInvoiceId, setSelectedInvoiceId] = useState("INV-20240114"); // Pre-filled for the view design
  const selectedInvoice = PENDING_INVOICES.find(i => i.id === selectedInvoiceId);

  return (
    <>
      <DashboardHeader title="Payments" dateString="Thursday, 24 April 2026" />
      <main style={{
        flex: 1, overflow: "auto",
        padding: "24px 28px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {/* Pending Invoices Panel */}
        <div style={{
          background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
          boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
        }}>
          <div style={{ 
            padding: "20px 24px", display: "flex", alignItems: "center", gap: 10,
            borderBottom: `1px solid ${T.borderLight}`
          }}>
            <DollarSign size={20} color={T.ink} />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>Pending Invoices</h2>
          </div>
          <div style={{ padding: "24px", display: "flex", flexDirection: "column", gap: 16, fontFamily: font }}>
            {PENDING_INVOICES.map((inv) => (
              <div key={inv.id} style={{
                background: "#FFFFE6",
                border: `1px solid #c9b136`,
                borderRadius: 8, padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "center",
                opacity: selectedInvoiceId && selectedInvoiceId !== inv.id ? 0.6 : 1, transition: "opacity 0.2s"
              }}>
                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                  <div style={{ fontSize: 14, fontWeight: 500, color: T.t1 }}>{inv.id}</div>
                  <div style={{ fontSize: 12, color: T.t2 }}>Order: {inv.orderRef}</div>
                  <div style={{ fontSize: 12, color: T.t2 }}>Due: {inv.dueDate}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <div style={{ fontSize: 18, fontWeight: 600, color: "#9F7A00" }}>{inv.amount}</div>
                  <span style={{ 
                    display: "inline-flex", alignItems: "center", gap: 4,
                    background: "#FFF4CC", color: "#B8860B", border: `1px solid #FFE066`,
                    padding: "3px 10px", borderRadius: 16, fontSize: 11, fontWeight: 600,
                  }}>
                     <Clock size={12} />
                     Pending
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Submit Payment Panel */}
        <div style={{
          background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
          boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
        }}>
          <div style={{ 
            padding: "20px 24px", display: "flex", alignItems: "center", gap: 10,
            borderBottom: `1px solid ${T.borderLight}`
          }}>
            <CreditCard size={20} color={T.ink} />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>Submit Payment</h2>
          </div>
          <div style={{ padding: "24px", fontFamily: font }}>
            <div style={{ marginBottom: selectedInvoice ? 24 : 0 }}>
              <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t1, marginBottom: 8 }}>
                Select Invoice <span style={{ color: T.red }}>*</span>
              </label>
              <select 
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
                style={{
                  width: "100%", padding: "12px 14px",
                  background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 6,
                  fontSize: 14, color: T.t1, outline: "none", cursor: "pointer", fontFamily: font
              }}>
                <option value="">Choose invoice to pay...</option>
                {PENDING_INVOICES.map(inv => (
                   <option key={inv.id} value={inv.id}>{inv.id} - {inv.amount}</option>
                ))}
              </select>
            </div>

            {selectedInvoice && (
              <div style={{ display: "flex", flexDirection: "column", gap: 24, animation: "fadeIn 0.3s ease-in-out" }}>
                
                {/* Summary Info Box */}
                <div style={{
                  background: "#F5F8FF", border: `1px solid #C2D5F2`, borderRadius: 8,
                  padding: "16px 24px", display: "flex", justifyContent: "space-between", alignItems: "center"
                }}>
                  <div>
                    <div style={{ fontSize: 12, color: T.t2, marginBottom: 4 }}>Invoice ID</div>
                    <div style={{ fontSize: 15, fontWeight: 500, color: T.t1 }}>{selectedInvoice.id}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: 12, color: T.t2, marginBottom: 4 }}>Amount to Pay</div>
                    <div style={{ fontSize: 18, fontWeight: 600, color: T.ink }}>{selectedInvoice.amount}</div>
                  </div>
                </div>

                {/* Form Fields */}
                <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t1, marginBottom: 8 }}>
                      Payment Method <span style={{ color: T.red }}>*</span>
                    </label>
                    <select style={{
                      width: "100%", padding: "12px 14px",
                      background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 6,
                      fontSize: 14, color: T.t1, outline: "none", cursor: "pointer", fontFamily: font
                    }}>
                      <option value="Bank Transfer">Bank Transfer</option>
                      <option value="Credit Card">Credit Card</option>
                      <option value="Check">Check</option>
                    </select>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t1, marginBottom: 8 }}>
                      Transaction ID <span style={{ color: T.red }}>*</span>
                    </label>
                    <input type="text" placeholder="Enter transaction reference number" style={{
                      width: "100%", padding: "12px 14px",
                      background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 6,
                      fontSize: 14, color: T.t1, outline: "none", fontFamily: font
                    }} />
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t1, marginBottom: 8 }}>
                      Notes (Optional)
                    </label>
                    <textarea placeholder="Add any additional notes..." rows={3} style={{
                      width: "100%", padding: "12px 14px",
                      background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 6,
                      fontSize: 14, color: T.t1, outline: "none", fontFamily: font, resize: "vertical"
                    }} />
                  </div>
                  
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t1, marginBottom: 8 }}>
                      Upload Payment Proof <span style={{ color: T.red }}>*</span>
                    </label>
                    <div style={{
                       border: `2px dashed ${T.borderLight}`, borderRadius: 12, padding: "32px",
                       display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
                       background: T.surface, gap: 12
                    }}>
                       <div style={{ width: 40, height: 40, borderRadius: "50%", background: T.card, border: `1px solid ${T.border}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <Upload size={18} color={T.inkHover} />
                       </div>
                       <div style={{ textAlign: "center" }}>
                         <div style={{ fontSize: 13, color: T.t2, marginBottom: 4 }}>Click to upload or drag and drop</div>
                         <div style={{ fontSize: 11, color: T.t3 }}>PDF, PNG, JPG (Max 5MB)</div>
                       </div>
                       <button style={{
                         background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 6,
                         padding: "6px 16px", fontSize: 12, fontWeight: 600, color: T.t1, cursor: "pointer",
                         marginTop: 8
                       }}>
                         Choose File
                       </button>
                    </div>
                  </div>
                </div>

                {/* Footer Actions */}
                <div style={{ 
                  display: "flex", justifyContent: "flex-end", gap: 12, 
                  paddingTop: 24, borderTop: `1px solid ${T.borderLight}`, marginTop: 8 
                }}>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "transparent", border: `1px solid ${T.borderLight}`, borderRadius: 6,
                    padding: "10px 16px", color: T.t1, fontSize: 13, fontWeight: 600, cursor: "pointer"
                  }} onClick={() => setSelectedInvoiceId("")}>
                    <CloseIcon size={16} /> Reset
                  </button>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: "transparent", border: `1px solid ${T.primary}`, borderRadius: 6,
                    padding: "10px 16px", color: T.primary, fontSize: 13, fontWeight: 600, cursor: "pointer"
                  }}>
                    <Save size={16} /> Save as Draft
                  </button>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: T.primary, border: "none", borderRadius: 6,
                    padding: "10px 16px", color: "#fff", fontSize: 13, fontWeight: 600, cursor: "pointer"
                  }}>
                    <Send size={16} /> Submit Payment
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  )
}