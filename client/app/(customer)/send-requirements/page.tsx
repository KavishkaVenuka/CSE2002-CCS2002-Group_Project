"use client"

import { useState } from "react"
import { Package, FileText, Plus, Trash2, UploadCloud, Edit3, ChevronDown } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"
import { GlobalStatCard } from "@/components/common/GlobalStatCard"
import { Panel } from "@/components/common/Panel"

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
      <DashboardHeader title="Send Requirements" />

      <main className="flex-1 overflow-auto p-6 flex flex-col gap-6 bg-nb-bg">

        {/* ── STATS ROW ─────────────────────────────────────────────────── */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Total Items — Green */}
          <GlobalStatCard
            iconSvgOrEmoji={<Package className="w-6 h-6 text-white" />}
            introTitle="Total Items"
            orderCount={items.length}
            monetaryValue="Items"
            footerText="In this requirement"
            themeClasses={{
              cardBackground: "bg-nb-green",
              iconContainerBackground: "bg-black",
              titleTextColor: "text-black",
              orderCountContainer: "bg-white",
              orderCountText: "text-black",
              monetaryContainer: "bg-[#166534]",
              monetaryText: "text-white font-mono",
              footerContainer: "bg-[#14532D]",
              footerText: "text-white",
            }}
          />

          {/* Attachments — Cyan */}
          <GlobalStatCard
            iconSvgOrEmoji={<FileText className="w-6 h-6 text-white" />}
            introTitle="Attachments"
            orderCount={items.reduce((acc, curr) => acc + curr.attachments, 0)}
            monetaryValue="Files"
            footerText="Supporting docs"
            themeClasses={{
              cardBackground: "bg-nb-cyan",
              iconContainerBackground: "bg-black",
              titleTextColor: "text-black",
              orderCountContainer: "bg-white",
              orderCountText: "text-black",
              monetaryContainer: "bg-[#0E7490]",
              monetaryText: "text-white font-mono",
              footerContainer: "bg-[#155E75]",
              footerText: "text-white",
            }}
          />

          {/* Status — Yellow */}
          <GlobalStatCard
            iconSvgOrEmoji={<Edit3 className="w-6 h-6 text-black" />}
            introTitle="Current Status"
            orderCount={0}
            monetaryValue="DRAFT"
            footerText="Unsubmitted"
            themeClasses={{
              cardBackground: "bg-nb-yellow",
              iconContainerBackground: "bg-black",
              titleTextColor: "text-black",
              orderCountContainer: "bg-white",
              orderCountText: "text-black",
              monetaryContainer: "bg-[#713F12]",
              monetaryText: "text-white font-mono font-black",
              footerContainer: "bg-[#a16207]",
              footerText: "text-white",
            }}
          />
        </section>

        <div className="nb-divider" />

        {/* ── REQUIREMENTS FORM ─────────────────────────────────────────── */}
        <section>
          <Panel title="Product Requirements" badge={items.length} noTopPad>
            {/* Header Action */}
            <div className="flex items-center justify-between p-5 border-b-[2px] border-black bg-white">
              <div className="flex items-center gap-2">
                <Package size={20} className="text-black" />
                <span className="font-display font-black text-black">Line Items</span>
              </div>
              <button
                onClick={handleAddItem}
                className="
                  flex items-center gap-2 px-4 py-2
                  bg-nb-yellow text-black font-body font-bold text-sm
                  border-[2px] border-black shadow-[4px_4px_0px_0px_#000]
                  nb-interactive
                "
              >
                <Plus size={16} strokeWidth={2.5} />
                Add Item
              </button>
            </div>

            <div className="p-6 flex flex-col gap-8">
              {items.map((item, index) => (
                <div key={item.id} className="
                  border-[2px] border-black
                  shadow-[4px_4px_0px_0px_#000]
                  bg-white p-6
                  relative
                ">
                  <div className="flex items-center justify-between mb-6">
                    <div className="flex items-center gap-3">
                      <span className="
                        w-8 h-8 flex items-center justify-center
                        bg-black text-white font-mono font-bold text-sm
                       ">
                        {index + 1}
                      </span>
                      <h3 className="font-display font-black text-lg text-black uppercase tracking-tight">
                        Item Specification
                      </h3>
                    </div>
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="
                        w-10 h-10 flex items-center justify-center
                        bg-nb-red text-white border-[2px] border-black
                        shadow-[2px_2px_0px_0px_#000]
                        nb-interactive
                      "
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Item Name */}
                    <div className="lg:col-span-2">
                      <label className="block font-display font-black text-xs uppercase text-black mb-2">
                        Item Name <span className="text-nb-red">*</span>
                      </label>
                      <div className="relative">
                        <select className="
                          w-100 w-full px-4 py-3
                          bg-white border-[2px] border-black
                          font-body text-sm text-black
                          appearance-none outline-none
                          focus:bg-nb-bg
                        ">
                          <option value="">Select item...</option>
                          <option value="Laptop">Laptop</option>
                          <option value="Monitor">Monitor</option>
                          <option value="Keyboard">Keyboard</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                      </div>
                    </div>

                    {/* Quantity */}
                    <div>
                      <label className="block font-display font-black text-xs uppercase text-black mb-2">
                        Quantity <span className="text-nb-red">*</span>
                      </label>
                      <input type="number" placeholder="0" className="
                        w-full px-4 py-3
                        bg-white border-[2px] border-black
                        font-mono text-sm text-black
                        outline-none focus:bg-nb-bg
                      " />
                    </div>

                    {/* Unit */}
                    <div>
                      <label className="block font-display font-black text-xs uppercase text-black mb-2">
                        Unit
                      </label>
                      <div className="relative">
                        <select className="
                          w-full px-4 py-3
                          bg-white border-[2px] border-black
                          font-body text-sm text-black
                          appearance-none outline-none
                          focus:bg-nb-bg
                        ">
                          <option value="Units">Units</option>
                          <option value="Kg">Kg</option>
                          <option value="Liters">Liters</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" size={16} />
                      </div>
                    </div>

                    {/* Delivery Date */}
                    <div>
                      <label className="block font-display font-black text-xs uppercase text-black mb-2">
                        Expected Delivery <span className="text-nb-red">*</span>
                      </label>
                      <input type="date" className="
                        w-full px-4 py-3
                        bg-white border-[2px] border-black
                        font-mono text-sm text-black
                        outline-none focus:bg-nb-bg
                      " />
                    </div>

                    {/* Notes */}
                    <div className="md:col-span-2 lg:col-span-3">
                      <label className="block font-display font-black text-xs uppercase text-black mb-2">
                        Technical Notes / Requirements
                      </label>
                      <textarea
                        placeholder="Additional specifications or notes..."
                        rows={3}
                        className="
                          w-full px-4 py-3
                          bg-white border-[2px] border-black
                          font-body text-sm text-black
                          outline-none focus:bg-nb-bg
                          resize-none
                        "
                      />
                    </div>
                  </div>

                  {/* Footer Action */}
                  <div className="mt-8 pt-6 border-t-[2px] border-black border-dashed flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="font-body text-xs text-gray-500">
                      Attach supporting documents for this item specifications
                    </p>
                    <button className="
                      flex items-center gap-2 px-4 py-2
                      bg-white text-black font-body font-bold text-xs
                      border-[2px] border-black shadow-[2px_2px_0px_0px_#000]
                      nb-interactive
                    ">
                      <UploadCloud size={16} />
                      Attach Document
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Form Actions */}
            <div className="p-6 border-t-[2px] border-black bg-nb-bg flex justify-end">
              <button className="
                  px-8 py-4
                  bg-black text-white
                  font-display font-black text-lg uppercase tracking-tight
                  border-[2px] border-black
                  shadow-[6px_6px_0px_0px_#4ADE80]
                  nb-interactive
                ">
                Submit Requirement
              </button>
            </div>
          </Panel>
        </section>
      </main>
    </>
  )
}