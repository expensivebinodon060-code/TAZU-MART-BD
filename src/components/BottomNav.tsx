import React from 'react';
import { Home, MessageSquare, Percent, ShoppingCart, User } from 'lucide-react';

interface BottomNavProps {
  currentView: string;
  setCurrentView: (view: any) => void;
  cartCount?: number;
  messageCount?: number;
}

const BottomNav: React.FC<BottomNavProps> = ({ 
  currentView, 
  setCurrentView, 
  cartCount = 0, 
  messageCount = 0 
}) => {
  const items = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'messages', label: 'Messages', icon: MessageSquare, badge: messageCount },
    { id: 'offers', label: 'Offer', icon: Percent },
    { id: 'cart', label: 'Cart', icon: ShoppingCart, badge: cartCount },
    { id: 'dashboard', label: 'Account', icon: User },
  ];

  return (
    <div className="md:hidden bottom-nav">
      {items.map((item) => {
        const isActive = currentView === item.id;
        const Icon = item.icon;

        return (
          <button
            key={item.id}
            onClick={() => setCurrentView(item.id)}
            className={`nav-item ${isActive ? 'active' : ''}`}
          >
            <div className="relative">
              <Icon size={22} />
              {item.badge !== undefined && item.badge > 0 && (
                <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[9px] font-bold min-w-[15px] h-[15px] flex items-center justify-center rounded-full px-1 border-2 border-white shadow-sm">
                  {item.badge > 99 ? '99+' : item.badge}
                </span>
              )}
            </div>
            <span>{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default BottomNav;
