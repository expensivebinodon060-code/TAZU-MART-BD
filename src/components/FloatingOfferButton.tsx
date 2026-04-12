import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Zap, Gift, Percent, Tag } from 'lucide-react';
import { Offer } from '../types';

export default function FloatingOfferButton() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    fetchOffers();
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (offers.length > 0 ? (prev + 1) % offers.length : 0));
    }, 4000);
    return () => clearInterval(interval);
  }, [offers.length]);

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      setOffers(data.filter((o: Offer) => o.status === 'Active' && o.showOnFloatingButton));
    } catch (error) {
      console.error('Fetch Offers Error:', error);
    }
  };

  const handleOfferClick = async (offer: Offer) => {
    try {
      await fetch(`/api/offers/${offer.id}/click`, { method: 'POST' });
      if (offer.link) {
        window.location.href = offer.link;
      }
    } catch (error) {
      console.error('Offer Click Error:', error);
    }
  };

  useEffect(() => {
    if (offers[currentIndex]) {
      fetch(`/api/offers/${offers[currentIndex].id}/view`, { method: 'POST' });
    }
  }, [currentIndex, offers]);

  if (offers.length === 0) return null;

  const currentOffer = offers[currentIndex];

  return (
    <div className="fixed bottom-24 left-6 z-[9998] md:bottom-8 md:left-8">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentOffer.id}
          initial={{ scale: 0, rotate: -180, opacity: 0 }}
          animate={{ scale: 1, rotate: 0, opacity: 1 }}
          exit={{ scale: 0, rotate: 180, opacity: 0 }}
          whileHover={{ scale: 1.1 }}
          className="relative group cursor-pointer"
          onClick={() => handleOfferClick(currentOffer)}
        >
          {/* Glow Effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ repeat: Infinity, duration: 2 }}
            className="absolute inset-0 bg-active rounded-full blur-xl"
          />

          {/* Main Button */}
          <div className="relative w-16 h-16 md:w-20 md:h-20 bg-white rounded-full p-1 shadow-2xl border-2 border-active overflow-hidden flex items-center justify-center">
            {currentOffer.image ? (
              <img 
                src={currentOffer.image} 
                alt={currentOffer.name} 
                className="w-full h-full object-cover rounded-full"
                referrerPolicy="no-referrer"
              />
            ) : (
              <div className="w-full h-full bg-active/10 flex items-center justify-center text-active">
                <Zap size={32} />
              </div>
            )}

            {/* Bounce Animation Overlay */}
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
            >
              <div className="bg-active/80 text-white text-[8px] md:text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-lg">
                {currentOffer.type}
              </div>
            </motion.div>
          </div>

          {/* Label Tooltip */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileHover={{ opacity: 1, x: 0 }}
            className="absolute left-full ml-4 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-4 py-2 rounded-xl whitespace-nowrap hidden md:block"
          >
            <p className="text-xs font-bold">{currentOffer.name}</p>
            {currentOffer.discountValue && (
              <p className="text-[10px] text-active font-black">
                {currentOffer.discountType === 'Percentage' ? `${currentOffer.discountValue}% OFF` : `৳${currentOffer.discountValue} OFF`}
              </p>
            )}
          </motion.div>

          {/* Sparkles */}
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            className="absolute -top-2 -right-2 text-yellow-400"
          >
            <Sparkles size={20} />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
