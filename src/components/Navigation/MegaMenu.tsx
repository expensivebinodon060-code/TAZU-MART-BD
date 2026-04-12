import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronRight, ArrowRight, Zap, Gift, Star, TrendingUp, ShoppingBag } from 'lucide-react';
import { Category, SubCategory } from '../../types';

interface MegaMenuProps {
  isOpen: boolean;
  onClose: () => void;
  category: Category;
  onSubCategoryClick: (sub: SubCategory) => void;
  onCategoryClick: (cat: Category) => void;
}

const MegaMenu: React.FC<MegaMenuProps> = ({
  isOpen,
  onClose,
  category,
  onSubCategoryClick,
  onCategoryClick
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onMouseEnter={onClose}
            className="fixed inset-0 top-[130px] bg-black/40 z-[150] backdrop-blur-sm"
          />
          
          {/* Mega Menu Content */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            onMouseLeave={onClose}
            className="fixed top-[130px] left-1/2 -translate-x-1/2 w-full max-w-7xl bg-white text-[#0B1120] z-[151] rounded-b-[40px] shadow-2xl overflow-hidden border-t border-gray-100"
          >
            <div className="grid grid-cols-12 h-full">
              {/* Left Column: Sub Categories */}
              <div className="col-span-8 p-10 grid grid-cols-3 gap-10">
                {category.subCategories?.map((sub) => (
                  <div key={sub.id} className="space-y-4">
                    <button 
                      onClick={() => onSubCategoryClick(sub)}
                      className="font-black text-[18px] uppercase tracking-tight text-gray-900 hover:text-active transition-all group flex items-center gap-2"
                    >
                      {sub.name}
                      <ArrowRight size={16} className="opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all" />
                    </button>
                    
                    {/* Mock Sub-Sub Categories */}
                    <ul className="space-y-2">
                      {['New Arrivals', 'Best Sellers', 'Trending Now', 'On Sale'].map((item) => (
                        <li key={item}>
                          <button className="text-sm font-bold text-gray-400 hover:text-gray-900 transition-all flex items-center gap-2 group">
                            <div className="w-1 h-1 bg-gray-200 rounded-full group-hover:bg-active transition-all" />
                            {item}
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Right Column: Featured / Banner */}
              <div className="col-span-4 bg-gray-50/50 p-10 border-l border-gray-100 flex flex-col gap-6">
                <div className="relative aspect-[4/3] rounded-[32px] overflow-hidden group cursor-pointer shadow-xl shadow-black/5">
                  <img 
                    src={category.banner || `https://picsum.photos/seed/${category.id}/800/600`} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-white text-2xl font-black uppercase tracking-tighter mb-1">
                      {category.bannerTitle || category.name}
                    </h3>
                    <p className="text-white/80 text-xs font-medium mb-4">
                      {category.bannerSubtitle || 'Premium Collection 2026'}
                    </p>
                    <button 
                      onClick={() => onCategoryClick(category)}
                      className="w-fit py-3 px-6 bg-white text-active rounded-full text-xs font-black uppercase tracking-widest hover:bg-active hover:text-white transition-all shadow-lg shadow-black/20"
                    >
                      Shop Now
                    </button>
                  </div>
                </div>

                {/* Featured Products Mini List */}
                <div className="space-y-4">
                  <h4 className="text-[10px] font-black text-gray-400 uppercase tracking-widest px-2">Featured In {category.name}</h4>
                  <div className="grid grid-cols-2 gap-4">
                    {[1, 2].map((i) => (
                      <div key={i} className="flex items-center gap-3 p-2 bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all cursor-pointer group">
                        <div className="w-12 h-12 bg-gray-100 rounded-xl overflow-hidden flex-shrink-0">
                          <img src={`https://picsum.photos/seed/${category.id}${i}/100/100`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] font-black text-gray-900 truncate uppercase tracking-tight">Best Seller {i}</div>
                          <div className="text-[10px] font-bold text-active">৳ 1,200</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default MegaMenu;
