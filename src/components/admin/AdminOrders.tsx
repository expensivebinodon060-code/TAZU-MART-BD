import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  ChevronRight, 
  Package, 
  Download, 
  RefreshCw,
  ExternalLink,
  CheckCircle2,
  Circle,
  Truck,
  MoreVertical,
  Printer,
  X,
  AlertCircle,
  Clock,
  CreditCard,
  MapPin,
  Phone,
  Mail,
  User,
  FileText,
  Plus,
  Trash2,
  MessageCircle,
  MoreHorizontal,
  Smartphone,
  Globe,
  Eye
} from 'lucide-react';
import { Order, OrderStatus, PaymentStatus, Product, ProductVariation } from '../../types';
import { BANGLADESH_LOCATIONS } from '../../locationData';

export default function AdminOrders({ onPrintInvoice }: { onPrintInvoice?: (id: string) => void }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'All'>('All');
  const [internalNote, setInternalNote] = useState('');
  const [isManualOrderModalOpen, setIsManualOrderModalOpen] = useState(false);
  const [isDispatching, setIsDispatching] = useState(false);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/orders');
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error('Failed to fetch orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateStatus = async (orderId: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    try {
      const res = await fetch(`/api/admin/orders/${orderId}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, paymentStatus }),
      });
      if (res.ok) {
        const { order } = await res.json();
        
        // Award coins if status is Delivered and not already awarded
        if (status === 'Delivered' && !order.coinsAwarded) {
          try {
            await fetch(`/api/admin/orders/${orderId}/award-coins`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
            });
          } catch (coinErr) {
            console.error('Failed to award coins', coinErr);
          }
        }

        setOrders(prev => prev.map(o => o.id === orderId ? order : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(order);
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const handleUpdatePaymentStatus = async (orderId: string, paymentStatus: PaymentStatus) => {
    try {
      const res = await fetch(`/api/orders/${orderId}/payment-status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ payment_status: paymentStatus }),
      });
      if (res.ok) {
        const data = await res.json();
        setOrders(prev => prev.map(o => o.id === orderId ? { ...o, paymentStatus: data.paymentStatus } : o));
        if (selectedOrder?.id === orderId) setSelectedOrder(prev => prev ? { ...prev, paymentStatus: data.paymentStatus } : null);
      }
    } catch (err) {
      console.error('Failed to update payment status', err);
    }
  };

  const handleDispatch = async (provider: 'steadfast' | 'pathao') => {
    if (!selectedOrder) return;
    setIsDispatching(true);
    try {
      const res = await fetch(`/api/courier/${provider}/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId: selectedOrder.id }),
      });
      if (res.ok) {
        const data = await res.json();
        alert(`Dispatched to ${provider}. Tracking ID: ${data.trackingId}`);
        fetchOrders();
        setSelectedOrder(null);
      } else {
        const data = await res.json();
        alert(`Failed: ${data.error}`);
      }
    } catch (err) {
      console.error('Dispatch error', err);
    } finally {
      setIsDispatching(false);
    }
  };

  const handleSaveNote = async () => {
    if (!selectedOrder) return;
    try {
      const res = await fetch(`/api/admin/orders/${selectedOrder.id}/note`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ note: internalNote }),
      });
      if (res.ok) {
        const { order } = await res.json();
        setOrders(prev => prev.map(o => o.id === order.id ? order : o));
        setSelectedOrder(order);
        alert('Internal note saved.');
      }
    } catch (err) {
      console.error('Failed to save note', err);
    }
  };

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Pending': return 'text-orange-600 bg-orange-50 border-orange-100';
      case 'Confirmed': return 'text-blue-600 bg-blue-50 border-blue-100';
      case 'Delivered': return 'text-purple-600 bg-purple-50 border-purple-100';
      case 'Completed': return 'text-emerald-600 bg-emerald-50 border-emerald-100';
      case 'Cancelled': return 'text-red-600 bg-red-50 border-red-100';
      case 'Returned': return 'text-red-900 bg-red-50 border-red-200';
      case 'Refunded': return 'text-gray-600 bg-gray-50 border-gray-100';
      default: return 'text-muted bg-hover border-border';
    }
  };

  const statusOptions: OrderStatus[] = [
    'Pending',
    'Confirmed',
    'Delivered',
    'Completed',
    'Cancelled',
    'Returned',
    'Refunded'
  ];

  const orderTabs = [
    { id: 'All', label: 'All Orders' },
    { id: 'Pending', label: 'Pending' },
    { id: 'Confirmed', label: 'Confirmed' },
    { id: 'Delivered', label: 'Delivered' },
    { id: 'Completed', label: 'Completed' },
    { id: 'Cancelled', label: 'Cancelled' },
    { id: 'Returned', label: 'Returned' },
    { id: 'Refunded', label: 'Refunded' }
  ];

  const getTabCount = (status: string) => {
    if (status === 'All') return orders.length;
    return orders.filter(o => o.status === status).length;
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          order.customerPhone.includes(searchTerm);
    const matchesStatus = statusFilter === 'All' || order.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-primary tracking-tight">Order Management</h2>
          <p className="text-sm text-secondary mt-1">Manage, track, and process customer orders with precision.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-active transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="Order ID, Name, Phone..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="bg-white border border-accent rounded-[6px] pl-12 pr-4 py-3 text-sm text-primary outline-none focus:border-active transition-all w-full md:w-80"
            />
          </div>
          <button 
            onClick={() => setIsManualOrderModalOpen(true)}
            className="px-6 py-3 bg-active text-white rounded-[6px] text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2 shadow-sm"
          >
            <Plus size={18} />
            Add Order
          </button>
        </div>
      </header>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {orderTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setStatusFilter(tab.id as any)}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-[6px] text-sm font-bold whitespace-nowrap transition-all border ${
              statusFilter === tab.id
                ? 'bg-accent border-accent text-white shadow-sm'
                : 'bg-white border-accent text-muted hover:bg-hover'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-[4px] text-[10px] ${
              statusFilter === tab.id ? 'bg-white/20 text-white' : 'bg-accent/10 text-accent'
            }`}>
              {getTabCount(tab.id)}
            </span>
          </button>
        ))}
      </div>

      <div className="overflow-hidden">
        {/* Desktop Table View */}
        <div className="hidden xl:block overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[11px] font-bold text-muted uppercase tracking-widest border-b border-border bg-hover/30">
                <th className="px-6 py-5 text-center w-12">
                  <input type="checkbox" className="rounded border-border text-active focus:ring-active" />
                </th>
                <th className="px-4 py-5 w-12 text-center">SL</th>
                <th className="px-6 py-5">Product Info</th>
                <th className="px-6 py-5">Order ID</th>
                <th className="px-6 py-5">Customer</th>
                <th className="px-6 py-5">Contact</th>
                <th className="px-6 py-5">Source</th>
                <th className="px-6 py-5">Date & Time</th>
                <th className="px-6 py-5">Payment</th>
                <th className="px-6 py-5">Status</th>
                <th className="px-6 py-5">Total</th>
                <th className="px-6 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr>
                  <td colSpan={12} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <RefreshCw className="animate-spin text-active" size={40} />
                      <p className="text-secondary font-medium">Synchronizing orders...</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={12} className="px-8 py-32 text-center">
                    <div className="flex flex-col items-center gap-3 opacity-40">
                      <Package size={48} className="text-muted" />
                      <p className="text-secondary font-medium">No orders found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              ) : filteredOrders.map((order, index) => (
                <tr key={order.id} className="hover:bg-hover/40 transition-colors group">
                  <td className="px-6 py-5 text-center">
                    <input type="checkbox" className="rounded border-border text-active focus:ring-active" />
                  </td>
                  <td className="px-4 py-5 text-center text-xs font-medium text-muted">{index + 1}</td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-4 min-w-[240px]">
                      <div className="relative flex-shrink-0">
                        <img 
                          src={order.items[0]?.image} 
                          alt="" 
                          className="w-14 h-14 rounded-2xl object-cover border border-border shadow-sm"
                        />
                        {order.items.length > 1 && (
                          <span className="absolute -top-2 -right-2 bg-active text-white text-[10px] font-bold px-1.5 py-0.5 rounded-lg border-2 border-surface">
                            +{order.items.length - 1}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        <div className="text-sm font-bold text-primary line-clamp-1 group-hover:text-active transition-colors">
                          {order.items[0]?.name}
                        </div>
                        <div className="flex items-center gap-2 text-[10px] text-secondary font-medium">
                          <span>Qty: {order.items[0]?.quantity}</span>
                          {order.items[0]?.variant && (
                            <>
                              <span className="w-1 h-1 rounded-full bg-border" />
                              <span>{order.items[0].variant}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-primary font-mono">{order.id}</div>
                    <div className="text-[10px] text-muted mt-0.5">TXN: {order.transactionId || 'N/A'}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-primary">{order.customerName}</div>
                    <div className="text-[10px] text-secondary mt-0.5">{order.customerEmail || 'No Email'}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-2">
                      <div className="text-xs font-bold text-primary">{order.customerPhone}</div>
                      <div className="flex items-center gap-1.5">
                        <a href={`tel:${order.customerPhone}`} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-600 hover:text-white transition-all" title="Call">
                          <Phone size={12} />
                        </a>
                        <a href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="p-1.5 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-600 hover:text-white transition-all" title="WhatsApp">
                          <MessageCircle size={12} />
                        </a>
                        <a href={`sms:${order.customerPhone}`} className="p-1.5 bg-purple-50 text-purple-600 rounded-lg hover:bg-purple-600 hover:text-white transition-all" title="SMS">
                          <Mail size={12} />
                        </a>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex items-center gap-2 px-2.5 py-1 bg-hover rounded-lg border border-border w-fit">
                      {order.orderSource === 'website' ? <Globe size={12} className="text-blue-500" /> : <Smartphone size={12} className="text-purple-500" />}
                      <span className="text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {order.orderSource === 'website' ? 'Website' : 'App'}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm text-primary font-medium">{new Date(order.date).toLocaleDateString()}</div>
                    <div className="text-[10px] text-muted mt-0.5">{new Date(order.date).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-6 py-5">
                    <div className="flex flex-col gap-1">
                      <div className="text-xs font-bold text-primary">{order.paymentMethod}</div>
                      <div className={`text-[10px] font-bold uppercase tracking-wider ${
                        order.paymentStatus === 'paid' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>
                        {order.paymentStatus}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <select 
                      value={order.status}
                      onChange={(e) => handleUpdateStatus(order.id, e.target.value as OrderStatus)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-widest border outline-none cursor-pointer transition-all ${getStatusColor(order.status)}`}
                    >
                      {statusOptions.map(status => (
                        <option key={status} value={status} className="bg-surface text-primary">{status}</option>
                      ))}
                    </select>
                  </td>
                  <td className="px-6 py-5">
                    <div className="text-sm font-bold text-primary">৳ {order.amount?.toLocaleString() || 0}</div>
                    <div className="text-[10px] text-muted mt-0.5">Courier: {order.courierName || 'Pending'}</div>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => {
                          setSelectedOrder(order);
                          setInternalNote(order.internalNote || '');
                        }}
                        className="p-2.5 bg-hover text-secondary hover:bg-active hover:text-white rounded-xl transition-all shadow-sm"
                        title="View Details"
                      >
                        <Eye size={18} />
                      </button>
                      <button className="p-2.5 bg-hover text-secondary hover:bg-border rounded-xl transition-all shadow-sm">
                        <MoreHorizontal size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile Card View */}
        <div className="xl:hidden divide-y divide-border">
          {isLoading ? (
            <div className="px-8 py-20 text-center">
              <RefreshCw className="animate-spin text-active mx-auto mb-4" size={32} />
              <p className="text-muted text-sm font-medium">Loading orders...</p>
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="px-8 py-20 text-center text-muted font-medium">No orders found.</div>
          ) : filteredOrders.map((order) => (
            <div key={order.id} className="p-6 space-y-5 hover:bg-hover/30 transition-colors">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-4">
                  <img src={order.items[0]?.image} alt="" className="w-16 h-16 rounded-2xl object-cover border border-border shadow-sm" />
                  <div>
                    <div className="text-sm font-bold text-primary line-clamp-1">{order.items[0]?.name}</div>
                    <div className="text-[10px] font-mono text-active font-bold mt-1">{order.id}</div>
                    <div className="text-[10px] text-muted mt-0.5">{new Date(order.date).toLocaleString()}</div>
                  </div>
                </div>
                <div className={`px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getStatusColor(order.status)}`}>
                  {order.status}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Customer</div>
                  <div className="text-xs font-bold text-primary">{order.customerName}</div>
                  <div className="text-[10px] text-secondary mt-0.5">{order.customerPhone}</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-muted uppercase tracking-wider mb-1">Grand Total</div>
                  <div className="text-sm font-black text-active">৳ {order.amount?.toLocaleString() || 0}</div>
                  <div className="text-[10px] text-secondary mt-0.5">{order.paymentMethod}</div>
                </div>
              </div>

              <div className="flex items-center gap-3">
                <a href={`tel:${order.customerPhone}`} className="flex-1 flex items-center justify-center gap-2 py-3 bg-blue-50 text-blue-600 rounded-2xl text-xs font-bold hover:bg-blue-600 hover:text-white transition-all">
                  <Phone size={14} />
                  Call
                </a>
                <a href={`https://wa.me/${order.customerPhone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex-1 flex items-center justify-center gap-2 py-3 bg-emerald-50 text-emerald-600 rounded-2xl text-xs font-bold hover:bg-emerald-600 hover:text-white transition-all">
                  <MessageCircle size={14} />
                  WhatsApp
                </a>
                <button 
                  onClick={() => {
                    setSelectedOrder(order);
                    setInternalNote(order.internalNote || '');
                  }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 bg-active text-white rounded-2xl text-xs font-bold shadow-lg shadow-active/20"
                >
                  <Eye size={14} />
                  Details
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-[100] bg-white overflow-y-auto">
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="min-h-screen w-full flex flex-col"
            >
              <div className="p-6 border-b border-accent flex items-center justify-between sticky top-0 bg-white z-10">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-active/10 text-active rounded-[6px] flex items-center justify-center">
                    <Package size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-accent uppercase tracking-tight">Order Details</h3>
                    <p className="text-[10px] text-muted uppercase tracking-widest">{selectedOrder.id}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-hover rounded-[6px] text-muted transition-all">
                  <X size={24} />
                </button>
              </div>

              <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                  {/* Left: Order Items & Summary */}
                  <div className="lg:col-span-2 space-y-8">
                    <div className="p-8 bg-white rounded-[6px] border border-accent space-y-6">
                      <div className="flex items-center gap-2 text-accent">
                        <Package size={18} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Ordered Products</h4>
                      </div>
                      <div className="space-y-4">
                        {selectedOrder.items.map((item, idx) => (
                          <div key={idx} className="flex items-center gap-4 p-4 bg-hover rounded-[6px] border border-accent/30">
                            <img src={item.image} alt={item.name} className="w-16 h-16 rounded-[6px] object-cover border border-accent/20" />
                            <div className="flex-1">
                              <div className="text-sm font-bold text-primary">{item.name}</div>
                              <div className="text-[10px] text-secondary mt-1">{item.variant || 'Standard'} • x{item.quantity}</div>
                            </div>
                            <div className="text-right">
                              <div className="text-sm font-bold text-primary">৳ {(item.price * item.quantity)?.toLocaleString() || 0}</div>
                              <div className="text-[10px] text-muted mt-1">৳ {item.price} ea</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="space-y-3 pt-6 border-t border-accent/30">
                        <div className="flex justify-between text-xs text-secondary">
                          <span>Subtotal</span>
                          <span className="font-bold text-primary">৳ {(selectedOrder.amount - selectedOrder.deliveryCharge + selectedOrder.discount)?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between text-xs text-secondary">
                          <span>Delivery Charge</span>
                          <span className="font-bold text-primary">৳ {selectedOrder.deliveryCharge}</span>
                        </div>
                        {selectedOrder.discount > 0 && (
                          <div className="flex justify-between text-xs text-rose-600">
                            <span>Discount</span>
                            <span className="font-bold">- ৳ {selectedOrder.discount}</span>
                          </div>
                        )}
                        <div className="flex justify-between text-xl font-black text-active pt-4 border-t border-accent">
                          <span>Grand Total</span>
                          <span>৳ {selectedOrder.amount?.toLocaleString() || 0}</span>
                        </div>
                      </div>
                    </div>

                    {/* Internal Notes */}
                    <div className="p-8 bg-white rounded-[6px] border border-accent space-y-4">
                      <div className="flex items-center gap-2 text-accent">
                        <FileText size={18} />
                        <h4 className="text-xs font-bold uppercase tracking-widest">Internal Notes (Admin Only)</h4>
                      </div>
                      <textarea 
                        value={internalNote}
                        onChange={(e) => setInternalNote(e.target.value)}
                        placeholder="Add a private note about this order..."
                        className="w-full bg-white border border-accent rounded-[6px] p-4 text-sm text-primary outline-none focus:border-active transition-all resize-none h-32"
                      />
                      <button 
                        onClick={handleSaveNote}
                        className="w-full py-4 bg-hover border border-accent rounded-[6px] text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all"
                      >
                        Save Internal Note
                      </button>
                    </div>
                  </div>

                  {/* Right: Customer & Status */}
                  <div className="space-y-8">
                    {/* Status Controls */}
                    <div className="p-8 bg-white rounded-[6px] border border-accent space-y-6">
                      <div className="flex items-center justify-between">
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Update Status</h4>
                        <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </span>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {statusOptions.map(status => (
                          <button
                            key={status}
                            onClick={() => handleUpdateStatus(selectedOrder.id, status)}
                            className={`py-2.5 px-3 rounded-[6px] text-[10px] font-bold uppercase tracking-widest transition-all border ${
                              selectedOrder.status === status 
                                ? 'bg-active border-active text-white shadow-sm' 
                                : 'bg-white border-accent text-muted hover:bg-hover'
                            }`}
                          >
                            {status}
                          </button>
                        ))}
                      </div>
                      
                      <div className="pt-6 border-t border-accent/30 space-y-4">
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Payment Status</h4>
                        <div className="flex flex-wrap gap-4">
                          {(['pending', 'partial', 'paid'] as PaymentStatus[]).map(ps => (
                            <label key={ps} className="flex items-center gap-2 cursor-pointer group">
                              <input 
                                type="radio" 
                                name="paymentStatus" 
                                checked={selectedOrder.paymentStatus.toLowerCase() === ps}
                                onChange={() => handleUpdatePaymentStatus(selectedOrder.id, ps)}
                                className="hidden"
                              />
                              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${
                                selectedOrder.paymentStatus.toLowerCase() === ps ? 'border-active' : 'border-accent group-hover:border-active/50'
                              }`}>
                                {selectedOrder.paymentStatus.toLowerCase() === ps && <div className="w-2 h-2 rounded-full bg-active" />}
                              </div>
                              <span className={`text-xs capitalize ${selectedOrder.paymentStatus.toLowerCase() === ps ? 'text-primary font-bold' : 'text-muted'}`}>
                                {ps === 'pending' ? 'Not Fully Paid' : ps}
                              </span>
                            </label>
                          ))}
                        </div>
                      </div>

                      <div className="pt-6 border-t border-accent/30 space-y-4">
                        <h4 className="text-[10px] font-bold text-muted uppercase tracking-widest">Courier Dispatch</h4>
                        <div className="grid grid-cols-1 gap-3">
                          <button 
                            disabled={!!selectedOrder.dispatchedAt || isDispatching}
                            onClick={() => handleDispatch('steadfast')}
                            className="py-3.5 bg-white text-accent border border-accent rounded-[6px] text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <Truck size={16} />
                            Send to Steadfast
                          </button>
                          <button 
                            disabled={!!selectedOrder.dispatchedAt || isDispatching}
                            onClick={() => handleDispatch('pathao')}
                            className="py-3.5 bg-white text-accent border border-accent rounded-[6px] text-[10px] font-bold uppercase tracking-widest hover:bg-accent hover:text-white transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                          >
                            <Truck size={16} />
                            Send to Pathao
                          </button>
                        </div>
                        {selectedOrder.dispatchedAt && (
                          <div className="p-4 bg-hover rounded-[6px] border border-accent/30 flex items-center gap-3">
                            <CheckCircle2 size={16} className="text-success" />
                            <div className="text-[10px] text-secondary leading-relaxed">
                              Dispatched via <span className="text-accent font-bold capitalize">{selectedOrder.courierName}</span>
                              <br />
                              Tracking: <span className="text-active font-mono font-bold">{selectedOrder.courierTrackingId}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      <button 
                        onClick={() => onPrintInvoice?.(selectedOrder.id)}
                        className="w-full py-4 bg-hover border border-accent rounded-[6px] text-xs font-bold text-accent hover:bg-accent hover:text-white transition-all flex items-center justify-center gap-2"
                      >
                        <Printer size={18} />
                        Print Invoice
                      </button>
                    </div>

                    {/* Customer Info */}
                    <div className="p-8 bg-white rounded-[6px] border border-accent space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center gap-2 text-accent">
                          <User size={18} />
                          <h4 className="text-xs font-bold uppercase tracking-widest">Customer</h4>
                        </div>
                        <div className="space-y-2">
                          <div className="text-base font-bold text-primary">{selectedOrder.customerName}</div>
                          <div className="flex items-center gap-2 text-sm text-secondary">
                            <Phone size={14} className="text-accent" />
                            {selectedOrder.customerPhone}
                          </div>
                          {selectedOrder.customerEmail && (
                            <div className="flex items-center gap-2 text-sm text-secondary">
                              <Mail size={14} className="text-accent" />
                              {selectedOrder.customerEmail}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="pt-6 border-t border-accent/30 space-y-4">
                        <div className="flex items-center gap-2 text-accent">
                          <MapPin size={18} />
                          <h4 className="text-xs font-bold uppercase tracking-widest">Shipping</h4>
                        </div>
                        <p className="text-sm text-secondary leading-relaxed">
                          {selectedOrder.shippingAddress}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
      {/* Manual Order Modal */}
      <ManualOrderModal 
        isOpen={isManualOrderModalOpen} 
        onClose={() => setIsManualOrderModalOpen(false)} 
        onSuccess={() => {
          fetchOrders();
          setIsManualOrderModalOpen(false);
        }}
      />
    </div>
  );
}

function ManualOrderModal({ isOpen, onClose, onSuccess }: { isOpen: boolean, onClose: () => void, onSuccess: () => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    altPhone: '',
    address: '',
    division: '',
    district: '',
    thana: ''
  });
  const [selectedItems, setSelectedItems] = useState<{ productId: string, variationId?: string, quantity: number, price: number, name: string, image: string, variantName?: string }[]>([]);
  const [deliveryCharge, setDeliveryCharge] = useState(60);
  const [isSaving, setIsSaving] = useState(false);
  const [searchProduct, setSearchProduct] = useState('');

  // Auto-calculate delivery charge
  useEffect(() => {
    if (customerInfo.division === 'Dhaka' && customerInfo.district === 'Dhaka') {
      setDeliveryCharge(60);
    } else if (customerInfo.district) {
      setDeliveryCharge(120);
    }
  }, [customerInfo.division, customerInfo.district]);

  useEffect(() => {
    if (isOpen) {
      fetch('/api/admin/products')
        .then(res => res.json())
        .then(data => {
          // Robust filtering for active status
          const activeProducts = data.filter((p: any) => 
            p.status?.toLowerCase() === 'active' && !p.deletedAt
          );
          setProducts(activeProducts);
        });
    }
  }, [isOpen]);

  const handleAddItem = (product: Product) => {
    // Check if product already added (optional, but let's just add a new row as requested)
    const defaultVariation = product.variations?.[0];
    const initialPrice = product.price + (defaultVariation?.priceAdjustment || 0);
    
    const newItem = {
      productId: product.id,
      name: product.name,
      image: product.image,
      price: initialPrice,
      quantity: 1,
      variationId: defaultVariation?.id,
      variant: defaultVariation?.attributeValue
    };
    setSelectedItems([...selectedItems, newItem]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleUpdateItem = (index: number, updates: any) => {
    setSelectedItems(selectedItems.map((item, i) => i === index ? { ...item, ...updates } : item));
  };

  const subtotal = selectedItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  const grandTotal = subtotal + Number(deliveryCharge);

  const handleSave = async () => {
    if (!customerInfo.name || !customerInfo.phone || !customerInfo.address || selectedItems.length === 0) {
      alert('Please fill all required fields and add at least one product.');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/orders/create-manual', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerInfo,
          items: selectedItems,
          deliveryCharge: Number(deliveryCharge),
          orderSource: 'admin_manual'
        })
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        alert(`Error: ${data.error}`);
      }
    } catch (err) {
      console.error('Failed to create manual order', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[110] bg-white overflow-y-auto">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="min-h-screen w-full flex flex-col"
          >
            <div className="p-6 border-b border-accent flex items-center justify-between sticky top-0 bg-white z-10">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-active/10 text-active rounded-[6px] flex items-center justify-center">
                  <Plus size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-accent uppercase tracking-tight">Create Manual Order</h3>
                  <p className="text-[10px] text-muted uppercase tracking-widest">Merchant Mode Order Creation</p>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-hover rounded-[6px] text-muted transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 p-6 md:p-12 max-w-7xl mx-auto w-full space-y-12">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* Customer Info */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-2 border-b border-accent pb-2">
                    <User size={16} />
                    Customer Information
                  </h4>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Full Name *</label>
                      <input 
                        type="text" 
                        value={customerInfo.name}
                        onChange={(e) => setCustomerInfo({...customerInfo, name: e.target.value})}
                        placeholder="Customer Name"
                        className="w-full bg-white border border-accent rounded-[6px] px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Phone *</label>
                        <input 
                          type="text" 
                          value={customerInfo.phone}
                          onChange={(e) => setCustomerInfo({...customerInfo, phone: e.target.value})}
                          placeholder="017..."
                          className="w-full bg-white border border-accent rounded-[6px] px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Alt Phone</label>
                        <input 
                          type="text" 
                          value={customerInfo.altPhone}
                          onChange={(e) => setCustomerInfo({...customerInfo, altPhone: e.target.value})}
                          placeholder="Optional"
                          className="w-full bg-white border border-accent rounded-[6px] px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Full Address *</label>
                      <textarea 
                        value={customerInfo.address}
                        onChange={(e) => setCustomerInfo({...customerInfo, address: e.target.value})}
                        placeholder="House, Road, Area..."
                        className="w-full bg-white border border-accent rounded-[6px] px-4 py-4 text-sm text-primary outline-none focus:border-active transition-all h-24 resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-muted uppercase tracking-widest ml-1">Division</label>
                        <select 
                          value={customerInfo.division}
                          onChange={(e) => {
                            setCustomerInfo({
                              ...customerInfo, 
                              division: e.target.value,
                              district: '',
                              thana: ''
                            });
                          }}
                          className="w-full bg-white border border-accent rounded-[6px] px-3 py-2 text-xs text-primary outline-none focus:border-active transition-all appearance-none"
                        >
                          <option value="">Select</option>
                          {BANGLADESH_LOCATIONS.divisions.map(div => (
                            <option key={div.id} value={div.name}>{div.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-muted uppercase tracking-widest ml-1">District</label>
                        <select 
                          value={customerInfo.district}
                          disabled={!customerInfo.division}
                          onChange={(e) => {
                            setCustomerInfo({
                              ...customerInfo, 
                              district: e.target.value,
                              thana: ''
                            });
                          }}
                          className="w-full bg-white border border-accent rounded-[6px] px-3 py-2 text-xs text-primary outline-none focus:border-active transition-all disabled:opacity-50 appearance-none"
                        >
                          <option value="">Select</option>
                          {BANGLADESH_LOCATIONS.districts
                            .filter(d => {
                              const div = BANGLADESH_LOCATIONS.divisions.find(v => v.name === customerInfo.division);
                              return div && d.division_id === div.id;
                            })
                            .map(dist => (
                              <option key={dist.id} value={dist.name}>{dist.name}</option>
                            ))
                          }
                        </select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-muted uppercase tracking-widest ml-1">Thana</label>
                        <select 
                          value={customerInfo.thana}
                          disabled={!customerInfo.district}
                          onChange={(e) => setCustomerInfo({...customerInfo, thana: e.target.value})}
                          className="w-full bg-white border border-accent rounded-[6px] px-3 py-2 text-xs text-primary outline-none focus:border-active transition-all disabled:opacity-50 appearance-none"
                        >
                          <option value="">Select</option>
                          {BANGLADESH_LOCATIONS.upazilas
                            .filter(u => {
                              const dist = BANGLADESH_LOCATIONS.districts.find(d => d.name === customerInfo.district);
                              return dist && u.district_id === dist.id;
                            })
                            .map(upz => (
                              <option key={upz.id} value={upz.name}>{upz.name}</option>
                            ))
                          }
                        </select>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Selection */}
                <div className="space-y-6">
                  <h4 className="text-sm font-bold text-accent uppercase tracking-widest flex items-center gap-2 border-b border-accent pb-2">
                    <Package size={16} />
                    Product Selection
                  </h4>
                  <div className="space-y-4">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={16} />
                      <input 
                        type="text" 
                        placeholder="Search active products..." 
                        value={searchProduct}
                        onChange={(e) => setSearchProduct(e.target.value)}
                        className="w-full bg-white border border-accent rounded-[6px] pl-12 pr-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div className="max-h-80 overflow-y-auto space-y-2 custom-scrollbar pr-2">
                      {products
                        .filter(p => p.name.toLowerCase().includes(searchProduct.toLowerCase()) || p.sku?.toLowerCase().includes(searchProduct.toLowerCase()))
                        .map(product => (
                          <button
                            key={product.id}
                            onClick={() => handleAddItem(product)}
                            className="w-full flex items-center gap-3 p-3 bg-white border border-accent rounded-[6px] hover:bg-hover transition-all text-left group"
                          >
                            <img src={product.image} alt={product.name} className="w-10 h-10 rounded-[6px] object-cover" />
                            <div className="flex-1">
                              <div className="text-xs font-bold text-primary group-hover:text-active transition-colors">{product.name}</div>
                              <div className="text-[10px] text-muted">
                                ৳ {product.price?.toLocaleString() || 0} 
                                {product.variations && product.variations.length > 0 && ` • ${product.variations.length} Variants`}
                                • Stock: {product.stockQuantity}
                              </div>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-hover flex items-center justify-center group-hover:bg-active/20 group-hover:text-active transition-all">
                              <Plus size={16} />
                            </div>
                          </button>
                        ))}
                      {products.length === 0 && (
                        <div className="py-8 text-center text-xs text-muted italic">No active products found.</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Selected Items Table */}
              <div className="space-y-4">
                <h4 className="text-sm font-bold text-accent uppercase tracking-widest border-b border-accent pb-2">Order Items</h4>
                <div className="bg-white border border-accent rounded-[6px] overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-accent bg-hover/50">
                        <th className="px-6 py-4">Product</th>
                        <th className="px-6 py-4">Variation</th>
                        <th className="px-6 py-4">Price</th>
                        <th className="px-6 py-4">Qty</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4 text-right"></th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-accent">
                      {selectedItems.map((item, idx) => {
                        const product = products.find(p => p.id === item.productId);
                        return (
                          <tr key={idx} className="group">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={item.image} alt={item.name} className="w-8 h-8 rounded-[6px] object-cover" />
                                <span className="text-xs font-bold text-primary">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              {product?.variations && product.variations.length > 0 ? (
                                <select 
                                  value={item.variationId}
                                  onChange={(e) => {
                                    const v = product.variations?.find(v => v.id === e.target.value);
                                    handleUpdateItem(idx, { variationId: v?.id, variant: v?.attributeValue, price: product.price + (v?.priceAdjustment || 0) });
                                  }}
                                  className="bg-white border border-accent rounded-[6px] px-2 py-1 text-[10px] text-primary outline-none appearance-none"
                                >
                                  {product.variations.map(v => (
                                    <option key={v.id} value={v.id}>{v.attributeValue} (+৳{v.priceAdjustment})</option>
                                  ))}
                                </select>
                              ) : (
                                <span className="text-[10px] text-muted">Standard</span>
                              )}
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-primary">৳ {item.price?.toLocaleString() || 0}</td>
                            <td className="px-6 py-4">
                              <input 
                                type="number" 
                                min="1"
                                value={item.quantity}
                                onChange={(e) => handleUpdateItem(idx, { quantity: Math.max(1, parseInt(e.target.value) || 1) })}
                                className="w-16 bg-white border border-accent rounded-[6px] px-2 py-1 text-xs text-primary outline-none"
                              />
                            </td>
                            <td className="px-6 py-4 text-xs font-bold text-active">৳ {(item.price * item.quantity)?.toLocaleString() || 0}</td>
                            <td className="px-6 py-4 text-right">
                              <button onClick={() => handleRemoveItem(idx)} className="p-2 text-muted hover:text-rose-600 transition-all">
                                <Trash2 size={14} />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                      {selectedItems.length === 0 && (
                        <tr>
                          <td colSpan={6} className="px-6 py-8 text-center text-xs text-muted italic">No products added yet.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Summary & Save */}
              <div className="flex flex-col md:flex-row items-end justify-between gap-8 pt-8 border-t border-accent">
                <div className="w-full md:w-64 space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest ml-1">Delivery Charge</label>
                    <input 
                      type="number" 
                      value={deliveryCharge}
                      onChange={(e) => setDeliveryCharge(parseInt(e.target.value) || 0)}
                      className="w-full bg-white border border-accent rounded-[6px] px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                    />
                  </div>
                </div>
                <div className="w-full md:w-80 p-6 bg-white rounded-[6px] border border-accent space-y-3">
                  <div className="flex justify-between text-xs text-muted">
                    <span>Subtotal</span>
                    <span>৳ {subtotal?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-xs text-muted">
                    <span>Delivery Charge</span>
                    <span>৳ {deliveryCharge?.toLocaleString() || 0}</span>
                  </div>
                  <div className="flex justify-between text-lg font-black text-active pt-2 border-t border-accent">
                    <span>Grand Total</span>
                    <span>৳ {grandTotal?.toLocaleString() || 0}</span>
                  </div>
                  <button 
                    onClick={handleSave}
                    disabled={isSaving}
                    className="w-full py-4 bg-active text-white rounded-[6px] text-sm font-bold hover:bg-active/90 transition-all flex items-center justify-center gap-2 mt-4 shadow-lg shadow-active/20 disabled:opacity-50"
                  >
                    {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
                    Save Manual Order
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
