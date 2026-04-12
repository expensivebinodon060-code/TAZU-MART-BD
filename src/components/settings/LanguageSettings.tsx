import React from 'react';
import { ArrowLeft, Check } from 'lucide-react';

interface LanguageSettingsProps {
  onBack: () => void;
}

export default function LanguageSettings({ onBack }: LanguageSettingsProps) {
  const languages = [
    { id: 'en', name: 'English', native: 'English' },
    { id: 'bn', name: 'বাংলা', native: 'Bangla' },
  ];

  const currentLang = 'en';

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">Language Settings</h1>
      </div>

      <div className="p-4 space-y-6">
        <div className="bg-white rounded-3xl overflow-hidden shadow-sm border border-gray-50">
          {languages.map((lang, idx) => (
            <button 
              key={lang.id}
              className={`w-full p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${idx !== languages.length - 1 ? 'border-b border-gray-50' : ''}`}
            >
              <div className="text-left">
                <h3 className="text-sm font-bold text-primary">{lang.name}</h3>
                <p className="text-[10px] text-secondary">{lang.native}</p>
              </div>
              {lang.id === currentLang && <Check size={20} className="text-active" />}
            </button>
          ))}
        </div>

        <div className="p-4 bg-purple-50 border border-purple-100 rounded-2xl">
          <p className="text-xs text-purple-600 leading-relaxed">
            Language changes are applied instantly across the entire application without requiring a restart.
          </p>
        </div>
      </div>
    </div>
  );
}
