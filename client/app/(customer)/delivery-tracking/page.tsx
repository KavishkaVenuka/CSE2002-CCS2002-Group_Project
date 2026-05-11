"use client"

import { useState } from "react"
import { Package, MapPin, Truck, CheckCircle2, Clock, UploadCloud, Calendar } from "lucide-react"
import { T, font } from "@/lib/tokens"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

const ORDERS = [
  { id: "ORD-20240114", date: "Jan 14, 2024", amount: "$22,000", status: "In Transit", items: 5, tracking: "TRK-2024-5678", estDelivery: "January 17, 2024", address: "123 Business Street, Suite 400\nNew York, NY 10001" },
  { id: "ORD-20240115", date: "Jan 15, 2024", amount: "$15,000", status: "Delivered", items: 3, tracking: "TRK-2024-5679", estDelivery: "January 16, 2024", address: "456 Tech Park\nAustin, TX 78701" },
]

export default function DeliveryTrackingPage() {
  const [selectedOrderId, setSelectedOrderId] = useState("ORD-20240114");
  const selectedOrder = ORDERS.find(o => o.id === selectedOrderId) || ORDERS[0];

  return (
    <>
      <DashboardHeader title="Delivery Tracking" dateString="Thursday, 24 April 2026" />
      <main style={{
        flex: 1, overflow: "auto",
        padding: "24px 28px",
        display: "flex", flexDirection: "column", gap: 24,
      }}>

        {/* Select Order to Track */}
        <div style={{
          background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
          padding: "24px", boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            <Package size={20} color={T.ink} />
            <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>Select Order to Track</h2>
          </div>
          <div style={{ position: "relative" }}>
            <select
              value={selectedOrderId}
              onChange={(e) => setSelectedOrderId(e.target.value)}
              style={{
                width: "100%", padding: "12px 16px", borderRadius: 8,
                border: `1px solid ${T.border}`, background: T.surface,
                fontSize: 14, color: T.t1, fontFamily: font, outline: "none",
                fontWeight: 600, appearance: "none", cursor: "pointer",
                boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
              }}
            >
              {ORDERS.map(o => (
                <option key={o.id} value={o.id}>
                  {o.id} - {o.date} - {o.amount}
                </option>
              ))}
            </select>
            <div style={{ position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.t3 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
            </div>
          </div>
        </div>

        {/* DETAILS & SUMMARY GRID */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
          {/* Delivery Details */}
          <div style={{
            background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
            padding: "24px", boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <MapPin size={20} color={T.ink} />
              <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>Delivery Details</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 6 }}>Tracking Number</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{selectedOrder.tracking}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 6 }}>Estimated Delivery</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{selectedOrder.estDelivery}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 6 }}>Delivery Address</div>
                <div style={{ fontSize: 14, fontWeight: 500, color: T.t1, whiteSpace: "pre-wrap", lineHeight: 1.5 }}>
                  {selectedOrder.address}
                </div>
              </div>
            </div>
          </div>

          {/* Order Summary */}
          <div style={{
            background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
            padding: "24px", boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <Package size={20} color={T.ink} />
              <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>Order Summary</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 6 }}>Order ID</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{selectedOrder.id}</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 6 }}>Total Items</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{selectedOrder.items} items</div>
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 6 }}>Order Amount</div>
                <div style={{ fontSize: 14, fontWeight: 600, color: T.t1 }}>{selectedOrder.amount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* DELIVERY TIMELINE */}
        <div style={{
          background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
          padding: "24px", boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
        }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <Truck size={20} color={T.ink} />
              <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>Delivery Timeline</h2>
            </div>
            <div style={{ fontSize: 13, color: T.t2 }}>Track your order progress from quotation to delivery</div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", position: "relative" }}>
            {/* The vertical timeline line mapping */}
            <div style={{
              position: "absolute", left: 16, top: 20, bottom: 20,
              width: 2, background: T.borderLight, zIndex: 0
            }} />

            {/* Timeline Item 1 */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, position: "relative", zIndex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: T.greenBg, border: `2px solid ${T.card}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <CheckCircle2 size={16} color={T.green} />
              </div>
              <div style={{
                flex: 1, background: T.greenBg, border: `1px solid ${T.green}`, borderRadius: 8,
                padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.green, marginBottom: 6 }}>Quotation Accepted</div>
                  <div style={{ fontSize: 13, color: T.green }}>Quotation accepted and order created</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.green, fontWeight: 600 }}>
                  <Calendar size={12} /> 2024-01-14 10:00 AM
                </div>
              </div>
            </div>

            {/* Timeline Item 2 */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, position: "relative", zIndex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: T.greenBg, border: `2px solid ${T.card}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <CheckCircle2 size={16} color={T.green} />
              </div>
              <div style={{
                flex: 1, background: T.greenBg, border: `1px solid ${T.green}`, borderRadius: 8,
                padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.green, marginBottom: 6 }}>Order Created</div>
                  <div style={{ fontSize: 13, color: T.green }}>Order confirmed by supplier</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.green, fontWeight: 600 }}>
                  <Calendar size={12} /> 2024-01-14 10:15 AM
                </div>
              </div>
            </div>

            {/* Timeline Item 3 */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, position: "relative", zIndex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: T.greenBg, border: `2px solid ${T.card}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <CheckCircle2 size={16} color={T.green} />
              </div>
              <div style={{
                flex: 1, background: T.greenBg, border: `1px solid ${T.green}`, borderRadius: 8,
                padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.green, marginBottom: 6 }}>Dispatched</div>
                  <div style={{ fontSize: 13, color: T.green }}>Package dispatched from warehouse</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.green, fontWeight: 600 }}>
                  <Calendar size={12} /> 2024-01-15 09:00 AM
                </div>
              </div>
            </div>

            {/* Timeline Item 4 */}
            <div style={{ display: "flex", gap: 20, marginBottom: 20, position: "relative", zIndex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: T.blue, border: `2px solid ${T.card}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <Clock size={16} color="#fff" />
              </div>
              <div style={{
                flex: 1, background: T.blueBg, border: `1px solid ${T.blue}`, borderRadius: 8,
                padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.blue, marginBottom: 6 }}>In Transit</div>
                  <div style={{ fontSize: 13, color: T.blue }}>Package in transit - ETA 1 day</div>
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 11, color: T.blue, fontWeight: 600 }}>
                  <Calendar size={12} /> 2024-01-15 03:00 PM
                </div>
              </div>
            </div>

            {/* Timeline Item 5 - Pending/Future */}
            <div style={{ display: "flex", gap: 20, position: "relative", zIndex: 1 }}>
              <div style={{
                width: 32, height: 32, borderRadius: "50%", background: T.surface, border: `2px solid ${T.card}`,
                display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0
              }}>
                <div style={{ width: 10, height: 10, borderRadius: "50%", background: T.t3 }} />
              </div>
              <div style={{
                flex: 1, background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 8,
                padding: "16px 20px", display: "flex", justifyContent: "space-between", alignItems: "flex-start"
              }}>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: T.t2, marginBottom: 6 }}>Delivered</div>
                  <div style={{ fontSize: 13, color: T.t3 }}>Awaiting delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* UPLOAD DELIVERY PROOF */}
        <div style={{
          background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
          padding: "24px", boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
        }}>
          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
              <UploadCloud size={20} color={T.ink} />
              <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>Upload Delivery Proof (Optional)</h2>
            </div>
            <div style={{ fontSize: 13, color: T.t2 }}>If you received partial delivery or have concerns</div>
          </div>

          <div style={{
            border: `2px dashed ${T.borderLight}`, borderRadius: 12,
            padding: "48px 24px", display: "flex", flexDirection: "column",
            alignItems: "center", justifyContent: "center", gap: 14,
            background: T.surface, cursor: "pointer", transition: "all 0.2s"
          }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = T.blueBg;
              e.currentTarget.style.borderColor = T.blue;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = T.surface;
              e.currentTarget.style.borderColor = T.borderLight;
            }}
          >
            <div style={{ width: 56, height: 56, borderRadius: "50%", background: T.card, display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.04)" }}>
              <UploadCloud size={24} color={T.ink} />
            </div>
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 14, fontWeight: 600, color: T.t1, marginBottom: 6 }}>Click to upload or drag and drop</div>
              <div style={{ fontSize: 13, color: T.t3 }}>SVG, PNG, JPG or PDF (max. 10MB)</div>
            </div>
          </div>
        </div>

      </main>
    </>
  )
}