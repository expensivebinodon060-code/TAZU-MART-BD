import { motion, AnimatePresence } from 'motion/react';
import { 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  ShoppingBag,
  ShieldCheck,
  Truck,
  Coins,
  Gift
} from 'lucide-react';
import { CartItem } from '../types';

interface CartProps {
  items: CartItem[];
  onRemove: (id: string) => void;
  onUpdateQty: (id: string, delta: number) => void;
  onCheckout: () => void;
  onGoShopping: () => void;
}

export default function Cart({ items, onRemove, onUpdateQty, onCheckout, onGoShopping }: CartProps) {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const delivery = subtotal > 0 ? 15 : 0;
  const total = subtotal + delivery;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center space-y-8 max-w-md mx-auto">
        <div className="w-32 h-32 bg-active/5 rounded-full flex items-center justify-center shadow-inner">
          <ShoppingBag size={64} className="text-active/40" />
        </div>
        <div className="space-y-2">
          <h2 className="text-3xl font-bold text-primary tracking-tight">Your cart is empty</h2>
          <p className="text-secondary text-sm leading-relaxed">There are no items in this cart</p>
        </div>
        <button 
          onClick={onGoShopping}
          className="w-full py-4 bg-active text-white rounded-2xl font-bold shadow-xl shadow-active/20 hover:scale-[1.02] active:scale-[0.98] transition-all"
        >
          Go To Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        <h1 className="text-3xl font-bold tracking-tight mb-8">Shopping Cart</h1>
        
        <AnimatePresence mode="popLayout">
          {items.map((item) => (
            <motion.div
              key={item.productId}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="p-4 bg-card border border-white/5 rounded-2xl flex flex-col sm:flex-row items-center gap-6 group"
            >
              <img src={item.image} alt={item.name} className="w-24 h-24 rounded-xl object-cover" />
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-lg">{item.name}</h3>
                <p className="text-secondary text-sm mt-1">{item.variant || 'Standard Edition'}</p>
                <div className="text-active font-bold mt-2">৳{item.price.toLocaleString()}</div>
              </div>

              <div className="flex items-center gap-4">
                <div className="flex items-center bg-bg border border-white/10 rounded-xl p-1">
                  <button 
                    onClick={() => onUpdateQty(item.productId, -1)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-secondary"
                  >
                    <Minus size={16} />
                  </button>
                  <span className="w-8 text-center font-bold">{item.quantity}</span>
                  <button 
                    onClick={() => onUpdateQty(item.productId, 1)}
                    className="p-2 hover:bg-white/5 rounded-lg transition-colors text-secondary"
                  >
                    <Plus size={16} />
                  </button>
                </div>
                <button 
                  onClick={() => onRemove(item.productId)}
                  className="p-3 text-secondary hover:text-red-400 hover:bg-red-400/10 rounded-xl transition-all"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="space-y-6">
        <div className="p-6 bg-card border border-white/5 rounded-2xl sticky top-8">
          <h3 className="font-bold text-xl mb-6">Order Summary</h3>
          
            <div className="space-y-4 mb-8">
            <div className="flex justify-between text-secondary">
              <span>Subtotal</span>
              <span className="text-primary font-medium">৳{subtotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-secondary">
              <span>Delivery</span>
              <span className="text-primary font-medium">৳{delivery.toLocaleString()}</span>
            </div>
            
            {/* Reward & Voucher Options */}
            <div className="py-4 border-y border-white/5 space-y-3">
              <button className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <Coins size={14} className="text-active" />
                  <span>Use Reward Points</span>
                </div>
                <ArrowRight size={14} />
              </button>
              <button className="w-full flex items-center justify-between p-3 bg-white/5 rounded-xl text-xs hover:bg-white/10 transition-all">
                <div className="flex items-center gap-2">
                  <Gift size={14} className="text-active" />
                  <span>Apply Voucher Code</span>
                </div>
                <ArrowRight size={14} />
              </button>
            </div>

            <div className="pt-4 flex justify-between text-xl font-bold">
              <span>Total</span>
              <span className="text-active">৳{total.toLocaleString()}</span>
            </div>
          </div>

          <button 
            onClick={onCheckout}
            className="checkout-btn"
          >
            Proceed to Checkout
          </button>

          <div className="mt-8 space-y-4">
            <div className="flex items-center gap-3 text-xs text-secondary">
              <ShieldCheck size={16} className="text-green-400" />
              Secure SSL Encryption
            </div>
            <div className="flex items-center gap-3 text-xs text-secondary">
              <Truck size={16} className="text-blue-400" />
              Free delivery on orders over $1000
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
