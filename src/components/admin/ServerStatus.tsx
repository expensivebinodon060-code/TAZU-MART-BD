import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { 
  Activity, 
  Cpu, 
  Database, 
  HardDrive, 
  Globe, 
  AlertCircle, 
  CheckCircle2, 
  Clock, 
  RefreshCw, 
  Terminal,
  ExternalLink,
  Shield,
  Zap,
  Server
} from 'lucide-react';

interface ServerMetric {
  uptime: string;
  cpu: number;
  ram: {
    total: string;
    used: string;
    free: string;
    percentage: number;
  };
  disk: {
    total: string;
    used: string;
    free: string;
    percentage: number;
  };
  website: {
    status: number;
    responseTime: number;
    lastChecked: string;
  };
  logs: Array<{
    id: string;
    timestamp: string;
    type: 'Error' | 'Warning' | 'Info';
    message: string;
  }>;
}

export default function ServerStatus() {
  const [metrics, setMetrics] = useState<ServerMetric | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 30000); // Auto refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    // In a real app, this would call a real monitoring API
    // For now, we simulate the data
    setIsLoading(true);
    try {
      // Simulated delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: ServerMetric = {
        uptime: '2 Days 4 Hours 22 Minutes',
        cpu: Math.floor(Math.random() * 40) + 20, // 20-60%
        ram: {
          total: '16 GB',
          used: '6.4 GB',
          free: '9.6 GB',
          percentage: 40
        },
        disk: {
          total: '500 GB',
          used: '120 GB',
          free: '380 GB',
          percentage: 24
        },
        website: {
          status: 200,
          responseTime: 124,
          lastChecked: new Date().toLocaleTimeString()
        },
        logs: [
          { id: '1', timestamp: '2024-05-20 14:22:01', type: 'Error', message: 'Failed to connect to Redis cache' },
          { id: '2', timestamp: '2024-05-20 14:15:44', type: 'Warning', message: 'High memory usage detected on worker node' },
          { id: '3', timestamp: '2024-05-20 13:55:12', type: 'Info', message: 'SSL certificate renewed successfully' },
          { id: '4', timestamp: '2024-05-20 13:40:00', type: 'Error', message: 'Database connection timeout' },
          { id: '5', timestamp: '2024-05-20 13:30:22', type: 'Info', message: 'System backup completed' },
        ]
      };
      
      setMetrics(mockData);
      setLastUpdated(new Date());
    } catch (err) {
      console.error('Failed to fetch server metrics', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!metrics && isLoading) {
    return (
      <div className="p-20 text-center">
        <RefreshCw className="animate-spin text-active mx-auto mb-4" size={48} />
        <p className="text-secondary font-bold">Initializing system monitor...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA]">Server Health Monitor</h2>
          <p className="text-xs text-secondary mt-1">Real-time infrastructure performance and error logs.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-right">
            <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">Last Updated</div>
            <div className="text-xs text-[#EAEAEA] font-mono">{lastUpdated.toLocaleTimeString()}</div>
          </div>
          <button 
            onClick={fetchMetrics}
            className="p-3 bg-white/5 border border-white/10 rounded-2xl text-secondary hover:text-active transition-all"
            title="Force Refresh"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Uptime Card */}
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Server size={80} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/10 text-green-400 rounded-2xl flex items-center justify-center">
              <Zap size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">System Uptime</h3>
              <div className="flex items-center gap-2 mt-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                <span className="text-green-500 text-xs font-bold">Online</span>
              </div>
            </div>
          </div>
          <div className="text-2xl font-bold text-[#EAEAEA]">{metrics?.uptime}</div>
          <p className="text-[10px] text-secondary">Operational since last scheduled maintenance.</p>
        </div>

        {/* Website Status Card */}
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Globe size={80} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">Website Status</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-blue-400 text-xs font-bold">HTTP {metrics?.website.status}</span>
              </div>
            </div>
          </div>
          <div className="flex items-end gap-2">
            <div className="text-3xl font-bold text-[#EAEAEA]">{metrics?.website.responseTime}</div>
            <div className="text-xs text-secondary mb-1.5">ms response</div>
          </div>
          <div className="flex items-center gap-2 text-[10px] text-secondary">
            <Clock size={12} />
            Checked at {metrics?.website.lastChecked}
          </div>
        </div>

        {/* Security Status Card */}
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
            <Shield size={80} />
          </div>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
              <Shield size={24} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-secondary uppercase tracking-widest">Security Layer</h3>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-indigo-400 text-xs font-bold">Protected</span>
              </div>
            </div>
          </div>
          <div className="text-xl font-bold text-[#EAEAEA]">SSL / WAF Active</div>
          <div className="flex gap-2">
            <span className="px-2 py-1 bg-white/5 rounded-lg text-[8px] font-bold text-secondary uppercase tracking-widest border border-white/10">Firewall: ON</span>
            <span className="px-2 py-1 bg-white/5 rounded-lg text-[8px] font-bold text-secondary uppercase tracking-widest border border-white/10">DDoS: Active</span>
          </div>
        </div>
      </div>

      {/* Resource Usage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <section className="p-8 bg-card border border-white/5 rounded-[40px] space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#EAEAEA]">Resource Utilization</h3>
              <div className="flex gap-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-active rounded-full" />
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">CPU</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 bg-purple-500 rounded-full" />
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">RAM</span>
                </div>
              </div>
            </div>

            <div className="space-y-10">
              {/* CPU Usage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-active/10 text-active rounded-lg">
                      <Cpu size={16} />
                    </div>
                    <span className="text-sm font-bold text-[#EAEAEA]">CPU Usage</span>
                  </div>
                  <span className={`text-sm font-bold ${metrics && metrics.cpu > 80 ? 'text-rose-500' : 'text-active'}`}>
                    {metrics?.cpu}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.cpu}%` }}
                    className={`h-full transition-all duration-1000 ${metrics && metrics.cpu > 80 ? 'bg-rose-500' : 'bg-active'}`}
                  />
                </div>
                {metrics && metrics.cpu > 80 && (
                  <div className="flex items-center gap-2 text-rose-500">
                    <AlertCircle size={14} />
                    <span className="text-[10px] font-bold uppercase tracking-widest">High CPU Warning</span>
                  </div>
                )}
              </div>

              {/* RAM Usage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-purple-500/10 text-purple-400 rounded-lg">
                      <Database size={16} />
                    </div>
                    <span className="text-sm font-bold text-[#EAEAEA]">RAM Usage</span>
                  </div>
                  <span className="text-sm font-bold text-purple-400">
                    {metrics?.ram.percentage}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.ram.percentage}%` }}
                    className="h-full bg-purple-500 transition-all duration-1000"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-secondary font-bold uppercase tracking-widest">
                  <span>Used: {metrics?.ram.used}</span>
                  <span>Total: {metrics?.ram.total}</span>
                </div>
              </div>

              {/* Disk Usage */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
                      <HardDrive size={16} />
                    </div>
                    <span className="text-sm font-bold text-[#EAEAEA]">Disk Storage</span>
                  </div>
                  <span className="text-sm font-bold text-emerald-400">
                    {metrics?.disk.percentage}%
                  </span>
                </div>
                <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${metrics?.disk.percentage}%` }}
                    className="h-full bg-emerald-500 transition-all duration-1000"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-secondary font-bold uppercase tracking-widest">
                  <span>Used: {metrics?.disk.used}</span>
                  <span>Total: {metrics?.disk.total}</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        <div className="space-y-8">
          {/* Error Logs Section */}
          <section className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6 h-full">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Terminal className="text-secondary" size={20} />
                <h3 className="text-lg font-bold text-[#EAEAEA]">System Logs</h3>
              </div>
              <button className="text-[10px] font-bold text-active uppercase tracking-widest hover:underline">View All</button>
            </div>

            <div className="space-y-4">
              {metrics?.logs.map((log) => (
                <div key={log.id} className="p-4 bg-white/5 border border-white/5 rounded-2xl space-y-2 group hover:border-white/10 transition-all">
                  <div className="flex items-center justify-between">
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold uppercase tracking-widest ${
                      log.type === 'Error' ? 'bg-rose-500/10 text-rose-500' :
                      log.type === 'Warning' ? 'bg-yellow-500/10 text-yellow-500' :
                      'bg-blue-500/10 text-blue-500'
                    }`}>
                      {log.type}
                    </span>
                    <span className="text-[8px] text-secondary font-mono">{log.timestamp}</span>
                  </div>
                  <p className="text-xs text-secondary leading-relaxed group-hover:text-[#EAEAEA] transition-colors">
                    {log.message}
                  </p>
                </div>
              ))}
            </div>

            <button className="w-full py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-secondary hover:bg-white/10 transition-all flex items-center justify-center gap-2">
              <ExternalLink size={14} />
              Open Full Log Terminal
            </button>
          </section>
        </div>
      </div>
    </div>
  );
}
