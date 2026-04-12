import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  PhoneCall, 
  MessageCircle, 
  Mail,
  Trash2,
  RefreshCw,
  ShoppingCart
} from 'lucide-react';
import { IncompleteOrder } from '../../types';

export default function AdminIncompleteOrders() {
  const [orders, setOrders] = useState<IncompleteOrder[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<IncompleteOrder[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchIncompleteOrders();
  }, []);

  useEffect(() => {
    let result = orders;
    if (searchQuery) {
      result = result.filter(o => 
        o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        o.customerPhone.includes(searchQuery) ||
        o.customerEmail.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    setFilteredOrders(result);
  }, [orders, searchQuery]);

  const fetchIncompleteOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/incomplete-orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch incomplete orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConvertToOrder = async (id: string) => {
    if (!window.confirm('Are you sure you want to convert this to a real order?')) return;
    
    try {
      const res = await fetch(`/api/admin/incomplete-orders/${id}/convert`, { method: 'POST' });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== id));
        alert('Converted successfully!');
      }
    } catch (err) {
      console.error('Failed to convert', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;

    try {
      const res = await fetch(`/api/admin/incomplete-orders/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setOrders(orders.filter(o => o.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const handleCall = (phone: string) => {
    window.open(`tel:${phone}`, '_self');
  };

  const handleWhatsApp = (phone: string) => {
    const formattedPhone = phone.replace(/[^0-9]/g, '');
    window.open(`https://wa.me/${formattedPhone}`, '_blank');
  };

  const handleEmail = (email: string) => {
    window.open(`mailto:${email}`, '_blank');
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Incomplete Orders</h1>
          <p className="text-secondary text-sm">Track and recover abandoned checkouts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search by Name, Phone, Email..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-surface border border-border rounded-xl text-sm focus:ring-2 focus:ring-active/20 focus:border-active outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-surface border border-border rounded-xl text-secondary hover:text-active transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-hover border-b border-border">
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider w-12 text-center">
                  <input type="checkbox" className="rounded border-border text-active focus:ring-active/20" />
                </th>
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider">SL</th>
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider">Customer</th>
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider">Contact</th>
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider">Address</th>
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider">Product</th>
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider">Cart Value</th>
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider">Time</th>
                <th className="px-4 py-4 text-xs font-bold text-muted uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-secondary">Loading...</td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-4 py-8 text-center text-secondary">No incomplete orders found.</td>
                </tr>
              ) : (
                filteredOrders.map((order, index) => (
                  <tr key={order.id} className="hover:bg-row-hover transition-colors group">
                    <td className="px-4 py-4 text-center">
                      <input type="checkbox" className="rounded border-border text-active focus:ring-active/20" />
                    </td>
                    <td className="px-4 py-4 text-sm text-secondary font-medium">{index + 1}</td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-primary">{order.customerName}</div>
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-red-100 text-red-700 mt-1">
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-secondary">{order.customerPhone}</div>
                      <div className="text-xs text-muted">{order.customerEmail}</div>
                      <div className="flex items-center gap-2 mt-2">
                        <button onClick={() => handleCall(order.customerPhone)} className="p-1.5 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors" title="Call">
                          <PhoneCall size={14} />
                        </button>
                        <button onClick={() => handleWhatsApp(order.customerPhone)} className="p-1.5 bg-green-50 text-green-600 rounded-md hover:bg-green-100 transition-colors" title="WhatsApp">
                          <MessageCircle size={14} />
                        </button>
                        <button onClick={() => handleEmail(order.customerEmail)} className="p-1.5 bg-purple-50 text-purple-600 rounded-md hover:bg-purple-100 transition-colors" title="Email">
                          <Mail size={14} />
                        </button>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-secondary line-clamp-2 max-w-[150px]">{order.address}</div>
                      <div className="text-xs text-muted">{order.city}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img src={order.items[0]?.image} alt="Product" className="w-10 h-10 rounded-lg object-cover border border-border" />
                        <div>
                          <div className="text-sm font-medium text-primary line-clamp-1 max-w-[150px]">{order.items[0]?.name}</div>
                          {order.items.length > 1 && (
                            <div className="text-xs text-muted">+{order.items.length - 1} more items</div>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm font-bold text-primary">৳{order.cartValue.toLocaleString()}</div>
                    </td>
                    <td className="px-4 py-4">
                      <div className="text-sm text-secondary">{new Date(order.checkoutTime).toLocaleDateString()}</div>
                      <div className="text-xs text-muted">{new Date(order.checkoutTime).toLocaleTimeString()}</div>
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleConvertToOrder(order.id)}
                          className="p-2 text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="Convert to Order"
                        >
                          <ShoppingCart size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(order.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-secondary">Loading...</div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-8 text-secondary bg-surface rounded-2xl border border-border">No incomplete orders found.</div>
        ) : (
          filteredOrders.map((order) => (
            <motion.div 
              key={order.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 space-y-4 border-b border-border last:border-0"
            >
              <div className="flex justify-between items-start">
                <div>
                  <div className="font-bold text-primary">{order.customerName}</div>
                  <div className="text-sm text-secondary">{order.customerPhone}</div>
                  <div className="text-xs text-muted">{order.customerEmail}</div>
                </div>
                <span className="inline-flex items-center px-2 py-1 rounded text-[10px] font-bold bg-red-100 text-red-700">
                  {order.status}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <img src={order.items[0]?.image} alt="Product" className="w-12 h-12 rounded-lg object-cover" />
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-primary truncate">{order.items[0]?.name}</div>
                  <div className="text-xs text-muted">Cart Value: <span className="font-bold text-primary">৳{order.cartValue.toLocaleString()}</span></div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <button 
                  onClick={() => handleCall(order.customerPhone)}
                  className="flex items-center justify-center gap-2 py-2 bg-blue-50 text-blue-600 rounded-xl text-sm font-medium hover:bg-blue-100 transition-colors"
                >
                  <PhoneCall size={16} /> Call
                </button>
                <button 
                  onClick={() => handleWhatsApp(order.customerPhone)}
                  className="flex items-center justify-center gap-2 py-2 bg-green-50 text-green-600 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors"
                >
                  <MessageCircle size={16} /> WhatsApp
                </button>
              </div>

              <div className="flex items-center gap-2 pt-2 border-t border-border">
                <button 
                  onClick={() => handleConvertToOrder(order.id)}
                  className="flex-1 py-2 bg-emerald-50 text-emerald-600 rounded-xl text-sm font-medium hover:bg-emerald-100 transition-colors flex items-center justify-center gap-2"
                >
                  <ShoppingCart size={16} /> Convert
                </button>
                <button 
                  onClick={() => handleDelete(order.id)}
                  className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
