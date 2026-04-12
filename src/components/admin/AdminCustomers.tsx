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
  DollarSign,
  Activity,
  ShieldCheck,
  ShieldAlert,
  ShieldQuestion,
  RefreshCw,
  Truck,
  Plus,
  History
} from 'lucide-react';
import { Customer, CustomerAnalytics, CustomerIntelligence } from '../../types';

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [stats, setStats] = useState<CustomerAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [providerFilter, setProviderFilter] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'payments' | 'notes' | 'intelligence'>('profile');
  const [customerDetails, setCustomerDetails] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [intelligence, setIntelligence] = useState<CustomerIntelligence | null>(null);
  const [isIntelligenceLoading, setIsIntelligenceLoading] = useState(false);

  useEffect(() => {
    fetchData();
    fetchStats();
  }, [search, statusFilter, districtFilter, providerFilter]);

  const fetchData = async () => {
    try {
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (statusFilter) params.append('status', statusFilter);
      if (districtFilter) params.append('district', districtFilter);
      if (providerFilter) params.append('provider', providerFilter);
      
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
      setIntelligence(null); // Reset intelligence
    } catch (err) {
      console.error('Failed to fetch customer details', err);
    }
  };

  const fetchIntelligence = async (phone: string) => {
    setIsIntelligenceLoading(true);
    try {
      const res = await fetch(`/api/customers/${phone}/intelligence`);
      const data = await res.json();
      setIntelligence(data);
    } catch (err) {
      console.error('Failed to fetch intelligence', err);
    } finally {
      setIsIntelligenceLoading(false);
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

  const handleToggleRole = async (customer: Customer) => {
    const newRole = customer.role === 'admin' ? 'customer' : 'admin';
    if (!confirm(`Are you sure you want to change this user's role to ${newRole}?`)) return;
    
    try {
      const res = await fetch(`/api/admin/customers/${customer.id}/role`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (res.ok) {
        fetchData();
        if (selectedCustomer?.id === customer.id) {
          setSelectedCustomer({ ...selectedCustomer, role: newRole });
        }
      }
    } catch (err) {
      console.error('Failed to toggle role', err);
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

  const getRiskBadge = (risk: string) => {
    switch (risk) {
      case 'Low Risk': return <span className="px-2 py-1 bg-green-500/10 text-green-600 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><ShieldCheck size={12} /> Low Risk</span>;
      case 'Medium Risk': return <span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><ShieldQuestion size={12} /> Medium Risk</span>;
      case 'High Risk': return <span className="px-2 py-1 bg-rose-500/10 text-rose-600 rounded-lg text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><ShieldAlert size={12} /> High Risk</span>;
      default: return null;
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Customer Management</h1>
          <p className="text-muted text-sm">Monitor customer behavior, orders, and financial sync.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-hover border border-border rounded-xl text-sm font-bold text-muted hover:bg-border transition-all">
            <Download size={18} />
            Export CSV
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Customers', value: stats?.totalCustomers || 0, icon: Users, color: 'text-indigo-600', bg: 'bg-indigo-500/10' },
          { label: 'Active Profiles', value: stats?.activeCustomers || 0, icon: UserCheck, color: 'text-emerald-600', bg: 'bg-emerald-500/10' },
          { label: 'Total Outstanding Due', value: `৳${stats?.totalDueAmount?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-amber-600', bg: 'bg-amber-500/10' },
          { label: 'New This Month', value: stats?.newCustomersMonth || 0, icon: TrendingUp, color: 'text-rose-500', bg: 'bg-rose-500/10' },
        ].map((stat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="p-6 bg-surface border border-border rounded-card space-y-4 shadow-sm"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-2xl font-black text-primary">{stat.value}</div>
              <div className="text-xs font-bold text-muted uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Filter Bar */}
      <div className="p-4 bg-surface border border-border rounded-[24px] flex flex-col md:flex-row gap-4 shadow-sm">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
          <input 
            type="text"
            placeholder="Search by name, phone, or ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-hover/30 border border-border rounded-xl pl-12 pr-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
          />
        </div>
        <div className="flex items-center gap-3">
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-hover/30 border border-border rounded-xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all appearance-none"
          >
            <option value="">All Status</option>
            <option value="Active">Active</option>
            <option value="Blocked">Blocked</option>
          </select>
          <select 
            value={districtFilter}
            onChange={(e) => setDistrictFilter(e.target.value)}
            className="bg-hover/30 border border-border rounded-xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all appearance-none"
          >
            <option value="">All Districts</option>
            <option value="Dhaka">Dhaka</option>
            <option value="Chattogram">Chattogram</option>
            <option value="Rajshahi">Rajshahi</option>
            <option value="Khulna">Khulna</option>
          </select>
          <select 
            value={providerFilter}
            onChange={(e) => setProviderFilter(e.target.value)}
            className="bg-hover/30 border border-border rounded-xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all appearance-none"
          >
            <option value="">All Providers</option>
            <option value="manual">Email</option>
            <option value="google">Google</option>
            <option value="facebook">Facebook</option>
          </select>
        </div>
      </div>

      {/* Customer Table */}
      <div className="bg-surface border border-border rounded-card overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-bottom border-border bg-hover">
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Customer ID</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Full Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Phone</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Provider</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Role</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Last Login</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Orders</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Total Purchase</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Due</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr>
                  <td colSpan={11} className="px-6 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-10 h-10 border-4 border-active/20 border-t-active rounded-full animate-spin" />
                      <p className="text-muted text-sm">Loading customers...</p>
                    </div>
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-6 py-20 text-center">
                    <p className="text-muted">No customers found matching your filters.</p>
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr 
                    key={customer.id} 
                    className="hover:bg-hover transition-colors group cursor-pointer"
                    onClick={() => handleViewDetails(customer)}
                  >
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono font-bold text-active bg-active/10 px-2 py-1 rounded-lg">
                        {customer.customerUniqueId}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-bold text-primary">{customer.fullName}</div>
                      <div className="text-[10px] text-muted mt-0.5">{customer.district}, {customer.upazila}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-primary font-medium">{customer.phone}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        customer.provider === 'google' ? 'bg-blue-500/10 text-blue-600' : 
                        customer.provider === 'facebook' ? 'bg-indigo-500/10 text-indigo-600' : 
                        'bg-muted/10 text-muted'
                      }`}>
                        {customer.provider || 'Email'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        customer.role === 'admin' ? 'bg-purple-500/10 text-purple-600' : 'bg-muted/10 text-muted'
                      }`}>
                        {customer.role || 'customer'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-primary font-medium">
                        {customer.lastLoginAt ? new Date(customer.lastLoginAt).toLocaleString() : 'Never'}
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">
                        {customer.lastIp || 'No IP'} • {customer.lastDevice || 'No Device'}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <ShoppingBag size={14} className="text-muted" />
                        <span className="text-sm font-bold text-primary">{customer.totalOrders}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-primary">৳{customer.totalPurchase?.toLocaleString() || 0}</td>
                    <td className="px-6 py-4">
                      <span className={`text-sm font-bold ${customer.totalDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                        ৳{customer.totalDue?.toLocaleString() || 0}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest ${
                        customer.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
                      }`}>
                        {customer.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleViewDetails(customer); }}
                          className="p-2 hover:bg-hover rounded-lg text-muted hover:text-active transition-all"
                        >
                          <Eye size={16} />
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleToggleStatus(customer); }}
                          className={`p-2 hover:bg-hover rounded-lg transition-all ${customer.status === 'Active' ? 'text-muted hover:text-rose-600' : 'text-rose-600 hover:text-emerald-600'}`}
                        >
                          {customer.status === 'Active' ? <Ban size={16} /> : <UserCheck size={16} />}
                        </button>
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleDelete(customer.id); }}
                          className="p-2 hover:bg-hover rounded-lg text-muted hover:text-rose-600 transition-all"
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
              className="relative w-full max-w-4xl bg-surface border border-border rounded-[32px] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            >
              {/* Modal Header */}
              <div className="p-8 border-b border-border flex items-center justify-between bg-hover/10">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-active/10 text-active rounded-2xl flex items-center justify-center text-2xl font-black">
                    {selectedCustomer.fullName.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-primary">{selectedCustomer.fullName}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs font-mono text-active font-bold">{selectedCustomer.customerUniqueId}</span>
                      <span className="w-1 h-1 bg-border rounded-full" />
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${selectedCustomer.status === 'Active' ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {selectedCustomer.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => handleToggleRole(selectedCustomer)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCustomer.role === 'admin' 
                        ? 'bg-purple-50 text-purple-600 border border-purple-100 hover:bg-purple-100' 
                        : 'bg-active/10 text-active border border-active/20 hover:bg-active/20'
                    }`}
                  >
                    {selectedCustomer.role === 'admin' ? 'Make Customer' : 'Make Admin'}
                  </button>
                  <button 
                    onClick={() => handleToggleStatus(selectedCustomer)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      selectedCustomer.status === 'Active' 
                        ? 'bg-rose-50 text-rose-600 border border-rose-100 hover:bg-rose-100' 
                        : 'bg-emerald-50 text-emerald-600 border border-emerald-100 hover:bg-emerald-100'
                    }`}
                  >
                    {selectedCustomer.status === 'Active' ? 'Block Customer' : 'Unblock Customer'}
                  </button>
                  <button onClick={() => setShowDetailsModal(false)} className="p-2 hover:bg-hover rounded-full text-muted">
                    <X size={24} />
                  </button>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex border-b border-border px-8 bg-hover/10">
                {[
                  { id: 'profile', label: 'Profile', icon: Users },
                  { id: 'orders', label: 'Order History', icon: ShoppingBag },
                  { id: 'payments', label: 'Payment History', icon: CreditCard },
                  { id: 'notes', label: 'Internal Notes', icon: FileText },
                  { id: 'intelligence', label: 'Fraud Check', icon: Activity },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      if (tab.id === 'intelligence' && !intelligence) {
                        fetchIntelligence(selectedCustomer.phone);
                      }
                    }}
                    className={`flex items-center gap-2 px-6 py-4 text-sm font-bold transition-all relative ${
                      activeTab === tab.id ? 'text-active' : 'text-muted hover:text-primary'
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
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Phone Number</label>
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <Phone size={14} className="text-active" />
                            {selectedCustomer.phone}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Email Address</label>
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <Mail size={14} className="text-active" />
                            {selectedCustomer.email || 'N/A'}
                          </div>
                        </div>
                        <div className="col-span-2 space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Full Address</label>
                          <div className="flex items-start gap-2 text-primary font-bold">
                            <MapPin size={14} className="text-active mt-1 shrink-0" />
                            {selectedCustomer.address}, {selectedCustomer.upazila}, {selectedCustomer.district}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Registration Date</label>
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <Calendar size={14} className="text-active" />
                            {new Date(selectedCustomer.createdAt).toLocaleDateString()}
                          </div>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Last Order Date</label>
                          <div className="flex items-center gap-2 text-primary font-bold">
                            <Clock size={14} className="text-active" />
                            {selectedCustomer.lastOrderDate ? new Date(selectedCustomer.lastOrderDate).toLocaleDateString() : 'Never'}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Financial Summary */}
                    <div className="p-6 bg-hover/30 border border-border rounded-3xl space-y-6">
                      <h4 className="text-sm font-bold text-primary flex items-center gap-2">
                        <DollarSign size={16} className="text-active" />
                        Financial Summary
                      </h4>
                      <div className="space-y-4">
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted">Total Orders</span>
                          <span className="text-sm font-bold text-primary">{selectedCustomer.totalOrders}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted">Total Purchase</span>
                          <span className="text-sm font-bold text-primary">৳{selectedCustomer?.totalPurchase?.toLocaleString() || 0}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-xs text-muted">Total Paid</span>
                          <span className="text-sm font-bold text-emerald-600">৳{selectedCustomer?.totalPaid?.toLocaleString() || 0}</span>
                        </div>
                        <div className="pt-4 border-t border-border flex justify-between items-center">
                          <span className="text-xs font-bold text-muted uppercase tracking-widest">Current Due</span>
                          <span className={`text-lg font-black ${selectedCustomer.totalDue > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
                            ৳{selectedCustomer?.totalDue?.toLocaleString() || 0}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {activeTab === 'orders' && (
                  <div className="space-y-4">
                    {!customerDetails?.orders || customerDetails.orders.length === 0 ? (
                      <div className="text-center py-12 bg-hover/30 rounded-3xl border border-border">
                        <ShoppingBag size={48} className="mx-auto text-muted/20 mb-4" />
                        <p className="text-muted">No orders found for this customer.</p>
                      </div>
                    ) : (
                      customerDetails.orders.map((order: any) => (
                        <div key={order.id} className="p-6 bg-hover/30 border border-border rounded-3xl flex items-center justify-between hover:bg-hover transition-all">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-active/10 text-active rounded-xl flex items-center justify-center">
                              <ShoppingBag size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-primary">{order.id}</div>
                              <div className="text-[10px] text-muted mt-0.5">{new Date(order.date).toLocaleDateString()}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-bold text-primary">৳{order.amount?.toLocaleString() || 0}</div>
                            <div className={`text-[10px] font-bold uppercase tracking-widest mt-1 ${
                              order.status === 'Delivered' ? 'text-emerald-600' : 'text-amber-600'
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
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h4 className="text-sm font-bold text-primary uppercase tracking-widest">Payment History</h4>
                      <button 
                        onClick={() => {
                          const amount = prompt('Enter payment amount:');
                          if (!amount || isNaN(Number(amount))) return;
                          const method = prompt('Enter payment method (e.g., bKash, Cash, Bank):', 'Cash');
                          const trxId = prompt('Enter Transaction ID (optional):');
                          
                          fetch(`/api/admin/customers/${selectedCustomer.id}/payments`, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ amount, method, trxId })
                          }).then(res => {
                            if (res.ok) {
                              handleViewDetails(selectedCustomer);
                              fetchData();
                              fetchStats();
                            }
                          });
                        }}
                        className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold hover:bg-emerald-700 transition-all flex items-center gap-2"
                      >
                        <Plus size={14} />
                        Record Payment
                      </button>
                    </div>
                    <div className="space-y-4">
                      {!customerDetails?.payments || customerDetails.payments.length === 0 ? (
                        <div className="text-center py-12 bg-hover/30 rounded-3xl border border-border">
                          <CreditCard size={48} className="mx-auto text-muted/20 mb-4" />
                          <p className="text-muted">No payments recorded for this customer.</p>
                        </div>
                      ) : (
                        customerDetails.payments.map((payment: any) => (
                          <div key={payment.id} className="p-6 bg-hover/30 border border-border rounded-3xl flex items-center justify-between hover:bg-hover transition-all">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                                <CreditCard size={20} />
                              </div>
                              <div>
                                <div className="text-sm font-bold text-primary">৳{payment.amount?.toLocaleString() || 0}</div>
                                <div className="text-[10px] text-muted mt-0.5">{payment.paymentMethod} • {new Date(payment.date).toLocaleDateString()}</div>
                              </div>
                            </div>
                            <div className="text-right">
                              <div className="text-xs font-mono text-muted">{payment.trxId || 'N/A'}</div>
                              <div className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">SUCCESS</div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                {activeTab === 'notes' && (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Internal Admin Notes</label>
                      <textarea 
                        value={notes}
                        onChange={(e) => setNotes(e.target.value)}
                        placeholder="Add private notes about this customer (behavior, issues, preferences)..."
                        rows={8}
                        className="w-full bg-surface border border-border rounded-3xl p-6 text-sm text-primary outline-none focus:border-active transition-all resize-none"
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

                {activeTab === 'intelligence' && (
                  <div className="space-y-8">
                    {isIntelligenceLoading ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-4">
                        <RefreshCw size={40} className="text-active animate-spin" />
                        <p className="text-muted text-sm">Analyzing customer reliability across networks...</p>
                      </div>
                    ) : intelligence ? (
                      <div className="space-y-8">
                        {/* Risk Summary */}
                        <div className="p-8 bg-hover/30 rounded-[32px] border border-border flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                              <ShieldCheck size={24} />
                            </div>
                            <div>
                              <h4 className="text-lg font-bold text-primary">Fraud Assessment</h4>
                              <p className="text-xs text-muted">Based on internal and external data points.</p>
                            </div>
                          </div>
                          {getRiskBadge(intelligence.riskBadge)}
                        </div>

                        {/* Stats Grid */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          {[
                            { label: 'Success Rate', value: `${intelligence.internalSummary.successRate}%`, icon: CheckCircle2, color: 'text-emerald-600' },
                            { label: 'Cancellations', value: intelligence.internalSummary.cancelledOrders, icon: X, color: 'text-rose-600' },
                            { label: 'Fraud Alerts', value: intelligence.internalSummary.fraudCount, icon: AlertCircle, color: 'text-amber-600' },
                            { label: 'Courier Score', value: 'High', icon: Truck, color: 'text-indigo-600' },
                          ].map((stat, i) => (
                            <div key={i} className="p-6 bg-hover/30 rounded-3xl border border-border space-y-2">
                              <div className={`w-8 h-8 bg-surface ${stat.color} rounded-lg flex items-center justify-center border border-border`}>
                                <stat.icon size={16} />
                              </div>
                              <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{stat.label}</div>
                              <div className="text-xl font-bold text-primary">{stat.value}</div>
                            </div>
                          ))}
                        </div>

                        {/* Courier Summary */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="p-6 bg-hover/30 rounded-3xl border border-border space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-primary">Steadfast Performance</span>
                              <span className="text-[10px] text-muted">API Verified</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] text-muted uppercase">Delivered</div>
                                <div className="text-lg font-bold text-emerald-600">{intelligence.courierSummary.steadfast.success}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-muted uppercase">Returned</div>
                                <div className="text-lg font-bold text-rose-600">{intelligence.courierSummary.steadfast.failure}</div>
                              </div>
                            </div>
                          </div>
                          <div className="p-6 bg-hover/30 rounded-3xl border border-border space-y-4">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-bold text-primary">Pathao Performance</span>
                              <span className="text-[10px] text-muted">API Verified</span>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                              <div>
                                <div className="text-[10px] text-muted uppercase">Delivered</div>
                                <div className="text-lg font-bold text-emerald-600">{intelligence.courierSummary.pathao.success}</div>
                              </div>
                              <div>
                                <div className="text-[10px] text-muted uppercase">Returned</div>
                                <div className="text-lg font-bold text-rose-600">{intelligence.courierSummary.pathao.failure}</div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-20">
                        <button 
                          onClick={() => fetchIntelligence(selectedCustomer.phone)}
                          className="px-8 py-4 bg-active text-white rounded-2xl font-bold hover:bg-active/90 transition-all flex items-center gap-3 mx-auto shadow-lg shadow-active/20"
                        >
                          <Activity size={20} />
                          Run Fraud Analysis
                        </button>
                        <p className="text-muted text-xs mt-4">This will query internal databases and external courier APIs.</p>
                      </div>
                    )}
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
