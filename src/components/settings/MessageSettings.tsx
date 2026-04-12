import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Bell, Mail, MessageSquare, Phone } from 'lucide-react';
import { UserNotificationSettings } from '../../types';

interface MessageSettingsProps {
  userId: string;
  onBack: () => void;
}

export default function MessageSettings({ userId, onBack }: MessageSettingsProps) {
  const [settings, setSettings] = useState<UserNotificationSettings | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, [userId]);

  const fetchSettings = async () => {
    try {
      const res = await fetch(`/api/settings/notifications/${userId}`);
      const data = await res.json();
      setSettings(data);
    } catch (err) {
      console.error('Failed to fetch notification settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleSetting = async (key: keyof UserNotificationSettings) => {
    if (!settings) return;
    const updated = { ...settings, [key]: !settings[key] };
    setSettings(updated);

    try {
      await fetch('/api/settings/notifications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, [key]: updated[key] }),
      });
    } catch (err) {
      console.error('Failed to update setting', err);
      // Rollback on error
      setSettings(settings);
    }
  };

  if (isLoading || !settings) return <div className="p-8 text-center text-secondary">Loading...</div>;

  const Toggle = ({ active, onToggle }: { active: boolean; onToggle: () => void }) => (
    <button 
      onClick={onToggle}
      className={`w-12 h-6 rounded-full relative transition-all ${active ? 'bg-blue-500' : 'bg-gray-300'}`}
    >
      <motion.div 
        animate={{ x: active ? 26 : 2 }}
        className="absolute top-1 w-4 h-4 rounded-full bg-white shadow-sm"
      />
    </button>
  );

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">Message Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Section 1: APP NOTIFICATION */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-widest ml-2">App Notification</h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50">
            {[
              { key: 'orders', label: 'Order Updates', sub: 'Get the latest status on your order' },
              { key: 'promotions', label: 'Promotional Offers', sub: 'Be the first to find out about our upcoming deals' },
              { key: 'activities', label: 'Push Notification', sub: 'General app notifications and updates' },
            ].map((item, idx, arr) => (
              <div key={item.key} className={`p-4 flex items-center justify-between ${idx !== arr.length - 1 ? 'border-b border-gray-50' : ''}`}>
                <div className="flex-1 pr-4">
                  <h3 className="text-sm font-bold text-primary">{item.label}</h3>
                  <p className="text-[10px] text-secondary leading-relaxed">{item.sub}</p>
                </div>
                <Toggle 
                  active={settings[item.key as keyof UserNotificationSettings] as boolean} 
                  onToggle={() => toggleSetting(item.key as keyof UserNotificationSettings)} 
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
