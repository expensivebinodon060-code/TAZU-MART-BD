import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Palette, 
  Layout, 
  Type, 
  Box, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Save, 
  RotateCcw, 
  Check, 
  ChevronRight, 
  Moon, 
  Sun, 
  Zap,
  Eye,
  Download,
  Plus,
  Trash2,
  Settings,
  Layers,
  MousePointer2,
  Maximize2,
  Grid,
  List,
  Columns,
  Clock,
  Laptop,
  Smartphone as MobileIcon,
  Sparkles,
  Crown,
  Ghost,
  PartyPopper,
  Flashlight,
  CloudMoon,
  Contrast,
  LayoutTemplate,
  CheckCircle2,
  XCircle,
  Upload,
  Code,
  Play,
  MousePointer,
  Image as ImageIcon
} from 'lucide-react';
import { ThemeSettings } from '../../types';

const PRESET_MOODS: { id: ThemeSettings['activeMood']; label: string; icon: any; description: string }[] = [
  { id: 'Corporate', label: 'Corporate Mode', icon: Briefcase, description: 'Professional, clean, and trustworthy' },
  { id: 'Luxury', label: 'Luxury Mode', icon: Crown, description: 'Elegant, high-end, and sophisticated' },
  { id: 'Minimal', label: 'Minimal Clean', icon: Ghost, description: 'Distraction-free and essential' },
  { id: 'Festive', label: 'Festive Mode', icon: PartyPopper, description: 'Vibrant and celebratory' },
  { id: 'Flash Sale', label: 'Flash Sale', icon: Flashlight, description: 'High-energy and urgency-focused' },
  { id: 'Ramadan', label: 'Ramadan / Eid', icon: CloudMoon, description: 'Cultural and spiritual theme' },
  { id: 'Night', label: 'Night Mode', icon: Moon, description: 'Dark and easy on the eyes' },
  { id: 'High Contrast', label: 'High Contrast', icon: Contrast, description: 'Accessibility-first design' },
];

// Helper for Lucide icons that might not be imported yet
function Briefcase(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <rect width="20" height="14" x="2" y="7" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  );
}

const DEFAULT_THEME: ThemeSettings = {
  id: 'default',
  panelType: 'admin',
  themeName: 'TAZU MART BD Default',
  isPublished: true,
  activeMood: 'Corporate',
  colors: {
    primary: '#1F2937',
    secondary: '#6B7280',
    accent: '#4F8CFF',
    background: '#F8FAFC',
    sectionBg: '#FFFFFF',
    cardBg: '#FFFFFF',
    border: '#F1F5F9',
    success: '#22C55E',
    warning: '#F59E0B',
    error: '#EF4444',
    sidebarBg: '#FFFFFF',
    topbarBg: '#FFFFFF',
    hover: '#F8FAFC',
    active: '#4F8CFF',
    textHeading: '#1F2937',
    textParagraph: '#6B7280',
    textMenu: '#6B7280',
    textMenuHover: '#1F2937',
    textMenuActive: '#4F8CFF',
    textFooter: '#9CA3AF',
    textButton: '#FFFFFF',
    textPrice: '#22C55E',
    textDiscount: '#EF4444',
    textError: '#EF4444',
    textSuccess: '#22C55E',
    textBadge: '#FFFFFF',
  },
  gradient: {
    enabled: false,
    colors: ['#4F8CFF', '#7B61FF'],
    direction: 'to right',
  },
  typography: {
    primaryFont: 'Inter',
    headingFont: 'Inter',
    baseFontSize: '14px',
    headingFontSize: '24px',
    lineHeight: '1.5',
    letterSpacing: '0px',
    fontWeight: '400',
    textShadow: 'none',
  },
  components: {
    button: {
      shape: 'Rounded',
      shadow: 'Soft',
      animation: true,
    },
    card: {
      style: 'Soft Shadow',
      borderRadius: '20px',
      shadowDepth: '4px',
    },
    table: {
      style: 'Minimal',
    },
    visibility: {
      announcementBar: { visible: true, devices: 'all' },
      bannerSlider: { visible: true, devices: 'all' },
      featuredProducts: { visible: true, devices: 'all' },
      flashSale: { visible: false, devices: 'all' },
      testimonials: { visible: true, devices: 'all' },
      blogSection: { visible: true, devices: 'all' },
      newsletterPopup: { visible: true, devices: 'all' },
      floatingButtons: { visible: true, devices: 'all' },
    },
  },
  layout: {
    width: 'Full',
    headerStyle: 'Classic',
    stickyHeader: true,
    footerStyle: 'Detailed',
    sidebarPosition: 'Left',
    sidebarWidth: 'Normal',
    sidebarIconOnly: false,
    widgetDensity: 'Comfort',
    productCardStyle: 'Modern',
  },
  advanced: {
    customCss: '',
    animationsEnabled: true,
    animationSpeed: 'Normal',
    preloaderEnabled: true,
    cursorStyle: 'Default',
  },
  updatedAt: new Date().toISOString(),
};

