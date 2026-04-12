import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, ShoppingCart, LayoutGrid, ChevronRight } from 'lucide-react';
import { Product, Category, SubCategory, Offer } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_OFFERS } from '../mockData';
import ProductCard from './ProductCard';

interface CategoryPageProps {
  category: Category;
  products: Product[];
  categories: Category[];
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function CategoryPage({ 
  category: initialCategory, 
  products,
  categories: allCategories,
  onBack, 
  onAddToCart, 
  onProductClick,
  onToggleWishlist,
  wishlist
}: CategoryPageProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>(initialCategory);
  const [selectedSubCategoryId, setSelectedSubCategoryId] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const response = await fetch('/api/offers');
        if (response.ok) {
          const data = await response.json();
          setOffers(data);
        } else {
          setOffers(MOCK_OFFERS);
        }
      } catch (error) {
        console.error('Error fetching offers in CategoryPage:', error);
        setOffers(MOCK_OFFERS);
      }
    };
    fetchOffers();
  }, []);

  const getProductWithOffer = (product: Product) => {
    const activeOffer = offers.find(o => 
      o.status === 'Active' && 
      o.productIds.includes(product.id) &&
      new Date(o.startDate) <= new Date() &&
      new Date(o.endDate) >= new Date()
    );
    return { ...product, activeOffer };
  };
  
  const categoryProducts = products.filter(p => {
    const matchesCategory = p.categoryId === selectedCategory.id;
    if (!selectedSubCategoryId) return matchesCategory;
    return matchesCategory;
  }).map(getProductWithOffer);

  const handleCategoryChange = (cat: Category) => {
    setSelectedCategory(cat);
    setSelectedSubCategoryId(null);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Mobile Header */}
      <div className="md:hidden h-[60px] px-4 flex items-center justify-between border-b border-gray-100 sticky top-0 bg-white z-50">
        <button onClick={onBack} className="p-2 -ml-2 text-gray-600">
          <ArrowLeft size={24} />
        </button>
        <h1 className="font-black text-lg uppercase tracking-tight text-gray-900">{selectedCategory.name}</h1>
        <div className="w-10" /> {/* Spacer */}
      </div>

      <div className="flex h-[calc(100vh-60px)] md:h-screen overflow-hidden">
        {/* Left Sidebar: All Categories */}
        <aside className="w-[100px] md:w-[200px] bg-gray-50 border-r border-gray-100 overflow-y-auto scrollbar-hide">
          {allCategories.filter(c => c.isVisible !== false).map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat)}
              className={`w-full px-2 md:px-6 py-6 text-left transition-all relative group ${
                selectedCategory.id === cat.id 
                  ? 'bg-white text-active font-black shadow-sm' 
                  : 'text-gray-500 hover:bg-white/50'
              }`}
            >
              {selectedCategory.id === cat.id && (
                <motion.div 
                  layoutId="active-indicator-page"
                  className="absolute left-0 top-0 bottom-0 w-1 bg-active" 
                />
              )}
              <div className="flex flex-col md:flex-row items-center gap-2 md:gap-4">
                <span className="text-2xl md:text-xl">{cat.icon || '📁'}</span>
                <span className="text-[10px] md:text-xs leading-tight uppercase tracking-widest text-center md:text-left">
                  {cat.name}
                </span>
              </div>
            </button>
          ))}
        </aside>

        {/* Right Content: Subcategories & Products */}
        <main className="flex-1 overflow-y-auto bg-white p-4 md:p-8 scrollbar-hide">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedCategory.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="space-y-10 max-w-5xl mx-auto"
            >
              {/* Category Banner (Subtle) */}
              <div className="relative h-[120px] md:h-[200px] rounded-[24px] md:rounded-[40px] overflow-hidden bg-gray-900">
                <img 
                  src={selectedCategory.banner || `https://picsum.photos/seed/${selectedCategory.id}/1200/400`} 
                  alt={selectedCategory.name}
                  className="w-full h-full object-cover opacity-60"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-12">
                  <h2 className="text-2xl md:text-5xl font-black text-white uppercase tracking-tighter">
                    {selectedCategory.name}
                  </h2>
                  <p className="text-white/60 text-[10px] md:text-xs font-bold uppercase tracking-[0.2em] mt-2">
                    Premium Collection 2024
                  </p>
                </div>
              </div>

              {/* Subcategories Grid */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Explore Subcategories</h3>
                  <div className="h-px flex-1 bg-gray-100 mx-6" />
                </div>

                {selectedCategory.subCategories && selectedCategory.subCategories.length > 0 ? (
                  <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-x-4 gap-y-8">
                    {selectedCategory.subCategories.filter(s => s.isVisible !== false).map((sub) => (
                      <button
                        key={sub.id}
                        onClick={() => setSelectedSubCategoryId(sub.id === selectedSubCategoryId ? null : sub.id)}
                        className={`flex flex-col items-center gap-3 group transition-all ${selectedSubCategoryId === sub.id ? 'scale-105' : ''}`}
                      >
                        <div className={`w-full aspect-square rounded-full overflow-hidden bg-gray-50 border transition-all group-hover:shadow-xl group-hover:-translate-y-1 duration-300 ${selectedSubCategoryId === sub.id ? 'border-active ring-2 ring-active/20' : 'border-gray-100 group-hover:border-active'}`}>
                          <img 
                            src={sub.image || `https://picsum.photos/seed/${sub.id}/300/300`} 
                            alt={sub.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                            referrerPolicy="no-referrer"
                          />
                        </div>
                        <span className={`text-[10px] md:text-xs font-black text-center leading-tight uppercase tracking-tight transition-colors ${selectedSubCategoryId === sub.id ? 'text-active' : 'text-gray-700 group-hover:text-active'}`}>
                          {sub.name}
                        </span>
                      </button>
                    ))}
                  </div>
                ) : (
                  <div className="py-12 text-center bg-gray-50 rounded-3xl border border-dashed border-gray-200">
                    <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">No subcategories available</p>
                  </div>
                )}
              </section>

              {/* Products Section */}
              <section className="space-y-6 pb-20">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-black text-gray-400 uppercase tracking-[0.3em]">Featured Products</h3>
                  <div className="h-px flex-1 bg-gray-100 mx-6" />
                </div>

                {categoryProducts.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                    {categoryProducts.map((product) => (
                      <ProductCard 
                        key={product.id} 
                        product={product} 
                        onAddToCart={onAddToCart} 
                        onProductClick={onProductClick} 
                        onToggleWishlist={onToggleWishlist}
                        isWishlisted={wishlist.some(p => p.id === product.id)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-20 space-y-4 bg-gray-50 rounded-[40px] border border-gray-100">
                    <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-gray-200 shadow-sm">
                      <ShoppingCart size={40} />
                    </div>
                    <p className="text-gray-400 font-bold uppercase tracking-widest text-xs">No products found</p>
                  </div>
                )}
              </section>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
}
