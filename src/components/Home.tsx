import React, { useState, useEffect, useRef, FormEvent, ChangeEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ShoppingCart, ArrowRight, Star, Zap, ShieldCheck, Truck, Eye, Camera, Mic, Search, X, Gamepad2, ShoppingBag, MapPin, Users } from 'lucide-react';
import { Product, Category, HomepageBanner, PromotionBanner, HomepageVisibility, Offer } from '../types';
import { MOCK_PRODUCTS, MOCK_CATEGORIES, MOCK_HOMEPAGE_BANNERS, MOCK_PROMOTION_BANNERS, MOCK_HOMEPAGE_VISIBILITY, MOCK_REVIEWS, MOCK_OFFERS } from '../mockData';
import ProductCard from './ProductCard';

interface HomeProps {
  products: Product[];
  categories: Category[];
  onAddToCart: (product: Product) => void;
  setCurrentView: (view: any) => void;
  onProductClick: (product: Product) => void;
  onCategoryClick: (category: Category) => void;
  onToggleWishlist: (product: Product) => void;
  wishlist: Product[];
}

export default function Home({ 
  products,
  categories: allCategories,
  onAddToCart, 
  setCurrentView, 
  onProductClick, 
  onCategoryClick,
  onToggleWishlist,
  wishlist
}: HomeProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [visibility, setVisibility] = useState<HomepageVisibility>(MOCK_HOMEPAGE_VISIBILITY);
  const [banners, setBanners] = useState<HomepageBanner[]>([]);
  const [promoBanners, setPromoBanners] = useState<PromotionBanner[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const categoryScrollRef = useRef<HTMLDivElement>(null);

  // Filtered categories based on visibility
  const categories = allCategories.filter(c => c.isVisible).sort((a, b) => (a.order || 0) - (b.order || 0));

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersRes, visibilityRes, bannersRes, promoBannersRes] = await Promise.all([
          fetch('/api/offers'),
          fetch('/api/homepage/visibility'),
          fetch('/api/banners'),
          fetch('/api/banners/promotional')
        ]);

        if (offersRes.ok) setOffers(await offersRes.json());
        if (visibilityRes.ok) setVisibility(await visibilityRes.json());
        if (bannersRes.ok) setBanners(await bannersRes.json());
        if (promoBannersRes.ok) setPromoBanners(await promoBannersRes.json());
      } catch (error) {
        console.error('Error fetching home data:', error);
      }
    };
    fetchData();
  }, []);

  const bannerOffers = offers.filter(o => o.status === 'Active' && o.showOnBanner).sort((a, b) => b.priority - a.priority);
  const homepageOffers = offers.filter(o => o.status === 'Active' && o.showOnHomepage).sort((a, b) => b.priority - a.priority);

  // Helper to get active offer for a product
  const getProductWithOffer = (product: Product) => {
    const activeOffer = offers.find(o => 
      o.status === 'Active' && 
      o.productIds.includes(product.id) &&
      new Date(o.startDate) <= new Date() &&
      new Date(o.endDate) >= new Date()
    );
    return { ...product, activeOffer };
  };

  const productsWithOffers = products.map(getProductWithOffer);

  // Combine static banners with offer banners
  const allBanners = [
    ...banners.map(b => ({ id: b.id, image: b.image, title: b.title, subtitle: b.subtitle, buttonText: b.buttonText, link: b.link })),
    ...bannerOffers.map(o => ({ id: o.id, image: o.image, title: o.name, subtitle: `${o.type} - ${o.discountValue}${o.discountType === 'percentage' ? '%' : '৳'} OFF`, buttonText: 'Grab Now', link: o.link }))
  ];

  useEffect(() => {
    if (allBanners.length > 0) {
      const timer = setInterval(() => {
        setCurrentSlide((prev) => (prev + 1) % allBanners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [allBanners.length]);

  // Auto-scroll for categories
  useEffect(() => {
    if (categories.length > 0 && categoryScrollRef.current) {
      const scrollContainer = categoryScrollRef.current;
      const timer = setInterval(() => {
        if (scrollContainer) {
          const maxScroll = scrollContainer.scrollWidth - scrollContainer.clientWidth;
          if (scrollContainer.scrollLeft >= maxScroll - 5) {
            scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
          } else {
            scrollContainer.scrollBy({ left: 150, behavior: 'smooth' });
          }
        }
      }, 2000);
      return () => clearInterval(timer);
    }
  }, [categories.length]);

  const handleSearch = (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      // In a real app, navigate to search results
      console.log('Searching for:', searchQuery);
      setCurrentView('featured'); // Placeholder
    }
  };

  const handleVoiceSearch = () => {
    setIsListening(true);
    // Simulate voice recognition
    setTimeout(() => {
      setIsListening(false);
      setSearchQuery('Smart Watch');
    }, 2000);
  };

  const handleImageSearch = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      console.log('Image search with file:', file.name);
      // Simulate image detection
      setSearchQuery('Men\'s Shoes');
    }
  };

  return (
    <div className="space-y-6 pb-32 bg-bg">
      {/* 1. Main Promotional Banner (Slider) & Search Bar */}
      {visibility.mainBanner && allBanners.length > 0 && (
        <section className="px-3 sm:px-4 pt-4 space-y-4">
          {/* Smart Search Bar - Positioned at the top of the banner section */}
          <div className="max-w-4xl mx-auto w-[95%] md:w-full h-[54px] bg-white rounded-2xl shadow-xl shadow-black/5 border border-gray-100 flex items-center px-4 gap-2 group transition-all focus-within:ring-2 ring-active/10">
            <div className="flex-1 flex items-center gap-2">
              <Search size={18} className="text-gray-400 group-focus-within:text-active transition-colors" />
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Type"
                className="flex-1 h-full bg-transparent text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-gray-400 hover:text-active hover:bg-active/5 rounded-xl transition-all"
              >
                <Camera size={20} />
              </button>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleImageSearch} 
                className="hidden" 
                accept="image/*" 
              />
              <button 
                onClick={() => handleSearch()}
                className="flex items-center justify-center w-10 h-10 bg-active text-white rounded-xl shadow-lg shadow-active/20 hover:scale-105 active:scale-95 transition-all"
              >
                <Search size={18} />
              </button>
            </div>
          </div>

          {/* Banner Slider */}
          <div className="relative h-[180px] sm:h-[280px] md:h-[380px] lg:h-[450px] w-full rounded-[20px] overflow-hidden shadow-xl group">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentSlide}
                initial={{ opacity: 0, scale: 1.02 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                className="absolute inset-0 cursor-pointer"
                onClick={() => {
                  if (allBanners[currentSlide].link) {
                    window.location.href = allBanners[currentSlide].link;
                  }
                }}
              >
                <img 
                  src={allBanners[currentSlide].image} 
                  alt={allBanners[currentSlide].title} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                
                {/* Overlay for better text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                
                {/* Content */}
                <div className="absolute inset-0 flex items-center px-6 md:px-16">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="max-w-xl space-y-2 md:space-y-4"
                  >
                    <h2 className="text-white text-xl md:text-4xl font-black uppercase tracking-tight drop-shadow-lg leading-tight">
                      {allBanners[currentSlide].title}
                    </h2>
                    {allBanners[currentSlide].subtitle && (
                      <p className="text-white/90 text-xs md:text-lg font-medium max-w-md drop-shadow-md line-clamp-2">
                        {allBanners[currentSlide].subtitle}
                      </p>
                    )}
                    <button className="mt-2 px-5 md:px-8 py-2 md:py-3 bg-active text-white rounded-xl text-xs md:text-sm font-bold uppercase tracking-wider shadow-lg shadow-active/20 hover:scale-105 transition-all">
                      {allBanners[currentSlide].buttonText || 'Shop Now'}
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Navigation Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-10">
              {allBanners.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentSlide(idx)}
                  className={`h-1.5 transition-all duration-300 rounded-full ${
                    currentSlide === idx ? 'w-6 bg-active' : 'w-1.5 bg-white/50 hover:bg-white'
                  }`}
                />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 2. Top Category Section (Horizontal Scroll) */}
      {visibility.categoryNav && categories.length > 0 && (
        <section className="px-4 max-w-7xl mx-auto overflow-hidden space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg md:text-xl font-black text-gray-900 uppercase tracking-tight">Top Category</h2>
            <button 
              onClick={() => setCurrentView('categories')}
              className="text-xs font-bold text-active uppercase tracking-widest hover:underline"
            >
              View All
            </button>
          </div>
          
          <div 
            ref={categoryScrollRef}
            className="flex overflow-x-auto gap-6 md:gap-8 py-2 pb-4 scrollbar-hide snap-x"
          >
            {categories.map((category) => (
              <motion.button
                key={category.id}
                whileTap={{ scale: 0.95 }}
                onClick={() => onCategoryClick(category)}
                className="flex flex-col items-center gap-3 flex-shrink-0 snap-start group"
              >
                <div className="w-[75px] h-[75px] md:w-[85px] md:h-[85px] bg-white rounded-full shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden group-hover:shadow-md transition-all">
                  <img 
                    src={category.image || `https://picsum.photos/seed/${category.slug}/200/200`} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <div className="flex flex-col items-center gap-0.5">
                  <span className="text-[10px] md:text-xs font-bold text-gray-800 uppercase tracking-tight text-center whitespace-nowrap group-hover:text-active transition-colors">
                    {category.name}
                  </span>
                  {category.startingPrice && (
                    <span className="text-[8px] md:text-[9px] font-medium text-gray-500">
                      {category.startingPrice}
                    </span>
                  )}
                </div>
              </motion.button>
            ))}
          </div>
        </section>
      )}

      {/* Dynamic Homepage Offers Section */}
      {homepageOffers.length > 0 && (
        <section className="px-4 max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap size={20} className="text-active fill-active" />
              <h3 className="text-lg font-bold text-gray-900 uppercase tracking-tight">Special Offers</h3>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {homepageOffers.map((offer) => (
              <motion.div
                key={offer.id}
                whileHover={{ y: -5 }}
                className="bg-white rounded-[32px] overflow-hidden shadow-lg border border-gray-100 flex flex-col cursor-pointer group"
                onClick={() => offer.link && (window.location.href = offer.link)}
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={offer.image} 
                    alt={offer.name} 
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute top-4 left-4 px-3 py-1 bg-active text-white text-[10px] font-bold rounded-full uppercase tracking-widest shadow-lg">
                    {offer.type}
                  </div>
                  {offer.discountValue && (
                    <div className="absolute bottom-4 right-4 w-12 h-12 bg-white rounded-full flex flex-col items-center justify-center shadow-xl border border-active/20">
                      <span className="text-[10px] font-bold text-active leading-none">-{offer.discountValue}{offer.discountType === 'percentage' ? '%' : '৳'}</span>
                    </div>
                  )}
                </div>
                <div className="p-5 space-y-2">
                  <h4 className="font-bold text-gray-900 line-clamp-1">{offer.name}</h4>
                  <p className="text-xs text-secondary line-clamp-2 leading-relaxed">
                    Exclusive deal available for a limited time. Don't miss out on this amazing opportunity!
                  </p>
                  <div className="pt-2 flex items-center justify-between">
                    <span className="text-[10px] font-bold text-active uppercase tracking-widest">Limited Time</span>
                    <ArrowRight size={16} className="text-active group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Product Promotion Banner Section (Horizontal Swipe Scroll) */}
      {visibility.promotionBanners && promoBanners.length > 0 && (
        <section className="px-4 max-w-7xl mx-auto overflow-hidden">
          <div className="flex overflow-x-auto gap-[15px] p-[10px] snap-x snap-mandatory scrollbar-hide">
            {promoBanners.map((banner) => (
              <motion.div
                key={banner.id}
                whileHover={{ scale: 1.02 }}
                onClick={() => {
                  const cat = categories.find(c => c.id === banner.categoryId);
                  if (cat) onCategoryClick(cat);
                }}
                className="min-w-[260px] h-[150px] rounded-[20px] overflow-hidden relative flex-shrink-0 snap-start cursor-pointer shadow-sm hover:shadow-md transition-all group"
              >
                <img 
                  src={banner.image} 
                  alt={banner.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex flex-col justify-end p-[15px]">
                  <span className="text-white font-bold text-[16px] uppercase tracking-tight">{banner.title}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* 5. Top Ranking Section */}
      <section className="px-4 max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-2 h-8 bg-active rounded-full" />
            <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">TOP RANKING</h2>
          </div>
          <button 
            onClick={() => setCurrentView('top-ranking-products')}
            className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-active transition-colors"
          >
            SEE ALL <ArrowRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {productsWithOffers.filter(p => p.isFeatured).slice(0, 6).map((product, index) => (
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
      </section>

      {/* 6. Category-wise Sections */}
      {visibility.productSections && (
        <div className="space-y-12 px-4 max-w-7xl mx-auto">
          {categories.map((category) => {
            const categoryProducts = productsWithOffers.filter(p => p.categoryId === category.id).slice(0, 8);
            if (categoryProducts.length === 0) return null;

            return (
              <section key={category.id} className="space-y-4">
                {/* Section Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-2 h-8 bg-active rounded-full" />
                    <h2 className="text-xl font-black text-gray-900 uppercase tracking-tight">{category.name}</h2>
                  </div>
                  <button 
                    onClick={() => onCategoryClick(category)}
                    className="text-xs font-bold text-active uppercase tracking-widest flex items-center gap-1 hover:underline"
                  >
                    View All <ArrowRight size={14} />
                  </button>
                </div>

                {/* Category Banner */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="relative w-full aspect-[21/7] md:aspect-[21/5] rounded-2xl overflow-hidden shadow-sm group cursor-pointer"
                  onClick={() => onCategoryClick(category)}
                >
                  <img 
                    src={category.banner || `https://picsum.photos/seed/${category.id}/1200/400`} 
                    alt={category.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                  <div className="absolute inset-0 bg-black/5 group-hover:bg-black/0 transition-colors" />
                </motion.div>
                
                {/* Product Grid (3 Row x 2 Column) */}
                <div className="grid grid-cols-2 gap-3">
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
              </section>
            );
          })}

          {/* Latest Reviews Section */}
          <section className="space-y-6 pt-12 border-t border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-2 h-8 bg-indigo-500 rounded-full" />
                <div>
                  <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Customer Reviews</h2>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">What our community says</p>
                </div>
              </div>
              <button 
                onClick={() => setCurrentView('reviews')}
                className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-2 hover:text-active transition-colors"
              >
                See All <ArrowRight size={14} />
              </button>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {MOCK_REVIEWS.filter(r => r.status === 'Approved').slice(0, 4).map((review) => (
                <motion.div 
                  key={review.id}
                  whileHover={{ y: -2 }}
                  className="bg-white p-3 rounded-2xl border border-gray-100 shadow-sm flex flex-col gap-2 h-full"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-indigo-50 text-indigo-500 rounded-xl flex items-center justify-center font-bold text-xs flex-shrink-0">
                        {review.customerName.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <div className="text-[11px] font-bold text-gray-900 truncate">{review.customerName}</div>
                        <div className="flex items-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={8} className={i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-200"} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                  <p className="text-[10px] text-gray-600 leading-tight italic line-clamp-2">"{review.comment}"</p>
                  <div className="mt-auto pt-2 border-t border-gray-50 flex items-center gap-2">
                    <div className="flex-1 min-w-0">
                      <div className="text-[9px] text-emerald-600 font-bold flex items-center gap-1">
                        <ShieldCheck size={10} />
                        Verified
                      </div>
                    </div>
                    <span className="text-[8px] text-gray-400 font-medium">{new Date(review.date).toLocaleDateString()}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>
        </div>
      )}

      {/* Trust Badges - Horizontal Scrollable Feature Banner */}
      <section className="px-4 max-w-7xl mx-auto overflow-hidden">
        <div className="flex overflow-x-auto gap-4 py-6 scrollbar-hide snap-x snap-mandatory">
          {[
            { icon: Truck, title: 'Free Shipping', desc: 'Free shipping on orders above ৳3000' },
            { icon: ShieldCheck, title: 'Secure Payment', desc: '100% secure checkout' },
            { icon: Zap, title: 'Fast Delivery', desc: 'Delivery within 24–48 hours' },
            { icon: Star, title: 'Premium Quality', desc: 'Certified quality products' },
          ].map((feature, i) => (
            <motion.div 
              key={i} 
              whileTap={{ scale: 0.98 }}
              className="flex-shrink-0 w-[240px] snap-start flex items-center gap-4 p-4 rounded-2xl bg-white shadow-sm border border-gray-50 hover:shadow-md transition-all"
            >
              <div className="w-10 h-10 bg-active/10 rounded-xl flex items-center justify-center text-active flex-shrink-0">
                <feature.icon size={20} />
              </div>
              <div className="flex flex-col text-left">
                <h4 className="font-bold text-xs text-gray-900 uppercase tracking-tight">{feature.title}</h4>
                <p className="text-[10px] text-gray-500 leading-tight font-medium">{feature.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
