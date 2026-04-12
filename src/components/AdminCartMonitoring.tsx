import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  ShoppingCart, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  User, 
  Calendar,
  Package,
  ArrowRight
} from 'lucide-react';
import { CartRecord } from '../types';

const AdminCartMonitoring: React.FC = () => {
  const [activeCarts, setActiveCarts] = useState<CartRecord[]>([]);
  const [abandonedCarts, setAbandonedCarts] = useState<CartRecord[]>([]);
  const [activeTab, setActiveTab] = useState<'active' | 'abandoned'>('active');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchCarts();
    const interval = setInterval(fetchCarts, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchCarts = async () => {
    try {
      const activeRes = await fetch('/api/admin/carts/active');
      const activeData = await activeRes.json();
      setActiveCarts(activeData);

      const abandonedRes = await fetch('/api/admin/carts/abandoned');
      const abandonedData = await abandonedRes.json();
      setAbandonedCarts(abandonedData);
    } catch (err) {
      console.error('Failed to fetch carts', err);
    }
  };

  const currentCarts = activeTab === 'active' ? activeCarts : abandonedCarts;
  const filteredCarts = currentCarts.filter(cart => 
    cart.userId.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Cart Monitoring</h1>
          <p className="text-secondary text-sm">Real-time tracking of active and abandoned customer carts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search by User ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-active/20 outline-none w-64"
            />
          </div>
        </div>
      </header>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <button 
          onClick={() => setActiveTab('active')}
          className={`p-6 rounded-2xl border transition-all text-left flex items-center justify-between ${
            activeTab === 'active' 
              ? 'bg-active/5 border-active shadow-lg shadow-active/10' 
              : 'bg-surface border-border hover:border-active/30'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              activeTab === 'active' ? 'bg-active text-white' : 'bg-hover text-secondary'
            }`}>
              <ShoppingCart size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">Active Carts</div>
              <div className="text-2xl font-bold text-primary">{activeCarts.length}</div>
            </div>
          </div>
          <ArrowRight size={20} className={activeTab === 'active' ? 'text-active' : 'text-muted'} />
        </button>
        <button 
          onClick={() => setActiveTab('abandoned')}
          className={`p-6 rounded-2xl border transition-all text-left flex items-center justify-between ${
            activeTab === 'abandoned' 
              ? 'bg-red-50 border-red-200 shadow-lg shadow-red-100' 
              : 'bg-surface border-border hover:border-red-200'
          }`}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
              activeTab === 'abandoned' ? 'bg-red-500 text-white' : 'bg-hover text-secondary'
            }`}>
              <AlertTriangle size={24} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">Abandoned Carts</div>
              <div className="text-2xl font-bold text-primary">{abandonedCarts.length}</div>
            </div>
          </div>
          <ArrowRight size={20} className={activeTab === 'abandoned' ? 'text-red-500' : 'text-muted'} />
        </button>
      </div>

      {/* Carts List */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-hover border-b border-border">
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">User ID</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Items Count</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Total Value</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Last Activity</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredCarts.length > 0 ? (
                filteredCarts.map((cart) => (
                  <tr key={cart.id} className="hover:bg-hover transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-hover rounded-lg flex items-center justify-center text-secondary">
                          <User size={14} />
                        </div>
                        <span className="text-sm font-bold text-primary">{cart.userId}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary">{cart.items.length} Items</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-primary">
                        ৳{cart.items.reduce((acc, item) => acc + (item.price * item.quantity), 0).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-xs text-secondary flex items-center gap-1">
                          <Clock size={12} />
                          {new Date(cart.lastActivity).toLocaleTimeString()}
                        </span>
                        <span className="text-[10px] text-secondary">
                          {new Date(cart.lastActivity).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button className="p-2 text-secondary hover:text-active hover:bg-active/5 rounded-lg transition-all">
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-secondary">
                    No {activeTab} carts found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AdminCartMonitoring;
