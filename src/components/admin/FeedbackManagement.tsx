import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Eye, 
  MessageSquare, 
  ChevronRight,
  AlertCircle,
  Lightbulb,
  ExternalLink,
  Image as ImageIcon
} from 'lucide-react';
import { PageErrorReport, CustomerSuggestion } from '../../types';

interface FeedbackManagementProps {
  type: 'suggestions' | 'errors';
}

export default function FeedbackManagement({ type }: FeedbackManagementProps) {
  const [data, setData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedItem, setSelectedItem] = useState<any | null>(null);

  useEffect(() => {
    fetchData();
  }, [type]);

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const endpoint = type === 'suggestions' ? '/api/admin/suggestions' : '/api/admin/error-reports';
      const res = await fetch(endpoint);
      const result = await res.json();
      setData(result);
    } catch (err) {
      console.error('Failed to fetch feedback data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const endpoint = type === 'suggestions' 
        ? `/api/admin/suggestions/${id}/status` 
        : `/api/admin/error-reports/${id}/status`;
      
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });

      if (res.ok) {
        setData(prev => prev.map(item => item.id === id ? { ...item, status } : item));
        if (selectedItem?.id === id) {
          setSelectedItem({ ...selectedItem, status });
        }
      }
    } catch (err) {
      console.error('Failed to update status', err);
    }
  };

  const filteredData = data.filter(item => {
    const matchesSearch = (item.title || item.errorType || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (item.description || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'All' || item.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
      case 'New':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'In Review':
      case 'Under Review':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Resolved':
      case 'Approved':
      case 'Implemented':
        return 'bg-green-500/10 text-green-400 border-green-500/20';
      case 'Rejected':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/20';
      default:
        return 'bg-white/5 text-secondary border-white/10';
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 ${type === 'suggestions' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'} rounded-2xl flex items-center justify-center`}>
            {type === 'suggestions' ? <Lightbulb size={24} /> : <AlertCircle size={24} />}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-[#EAEAEA]">
              {type === 'suggestions' ? 'Customer Suggestions' : 'Page Error Reports'}
            </h2>
            <p className="text-xs text-secondary mt-1">
              Manage and respond to user-submitted {type === 'suggestions' ? 'ideas' : 'bugs'}.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6">
        {[
          { label: 'Total Submissions', value: data.length, icon: MessageSquare, color: 'text-indigo-400' },
          { label: 'Pending/New', value: data.filter(d => d.status === 'Pending' || d.status === 'New').length, icon: Clock, color: 'text-blue-400' },
          { label: 'In Review', value: data.filter(d => d.status === 'In Review' || d.status === 'Under Review').length, icon: Search, color: 'text-amber-400' },
          { label: 'Resolved/Approved', value: data.filter(d => d.status === 'Resolved' || d.status === 'Approved' || d.status === 'Implemented').length, icon: CheckCircle2, color: 'text-green-400' },
        ].map((stat, idx) => (
          <div key={idx} className="p-6 bg-card border border-white/5 rounded-[32px] space-y-2">
            <div className="flex items-center justify-between">
              <stat.icon className={stat.color} size={20} />
              <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">Live</span>
            </div>
            <div className="text-2xl font-black text-[#EAEAEA]">{stat.value}</div>
            <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={`Search ${type}...`}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-active transition-all"
          />
        </div>
        <div className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-2xl px-4">
          <Filter size={16} className="text-secondary" />
          <select 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-transparent text-sm text-secondary outline-none py-2"
          >
            <option value="All">All Status</option>
            {type === 'suggestions' ? (
              <>
                <option value="New">New</option>
                <option value="Under Review">Under Review</option>
                <option value="Approved">Approved</option>
                <option value="Implemented">Implemented</option>
                <option value="Rejected">Rejected</option>
              </>
            ) : (
              <>
                <option value="Pending">Pending</option>
                <option value="In Review">In Review</option>
                <option value="Resolved">Resolved</option>
                <option value="Rejected">Rejected</option>
              </>
            )}
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/5">
              <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Submission</th>
              <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Category/Type</th>
              <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Date</th>
              <th className="px-8 py-6 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
              <th className="px-8 py-6 text-right text-[10px] font-bold text-secondary uppercase tracking-widest">Actions</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-10 h-10 border-4 border-active/20 border-t-active rounded-full animate-spin" />
                    <p className="text-sm text-secondary">Loading feedback data...</p>
                  </div>
                </td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item) => (
                <tr key={item.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="space-y-1 max-w-md">
                      <div className="text-sm font-bold text-[#EAEAEA] truncate">
                        {type === 'suggestions' ? item.title : item.errorType}
                      </div>
                      <p className="text-xs text-secondary line-clamp-1">{item.description}</p>
                    </div>
                  </td>
                  <td className="px-8 py-6">
                    <span className="text-xs text-secondary font-medium">
                      {type === 'suggestions' ? item.category : item.errorType}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="text-xs text-secondary">{new Date(item.createdAt).toLocaleDateString()}</div>
                    <div className="text-[10px] text-secondary/50">{new Date(item.createdAt).toLocaleTimeString()}</div>
                  </td>
                  <td className="px-8 py-6">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button 
                      onClick={() => setSelectedItem(item)}
                      className="p-2 hover:bg-white/10 rounded-xl text-secondary hover:text-active transition-all"
                    >
                      <Eye size={18} />
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className="px-8 py-20 text-center text-secondary">
                  No submissions found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Modal */}
      <AnimatePresence>
        {selectedItem && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              onClick={() => setSelectedItem(null)}
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-2xl bg-[#1A1A1A] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl"
            >
              <div className="p-8 border-b border-white/5 flex justify-between items-center">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 ${type === 'suggestions' ? 'bg-blue-500/10 text-blue-400' : 'bg-rose-500/10 text-rose-400'} rounded-xl flex items-center justify-center`}>
                    {type === 'suggestions' ? <Lightbulb size={20} /> : <AlertCircle size={20} />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-[#EAEAEA]">
                      {type === 'suggestions' ? 'Suggestion Details' : 'Error Report Details'}
                    </h3>
                    <p className="text-xs text-secondary">Submitted on {new Date(selectedItem.createdAt).toLocaleString()}</p>
                  </div>
                </div>
                <button onClick={() => setSelectedItem(null)} className="p-2 hover:bg-white/5 rounded-full text-secondary">
                  <XCircle size={24} />
                </button>
              </div>

              <div className="p-8 space-y-8 max-h-[70vh] overflow-y-auto custom-scrollbar">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Category/Type</label>
                    <div className="text-sm font-bold text-[#EAEAEA]">
                      {type === 'suggestions' ? selectedItem.category : selectedItem.errorType}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Current Status</label>
                    <div>
                      <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${getStatusColor(selectedItem.status)}`}>
                        {selectedItem.status}
                      </span>
                    </div>
                  </div>
                </div>

                {type === 'errors' && (
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Page URL</label>
                    <div className="flex items-center gap-2 p-3 bg-white/5 border border-white/10 rounded-xl">
                      <ExternalLink size={14} className="text-secondary" />
                      <span className="text-xs text-secondary truncate">{selectedItem.pageUrl}</span>
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">
                    {type === 'suggestions' ? 'Suggestion Title' : 'Error Description'}
                  </label>
                  <div className="text-sm font-bold text-[#EAEAEA]">
                    {type === 'suggestions' ? selectedItem.title : selectedItem.errorType}
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Detailed Description</label>
                  <p className="text-sm text-secondary leading-relaxed bg-white/5 p-4 rounded-2xl border border-white/5">
                    {selectedItem.description}
                  </p>
                </div>

                {selectedItem.imageUrls && selectedItem.imageUrls.length > 0 && (
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Attachments</label>
                    <div className="grid grid-cols-3 gap-4">
                      {selectedItem.imageUrls.map((url: string, idx: number) => (
                        <div key={idx} className="aspect-square rounded-2xl overflow-hidden border border-white/10 bg-white/5 group relative">
                          <img src={url} alt="Attachment" className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <ImageIcon className="text-white" size={24} />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="space-y-4 pt-4 border-t border-white/5">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Update Status</label>
                  <div className="flex flex-wrap gap-2">
                    {type === 'suggestions' ? (
                      ['New', 'Under Review', 'Approved', 'Implemented', 'Rejected'].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedItem.id, s)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedItem.status === s 
                              ? 'bg-active text-white shadow-lg shadow-active/20' 
                              : 'bg-white/5 text-secondary hover:bg-white/10 border border-white/5'
                          }`}
                        >
                          {s}
                        </button>
                      ))
                    ) : (
                      ['Pending', 'In Review', 'Resolved', 'Rejected'].map(s => (
                        <button
                          key={s}
                          onClick={() => updateStatus(selectedItem.id, s)}
                          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                            selectedItem.status === s 
                              ? 'bg-active text-white shadow-lg shadow-active/20' 
                              : 'bg-white/5 text-secondary hover:bg-white/10 border border-white/5'
                          }`}
                        >
                          {s}
                        </button>
                      ))
                    )}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-white/5 border-t border-white/5 flex justify-end">
                <button 
                  onClick={() => setSelectedItem(null)}
                  className="px-8 py-3 bg-white/5 border border-white/10 rounded-xl text-sm font-bold text-secondary hover:bg-white/10 transition-all"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
