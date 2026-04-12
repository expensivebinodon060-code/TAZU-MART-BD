import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  DollarSign, 
  TrendingUp, 
  PieChart, 
  ArrowUpRight, 
  ArrowDownRight, 
  Wallet, 
  CreditCard, 
  Receipt, 
  FileText, 
  History, 
  Settings, 
  Download, 
  Filter, 
  Search, 
  Plus, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  AlertCircle,
  MoreVertical,
  Calendar,
  ChevronRight,
  ShoppingCart,
  Users,
  Percent,
  Banknote,
  ShieldCheck,
  FileSpreadsheet,
  FileDown,
  Smartphone,
  RefreshCw
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
  Cell
} from 'recharts';
import { 
  OrderRevenue, 
  CommissionRule, 
  PayoutRequest, 
  ExpenseRecord, 
  FinancialTransaction,
  FinanceAnalytics 
} from '../../types';

type FinanceTab = 
  | 'overview' 
  | 'revenue' 
  | 'commission' 
  | 'payouts' 
  | 'expenses' 
  | 'refunds' 
  | 'reports' 
  | 'audit';

export default function FinanceCenter() {
  const [activeTab, setActiveTab] = useState<FinanceTab>('overview');
  const [dateRange, setDateRange] = useState('Last 30 Days');

  // Mock Data
  const analytics: FinanceAnalytics = {
    totalRevenue: 1254800,
    totalOrdersValue: 1540000,
    totalCommission: 185000,
    netProfit: 95400,
    pendingPayout: 45000,
    completedPayout: 120000,
    refundAmount: 12500,
    codPending: 32000,
    revenueGrowth: [
      { date: '01 Feb', revenue: 45000, commission: 5400 },
      { date: '05 Feb', revenue: 52000, commission: 6200 },
      { date: '10 Feb', revenue: 48000, commission: 5800 },
      { date: '15 Feb', revenue: 61000, commission: 7300 },
      { date: '20 Feb', revenue: 55000, commission: 6600 },
      { date: '25 Feb', revenue: 72000, commission: 8600 },
      { date: '28 Feb', revenue: 68000, commission: 8100 },
    ]
  };

  const revenueList: OrderRevenue[] = [
    {
      id: 'REV-101',
      orderId: 'ORD-7829',
      customerName: 'Rahat Khan',
      sellerName: 'Fashion Hub',
      orderAmount: 2450,
      deliveryCharge: 60,
      discount: 200,
      tax: 120,
      commission: 245,
      netReceivable: 1945,
      paymentStatus: 'Paid',
      revenueStatus: 'Completed',
      createdAt: '2026-02-27 14:30'
    },
    {
      id: 'REV-102',
      orderId: 'ORD-7830',
      customerName: 'Anika Ahmed',
      sellerName: 'Gadget Store',
      orderAmount: 12500,
      deliveryCharge: 100,
      discount: 500,
      tax: 625,
      commission: 1250,
      netReceivable: 10225,
      paymentStatus: 'Pending',
      revenueStatus: 'Pending',
      createdAt: '2026-02-28 09:15'
    }
  ];

  const payoutRequests: PayoutRequest[] = [
    {
      id: 'PAY-501',
      sellerId: 'SEL-001',
      sellerName: 'Fashion Hub',
      amount: 15000,
      method: 'Bank',
      status: 'Pending',
      requestedAt: '2026-02-28 10:00'
    },
    {
      id: 'PAY-502',
      sellerId: 'SEL-005',
      sellerName: 'Tech World',
      amount: 8500,
      method: 'bKash',
      status: 'Completed',
      requestedAt: '2026-02-25 11:30',
      processedAt: '2026-02-26 14:00',
      transactionId: 'BK-992831'
    }
  ];

  const renderOverview = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Revenue', value: `৳ ${analytics.totalRevenue?.toLocaleString() || 0}`, icon: DollarSign, color: 'text-emerald-600', trend: '+12.5%' },
          { label: 'Total Commission', value: `৳ ${analytics.totalCommission?.toLocaleString() || 0}`, icon: Percent, color: 'text-blue-600', trend: '+8.2%' },
          { label: 'Net Profit', value: `৳ ${analytics.netProfit?.toLocaleString() || 0}`, icon: TrendingUp, color: 'text-indigo-600', trend: '+5.4%' },
          { label: 'Refund Amount', value: `৳ ${analytics.refundAmount?.toLocaleString() || 0}`, icon: ArrowDownRight, color: 'text-rose-600', trend: '-2.1%' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-surface border border-border rounded-[32px] space-y-4 group hover:border-border transition-all">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-hover/30 ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">
                <ArrowUpRight size={12} />
                {stat.trend}
              </div>
            </div>
            <div>
              <div className="text-xs text-muted font-medium">{stat.label}</div>
              <div className="text-2xl font-bold text-primary mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Revenue Chart */}
        <div className="lg:col-span-2 p-8 bg-surface border border-border rounded-[40px] space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-bold text-primary">Revenue Growth</h3>
              <p className="text-xs text-muted">Daily revenue vs commission tracking.</p>
            </div>
            <select className="bg-hover border border-border rounded-xl px-4 py-2 text-xs font-bold text-muted outline-none focus:border-active transition-all">
              <option>Last 7 Days</option>
              <option>Last 30 Days</option>
              <option>This Month</option>
            </select>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={analytics.revenueGrowth}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366F1" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#6366F1" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(0,0,0,0.05)" vertical={false} />
                <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#8E9299', fontSize: 10 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#8E9299', fontSize: 10 }} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid rgba(0,0,0,0.1)', borderRadius: '12px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)' }}
                  itemStyle={{ fontSize: '12px' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#6366F1" fillOpacity={1} fill="url(#colorRev)" strokeWidth={3} />
                <Area type="monotone" dataKey="commission" stroke="#10B981" fill="transparent" strokeWidth={2} strokeDasharray="5 5" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Payout Summary */}
        <div className="p-8 bg-surface border border-border rounded-[40px] space-y-8">
          <h3 className="text-lg font-bold text-primary">Payout Summary</h3>
          <div className="space-y-6">
            <div className="p-6 bg-hover/30 border border-border rounded-[32px] space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted">Pending Payouts</div>
                <div className="w-8 h-8 bg-amber-500/10 text-amber-600 rounded-lg flex items-center justify-center">
                  <Clock size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">৳ {analytics.pendingPayout?.toLocaleString() || 0}</div>
              <div className="w-full bg-hover h-1.5 rounded-full overflow-hidden">
                <div className="bg-amber-500 h-full w-[40%]" />
              </div>
            </div>

            <div className="p-6 bg-hover/30 border border-border rounded-[32px] space-y-4">
              <div className="flex items-center justify-between">
                <div className="text-xs text-muted">Completed Payouts</div>
                <div className="w-8 h-8 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center">
                  <CheckCircle2 size={16} />
                </div>
              </div>
              <div className="text-2xl font-bold text-primary">৳ {analytics.completedPayout?.toLocaleString() || 0}</div>
              <div className="w-full bg-hover h-1.5 rounded-full overflow-hidden">
                <div className="bg-emerald-500 h-full w-[85%]" />
              </div>
            </div>

            <button 
              onClick={() => setActiveTab('payouts')}
              className="w-full py-4 bg-active text-white rounded-2xl font-bold text-sm hover:bg-active/90 transition-all flex items-center justify-center gap-2"
            >
              Manage Payouts
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderRevenue = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Revenue Management</h2>
          <p className="text-sm text-muted">Detailed breakdown of order-wise revenue and commissions.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 bg-hover border border-border rounded-2xl text-sm font-bold text-muted hover:bg-border transition-all flex items-center gap-2">
            <FileDown size={18} />
            Export CSV
          </button>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-[40px] overflow-hidden">
        <div className="p-6 border-b border-border flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text"
              placeholder="Search by Order ID or Customer..."
              className="w-full bg-hover border border-border rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-active transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-hover border border-border rounded-xl text-muted hover:text-active transition-all">
              <Filter size={18} />
            </button>
            <select className="bg-hover border border-border rounded-xl px-4 py-3 text-sm font-bold text-muted outline-none focus:border-active transition-all">
              <option>All Status</option>
              <option>Completed</option>
              <option>Pending</option>
              <option>Refunded</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Order Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Seller</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Amount Details</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Commission</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Net Receivable</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-muted uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {revenueList.map((rev) => (
                <tr key={rev.id} className="hover:bg-hover transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-primary">{rev.orderId}</div>
                    <div className="text-[10px] text-muted mt-0.5">{rev.customerName}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs text-muted font-medium">{rev.sellerName || 'Direct Store'}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-primary">৳ {rev.orderAmount?.toLocaleString() || 0}</div>
                    <div className="text-[10px] text-muted mt-0.5">Tax: ৳{rev.tax} • Disc: ৳{rev.discount}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-indigo-600">৳ {rev.commission?.toLocaleString() || 0}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-emerald-600">৳ {rev.netReceivable?.toLocaleString() || 0}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      rev.revenueStatus === 'Completed' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' :
                      rev.revenueStatus === 'Pending' ? 'bg-amber-500/10 text-amber-600 border-amber-500/20' :
                      'bg-rose-500/10 text-rose-600 border-rose-500/20'
                    }`}>
                      {rev.revenueStatus}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-hover rounded-lg text-muted hover:text-active transition-all">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderPayouts = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Payout Management</h2>
          <p className="text-sm text-muted">Review and process seller withdrawal requests.</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="px-6 py-3 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2">
            <Plus size={18} />
            Manual Payout
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-[40px] overflow-hidden">
            <div className="p-6 border-b border-border flex items-center justify-between">
              <h3 className="text-sm font-bold text-primary">Pending Requests</h3>
              <span className="px-2 py-1 bg-amber-500/10 text-amber-600 rounded-lg text-[10px] font-black uppercase">
                {payoutRequests.filter(p => p.status === 'Pending').length} Pending
              </span>
            </div>
            <div className="divide-y divide-border">
              {payoutRequests.map((pay) => (
                <div key={pay.id} className="p-6 flex items-center justify-between hover:bg-hover transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-hover rounded-2xl flex items-center justify-center text-muted">
                      {pay.method === 'Bank' ? <Banknote size={24} /> : <Smartphone size={24} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">{pay.sellerName}</div>
                      <div className="text-[10px] text-muted mt-0.5">Method: {pay.method} • {pay.requestedAt}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-8">
                    <div className="text-right">
                      <div className="text-sm font-bold text-primary">৳ {pay.amount?.toLocaleString() || 0}</div>
                      <div className={`text-[10px] font-bold mt-0.5 ${
                        pay.status === 'Completed' ? 'text-emerald-600' : 'text-amber-600'
                      }`}>{pay.status}</div>
                    </div>
                    {pay.status === 'Pending' && (
                      <div className="flex items-center gap-2">
                        <button className="p-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl hover:bg-emerald-500/20 transition-all">
                          <CheckCircle2 size={18} />
                        </button>
                        <button className="p-2 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl hover:bg-rose-500/20 transition-all">
                          <XCircle size={18} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-8 bg-surface border border-border rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-primary">Payout Methods</h3>
            <div className="space-y-4">
              {[
                { name: 'Bank Transfer', status: 'Active', icon: Banknote, color: 'text-blue-600' },
                { name: 'bKash Merchant', status: 'Active', icon: Smartphone, color: 'text-[#D12053]' },
                { name: 'Nagad Merchant', status: 'Active', icon: Smartphone, color: 'text-[#F27D26]' },
                { name: 'Manual Cash', status: 'Inactive', icon: Wallet, color: 'text-muted' },
              ].map((method) => (
                <div key={method.name} className="flex items-center justify-between p-4 bg-hover border border-border rounded-2xl">
                  <div className="flex items-center gap-3">
                    <method.icon size={20} className={method.color} />
                    <span className="text-xs font-bold text-primary">{method.name}</span>
                  </div>
                  <span className={`text-[8px] font-black uppercase tracking-widest ${
                    method.status === 'Active' ? 'text-emerald-600' : 'text-muted'
                  }`}>{method.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderCommission = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Commission Management</h2>
          <p className="text-sm text-muted">Set and manage platform commission rules for sellers and categories.</p>
        </div>
        <button className="px-6 py-3 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2">
          <Plus size={18} />
          Add New Rule
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-surface border border-border rounded-[40px] overflow-hidden">
          <div className="p-6 border-b border-border">
            <h3 className="text-sm font-bold text-primary">Active Commission Rules</h3>
          </div>
          <div className="divide-y divide-border">
            {[
              { name: 'Global Standard', type: 'Percentage', value: '10%', target: 'All Sellers', status: 'Active' },
              { name: 'Electronics Category', type: 'Percentage', value: '15%', target: 'Electronics', status: 'Active' },
              { name: 'VIP Seller Discount', type: 'Fixed', value: '৳ 50', target: 'Top Sellers', status: 'Active' },
              { name: 'Tiered Growth', type: 'Tiered', value: '5-12%', target: 'New Sellers', status: 'Inactive' },
            ].map((rule, i) => (
              <div key={i} className="p-6 flex items-center justify-between hover:bg-hover transition-colors">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-600 rounded-xl flex items-center justify-center">
                    <Percent size={20} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary">{rule.name}</div>
                    <div className="text-[10px] text-muted mt-0.5">{rule.type} • Target: {rule.target}</div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="text-right">
                    <div className="text-sm font-bold text-active">{rule.value}</div>
                    <div className={`text-[8px] font-black uppercase tracking-widest mt-1 ${
                      rule.status === 'Active' ? 'text-emerald-600' : 'text-muted'
                    }`}>{rule.status}</div>
                  </div>
                  <button className="p-2 hover:bg-hover rounded-lg text-muted">
                    <MoreVertical size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-surface border border-border rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-primary">Quick Calculator</h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Order Amount</label>
              <input type="number" placeholder="Enter amount..." className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Select Rule</label>
              <select className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all">
                <option>Global Standard (10%)</option>
                <option>Electronics (15%)</option>
              </select>
            </div>
            <div className="p-4 bg-active/5 border border-active/10 rounded-2xl space-y-2">
              <div className="flex justify-between text-xs text-muted">
                <span>Commission:</span>
                <span className="font-bold text-active">৳ 0</span>
              </div>
              <div className="flex justify-between text-xs text-muted">
                <span>Seller Receives:</span>
                <span className="font-bold text-emerald-600">৳ 0</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderExpenses = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">Expense Tracking</h2>
          <p className="text-sm text-muted">Monitor operational costs, marketing spend, and subsidies.</p>
        </div>
        <button className="px-6 py-3 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all flex items-center gap-2 shadow-lg shadow-rose-500/20">
          <Plus size={18} />
          Record Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Marketing Spend', value: '৳ 45,000', color: 'text-blue-600' },
          { label: 'Gateway Charges', value: '৳ 12,400', color: 'text-amber-600' },
          { label: 'Shipping Subsidies', value: '৳ 8,200', color: 'text-indigo-600' },
        ].map((ex, i) => (
          <div key={i} className="p-6 bg-surface border border-border rounded-[32px] flex items-center justify-between">
            <div>
              <div className="text-xs text-muted font-medium">{ex.label}</div>
              <div className={`text-xl font-bold mt-1 ${ex.color}`}>{ex.value}</div>
            </div>
            <div className="w-10 h-10 bg-hover rounded-xl flex items-center justify-center text-muted">
              <Receipt size={20} />
            </div>
          </div>
        ))}
      </div>

      <div className="bg-surface border border-border rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Expense Title</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Category</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Date</th>
                <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Recorded By</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-muted uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {[
                { title: 'Facebook Ads - Feb', cat: 'Marketing', amount: 25000, date: '2026-02-20', user: 'Admin' },
                { title: 'SSL Renewal', cat: 'Operational', amount: 5000, date: '2026-02-15', user: 'System' },
                { title: 'bKash Gateway Fee', cat: 'Gateway Charges', amount: 3200, date: '2026-02-28', user: 'Finance' },
              ].map((ex, i) => (
                <tr key={i} className="hover:bg-hover transition-colors">
                  <td className="px-6 py-4 text-sm font-bold text-primary">{ex.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-hover border border-border rounded-lg text-[10px] text-muted font-bold">{ex.cat}</span>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-rose-600">৳ {ex.amount?.toLocaleString() || 0}</td>
                  <td className="px-6 py-4 text-xs text-muted">{ex.date}</td>
                  <td className="px-6 py-4 text-xs text-muted">{ex.user}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-hover rounded-lg text-muted">
                      <MoreVertical size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderAudit = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-primary">Financial Audit Logs</h2>
          <p className="text-sm text-muted">Immutable transaction history for all financial activities.</p>
        </div>
        <button className="p-3 bg-hover border border-border rounded-2xl text-muted hover:text-active transition-all">
          <RefreshCw size={20} />
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
        <div className="divide-y divide-white/5">
          {[
            { type: 'Payout Approved', desc: 'Payout PAY-502 approved for Tech World', amount: '৳ 8,500', user: 'Super Admin', ip: '192.168.1.1', time: '2 hours ago' },
            { type: 'Commission Adjusted', desc: 'Manual adjustment for Order ORD-7829', amount: '৳ 50', user: 'Finance Manager', ip: '192.168.1.45', time: '5 hours ago' },
            { type: 'Refund Processed', desc: 'Full refund for Order ORD-7712', amount: '৳ 1,200', user: 'System', ip: 'Local', time: '1 day ago' },
          ].map((log, i) => (
            <div key={i} className="p-6 flex items-start justify-between hover:bg-white/[0.02] transition-colors">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-secondary mt-1">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-bold text-[#EAEAEA]">{log.type}</span>
                    <span className="text-[10px] text-secondary font-mono">{log.ip}</span>
                  </div>
                  <p className="text-xs text-secondary mt-1">{log.desc}</p>
                  <div className="flex items-center gap-3 mt-2">
                    <span className="text-[10px] font-bold text-active uppercase">{log.user}</span>
                    <span className="text-[10px] text-secondary/50">•</span>
                    <span className="text-[10px] text-secondary">{log.time}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold text-[#EAEAEA]">{log.amount}</div>
                <div className="text-[10px] text-emerald-400 font-bold mt-1">Verified</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderReports = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA]">Financial Reports</h2>
          <p className="text-sm text-secondary">Generate and export detailed financial statements.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: 'Revenue Report', desc: 'Daily/Monthly sales and earnings breakdown.', icon: TrendingUp },
          { title: 'Commission Report', desc: 'Platform earnings from seller transactions.', icon: Percent },
          { title: 'Payout History', desc: 'Record of all seller withdrawals and status.', icon: Banknote },
          { title: 'Expense Summary', desc: 'Operational costs and marketing investments.', icon: Receipt },
          { title: 'Tax & VAT Report', desc: 'Tax collected and payable for compliance.', icon: ShieldCheck },
          { title: 'Profit & Loss', desc: 'Overall financial health and net profit analysis.', icon: PieChart },
        ].map((report, i) => (
          <div key={i} className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6 group hover:border-active/30 transition-all">
            <div className="w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-secondary group-hover:text-active transition-colors">
              <report.icon size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-[#EAEAEA]">{report.title}</h3>
              <p className="text-xs text-secondary mt-1">{report.desc}</p>
            </div>
            <div className="flex items-center gap-2 pt-4">
              <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary hover:text-active hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <FileDown size={14} />
                PDF
              </button>
              <button className="flex-1 py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary hover:text-active hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <FileSpreadsheet size={14} />
                Excel
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-active/5 border border-active/10 rounded-[40px] flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-active/20 text-active rounded-2xl flex items-center justify-center">
            <Calendar size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#EAEAEA]">Custom Range Export</h3>
            <p className="text-xs text-secondary">Select a specific period to generate a consolidated report.</p>
          </div>
        </div>
        <div className="flex items-center gap-3 w-full md:w-auto">
          <input type="date" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-secondary outline-none focus:border-active transition-all flex-1 md:flex-none" />
          <span className="text-secondary">to</span>
          <input type="date" className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-xs font-bold text-secondary outline-none focus:border-active transition-all flex-1 md:flex-none" />
          <button className="px-8 py-3 bg-active text-white rounded-xl font-bold text-sm hover:bg-active/90 transition-all">
            Generate
          </button>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverview();
      case 'revenue': return renderRevenue();
      case 'commission': return renderCommission();
      case 'payouts': return renderPayouts();
      case 'expenses': return renderExpenses();
      case 'reports': return renderReports();
      case 'audit': return renderAudit();
      default:
        return (
          <div className="p-20 text-center space-y-4 bg-card border border-white/5 rounded-[40px]">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <Settings size={40} className="text-secondary animate-pulse" />
            </div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">{activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Module</h2>
            <p className="text-secondary text-sm">This financial sub-module is currently being optimized for enterprise auditing.</p>
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
            <DollarSign size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#EAEAEA]">Finance Center</h1>
            <p className="text-sm text-secondary">TAZU MART BD-grade financial control and marketplace auditing.</p>
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
          { id: 'revenue', label: 'Revenue', icon: TrendingUp },
          { id: 'commission', label: 'Commission', icon: Percent },
          { id: 'payouts', label: 'Payouts', icon: Banknote },
          { id: 'expenses', label: 'Expenses', icon: Receipt },
          { id: 'refunds', label: 'Refunds', icon: History },
          { id: 'reports', label: 'Reports', icon: FileSpreadsheet },
          { id: 'audit', label: 'Audit Logs', icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as FinanceTab)}
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

