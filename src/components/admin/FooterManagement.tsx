import React, { useState, useEffect } from 'react';
import { 
  Settings, 
  Save, 
  RefreshCw,
  Layout,
  Plus,
  Trash2,
  Link as LinkIcon,
  Facebook,
  Youtube,
  Instagram,
  Mail,
  Phone,
  MapPin,
  GripVertical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBranding } from '../../contexts/BrandingContext';
import { FooterLink, FooterSettings } from '../../types';

export default function FooterManagement() {
  const { branding, updateBranding, isLoading } = useBranding();
  const [isSaving, setIsSaving] = useState(false);
  const [localFooter, setLocalFooter] = useState<FooterSettings>({
    logoUrl: '',
    description: '',
    facebookUrl: '',
    youtubeUrl: '',
    instagramUrl: '',
    tiktokUrl: '',
    quickLinks: [],
    customerServiceLinks: [],
    address: '',
    phone: '',
    email: '',
    copyrightText: ''
  });

  useEffect(() => {
    if (branding?.footer) {
      setLocalFooter(branding.footer);
    }
  }, [branding]);

  const handleSave = async () => {
    setIsSaving(true);
    await updateBranding({ footer: localFooter });
    setIsSaving(false);
  };

  const addLink = (type: 'quick' | 'customer') => {
    const newLink: FooterLink = {
      id: Math.random().toString(36).substr(2, 9),
      label: 'New Link',
      url: '#'
    };
    if (type === 'quick') {
      setLocalFooter({ ...localFooter, quickLinks: [...localFooter.quickLinks, newLink] });
    } else {
      setLocalFooter({ ...localFooter, customerServiceLinks: [...localFooter.customerServiceLinks, newLink] });
    }
  };

  const removeLink = (type: 'quick' | 'customer', id: string) => {
    if (type === 'quick') {
      setLocalFooter({ ...localFooter, quickLinks: localFooter.quickLinks.filter(l => l.id !== id) });
    } else {
      setLocalFooter({ ...localFooter, customerServiceLinks: localFooter.customerServiceLinks.filter(l => l.id !== id) });
    }
  };

  const updateLink = (type: 'quick' | 'customer', id: string, updates: Partial<FooterLink>) => {
    if (type === 'quick') {
      setLocalFooter({
        ...localFooter,
        quickLinks: localFooter.quickLinks.map(l => l.id === id ? { ...l, ...updates } : l)
      });
    } else {
      setLocalFooter({
        ...localFooter,
        customerServiceLinks: localFooter.customerServiceLinks.map(l => l.id === id ? { ...l, ...updates } : l)
      });
    }
  };

  if (isLoading || !branding) return <div className="p-8 text-center text-secondary">Loading Footer Console...</div>;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Footer Management</h1>
          <p className="text-secondary">Control your website's footer content and links.</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving}
          className="px-6 py-3 bg-active text-white rounded-xl font-bold shadow-lg shadow-active/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center gap-2 disabled:opacity-50"
        >
          {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
          Save Footer Settings
        </button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Brand & Social */}
        <div className="space-y-6">
          <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-hover flex items-center gap-3">
              <Layout size={20} className="text-active" />
              <h2 className="font-bold text-primary">Brand Area</h2>
            </div>
            <div className="p-8 space-y-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary uppercase ml-1">Footer Logo URL</label>
                <input 
                  type="text"
                  value={localFooter.logoUrl}
                  onChange={(e) => setLocalFooter({ ...localFooter, logoUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  placeholder="https://..."
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary uppercase ml-1">Footer Description</label>
                <textarea 
                  value={localFooter.description}
                  onChange={(e) => setLocalFooter({ ...localFooter, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all resize-none"
                />
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-hover flex items-center gap-3">
              <LinkIcon size={20} className="text-active" />
              <h2 className="font-bold text-primary">Social Media Links</h2>
            </div>
            <div className="p-8 space-y-4">
              {[
                { label: 'Facebook URL', key: 'facebookUrl', icon: Facebook },
                { label: 'YouTube URL', key: 'youtubeUrl', icon: Youtube },
                { label: 'Instagram URL', key: 'instagramUrl', icon: Instagram },
                { label: 'TikTok URL', key: 'tiktokUrl', icon: LinkIcon },
              ].map((social) => (
                <div key={social.key} className="space-y-1.5">
                  <label className="text-xs font-bold text-secondary uppercase ml-1">{social.label}</label>
                  <div className="relative">
                    <social.icon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                    <input 
                      type="text"
                      value={(localFooter as any)[social.key]}
                      onChange={(e) => setLocalFooter({ ...localFooter, [social.key]: e.target.value })}
                      className="w-full pl-12 pr-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact & Copyright */}
        <div className="space-y-6">
          <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-hover flex items-center gap-3">
              <Phone size={20} className="text-active" />
              <h2 className="font-bold text-primary">Contact Information</h2>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary uppercase ml-1">Address</label>
                <div className="relative">
                  <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input 
                    type="text"
                    value={localFooter.address}
                    onChange={(e) => setLocalFooter({ ...localFooter, address: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary uppercase ml-1">Phone Number</label>
                <div className="relative">
                  <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input 
                    type="text"
                    value={localFooter.phone}
                    onChange={(e) => setLocalFooter({ ...localFooter, phone: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary uppercase ml-1">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
                  <input 
                    type="text"
                    value={localFooter.email}
                    onChange={(e) => setLocalFooter({ ...localFooter, email: e.target.value })}
                    className="w-full pl-12 pr-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
            <div className="p-6 border-b border-border bg-hover flex items-center gap-3">
              <Settings size={20} className="text-active" />
              <h2 className="font-bold text-primary">Copyright Settings</h2>
            </div>
            <div className="p-8 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-secondary uppercase ml-1">Copyright Text</label>
                <input 
                  type="text"
                  value={localFooter.copyrightText}
                  onChange={(e) => setLocalFooter({ ...localFooter, copyrightText: e.target.value })}
                  className="w-full px-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Links Manager */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-hover flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LinkIcon size={20} className="text-active" />
              <h2 className="font-bold text-primary">Quick Links</h2>
            </div>
            <button 
              onClick={() => addLink('quick')}
              className="p-2 bg-active/10 text-active rounded-lg hover:bg-active hover:text-white transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="p-6 space-y-3">
            {localFooter.quickLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-3 p-3 bg-hover rounded-2xl border border-transparent hover:border-active/20 transition-all group">
                <GripVertical size={16} className="text-muted" />
                <input 
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink('quick', link.id, { label: e.target.value })}
                  placeholder="Label"
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold"
                />
                <input 
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink('quick', link.id, { url: e.target.value })}
                  placeholder="URL"
                  className="flex-1 bg-transparent border-none outline-none text-xs text-secondary"
                />
                <button 
                  onClick={() => removeLink('quick', link.id)}
                  className="p-2 text-muted hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-hover flex items-center justify-between">
            <div className="flex items-center gap-3">
              <LinkIcon size={20} className="text-active" />
              <h2 className="font-bold text-primary">Customer Service Links</h2>
            </div>
            <button 
              onClick={() => addLink('customer')}
              className="p-2 bg-active/10 text-active rounded-lg hover:bg-active hover:text-white transition-all"
            >
              <Plus size={18} />
            </button>
          </div>
          <div className="p-6 space-y-3">
            {localFooter.customerServiceLinks.map((link) => (
              <div key={link.id} className="flex items-center gap-3 p-3 bg-hover rounded-2xl border border-transparent hover:border-active/20 transition-all group">
                <GripVertical size={16} className="text-muted" />
                <input 
                  type="text"
                  value={link.label}
                  onChange={(e) => updateLink('customer', link.id, { label: e.target.value })}
                  placeholder="Label"
                  className="flex-1 bg-transparent border-none outline-none text-sm font-bold"
                />
                <input 
                  type="text"
                  value={link.url}
                  onChange={(e) => updateLink('customer', link.id, { url: e.target.value })}
                  placeholder="URL"
                  className="flex-1 bg-transparent border-none outline-none text-xs text-secondary"
                />
                <button 
                  onClick={() => removeLink('customer', link.id)}
                  className="p-2 text-muted hover:text-rose-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
