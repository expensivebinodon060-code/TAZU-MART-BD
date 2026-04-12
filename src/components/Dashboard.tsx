import { motion } from 'motion/react';
import { 
  TrendingUp, 
  Package, 
  Users, 
  DollarSign, 
  Clock, 
  ArrowRight,
  LayoutGrid,
  Store,
  FileText,
  Ticket,
  BarChart3,
  Box,
  ShoppingCart
} from 'lucide-react';
import { Order } from '../types';

interface DashboardProps {
  setCurrentView: (view: any) => void;
  orders: Order[];
}

const QUICK_ACTIONS = [
  { 
    title: 'Categories', 
    desc: 'Manage your product categories', 
    icon: LayoutGrid, 
    gradient: 'from-blue-500 to-blue-600', 
    view: 'dashboard' 
  },
  { 
    title: 'Customers', 
    desc: 'View and manage your clients', 
    icon: Users, 
    gradient: 'from-purple-500 to-purple-600', 
    view: 'profile' 
  },
  { 
    title: 'Manage Shop', 
    desc: 'Configure your store settings', 
    icon: Store, 
    gradient: 'from-indigo-500 to-indigo-600', 
    view: 'settings' 
  },
  { 
    title: 'Landing Pages', 
    desc: 'Edit your storefront pages', 
    icon: FileText, 
    gradient: 'from-orange-500 to-orange-600', 
    view: 'dashboard' 
  },
  { 
    title: 'Promo Codes', 
    desc: 'Create and manage discounts', 
    icon: Ticket, 
    gradient: 'from-pink-500 to-pink-600', 
    view: 'dashboard' 
  },
  { 
    title: 'Analytics', 
    desc: 'Detailed performance reports', 
    icon: BarChart3, 
    gradient: 'from-green-500 to-green-600', 
    view: 'dashboard' 
  },
  { 
    title: 'Products', 
    desc: 'Inventory and stock control', 
    icon: Box, 
    gradient: 'from-teal-500 to-teal-600', 
    view: 'dashboard' 
  },
  { 
    title: 'Orders', 
    desc: 'Process and track shipments', 
    icon: ShoppingCart, 
    gradient: 'from-red-500 to-red-600', 
    view: 'orders' 
  },
];

export default function Dashboard({ setCurrentView, orders }: DashboardProps) {
  const stats = [
    { label: 'Total Orders', value: orders.length, icon: Package, color: 'text-blue-400', bg: 'bg-blue-400/10' },
    { label: 'Total Sales', value: `$${orders.reduce((acc, o) => acc + o.amount, 0)}`, icon: DollarSign, color: 'text-green-400', bg: 'bg-green-400/10' },
    { label: 'Total Customers', value: '1,240', icon: Users, color: 'text-purple-400', bg: 'bg-purple-400/10' },
    { label: 'Pending Orders', value: orders.filter(o => o.status === 'Pending').length, icon: Clock, color: 'text-yellow-400', bg: 'bg-yellow-400/10' },
  ];

  return (
    <div className="space-y-10">
      <header>
        <h1 className="text-2xl font-bold text-primary tracking-tight">Dashboard Overview</h1>
        <p className="text-secondary mt-1">Welcome back! Here's a summary of your activity.</p>
      </header>

      {/* Stats Overview Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="p-6 bg-white border border-gray-100 rounded-[14px] shadow-sm flex items-center gap-5"
          >
            <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center shrink-0`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-[11px] text-secondary font-bold uppercase tracking-wider">{stat.label}</div>
              <div className="text-xl font-bold text-primary">{stat.value}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Quick Actions Section */}
      <section className="space-y-8">
        <div className="flex items-center gap-4">
          <h2 className="text-sm font-bold uppercase tracking-[0.2em] text-secondary whitespace-nowrap">Quick Actions</h2>
          <div className="h-px w-full bg-gray-100" />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {QUICK_ACTIONS.map((action, i) => (
            <motion.button
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              onClick={() => setCurrentView(action.view)}
              className="group relative p-6 bg-white border border-gray-100 rounded-[14px] text-left shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
            >
              <div className={`w-14 h-14 bg-gradient-to-br ${action.gradient} rounded-2xl flex items-center justify-center mb-5 shadow-lg shadow-black/5 group-hover:scale-110 transition-transform duration-300`}>
                <action.icon size={28} className="text-white" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-primary font-bold text-base">{action.title}</h3>
                <p className="text-secondary text-xs leading-relaxed line-clamp-2">{action.desc}</p>
              </div>
            </motion.button>
          ))}
        </div>
      </section>

      {/* Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white border border-gray-100 rounded-[14px] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary">Recent Orders</h3>
            <button onClick={() => setCurrentView('orders')} className="text-xs font-bold text-active hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {orders.slice(0, 3).map(order => (
              <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-active/5 text-active rounded-xl flex items-center justify-center">
                    <Package size={18} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary">{order.id}</div>
                    <div className="text-[10px] text-secondary">{order.date}</div>
                  </div>
                </div>
                <div className="text-sm font-bold text-primary">৳{order.amount.toLocaleString()}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="bg-white border border-gray-100 rounded-[14px] p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-primary">Recent Activity</h3>
            <button className="text-xs font-bold text-active hover:underline">View All</button>
          </div>
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100/50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl overflow-hidden border border-gray-200">
                    <img src={`https://picsum.photos/seed/u${i}/40/40`} className="w-full h-full object-cover" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-primary">Customer {i}</div>
                    <div className="text-[10px] text-secondary">customer{i}@example.com</div>
                  </div>
                </div>
                <button className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-secondary hover:text-active hover:border-active transition-all">
                  <ArrowRight size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
