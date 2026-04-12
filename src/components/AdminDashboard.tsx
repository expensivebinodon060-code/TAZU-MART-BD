import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  LayoutDashboard, 
  Layout,
  Box, 
  Layers, 
  Image as ImageIcon, 
  Users, 
  Settings,
  TrendingUp,
  Plus,
  Search,
  ShoppingCart,
  Star,
  Zap,
  Flame,
  Truck,
  MessageSquare,
  ChevronRight,
  ShieldCheck,
  Smartphone,
  CreditCard,
  Globe,
  Lock,
  Eye,
  EyeOff,
  Save,
  AlertTriangle,
  Loader2,
  Server,
  Activity,
  Cpu,
  HardDrive,
  Wifi,
  Terminal,
  RefreshCw,
  Database,
  Cloud,
  History,
  Clock,
  CheckCircle2,
  XCircle,
  FileText,
  Code,
  Share2,
  Monitor,
  Menu,
  X,
  Package,
  Warehouse,
  UserPlus,
  DollarSign,
  BarChart3,
  Megaphone,
  Bell,
  Gavel,
  Key,
  SearchCode,
  Palette,
  ScrollText,
  ArrowUpRight,
  ArrowDownRight,
  Filter,
  MoreVertical,
  Facebook,
  Chrome,
  Play,
  MousePointer2,
  Search as SearchIcon,
  ArrowLeft,
  PanelRightOpen,
  Pause,
  Trash2,
  Edit3,
  ExternalLink,
  Power,
  RotateCw,
  Info,
  Check,
  ChevronDown,
  Lightbulb,
  AlertCircle,
  Bot,
  Wand2,
  ShieldAlert,
  LineChart,
  UserSearch,
  MessageCircle,
  BrainCircuit,
  Sparkles,
  ScanFace,
  Target,
  Home
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
  PieChart,
  Pie
} from 'recharts';
import { MOCK_ORDERS, MOCK_PRODUCTS } from '../mockData';
import { AIInstallationManager } from './admin/ai/AIInstallationManager';
import * as AI from './admin/ai/AIModules';
import { PaymentConfig, InfrastructureConfig, AdminNotification, Order } from '../types';

import AddDomainForm from './AddDomainForm';
import HostingDashboard from './HostingDashboard';
import HostingSetupForm from './HostingSetupForm';
import AdminOrders from './admin/AdminOrders';
import AdminIncompleteOrders from './admin/AdminIncompleteOrders';
import FooterManagement from './admin/FooterManagement';
import AdminProducts from './admin/AdminProducts';
import AdminInventory from './admin/AdminInventory';
import ServerStatus from './admin/ServerStatus';
import DeliverySystem from './admin/DeliverySystem';
import Workshop from './admin/Workshop';
import Vendors from './admin/Vendors';
import AdminCustomers from './admin/AdminCustomers';
import CategoryManagement from './admin/CategoryManagement';
import BannerManagement from './admin/BannerManagement';
import AccountSettingsCenter from './admin/AccountSettingsCenter';
import FeedbackManagement from './admin/FeedbackManagement';
import MarketingCenter from './admin/MarketingCenter';
import NotificationCenter from './admin/NotificationCenter';
import FinanceCenter from './admin/FinanceCenter';
import ReportsCenter from './admin/ReportsCenter';
import DisputesCenter from './admin/DisputesCenter';
import RolesCenter from './admin/RolesCenter';
import SEOCenter from './admin/SEOCenter';
import ThemeCenter from './admin/ThemeCenter';
import SystemLogs from './admin/SystemLogs';
import OfferManager from './admin/OfferManager';

type AdminView = 
  | 'dashboard' 
  | 'orders' 
  | 'incomplete-orders'
  | 'products' 
  | 'inventory' 
  | 'server-status'
  | 'delivery' 
  | 'workshop' 
  | 'vendors' 
  | 'customers' 
  | 'finance' 
  | 'reports' 
  | 'disputes' 
  | 'roles' 
  | 'seo' 
  | 'marketing' 
  | 'offer-manager'
  | 'notifications' 
  | 'payments' 
  | 'settings' 
  | 'account' 
  | 'theme' 
  | 'logs'
  | 'reviews' 
  | 'category-mgmt'
  | 'banner-mgmt'
  | 'footer'
  | 'varieties' 
  | 'coins-settings'
  | 'payment-settings'
  | 'infra-domain'
  | 'infra-dns'
  | 'infra-hosting'
  | 'infra-server'
  | 'infra-ssl'
  | 'infra-deploy'
  | 'infra-backup'
  | 'infra-maintenance'
  | 'infra-performance'
  | 'infra-domain-add'
  | 'infra-hosting-dashboard'
  | 'infra-hosting-setup'
  | 'feedback-suggestions'
  | 'feedback-errors'
  | 'ai-dashboard'
  | 'ai-customer-detection'
  | 'ai-chat-support'
  | 'ai-content-generator'
  | 'ai-seo-assistant'
  | 'ai-image-optimizer'
  | 'ai-visitor-analytics'
  | 'ai-fraud-detection'
  | 'ai-product-recommendation'
  | 'ai-review-analyzer'
  | 'ai-marketing-automation'
  | 'ai-sales-prediction'
  | 'ai-inventory-prediction'
  | 'ai-customer-behavior'
  | 'ai-security-monitoring'
  | 'ai-notification-system';

const SALES_DATA = [
  { name: 'Mon', revenue: 4000, orders: 240 },
  { name: 'Tue', revenue: 3000, orders: 198 },
  { name: 'Wed', revenue: 2000, orders: 150 },
  { name: 'Thu', revenue: 2780, orders: 210 },
  { name: 'Fri', revenue: 1890, orders: 120 },
  { name: 'Sat', revenue: 2390, orders: 180 },
  { name: 'Sun', revenue: 3490, orders: 250 },
];

const TRAFFIC_DATA = [
  { name: 'Facebook', value: 45, color: '#4F8CFF' },
  { name: 'Google', value: 30, color: '#7B61FF' },
  { name: 'TikTok', value: 15, color: '#22C55E' },
  { name: 'Direct', value: 7, color: '#F59E0B' },
  { name: 'Organic', value: 3, color: '#EF4444' },
];

const CATEGORY_DATA = [
  { name: 'Electronics', value: 400, color: '#4F8CFF' },
  { name: 'Fashion', value: 300, color: '#7B61FF' },
  { name: 'Home', value: 200, color: '#22C55E' },
  { name: 'Beauty', value: 150, color: '#F59E0B' },
  { name: 'Others', value: 100, color: '#EF4444' },
];

function StatCard({ label, value, change, icon: Icon, color, sub, gradient, onClick, className = '' }: any) {
  const isPositive = change.startsWith('+');
  return (
    <motion.button 
      whileHover={{ y: -5, scale: 1.02 }}
      onClick={onClick}
      className={`p-5 rounded-[20px] text-left space-y-4 transition-all group relative overflow-hidden shadow-card hover:shadow-lg border border-border bg-surface ${className}`}
    >
      {/* Subtle Corner Gradient */}
      <div className={`absolute -top-12 -right-12 w-32 h-32 rounded-full blur-3xl opacity-15 ${gradient}`} />
      
      <div className="flex items-center justify-between relative z-10">
        <div className={`w-12 h-12 bg-gradient-to-br ${color} text-white rounded-[16px] flex items-center justify-center shadow-sm group-hover:rotate-6 transition-transform`}>
          <Icon size={24} />
        </div>
        <div className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
          isPositive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'
        }`}>
          {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
          {change}
        </div>
      </div>
      <div className="relative z-10">
        <div className="text-xs text-secondary font-bold uppercase tracking-wider">{label}</div>
        <div className="text-2xl font-black mt-1 text-primary tracking-tight group-hover:text-active transition-colors">{value}</div>
        <div className="text-[10px] text-muted mt-1 font-medium">{sub}</div>
      </div>
    </motion.button>
  );
}

function ReviewModeration() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/reviews');
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error('Failed to fetch reviews', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error('Failed to update review status', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this review?')) return;
    try {
      const res = await fetch(`/api/admin/reviews/${id}`, { method: 'DELETE' });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error('Failed to delete review', err);
    }
  };

  const handleToggleFeature = async (id: string, isFeatured: boolean) => {
    try {
      const res = await fetch(`/api/admin/reviews/${id}/feature`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isFeatured }),
      });
      if (res.ok) fetchReviews();
    } catch (err) {
      console.error('Failed to toggle feature', err);
    }
  };

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-primary">Review Moderation</h2>
        <p className="text-xs text-muted mt-1">Approve, reject, or feature customer reviews.</p>
      </header>

      <div className="bg-surface border border-border rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border">
                <th className="px-8 py-5">Product</th>
                <th className="px-8 py-5">Customer</th>
                <th className="px-8 py-5">Rating</th>
                <th className="px-8 py-5">Comment</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-muted">Loading reviews...</td></tr>
              ) : reviews.length === 0 ? (
                <tr><td colSpan={6} className="px-8 py-20 text-center text-muted">No reviews to moderate.</td></tr>
              ) : reviews.map((review) => (
                <tr key={review.id} className="hover:bg-hover transition-colors">
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-3">
                      <img src={review.productImage} className="w-10 h-10 rounded-lg object-cover" />
                      <span className="text-xs font-bold text-primary">{review.productName}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-xs font-bold text-primary">{review.customerName}</div>
                    <div className="text-[10px] text-muted">{new Date(review.date).toLocaleDateString()}</div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-1">
                      <Star size={12} className="text-yellow-400 fill-yellow-400" />
                      <span className="text-xs font-bold text-primary">{review.rating}</span>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-xs text-muted max-w-xs truncate">{review.comment}</div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      review.status === 'approved' ? 'bg-green-500/10 text-green-600' : 
                      review.status === 'rejected' ? 'bg-rose-500/10 text-rose-600' : 
                      'bg-hover text-muted'
                    }`}>
                      {review.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button 
                        onClick={() => handleToggleFeature(review.id, !review.isFeatured)}
                        className={`p-2 rounded-lg transition-all ${review.isFeatured ? 'text-yellow-400 bg-yellow-400/10' : 'text-muted hover:bg-hover'}`}
                        title="Feature Review"
                      >
                        <Star size={16} />
                      </button>
                      <button 
                        onClick={() => handleStatus(review.id, 'approved')}
                        className="p-2 text-green-600 hover:bg-green-500/10 rounded-lg transition-all"
                        title="Approve"
                      >
                        <Check size={16} />
                      </button>
                      <button 
                        onClick={() => handleStatus(review.id, 'rejected')}
                        className="p-2 text-rose-600 hover:bg-rose-500/10 rounded-lg transition-all"
                        title="Reject"
                      >
                        <X size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(review.id)}
                        className="p-2 text-muted hover:text-rose-600 hover:bg-hover rounded-lg transition-all"
                        title="Delete"
                      >
                        <Trash2 size={16} />
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
  );
}

