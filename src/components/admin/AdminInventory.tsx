import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  AlertTriangle, 
  XCircle, 
  DollarSign, 
  Search, 
  RefreshCw, 
  ArrowUpRight, 
  ArrowDownRight,
  Warehouse,
  ChevronRight,
  Edit3,
  Save,
  X
} from 'lucide-react';
import { InventoryItem, InventoryStats } from '../../types';

export default function AdminInventory() {
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [stats, setStats] = useState<InventoryStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
  const [newStock, setNewStock] = useState<number>(0);

  useEffect(() => {
    fetchInventory();
    fetchStats();
  }, []);

  const fetchInventory = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/inventory');
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error('Failed to fetch inventory', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/inventory/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const handleUpdateStock = async () => {
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/admin/inventory/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentStock: newStock }),
      });
      if (res.ok) {
        const { inventoryItem } = await res.json();
        setInventory(prev => prev.map(inv => inv.id === inventoryItem.id ? inventoryItem : inv));
        setEditingItem(null);
        fetchStats();
      }
    } catch (err) {
      console.error('Failed to update stock', err);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.productName.toLowerCase().includes(searchTerm.toLowerCase()) || 
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Inventory Dashboard</h2>
          <p className="text-xs text-muted mt-1">Real-time stock monitoring and control.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
            <input 
              type="text" 
              placeholder="Search Product, SKU..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-hover/30 border border-border rounded-2xl pl-12 pr-4 py-3 text-sm text-primary outline-none focus:border-active transition-all w-full md:w-64"
            />
          </div>
          <button 
            onClick={() => {
              fetchInventory();
              fetchStats();
            }}
            className="p-3 bg-hover/30 border border-border rounded-2xl text-muted hover:text-active transition-all"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Products', value: stats?.totalProducts || 0, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50 border-blue-100' },
          { label: 'Low Stock Items', value: stats?.lowStockProducts || 0, icon: AlertTriangle, color: 'text-yellow-600', bg: 'bg-yellow-50 border-yellow-100' },
          { label: 'Out of Stock', value: stats?.outOfStockProducts || 0, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50 border-rose-100' },
          { label: 'Total Stock Value', value: `৳ ${(stats?.totalStockValue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100' },
        ].map((stat) => (
          <div key={stat.label} className="p-6 bg-surface border border-border rounded-card space-y-4 shadow-sm">
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} border rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-xs text-muted font-medium uppercase tracking-widest">{stat.label}</div>
              <div className="text-2xl font-bold text-primary mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Inventory List */}
      <div className="bg-surface border border-border rounded-card overflow-hidden">
        <div className="p-8 border-b border-border flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Warehouse className="text-active" size={20} />
            <h3 className="text-lg font-bold text-primary">Stock Inventory</h3>
          </div>
          <div className="flex gap-2">
            <span className="px-3 py-1 bg-hover rounded-full text-[10px] font-bold text-muted uppercase tracking-widest border border-border">
              {filteredInventory.length} Items
            </span>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border">
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Current Stock</th>
                <th className="px-8 py-5">Reserved</th>
                <th className="px-8 py-5">Available</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={6} className="px-8 py-20 text-center text-muted">Loading inventory...</td>
                </tr>
              ) : filteredInventory.map((item) => (
                <tr key={item.id} className="hover:bg-hover transition-colors group">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-4">
                      <img src={item.productImage} alt={item.productName} className="w-10 h-10 rounded-xl object-cover" />
                      <div>
                        <div className="text-sm font-bold text-primary">{item.productName}</div>
                        <div className="text-[10px] text-muted font-mono">{item.sku}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm font-bold text-primary">{item.currentStock}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-amber-600 font-medium">{item.reservedStock}</div>
                    <div className="text-[10px] text-muted">Pending Orders</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-sm text-green-600 font-bold">{item.availableStock}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${
                      item.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                       item.status === 'Low Stock' ? 'bg-yellow-50 text-yellow-600 border-yellow-100' : 
                      'bg-rose-50 text-rose-600 border-rose-100'
                    }`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button 
                      onClick={() => {
                        setEditingItem(item);
                        setNewStock(item.currentStock);
                      }}
                      className="p-2 hover:bg-hover rounded-lg text-muted hover:text-active transition-all"
                    >
                      <Edit3 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Quick Stock Update Modal */}
      <AnimatePresence>
        {editingItem && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setEditingItem(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-md bg-surface border border-border rounded-[32px] p-8 space-y-6 shadow-2xl"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-primary">Update Stock</h3>
                <button onClick={() => setEditingItem(null)} className="p-2 hover:bg-hover rounded-full text-muted">
                  <X size={20} />
                </button>
              </div>
              <div className="flex items-center gap-4 p-4 bg-hover/10 rounded-2xl border border-border">
                <img src={editingItem.productImage} alt="" className="w-12 h-12 rounded-xl object-cover" />
                <div>
                  <div className="text-sm font-bold text-primary">{editingItem.productName}</div>
                  <div className="text-[10px] text-muted font-mono">{editingItem.sku}</div>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">New Stock Quantity</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setNewStock(Math.max(0, newStock - 1))}
                    className="w-12 h-12 bg-hover/30 border border-border rounded-xl flex items-center justify-center text-muted hover:text-active transition-all"
                  >
                    <ArrowDownRight size={20} />
                  </button>
                  <input 
                    type="number"
                    value={newStock}
                    onChange={(e) => setNewStock(Number(e.target.value))}
                    className="flex-1 bg-hover/30 border border-border rounded-xl py-3 text-center text-xl font-bold text-primary outline-none focus:border-active transition-all"
                  />
                  <button 
                    onClick={() => setNewStock(newStock + 1)}
                    className="w-12 h-12 bg-hover/30 border border-border rounded-xl flex items-center justify-center text-muted hover:text-active transition-all"
                  >
                    <ArrowUpRight size={20} />
                  </button>
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={() => setEditingItem(null)}
                  className="flex-1 py-4 bg-hover border border-border rounded-2xl text-sm font-bold text-muted hover:bg-border transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateStock}
                  className="flex-1 py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all shadow-lg shadow-active/20 flex items-center justify-center gap-2"
                >
                  <Save size={18} />
                  Update
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
