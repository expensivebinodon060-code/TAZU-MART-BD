import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Server, 
  Activity, 
  Cpu, 
  Database, 
  Globe, 
  Shield, 
  Settings, 
  RefreshCw, 
  Power, 
  AlertCircle,
  CheckCircle2,
  Clock,
  HardDrive,
  Network,
  Terminal,
  Zap,
  Lock
} from 'lucide-react';
import { HostingConfig, HostingStats } from '../types';

interface HostingDashboardProps {
  onSetup: () => void;
}

export default function HostingDashboard({ onSetup }: HostingDashboardProps) {
  const [config, setConfig] = useState<HostingConfig | null>(null);
  const [stats, setStats] = useState<HostingStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isActionLoading, setIsActionLoading] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      const [configRes, statsRes] = await Promise.all([
        fetch('/api/admin/hosting/config'),
        fetch('/api/admin/hosting/stats')
      ]);
      const configData = await configRes.json();
      const statsData = await statsRes.json();
      setConfig(configData);
      setStats(statsData);
    } catch (err) {
      console.error('Failed to fetch hosting data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(() => {
      fetch('/api/admin/hosting/stats')
        .then(res => res.json())
        .then(data => setStats(data))
        .catch(err => console.error('Failed to poll stats', err));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleControl = async (action: string, value?: any) => {
    setIsActionLoading(action);
    try {
      const res = await fetch('/api/admin/hosting/control', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action, value })
      });
      if (res.ok) {
        await fetchData();
      }
    } catch (err) {
      console.error(`Failed to trigger ${action}`, err);
    } finally {
      setIsActionLoading(null);
    }
  };

  if (isLoading || !config || !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="animate-spin text-indigo-500" size={32} />
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Online': return 'text-emerald-600 bg-emerald-50 border-emerald-200';
      case 'Maintenance': return 'text-amber-600 bg-amber-50 border-amber-200';
      case 'Offline': return 'text-rose-600 bg-rose-50 border-rose-200';
      default: return 'text-secondary bg-hover border-border';
    }
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-primary tracking-tight">Hosting Environment</h2>
          <p className="text-xs text-muted">Monitor and control your server infrastructure in real-time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={onSetup}
            className="px-4 py-2 bg-hover border border-border rounded-xl text-xs font-bold text-secondary hover:text-primary transition-all flex items-center gap-2"
          >
            <Settings size={14} />
            Setup Configuration
          </button>
          <div className="px-4 py-2 bg-active/10 border border-active/20 rounded-xl flex items-center gap-2">
            <Lock size={14} className="text-active" />
            <span className="text-[10px] font-bold text-active uppercase tracking-widest">Super Admin Access</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Section A: Server Overview */}
        <div className="col-span-8 space-y-6">
          <div className="p-8 bg-surface border border-border rounded-card relative overflow-hidden">
            <div className="absolute top-0 right-0 p-8">
              <div className={`px-4 py-2 rounded-full border flex items-center gap-2 ${getStatusColor(stats.status)}`}>
                <div className={`w-2 h-2 rounded-full animate-pulse ${stats.status === 'Online' ? 'bg-emerald-500' : stats.status === 'Maintenance' ? 'bg-amber-500' : 'bg-rose-500'}`} />
                <span className="text-[10px] font-black uppercase tracking-widest">{stats.status}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
                <Server size={24} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-primary">Server Overview</h3>
                <p className="text-xs text-muted">Auto-detected system data and environment info.</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-8">
              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Server IP Address</label>
                  <p className="text-sm font-mono text-primary">{config.serverIp}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Location</label>
                  <p className="text-sm font-bold text-primary">{stats.location}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Uptime</label>
                  <p className="text-sm font-bold text-primary">{stats.uptime}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Environment Mode</label>
                  <div className="flex items-center gap-2">
                    <div className={`w-1.5 h-1.5 rounded-full ${config.environmentMode === 'Production' ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                    <p className="text-sm font-bold text-primary">{config.environmentMode}</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Runtime</label>
                  <p className="text-sm font-bold text-primary">{config.runtimeType} {config.runtimeVersion}</p>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Last Restart</label>
                  <p className="text-sm font-bold text-primary">{stats.lastRestart}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Database Status</label>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={14} className="text-emerald-500" />
                    <p className="text-sm font-bold text-primary">Connected</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Cache Status</label>
                  <div className="flex items-center gap-2">
                    <Zap size={14} className="text-amber-500" />
                    <p className="text-sm font-bold text-primary">Active (Redis)</p>
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Queue Worker</label>
                  <div className="flex items-center gap-2">
                    <Activity size={14} className="text-active" />
                    <p className="text-sm font-bold text-primary">Running</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section C: Resource Monitoring */}
          <div className="grid grid-cols-2 gap-6">
            <div className="p-6 bg-surface border border-border rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Cpu size={18} className="text-active" />
                  <span className="text-sm font-bold text-primary">CPU Usage</span>
                </div>
                <span className="text-lg font-black text-active">{stats.cpuUsage}%</span>
              </div>
              <div className="h-2 bg-hover rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.cpuUsage}%` }}
                  className="h-full bg-active"
                />
              </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-3xl space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Activity size={18} className="text-emerald-500" />
                  <span className="text-sm font-bold text-primary">RAM Usage</span>
                </div>
                <span className="text-lg font-black text-emerald-500">{stats.ramUsage}%</span>
              </div>
              <div className="h-2 bg-hover rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.ramUsage}%` }}
                  className="h-full bg-emerald-500"
                />
              </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <HardDrive size={18} className="text-amber-500" />
                <span className="text-sm font-bold text-primary">Storage</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black text-primary">{stats.storageUsed}GB</p>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Used of {stats.storageTotal}GB</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-amber-500">{Math.round((stats.storageUsed / stats.storageTotal) * 100)}%</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <Network size={18} className="text-blue-500" />
                <span className="text-sm font-bold text-primary">Bandwidth</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black text-primary">{stats.bandwidthUsage}GB</p>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Monthly Usage</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-blue-500">Normal</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <Database size={18} className="text-rose-500" />
                <span className="text-sm font-bold text-primary">Database Size</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black text-primary">{stats.dbSize}GB</p>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Total DB Storage</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-rose-500">Optimized</p>
                </div>
              </div>
            </div>

            <div className="p-6 bg-surface border border-border rounded-3xl space-y-4">
              <div className="flex items-center gap-3">
                <Terminal size={18} className="text-purple-500" />
                <span className="text-sm font-bold text-primary">Background Jobs</span>
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <p className="text-2xl font-black text-primary">{stats.backgroundJobs}</p>
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Active Workers</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-bold text-purple-500">Healthy</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section B: System Controls */}
        <div className="col-span-4 space-y-6">
          <div className="p-8 bg-surface border border-border rounded-card space-y-8">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                <Settings size={20} />
              </div>
              <h3 className="text-lg font-bold text-primary">System Controls</h3>
            </div>

            <div className="space-y-4">
              <div className="p-4 bg-hover rounded-2xl border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.maintenanceMode ? 'bg-amber-500/10 text-amber-500' : 'bg-hover text-muted'}`}>
                      <AlertCircle size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Maintenance Mode</p>
                      <p className="text-[10px] text-muted">Switch site to maintenance</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleControl('maintenance', !config.maintenanceMode)}
                    disabled={isActionLoading === 'maintenance'}
                    className={`w-12 h-6 rounded-full relative transition-all ${config.maintenanceMode ? 'bg-amber-500' : 'bg-border'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.maintenanceMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="p-4 bg-hover rounded-2xl border border-border space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.debugMode ? 'bg-active/10 text-active' : 'bg-hover text-muted'}`}>
                      <Terminal size={16} />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-primary">Debug Mode</p>
                      <p className="text-[10px] text-muted">Enable verbose logging</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleControl('debug', !config.debugMode)}
                    disabled={isActionLoading === 'debug'}
                    className={`w-12 h-6 rounded-full relative transition-all ${config.debugMode ? 'bg-active' : 'bg-border'}`}
                  >
                    <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${config.debugMode ? 'left-7' : 'left-1'}`} />
                  </button>
                </div>
              </div>

              <div className="pt-4">
                <button 
                  onClick={() => handleControl('restart')}
                  disabled={isActionLoading === 'restart'}
                  className="w-full py-4 bg-active text-white rounded-2xl text-xs font-bold hover:bg-active/90 transition-all shadow-lg shadow-active/20 flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {isActionLoading === 'restart' ? <RefreshCw size={14} className="animate-spin" /> : <RefreshCw size={14} />}
                  Apply Changes & Restart
                </button>
                <p className="text-[10px] text-muted text-center mt-4 px-4 leading-relaxed">
                  Performing a soft restart will clear cache, reload configuration, and restart background workers.
                </p>
              </div>
            </div>
          </div>

          <div className="p-8 bg-active/5 border border-active/10 rounded-card space-y-4">
            <div className="flex items-center gap-3 text-active">
              <Shield size={18} />
              <span className="text-sm font-bold">Security Status</span>
            </div>
            <p className="text-xs text-muted leading-relaxed">
              Your server is currently protected by an active firewall and IP restriction. All administrative actions are being logged.
            </p>
            <div className="flex items-center gap-2 text-[10px] font-bold text-emerald-500 uppercase tracking-widest">
              <CheckCircle2 size={12} />
              System Secure
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
