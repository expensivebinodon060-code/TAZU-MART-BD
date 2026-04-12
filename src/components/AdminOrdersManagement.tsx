import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  CheckCircle, 
  XCircle, 
  Truck, 
  Clock, 
  Package,
  ChevronRight,
  User,
  MapPin,
  CreditCard,
  Calendar
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

const AdminOrdersManagement: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [incompleteOrders, setIncompleteOrders] = useState<any[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatus | 'All' | 'Incomplete'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const tabs: (OrderStatus | 'All' | 'Incomplete')[] = [
    'All',
    'Pending',
    'Processing',
    'Delivered',
    'Cancelled',
    'Incomplete'
  ];

  useEffect(() => {
    fetchOrders();
    fetchIncompleteOrders();
  }, []);

  useEffect(() => {
    let result: any[] = [];
    if (activeTab === 'Incomplete') {
      result = incompleteOrders;
    } else {
      result = orders;
      if (activeTab !== 'All') {
        result = result.filter(o => o.status === activeTab);
      }
    }

    if (searchQuery) {
      result = result.filter(o => 
        (o.id && o.id.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.customerName && o.customerName.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (o.customerPhone && o.customerPhone.includes(searchQuery))
      );
    }
    setFilteredOrders(result);
  }, [orders, incompleteOrders, activeTab, searchQuery]);

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  const fetchIncompleteOrders = async () => {
    try {
      const res = await fetch('/api/incomplete-orders');
      const data = await res.json();
      setIncompleteOrders(data);
    } catch (err) {
      console.error('Failed to fetch incomplete orders', err);
    }
  };

  const updateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdating(true);
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: newStatus } : o));
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'Processing': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Delivered': return 'bg-green-100 text-green-700 border-green-200';
      case 'Cancelled': return 'bg-red-100 text-red-700 border-red-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-6 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Orders Management</h1>
          <p className="text-secondary text-sm">Manage and track all customer orders.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text" 
              placeholder="Search by ID, Name, Phone..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 bg-white border border-accent rounded-[6px] text-sm outline-none w-64 transition-all"
            />
          </div>
          <button className="p-2 bg-white border border-accent rounded-[6px] text-muted hover:text-active transition-all">
            <Filter size={20} />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 rounded-[6px] text-sm font-bold whitespace-nowrap transition-all border ${
              activeTab === tab 
                ? 'bg-accent border-accent text-white shadow-sm' 
                : 'bg-white text-muted border-accent hover:bg-hover'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-accent rounded-[6px] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-hover border-b border-border">
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">{activeTab === 'Incomplete' ? 'Incomplete ID' : 'Order ID'}</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Customer</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Amount</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Date</th>
                <th className="px-6 py-4 text-[11px] font-bold text-secondary uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredOrders.map((order, idx) => (
                <tr key={order.id || idx} className="hover:bg-hover transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-primary group-hover:text-active transition-colors">{order.id || 'INC-'+idx}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-sm font-bold text-primary">{order.customerName || order.fullName}</span>
                      <span className="text-[10px] text-secondary">{order.customerPhone || order.mobileNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-primary">৳{(order.amount || order.total || 0).toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${activeTab === 'Incomplete' ? 'bg-gray-100 text-gray-500 border-gray-200' : getStatusColor(order.status)}`}>
                      {activeTab === 'Incomplete' ? 'Incomplete' : order.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <span className="text-xs text-primary font-medium">{new Date(order.date).toLocaleDateString()}</span>
                      <span className="text-[10px] text-muted">{new Date(order.date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="p-2 text-secondary hover:text-active hover:bg-active/5 rounded-lg transition-all"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2 text-secondary hover:text-primary hover:bg-hover rounded-lg transition-all">
                        <MoreVertical size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="min-h-screen w-full flex flex-col"
            >
              <div className="p-6 border-b border-border flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-active/10 text-active rounded-[6px] flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-primary uppercase tracking-tight">Order {selectedOrder.id}</h2>
                    <p className="text-[10px] text-secondary flex items-center gap-2 uppercase tracking-widest">
                      <Calendar size={10} />
                      Placed on {new Date(selectedOrder.date).toLocaleString()}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedOrder(null)}
                  className="p-2 hover:bg-hover rounded-[6px] transition-colors"
                >
                  <XCircle size={24} className="text-secondary" />
                </button>
              </div>

              <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left: Order Items & Summary */}
                  <div className="lg:col-span-2 space-y-8">
                    <section className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-border pb-2">Order Items</h3>
                      <div className="space-y-3">
                        {selectedOrder.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-4 p-4 bg-white rounded-[6px] border border-border">
                            <img src={item.image} className="w-16 h-16 rounded-[6px] object-cover border border-border" />
                            <div className="flex-1">
                              <div className="text-sm font-bold text-primary">{item.name}</div>
                              <div className="text-[10px] text-secondary mt-1">Qty: {item.quantity} | {item.variant || 'Standard'}</div>
                            </div>
                            <div className="text-sm font-bold text-primary">৳{(Number(item.price) * item.quantity).toLocaleString()}</div>
                          </div>
                        ))}
                      </div>
                    </section>

                    <section className="bg-hover rounded-[6px] p-8 border border-border space-y-4">
                      <div className="flex justify-between text-xs text-secondary">
                        <span>Subtotal</span>
                        <span className="font-bold text-primary">৳{( (selectedOrder.amount || selectedOrder.total || 0) - (selectedOrder.deliveryCharge || 60) ).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-xs text-secondary">
                        <span>Delivery Charge</span>
                        <span className="font-bold text-primary">৳{(selectedOrder.deliveryCharge || 60).toLocaleString()}</span>
                      </div>
                      <div className="h-px bg-border my-2" />
                      <div className="flex justify-between text-xl font-black text-active">
                        <span>Grand Total</span>
                        <span>৳{(selectedOrder.amount || selectedOrder.total || 0).toLocaleString()}</span>
                      </div>
                    </section>
                  </div>

                  {/* Right: Customer & Status */}
                  <div className="space-y-8">
                    <section className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-border pb-2">Customer Info</h3>
                      <div className="space-y-6">
                        <div className="flex items-start gap-3">
                          <User size={18} className="text-active mt-0.5" />
                          <div>
                            <div className="text-sm font-bold text-primary">{selectedOrder.customerName || selectedOrder.fullName}</div>
                            <div className="text-xs text-secondary mt-1">{selectedOrder.customerPhone || selectedOrder.mobileNumber}</div>
                            <div className="text-xs text-secondary">{selectedOrder.customerEmail || selectedOrder.email}</div>
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <MapPin size={18} className="text-active mt-0.5" />
                          <div className="space-y-2">
                            <div className="text-xs font-bold text-primary uppercase tracking-widest flex items-center gap-2">
                              {selectedOrder.deliveryMethod === 'pickup' ? 'Pickup Point' : 'Shipping Address'}
                              {selectedOrder.deliveryMethod === 'pickup' && <span className="px-2 py-0.5 bg-active/10 text-active rounded text-[8px]">PICKUP</span>}
                            </div>
                            <div className="text-xs text-secondary leading-relaxed">
                              {selectedOrder.shippingAddress || selectedOrder.address}
                            </div>
                            {selectedOrder.deliveryMethod === 'pickup' && (
                              <div className="p-3 bg-hover rounded-xl space-y-1 border border-border">
                                <p className="text-[10px] font-bold text-primary">District: {selectedOrder.pickupDistrict}</p>
                                <p className="text-[10px] font-bold text-primary">Thana: {selectedOrder.pickupThana}</p>
                                {selectedOrder.pickupDate && <p className="text-[10px] font-bold text-active">Pickup Date: {selectedOrder.pickupDate}</p>}
                                {selectedOrder.altPhone && <p className="text-[10px] font-bold text-secondary">Alt Phone: {selectedOrder.altPhone}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="flex items-start gap-3">
                          <CreditCard size={18} className="text-active mt-0.5" />
                          <div>
                            <div className="text-xs font-bold text-primary uppercase tracking-widest">{selectedOrder.paymentMethod}</div>
                            <div className={`text-[10px] font-bold uppercase mt-1 ${selectedOrder.paymentStatus === 'Paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                              {selectedOrder.paymentStatus}
                            </div>
                            {selectedOrder.transactionId && (
                              <div className="text-[10px] font-mono text-active mt-1 break-all">
                                TXID: {selectedOrder.transactionId}
                              </div>
                            )}
                          </div>
                        </div>
                        {selectedOrder.customerNote && (
                          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl space-y-2">
                            <div className="text-[10px] font-bold text-yellow-800 uppercase tracking-widest">Customer Note</div>
                            <p className="text-xs text-yellow-900 italic leading-relaxed">"{selectedOrder.customerNote}"</p>
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="space-y-4">
                      <h3 className="text-[10px] font-bold uppercase tracking-widest text-secondary border-b border-border pb-2">Update Status</h3>
                      {activeTab === 'Incomplete' ? (
                        <div className="p-4 bg-gray-50 border border-gray-100 rounded-xl text-center">
                          <p className="text-xs text-secondary font-bold uppercase tracking-widest">Incomplete Order</p>
                          <p className="text-[10px] text-muted mt-1 italic">This order was abandoned during checkout.</p>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 gap-2">
                          {tabs.filter(t => t !== 'All' && t !== 'Incomplete').map(status => (
                            <button
                              key={status}
                              onClick={() => updateStatus(selectedOrder.id, status as OrderStatus)}
                              disabled={isUpdating || selectedOrder.status === status}
                              className={`flex items-center justify-between p-3 rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all border ${
                                selectedOrder.status === status
                                  ? 'bg-active border-active text-white'
                                  : 'bg-white border-border text-secondary hover:border-active/30'
                              }`}
                            >
                              {status}
                              {selectedOrder.status === status && <CheckCircle size={14} />}
                            </button>
                          ))}
                        </div>
                      )}
                    </section>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminOrdersManagement;
