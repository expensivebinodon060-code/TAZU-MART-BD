import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Bot, 
  Settings, 
  History, 
  MessageSquare, 
  Save, 
  Power, 
  Clock, 
  AlertCircle,
  RefreshCcw,
  CheckCircle2
} from 'lucide-react';

export default function AIChatControl() {
  const [settings, setSettings] = useState({
    isEnabled: true,
    responseTemplate: "Hello! I'm your TAZU MART BD assistant. How can I help you today?",
    humanTakeoverThreshold: 3,
    deliveryInfo: {
      dhaka: "1-2 days",
      outsideDhaka: "2-4 days"
    }
  });

  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'settings' | 'history' | 'live'>('settings');

  useEffect(() => {
    fetchSettings();
    fetchHistory();
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await fetch('/api/admin/ai-chat/settings');
      const data = await res.json();
      setSettings(data);
    } catch (error) {
      console.error('Fetch Settings Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchHistory = async () => {
    try {
      const res = await fetch('/api/admin/ai-chat/history');
      const data = await res.json();
      setHistory(data);
    } catch (error) {
      console.error('Fetch History Error:', error);
    }
  };

  const handleSaveSettings = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/ai-chat/settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (res.ok) {
        // Show success toast or notification
      }
    } catch (error) {
      console.error('Save Settings Error:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">AI Support System</h1>
          <p className="text-secondary mt-1">Manage your smart AI assistant and customer conversations.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={handleSaveSettings}
            disabled={isSaving}
            className="flex items-center gap-2 px-6 py-3 bg-active hover:bg-active/90 rounded-xl font-bold transition-all shadow-lg shadow-active/20 disabled:opacity-50"
          >
            {isSaving ? <RefreshCcw size={20} className="animate-spin" /> : <Save size={20} />}
            Save Changes
          </button>
        </div>
      </header>

      {/* Tabs */}
      <div className="flex items-center gap-2 p-1 bg-white/5 rounded-2xl w-fit">
        {[
          { id: 'settings', label: 'AI Settings', icon: Settings },
          { id: 'history', label: 'Chat History', icon: History },
          { id: 'live', label: 'Live Conversations', icon: MessageSquare }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-bold transition-all ${
              activeTab === tab.id ? 'bg-active text-white shadow-lg' : 'text-secondary hover:bg-white/5'
            }`}
          >
            <tab.icon size={18} />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {activeTab === 'settings' && (
          <>
            <div className="lg:col-span-2 space-y-6">
              {/* Main Settings */}
              <div className="bg-card border border-white/5 rounded-[32px] p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                      <Power size={24} />
                    </div>
                    <div>
                      <h3 className="font-bold">AI Assistant Status</h3>
                      <p className="text-xs text-secondary mt-0.5">Enable or disable the AI chat widget on your website.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, isEnabled: !settings.isEnabled })}
                    className={`relative w-14 h-8 rounded-full transition-all ${settings.isEnabled ? 'bg-active' : 'bg-white/10'}`}
                  >
                    <div className={`absolute top-1 w-6 h-6 bg-white rounded-full transition-all ${settings.isEnabled ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>

                <div className="space-y-4">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Welcome Message</label>
                  <textarea 
                    value={settings.responseTemplate}
                    onChange={(e) => setSettings({ ...settings, responseTemplate: e.target.value })}
                    className="w-full bg-bg border border-white/10 rounded-2xl p-4 text-sm outline-none focus:border-active transition-all min-h-[100px]"
                    placeholder="Enter welcome message..."
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Delivery (Dhaka)</label>
                    <input 
                      type="text"
                      value={settings.deliveryInfo.dhaka}
                      onChange={(e) => setSettings({ ...settings, deliveryInfo: { ...settings.deliveryInfo, dhaka: e.target.value } })}
                      className="w-full bg-bg border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                    />
                  </div>
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Delivery (Outside Dhaka)</label>
                    <input 
                      type="text"
                      value={settings.deliveryInfo.outsideDhaka}
                      onChange={(e) => setSettings({ ...settings, deliveryInfo: { ...settings.deliveryInfo, outsideDhaka: e.target.value } })}
                      className="w-full bg-bg border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="bg-card border border-white/5 rounded-[32px] p-8 space-y-6">
                <h3 className="font-bold flex items-center gap-2">
                  <Bot size={20} className="text-active" />
                  AI Training Status
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <div className="text-xs font-bold text-secondary">Product Sync</div>
                    <div className="flex items-center gap-1.5 text-green-400 text-xs font-bold">
                      <CheckCircle2 size={14} />
                      Synced
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                    <div className="text-xs font-bold text-secondary">Knowledge Base</div>
                    <div className="text-xs font-bold text-active">98% Complete</div>
                  </div>
                </div>
                <button className="w-full py-3 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-bold transition-all">
                  Retrain AI Model
                </button>
              </div>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-[32px] p-8 space-y-4">
                <div className="flex items-center gap-3 text-orange-500">
                  <AlertCircle size={24} />
                  <h3 className="font-bold">Human Takeover</h3>
                </div>
                <p className="text-xs text-secondary leading-relaxed">
                  If AI fails to answer 3 consecutive questions, it will automatically suggest connecting to a human agent.
                </p>
              </div>
            </div>
          </>
        )}

        {activeTab === 'history' && (
          <div className="lg:col-span-3">
            <div className="bg-card border border-white/5 rounded-[32px] overflow-hidden">
              <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <h3 className="font-bold">Recent Conversations</h3>
                <div className="flex items-center gap-4">
                  <span className="text-xs text-secondary font-bold uppercase tracking-widest">Total: {history.length}</span>
                </div>
              </div>
              <div className="divide-y divide-white/5">
                {history.map((chat) => (
                  <div key={chat.id} className="p-6 hover:bg-white/[0.02] transition-colors">
                    <div className="flex items-start justify-between gap-4 mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-white/5 rounded-lg flex items-center justify-center text-secondary">
                          <Clock size={16} />
                        </div>
                        <div className="text-xs font-bold text-secondary">{new Date(chat.timestamp).toLocaleString()}</div>
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 bg-green-400/10 text-green-400 rounded-full">AI Resolved</span>
                    </div>
                    <div className="space-y-4">
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-active text-white rounded flex items-center justify-center text-[10px] font-bold">U</div>
                        <div className="text-sm text-primary">{chat.userMessage}</div>
                      </div>
                      <div className="flex gap-3">
                        <div className="w-6 h-6 bg-white/5 text-secondary rounded flex items-center justify-center text-[10px] font-bold">AI</div>
                        <div className="text-sm text-secondary italic">{chat.aiResponse}</div>
                      </div>
                    </div>
                  </div>
                ))}
                {history.length === 0 && (
                  <div className="p-12 text-center text-secondary">
                    <MessageSquare size={48} className="mx-auto mb-4 opacity-20" />
                    <p className="font-bold">No chat history yet.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'live' && (
          <div className="lg:col-span-3 p-12 text-center text-secondary bg-card border border-white/5 rounded-[32px]">
            <Bot size={64} className="mx-auto mb-6 text-active animate-pulse" />
            <h3 className="text-xl font-bold text-primary">Live Monitoring Active</h3>
            <p className="max-w-md mx-auto mt-2 leading-relaxed">
              Currently monitoring active sessions. You can take over any conversation if the AI needs help.
            </p>
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="p-6 bg-white/5 rounded-2xl">
                <div className="text-2xl font-bold text-primary">0</div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">Active Chats</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl">
                <div className="text-2xl font-bold text-primary">100%</div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">AI Success Rate</div>
              </div>
              <div className="p-6 bg-white/5 rounded-2xl">
                <div className="text-2xl font-bold text-primary">0s</div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">Avg. Response Time</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
