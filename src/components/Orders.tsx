import { useState, useEffect } from 'react';
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
  CreditCard,
  Clock,
  MessageSquare,
  RotateCcw,
  Star,
  Camera,
  X,
  AlertCircle,
  MessageCircle
} from 'lucide-react';
import { Order, OrderStatus } from '../types';

interface OrdersProps {
  orders: Order[];
  onReorder: (order: Order) => void;
  onProductClick: (productId: string) => void;
  initialTab?: string;
}

export default function Orders({ orders, onReorder, onProductClick, initialTab = 'All' }: OrdersProps) {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingOrder, setTrackingOrder] = useState<Order | null>(null);
  const [activeTab, setActiveTab] = useState<string>(initialTab);
  const [reviewOrder, setReviewOrder] = useState<Order | null>(null);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  const getStatusColor = (status: OrderStatus) => {
    switch (status) {
      case 'Delivered': return 'text-green-400 bg-green-400/10';
      case 'Confirmed': return 'text-blue-400 bg-blue-400/10';
      case 'Pending': return 'text-yellow-400 bg-yellow-400/10';
      case 'Completed': return 'text-emerald-400 bg-emerald-400/10';
      case 'Cancelled': return 'text-red-400 bg-red-400/10';
      case 'Returned': return 'text-orange-400 bg-orange-400/10';
      case 'Refunded': return 'text-purple-400 bg-purple-400/10';
      default: return 'text-secondary bg-white/5';
    }
  };

  const steps: OrderStatus[] = ['Pending', 'Confirmed', 'Delivered', 'Completed'];

  const tabs = [
    { id: 'All', label: 'All' },
    { id: 'To Pay', label: 'To Pay', statuses: ['Pending'] },
    { id: 'To Ship', label: 'To Ship', statuses: ['Confirmed'] },
    { id: 'To Receive', label: 'To Receive', statuses: ['Delivered'] },
    { id: 'To Review', label: 'To Review', statuses: ['Completed'] },
    { id: 'Returns', label: 'Returns', statuses: ['Cancelled', 'Returned', 'Refunded'] },
  ];

  const filteredOrders = orders.filter(order => {
    if (activeTab === 'All') return true;
    const tab = tabs.find(t => t.id === activeTab);
    return tab?.statuses?.includes(order.status);
  });

  const renderEmptyState = () => {
    let message = "No orders found.";
    switch (activeTab) {
      case 'To Pay': message = "No pending payments."; break;
      case 'To Ship': message = "No orders waiting for shipment."; break;
      case 'To Receive': message = "No orders currently in transit."; break;
      case 'To Review': message = "No products waiting for review."; break;
      case 'Returns': message = "No return or refund requests."; break;
    }
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
        <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center text-secondary/30">
          <Package size={40} />
        </div>
        <div>
          <h3 className="text-lg font-bold">{message}</h3>
          <p className="text-secondary text-sm">When you place orders, they will appear here.</p>
        </div>
      </div>
    );
  };

  const renderOrderCard = (order: Order) => {
    switch (activeTab) {
      case 'To Pay':
        return (
          <div key={order.id} className="bg-card border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Order ID:</span>
                <span className="font-mono text-sm">{order.id}</span>
              </div>
              <span className="text-xs text-secondary">{order.date}</span>
            </div>
            {order.items.map(item => (
              <div key={item.productId} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold truncate">{item.name}</h4>
                  <p className="text-xs text-secondary mt-1">Qty: {item.quantity} • ${item.price}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div>
                <div className="text-[10px] text-secondary uppercase font-bold">Total Amount</div>
                <div className="text-lg font-bold text-active">${order.amount}</div>
              </div>
              <div className="text-right">
                <div className="text-[10px] text-secondary uppercase font-bold">Payment Method</div>
                <div className="text-sm font-medium">{order.paymentMethod}</div>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="py-2.5 bg-active text-white rounded-xl text-sm font-bold shadow-lg shadow-active/20 hover:opacity-90 transition-all">
                Pay Now
              </button>
              <button className="py-2.5 bg-white/5 text-secondary rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                Cancel Order
              </button>
            </div>
          </div>
        );

      case 'To Ship':
        return (
          <div key={order.id} className="bg-card border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Order ID:</span>
                <span className="font-mono text-sm">{order.id}</span>
              </div>
              <span className="text-xs text-secondary">{order.date}</span>
            </div>
            {order.items.map(item => (
              <div key={item.productId} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold truncate">{item.name}</h4>
                  <p className="text-xs text-secondary mt-1">Quantity: {item.quantity}</p>
                </div>
              </div>
            ))}
            <div className="flex items-center justify-between pt-3 border-t border-white/5">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Preparing / Processing</span>
              </div>
              <button className="flex items-center gap-2 text-xs font-bold text-active hover:underline">
                <MessageCircle size={14} />
                Contact Support
              </button>
            </div>
          </div>
        );

      case 'To Receive':
        return (
          <div key={order.id} className="bg-card border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <Truck size={16} className="text-active" />
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Tracking:</span>
                <span className="font-mono text-sm">{order.trackingNumber || 'N/A'}</span>
              </div>
              <span className="text-xs text-green-400 font-bold uppercase tracking-wider">In Transit</span>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-xs">
                <span className="text-secondary">Courier</span>
                <span className="font-bold">{order.courierName || 'Standard Delivery'}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-secondary">Est. Delivery</span>
                <span className="font-bold">Feb 25, 2026</span>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button 
                onClick={() => setTrackingOrder(order)}
                className="py-2.5 bg-active text-white rounded-xl text-sm font-bold shadow-lg shadow-active/20 hover:opacity-90 transition-all"
              >
                Track Order
              </button>
              <button className="py-2.5 bg-green-500 text-white rounded-xl text-sm font-bold shadow-lg shadow-green-500/20 hover:opacity-90 transition-all">
                Confirm Received
              </button>
            </div>
          </div>
        );

      case 'To Review':
        return (
          <div key={order.id} className="bg-card border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Order ID:</span>
                <span className="font-mono text-sm">{order.id}</span>
              </div>
              <span className="text-xs text-secondary">Delivered: {order.date}</span>
            </div>
            {order.items.map(item => (
              <div key={item.productId} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold truncate">{item.name}</h4>
                  <p className="text-xs text-secondary mt-1">Delivered on {order.date}</p>
                </div>
              </div>
            ))}
            <button 
              onClick={() => setReviewOrder(order)}
              className="w-full py-2.5 bg-active text-white rounded-xl text-sm font-bold shadow-lg shadow-active/20 hover:opacity-90 transition-all"
            >
              Write Review
            </button>
          </div>
        );

      case 'Returns':
        return (
          <div key={order.id} className="bg-card border border-white/5 rounded-2xl p-4 space-y-4">
            <div className="flex items-center justify-between border-b border-white/5 pb-3">
              <div className="flex items-center gap-2">
                <RotateCcw size={16} className="text-red-400" />
                <span className="text-xs font-bold text-secondary uppercase tracking-wider">Order ID:</span>
                <span className="font-mono text-sm">{order.id}</span>
              </div>
              <span className="px-2 py-0.5 bg-red-400/10 text-red-400 text-[10px] font-bold rounded-full uppercase">Pending</span>
            </div>
            {order.items.map(item => (
              <div key={item.productId} className="flex gap-4">
                <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover" />
                <div className="flex-1">
                  <h4 className="text-sm font-bold truncate">{item.name}</h4>
                  <p className="text-xs text-red-400 mt-1 font-medium">Reason: Defective Product</p>
                </div>
              </div>
            ))}
            <div className="grid grid-cols-2 gap-3 pt-2">
              <button className="py-2.5 bg-white/5 text-secondary rounded-xl text-sm font-bold hover:bg-white/10 transition-all">
                View Details
              </button>
              <button className="py-2.5 bg-active/10 text-active rounded-xl text-sm font-bold hover:bg-active/20 transition-all">
                Contact Support
              </button>
            </div>
          </div>
        );

      default:
        return (
          <tr key={order.id} className="hover:bg-white/[0.02] transition-colors group">
            <td className="px-6 py-4 font-mono text-sm">{order.id}</td>
            <td className="px-6 py-4 text-sm text-secondary">{order.date}</td>
            <td className="px-6 py-4 font-bold">${order.amount}</td>
            <td className="px-6 py-4 text-sm text-secondary">{order.paymentMethod}</td>
            <td className="px-6 py-4">
              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                {order.status}
              </span>
            </td>
            <td className="px-6 py-4 text-right">
              <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <button 
                  onClick={() => setTrackingOrder(order)}
                  className="p-2 hover:bg-active/10 hover:text-active rounded-lg transition-colors text-secondary"
                  title="Track Order"
                >
                  <Truck size={18} />
                </button>
                <button 
                  onClick={() => setSelectedOrder(order)}
                  className="p-2 hover:bg-active/10 hover:text-active rounded-lg transition-colors text-secondary"
                  title="View Details"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </td>
          </tr>
        );
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Orders</h1>
          <p className="text-secondary mt-1">Manage and track your recent purchases.</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-secondary" size={16} />
            <input 
              type="text" 
              placeholder="Search orders..." 
              className="bg-card border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm focus:border-active outline-none transition-all w-full sm:w-64"
            />
          </div>
          <button className="p-2 bg-card border border-white/10 rounded-xl hover:bg-white/5 transition-colors">
            <Filter size={20} className="text-secondary" />
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {tabs.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-all ${
              activeTab === tab.id 
                ? 'bg-active text-white shadow-lg shadow-active/20' 
                : 'bg-card text-secondary border border-white/5 hover:border-active/30'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Content */}
      {activeTab === 'All' ? (
        <div className="bg-card border border-white/5 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-white/5 text-secondary text-xs uppercase tracking-wider">
                  <th className="px-6 py-4 font-semibold">Order ID</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold">Amount</th>
                  <th className="px-6 py-4 font-semibold">Payment</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filteredOrders.length > 0 ? filteredOrders.map(order => renderOrderCard(order)) : (
                  <tr>
                    <td colSpan={6}>{renderEmptyState()}</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.length > 0 ? filteredOrders.map(order => renderOrderCard(order)) : (
            <div className="col-span-full">{renderEmptyState()}</div>
          )}
        </div>
      )}

      {/* Details Slide Panel */}
      <AnimatePresence>
        {selectedOrder && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedOrder(null)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed right-0 top-0 bottom-0 w-full max-w-md bg-sidebar border-l border-white/10 z-[60] p-8 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold">Order Details</h2>
                <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-white/5 rounded-full">
                  <ChevronRight className="rotate-180" />
                </button>
              </div>

              <div className="space-y-8">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                  <div>
                    <div className="text-secondary text-xs uppercase font-bold tracking-wider">Order ID</div>
                    <div className="font-mono text-lg">{selectedOrder.id}</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(selectedOrder.status)}`}>
                    {selectedOrder.status}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="font-bold text-secondary text-xs uppercase tracking-wider">Products</h3>
                  {selectedOrder.items.map((item) => (
                    <div 
                      key={item.productId} 
                      className="flex gap-4 cursor-pointer group/item"
                      onClick={() => onProductClick(item.productId)}
                    >
                      <img src={item.image} alt={item.name} className="w-16 h-16 rounded-xl object-cover group-hover/item:scale-105 transition-transform" />
                      <div className="flex-1">
                        <div className="font-medium text-sm group-hover/item:text-active transition-colors">{item.name}</div>
                        <div className="text-secondary text-xs mt-1">Qty: {item.quantity} • ${item.price}</div>
                      </div>
                      <div className="font-bold text-sm">${item.price * item.quantity}</div>
                    </div>
                  ))}
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Subtotal</span>
                    <span>${selectedOrder.amount - 15}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Shipping</span>
                    <span>$15.00</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total</span>
                    <span className="text-active">${selectedOrder.amount}</span>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <h3 className="font-bold text-secondary text-xs uppercase tracking-wider">Shipping Address</h3>
                  <p className="text-sm text-secondary leading-relaxed">{selectedOrder.shippingAddress}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <button className="flex items-center justify-center gap-2 p-3 bg-white/5 hover:bg-white/10 rounded-xl text-sm font-medium transition-all">
                    <Download size={16} />
                    Invoice
                  </button>
                  <button 
                    onClick={() => {
                      onReorder(selectedOrder);
                      setSelectedOrder(null);
                    }}
                    className="flex items-center justify-center gap-2 p-3 bg-active hover:bg-active/90 rounded-xl text-sm font-bold transition-all"
                  >
                    <RefreshCw size={16} />
                    Quick Reorder
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Tracking Modal */}
      <AnimatePresence>
        {trackingOrder && (
          <div className="fixed inset-0 flex items-center justify-center z-[70] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setTrackingOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative bg-card border border-white/10 rounded-3xl p-8 w-full max-w-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between mb-8">
                <div>
                  <h2 className="text-2xl font-bold">Track Order</h2>
                  <p className="text-secondary text-sm">Order {trackingOrder.id}</p>
                </div>
                <button onClick={() => setTrackingOrder(null)} className="p-2 hover:bg-white/5 rounded-full">
                  <ChevronRight className="rotate-180" />
                </button>
              </div>

              <div className="relative flex justify-between mb-12">
                {/* Progress Line */}
                <div className="absolute top-5 left-0 right-0 h-0.5 bg-white/10 -z-10" />
                <div 
                  className="absolute top-5 left-0 h-0.5 bg-active transition-all duration-1000 -z-10" 
                  style={{ width: `${(steps.indexOf(trackingOrder.status) / (steps.length - 1)) * 100}%` }}
                />

                {steps.map((step, i) => {
                  const isCompleted = steps.indexOf(trackingOrder.status) >= i;
                  const isActive = trackingOrder.status === step;
                  
                  return (
                    <div key={step} className="flex flex-col items-center gap-3">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${
                        isCompleted ? 'bg-active border-active text-white' : 'bg-card border-white/10 text-secondary'
                      } ${isActive ? 'ring-4 ring-active/20 scale-110' : ''}`}>
                        {isCompleted ? <CheckCircle2 size={20} /> : <Circle size={20} />}
                      </div>
                      <span className={`text-[10px] font-bold uppercase tracking-wider text-center max-w-[80px] ${
                        isCompleted ? 'text-primary' : 'text-secondary'
                      }`}>
                        {step}
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="bg-white/5 rounded-2xl p-6 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                      <Truck size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold">In Transit</div>
                      <div className="text-xs text-secondary">Expected delivery: Feb 22, 2026</div>
                    </div>
                  </div>
                  <button className="flex items-center gap-2 text-active text-sm font-bold hover:underline">
                    Courier Tracking
                    <ExternalLink size={14} />
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {reviewOrder && (
          <div className="fixed inset-0 flex items-center justify-center z-[100] p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setReviewOrder(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-card border border-white/10 rounded-3xl p-6 w-full max-w-lg overflow-hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold">Write a Review</h2>
                <button onClick={() => setReviewOrder(null)} className="p-2 hover:bg-white/5 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-6">
                {reviewOrder.items.map(item => (
                  <div key={item.productId} className="flex gap-4 items-center bg-white/5 p-3 rounded-2xl">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-bold truncate">{item.name}</h4>
                      <p className="text-[10px] text-secondary">Order ID: {reviewOrder.id}</p>
                    </div>
                  </div>
                ))}

                <div className="space-y-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Rating</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        onClick={() => setRating(star)}
                        className={`p-1 transition-all ${rating >= star ? 'text-yellow-400 scale-110' : 'text-white/10'}`}
                      >
                        <Star size={32} fill={rating >= star ? 'currentColor' : 'none'} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Your Comment</label>
                  <textarea 
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Share your experience with this product..."
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:border-active outline-none min-h-[120px] transition-all"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-xs font-bold text-secondary uppercase tracking-wider">Upload Photos (Optional)</label>
                  <div className="flex gap-3">
                    <button className="w-20 h-20 border-2 border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center text-secondary hover:border-active hover:text-active transition-all">
                      <Camera size={20} />
                      <span className="text-[10px] mt-1 font-bold">Add Photo</span>
                    </button>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    alert('Review submitted successfully!');
                    setReviewOrder(null);
                    setRating(0);
                    setComment('');
                  }}
                  disabled={rating === 0}
                  className="w-full py-3.5 bg-active text-white rounded-2xl text-sm font-bold shadow-lg shadow-active/20 hover:opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Submit Review
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
