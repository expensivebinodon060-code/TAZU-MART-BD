import React, { useState, useEffect } from 'react';
import { 
  Layout, 
  Eye, 
  EyeOff, 
  Edit2, 
  Plus, 
  Trash2, 
  GripVertical, 
  Save, 
  X,
  Users,
  Activity,
  Coins,
  Zap,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CustomerPanelSection } from '../../types';

export default function CustomerPanelManagement({ userRole }: { userRole?: string }) {
  const [sections, setSections] = useState<CustomerPanelSection[]>([]);
  const [analytics, setAnalytics] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const isSuperAdmin = userRole === 'super-admin';

  const [newSection, setNewSection] = useState({
    displayName: '',
    icon: 'ChevronRight',
    redirectUrl: '',
    positionOrder: 1,
    isEnabled: true
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [sectionsRes, analyticsRes] = await Promise.all([
        fetch('/api/customer-panel/sections'),
        fetch('/api/customer-panel/analytics')
      ]);
      const sectionsData = await sectionsRes.json();
      const analyticsData = await analyticsRes.json();
      setSections(sectionsData);
      setAnalytics(analyticsData);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggle = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/customer-panel/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isEnabled: !currentStatus })
      });
      if (res.ok) {
        setSections(prev => prev.map(s => s.id === id ? { ...s, isEnabled: !currentStatus } : s));
      }
    } catch (err) {
      console.error('Failed to toggle section', err);
    }
  };

  const handleRename = async (id: string, newName: string) => {
    try {
      const res = await fetch(`/api/customer-panel/sections/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ displayName: newName })
      });
      if (res.ok) {
        setSections(prev => prev.map(s => s.id === id ? { ...s, displayName: newName } : s));
        setEditingId(null);
      }
    } catch (err) {
      console.error('Failed to rename section', err);
    }
  };

  const handleAdd = async () => {
    try {
      const res = await fetch('/api/customer-panel/sections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSection)
      });
      if (res.ok) {
        const added = await res.json();
        setSections(prev => [...prev, added].sort((a, b) => a.positionOrder - b.positionOrder));
        setIsAdding(false);
        setNewSection({ displayName: '', icon: 'ChevronRight', redirectUrl: '', positionOrder: sections.length + 1, isEnabled: true });
      }
    } catch (err) {
      console.error('Failed to add section', err);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this custom section?')) return;
    try {
      const res = await fetch(`/api/customer-panel/sections/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        setSections(prev => prev.filter(s => s.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete section', err);
    }
  };

  if (isLoading) return <div className="p-8 text-center text-secondary">Loading Management Console...</div>;

  return (
    <div className="p-8 space-y-8 max-w-6xl mx-auto">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary tracking-tight">Customer Panel Management</h1>
          <p className="text-secondary">Configure the layout and visibility of the customer dashboard.</p>
        </div>
        <button 
          onClick={() => setIsAdding(true)}
          disabled={!isSuperAdmin}
          className="flex items-center gap-2 px-6 py-3 bg-active text-white rounded-2xl font-bold shadow-lg shadow-active/20 hover:scale-[1.02] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Plus size={20} />
          Add Custom Bar
        </button>
      </header>

      {/* Analytics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 bg-surface rounded-3xl shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
            <Users size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase">Total Users</p>
            <p className="text-2xl font-bold text-primary">{analytics?.totalUsers}</p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-3xl shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-green-50 text-green-600 rounded-2xl flex items-center justify-center">
            <Activity size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase">Active Users</p>
            <p className="text-2xl font-bold text-primary">{analytics?.activeUsers}</p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-3xl shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-50 text-amber-600 rounded-2xl flex items-center justify-center">
            <Coins size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase">Points Issued</p>
            <p className="text-2xl font-bold text-primary">{analytics?.totalPointsIssued}</p>
          </div>
        </div>
        <div className="p-6 bg-surface rounded-3xl shadow-sm border border-border flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-2xl flex items-center justify-center">
            <Zap size={24} />
          </div>
          <div>
            <p className="text-xs font-bold text-secondary uppercase">Flash Participation</p>
            <p className="text-2xl font-bold text-primary">{analytics?.flashDealParticipation}</p>
          </div>
        </div>
      </div>

      <div className="bg-surface rounded-[32px] shadow-sm border border-border overflow-hidden">
        <div className="p-6 border-b border-border bg-hover flex items-center justify-between">
          <h2 className="font-bold text-primary">Dashboard Sections</h2>
          <span className="text-xs text-secondary font-medium uppercase tracking-widest">Drag to Reorder</span>
        </div>

        <div className="divide-y divide-border">
          {sections.map((section, index) => (
            <div 
              key={section.id}
              className={`p-6 flex items-center gap-6 transition-colors hover:bg-hover ${!section.isEnabled ? 'opacity-60' : ''}`}
            >
              <div className="text-secondary cursor-grab active:cursor-grabbing">
                <GripVertical size={20} />
              </div>

              <div className="w-12 h-12 bg-hover rounded-2xl flex items-center justify-center text-secondary">
                {section.sectionKey.startsWith('custom_') ? <ExternalLink size={20} /> : <Layout size={20} />}
              </div>

              <div className="flex-1">
                {editingId === section.id && isSuperAdmin ? (
                  <div className="flex items-center gap-2">
                    <input 
                      type="text"
                      defaultValue={section.displayName}
                      onBlur={(e) => handleRename(section.id, e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleRename(section.id, e.currentTarget.value)}
                      autoFocus
                      className="px-3 py-1 bg-surface border border-active rounded-lg outline-none text-sm font-bold"
                    />
                    <button onClick={() => setEditingId(null)} className="text-secondary hover:text-primary">
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-primary">{section.displayName}</h3>
                    {isSuperAdmin && (
                      <button 
                        onClick={() => setEditingId(section.id)}
                        className="p-1 text-secondary hover:text-active transition-colors"
                      >
                        <Edit2 size={14} />
                      </button>
                    )}
                  </div>
                )}
                <p className="text-xs text-secondary font-medium">Key: {section.sectionKey}</p>
              </div>

              <div className="flex items-center gap-3">
                <button 
                  onClick={() => handleToggle(section.id, section.isEnabled)}
                  disabled={!isSuperAdmin}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                    section.isEnabled 
                      ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                      : 'bg-hover text-secondary hover:bg-border'
                  } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {section.isEnabled ? <Eye size={16} /> : <EyeOff size={16} />}
                  {section.isEnabled ? 'Enabled' : 'Disabled'}
                </button>

                {!['profile_header', 'stats_row', 'nova_points', 'flash_deals', 'my_orders', 'recently_viewed'].includes(section.sectionKey) && isSuperAdmin && (
                  <button 
                    onClick={() => handleDelete(section.id)}
                    className="p-2 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Trash2 size={18} />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Add Section Modal Overlay */}
      <AnimatePresence>
        {isAdding && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-surface rounded-[32px] w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="p-6 border-b border-border flex items-center justify-between">
                <h2 className="text-xl font-bold text-primary">Add Custom Bar</h2>
                <button onClick={() => setIsAdding(false)} className="p-2 hover:bg-hover rounded-full transition-colors">
                  <X size={20} />
                </button>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-secondary uppercase ml-1">Bar Name</label>
                  <input 
                    type="text"
                    value={newSection.displayName}
                    onChange={(e) => setNewSection({ ...newSection, displayName: e.target.value })}
                    placeholder="e.g., Special Rewards"
                    className="w-full px-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-secondary uppercase ml-1">Redirect URL / Route</label>
                  <input 
                    type="text"
                    value={newSection.redirectUrl}
                    onChange={(e) => setNewSection({ ...newSection, redirectUrl: e.target.value })}
                    placeholder="e.g., /special-rewards"
                    className="w-full px-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-secondary uppercase ml-1">Position</label>
                    <input 
                      type="number"
                      value={newSection.positionOrder}
                      onChange={(e) => setNewSection({ ...newSection, positionOrder: parseInt(e.target.value) })}
                      className="w-full px-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-secondary uppercase ml-1">Icon</label>
                    <select 
                      value={newSection.icon}
                      onChange={(e) => setNewSection({ ...newSection, icon: e.target.value })}
                      className="w-full px-4 py-3 bg-hover border border-transparent focus:border-active focus:bg-surface rounded-2xl outline-none transition-all"
                    >
                      <option value="ChevronRight">Arrow Right</option>
                      <option value="ExternalLink">External Link</option>
                      <option value="Star">Star</option>
                      <option value="Gift">Gift</option>
                      <option value="Zap">Zap</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-hover flex gap-3">
                <button 
                  onClick={() => setIsAdding(false)}
                  className="flex-1 py-4 bg-surface text-primary rounded-2xl font-bold border border-border hover:bg-hover transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleAdd}
                  disabled={!newSection.displayName}
                  className="flex-1 py-4 bg-active text-white rounded-2xl font-bold shadow-lg shadow-active/20 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50"
                >
                  Save Section
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
