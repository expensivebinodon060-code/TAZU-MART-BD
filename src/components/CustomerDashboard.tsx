import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  User as UserIcon, 
  Heart, 
  Users, 
  Ticket, 
  Coins, 
  Zap, 
  Package, 
  History,
  ChevronRight,
  LogOut,
  Star,
  ExternalLink,
  Gift,
  Settings,
  CreditCard,
  Gamepad2,
  ShoppingBag,
  MapPin,
  HelpCircle,
  Headphones,
  Clock,
  Truck,
  MessageSquare,
  RotateCcw
} from 'lucide-react';
import { User, Order, Product, CustomerPanelSection, ServiceConfig } from '../types';
import { useBranding } from '../contexts/BrandingContext';

interface CustomerDashboardProps {
  user: User | null;
  orders: Order[];
  wishlist: Product[];
  onLogout: () => void;
  setCurrentView: (view: any, tab?: string) => void;
  onProductClick: (product: Product) => void;
}

const IconMap: Record<string, any> = {
  Gamepad2,
  ShoppingBag,
  MapPin,
  Users,
  HelpCircle,
  Headphones,
  Star,
  CreditCard,
  Package,
  History,
  Zap,
  Ticket,
  Coins,
  Heart,
  Settings
};

export default function CustomerDashboard({ 
  user, 
  orders, 
  wishlist, 
  onLogout, 
  setCurrentView,
  onProductClick 
}: CustomerDashboardProps) {
  const { branding, services, isLoading: brandingLoading } = useBranding();
  const [sections, setSections] = useState<CustomerPanelSection[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSections();
  }, []);

  const fetchSections = async () => {
    try {
      const res = await fetch('/api/customer-panel/sections');
      const data = await res.json();
      setSections(data.filter((s: CustomerPanelSection) => s.isEnabled));
    } catch (err) {
      console.error('Failed to fetch sections', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || brandingLoading || !branding) return <div className="p-8 text-center text-secondary">Loading Dashboard...</div>;

  const renderSection = (section: CustomerPanelSection) => {
    switch (section.sectionKey) {
      case 'profile_header':
        return (
          <div key={section.id} className="bg-[#f4f4f4] -mx-4 px-4 pt-6 pb-8 space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 text-center">
                <p className="text-sm font-medium text-gray-600">
                  {branding.welcomeText.replace('{{app_name}}', branding.appName)}
                </p>
              </div>
              <button 
                onClick={() => setCurrentView('settings')}
                className="p-2 text-gray-600 hover:bg-gray-200 rounded-full transition-colors"
              >
                <Settings size={20} />
              </button>
            </div>

            <div 
              onClick={() => user && setCurrentView('profile')}
              className={`bg-white rounded-2xl p-4 shadow-sm border border-gray-100 flex items-center gap-4 mx-4 min-h-[100px] ${user ? 'cursor-pointer hover:bg-gray-50 transition-colors' : ''}`}
            >
              {!user ? (
                <div className="flex-1 min-w-0">
                  <h2 className="text-lg font-bold text-primary">Welcome to {branding.appName}</h2>
                  <p className="text-secondary text-xs">Please login to access your account</p>
                  <div className="flex gap-3 mt-3">
                    <button 
                      onClick={() => setCurrentView('login')}
                      className="flex-1 py-2 bg-active text-white rounded-xl text-sm font-bold shadow-lg shadow-active/20 hover:opacity-90 transition-all"
                    >
                      Login
                    </button>
                    <button 
                      onClick={() => setCurrentView('signup')}
                      className="flex-1 py-2 bg-white text-active border border-active rounded-xl text-sm font-bold hover:bg-gray-50 transition-all"
                    >
                      Sign Up
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-16 h-16 rounded-2xl overflow-hidden shadow-sm border-2 border-white shrink-0">
                    <img 
                      src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.fullName}&background=random`} 
                      alt={user?.fullName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h2 className="text-lg font-bold text-primary truncate">{user?.fullName}</h2>
                    <p className="text-secondary text-xs truncate">{user?.email}</p>
                  </div>
                  <button 
                    onClick={onLogout}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <LogOut size={20} />
                  </button>
                </>
              )}
            </div>
          </div>
        );

      case 'stats_row':
        return (
          <div key={section.id} className="grid grid-cols-2 gap-4 px-4 -mt-4">
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
                <Gift size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">{branding.coinLabel}</h4>
                <p className="text-[10px] text-secondary">Enjoy 60% OFF with coins</p>
                <button className="mt-2 px-3 py-1 bg-active text-white text-[10px] font-bold rounded-lg">Collect</button>
              </div>
            </div>
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-gray-100 flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
                <Star size={20} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-primary">{branding.rewardLabel}</h4>
                <p className="text-[10px] text-secondary">Invite & Win Special Gifts</p>
                <button className="mt-2 px-3 py-1 bg-active text-white text-[10px] font-bold rounded-lg">Play</button>
              </div>
            </div>
          </div>
        );

      case 'my_orders':
        return (
          <div key={section.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary">My Orders</h3>
              <button onClick={() => setCurrentView('orders')} className="text-xs font-bold text-active flex items-center gap-1">
                View All Orders <ChevronRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {[
                { label: 'To Pay', icon: CreditCard, color: 'text-amber-500' },
                { label: 'To Ship', icon: Clock, color: 'text-blue-500' },
                { label: 'To Receive', icon: Truck, color: 'text-green-500' },
                { label: 'To Review', icon: MessageSquare, color: 'text-purple-500' },
                { label: 'Returns', icon: RotateCcw, color: 'text-red-500' }
              ].map((item, i) => (
                <button 
                  key={i} 
                  onClick={() => setCurrentView('orders', item.label)}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
                    <item.icon size={20} />
                  </div>
                  <span className="text-[9px] font-bold text-secondary uppercase text-center">{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        );

      case 'recently_viewed':
        return (
          <div key={section.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100 mx-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-primary">Recently Viewed</h3>
              {!user && <button className="text-xs font-bold text-active">Log in to view &gt;</button>}
            </div>
            {user ? (
              <div className="flex gap-4 overflow-x-auto pb-2 no-scrollbar">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="min-w-[100px] space-y-2">
                    <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden">
                      <img src={`https://picsum.photos/seed/recent${i}/100/100`} className="w-full h-full object-cover" />
                    </div>
                    <p className="text-[10px] font-bold text-active">৳850</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="py-4 text-center">
                <p className="text-xs text-secondary">Sign in to see your recently viewed items</p>
              </div>
            )}
          </div>
        );

      case 'services_grid':
        return (
          <div key={section.id} className="mx-4">
            <div className="grid grid-cols-4 gap-4">
              {services.filter(s => s.isEnabled).sort((a, b) => a.positionOrder - b.positionOrder).map((service) => {
                const Icon = IconMap[service.icon] || ExternalLink;
                return (
                  <button 
                    key={service.id}
                    onClick={() => setCurrentView(service.route.replace('/', ''))}
                    className="flex flex-col items-center gap-2 group"
                  >
                    <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center text-active group-hover:scale-110 transition-transform">
                      <Icon size={24} />
                    </div>
                    <span className="text-[9px] font-bold text-secondary uppercase text-center leading-tight">
                      {service.label.replace('{{games_label}}', branding.gamesLabel)}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        );

      default:
        // Custom Bar
        if (section.sectionKey.startsWith('custom_')) {
          return (
            <button 
              key={section.id}
              onClick={() => {
                if (section.redirectUrl) {
                  if (section.redirectUrl.startsWith('http')) {
                    window.open(section.redirectUrl, '_blank');
                  } else {
                    setCurrentView(section.redirectUrl.replace('/', ''));
                  }
                }
              }}
              className="mx-4 bg-white p-4 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all flex items-center justify-between group"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-active/5 text-active rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {section.icon === 'Star' ? <Star size={20} /> : 
                   section.icon === 'Gift' ? <Gift size={20} /> :
                   section.icon === 'Zap' ? <Zap size={20} /> :
                   section.icon === 'ExternalLink' ? <ExternalLink size={20} /> :
                   <ChevronRight size={20} />}
                </div>
                <span className="font-bold text-primary text-sm">{section.displayName}</span>
              </div>
              <ChevronRight size={18} className="text-secondary group-hover:text-active transition-colors" />
            </button>
          );
        }
        return null;
    }
  };

  // Ensure services_grid is included if not in sections
  const allSections = [...sections];
  if (!allSections.find(s => s.sectionKey === 'services_grid')) {
    allSections.push({ id: 'services_grid', sectionKey: 'services_grid', displayName: 'Services', isEnabled: true, positionOrder: 100 });
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-24 bg-[#f8f8f8] min-h-screen">
      {allSections.sort((a, b) => a.positionOrder - b.positionOrder).map(section => renderSection(section))}
    </div>
  );
}
