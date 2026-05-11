"use client"

import { useState } from "react"
import { Package, FileText, Plus, Trash2, UploadCloud, Edit3, ChevronDown } from "lucide-react"
import { DashboardHeader } from "@/components/customer/DashboardHeader"

interface RequirementItem {
  id: number
  name: string
  quantity: string
  unit: string
  deliveryDate: string
  notes: string
}

export default function SendRequirements() {
  const [items, setItems] = useState<RequirementItem[]>([
    { id: 1, name: "", quantity: "", unit: "Units", deliveryDate: "", notes: "" }
  ])

  const handleAddItem = () => {
    setItems([...items, {
      id: Date.now(), name: "", quantity: "",
      unit: "Units", deliveryDate: "", notes: ""
    }])
  }

  const handleRemoveItem = (id: number) => {
    if (items.length === 1) return
    setItems(items.filter(item => item.id !== id))
  }

  const handleChange = (id: number, field: keyof RequirementItem, value: string) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item))
  }

  return (
    <>
      <DashboardHeader title="Send Requirements" />

      <main className="flex-1 overflow-auto p-6 space-y-6 bg-nb-bg">

        {/* ── STAT CARDS ───────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {/* Total Items */}
          <div className="bg-nb-cyan border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4 nb-interactive">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
              <Package size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div>
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Total Items</p>
              <h3 className="font-display font-black text-3xl text-black leading-none">{items.length}</h3>
            </div>
          </div>

          {/* Attachments */}
          <div className="bg-nb-green border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4 nb-interactive">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
              <FileText size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div>
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Attachments</p>
              <h3 className="font-display font-black text-3xl text-black leading-none">0</h3>
            </div>
          </div>

          {/* Status */}
          <div className="bg-nb-yellow border-[3px] border-black shadow-[4px_4px_0px_0px_#000] p-5 flex items-center gap-4 nb-interactive">
            <div className="w-12 h-12 bg-white border-[2px] border-black shadow-[2px_2px_0px_0px_#000] flex items-center justify-center">
              <Edit3 size={22} strokeWidth={2.5} className="text-black" />
            </div>
            <div>
              <p className="font-body font-bold text-xs text-black uppercase tracking-wider">Status</p>
              <h3 className="font-display font-black text-3xl text-black leading-none">Draft</h3>
            </div>
          </div>
        </div>

        {/* ── REQUIREMENTS SECTION ─────────────────────────────────────── */}
        <section className="bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000] overflow-hidden">

          {/* Section header */}
          <div className="bg-black px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Package size={18} strokeWidth={2.5} className="text-white" />
              <h2 className="font-display font-black text-sm text-white uppercase tracking-[0.15em]">
                Product Requirements
              </h2>
            </div>
            <button
              onClick={handleAddItem}
              className="flex items-center gap-2 px-4 py-2 bg-nb-yellow text-black font-display font-black text-xs uppercase tracking-widest border-[2px] border-nb-yellow shadow-[2px_2px_0px_0px_#fff] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-100"
            >
              <Plus size={14} strokeWidth={3} />
              Add Item
            </button>
          </div>

          {/* Items list */}
          <div className="p-6 space-y-6">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="border-[2px] border-black shadow-[3px_3px_0px_0px_#000] overflow-hidden"
              >
                {/* Item header */}
                <div className="flex items-center justify-between px-5 py-3 bg-nb-bg border-b-[2px] border-black">
                  <span className="font-display font-black text-xs uppercase tracking-widest text-black">
                    Item {index + 1}
                  </span>
                  <button
                    onClick={() => handleRemoveItem(item.id)}
                    disabled={items.length === 1}
                    className="w-8 h-8 flex items-center justify-center bg-white border-[2px] border-black text-nb-red shadow-[2px_2px_0px_0px_#000] hover:bg-nb-red hover:text-white hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-100 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <Trash2 size={14} strokeWidth={2.5} />
                  </button>
                </div>

                {/* Item form */}
                <div className="p-5 space-y-4">
                  {/* Row 1: Name + Quantity */}
                  <div className="grid grid-cols-1 sm:grid-cols-[2fr_1fr] gap-4">
                    <div className="space-y-2">
                      <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                        Item Name <span className="text-nb-red">*</span>
                      </label>
                      <div className="relative">
                        <select
                          value={item.name}
                          onChange={e => handleChange(item.id, "name", e.target.value)}
                          className="w-full px-4 py-2.5 appearance-none bg-white border-[2px] border-black font-body text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-100"
                        >
                          <option value="">Select item...</option>
                          <option value="Laptop">Laptop</option>
                          <option value="Monitor">Monitor</option>
                          <option value="Keyboard">Keyboard</option>
                          <option value="Raw Silk">Raw Silk</option>
                          <option value="Cotton Thread">Cotton Thread</option>
                          <option value="Linen Fabric">Linen Fabric</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                        Quantity <span className="text-nb-red">*</span>
                      </label>
                      <input
                        type="number"
                        placeholder="0"
                        value={item.quantity}
                        onChange={e => handleChange(item.id, "quantity", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-100"
                      />
                    </div>
                  </div>

                  {/* Row 2: Unit + Delivery Date */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                        Unit
                      </label>
                      <div className="relative">
                        <select
                          value={item.unit}
                          onChange={e => handleChange(item.id, "unit", e.target.value)}
                          className="w-full px-4 py-2.5 appearance-none bg-nb-yellow border-[2px] border-black font-body font-bold text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-100"
                        >
                          <option value="Units">Units</option>
                          <option value="Kg">Kg</option>
                          <option value="Liters">Liters</option>
                          <option value="Meters">Meters</option>
                          <option value="Boxes">Boxes</option>
                        </select>
                        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-black pointer-events-none" size={16} strokeWidth={2.5} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                        Expected Delivery <span className="text-nb-red">*</span>
                      </label>
                      <input
                        type="date"
                        value={item.deliveryDate}
                        onChange={e => handleChange(item.id, "deliveryDate", e.target.value)}
                        className="w-full px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-100"
                      />
                    </div>
                  </div>

                  {/* Row 3: Notes */}
                  <div className="space-y-2">
                    <label className="block font-display font-black text-[10px] uppercase tracking-widest text-black">
                      Notes
                    </label>
                    <textarea
                      placeholder="Additional specifications or notes..."
                      rows={3}
                      value={item.notes}
                      onChange={e => handleChange(item.id, "notes", e.target.value)}
                      className="w-full px-4 py-2.5 bg-white border-[2px] border-black font-body text-sm text-black resize-vertical shadow-[2px_2px_0px_0px_#000] focus:outline-none focus:shadow-none focus:translate-x-[2px] focus:translate-y-[2px] transition-all duration-100 placeholder:text-gray-400"
                    />
                  </div>

                  {/* Attach Document */}
                  <div className="flex items-center justify-between pt-4 border-t-[2px] border-dashed border-black">
                    <p className="font-body text-xs font-bold text-gray-600 uppercase tracking-tight">
                      Supporting documents
                    </p>
                    <button className="flex items-center gap-2 px-4 py-2 bg-white border-[2px] border-black font-body font-bold text-xs uppercase text-black shadow-[2px_2px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-none transition-all duration-100">
                      <UploadCloud size={14} strokeWidth={2.5} />
                      Attach Document
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Submit footer */}
          <div className="flex justify-end items-center gap-4 px-6 py-5 border-t-[3px] border-black bg-nb-bg">
            <button className="px-5 py-2.5 bg-white text-black font-body font-bold text-sm border-[2px] border-black shadow-[3px_3px_0px_0px_#000] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[2px_2px_0px_0px_#000] transition-all duration-100">
              Save Draft
            </button>
            <button className="px-5 py-2.5 bg-black text-white font-display font-black text-sm uppercase tracking-widest border-[2px] border-black shadow-[4px_4px_0px_0px_#22c55e] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-none transition-all duration-100">
              Submit Requirement
            </button>
          </div>
        </section>
      </main>
    </>
  )
}