import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, ChevronRight, LayoutGrid, Gift, Zap, Star, TrendingUp, Lock } from 'lucide-react';
import { Category, SubCategory } from '../../types';

interface CategorySidebarProps {
  isOpen: boolean;
  onClose: () => void;
  categories: Category[];
  onCategoryClick: (category: Category) => void;
  onSubCategoryClick: (sub: SubCategory) => void;
  onAdminClick: () => void;
}

const CategorySidebar: React.FC<CategorySidebarProps> = ({
  isOpen,
  onClose,
  categories,
  onCategoryClick,
  onSubCategoryClick,
  onAdminClick
}) => {
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(categories[0]?.id || null);

  const selectedCategory = categories.find(c => c.id === selectedCategoryId) || categories[0];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 z-[200] backdrop-blur-sm"
          />
          
          {/* Drawer */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-[500px] bg-white text-[#0B1120] z-[201] flex flex-col shadow-2xl overflow-hidden"
          >
            {/* Header */}
            <div className="h-[60px] px-6 flex items-center justify-between border-b border-gray-100 bg-white">
              <div className="flex items-center gap-3">
                <LayoutGrid size={20} className="text-active" />
                <span className="font-black text-lg tracking-tight uppercase text-gray-900">Categories</span>
              </div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
              >
                <X size={24} />
              </button>
            </div>

            {/* Content: Split Layout */}
            <div className="flex-1 flex overflow-hidden">
              {/* Left Sidebar: Main Categories */}
              <div className="w-[140px] md:w-[160px] bg-gray-50 border-r border-gray-100 overflow-y-auto scrollbar-hide">
                {categories.filter(c => c.isVisible !== false).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategoryId(cat.id)}
                    className={`w-full px-4 py-5 text-left transition-all relative group ${
                      selectedCategoryId === cat.id 
                        ? 'bg-white text-active font-black' 
                        : 'text-gray-500 hover:bg-white/50'
                    }`}
                  >
                    {selectedCategoryId === cat.id && (
                      <motion.div 
                        layoutId="active-indicator"
                        className="absolute left-0 top-0 bottom-0 w-1 bg-active" 
                      />
                    )}
                    <div className="flex flex-col items-center gap-2 text-center">
                      <span className="text-2xl">{cat.icon || '📁'}</span>
                      <span className="text-[11px] leading-tight uppercase tracking-tighter">{cat.name}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Right Content: Subcategories Grid */}
              <div className="flex-1 bg-white overflow-y-auto p-4 md:p-6">
                {selectedCategory && (
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-black text-gray-900 uppercase tracking-widest">
                        {selectedCategory.name}
                      </h3>
                      <button 
                        onClick={() => onCategoryClick(selectedCategory)}
                        className="text-[10px] font-bold text-active uppercase tracking-widest hover:underline"
                      >
                        View All
                      </button>
                    </div>

                    {selectedCategory.subCategories && selectedCategory.subCategories.length > 0 ? (
                      <div className="grid grid-cols-3 gap-x-3 gap-y-6">
                        {selectedCategory.subCategories.filter(s => s.isVisible !== false).map((sub) => (
                          <button
                            key={sub.id}
                            onClick={() => onSubCategoryClick(sub)}
                            className="flex flex-col items-center gap-2 group"
                          >
                            <div className="w-full aspect-square rounded-full overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-active transition-all group-hover:shadow-md">
                              <img 
                                src={sub.image || `https://picsum.photos/seed/${sub.id}/300/300`} 
                                alt={sub.name}
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                referrerPolicy="no-referrer"
                              />
                            </div>
                            <span className="text-[10px] md:text-xs font-bold text-gray-600 group-hover:text-active text-center leading-tight line-clamp-2">
                              {sub.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    ) : (
                      <div className="grid grid-cols-3 gap-x-3 gap-y-6">
                        <button
                          onClick={() => onCategoryClick(selectedCategory)}
                          className="flex flex-col items-center gap-2 group"
                        >
                          <div className="w-full aspect-square rounded-full overflow-hidden bg-gray-50 border border-gray-100 group-hover:border-active transition-all group-hover:shadow-md">
                            <img 
                              src={selectedCategory.image || `https://picsum.photos/seed/${selectedCategory.id}/300/300`} 
                              alt={selectedCategory.name}
                              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          <span className="text-[10px] md:text-xs font-bold text-gray-600 group-hover:text-active text-center leading-tight line-clamp-2">
                            All {selectedCategory.name}
                          </span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex items-center justify-between">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">TAZU MART BD v2.0</span>
              <button 
                onClick={onAdminClick}
                className="p-2 text-gray-300 hover:text-active transition-colors"
              >
                <Lock size={14} />
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default CategorySidebar;
