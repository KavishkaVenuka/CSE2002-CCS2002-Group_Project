"use client"

import { useState } from "react"
import { CheckCircle2, DollarSign, FileWarning, Receipt, Eye, Download, FileText, Printer, X as CloseIcon } from "lucide-react"
import { T, font } from "@/lib/tokens"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const INVOICES = [
  { id: "INV-20240115", orderRef: "ORD-20240115", date: "2024-01-15", amount: "$15,000", status: "paid" },
  { id: "INV-20240114", orderRef: "ORD-20240114", date: "2024-01-14", amount: "$22,000", status: "unpaid" },
  { id: "INV-20240113", orderRef: "ORD-20240113", date: "2024-01-13", amount: "$8,500", status: "paid" },
  { id: "INV-20240112", orderRef: "ORD-20240112", date: "2024-01-12", amount: "$18,000", status: "overdue" },
]

export default function InvoicesPage() {
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null);

  return (
    <>
      <DashboardHeader title="Invoices" dateString="Thursday, 24 April 2026" />
      <main style={{
        flex: 1, overflow: "auto",
        padding: "24px 28px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>
        {/* STATS ROW */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}>
          {/* Card 1: Paid */}
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
              <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Paid</div>
              <div style={{ fontSize: 24, color: T.t1, fontWeight: 700, marginTop: 4, fontFamily: font }}>2</div>
            </div>
          </div>

          {/* Card 2: Unpaid */}
          <div style={{
            background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
            padding: "20px", display: "flex", flexDirection: "column", gap: 12,
            boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: T.amberBg, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <DollarSign size={18} color={T.amber} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Unpaid</div>
              <div style={{ fontSize: 24, color: T.t1, fontWeight: 700, marginTop: 4, fontFamily: font }}>1</div>
            </div>
          </div>

          {/* Card 3: Overdue */}
          <div style={{
            background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
            padding: "20px", display: "flex", flexDirection: "column", gap: 12,
            boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
          }}>
            <div style={{
              width: 38, height: 38, borderRadius: 10,
              background: T.redBg, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <FileWarning size={18} color={T.red} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Overdue</div>
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
              <Receipt size={20} color={T.ink} />
              <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>All Invoices</h2>
            </div>
          </div>

          {/* Table */}
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontFamily: font }}>
              <thead>
                <tr style={{ background: T.surface, borderBottom: `1px solid ${T.border}` }}>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Invoice ID</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Order Ref</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Date</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Amount</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Status</th>
                  <th style={{ padding: "16px 24px", fontSize: 12, fontWeight: 600, color: T.t2 }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {INVOICES.map((inv, idx) => {
                  let badgeBg, badgeColor, badgeBorder, badgeText;
                  if (inv.status === 'unpaid') { badgeBg = T.amberBg; badgeColor = T.amber; badgeBorder = T.amber; badgeText = "unpaid" }
                  else if (inv.status === 'paid') { badgeBg = T.greenBg; badgeColor = T.green; badgeBorder = T.green; badgeText = "paid" }
                  else { badgeBg = T.redBg; badgeColor = T.red; badgeBorder = T.redBg; badgeText = "overdue" }

                  return (
                    <tr key={inv.id} style={{ borderBottom: idx === INVOICES.length - 1 ? "none" : `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t1 }}>{inv.id}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{inv.orderRef}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t2 }}>{inv.date}</td>
                      <td style={{ padding: "16px 24px", fontSize: 13, color: T.t1 }}>{inv.amount}</td>
                      <td style={{ padding: "16px 24px" }}>
                        <span style={{
                          display: "inline-flex", alignItems: "center",
                          background: badgeBg, color: badgeColor, border: `1px solid ${badgeBorder}`,
                          padding: "3px 10px", borderRadius: 16, fontSize: 11, fontWeight: 600,
                          letterSpacing: "0.02em"
                        }}>
                          {badgeText}
                        </span>
                      </td>
                      <td style={{ padding: "16px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                          <button onClick={() => setSelectedInvoice(inv)} style={{
                            background: "transparent", border: `1px solid ${T.borderLight}`, borderRadius: 8,
                            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: T.t3, transition: "background 0.2s"
                          }} onMouseOver={(e) => e.currentTarget.style.background = T.surface} onMouseOut={(e) => e.currentTarget.style.background = "transparent"} title="View">
                            <Eye size={14} />
                          </button>
                          <button style={{
                            background: "transparent", border: `1px solid ${T.borderLight}`, borderRadius: 8,
                            width: 28, height: 28, display: "flex", alignItems: "center", justifyContent: "center",
                            cursor: "pointer", color: T.t3, transition: "background 0.2s"
                          }} onMouseOver={(e) => e.currentTarget.style.background = T.surface} onMouseOut={(e) => e.currentTarget.style.background = "transparent"} title="Download">
                            <Download size={14} />
                          </button>
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
      {selectedInvoice && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(26,58,92,0.6)", backdropFilter: "blur(4px)",
          display: "flex", alignItems: "center", justifyContent: "center",
          zIndex: 100, padding: 24
        }} onClick={() => setSelectedInvoice(null)}>
          <div style={{
            background: T.surface, borderRadius: 12, width: "100%", maxWidth: 800,
            boxShadow: "0 10px 40px rgba(26,58,92,0.15)", overflow: "hidden",
            display: "flex", flexDirection: "column", fontFamily: font, maxHeight: "90vh"
          }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", background: T.card, borderBottom: `1px solid ${T.borderLight}` }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <FileText size={18} color={T.inkHover} />
                <h2 style={{ fontSize: 16, fontWeight: 700, color: T.t1, margin: 0 }}>Invoice Preview</h2>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <button style={{
                  display: "flex", alignItems: "center", gap: 8,
                  background: "transparent", border: `1px solid ${T.border}`, borderRadius: 6,
                  padding: "6px 12px", cursor: "pointer", color: T.t2, fontSize: 13, fontWeight: 500
                }}>
                  <Printer size={14} /> Print
                </button>
                <button onClick={() => setSelectedInvoice(null)} style={{
                  background: "transparent", border: "none",
                  cursor: "pointer", color: T.t3
                }}>
                  <CloseIcon size={20} />
                </button>
              </div>
            </div>

            <div style={{ flex: 1, overflowY: "auto", padding: "32px", display: "flex", justifyContent: "center" }}>
              <div style={{
                background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
                padding: "40px", width: "100%", maxWidth: 700,
                boxShadow: "0 4px 12px rgba(26,58,92,0.03)"
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 40 }}>
                  <div>
                    <h1 style={{ fontSize: 28, fontWeight: 700, color: T.ink, letterSpacing: "0.05em", margin: "0 0 16px 0" }}>INVOICE</h1>
                    <div style={{ fontSize: 13, color: T.t2, display: "flex", flexDirection: "column", gap: 4 }}>
                      <div>Invoice #: <span style={{ color: T.t1 }}>{selectedInvoice.id}</span></div>
                      <div>Date: <span style={{ color: T.t1 }}>{selectedInvoice.date}</span></div>
                      <div>Order #: <span style={{ color: T.t1 }}>{selectedInvoice.orderRef}</span></div>
                    </div>
                  </div>
                  <div style={{ textAlign: "right", fontSize: 13, color: T.t2, display: "flex", flexDirection: "column", gap: 4 }}>
                    <div style={{ fontSize: 15, fontWeight: 600, color: T.t1, marginBottom: 4 }}>Supplier Company</div>
                    <div>456 Supplier Avenue</div>
                    <div>New York, NY 10002</div>
                    <div>Phone: +1 234 567 8901</div>
                  </div>
                </div>

                <div style={{
                  background: T.surface, border: `1px solid ${T.borderLight}`, borderRadius: 8,
                  padding: "20px", marginBottom: 32, width: "60%"
                }}>
                  <div style={{ fontSize: 11, fontWeight: 600, color: T.t3, textTransform: "uppercase", letterSpacing: "0.05em", marginBottom: 8 }}>BILL TO:</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.t1, marginBottom: 4 }}>Your Company Name</div>
                  <div style={{ fontSize: 13, color: T.t2, lineHeight: 1.5 }}>
                    123 Business Street, Suite 400<br />New York, NY 10001
                  </div>
                </div>

                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", marginBottom: 32 }}>
                  <thead>
                    <tr style={{ borderBottom: `2px solid ${T.border}` }}>
                      <th style={{ padding: "12px 16px 12px 0", fontSize: 11, fontWeight: 700, color: T.t2, textTransform: "uppercase", letterSpacing: "0.05em" }}>Item</th>
                      <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: T.t2, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "center" }}>Qty</th>
                      <th style={{ padding: "12px 16px", fontSize: 11, fontWeight: 700, color: T.t2, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Unit Price</th>
                      <th style={{ padding: "12px 0 12px 16px", fontSize: 11, fontWeight: 700, color: T.t2, textTransform: "uppercase", letterSpacing: "0.05em", textAlign: "right" }}>Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr style={{ borderBottom: `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "16px 16px 16px 0", fontSize: 13, color: T.t1 }}>Product A - Electronics</td>
                      <td style={{ padding: "16px", fontSize: 13, color: T.t2, textAlign: "center" }}>500</td>
                      <td style={{ padding: "16px", fontSize: 13, color: T.t2, textAlign: "right" }}>$250</td>
                      <td style={{ padding: "16px 0 16px 16px", fontSize: 13, color: T.t1, fontWeight: 500, textAlign: "right" }}>$125,000</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "16px 16px 16px 0", fontSize: 13, color: T.t1 }}>Product B - Furniture</td>
                      <td style={{ padding: "16px", fontSize: 13, color: T.t2, textAlign: "center" }}>300</td>
                      <td style={{ padding: "16px", fontSize: 13, color: T.t2, textAlign: "right" }}>$180</td>
                      <td style={{ padding: "16px 0 16px 16px", fontSize: 13, color: T.t1, fontWeight: 500, textAlign: "right" }}>$54,000</td>
                    </tr>
                    <tr style={{ borderBottom: `1px solid ${T.borderLight}` }}>
                      <td style={{ padding: "16px 16px 16px 0", fontSize: 13, color: T.t1 }}>Product C - Textiles</td>
                      <td style={{ padding: "16px", fontSize: 13, color: T.t2, textAlign: "center" }}>200</td>
                      <td style={{ padding: "16px", fontSize: 13, color: T.t2, textAlign: "right" }}>$45</td>
                      <td style={{ padding: "16px 0 16px 16px", fontSize: 13, color: T.t1, fontWeight: 500, textAlign: "right" }}>$9,000</td>
                    </tr>
                  </tbody>
                </table>

                <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 32 }}>
                  <div style={{ width: 260, display: "flex", flexDirection: "column", gap: 12 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: T.t2 }}>Subtotal:</span>
                      <span style={{ fontSize: 13, color: T.t1, fontWeight: 500 }}>$134,000</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <span style={{ fontSize: 13, color: T.t2 }}>Tax (10%):</span>
                      <span style={{ fontSize: 13, color: T.t1, fontWeight: 500 }}>$13,400</span>
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingTop: 14, borderTop: `1px solid ${T.borderLight}` }}>
                      <span style={{ fontSize: 14, color: T.t2, fontWeight: 700, textTransform: "uppercase" }}>TOTAL:</span>
                      <span style={{ fontSize: 16, color: T.ink, fontWeight: 700 }}>$147,400</span>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "center", paddingTop: 32, borderTop: `1px dashed ${T.borderLight}` }}>
                  <div style={{ fontSize: 13, color: T.t2, marginBottom: 4 }}>Thank you for your business!</div>
                  <div style={{ fontSize: 13, color: T.t3 }}>Payment due within 30 days.</div>
                </div>

              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}