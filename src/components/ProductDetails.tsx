import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  Truck, 
  Eye, 
  Zap,
  Plus, 
  Minus, 
  Heart, 
  Share2, 
  MessageSquare,
  CheckCircle2,
  X,
  Check,
  Copy,
  MessageCircle,
  Facebook,
  Send,
  Package,
  ShieldCheck,
  CreditCard,
  RotateCcw,
  Home,
  ChevronRight
} from 'lucide-react';
import { Product, Review, ProductVariation } from '../types';
import ProductCard from './ProductCard';

interface ProductDetailsProps {
  product: Product;
  onBack: () => void;
  onAddToCart: (product: any) => void;
  onOrderNow: (product: any) => void;
  onToggleWishlist: (product: Product) => void;
  isWishlisted: boolean;
  setCurrentView?: (view: any) => void;
  onProductClick?: (product: Product) => void;
}

export default function ProductDetails({ 
  product, 
  onBack, 
  onAddToCart, 
  onOrderNow,
  onToggleWishlist,
  isWishlisted,
  setCurrentView,
  onProductClick
}: ProductDetailsProps) {
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariations, setSelectedVariations] = useState<Record<string, ProductVariation>>({});
  const [variantImages, setVariantImages] = useState<string[] | null>(null);
  const [quantity, setQuantity] = useState(1);
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [variations, setVariations] = useState<ProductVariation[]>([]);
  const [currentViews, setCurrentViews] = useState(product.views);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [isAutoSwiping, setIsAutoSwiping] = useState(true);
  const activeOffer = product.activeOffer;

  const images = variantImages || product.images || [product.image];

  // Auto-swipe gallery
  useEffect(() => {
    if (isAutoSwiping && images.length > 1) {
      const interval = setInterval(() => {
        setSelectedImage(prev => (prev + 1) % images.length);
      }, 3000);
      return () => clearInterval(interval);
    }
  }, [isAutoSwiping, images.length]);

  // Group variations by type
  const groupedVariations: Record<string, ProductVariation[]> = variations.reduce((acc, v) => {
    if (!acc[v.attributeType]) acc[v.attributeType] = [];
    acc[v.attributeType].push(v);
    return acc;
  }, {} as Record<string, ProductVariation[]>);

  // Initialize selected variations and variant images
  useEffect(() => {
    if (variations.length > 0) {
      const initial: Record<string, ProductVariation> = {};
      const groups: Record<string, ProductVariation[]> = variations.reduce((acc, v) => {
        if (!acc[v.attributeType]) acc[v.attributeType] = [];
        acc[v.attributeType].push(v);
        return acc;
      }, {} as Record<string, ProductVariation[]>);

      Object.entries(groups).forEach(([type, vars]) => {
        if (vars.length > 0) {
          initial[type] = vars[0];
        }
      });
      setSelectedVariations(initial);

      // Check for variant images in initial selection
      const colorVar = initial['color'];
      if (colorVar && colorVar.images && colorVar.images.length > 0) {
        setVariantImages(colorVar.images);
        setSelectedImage(0);
      }
    }
  }, [variations]);

  const handleVariationSelect = (type: string, v: ProductVariation) => {
    setSelectedVariations(prev => ({ ...prev, [type]: v }));
    
    // If color variant is selected, update variant images
    if (type === 'color') {
      if (v.images && v.images.length > 0) {
        setVariantImages(v.images);
        setSelectedImage(0);
      } else {
        setVariantImages(null);
        setSelectedImage(0);
      }
    }
  };

  const [timeLeft, setTimeLeft] = useState<{ days: number, hours: number, minutes: number, seconds: number } | null>(null);

  useEffect(() => {
    fetchVariations();
    incrementView();
  }, [product.id]);

  useEffect(() => {
    if (activeOffer?.type === 'Flash Sale' && activeOffer.endDate) {
      const timer = setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(activeOffer.endDate!).getTime() - now;

        if (distance < 0) {
          clearInterval(timer);
          setTimeLeft(null);
        } else {
          setTimeLeft({
            days: Math.floor(distance / (1000 * 60 * 60 * 24)),
            hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
            minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
            seconds: Math.floor((distance % (1000 * 60)) / 1000)
          });
        }
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [activeOffer]);

  useEffect(() => {
    const fetchRelated = async () => {
      try {
        const res = await fetch(`/api/related-products?categoryId=${product.categoryId}&productId=${product.id}`);
        if (!res.ok) throw new Error('Failed to fetch related products');
        const data = await res.json();
        setRelatedProducts(data);
      } catch (err) {
        console.error('Failed to fetch related products', err);
      }
    };
    fetchRelated();
    window.scrollTo(0, 0);
  }, [product.id, product.categoryId]);

  const calculateDiscountedPrice = () => {
    if (!activeOffer) return product.price;
    if (activeOffer.discountType === 'Percentage') {
      return product.price * (1 - activeOffer.discountValue / 100);
    } else {
      return Math.max(0, product.price - activeOffer.discountValue);
    }
  };

  const discountedPrice = calculateDiscountedPrice();
  const variationPriceAdjustment = (Object.values(selectedVariations) as ProductVariation[]).reduce((sum, v) => sum + v.priceAdjustment, 0);
  const finalPrice = discountedPrice + variationPriceAdjustment;

  const incrementView = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}/view`, { 
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      if (data && data.success) {
        setCurrentViews(data.views);
      }
    } catch (err) {
      console.error('Failed to increment view', err);
    }
  };

  const formatViews = (num: number | undefined | null) => {
    if (num === undefined || num === null) return '0';
    if (num >= 1000000) {
      return (num / 1000000).toFixed(1).replace(/\.0$/, '') + 'M';
    }
    if (num >= 1000) {
      return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
    }
    return num.toString();
  };

  const fetchVariations = async () => {
    try {
      const res = await fetch(`/api/products/${product.id}/variations`);
      if (!res.ok) throw new Error('Failed to fetch variations');
      const data = await res.json();
      setVariations(data.filter((v: ProductVariation) => v.isActive && v.isVisible));
    } catch (err) {
      console.error('Failed to fetch variations', err);
    }
  };

  const handleShare = async (platform: string) => {
    const url = window.location.href;
    const text = `Check out this product: ${product.name}`;
    
    try {
      await fetch(`/api/products/${product.id}/share`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ platform })
      });
    } catch (err) {
      console.error('Failed to log share', err);
    }

    switch (platform) {
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'messenger':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      case 'native':
        if (navigator.share) {
          try {
            await navigator.share({ title: product.name, text, url });
          } catch (err: any) {
            if (err.name !== 'AbortError') {
              console.error('Error sharing:', err);
            }
          }
        }
        break;
    }
    setIsShareModalOpen(false);
  };

  const reviews = product.reviews || [];
  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : '0.0';

  const basePrice = product.price + (Object.values(selectedVariations) as ProductVariation[]).reduce((sum, v) => sum + v.priceAdjustment, 0);
  const currentPrice = activeOffer 
    ? (activeOffer.discountType === 'Percentage' 
        ? Math.round(basePrice * (1 - activeOffer.discountValue / 100))
        : basePrice - activeOffer.discountValue)
    : basePrice;
  const isRequiredVariationsSelected = Object.keys(groupedVariations).every(type => !!selectedVariations[type]);
  const isOutOfStock = (Object.values(selectedVariations) as ProductVariation[]).some(v => v.stockQuantity === 0) || product.stockStatus === 'Out of Stock';
  const isAddToCartDisabled = !isRequiredVariationsSelected || isOutOfStock;

  const handleAddToCart = () => {
    const variantString = Object.entries(selectedVariations)
      .map(([type, v]) => `${type}: ${(v as ProductVariation).attributeValue}`)
      .join(', ');

    onAddToCart({
      ...product,
      price: currentPrice,
      variant: variantString || product.variant,
      variationId: (Object.values(selectedVariations) as ProductVariation[])[0]?.id // Simplified for now
    });
  };

  const handleOrderNow = () => {
    const variantString = Object.entries(selectedVariations)
      .map(([type, v]) => `${type}: ${(v as ProductVariation).attributeValue}`)
      .join(', ');

    onOrderNow({
      ...product,
      price: currentPrice,
      variant: variantString || product.variant,
      variationId: (Object.values(selectedVariations) as ProductVariation[])[0]?.id,
      quantity: quantity,
      selectedImage: images[selectedImage]
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 pb-24 space-y-8 bg-white text-[#111111]">
      {/* Header / Breadcrumb */}
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-gray-500 hover:text-[#FF6A00] transition-colors group"
      >
        <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        <span className="font-medium">Back to Shop</span>
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Image Gallery */}
        <div className="space-y-4">
          <div 
            className="relative aspect-square rounded-[24px] overflow-hidden bg-gray-50 border border-gray-100 cursor-zoom-in group"
            onMouseEnter={() => setIsAutoSwiping(false)}
            onMouseLeave={() => setIsAutoSwiping(true)}
          >
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                referrerPolicy="no-referrer"
              />
            </AnimatePresence>
            
            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-2">
              {activeOffer && (
                <div className="px-3 py-1.5 bg-active text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                  <Zap size={14} className="fill-white" />
                  {activeOffer.name}
                </div>
              )}
              {product.discount && !activeOffer && (
                <div className="px-3 py-1.5 bg-[#FF4D4D] text-white text-xs font-bold rounded-lg shadow-lg">
                  SAVE {product.discount}
                </div>
              )}
              {product.fastDelivery && (
                <div className="px-3 py-1.5 bg-blue-600 text-white text-xs font-bold rounded-lg shadow-lg flex items-center gap-1.5">
                  <Truck size={14} />
                  Fast Delivery
                </div>
              )}
            </div>
          </div>

          {images.length > 1 && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-24 aspect-square rounded-xl overflow-hidden border-2 transition-all shrink-0 ${
                    selectedImage === i ? 'border-[#FF6A00] scale-95' : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs font-bold text-[#FF6A00] uppercase tracking-widest">
                <CheckCircle2 size={14} />
                {product.stockStatus}
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => onToggleWishlist(product)}
                  className={`p-2.5 rounded-xl transition-all flex items-center gap-2 ${
                    isWishlisted ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-gray-100 text-gray-500 hover:text-rose-500 hover:bg-gray-200'
                  }`}
                >
                  <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
                  {product.likeCount !== undefined && <span className="text-xs font-bold">{product.likeCount + (isWishlisted ? 1 : 0)}</span>}
                </button>
                <button 
                  onClick={() => setIsShareModalOpen(true)}
                  className="p-2.5 bg-gray-100 hover:bg-gray-200 rounded-xl transition-all text-gray-500 hover:text-[#FF6A00]"
                >
                  <Share2 size={20} />
                </button>
              </div>
            </div>

            <h1 className="text-[22px] font-bold text-[#111111] leading-[30px] tracking-[0.3px]">{product.name}</h1>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-medium text-[#555]">
              <div className="flex items-center gap-1.5">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill={i < Math.floor(Number(averageRating)) ? "currentColor" : "none"} />
                  ))}
                </div>
                <span className="font-bold text-[#111111]">{averageRating}</span>
                <span>({reviews.length} Reviews)</span>
              </div>
              <div className="w-[1px] h-4 bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <Eye size={16} />
                <span>{formatViews(currentViews)} Views</span>
              </div>
              <div className="w-[1px] h-4 bg-gray-200" />
              <div className="flex items-center gap-1.5">
                <Package size={16} />
                <span>Code: {product.code}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="text-[30px] font-bold text-[#FF6A00]">৳{finalPrice?.toLocaleString() || 0}</div>
              
              {/* View Counter Badge */}
              <div className="bg-black text-white px-3 py-1 rounded-full flex items-center gap-1.5 font-semibold text-[13px] shadow-sm">
                <Eye size={14} fill="white" />
                <span>{currentViews?.toLocaleString() || 0}</span>
              </div>

              {(product.regularPrice || activeOffer) && (
                <div className="flex items-center gap-3">
                  <div className="text-[16px] text-[#888] line-through">
                    ৳{(product.regularPrice || product.price)?.toLocaleString() || 0}
                  </div>
                  <div className="px-2 py-1 bg-[#FF4D4D] text-white text-[12px] font-bold rounded-[6px]">
                    {activeOffer 
                      ? `SAVE ${activeOffer.discountValue}${activeOffer.discountType === 'Percentage' ? '%' : '৳'}`
                      : `SAVE ${Math.round(((product.regularPrice! - product.price) / product.regularPrice!) * 100)}%`
                    }
                  </div>
                </div>
              )}
            </div>

            {/* Flash Sale Timer */}
            {activeOffer?.type === 'Flash Sale' && timeLeft && (
              <div className="bg-active/5 border border-active/20 rounded-2xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Zap size={20} className="text-active fill-active" />
                  <span className="text-sm font-bold text-active uppercase tracking-tight">Flash Sale Ends In:</span>
                </div>
                <div className="flex gap-2">
                  {[
                    { label: 'D', value: timeLeft.days },
                    { label: 'H', value: timeLeft.hours },
                    { label: 'M', value: timeLeft.minutes },
                    { label: 'S', value: timeLeft.seconds },
                  ].map((unit, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <div className="bg-active text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold text-lg shadow-md">
                        {(unit.value ?? 0).toString().padStart(2, '0')}
                      </div>
                      <span className="text-[8px] font-bold text-active/60 mt-1">{unit.label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Trust Badges */}
            <div className="grid grid-cols-2 gap-y-3 pt-6 border-t border-gray-100">
              {[
                { icon: ShieldCheck, text: 'Secure Payment' },
                { icon: CreditCard, text: 'Cash On Delivery Available' },
                { icon: Truck, text: 'Fast Delivery Nationwide' },
                { icon: RotateCcw, text: '7-Day Easy Return' },
              ].map((badge, i) => (
                <div key={i} className="flex items-center gap-2 text-[13px] text-[#555]">
                  <badge.icon size={14} className="text-[#FF6A00]" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>

            {/* Delivery Info Box */}
            <div className="bg-[#F9F9F9] rounded-[10px] p-[12px] space-y-3">
              <div className="flex items-center gap-2 text-[14px] font-bold text-[#111111]">
                <Truck size={18} className="text-[#FF6A00]" />
                Delivery Information
              </div>
              <div className="grid grid-cols-1 gap-1 text-[14px] text-[#555]">
                <div className="flex justify-between">
                  <span>Inside Dhaka:</span>
                  <span className="font-bold text-[#111111]">24-48 Hours</span>
                </div>
                <div className="flex justify-between">
                  <span>Outside Dhaka:</span>
                  <span className="font-bold text-[#111111]">2-4 Days</span>
                </div>
                <div className="text-[12px] text-[#FF6A00] font-medium pt-1">Cash On Delivery Available</div>
              </div>
            </div>

            {/* Color Variants Selection (Main Page) */}
            {groupedVariations['color'] && (
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Select Color
                  </h4>
                  {selectedVariations['color'] && (
                    <span className="text-xs font-bold text-[#FF6A00]">
                      {selectedVariations['color'].attributeValue}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {groupedVariations['color'].map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleVariationSelect('color', v)}
                      disabled={v.stockQuantity === 0}
                      className={`relative flex items-center justify-center min-w-[3.5rem] h-14 px-3 rounded-2xl border-2 transition-all duration-300 ${
                        selectedVariations['color']?.id === v.id
                          ? 'border-[#FF6A00] bg-orange-50 shadow-md'
                          : 'border-gray-100 hover:border-gray-300 bg-white'
                      } ${v.stockQuantity === 0 ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                    >
                      <div className="flex flex-col items-center gap-1">
                        {v.colorCode ? (
                          <div 
                            className="w-6 h-6 rounded-full border border-gray-200 shadow-sm"
                            style={{ backgroundColor: v.colorCode }}
                          />
                        ) : v.image ? (
                          <img src={v.image} className="w-6 h-6 rounded-full object-cover border border-gray-200" />
                        ) : null}
                        <span className={`text-[10px] font-bold ${selectedVariations['color']?.id === v.id ? 'text-[#FF6A00]' : 'text-gray-600'}`}>
                          {v.attributeValue}
                        </span>
                      </div>
                      
                      {selectedVariations['color']?.id === v.id && (
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-[#FF6A00] rounded-full flex items-center justify-center shadow-lg border-2 border-white">
                          <Check className="w-3 h-3 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Other Variants (e.g. Size) */}
            {Object.entries(groupedVariations).filter(([type]) => type !== 'color').map(([type, typeVariations]) => (
              <div key={type} className="space-y-4 pt-4 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">
                    Select {type}
                  </h4>
                  {selectedVariations[type] && (
                    <span className="text-xs font-bold text-[#FF6A00]">
                      {selectedVariations[type].attributeValue}
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap gap-3">
                  {typeVariations.map((v) => (
                    <button
                      key={v.id}
                      onClick={() => handleVariationSelect(type, v)}
                      disabled={v.stockQuantity === 0}
                      className={`relative flex items-center justify-center min-w-[3.5rem] h-12 px-4 rounded-2xl border-2 transition-all duration-300 ${
                        selectedVariations[type]?.id === v.id
                          ? 'border-[#FF6A00] bg-orange-50 shadow-md'
                          : 'border-gray-100 hover:border-gray-300 bg-white'
                      } ${v.stockQuantity === 0 ? 'opacity-40 cursor-not-allowed grayscale' : ''}`}
                    >
                      <span className={`text-sm font-bold ${selectedVariations[type]?.id === v.id ? 'text-[#FF6A00]' : 'text-gray-600'}`}>
                        {v.attributeValue}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {/* Quantity Selector & Checkout Section */}
            <div className="space-y-6 pt-6 border-t border-gray-100">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Quantity</h4>
                  <p className="text-[10px] text-gray-500 font-medium">Select number of items</p>
                </div>
                <div className="flex items-center bg-gray-100 rounded-2xl p-1">
                  <button 
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#FF6A00] transition-colors"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                  <button 
                    onClick={() => setQuantity(quantity + 1)}
                    className="w-10 h-10 flex items-center justify-center text-gray-500 hover:text-[#FF6A00] transition-colors"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>

              <div className="p-6 bg-[#F9F9F9] rounded-[24px] space-y-4">
                <div className="flex items-center justify-between text-sm font-medium text-gray-500">
                  <span>Subtotal:</span>
                  <span className="text-lg font-bold text-[#111111]">৳{(finalPrice * quantity)?.toLocaleString() || 0}</span>
                </div>
                <button 
                  onClick={handleOrderNow}
                  disabled={isAddToCartDisabled}
                  className="w-full py-5 bg-[#FF6A00] text-white rounded-2xl font-bold text-lg shadow-xl shadow-[#FF6A00]/20 hover:bg-[#FF6A00]/90 transition-all flex items-center justify-center gap-3 disabled:opacity-50 disabled:grayscale"
                >
                  <ShoppingCart size={22} />
                  Proceed to Checkout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description & Specs */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 pt-12 border-t border-gray-100">
        <div className="lg:col-span-2 space-y-12">
          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#222] mb-[12px]">Product Description</h2>
            <div className="text-[15px] leading-[24px] text-[#444] space-y-4">
              <p>{product.description}</p>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6A00] mt-1">•</span>
                  Premium quality materials
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6A00] mt-1">•</span>
                  Stylish and modern design
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6A00] mt-1">•</span>
                  Comfortable for daily use
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6A00] mt-1">•</span>
                  Lightweight and durable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#FF6A00] mt-1">•</span>
                  Ideal for travel and everyday carry
                </li>
              </ul>
            </div>
          </section>

          <section className="space-y-4">
            <h2 className="text-[20px] font-bold text-[#222]">Specifications</h2>
            <div className="border border-gray-100 rounded-xl overflow-hidden">
              {[
                { label: 'Brand', value: product.brand || 'TAZU MART BD' },
                { label: 'Category', value: product.category },
                { label: 'Material', value: 'Premium Fabric' },
                { label: 'Weight', value: '450g' },
                { label: 'Warranty', value: '1 Year' },
              ].map((spec, i) => (
                <div 
                  key={spec.label} 
                  className={`flex items-center p-[12px] text-[15px] ${i !== 4 ? 'border-bottom border-gray-100' : ''}`}
                  style={{ borderBottom: i !== 4 ? '1px solid #eee' : 'none' }}
                >
                  <span className="w-1/3 font-semibold text-[#333]">{spec.label}</span>
                  <span className="w-2/3 font-medium text-[#555]">: {spec.value}</span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Sidebar / Reviews Summary */}
        <div className="space-y-8">
          <div className="p-6 bg-gray-50 border border-gray-100 rounded-[24px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg text-[#111111]">Customer Reviews</h3>
              <button 
                onClick={() => setIsReviewModalOpen(true)}
                className="text-sm font-bold text-[#FF6A00] hover:underline"
              >
                Write Review
              </button>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-4xl font-bold text-[#111111]">{averageRating}</div>
              <div className="space-y-1">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} fill={i < Math.floor(Number(averageRating)) ? "currentColor" : "none"} />
                  ))}
                </div>
                <div className="text-xs text-gray-500">Based on {reviews.length} reviews</div>
              </div>
            </div>
            <div className="space-y-4">
              {reviews.slice(0, 2).map((review) => (
                <div key={review.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold">{review.customerName}</span>
                    <div className="flex text-yellow-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={10} fill={i < review.rating ? "currentColor" : "none"} />
                      ))}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2 italic">"{review.comment}"</p>
                </div>
              ))}
              {reviews.length > 2 && (
                <button 
                  onClick={() => setShowAllReviews(true)}
                  className="w-full py-2 text-sm font-bold text-gray-500 hover:text-[#FF6A00] transition-colors"
                >
                  View All {reviews.length} Reviews
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      <AnimatePresence>
        {isShareModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsShareModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-sm bg-white rounded-[32px] p-8 shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-[#111111]">Share Product</h3>
                <button onClick={() => setIsShareModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                  <X size={20} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button 
                  onClick={() => handleShare('whatsapp')}
                  className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center gap-2 hover:bg-gray-100 transition-all"
                >
                  <div className="w-10 h-10 bg-[#25D366]/10 text-[#25D366] rounded-full flex items-center justify-center">
                    <MessageCircle size={20} />
                  </div>
                  <span className="text-xs font-bold">WhatsApp</span>
                </button>
                <button 
                  onClick={() => handleShare('messenger')}
                  className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center gap-2 hover:bg-gray-100 transition-all"
                >
                  <div className="w-10 h-10 bg-[#0084FF]/10 text-[#0084FF] rounded-full flex items-center justify-center">
                    <Facebook size={20} />
                  </div>
                  <span className="text-xs font-bold">Messenger</span>
                </button>
                <button 
                  onClick={() => handleShare('copy')}
                  className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center gap-2 hover:bg-gray-100 transition-all"
                >
                  <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center">
                    <Copy size={20} />
                  </div>
                  <span className="text-xs font-bold">Copy Link</span>
                </button>
                <button 
                  onClick={() => handleShare('native')}
                  className="p-4 bg-gray-50 border border-gray-100 rounded-2xl flex flex-col items-center gap-2 hover:bg-gray-100 transition-all"
                >
                  <div className="w-10 h-10 bg-emerald-500/10 text-emerald-400 rounded-full flex items-center justify-center">
                    <Send size={20} />
                  </div>
                  <span className="text-xs font-bold">More</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Review Modal */}
      <AnimatePresence>
        {isReviewModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsReviewModalOpen(false)}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg bg-white rounded-[32px] p-8 shadow-2xl space-y-8"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-bold text-[#111111]">Write a Review</h3>
                <button 
                  onClick={() => setIsReviewModalOpen(false)}
                  className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Your Name</label>
                  <input 
                    type="text" 
                    placeholder="Enter your name"
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-[#FF6A00] transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Rating</label>
                  <div className="flex gap-2 px-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button 
                        key={star}
                        type="button"
                        className="text-gray-300 hover:text-yellow-400 transition-colors"
                      >
                        <Star size={32} />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-widest px-2">Your Comment</label>
                  <textarea 
                    rows={4}
                    placeholder="Share your experience..."
                    className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-4 outline-none focus:border-[#FF6A00] transition-all resize-none"
                  />
                </div>

                <button 
                  type="button"
                  onClick={() => setIsReviewModalOpen(false)}
                  className="w-full py-4 bg-[#FF6A00] text-white rounded-2xl font-bold shadow-xl shadow-[#FF6A00]/20 hover:bg-[#FF6A00]/90 transition-all"
                >
                  Submit Review
                </button>
                <p className="text-[10px] text-center text-gray-400 font-medium">
                  Your review will be reviewed by our team before being published.
                </p>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Related Products Section */}
      {relatedProducts.length > 0 && (
        <section className="pt-12 border-t border-gray-100 pb-12">
          <div className="flex items-center justify-between mb-8">
            <div className="space-y-1">
              <h2 className="text-[22px] font-black text-[#111111] uppercase tracking-tighter">You May Also Like</h2>
              <div className="w-12 h-1 bg-[#FF6A00] rounded-full" />
            </div>
            <button 
              onClick={() => setCurrentView?.('home')}
              className="flex items-center gap-1 text-sm font-bold text-[#FF6A00] hover:gap-2 transition-all"
            >
              View All <ChevronRight size={16} />
            </button>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard 
                key={p.id} 
                product={p} 
                onAddToCart={onAddToCart}
                onProductClick={(prod) => onProductClick?.(prod)}
                onToggleWishlist={onToggleWishlist}
                isWishlisted={false}
              />
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
