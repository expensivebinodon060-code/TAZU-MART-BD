import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Zap, Clock, ArrowRight, Tag, Flame, Gift, Star } from 'lucide-react';
import { Offer, Product } from '../types';

interface OffersProps {
  onAddToCart: (product: Product) => void;
  onProductClick: (product: Product) => void;
  onBack: () => void;
}

const Offers: React.FC<OffersProps> = ({ onAddToCart, onProductClick, onBack }) => {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [offersRes, productsRes] = await Promise.all([
          fetch('/api/offers/active'),
          fetch('/api/products')
        ]);
        
        if (offersRes.ok && productsRes.ok) {
          const offersData = await offersRes.json();
          const productsData = await productsRes.json();
          setOffers(offersData);
          setProducts(productsData);
        }
      } catch (error) {
        console.error('Error fetching offers data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const getOfferProducts = (offer: Offer) => {
    return products.filter(p => offer.productIds.includes(p.id));
  };

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
      <div className="flex items-center gap-2 text-white font-bold">
        <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg min-w-[32px] text-center">
          {(timeLeft.hours ?? 0).toString().padStart(2, '0')}
        </div>
        <span>:</span>
        <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg min-w-[32px] text-center">
          {(timeLeft.minutes ?? 0).toString().padStart(2, '0')}
        </div>
        <span>:</span>
        <div className="bg-black/40 backdrop-blur-sm px-2 py-1 rounded-lg min-w-[32px] text-center">
          {(timeLeft.seconds ?? 0).toString().padStart(2, '0')}
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-active border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8F9FA] pb-24">
      {/* Hero Header */}
      <div className="bg-active pt-12 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 blur-3xl" />
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 blur-3xl" />
        </div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-bold mb-6">
              <Zap size={16} className="fill-white" />
              EXCLUSIVE DEALS & OFFERS
            </div>
            <h1 className="text-4xl md:text-6xl font-black text-white mb-4 tracking-tight">
              SAVE BIG TODAY!
            </h1>
            <p className="text-white/80 text-lg max-w-xl mx-auto font-medium">
              Discover the best deals, flash sales, and exclusive combos curated just for you.
            </p>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-12 relative z-20">
        {offers.length === 0 ? (
          <div className="bg-white rounded-[40px] p-12 text-center shadow-xl border border-gray-100">
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
              <Tag size={40} />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">No Active Offers</h3>
            <p className="text-gray-500 mb-8">Check back later for exciting new deals and promotions.</p>
            <button 
              onClick={onBack}
              className="px-8 py-4 bg-active text-white rounded-2xl font-bold shadow-lg shadow-active/20"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-12">
            {offers.map((offer, index) => {
              const offerProducts = getOfferProducts(offer);
              
              return (
                <motion.section
                  key={offer.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="space-y-6"
                >
                  {/* Offer Banner Card */}
                  <div className="relative h-[200px] md:h-[300px] rounded-[40px] overflow-hidden group shadow-2xl">
                    <img 
                      src={offer.image} 
                      alt={offer.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent flex flex-col justify-center px-8 md:px-12">
                      <div className="flex items-center gap-3 mb-4">
                        <span className="px-3 py-1 bg-active text-white text-[10px] font-black rounded-full uppercase tracking-wider">
                          {offer.type.replace('-', ' ')}
                        </span>
                        {offer.type === 'Flash Sale' && (
                          <CountdownTimer endDate={offer.endDate} />
                        )}
                      </div>
                      <h2 className="text-3xl md:text-5xl font-black text-white mb-2 tracking-tight">
                        {offer.name}
                      </h2>
                      <div className="flex items-center gap-4">
                        <div className="text-active font-black text-2xl md:text-3xl">
                          {offer.discountType === 'Percentage' ? `${offer.discountValue}% OFF` : `৳${offer.discountValue} OFF`}
                        </div>
                        <div className="h-8 w-[1px] bg-white/20" />
                        <p className="text-white/70 text-sm md:text-base font-medium max-w-sm">
                          Limited time offer. Grab your favorites before they're gone!
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Products Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {offerProducts.map(product => {
                      const discountedPrice = offer.discountType === 'Percentage' 
                        ? product.price * (1 - offer.discountValue / 100)
                        : product.price - offer.discountValue;

                      return (
                        <motion.div
                          key={product.id}
                          whileHover={{ y: -5 }}
                          className="bg-white rounded-[32px] p-3 shadow-sm border border-gray-100 group relative overflow-hidden"
                        >
                          {/* Discount Badge */}
                          <div className="absolute top-3 left-3 z-10 bg-active text-white text-[10px] font-black px-2 py-1 rounded-full shadow-lg">
                            {offer.discountType === 'Percentage' ? `-${offer.discountValue}%` : `-৳${offer.discountValue}`}
                          </div>

                          <div 
                            className="aspect-square rounded-2xl overflow-hidden mb-3 cursor-pointer"
                            onClick={() => onProductClick(product)}
                          >
                            <img 
                              src={product.image} 
                              alt={product.name}
                              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                              referrerPolicy="no-referrer"
                            />
                          </div>
                          
                          <div className="space-y-1">
                            <h3 className="text-xs font-bold text-gray-900 line-clamp-1 group-hover:text-active transition-colors">
                              {product.name}
                            </h3>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-black text-active">৳{Math.round(discountedPrice)}</span>
                              <span className="text-[10px] text-gray-400 line-through">৳{product.price}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => onAddToCart(product)}
                            className="w-full mt-3 py-2 bg-gray-50 hover:bg-active hover:text-white text-gray-900 rounded-xl text-[10px] font-bold transition-all flex items-center justify-center gap-2"
                          >
                            ADD TO CART
                          </button>
                        </motion.div>
                      );
                    })}
                  </div>
                </motion.section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default Offers;
