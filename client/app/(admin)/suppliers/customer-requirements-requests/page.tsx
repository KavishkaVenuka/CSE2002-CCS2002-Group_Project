"use client";

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { toast } from 'sonner';
import { AdminSidebar } from '@/components/admin/Sidebar';
import {
  FileText,
  Search,
  Eye,
  Loader2,
  RefreshCw,
  Package,
  Plus,
  XCircle,
  Send,
  ClipboardList,
  Check,
  ChevronsUpDown
} from 'lucide-react';

interface RequirementItem {
  itemName: string;
  quantity: number;
  unit: string;
  expectedDeliveryDate?: string;
  notes?: string;
}

interface Requirement {
  id: string;
  requirementId: string;
  customerName: string;
  companyName: string;
  items: RequirementItem[];
  itemSummary: string;
  status: string;
  createdAt: string;
  attachedDocument: string | null;
}

interface Supplier {
  _id?: string;
  id?: string;
  fullName: string;
  companyName?: string;
}

interface NewItem {
  itemName: string;
  quantity: string;
  unit: string;
  deliveryDate: string;
  notes: string;
}

interface StockItem {
  _id: string;
  item_name: string;
  unit_of_measure: string;
}

export default function SupplierRequests() {
  const [requirements, setRequirements] = useState<Requirement[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selected, setSelected] = useState<Requirement | null>(null);

  // New Requirement State
  const [selectedSupplierId, setSelectedSupplierId] = useState('');
  const [newItems, setNewItems] = useState<NewItem[]>([
    { itemName: '', quantity: '', unit: 'units', deliveryDate: '', notes: '' }
  ]);
  const [isCreating, setIsCreating] = useState(false);

  const getAuthHeader = () => {
    const token = localStorage.getItem('token');
    return token ? { Authorization: `Bearer ${token}` } : {};
  };

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const headers = getAuthHeader();
      const [reqRes, supRes, stockRes] = await Promise.all([
        axios.get('http://localhost:5900/api/suppliers/supplier-requirements/my', { headers }),
        axios.get('http://localhost:5900/api/suppliers/all', { headers }),
        axios.get('http://localhost:5900/api/stocks/getItems', { headers })
      ]);
      setRequirements(reqRes.data.requirements || []);
      setSuppliers(supRes.data.suppliers || []);
      
      const stockData = stockRes.data;
      const stockArray = Array.isArray(stockData) ? stockData :
                         Array.isArray(stockData.items) ? stockData.items :
                         Array.isArray(stockData.data) ? stockData.data : [];
      setStockItems(stockArray);
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }
      toast.error('Failed to load procurement data');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAddItem = () => {
    setNewItems([...newItems, { itemName: '', quantity: '', unit: 'units', deliveryDate: '', notes: '' }]);
  };

  const handleRemoveItem = (index: number) => {
    if (newItems.length > 1) {
      setNewItems(newItems.filter((_, i) => i !== index));
    }
  };

  const handleUpdateItem = (index: number, field: keyof NewItem, value: string) => {
    setNewItems(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleCreateRequirement = async () => {
    if (!selectedSupplierId) {
      toast.error("Please select a target supplier");
      return;
    }

    const validatedItems = newItems.filter(item => item.itemName.trim() !== '');
    if (validatedItems.length === 0) {
      toast.error("Please add at least one item with a name");
      return;
    }

    if (validatedItems.some(item => !item.quantity || isNaN(parseFloat(item.quantity)) || parseFloat(item.quantity) <= 0)) {
      toast.error("Please enter a valid quantity (> 0) for all items");
      return;
    }

    setIsCreating(true);
    try {
      const payload = {
        supplierId: selectedSupplierId,
        items: validatedItems.map(item => {
          const itemPayload: any = {
            itemName: item.itemName,
            quantity: parseFloat(item.quantity),
            unit: item.unit,
            notes: item.notes
          };
          if (item.deliveryDate) {
            itemPayload.deliveryDate = item.deliveryDate;
          }
          return itemPayload;
        })
      };

      const response = await axios.post('http://localhost:5900/api/suppliers/supplier-requirements', payload, { headers: getAuthHeader() });
      
      if (response.data.success) {
        toast.success("Procurement request broadcasted successfully");
        setShowAddModal(false);
        setSelectedSupplierId('');
        setNewItems([{ itemName: '', quantity: '', unit: 'units', deliveryDate: '', notes: '' }]);
        fetchData();
      } else {
        throw new Error(response.data.message || "Failed to send request");
      }
    } catch (err: any) {
      if (err.response?.status === 401) {
        toast.error('Session expired. Please log in again.');
        window.location.href = '/login';
        return;
      }
      const errorMsg = err.response?.data?.message || err.message || "Failed to send request";
      toast.error(`Error: ${errorMsg}`);
    } finally {
      setIsCreating(false);
    }
  };

  // Custom Neo-Brutalist StockPicker
  const StockPicker = ({ 
    value, 
    onSelect, 
    stockItems 
  }: { 
    value: string, 
    onSelect: (item: StockItem) => void,
    stockItems: StockItem[]
  }) => {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
          setOpen(false);
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const filteredStocks = stockItems.filter(s => s.item_name.toLowerCase().includes(search.toLowerCase()));

    return (
      <div className="relative" ref={wrapperRef}>
        <div 
          className="w-full border-2 border-black bg-white shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] p-3 cursor-pointer flex justify-between items-center nb-interactive"
          onClick={() => setOpen(!open)}
        >
          <div className="flex items-center gap-2 overflow-hidden">
            <Package className="w-5 h-5 shrink-0 text-black" />
            <span className="truncate font-mono font-bold text-sm">
              {value
                ? stockItems.find((s) => s.item_name === value)?.item_name || value
                : "Search stock registry..."}
            </span>
          </div>
          <ChevronsUpDown className="w-5 h-5 shrink-0 opacity-70" />
        </div>

        {open && (
          <div className="absolute top-full left-0 right-0 mt-2 bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] z-50 flex flex-col max-h-[300px]">
            <input 
              autoFocus
              className="p-4 border-b-4 border-black font-mono text-sm focus:outline-none bg-nb-yellow placeholder-black/50 font-bold" 
              placeholder="Type to search..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="overflow-y-auto flex-1">
              {filteredStocks.length === 0 ? (
                <div className="p-6 text-center font-mono text-sm text-gray-500 italic font-bold">
                  No matching stock items discovered.
                </div>
              ) : (
                filteredStocks.map(stock => (
                  <div 
                    key={stock._id}
                    className="p-4 hover:bg-nb-cyan border-b-2 border-black cursor-pointer flex justify-between items-center last:border-b-0 transition-colors"
                    onClick={() => { 
                      onSelect(stock); 
                      setOpen(false); 
                      setSearch(''); 
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <Check className={`w-4 h-4 ${value === stock.item_name ? 'opacity-100' : 'opacity-0'}`} />
                      <span className="font-bold text-sm">{stock.item_name}</span>
                    </div>
                    <span className="text-[10px] font-mono border-2 border-black px-2 py-0.5 uppercase font-bold bg-white">{stock.unit_of_measure}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    );
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'pending':
      case 'sent':        return 'bg-nb-yellow text-black';
      case 'quoted':      return 'bg-nb-cyan text-black';
      case 'accepted':    return 'bg-nb-green text-black';
      case 'rejected':    return 'bg-nb-red text-white';
      default:            return 'bg-gray-200 text-black';
    }
  };

  const filtered = requirements.filter(r => {
    const q = searchTerm.toLowerCase();
    return (
      (r.requirementId || '').toLowerCase().includes(q) ||
      (r.itemSummary || '').toLowerCase().includes(q) ||
      (r.customerName || '').toLowerCase().includes(q) ||
      (r.companyName || '').toLowerCase().includes(q)
    );
  });

  return (
    <div className="flex min-h-screen bg-nb-bg w-full">
      <AdminSidebar />
      <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-x-hidden">
        
        {/* Header Section */}
        <div className="bg-nb-cyan border-4 border-black p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-4 mb-4">
                <div className="w-14 h-14 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <Package className="w-8 h-8 text-black" />
                </div>
                <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tight text-black">Supplier Requests</h1>
              </div>
              <p className="font-mono text-sm font-bold max-w-xl border-l-4 border-black pl-4 text-black">Dispatch and monitor procurement requirements across the vendor network.</p>
            </div>
            
            <button 
              onClick={() => setShowAddModal(true)}
              className="bg-nb-yellow border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all px-8 py-4 font-black uppercase tracking-widest flex items-center justify-center gap-3 text-lg"
            >
              <Plus className="w-6 h-6" /> New Request
            </button>
          </div>
        </div>

        {/* Toolbar Section */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] p-4">
          <div className="relative w-full md:w-[400px]">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-black" />
            <input
              list="suppliers-list"
              placeholder="SEARCH PROCUREMENT LOGS..."
              className="pl-12 w-full border-2 border-black bg-nb-bg h-14 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] focus:translate-x-[2px] focus:translate-y-[2px] transition-all"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
            />
            <datalist id="suppliers-list">
              {suppliers.map(s => (
                <option key={s._id || s.id} value={s.fullName} />
              ))}
            </datalist>
          </div>
          <button 
            className="w-full md:w-auto border-4 border-black h-14 px-8 bg-white hover:bg-nb-yellow font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all flex items-center justify-center"
            onClick={fetchData}
          >
            <RefreshCw className={`w-5 h-5 mr-3 ${isLoading ? 'animate-spin' : ''}`} />
            Sync Registry
          </button>
        </div>

        {/* Table Section */}
        <div className="bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] overflow-hidden flex flex-col">
          <div className="bg-black text-white py-4 px-6 border-b-4 border-black">
            <h2 className="flex items-center gap-3 text-sm font-black uppercase tracking-widest">
              <ClipboardList className="w-5 h-5 text-nb-cyan" />
              Procurement Pipeline ({filtered.length})
            </h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="bg-nb-bg border-b-4 border-black">
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Ref ID</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Vendor</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black">Specifications</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center whitespace-nowrap">Lifecycle</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest border-r-4 border-black whitespace-nowrap">Dispatched</th>
                  <th className="p-5 font-black text-xs uppercase tracking-widest text-right whitespace-nowrap">Actions</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} className="h-64 text-center py-20 bg-white">
                      <Loader2 className="w-12 h-12 animate-spin mx-auto mb-6 text-black" />
                      <p className="text-black text-sm font-black uppercase tracking-widest">Loading Logistics...</p>
                    </td>
                  </tr>
                ) : filtered.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="h-40 text-center font-mono font-bold text-gray-500 bg-white p-8">
                      No active procurement requests discovered.
                    </td>
                  </tr>
                ) : (
                  filtered.map(req => (
                    <tr key={req.id} className="hover:bg-nb-cyan/20 transition-colors border-b-4 border-black last:border-b-0 bg-white">
                      <td className="p-5 font-mono text-xs font-bold border-r-4 border-black">
                        {req.requirementId}
                      </td>
                      <td className="p-5 border-r-4 border-black">
                        <div className="text-sm font-black uppercase tracking-wide">{req.customerName}</div>
                      </td>
                      <td className="p-5 font-mono text-xs font-bold max-w-[250px] truncate border-r-4 border-black">
                        {req.itemSummary}
                      </td>
                      <td className="p-5 text-center border-r-4 border-black">
                        <span className={`inline-block ${getStatusColor(req.status)} border-2 border-black font-mono text-[10px] font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                          {req.status}
                        </span>
                      </td>
                      <td className="p-5 font-mono text-xs font-bold border-r-4 border-black">
                        {new Date(req.createdAt).toLocaleDateString(undefined, { dateStyle: 'medium' })}
                      </td>
                      <td className="p-5 text-right">
                        <button
                          className="bg-white border-2 border-black h-10 px-4 inline-flex items-center justify-center font-black uppercase tracking-wider text-[10px] shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-cyan hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all"
                          onClick={() => { setSelected(req); setShowDetailModal(true); }}
                        >
                          <Eye className="w-4 h-4 mr-2" /> View Audit
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Add Request Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="bg-nb-yellow border-b-4 border-black p-8 flex justify-between items-center sticky top-0 z-20">
              <div>
                <h2 className="text-3xl font-black uppercase tracking-tight">Procurement Broadcast</h2>
                <p className="font-mono text-sm font-bold mt-2">Direct a requirement to a specific verified supplier.</p>
              </div>
              <button 
                onClick={() => setShowAddModal(false)}
                className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-nb-red hover:text-white transition-colors nb-interactive shrink-0"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-8 space-y-8 bg-white overflow-y-auto">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest block">Select Target Supplier *</label>
                <div className="relative">
                  <select 
                    value={selectedSupplierId} 
                    onChange={e => setSelectedSupplierId(e.target.value)}
                    className="w-full border-4 border-black h-14 px-4 bg-nb-bg font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:bg-white appearance-none cursor-pointer nb-interactive"
                  >
                    <option value="" disabled>Choose a supplier from the registry</option>
                    {suppliers.map(s => (
                      <option key={s._id || s.id} value={s._id || s.id || ''}>
                        {s.fullName} {s.companyName ? `(${s.companyName})` : ''}
                      </option>
                    ))}
                  </select>
                  <ChevronsUpDown className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none" />
                </div>
              </div>

              <div className="space-y-6 pt-6 border-t-4 border-black">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-black uppercase tracking-widest flex items-center gap-2">
                    <Package className="w-4 h-4" />
                    Requirement Items
                  </label>
                  <button 
                    onClick={handleAddItem} 
                    className="bg-nb-cyan border-2 border-black px-4 py-2 text-xs font-black uppercase tracking-wider shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[1px] hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none transition-all flex items-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Item
                  </button>
                </div>

                <div className="space-y-4">
                  {newItems.map((item, idx) => (
                    <div key={idx} className="bg-nb-bg border-4 border-black p-6 space-y-4 relative">
                      {newItems.length > 1 && (
                        <button 
                          onClick={() => handleRemoveItem(idx)}
                          className="absolute -top-4 -right-4 w-8 h-8 bg-nb-red text-white border-2 border-black flex items-center justify-center shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] hover:bg-black transition-colors z-10"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      )}
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-black uppercase tracking-widest">Item Name</label>
                          <StockPicker 
                            value={item.itemName}
                            stockItems={stockItems}
                            onSelect={(stock) => {
                              handleUpdateItem(idx, 'itemName', stock.item_name);
                              const unit = stock.unit_of_measure?.toLowerCase();
                              let mappedUnit = 'units';
                              if (unit?.includes('kg') || unit?.includes('kilogram')) mappedUnit = 'kg';
                              else if (unit?.includes('meter') || unit === 'm') mappedUnit = 'm';
                              else if (unit?.includes('piece') || unit?.includes('pcs')) mappedUnit = 'pcs';
                              
                              handleUpdateItem(idx, 'unit', mappedUnit);
                            }}
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest">Quantity</label>
                            <input 
                              type="number" 
                              placeholder="Qty" 
                              value={item.quantity}
                              onChange={(e) => handleUpdateItem(idx, 'quantity', e.target.value)}
                              className="w-full h-12 border-2 border-black px-4 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-white" 
                            />
                          </div>
                          <div className="space-y-2 relative">
                            <label className="text-[10px] font-black uppercase tracking-widest">Unit</label>
                            <select 
                              value={item.unit} 
                              onChange={(e) => handleUpdateItem(idx, 'unit', e.target.value)}
                              className="w-full h-12 border-2 border-black px-4 bg-white font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none appearance-none cursor-pointer"
                            >
                              <option value="units">Units</option>
                              <option value="kg">KG</option>
                              <option value="m">Meters</option>
                              <option value="pcs">Pieces</option>
                            </select>
                            <ChevronsUpDown className="absolute right-3 top-9 w-4 h-4 pointer-events-none" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest">Expected Delivery</label>
                        <input 
                          type="date" 
                          value={item.deliveryDate}
                          onChange={(e) => handleUpdateItem(idx, 'deliveryDate', e.target.value)}
                          className="w-full h-12 border-2 border-black px-4 font-mono font-bold text-sm shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] focus:outline-none focus:translate-x-[2px] focus:translate-y-[2px] focus:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all bg-white" 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-8 border-t-4 border-black bg-white flex justify-end gap-4 sticky bottom-0 z-20">
              <button 
                onClick={() => setShowAddModal(false)} 
                className="bg-white border-4 border-black h-14 px-8 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-nb-bg transition-colors nb-interactive"
              >
                Discard
              </button>
              <button 
                onClick={handleCreateRequirement}
                disabled={isCreating}
                className="bg-nb-green border-4 border-black h-14 px-10 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none transition-all disabled:opacity-50 flex items-center gap-3 text-lg"
              >
                {isCreating ? <Loader2 className="w-6 h-6 animate-spin" /> : <Send className="w-6 h-6" />}
                Broadcast
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {showDetailModal && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
          <div className="bg-white border-4 border-black shadow-[12px_12px_0px_0px_rgba(0,0,0,1)] w-full max-w-4xl my-8 relative flex flex-col max-h-[90vh]">
            <div className="bg-nb-cyan border-b-4 border-black p-8 flex justify-between items-center sticky top-0 z-20">
              <div className="flex items-center gap-6">
                <div className="w-16 h-16 bg-white border-4 border-black flex items-center justify-center shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                  <FileText className="w-8 h-8 text-black" />
                </div>
                <div>
                  <h2 className="text-3xl font-black uppercase tracking-tight">{selected.requirementId}</h2>
                  <p className="font-mono text-sm font-bold mt-2">Procurement Audit Log</p>
                </div>
              </div>
              <button 
                onClick={() => setShowDetailModal(false)}
                className="w-12 h-12 bg-white border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] flex items-center justify-center hover:bg-nb-red hover:text-white transition-colors nb-interactive shrink-0"
              >
                <XCircle className="w-6 h-6" />
              </button>
            </div>

            <div className="p-8 space-y-8 bg-white overflow-y-auto">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-0 border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-nb-bg">
                <div className="p-6 border-b-4 md:border-b-0 border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Target Vendor</p>
                  <p className="font-mono text-sm font-bold text-black">{selected.customerName}</p>
                </div>
                <div className="p-6 border-b-4 md:border-b-0 md:border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Entry Date</p>
                  <p className="font-mono text-sm font-bold text-black">{new Date(selected.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="p-6 border-b-4 md:border-b-0 border-r-4 border-black space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Line Items</p>
                  <p className="font-mono text-sm font-bold text-black">{selected.items?.length || 0} Products</p>
                </div>
                <div className="p-6 space-y-2">
                  <p className="text-[10px] font-black uppercase tracking-widest">Current State</p>
                  <span className={`inline-block ${getStatusColor(selected.status)} border-2 border-black font-mono text-[10px] font-bold px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] uppercase tracking-widest`}>
                    {selected.status}
                  </span>
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="font-black uppercase text-sm tracking-widest flex items-center gap-3 bg-black text-white p-4 border-4 border-black">
                  <Package className="w-5 h-5 text-nb-yellow" />
                  Product Manifest
                </h3>
                <div className="border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] bg-white overflow-hidden overflow-x-auto">
                  <table className="w-full text-left border-collapse min-w-[600px]">
                    <thead>
                      <tr className="bg-nb-bg border-b-4 border-black">
                        <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black">Item Name</th>
                        <th className="p-4 font-black text-xs uppercase tracking-widest border-r-4 border-black text-center">Quantity</th>
                        <th className="p-4 font-black text-xs uppercase tracking-widest">Requirement Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selected.items?.map((item, idx) => (
                        <tr key={idx} className="border-b-4 border-black last:border-b-0 hover:bg-nb-yellow/20 transition-colors">
                          <td className="p-4 border-r-4 border-black">
                            <span className="font-bold text-sm">{item.itemName}</span>
                            {item.notes && <p className="font-mono text-xs font-bold mt-2 bg-white border-2 border-black p-2 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">"{item.notes}"</p>}
                          </td>
                          <td className="p-4 text-center border-r-4 border-black">
                            <span className="inline-block bg-nb-cyan border-2 border-black font-mono font-bold text-sm px-3 py-1 shadow-[2px_2px_0px_0px_rgba(0,0,0,1)]">
                              {item.quantity} <span className="text-[10px] uppercase ml-1">{item.unit}</span>
                            </span>
                          </td>
                          <td className="p-4 font-mono text-xs font-bold">
                            {item.expectedDeliveryDate ? new Date(item.expectedDeliveryDate).toLocaleDateString() : 'Immediate Fulfillment'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="p-8 border-t-4 border-black bg-white flex justify-end sticky bottom-0 z-20">
              <button 
                className="bg-black text-white border-4 border-black h-14 px-12 font-black uppercase tracking-widest shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] hover:bg-gray-800 transition-colors hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none" 
                onClick={() => setShowDetailModal(false)}
              >
                Close Audit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}