export default function ThemeCenter() {
  const [localTheme, setLocalTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [publishedTheme, setPublishedTheme] = useState<ThemeSettings>(DEFAULT_THEME);
  const [previewMode, setPreviewMode] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSection, setActiveSection] = useState<'moods' | 'colors' | 'text' | 'typography' | 'layout' | 'visibility' | 'advanced'>('moods');
  const [isSaving, setIsSaving] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  useEffect(() => {
    // Check if local differs from published
    setHasUnsavedChanges(JSON.stringify(localTheme) !== JSON.stringify(publishedTheme));
  }, [localTheme, publishedTheme]);

  const handleUpdateLocal = (updates: any) => {
    setLocalTheme(prev => ({
      ...prev,
      ...updates,
      updatedAt: new Date().toISOString()
    }));
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      alert('Draft saved successfully!');
    }, 800);
  };

  const handlePublish = () => {
    setIsSaving(true);
    setTimeout(() => {
      setPublishedTheme(localTheme);
      setIsSaving(false);
      alert('Theme published to live site!');
    }, 1200);
  };

  const handleReset = () => {
    if (confirm('Reset all changes to default?')) {
      setLocalTheme(DEFAULT_THEME);
    }
  };

  const applyMood = (moodId: ThemeSettings['activeMood']) => {
    let moodUpdates: Partial<ThemeSettings> = { activeMood: moodId };
    
    switch (moodId) {
      case 'Luxury':
        moodUpdates.colors = { ...localTheme.colors, primary: '#D4AF37', background: '#0A0A0A', cardBg: '#1A1A1A', textHeading: '#D4AF37' };
        moodUpdates.typography = { ...localTheme.typography, primaryFont: 'Playfair Display', headingFont: 'Playfair Display' };
        moodUpdates.components = { ...localTheme.components, card: { ...localTheme.components.card, style: 'Soft Shadow', borderRadius: '0px' } };
        break;
      case 'Minimal':
        moodUpdates.colors = { ...localTheme.colors, primary: '#000000', background: '#FFFFFF', cardBg: '#F9FAFB', textHeading: '#000000', textParagraph: '#4B5563' };
        moodUpdates.typography = { ...localTheme.typography, primaryFont: 'Inter', headingFont: 'Inter' };
        moodUpdates.components = { ...localTheme.components, card: { ...localTheme.components.card, style: 'Flat', borderRadius: '4px' } };
        break;
      case 'Night':
        moodUpdates.colors = { ...localTheme.colors, primary: '#3B82F6', background: '#020617', cardBg: '#0F172A', textHeading: '#F8FAFC', textParagraph: '#94A3B8' };
        break;
      // Add more mood logic as needed
    }
    
    handleUpdateLocal(moodUpdates);
  };

  return (
    <div className="flex h-[calc(100vh-120px)] bg-surface border border-border rounded-[40px] overflow-hidden">
      {/* Left Panel: Controls */}
      <div className="w-[450px] border-r border-border flex flex-col bg-surface">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-primary">Theme Engine</h2>
            <p className="text-[10px] text-muted uppercase tracking-widest font-bold">TAZU MART BD Visual Control</p>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleReset}
              className="p-2 bg-hover/30 text-muted rounded-xl hover:bg-hover transition-all"
              title="Reset to Default"
            >
              <RotateCcw size={18} />
            </button>
            <button 
              onClick={handleSaveDraft}
              disabled={isSaving || !hasUnsavedChanges}
              className="px-4 py-2 bg-hover/30 text-primary text-xs font-bold rounded-xl hover:bg-hover transition-all disabled:opacity-50"
            >
              Save Draft
            </button>
            <button 
              onClick={handlePublish}
              disabled={isSaving || !hasUnsavedChanges}
              className="px-4 py-2 bg-active text-white text-xs font-bold rounded-xl hover:bg-active/90 transition-all shadow-lg shadow-active/20 disabled:opacity-50"
            >
              {isSaving ? 'Publishing...' : 'Publish Live'}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-border overflow-x-auto no-scrollbar">
          {[
            { id: 'moods', icon: Sparkles, label: 'Moods' },
            { id: 'colors', icon: Palette, label: 'Colors' },
            { id: 'text', icon: Type, label: 'Text' },
            { id: 'typography', icon: LayoutTemplate, label: 'Type' },
            { id: 'layout', icon: Layout, label: 'Layout' },
            { id: 'visibility', icon: Eye, label: 'View' },
            { id: 'advanced', icon: Settings, label: 'Adv' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveSection(tab.id as any)}
              className={`flex-none px-6 py-4 flex flex-col items-center gap-1 transition-all border-b-2 ${
                activeSection === tab.id ? 'text-active border-active bg-active/10' : 'text-muted border-transparent hover:text-primary'
              }`}
            >
              <tab.icon size={18} />
              <span className="text-[9px] font-bold uppercase tracking-tighter">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Scrollable Controls */}
        <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
          <AnimatePresence mode="wait">
            {activeSection === 'moods' && (
              <motion.div 
                key="moods"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-4"
              >
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Predefined Moods</h3>
                <div className="grid grid-cols-2 gap-3">
                  {PRESET_MOODS.map((mood) => (
                    <button
                      key={mood.id}
                      onClick={() => applyMood(mood.id)}
                      className={`p-4 rounded-2xl border transition-all text-left space-y-2 group ${
                        localTheme.activeMood === mood.id ? 'border-active bg-active/10' : 'border-border bg-hover/30 hover:border-muted'
                      }`}
                    >
                      <div className={`p-2 rounded-lg w-fit ${localTheme.activeMood === mood.id ? 'bg-active text-white' : 'bg-hover text-muted'}`}>
                        <mood.icon size={18} />
                      </div>
                      <div>
                        <div className="text-xs font-bold text-primary">{mood.label}</div>
                        <div className="text-[9px] text-muted leading-tight">{mood.description}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'colors' && (
              <motion.div 
                key="colors"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Global Color Palette</h3>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { key: 'primary', label: 'Primary Brand' },
                      { key: 'secondary', label: 'Secondary Color' },
                      { key: 'accent', label: 'Accent Highlight' },
                      { key: 'background', label: 'Main Background' },
                      { key: 'sectionBg', label: 'Section Background' },
                      { key: 'cardBg', label: 'Card Background' },
                      { key: 'border', label: 'Border Color' },
                    ].map((color) => (
                      <div key={color.key} className="flex items-center justify-between p-3 bg-hover/30 border border-border rounded-2xl">
                        <span className="text-xs text-muted font-medium">{color.label}</span>
                        <div className="flex items-center gap-3">
                          <span className="text-[10px] font-mono text-muted uppercase">{(localTheme.colors as any)[color.key]}</span>
                          <input 
                            type="color" 
                            value={(localTheme.colors as any)[color.key]}
                            onChange={(e) => handleUpdateLocal({ colors: { ...localTheme.colors, [color.key]: e.target.value } })}
                            className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Gradient Support</h3>
                  <div className="p-4 bg-hover/30 border border-border rounded-[24px] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted font-medium">Enable Gradient</span>
                      <button 
                        onClick={() => handleUpdateLocal({ gradient: { ...localTheme.gradient, enabled: !localTheme.gradient.enabled } })}
                        className={`w-10 h-5 rounded-full transition-all relative ${localTheme.gradient.enabled ? 'bg-active' : 'bg-hover'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${localTheme.gradient.enabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    {localTheme.gradient.enabled && (
                      <div className="space-y-4">
                        <div className="flex gap-2">
                          {localTheme.gradient.colors.map((c, i) => (
                            <input 
                              key={i}
                              type="color"
                              value={c}
                              onChange={(e) => {
                                const newColors = [...localTheme.gradient.colors];
                                newColors[i] = e.target.value;
                                handleUpdateLocal({ gradient: { ...localTheme.gradient, colors: newColors } });
                              }}
                              className="flex-1 h-10 rounded-xl bg-transparent border border-border cursor-pointer"
                            />
                          ))}
                        </div>
                        <select 
                          value={localTheme.gradient.direction}
                          onChange={(e) => handleUpdateLocal({ gradient: { ...localTheme.gradient, direction: e.target.value } })}
                          className="w-full bg-hover/30 border border-border rounded-xl px-3 py-2 text-xs text-primary outline-none"
                        >
                          <option value="to right">To Right</option>
                          <option value="to bottom">To Bottom</option>
                          <option value="45deg">45 Degrees</option>
                          <option value="135deg">135 Degrees</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'text' && (
              <motion.div 
                key="text"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Text Color Control</h3>
                <div className="grid grid-cols-1 gap-3">
                  {[
                    { key: 'textHeading', label: 'Heading Color' },
                    { key: 'textParagraph', label: 'Paragraph Color' },
                    { key: 'textMenu', label: 'Menu Text' },
                    { key: 'textMenuHover', label: 'Menu Hover' },
                    { key: 'textMenuActive', label: 'Menu Active' },
                    { key: 'textFooter', label: 'Footer Text' },
                    { key: 'textButton', label: 'Button Text' },
                    { key: 'textPrice', label: 'Price Text' },
                    { key: 'textDiscount', label: 'Discount Text' },
                    { key: 'textError', label: 'Error Messages' },
                    { key: 'textSuccess', label: 'Success Messages' },
                    { key: 'textBadge', label: 'Badge Text' },
                  ].map((color) => (
                    <div key={color.key} className="flex items-center justify-between p-3 bg-hover/30 border border-border rounded-2xl">
                      <span className="text-xs text-muted font-medium">{color.label}</span>
                      <div className="flex items-center gap-3">
                        <span className="text-[10px] font-mono text-muted uppercase">{(localTheme.colors as any)[color.key]}</span>
                        <input 
                          type="color" 
                          value={(localTheme.colors as any)[color.key]}
                          onChange={(e) => handleUpdateLocal({ colors: { ...localTheme.colors, [color.key]: e.target.value } })}
                          className="w-8 h-8 rounded-lg bg-transparent border-none cursor-pointer"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'typography' && (
              <motion.div 
                key="typography"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Font Selection</h3>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Primary Font</label>
                      <select 
                        value={localTheme.typography.primaryFont}
                        onChange={(e) => handleUpdateLocal({ typography: { ...localTheme.typography, primaryFont: e.target.value } })}
                        className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none"
                      >
                        <option value="Inter">Inter (Modern Sans)</option>
                        <option value="Space Grotesk">Space Grotesk (Tech)</option>
                        <option value="Outfit">Outfit (Friendly)</option>
                        <option value="Playfair Display">Playfair Display (Serif)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Code)</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Heading Font</label>
                      <select 
                        value={localTheme.typography.headingFont}
                        onChange={(e) => handleUpdateLocal({ typography: { ...localTheme.typography, headingFont: e.target.value } })}
                        className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none"
                      >
                        <option value="Inter">Inter (Modern Sans)</option>
                        <option value="Space Grotesk">Space Grotesk (Tech)</option>
                        <option value="Outfit">Outfit (Friendly)</option>
                        <option value="Playfair Display">Playfair Display (Serif)</option>
                        <option value="JetBrains Mono">JetBrains Mono (Code)</option>
                      </select>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Typography Settings</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Base Size</label>
                      <input 
                        type="text" 
                        value={localTheme.typography.baseFontSize}
                        onChange={(e) => handleUpdateLocal({ typography: { ...localTheme.typography, baseFontSize: e.target.value } })}
                        className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Heading Size</label>
                      <input 
                        type="text" 
                        value={localTheme.typography.headingFontSize}
                        onChange={(e) => handleUpdateLocal({ typography: { ...localTheme.typography, headingFontSize: e.target.value } })}
                        className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Line Height</label>
                      <input 
                        type="text" 
                        value={localTheme.typography.lineHeight}
                        onChange={(e) => handleUpdateLocal({ typography: { ...localTheme.typography, lineHeight: e.target.value } })}
                        className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Weight</label>
                      <select 
                        value={localTheme.typography.fontWeight}
                        onChange={(e) => handleUpdateLocal({ typography: { ...localTheme.typography, fontWeight: e.target.value } })}
                        className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none"
                      >
                        <option value="300">Light</option>
                        <option value="400">Regular</option>
                        <option value="500">Medium</option>
                        <option value="600">Semi-Bold</option>
                        <option value="700">Bold</option>
                      </select>
                    </div>
                    <div className="space-y-2 col-span-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Text Shadow</label>
                      <input 
                        type="text" 
                        value={localTheme.typography.textShadow}
                        onChange={(e) => handleUpdateLocal({ typography: { ...localTheme.typography, textShadow: e.target.value } })}
                        placeholder="e.g. 2px 2px 4px rgba(0,0,0,0.3)"
                        className="w-full bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none"
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'layout' && (
              <motion.div 
                key="layout"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Structure & Layout</h3>
                  <div className="p-4 bg-hover/30 border border-border rounded-[24px] space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Page Width</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Full', 'Boxed'].map((w) => (
                          <button
                            key={w}
                            onClick={() => handleUpdateLocal({ layout: { ...localTheme.layout, width: w as any } })}
                            className={`py-2 rounded-xl text-[10px] font-bold transition-all ${
                              localTheme.layout.width === w ? 'bg-active text-white' : 'bg-hover/30 text-muted hover:bg-hover'
                            }`}
                          >
                            {w}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Header Style</label>
                      <select 
                        value={localTheme.layout.headerStyle}
                        onChange={(e) => handleUpdateLocal({ layout: { ...localTheme.layout, headerStyle: e.target.value as any } })}
                        className="w-full bg-hover/30 border border-border rounded-xl px-3 py-2 text-xs text-primary outline-none"
                      >
                        <option value="Classic">Classic Layout</option>
                        <option value="Centered">Centered Logo</option>
                        <option value="Mega">Mega Menu Focus</option>
                        <option value="Minimal">Minimal Header</option>
                      </select>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted font-medium">Sticky Header</span>
                      <button 
                        onClick={() => handleUpdateLocal({ layout: { ...localTheme.layout, stickyHeader: !localTheme.layout.stickyHeader } })}
                        className={`w-10 h-5 rounded-full transition-all relative ${localTheme.layout.stickyHeader ? 'bg-active' : 'bg-hover'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${localTheme.layout.stickyHeader ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Sidebar & Navigation</h3>
                  <div className="p-4 bg-hover/30 border border-border rounded-[24px] space-y-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Sidebar Position</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Left', 'Right', 'Hidden'].map((pos) => (
                          <button
                            key={pos}
                            onClick={() => handleUpdateLocal({ layout: { ...localTheme.layout, sidebarPosition: pos as any } })}
                            className={`py-2 rounded-xl text-[10px] font-bold transition-all ${
                              localTheme.layout.sidebarPosition === pos ? 'bg-active text-white' : 'bg-hover/30 text-muted hover:bg-hover'
                            }`}
                          >
                            {pos}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Product Card Variant</label>
                      <div className="grid grid-cols-2 gap-2">
                        {['Grid', 'List', 'Modern', 'Compact'].map((style) => (
                          <button
                            key={style}
                            onClick={() => handleUpdateLocal({ layout: { ...localTheme.layout, productCardStyle: style as any } })}
                            className={`py-2 rounded-xl text-[10px] font-bold transition-all ${
                              localTheme.layout.productCardStyle === style ? 'bg-active text-white' : 'bg-hover/30 text-muted hover:bg-hover'
                            }`}
                          >
                            {style}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeSection === 'visibility' && (
              <motion.div 
                key="visibility"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Component Visibility</h3>
                <div className="space-y-3">
                  {Object.entries(localTheme.components.visibility).map(([key, config]: [string, any]) => (
                    <div key={key} className="p-4 bg-hover/30 border border-border rounded-2xl space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-primary font-bold capitalize">{key.replace(/([A-Z])/g, ' $1')}</span>
                        <button 
                          onClick={() => handleUpdateLocal({ components: { ...localTheme.components, visibility: { ...localTheme.components.visibility, [key]: { ...config, visible: !config.visible } } } })}
                          className={`w-10 h-5 rounded-full transition-all relative ${config.visible ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${config.visible ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      {config.visible && (
                        <div className="flex gap-2">
                          {['all', 'desktop', 'mobile'].map((d) => (
                            <button
                              key={d}
                              onClick={() => handleUpdateLocal({ components: { ...localTheme.components, visibility: { ...localTheme.components.visibility, [key]: { ...config, devices: d } } } })}
                              className={`flex-1 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest transition-all ${
                                config.devices === d ? 'bg-active text-white' : 'bg-hover/30 text-muted'
                              }`}
                            >
                              {d}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeSection === 'advanced' && (
              <motion.div 
                key="advanced"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="space-y-6"
              >
                <div className="space-y-4">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest">UI & Animations</h3>
                  <div className="p-4 bg-hover/30 border border-border rounded-[24px] space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted font-medium">Enable Animations</span>
                      <button 
                        onClick={() => handleUpdateLocal({ advanced: { ...localTheme.advanced, animationsEnabled: !localTheme.advanced.animationsEnabled } })}
                        className={`w-10 h-5 rounded-full transition-all relative ${localTheme.advanced.animationsEnabled ? 'bg-active' : 'bg-hover'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${localTheme.advanced.animationsEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Animation Speed</label>
                      <div className="grid grid-cols-3 gap-2">
                        {['Slow', 'Normal', 'Fast'].map((s) => (
                          <button
                            key={s}
                            onClick={() => handleUpdateLocal({ advanced: { ...localTheme.advanced, animationSpeed: s as any } })}
                            className={`py-2 rounded-xl text-[10px] font-bold transition-all ${
                              localTheme.advanced.animationSpeed === s ? 'bg-active text-white' : 'bg-hover/30 text-muted hover:bg-hover'
                            }`}
                          >
                            {s}
                          </button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-muted font-medium">Preloader</span>
                      <button 
                        onClick={() => handleUpdateLocal({ advanced: { ...localTheme.advanced, preloaderEnabled: !localTheme.advanced.preloaderEnabled } })}
                        className={`w-10 h-5 rounded-full transition-all relative ${localTheme.advanced.preloaderEnabled ? 'bg-active' : 'bg-hover'}`}
                      >
                        <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${localTheme.advanced.preloaderEnabled ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="space-y-4 pt-4 border-t border-border">
                  <h3 className="text-xs font-bold text-muted uppercase tracking-widest">Custom CSS</h3>
                  <div className="relative">
                    <div className="absolute top-3 left-4 text-muted">
                      <Code size={14} />
                    </div>
                    <textarea 
                      value={localTheme.advanced.customCss}
                      onChange={(e) => handleUpdateLocal({ advanced: { ...localTheme.advanced, customCss: e.target.value } })}
                      placeholder="/* Add your custom CSS here */"
                      className="w-full h-40 bg-hover/30 border border-border rounded-2xl p-4 pl-10 text-xs font-mono text-primary outline-none focus:border-active transition-all"
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Panel: Enhanced Live Preview Simulator */}
      <div className="flex-1 bg-bg p-8 flex flex-col gap-6 relative">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h3 className="text-sm font-bold text-primary">Live Preview Simulator</h3>
            <div className="flex p-1 bg-hover/30 rounded-xl border border-border">
              <button 
                onClick={() => setPreviewMode('desktop')}
                className={`p-2 rounded-lg transition-all ${previewMode === 'desktop' ? 'bg-active text-white' : 'text-muted hover:text-primary'}`}
              >
                <Monitor size={16} />
              </button>
              <button 
                onClick={() => setPreviewMode('tablet')}
                className={`p-2 rounded-lg transition-all ${previewMode === 'tablet' ? 'bg-active text-white' : 'text-muted hover:text-primary'}`}
              >
                <Tablet size={16} />
              </button>
              <button 
                onClick={() => setPreviewMode('mobile')}
                className={`p-2 rounded-lg transition-all ${previewMode === 'mobile' ? 'bg-active text-white' : 'text-muted hover:text-primary'}`}
              >
                <Smartphone size={16} />
              </button>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 text-[10px] font-bold text-muted uppercase tracking-widest">
              <Zap size={12} className="text-active" />
              Real-time Sync Active
            </div>
            {hasUnsavedChanges && (
              <div className="px-3 py-1 bg-warning/10 text-warning text-[9px] font-bold rounded-full border border-warning/20 animate-pulse">
                Unsaved Changes
              </div>
            )}
          </div>
        </div>

        {/* Simulator Frame */}
        <div className="flex-1 flex items-center justify-center overflow-hidden">
          <motion.div 
            layout
            animate={{ 
              width: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '768px' : '375px',
              height: previewMode === 'desktop' ? '100%' : previewMode === 'tablet' ? '1024px' : '667px',
              scale: previewMode === 'desktop' ? 1 : 0.6
            }}
            className="bg-white rounded-[32px] shadow-2xl overflow-hidden border-8 border-border relative flex flex-col"
            style={{ 
              backgroundColor: localTheme.colors.background,
              color: localTheme.colors.textParagraph,
              fontFamily: localTheme.typography.primaryFont
            }}
          >
            {/* Mock Announcement Bar */}
            {localTheme.components.visibility.announcementBar.visible && (
              <div 
                className="h-8 flex items-center justify-center text-[10px] font-bold uppercase tracking-widest"
                style={{ backgroundColor: localTheme.colors.primary, color: localTheme.colors.textButton }}
              >
                Free Shipping on all orders over $100!
              </div>
            )}

            <div className="flex flex-1 overflow-hidden">
              {/* Mock Sidebar */}
              {localTheme.layout.sidebarPosition !== 'Hidden' && (
                <div 
                  className={`border-r flex flex-col p-6 gap-6 ${localTheme.layout.sidebarPosition === 'Right' ? 'order-last border-l border-r-0' : ''}`}
                  style={{ 
                    width: localTheme.layout.sidebarWidth === 'Compact' ? '80px' : localTheme.layout.sidebarWidth === 'Expanded' ? '300px' : '240px',
                    backgroundColor: localTheme.colors.sidebarBg, 
                    borderColor: localTheme.colors.border 
                  }}
                >
                  <div className="h-8 w-full rounded-lg opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                  <div className="space-y-4">
                    {[1, 2, 3, 4, 5].map(i => (
                      <div key={i} className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl opacity-10" style={{ backgroundColor: localTheme.colors.primary }} />
                        {!localTheme.layout.sidebarIconOnly && (
                          <div className="h-3 w-24 rounded opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Mock Main Content */}
              <div className="flex-1 flex flex-col overflow-y-auto custom-scrollbar">
                {/* Mock Header */}
                <div 
                  className={`h-16 border-b px-8 flex items-center justify-between ${localTheme.layout.stickyHeader ? 'sticky top-0 z-10' : ''}`}
                  style={{ backgroundColor: localTheme.colors.topbarBg, borderColor: localTheme.colors.border }}
                >
                  <div className="h-4 w-48 rounded opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                  <div className="flex gap-4">
                    <div className="w-8 h-8 rounded-full opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                    <div className="w-8 h-8 rounded-full opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                  </div>
                </div>

                <div className="p-8 space-y-8">
                  {/* Mock Hero Section */}
                  {localTheme.components.visibility.bannerSlider.visible && (
                    <div 
                      className="h-64 rounded-[32px] flex items-center justify-center p-12 relative overflow-hidden"
                      style={{ 
                        backgroundColor: localTheme.colors.sectionBg,
                        backgroundImage: localTheme.gradient.enabled ? `linear-gradient(${localTheme.gradient.direction}, ${localTheme.gradient.colors.join(', ')})` : 'none'
                      }}
                    >
                      <div className="text-center space-y-4 relative z-10">
                        <h1 
                          className="text-4xl font-bold"
                          style={{ color: localTheme.colors.textHeading, fontFamily: localTheme.typography.headingFont, fontSize: localTheme.typography.headingFontSize }}
                        >
                          Summer Collection 2026
                        </h1>
                        <p className="text-sm opacity-80" style={{ color: localTheme.colors.textParagraph }}>
                          Discover the latest trends in enterprise fashion.
                        </p>
                        <button 
                          className="px-8 py-3 font-bold text-sm transition-all"
                          style={{ 
                            backgroundColor: localTheme.colors.primary, 
                            color: localTheme.colors.textButton,
                            borderRadius: localTheme.components.button.shape === 'Pill' ? '9999px' : localTheme.components.button.shape === 'Sharp' ? '0px' : '12px',
                            boxShadow: localTheme.components.button.shadow === 'Heavy' ? '0 10px 25px -5px rgba(0,0,0,0.3)' : localTheme.components.button.shadow === 'Soft' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none'
                          }}
                        >
                          Shop Now
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Mock Featured Products */}
                  {localTheme.components.visibility.featuredProducts.visible && (
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-xl font-bold" style={{ color: localTheme.colors.textHeading }}>Featured Products</h2>
                        <div className="flex gap-2">
                          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center"><ChevronRight size={14} className="rotate-180" /></div>
                          <div className="w-8 h-8 rounded-full border border-border flex items-center justify-center"><ChevronRight size={14} /></div>
                        </div>
                      </div>
                      <div className={`grid gap-6 ${localTheme.layout.productCardStyle === 'List' ? 'grid-cols-1' : 'grid-cols-3'}`}>
                        {[1, 2, 3].map(i => (
                          <div 
                            key={i} 
                            className={`p-6 border space-y-4 ${localTheme.layout.productCardStyle === 'List' ? 'flex items-center gap-6 space-y-0' : ''}`}
                            style={{ 
                              backgroundColor: localTheme.colors.cardBg, 
                              borderColor: localTheme.colors.border,
                              borderRadius: localTheme.components.card.borderRadius,
                              boxShadow: localTheme.components.card.style === 'Soft Shadow' ? `0 ${localTheme.components.card.shadowDepth} 20px -5px rgba(0,0,0,0.1)` : 'none'
                            }}
                          >
                            <div className="aspect-square rounded-2xl opacity-10" style={{ backgroundColor: localTheme.colors.primary, width: localTheme.layout.productCardStyle === 'List' ? '120px' : '100%' }} />
                            <div className="flex-1 space-y-2">
                              <div className="h-4 w-32 rounded opacity-80" style={{ backgroundColor: localTheme.colors.primary }} />
                              <div className="flex items-center justify-between">
                                <span className="font-bold" style={{ color: localTheme.colors.textPrice }}>$129.00</span>
                                <span className="text-[10px] line-through opacity-50" style={{ color: localTheme.colors.textDiscount }}>$159.00</span>
                              </div>
                              <button 
                                className="w-full py-2 text-[10px] font-bold uppercase tracking-widest border"
                                style={{ borderColor: localTheme.colors.primary, color: localTheme.colors.primary, borderRadius: '8px' }}
                              >
                                Add to Cart
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Mock Footer */}
                  <div 
                    className="pt-12 pb-8 border-t space-y-8"
                    style={{ borderColor: localTheme.colors.border }}
                  >
                    <div className="grid grid-cols-4 gap-8">
                      <div className="space-y-4">
                        <div className="h-6 w-32 rounded opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                        <p className="text-xs opacity-60" style={{ color: localTheme.colors.textFooter }}>
                          The ultimate enterprise marketplace platform for modern business.
                        </p>
                      </div>
                      {[1, 2, 3].map(i => (
                        <div key={i} className="space-y-4">
                          <div className="h-4 w-24 rounded opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                          <div className="space-y-2">
                            {[1, 2, 3, 4].map(j => (
                              <div key={j} className="h-2 w-20 rounded opacity-10" style={{ backgroundColor: localTheme.colors.primary }} />
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between pt-8 border-t border-border">
                      <p className="text-[10px] opacity-40" style={{ color: localTheme.colors.textFooter }}>© 2026 TAZU MART BD Marketplace. All rights reserved.</p>
                      <div className="flex gap-4">
                        <div className="w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                        <div className="w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                        <div className="w-6 h-6 rounded-full opacity-20" style={{ backgroundColor: localTheme.colors.primary }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
