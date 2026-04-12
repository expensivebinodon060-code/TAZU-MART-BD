import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, Clock } from 'lucide-react';
import { Policy } from '../../types';

interface PoliciesProps {
  onBack: () => void;
}

export default function Policies({ onBack }: PoliciesProps) {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [activeTab, setActiveTab] = useState<'privacy' | 'terms' | 'return' | 'refund'>('privacy');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchPolicies();
  }, []);

  const fetchPolicies = async () => {
    try {
      const res = await fetch('/api/policies');
      const data = await res.json();
      setPolicies(data);
    } catch (err) {
      console.error('Failed to fetch policies', err);
    } finally {
      setIsLoading(false);
    }
  };

  const currentPolicy = policies.find(p => p.policyType === activeTab);

  const tabs = [
    { id: 'privacy', label: 'Privacy' },
    { id: 'terms', label: 'Terms' },
    { id: 'return', label: 'Return' },
    { id: 'refund', label: 'Refund' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-20 border-b border-gray-100">
        <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">Policies</h1>
      </div>

      {/* Tabs */}
      <div className="sticky top-[69px] z-10 bg-white border-b border-gray-100 flex overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex-1 min-w-[100px] px-4 py-4 text-sm font-bold transition-all relative ${activeTab === tab.id ? 'text-active' : 'text-secondary hover:text-primary'}`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div 
                layoutId="activePolicyTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-active rounded-t-full"
              />
            )}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="p-6 pb-20">
        {isLoading ? (
          <div className="space-y-4 animate-pulse">
            <div className="h-8 bg-gray-100 rounded-lg w-1/2" />
            <div className="h-4 bg-gray-100 rounded-lg w-full" />
            <div className="h-4 bg-gray-100 rounded-lg w-full" />
            <div className="h-4 bg-gray-100 rounded-lg w-3/4" />
          </div>
        ) : currentPolicy ? (
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="prose prose-sm max-w-none"
          >
            <div className="flex items-center gap-2 text-secondary text-[10px] mb-6 uppercase tracking-widest font-bold">
              <Clock size={12} />
              Last Updated: {new Date(currentPolicy.lastUpdated).toLocaleDateString()}
            </div>
            <div 
              className="policy-content space-y-6"
              dangerouslySetInnerHTML={{ __html: currentPolicy.contentHtml }} 
            />
          </motion.div>
        ) : (
          <div className="text-center py-20 text-secondary">Policy content not found.</div>
        )}
      </div>

      <style>{`
        .policy-content h2 {
          font-size: 1.125rem;
          font-weight: 800;
          color: #141414;
          margin-top: 2rem;
        }
        .policy-content p {
          color: #666;
          line-height: 1.6;
        }
        .policy-content ul {
          list-style-type: disc;
          padding-left: 1.5rem;
          color: #666;
          space-y: 0.5rem;
        }
        .policy-content strong {
          color: #141414;
        }
      `}</style>
    </div>
  );
}
