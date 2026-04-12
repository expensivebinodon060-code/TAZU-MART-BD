import React from 'react';
import { motion } from 'motion/react';
import { 
  ChevronRight, 
  MessageSquare, 
  Globe, 
  Languages, 
  ShieldCheck, 
  HelpCircle, 
  MessageCircle, 
  Lock,
  ArrowLeft
} from 'lucide-react';

interface SettingsProps {
  onBack: () => void;
  onNavigate: (view: string) => void;
}

export default function Settings({ onBack, onNavigate }: SettingsProps) {
  const settingsItems = [
    { id: 'messages', label: 'Messages', subtitle: 'Receive exclusive offers and personal updates', icon: MessageSquare, color: 'text-blue-500' },
    { id: 'country', label: 'Country', subtitle: 'Bangladesh is your current country', icon: Globe, color: 'text-green-500' },
    { id: 'language', label: 'ভাষা - Language', subtitle: 'English', icon: Languages, color: 'text-purple-500' },
    { id: 'policies', label: 'Policies', subtitle: 'Privacy, Terms, Return & Refund', icon: ShieldCheck, color: 'text-indigo-500' },
    { id: 'help', label: 'Help', subtitle: 'FAQ, Live Chat & Support', icon: HelpCircle, color: 'text-orange-500' },
    { id: 'feedback', label: 'Feedback', subtitle: 'Rate App, Report & Suggestions', icon: MessageCircle, color: 'text-pink-500' },
    { id: 'security', label: 'Security', subtitle: 'Password & Account Security', icon: Lock, color: 'text-red-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">Settings</h1>
      </div>

      {/* Settings List */}
      <div className="p-4 space-y-3">
        {settingsItems.map((item) => (
          <motion.button
            key={item.id}
            whileTap={{ scale: 0.98 }}
            onClick={() => onNavigate(item.id)}
            className="w-full bg-white p-4 rounded-2xl flex items-center gap-4 shadow-sm border border-gray-50 hover:border-active/20 transition-all group"
          >
            <div className={`w-12 h-12 rounded-xl bg-gray-50 flex items-center justify-center ${item.color} group-hover:scale-110 transition-transform`}>
              <item.icon size={24} />
            </div>
            <div className="flex-1 text-left">
              <h3 className="font-bold text-primary">{item.label}</h3>
              <p className="text-xs text-secondary">{item.subtitle}</p>
            </div>
            <ChevronRight size={20} className="text-gray-300 group-hover:text-active transition-colors" />
          </motion.button>
        ))}
      </div>

      {/* Version Info */}
      <div className="p-8 text-center">
        <p className="text-xs text-secondary font-medium uppercase tracking-widest">Version 2.4.0 (Final)</p>
        <p className="text-[10px] text-gray-400 mt-1">© 2024 TAZU MART BD. All Rights Reserved.</p>
      </div>
    </div>
  );
}
