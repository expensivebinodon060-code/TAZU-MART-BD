import React, { useState } from 'react';
import { 
  Settings, 
  Palette, 
  Type, 
  Image as ImageIcon, 
  Save, 
  RefreshCw,
  Layout,
  Plus,
  Trash2,
  Edit2,
  Check,
  X,
  GripVertical,
  Eye,
  EyeOff
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useBranding } from '../../contexts/BrandingContext';
import { BrandingSettings, ServiceConfig } from '../../types';

export default function BrandingManagement() {
  const { branding, services, updateBranding, updateService, isLoading } = useBranding();
  const [activeTab, setActiveTab] = useState<'branding' | 'services'>('branding');
  const [isSaving, setIsSaving] = useState(false);
  const [editingServiceId, setEditingServiceId] = useState<string | null>(null);

  const [localBranding, setLocalBranding] = useState<Partial<BrandingSettings>>(branding || {});

  const handleBrandingSave = async () => {
    setIsSaving(true);
    await updateBranding(localBranding);
    setIsSaving(false);
  };

  if (isLoading || !branding) return <div className="p-8 text-center text-muted">Loading Branding Console...</div>;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Branding & UI Control</h1>
          <p className="text-muted">Manage app identity, colors, and service labels.</p>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={() => setActiveTab('branding')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'branding' ? 'bg-active text-white shadow-lg shadow-active/20' : 'bg-surface text-muted border border-border hover:bg-hover'}`}
          >
            Branding Settings
          </button>
          <button 
            onClick={() => setActiveTab('services')}
            className={`px-6 py-2 rounded-xl font-bold transition-all ${activeTab === 'services' ? 'bg-active text-white shadow-lg shadow-active/20' : 'bg-surface text-muted border border-border hover:bg-hover'}`}
          >
            Services Config
          </button>
        </div>
      </header>

      {activeTab === 'branding' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Settings Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-hover/30 flex items-center gap-3">
                <Settings size={20} className="text-active" />
                <h2 className="font-bold text-primary">General Identity</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">App Name</label>
                  <input 
                    type="text"
                    value={localBranding.appName}
                    onChange={(e) => setLocalBranding({ ...localBranding, appName: e.target.value })}
                    className="w-full px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">Short Name</label>
                  <input 
                    type="text"
                    value={localBranding.shortName}
                    onChange={(e) => setLocalBranding({ ...localBranding, shortName: e.target.value })}
                    className="w-full px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
                <div className="md:col-span-2 space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">Welcome Text (Use {"{{app_name}}"} for dynamic name)</label>
                  <input 
                    type="text"
                    value={localBranding.welcomeText}
                    onChange={(e) => setLocalBranding({ ...localBranding, welcomeText: e.target.value })}
                    className="w-full px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-hover/30 flex items-center gap-3">
                <Palette size={20} className="text-active" />
                <h2 className="font-bold text-primary">Visual Branding</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">Primary Color</label>
                  <div className="flex gap-3">
                    <input 
                      type="color"
                      value={localBranding.primaryColor}
                      onChange={(e) => setLocalBranding({ ...localBranding, primaryColor: e.target.value })}
                      className="w-12 h-12 rounded-xl cursor-pointer border-none p-0 overflow-hidden"
                    />
                    <input 
                      type="text"
                      value={localBranding.primaryColor}
                      onChange={(e) => setLocalBranding({ ...localBranding, primaryColor: e.target.value })}
                      className="flex-1 px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all font-mono"
                    />
                  </div>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">Bottom Nav Middle Text</label>
                  <input 
                    type="text"
                    value={localBranding.bottomNavMiddleText}
                    onChange={(e) => setLocalBranding({ ...localBranding, bottomNavMiddleText: e.target.value })}
                    className="w-full px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
              <div className="p-6 border-b border-border bg-hover/30 flex items-center gap-3">
                <Type size={20} className="text-active" />
                <h2 className="font-bold text-primary">Dynamic Labels</h2>
              </div>
              <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">Coin Label</label>
                  <input 
                    type="text"
                    value={localBranding.coinLabel}
                    onChange={(e) => setLocalBranding({ ...localBranding, coinLabel: e.target.value })}
                    className="w-full px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">Reward Label</label>
                  <input 
                    type="text"
                    value={localBranding.rewardLabel}
                    onChange={(e) => setLocalBranding({ ...localBranding, rewardLabel: e.target.value })}
                    className="w-full px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">Games Label</label>
                  <input 
                    type="text"
                    value={localBranding.gamesLabel}
                    onChange={(e) => setLocalBranding({ ...localBranding, gamesLabel: e.target.value })}
                    className="w-full px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-muted uppercase ml-1">Referral Label</label>
                  <input 
                    type="text"
                    value={localBranding.referralLabel}
                    onChange={(e) => setLocalBranding({ ...localBranding, referralLabel: e.target.value })}
                    className="w-full px-4 py-3 bg-hover/30 border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Preview & Save */}
          <div className="space-y-6">
            <div className="bg-surface rounded-[32px] shadow-sm border border-border p-8 sticky top-8">
              <h3 className="font-bold text-primary mb-6">Live Preview</h3>
              <div className="bg-hover/30 rounded-3xl p-6 space-y-6 border border-border">
                <div className="text-center space-y-1">
                  <p className="text-[10px] font-bold text-muted uppercase tracking-widest">Welcome Banner</p>
                  <p className="text-sm font-medium text-muted">
                    {localBranding.welcomeText?.replace('{{app_name}}', localBranding.appName || '')}
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-surface rounded-xl border border-border text-center">
                    <p className="text-[8px] font-bold text-muted uppercase">{localBranding.coinLabel}</p>
                    <div className="w-6 h-6 bg-amber-100 rounded-full mx-auto mt-1" />
                  </div>
                  <div className="p-3 bg-surface rounded-xl border border-border text-center">
                    <p className="text-[8px] font-bold text-muted uppercase">{localBranding.rewardLabel}</p>
                    <div className="w-6 h-6 bg-purple-100 rounded-full mx-auto mt-1" />
                  </div>
                </div>
                <div className="flex justify-center">
                  <div 
                    className="px-6 py-2 rounded-full text-white text-xs font-bold shadow-lg"
                    style={{ backgroundColor: localBranding.primaryColor }}
                  >
                    {localBranding.appName}
                  </div>
                </div>
              </div>

              <div className="mt-8 space-y-3">
                <button 
                  onClick={handleBrandingSave}
                  disabled={isSaving}
                  className="w-full py-4 bg-active text-white rounded-2xl font-bold shadow-lg shadow-active/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isSaving ? <RefreshCw size={20} className="animate-spin" /> : <Save size={20} />}
                  Save Branding
                </button>
                <button 
                  onClick={() => setLocalBranding(branding)}
                  className="w-full py-4 bg-surface text-muted border border-border rounded-2xl font-bold hover:bg-hover transition-all"
                >
                  Discard Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
          <div className="p-6 border-b border-border bg-hover/30 flex items-center justify-between">
            <h2 className="font-bold text-primary">Services Grid Configuration</h2>
            <span className="text-xs text-muted font-medium uppercase tracking-widest">4x2 Grid Layout</span>
          </div>

          <div className="divide-y divide-border">
            {services.sort((a, b) => a.positionOrder - b.positionOrder).map((service) => (
              <div key={service.id} className="p-6 flex items-center gap-6 transition-colors hover:bg-hover/30">
                <div className="text-muted cursor-grab active:cursor-grabbing">
                  <GripVertical size={20} />
                </div>
                <div className="w-12 h-12 bg-hover/30 rounded-2xl flex items-center justify-center text-active">
                  <RefreshCw size={20} />
                </div>
                <div className="flex-1">
                  {editingServiceId === service.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text"
                        defaultValue={service.label}
                        onBlur={(e) => {
                          updateService(service.id, { label: e.target.value });
                          setEditingServiceId(null);
                        }}
                        autoFocus
                        className="px-3 py-1 bg-surface border border-active rounded-lg outline-none text-sm font-bold"
                      />
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-primary">
                        {service.label.replace('{{games_label}}', branding.gamesLabel)}
                      </h3>
                      <button onClick={() => setEditingServiceId(service.id)} className="p-1 text-muted hover:text-active">
                        <Edit2 size={14} />
                      </button>
                    </div>
                  )}
                  <p className="text-xs text-muted font-medium">Route: {service.route}</p>
                </div>
                <div className="flex items-center gap-3">
                  <button 
                    onClick={() => updateService(service.id, { isEnabled: !service.isEnabled })}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      service.isEnabled 
                        ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                        : 'bg-hover/30 text-muted hover:bg-hover'
                    }`}
                  >
                    {service.isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                    {service.isEnabled ? 'Enabled' : 'Disabled'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
