import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Bell, 
  Search, 
  Filter, 
  MoreVertical, 
  CheckCircle2, 
  XCircle, 
  AlertCircle, 
  Clock, 
  Trash2, 
  Archive, 
  ChevronRight, 
  ShoppingCart, 
  Users, 
  Settings, 
  Megaphone, 
  ShieldAlert,
  Database,
  ArrowRight,
  Inbox,
  Check
} from 'lucide-react';
import { AdminNotification, NotificationModule, NotificationPriority } from '../../types';

interface NotificationCenterProps {
  notifications: AdminNotification[];
  onMarkAsRead: (id: string) => void;
  onMarkAllAsRead: () => void;
  onDelete: (id: string) => void;
  onArchive: (id: string) => void;
  onBulkAction: (ids: string[], action: 'read' | 'delete' | 'archive') => void;
}

export default function NotificationCenter({ 
  notifications, 
  onMarkAsRead, 
  onMarkAllAsRead, 
  onDelete, 
  onArchive,
  onBulkAction
}: NotificationCenterProps) {
  const [activeFilter, setActiveFilter] = useState<NotificationModule | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const filteredNotifications = notifications.filter(n => {
    const matchesFilter = activeFilter === 'All' || n.module === activeFilter;
    const matchesSearch = n.message.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         n.type.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch && !n.isArchived;
  });

  const getIcon = (module: NotificationModule) => {
    switch (module) {
      case 'Orders': return <ShoppingCart size={18} />;
      case 'Customers': return <Users size={18} />;
      case 'System': return <Database size={18} />;
      case 'Marketing': return <Megaphone size={18} />;
      case 'Security': return <ShieldAlert size={18} />;
      default: return <Bell size={18} />;
    }
  };

  const getPriorityColor = (priority: NotificationPriority) => {
    switch (priority) {
      case 'Low': return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
      case 'Medium': return 'bg-blue-500/10 text-blue-400 border-blue-500/20';
      case 'High': return 'bg-amber-500/10 text-amber-400 border-amber-500/20';
      case 'Critical': return 'bg-rose-500/10 text-rose-400 border-rose-500/20 animate-pulse';
      default: return 'bg-slate-500/10 text-slate-400 border-slate-500/20';
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredNotifications.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredNotifications.map(n => n.id));
    }
  };

  return (
    <div className="notification-center space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold text-[#EAEAEA]">Notification Center</h2>
          <p className="text-sm text-secondary">Operational alerts and system notifications across all modules.</p>
        </div>
        <div className="flex items-center gap-4">
          <button 
            onClick={onMarkAllAsRead}
            className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-secondary hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <CheckCircle2 size={18} />
            Mark All as Read
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Sidebar Filters */}
        <div className="space-y-6">
          <div className="p-6 bg-card border border-white/5 rounded-[32px] space-y-4">
            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Filter by Module</div>
            <div className="space-y-1">
              {['All', 'Orders', 'Customers', 'System', 'Marketing', 'Security'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter as any)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
                    activeFilter === filter ? 'bg-active text-white' : 'text-secondary hover:bg-white/5 hover:text-primary'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {filter === 'All' ? <Inbox size={18} /> : getIcon(filter as NotificationModule)}
                    {filter}
                  </div>
                  <span className="text-[10px] opacity-50">
                    {filter === 'All' ? notifications.length : notifications.filter(n => n.module === filter).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <div className="p-6 bg-card border border-white/5 rounded-[32px] space-y-4">
            <div className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Quick Actions</div>
            <div className="space-y-2">
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-secondary hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Archive size={14} />
                View Archived
              </button>
              <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-secondary hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <Settings size={14} />
                Preferences
              </button>
            </div>
          </div>
        </div>

        {/* Notification List */}
        <div className="lg:col-span-3 space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                type="text"
                placeholder="Search notifications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-white/5 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-active transition-all"
              />
            </div>
            
            {selectedIds.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center gap-2"
              >
                <button 
                  onClick={() => onBulkAction(selectedIds, 'read')}
                  className="px-4 py-2 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all"
                >
                  Mark Read
                </button>
                <button 
                  onClick={() => onBulkAction(selectedIds, 'archive')}
                  className="px-4 py-2 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-xl text-xs font-bold hover:bg-indigo-500/20 transition-all"
                >
                  Archive
                </button>
                <button 
                  onClick={() => onBulkAction(selectedIds, 'delete')}
                  className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all"
                >
                  Delete
                </button>
              </motion.div>
            )}
          </div>

          <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
            <div className="p-6 border-b border-white/5 flex items-center gap-4">
              <button 
                onClick={toggleSelectAll}
                className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                  selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0
                    ? 'bg-active border-active text-white' 
                    : 'border-white/20 hover:border-white/40'
                }`}
              >
                {selectedIds.length === filteredNotifications.length && filteredNotifications.length > 0 && <Check size={12} />}
              </button>
              <span className="text-xs font-bold text-secondary">
                {selectedIds.length > 0 ? `${selectedIds.length} Selected` : 'Select All'}
              </span>
            </div>

            <div className="divide-y divide-white/5">
              <AnimatePresence mode="popLayout">
                {filteredNotifications.length > 0 ? (
                  filteredNotifications.map((notification) => (
                    <motion.div
                      key={notification.id}
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, x: -20 }}
                      className={`p-6 flex items-start gap-6 hover:bg-white/[0.02] transition-colors group relative ${
                        !notification.isRead ? 'bg-active/[0.02]' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4 pt-1">
                        <button 
                          onClick={() => toggleSelect(notification.id)}
                          className={`w-5 h-5 rounded border flex items-center justify-center transition-all ${
                            selectedIds.includes(notification.id)
                              ? 'bg-active border-active text-white' 
                              : 'border-white/20 hover:border-white/40'
                          }`}
                        >
                          {selectedIds.includes(notification.id) && <Check size={12} />}
                        </button>
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                          !notification.isRead ? 'bg-active/10 text-active' : 'bg-white/5 text-secondary'
                        }`}>
                          {getIcon(notification.module)}
                        </div>
                      </div>

                      <div className="flex-1 space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <h4 className={`text-sm font-bold ${!notification.isRead ? 'text-[#EAEAEA]' : 'text-secondary'}`}>
                              {notification.type}
                            </h4>
                            <span className={`px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-widest border ${getPriorityColor(notification.priority)}`}>
                              {notification.priority}
                            </span>
                          </div>
                          <div className="flex items-center gap-2 text-[10px] text-secondary">
                            <Clock size={12} />
                            {notification.createdAt}
                          </div>
                        </div>
                        <p className="text-sm text-secondary leading-relaxed max-w-2xl">
                          {notification.message}
                        </p>
                        <div className="flex items-center gap-4 pt-2">
                          {notification.actionUrl && (
                            <button className="text-[10px] font-bold text-active hover:underline flex items-center gap-1">
                              Take Action <ArrowRight size={12} />
                            </button>
                          )}
                          {!notification.isRead && (
                            <button 
                              onClick={() => onMarkAsRead(notification.id)}
                              className="text-[10px] font-bold text-emerald-400 hover:underline"
                            >
                              Mark as Read
                            </button>
                          )}
                        </div>
                      </div>

                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2">
                        <button 
                          onClick={() => onArchive(notification.id)}
                          className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-indigo-400 transition-all"
                          title="Archive"
                        >
                          <Archive size={16} />
                        </button>
                        <button 
                          onClick={() => onDelete(notification.id)}
                          className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-rose-400 transition-all"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>

                      {!notification.isRead && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-active" />
                      )}
                    </motion.div>
                  ))
                ) : (
                  <div className="p-20 text-center space-y-4">
                    <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
                      <Inbox size={40} className="text-secondary opacity-20" />
                    </div>
                    <div className="space-y-1">
                      <h3 className="text-lg font-bold text-[#EAEAEA]">All Caught Up!</h3>
                      <p className="text-sm text-secondary">No notifications found for the selected filter.</p>
                    </div>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Pagination Placeholder */}
          <div className="flex items-center justify-between px-4">
            <div className="text-xs text-secondary font-medium">
              Showing <span className="text-primary">1-{filteredNotifications.length}</span> of <span className="text-primary">{filteredNotifications.length}</span> notifications
            </div>
            <div className="flex items-center gap-2">
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-secondary opacity-50 cursor-not-allowed">Previous</button>
              <button className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-xs font-bold text-secondary opacity-50 cursor-not-allowed">Next</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
