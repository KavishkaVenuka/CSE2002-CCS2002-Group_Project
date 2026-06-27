'use client';

import { useState, useEffect } from 'react';
import {
  Plus,
  Search,
  Edit,
  Trash2,
  AlertCircle,
  Package,
  TrendingUp,
  ArrowUpRight,
  FileDown,
  Upload,
  Loader2,
  X
} from 'lucide-react';

type StockItem = {
  _id?: string;
  id?: string;
  name: string;
  category: string;
  brand: string;
  description: string;
  unit: string;
  location: string;
  quantity: number;
  minQuantity: number;
  cost: number;
  sellingPrice: number;
  discontinued: boolean;
  status?: string;
};

const API_BASE = 'http://localhost:5900/api/stocks';

const initialNewItem: StockItem = {
  name: '',
  category: '',
  brand: '',
  description: '',
  unit: 'Pieces',
  location: '',
  quantity: 0,
  minQuantity: 0,
  cost: 0,
  sellingPrice: 0,
  discontinued: false
};

const parseNumber = (value: any): number => {
  if (typeof value === 'number') return value;
  if (typeof value === 'string') return Number(value) || 0;

  if (value && typeof value === 'object') {
    if ('$numberDecimal' in value) {
      return Number(value.$numberDecimal) || 0;
    }
  }

  return 0;
};

const mapFromBackend = (item: any) => ({
  _id: item._id,
  name: item.item_name,
  description: item.description,
  category: item.category,
  brand: item.brand,
  quantity: item.quantity,
  minQuantity: item.min_quantity,
  location: item.warehouse_location,
  unit: item.unit_of_measure,
  cost: item.buying_price,
  sellingPrice: item.selling_price,
  discontinued: item.discontinued || false
});

