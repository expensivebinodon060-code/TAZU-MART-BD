import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Package, 
  Printer, 
  Truck, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertCircle,
  ChevronRight,
  MoreHorizontal,
  FileText,
  Tag,
  StickyNote,
  ExternalLink,
  RefreshCw
} from 'lucide-react';
import { WorkshopOrder, PackagingStatus } from '../../types';

export default function Workshop() {
  const [orders, setOrders] = useState<WorkshopOrder[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedOrder, setSelectedOrder] = useState<WorkshopOrder | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/workshop/orders');
      setOrders(await res.json());
    } catch (err) {
      console.error('Failed to fetch workshop orders', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdatePackaging = async (orderId: string, status: PackagingStatus) => {
    try {
      const res = await fetch(`/api/admin/workshop/orders/${orderId}/packaging`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      if (res.ok) {
        fetchOrders();
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, packagingStatus: status });
        }
      }
    } catch (err) {
      console.error('Failed to update packaging status', err);
    }
  };

  const handlePrint = async (orderId: string, type: 'invoice' | 'label') => {
    try {
      const res = await fetch(`/api/admin/workshop/orders/${orderId}/print`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type })
      });
      if (res.ok) {
        fetchOrders();
        alert(`${type.charAt(0).toUpperCase() + type.slice(1)} sent to printer!`);
      }
    } catch (err) {
      console.error('Failed to print', err);
    }
  };

  const getStatusColor = (status: PackagingStatus) => {
    switch (status) {
      case 'Pending': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Processing': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'Ready to Ship': return 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20';
      case 'Shipped': return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
      default: return 'bg-white/5 text-secondary border-white/10';
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.customerPhone.includes(searchQuery)
  );

  const pendingOrders = filteredOrders.filter(o => o.packagingStatus === 'Pending');
  const processingOrders = filteredOrders.filter(o => o.packagingStatus === 'Processing');
  const readyToShipOrders = filteredOrders.filter(o => o.packagingStatus === 'Ready to Ship');
  const shippedOrders = filteredOrders.filter(o => o.packagingStatus === 'Shipped');

  const [activeSection, setActiveSection] = useState<PackagingStatus>('Pending');

  const currentOrders = activeSection === 'Pending' ? pendingOrders :
                       activeSection === 'Processing' ? processingOrders :
                       activeSection === 'Ready to Ship' ? readyToShipOrders :
                       shippedOrders;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-[#EAEAEA] tracking-tight uppercase">Workshop Fulfillment</h2>
          <p className="text-secondary text-sm">Manage order processing, packaging, and shipping workflow.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text"
              placeholder="Search orders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-12 pr-6 py-3 bg-card border border-white/10 rounded-2xl text-sm text-[#EAEAEA] focus:outline-none focus:border-active w-80"
            />
          </div>
          <button 
            onClick={fetchOrders}
            className="p-3 bg-card border border-white/10 rounded-2xl text-secondary hover:text-active transition-all"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* Status Navigation */}
      <div className="flex items-center gap-2 p-1.5 bg-card border border-white/5 rounded-2xl w-fit">
        {[
          { id: 'Pending', label: 'Pending Orders', count: pendingOrders.length },
          { id: 'Processing', label: 'Processing Orders', count: processingOrders.length },
          { id: 'Ready to Ship', label: 'Ready To Ship', count: readyToShipOrders.length },
          { id: 'Shipped', label: 'Shipped Orders', count: shippedOrders.length },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveSection(tab.id as PackagingStatus)}
            className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center gap-3 ${
              activeSection === tab.id 
                ? 'bg-active text-white shadow-lg shadow-active/20' 
                : 'text-secondary hover:bg-white/5'
            }`}
          >
            {tab.label}
            <span className={`px-2 py-0.5 rounded-md text-[10px] ${
              activeSection === tab.id ? 'bg-white/20 text-white' : 'bg-white/5 text-secondary'
            }`}>
              {tab.count}
            </span>
          </button>
        ))}
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Orders List */}
        <div className="col-span-8 space-y-4">
          {currentOrders.map(order => (
            <div 
              key={order.id}
              onClick={() => setSelectedOrder(order)}
              className={`p-6 bg-card border rounded-[32px] transition-all cursor-pointer group ${
                selectedOrder?.id === order.id ? 'border-active/50 shadow-xl shadow-active/5' : 'border-white/5 hover:border-white/10'
              }`}
            >
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center border transition-all ${
                    selectedOrder?.id === order.id ? 'bg-active text-white border-active' : 'bg-white/5 text-secondary border-white/5'
                  }`}>
                    <Package size={28} />
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="text-lg font-bold text-[#EAEAEA]">{order.id}</span>
                      <span className={`px-3 py-0.5 rounded-full text-[10px] font-black uppercase border ${getStatusColor(order.packagingStatus)}`}>
                        {order.packagingStatus}
                      </span>
                    </div>
                    <div className="text-sm text-secondary font-medium">
                      {order.customerName} • {order.items.length} Items • ৳{order.amount}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {order.invoicePrinted && <Printer size={14} className="text-emerald-400" />}
                    {order.labelPrinted && <Tag size={14} className="text-indigo-400" />}
                  </div>
                  <ChevronRight size={20} className={`text-secondary transition-all ${selectedOrder?.id === order.id ? 'translate-x-1 text-active' : 'group-hover:translate-x-1'}`} />
                </div>
              </div>
            </div>
          ))}

          {currentOrders.length === 0 && (
            <div className="py-20 text-center space-y-4 bg-card border border-white/5 rounded-[40px]">
              <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                <Package size={40} className="text-secondary opacity-20" />
              </div>
              <p className="text-secondary">No orders in {activeSection} status.</p>
            </div>
          )}
        </div>

        {/* Details Panel */}
        <div className="col-span-4">
          <AnimatePresence mode="wait">
            {selectedOrder ? (
              <motion.div
                key={selectedOrder.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 bg-card border border-white/5 rounded-[40px] space-y-8 sticky top-8"
              >
                <div className="space-y-6">
                  <div className="flex justify-between items-start">
                    <div className="space-y-1">
                      <h3 className="text-2xl font-black text-[#EAEAEA]">{selectedOrder.id}</h3>
                      <p className="text-xs text-secondary">{new Date(selectedOrder.date).toLocaleString()}</p>
                    </div>
                    <div className={`px-4 py-1.5 rounded-xl text-xs font-bold border ${getStatusColor(selectedOrder.packagingStatus)}`}>
                      {selectedOrder.packagingStatus}
                    </div>
                  </div>

                  <div className="p-6 bg-white/5 rounded-3xl border border-white/5 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                        <StickyNote size={20} />
                      </div>
                      <div className="text-sm font-bold text-[#EAEAEA]">Customer Details</div>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-secondary">Name:</span>
                        <span className="text-[#EAEAEA] font-medium">{selectedOrder.customerName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-secondary">Phone:</span>
                        <span className="text-[#EAEAEA] font-medium">{selectedOrder.customerPhone}</span>
                      </div>
                      <div className="space-y-1">
                        <span className="text-secondary">Address:</span>
                        <p className="text-[#EAEAEA] font-medium text-xs leading-relaxed">{selectedOrder.shippingAddress}</p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Fulfillment Actions</div>
                    <div className="grid grid-cols-2 gap-4">
                      <button 
                        onClick={() => handleUpdatePackaging(selectedOrder.id, 'Processing')}
                        disabled={selectedOrder.packagingStatus !== 'Pending'}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <RefreshCw size={24} className="text-blue-400" />
                        <span className="text-[10px] font-bold text-[#EAEAEA]">Start Processing</span>
                      </button>
                      <button 
                        onClick={() => handleUpdatePackaging(selectedOrder.id, 'Ready to Ship')}
                        disabled={selectedOrder.packagingStatus !== 'Processing'}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Package size={24} className="text-indigo-400" />
                        <span className="text-[10px] font-bold text-[#EAEAEA]">Mark Ready</span>
                      </button>
                      <button 
                        onClick={() => handlePrint(selectedOrder.id, 'invoice')}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
                      >
                        <Printer size={24} className="text-emerald-400" />
                        <span className="text-[10px] font-bold text-[#EAEAEA]">Print Invoice</span>
                      </button>
                      <button 
                        onClick={() => handlePrint(selectedOrder.id, 'label')}
                        className="p-4 bg-white/5 border border-white/10 rounded-2xl flex flex-col items-center gap-2 hover:bg-white/10 transition-all"
                      >
                        <Tag size={24} className="text-indigo-400" />
                        <span className="text-[10px] font-bold text-[#EAEAEA]">Print Label</span>
                      </button>
                      <button 
                        onClick={() => handleUpdatePackaging(selectedOrder.id, 'Shipped')}
                        disabled={selectedOrder.packagingStatus !== 'Ready to Ship'}
                        className="w-full col-span-2 p-4 bg-active/10 border border-active/20 rounded-2xl flex items-center justify-center gap-3 hover:bg-active/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Truck size={24} className="text-active" />
                        <span className="text-sm font-bold text-active">Dispatch Order</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <div className="flex items-center gap-2 text-amber-400 mb-4">
                      <AlertCircle size={14} />
                      <span className="text-[10px] font-bold uppercase tracking-wider">Restrictions</span>
                    </div>
                    <ul className="space-y-2">
                      <li className="text-[10px] text-secondary flex items-center gap-2">
                        <div className="w-1 h-1 bg-secondary rounded-full" />
                        Cannot modify payment details
                      </li>
                      <li className="text-[10px] text-secondary flex items-center gap-2">
                        <div className="w-1 h-1 bg-secondary rounded-full" />
                        Cannot cancel paid orders here
                      </li>
                      <li className="text-[10px] text-secondary flex items-center gap-2">
                        <div className="w-1 h-1 bg-secondary rounded-full" />
                        Cannot change checkout data
                      </li>
                    </ul>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="p-12 text-center space-y-4 bg-card border border-white/5 border-dashed rounded-[40px]">
                <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                  <ChevronRight size={32} className="text-secondary opacity-20" />
                </div>
                <p className="text-sm text-secondary">Select an order to view fulfillment details.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
