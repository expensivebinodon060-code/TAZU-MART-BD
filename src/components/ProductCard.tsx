import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ShoppingCart, Star, Truck, Eye, Heart, Zap, Clock } from 'lucide-react';
import { Product } from '../types';

const CountdownTimer = ({ endDate }: { endDate: string }) => {
  const [timeLeft, setTimeLeft] = useState<{ hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const distance = new Date(endDate).getTime() - now;

      if (distance < 0) {
        clearInterval(timer);
        setTimeLeft(null);
      } else {
        setTimeLeft({
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [endDate]);

  if (!timeLeft) return null;

  return (
    <div className="flex items-center gap-1 text-white font-bold text-[9px]">
      <div className="bg-rose-600 px-1 rounded">
        {(timeLeft.hours ?? 0).toString().padStart(2, '0')}
      </div>
      <span className="text-rose-600">:</span>
      <div className="bg-rose-600 px-1 rounded">
        {(timeLeft.minutes ?? 0).toString().padStart(2, '0')}
      </div>
      <span className="text-rose-600">:</span>
      <div className="bg-rose-600 px-1 rounded">
        {(timeLeft.seconds ?? 0).toString().padStart(2, '0')}
      </div>
    </div>
  );
};

interface ProductCardProps {
  product: Product;
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onToggleWishlist?: (product: Product) => void;
  isWishlisted?: boolean;
  ranking?: number;
  variant?: 'default' | 'top-ranking';
  key?: string;
}

const ProductCard = ({ 
  product, 
  onAddToCart, 
  onProductClick, 
  onToggleWishlist,
  isWishlisted = false,
  ranking, 
  variant = 'default' 
}: ProductCardProps) => {
  const rating = product.rating || 5;
  const reviewsCount = 1500; // Mocking as per instruction example

  const formatViews = (num: number | string | undefined | null) => {
    if (num === undefined || num === null) return '0';
    const n = typeof num === 'string' ? parseInt(num.replace(/[^0-9]/g, '')) : num;
    if (isNaN(n as number)) return num.toString();
    const val = n as number;
    if (val >= 1000000) return (val / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    if (val >= 1000) return (val / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    return val.toString();
  };

  if (variant === 'top-ranking') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        onClick={() => onProductClick(product)}
        className="bg-[var(--card-bg)] border border-[var(--border)] rounded-2xl overflow-hidden group cursor-pointer shadow-sm hover:shadow-md transition-all duration-300 flex flex-col h-full relative"
      >
        {/* Top Section: Badges & Wishlist */}
        <div className="absolute top-3 left-3 right-3 z-10 flex justify-between items-start">
          <div className="flex flex-col gap-1 pointer-events-none">
            {product.discount && (
              <div className="bg-rose-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg shadow-sm">
                {product.discount}
              </div>
            )}
          </div>
          
          <div className="flex flex-col gap-2">
            <motion.button
              whileTap={{ scale: 0.8 }}
              onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
              className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                isWishlisted ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-black/60 text-white hover:bg-black/80'
              }`}
            >
              <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
            </motion.button>
            <div className="w-9 h-9 flex items-center justify-center bg-black/60 text-white rounded-full">
              <Truck size={20} strokeWidth={2.5} />
            </div>
          </div>
        </div>

        {/* Middle Section: Image (4:5 Ratio) */}
        <div className="relative aspect-[4/5] overflow-hidden bg-[var(--hover)]">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
        </div>

        {/* Bottom Section: Info */}
        <div className="p-3 flex flex-col flex-1 gap-2">
          <div className="space-y-1">
            <span className="text-[10px] text-[var(--text-paragraph)] font-bold uppercase tracking-wider">
              #{product.code || product.id.toUpperCase()}
            </span>
            <h3 className="font-bold text-sm line-clamp-2 text-[var(--text-heading)] leading-tight group-hover:text-[var(--active)] transition-colors">
              {product.name}
            </h3>
          </div>

          {/* Rating */}
          <div className="flex items-center gap-1">
            <div className="flex items-center gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} size={10} className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-[var(--border)]"} />
              ))}
            </div>
            <span className="text-[10px] text-[var(--text-paragraph)] font-medium">({reviewsCount} reviews)</span>
          </div>

          {/* Pricing & Cart */}
          <div className="mt-auto pt-2 flex items-end justify-between">
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <span className="text-[var(--active)] font-black text-xl">৳{product.price?.toLocaleString() || 0}</span>
                <div className="bg-black text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-bold text-[11px]">
                  <Eye size={12} fill="white" />
                  <span>{formatViews(product.views)}</span>
                </div>
              </div>
              {product.oldPrice && (
                <span className="text-[11px] text-[var(--text-paragraph)] line-through opacity-50">৳{product.oldPrice.toLocaleString()}</span>
              )}
            </div>

            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={(e) => { e.stopPropagation(); onAddToCart(product); }}
              className="w-10 h-10 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
            >
              <ShoppingCart size={18} strokeWidth={2.5} />
            </motion.button>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      onClick={() => onProductClick(product)}
      className="bg-[#0A0A0A] border border-white/5 rounded-2xl overflow-hidden group cursor-pointer shadow-lg hover:shadow-white/5 transition-all duration-300 flex flex-col h-full relative"
    >
      {/* Image Section */}
      <div className="relative aspect-square overflow-hidden bg-[#111] flex items-center justify-center">
        <img 
          src={product.image} 
          alt={product.name} 
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          referrerPolicy="no-referrer"
        />
        
        {/* Flash Sale Timer Overlay */}
        {product.activeOffer?.type === 'Flash Sale' && (
          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-2 flex items-center justify-between">
            <div className="flex items-center gap-1 text-rose-500">
              <Zap size={10} fill="currentColor" />
              <span className="text-[9px] font-black uppercase tracking-tighter">Flash Sale</span>
            </div>
            <CountdownTimer endDate={product.activeOffer.endDate} />
          </div>
        )}
        
        {/* Overlay Badges & Wishlist */}
        <div className="absolute inset-0 p-3">
          <div className="flex justify-between items-start w-full">
            <div className="flex flex-col gap-1 pointer-events-none">
              {product.discount && (
                <div className="bg-rose-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-lg">
                  {product.discount}
                </div>
              )}
              {(product.isBestSelling || ranking === 1) && (
                <div className="bg-amber-500 text-black text-[9px] font-black px-2 py-0.5 rounded-md shadow-lg uppercase tracking-tighter">
                  Best Seller
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end gap-2">
              <motion.button
                whileTap={{ scale: 0.8 }}
                onClick={(e) => { e.stopPropagation(); onToggleWishlist?.(product); }}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-all ${
                  isWishlisted ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-black/60 text-white hover:bg-black/80'
                }`}
              >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} strokeWidth={2.5} />
              </motion.button>
              <div className="w-9 h-9 flex items-center justify-center bg-black/60 text-white rounded-full">
                <Truck size={20} strokeWidth={2.5} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1 gap-2">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between">
            <span className="text-[10px] text-gray-500 font-medium">#{product.code || product.id.toUpperCase()}</span>
            <div className="bg-emerald-500/10 text-emerald-500 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
              IN STOCK
            </div>
          </div>
          <h3 className="font-bold text-sm line-clamp-2 text-white leading-tight group-hover:text-emerald-400 transition-colors">
            {product.name}
          </h3>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1">
          <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={10} className={i < Math.floor(rating) ? "text-amber-400 fill-amber-400" : "text-gray-700"} />
            ))}
          </div>
          <span className="text-[10px] text-gray-500">({reviewsCount} reviews)</span>
        </div>

        {/* Pricing & Cart */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <span className="text-rose-500 font-black text-lg">
                ৳{product.activeOffer 
                  ? (product.activeOffer.discountType === 'Percentage' 
                      ? Math.round(product.price * (1 - product.activeOffer.discountValue / 100))
                      : product.price - product.activeOffer.discountValue).toLocaleString()
                  : product.price.toLocaleString()}
              </span>
              <div className="bg-black text-white px-2 py-0.5 rounded-full flex items-center gap-1 font-bold text-[11px]">
                <Eye size={12} fill="white" />
                <span>{formatViews(product.views)}</span>
              </div>
            </div>
            {(product.oldPrice || product.activeOffer) && (
              <span className="text-[11px] text-gray-600 line-through">
                ৳{(product.oldPrice || product.price).toLocaleString()}
              </span>
            )}
          </div>

          <motion.button 
            whileTap={{ scale: 0.9 }}
            onClick={(e) => { 
              e.stopPropagation(); 
              const finalPrice = product.activeOffer 
                ? (product.activeOffer.discountType === 'Percentage' 
                    ? Math.round(product.price * (1 - product.activeOffer.discountValue / 100))
                    : product.price - product.activeOffer.discountValue)
                : product.price;
              onAddToCart({ ...product, price: finalPrice }); 
            }}
            className="w-10 h-10 bg-emerald-500 text-black rounded-full flex items-center justify-center hover:bg-emerald-400 transition-all shadow-lg shadow-emerald-500/20"
          >
            <ShoppingCart size={18} strokeWidth={2.5} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
