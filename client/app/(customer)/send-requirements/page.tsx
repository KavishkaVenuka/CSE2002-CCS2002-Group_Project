"use client"

import { useState } from "react"
import { Package, FileText, Plus, Trash2, UploadCloud, Edit3 } from "lucide-react"
import { T, font } from "@/lib/tokens"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

export default function SendRequirements() {
  const [items, setItems] = useState([
    { id: 1, name: "", quantity: "", unit: "Units", deliveryDate: "", notes: "", attachments: 0 }
  ])

  const handleAddItem = () => {
    setItems([...items, { id: Date.now(), name: "", quantity: "", unit: "Units", deliveryDate: "", notes: "", attachments: 0 }])
  }

  const handleRemoveItem = (id: number) => {
    setItems(items.filter(item => item.id !== id))
  }

  return (
    <>
      <DashboardHeader title="Send Requirements" dateString="Thursday, 24 April 2026" />
      <main style={{
        flex: 1, overflow: "auto",
        padding: "24px 28px",
        display: "flex", flexDirection: "column", gap: 20,
      }}>
        {/* ── STATS ROW ─────────────────────────────────────────────────── */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
          gap: 16,
        }}>
          {/* Total Items */}
          <div style={{
            background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
            padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: T.blueBg, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Package size={22} color={T.blue} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Total Items</div>
              <div style={{ fontSize: 22, color: T.t1, fontWeight: 700, marginTop: 2 }}>{items.length}</div>
            </div>
          </div>
          
          {/* Attachments */}
          <div style={{
            background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
            padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: T.greenBg, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <FileText size={22} color={T.green} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Attachments</div>
              <div style={{ fontSize: 22, color: T.t1, fontWeight: 700, marginTop: 2 }}>
                {items.reduce((acc, curr) => acc + curr.attachments, 0)}
              </div>
            </div>
          </div>
          
          {/* Status */}
          <div style={{
            background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
            padding: "16px 20px", display: "flex", alignItems: "center", gap: 14,
            boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
          }}>
            <div style={{
              width: 44, height: 44, borderRadius: 10,
              background: T.amberBg, display: "flex", alignItems: "center", justifyContent: "center"
            }}>
              <Edit3 size={22} color={T.amber} />
            </div>
            <div>
              <div style={{ fontSize: 13, color: T.t2, fontWeight: 500 }}>Status</div>
              <div style={{ fontSize: 22, color: T.t1, fontWeight: 700, marginTop: 2 }}>Draft</div>
            </div>
          </div>
        </div>

        {/* ── REQUIREMENTS SECTION ────────────────────────────────────────── */}
        <div style={{
          background: T.card, border: `1px solid ${T.borderLight}`, borderRadius: 12,
          padding: "24px", boxShadow: "0 2px 8px rgba(26,58,92,0.04)"
        }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <Package size={20} color={T.ink} />
              <h2 style={{ fontSize: 16, fontWeight: 600, color: T.t1, margin: 0 }}>Product Requirements</h2>
            </div>
            <button 
              onClick={handleAddItem}
              style={{
                display: "flex", alignItems: "center", gap: 6,
                background: T.primary, color: "#fff",
                border: "none", borderRadius: 8, padding: "8px 16px",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                fontFamily: font,
                transition: "background 0.2s"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = T.primaryHover}
              onMouseOut={(e) => e.currentTarget.style.background = T.primary}
            >
              <Plus size={16} strokeWidth={2.5} />
              Add Item
            </button>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
            {items.map((item, index) => (
              <div key={item.id} style={{
                border: `1px solid ${T.borderLight}`, borderRadius: 8,
                padding: "20px", background: T.surface
              }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: T.ink, margin: 0 }}>Item {index + 1}</h3>
                  <button 
                    onClick={() => handleRemoveItem(item.id)}
                    style={{
                      background: T.card, border: `1px solid ${T.border}`, color: T.red,
                      width: 32, height: 32, borderRadius: 6,
                      display: "flex", alignItems: "center", justifyContent: "center",
                      cursor: "pointer", transition: "all 0.2s"
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.background = T.redBg;
                      e.currentTarget.style.borderColor = T.redBg;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.background = T.card;
                      e.currentTarget.style.borderColor = T.border;
                    }}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 2fr) minmax(0, 1fr)", gap: 20, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 8 }}>
                      Item Name <span style={{color: T.red}}>*</span>
                    </label>
                    <div style={{ position: "relative" }}>
                      <select style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8,
                        border: `1px solid ${T.border}`, background: T.card,
                        fontSize: 13, color: T.t1, fontFamily: font, outline: "none",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                        appearance: "none"
                      }}>
                        <option value="">Select item...</option>
                        <option value="Laptop">Laptop</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Keyboard">Keyboard</option>
                      </select>
                      <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.t3 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 8 }}>
                      Quantity <span style={{color: T.red}}>*</span>
                    </label>
                    <input type="number" placeholder="0" style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: `1px solid ${T.border}`, background: T.card,
                      fontSize: 13, color: T.t1, fontFamily: font, outline: "none",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                    }} />
                  </div>
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)", gap: 20, marginBottom: 16 }}>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 8 }}>
                      Unit
                    </label>
                    <div style={{ position: "relative" }}>
                      <select style={{
                        width: "100%", padding: "10px 14px", borderRadius: 8,
                        border: `1px solid ${T.border}`, background: T.card,
                        fontSize: 13, color: T.t1, fontFamily: font, outline: "none",
                        boxShadow: "0 1px 2px rgba(0,0,0,0.02)",
                        appearance: "none"
                      }}>
                        <option value="Units">Units</option>
                        <option value="Kg">Kg</option>
                        <option value="Liters">Liters</option>
                      </select>
                      <div style={{ position: "absolute", right: 14, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", color: T.t3 }}>
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 8 }}>
                      Expected Delivery Date <span style={{color: T.red}}>*</span>
                    </label>
                    <input type="date" style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: `1px solid ${T.border}`, background: T.card,
                      fontSize: 13, color: T.t1, fontFamily: font, outline: "none",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                    }} />
                  </div>
                </div>

                <div style={{ marginBottom: 20 }}>
                   <label style={{ display: "block", fontSize: 13, fontWeight: 600, color: T.t2, marginBottom: 8 }}>
                      Notes
                    </label>
                    <textarea placeholder="Additional specifications or notes..." rows={3} style={{
                      width: "100%", padding: "10px 14px", borderRadius: 8,
                      border: `1px solid ${T.border}`, background: T.card,
                      fontSize: 13, color: T.t1, fontFamily: font, outline: "none",
                      resize: "vertical", boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                    }} />
                </div>
                
                {/* Embedded Document Uploader for Item */}
                <div style={{ 
                    display: "flex", alignItems: "center", justifyContent: "space-between", 
                    paddingTop: 16, borderTop: `1px dashed ${T.border}` 
                }}>
                  <div style={{ fontSize: 13, color: T.t2 }}>
                    Attach supporting documents for this item specifications
                  </div>
                  <button style={{
                    display: "flex", alignItems: "center", gap: 8,
                    background: T.card, color: T.ink,
                    border: `1px solid ${T.border}`, borderRadius: 8, padding: "8px 14px",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    fontFamily: font, transition: "all 0.2s",
                    boxShadow: "0 1px 2px rgba(0,0,0,0.02)"
                  }}
                  onMouseOver={(e) => {
                      e.currentTarget.style.background = T.surface;
                      e.currentTarget.style.borderColor = T.inkHover;
                      e.currentTarget.style.color = T.inkHover;
                  }}
                  onMouseOut={(e) => {
                      e.currentTarget.style.background = T.card;
                      e.currentTarget.style.borderColor = T.border;
                      e.currentTarget.style.color = T.ink;
                  }}
                  >
                    <UploadCloud size={16} />
                    Attach Document
                  </button>
                </div>
              </div>
            ))}
          </div>
          
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24, paddingTop: 24, borderTop: `1px solid ${T.borderLight}` }}>
             <button style={{
                background: T.primary, color: "#fff",
                border: "none", borderRadius: 8, padding: "12px 24px",
                fontSize: 14, fontWeight: 600, cursor: "pointer",
                fontFamily: font, transition: "background 0.2s",
                boxShadow: "0 2px 4px rgba(29, 158, 117, 0.2)"
              }}
              onMouseOver={(e) => e.currentTarget.style.background = T.primaryHover}
              onMouseOut={(e) => e.currentTarget.style.background = T.primary}
             >
                Submit Requirement
             </button>
          </div>
        </div>
      </main>
    </>
  )
}