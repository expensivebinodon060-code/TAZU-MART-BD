import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Gift, 
  Settings, 
  History, 
  Plus, 
  Trash2, 
  Save, 
  Search,
  Calendar,
  Trophy,
  Users
} from 'lucide-react';
import { LuckyDrawCampaign, LuckyDrawPrize, LuckyDrawLog } from '../types';

const AdminCampaignManagement: React.FC = () => {
  const [campaign, setCampaign] = useState<LuckyDrawCampaign | null>(null);
  const [logs, setLogs] = useState<LuckyDrawLog[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

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

  const handleSave = async () => {
    if (!campaign) return;
    setIsSaving(true);
    try {
      const res = await fetch('/api/campaigns/lucky-draw/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(campaign)
      });
      if (res.ok) {
        alert('Campaign saved successfully');
      }
    } catch (err) {
      console.error('Failed to save campaign', err);
    } finally {
      setIsSaving(false);
    }
  };

  const addPrize = () => {
    if (!campaign) return;
    const newPrize: LuckyDrawPrize = {
      id: `priz${Date.now()}`,
      name: 'New Prize',
      probability: 0.1,
      stock: 10
    };
    setCampaign({ ...campaign, prizes: [...campaign.prizes, newPrize] });
  };

  const removePrize = (id: string) => {
    if (!campaign) return;
    setCampaign({ ...campaign, prizes: campaign.prizes.filter(p => p.id !== id) });
  };

  const updatePrize = (id: string, updates: Partial<LuckyDrawPrize>) => {
    if (!campaign) return;
    setCampaign({
      ...campaign,
      prizes: campaign.prizes.map(p => p.id === id ? { ...p, ...updates } : p)
    });
  };

  const filteredLogs = logs.filter(log => 
    log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    log.prizeName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 p-6">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Lucky Reward Draw</h1>
          <p className="text-secondary text-sm">Manage lucky draw campaigns and monitor winners.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-2.5 bg-active text-white rounded-xl font-bold shadow-lg shadow-active/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
          >
            <Save size={18} />
            {isSaving ? 'Saving...' : 'Save Campaign'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Campaign Settings */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <h3 className="font-bold text-primary flex items-center gap-2 mb-6">
              <Settings size={18} className="text-active" />
              Campaign Configuration
            </h3>
            {campaign && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">Campaign Name</label>
                  <input 
                    type="text" 
                    value={campaign.name}
                    onChange={(e) => setCampaign({ ...campaign, name: e.target.value })}
                    className="w-full px-4 py-2 bg-hover border border-border rounded-xl text-sm focus:ring-2 focus:ring-active/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">Daily Attempt Limit</label>
                  <input 
                    type="number" 
                    value={campaign.dailyAttemptLimit}
                    onChange={(e) => setCampaign({ ...campaign, dailyAttemptLimit: parseInt(e.target.value) })}
                    className="w-full px-4 py-2 bg-hover border border-border rounded-xl text-sm focus:ring-2 focus:ring-active/20 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">Start Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input 
                      type="date" 
                      value={campaign.startDate.split('T')[0]}
                      onChange={(e) => setCampaign({ ...campaign, startDate: new Date(e.target.value).toISOString() })}
                      className="w-full pl-10 pr-4 py-2 bg-hover border border-border rounded-xl text-sm focus:ring-2 focus:ring-active/20 outline-none"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-muted uppercase tracking-wider">End Date</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={16} />
                    <input 
                      type="date" 
                      value={campaign.endDate.split('T')[0]}
                      onChange={(e) => setCampaign({ ...campaign, endDate: new Date(e.target.value).toISOString() })}
                      className="w-full pl-10 pr-4 py-2 bg-hover border border-border rounded-xl text-sm focus:ring-2 focus:ring-active/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <Trophy size={18} className="text-active" />
                Prize Pool
              </h3>
              <button 
                onClick={addPrize}
                className="flex items-center gap-2 px-4 py-2 bg-active/10 text-active rounded-xl text-xs font-bold hover:bg-active/20 transition-all"
              >
                <Plus size={14} />
                Add Prize
              </button>
            </div>
            <div className="space-y-4">
              {campaign?.prizes.map((prize) => (
                <div key={prize.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-hover rounded-2xl border border-border">
                  <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase">Prize Name</label>
                      <input 
                        type="text" 
                        value={prize.name}
                        onChange={(e) => updatePrize(prize.id, { name: e.target.value })}
                        className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:ring-2 focus:ring-active/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase">Probability (0-1)</label>
                      <input 
                        type="number" 
                        step="0.01"
                        value={prize.probability}
                        onChange={(e) => updatePrize(prize.id, { probability: parseFloat(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:ring-2 focus:ring-active/20 outline-none"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-muted uppercase">Stock</label>
                      <input 
                        type="number" 
                        value={prize.stock}
                        onChange={(e) => updatePrize(prize.id, { stock: parseInt(e.target.value) })}
                        className="w-full px-3 py-1.5 bg-surface border border-border rounded-lg text-xs focus:ring-2 focus:ring-active/20 outline-none"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => removePrize(prize.id)}
                    className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Winners Log */}
        <div className="lg:col-span-1">
          <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm h-full flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h3 className="font-bold text-primary flex items-center gap-2">
                <History size={18} className="text-active" />
                Winners Log
              </h3>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={14} />
                <input 
                  type="text" 
                  placeholder="Search..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8 pr-4 py-1.5 bg-hover border border-border rounded-lg text-xs focus:ring-2 focus:ring-active/20 outline-none w-32"
                />
              </div>
            </div>
            <div className="flex-1 overflow-y-auto space-y-3 max-h-[600px] pr-2">
              {filteredLogs.map((log) => (
                <div key={log.id} className="p-4 bg-hover rounded-xl border border-border hover:bg-surface hover:shadow-md transition-all">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm font-bold text-primary">{log.userName}</div>
                    <div className="text-[10px] text-muted">{new Date(log.dateTime).toLocaleDateString()}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-active/10 text-active rounded-lg flex items-center justify-center">
                      <Trophy size={12} />
                    </div>
                    <div className="text-xs font-bold text-active">{log.prizeName}</div>
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

export default AdminCampaignManagement;
