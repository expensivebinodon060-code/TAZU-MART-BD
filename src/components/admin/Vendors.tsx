import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  MoreHorizontal, 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  CheckCircle2, 
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Building2,
  ChevronRight,
  ShieldAlert,
  CreditCard,
  Plus,
  Save,
  Edit3,
  Trash2,
  RefreshCw,
  FileText,
  History,
  PieChart,
  ArrowUpRight,
  ArrowDownRight,
  X,
  Printer,
  Download,
  Calendar,
  Settings
} from 'lucide-react';
import { Vendor, VendorPurchase, VendorPayment, VendorLedgerEntry, Product } from '../../types';

type Tab = 'list' | 'purchases' | 'payments' | 'reports' | 'settings';

export default function Vendors() {
  const [activeTab, setActiveTab] = useState<Tab>('list');
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [purchases, setPurchases] = useState<VendorPurchase[]>([]);
  const [payments, setPayments] = useState<VendorPayment[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [districtFilter, setDistrictFilter] = useState<string>('All');
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);
  const [showAddVendorModal, setShowAddVendorModal] = useState(false);
  const [showEditVendorModal, setShowEditVendorModal] = useState(false);
  const [showAddPurchaseModal, setShowAddPurchaseModal] = useState(false);
  const [showAddPaymentModal, setShowAddPaymentModal] = useState(false);
  const [showLedgerModal, setShowLedgerModal] = useState(false);
  const [ledgerEntries, setLedgerEntries] = useState<VendorLedgerEntry[]>([]);
  const [reportSummary, setReportSummary] = useState<any>(null);

  // Form States
  const [newVendor, setNewVendor] = useState<Partial<Vendor>>({
    name: '',
    companyName: '',
    phone: '',
    email: '',
    address: '',
    district: 'Dhaka',
    commissionPercentage: 10,
    openingBalance: 0,
    status: 'Active'
  });

  const [editingVendor, setEditingVendor] = useState<Vendor | null>(null);

  const [newPurchase, setNewPurchase] = useState<any>({
    vendorId: '',
    invoiceNumber: '',
    purchaseDate: new Date().toISOString().split('T')[0],
    items: [{ productId: '', name: '', quantity: 1, buyingPrice: 0, subtotal: 0 }],
    vat: 0,
    discount: 0,
    paidAmount: 0,
    paymentMethod: 'Cash',
    note: ''
  });

  const [newPayment, setNewPayment] = useState<any>({
    vendorId: '',
    paymentDate: new Date().toISOString().split('T')[0],
    amount: 0,
    method: 'Cash',
    transactionId: '',
    note: ''
  });

  useEffect(() => {
    fetchVendors();
    fetchProducts();
    if (activeTab === 'purchases') fetchPurchases();
    if (activeTab === 'payments') fetchPayments();
    if (activeTab === 'reports') fetchReportSummary();
  }, [activeTab]);

  const fetchVendors = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/vendors');
      setVendors(await res.json());
    } catch (err) {
      console.error('Failed to fetch vendors', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      setProducts(await res.json());
    } catch (err) {
      console.error('Failed to fetch products', err);
    }
  };

  const fetchPurchases = async () => {
    try {
      const res = await fetch('/api/admin/vendors/purchases');
      setPurchases(await res.json());
    } catch (err) {
      console.error('Failed to fetch purchases', err);
    }
  };

  const fetchPayments = async () => {
    try {
      const res = await fetch('/api/admin/vendors/payments');
      setPayments(await res.json());
    } catch (err) {
      console.error('Failed to fetch payments', err);
    }
  };

  const fetchLedger = async (vendorId: string) => {
    try {
      const res = await fetch(`/api/admin/vendors/${vendorId}/ledger`);
      setLedgerEntries(await res.json());
      setShowLedgerModal(true);
    } catch (err) {
      console.error('Failed to fetch ledger', err);
    }
  };

  const fetchReportSummary = async () => {
    try {
      const res = await fetch('/api/admin/vendors/reports/summary');
      setReportSummary(await res.json());
    } catch (err) {
      console.error('Failed to fetch report summary', err);
    }
  };

  const handleAddVendor = async () => {
    try {
      const res = await fetch('/api/admin/vendors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVendor)
      });
      if (res.ok) {
        fetchVendors();
        setShowAddVendorModal(false);
        setNewVendor({ name: '', companyName: '', phone: '', email: '', address: '', district: 'Dhaka', commissionPercentage: 10, openingBalance: 0, status: 'Active' });
      }
    } catch (err) {
      console.error('Failed to add vendor', err);
    }
  };

  const handleAddPurchase = async () => {
    const subtotal = newPurchase.items.reduce((acc: number, item: any) => acc + item.subtotal, 0);
    const totalAmount = subtotal + (newPurchase.vat || 0) - (newPurchase.discount || 0);
    const dueAmount = totalAmount - newPurchase.paidAmount;

    const purchaseData = {
      ...newPurchase,
      subtotal,
      totalAmount,
      dueAmount
    };

    try {
      const res = await fetch('/api/admin/vendors/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(purchaseData)
      });
      if (res.ok) {
        fetchPurchases();
        fetchVendors();
        setShowAddPurchaseModal(false);
        setNewPurchase({ vendorId: '', invoiceNumber: '', purchaseDate: new Date().toISOString().split('T')[0], items: [{ productId: '', name: '', quantity: 1, buyingPrice: 0, subtotal: 0 }], vat: 0, discount: 0, paidAmount: 0, paymentMethod: 'Cash', note: '' });
      }
    } catch (err) {
      console.error('Failed to add purchase', err);
    }
  };

  const handleAddPayment = async () => {
    try {
      const res = await fetch('/api/admin/vendors/payments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPayment)
      });
      if (res.ok) {
        fetchPayments();
        fetchVendors();
        setShowAddPaymentModal(false);
        setNewPayment({ vendorId: '', paymentDate: new Date().toISOString().split('T')[0], amount: 0, method: 'Cash', transactionId: '', note: '' });
      }
    } catch (err) {
      console.error('Failed to add payment', err);
    }
  };

  const handleUpdateVendor = async () => {
    if (!editingVendor) return;
    try {
      const res = await fetch(`/api/admin/vendors/${editingVendor.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingVendor)
      });
      if (res.ok) {
        fetchVendors();
        setShowEditVendorModal(false);
        setEditingVendor(null);
      }
    } catch (err) {
      console.error('Failed to update vendor', err);
    }
  };

  const handleDeleteVendor = async (id: string) => {
    if (!confirm('Are you sure you want to delete this vendor? This will perform a soft delete.')) return;
    try {
      const res = await fetch(`/api/admin/vendors/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        fetchVendors();
        if (selectedVendor?.id === id) setSelectedVendor(null);
      } else {
        const data = await res.json();
        alert(data.message || 'Failed to delete vendor');
      }
    } catch (err) {
      console.error('Failed to delete vendor', err);
    }
  };

  const filteredVendors = vendors.filter(v => {
    if (v.deletedAt) return false;
    const matchesSearch = v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.companyName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.phone.includes(searchQuery);
    const matchesStatus = statusFilter === 'All' || v.status === statusFilter;
    const matchesDistrict = districtFilter === 'All' || v.district === districtFilter;
    return matchesSearch && matchesStatus && matchesDistrict;
  });

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div>
          <h2 className="text-3xl font-black text-[#EAEAEA] tracking-tight">VENDOR MANAGEMENT</h2>
          <p className="text-secondary text-sm">Professional supplier and financial control system.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setShowAddVendorModal(true)}
            className="px-6 py-3 bg-indigo-500 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
          >
            <UserPlus size={18} />
            Add Vendor
          </button>
          <button 
            onClick={() => setShowAddPurchaseModal(true)}
            className="px-6 py-3 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all flex items-center gap-2 shadow-lg shadow-emerald-500/20"
          >
            <Plus size={18} />
            Add Purchase
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-card border border-white/5 rounded-2xl w-fit">
        {[
          { id: 'list', label: 'Vendor List', icon: Users },
          { id: 'purchases', label: 'Purchases', icon: ShoppingBag },
          { id: 'payments', label: 'Payments', icon: CreditCard },
          { id: 'reports', label: 'Reports', icon: PieChart },
          { id: 'settings', label: 'Settings', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as Tab)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
              activeTab === tab.id 
                ? 'bg-active text-white shadow-lg shadow-active/20' 
                : 'text-secondary hover:text-primary hover:bg-white/5'
            }`}
          >
            <tab.icon size={16} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <div className="space-y-8">
        {activeTab === 'list' && (
          <div className="grid grid-cols-12 gap-8">
            <div className="col-span-12 md:col-span-8 space-y-6">
              <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
                <div className="flex items-center justify-between">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                    <input 
                      type="text"
                      placeholder="Search Name, Company or Phone..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm text-[#EAEAEA] focus:outline-none focus:border-indigo-500/50"
                    />
                  </div>
                  <div className="flex items-center gap-2">
                    <select 
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-secondary outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Status</option>
                      <option value="Active">Active</option>
                      <option value="Inactive">Inactive</option>
                      <option value="Blocked">Blocked</option>
                    </select>
                    <select 
                      value={districtFilter}
                      onChange={(e) => setDistrictFilter(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-xs text-secondary outline-none focus:border-indigo-500"
                    >
                      <option value="All">All Districts</option>
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                    <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-secondary hover:text-primary transition-all">
                      <Download size={18} />
                    </button>
                  </div>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-white/5">
                        <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Vendor ID</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Vendor / Company</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Financials</th>
                        <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                        <th className="px-6 py-4 text-right text-[10px] font-bold text-secondary uppercase tracking-widest">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                      {filteredVendors.map(vendor => (
                        <tr 
                          key={vendor.id} 
                          onClick={() => setSelectedVendor(vendor)}
                          className={`hover:bg-white/[0.02] transition-colors cursor-pointer group ${selectedVendor?.id === vendor.id ? 'bg-white/5' : ''}`}
                        >
                          <td className="px-6 py-4">
                            <span className="text-xs font-mono font-bold text-indigo-400">{vendor.vendorId}</span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center font-bold">
                                {vendor.name.charAt(0)}
                              </div>
                              <div>
                                <div className="text-sm font-bold text-[#EAEAEA]">{vendor.name}</div>
                                <div className="text-[10px] text-secondary">{vendor.companyName}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="space-y-1">
                              <div className="text-xs text-[#EAEAEA] font-bold">৳{vendor.totalPurchaseAmount?.toLocaleString() || 0}</div>
                              <div className="text-[10px] text-rose-400 font-bold">Due: ৳{vendor.currentDue?.toLocaleString() || 0}</div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                              vendor.status === 'Active' ? 'bg-green-500/10 text-green-400 border-green-500/20' : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                            }`}>
                              {vendor.status}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <div className="flex items-center justify-end gap-2">
                              <button 
                                onClick={(e) => { e.stopPropagation(); setEditingVendor(vendor); setShowEditVendorModal(true); }}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg text-secondary hover:text-active transition-all"
                                title="Edit Vendor"
                              >
                                <Edit3 size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); handleDeleteVendor(vendor.id); }}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg text-secondary hover:text-rose-400 transition-all"
                                title="Delete Vendor"
                              >
                                <Trash2 size={14} />
                              </button>
                              <button 
                                onClick={(e) => { e.stopPropagation(); setSelectedVendor(vendor); setShowAddPaymentModal(true); }}
                                className="p-2 bg-white/5 border border-white/10 rounded-lg text-secondary hover:text-emerald-400 transition-all"
                                title="Add Payment"
                              >
                                <DollarSign size={14} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Side Profile Panel */}
            <div className="col-span-12 md:col-span-4">
              <AnimatePresence mode="wait">
                {selectedVendor ? (
                  <motion.div
                    key={selectedVendor.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="p-8 bg-card border border-white/5 rounded-[40px] space-y-8 sticky top-8"
                  >
                    <div className="space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <h3 className="text-2xl font-black text-[#EAEAEA]">{selectedVendor.name}</h3>
                          <p className="text-xs text-secondary">ID: {selectedVendor.vendorId} • Joined {new Date(selectedVendor.createdAt).toLocaleDateString()}</p>
                        </div>
                        <button className="p-2 bg-white/5 rounded-xl text-secondary hover:text-active transition-all">
                          <MoreHorizontal size={20} />
                        </button>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Total Purchase</div>
                          <div className="text-lg font-black text-indigo-400 mt-1">৳{selectedVendor?.totalPurchaseAmount?.toLocaleString() || 0}</div>
                        </div>
                        <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                          <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Current Due</div>
                          <div className="text-lg font-black text-rose-400 mt-1">৳{selectedVendor?.currentDue?.toLocaleString() || 0}</div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        <div className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Contact Information</div>
                        <div className="space-y-3">
                          <div className="flex items-center gap-3 text-sm text-[#EAEAEA]">
                            <Mail size={16} className="text-secondary" />
                            {selectedVendor.email || 'No Email'}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#EAEAEA]">
                            <Phone size={16} className="text-secondary" />
                            {selectedVendor.phone}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#EAEAEA]">
                            <MapPin size={16} className="text-secondary" />
                            {selectedVendor.address}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-[#EAEAEA]">
                            <Building2 size={16} className="text-secondary" />
                            {selectedVendor.companyName}
                          </div>
                        </div>
                      </div>

                      <div className="pt-6 border-t border-white/5 space-y-4">
                        <div className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Quick Actions</div>
                        <div className="grid grid-cols-2 gap-3">
                          <button 
                            onClick={() => { setEditingVendor(selectedVendor); setShowEditVendorModal(true); }}
                            className="py-3 bg-white/5 text-secondary border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          >
                            <Edit3 size={14} /> Edit Profile
                          </button>
                          <button 
                            onClick={() => handleDeleteVendor(selectedVendor.id)}
                            className="py-3 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Trash2 size={14} /> Delete
                          </button>
                          <button 
                            onClick={() => setShowAddPurchaseModal(true)}
                            className="py-3 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <Plus size={14} /> Purchase
                          </button>
                          <button 
                            onClick={() => setShowAddPaymentModal(true)}
                            className="py-3 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition-all flex items-center justify-center gap-2"
                          >
                            <DollarSign size={14} /> Payment
                          </button>
                          <button 
                            onClick={() => fetchLedger(selectedVendor.id)}
                            className="col-span-2 py-3 bg-white/5 text-secondary border border-white/10 rounded-xl text-xs font-bold hover:bg-white/10 transition-all flex items-center justify-center gap-2"
                          >
                            <History size={14} /> View Ledger Statement
                          </button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <div className="p-12 text-center space-y-4 bg-card border border-white/5 border-dashed rounded-[40px]">
                    <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <Users size={32} className="text-secondary opacity-20" />
                    </div>
                    <p className="text-sm text-secondary">Select a vendor to view full profile and financials.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {activeTab === 'purchases' && (
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#EAEAEA]">Purchase History</h3>
              <button 
                onClick={() => setShowAddPurchaseModal(true)}
                className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-xs font-bold hover:bg-emerald-600 transition-all flex items-center gap-2"
              >
                <Plus size={14} /> New Purchase
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Invoice</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Vendor</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Paid</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Due</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {purchases.map(purchase => (
                    <tr key={purchase.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#EAEAEA]">{new Date(purchase.purchaseDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm font-mono font-bold text-indigo-400">{purchase.invoiceNumber}</td>
                      <td className="px-6 py-4 text-sm text-[#EAEAEA]">{vendors.find(v => v.id === purchase.vendorId)?.name}</td>
                      <td className="px-6 py-4 text-sm font-bold text-[#EAEAEA]">৳{purchase.totalAmount?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4 text-sm text-emerald-400 font-bold">৳{purchase.paidAmount?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4 text-sm text-rose-400 font-bold">৳{purchase.dueAmount?.toLocaleString() || 0}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold text-[#EAEAEA]">Payment History</h3>
              <button 
                onClick={() => setShowAddPaymentModal(true)}
                className="px-4 py-2 bg-indigo-500 text-white rounded-xl text-xs font-bold hover:bg-indigo-600 transition-all flex items-center gap-2"
              >
                <Plus size={14} /> New Payment
              </button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-white/5">
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Vendor</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Amount</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Method</th>
                    <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Transaction ID</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {payments.map(payment => (
                    <tr key={payment.id} className="hover:bg-white/[0.02] transition-colors">
                      <td className="px-6 py-4 text-sm text-[#EAEAEA]">{new Date(payment.paymentDate).toLocaleDateString()}</td>
                      <td className="px-6 py-4 text-sm text-[#EAEAEA]">{vendors.find(v => v.id === payment.vendorId)?.name}</td>
                      <td className="px-6 py-4 text-sm font-bold text-emerald-400">৳{payment.amount?.toLocaleString() || 0}</td>
                      <td className="px-6 py-4 text-sm text-[#EAEAEA]">{payment.method}</td>
                      <td className="px-6 py-4 text-sm font-mono text-secondary">{payment.transactionId || 'N/A'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'reports' && reportSummary && (
          <div className="space-y-8">
            <div className="grid grid-cols-3 gap-6">
              <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-4">
                <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                  <ShoppingBag size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Total Purchases</p>
                  <h4 className="text-2xl font-black text-[#EAEAEA] mt-1">৳{reportSummary?.totalPurchases?.toLocaleString() || 0}</h4>
                </div>
              </div>
              <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-4">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
                  <DollarSign size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Total Paid</p>
                  <h4 className="text-2xl font-black text-[#EAEAEA] mt-1">৳{reportSummary?.totalPaid?.toLocaleString() || 0}</h4>
                </div>
              </div>
              <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-4">
                <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center">
                  <AlertCircle size={24} />
                </div>
                <div>
                  <p className="text-xs font-bold text-secondary uppercase tracking-widest">Total Outstanding Due</p>
                  <h4 className="text-2xl font-black text-[#EAEAEA] mt-1">৳{reportSummary?.totalDue?.toLocaleString() || 0}</h4>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8">
              <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA]">Top Vendors by Purchase</h3>
                <div className="space-y-4">
                  {reportSummary.topVendors.map((v: any, i: number) => (
                    <div key={v.id} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold text-secondary">0{i+1}</span>
                        <div className="text-sm font-bold text-[#EAEAEA]">{v.name}</div>
                      </div>
                      <div className="text-sm font-bold text-indigo-400">৳{v.totalPurchaseAmount?.toLocaleString() || 0}</div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA]">Monthly Purchase Summary</h3>
                <div className="space-y-4">
                  {Object.entries(reportSummary.monthlyPurchases).map(([month, amount]: any) => (
                    <div key={month} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="text-sm font-bold text-[#EAEAEA]">{month}</div>
                      <div className="text-sm font-bold text-emerald-400">৳{amount?.toLocaleString() || 0}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
        {activeTab === 'settings' && (
          <div className="grid grid-cols-2 gap-8">
            <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
              <h3 className="text-xl font-bold text-[#EAEAEA]">Vendor ID Configuration</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">ID Prefix</label>
                  <input 
                    type="text"
                    defaultValue="VND"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Next ID Number</label>
                  <input 
                    type="number"
                    defaultValue="0001"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
                <button className="w-full py-4 bg-indigo-500 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all">
                  Update ID Rules
                </button>
              </div>
            </div>
            <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
              <h3 className="text-xl font-bold text-[#EAEAEA]">Default Commission</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Global Commission (%)</label>
                  <input 
                    type="number"
                    defaultValue="10"
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
                <p className="text-xs text-secondary leading-relaxed">This commission will be applied to all new vendors by default. You can override this on a per-vendor basis.</p>
                <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-secondary hover:bg-white/10 transition-all">
                  Save Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {/* Edit Vendor Modal */}
        {showEditVendorModal && editingVendor && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowEditVendorModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-[32px] p-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-[#EAEAEA]">Edit Vendor: {editingVendor.vendorId}</h3>
                <button onClick={() => setShowEditVendorModal(false)} className="p-2 hover:bg-white/5 rounded-full text-secondary">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Vendor Name *</label>
                  <input 
                    type="text"
                    value={editingVendor.name}
                    onChange={(e) => setEditingVendor({...editingVendor, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Company Name</label>
                  <input 
                    type="text"
                    value={editingVendor.companyName}
                    onChange={(e) => setEditingVendor({...editingVendor, companyName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Mobile Number *</label>
                  <input 
                    type="text"
                    value={editingVendor.phone}
                    onChange={(e) => setEditingVendor({...editingVendor, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email"
                    value={editingVendor.email}
                    onChange={(e) => setEditingVendor({...editingVendor, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Full Address *</label>
                  <textarea 
                    value={editingVendor.address}
                    onChange={(e) => setEditingVendor({...editingVendor, address: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active h-20 resize-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">District *</label>
                  <select 
                    value={editingVendor.district}
                    onChange={(e) => setEditingVendor({...editingVendor, district: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Status</label>
                  <select 
                    value={editingVendor.status}
                    onChange={(e) => setEditingVendor({...editingVendor, status: e.target.value as any})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  >
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                    <option value="Blocked">Blocked</option>
                  </select>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setShowEditVendorModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-secondary hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleUpdateVendor}
                  className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Update Vendor
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Vendor Modal */}
        {showAddVendorModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddVendorModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#121212] border border-white/10 rounded-[32px] p-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-[#EAEAEA]">Add New Vendor</h3>
                <button onClick={() => setShowAddVendorModal(false)} className="p-2 hover:bg-white/5 rounded-full text-secondary">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Vendor Name *</label>
                  <input 
                    type="text"
                    value={newVendor.name}
                    onChange={(e) => setNewVendor({...newVendor, name: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                    placeholder="Full Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Company Name</label>
                  <input 
                    type="text"
                    value={newVendor.companyName}
                    onChange={(e) => setNewVendor({...newVendor, companyName: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                    placeholder="Business Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Mobile Number *</label>
                  <input 
                    type="text"
                    value={newVendor.phone}
                    onChange={(e) => setNewVendor({...newVendor, phone: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                    placeholder="01xxxxxxxxx"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Email Address</label>
                  <input 
                    type="email"
                    value={newVendor.email}
                    onChange={(e) => setNewVendor({...newVendor, email: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                    placeholder="vendor@example.com"
                  />
                </div>
                <div className="col-span-2 space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Full Address *</label>
                  <textarea 
                    value={newVendor.address}
                    onChange={(e) => setNewVendor({...newVendor, address: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active h-20 resize-none"
                    placeholder="Street, Area, Thana"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">District *</label>
                  <select 
                    value={newVendor.district}
                    onChange={(e) => setNewVendor({...newVendor, district: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  >
                    <option value="Dhaka">Dhaka</option>
                    <option value="Chattogram">Chattogram</option>
                    <option value="Rajshahi">Rajshahi</option>
                    <option value="Khulna">Khulna</option>
                    <option value="Barishal">Barishal</option>
                    <option value="Sylhet">Sylhet</option>
                    <option value="Rangpur">Rangpur</option>
                    <option value="Mymensingh">Mymensingh</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Opening Balance (Due)</label>
                  <input 
                    type="number"
                    value={newVendor.openingBalance}
                    onChange={(e) => setNewVendor({...newVendor, openingBalance: parseFloat(e.target.value)})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setShowAddVendorModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-secondary hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddVendor}
                  className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Save Vendor
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Purchase Modal */}
        {showAddPurchaseModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddPurchaseModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-4xl bg-[#121212] border border-white/10 rounded-[32px] p-8 overflow-y-auto max-h-[90vh] custom-scrollbar"
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className="text-2xl font-bold text-[#EAEAEA]">New Purchase Entry</h3>
                <button onClick={() => setShowAddPurchaseModal(false)} className="p-2 hover:bg-white/5 rounded-full text-secondary">
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-3 gap-6 mb-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Select Vendor *</label>
                  <select 
                    value={newPurchase.vendorId}
                    onChange={(e) => setNewPurchase({...newPurchase, vendorId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  >
                    <option value="">Choose Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name} ({v.companyName})</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Invoice Number *</label>
                  <input 
                    type="text"
                    value={newPurchase.invoiceNumber}
                    onChange={(e) => setNewPurchase({...newPurchase, invoiceNumber: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                    placeholder="INV-XXXX"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Purchase Date</label>
                  <input 
                    type="date"
                    value={newPurchase.purchaseDate}
                    onChange={(e) => setNewPurchase({...newPurchase, purchaseDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="space-y-4 mb-8">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Purchase Items</h4>
                  <button 
                    onClick={() => setNewPurchase({...newPurchase, items: [...newPurchase.items, { productId: '', name: '', quantity: 1, buyingPrice: 0, subtotal: 0 }]})}
                    className="text-xs font-bold text-active hover:underline flex items-center gap-1"
                  >
                    <Plus size={14} /> Add Item
                  </button>
                </div>
                <div className="space-y-3">
                  {newPurchase.items.map((item: any, idx: number) => (
                    <div key={idx} className="grid grid-cols-12 gap-4 items-end">
                      <div className="col-span-4 space-y-2">
                        <select 
                          value={item.productId}
                          onChange={(e) => {
                            const prod = products.find(p => p.id === e.target.value);
                            const updatedItems = [...newPurchase.items];
                            updatedItems[idx] = { ...item, productId: e.target.value, name: prod?.name || '' };
                            setNewPurchase({...newPurchase, items: updatedItems});
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                        >
                          <option value="">Select Product</option>
                          {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="col-span-2 space-y-2">
                        <input 
                          type="number"
                          value={item.quantity}
                          onChange={(e) => {
                            const qty = parseInt(e.target.value) || 0;
                            const updatedItems = [...newPurchase.items];
                            updatedItems[idx] = { ...item, quantity: qty, subtotal: qty * item.buyingPrice };
                            setNewPurchase({...newPurchase, items: updatedItems});
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                          placeholder="Qty"
                        />
                      </div>
                      <div className="col-span-3 space-y-2">
                        <input 
                          type="number"
                          value={item.buyingPrice}
                          onChange={(e) => {
                            const price = parseFloat(e.target.value) || 0;
                            const updatedItems = [...newPurchase.items];
                            updatedItems[idx] = { ...item, buyingPrice: price, subtotal: item.quantity * price };
                            setNewPurchase({...newPurchase, items: updatedItems});
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                          placeholder="Buying Price"
                        />
                      </div>
                      <div className="col-span-2 space-y-2">
                        <div className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-secondary">
                          ৳{item.subtotal?.toLocaleString() || 0}
                        </div>
                      </div>
                      <div className="col-span-1 pb-2">
                        <button 
                          onClick={() => {
                            const updatedItems = newPurchase.items.filter((_: any, i: number) => i !== idx);
                            setNewPurchase({...newPurchase, items: updatedItems});
                          }}
                          className="p-2 text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Summary */}
              <div className="grid grid-cols-2 gap-12 pt-8 border-t border-white/5">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Payment Method</label>
                    <select 
                      value={newPurchase.paymentMethod}
                      onChange={(e) => setNewPurchase({...newPurchase, paymentMethod: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                    >
                      <option value="Cash">Cash</option>
                      <option value="Bank">Bank Transfer</option>
                      <option value="bKash">bKash</option>
                      <option value="Nagad">Nagad</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Note</label>
                    <textarea 
                      value={newPurchase.note}
                      onChange={(e) => setNewPurchase({...newPurchase, note: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active h-20 resize-none"
                    />
                  </div>
                </div>
                <div className="space-y-3 bg-white/5 p-6 rounded-3xl border border-white/5">
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary">Subtotal</span>
                    <span className="font-bold text-[#EAEAEA]">৳{newPurchase.items.reduce((acc: number, item: any) => acc + (item.subtotal || 0), 0).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-secondary">VAT (+)</span>
                    <input 
                      type="number"
                      value={newPurchase.vat}
                      onChange={(e) => setNewPurchase({...newPurchase, vat: parseFloat(e.target.value) || 0})}
                      className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-sm text-[#EAEAEA]"
                    />
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-secondary">Discount (-)</span>
                    <input 
                      type="number"
                      value={newPurchase.discount}
                      onChange={(e) => setNewPurchase({...newPurchase, discount: parseFloat(e.target.value) || 0})}
                      className="w-24 bg-white/5 border border-white/10 rounded-lg px-2 py-1 text-right text-sm text-[#EAEAEA]"
                    />
                  </div>
                  <div className="flex justify-between text-lg font-black pt-3 border-t border-white/10">
                    <span className="text-[#EAEAEA]">Total Amount</span>
                    <span className="text-indigo-400">৳{(newPurchase.items.reduce((acc: number, item: any) => acc + (item.subtotal || 0), 0) + (newPurchase.vat || 0) - (newPurchase.discount || 0)).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center pt-2">
                    <span className="text-emerald-400 font-bold">Paid Amount</span>
                    <input 
                      type="number"
                      value={newPurchase.paidAmount}
                      onChange={(e) => setNewPurchase({...newPurchase, paidAmount: parseFloat(e.target.value) || 0})}
                      className="w-32 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 text-right text-sm text-emerald-400 font-bold"
                    />
                  </div>
                  <div className="flex justify-between text-sm font-bold text-rose-400 pt-2">
                    <span>Due Amount</span>
                    <span>৳{(newPurchase.items.reduce((acc: number, item: any) => acc + (item.subtotal || 0), 0) + (newPurchase.vat || 0) - (newPurchase.discount || 0) - (newPurchase.paidAmount || 0)).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <div className="flex gap-4 mt-10">
                <button 
                  onClick={() => setShowAddPurchaseModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-secondary hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddPurchase}
                  className="flex-1 py-4 bg-emerald-500 text-white rounded-2xl text-sm font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                >
                  Save Purchase & Update Stock
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Add Payment Modal */}
        {showAddPaymentModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAddPaymentModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-md bg-[#121212] border border-white/10 rounded-[32px] p-8 space-y-6"
            >
              <h3 className="text-2xl font-bold text-[#EAEAEA]">Add Vendor Payment</h3>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Select Vendor *</label>
                  <select 
                    value={newPayment.vendorId || selectedVendor?.id || ''}
                    onChange={(e) => setNewPayment({...newPayment, vendorId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  >
                    <option value="">Choose Vendor</option>
                    {vendors.map(v => <option key={v.id} value={v.id}>{v.name}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Payment Date</label>
                  <input 
                    type="date"
                    value={newPayment.paymentDate}
                    onChange={(e) => setNewPayment({...newPayment, paymentDate: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Payment Amount *</label>
                  <input 
                    type="number"
                    value={newPayment.amount}
                    onChange={(e) => setNewPayment({...newPayment, amount: parseFloat(e.target.value) || 0})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                    placeholder="0.00"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Payment Method</label>
                  <select 
                    value={newPayment.method}
                    onChange={(e) => setNewPayment({...newPayment, method: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                  >
                    <option value="Cash">Cash</option>
                    <option value="Bank">Bank Transfer</option>
                    <option value="bKash">bKash</option>
                    <option value="Nagad">Nagad</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Transaction ID</label>
                  <input 
                    type="text"
                    value={newPayment.transactionId}
                    onChange={(e) => setNewPayment({...newPayment, transactionId: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active"
                    placeholder="Optional"
                  />
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  onClick={() => setShowAddPaymentModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-secondary hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAddPayment}
                  className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl text-sm font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Confirm Payment
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {/* Ledger Modal */}
        {showLedgerModal && (
          <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowLedgerModal(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-5xl bg-[#121212] border border-white/10 rounded-[40px] p-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between mb-8 shrink-0">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                    <FileText size={24} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-[#EAEAEA]">Vendor Ledger Statement</h3>
                    <p className="text-xs text-secondary">Detailed financial history for {vendors.find(v => v.id === ledgerEntries[0]?.vendorId)?.name}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-secondary hover:text-primary transition-all">
                    <Printer size={18} />
                  </button>
                  <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-secondary hover:text-primary transition-all">
                    <Download size={18} />
                  </button>
                  <button onClick={() => setShowLedgerModal(false)} className="p-3 hover:bg-white/5 rounded-full text-secondary">
                    <X size={24} />
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto custom-scrollbar pr-2">
                <table className="w-full text-left border-collapse">
                  <thead className="sticky top-0 bg-[#121212] z-10">
                    <tr className="border-b border-white/10">
                      <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Reference</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Type</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Debit (+)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Credit (-)</th>
                      <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest text-right">Balance</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {ledgerEntries.map(entry => (
                      <tr key={entry.id} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-sm text-secondary">{new Date(entry.date).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-sm font-mono font-bold text-[#EAEAEA]">{entry.reference}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                            entry.type === 'Purchase' ? 'bg-indigo-500/10 text-indigo-400' : 
                            entry.type === 'Payment' ? 'bg-emerald-500/10 text-emerald-400' : 
                            'bg-white/5 text-secondary'
                          }`}>
                            {entry.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-rose-400 text-right">
                          {entry.debit > 0 ? `৳${entry.debit?.toLocaleString() || 0}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-bold text-emerald-400 text-right">
                          {entry.credit > 0 ? `৳${entry.credit?.toLocaleString() || 0}` : '-'}
                        </td>
                        <td className="px-6 py-4 text-sm font-black text-[#EAEAEA] text-right">৳{entry.balance?.toLocaleString() || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="mt-8 p-6 bg-white/5 rounded-3xl border border-white/5 flex justify-between items-center shrink-0">
                <div className="flex gap-8">
                  <div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Total Debit</div>
                    <div className="text-lg font-bold text-rose-400">৳{ledgerEntries.reduce((acc, e) => acc + (e.debit || 0), 0).toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Total Credit</div>
                    <div className="text-lg font-bold text-emerald-400">৳{ledgerEntries.reduce((acc, e) => acc + (e.credit || 0), 0).toLocaleString()}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Closing Balance (Due)</div>
                  <div className="text-2xl font-black text-indigo-400">৳{ledgerEntries[ledgerEntries.length - 1]?.balance.toLocaleString() || 0}</div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
