import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Coins, History, TrendingUp, ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';
import { SmartRewardPointsRecord, RewardSettings, User } from '../types';

interface RewardDashboardProps {
  user: User | null;
}

const RewardDashboard: React.FC<RewardDashboardProps> = ({ user }) => {
  const [logs, setLogs] = useState<SmartRewardPointsRecord[]>([]);
  const [settings, setSettings] = useState<RewardSettings | null>(null);

  useEffect(() => {
    fetchLogs();
    fetchSettings();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/rewards/logs');
      const data = await res.json();
      if (user) {
        setLogs(data.filter((log: any) => log.userId === user.id));
      }
    } catch (err) {
      console.error('Failed to fetch logs', err);
    }
  };

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/rewards/settings');
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch settings', err);
    }
  };

  if (!user) return <div className="p-8 text-center">Please login to view rewards.</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-8 p-4 md:p-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Smart Reward Points</h1>
          <p className="text-secondary">Earn points on every purchase and redeem for discounts.</p>
        </div>
        <div className="bg-active/5 border border-active/10 p-4 rounded-2xl flex items-center gap-4">
          <div className="w-12 h-12 bg-active text-white rounded-xl flex items-center justify-center shadow-lg shadow-active/20">
            <Coins size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-secondary uppercase tracking-wider">Total Points</div>
            <div className="text-2xl font-bold text-active">{user.rewardPoints.toLocaleString()}</div>
          </div>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Stats & Rules */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
              <TrendingUp size={18} className="text-active" />
              Earning Rules
            </h3>
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-secondary mb-1">Earning Ratio</div>
                <div className="text-sm font-bold text-primary">1 Point per {settings?.pointsPerCurrencyRatio || 100} Currency spent</div>
              </div>
              <div className="p-4 bg-gray-50 rounded-xl border border-gray-100">
                <div className="text-xs text-secondary mb-1">Redemption Value</div>
                <div className="text-sm font-bold text-primary">1 Point = 1 Currency discount</div>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-4">
              <Info size={18} className="text-active" />
              Important Notes
            </h3>
            <ul className="space-y-3 text-xs text-secondary leading-relaxed">
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-active mt-1.5 shrink-0" />
                <span>Points are added only when order status is marked as <strong>Delivered</strong>.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-active mt-1.5 shrink-0" />
                <span>If an order is cancelled or returned, earned points will be deducted.</span>
              </li>
              <li className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-active mt-1.5 shrink-0" />
                <span>Minimum redeem amount is <strong>{settings?.minRedeemAmount || 50} points</strong>.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Right Column: History */}
        <div className="lg:col-span-2">
          <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm h-full">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-6">
              <History size={18} className="text-active" />
              Points History
            </h3>
            <div className="space-y-4">
              {logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 hover:bg-white hover:shadow-md transition-all group">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                        log.pointsAdded > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {log.pointsAdded > 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-primary">{log.reason || log.actionType}</div>
                        <div className="text-[10px] text-secondary">{new Date(log.dateTime).toLocaleString()}</div>
                      </div>
                    </div>
                    <div className={`text-sm font-bold ${
                      log.pointsAdded > 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {log.pointsAdded > 0 ? `+${log.pointsAdded}` : `-${log.pointsDeducted}`}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-12">
                  <Coins size={48} className="mx-auto text-gray-200 mb-4" />
                  <p className="text-secondary">No points history yet. Start shopping to earn points!</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardDashboard;
