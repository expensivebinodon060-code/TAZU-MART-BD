import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Menu, 
  Search, 
  ShoppingCart, 
  Heart, 
  User, 
  ChevronDown, 
  X, 
  Camera, 
  Mic, 
  LayoutGrid, 
  Zap, 
  Gift, 
  Star, 
  TrendingUp, 
  ShoppingBag,
  Bell,
  Headphones,
  Settings,
  LogOut,
  Lock
} from 'lucide-react';
import { Category, SubCategory, Product } from '../../types';
import MegaMenu from './MegaMenu';
import CategorySidebar from './CategorySidebar';

interface NavbarProps {
  categories: Category[];
  cartCount: number;
  wishlistCount: number;
  user: any;
  onNavigate: (view: any) => void;
  onCategoryClick: (cat: Category) => void;
  onSubCategoryClick: (sub: SubCategory) => void;
  onLogout: () => void;
  onAdminClick: () => void;
  isSidebarOpen?: boolean;
  onSidebarClose?: () => void;
  onSidebarOpen?: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  categories,
  cartCount,
  wishlistCount,
  user,
  onNavigate,
  onCategoryClick,
  onSubCategoryClick,
  onLogout,
  onAdminClick,
  isSidebarOpen: externalIsSidebarOpen,
  onSidebarClose: externalOnSidebarClose,
  onSidebarOpen: externalOnSidebarOpen
}) => {
  const [internalIsSidebarOpen, setInternalIsSidebarOpen] = useState(false);
  
  const isSidebarOpen = externalIsSidebarOpen !== undefined ? externalIsSidebarOpen : internalIsSidebarOpen;
  const setIsSidebarOpen = (val: boolean) => {
    if (val) {
      externalOnSidebarOpen ? externalOnSidebarOpen() : setInternalIsSidebarOpen(true);
    } else {
      externalOnSidebarClose ? externalOnSidebarClose() : setInternalIsSidebarOpen(false);
    }
  };
  const [searchQuery, setSearchQuery] = useState('');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`fixed top-0 left-0 right-0 z-[100] transition-all duration-300 bg-white ${isScrolled ? 'shadow-lg' : 'border-b border-gray-100'}`}>
        <div className="max-w-7xl mx-auto px-4">
          {/* Top Row: Menu | Brand | Profile */}
          <div className="flex items-center justify-between h-[60px] md:h-[70px]">
            {/* Left: Menu Button */}
            <div className="flex-1 flex items-center">
              <motion.button 
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsSidebarOpen(true)}
                className="p-2.5 bg-gray-50 text-gray-900 rounded-xl hover:bg-gray-100 transition-all shadow-sm border border-gray-100 flex items-center gap-2 group"
              >
                <Menu size={22} className="group-hover:text-active transition-colors" />
                <span className="hidden md:block text-xs font-bold uppercase tracking-widest">Menu</span>
              </motion.button>
            </div>

            {/* Center: Brand Name */}
            <div 
              onClick={() => onNavigate('home')}
              className="text-xl md:text-2xl font-black tracking-tighter text-active cursor-pointer select-none text-center whitespace-nowrap"
            >
              TAZU MART BD
            </div>

            {/* Right: Profile & Wishlist */}
            <div className="flex-1 flex items-center justify-end gap-2 md:gap-4">
              <button 
                onClick={() => onNavigate('wishlist')}
                className="flex p-2.5 text-gray-500 hover:text-active hover:bg-active/5 rounded-xl transition-all relative"
              >
                <Heart size={22} />
                {wishlistCount > 0 && (
                  <span className="absolute top-1 right-1 bg-active text-white text-[9px] font-black min-w-[16px] h-[16px] flex items-center justify-center rounded-full border-2 border-white shadow-sm">
                    {wishlistCount}
                  </span>
                )}
              </button>

              <button 
                onClick={() => onNavigate(user ? 'dashboard' : 'login')}
                className="flex items-center gap-2 p-1.5 md:p-2 bg-gray-50 hover:bg-active/5 rounded-xl transition-all border border-gray-100 group"
              >
                <div className="w-8 h-8 md:w-9 md:h-9 bg-white rounded-lg flex items-center justify-center text-gray-400 group-hover:text-active shadow-sm transition-all overflow-hidden">
                  {user?.profileImage ? (
                    <img src={user.profileImage} className="w-full h-full object-cover" />
                  ) : (
                    <User size={18} />
                  )}
                </div>
                <span className="hidden md:block text-xs font-bold text-gray-900 pr-2">
                  {user ? user.fullName.split(' ')[0] : 'Profile'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Sidebar Menu Integration */}
      <CategorySidebar 
        isOpen={isSidebarOpen} 
        onClose={() => setIsSidebarOpen(false)} 
        categories={categories}
        onCategoryClick={(cat) => { setIsSidebarOpen(false); onCategoryClick(cat); }}
        onSubCategoryClick={(sub) => { setIsSidebarOpen(false); onSubCategoryClick(sub); }}
        onAdminClick={() => { setIsSidebarOpen(false); onAdminClick(); }}
      />

      {/* Spacer for Fixed Header */}
      <div className="h-[60px] md:h-[70px]" />
    </>
  );
};

export default Navbar;
