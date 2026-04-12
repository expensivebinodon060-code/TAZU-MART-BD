import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, ShoppingCart, Filter } from 'lucide-react';
import { Product, Offer } from '../types';
import { MOCK_PRODUCTS, MOCK_OFFERS } from '../mockData';
import ProductCard from './ProductCard';

interface TopRankingProductsProps {
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
}

const TopRankingProducts = ({ 
  onBack, 
  onAddToCart, 
  onProductClick,
  onToggleWishlist,
  wishlist
}: TopRankingProductsProps) => {
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
        console.error('Error fetching offers in TopRankingProducts:', error);
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

  const topProducts = MOCK_PRODUCTS.filter(p => p.isFeatured).map(getProductWithOffer);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <button 
            onClick={onBack}
            className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-lg font-black text-gray-900 uppercase tracking-tight">Top Ranking</h1>
            <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Best Selling Products</p>
          </div>
        </div>
        <button className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Filter size={20} className="text-gray-400" />
        </button>
      </header>

      {/* Product Grid */}
      <div className="p-4">
        <div className="grid grid-cols-2 gap-4">
          {topProducts.map((product, index) => (
            <ProductCard 
              key={product.id} 
              product={product} 
              onAddToCart={onAddToCart} 
              onProductClick={onProductClick} 
              onToggleWishlist={onToggleWishlist}
              isWishlisted={wishlist.some(p => p.id === product.id)}
              ranking={index + 1}
              variant="top-ranking"
            />
          ))}
        </div>
      </div>

      {/* Floating Cart Button (Optional, but good for UX) */}
      <motion.div 
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        className="fixed bottom-24 right-6 z-50"
      >
        <button className="w-14 h-14 bg-active text-white rounded-full shadow-2xl flex items-center justify-center relative">
          <ShoppingCart size={24} />
          <div className="absolute -top-1 -right-1 w-5 h-5 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center border-2 border-white">
            0
          </div>
        </button>
      </motion.div>
    </div>
  );
};

export default TopRankingProducts;
