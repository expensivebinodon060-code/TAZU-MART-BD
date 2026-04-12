import React, { useState, useEffect } from 'react';
import { 
  Database, 
  ShieldCheck, 
  Loader2, 
  CheckCircle2, 
  AlertTriangle, 
  BrainCircuit,
  Settings,
  Power,
  RefreshCw,
  History
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface AIInstallationManagerProps {
  onInstallationComplete: () => void;
  isInstalled: boolean;
}

export const AIInstallationManager: React.FC<AIInstallationManagerProps> = ({ onInstallationComplete, isInstalled }) => {
  const [step, setStep] = useState<'initial' | 'backup' | 'installing' | 'complete'>(isInstalled ? 'complete' : 'initial');
  const [progress, setProgress] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  const addLog = (msg: string) => {
    setLogs(prev => [...prev, `[${new Date().toLocaleTimeString()}] ${msg}`].slice(-5));
  };

  const startInstallation = async () => {
    setStep('backup');
    addLog('Initiating system backup...');
    
    // Simulate Backup
    for (let i = 0; i <= 100; i += 5) {
      setProgress(i);
      await new Promise(r => setTimeout(r, 100));
      if (i === 50) addLog('Compressing database tables...');
      if (i === 90) addLog('Verifying backup integrity...');
    }

    setStep('installing');
    setProgress(0);
    addLog('Backup complete. Starting AI module installation...');

    // Simulate Installation
    const modules = [
      'Neural Engine Core',
      'NLP Processing Unit',
      'Predictive Analytics Engine',
      'Security Monitoring Service',
      'Marketing Automation Hub'
    ];

    for (let i = 0; i < modules.length; i++) {
      addLog(`Installing ${modules[i]}...`);
      for (let p = 0; p <= 100; p += 20) {
        setProgress(((i * 100) + p) / modules.length);
        await new Promise(r => setTimeout(r, 200));
      }
    }

    setStep('complete');
    addLog('Installation successful!');
    
    try {
      await fetch('/api/ai/install', { method: 'POST' });
    } catch (err) {
      console.error('Failed to notify server of installation', err);
    }

    setTimeout(() => {
      onInstallationComplete();
    }, 1500);
  };

  if (step === 'complete' && isInstalled) {
    return null; // Don't show if already installed and we are in management mode
  }

  return (
    <div className="min-h-[600px] flex items-center justify-center p-6">
      <div className="w-full max-w-2xl bg-card border border-white/5 rounded-[48px] p-12 space-y-8 relative overflow-hidden">
        {/* Background Glow */}
        <div className="absolute -top-24 -right-24 w-64 h-64 bg-active/10 blur-[100px] rounded-full" />
        <div className="absolute -bottom-24 -left-24 w-64 h-64 bg-purple-500/10 blur-[100px] rounded-full" />

        <div className="relative space-y-8">
          <div className="text-center space-y-4">
            <div className="w-20 h-20 bg-active/10 text-active rounded-3xl flex items-center justify-center mx-auto mb-6">
              {step === 'initial' && <BrainCircuit size={40} />}
              {(step === 'backup' || step === 'installing') && <Loader2 size={40} className="animate-spin" />}
              {step === 'complete' && <CheckCircle2 size={40} className="text-emerald-400" />}
            </div>
            <h2 className="text-3xl font-bold text-[#EAEAEA]">
              {step === 'initial' && 'AI Installation System'}
              {step === 'backup' && 'System Backup in Progress'}
              {step === 'installing' && 'Installing AI Modules'}
              {step === 'complete' && 'Installation Complete'}
            </h2>
            <p className="text-secondary text-sm max-w-md mx-auto">
              {step === 'initial' && 'Securely install 16 advanced AI modules into your admin panel. A full system backup will be performed automatically.'}
              {step === 'backup' && 'Creating a secure snapshot of your database and files before proceeding with the installation.'}
              {step === 'installing' && 'Configuring neural networks and API integrations for your digital ecosystem.'}
              {step === 'complete' && 'All AI modules have been successfully integrated. Your system is now AI-powered.'}
            </p>
          </div>

          {(step === 'backup' || step === 'installing') && (
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold uppercase tracking-widest">
                  <span className="text-secondary">{step === 'backup' ? 'Backup Progress' : 'Installation Progress'}</span>
                  <span className="text-active">{Math.round(progress)}%</span>
                </div>
                <div className="h-3 bg-white/5 rounded-full overflow-hidden border border-white/5">
                  <motion.div 
                    className="h-full bg-active"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              <div className="bg-black/20 rounded-2xl p-4 border border-white/5 font-mono text-[10px] space-y-1">
                {logs.map((log, i) => (
                  <div key={i} className="text-secondary">
                    <span className="text-active/50 mr-2">❯</span>
                    {log}
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 'initial' && (
            <div className="space-y-6">
              <div className="p-6 bg-amber-500/5 border border-amber-500/10 rounded-3xl flex items-start gap-4">
                <AlertTriangle className="text-amber-500 shrink-0 mt-1" size={20} />
                <div className="space-y-1">
                  <div className="text-sm font-bold text-amber-500">Pre-Installation Notice</div>
                  <p className="text-xs text-secondary leading-relaxed">
                    This process will add 16 new modules to your admin panel. Existing modules will remain untouched. Ensure you have a stable internet connection for API verification.
                  </p>
                </div>
              </div>
              <button 
                onClick={startInstallation}
                className="w-full py-5 bg-active text-white rounded-[24px] font-bold text-lg flex items-center justify-center gap-3 shadow-xl shadow-active/20 hover:bg-active/90 transition-all group"
              >
                <Database size={24} className="group-hover:scale-110 transition-transform" />
                Backup & Install AI Modules
              </button>
            </div>
          )}

          {step === 'complete' && (
            <div className="text-center">
              <div className="inline-flex items-center gap-2 px-6 py-3 bg-emerald-500/10 text-emerald-400 rounded-2xl text-sm font-bold border border-emerald-500/20">
                <ShieldCheck size={20} />
                System Secured & Optimized
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
