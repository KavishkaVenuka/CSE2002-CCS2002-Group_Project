import { FileText, Box, Info, X, Save, Send } from 'lucide-react';
import { Header } from "@/components/supplier/Header";

export default function CreateQuotationPage() {
  return (
    <>
      <Header title="Create Quotation" />
      <main className="flex-1 overflow-auto p-6 bg-nb-bg">
        <div className="max-w-6xl mx-auto space-y-6">
          
          {/* Requirement Information Card */}
          <div className="border-[3px] border-black shadow-[6px_6px_0px_0px_#000] bg-white p-6">
            <div className="flex items-center gap-3 border-b-[3px] border-black pb-4 mb-4">
              <FileText className="w-6 h-6" />
              <h2 className="font-display font-black text-xl text-black">Requirement Information</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 bg-nb-bg border-[3px] border-black p-4">
              <div>
                <p className="font-display font-bold text-sm text-gray-600 mb-1">Requirement ID</p>
                <p className="font-mono font-bold text-lg">REQ-20240115</p>
              </div>
              <div>
                <p className="font-display font-bold text-sm text-gray-600 mb-1">Customer</p>
                <p className="font-body font-bold text-lg">Acme Corp</p>
              </div>
              <div>
                <p className="font-display font-bold text-sm text-gray-600 mb-1">Expected Delivery</p>
                <p className="font-mono font-bold text-lg">2024-02-15</p>
              </div>
            </div>
          </div>

          {/* Quotation Items Card */}
          <div className="border-[3px] border-black shadow-[6px_6px_0px_0px_#000] bg-white p-6">
            <div className="flex items-center gap-3 border-b-[3px] border-black pb-4 mb-4">
              <Box className="w-6 h-6" />
              <h2 className="font-display font-black text-xl text-black">Quotation Items</h2>
            </div>

            <div className="overflow-x-auto border-[3px] border-black mb-6">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-black text-white font-display">
                    <th className="p-4 border-b-[3px] border-r-[3px] border-black font-black">Item</th>
                    <th className="p-4 border-b-[3px] border-r-[3px] border-black font-black">Quantity</th>
                    <th className="p-4 border-b-[3px] border-r-[3px] border-black font-black">Unit Price ($)</th>
                    <th className="p-4 border-b-[3px] border-black font-black">Total Price ($)</th>
                  </tr>
                </thead>
                <tbody className="font-body">
                  <tr className="border-b-[3px] border-black bg-white hover:bg-nb-bg transition-colors">
                    <td className="p-4 border-r-[3px] border-black font-bold">Product A - Electronics</td>
                    <td className="p-4 border-r-[3px] border-black">500 units</td>
                    <td className="p-4 border-r-[3px] border-black">
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full bg-nb-bg border-[3px] border-black p-2 font-mono font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-shadow"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold">$0.00</td>
                  </tr>
                  <tr className="border-b-[3px] border-black bg-white hover:bg-nb-bg transition-colors">
                    <td className="p-4 border-r-[3px] border-black font-bold">Product B - Furniture</td>
                    <td className="p-4 border-r-[3px] border-black">300 units</td>
                    <td className="p-4 border-r-[3px] border-black">
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full bg-nb-bg border-[3px] border-black p-2 font-mono font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-shadow"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold">$0.00</td>
                  </tr>
                  <tr className="bg-white hover:bg-nb-bg transition-colors">
                    <td className="p-4 border-r-[3px] border-black font-bold">Product C - Textiles</td>
                    <td className="p-4 border-r-[3px] border-black">200 units</td>
                    <td className="p-4 border-r-[3px] border-black">
                      <input 
                        type="number" 
                        placeholder="0.00" 
                        className="w-full bg-nb-bg border-[3px] border-black p-2 font-mono font-bold focus:outline-none focus:shadow-[2px_2px_0px_0px_#000] transition-shadow"
                      />
                    </td>
                    <td className="p-4 font-mono font-bold">$0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="flex justify-end">
              <div className="w-full md:w-1/3 bg-nb-green border-[3px] border-black p-4 shadow-[4px_4px_0px_0px_#000]">
                <div className="flex justify-between items-center mb-2 font-display font-bold">
                  <span>Subtotal:</span>
                  <span className="font-mono">$0.00</span>
                </div>
                <div className="flex justify-between items-center mb-4 font-display font-bold">
                  <span>Tax (10%):</span>
                  <span className="font-mono">$0.00</span>
                </div>
                <div className="flex justify-between items-center border-t-[3px] border-black pt-4 font-display font-black text-xl">
                  <span>Total:</span>
                  <span className="font-mono">$0.00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Additional Details Card */}
          <div className="border-[3px] border-black shadow-[6px_6px_0px_0px_#000] bg-white p-6">
            <div className="flex items-center gap-3 border-b-[3px] border-black pb-4 mb-4">
              <Info className="w-6 h-6" />
              <h2 className="font-display font-black text-xl text-black">Additional Details</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="flex flex-col gap-2">
                <label className="font-display font-bold text-sm text-black">Delivery Timeline *</label>
                <div className="relative">
                  <input 
                    type="date" 
                    className="w-full bg-white border-[3px] border-black p-3 font-body focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-shadow appearance-none"
                  />
                </div>
              </div>
              <div className="flex flex-col gap-2">
                <label className="font-display font-bold text-sm text-black">Payment Terms *</label>
                <select 
                  className="w-full bg-white border-[3px] border-black p-3 font-body focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-shadow appearance-none cursor-pointer"
                >
                  <option>Net 30 Days</option>
                  <option>Net 60 Days</option>
                  <option>Due on Receipt</option>
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-2 mb-2">
              <label className="font-display font-bold text-sm text-black">Notes / Terms & Conditions</label>
              <textarea 
                placeholder="Add any additional notes, terms, or conditions..." 
                rows={4}
                className="w-full bg-white border-[3px] border-black p-3 font-body focus:outline-none focus:shadow-[4px_4px_0px_0px_#000] transition-shadow resize-y"
              />
            </div>
          </div>

          {/* Action Buttons Container */}
          <div className="flex justify-end gap-4 p-6 bg-white border-[3px] border-black shadow-[6px_6px_0px_0px_#000]">
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-[3px] border-black font-display font-bold nb-interactive shadow-[4px_4px_0px_0px_#000]">
              <X className="w-5 h-5" />
              Reset
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-white border-[3px] border-black text-green-700 font-display font-bold nb-interactive shadow-[4px_4px_0px_0px_#000]">
              <Save className="w-5 h-5" />
              Save as Draft
            </button>
            <button className="flex items-center gap-2 px-6 py-3 bg-nb-green border-[3px] border-black text-black font-display font-black nb-interactive shadow-[4px_4px_0px_0px_#000]">
              <Send className="w-5 h-5" />
              Submit Quotation
            </button>
          </div>
        </div>
      </main>
    </>
  )
}
