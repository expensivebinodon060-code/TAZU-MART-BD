import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Users, 
  ChevronLeft, 
  Copy, 
  Share2, 
  TrendingUp, 
  Wallet, 
  History, 
  CheckCircle2,
  ExternalLink,
  MessageCircle,
  Facebook,
  Award,
  ArrowUpRight
} from 'lucide-react';

interface AffiliateData {
  referralCode: string;
  totalEarnings: number;
  totalJoined: number;
  level: number;
}

interface Commission {
  id: string;
  orderId: string;
  amount: number;
  date: string;
}

export default function AffiliateDashboard({ onBack, user }: { onBack: () => void, user: any }) {
  const [data, setData] = useState<AffiliateData | null>(null);
  const [commissions, setCommissions] = useState<Commission[]>([]);
  const [showWithdraw, setShowWithdraw] = useState(false);
  const [withdrawMethod, setWithdrawMethod] = useState<'Bkash' | 'Nagad' | 'Bank'>('Bkash');
  const [withdrawAmount, setWithdrawAmount] = useState('500');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (user) {
      fetch(`/api/affiliate/dashboard/${user.id}`)
        .then(res => res.json())
        .then(resData => {
          setData(resData.affiliate);
          setCommissions(resData.commissions);
        });
    }
  }, [user]);

  const referralLink = `tazumart.com/ref/${data?.referralCode || 'yourname'}`;

  const copyLink = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const [showSuccess, setShowSuccess] = useState(false);

  const handleWithdraw = async () => {
    try {
      const res = await fetch('/api/affiliate/withdraw', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          amount: parseFloat(withdrawAmount),
          method: withdrawMethod
        })
      });
      if (res.ok) {
        setShowWithdraw(false);
        setShowSuccess(true);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const getLevelInfo = (level: number) => {
    switch(level) {
      case 1: return { name: 'Bronze', commission: '5%', color: 'text-orange-400' };
      case 2: return { name: 'Silver', commission: '7%', color: 'text-gray-300' };
      case 3: return { name: 'Gold', commission: '10%', color: 'text-yellow-400' };
      default: return { name: 'Bronze', commission: '5%', color: 'text-orange-400' };
    }
  };

  const levelInfo = getLevelInfo(data?.level || 1);

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-active flex items-center gap-2">
              <Users className="text-active" />
              Affiliate Dashboard
            </h1>
            <p className="text-secondary text-sm">Earn commissions by referring friends to TAZU MART BD.</p>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Stats */}
          <div className="lg:col-span-2 space-y-8">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-active/10 rounded-xl flex items-center justify-center">
                    <Wallet className="text-active" size={20} />
                  </div>
                  <span className="text-[10px] font-black text-active uppercase tracking-widest">Available</span>
                </div>
                <p className="text-secondary text-xs font-bold uppercase mb-1">Total Earnings</p>
                <h2 className="text-3xl font-black">৳{data?.totalEarnings?.toLocaleString() || '0'}</h2>
                <button 
                  onClick={() => setShowWithdraw(true)}
                  className="mt-4 w-full py-2 bg-active text-white rounded-xl text-xs font-black hover:scale-[1.02] transition-all"
                >
                  WITHDRAW FUNDS
                </button>
              </div>

              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 bg-indigo-500/10 rounded-xl flex items-center justify-center">
                    <TrendingUp className="text-indigo-500" size={20} />
                  </div>
                  <span className="text-[10px] font-black text-indigo-500 uppercase tracking-widest">Network</span>
                </div>
                <p className="text-secondary text-xs font-bold uppercase mb-1">Referred Users</p>
                <h2 className="text-3xl font-black">{data?.totalJoined || '0'} <span className="text-sm text-secondary font-medium">People</span></h2>
                <div className="mt-4 flex items-center gap-2 text-[10px] text-indigo-400 font-bold uppercase">
                  <ArrowUpRight size={12} />
                  +3 this week
                </div>
              </div>
            </div>

            {/* Referral Link */}
            <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
              <h3 className="text-lg font-black mb-6 flex items-center gap-2">
                <Share2 size={20} className="text-active" />
                Your Referral Link
              </h3>
              
              <div className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="flex-1 bg-black/20 border border-white/5 rounded-2xl p-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-secondary truncate">{referralLink}</span>
                  <button onClick={copyLink} className="p-2 hover:bg-white/5 rounded-lg transition-colors relative">
                    {copied ? <CheckCircle2 className="text-green-500" size={18} /> : <Copy size={18} />}
                    {copied && <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-500 text-white text-[10px] px-2 py-1 rounded">Copied!</span>}
                  </button>
                </div>
                <div className="flex gap-2">
                  <button className="p-4 bg-[#25D366] text-white rounded-2xl hover:scale-105 transition-all">
                    <MessageCircle size={24} />
                  </button>
                  <button className="p-4 bg-[#1877F2] text-white rounded-2xl hover:scale-105 transition-all">
                    <Facebook size={24} />
                  </button>
                  <button className="p-4 bg-active text-white rounded-2xl hover:scale-105 transition-all">
                    <ExternalLink size={24} />
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-black text-active">5%</div>
                  <div className="text-[10px] text-secondary uppercase font-bold">Commission</div>
                </div>
                <div className="text-center border-x border-white/5">
                  <div className="text-2xl font-black text-active">30</div>
                  <div className="text-[10px] text-secondary uppercase font-bold">Days Cookie</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-black text-active">৳500</div>
                  <div className="text-[10px] text-secondary uppercase font-bold">Min Payout</div>
                </div>
              </div>
            </div>

            {/* Commission History */}
            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="text-lg font-black flex items-center gap-2">
                  <History size={20} className="text-active" />
                  Commission History
                </h3>
                <button className="text-xs font-bold text-active hover:underline">View All</button>
              </div>
              <div className="divide-y divide-white/5">
                {commissions.length === 0 ? (
                  <div className="p-12 text-center text-secondary">No commissions earned yet.</div>
                ) : (
                  commissions.map((comm) => (
                    <div key={comm.id} className="p-4 flex items-center justify-between hover:bg-white/5 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-green-500/10 rounded-xl flex items-center justify-center text-green-500">
                          <TrendingUp size={18} />
                        </div>
                        <div>
                          <p className="text-sm font-bold">Order {comm.orderId}</p>
                          <p className="text-[10px] text-secondary uppercase font-bold">{new Date(comm.date).toLocaleDateString()}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-green-500">+৳{comm.amount}</p>
                        <p className="text-[10px] text-secondary uppercase font-bold">Completed</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* Level Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-gradient-to-br from-active to-orange-600 p-8 rounded-[40px] text-white shadow-xl shadow-active/20 relative overflow-hidden">
              <div className="relative z-10">
                <Award size={48} className="mb-6 opacity-80" />
                <h3 className="text-2xl font-black mb-2 tracking-tighter uppercase">Affiliate Level</h3>
                <div className={`text-4xl font-black mb-4 ${levelInfo.color}`}>{levelInfo.name}</div>
                <div className="h-2 bg-white/20 rounded-full mb-4 overflow-hidden">
                  <div className="h-full bg-white w-1/3" />
                </div>
                <p className="text-xs text-white/70 font-medium">Refer 5 more people to reach <span className="text-white font-bold">Silver Level</span> and earn <span className="text-white font-bold">7% commission</span>!</p>
              </div>
              <div className="absolute -right-10 -bottom-10 opacity-10">
                <Award size={200} />
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
              <h4 className="text-sm font-black mb-4 uppercase tracking-widest">Commission Rates</h4>
              <div className="space-y-4">
                {[
                  { level: 'Level 1', rate: '5%', label: 'Bronze' },
                  { level: 'Level 2', rate: '7%', label: 'Silver' },
                  { level: 'Level 3', rate: '10%', label: 'Gold' },
                ].map((l) => (
                  <div key={l.level} className="flex items-center justify-between p-3 bg-white/5 rounded-xl">
                    <div>
                      <p className="text-xs font-black">{l.level}</p>
                      <p className="text-[10px] text-secondary uppercase font-bold">{l.label}</p>
                    </div>
                    <span className="text-lg font-black text-active">{l.rate}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Withdraw Popup */}
        <AnimatePresence>
          {showWithdraw && (
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
                className="bg-white text-[#0B1120] w-full max-w-sm rounded-[40px] p-8 relative overflow-hidden"
              >
                <h2 className="text-2xl font-black mb-6 tracking-tighter uppercase text-center">Withdraw Request</h2>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Amount (৳)</label>
                    <input 
                      type="number" 
                      value={withdrawAmount}
                      onChange={(e) => setWithdrawAmount(e.target.value)}
                      className="w-full bg-gray-100 border-none rounded-2xl p-4 font-black text-xl outline-none focus:ring-2 ring-active/20"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">Min: ৳500 | Max: ৳10,000</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Payment Method</label>
                    <div className="grid grid-cols-3 gap-2">
                      {['Bkash', 'Nagad', 'Bank'].map((m) => (
                        <button
                          key={m}
                          onClick={() => setWithdrawMethod(m as any)}
                          className={`py-3 rounded-xl text-xs font-bold transition-all border-2 ${
                            withdrawMethod === m 
                              ? 'border-active bg-active/5 text-active' 
                              : 'border-gray-100 text-gray-400 hover:border-gray-200'
                          }`}
                        >
                          {m}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleWithdraw}
                      className="w-full py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                    >
                      SUBMIT REQUEST
                    </button>
                    <button 
                      onClick={() => setShowWithdraw(false)}
                      className="w-full mt-2 py-3 text-gray-400 text-xs font-bold hover:text-gray-600 transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Success Popup */}
        <AnimatePresence>
          {showSuccess && (
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
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase">Withdraw Request</h2>
                <p className="text-gray-500 mb-6 font-medium">Method: <span className="text-active font-black">{withdrawMethod}</span></p>
                
                <p className="text-gray-400 text-xs mb-8 leading-relaxed">
                  Your withdrawal request has been submitted successfully. It will be processed within 24-48 hours.
                </p>

                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all"
                >
                  GOT IT
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
