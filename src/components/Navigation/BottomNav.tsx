import React from 'react';
import { motion } from 'motion/react';
import { Home, Search, ShoppingCart, Heart, User, Menu } from 'lucide-react';

interface BottomNavProps {
  activeView: string;
  onViewChange: (view: any) => void;
  cartCount: number;
  onMenuClick: () => void;
}

const BottomNav: React.FC<BottomNavProps> = ({
  activeView,
  onViewChange,
  cartCount,
  onMenuClick
}) => {
  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'search', label: 'Search', icon: Search },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { id: 'wishlist', label: 'Wishlist', icon: Heart },
    { id: 'profile', label: 'Account', icon: User },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 px-4 py-2 z-[200] pb-safe">
      <div className="flex items-center justify-between max-w-md mx-auto">
        <button 
          onClick={onMenuClick}
          className="flex flex-col items-center gap-1 p-2 text-gray-400 hover:text-active transition-all"
        >
          <Menu size={20} />
          <span className="text-[10px] font-bold uppercase tracking-tighter">Menu</span>
        </button>

        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center gap-1 p-2 transition-all relative ${
              activeView === item.id ? 'text-active' : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <item.icon size={20} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-active text-white text-[8px] font-black rounded-full flex items-center justify-center border-2 border-white">
                  {item.badge}
                </span>
              )}
            </div>
            <span className="text-[10px] font-bold uppercase tracking-tighter">{item.label}</span>
            
            {activeView === item.id && (
              <motion.div 
                layoutId="bottomNavIndicator"
                className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-active rounded-full"
              />
            )}
          </button>
        ))}
      </div>
    </div>
  );
};

export default BottomNav;
