import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ImageIcon, 
  Plus, 
  Search, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Calendar, 
  Link as LinkIcon, 
  Zap, 
  Clock, 
  Save, 
  RefreshCw, 
  X, 
  ChevronRight,
  Layout,
  MousePointer2,
  TrendingUp,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  ArrowUp,
  ArrowDown,
  Info
} from 'lucide-react';
import { HomepageBanner } from '../../types';

export default function BannerManagement() {
  const [banners, setBanners] = useState<HomepageBanner[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState<HomepageBanner | null>(null);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/banners');
      if (!res.ok) throw new Error(`Failed to fetch banners: ${res.status}`);
      const data = await res.json();
      // Sort by order
      const sortedData = (Array.isArray(data) ? data : []).sort((a, b) => (a.order || 0) - (b.order || 0));
      setBanners(sortedData);
    } catch (err) {
      console.error('Failed to fetch banners', err);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleVisibility = async (id: string) => {
    const banner = banners.find(b => b.id === id);
    if (!banner) return;
    
    try {
      const res = await fetch(`/api/admin/banners/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isVisible: !banner.isVisible })
      });
      if (res.ok) fetchBanners();
    } catch (err) {
      console.error('Failed to toggle visibility', err);
    }
  };

  const deleteBanner = async (id: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
        if (res.ok) {
          fetchBanners();
          if (selectedBanner?.id === id) setSelectedBanner(null);
        }
      } catch (err) {
        console.error('Failed to delete banner', err);
      }
    }
  };

  const handleSave = async () => {
    if (!selectedBanner) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/admin/banners/${selectedBanner.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedBanner)
      });
      if (res.ok) {
        fetchBanners();
        alert('Banner updated successfully!');
      }
    } catch (err) {
      console.error('Failed to save banner', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCreate = async () => {
    setIsSaving(true);
    try {
      const res = await fetch('/api/admin/banners', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: 'New Banner',
          image: 'https://picsum.photos/seed/banner/2560/1440',
          order: banners.length + 1,
          isVisible: true,
          type: 'Main Slider'
        })
      });
      if (res.ok) {
        const newBanner = await res.json();
        fetchBanners();
        setSelectedBanner(newBanner);
      }
    } catch (err) {
      console.error('Failed to create banner', err);
    } finally {
      setIsSaving(false);
    }
  };

  const moveBanner = async (id: string, direction: 'up' | 'down') => {
    const index = banners.findIndex(b => b.id === id);
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === banners.length - 1) return;

    const newBanners = [...banners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];

    // Update orders
    const updatedBanners = newBanners.map((b, i) => ({ ...b, order: i + 1 }));
    setBanners(updatedBanners);

    // Save all orders to backend (conceptual)
    try {
      await Promise.all(updatedBanners.map(b => 
        fetch(`/api/admin/banners/${b.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ order: b.order })
        })
      ));
    } catch (err) {
      console.error('Failed to save reorder', err);
    }
  };

  const filteredBanners = banners.filter(banner => 
    banner.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-[#EAEAEA] uppercase tracking-tight">Banner Manager</h2>
          <p className="text-xs text-secondary mt-1">Manage homepage promotional sliders and category banners.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleCreate}
            className="px-6 py-3 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2 shadow-lg shadow-active/20"
          >
            <Plus size={18} />
            New Banner
          </button>
        </div>
      </header>

      {/* Dimension Guidance */}
      <div className="p-6 bg-indigo-500/5 border border-indigo-500/10 rounded-[32px] flex items-start gap-4">
        <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center shrink-0">
          <Info size={20} />
        </div>
        <div>
          <h4 className="text-sm font-bold text-indigo-400">Design Guidelines</h4>
          <p className="text-xs text-secondary mt-1 leading-relaxed">
            For best results, use images with <span className="text-[#EAEAEA] font-bold">2560x1440px</span> dimensions. 
            Keep important content within the <span className="text-[#EAEAEA] font-bold">1546x423px</span> safe area (center).
            Max 5 banners will be displayed on the homepage.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 space-y-6">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text"
              placeholder="Search banners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-14 pl-12 pr-4 bg-card border border-white/5 rounded-2xl text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
            />
          </div>

          <div className="space-y-4">
            {isLoading ? (
              <div className="p-20 text-center text-secondary">Loading banners...</div>
            ) : filteredBanners.length === 0 ? (
              <div className="p-20 text-center text-secondary">No banners found.</div>
            ) : filteredBanners.map((banner, index) => (
              <div 
                key={banner.id} 
                className={`group p-4 bg-card border border-white/5 rounded-2xl hover:border-active/30 transition-all cursor-pointer ${selectedBanner?.id === banner.id ? 'ring-2 ring-active border-transparent' : ''}`}
                onClick={() => setSelectedBanner(banner)}
              >
                <div className="flex items-center gap-4">
                  <div className="flex flex-col gap-1 shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); moveBanner(banner.id, 'up'); }}
                      className="p-1 hover:bg-white/5 rounded text-secondary hover:text-active disabled:opacity-30"
                      disabled={index === 0}
                    >
                      <ArrowUp size={14} />
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); moveBanner(banner.id, 'down'); }}
                      className="p-1 hover:bg-white/5 rounded text-secondary hover:text-active disabled:opacity-30"
                      disabled={index === filteredBanners.length - 1}
                    >
                      <ArrowDown size={14} />
                    </button>
                  </div>
                  <div className="w-24 h-14 bg-white/5 rounded-xl overflow-hidden shrink-0 border border-white/5">
                    <img src={banner.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-[#EAEAEA] truncate">{banner.title}</h4>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] text-secondary uppercase tracking-widest bg-white/5 px-2 py-0.5 rounded">
                        Order: {banner.order}
                      </span>
                      <span className={`text-[10px] font-bold uppercase tracking-widest ${banner.isVisible ? 'text-emerald-400' : 'text-rose-400'}`}>
                        {banner.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleVisibility(banner.id); }}
                      className={`p-2 rounded-lg transition-all ${banner.isVisible ? 'text-emerald-400 bg-emerald-400/10' : 'text-secondary bg-white/5'}`}
                    >
                      {banner.isVisible ? <Eye size={16} /> : <EyeOff size={16} />}
                    </button>
                    <button 
                      onClick={(e) => { e.stopPropagation(); deleteBanner(banner.id); }}
                      className="p-2 text-secondary hover:text-rose-400 hover:bg-rose-400/10 rounded-lg transition-all"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="lg:col-span-5">
          <AnimatePresence mode="wait">
            {selectedBanner ? (
              <motion.div 
                key={selectedBanner.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="p-8 bg-card border border-white/5 rounded-[40px] sticky top-8 space-y-8"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-black text-[#EAEAEA] uppercase tracking-tight">Edit Banner</h3>
                  <button onClick={() => setSelectedBanner(null)} className="text-secondary hover:text-active transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Banner Image URL</label>
                    <input 
                      type="text"
                      value={selectedBanner.image}
                      onChange={(e) => setSelectedBanner({ ...selectedBanner, image: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all font-mono"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Banner Title</label>
                    <input 
                      type="text"
                      value={selectedBanner.title}
                      onChange={(e) => setSelectedBanner({ ...selectedBanner, title: e.target.value })}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Subtitle</label>
                    <input 
                      type="text"
                      value={selectedBanner.subtitle || ''}
                      onChange={(e) => setSelectedBanner({ ...selectedBanner, subtitle: e.target.value })}
                      placeholder="Optional subtitle..."
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Button Text</label>
                      <input 
                        type="text"
                        value={selectedBanner.buttonText || 'Shop Now'}
                        onChange={(e) => setSelectedBanner({ ...selectedBanner, buttonText: e.target.value })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Banner Type</label>
                      <select 
                        value={selectedBanner.type || 'Main Slider'}
                        onChange={(e) => setSelectedBanner({ ...selectedBanner, type: e.target.value as any })}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all appearance-none"
                      >
                        <option value="Main Slider">Main Slider</option>
                        <option value="Category Banner">Category Banner</option>
                        <option value="Flash Sale">Flash Sale</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Target Link</label>
                    <div className="relative">
                      <LinkIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                      <input 
                        type="text"
                        value={selectedBanner.link || ''}
                        onChange={(e) => setSelectedBanner({ ...selectedBanner, link: e.target.value })}
                        placeholder="/category/electronics"
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                    <div className="space-y-1">
                      <div className="text-sm font-bold text-[#EAEAEA]">Visibility</div>
                      <div className="text-[10px] text-secondary uppercase tracking-widest">Show on homepage</div>
                    </div>
                    <button 
                      onClick={() => setSelectedBanner({ ...selectedBanner, isVisible: !selectedBanner.isVisible })}
                      className={`w-12 h-6 rounded-full transition-all relative ${selectedBanner.isVisible ? 'bg-active' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${selectedBanner.isVisible ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                </div>

                <button 
                  onClick={handleSave}
                  disabled={isSaving}
                  className="w-full py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all shadow-lg shadow-active/20 flex items-center justify-center gap-2"
                >
                  {isSaving && <RefreshCw size={18} className="animate-spin" />}
                  Update Banner
                </button>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-white/[0.02] border border-dashed border-white/10 rounded-[40px] text-center space-y-4">
                <div className="w-16 h-16 bg-white/5 rounded-3xl flex items-center justify-center text-secondary/40">
                  <ImageIcon size={32} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#EAEAEA]">No Banner Selected</h3>
                  <p className="text-xs text-secondary max-w-[200px] mx-auto mt-1">Select a banner from the list to view and edit its details.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
