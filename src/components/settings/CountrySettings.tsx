import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface CountrySettingsProps {
  onBack: () => void;
}

export default function CountrySettings({ onBack }: CountrySettingsProps) {
  const countries = [
    { id: 'bd', name: 'Bangladesh', currency: 'BDT', flag: '🇧🇩' },
    { id: 'in', name: 'India', currency: 'INR', flag: '🇮🇳' },
    { id: 'pk', name: 'Pakistan', currency: 'PKR', flag: '🇵🇰' },
    { id: 'lk', name: 'Sri Lanka', currency: 'LKR', flag: '🇱🇰' },
    { id: 'np', name: 'Nepal', currency: 'NPR', flag: '🇳🇵' },
  ];

  const currentCountry = 'bd';

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">Country Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="space-y-4">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-widest ml-2">Country Selector</h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50">
            {countries.map((country, idx) => (
              <button 
                key={country.id}
                className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${idx !== countries.length - 1 ? 'border-b border-gray-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <span className="text-2xl">{country.flag}</span>
                  <div className="text-left">
                    <h3 className="text-sm font-bold text-primary">{country.name}</h3>
                  </div>
                </div>
                {country.id === currentCountry && <Check size={20} className="text-active" />}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-4">
          <h2 className="text-xs font-bold text-secondary uppercase tracking-widest ml-2">Currency & Region</h2>
          <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50">
            <div className="p-4 flex items-center justify-between border-b border-gray-50">
              <div className="text-left">
                <h3 className="text-sm font-bold text-primary">Auto Currency</h3>
                <p className="text-[10px] text-secondary">Currency is automatically set to BDT</p>
              </div>
              <span className="text-sm font-bold text-active">BDT (৳)</span>
            </div>
            <div className="p-4 flex items-center justify-between">
              <div className="text-left">
                <h3 className="text-sm font-bold text-primary">Region Preference</h3>
                <p className="text-[10px] text-secondary">Current region: South Asia</p>
              </div>
              <span className="text-sm font-bold text-secondary">Dhaka</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
