import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  Activity, 
  Shield, 
  User, 
  Clock, 
  AlertTriangle, 
  CheckCircle2, 
  XCircle, 
  ExternalLink,
  RefreshCw,
  FileSpreadsheet,
  Info,
  Eye,
  ShieldAlert,
  Terminal,
  Database,
  Lock,
  Smartphone,
  Monitor,
  Globe
} from 'lucide-react';
import { AuditLog } from '../../types';

export default function SystemLogs() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  // Filters
  const [search, setSearch] = useState('');
  const [moduleFilter, setModuleFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [riskFilter, setRiskFilter] = useState('All');
  const [limit, setLimit] = useState(20);
  const [offset, setOffset] = useState(0);
  
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);

  const fetchLogs = async () => {
    setIsLoading(true);
    try {
      const params = new URLSearchParams({
        module: moduleFilter,
        status: statusFilter,
        riskLevel: riskFilter,
        search,
        limit: limit.toString(),
        offset: offset.toString()
      });
      
      const res = await fetch(`/api/admin/settings/logs?${params}`);
      if (!res.ok) throw new Error('Failed to fetch logs');
      const data = await res.json();
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      console.error('Error fetching logs:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, [moduleFilter, statusFilter, riskFilter, offset, limit]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setOffset(0);
    fetchLogs();
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const res = await fetch('/api/admin/settings/logs/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `system_logs_${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export logs. Only Super Admins have this permission.');
    } finally {
      setIsExporting(false);
    }
  };

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'text-rose-600 bg-rose-50 border-rose-100';
      case 'Medium': return 'text-amber-600 bg-amber-50 border-amber-100';
      default: return 'text-emerald-600 bg-emerald-50 border-emerald-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Success': return <CheckCircle2 size={14} className="text-emerald-600" />;
      case 'Failed': return <XCircle size={14} className="text-rose-600" />;
      case 'Warning': return <AlertTriangle size={14} className="text-amber-600" />;
      default: return <Info size={14} className="text-muted" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-primary">System Activity Logs</h2>
          <p className="text-sm text-muted">Comprehensive audit trail of all administrative and system events.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={fetchLogs}
            className="p-3 bg-surface border border-border rounded-2xl text-muted hover:text-active transition-all"
            title="Refresh Logs"
          >
            <RefreshCw size={20} className={isLoading ? 'animate-spin' : ''} />
          </button>
          <button 
            onClick={handleExport}
            disabled={isExporting}
            className="px-6 py-3 bg-surface border border-border rounded-2xl text-sm font-bold text-primary hover:bg-hover transition-all flex items-center gap-2"
          >
            {isExporting ? <RefreshCw className="animate-spin" size={18} /> : <FileSpreadsheet size={18} />}
            Export CSV
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="p-6 bg-surface border border-border rounded-[32px] space-y-6 shadow-sm">
        <form onSubmit={handleSearch} className="flex flex-col lg:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input 
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by Log ID, Action, Admin Name or Entity ID..."
              className="w-full bg-hover/30 border border-border rounded-2xl pl-12 pr-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
            />
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <select 
              value={moduleFilter}
              onChange={(e) => setModuleFilter(e.target.value)}
              className="bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all appearance-none min-w-[140px]"
            >
              <option value="All">All Modules</option>
              <option value="Authentication">Authentication</option>
              <option value="Security">Security</option>
              <option value="Products">Products</option>
              <option value="Orders">Orders</option>
              <option value="Settings">Settings</option>
              <option value="Finance">Finance</option>
              <option value="System">System</option>
            </select>
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all appearance-none min-w-[140px]"
            >
              <option value="All">All Status</option>
              <option value="Success">Success</option>
              <option value="Failed">Failed</option>
              <option value="Warning">Warning</option>
            </select>
            <select 
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="bg-hover/30 border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all appearance-none min-w-[140px]"
            >
              <option value="All">All Risk Levels</option>
              <option value="Low">Low Risk</option>
              <option value="Medium">Medium Risk</option>
              <option value="High">High Risk</option>
            </select>
            <button 
              type="submit"
              className="px-6 py-3 bg-active text-white rounded-2xl font-bold text-sm hover:bg-active/90 transition-all shadow-lg shadow-active/20"
            >
              Apply Filters
            </button>
          </div>
        </form>
      </div>

      {/* Logs Table */}
      <div className="bg-surface border border-border rounded-[40px] overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-[10px] font-bold text-muted uppercase tracking-widest border-b border-border bg-hover/30">
                <th className="px-8 py-5">Timestamp</th>
                <th className="px-8 py-5">Log ID</th>
                <th className="px-8 py-5">Module / Action</th>
                <th className="px-8 py-5">Performed By</th>
                <th className="px-8 py-5">Status</th>
                <th className="px-8 py-5">Risk</th>
                <th className="px-8 py-5 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {isLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={7} className="px-8 py-10">
                      <div className="h-4 bg-hover/30 rounded w-full" />
                    </td>
                  </tr>
                ))
              ) : logs.length > 0 ? (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-hover/30 transition-colors group">
                    <td className="px-8 py-5">
                      <div className="text-sm font-medium text-primary">
                        {new Date(log.timestamp).toLocaleDateString()}
                      </div>
                      <div className="text-[10px] text-muted mt-0.5">
                        {new Date(log.timestamp).toLocaleTimeString()}
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className="text-xs font-mono text-muted group-hover:text-active transition-colors">
                        {log.id}
                      </span>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 bg-hover/50 border border-border rounded text-[10px] font-bold text-muted uppercase tracking-tighter">
                          {log.module}
                        </span>
                      </div>
                      <div className="text-sm font-bold text-primary mt-1">{log.action}</div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-active/10 text-active rounded-lg flex items-center justify-center text-xs font-bold">
                          {log.performedBy.name.charAt(0)}
                        </div>
                        <div>
                          <div className="text-sm font-bold text-primary">{log.performedBy.name}</div>
                          <div className="text-[10px] text-muted">{log.performedBy.role}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(log.status)}
                        <span className="text-xs font-medium text-primary">{log.status}</span>
                      </div>
                    </td>
                    <td className="px-8 py-5">
                      <span className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest border ${getRiskColor(log.riskLevel)}`}>
                        {log.riskLevel}
                      </span>
                    </td>
                    <td className="px-8 py-5 text-right">
                      <button 
                        onClick={() => setSelectedLog(log)}
                        className="p-2 hover:bg-hover rounded-xl transition-all text-muted hover:text-active"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="px-8 py-20 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <Terminal size={48} className="text-muted/10" />
                      <p className="text-muted text-sm">No activity logs found matching your criteria.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-6 border-t border-border flex items-center justify-between">
          <div className="text-xs text-muted">
            Showing <span className="text-[#EAEAEA] font-bold">{Math.min(offset + 1, total)}</span> to <span className="text-[#EAEAEA] font-bold">{Math.min(offset + limit, total)}</span> of <span className="text-[#EAEAEA] font-bold">{total}</span> logs
          </div>
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setOffset(Math.max(0, offset - limit))}
              disabled={offset === 0 || isLoading}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-secondary hover:text-active disabled:opacity-50 transition-all"
            >
              <ChevronLeft size={18} />
            </button>
            <button 
              onClick={() => setOffset(offset + limit)}
              disabled={offset + limit >= total || isLoading}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-secondary hover:text-active disabled:opacity-50 transition-all"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Log Detail Modal */}
      <AnimatePresence>
        {selectedLog && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedLog(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-[40px] shadow-2xl overflow-hidden"
            >
              <div className="p-8 border-b border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border ${getRiskColor(selectedLog.riskLevel)}`}>
                    <ShieldAlert size={24} />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#EAEAEA]">Log Details</h3>
                    <p className="text-xs text-secondary font-mono">{selectedLog.id}</p>
                  </div>
                </div>
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="p-2 hover:bg-white/5 rounded-xl text-secondary transition-all"
                >
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[60vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Module</label>
                    <div className="text-sm font-bold text-[#EAEAEA]">{selectedLog.module}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Action</label>
                    <div className="text-sm font-bold text-[#EAEAEA]">{selectedLog.action}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Performed By</label>
                    <div className="text-sm font-bold text-[#EAEAEA]">{selectedLog.performedBy.name} ({selectedLog.performedBy.role})</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Timestamp</label>
                    <div className="text-sm font-bold text-[#EAEAEA]">{new Date(selectedLog.timestamp).toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">IP Address</label>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#EAEAEA]">
                      <Globe size={14} className="text-secondary" />
                      {selectedLog.ip}
                    </div>
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Device / Browser</label>
                    <div className="flex items-center gap-2 text-sm font-bold text-[#EAEAEA]">
                      <Monitor size={14} className="text-secondary" />
                      {selectedLog.device}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="p-6 bg-white/5 border border-white/5 rounded-3xl space-y-4">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-secondary uppercase tracking-widest">
                      <Database size={14} />
                      Data Modification
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-rose-400/70 uppercase tracking-widest">Old Value</label>
                        <pre className="p-4 bg-black/40 rounded-xl text-xs font-mono text-secondary overflow-x-auto">
                          {selectedLog.oldValue ? JSON.stringify(selectedLog.oldValue, null, 2) : 'None'}
                        </pre>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-emerald-400/70 uppercase tracking-widest">New Value</label>
                        <pre className="p-4 bg-black/40 rounded-xl text-xs font-mono text-[#EAEAEA] overflow-x-auto">
                          {selectedLog.newValue ? JSON.stringify(selectedLog.newValue, null, 2) : 'None'}
                        </pre>
                      </div>
                    </div>
                  </div>

                  {selectedLog.entityId && (
                    <div className="flex items-center justify-between p-4 bg-active/5 border border-active/10 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <Info size={16} className="text-active" />
                        <span className="text-xs text-secondary">Affected Entity ID: <span className="text-active font-bold">{selectedLog.entityId}</span></span>
                      </div>
                      <button className="text-[10px] font-bold text-active hover:underline uppercase tracking-widest flex items-center gap-1">
                        View Entity <ExternalLink size={10} />
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedLog(null)}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-[#EAEAEA] hover:bg-white/10 transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
