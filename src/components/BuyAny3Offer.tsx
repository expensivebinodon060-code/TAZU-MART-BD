import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, 
  ChevronLeft, 
  Check, 
  Plus, 
  ShoppingCart, 
  Sparkles,
  Info
} from 'lucide-react';
import { Product } from '../types';

export default function BuyAny3Offer({ onBack, onAddToCart }: { onBack: () => void, onAddToCart: (product: Product) => void }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showPopup, setShowPopup] = useState(false);

  useEffect(() => {
    // In real app, fetch from /api/admin/products and filter for bundle eligible
    fetch('/api/admin/products')
      .then(res => res.json())
      .then(data => setProducts(data.slice(0, 6))); // Just take first 6 for demo
  }, []);

  const toggleProduct = (id: string) => {
    setSelectedIds(prev => {
      if (prev.includes(id)) {
        return prev.filter(i => i !== id);
      }
      if (prev.length >= 3) return prev;
      const next = [...prev, id];
      if (next.length === 3) {
        setShowPopup(true);
      }
      return next;
    });
  };

  const selectedProducts = products.filter(p => selectedIds.includes(p.id));
  const originalPrice = selectedProducts.reduce((sum, p) => sum + p.price, 0);
  const offerPrice = selectedIds.length === 3 ? Math.floor(originalPrice * 0.85) : originalPrice; // 15% discount for 3
  const savings = originalPrice - offerPrice;

  const handleAddBundle = () => {
    selectedProducts.forEach(p => onAddToCart(p));
    setShowPopup(false);
    setSelectedIds([]);
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-active flex items-center gap-2">
              <ShoppingBag className="text-active" />
              Buy Any 3 Offer
            </h1>
            <p className="text-secondary text-sm">Mix & Match any 3 items to get a special discount!</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Product Grid */}
          <div className="lg:col-span-2 grid grid-cols-2 md:grid-cols-3 gap-4">
            {products.map((product) => (
              <motion.div
                key={product.id}
                whileHover={{ y: -5 }}
                onClick={() => toggleProduct(product.id)}
                className={`relative bg-white/5 border-2 rounded-3xl p-4 cursor-pointer transition-all ${
                  selectedIds.includes(product.id) 
                    ? 'border-active bg-active/5' 
                    : 'border-white/5 hover:border-white/20'
                }`}
              >
                <div className="aspect-square rounded-2xl overflow-hidden mb-4 bg-white/10">
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h3 className="font-bold text-sm line-clamp-1 mb-1">{product.name}</h3>
                <p className="text-active font-black">৳{product.price}</p>
                
                <div className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center border-2 transition-all ${
                  selectedIds.includes(product.id)
                    ? 'bg-active border-active text-white'
                    : 'bg-black/20 border-white/20 text-transparent'
                }`}>
                  <Check size={14} />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white/5 border border-white/10 rounded-[32px] p-6 sticky top-8">
              <h2 className="text-xl font-black mb-6 flex items-center gap-2">
                Bundle Summary
                <span className="px-2 py-0.5 bg-active/10 text-active text-[10px] rounded-full">{selectedIds.length}/3</span>
              </h2>

              <div className="space-y-4 mb-8">
                {selectedIds.length === 0 ? (
                  <div className="py-12 text-center text-secondary">
                    <ShoppingBag size={40} className="mx-auto mb-4 opacity-20" />
                    <p className="text-sm">Select any 3 items to see your savings!</p>
                  </div>
                ) : (
                  selectedProducts.map(p => (
                    <div key={p.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-xl overflow-hidden bg-white/10">
                        <img src={p.image} alt={p.name} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold truncate">{p.name}</p>
                        <p className="text-xs text-secondary">৳{p.price}</p>
                      </div>
                      <button onClick={(e) => { e.stopPropagation(); toggleProduct(p.id); }} className="text-secondary hover:text-red-400">
                        <Plus size={18} className="rotate-45" />
                      </button>
                    </div>
                  ))
                )}
              </div>

              {selectedIds.length > 0 && (
                <div className="border-t border-white/5 pt-6 space-y-3">
                  <div className="flex justify-between text-secondary text-sm">
                    <span>Original Price</span>
                    <span className="line-through">৳{originalPrice}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="font-bold">Offer Price</span>
                    <span className="text-2xl font-black text-active">৳{offerPrice}</span>
                  </div>
                  {savings > 0 && (
                    <div className="bg-green-500/10 text-green-500 p-3 rounded-2xl flex items-center gap-2 text-sm font-bold">
                      <Sparkles size={16} />
                      You saved ৳{savings}!
                    </div>
                  )}
                </div>
              )}

              <button
                disabled={selectedIds.length !== 3}
                onClick={handleAddBundle}
                className={`w-full mt-8 py-4 rounded-2xl font-black text-lg transition-all flex items-center justify-center gap-2 ${
                  selectedIds.length === 3
                    ? 'bg-active text-white shadow-xl shadow-active/30 hover:scale-[1.02]'
                    : 'bg-gray-500 text-white/50 cursor-not-allowed'
                }`}
              >
                <ShoppingCart size={20} />
                ADD BUNDLE TO CART
              </button>
              
              <div className="mt-4 flex items-start gap-2 text-[10px] text-secondary/60">
                <Info size={12} className="mt-0.5 flex-shrink-0" />
                <p>Discount is automatically applied when you select exactly 3 items from this collection.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Success Popup */}
        <AnimatePresence>
          {showPopup && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="bg-white text-[#0B1120] w-full max-w-sm rounded-[40px] p-8 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-green-500" />
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={40} className="text-green-500" />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tighter">🎉 Combo Offer Applied!</h2>
                <p className="text-gray-500 mb-6 font-medium">You saved <span className="text-green-600 font-black">৳{savings}</span> on this bundle.</p>
                
                <div className="flex gap-3">
                  <button 
                    onClick={() => setShowPopup(false)}
                    className="flex-1 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black hover:bg-gray-200 transition-all"
                  >
                    LATER
                  </button>
                  <button 
                    onClick={handleAddBundle}
                    className="flex-2 py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all"
                  >
                    ADD TO CART
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