export default function StockManagement() {
  const [stockItems, setStockItems] = useState<StockItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editItemId, setEditItemId] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);

  const [newItem, setNewItem] = useState<StockItem>(initialNewItem);

  useEffect(() => {
    fetchStockItems();
  }, []);

  const fetchStockItems = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE}/getItems`);

      if (!response.ok) {
        throw new Error(`Failed to fetch items: ${response.status}`);
      }

      const data = await response.json();
      console.log('API response:', data);

      const itemsArray =
        Array.isArray(data) ? data :
        Array.isArray(data.items) ? data.items :
        Array.isArray(data.data) ? data.data :
        Array.isArray(data.stocks) ? data.stocks :
        [];

      const mappedItems = itemsArray.map(mapFromBackend);
      setStockItems(mappedItems);
    } catch (error) {
      console.error('Error fetching stock items:', error);
      setStockItems([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddItem = async () => {
    if (!newItem.name.trim()) {
      alert('Item name is required');
      return;
    }

    if (!newItem.category.trim()) {
      alert('Category is required');
      return;
    }

    setSubmitLoading(true);

    try {
      const url = isEditing && editItemId ? `${API_BASE}/updateItem/${editItemId}` : `${API_BASE}/addItem`;
      const method = isEditing ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            item_name: newItem.name,
            description: newItem.description,
            category: newItem.category,
            brand: newItem.brand,
            quantity: newItem.quantity,
            min_quantity: newItem.minQuantity,
            warehouse_location: newItem.location,
            unit_of_measure: newItem.unit,
            buying_price: newItem.cost,
            selling_price: newItem.sellingPrice
        })
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error('Backend error:', errorData);
        throw new Error(errorData.message || `Failed to ${isEditing ? 'update' : 'add'} item`);
      }

      await fetchStockItems();
      setIsDialogOpen(false);
      setNewItem(initialNewItem);
      setIsEditing(false);
      setEditItemId(null);
    } catch (error) {
      console.error(`Error ${isEditing ? 'updating' : 'adding'} item:`, error);
      alert(`Failed to ${isEditing ? 'update' : 'add'} item. Check backend route and request body.`);
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleEditClick = (item: StockItem) => {
    setNewItem({
      name: item.name || '',
      category: item.category || '',
      brand: item.brand || '',
      description: item.description || '',
      unit: item.unit || 'Pieces',
      location: item.location || '',
      quantity: item.quantity || 0,
      minQuantity: item.minQuantity || 0,
      cost: item.cost || 0,
      sellingPrice: item.sellingPrice || 0,
      discontinued: item.discontinued || false,
    });
    setEditItemId(item._id || item.id || null);
    setIsEditing(true);
    setIsDialogOpen(true);
  };

  const handleDeleteItem = async (id: string | undefined) => {
    if (!id) return;
    if (!confirm('Are you sure you want to delete this item?')) return;

    try {
      const response = await fetch(`${API_BASE}/deleteItem/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete item');
      }

      await fetchStockItems();
    } catch (error) {
      console.error('Error deleting item:', error);
      alert('Failed to delete item.');
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      window.open(`${API_BASE}/downloadTemplate`, '_blank');
    } catch (error) {
      console.error('Error downloading template:', error);
      alert('Failed to download template.');
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploadLoading(true);
    try {
      const response = await fetch(`${API_BASE}/uploadExcel`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to upload file');
      }

      alert(data.message || 'Successfully uploaded items');
      fetchStockItems();
    } catch (error: any) {
      console.error('Error uploading file:', error);
      alert(`Upload failed: ${error.message}`);
    } finally {
      setUploadLoading(false);
      event.target.value = '';
    }
  };

  const getItemStatus = (item: StockItem) => {
    if (item.status) return item.status;
    if (item.quantity <= 0) return 'critical';
    if (item.quantity <= 10) return 'low';
    return 'in-stock';
  };

  const filteredItems = stockItems.filter((item) => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch =
      (item.name || '').toLowerCase().includes(searchLower) ||
      (item.brand || '').toLowerCase().includes(searchLower) ||
      (item.category || '').toLowerCase().includes(searchLower);

    const matchesCategory =
      categoryFilter === 'all' || item.category === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const totalValue = stockItems.reduce(
    (sum, item) => sum + ((item.quantity || 0) * (item.cost || 0)),
    0
  );

  const lowStockCount = stockItems.filter((item) => {
    const status = getItemStatus(item);
    return status === 'low' || status === 'critical';
  }).length;

  const inputStyle = "w-full mt-2 border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-bold h-10 px-3";

  return (
    <>
      {loading ? (
        <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">

          {/* Page Header Skeleton */}
          <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-nb-white border-2 border-nb-black p-6 shadow-nb">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                <div className="h-4 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              </div>
              <div className="h-10 w-72 bg-[#d4ede9] border-2 border-nb-black shimmer mb-3"></div>
              <div className="h-4 w-96 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>

            <div className="flex flex-wrap gap-4 items-center">
              <div className="h-10 w-32 bg-nb-cyan border-2 border-nb-black shimmer"></div>
              <div className="h-10 w-40 bg-nb-green border-2 border-nb-black shimmer"></div>
              <div className="h-10 w-40 bg-nb-yellow border-2 border-nb-black shimmer"></div>
            </div>
          </div>

          {/* Stats Grid Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Cyan Card */}
            <div className="nb-card bg-nb-cyan p-6 border-2 border-nb-black">
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
              </div>
              <div>
                <div className="h-3 w-32 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
                <div className="h-10 w-48 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
                <div className="h-4 w-40 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
              </div>
            </div>

            {/* Red Card */}
            <div className="nb-card bg-nb-red p-6 border-2 border-nb-black">
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
              </div>
              <div>
                <div className="h-3 w-32 bg-white/30 border-2 border-nb-black shimmer mb-3"></div>
                <div className="h-10 w-20 bg-white/30 border-2 border-nb-black shimmer mb-2"></div>
                <div className="h-4 w-40 bg-white/30 border-2 border-nb-black shimmer"></div>
              </div>
            </div>

            {/* Green Card */}
            <div className="nb-card bg-nb-green p-6 border-2 border-nb-black">
              <div className="flex items-start justify-between mb-8">
                <div className="w-12 h-12 bg-nb-white border-2 border-nb-black shimmer"></div>
              </div>
              <div>
                <div className="h-3 w-32 bg-nb-black/20 border-2 border-nb-black shimmer mb-3"></div>
                <div className="h-10 w-32 bg-nb-black/20 border-2 border-nb-black shimmer mb-2"></div>
                <div className="h-4 w-48 bg-nb-black/20 border-2 border-nb-black shimmer"></div>
              </div>
            </div>
          </div>

          {/* Inventory Items Table Skeleton */}
          <div className="nb-card bg-nb-white border-2 border-nb-black">
            <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
              <div className="h-5 w-40 bg-[#d4ede9] border-2 border-nb-black shimmer mb-2"></div>
              <div className="h-3 w-64 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>

            {/* Search & Filter Skeleton */}
            <div className="p-6 border-b-2 border-nb-black flex flex-col md:flex-row gap-4 bg-white">
              <div className="flex-1 relative">
                <div className="h-12 w-full bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
              </div>
              <div className="w-full md:w-64 h-12 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
            </div>

            {/* Table Skeleton */}
            <div className="p-0 overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[1000px]">
                <thead>
                  <tr className="border-b-2 border-nb-black bg-nb-bg">
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Item Name</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Category</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Quantity</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Cost Price</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Selling Price</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Profit Margin</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Status</th>
                    <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {[1, 2, 3, 4, 5, 6].map((rowIndex) => (
                    <tr key={rowIndex} className="border-b-2 border-nb-black bg-white">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                          <div className="h-4 w-32 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="h-5 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-16 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-4 w-28 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </td>
                      <td className="p-4">
                        <div className="h-6 w-20 bg-[#d4ede9] border-2 border-nb-black shimmer"></div>
                      </td>
                      <td className="p-4 text-center">
                        <div className="h-6 w-24 bg-[#d4ede9] border-2 border-nb-black shimmer mx-auto"></div>
                      </td>
                      <td className="p-4">
                        <div className="flex gap-2 justify-center">
                          <div className="w-10 h-10 bg-nb-cyan border-2 border-nb-black shimmer"></div>
                          <div className="w-10 h-10 bg-nb-red border-2 border-nb-black shimmer"></div>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <style jsx>{`
            @keyframes shimmer {
              0% {
                background-position: -600px 0;
              }
              100% {
                background-position: 600px 0;
              }
            }

            .shimmer {
              background-image: linear-gradient(
                90deg,
                transparent,
                rgba(255, 255, 255, 0.3),
                transparent
              );
              background-size: 200px 100%;
              animation: shimmer 2s infinite;
              background-position: -600px 0;
            }
          `}</style>
        </div>
      ) : (
        <div className="flex-1 space-y-8 p-4 md:p-8 font-body max-w-7xl mx-auto overflow-y-auto">

          {/* Page Header */}
        <div className="flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 bg-nb-white border-2 border-nb-black p-6 shadow-nb">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Package className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              <span className="text-nb-black font-black uppercase tracking-widest text-sm">Inventory</span>
            </div>
            <h1 className="text-4xl font-display font-black text-nb-black tracking-tight uppercase">Stock Management</h1>
            <p className="text-nb-black font-bold mt-1 uppercase text-sm tracking-widest">Manage your inventory and track stock levels</p>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            <button
              onClick={handleDownloadTemplate}
              className="nb-interactive bg-nb-cyan border-2 border-nb-black px-4 py-2 text-nb-black font-bold flex items-center gap-2 shadow-nb-sm"
            >
              <FileDown className="w-5 h-5" strokeWidth={2.5} />
              TEMPLATE
            </button>
            
            <div className="relative">
              <input
                type="file"
                accept=".xlsx, .xls"
                className="hidden"
                id="excel-upload"
                onChange={handleFileUpload}
                disabled={uploadLoading}
              />
              <label
                htmlFor="excel-upload"
                className={`nb-interactive bg-nb-green border-2 border-nb-black px-4 py-2 text-nb-black font-bold flex items-center gap-2 shadow-nb-sm cursor-pointer ${uploadLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                style={{ height: 'auto' }}
              >
                {uploadLoading ? (
                  <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2.5} />
                ) : (
                  <Upload className="w-5 h-5" strokeWidth={2.5} />
                )}
                UPLOAD EXCEL
              </label>
            </div>

            <button 
              className="nb-interactive bg-nb-yellow border-2 border-nb-black px-6 py-2 text-nb-black font-bold flex items-center gap-2 shadow-nb-sm"
              onClick={() => {
                setNewItem(initialNewItem);
                setIsEditing(false);
                setEditItemId(null);
                setIsDialogOpen(true);
              }}
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
              ADD STOCK ITEM
            </button>
          </div>
        </div>

        {/* Modal conditionally rendered here */}
        {isDialogOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-nb-black/60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl border-4 border-nb-black bg-nb-bg shadow-nb flex flex-col max-h-[90vh]">
              <div className="bg-nb-yellow border-b-4 border-nb-black p-6 flex justify-between items-center shrink-0">
                <h2 className="text-2xl font-display font-black text-nb-black uppercase tracking-widest">
                  {isEditing ? 'Edit Stock Item' : 'Add New Stock Item'}
                </h2>
                <button
                  className="nb-interactive w-8 h-8 flex items-center justify-center bg-white border-2 border-nb-black shadow-[2px_2px_0px_0px_#000]"
                  onClick={() => setIsDialogOpen(false)}
                >
                  <X className="w-5 h-5 text-nb-black" strokeWidth={2.5} />
                </button>
              </div>

              <div className="space-y-6 p-6 overflow-y-auto flex-1">
                <div>
                  <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Item Name</label>
                  <input
                    placeholder="Enter item name"
                    className={inputStyle}
                    value={newItem.name}
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Category</label>
                    <select
                      value={newItem.category}
                      onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                      className={`${inputStyle} cursor-pointer appearance-none`}
                    >
                      <option value="" disabled>Select category</option>
                      <option value="Electronics">Electronics</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Textiles">Textiles</option>
                      <option value="Hardware">Hardware</option>
                      <option value="Clothing">Clothing</option>
                      <option value="Food">Food</option>
                      <option value="Beverages">Beverages</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Brand</label>
                    <input
                      placeholder="Enter brand"
                      className={inputStyle}
                      value={newItem.brand}
                      onChange={(e) => setNewItem({ ...newItem, brand: e.target.value })}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Description</label>
                  <textarea
                    placeholder="Enter item description"
                    className="w-full mt-2 border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-bold min-h-[100px] p-3"
                    value={newItem.description}
                    onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Unit of Measure</label>
                    <select
                      value={newItem.unit}
                      onChange={(e) => setNewItem({ ...newItem, unit: e.target.value })}
                      className={`${inputStyle} cursor-pointer appearance-none`}
                    >
                      <option value="" disabled>Select unit</option>
                      <option value="Units">Units</option>
                      <option value="Kilograms">Kilograms</option>
                      <option value="Meters">Meters</option>
                      <option value="Boxes">Boxes</option>
                      <option value="Pieces">Pieces</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Warehouse Location</label>
                    <input
                      placeholder="e.g. A-12-03"
                      className={inputStyle}
                      value={newItem.location}
                      onChange={(e) => setNewItem({ ...newItem, location: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      className={inputStyle}
                      value={newItem.quantity}
                      onChange={(e) =>
                        setNewItem({ ...newItem, quantity: Number(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div>
                    <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Min. Quantity</label>
                    <input
                      type="number"
                      placeholder="0"
                      className={inputStyle}
                      value={newItem.minQuantity}
                      onChange={(e) =>
                        setNewItem({ ...newItem, minQuantity: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Cost Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className={inputStyle}
                      value={newItem.cost}
                      onChange={(e) =>
                        setNewItem({ ...newItem, cost: Number(e.target.value) || 0 })
                      }
                    />
                  </div>

                  <div>
                    <label className="block font-black text-nb-black uppercase tracking-widest text-xs">Selling Price</label>
                    <input
                      type="number"
                      placeholder="0.00"
                      className={inputStyle}
                      value={newItem.sellingPrice}
                      onChange={(e) =>
                        setNewItem({ ...newItem, sellingPrice: Number(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="flex items-center space-x-3 bg-white border-2 border-nb-black p-4 shadow-nb-sm">
                  <input
                    type="checkbox"
                    id="discontinued"
                    className="w-6 h-6 border-2 border-nb-black accent-nb-red cursor-pointer"
                    checked={newItem.discontinued}
                    onChange={(e) =>
                      setNewItem({ ...newItem, discontinued: e.target.checked })
                    }
                  />
                  <label htmlFor="discontinued" className="font-black text-nb-black uppercase tracking-widest cursor-pointer">Mark as Discontinued</label>
                </div>
              </div>
              
              <div className="p-6 border-t-4 border-nb-black bg-white shrink-0">
                <button
                  className="nb-interactive w-full bg-nb-green border-2 border-nb-black py-4 text-nb-black font-black uppercase tracking-widest shadow-nb-sm text-lg"
                  onClick={handleAddItem}
                  disabled={submitLoading}
                >
                  {submitLoading ? 'SAVING...' : isEditing ? 'UPDATE ITEM' : 'SAVE ITEM'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="nb-card bg-nb-cyan p-6 relative flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-white border-2 border-nb-black shadow-nb-sm flex items-center justify-center">
                <Package className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black text-nb-black/80 uppercase tracking-widest mb-1">Total Stock Value</h3>
              <p className="text-4xl font-display font-black text-nb-black mb-1">LKR {totalValue.toLocaleString()}</p>
              <p className="text-sm font-bold text-nb-black/80">{stockItems.length} total items</p>
            </div>
          </div>

          <div className="nb-card bg-nb-red p-6 relative flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-white border-2 border-nb-black shadow-nb-sm flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black text-white/90 uppercase tracking-widest mb-1">Low Stock Items</h3>
              <p className="text-4xl font-display font-black text-white mb-1">{lowStockCount}</p>
              <p className="text-sm font-bold text-white/90">Requires attention</p>
            </div>
          </div>

          <div className="nb-card bg-nb-green p-6 relative flex flex-col justify-between">
            <div className="flex items-start justify-between mb-8">
              <div className="w-12 h-12 bg-white border-2 border-nb-black shadow-nb-sm flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-nb-black" strokeWidth={2.5} />
              </div>
            </div>
            <div>
              <h3 className="text-xs font-black text-nb-black/80 uppercase tracking-widest mb-1">Stock Turnover</h3>
              <p className="text-4xl font-display font-black text-nb-black mb-1">24 DAYS</p>
              <div className="flex items-center gap-1 mt-1">
                <ArrowUpRight className="w-4 h-4 text-nb-black" strokeWidth={2.5} />
                <span className="text-sm font-bold text-nb-black/80">-3 days from last month</span>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Items Table */}
        <div className="nb-card bg-nb-white">
          <div className="border-b-2 border-nb-black p-4 bg-nb-bg">
            <h2 className="text-lg font-display font-black uppercase tracking-widest text-nb-black">Inventory Items</h2>
            <p className="text-xs font-bold text-nb-black/80 uppercase tracking-widest mt-1">Manage and track all your products</p>
          </div>

          <div className="p-6 border-b-2 border-nb-black flex flex-col md:flex-row gap-4 bg-white">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-nb-black" strokeWidth={2.5} />
              <input
                placeholder="SEARCH ITEMS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-black uppercase tracking-widest h-12"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full md:w-64 border-2 border-nb-black rounded-none shadow-[2px_2px_0px_0px_#000] focus:outline-none bg-white text-nb-black font-black uppercase tracking-widest h-12 px-3 appearance-none cursor-pointer"
            >
              <option value="all">ALL CATEGORIES</option>
              <option value="Electronics">ELECTRONICS</option>
              <option value="Furniture">FURNITURE</option>
              <option value="Textiles">TEXTILES</option>
              <option value="Hardware">HARDWARE</option>
              <option value="Clothing">CLOTHING</option>
              <option value="Food">FOOD</option>
              <option value="Beverages">BEVERAGES</option>
              <option value="Other">OTHER</option>
            </select>
          </div>

          <div className="p-0 overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="border-b-2 border-nb-black bg-nb-bg">
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Item Name</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Category</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Quantity</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Cost Price</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Selling Price</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black">Profit Margin</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Status</th>
                  <th className="p-4 font-black text-[11px] uppercase tracking-widest text-nb-black text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.length > 0 ? (
                  filteredItems.map((item) => {
                    const cost = item.cost || 0;
                    const sellingPrice = item.sellingPrice || 0;
                    const profitMargin =
                      cost > 0 ? (((sellingPrice - cost) / cost) * 100).toFixed(1) : '0.0';
                    const sStatus = getItemStatus(item);

                    return (
                      <tr
                        key={item._id || item.id || item.name}
                        className="border-b-2 border-nb-black hover:bg-nb-yellow/10 transition-colors bg-white"
                      >
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-nb-bg border-2 border-nb-black flex items-center justify-center shadow-[2px_2px_0px_0px_#000]">
                              <Package className="w-5 h-5 text-nb-black" strokeWidth={2.5} />
                            </div>
                            <span className="text-nb-black font-black">{item.name}</span>
                          </div>
                        </td>

                        <td className="p-4">
                          <span className="nb-badge bg-nb-bg">{item.category}</span>
                        </td>

                        <td className="p-4 text-nb-black font-bold">
                          {item.quantity || 0} <span className="text-xs uppercase tracking-widest text-nb-black/70">{item.unit || 'units'}</span>
                        </td>

                        <td className="p-4 text-nb-black font-black">LKR {Number(cost).toFixed(2)}</td>
                        <td className="p-4 text-nb-black font-black">LKR {Number(sellingPrice).toFixed(2)}</td>

                        <td className="p-4">
                          <div className="flex items-center gap-1 text-nb-black font-bold bg-nb-green/20 px-2 py-1 w-max border-2 border-nb-black">
                            <TrendingUp className="w-4 h-4" strokeWidth={2.5} />
                            {profitMargin}%
                          </div>
                        </td>

                        <td className="p-4 text-center">
                          <span
                            className={`nb-badge ${
                              sStatus === 'in-stock'
                                ? 'bg-nb-green'
                                : sStatus === 'low'
                                ? 'bg-nb-yellow'
                                : 'bg-nb-red text-white'
                            }`}
                          >
                            {sStatus === 'in-stock' && 'In Stock'}
                            {sStatus === 'low' && 'Low Stock'}
                            {sStatus === 'critical' && 'Critical'}
                          </span>
                        </td>

                        <td className="p-4">
                          <div className="flex gap-2 justify-center">
                            <button
                              className="nb-interactive bg-nb-cyan border-2 border-nb-black p-2 shadow-[2px_2px_0px_0px_#000]"
                              onClick={() => handleEditClick(item)}
                              title="Edit Item"
                            >
                              <Edit className="w-4 h-4 text-nb-black" strokeWidth={2.5} />
                            </button>
                            <button
                              className="nb-interactive bg-nb-red border-2 border-nb-black p-2 shadow-[2px_2px_0px_0px_#000]"
                              onClick={() => handleDeleteItem(item._id || item.id)}
                              title="Delete Item"
                            >
                              <Trash2 className="w-4 h-4 text-white" strokeWidth={2.5} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-nb-black font-black uppercase tracking-widest bg-white">
                      NO ITEMS FOUND
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )}
    </>
  );
}