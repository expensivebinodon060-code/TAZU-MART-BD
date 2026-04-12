import React, { createContext, useContext, useState, useEffect } from 'react';
import { ThemeSettings } from '../types';

interface ThemeContextType {
  theme: ThemeSettings | null;
  updateTheme: (newTheme: ThemeSettings) => void;
  panel: 'admin' | 'customer' | 'frontend';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const DEFAULT_THEME: ThemeSettings = {
  id: 'default',
  panelType: 'admin',
  themeName: 'TAZU MART BD Default',
  isPublished: true,
  activeMood: 'Corporate',
  colors: {
    primary: '#111111',
    secondary: '#444444',
    accent: '#2563eb',
    background: '#ffffff',
    sectionBg: '#ffffff',
    cardBg: '#ffffff',
    border: '#e5e7eb',
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    sidebarBg: '#f8fafc',
    topbarBg: '#ffffff',
    hover: '#f1f5f9',
    active: '#2563eb',
    textHeading: '#000000',
    textParagraph: '#444444',
    textMenu: '#111111',
    textMenuHover: '#000000',
    textMenuActive: '#2563eb',
    textFooter: '#777777',
    textButton: '#FFFFFF',
    textPrice: '#10B981',
    textDiscount: '#EF4444',
    textError: '#EF4444',
    textSuccess: '#10B981',
    textBadge: '#FFFFFF',
  },
  gradient: {
    enabled: false,
    colors: ['#3B82F6', '#8B5CF6'],
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
      borderRadius: '12px',
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

export const ThemeProvider: React.FC<{ children: React.ReactNode, panel: 'admin' | 'customer' | 'frontend' }> = ({ children, panel }) => {
  const [theme, setTheme] = useState<ThemeSettings>(DEFAULT_THEME);

  useEffect(() => {
    fetchTheme();
  }, [panel]);

  const fetchTheme = async () => {
    try {
      const res = await fetch(`/api/admin/settings/theme/${panel}`);
      if (!res.ok) throw new Error('Theme not found');
      const data = await res.json();
      
      // Merge with default to ensure all properties exist
      const mergedTheme = {
        ...DEFAULT_THEME,
        ...data,
        colors: { ...DEFAULT_THEME.colors, ...data.colors },
        typography: { ...DEFAULT_THEME.typography, ...data.typography },
        components: { ...DEFAULT_THEME.components, ...data.components },
        layout: { ...DEFAULT_THEME.layout, ...data.layout },
        advanced: { ...DEFAULT_THEME.advanced, ...data.advanced },
      };
      
      setTheme(mergedTheme);
      applyTheme(mergedTheme);
    } catch (err) {
      console.warn('Failed to fetch theme, using defaults', err);
      applyTheme(DEFAULT_THEME);
    }
  };

  const applyTheme = (t: ThemeSettings) => {
    if (!t || !t.colors || !t.typography || !t.components || !t.advanced) return;
    const root = document.documentElement;
    
    // Core Colors
    root.style.setProperty('--primary', t.colors.primary);
    root.style.setProperty('--secondary', t.colors.secondary);
    root.style.setProperty('--accent', t.colors.accent);
    root.style.setProperty('--background', t.colors.background);
    root.style.setProperty('--section-bg', t.colors.sectionBg);
    root.style.setProperty('--card-bg', t.colors.cardBg);
    root.style.setProperty('--border', t.colors.border);
    root.style.setProperty('--success', t.colors.success);
    root.style.setProperty('--warning', t.colors.warning);
    root.style.setProperty('--error', t.colors.error);
    root.style.setProperty('--sidebar-bg', t.colors.sidebarBg);
    root.style.setProperty('--topbar-bg', t.colors.topbarBg);
    root.style.setProperty('--hover', t.colors.hover);
    root.style.setProperty('--active', t.colors.active);

    // Text Colors
    root.style.setProperty('--text-heading', t.colors.textHeading);
    root.style.setProperty('--text-paragraph', t.colors.textParagraph);
    root.style.setProperty('--text-menu', t.colors.textMenu);
    root.style.setProperty('--text-footer', t.colors.textFooter);
    root.style.setProperty('--text-button', t.colors.textButton);
    root.style.setProperty('--text-price', t.colors.textPrice);

    // Gradient
    if (t.gradient?.enabled) {
      const grad = `linear-gradient(${t.gradient.direction}, ${t.gradient.colors.join(', ')})`;
      root.style.setProperty('--brand-gradient', grad);
    } else {
      root.style.setProperty('--brand-gradient', t.colors.primary);
    }

    // Typography
    root.style.setProperty('--font-primary', t.typography.primaryFont);
    root.style.setProperty('--font-heading', t.typography.headingFont);
    root.style.setProperty('--base-font-size', t.typography.baseFontSize);
    root.style.setProperty('--heading-font-size', t.typography.headingFontSize);
    root.style.setProperty('--line-height', t.typography.lineHeight);
    root.style.setProperty('--font-weight', t.typography.fontWeight);

    // Components
    const btnRadius = t.components.button?.shape === 'Pill' ? '9999px' : t.components.button?.shape === 'Sharp' ? '0px' : '12px';
    root.style.setProperty('--radius-btn', btnRadius);
    root.style.setProperty('--radius-card', t.components.card?.borderRadius || '12px');
    
    const btnShadow = t.components.button?.shadow === 'Heavy' ? '0 10px 25px -5px rgba(0,0,0,0.3)' : t.components.button?.shadow === 'Soft' ? '0 4px 6px -1px rgba(0,0,0,0.1)' : 'none';
    root.style.setProperty('--shadow-btn', btnShadow);
    
    const speed = t.advanced?.animationSpeed === 'Fast' ? '0.2s' : t.advanced?.animationSpeed === 'Slow' ? '0.5s' : '0.3s';
    root.style.setProperty('--anim-speed', speed);

    // Apply font family to body
    document.body.style.fontFamily = t.typography.primaryFont + ', sans-serif';
  };

  const updateTheme = async (newTheme: ThemeSettings) => {
    setTheme(newTheme);
    applyTheme(newTheme);
    try {
      await fetch(`/api/admin/settings/theme/${panel}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTheme)
      });
    } catch (err) {
      console.error('Failed to update theme', err);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme, panel }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
};
