import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  User, 
  Lock, 
  Shield, 
  ShieldCheck,
  Smartphone, 
  Users, 
  Bell, 
  Building2, 
  Palette, 
  CreditCard, 
  Truck, 
  Percent, 
  Zap, 
  UserPlus, 
  Mail, 
  Database, 
  Share2, 
  Settings, 
  Activity, 
  Save, 
  Loader2, 
  Plus, 
  Trash2, 
  Eye, 
  EyeOff, 
  LogOut, 
  Monitor, 
  MapPin, 
  Globe, 
  CheckCircle2, 
  AlertCircle,
  Clock,
  Download,
  FileText,
  SmartphoneNfc,
  Key,
  RefreshCw,
  Search,
  Filter,
  ChevronRight,
  X,
  Wrench,
  Bug,
  Terminal,
  Hammer,
  Trash,
  Maximize2,
  Minimize2,
  ShieldAlert
} from 'lucide-react';
import { 
  AdminUser, 
  AdminRole, 
  AdminSession, 
  BusinessSettings, 
  ThemeSettings, 
  TaxSettings, 
  CurrencySettings, 
  AutomationRules, 
  EmailTemplate, 
  SmsTemplate, 
  ApiIntegration, 
  SystemPreferences, 
  AuditLog, 
  BackupRecord,
  NotificationPreferences
} from '../../types';

import ThemeCenter from './ThemeCenter';

type SettingsTab = 
  | 'info' 
  | 'invoice' 
  | 'tax-currency' 
  | 'payment' 
  | 'shipping' 
  | 'automation' 
  | 'maintenance' 
  | 'security'
  | 'notifications';

