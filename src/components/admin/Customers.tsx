import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  Search, 
  Filter, 
  MoreVertical, 
  Eye, 
  Ban, 
  Trash2, 
  Download, 
  ChevronRight, 
  ShoppingBag, 
  CreditCard, 
  Clock, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  TrendingUp,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  UserCheck,
  UserMinus,
  DollarSign
} from 'lucide-react';
import { Customer, CustomerAnalytics } from '../../types';

export default function Customers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'payments' | 'notes'>('profile');
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [search, statusFilter, districtFilter]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (districtFilter) params.append('district', districtFilter);
      
      const res = await fetch(`/api/admin/customers?${params.toString()}`);
      const data = await res.json();
      setCustomers(data);
    } catch (err) {
      console.error('Failed to fetch customers', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch('/api/admin/customers/stats');
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error('Failed to fetch stats', err);
    }
  };

  const handleViewDetails = async (customer: Customer) => {
    setSelectedCustomer(customer);
    setShowDetailsModal(true);
    setActiveTab('profile');
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}`);
      const data = await res.json();
      setCustomerDetails(data);
      setNotes(data.notes || '');
    } catch (err) {
      console.error('Failed to fetch customer details', err);
    }
  };

  const handleToggleStatus = async (customer: Customer) => {
    const newStatus = customer.status === 'Active' ? 'Blocked' : 'Active';
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      if (res.ok) {
        fetchData();
        fetchStats();
        if (selectedCustomer?.id === customer.id) {
          setSelectedCustomer({ ...selectedCustomer, status: newStatus });
        }
      }
    } catch (err) {
      console.error('Failed to toggle status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer? This is a soft delete.')) return;
    try {
      const res = await fetch(`/api/admin/customers/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
        fetchStats();
        setShowDetailsModal(false);
      }
    } catch (err) {
      console.error('Failed to delete customer', err);
    }
  };

  const handleSaveNotes = async () => {
    if (!selectedCustomer) return;
    try {
      const res = await fetch(`/api/admin/customers/${selectedCustomer.id}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes })
      });
      if (res.ok) {
        alert('Notes saved successfully');
      }
    } catch (err) {
      console.error('Failed to save notes', err);
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-[#EAEAEA] tracking-tight">Customer Management</h1>
          <p className="text-secondary text-sm">Monitor customer behavior, orders, and financial sync.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-secondary hover:bg-white/10 transition-all">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
          { label: 'Active Profiles', value: stats?.activeCustomers || 0, icon: UserCheck, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
          { label: 'Total Outstanding Due', value: `৳${stats?.totalDueAmount?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-amber-500', bg: 'bg-amber-500/10' },
          { label: 'New This Month', value: stats?.newCustomersMonth || 0, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-card border border-white/5 rounded-[32px] space-y-4 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-[#EAEAEA]">{stat.value}</div>
              <div className="text-xs font-bold text-secondary uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-card border border-white/5 rounded-[24px] flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input 
            type="text"
            placeholder="Search by name, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
          <select 
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
          >
            <option value="">All Districts</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattogram">Chattogram</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Khulna">Khulna</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-card border border-white/5 rounded-[32px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-bottom border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Customer ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Full Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Orders</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Total Purchase</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Due</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {loading ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-active/20 border-t-active rounded-full animate-spin" />
                      <p className="text-secondary text-sm">Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-6 py-20 text-center">
                    <p className="text-secondary">No customers found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-white/5 transition-colors group cursor-pointer"
                    onClick={() => handleViewDetails(customer)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-active bg-active/10 px-2 py-1 rounded-lg">
                        {customer.customerUniqueId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-[#EAEAEA]">{customer.fullName}</div>
                      <div className="text-[10px] text-secondary mt-0.5">{customer.district}, {customer.upazila}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-[#EAEAEA] font-medium">{customer.phone}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={14} className="text-secondary" />
                        <span className="text-sm font-bold text-[#EAEAEA]">{customer.totalOrders}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-[#EAEAEA]">৳{customer.totalPurchase.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${customer.totalDue > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                        ৳{customer.totalDue.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleViewDetails(customer); }}
                          className="p-2 hover:bg-white/10 rounded-lg text-secondary hover:text-active transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(customer); }}
                          className={`p-2 hover:bg-white/10 rounded-lg transition-all ${customer.status === 'Active' ? 'text-secondary hover:text-rose-500' : 'text-rose-500 hover:text-emerald-500'}`}
                        >
                          {customer.status === 'Active' ? <Ban size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}
                          className="p-2 hover:bg-white/10 rounded-lg text-secondary hover:text-rose-500 transition-all"
                        >
                          <Trash2 size={16} />
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

      {/* Customer Details Modal */}
      <AnimatePresence>
        {showDetailsModal && selectedCustomer && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowDetailsModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#121212] border border-white/10 rounded-[32px] overflow-hidden flex flex-col max-h-[90vh]"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-white/5 flex items-center justify-between bg-white/5">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-active/10 text-active rounded-2xl flex items-center justify-center text-2xl font-black">
                    {selectedCustomer.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#EAEAEA]">{selectedCustomer.fullName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-mono text-active font-bold">{selectedCustomer.customerUniqueId}</span>
                      <span className="w-1 h-1 bg-white/20 rounded-full" />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedCustomer.status === 'Active' ? 'text-emerald-500' : 'text-rose-500'}`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleToggleStatus(selectedCustomer)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCustomer.status === 'Active' 
                        ? 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20' 
                        : 'bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20'
                    }`}
                  >
                    {selectedCustomer.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
                  </button>
                  <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-white/5 rounded-full text-secondary">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-white/5 px-8 bg-white/5">
                {[
                  { id: 'profile', label: 'Profile', icon: Users },
                  { id: 'orders', label: 'Order History', icon: ShoppingBag },
                  { id: 'payments', label: 'Payment History', icon: CreditCard },
                  { id: 'notes', label: 'Internal Notes', icon: FileText },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                      activeTab === tab.id ? 'text-active' : 'text-secondary hover:text-[#EAEAEA]'
                    }`}
                  >
                    <tab.icon size={16} />
                    {tab.label}
                    {activeTab === tab.id && (
                      <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-active" />
                    )}
                  </button>
                ))}
              </div>

              {/* Modal Content */}
              <div className="flex-1 overflow-y-auto p-8 custom-scrollbar">
                {activeTab === 'profile' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Info Section */}
                    <div className="md:col-span-2 space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Phone Number</label>
                          <div className="flex items-center gap-2 text-[#EAEAEA] font-bold">
                            <Phone size={14} className="text-active" />
                            {selectedCustomer.phone}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Email Address</label>
                          <div className="flex items-center gap-2 text-[#EAEAEA] font-bold">
                            <Mail size={14} className="text-active" />
                            {selectedCustomer.email || 'N/A'}
                          </div>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Full Address</label>
                          <div className="flex items-start gap-2 text-[#EAEAEA] font-bold">
                            <MapPin size={14} className="text-active mt-1 shrink-0" />
                            {selectedCustomer.address}, {selectedCustomer.upazila}, {selectedCustomer.district}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Registration Date</label>
                          <div className="flex items-center gap-2 text-[#EAEAEA] font-bold">
                            <Calendar size={14} className="text-active" />
                            {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Last Order Date</label>
                          <div className="flex items-center gap-2 text-[#EAEAEA] font-bold">
                            <Clock size={14} className="text-active" />
                            {selectedCustomer.lastOrderDate ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-6">
                      <h4 className="text-sm font-bold text-[#EAEAEA] flex items-center gap-2">
                        <DollarSign size={16} className="text-active" />
                        Financial Summary
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-secondary">Total Orders</span>
                          <span className="text-sm font-bold text-[#EAEAEA]">{selectedCustomer.totalOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-secondary">Total Purchase</span>
                          <span className="text-sm font-bold text-[#EAEAEA]">৳{selectedCustomer.totalPurchase.toLocaleString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-secondary">Total Paid</span>
                          <span className="text-sm font-bold text-emerald-500">৳{selectedCustomer.totalPaid.toLocaleString()}</span>
                        </div>
                        <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                          <span className="text-xs font-bold text-secondary uppercase tracking-widest">Current Due</span>
                          <span className={`text-lg font-black ${selectedCustomer.totalDue > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            ৳{selectedCustomer.totalDue.toLocaleString()}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {!customerDetails?.orders || customerDetails.orders.length === 0 ? (
                      <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5">
                        <ShoppingBag size={48} className="mx-auto text-white/10 mb-4" />
                        <p className="text-secondary">No orders found for this customer.</p>
                      </div>
                    ) : (
                      customerDetails.orders.map((order: any) => (
                        <div key={order.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-active/10 text-active rounded-xl flex items-center justify-center">
                              <ShoppingBag size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#EAEAEA]">{order.id}</div>
                              <div className="text-[10px] text-secondary mt-0.5">{new Date(order.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-[#EAEAEA]">৳{order.amount.toLocaleString()}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                              order.status === 'Delivered' ? 'text-emerald-500' : 'text-amber-500'
                            }`}>
                              {order.status}
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'payments' && (
                  <div className="space-y-4">
                    {!customerDetails?.payments || customerDetails.payments.length === 0 ? (
                      <div className="text-center py-12 bg-white/5 rounded-3xl border border-white/5">
                        <CreditCard size={48} className="mx-auto text-white/10 mb-4" />
                        <p className="text-secondary">No payments recorded for this customer.</p>
                      </div>
                    ) : (
                      customerDetails.payments.map((payment: any) => (
                        <div key={payment.id} className="p-6 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-between hover:bg-white/10 transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
                              <CreditCard size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-[#EAEAEA]">৳{payment.amount.toLocaleString()}</div>
                              <div className="text-[10px] text-secondary mt-0.5">{payment.paymentMethod} • {new Date(payment.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-mono text-secondary">{payment.trxId || 'N/A'}</div>
                            <div className="text-[10px] font-bold text-emerald-500 uppercase tracking-widest mt-1">SUCCESS</div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Internal Admin Notes</label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add private notes about this customer (behavior, issues, preferences)..."
                        rows={8}
                        className="w-full bg-white/5 border border-white/10 rounded-3xl p-6 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all resize-none"
                      />
                    </div>
                    <div className="flex justify-end">
                      <button 
                        onClick={handleSaveNotes}
                        className="px-8 py-3 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all shadow-lg shadow-active/20"
                      >
                        Save Notes
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
