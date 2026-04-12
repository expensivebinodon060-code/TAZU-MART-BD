import React from 'react';
import { ArrowLeft, Lock, Smartphone, Shield, LogOut, ChevronRight, Globe, Facebook } from 'lucide-react';

interface SecuritySettingsProps {
  user: any;
  onBack: () => void;
  onLogout: () => void;
}

export default function SecuritySettings({ user, onBack, onLogout }: SecuritySettingsProps) {
  const securityItems = [
    ...(user?.provider === 'manual' ? [{ id: 'password', label: 'Change Password', icon: Lock, color: 'text-blue-500', bg: 'bg-blue-50' }] : []),
    { id: 'devices', label: 'Login Activity', icon: Smartphone, color: 'text-purple-500', bg: 'bg-purple-50' },
  ];

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">Security</h1>
      </div>

      <div className="p-4 space-y-6">
        {/* Security Options */}
        <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50">
          {securityItems.map((item, idx) => (
            <button 
              key={item.id}
              className={`w-full p-5 flex items-center justify-between hover:bg-gray-50 transition-colors ${idx !== securityItems.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 ${item.bg} ${item.color} rounded-xl flex items-center justify-center`}>
                  <item.icon size={20} />
                </div>
                <h3 className="text-sm font-bold text-primary">{item.label}</h3>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </button>
          ))}
        </div>

        {/* Connected Accounts */}
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-widest ml-2">Connected Accounts</h2>
          <div className="bg-white rounded-[32px] overflow-hidden shadow-sm border border-gray-50">
            <div className="p-5 flex items-center justify-between border-b border-gray-50">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center">
                  <Globe size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary">Google</h3>
                  <p className="text-[10px] text-secondary">{user?.provider === 'google' ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              {user?.provider === 'google' && <span className="text-[10px] font-bold text-green-500">Connected</span>}
            </div>
            <div className="p-5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <Facebook size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-primary">Facebook</h3>
                  <p className="text-[10px] text-secondary">{user?.provider === 'facebook' ? 'Connected' : 'Not connected'}</p>
                </div>
              </div>
              {user?.provider === 'facebook' && <span className="text-[10px] font-bold text-green-500">Connected</span>}
            </div>
          </div>
        </div>

        {/* Logout */}
        <button 
          onClick={onLogout}
          className="w-full p-5 bg-white rounded-[32px] flex items-center justify-center gap-3 text-red-500 font-bold shadow-sm border border-gray-50 hover:bg-red-50 transition-colors"
        >
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
}
