import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Gift, RotateCw, Trophy, History, Info } from 'lucide-react';
import { LuckyDrawCampaign, LuckyDrawPrize, LuckyDrawLog, User } from '../types';

interface LuckyDrawProps {
  user: User | null;
  onUpdateUser: (user: User) => void;
}

const LuckyDraw: React.FC<LuckyDrawProps> = ({ user, onUpdateUser }) => {
  const [campaign, setCampaign] = useState<LuckyDrawCampaign | null>(null);
  const [logs, setLogs] = useState<LuckyDrawLog[]>([]);
  const [isSpinning, setIsSpinning] = useState(false);
  const [result, setResult] = useState<LuckyDrawPrize | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCampaign();
    fetchLogs();
  }, []);

  const fetchCampaign = async () => {
    try {
      const res = await fetch('/api/campaigns/lucky-draw');
      const data = await res.json();
      setCampaign(data);
    } catch (err) {
      console.error('Failed to fetch campaign', err);
    }
  };

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/campaigns/lucky-draw/logs');
      const data = await res.json();
      setLogs(data);
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  const handleSpin = async () => {
    if (!user) {
      setError('Please login to participate');
      return;
    }
    if (isSpinning) return;

    setIsSpinning(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/campaigns/lucky-draw/spin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.id })
      });

      if (res.ok) {
        const data = await res.json();
        // Simulate spin delay
        setTimeout(() => {
          setIsSpinning(false);
          setResult(data.prize);
          fetchLogs();
          // If prize was points, update user state
          if (data.prize.id === 'priz2') {
            onUpdateUser({ ...user, rewardPoints: user.rewardPoints + 50 });
          }
        }, 2000);
      } else {
        const data = await res.json();
        setError(data.message || 'Failed to spin');
        setIsSpinning(false);
      }
    } catch (err) {
      setError('Network error. Please try again.');
      setIsSpinning(false);
    }
  };

  if (!campaign) return <div className="p-8 text-center">Loading campaign...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 p-4 md:p-8">
      <header className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-primary">{campaign.name}</h1>
        <p className="text-secondary">Spin the wheel and win exciting prizes!</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Spin Wheel Area */}
        <div className="flex flex-col items-center space-y-6">
          <div className="relative w-64 h-64 md:w-80 md:h-80">
            <motion.div
              animate={isSpinning ? { rotate: 360 * 5 } : { rotate: 0 }}
              transition={isSpinning ? { duration: 2, ease: "easeInOut" } : { duration: 0 }}
              className="w-full h-full rounded-full border-8 border-active/20 bg-white shadow-2xl flex items-center justify-center overflow-hidden relative"
            >
              <div className="absolute inset-0 grid grid-cols-2 grid-rows-2">
                <div className="bg-red-50 border border-white/20"></div>
                <div className="bg-blue-50 border border-white/20"></div>
                <div className="bg-green-50 border border-white/20"></div>
                <div className="bg-yellow-50 border border-white/20"></div>
              </div>
              <RotateCw size={48} className={`text-active z-10 ${isSpinning ? 'animate-spin' : ''}`} />
            </motion.div>
            {/* Pointer */}
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-8 bg-active rounded-full shadow-lg z-20"></div>
          </div>

          <button
            onClick={handleSpin}
            disabled={isSpinning || !campaign.isEnabled}
            className={`px-12 py-4 rounded-full font-bold text-lg shadow-xl transition-all ${
              isSpinning || !campaign.isEnabled
                ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                : 'bg-active text-white hover:scale-105 active:scale-95'
            }`}
          >
            {isSpinning ? 'Spinning...' : 'SPIN NOW'}
          </button>

          {error && (
            <p className="text-red-500 text-sm font-medium bg-red-50 px-4 py-2 rounded-lg border border-red-100">
              {error}
            </p>
          )}

          <AnimatePresence>
            {result && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className="bg-green-50 border border-green-200 p-6 rounded-2xl text-center shadow-lg"
              >
                <Trophy className="mx-auto text-yellow-500 mb-2" size={32} />
                <h3 className="text-lg font-bold text-green-800">Congratulations!</h3>
                <p className="text-green-700">You won: <span className="font-bold">{result.name}</span></p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Info & Logs Area */}
        <div className="space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
              <Info size={18} className="text-active" />
              Campaign Rules
            </h3>
            <ul className="space-y-3 text-sm text-secondary">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-active mt-1.5 shrink-0" />
                <span>Daily attempt limit: <strong>{campaign.dailyAttemptLimit}</strong> per user.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-active mt-1.5 shrink-0" />
                <span>Prizes are subject to availability and stock.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-active mt-1.5 shrink-0" />
                <span>Smart Reward Points are added instantly to your account.</span>
              </li>
            </ul>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
              <History size={18} className="text-active" />
              Recent Winners
            </h3>
            <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
              {logs.length > 0 ? (
                logs.slice(0, 10).map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl border border-gray-100">
                    <div>
                      <div className="text-sm font-bold text-primary">{log.userName}</div>
                      <div className="text-[10px] text-secondary">{new Date(log.dateTime).toLocaleString()}</div>
                    </div>
                    <div className="text-xs font-bold text-active bg-active/5 px-2 py-1 rounded-lg">
                      {log.prizeName}
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center text-secondary text-sm py-4">No winners yet. Be the first!</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LuckyDraw;
