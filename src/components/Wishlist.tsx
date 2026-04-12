import React from 'react';
import { motion } from 'motion/react';
import { Heart, ArrowLeft, ShoppingCart, Trash2 } from 'lucide-react';
import { Product } from '../types';

interface WishlistProps {
  wishlist: Product[];
  onBack: () => void;
  onAddToCart: (product: Product) => void;
  onRemoveFromWishlist: (product: Product) => void;
  onProductClick: (product: Product) => void;
}

export default function Wishlist({ 
  wishlist, 
  onBack, 
  onAddToCart, 
  onRemoveFromWishlist,
  onProductClick
}: WishlistProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors"
            >
              <ArrowLeft size={20} className="text-gray-600" />
            </button>
            <h1 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              My Wishlist <span className="text-rose-500"><Heart size={18} fill="currentColor" /></span>
            </h1>
          </div>
          <div className="text-sm font-medium text-gray-500">
            {wishlist.length} {wishlist.length === 1 ? 'Item' : 'Items'}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6">
        {wishlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-4">
              <Heart size={40} className="text-rose-200" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
            <p className="text-gray-500 mb-8 max-w-xs">
              Save your favorite items here to keep track of what you love.
            </p>
            <button 
              onClick={onBack}
              className="bg-active text-white px-8 py-3 rounded-xl font-bold shadow-lg shadow-active/20 hover:scale-105 transition-transform"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {wishlist.map((product) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                key={product.id}
                className="bg-white rounded-2xl p-4 border border-gray-100 shadow-sm flex gap-4 group relative"
              >
                {/* Product Image */}
                <div 
                  className="w-24 h-24 md:w-32 md:h-32 bg-gray-50 rounded-xl overflow-hidden flex-shrink-0 cursor-pointer"
                  onClick={() => onProductClick(product)}
                >
                  <img 
                    src={product.image} 
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>

                {/* Product Info */}
                <div className="flex-grow flex flex-col justify-between py-1">
                  <div>
                    <h3 
                      className="font-bold text-gray-900 text-sm md:text-base mb-1 line-clamp-2 cursor-pointer hover:text-active transition-colors"
                      onClick={() => onProductClick(product)}
                    >
                      {product.name}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-active font-black text-base md:text-lg">
                        ৳{product.activeOffer 
                          ? (product.activeOffer.discountType === 'Percentage' 
                              ? product.price * (1 - product.activeOffer.discountValue / 100)
                              : Math.max(0, product.price - product.activeOffer.discountValue))
                          : product.price}
                      </span>
                      {(product.oldPrice || product.activeOffer) && (
                        <span className="text-gray-400 text-xs line-through">
                          ৳{product.oldPrice || product.price}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 mt-2">
                    <button
                      onClick={() => onAddToCart(product)}
                      className="flex-grow bg-active text-white py-2 rounded-lg text-xs font-bold flex items-center justify-center gap-2 hover:bg-active/90 transition-colors"
                    >
                      <ShoppingCart size={14} />
                      Add to Cart
                    </button>
                    <button
                      onClick={() => onRemoveFromWishlist(product)}
                      className="p-2 bg-gray-50 text-gray-400 hover:text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                      title="Remove from wishlist"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