export default function AccountSettingsCenter({ 
  isMainSidebarOpen, 
  onToggleMainSidebar,
  moduleName
}: { 
  isMainSidebarOpen?: boolean; 
  onToggleMainSidebar?: (open: boolean) => void;
  moduleName?: 'settings' | 'account';
}) {
  const [activeTab, setActiveTab] = useState<SettingsTab>(moduleName === 'account' ? 'security' : 'info');
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isQuickSettingsOpen, setIsQuickSettingsOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  // Data States
  const [profile, setProfile] = useState<AdminUser | null>(null);
  const [sessions, setSessions] = useState<AdminSession[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [business, setBusiness] = useState<BusinessSettings | null>(null);
  const [theme, setTheme] = useState<ThemeSettings | null>(null);
  const [notificationPrefs, setNotificationPrefs] = useState<NotificationPreferences>({
    enableBell: true,
    enableEmail: true,
    enableSms: false,
    enablePush: true,
    criticalOnlyMode: false,
    categories: {
      orders: true,
      customers: true,
      system: true,
      marketing: false,
      security: true,
    }
  });
  const [tax, setTax] = useState<TaxSettings | null>(null);
  const [currency, setCurrency] = useState<CurrencySettings | null>(null);
  const [automation, setAutomation] = useState<AutomationRules | null>(null);
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [smsTemplates, setSmsTemplates] = useState<SmsTemplate[]>([]);
  const [integrations, setIntegrations] = useState<ApiIntegration[]>([]);
  const [preferences, setPreferences] = useState<SystemPreferences | null>(null);
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [backups, setBackups] = useState<BackupRecord[]>([]);

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const endpoints: Record<string, string> = {
        info: '/api/admin/settings/business',
        invoice: '/api/admin/settings/business',
        'tax-currency': '/api/admin/settings/tax',
        payment: '/api/admin/settings/api-integrations',
        shipping: '/api/admin/settings/preferences',
        automation: '/api/admin/settings/automation',
        maintenance: '/api/admin/settings/preferences',
        security: '/api/admin/settings/preferences',
        notifications: '/api/admin/settings/notifications',
      };

      const endpoint = endpoints[activeTab];
      if (!endpoint) {
        setIsLoading(false);
        return;
      }

      const res = await fetch(endpoint);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      
      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new TypeError("Oops, we haven't got JSON!");
      }

      const data = await res.json();

      switch (activeTab) {
        case 'info':
        case 'invoice': setBusiness(data); break;
        case 'tax-currency': 
          setTax(data);
          const curRes = await fetch('/api/admin/settings/currency');
          if (curRes.ok) setCurrency(await curRes.json());
          break;
        case 'payment': setIntegrations(data); break;
        case 'automation': setAutomation(data); break;
        case 'shipping':
        case 'maintenance':
        case 'security': setPreferences(data); break;
        case 'notifications': setNotificationPrefs(data); break;
      }
    } catch (err) {
      console.error('Failed to fetch settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async (endpoint: string, data: any) => {
    setIsSaving(true);
    try {
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        alert('Settings saved successfully!');
        fetchData();
      } else {
        const errorData = await res.json().catch(() => ({ message: 'Unknown error' }));
        throw new Error(errorData.message || `HTTP error! status: ${res.status}`);
      }
    } catch (err: any) {
      console.error('Failed to save settings', err);
      alert(`Error saving settings: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const sidebarItems = [
    { id: 'info', label: 'Store Information', icon: Building2, group: 'General' },
    { id: 'invoice', label: 'Invoice Setup', icon: FileText, group: 'General' },
    
    { id: 'tax-currency', label: 'Tax & Currency', icon: CreditCard, group: 'Finance' },
    { id: 'payment', label: 'Payment Setup', icon: Share2, group: 'Finance' },
    
    { id: 'shipping', label: 'Shipping Setup', icon: Truck, group: 'Logistics' },
    { id: 'automation', label: 'Order Automation', icon: Zap, group: 'Logistics' },
    
    { id: 'maintenance', label: 'Maintenance', icon: Activity, group: 'System' },
    { id: 'security', label: 'Security Basics', icon: ShieldCheck, group: 'System' },
    { id: 'notifications', label: 'Notification Preferences', icon: Bell, group: 'System' },
  ];

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <Loader2 className="animate-spin text-active" size={40} />
          <p className="text-secondary font-bold">Loading Settings Center...</p>
        </div>
      );
    }

    switch (activeTab) {
      case 'info':
        return business && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">Store Information</h2>
                <p className="text-sm text-muted">Configure your store identity and legal information.</p>
              </div>
              <button 
                onClick={() => handleSave('/api/admin/settings/business', business)}
                className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Information
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-surface border border-border rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Building2 size={20} className="text-active" />
                  Store Identity
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Store Name</label>
                    <input 
                      type="text"
                      value={business.storeName || ''}
                      onChange={(e) => setBusiness({ ...business, storeName: e.target.value })}
                      className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Store Logo</label>
                      <div className="p-4 bg-hover border border-border rounded-2xl flex items-center justify-center">
                        <img src={business.logo} alt="Logo" className="h-12 object-contain" />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Favicon</label>
                      <div className="p-4 bg-hover border border-border rounded-2xl flex items-center justify-center">
                        <img src={business.favicon} alt="Favicon" className="h-8 w-8 object-contain" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-surface border border-border rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <Globe size={20} className="text-active" />
                  Contact & Legal
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Business Address</label>
                    <textarea 
                      value={business.address || ''}
                      onChange={(e) => setBusiness({ ...business, address: e.target.value })}
                      rows={2}
                      className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all resize-none"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Support Phone</label>
                      <input 
                        type="text"
                        value={business.phone || ''}
                        onChange={(e) => setBusiness({ ...business, phone: e.target.value })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Support Email</label>
                      <input 
                        type="email"
                        value={business.email || ''}
                        onChange={(e) => setBusiness({ ...business, email: e.target.value })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Trade License</label>
                      <input 
                        type="text"
                        value={business.tradeLicense || ''}
                        onChange={(e) => setBusiness({ ...business, tradeLicense: e.target.value })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">VAT / Tax ID</label>
                      <input 
                        type="text"
                        value={business.vatId || ''}
                        onChange={(e) => setBusiness({ ...business, vatId: e.target.value })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'invoice':
        return business && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-primary">Business & Invoice Settings</h2>
                <p className="text-sm text-muted">Configure your invoice appearance and order defaults.</p>
              </div>
              <button 
                onClick={() => handleSave('/api/admin/settings/business', business)}
                className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Invoice Settings
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-surface border border-border rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                  <FileText size={20} className="text-active" />
                  Invoice Configuration
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Invoice Prefix</label>
                      <input 
                        type="text"
                        value={business.invoiceConfig.prefix || ''}
                        onChange={(e) => setBusiness({ ...business, invoiceConfig: { ...business.invoiceConfig, prefix: e.target.value } })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Next Number</label>
                      <input 
                        type="number"
                        value={business.invoiceConfig.nextNumber || 0}
                        onChange={(e) => setBusiness({ ...business, invoiceConfig: { ...business.invoiceConfig, nextNumber: parseInt(e.target.value) || 0 } })}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-hover rounded-2xl border border-border">
                    <div>
                      <div className="text-sm font-bold text-primary">Auto Numbering</div>
                      <p className="text-[10px] text-muted">Increment automatically</p>
                    </div>
                    <button 
                      onClick={() => setBusiness({ ...business, invoiceConfig: { ...business.invoiceConfig, autoNumbering: !business.invoiceConfig.autoNumbering } })}
                      className={`w-12 h-6 rounded-full transition-all relative ${business.invoiceConfig.autoNumbering ? 'bg-active' : 'bg-border'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${business.invoiceConfig.autoNumbering ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Invoice Footer Text</label>
                    <textarea 
                      value={business.invoiceConfig.footer || ''}
                      onChange={(e) => setBusiness({ ...business, invoiceConfig: { ...business.invoiceConfig, footer: e.target.value } })}
                      rows={2}
                      className="w-full bg-hover border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <Zap size={20} className="text-active" />
                  Order Defaults
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Default Order Status</label>
                    <select 
                      value={business.invoiceConfig.defaultOrderStatus || 'Pending'}
                      onChange={(e) => setBusiness({ ...business, invoiceConfig: { ...business.invoiceConfig, defaultOrderStatus: e.target.value as any } })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                    >
                      <option value="Pending">Pending</option>
                      <option value="Confirmed">Confirmed</option>
                      <option value="Processing">Processing</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Signature Upload</label>
                    <div className="p-8 bg-white/5 border border-dashed border-white/10 rounded-2xl flex flex-col items-center justify-center gap-2 hover:bg-white/10 transition-all cursor-pointer">
                      <Plus size={24} className="text-secondary" />
                      <span className="text-xs text-secondary font-bold uppercase tracking-widest">Upload Signature</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'tax-currency':
        return tax && currency && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#EAEAEA]">Tax & Currency Settings</h2>
                <p className="text-sm text-secondary">Manage financial localization and tax compliance.</p>
              </div>
              <button 
                onClick={() => {
                  handleSave('/api/admin/settings/tax', tax);
                  handleSave('/api/admin/settings/currency', currency);
                }}
                className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Financials
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <Percent size={20} className="text-active" />
                  Tax Configuration
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Tax Percentage (%)</label>
                    <input 
                      type="number"
                      value={tax.defaultTaxPercentage || 0}
                      onChange={(e) => setTax({ ...tax, defaultTaxPercentage: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">Tax Mode</div>
                      <p className="text-[10px] text-secondary">{tax.taxInclusive ? 'Inclusive' : 'Exclusive'}</p>
                    </div>
                    <button 
                      onClick={() => setTax({ ...tax, taxInclusive: !tax.taxInclusive })}
                      className={`w-12 h-6 rounded-full transition-all relative ${tax.taxInclusive ? 'bg-active' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${tax.taxInclusive ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">VAT Auto Calculation</div>
                      <p className="text-[10px] text-secondary">Calculate VAT on checkout</p>
                    </div>
                    <button 
                      onClick={() => setTax({ ...tax, vatAutoCalculation: !tax.vatAutoCalculation })}
                      className={`w-12 h-6 rounded-full transition-all relative ${tax.vatAutoCalculation ? 'bg-active' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${tax.vatAutoCalculation ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <Globe size={20} className="text-active" />
                  Currency Localization
                </h3>
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Default Currency</label>
                      <input 
                        type="text"
                        value={currency.defaultCurrency || ''}
                        onChange={(e) => setCurrency({ ...currency, defaultCurrency: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Currency Symbol</label>
                      <input 
                        type="text"
                        value={currency.currencySymbol || ''}
                        onChange={(e) => setCurrency({ ...currency, currencySymbol: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">Multi-Currency Toggle</div>
                      <p className="text-[10px] text-secondary">Allow customers to switch currencies</p>
                    </div>
                    <button 
                      onClick={() => setCurrency({ ...currency, multiCurrencyEnabled: !currency.multiCurrencyEnabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${currency.multiCurrencyEnabled ? 'bg-active' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${currency.multiCurrencyEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'payment':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#EAEAEA]">Payment Configuration</h2>
                <p className="text-sm text-secondary">Manage your payment gateways and processing options.</p>
              </div>
              <button className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20">
                <Save size={18} />
                Save Payment Config
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <Share2 size={20} className="text-active" />
                  Payment Gateway API
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Gateway Provider</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all">
                      <option>SSLCommerz</option>
                      <option>bKash</option>
                      <option>Nagad</option>
                      <option>Stripe</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">API Key / Store ID</label>
                    <input type="password" placeholder="••••••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">Test Mode</div>
                      <p className="text-[10px] text-secondary">Use sandbox environment</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-active relative">
                      <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <CreditCard size={20} className="text-active" />
                  Manual Payment Options
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">Cash on Delivery</div>
                      <p className="text-[10px] text-secondary">Enable COD at checkout</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-active relative">
                      <div className="absolute top-1 left-7 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">Bank Transfer</div>
                      <p className="text-[10px] text-secondary">Show bank details for manual pay</p>
                    </div>
                    <button className="w-12 h-6 rounded-full bg-white/10 relative">
                      <div className="absolute top-1 left-1 w-4 h-4 rounded-full bg-white" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'shipping':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#EAEAEA]">Shipping & Logistics</h2>
                <p className="text-sm text-secondary">Configure your delivery partners and shipping rules.</p>
              </div>
              <button className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20"
              >
                <Save size={18} />
                Save Shipping Setup
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <Truck size={20} className="text-active" />
                  Courier API Configuration
                </h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Courier Provider</label>
                    <select className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all">
                      <option>Pathao</option>
                      <option>Steadfast</option>
                      <option>RedX</option>
                      <option>Paperfly</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">API Secret Key</label>
                    <input type="password" placeholder="••••••••••••••••" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <MapPin size={20} className="text-active" />
                  Shipping Rates & Thresholds
                </h3>
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Inside Dhaka</label>
                      <input type="number" placeholder="60" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Outside Dhaka</label>
                      <input type="number" placeholder="120" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Free Shipping Threshold</label>
                    <input type="number" placeholder="2000" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'automation':
        return automation && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#EAEAEA]">Order Automation</h2>
                <p className="text-sm text-secondary">Define smart rules to automate your order workflow.</p>
              </div>
              <button 
                onClick={() => handleSave('/api/admin/settings/automation', automation)}
                className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Automation
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {[
                { id: 'autoConfirm', label: 'Auto Confirm Order', desc: 'Automatically confirm orders when placed.', icon: Zap },
                { id: 'autoStockDeduction', label: 'Auto Stock Deduction', desc: 'Deduct stock immediately after order placement.', icon: Database },
                { id: 'autoInvoiceGeneration', label: 'Auto Invoice Generation', desc: 'Generate PDF invoice as soon as order is confirmed.', icon: FileText },
              ].map((rule) => (
                <div key={rule.id} className="p-8 bg-white/5 border border-white/10 rounded-[32px] flex items-center justify-between group hover:bg-white/10 transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <rule.icon size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#EAEAEA]">{rule.label}</h3>
                      <p className="text-xs text-secondary">{rule.desc}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setAutomation({ ...automation, order: { ...automation.order, [rule.id]: !(automation.order as any)[rule.id] } })}
                    className={`w-12 h-6 rounded-full transition-all relative ${ (automation.order as any)[rule.id] ? 'bg-active' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${ (automation.order as any)[rule.id] ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              ))}

              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
                      <Clock size={24} />
                    </div>
                    <div>
                      <h3 className="text-sm font-bold text-[#EAEAEA]">Auto Cancel After X Hours</h3>
                      <p className="text-xs text-secondary">Cancel unpaid orders automatically.</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <input 
                      type="number"
                      value={automation.order.autoCancelUnpaidHours || 0}
                      onChange={(e) => setAutomation({ ...automation, order: { ...automation.order, autoCancelUnpaidHours: parseInt(e.target.value) || 0 } })}
                      className="w-20 bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-[#EAEAEA] text-center outline-none focus:border-active transition-all"
                    />
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">Hours</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'maintenance':
        return preferences && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#EAEAEA]">Maintenance & System Control</h2>
                <p className="text-sm text-secondary">Manage site availability and system performance.</p>
              </div>
              <button 
                onClick={() => handleSave('/api/admin/settings/preferences', preferences)}
                className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save System Config
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <Wrench size={20} className="text-active" />
                  Maintenance Mode
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">Maintenance Mode Toggle</div>
                      <p className="text-[10px] text-secondary">Take site offline for visitors</p>
                    </div>
                    <button 
                      onClick={() => setPreferences({ ...preferences, maintenanceMode: !preferences.maintenanceMode })}
                      className={`w-12 h-6 rounded-full transition-all relative ${preferences.maintenanceMode ? 'bg-amber-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${preferences.maintenanceMode ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Maintenance Message</label>
                    <textarea 
                      value={preferences.maintenanceMessage || ''}
                      onChange={(e) => setPreferences({ ...preferences, maintenanceMessage: e.target.value })}
                      rows={3}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all resize-none"
                      placeholder="We'll be back soon..."
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <RefreshCw size={20} className="text-active" />
                  Cache Control
                </h3>
                <div className="space-y-4">
                  <p className="text-xs text-secondary">Clear system cache to reflect recent changes immediately.</p>
                  <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-[#EAEAEA] hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                    <Trash size={18} />
                    Cache Clear Button
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 'security':
        return preferences && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#EAEAEA]">Security Basics</h2>
                <p className="text-sm text-secondary">Configure fundamental security policies for your store.</p>
              </div>
              <button 
                onClick={() => handleSave('/api/admin/settings/preferences', preferences)}
                className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Security Basics
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <ShieldCheck size={20} className="text-active" />
                  Access Control
                </h3>
                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Session Timeout (Minutes)</label>
                    <input 
                      type="number"
                      value={preferences.sessionTimeout || 0}
                      onChange={(e) => setPreferences({ ...preferences, sessionTimeout: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Login Attempt Limit</label>
                    <input 
                      type="number"
                      value={preferences.loginAttemptLimit || 0}
                      onChange={(e) => setPreferences({ ...preferences, loginAttemptLimit: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border border-white/10 rounded-[32px] space-y-6">
                <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
                  <Lock size={20} className="text-active" />
                  IP Restriction
                </h3>
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">IP Restriction Toggle</div>
                      <p className="text-[10px] text-secondary">Limit login to specific IPs</p>
                    </div>
                    <button 
                      onClick={() => setPreferences({ ...preferences, ipRestrictionEnabled: !preferences.ipRestrictionEnabled })}
                      className={`w-12 h-6 rounded-full transition-all relative ${preferences.ipRestrictionEnabled ? 'bg-active' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${preferences.ipRestrictionEnabled ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  <p className="text-[10px] text-secondary italic">Note: IP whitelist can be managed in the advanced security module.</p>
                </div>
              </div>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#EAEAEA]">Notification Preferences</h2>
                <p className="text-sm text-secondary">Control how and when you receive operational alerts.</p>
              </div>
              <button 
                onClick={() => handleSave('/api/admin/settings/notifications', notificationPrefs)}
                className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 hover:bg-active/90 transition-all shadow-lg shadow-active/20"
              >
                {isSaving ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                Save Preferences
              </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Channel Controls */}
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                    <Bell size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#EAEAEA]">Delivery Channels</h3>
                    <p className="text-xs text-secondary mt-1">Enable or disable notification methods.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'enableBell', label: 'In-App Bell Notifications', icon: Bell, desc: 'Show unread count and dropdown in top navigation.' },
                    { id: 'enableEmail', label: 'Email Alerts', icon: Mail, desc: 'Receive important alerts via your admin email.' },
                    { id: 'enableSms', label: 'SMS Notifications', icon: Smartphone, desc: 'Get critical alerts directly on your phone.' },
                    { id: 'enablePush', label: 'Browser Push Notifications', icon: Monitor, desc: 'Real-time desktop alerts even when tab is inactive.' },
                  ].map((channel) => (
                    <div key={channel.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-secondary group-hover:text-active transition-colors">
                          <channel.icon size={20} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-[#EAEAEA]">{channel.label}</div>
                          <div className="text-[10px] text-secondary mt-0.5">{channel.desc}</div>
                        </div>
                      </div>
                      <button 
                        onClick={() => setNotificationPrefs({ ...notificationPrefs, [channel.id]: !notificationPrefs[channel.id as keyof NotificationPreferences] })}
                        className={`w-12 h-6 rounded-full relative transition-all ${notificationPrefs[channel.id as keyof NotificationPreferences] ? 'bg-active' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notificationPrefs[channel.id as keyof NotificationPreferences] ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Category Controls */}
              <div className="p-8 bg-white/5 border border-white/10 rounded-[40px] space-y-8">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                    <Filter size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#EAEAEA]">Alert Categories</h3>
                    <p className="text-xs text-secondary mt-1">Select which modules trigger notifications.</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {[
                    { id: 'orders', label: 'Order & Inventory Alerts', desc: 'New orders, low stock, payment failures.' },
                    { id: 'customers', label: 'Customer Engagement', desc: 'New registrations, reviews, refund requests.' },
                    { id: 'system', label: 'System & Infrastructure', desc: 'Backups, server status, maintenance.' },
                    { id: 'marketing', label: 'Marketing Campaigns', desc: 'Campaign expiry, coupon limits, bulk delivery.' },
                    { id: 'security', label: 'Security & Access', desc: 'Failed logins, new device logins, IP blocks.' },
                  ].map((cat) => (
                    <div key={cat.id} className="flex items-center justify-between p-4 bg-white/5 border border-white/5 rounded-2xl group hover:border-white/10 transition-all">
                      <div>
                        <div className="text-sm font-bold text-[#EAEAEA]">{cat.label}</div>
                        <div className="text-[10px] text-secondary mt-0.5">{cat.desc}</div>
                      </div>
                      <button 
                        onClick={() => setNotificationPrefs({ 
                          ...notificationPrefs, 
                          categories: { ...notificationPrefs.categories, [cat.id]: !notificationPrefs.categories[cat.id as keyof typeof notificationPrefs.categories] } 
                        })}
                        className={`w-12 h-6 rounded-full relative transition-all ${notificationPrefs.categories[cat.id as keyof typeof notificationPrefs.categories] ? 'bg-indigo-500' : 'bg-white/10'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notificationPrefs.categories[cat.id as keyof typeof notificationPrefs.categories] ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="p-6 bg-rose-500/5 border border-rose-500/10 rounded-3xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <ShieldAlert size={20} className="text-rose-400" />
                      <div>
                        <div className="text-sm font-bold text-rose-400">Critical Alerts Only</div>
                        <p className="text-[10px] text-secondary">Mute all non-essential notifications.</p>
                      </div>
                    </div>
                    <button 
                      onClick={() => setNotificationPrefs({ ...notificationPrefs, criticalOnlyMode: !notificationPrefs.criticalOnlyMode })}
                      className={`w-12 h-6 rounded-full relative transition-all ${notificationPrefs.criticalOnlyMode ? 'bg-rose-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${notificationPrefs.criticalOnlyMode ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Settings className="text-white/10" size={80} />
            <h3 className="text-xl font-bold text-[#EAEAEA]">Module Under Construction</h3>
            <p className="text-secondary text-sm">The {sidebarItems.find(i => i.id === activeTab)?.label} module is currently being optimized.</p>
          </div>
        );
    }
  };

  return (
    <div className="flex gap-8 pb-20 relative">
      {/* Settings Sidebar */}
      <AnimatePresence mode="wait">
        {!isExpanded && (
          <motion.div 
            key="sidebar"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="w-72 shrink-0 space-y-8"
          >
            <div className="p-8 bg-surface border border-border rounded-[32px] space-y-8 relative">
              {/* Quick Settings Button */}
              <button 
                onClick={() => setIsQuickSettingsOpen(true)}
                className="absolute -top-4 -right-4 w-12 h-12 rounded-full bg-gradient-to-br from-active to-blue-700 text-white flex items-center justify-center shadow-xl shadow-active/30 hover:scale-110 transition-all z-10 group"
                title="Quick Actions"
              >
                <Settings size={22} className="group-hover:rotate-90 transition-transform duration-500" />
              </button>

              {['General', 'Finance', 'Logistics', 'System'].map((group) => (
                <div key={group} className="space-y-4">
                  <h3 className="text-[10px] font-bold text-muted uppercase tracking-widest px-4">{group}</h3>
                  <div className="space-y-1">
                    {sidebarItems.filter(i => i.group === group).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id as SettingsTab)}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-bold transition-all group ${
                          activeTab === item.id 
                            ? 'bg-active text-white shadow-lg shadow-active/20' 
                            : 'text-muted hover:bg-hover hover:text-primary'
                        }`}
                      >
                        <item.icon size={18} className={activeTab === item.id ? 'text-white' : 'text-icon group-hover:text-active'} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Settings Content */}
      <div className={`flex-1 relative ${isExpanded ? 'fullview-expanded' : ''} ${moduleName === 'settings' ? 'store-settings' : moduleName === 'account' ? 'significant-account-settings' : ''}`}>
        {/* Expand Toggle Button */}
        {((moduleName === 'settings' && (activeTab === 'info' || activeTab === 'invoice')) || 
           (moduleName === 'account' && activeTab === 'security')) && (
          <button 
            id="fullview-toggle-btn"
            onClick={() => {
              const next = !isExpanded;
              setIsExpanded(next);
              if (onToggleMainSidebar) {
                onToggleMainSidebar(!next);
              }
            }}
            className={`absolute -top-12 right-0 px-4 py-2 bg-hover border border-border rounded-xl text-muted hover:text-active hover:bg-border transition-all z-20 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest`}
          >
            {isExpanded ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            {isExpanded ? 'Exit Fullscreen' : 'Expand View'}
          </button>
        )}

        <motion.div
          layout
          initial={false}
          transition={{ duration: 0.4, ease: "easeInOut" }}
        >
          {renderContent()}
        </motion.div>
      </div>

      {/* Quick Settings Modal */}
      <AnimatePresence>
        {isQuickSettingsOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsQuickSettingsOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-surface border border-border rounded-[32px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-border flex items-center justify-between bg-gradient-to-r from-active/10 to-transparent">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-active/20 text-active rounded-xl flex items-center justify-center">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-primary">Quick Actions</h3>
                    <p className="text-xs text-muted">Operational control panel</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsQuickSettingsOpen(false)}
                  className="p-2 hover:bg-hover rounded-full text-muted transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="p-8 space-y-4">
                {[
                  { id: 'maintenance', label: 'Maintenance Mode', desc: 'Take store offline for updates', icon: Hammer, color: 'amber' },
                  { id: 'cache', label: 'Clear System Cache', desc: 'Refresh all dynamic data', icon: RefreshCw, color: 'blue' },
                  { id: 'backup', label: 'Backup Database', icon: Database, desc: 'Create instant system snapshot', color: 'emerald' },
                  { id: 'debug', label: 'Debug Mode', icon: Bug, desc: 'Enable advanced logging (Admin only)', color: 'rose' },
                ].map((action) => (
                  <button
                    key={action.id}
                    className="w-full p-4 bg-hover border border-border rounded-2xl flex items-center justify-between group hover:bg-border transition-all text-left"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all group-hover:scale-110 ${
                        action.color === 'amber' ? 'bg-amber-500/10 text-amber-600' :
                        action.color === 'blue' ? 'bg-blue-500/10 text-blue-600' :
                        action.color === 'emerald' ? 'bg-emerald-500/10 text-emerald-600' :
                        'bg-rose-500/10 text-rose-600'
                      }`}>
                        <action.icon size={20} />
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{action.label}</div>
                        <div className="text-[10px] text-muted">{action.desc}</div>
                      </div>
                    </div>
                    <ChevronRight size={16} className="text-muted/20 group-hover:text-muted/50 transition-all" />
                  </button>
                ))}
              </div>

              <div className="p-8 bg-hover border-t border-border flex justify-end">
                <button 
                  onClick={() => setIsQuickSettingsOpen(false)}
                  className="px-6 py-2 bg-border text-primary rounded-xl font-bold text-sm hover:bg-muted/10 transition-all"
                >
                  Close Panel
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
