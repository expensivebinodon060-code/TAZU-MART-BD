import React, { createContext, useContext, useState, useEffect } from 'react';
import { BrandingSettings, ServiceConfig } from '../types';

interface BrandingContextType {
  branding: BrandingSettings | null;
  services: ServiceConfig[];
  refreshBranding: () => Promise<void>;
  updateBranding: (updates: Partial<BrandingSettings>) => Promise<void>;
  updateService: (id: string, updates: Partial<ServiceConfig>) => Promise<void>;
  isLoading: boolean;
}

const BrandingContext = createContext<BrandingContextType | undefined>(undefined);

export function BrandingProvider({ children }: { children: React.ReactNode }) {
  const [branding, setBranding] = useState<BrandingSettings | null>(null);
  const [services, setServices] = useState<ServiceConfig[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchData = async () => {
    try {
      const [brandingRes, servicesRes] = await Promise.all([
        fetch('/api/branding'),
        fetch('/api/services-config')
      ]);
      const brandingData = await brandingRes.json();
      const servicesData = await servicesRes.json();
      setBranding(brandingData);
      setServices(servicesData);
    } catch (err) {
      console.error('Failed to fetch branding data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const updateBranding = async (updates: Partial<BrandingSettings>) => {
    try {
      const res = await fetch('/api/branding', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setBranding(updated);
        // Apply CSS variable for primary color
        document.documentElement.style.setProperty('--primary-color', updated.primaryColor);
      }
    } catch (err) {
      console.error('Failed to update branding', err);
    }
  };

  const updateService = async (id: string, updates: Partial<ServiceConfig>) => {
    try {
      const res = await fetch(`/api/services-config/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      if (res.ok) {
        const updated = await res.json();
        setServices(prev => prev.map(s => s.id === id ? updated : s));
      }
    } catch (err) {
      console.error('Failed to update service', err);
    }
  };

  useEffect(() => {
    if (branding?.primaryColor) {
      document.documentElement.style.setProperty('--primary-color', branding.primaryColor);
    }
  }, [branding]);

  return (
    <BrandingContext.Provider value={{ 
      branding, 
      services, 
      refreshBranding: fetchData, 
      updateBranding, 
      updateService,
      isLoading 
    }}>
      {children}
    </BrandingContext.Provider>
  );
}

export function useBranding() {
  const context = useContext(BrandingContext);
  if (context === undefined) {
    throw new Error('useBranding must be used within a BrandingProvider');
  }
  return context;
}
