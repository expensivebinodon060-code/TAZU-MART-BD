import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  TrendingUp, 
  ShoppingCart, 
  DollarSign, 
  Percent, 
  History, 
  BarChart3, 
  Users, 
  Package, 
  Store, 
  FileText, 
  Download, 
  Filter, 
  Search, 
  Calendar, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  PieChart, 
  Activity,
  FileDown,
  FileSpreadsheet
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
  PieChart as RePieChart,
  Pie
} from 'recharts';
import { 
  ReportSummary, 
  SalesReportRecord, 
  ProductReportRecord, 
  CustomerReportRecord, 
  SellerReportRecord 
} from '../../types';

type ReportTab = 
  | 'overview' 
  | 'sales' 
  | 'orders' 
  | 'products' 
  | 'customers' 
  | 'sellers' 
  | 'finance' 
  | 'marketing' 
  | 'inventory';

export default function ReportsCenter() {
  const [activeTab, setActiveTab] = useState<ReportTab>('overview');
  const [dateRange, setDateRange] = useState('Last 30 Days');
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = async (format: 'pdf' | 'excel') => {
    setIsExporting(true);
    try {
      const res = await fetch(`/api/admin/reports/export/${format}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: activeTab, dateRange })
      });
      const data = await res.json();
      if (data.success) {
        alert(data.message);
      }
    } catch (err) {
      console.error('Export failed', err);
      alert('Export failed. Please try again.');
    } finally {
      setIsExporting(false);
    }
  };

  // Mock Data
  const summary: ReportSummary = {
    totalSales: 1540000,
    totalOrders: 2840,
    totalRevenue: 1254800,
    totalCommission: 185000,
    totalRefunds: 12500,
    totalProfit: 95400,
    pendingOrders: 145,
    cancelledOrders: 32,
    returnRate: 2.1
  };

  const chartData = [
    { name: 'Mon', sales: 45000, revenue: 38000 },
    { name: 'Tue', sales: 52000, revenue: 44000 },
    { name: 'Wed', sales: 48000, revenue: 41000 },
    { name: 'Thu', sales: 61000, revenue: 52000 },
    { name: 'Fri', sales: 55000, revenue: 47000 },
    { name: 'Sat', sales: 72000, revenue: 61000 },
    { name: 'Sun', sales: 68000, revenue: 58000 },
  ];

  const categoryData = [
    { name: 'Electronics', value: 45 },
    { name: 'Fashion', value: 30 },
    { name: 'Home', value: 15 },
    { name: 'Beauty', value: 10 },
  ];

  const COLORS = ['#6366F1', '#10B981', '#F59E0B', '#EF4444'];

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
        {[
          { label: 'Total Sales', value: `৳ ${summary.totalSales?.toLocaleString() || 0}`, icon: ShoppingCart, color: 'text-indigo-400', trend: '+12%' },
          { label: 'Total Revenue', value: `৳ ${summary.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-emerald-400', trend: '+8%' },
          { label: 'Total Commission', value: `৳ ${summary.totalCommission?.toLocaleString() || 0}`, icon: Percent, color: 'text-blue-400', trend: '+5%' },
          { label: 'Total Profit', value: `৳ ${summary.totalProfit?.toLocaleString() || 0}`, icon: TrendingUp, color: 'text-indigo-400', trend: '+15%' },
          { label: 'Return Rate', value: `${summary.returnRate}%`, icon: History, color: 'text-rose-400', trend: '-0.5%' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card border border-white/5 rounded-[32px] space-y-4 group hover:border-white/10 transition-all">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className={`flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-full ${
                stat.trend.startsWith('+') ? 'text-emerald-400 bg-emerald-500/10' : 'text-rose-400 bg-rose-500/10'
              }`}>
                {stat.trend.startsWith('+') ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                {stat.trend}
              </div>
            </div>
            <div>
              <div className="text-xs text-secondary font-medium">{stat.label}</div>
              <div className="text-2xl font-bold text-[#EAEAEA] mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Sales Trend */}
        <div className="lg:col-span-2 p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-[#EAEAEA]">Sales & Revenue Trend</h3>
              <p className="text-xs text-secondary">Daily performance tracking.</p>
            </div>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#8E9299', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E9299', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#1A1A1A', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="sales" stroke="#6366F1" fillOpacity={1} fill="url(#colorSales)" strokeWidth={3} />
                <Area type="monotone" dataKey="revenue" stroke="#10B981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Distribution */}
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-8">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Top Categories</h3>
          <div className="h-[200px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <RePieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </RePieChart>
            </ResponsiveContainer>
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#EAEAEA]">45%</div>
                <div className="text-[10px] text-secondary uppercase font-bold">Electronics</div>
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {categoryData.map((cat, i) => (
              <div key={i} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }} />
                  <span className="text-xs text-secondary font-medium">{cat.name}</span>
                </div>
                <span className="text-xs font-bold text-[#EAEAEA]">{cat.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderSales = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA]">Sales Reports</h2>
          <p className="text-sm text-secondary">Detailed breakdown of all sales transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => handleExport('pdf')}
            disabled={isExporting}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-secondary hover:bg-white/10 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FileDown size={18} />
            Export PDF
          </button>
          <button 
            onClick={() => handleExport('excel')}
            disabled={isExporting}
            className="px-6 py-3 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2 disabled:opacity-50"
          >
            <FileSpreadsheet size={18} />
            Export Excel
          </button>
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text"
              placeholder="Search by Order ID or Seller..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-active transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-secondary hover:text-active transition-all">
              <Filter size={18} />
            </button>
            <select className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-secondary outline-none focus:border-active transition-all">
              <option>All Status</option>
              <option>Delivered</option>
              <option>Processing</option>
              <option>Cancelled</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Seller</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Comm.</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Profit</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-secondary uppercase tracking-widest">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { id: 'ORD-7829', customer: 'Rahat Khan', seller: 'Fashion Hub', amount: 2450, comm: 245, profit: 120, status: 'Delivered', date: '2026-02-27' },
                { id: 'ORD-7830', customer: 'Anika Ahmed', seller: 'Gadget Store', amount: 12500, comm: 1250, profit: 625, status: 'Processing', date: '2026-02-28' },
                { id: 'ORD-7831', customer: 'Samiul Islam', seller: 'Home Decor', amount: 4800, comm: 480, profit: 240, status: 'Delivered', date: '2026-02-27' },
              ].map((sale, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-[#EAEAEA]">{sale.id}</div>
                    <div className="text-[10px] text-secondary mt-0.5">{sale.customer}</div>
                  </td>
                  <td className="px-6 py-4 text-xs text-secondary font-medium">{sale.seller}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#EAEAEA]">৳ {sale.amount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-sm font-bold text-indigo-400">৳ {sale.comm?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-400">৳ {sale.profit?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      sale.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      {sale.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right text-xs text-secondary">{sale.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderProducts = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA]">Product Performance</h2>
          <p className="text-sm text-secondary">Track best sellers, stock levels, and return rates.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Best Selling', value: 'Wireless Earbuds', sub: '452 Units Sold', icon: Package, color: 'text-indigo-400' },
          { label: 'Low Stock', value: '12 Products', sub: 'Requires immediate restock', icon: Activity, color: 'text-amber-400' },
          { label: 'Most Returned', value: 'Cotton T-Shirt', sub: '5.2% Return Rate', icon: History, color: 'text-rose-400' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card border border-white/5 rounded-[32px] flex items-center justify-between">
            <div>
              <div className="text-xs text-secondary font-medium">{stat.label}</div>
              <div className="text-lg font-bold text-[#EAEAEA] mt-1">{stat.value}</div>
              <div className="text-[10px] text-secondary mt-0.5">{stat.sub}</div>
            </div>
            <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Product Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">SKU</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Sold</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Revenue</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Return Rate</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Stock</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {[
                { name: 'Wireless Earbuds X1', sku: 'EAR-001', sold: 452, revenue: 1130000, returns: 1.2, stock: 45 },
                { name: 'Cotton T-Shirt Blue', sku: 'TSH-002', sold: 320, revenue: 64000, returns: 5.2, stock: 12 },
                { name: 'Smart Watch Pro', sku: 'WAT-005', sold: 185, revenue: 925000, returns: 0.8, stock: 8 },
              ].map((prod, i) => (
                <tr key={i} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-[#EAEAEA]">{prod.name}</td>
                  <td className="px-6 py-4 text-xs text-secondary font-mono">{prod.sku}</td>
                  <td className="px-6 py-4 text-sm font-bold text-[#EAEAEA]">{prod.sold}</td>
                  <td className="px-6 py-4 text-sm font-bold text-emerald-400">৳ {prod.revenue?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-xs text-rose-400 font-bold">{prod.returns}%</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      prod.stock < 15 ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {prod.stock} Units
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'sales': return renderSales();
      case 'products': return renderProducts();
      default:
        return (
          <div className="p-20 text-center space-y-4 bg-card border border-white/5 rounded-[40px]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <BarChart3 size={40} className="text-secondary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Reports</h2>
            <p className="text-secondary text-sm">This reporting module is currently aggregating data for enterprise analytics.</p>
          </div>
        );
    }
  };

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-active/10 text-active rounded-2xl flex items-center justify-center">
            <BarChart3 size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#EAEAEA]">Reports & Analytics</h1>
            <p className="text-sm text-secondary">TAZU MART BD-grade business intelligence and operational reporting.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-card border border-white/5 rounded-2xl px-4 py-2">
            <Calendar size={16} className="text-secondary" />
            <span className="text-xs font-bold text-[#EAEAEA]">{dateRange}</span>
          </div>
          <button className="p-3 bg-card border border-white/5 rounded-2xl text-secondary hover:text-active transition-all">
            <Download size={20} />
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 bg-card border border-white/5 p-2 rounded-[24px] overflow-x-auto no-scrollbar">
        {[
          { id: 'overview', label: 'Overview', icon: PieChart },
          { id: 'sales', label: 'Sales', icon: TrendingUp },
          { id: 'orders', label: 'Orders', icon: ShoppingCart },
          { id: 'products', label: 'Products', icon: Package },
          { id: 'customers', label: 'Customers', icon: Users },
          { id: 'sellers', label: 'Sellers', icon: Store },
          { id: 'finance', label: 'Finance', icon: DollarSign },
          { id: 'marketing', label: 'Marketing', icon: Percent },
          { id: 'inventory', label: 'Inventory', icon: Activity },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as ReportTab)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
              activeTab === tab.id 
                ? 'bg-active text-white shadow-lg shadow-active/20' 
                : 'text-secondary hover:bg-white/5 hover:text-primary'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative">
        {renderContent()}
      </div>
    </div>
  );
}
