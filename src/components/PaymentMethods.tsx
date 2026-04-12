import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  CreditCard, 
  ChevronLeft, 
  Plus, 
  Trash2, 
  Smartphone, 
  Building2, 
  Banknote,
  CheckCircle2,
  ShieldCheck,
  X
} from 'lucide-react';

interface PaymentMethod {
  id: string;
  type: 'card' | 'mobile' | 'bank' | 'cod';
  provider: string;
  last4?: string;
  expiry?: string;
  number?: string;
  isDefault: boolean;
}

export default function PaymentMethods({ onBack, userId }: { onBack: () => void, userId: string }) {
  const [methods, setMethods] = useState<PaymentMethod[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCard, setNewCard] = useState({ number: '', name: '', expiry: '', cvv: '' });

  useEffect(() => {
    fetchMethods();
  }, [userId]);

  const fetchMethods = async () => {
    try {
      const res = await fetch(`/api/payment-methods/${userId}`);
      const data = await res.json();
      setMethods(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this payment method?')) return;
    try {
      await fetch(`/api/payment-methods/${id}`, { method: 'DELETE' });
      setMethods(prev => prev.filter(m => m.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddCard = async () => {
    try {
      const res = await fetch('/api/payment-methods', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          type: 'card',
          provider: 'Visa', // Simulated
          last4: newCard.number.slice(-4),
          expiry: newCard.expiry,
          isDefault: methods.length === 0
        })
      });
      if (res.ok) {
        setShowAddForm(false);
        setNewCard({ number: '', name: '', expiry: '', cvv: '' });
        fetchMethods();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getIcon = (type: string) => {
    switch(type) {
      case 'card': return CreditCard;
      case 'mobile': return Smartphone;
      case 'bank': return Building2;
      default: return Banknote;
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ChevronLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-active flex items-center gap-2">
                <CreditCard className="text-active" />
                Payment Methods
              </h1>
              <p className="text-secondary text-sm">Manage your saved cards and wallets.</p>
            </div>
          </div>
          <button 
            onClick={() => setShowAddForm(true)}
            className="px-6 py-3 bg-active text-white rounded-2xl font-black text-sm shadow-xl shadow-active/20 hover:scale-[1.02] transition-all flex items-center gap-2"
          >
            <Plus size={18} />
            ADD NEW METHOD
          </button>
        </header>

        {isLoading ? (
          <div className="py-20 text-center text-secondary">Loading payment methods...</div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {methods.map((method) => {
              const Icon = getIcon(method.type);
              return (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`relative p-6 rounded-[32px] border-2 transition-all ${
                    method.isDefault ? 'border-active bg-active/5' : 'border-white/5 bg-white/5'
                  }`}
                >
                  <div className="flex justify-between items-start mb-8">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${method.isDefault ? 'bg-active text-white' : 'bg-white/10 text-secondary'}`}>
                      <Icon size={24} />
                    </div>
                    <div className="flex gap-2">
                      {method.isDefault && (
                        <span className="px-2 py-1 bg-active text-white text-[8px] font-black uppercase rounded-lg">Default</span>
                      )}
                      <button onClick={() => handleDelete(method.id)} className="p-2 text-secondary hover:text-red-500 transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-lg font-black">{method.provider}</h3>
                    <p className="text-secondary font-mono tracking-widest">
                      {method.type === 'card' ? `**** **** **** ${method.last4}` : method.number}
                    </p>
                    {method.expiry && <p className="text-[10px] text-secondary/50 font-bold uppercase">Expires: {method.expiry}</p>}
                  </div>

                  <div className="absolute bottom-6 right-6 opacity-10">
                    <Icon size={64} />
                  </div>
                </motion.div>
              );
            })}

            {/* Simulated COD Option */}
            <div className="p-6 rounded-[32px] border-2 border-white/5 bg-white/5 flex items-center justify-between group cursor-pointer hover:border-white/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-white/10 text-secondary rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Banknote size={24} />
                </div>
                <div>
                  <h3 className="font-bold">Cash on Delivery</h3>
                  <p className="text-[10px] text-secondary uppercase font-bold">Always Available</p>
                </div>
              </div>
              <CheckCircle2 size={20} className="text-green-500" />
            </div>
          </div>
        )}

        {/* Add Card Form Popup */}
        <AnimatePresence>
          {showAddForm && (
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
                className="bg-white text-[#0B1120] w-full max-w-md rounded-[40px] p-8 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black tracking-tighter uppercase">Add New Card</h2>
                  <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>
                
                <div className="space-y-6">
                  {/* Card Preview */}
                  <div className="aspect-[1.6/1] bg-gradient-to-br from-active to-orange-600 rounded-3xl p-6 text-white shadow-xl shadow-active/20 relative overflow-hidden">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                      <div className="flex justify-between items-start">
                        <CreditCard size={32} className="opacity-80" />
                        <span className="text-sm font-black italic">VISA</span>
                      </div>
                      <div className="space-y-4">
                        <p className="text-xl font-mono tracking-[0.2em]">{newCard.number || '**** **** **** ****'}</p>
                        <div className="flex justify-between items-end">
                          <div>
                            <p className="text-[8px] uppercase font-bold opacity-60">Card Holder</p>
                            <p className="text-sm font-bold uppercase">{newCard.name || 'YOUR NAME'}</p>
                          </div>
                          <div>
                            <p className="text-[8px] uppercase font-bold opacity-60">Expires</p>
                            <p className="text-sm font-bold">{newCard.expiry || 'MM/YY'}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
                  </div>

                  <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Card Number</label>
                      <input 
                        type="text" 
                        placeholder="0000 0000 0000 0000"
                        value={newCard.number}
                        onChange={(e) => setNewCard(prev => ({ ...prev, number: e.target.value }))}
                        className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Card Holder Name</label>
                      <input 
                        type="text" 
                        placeholder="JOHN DOE"
                        value={newCard.name}
                        onChange={(e) => setNewCard(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Expiry Date</label>
                        <input 
                          type="text" 
                          placeholder="MM/YY"
                          value={newCard.expiry}
                          onChange={(e) => setNewCard(prev => ({ ...prev, expiry: e.target.value }))}
                          className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">CVV</label>
                        <input 
                          type="password" 
                          placeholder="***"
                          value={newCard.cvv}
                          onChange={(e) => setNewCard(prev => ({ ...prev, cvv: e.target.value }))}
                          className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-green-50 rounded-2xl border border-green-100">
                    <ShieldCheck size={20} className="text-green-500" />
                    <p className="text-[10px] text-green-600 font-bold uppercase">Secure 256-bit SSL Encryption</p>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleAddCard}
                      className="w-full py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                    >
                      SAVE CARD
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
