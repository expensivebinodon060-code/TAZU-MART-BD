import React from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Coins, History, ShoppingBag, TrendingUp, Info } from 'lucide-react';
import { User, CoinRecord } from '../types';

interface CoinWalletProps {
  user: User | null;
  onBack: () => void;
}

export default function CoinWallet({ user, onBack }: CoinWalletProps) {
  // Mock coin history if not present
  const coinHistory: CoinRecord[] = user?.coinHistory || [
    { id: 'c1', userId: user?.id || '1', orderId: 'ORD-8291', productName: 'Premium Wireless Headphones', coins: 50, date: '2024-02-15', status: 'Earned' },
    { id: 'c2', userId: user?.id || '1', orderId: 'ORD-7742', productName: 'Ultra-wide 4K Monitor', coins: 100, date: '2024-02-18', status: 'Earned' },
    { id: 'c3', userId: user?.id || '1', orderId: 'ORD-9012', productName: 'Minimalist Desk Lamp', coins: 5, date: '2024-02-20', status: 'Earned' },
  ];

  const totalCoins = user?.coins || 155;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight">TAZU MART BD Coins</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
        {/* Balance Card */}
        <section className="bg-active rounded-[2.5rem] p-8 text-white shadow-2xl shadow-active/30 relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="text-center md:text-left">
              <p className="text-white/70 font-bold uppercase tracking-widest text-sm mb-2">Total Coins Earned</p>
              <div className="flex items-center justify-center md:justify-start gap-4">
                <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-md">
                  <Coins size={40} />
                </div>
                <span className="text-7xl font-black tracking-tighter">{totalCoins}</span>
              </div>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
                <TrendingUp size={24} className="mx-auto mb-2" />
                <div className="text-lg font-black">৳{(totalCoins * 0.1).toFixed(2)}</div>
                <div className="text-[10px] font-bold uppercase opacity-70">Value</div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-3xl border border-white/10 text-center min-w-[120px]">
                <ShoppingBag size={24} className="mx-auto mb-2" />
                <div className="text-lg font-black">{coinHistory.length}</div>
                <div className="text-[10px] font-bold uppercase opacity-70">Orders</div>
              </div>
            </div>
          </div>
          
          {/* Decorative Elements */}
          <div className="absolute -right-20 -bottom-20 opacity-10">
            <Coins size={300} />
          </div>
        </section>

        {/* Info Box */}
        <section className="bg-amber-50 border border-amber-100 rounded-3xl p-6 flex gap-4 items-start">
          <div className="w-10 h-10 bg-amber-100 text-amber-600 rounded-xl flex items-center justify-center shrink-0">
            <Info size={20} />
          </div>
          <div>
            <h4 className="font-black text-amber-900 uppercase text-sm tracking-tight">How to use coins?</h4>
            <p className="text-amber-700 text-sm mt-1 leading-relaxed">
              Earn coins by purchasing products. Once your order is <b>Delivered</b>, coins will be automatically added to your wallet. You can use these coins for future discounts and exclusive offers!
            </p>
          </div>
        </section>

        {/* History */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center text-active">
              <History size={20} />
            </div>
            <h2 className="text-2xl font-black uppercase tracking-tight">Coin History</h2>
          </div>

          <div className="bg-white rounded-[2rem] overflow-hidden shadow-sm border border-gray-100">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Date</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest">Order Details</th>
                    <th className="px-6 py-4 text-xs font-black text-gray-400 uppercase tracking-widest text-right">Coins</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {coinHistory.map((record) => (
                    <motion.tr 
                      key={record.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-gray-50/50 transition-colors"
                    >
                      <td className="px-6 py-6">
                        <div className="text-sm font-bold text-gray-900">{record.date}</div>
                        <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">{record.status}</div>
                      </td>
                      <td className="px-6 py-6">
                        <div className="text-sm font-black text-gray-900">{record.productName}</div>
                        <div className="text-xs text-active font-bold">{record.orderId}</div>
                      </td>
                      <td className="px-6 py-6 text-right">
                        <div className="inline-flex items-center gap-1 text-green-600 font-black text-lg">
                          +{record.coins}
                          <Coins size={16} />
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
