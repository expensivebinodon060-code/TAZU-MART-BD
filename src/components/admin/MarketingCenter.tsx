import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Megaphone, 
  Activity, 
  Facebook, 
  Globe, 
  Smartphone, 
  Code, 
  Settings, 
  ShieldCheck, 
  Zap, 
  Save, 
  RefreshCw, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  ChevronRight, 
  ArrowUpRight, 
  ArrowDownRight, 
  MousePointer2, 
  Eye, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  DollarSign, 
  FileSpreadsheet, 
  Download,
  Filter,
  Search,
  Layout,
  Server,
  UserCheck,
  TrendingUp,
  Terminal
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

type MarketingTab = 'ad-setup' | 'tracking';
type AdPlatform = 'facebook' | 'google' | 'tiktok' | 'gtm';
type TrackingModule = 'website' | 'server-side' | 'customer';

export default function MarketingCenter() {
  const [activeTab, setActiveTab] = useState<MarketingTab>('ad-setup');
  const [activePlatform, setActivePlatform] = useState<AdPlatform>('facebook');
  const [activeTracking, setActiveTracking] = useState<TrackingModule>('website');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isValidating, setIsValidating] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/marketing/config');
      const data = await res.json();
      setConfig(data);
    } catch (err) {
      console.error('Failed to fetch marketing config:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/marketing/config', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        // Success toast or notification
      }
    } catch (err) {
      console.error('Failed to save config:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const validateConnection = async (platform: string) => {
    setIsValidating(platform);
    try {
      const res = await fetch(`/api/admin/marketing/validate/${platform}`, { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        fetchConfig(); // Refresh to get updated status
      }
    } catch (err) {
      console.error('Validation failed:', err);
    } finally {
      setIsValidating(null);
    }
  };

  const updateConfig = (section: string, subSection: string, field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [field]: value
        }
      }
    }));
  };

  const updateNestedConfig = (section: string, subSection: string, nested: string, field: string, value: any) => {
    setConfig((prev: any) => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subSection]: {
          ...prev[section][subSection],
          [nested]: {
            ...prev[section][subSection][nested],
            [field]: value
          }
        }
      }
    }));
  };

  if (isLoading || !config) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <RefreshCw className="animate-spin text-active" size={40} />
        <p className="text-secondary font-bold">Initializing Marketing Ecosystem...</p>
      </div>
    );
  }

  const renderFacebookSetup = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-600 rounded-2xl flex items-center justify-center">
            <Facebook size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Facebook Ad Setup</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${config.adSetup.facebook.status === 'Connected' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{config.adSetup.facebook.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-2 bg-hover/30 rounded-xl border border-border">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Enable Platform</span>
            <button 
              onClick={() => updateConfig('adSetup', 'facebook', 'isEnabled', !config.adSetup.facebook.isEnabled)}
              className={`w-10 h-5 rounded-full relative transition-colors ${config.adSetup.facebook.isEnabled ? 'bg-active' : 'bg-hover'}`}
            >
              <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.adSetup.facebook.isEnabled ? 'right-1' : 'left-1'}`} />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Business Manager ID', key: 'businessManagerId' },
          { label: 'Ad Account ID', key: 'adAccountId' },
          { label: 'Facebook Page ID', key: 'pageId' },
          { label: 'Pixel ID', key: 'pixelId' },
          { label: 'App ID', key: 'appId' },
          { label: 'App Secret', key: 'appSecret', type: 'password' },
          { label: 'Access Token', key: 'accessToken', type: 'password', full: true },
        ].map((field) => (
          <div key={field.key} className={`space-y-2 ${field.full ? 'md:col-span-2' : ''}`}>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">{field.label}</label>
            <input 
              type={field.type || 'text'}
              value={config.adSetup.facebook[field.key]}
              onChange={(e) => updateConfig('adSetup', 'facebook', field.key, e.target.value)}
              className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
              placeholder={`Enter ${field.label}`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          onClick={() => validateConnection('facebook')}
          disabled={isValidating === 'facebook'}
          className="flex-1 py-4 bg-hover/30 border border-border rounded-2xl text-sm font-bold text-primary hover:bg-hover transition-all flex items-center justify-center gap-2"
        >
          {isValidating === 'facebook' ? <RefreshCw className="animate-spin" size={18} /> : <ShieldCheck size={18} />}
          Validate Connection
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-active/20"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Configuration
        </button>
      </div>
    </div>
  );

  const renderGoogleSetup = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center">
            <Globe size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Google Ad Setup</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${config.adSetup.google.status === 'Connected' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{config.adSetup.google.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-hover/30 rounded-xl border border-border">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Enable Platform</span>
          <button 
            onClick={() => updateConfig('adSetup', 'google', 'isEnabled', !config.adSetup.google.isEnabled)}
            className={`w-10 h-5 rounded-full relative transition-colors ${config.adSetup.google.isEnabled ? 'bg-active' : 'bg-hover'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.adSetup.google.isEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'Google Ads Customer ID', key: 'customerId' },
          { label: 'Conversion ID', key: 'conversionId' },
          { label: 'Conversion Label', key: 'conversionLabel' },
          { label: 'GA4 Measurement ID', key: 'measurementId' },
          { label: 'Merchant Center ID', key: 'merchantCenterId' },
        ].map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">{field.label}</label>
            <input 
              type="text"
              value={config.adSetup.google[field.key]}
              onChange={(e) => updateConfig('adSetup', 'google', field.key, e.target.value)}
              className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
              placeholder={`Enter ${field.label}`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          onClick={() => validateConnection('google')}
          disabled={isValidating === 'google'}
          className="flex-1 py-4 bg-hover/30 border border-border rounded-2xl text-sm font-bold text-primary hover:bg-hover transition-all flex items-center justify-center gap-2"
        >
          {isValidating === 'google' ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
          Test Conversion
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-active/20"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Configuration
        </button>
      </div>
    </div>
  );

  const renderTiktokSetup = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-600 rounded-2xl flex items-center justify-center">
            <Smartphone size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">TikTok Ad Setup</h3>
            <div className="flex items-center gap-2 mt-1">
              <div className={`w-2 h-2 rounded-full ${config.adSetup.tiktok.status === 'Connected' ? 'bg-emerald-500' : 'bg-rose-500'}`} />
              <span className="text-[10px] font-bold text-muted uppercase tracking-widest">{config.adSetup.tiktok.status}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-hover/30 rounded-xl border border-border">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Enable Platform</span>
          <button 
            onClick={() => updateConfig('adSetup', 'tiktok', 'isEnabled', !config.adSetup.tiktok.isEnabled)}
            className={`w-10 h-5 rounded-full relative transition-colors ${config.adSetup.tiktok.isEnabled ? 'bg-active' : 'bg-hover'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.adSetup.tiktok.isEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[
          { label: 'TikTok Business Account ID', key: 'businessAccountId' },
          { label: 'TikTok Ad Account ID', key: 'adAccountId' },
          { label: 'TikTok Pixel ID', key: 'pixelId' },
          { label: 'Access Token', key: 'accessToken', type: 'password', full: true },
        ].map((field) => (
          <div key={field.key} className={`space-y-2 ${field.full ? 'md:col-span-2' : ''}`}>
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">{field.label}</label>
            <input 
              type={field.type || 'text'}
              value={config.adSetup.tiktok[field.key]}
              onChange={(e) => updateConfig('adSetup', 'tiktok', field.key, e.target.value)}
              className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
              placeholder={`Enter ${field.label}`}
            />
          </div>
        ))}
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          onClick={() => validateConnection('tiktok')}
          disabled={isValidating === 'tiktok'}
          className="flex-1 py-4 bg-hover/30 border border-border rounded-2xl text-sm font-bold text-primary hover:bg-hover transition-all flex items-center justify-center gap-2"
        >
          {isValidating === 'tiktok' ? <RefreshCw className="animate-spin" size={18} /> : <Activity size={18} />}
          Test Pixel
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-active/20"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Configuration
        </button>
      </div>
    </div>
  );

  const renderGtmSetup = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-600 rounded-2xl flex items-center justify-center">
            <Code size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">GTM Tower Configuration</h3>
            <p className="text-[10px] text-muted uppercase tracking-widest">Centralized Tag Control System</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-hover/30 rounded-xl border border-border">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Enable GTM</span>
          <button 
            onClick={() => updateConfig('adSetup', 'gtm', 'isEnabled', !config.adSetup.gtm.isEnabled)}
            className={`w-10 h-5 rounded-full relative transition-colors ${config.adSetup.gtm.isEnabled ? 'bg-active' : 'bg-hover'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.adSetup.gtm.isEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">GTM Container ID</label>
          <input 
            type="text"
            value={config.adSetup.gtm.containerId}
            onChange={(e) => updateConfig('adSetup', 'gtm', 'containerId', e.target.value)}
            className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
            placeholder="e.g. GTM-XXXXXXX"
          />
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Environment</label>
          <select 
            value={config.adSetup.gtm.environment}
            onChange={(e) => updateConfig('adSetup', 'gtm', 'environment', e.target.value)}
            className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all appearance-none"
          >
            <option value="Live">Live</option>
            <option value="Staging">Staging</option>
          </select>
        </div>
        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">GA4 Measurement ID (Optional Sync)</label>
          <input 
            type="text"
            value={config.adSetup.gtm.measurementId}
            onChange={(e) => updateConfig('adSetup', 'gtm', 'measurementId', e.target.value)}
            className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
            placeholder="e.g. G-XXXXXXX"
          />
        </div>
        <div className="flex items-center justify-between p-4 bg-hover/30 border border-border rounded-2xl">
          <div className="space-y-1">
            <div className="text-xs font-bold text-primary">Conversion Linker</div>
            <div className="text-[10px] text-muted">Automatically link conversions across domains</div>
          </div>
          <button 
            onClick={() => updateConfig('adSetup', 'gtm', 'conversionLinker', !config.adSetup.gtm.conversionLinker)}
            className={`w-10 h-5 rounded-full relative transition-colors ${config.adSetup.gtm.conversionLinker ? 'bg-emerald-500' : 'bg-hover'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.adSetup.gtm.conversionLinker ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="p-6 bg-hover/30 border border-border rounded-3xl space-y-4">
        <h4 className="text-sm font-bold text-primary flex items-center gap-2">
          <Layout size={16} className="text-active" />
          Advanced Tag Control
        </h4>
        <div className="grid grid-cols-2 gap-4">
          <button className="p-4 bg-hover/30 border border-border rounded-2xl text-left hover:border-active/30 transition-all group">
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">DataLayer</div>
            <div className="text-xs font-bold text-primary group-hover:text-active">Configure Structure</div>
          </button>
          <button className="p-4 bg-hover/30 border border-border rounded-2xl text-left hover:border-active/30 transition-all group">
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">Event Mapping</div>
            <div className="text-xs font-bold text-primary group-hover:text-active">Trigger Interface</div>
          </button>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button 
          onClick={() => validateConnection('gtm')}
          disabled={isValidating === 'gtm'}
          className="flex-1 py-4 bg-hover/30 border border-border rounded-2xl text-sm font-bold text-primary hover:bg-hover transition-all flex items-center justify-center gap-2"
        >
          {isValidating === 'gtm' ? <RefreshCw className="animate-spin" size={18} /> : <Eye size={18} />}
          Test Container Load
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-active/20"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Configuration
        </button>
      </div>
    </div>
  );

  const renderWebsiteTracking = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-600 rounded-2xl flex items-center justify-center">
            <MousePointer2 size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-primary">Website Tracking (Browser-Based)</h3>
            <p className="text-[10px] text-muted uppercase tracking-widest">Pixel & Script-Based Tracking</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-hover/30 rounded-xl border border-border">
          <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Master Toggle</span>
          <button 
            onClick={() => updateNestedConfig('tracking', 'website', 'isEnabled', '', !config.tracking.website.isEnabled)}
            className={`w-10 h-5 rounded-full relative transition-colors ${config.tracking.website.isEnabled ? 'bg-active' : 'bg-hover'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.tracking.website.isEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Header Script Injection</label>
            <textarea 
              rows={4}
              value={config.tracking.website.headerScript}
              onChange={(e) => updateConfig('tracking', 'website', 'headerScript', e.target.value)}
              className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-active transition-all resize-none"
              placeholder="<!-- Insert scripts to be loaded in <head> -->"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Footer Script Injection</label>
            <textarea 
              rows={4}
              value={config.tracking.website.footerScript}
              onChange={(e) => updateConfig('tracking', 'website', 'footerScript', e.target.value)}
              className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-active transition-all resize-none"
              placeholder="<!-- Insert scripts to be loaded before </body> -->"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Global Tracking Code</label>
          <textarea 
            rows={3}
            value={config.tracking.website.globalTrackingCode}
            onChange={(e) => updateConfig('tracking', 'website', 'globalTrackingCode', e.target.value)}
            className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-xs font-mono outline-none focus:border-active transition-all resize-none"
            placeholder="Insert global tracking snippet..."
          />
        </div>

        <div className="p-8 bg-hover/30 border border-border rounded-[40px] space-y-6">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-primary flex items-center gap-2">
              <Activity size={16} className="text-active" />
              Event Trigger Mapping
            </h4>
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Async Loading Enforced</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { label: 'Page View', key: 'pageView' },
              { label: 'View Content', key: 'viewContent' },
              { label: 'Add To Cart', key: 'addToCart' },
              { label: 'Initiate Checkout', key: 'initiateCheckout' },
              { label: 'Purchase', key: 'purchase' },
              { label: 'Complete Registration', key: 'completeRegistration' },
            ].map((event) => (
              <div key={event.key} className="flex items-center justify-between p-4 bg-hover/30 border border-border rounded-2xl">
                <span className="text-xs font-bold text-primary">{event.label}</span>
                <button 
                  onClick={() => updateNestedConfig('tracking', 'website', 'events', event.key, !config.tracking.website.events[event.key])}
                  className={`w-8 h-4 rounded-full relative transition-colors ${config.tracking.website.events[event.key] ? 'bg-active' : 'bg-hover'}`}
                >
                  <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.tracking.website.events[event.key] ? 'right-0.5' : 'left-0.5'}`} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button className="flex-1 py-4 bg-hover/30 border border-border rounded-2xl text-sm font-bold text-muted hover:bg-hover transition-all flex items-center justify-center gap-2">
          <Activity size={18} />
          Real-Time Event Log
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-active/20"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Configurations
        </button>
      </div>
    </div>
  );

  const renderServerSideTracking = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center">
            <Server size={24} />
          </div>
          <div>
            <h3 className="text-lg font-bold text-[#EAEAEA]">Server-Side Tracking</h3>
            <p className="text-[10px] text-secondary uppercase tracking-widest">Advanced Conversion Layer (CAPI)</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/10">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Enable Server Layer</span>
          <button 
            onClick={() => updateConfig('tracking', 'serverSide', 'isEnabled', !config.tracking.serverSide.isEnabled)}
            className={`w-10 h-5 rounded-full relative transition-colors ${config.tracking.serverSide.isEnabled ? 'bg-active' : 'bg-white/10'}`}
          >
            <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${config.tracking.serverSide.isEnabled ? 'right-1' : 'left-1'}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {[
          { label: 'Facebook Conversion API Key', key: 'facebookApiKey', type: 'password' },
          { label: 'Google Server Conversion Key', key: 'googleServerKey', type: 'password' },
        ].map((field) => (
          <div key={field.key} className="space-y-2">
            <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">{field.label}</label>
            <input 
              type={field.type}
              value={config.tracking.serverSide[field.key as keyof typeof config.tracking.serverSide]}
              onChange={(e) => updateConfig('tracking', 'serverSide', field.key, e.target.value)}
              className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
              placeholder={`Enter ${field.label}`}
            />
          </div>
        ))}
      </div>

      <div className="p-8 bg-hover/30 border border-border rounded-[40px] space-y-6">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-bold text-primary flex items-center gap-2">
            <ShieldCheck size={16} className="text-active" />
            Reliability & Deduplication
          </h4>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-muted uppercase tracking-widest">Retry Queue</span>
            <button 
              onClick={() => updateConfig('tracking', 'serverSide', 'retryQueueEnabled', !config.tracking.serverSide.retryQueueEnabled)}
              className={`w-8 h-4 rounded-full relative transition-colors ${config.tracking.serverSide.retryQueueEnabled ? 'bg-emerald-500' : 'bg-hover'}`}
            >
              <div className={`absolute top-0.5 w-3 h-3 bg-white rounded-full transition-all ${config.tracking.serverSide.retryQueueEnabled ? 'right-0.5' : 'left-0.5'}`} />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { label: 'Success Rate', value: '99.8%', color: 'text-emerald-600' },
            { label: 'Events Sent', value: '12,450', color: 'text-primary' },
            { label: 'Deduplicated', value: '1,240', color: 'text-active' },
          ].map((stat, i) => (
            <div key={i} className="p-4 bg-hover/30 rounded-2xl border border-border">
              <div className="text-[10px] font-bold text-muted uppercase tracking-widest mb-1">{stat.label}</div>
              <div className={`text-xl font-black ${stat.color}`}>{stat.value}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <button className="flex-1 py-4 bg-hover/30 border border-border rounded-2xl text-sm font-bold text-muted hover:bg-hover transition-all flex items-center justify-center gap-2">
          <Terminal size={18} />
          Server Event Log
        </button>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="flex-1 py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-active/20"
        >
          {isSaving ? <RefreshCw className="animate-spin" size={18} /> : <Save size={18} />}
          Save Configurations
        </button>
      </div>
    </div>
  );

  const renderCustomerTracking = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-primary">Customer Tracking & Analytics</h3>
          <p className="text-sm text-muted">Behavior analysis for marketing optimization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-3 bg-hover/30 border border-border rounded-2xl text-muted hover:text-active transition-all">
            <Download size={20} />
          </button>
          <button className="px-6 py-3 bg-hover/30 border border-border rounded-2xl text-sm font-bold text-primary hover:bg-hover transition-all flex items-center gap-2">
            <Filter size={18} />
            Filter Data
          </button>
        </div>
      </div>

      {/* Analytics Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Conversion Rate', value: '3.24%', icon: Activity, color: 'text-indigo-600', trend: '+0.5%' },
          { label: 'Avg. Order Value', value: '৳ 2,450', icon: DollarSign, color: 'text-emerald-600', trend: '+৳ 120' },
          { label: 'Revenue/Source', value: '৳ 1.2M', icon: TrendingUp, color: 'text-amber-600', trend: '+12%' },
          { label: 'Abandoned Carts', value: '145', icon: ShoppingCart, color: 'text-rose-600', trend: '-5' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-surface border border-border rounded-[32px] space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-12 h-12 bg-hover/30 rounded-2xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={24} />
              </div>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-500/10 px-2 py-1 rounded-full">{stat.trend}</span>
            </div>
            <div>
              <div className="text-2xl font-black text-primary">{stat.value}</div>
              <div className="text-[10px] font-bold text-muted uppercase tracking-widest">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Traffic Source Breakdown */}
        <div className="p-8 bg-surface border border-border rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-primary">Traffic Source Breakdown</h3>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={[
                    { name: 'Facebook', value: 45 },
                    { name: 'Google', value: 30 },
                    { name: 'Direct', value: 15 },
                    { name: 'TikTok', value: 10 },
                  ]}
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {[
                    { name: 'Facebook', color: '#4F46E5' },
                    { name: 'Google', color: '#10B981' },
                    { name: 'Direct', color: '#F59E0B' },
                    { name: 'TikTok', color: '#EF4444' },
                  ].map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px' }}
                  itemStyle={{ color: '#111827', fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Facebook', value: '45%', color: 'bg-indigo-600' },
              { label: 'Google', value: '30%', color: 'bg-emerald-600' },
              { label: 'Direct', value: '15%', color: 'bg-amber-600' },
              { label: 'TikTok', value: '10%', color: 'bg-rose-600' },
            ].map((source, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-hover/30 rounded-xl">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${source.color}`} />
                  <span className="text-xs text-muted">{source.label}</span>
                </div>
                <span className="text-xs font-bold text-primary">{source.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Conversion Funnel */}
        <div className="p-8 bg-surface border border-border rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-primary">Conversion Funnel</h3>
          <div className="space-y-6">
            {[
              { label: 'Visitors', value: '12,450', percent: 100 },
              { label: 'Add to Cart', value: '2,840', percent: 22.8 },
              { label: 'Initiate Checkout', value: '1,120', percent: 39.4 },
              { label: 'Purchase', value: '403', percent: 35.9 },
            ].map((step, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-end">
                  <span className="text-xs font-bold text-primary">{step.label}</span>
                  <div className="text-right">
                    <div className="text-sm font-black text-active">{step.value}</div>
                    {i > 0 && <div className="text-[10px] text-muted">{step.percent}% conversion</div>}
                  </div>
                </div>
                <div className="h-2 bg-hover/30 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${(step.percent / 100) * 100}%` }}
                    className="h-full bg-active"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    if (activeTab === 'ad-setup') {
      switch (activePlatform) {
        case 'facebook': return renderFacebookSetup();
        case 'google': return renderGoogleSetup();
        case 'tiktok': return renderTiktokSetup();
        case 'gtm': return renderGtmSetup();
      }
    } else {
      switch (activeTracking) {
        case 'website': return renderWebsiteTracking();
        case 'server-side': return renderServerSideTracking();
        case 'customer': return renderCustomerTracking();
      }
    }
  };

  return (
    <div className="min-h-screen bg-bg text-primary flex flex-col lg:flex-row">
      {/* Sidebar */}
      <motion.aside 
        initial={false}
        animate={{ width: 320 }}
        className="hidden lg:flex flex-col bg-sidebar border-r border-border z-20 sticky top-0 h-screen"
      >
        <div className="p-8 flex items-center gap-3">
          <div className="w-10 h-10 bg-active rounded-xl flex items-center justify-center shadow-lg shadow-active/20">
            <Megaphone className="text-white" size={20} />
          </div>
          <div>
            <div className="text-xl font-black tracking-tighter text-active">MARKETING</div>
            <div className="text-[10px] font-bold text-muted uppercase tracking-widest">TAZU MART BD Hub</div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-10 custom-scrollbar">
          {/* Ad Setup Section */}
          <div className="space-y-4">
            <div className="px-4 text-[10px] font-bold text-muted uppercase tracking-widest opacity-50 flex items-center gap-2">
              <Settings size={12} />
              Ad Setup
            </div>
            <div className="space-y-1">
              {[
                { id: 'facebook', label: 'Facebook', icon: Facebook },
                { id: 'google', label: 'Google Ads', icon: Globe },
                { id: 'tiktok', label: 'TikTok Ads', icon: Smartphone },
                { id: 'gtm', label: 'GTM Tower', icon: Code },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab('ad-setup'); setActivePlatform(item.id as AdPlatform); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${
                    activeTab === 'ad-setup' && activePlatform === item.id 
                      ? 'bg-active text-white shadow-lg shadow-active/20' 
                      : 'text-muted hover:bg-hover/30 hover:text-primary'
                  }`}
                >
                  <item.icon size={20} className={activeTab === 'ad-setup' && activePlatform === item.id ? 'text-white' : 'group-hover:text-primary'} />
                  <span className="font-bold text-sm flex-1 text-left">{item.label}</span>
                  {activeTab === 'ad-setup' && activePlatform === item.id && (
                    <div className="absolute left-0 w-1.5 h-8 bg-white rounded-r-full" />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tracking Section */}
          <div className="space-y-4">
            <div className="px-4 text-[10px] font-bold text-muted uppercase tracking-widest opacity-50 flex items-center gap-2">
              <Activity size={12} />
              Tracking
            </div>
            <div className="space-y-1">
              {[
                { id: 'website', label: 'Website Tracking', icon: MousePointer2 },
                { id: 'server-side', label: 'Server-Side', icon: Server },
                { id: 'customer', label: 'Customer Tracking', icon: UserCheck },
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => { setActiveTab('tracking'); setActiveTracking(item.id as TrackingModule); }}
                  className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group relative ${
                    activeTab === 'tracking' && activeTracking === item.id 
                      ? 'bg-active text-white shadow-lg shadow-active/20' 
                      : 'text-muted hover:bg-hover/30 hover:text-primary'
                  }`}
                >
                  <item.icon size={20} className={activeTab === 'tracking' && activeTracking === item.id ? 'text-white' : 'group-hover:text-primary'} />
                  <span className="font-bold text-sm flex-1 text-left">{item.label}</span>
                  {activeTab === 'tracking' && activeTracking === item.id && (
                    <div className="absolute left-0 w-1.5 h-8 bg-white rounded-r-full" />
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="p-8 border-t border-border">
          <div className="flex items-center gap-3 p-4 bg-hover/30 rounded-2xl border border-border">
            <div className="w-8 h-8 bg-emerald-500/10 text-emerald-600 rounded-lg flex items-center justify-center">
              <ShieldCheck size={18} />
            </div>
            <div>
              <div className="text-[10px] font-bold text-primary">TAZU MART BD Security</div>
              <div className="text-[8px] text-muted uppercase tracking-widest">Encrypted Storage</div>
            </div>
          </div>
        </div>
      </motion.aside>

      {/* Mobile Nav */}
      <div className="lg:hidden bg-sidebar border-b border-border p-4 flex items-center gap-4 overflow-x-auto no-scrollbar sticky top-0 z-30">
        {[
          { id: 'facebook', label: 'Facebook', icon: Facebook, tab: 'ad-setup' },
          { id: 'google', label: 'Google', icon: Globe, tab: 'ad-setup' },
          { id: 'tiktok', label: 'TikTok', icon: Smartphone, tab: 'ad-setup' },
          { id: 'gtm', label: 'GTM', icon: Code, tab: 'ad-setup' },
          { id: 'website', label: 'Website', icon: MousePointer2, tab: 'tracking' },
          { id: 'server-side', label: 'Server', icon: Server, tab: 'tracking' },
          { id: 'customer', label: 'Customer', icon: UserCheck, tab: 'tracking' },
        ].map((item) => (
          <button
            key={item.id}
            onClick={() => { 
              setActiveTab(item.tab as MarketingTab); 
              if (item.tab === 'ad-setup') setActivePlatform(item.id as AdPlatform);
              else setActiveTracking(item.id as TrackingModule);
            }}
            className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              (activeTab === 'ad-setup' && activePlatform === item.id) || (activeTab === 'tracking' && activeTracking === item.id)
                ? 'bg-active text-white' 
                : 'bg-hover/30 text-muted'
            }`}
          >
            <item.icon size={16} />
            {item.label}
          </button>
        ))}
      </div>

      {/* Main Content Area */}
      <main className="flex-1 p-6 lg:p-12 max-w-7xl mx-auto w-full">
        {renderContent()}
      </main>
    </div>
  );
}