function CoinSettings() {
  const [settings, setSettings] = useState({
    enabled: true,
    conversionRate: 1, // 1 coin = 1 BDT
    minRedeem: 100,
    maxRedeemPerOrder: 500
  });

  return (
    <div className="space-y-8">
      <header>
        <h2 className="text-2xl font-bold text-primary">Coin System Settings</h2>
        <p className="text-xs text-secondary mt-1">Configure how customers earn and spend coins.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="p-8 bg-surface border border-border rounded-[40px] space-y-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-primary">Enable Coin System</h3>
              <p className="text-xs text-secondary">Toggle the entire reward system.</p>
            </div>
            <button 
              onClick={() => setSettings({...settings, enabled: !settings.enabled})}
              className={`w-12 h-6 rounded-full relative transition-all ${settings.enabled ? 'bg-active' : 'bg-hover'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${settings.enabled ? 'left-7' : 'left-1'}`} />
            </button>
          </div>

          <div className="space-y-4 pt-6 border-t border-border">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Conversion Rate (1 Coin = ? BDT)</label>
              <input 
                type="number"
                value={settings.conversionRate}
                onChange={(e) => setSettings({...settings, conversionRate: Number(e.target.value)})}
                className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Minimum Coins to Redeem</label>
              <input 
                type="number"
                value={settings.minRedeem}
                onChange={(e) => setSettings({...settings, minRedeem: Number(e.target.value)})}
                className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
              />
            </div>
          </div>
          
          <button className="w-full py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all shadow-lg shadow-active/20">
            Save Settings
          </button>
        </div>

        <div className="p-8 bg-active/5 border border-active/10 rounded-[40px] space-y-4">
          <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
            <Info size={24} />
          </div>
          <h3 className="text-lg font-bold text-active">System Information</h3>
          <ul className="space-y-3">
            {[
              'Coins are awarded only when order status is "Delivered".',
              'Admins can set individual reward coins per product.',
              'Customers can view their coin history in their wallet.',
              'Redemption logic will be implemented in the checkout phase.'
            ].map((text, i) => (
              <li key={i} className="flex gap-3 text-xs text-secondary leading-relaxed">
                <div className="w-1.5 h-1.5 rounded-full bg-active shrink-0 mt-1.5" />
                {text}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard({ onPrintInvoice }: { onPrintInvoice?: (id: string) => void }) {
  const [isAIInstalled, setIsAIInstalled] = useState(false);
  const [activeView, setActiveView] = useState<AdminView>('dashboard');
  const [paymentSubTab, setPaymentSubTab] = useState<'settings' | 'view'>('settings');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isRightPanelOpen, setIsRightPanelOpen] = useState(false);
  const [viewHistory, setViewHistory] = useState<AdminView[]>(['dashboard']);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [infraConfig, setInfraConfig] = useState<InfrastructureConfig | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loginStats, setLoginStats] = useState<any>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [showSecrets, setShowSecrets] = useState<Record<string, boolean>>({});
  const [showSwitchModal, setShowSwitchModal] = useState(false);
  const [pendingEnv, setPendingEnv] = useState<'Free' | 'Paid' | null>(null);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({});

  const toggleDropdown = (id: string) => {
    setOpenDropdowns(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const [notifications, setNotifications] = useState<AdminNotification[]>([
    {
      id: '1',
      type: 'New Order Placed',
      module: 'Orders',
      message: 'A new order #ORD-7829 has been placed by Rahat Khan.',
      priority: 'High',
      isRead: false,
      isArchived: false,
      actionUrl: '/admin/orders/7829',
      createdAt: '2 mins ago'
    },
    {
      id: '2',
      type: 'Low Stock Alert',
      module: 'Orders',
      message: 'Product "Premium Leather Wallet" is running low on stock (5 left).',
      priority: 'Medium',
      isRead: false,
      isArchived: false,
      actionUrl: '/admin/inventory',
      createdAt: '15 mins ago'
    },
    {
      id: '3',
      type: 'Security Alert',
      module: 'Security',
      message: 'Multiple failed login attempts detected from IP 192.168.1.45.',
      priority: 'Critical',
      isRead: false,
      isArchived: false,
      createdAt: '1 hour ago'
    },
    {
      id: '4',
      type: 'Backup Completed',
      module: 'System',
      message: 'Daily system backup has been successfully completed.',
      priority: 'Low',
      isRead: true,
      isArchived: false,
      createdAt: '3 hours ago'
    }
  ]);

  useEffect(() => {
    fetchPaymentConfig();
    fetchInfraConfig();
    fetchLoginStats();
    fetchAIStatus();
  }, []);

  const fetchAIStatus = async () => {
    try {
      const res = await fetch('/api/ai/installation');
      const data = await res.json();
      setIsAIInstalled(data.isInstalled);
      
      const featuresRes = await fetch('/api/ai/features');
      const featuresData = await featuresRes.json();
      setAiFeatures(featuresData);
    } catch (err) {
      console.error('Failed to fetch AI status', err);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch('/api/admin/orders');
      if (res.ok) {
        const data = await res.json();
        setOrders(data);
      }
    } catch (err) {
      console.error('Failed to fetch orders', err);
    }
  };

  useEffect(() => {
    if (activeView === 'payment-settings' && paymentSubTab === 'view') {
      fetchOrders();
    }
  }, [activeView, paymentSubTab]);

  const handleToggleAIFeature = async (featureId: string) => {
    const newValue = !aiFeatures[featureId];
    try {
      const res = await fetch('/api/ai/features/toggle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ featureId, isEnabled: newValue })
      });
      if (res.ok) {
        setAiFeatures(prev => ({ ...prev, [featureId]: newValue }));
      }
    } catch (err) {
      console.error('Failed to toggle AI feature', err);
    }
  };

  const fetchLoginStats = async () => {
    try {
      const res = await fetch('/api/admin/login-stats');
      const data = await res.json();
      setLoginStats(data);
    } catch (err) {
      console.error('Failed to fetch login stats', err);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/admin/stats');
        const data = await res.json();
        setDashboardStats(data);
      } catch (err) {
        console.error('Failed to fetch dashboard stats', err);
      }
    };
    fetchStats();
    // Refresh stats every 30 seconds
    const interval = setInterval(fetchStats, 30000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setViewHistory(prev => {
      if (prev[prev.length - 1] !== activeView) {
        return [...prev, activeView];
      }
      return prev;
    });
  }, [activeView]);

  const navigateBack = () => {
    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // remove current
      const prevView = newHistory[newHistory.length - 1];
      setActiveView(prevView);
      setViewHistory(newHistory);
    }
  };

  const fetchPaymentConfig = async () => {
    try {
      const res = await fetch('/api/admin/payment-config');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setPaymentConfig(data);
    } catch (err) {
      console.error('Failed to fetch payment config', err);
    }
  };

  const fetchInfraConfig = async () => {
    try {
      const res = await fetch('/api/admin/infra-config');
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      setInfraConfig(data);
    } catch (err) {
      console.error('Failed to fetch infra config', err);
    }
  };

  const handleUpdateConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!paymentConfig) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/payment-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentConfig),
      });
      if (res.ok) {
        alert('Payment configuration updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update config', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateInfra = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!infraConfig) return;
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/infra-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(infraConfig),
      });
      if (res.ok) {
        alert('Infrastructure configuration updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update infra config', err);
    } finally {
      setIsLoading(false);
    }
  };

  const initiateEnvSwitch = (env: 'Free' | 'Paid') => {
    if (infraConfig?.domain.environment === env) return;
    setPendingEnv(env);
    setShowSwitchModal(true);
  };

  const confirmEnvSwitch = async () => {
    if (!infraConfig || !pendingEnv) return;
    
    setIsLoading(true);
    // Simulate Auto-Backup before switch
    console.log('Triggering Auto-Backup...');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    const updated = {
      ...infraConfig,
      domain: { ...infraConfig.domain, environment: pendingEnv }
    };
    
    try {
      const res = await fetch('/api/admin/infra-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updated),
      });
      if (res.ok) {
        setInfraConfig(updated);
        setShowSwitchModal(false);
        setPendingEnv(null);
        alert(`Successfully migrated to ${pendingEnv} environment. Backup created.`);
      }
    } catch (err) {
      console.error('Migration failed', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSecret = (key: string) => {
    setShowSecrets(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleMarkAsRead = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  const handleMarkAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleDeleteNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const handleArchiveNotification = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isArchived: true } : n));
  };

  const handleBulkNotificationAction = (ids: string[], action: 'read' | 'delete' | 'archive') => {
    if (action === 'read') {
      setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, isRead: true } : n));
    } else if (action === 'delete') {
      setNotifications(prev => prev.filter(n => !ids.includes(n.id)));
    } else if (action === 'archive') {
      setNotifications(prev => prev.map(n => ids.includes(n.id) ? { ...n, isArchived: true } : n));
    }
  };

  const [aiFeatures, setAiFeatures] = useState<Record<string, boolean>>({
    'ai-dashboard': true,
    'ai-customer-detection': true,
    'ai-chat-support': true,
    'ai-content-generator': true,
    'ai-seo-assistant': true,
    'ai-image-optimizer': true,
    'ai-visitor-analytics': true,
    'ai-fraud-detection': true,
    'ai-product-recommendation': true,
    'ai-review-analyzer': true,
    'ai-marketing-automation': true,
    'ai-sales-prediction': true,
    'ai-inventory-prediction': true,
    'ai-customer-behavior': true,
    'ai-security-monitoring': true,
    'ai-notification-system': true,
  });

  const sidebarItems = [
    { label: 'Dashboard', icon: LayoutDashboard, id: 'dashboard' },
    { 
      label: 'Orders', 
      icon: ShoppingCart, 
      id: 'orders-group',
      subItems: [
        { label: 'Order Management', id: 'orders' },
        { label: 'Incomplete Orders', id: 'incomplete-orders' }
      ]
    },
    { label: 'Category Manager', icon: Layers, id: 'category-mgmt' },
    { label: 'Banner Manager', icon: ImageIcon, id: 'banner-mgmt' },
    { label: 'Products', icon: Box, id: 'products' },
    { label: 'Inventory', icon: Package, id: 'inventory' },
    { label: 'Server Status', icon: Activity, id: 'server-status' },
    { label: 'Delivery System', icon: Truck, id: 'delivery' },
    { label: 'Workshop', icon: Warehouse, id: 'workshop' },
    { label: 'Vendors', icon: UserPlus, id: 'vendors' },
    { label: 'Customers', icon: Users, id: 'customers' },
    { label: 'Finance', icon: DollarSign, id: 'finance' },
    { label: 'Reports', icon: BarChart3, id: 'reports' },
    { label: 'Marketing', icon: Megaphone, id: 'marketing' },
    { label: 'Offer Manager', icon: Zap, id: 'offer-manager' },
    { label: 'Notifications', icon: Bell, id: 'notifications' },
    { label: 'Disputes', icon: Gavel, id: 'disputes' },
    { label: 'Roles & Permissions', icon: Key, id: 'roles' },
    { label: 'Payments', icon: CreditCard, id: 'payments' },
    { label: 'Product Reviews', icon: Star, id: 'reviews' },
    { label: 'Coin Settings', icon: DollarSign, id: 'coins-settings' },
    { label: 'SEO', icon: SearchCode, id: 'seo' },
    { label: 'Store Settings', icon: Settings, id: 'settings' },
    { label: 'Footer', icon: Layout, id: 'footer' },
    { label: 'Account Settings', icon: Users, id: 'account' },
    { label: 'Theme', icon: Palette, id: 'theme' },
    { label: 'Customer Suggestions', icon: Lightbulb, id: 'feedback-suggestions' },
    { label: 'Page Error Reports', icon: AlertCircle, id: 'feedback-errors' },
    { label: 'System Logs', icon: ScrollText, id: 'logs' },
  ];

  const infraItems = [
    { label: 'Domain Config', icon: Globe, id: 'infra-domain' },
    { label: 'DNS Management', icon: Share2, id: 'infra-dns' },
    { label: 'Hosting Environment', icon: Cloud, id: 'infra-hosting' },
    { label: 'Server Overview', icon: Server, id: 'infra-server' },
    { label: 'SSL & Security', icon: ShieldCheck, id: 'infra-ssl' },
    { label: 'Deployment & Updates', icon: RefreshCw, id: 'infra-deploy' },
    { label: 'Backup & Migration', icon: Database, id: 'infra-backup' },
    { label: 'Maintenance Control', icon: Clock, id: 'infra-maintenance' },
    { label: 'Performance Optimization', icon: Zap, id: 'infra-performance' },
  ];

  const aiInstallationItems = [
    { label: 'AI Dashboard', icon: LayoutDashboard, id: 'ai-dashboard' },
    { label: 'AI Customer Detection', icon: UserSearch, id: 'ai-customer-detection' },
    { label: 'AI Smart Chat Support', icon: MessageSquare, id: 'ai-chat-support' },
    { label: 'AI Product Content Generator', icon: FileText, id: 'ai-content-generator' },
    { label: 'AI SEO Assistant', icon: SearchCode, id: 'ai-seo-assistant' },
    { label: 'AI Image Optimizer', icon: ImageIcon, id: 'ai-image-optimizer' },
    { label: 'AI Visitor Analytics', icon: BarChart3, id: 'ai-visitor-analytics' },
    { label: 'AI Fraud Detection', icon: ShieldAlert, id: 'ai-fraud-detection' },
    { label: 'AI Product Recommendation', icon: Star, id: 'ai-product-recommendation' },
    { label: 'AI Review Analyzer', icon: MessageCircle, id: 'ai-review-analyzer' },
    { label: 'AI Marketing Automation', icon: Megaphone, id: 'ai-marketing-automation' },
    { label: 'AI Sales Prediction', icon: LineChart, id: 'ai-sales-prediction' },
    { label: 'AI Inventory Prediction', icon: Package, id: 'ai-inventory-prediction' },
    { label: 'AI Customer Behavior', icon: MousePointer2, id: 'ai-customer-behavior' },
    { label: 'AI Security Monitoring', icon: ShieldCheck, id: 'ai-security-monitoring' },
    { label: 'AI Auto Notification', icon: Bell, id: 'ai-notification-system' },
  ];

  const renderInfraView = () => {
    if (!infraConfig) return null;
    
    const renderDomain = () => (
      <div className="space-y-8">
        {/* Domain Management Table */}
        <div className="p-8 bg-surface border border-border rounded-card space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                <Globe size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">Domain Management</h3>
                <p className="text-xs text-secondary">Add and manage your enterprise domains.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveView('infra-domain-add')}
              className="px-6 py-3 bg-active text-white rounded-xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2"
            >
              <Plus size={18} />
              Add Domain
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Domain Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">SSL Status</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Verification</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-muted uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {infraConfig.domain.domains.map((domain) => (
                  <tr key={domain.id} className="border-b border-border hover:bg-row-hover transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-primary">{domain.name}</span>
                        {domain.isPrimary && (
                          <span className="px-2 py-0.5 bg-active/10 text-active rounded text-[8px] font-black uppercase">Primary</span>
                        )}
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">{domain.wwwEnabled ? 'www enabled' : 'no-www'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-secondary font-medium">{domain.isPrimary ? 'Main' : 'Alias'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${domain.sslStatus === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className={`text-xs font-bold ${domain.sslStatus === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{domain.sslStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {domain.verificationStatus === 'Verified' ? (
                          <CheckCircle2 size={14} className="text-green-600" />
                        ) : (
                          <Clock size={14} className="text-yellow-600" />
                        )}
                        <span className="text-xs text-secondary">{domain.verificationStatus}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={() => {
                          const updatedDomains = infraConfig.domain.domains.map(d => 
                            d.id === domain.id ? { ...d, isEnabled: !d.isEnabled } : d
                          );
                          setInfraConfig({ ...infraConfig, domain: { ...infraConfig.domain, domains: updatedDomains } });
                        }}
                        className={`w-10 h-5 rounded-full relative transition-all ${domain.isEnabled ? 'bg-active' : 'bg-hover'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${domain.isEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-hover rounded-lg text-icon hover:text-active transition-all" title="Edit Domain">
                          <Edit3 size={16} />
                        </button>
                        {!domain.isPrimary && (
                          <button className="p-2 hover:bg-hover rounded-lg text-icon hover:text-active transition-all" title="Set as Primary">
                            <Star size={16} />
                          </button>
                        )}
                        <button className="p-2 hover:bg-hover rounded-lg text-icon hover:text-rose-600 transition-all" title="Remove Domain">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Domain Settings Grid */}
          <div className="grid grid-cols-2 gap-8">
          <div className="p-8 bg-surface border border-border rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-primary">Global Security</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-primary">Force HTTPS</div>
                  <p className="text-[10px] text-secondary">Redirect all insecure traffic to encrypted layer.</p>
                </div>
                <button 
                  onClick={() => setInfraConfig({...infraConfig, domain: {...infraConfig.domain, forceHttps: !infraConfig.domain.forceHttps}})}
                  className={`w-12 h-6 rounded-full relative transition-all ${infraConfig.domain.forceHttps ? 'bg-active shadow-lg shadow-active/20' : 'bg-hover'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${infraConfig.domain.forceHttps ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-primary">Auto-WWW Redirect</div>
                  <p className="text-[10px] text-secondary">Normalize domain structure automatically.</p>
                </div>
                <button className="w-12 h-6 rounded-full bg-active relative shadow-lg shadow-active/20">
                  <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                </button>
              </div>
              <div className="p-4 bg-active/5 border border-active/10 rounded-2xl flex items-start gap-4">
                <ShieldCheck className="text-active shrink-0 mt-0.5" size={18} />
                <div className="space-y-1">
                  <div className="text-xs font-bold text-active">HSTS Enabled</div>
                  <p className="text-[10px] text-secondary leading-relaxed">Strict Transport Security is active for all subdomains.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="p-8 bg-surface border border-border rounded-card space-y-6">
            <h3 className="text-lg font-bold text-primary">Manual IP Override</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Custom Server IP</label>
                <div className="relative">
                  <Terminal className="absolute left-4 top-1/2 -translate-y-1/2 text-icon" size={16} />
                  <input 
                    placeholder="e.g. 192.168.1.100"
                    className="w-full bg-hover border border-border rounded-xl pl-12 pr-4 py-3 text-sm outline-none focus:border-active transition-all font-mono"
                  />
                </div>
                <p className="text-[10px] text-muted px-2">Override automatic IP detection for specific routing.</p>
              </div>
              <button className="w-full py-4 bg-hover border border-border rounded-xl text-xs font-bold text-secondary hover:bg-border transition-all flex items-center justify-center gap-2">
                <RotateCw size={14} />
                Reset to Default IP
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const renderDNS = () => (
      <div className="space-y-8">
        <div className="p-8 bg-surface border border-border rounded-card space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                <Share2 size={24} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-primary">DNS Management</h3>
                <p className="text-xs text-secondary">Authoritative DNS record control center.</p>
              </div>
            </div>
            <div className="flex gap-4">
              <button className="px-6 py-3 bg-hover border border-border rounded-xl text-sm font-bold text-secondary hover:bg-border transition-all flex items-center gap-2">
                <RotateCw size={18} />
                Check Propagation
              </button>
              <button className="px-6 py-3 bg-active text-white rounded-xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2 shadow-lg shadow-active/20">
                <Plus size={18} />
                Add Record
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Type</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Host / Name</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Value / Content</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">TTL</th>
                  <th className="px-6 py-4 text-[10px] font-bold text-muted uppercase tracking-widest">Status</th>
                  <th className="px-6 py-4 text-right text-[10px] font-bold text-muted uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody>
                {infraConfig.domain.dnsRecords.map((record) => (
                  <tr key={record.id} className="border-b border-border hover:bg-row-hover transition-colors group">
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-active/10 text-active rounded text-[10px] font-black">{record.type}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-mono text-primary">{record.name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-mono text-secondary truncate max-w-[200px] block" title={record.value}>{record.value}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-secondary">{record.ttl}s</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${record.status === 'Active' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                        <span className={`text-[10px] font-bold ${record.status === 'Active' ? 'text-green-600' : 'text-yellow-600'}`}>{record.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="p-2 hover:bg-hover rounded-lg text-icon hover:text-active transition-all">
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this DNS record? This action cannot be undone.')) {
                              const updatedRecords = infraConfig.domain.dnsRecords.filter(r => r.id !== record.id);
                              setInfraConfig({ ...infraConfig, domain: { ...infraConfig.domain, dnsRecords: updatedRecords } });
                            }
                          }}
                          className="p-2 hover:bg-hover rounded-lg text-icon hover:text-rose-600 transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl flex items-start gap-4">
          <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={20} />
          <div className="space-y-1">
            <div className="text-sm font-bold text-yellow-500">DNS Warning</div>
            <p className="text-xs text-secondary leading-relaxed">
              Incorrect DNS settings can take your website offline. Propagation can take up to 24-48 hours. Always double-check values before saving.
            </p>
          </div>
        </div>
      </div>
    );

    const renderHosting = () => (
      <div className="space-y-8">
        {/* Server Status Header */}
        <div className="grid grid-cols-3 gap-8">
          <div className="col-span-2 p-8 bg-surface border border-border rounded-card space-y-8">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                  <Cloud size={28} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-primary">Hosting Environment</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-secondary font-mono">{infraConfig.hosting.serverIp}</span>
                    <span className="w-1 h-1 rounded-full bg-border" />
                    <span className="text-xs text-green-600 font-bold uppercase tracking-widest">{infraConfig.hosting.serverStatus}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-3">
                <button className="p-3 bg-hover border border-border rounded-xl text-icon hover:text-active transition-all" title="View Error Logs">
                  <FileText size={20} />
                </button>
                <button className="p-3 bg-hover border border-border rounded-xl text-icon hover:text-active transition-all" title="Clear System Cache">
                  <Zap size={20} />
                </button>
                <button 
                  onClick={() => {
                    if (confirm('Are you sure you want to restart the server? This will cause temporary downtime.')) {
                      alert('Server restart initiated...');
                    }
                  }}
                  className="p-3 bg-rose-500/10 border border-rose-500/20 text-rose-600 hover:bg-rose-500 hover:text-white transition-all shadow-lg shadow-rose-500/10" title="Restart Server"
                >
                  <Power size={20} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {[
                { label: 'Env Mode', value: infraConfig.hosting.environmentMode, icon: Monitor },
                { label: 'Runtime', value: infraConfig.hosting.runtimeVersion, icon: Code },
                { label: 'DB Status', value: infraConfig.hosting.databaseStatus, icon: Database, color: 'text-green-600' },
              ].map(item => (
                <div key={item.label} className="p-4 bg-hover rounded-xl border border-border space-y-2">
                  <div className="flex items-center gap-2 text-muted">
                    <item.icon size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">{item.label}</span>
                  </div>
                  <div className={`text-sm font-bold ${item.color || 'text-primary'}`}>{item.value}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-surface border border-border rounded-card space-y-6">
            <h3 className="text-lg font-bold text-primary">System Controls</h3>
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-primary">Maintenance Mode</div>
                  <p className="text-[10px] text-secondary">Block public access.</p>
                </div>
                <button 
                  onClick={() => setPaymentConfig(prev => prev ? {...prev, maintenanceMode: !prev.maintenanceMode} : null)}
                  className={`w-10 h-5 rounded-full relative transition-all ${paymentConfig?.maintenanceMode ? 'bg-rose-500' : 'bg-hover'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${paymentConfig?.maintenanceMode ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <div className="text-sm font-bold text-primary">Debug Mode</div>
                  <p className="text-[10px] text-secondary">Show detailed error logs.</p>
                </div>
                <button 
                  onClick={() => setInfraConfig({...infraConfig, hosting: {...infraConfig.hosting, debugMode: !infraConfig.hosting.debugMode}})}
                  className={`w-10 h-5 rounded-full relative transition-all ${infraConfig.hosting.debugMode ? 'bg-active' : 'bg-hover'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${infraConfig.hosting.debugMode ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            </div>
            <button className="w-full py-4 bg-active text-white rounded-xl text-xs font-bold hover:bg-active/90 transition-all shadow-lg shadow-active/20">
              Apply System Changes
            </button>
          </div>
        </div>

        {/* Resource Usage */}
        <div className="grid grid-cols-4 gap-6">
          {[
            { label: 'CPU Usage', value: infraConfig.hosting.resources.cpu, icon: Cpu, color: 'bg-blue-500' },
            { label: 'RAM Usage', value: infraConfig.hosting.resources.ram, icon: Activity, color: 'bg-purple-500' },
            { label: 'Storage', value: infraConfig.hosting.resources.storage, icon: HardDrive, color: 'bg-green-500' },
            { label: 'Bandwidth', value: infraConfig.hosting.resources.bandwidth, icon: Wifi, color: 'bg-orange-500' },
          ].map(res => (
            <div key={res.label} className="p-6 bg-surface border border-border rounded-3xl space-y-4">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2 text-secondary">
                  <res.icon size={16} />
                  <span className="text-[10px] font-bold uppercase tracking-widest">{res.label}</span>
                </div>
                <span className="text-sm font-bold text-primary">{res.value}%</span>
              </div>
              <div className="h-1.5 bg-hover rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${res.value}%` }}
                  className={`h-full ${res.color}`} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderServer = () => (
      <div className="grid grid-cols-3 gap-8">
        <div className="col-span-2 p-8 bg-surface border border-border rounded-card space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
              <Server size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">System Health</h3>
              <p className="text-xs text-secondary mt-1">Real-time server status and environment details.</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'OS Version', value: infraConfig.overview.os, icon: Terminal },
              { label: 'PHP Version', value: infraConfig.overview.phpVersion, icon: Code },
              { label: 'Database', value: infraConfig.overview.dbVersion, icon: Database },
              { label: 'Last Restart', value: infraConfig.overview.lastRestart, icon: Clock },
              { label: 'Last Backup', value: infraConfig.overview.lastBackup, icon: History },
              { label: 'Uptime', value: infraConfig.hosting.resources.uptime, icon: Activity },
            ].map(item => (
              <div key={item.label} className="p-4 bg-hover rounded-xl border border-border flex items-center gap-4">
                <item.icon size={18} className="text-icon" />
                <div>
                  <div className="text-[10px] font-bold text-muted uppercase">{item.label}</div>
                  <div className="text-sm font-medium text-primary">{item.value}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="p-8 bg-surface border border-border rounded-card flex flex-col items-center justify-center text-center space-y-6">
          <div className="relative w-32 h-32">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-hover" />
              <motion.circle 
                cx="64" cy="64" r="58" stroke="currentColor" strokeWidth="8" fill="transparent" 
                strokeDasharray={364.4} 
                initial={{ strokeDashoffset: 364.4 }}
                animate={{ strokeDashoffset: 364.4 - (364.4 * infraConfig.overview.healthScore) / 100 }}
                className="text-active" 
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-primary">{infraConfig.overview.healthScore}</span>
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Score</span>
            </div>
          </div>
          <div className="space-y-2">
            <h3 className="text-lg font-bold text-primary">System Health</h3>
            <p className="text-xs text-secondary">Your server is performing optimally with no critical issues.</p>
          </div>
        </div>
      </div>
    );

    const renderSSL = () => (
      <div className="grid grid-cols-2 gap-8">
        <div className="p-8 bg-surface border border-border rounded-card space-y-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/10 text-emerald-600 rounded-xl flex items-center justify-center">
                <ShieldCheck size={20} />
              </div>
              <h3 className="text-lg font-bold text-primary">SSL Certificate</h3>
            </div>
            <span className="px-3 py-1 bg-emerald-500/10 text-emerald-600 rounded-full text-[10px] font-bold">ACTIVE</span>
          </div>
          <div className="p-6 bg-hover rounded-xl border border-border space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-secondary">Expiry Countdown</span>
              <span className="text-sm font-bold text-primary">{infraConfig.ssl.expiryDays} Days</span>
            </div>
            <div className="h-1.5 bg-border rounded-full overflow-hidden">
              <div className="h-full bg-emerald-500" style={{ width: `${(infraConfig.ssl.expiryDays / 90) * 100}%` }} />
            </div>
            <button className="w-full py-3 bg-active text-white rounded-xl text-xs font-bold hover:bg-active/90 transition-all">Renew Certificate</button>
          </div>
        </div>
        <div className="p-8 bg-surface border border-border rounded-card space-y-6">
          <h3 className="text-lg font-bold text-primary">Security Hardening</h3>
          <div className="space-y-6">
            {[
              { label: 'Force HTTPS', active: infraConfig.ssl.forceHttps, desc: 'Redirect all HTTP to HTTPS' },
              { label: 'Auto Renew', active: infraConfig.ssl.autoRenew, desc: 'Automatic SSL renewal' },
              { label: 'Firewall', active: infraConfig.ssl.firewallActive, desc: 'Active intrusion protection' },
            ].map(ctrl => (
              <div key={ctrl.label} className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-primary">{ctrl.label}</div>
                  <div className="text-[10px] text-secondary">{ctrl.desc}</div>
                </div>
                <button 
                  onClick={() => setInfraConfig({...infraConfig, ssl: {...infraConfig.ssl, [ctrl.label === 'Force HTTPS' ? 'forceHttps' : ctrl.label === 'Auto Renew' ? 'autoRenew' : 'firewallActive']: !ctrl.active}})}
                  className={`w-10 h-5 rounded-full relative transition-all ${ctrl.active ? 'bg-active' : 'bg-hover'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${ctrl.active ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    );

    const renderDeploy = () => (
      <div className="p-8 bg-surface border border-border rounded-card space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
              <RefreshCw size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Deployment Center</h3>
              <p className="text-xs text-secondary mt-1">Manage application versions and server sync.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-6 py-3 bg-hover border border-border rounded-xl font-bold text-sm hover:bg-border transition-all">Pull Latest</button>
            <button className="px-6 py-3 bg-active text-white rounded-xl font-bold text-sm hover:bg-active/90 transition-all shadow-lg shadow-active/20">Push Update</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-8">
          <div className="p-6 bg-hover rounded-xl border border-border space-y-2">
            <div className="text-[10px] font-bold text-muted uppercase">Last Deployment</div>
            <div className="text-lg font-bold text-primary">{infraConfig.deployment.lastDeploy}</div>
          </div>
          <div className="p-6 bg-hover rounded-xl border border-border space-y-2">
            <div className="text-[10px] font-bold text-muted uppercase">Current Status</div>
            <div className="text-lg font-bold text-green-600 flex items-center gap-2">
              <CheckCircle2 size={18} />
              {infraConfig.deployment.status}
            </div>
          </div>
          <div className="p-6 bg-hover rounded-xl border border-border space-y-2">
            <div className="text-[10px] font-bold text-muted uppercase">Auto-Maintenance</div>
            <div className="flex items-center justify-between pt-1">
              <span className="text-xs text-secondary">Enable before deploy</span>
              <button className="w-8 h-4 rounded-full bg-active relative">
                <div className="absolute top-0.5 left-4.5 w-3 h-3 rounded-full bg-white" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );

    const renderBackup = () => (
      <div className="p-8 bg-surface border border-border rounded-[40px] space-y-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
              <Database size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-primary">Backup & Migration</h3>
              <p className="text-xs text-secondary mt-1">TAZU MART BD-grade data protection and recovery.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <button className="px-4 py-2 bg-hover border border-border rounded-xl text-xs font-bold text-secondary hover:bg-border">Download Snapshot</button>
            <button className="px-4 py-2 bg-active text-white rounded-xl text-xs font-bold hover:bg-active/90">Create Backup</button>
          </div>
        </div>
        <div className="grid grid-cols-3 gap-6">
          {[
            { label: 'Full System', icon: Monitor, desc: 'Complete server snapshot' },
            { label: 'Database Only', icon: Database, desc: 'SQL dump of all tables' },
            { label: 'Files Only', icon: FileText, desc: 'Assets and source code' },
          ].map(type => (
            <div key={type.label} className="p-6 bg-hover rounded-3xl border border-border space-y-4 group hover:border-active/30 transition-all cursor-pointer">
              <type.icon className="text-active group-hover:scale-110 transition-transform" size={24} />
              <div className="space-y-1">
                <div className="text-sm font-bold text-primary">{type.label}</div>
                <p className="text-[10px] text-muted leading-relaxed">{type.desc}</p>
              </div>
              <div className="pt-4 border-t border-border flex justify-between items-center">
                <span className="text-[10px] text-muted">Last: 24h ago</span>
                <span className="text-[10px] font-bold text-active">RESTORE</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    );

    const renderMaintenance = () => (
      <div className="grid grid-cols-2 gap-8">
        <div className="p-8 bg-surface border border-border rounded-card space-y-6">
          <div className="flex justify-between items-center">
            <div className="space-y-1">
              <h3 className="text-lg font-bold text-primary">Maintenance Mode</h3>
              <p className="text-[10px] text-muted uppercase tracking-widest">Global System Access Control</p>
            </div>
            <button 
              type="button"
              onClick={() => {
                if (!paymentConfig) return;
                const updated = { ...paymentConfig, maintenanceMode: !paymentConfig.maintenanceMode };
                setPaymentConfig(updated);
                fetch('/api/admin/payment-config', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(updated)
                });
              }}
              className={`w-12 h-6 rounded-full relative transition-all ${paymentConfig?.maintenanceMode ? 'bg-rose-500 shadow-lg shadow-rose-500/20' : 'bg-hover'}`}
            >
              <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${paymentConfig?.maintenanceMode ? 'left-7' : 'left-1'}`} />
            </button>
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase px-2">Custom Message</label>
            <textarea 
              placeholder="We are currently performing scheduled maintenance. Please check back later."
              className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all resize-none"
              rows={4}
            />
          </div>
        </div>
        <div className="p-8 bg-surface border border-border rounded-card space-y-6">
          <h3 className="text-lg font-bold text-primary">Schedule Window</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] text-muted px-1 font-bold uppercase tracking-widest">Start Time</label>
                <input type="datetime-local" className="w-full bg-hover border border-border rounded-xl px-3 py-2 text-xs text-secondary outline-none focus:border-active" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] text-muted px-1 font-bold uppercase tracking-widest">End Time</label>
                <input type="datetime-local" className="w-full bg-hover border border-border rounded-xl px-3 py-2 text-xs text-secondary outline-none focus:border-active" />
              </div>
            </div>
            <div className="p-4 bg-active/5 border border-active/10 rounded-2xl flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs font-bold text-primary">Allow Admin Access</span>
                <p className="text-[10px] text-muted">Bypass maintenance for administrators</p>
              </div>
              <button type="button" className="w-10 h-5 rounded-full bg-active relative">
                <div className="absolute top-1 left-6 w-3 h-3 rounded-full bg-white" />
              </button>
            </div>
          </div>
          <button type="button" className="w-full py-4 bg-hover border border-border rounded-xl text-xs font-bold text-secondary hover:bg-border transition-all">Apply Maintenance Schedule</button>
        </div>
      </div>
    );

    const renderPerformance = () => (
      <div className="grid grid-cols-2 gap-8">
        <div className="p-8 bg-surface border border-border rounded-card space-y-6">
          <h3 className="text-lg font-bold text-primary">Optimization Layer</h3>
          <div className="space-y-6">
            {[
              { label: 'Cache Control', active: infraConfig.performance.cacheEnabled, desc: 'Server-side data caching' },
              { label: 'CDN Status', active: infraConfig.performance.cdnActive, desc: 'Global content delivery' },
              { label: 'Image Optimization', active: infraConfig.performance.imageOptimization, desc: 'Automatic asset compression' },
              { label: 'Minify CSS/JS', active: infraConfig.performance.minifyAssets, desc: 'Code bundle optimization' },
              { label: 'High Traffic Protection', active: infraConfig.performance.highTrafficProtection, desc: 'Rate limiting & queueing' },
            ].map(opt => (
              <div key={opt.label} className="flex justify-between items-center">
                <div className="space-y-0.5">
                  <div className="text-sm font-bold text-primary">{opt.label}</div>
                  <div className="text-[10px] text-muted">{opt.desc}</div>
                </div>
                <button 
                  onClick={() => setInfraConfig({...infraConfig, performance: {...infraConfig.performance, [
                    opt.label === 'Cache Control' ? 'cacheEnabled' : 
                    opt.label === 'CDN Status' ? 'cdnActive' : 
                    opt.label === 'Image Optimization' ? 'imageOptimization' : 
                    opt.label === 'Minify CSS/JS' ? 'minifyAssets' : 
                    'highTrafficProtection'
                  ]: !opt.active}})}
                  className={`w-10 h-5 rounded-full relative transition-all ${opt.active ? 'bg-active' : 'bg-hover'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${opt.active ? 'left-6' : 'left-1'}`} />
                </button>
              </div>
            ))}
            {infraConfig.performance.highTrafficProtection && (
              <div className="pt-4 border-t border-border space-y-4">
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-muted uppercase tracking-widest">Rate Limit (req/min)</div>
                  <input 
                    type="number"
                    value={infraConfig.performance.rateLimitPerIp}
                    onChange={(e) => setInfraConfig({...infraConfig, performance: {...infraConfig.performance, rateLimitPerIp: parseInt(e.target.value)}})}
                    className="w-20 px-3 py-1 bg-hover border border-border rounded-lg text-xs text-primary text-center"
                  />
                </div>
                <div className="flex justify-between items-center">
                  <div className="text-xs font-bold text-muted uppercase tracking-widest">Background Queue</div>
                  <button 
                    onClick={() => setInfraConfig({...infraConfig, performance: {...infraConfig.performance, queueEnabled: !infraConfig.performance.queueEnabled}})}
                    className={`w-8 h-4 rounded-full relative transition-all ${infraConfig.performance.queueEnabled ? 'bg-active' : 'bg-hover'}`}
                  >
                    <div className={`absolute top-0.5 w-3 h-3 rounded-full bg-white transition-all ${infraConfig.performance.queueEnabled ? 'left-4.5' : 'left-0.5'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
        <div className="p-8 bg-surface border border-border rounded-card flex flex-col items-center justify-center text-center space-y-6">
          <div className="w-20 h-20 bg-active/10 text-active rounded-3xl flex items-center justify-center">
            <Zap size={40} />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-primary">System Purge</h3>
            <p className="text-xs text-secondary leading-relaxed">Instantly clear all application, database, and asset cache to reflect latest changes.</p>
          </div>
          <button className="w-full py-4 bg-hover border border-border rounded-2xl text-sm font-bold text-secondary hover:bg-border transition-all">Purge All Cache</button>
        </div>
      </div>
    );

    return (
      <div className="space-y-10 pb-20">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-[24px] font-bold text-primary">Infrastructure & Domain</h2>
            <p className="text-sm text-secondary">TAZU MART BD-level environment management.</p>
          </div>
          <button onClick={handleUpdateInfra} className="px-6 py-3 bg-active text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20">
            <Save size={18} />
            Save Infrastructure
          </button>
        </div>
        {activeView === 'infra-domain' && renderDomain()}
        {activeView === 'infra-domain-add' && <AddDomainForm onBack={() => setActiveView('infra-domain')} onSuccess={() => { fetchInfraConfig(); setActiveView('infra-domain'); }} />}
        {activeView === 'infra-dns' && renderDNS()}
        {activeView === 'infra-hosting' && (
          <HostingDashboard 
            onSetup={() => setActiveView('infra-hosting-setup')}
          />
        )}
        {activeView === 'infra-hosting-setup' && (
          <HostingSetupForm 
            onBack={() => setActiveView('infra-hosting')}
            onSuccess={() => setActiveView('infra-hosting')}
          />
        )}
        {activeView === 'infra-server' && renderServer()}
        {activeView === 'infra-ssl' && renderSSL()}
        {activeView === 'infra-deploy' && renderDeploy()}
        {activeView === 'infra-backup' && renderBackup()}
        {activeView === 'infra-maintenance' && renderMaintenance()}
        {activeView === 'infra-performance' && renderPerformance()}
      </div>
    );
  };

  const renderRightPanelContent = () => (
    <>
      {/* Traffic Summary */}
      <section className="p-8 bg-surface border border-border rounded-card space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-primary">Traffic Sources</h3>
          <Filter size={18} className="text-icon cursor-pointer hover:text-active transition-colors" />
        </div>
        <div className="h-[200px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={TRAFFIC_DATA} layout="vertical" margin={{ left: -20 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: '#6B7280', fontSize: 10 }} />
              <Tooltip 
                cursor={{ fill: 'transparent' }}
                contentStyle={{ 
                  backgroundColor: '#ffffff', 
                  border: '1px solid #F1F5F9', 
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                }}
                itemStyle={{ color: '#1F2937' }}
              />
              <Bar dataKey="value" radius={[0, 4, 4, 0]} barSize={12}>
                {TRAFFIC_DATA.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="space-y-3">
          {TRAFFIC_DATA.map((source) => (
            <div key={source.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: source.color }} />
                <span className="text-xs text-secondary">{source.name}</span>
              </div>
              <span className="text-xs font-bold text-primary">{source.value}%</span>
            </div>
          ))}
        </div>
      </section>

      {/* Top Selling Products */}
      <section className="p-8 bg-surface border border-border rounded-card space-y-6">
        <h3 className="text-lg font-bold text-primary">Top Products</h3>
        <div className="space-y-5">
          {[
            { name: 'Premium Cotton Polo', sales: 124, price: '৳ 1,250', image: 'https://picsum.photos/seed/polo/100/100' },
            { name: 'Slim Fit Denim', sales: 98, price: '৳ 2,450', image: 'https://picsum.photos/seed/denim/100/100' },
            { name: 'Leather Wallet Pro', sales: 84, price: '৳ 850', image: 'https://picsum.photos/seed/wallet/100/100' },
          ].map((product) => (
            <div key={product.name} className="flex items-center gap-4 group cursor-pointer">
              <div className="w-12 h-12 rounded-xl overflow-hidden bg-hover border border-border">
                <img src={product.image} alt={product.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform" referrerPolicy="no-referrer" />
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-primary truncate">{product.name}</div>
                <div className="text-[10px] text-muted mt-0.5">{product.sales} Sales • {product.price}</div>
              </div>
              <ArrowUpRight size={16} className="text-icon group-hover:text-active transition-colors" />
            </div>
          ))}
        </div>
        <button className="w-full py-3 bg-hover border border-border rounded-xl text-xs font-bold text-secondary hover:bg-border transition-all">
          View Inventory
        </button>
      </section>

      {/* Quick Actions */}
      <section className="p-8 bg-surface border border-border rounded-card space-y-6">
        <h3 className="text-lg font-bold text-primary">Quick Actions</h3>
        <div className="grid grid-cols-2 gap-3">
          {[
            { label: 'Add Product', icon: Plus, color: 'bg-emerald-500/10 text-emerald-600' },
            { label: 'New Campaign', icon: Megaphone, color: 'bg-blue-500/10 text-blue-600' },
            { label: 'Create Coupon', icon: Zap, color: 'bg-amber-500/10 text-amber-600' },
            { label: 'Send Alert', icon: Bell, color: 'bg-rose-500/10 text-rose-600' },
          ].map((action) => (
            <button key={action.label} className="p-4 bg-hover border border-border rounded-2xl text-center space-y-2 hover:border-active/30 transition-all group">
              <div className={`w-10 h-10 mx-auto rounded-xl flex items-center justify-center ${action.color} group-hover:scale-110 transition-transform`}>
                <action.icon size={20} />
              </div>
              <div className="text-[10px] font-bold text-primary">{action.label}</div>
            </button>
          ))}
        </div>
      </section>
    </>
  );

  const varieties = [
    { label: 'Featured Products', icon: Star, color: 'text-yellow-400' },
    { label: 'New Arrival', icon: Zap, color: 'text-blue-400' },
    { label: 'Best Selling', icon: TrendingUp, color: 'text-green-400' },
    { label: 'Fast Delivery', icon: Truck, color: 'text-blue-400' },
  ];

  return (
    <div className="main-container flex min-h-screen bg-background text-primary overflow-x-hidden">
      {/* Admin Sidebar */}
      <AnimatePresence mode="wait">
        {isSidebarOpen && (
          <motion.aside 
            initial={{ x: -300, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -300, opacity: 0 }}
            className="fixed lg:sticky top-0 left-0 z-50 w-72 h-screen bg-sidebar border-r border-border p-6 space-y-8 overflow-y-auto custom-scrollbar"
          >
            <div className="flex items-center justify-between lg:justify-start gap-3 px-2">
              <div className="w-8 h-8 bg-active rounded-lg flex items-center justify-center">
                <ShieldCheck className="text-white" size={20} />
              </div>
              <span className="text-lg font-bold tracking-tight text-primary">iyabd.com Admin</span>
              <button 
                onClick={() => setIsSidebarOpen(false)}
                className="lg:hidden p-2 hover:bg-hover rounded-lg text-muted"
              >
                <X size={20} />
              </button>
            </div>

            {/* Go To Website Button */}
            <a 
              href="/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-3 px-4 py-3 rounded-xl bg-hover border border-border text-muted hover:text-active hover:border-active/30 transition-all group mx-2"
            >
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center group-hover:bg-active/10 transition-colors shadow-sm">
                <Home size={18} className="group-hover:text-active transition-colors" />
              </div>
              <span className="text-sm font-bold">Go To Website</span>
              <ExternalLink size={14} className="ml-auto opacity-30 group-hover:opacity-100 transition-opacity" />
            </a>

            <div className="space-y-6">
              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest px-4 mb-2">Main Menu</div>
                {sidebarItems.map((item) => (
                  <div key={item.label}>
                    <button 
                      onClick={() => {
                        if (item.subItems) {
                          toggleDropdown(item.id);
                        } else {
                          setActiveView(item.id as AdminView);
                        }
                      }}
                      className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                        activeView === item.id || (item.subItems && item.subItems.some(sub => sub.id === activeView))
                          ? 'bg-active text-white shadow-lg shadow-active/20' 
                          : 'hover:bg-hover text-muted'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <item.icon size={18} className={activeView === item.id || (item.subItems && item.subItems.some(sub => sub.id === activeView)) ? 'text-white' : 'text-icon group-hover:text-active'} />
                        <span className="text-sm font-medium">{item.label}</span>
                      </div>
                      {item.subItems && (
                        <ChevronRight 
                          size={16} 
                          className={`transition-transform ${openDropdowns[item.id] ? 'rotate-90' : ''}`} 
                        />
                      )}
                    </button>
                    {item.subItems && openDropdowns[item.id] && (
                      <div className="mt-1 ml-4 pl-4 border-l border-border space-y-1">
                        {item.subItems.map((subItem) => (
                          <button
                            key={subItem.id}
                            onClick={() => setActiveView(subItem.id as AdminView)}
                            className={`w-full flex items-center px-4 py-2 rounded-xl transition-all text-sm ${
                              activeView === subItem.id 
                                ? 'bg-active/10 text-active font-bold' 
                                : 'text-muted hover:bg-hover hover:text-primary'
                            }`}
                          >
                            {subItem.label}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest px-4 mb-2">Infrastructure</div>
                {infraItems.map((item) => (
                  <button 
                    key={item.label} 
                    onClick={() => setActiveView(item.id as AdminView)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                      activeView === item.id ? 'bg-active/10 text-active' : 'hover:bg-hover text-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={activeView === item.id ? 'text-active' : 'text-icon group-hover:text-active'} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="space-y-1">
                <div className="text-[10px] font-bold text-muted uppercase tracking-widest px-4 mb-2">AI Installation</div>
                {aiInstallationItems.map((item) => (
                  <button 
                    key={item.label} 
                    onClick={() => setActiveView(item.id as AdminView)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all group ${
                      activeView === item.id ? 'bg-active/10 text-active' : 'hover:bg-hover text-muted'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <item.icon size={18} className={activeView === item.id ? 'text-active' : 'text-icon group-hover:text-active'} />
                      <span className="text-sm font-medium">{item.label}</span>
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-4 border-t border-border">
                <button 
                  onClick={() => setActiveView('payment-settings')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all group ${
                    activeView === 'payment-settings' ? 'bg-active/10 text-active' : 'hover:bg-hover text-muted'
                  }`}
                >
                  <CreditCard size={18} className={activeView === 'payment-settings' ? 'text-active' : 'text-icon group-hover:text-active'} />
                  <span className="text-sm font-medium">Payment Settings</span>
                </button>
              </div>
            </div>
          </motion.aside>
        )}
      </AnimatePresence>

      {/* Admin Main Content */}
      <motion.div 
        layout
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="content-wrapper flex-1 min-w-0 p-6 lg:p-10"
      >
        <header className="sticky top-0 z-40 -mx-6 lg:-mx-10 px-6 lg:px-10 py-6 bg-surface border-b border-border shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            {!isSidebarOpen && (
              <button 
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-surface border border-border rounded-xl text-secondary hover:text-active transition-all shadow-sm"
              >
                <Menu size={20} />
              </button>
            )}
            {viewHistory.length > 1 && (
              <button 
                onClick={navigateBack}
                className="p-2.5 bg-surface border border-border rounded-xl text-secondary hover:text-active transition-all flex items-center gap-2 group shadow-sm"
              >
                <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="hidden sm:inline text-sm font-bold">Back</span>
              </button>
            )}
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary">
                {[...sidebarItems, ...infraItems, { id: 'payment-settings', label: 'Payment Settings' }].find(i => i.id === activeView)?.label || 'Admin Dashboard'}
              </h1>
              <p className="text-xs text-secondary mt-1">iyabd.com control center for your digital ecosystem.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {/* Notification Bell */}
            <div className="relative group">
              <button 
                onClick={() => setActiveView('notifications')}
                className="p-2.5 bg-surface border border-border rounded-xl text-icon hover:text-active transition-all relative shadow-sm"
              >
                <Bell size={20} />
                {notifications.filter(n => !n.isRead).length > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-black rounded-full flex items-center justify-center border-2 border-background animate-bounce">
                    {notifications.filter(n => !n.isRead).length}
                  </span>
                )}
              </button>
              
              {/* Dropdown Preview */}
              <div className="absolute right-0 mt-4 w-80 bg-surface border border-border rounded-2xl shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-[60] overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <span className="text-xs font-bold text-primary">Recent Notifications</span>
                  <button 
                    onClick={() => setActiveView('notifications')}
                    className="text-[10px] font-bold text-active hover:underline"
                  >
                    View All
                  </button>
                </div>
                <div className="max-h-[400px] overflow-y-auto divide-y divide-border">
                  {notifications.filter(n => !n.isArchived).slice(0, 5).map(n => (
                    <div 
                      key={n.id} 
                      onClick={() => {
                        handleMarkAsRead(n.id);
                        if (n.actionUrl) setActiveView(n.actionUrl as any);
                      }}
                      className={`p-4 hover:bg-row-hover transition-colors cursor-pointer ${!n.isRead ? 'bg-active/5' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${!n.isRead ? 'bg-active/10 text-active' : 'bg-hover text-icon'}`}>
                          <Bell size={14} />
                        </div>
                        <div className="space-y-1">
                          <p className={`text-xs font-bold ${!n.isRead ? 'text-primary' : 'text-secondary'}`}>{n.type}</p>
                          <p className="text-[10px] text-secondary line-clamp-2">{n.message}</p>
                          <p className="text-[8px] text-muted uppercase font-black">{n.createdAt}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                  {notifications.filter(n => !n.isArchived).length === 0 && (
                    <div className="p-8 text-center text-xs text-secondary">No new notifications</div>
                  )}
                </div>
                <button 
                  onClick={handleMarkAllAsRead}
                  className="w-full py-3 text-[10px] font-bold text-secondary hover:text-primary hover:bg-hover transition-all border-t border-border"
                >
                  Mark All as Read
                </button>
              </div>
            </div>

            <div className="relative hidden sm:block">
              <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
              <input 
                type="text" 
                placeholder="Global search..." 
                className="bg-hover border border-border rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none focus:border-active/50 transition-all w-64 text-primary"
              />
            </div>
            <button 
              onClick={() => setIsRightPanelOpen(true)}
              className="lg:hidden p-2.5 bg-surface border border-border rounded-xl text-secondary hover:text-active transition-all shadow-sm"
              title="Show Analytics"
            >
              <PanelRightOpen size={20} />
            </button>
            <button className="p-2.5 bg-surface border border-border rounded-xl text-secondary hover:text-active transition-all relative shadow-sm">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-background" />
            </button>
            <div className="h-10 w-10 rounded-xl bg-active/10 border border-active/20 flex items-center justify-center text-active font-bold">
              AD
            </div>
          </div>
        </header>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeView}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {activeView === 'dashboard' && (
              <div className="space-y-10">
                {/* 1. Dashboard Statistics Cards (Top Section) */}
                <div className="space-y-6">
                  {/* First Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <StatCard 
                      label="Total Orders" 
                      value={dashboardStats?.totalOrders || 0} 
                      change="+18.4%" 
                      icon={ShoppingCart} 
                      color="from-[#4F8CFF] to-[#4F8CFF]/80" 
                      sub="All time orders"
                      gradient="bg-[#4F8CFF]"
                      onClick={() => setActiveView('orders')}
                    />
                    <StatCard 
                      label="Pending Orders" 
                      value={dashboardStats?.pendingOrders || 0} 
                      change="-2.1%" 
                      icon={Clock} 
                      color="from-[#F59E0B] to-[#F59E0B]/80" 
                      sub="Awaiting confirmation"
                      gradient="bg-[#F59E0B]"
                      onClick={() => setActiveView('orders')}
                    />
                    <StatCard 
                      label="Confirmed Orders" 
                      value={dashboardStats?.confirmedOrders || 0} 
                      change="+15.4%" 
                      icon={CheckCircle2} 
                      color="from-[#2563EB] to-[#2563EB]/80" 
                      sub="Ready for processing"
                      gradient="bg-[#2563EB]"
                      onClick={() => setActiveView('orders')}
                    />
                    <StatCard 
                      label="Delivered Orders" 
                      value={dashboardStats?.deliveredOrders || 0} 
                      change="+22.1%" 
                      icon={Truck} 
                      color="from-[#7B61FF] to-[#7B61FF]/80" 
                      sub="Successfully delivered"
                      gradient="bg-[#7B61FF]"
                      onClick={() => setActiveView('orders')}
                    />
                  </div>

                  {/* Second Row */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                    <StatCard 
                      label="Completed Orders" 
                      value={dashboardStats?.completedOrders || 0} 
                      change="+12.5%" 
                      icon={CheckCircle2} 
                      color="from-[#22C55E] to-[#22C55E]/80" 
                      sub="Order cycle finished"
                      gradient="bg-[#22C55E]"
                      onClick={() => setActiveView('orders')}
                    />
                    <StatCard 
                      label="Cancelled Orders" 
                      value={dashboardStats?.cancelledOrders || 0} 
                      change="-5.2%" 
                      icon={XCircle} 
                      color="from-[#EF4444] to-[#EF4444]/80" 
                      sub="Total cancelled orders"
                      gradient="bg-[#EF4444]"
                      onClick={() => setActiveView('orders')}
                    />
                    <StatCard 
                      label="Returned Orders" 
                      value={dashboardStats?.returnedOrders || 0} 
                      change="+1.2%" 
                      icon={RefreshCw} 
                      color="from-[#991B1B] to-[#991B1B]/80" 
                      sub="Returned by customers"
                      gradient="bg-[#991B1B]"
                      onClick={() => setActiveView('orders')}
                    />
                    <StatCard 
                      label="Refunded Orders" 
                      value={dashboardStats?.refundedOrders || 0} 
                      change="+0.5%" 
                      icon={RotateCw} 
                      color="from-[#6B7280] to-[#6B7280]/80" 
                      sub="Payments refunded"
                      gradient="bg-[#6B7280]"
                      onClick={() => setActiveView('orders')}
                    />
                  </div>
                </div>

                  {/* Third Row */}
                  <div className="grid grid-cols-2 md:grid-cols-6 lg:grid-cols-5 gap-3 md:gap-4">
                    <StatCard 
                      label="Total Revenue" 
                      value={`৳ ${dashboardStats?.totalRevenue?.toLocaleString() || 0}`} 
                      change="+12.5%" 
                      icon={TrendingUp} 
                      color="from-[#7B61FF] to-[#7B61FF]/80" 
                      sub="Net revenue earned"
                      gradient="bg-[#7B61FF]"
                      onClick={() => setActiveView('finance')}
                      className="col-span-1 md:col-span-2 lg:col-span-1"
                    />
                    <StatCard 
                      label="Total Sales" 
                      value={`৳ ${dashboardStats?.totalSales?.toLocaleString() || 0}`} 
                      change="+14.2%" 
                      icon={DollarSign} 
                      color="from-[#22C55E] to-[#22C55E]/80" 
                      sub="Gross sales volume"
                      gradient="bg-[#22C55E]"
                      onClick={() => setActiveView('reports')}
                      className="col-span-1 md:col-span-2 lg:col-span-1"
                    />
                    <StatCard 
                      label="Total Customers" 
                      value={dashboardStats?.totalCustomers?.toLocaleString() || 0} 
                      change="+8.4%" 
                      icon={Users} 
                      color="from-[#4F8CFF] to-[#4F8CFF]/80" 
                      sub="Registered users"
                      gradient="bg-[#4F8CFF]"
                      onClick={() => setActiveView('customers')}
                      className="col-span-1 md:col-span-2 lg:col-span-1"
                    />
                    <StatCard 
                      label="Total Expenses" 
                      value={`৳ ${dashboardStats?.totalExpenses?.toLocaleString() || 0}`} 
                      change="+5.1%" 
                      icon={CreditCard} 
                      color="from-[#EF4444] to-[#EF4444]/80" 
                      sub="Operational costs"
                      gradient="bg-[#EF4444]"
                      onClick={() => setActiveView('finance')}
                      className="col-span-1 md:col-span-3 lg:col-span-1"
                    />
                    <StatCard 
                      label="Daily Target / Profit" 
                      value={`${dashboardStats?.dailyTarget}%`} 
                      change="+2.4%" 
                      icon={Target} 
                      color="from-[#F59E0B] to-[#F59E0B]/80" 
                      sub="Target achievement"
                      gradient="bg-[#F59E0B]"
                      onClick={() => setActiveView('reports')}
                      className="col-span-2 md:col-span-3 lg:col-span-1"
                    />
                  </div>

                {/* 2. Analytics Section */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  {/* Revenue Overview Graph */}
                  <section className="lg:col-span-2 p-8 bg-surface border border-border rounded-card space-y-8 shadow-sm">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                      <div>
                        <h2 className="text-xl font-bold text-primary">Revenue Overview</h2>
                        <p className="text-xs text-secondary mt-1">Detailed analysis of earnings over time.</p>
                      </div>
                      <div className="flex bg-hover p-1 rounded-xl border border-border">
                        {['Last 24 Hours', '7 Days', '30 Days', 'Monthly', 'Yearly'].map((t) => (
                          <button key={t} className={`px-4 py-2 rounded-lg text-[10px] font-bold transition-all ${t === '30 Days' ? 'bg-active text-white shadow-lg shadow-active/20' : 'text-secondary hover:text-primary'}`}>
                            {t}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="h-[350px] w-full">
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={SALES_DATA}>
                          <defs>
                            <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#4F8CFF" stopOpacity={0.1}/>
                              <stop offset="95%" stopColor="#4F8CFF" stopOpacity={0}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                          <XAxis 
                            dataKey="name" 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
                            dy={15}
                          />
                          <YAxis 
                            axisLine={false} 
                            tickLine={false} 
                            tick={{ fill: '#6B7280', fontSize: 10, fontWeight: 600 }}
                            tickFormatter={(value) => `৳${value}`}
                          />
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff', 
                              border: '1px solid #F1F5F9', 
                              borderRadius: '16px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                            itemStyle={{ fontSize: '12px', fontWeight: 600, color: '#1F2937' }}
                          />
                          <Area 
                            type="monotone" 
                            dataKey="revenue" 
                            stroke="#4F8CFF" 
                            strokeWidth={3} 
                            fillOpacity={1} 
                            fill="url(#colorRevenue)" 
                            animationDuration={2000}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </div>
                  </section>

                  {/* Sales by Category Chart */}
                  <section className="p-8 bg-surface border border-border rounded-card space-y-8 shadow-sm">
                    <div>
                      <h2 className="text-xl font-bold text-primary">Sales by Category</h2>
                      <p className="text-xs text-secondary mt-1">Distribution across top categories.</p>
                    </div>
                    <div className="h-[250px] w-full relative">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={CATEGORY_DATA}
                            cx="50%"
                            cy="50%"
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={8}
                            dataKey="value"
                          >
                            {CATEGORY_DATA.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                          </Pie>
                          <Tooltip 
                            contentStyle={{ 
                              backgroundColor: '#ffffff', 
                              border: '1px solid #F1F5F9', 
                              borderRadius: '16px',
                              boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                            }}
                            itemStyle={{ color: '#1F2937' }}
                          />
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <span className="text-2xl font-black text-primary">1,150</span>
                        <span className="text-[10px] text-muted font-bold uppercase tracking-widest">Total Sales</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      {CATEGORY_DATA.map((cat) => (
                        <div key={cat.name} className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-2 h-2 rounded-full" style={{ backgroundColor: cat.color }} />
                            <span className="text-xs font-bold text-secondary">{cat.name}</span>
                          </div>
                          <span className="text-xs font-black text-primary">{cat.value}</span>
                        </div>
                      ))}
                    </div>
                  </section>
                </div>

                {/* 3. Login Activity Monitoring Section */}
                <section className="p-8 bg-surface border border-border rounded-card space-y-8 shadow-sm">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                      <ShieldCheck size={24} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-primary">Login Activity Monitoring</h2>
                      <p className="text-xs text-secondary mt-1">Real-time authentication source tracking and user engagement.</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
                    {[
                      { label: 'Google Login Users', value: loginStats?.googleLogins || '0', icon: Chrome, color: 'from-[#EF4444] to-[#EF4444]/80', bg: 'bg-[#EF4444]', desc: 'Via Google OAuth' },
                      { label: 'Facebook Login Users', value: loginStats?.facebookLogins || '0', icon: Facebook, color: 'from-[#4F8CFF] to-[#4F8CFF]/80', bg: 'bg-[#4F8CFF]', desc: 'Via Facebook OAuth' },
                      { label: 'Manual Registration', value: loginStats?.newSignupsToday || '0', icon: UserPlus, color: 'from-[#7B61FF] to-[#7B61FF]/80', bg: 'bg-[#7B61FF]', desc: 'Direct signups' },
                      { label: 'Manual Login Users', value: loginStats?.manualLogins || '0', icon: Lock, color: 'from-[#F59E0B] to-[#F59E0B]/80', bg: 'bg-[#F59E0B]', desc: 'Email & Password' },
                      { label: 'Active Logged-in', value: loginStats?.activeUsers || '0', icon: Activity, color: 'from-[#22C55E] to-[#22C55E]/80', bg: 'bg-[#22C55E]', desc: 'Currently online' },
                      { label: 'Total Website Users', value: loginStats?.totalUsers || '0', icon: Users, color: 'from-[#6B7280] to-[#6B7280]/80', bg: 'bg-[#6B7280]', desc: 'All registered users' },
                    ].map((item) => (
                      <motion.div 
                        key={item.label} 
                        whileHover={{ y: -5, scale: 1.02 }}
                        className="p-5 bg-surface rounded-[20px] border border-border space-y-4 group relative overflow-hidden shadow-card hover:shadow-lg transition-all"
                      >
                        {/* Subtle Corner Gradient */}
                        <div className={`absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl opacity-10 ${item.bg}`} />
                        
                        <div className={`w-10 h-10 bg-gradient-to-br ${item.color} text-white rounded-xl flex items-center justify-center group-hover:rotate-6 transition-transform relative z-10`}>
                          <item.icon size={20} />
                        </div>
                        <div className="relative z-10">
                          <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">{item.label}</div>
                          <div className="text-2xl font-black text-primary mt-1 group-hover:text-active transition-colors">{item.value}</div>
                          <div className="text-[9px] text-muted mt-1">{item.desc}</div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </section>

                {/* Recent Orders Table */}
                <section className="bg-surface border border-border rounded-card overflow-hidden shadow-sm">
                  <div className="p-8 border-b border-border flex items-center justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-primary">Recent Orders</h3>
                      <p className="text-xs text-secondary mt-1">Latest transactions across all channels.</p>
                    </div>
                    <button 
                      onClick={() => setActiveView('orders')}
                      className="px-6 py-2 bg-hover text-xs font-bold text-active rounded-xl hover:bg-border transition-all"
                    >
                      View All Orders
                    </button>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border">
                          <th className="px-8 py-6">Order ID</th>
                          <th className="px-8 py-6">Customer</th>
                          <th className="px-8 py-6">Amount</th>
                          <th className="px-8 py-6">Status</th>
                          <th className="px-8 py-6 text-right">Action</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {MOCK_ORDERS.slice(0, 5).map((order) => (
                          <tr key={order.id} className="hover:bg-row-hover transition-colors group">
                            <td className="px-8 py-6">
                              <div className="text-sm font-bold text-primary">{order.id}</div>
                              <div className="text-[10px] text-muted mt-1">{new Date(order.date).toLocaleDateString()}</div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-sm font-bold text-primary">{order.customerName}</div>
                              <div className="text-[10px] text-muted mt-1">{order.customerPhone}</div>
                            </td>
                            <td className="px-8 py-6">
                              <div className="text-sm font-black text-primary">৳ {order.amount.toLocaleString()}</div>
                              <div className="text-[10px] text-muted mt-1">{order.paymentMethod}</div>
                            </td>
                            <td className="px-8 py-6">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                                order.status === 'Delivered' ? 'bg-emerald-500/10 text-emerald-600' : 
                                order.status === 'Cancelled' ? 'bg-rose-500/10 text-rose-600' : 
                                order.status === 'Confirmed' ? 'bg-blue-500/10 text-blue-600' : 
                                'bg-hover text-muted'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => setActiveView('orders')}
                                className="p-2 text-icon hover:text-active hover:bg-active/10 rounded-lg transition-all"
                              >
                                <Eye size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>

                  {/* Mobile Right Panel Drawer */}
                  <AnimatePresence>
                    {isRightPanelOpen && (
                      <>
                        <motion.div 
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          exit={{ opacity: 0 }}
                          onClick={() => setIsRightPanelOpen(false)}
                          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[55] lg:hidden"
                        />
                        <motion.div 
                          initial={{ x: '100%' }}
                          animate={{ x: 0 }}
                          exit={{ x: '100%' }}
                          transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                          className="fixed inset-y-0 right-0 w-[320px] bg-surface z-[60] p-8 border-l border-border overflow-y-auto lg:hidden custom-scrollbar shadow-2xl"
                        >
                          <div className="flex items-center justify-between mb-8">
                            <h3 className="text-lg font-bold text-primary">Analytics & Actions</h3>
                            <button 
                              onClick={() => setIsRightPanelOpen(false)}
                              className="p-2 hover:bg-hover rounded-lg text-secondary"
                            >
                              <X size={20} />
                            </button>
                          </div>
                          <div className="space-y-8">
                            {renderRightPanelContent()}
                          </div>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </div>
            )}

            {activeView === 'orders' && <AdminOrders onPrintInvoice={onPrintInvoice} />}
            {activeView === 'incomplete-orders' && <AdminIncompleteOrders />}
            {activeView === 'customers' && <AdminCustomers />}
            {activeView === 'products' && <AdminProducts />}
            {activeView === 'inventory' && <AdminInventory />}
            {activeView === 'server-status' && <ServerStatus />}
            {activeView === 'delivery' && <DeliverySystem />}
            {activeView === 'workshop' && <Workshop />}
            {activeView === 'vendors' && <Vendors />}
            {activeView === 'offer-manager' && <OfferManager />}
            {activeView === 'account' && (
              <AccountSettingsCenter 
                isMainSidebarOpen={isSidebarOpen} 
                onToggleMainSidebar={setIsSidebarOpen} 
                moduleName="account"
              />
            )}
            {activeView === 'settings' && (
              <AccountSettingsCenter 
                isMainSidebarOpen={isSidebarOpen} 
                onToggleMainSidebar={setIsSidebarOpen} 
                moduleName="settings"
              />
            )}

            {activeView === 'payment-settings' && paymentConfig && (
              <div className="space-y-8 pb-20">
                {/* Tabs */}
                <div className="flex items-center gap-2 p-1 bg-surface border border-border rounded-2xl w-fit">
                  <button
                    onClick={() => setPaymentSubTab('settings')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                      paymentSubTab === 'settings' 
                        ? 'bg-active text-white shadow-lg shadow-active/20' 
                        : 'text-secondary hover:text-primary hover:bg-hover'
                    }`}
                  >
                    Payment Settings
                  </button>
                  <button
                    onClick={() => setPaymentSubTab('view')}
                    className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
                      paymentSubTab === 'view' 
                        ? 'bg-active text-white shadow-lg shadow-active/20' 
                        : 'text-secondary hover:text-primary hover:bg-hover'
                    }`}
                  >
                    Payment View
                  </button>
                </div>

                {paymentSubTab === 'settings' ? (
                  <form onSubmit={handleUpdateConfig} className="space-y-8">
                    {/* Global Controls */}
                    <section className="p-8 bg-surface border border-border rounded-[40px] space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                        <ShieldCheck size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-primary">Global Payment Controls</h2>
                        <p className="text-xs text-secondary mt-1">Manage visibility and system behavior.</p>
                      </div>
                    </div>
                    <button 
                      type="submit"
                      disabled={isLoading}
                      className="px-6 py-3 bg-active text-white rounded-xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20 disabled:opacity-50"
                    >
                      {isLoading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                      Save Changes
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="p-6 bg-hover rounded-3xl border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Payment Mode</div>
                          <div className="text-[10px] text-secondary uppercase tracking-widest">Select operational mode</div>
                        </div>
                        <div className="flex bg-hover p-1 rounded-xl border border-border">
                          {(['Manual', 'Merchant'] as const).map((mode) => (
                            <button
                              key={mode}
                              type="button"
                              onClick={() => setPaymentConfig({ ...paymentConfig, paymentMode: mode })}
                              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                paymentConfig.paymentMode === mode ? 'bg-active text-white shadow-lg' : 'text-secondary hover:text-primary'
                              }`}
                            >
                              {mode}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 bg-hover rounded-3xl border border-border space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Environment</div>
                          <div className="text-[10px] text-secondary uppercase tracking-widest">Sandbox vs Live</div>
                        </div>
                        <div className="flex bg-hover p-1 rounded-xl border border-border">
                          {(['Sandbox', 'Live'] as const).map((env) => (
                            <button
                              key={env}
                              type="button"
                              onClick={() => setPaymentConfig({ ...paymentConfig, environment: env })}
                              className={`px-4 py-1.5 rounded-lg text-[10px] font-bold transition-all ${
                                paymentConfig.environment === env ? 'bg-active text-white shadow-lg' : 'text-secondary hover:text-primary'
                              }`}
                            >
                              {env}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="p-6 bg-hover rounded-3xl border border-border flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Cash on Delivery</div>
                          <div className="text-[10px] text-secondary uppercase tracking-widest">Show on checkout</div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setPaymentConfig({ ...paymentConfig, codEnabled: !paymentConfig.codEnabled })}
                          className={`w-12 h-6 rounded-full transition-all relative ${paymentConfig.codEnabled ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${paymentConfig.codEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="p-6 bg-hover rounded-3xl border border-border flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Online Payment</div>
                          <div className="text-[10px] text-secondary uppercase tracking-widest">Show on checkout</div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setPaymentConfig({ ...paymentConfig, onlineEnabled: !paymentConfig.onlineEnabled })}
                          className={`w-12 h-6 rounded-full transition-all relative ${paymentConfig.onlineEnabled ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${paymentConfig.onlineEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>

                      <div className="p-6 bg-hover rounded-3xl border border-border flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Bank Transfer</div>
                          <div className="text-[10px] text-secondary uppercase tracking-widest">Show on checkout</div>
                        </div>
                        <button 
                          type="button"
                          onClick={() => setPaymentConfig({ ...paymentConfig, bankEnabled: !paymentConfig.bankEnabled })}
                          className={`w-12 h-6 rounded-full transition-all relative ${paymentConfig.bankEnabled ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${paymentConfig.bankEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-6 bg-hover rounded-3xl border border-border space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-primary">COD Limits</div>
                            <div className="text-[10px] text-secondary uppercase tracking-widest">Min/Max Order Value</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Min Amount (৳)</label>
                            <input 
                              type="number" 
                              value={paymentConfig.codMinAmount}
                              onChange={(e) => setPaymentConfig({ ...paymentConfig, codMinAmount: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 bg-hover border border-border rounded-xl text-sm text-primary focus:border-active/50 outline-none transition-all"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Max Amount (৳)</label>
                            <input 
                              type="number" 
                              value={paymentConfig.codMaxAmount}
                              onChange={(e) => setPaymentConfig({ ...paymentConfig, codMaxAmount: parseInt(e.target.value) })}
                              className="w-full px-4 py-2 bg-hover border border-border rounded-xl text-sm text-primary focus:border-active/50 outline-none transition-all"
                            />
                          </div>
                        </div>
                      </div>

                      <div className="p-6 bg-hover rounded-3xl border border-border space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <div className="text-sm font-bold text-primary">System Modes</div>
                            <div className="text-[10px] text-secondary uppercase tracking-widest">Traffic & Maintenance</div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border">
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">High Traffic</span>
                            <button 
                              type="button"
                              onClick={() => setPaymentConfig({ ...paymentConfig, highTrafficMode: !paymentConfig.highTrafficMode })}
                              className={`w-10 h-5 rounded-full transition-all relative ${paymentConfig.highTrafficMode ? 'bg-yellow-500' : 'bg-hover'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${paymentConfig.highTrafficMode ? 'left-5.5' : 'left-0.5'}`} />
                            </button>
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Maintenance</span>
                            <button 
                              type="button"
                              onClick={() => setPaymentConfig({ ...paymentConfig, maintenanceMode: !paymentConfig.maintenanceMode })}
                              className={`w-10 h-5 rounded-full transition-all relative ${paymentConfig.maintenanceMode ? 'bg-rose-500' : 'bg-hover'}`}
                            >
                              <div className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${paymentConfig.maintenanceMode ? 'left-5.5' : 'left-0.5'}`} />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Global Payment Instruction (Custom Message)</label>
                      <textarea 
                        value={paymentConfig.instruction}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, instruction: e.target.value })}
                        rows={2}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all resize-none"
                        placeholder="e.g. Payment করার পর Transaction ID দিন"
                      />
                    </div>
                </section>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* bKash Config */}
                  <section className="p-8 bg-surface border border-border rounded-[40px] space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#D12053]/10 text-[#D12053] rounded-2xl flex items-center justify-center">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-primary">bKash Configuration</h2>
                          <p className="text-xs text-secondary mt-1">Official Merchant API Settings.</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, isEnabled: !paymentConfig.bkash.isEnabled } })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          paymentConfig.bkash.isEnabled ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-hover text-secondary border border-border'
                        }`}
                      >
                        {paymentConfig.bkash.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">bKash Number</label>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                          <input 
                            type="text"
                            value={paymentConfig.bkashNumber}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, bkashNumber: e.target.value })}
                            className="w-full bg-hover border border-border rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-active transition-all font-mono"
                            placeholder="e.g. 017XXXXXXXX"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Account Type</label>
                        <select 
                          value={paymentConfig.bkashType}
                          onChange={(e) => setPaymentConfig({ ...paymentConfig, bkashType: e.target.value as 'personal' | 'merchant' })}
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all appearance-none"
                        >
                          <option value="personal">Personal</option>
                          <option value="merchant">Merchant</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Manual Number (Locked)</label>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                          <input 
                            type="text"
                            value={paymentConfig.bkash.manualNumber}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, manualNumber: e.target.value } })}
                            className="w-full bg-hover border border-border rounded-2xl pl-10 pr-10 py-3 text-sm outline-none focus:border-active transition-all font-mono"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-active" size={14} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Account Type</label>
                          <select 
                            value={paymentConfig.bkash.accountType}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, accountType: e.target.value as any } })}
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all appearance-none"
                          >
                            <option value="Personal">Personal</option>
                            <option value="Merchant">Merchant</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Instruction</label>
                          <input 
                            type="text"
                            value={paymentConfig.bkash.instruction}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, instruction: e.target.value } })}
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                            placeholder="e.g. Send Money Only"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">App Key</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                            <input 
                              type={showSecrets['bkash_key'] ? 'text' : 'password'}
                              value={paymentConfig.bkash.appKey}
                              onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, appKey: e.target.value } })}
                              className="w-full bg-hover border border-border rounded-2xl pl-10 pr-10 py-3 text-sm outline-none focus:border-active transition-all"
                            />
                            <button type="button" onClick={() => toggleSecret('bkash_key')} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-active">
                              {showSecrets['bkash_key'] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">App Secret</label>
                          <div className="relative">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                            <input 
                              type={showSecrets['bkash_secret'] ? 'text' : 'password'}
                              value={paymentConfig.bkash.appSecret}
                              onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, appSecret: e.target.value } })}
                              className="w-full bg-hover border border-border rounded-2xl pl-10 pr-10 py-3 text-sm outline-none focus:border-active transition-all"
                            />
                            <button type="button" onClick={() => toggleSecret('bkash_secret')} className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-active">
                              {showSecrets['bkash_secret'] ? <EyeOff size={14} /> : <Eye size={14} />}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Username</label>
                          <input 
                            type="text"
                            value={paymentConfig.bkash.username}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, username: e.target.value } })}
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Password</label>
                          <input 
                            type="password"
                            value={paymentConfig.bkash.password}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, password: e.target.value } })}
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Base URL</label>
                        <div className="relative">
                          <Globe className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                          <select 
                            value={paymentConfig.bkash.baseUrl}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, baseUrl: e.target.value } })}
                            className="w-full bg-hover border border-border rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-active transition-all appearance-none"
                          >
                            <option value="https://sandbox.bka.sh">Sandbox (Testing)</option>
                            <option value="https://checkout.pay.bka.sh">Live (Production)</option>
                          </select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Callback URL</label>
                        <input 
                          type="text"
                          value={paymentConfig.bkash.callbackUrl}
                          onChange={(e) => setPaymentConfig({ ...paymentConfig, bkash: { ...paymentConfig.bkash, callbackUrl: e.target.value } })}
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                        />
                      </div>
                    </div>
                  </section>

                  {/* Nagad Config */}
                  <section className="p-8 bg-surface border border-border rounded-[40px] space-y-8">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-[#F27D26]/10 text-[#F27D26] rounded-2xl flex items-center justify-center">
                          <Smartphone size={24} />
                        </div>
                        <div>
                          <h2 className="text-xl font-bold text-primary">Nagad Configuration</h2>
                          <p className="text-xs text-secondary mt-1">Official Merchant API Settings.</p>
                        </div>
                      </div>
                      <button 
                        type="button"
                        onClick={() => setPaymentConfig({ ...paymentConfig, nagad: { ...paymentConfig.nagad, isEnabled: !paymentConfig.nagad.isEnabled } })}
                        className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                          paymentConfig.nagad.isEnabled ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-hover text-secondary border border-border'
                        }`}
                      >
                        {paymentConfig.nagad.isEnabled ? 'Enabled' : 'Disabled'}
                      </button>
                    </div>

                    <div className="space-y-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Nagad Number</label>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                          <input 
                            type="text"
                            value={paymentConfig.nagadNumber}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, nagadNumber: e.target.value })}
                            className="w-full bg-hover border border-border rounded-2xl pl-10 pr-4 py-3 text-sm outline-none focus:border-active transition-all font-mono"
                            placeholder="e.g. 018XXXXXXXX"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Account Type</label>
                        <select 
                          value={paymentConfig.nagadType}
                          onChange={(e) => setPaymentConfig({ ...paymentConfig, nagadType: e.target.value as 'personal' | 'merchant' })}
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all appearance-none"
                        >
                          <option value="personal">Personal</option>
                          <option value="merchant">Merchant</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Manual Number (Locked)</label>
                        <div className="relative">
                          <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={14} />
                          <input 
                            type="text"
                            value={paymentConfig.nagad.manualNumber}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, nagad: { ...paymentConfig.nagad, manualNumber: e.target.value } })}
                            className="w-full bg-hover border border-border rounded-2xl pl-10 pr-10 py-3 text-sm outline-none focus:border-active transition-all font-mono"
                          />
                          <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-active" size={14} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Merchant ID</label>
                        <input 
                          type="text"
                          value={paymentConfig.nagad.merchantId}
                          onChange={(e) => setPaymentConfig({ ...paymentConfig, nagad: { ...paymentConfig.nagad, merchantId: e.target.value } })}
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Public Key</label>
                        <textarea 
                          value={paymentConfig.nagad.publicKey}
                          onChange={(e) => setPaymentConfig({ ...paymentConfig, nagad: { ...paymentConfig.nagad, publicKey: e.target.value } })}
                          rows={2}
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all resize-none"
                          placeholder="Paste Public Key here..."
                        />
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Private Key</label>
                        <div className="relative">
                          <textarea 
                            value={paymentConfig.nagad.privateKey}
                            onChange={(e) => setPaymentConfig({ ...paymentConfig, nagad: { ...paymentConfig.nagad, privateKey: e.target.value } })}
                            rows={2}
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all resize-none"
                            placeholder="Paste Private Key here..."
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Base URL</label>
                        <select 
                          value={paymentConfig.nagad.baseUrl}
                          onChange={(e) => setPaymentConfig({ ...paymentConfig, nagad: { ...paymentConfig.nagad, baseUrl: e.target.value } })}
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all appearance-none"
                        >
                          <option value="https://sandbox.nagad.com">Sandbox (Testing)</option>
                          <option value="https://api.nagad.com">Live (Production)</option>
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Instruction</label>
                        <input 
                          type="text"
                          value={paymentConfig.nagad.instruction}
                          onChange={(e) => setPaymentConfig({ ...paymentConfig, nagad: { ...paymentConfig.nagad, instruction: e.target.value } })}
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                          placeholder="e.g. Send Money Only"
                        />
                      </div>
                    </div>
                  </section>
                </div>

                {/* Bank Transfer Config */}
                <section className="p-8 bg-surface border border-border rounded-[40px] space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                        <CreditCard size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-primary">Bank Transfer Configuration</h2>
                        <p className="text-xs text-secondary mt-1">Manual Bank Account Details for Customers.</p>
                      </div>
                    </div>
                    <button 
                      type="button"
                      onClick={() => setPaymentConfig({ ...paymentConfig, bank: { ...paymentConfig.bank, isEnabled: !paymentConfig.bank.isEnabled } })}
                      className={`px-4 py-2 rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                        paymentConfig.bank.isEnabled ? 'bg-green-500/10 text-green-600 border border-green-500/20' : 'bg-hover text-secondary border border-border'
                      }`}
                    >
                      {paymentConfig.bank.isEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Bank Name</label>
                      <input 
                        type="text"
                        value={paymentConfig.bank.bankName}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, bank: { ...paymentConfig.bank, bankName: e.target.value } })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                        placeholder="e.g. Dutch Bangla Bank"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Branch Name</label>
                      <input 
                        type="text"
                        value={paymentConfig.bank.branch}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, bank: { ...paymentConfig.bank, branch: e.target.value } })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                        placeholder="e.g. Manikganj Branch"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Account Name</label>
                      <input 
                        type="text"
                        value={paymentConfig.bank.accountName}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, bank: { ...paymentConfig.bank, accountName: e.target.value } })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                        placeholder="e.g. Tazu Mart BD"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Account Number</label>
                      <input 
                        type="text"
                        value={paymentConfig.bank.accountNumber}
                        onChange={(e) => setPaymentConfig({ ...paymentConfig, bank: { ...paymentConfig.bank, accountNumber: e.target.value } })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all font-mono"
                        placeholder="e.g. 123.456.789"
                      />
                    </div>
                  </div>
                </section>

                <div className="p-6 bg-yellow-500/10 border border-yellow-500/20 rounded-3xl flex items-start gap-4">
                  <AlertTriangle className="text-yellow-500 shrink-0 mt-1" size={20} />
                  <div className="space-y-1">
                    <div className="text-sm font-bold text-yellow-500">Security Warning</div>
                    <p className="text-xs text-secondary leading-relaxed">
                      All API keys and secrets are encrypted before storage. Ensure you are using the correct Base URL for Sandbox or Live environments to avoid transaction failures.
                    </p>
                  </div>
                </div>
              </form>
            ) : (
              <div className="space-y-8">
                {/* Payment View Tab Content */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="p-8 bg-surface border border-border rounded-[40px] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#D12053]/10 text-[#D12053] rounded-2xl flex items-center justify-center">
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary">bKash Total</h3>
                        <p className="text-3xl font-black text-[#D12053]">
                          ৳{orders.filter(o => o.paymentMethod === 'bKash').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="p-8 bg-surface border border-border rounded-[40px] space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-[#ED1C24]/10 text-[#ED1C24] rounded-2xl flex items-center justify-center">
                        <Smartphone size={24} />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-primary">Nagad Total</h3>
                        <p className="text-3xl font-black text-[#ED1C24]">
                          ৳{orders.filter(o => o.paymentMethod === 'Nagad').reduce((sum, o) => sum + o.amount, 0).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <section className="p-8 bg-surface border border-border rounded-[40px] space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                        <History size={24} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold text-primary">Recent Payments</h2>
                        <p className="text-xs text-secondary mt-1">Track incoming digital payments.</p>
                      </div>
                    </div>
                    <button 
                      onClick={fetchOrders}
                      className="p-2 hover:bg-hover rounded-xl transition-all text-secondary"
                    >
                      <RefreshCw size={20} />
                    </button>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="text-left border-b border-border">
                          <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-widest px-4">Customer</th>
                          <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-widest px-4">Method</th>
                          <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-widest px-4">Amount</th>
                          <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-widest px-4">Trx ID</th>
                          <th className="pb-4 text-[10px] font-bold text-secondary uppercase tracking-widest px-4">Date</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {orders.filter(o => o.paymentMethod === 'bKash' || o.paymentMethod === 'Nagad' || o.paymentMethod === 'Bank Transfer').slice(0, 10).map((order) => (
                          <tr key={order.id} className="hover:bg-hover/50 transition-all">
                            <td className="py-4 px-4">
                              <div className="text-sm font-bold text-primary">{order.customerName}</div>
                              <div className="text-[10px] text-secondary">{order.customerPhone}</div>
                            </td>
                            <td className="py-4 px-4">
                              <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${
                                order.paymentMethod === 'bKash' ? 'bg-[#D12053]/10 text-[#D12053]' :
                                order.paymentMethod === 'Nagad' ? 'bg-[#ED1C24]/10 text-[#ED1C24]' :
                                'bg-active/10 text-active'
                              }`}>
                                {order.paymentMethod}
                              </span>
                            </td>
                            <td className="py-4 px-4 text-sm font-bold text-primary">৳{order.amount.toLocaleString()}</td>
                            <td className="py-4 px-4 font-mono text-xs text-secondary">{order.transactionId || 'N/A'}</td>
                            <td className="py-4 px-4 text-xs text-secondary">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </section>
              </div>
            )}
          </div>
        )}

            {activeView.startsWith('infra-') && renderInfraView()}

            {activeView === 'marketing' && <MarketingCenter />}

            {activeView === 'finance' && <FinanceCenter />}

            {activeView === 'reports' && <ReportsCenter />}

            {activeView === 'disputes' && <DisputesCenter />}

            {activeView === 'roles' && <RolesCenter />}

            {activeView === 'seo' && <SEOCenter />}

            {activeView === 'footer' && <FooterManagement />}

            {activeView === 'theme' && <ThemeCenter />}

            {activeView === 'reviews' && <ReviewModeration />}

            {activeView === 'category-mgmt' && <CategoryManagement />}

            {activeView === 'banner-mgmt' && <BannerManagement />}

            {activeView === 'coins-settings' && <CoinSettings />}

            {activeView === 'logs' && <SystemLogs />}

            {(activeView === 'feedback-suggestions' || activeView === 'feedback-errors') && (
              <FeedbackManagement type={activeView === 'feedback-suggestions' ? 'suggestions' : 'errors'} />
            )}

            {activeView === 'notifications' && (
              <NotificationCenter 
                notifications={notifications}
                onMarkAsRead={handleMarkAsRead}
                onMarkAllAsRead={handleMarkAllAsRead}
                onDelete={handleDeleteNotification}
                onArchive={handleArchiveNotification}
                onBulkAction={handleBulkNotificationAction}
              />
            )}

            {activeView.startsWith('ai-') && (
              !isAIInstalled ? (
                <AIInstallationManager 
                  isInstalled={isAIInstalled} 
                  onInstallationComplete={() => setIsAIInstalled(true)} 
                />
              ) : (
                <>
                  {activeView === 'ai-dashboard' && <AI.AIDashboard isEnabled={aiFeatures['ai-dashboard']} onToggle={() => handleToggleAIFeature('ai-dashboard')} />}
                  {activeView === 'ai-customer-detection' && <AI.AICustomerDetection isEnabled={aiFeatures['ai-customer-detection']} onToggle={() => handleToggleAIFeature('ai-customer-detection')} />}
                  {activeView === 'ai-chat-support' && <AI.AISmartChatSupport isEnabled={aiFeatures['ai-chat-support']} onToggle={() => handleToggleAIFeature('ai-chat-support')} />}
                  {activeView === 'ai-content-generator' && <AI.AIProductContentGenerator isEnabled={aiFeatures['ai-content-generator']} onToggle={() => handleToggleAIFeature('ai-content-generator')} />}
                  {activeView === 'ai-seo-assistant' && <AI.AISEOAssistant isEnabled={aiFeatures['ai-seo-assistant']} onToggle={() => handleToggleAIFeature('ai-seo-assistant')} />}
                  {activeView === 'ai-image-optimizer' && <AI.AIImageOptimizer isEnabled={aiFeatures['ai-image-optimizer']} onToggle={() => handleToggleAIFeature('ai-image-optimizer')} />}
                  {activeView === 'ai-visitor-analytics' && <AI.AIVisitorAnalytics isEnabled={aiFeatures['ai-visitor-analytics']} onToggle={() => handleToggleAIFeature('ai-visitor-analytics')} />}
                  {activeView === 'ai-fraud-detection' && <AI.AIFraudDetection isEnabled={aiFeatures['ai-fraud-detection']} onToggle={() => handleToggleAIFeature('ai-fraud-detection')} />}
                  {activeView === 'ai-product-recommendation' && <AI.AIProductRecommendation isEnabled={aiFeatures['ai-product-recommendation']} onToggle={() => handleToggleAIFeature('ai-product-recommendation')} />}
                  {activeView === 'ai-review-analyzer' && <AI.AIReviewAnalyzer isEnabled={aiFeatures['ai-review-analyzer']} onToggle={() => handleToggleAIFeature('ai-review-analyzer')} />}
                  {activeView === 'ai-marketing-automation' && <AI.AIMarketingAutomation isEnabled={aiFeatures['ai-marketing-automation']} onToggle={() => handleToggleAIFeature('ai-marketing-automation')} />}
                  {activeView === 'ai-sales-prediction' && <AI.AISalesPrediction isEnabled={aiFeatures['ai-sales-prediction']} onToggle={() => handleToggleAIFeature('ai-sales-prediction')} />}
                  {activeView === 'ai-inventory-prediction' && <AI.AIInventoryPrediction isEnabled={aiFeatures['ai-inventory-prediction']} onToggle={() => handleToggleAIFeature('ai-inventory-prediction')} />}
                  {activeView === 'ai-customer-behavior' && <AI.AICustomerBehaviorTracker isEnabled={aiFeatures['ai-customer-behavior']} onToggle={() => handleToggleAIFeature('ai-customer-behavior')} />}
                  {activeView === 'ai-security-monitoring' && <AI.AISecurityMonitoring isEnabled={aiFeatures['ai-security-monitoring']} onToggle={() => handleToggleAIFeature('ai-security-monitoring')} />}
                  {activeView === 'ai-notification-system' && <AI.AIAutoNotificationSystem isEnabled={aiFeatures['ai-notification-system']} onToggle={() => handleToggleAIFeature('ai-notification-system')} />}
                </>
              )
            )}

            {activeView !== 'dashboard' && 
             activeView !== 'payment-settings' && 
             activeView !== 'orders' && 
             activeView !== 'products' && 
             activeView !== 'inventory' && 
             activeView !== 'server-status' && 
             activeView !== 'delivery' && 
             activeView !== 'workshop' && 
             activeView !== 'vendors' && 
             activeView !== 'marketing' && 
             activeView !== 'finance' && 
             activeView !== 'reports' && 
             activeView !== 'disputes' && 
             activeView !== 'roles' && 
             activeView !== 'seo' && 
             activeView !== 'footer' && 
             activeView !== 'theme' && 
             activeView !== 'reviews' && 
             activeView !== 'coins-settings' && 
             activeView !== 'feedback-suggestions' && 
             activeView !== 'feedback-errors' && 
             !activeView.startsWith('infra-') && 
             !activeView.startsWith('ai-') && (
              <div className="p-20 text-center space-y-4 bg-surface border border-border rounded-[40px]">
                <div className="w-20 h-20 bg-hover rounded-full flex items-center justify-center mx-auto">
                  <Settings size={40} className="text-secondary animate-pulse" />
                </div>
                <h2 className="text-2xl font-bold text-primary">{sidebarItems.find(i => i.id === activeView)?.label} View</h2>
                <p className="text-secondary text-sm">This module is currently being optimized for the new payment system.</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </motion.div>
      {showSwitchModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={() => setShowSwitchModal(false)}
          />
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="relative w-full max-w-md bg-surface border border-border rounded-[32px] p-8 space-y-6 shadow-2xl"
          >
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto">
              <RefreshCw size={32} className="animate-spin-slow" />
            </div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold text-primary">Confirm Environment Migration</h3>
              <p className="text-sm text-muted leading-relaxed">
                You are about to switch to the <span className="text-indigo-600 font-bold">{pendingEnv}</span> environment. This action will trigger an automatic system backup.
              </p>
            </div>
            <div className="p-4 bg-hover rounded-2xl border border-border space-y-3">
              <div className="flex items-center gap-3 text-xs text-muted">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>Full Database Backup</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>File System Snapshot</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-muted">
                <CheckCircle2 size={14} className="text-green-600" />
                <span>Validation Check</span>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={() => setShowSwitchModal(false)}
                className="flex-1 py-3 bg-hover border border-border rounded-xl text-sm font-bold text-muted hover:bg-border transition-all"
              >
                Cancel
              </button>
              <button 
                onClick={confirmEnvSwitch}
                disabled={isLoading}
                className="flex-1 py-3 bg-indigo-600 text-white rounded-xl text-sm font-bold hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-500/20 disabled:opacity-50"
              >
                {isLoading ? 'Processing...' : 'Confirm & Backup'}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
