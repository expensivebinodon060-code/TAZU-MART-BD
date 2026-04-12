import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Coins, 
  Settings, 
  History, 
  TrendingUp, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight, 
  Save, 
  Search,
  Filter,
  BarChart3
} from 'lucide-react';
import { SmartRewardPointsRecord, RewardSettings } from '../types';

const AdminRewardManagement: React.FC = () => {
  const [logs, setLogs] = useState<SmartRewardPointsRecord[]>([]);
  const [settings, setSettings] = useState<RewardSettings | null>(null);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchLogs();
    fetchSettings();
    fetchAnalytics();
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('/api/rewards/logs');
      const data = await res.json();
      setLogs(data);
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

  const fetchAnalytics = async () => {
    try {
      const res = await fetch('/api/rewards/analytics');
      const data = await res.json();
      setAnalytics(data);
    } catch (err) {
      console.error('Failed to fetch analytics', err);
    }
  };

  const handleSaveSettings = async () => {
    if (!settings) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/rewards/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        alert('Settings saved successfully');
      }
    } catch (err) {
      console.error('Failed to save settings', err);
    } finally {
      setIsSaving(false);
    }
  };

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.orderId?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Smart Rewards Management</h1>
          <p className="text-secondary text-sm">Configure reward points and monitor transactions.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-active text-white rounded-xl font-bold shadow-lg shadow-active/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </header>

      {/* Analytics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
            <Coins size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Issued</div>
            <div className="text-xl font-bold text-primary">{analytics?.totalIssued?.toLocaleString() || 0}</div>
          </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-xl flex items-center justify-center">
            <TrendingUp size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Total Redeemed</div>
            <div className="text-xl font-bold text-primary">{analytics?.totalRedeemed?.toLocaleString() || 0}</div>
          </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Active Users</div>
            <div className="text-xl font-bold text-primary">{analytics?.activeUsersWithPoints || 0}</div>
          </div>
        </div>
        <div className="bg-surface border border-border p-6 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-50 text-red-600 rounded-xl flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <div>
            <div className="text-[10px] font-bold text-muted uppercase tracking-wider">Expired Points</div>
            <div className="text-xl font-bold text-primary">{analytics?.expiredPoints || 0}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Settings Panel */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-6">
              <Settings size={18} className="text-active" />
              Reward Settings
            </h3>
            {settings && (
              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">Points per 100 Currency</label>
                  <input 
                    type="number" 
                    value={settings.pointsPerCurrencyRatio}
                    onChange={(e) => setSettings({ ...settings, pointsPerCurrencyRatio: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-hover border border-border rounded-xl text-sm focus:ring-2 focus:ring-active/20 outline-none"
                  />
                  <p className="text-[10px] text-muted">Example: 100 means 1 point per 100 currency spent.</p>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">Min Redemption Points</label>
                  <input 
                    type="number" 
                    value={settings.minRedeemAmount}
                    onChange={(e) => setSettings({ ...settings, minRedeemAmount: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-hover border border-border rounded-xl text-sm focus:ring-2 focus:ring-active/20 outline-none"
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-hover rounded-xl border border-border">
                  <span className="text-sm font-bold text-primary">Enable Rewards</span>
                  <button 
                    onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
                    className={`w-12 h-6 rounded-full transition-all relative ${settings.isEnabled ? 'bg-active' : 'bg-border'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${settings.isEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Transaction History */}
        <div className="lg:col-span-2">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <History size={18} className="text-active" />
                Points Transaction Logs
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input 
                  type="text" 
                  placeholder="Search user or order..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-1.5 bg-hover border border-border rounded-lg text-xs focus:ring-2 focus:ring-active/20 outline-none w-48"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[500px] pr-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-4 bg-hover rounded-xl border border-border hover:bg-surface hover:shadow-md transition-all group">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      log.pointsAdded > 0 ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                    }`}>
                      {log.pointsAdded > 0 ? <ArrowUpRight size={20} /> : <ArrowDownRight size={20} />}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-primary">{log.userName}</div>
                      <div className="text-[10px] text-muted">
                        {log.reason || log.actionType} {log.orderId ? `• Order: ${log.orderId}` : ''}
                      </div>
                      <div className="text-[10px] text-muted">{new Date(log.dateTime).toLocaleString()}</div>
                    </div>
                  </div>
                  <div className={`text-sm font-bold ${
                    log.pointsAdded > 0 ? 'text-green-600' : 'text-rose-500'
                  }`}>
                    {log.pointsAdded > 0 ? `+${log.pointsAdded}` : `-${log.pointsDeducted}`}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminRewardManagement;
