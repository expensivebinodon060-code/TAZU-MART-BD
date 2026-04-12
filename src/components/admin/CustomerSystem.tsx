import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Layout, 
  Image as ImageIcon, 
  Layers, 
  Eye, 
  EyeOff, 
  Plus, 
  Trash2, 
  Edit2, 
  Save, 
  X, 
  MoveUp, 
  MoveDown,
  Search,
  Calendar,
  Settings,
  Zap
} from 'lucide-react';
import { HomepageBanner, PromotionBanner, HomepageVisibility, Category } from '../../types';
import { MOCK_HOMEPAGE_BANNERS, MOCK_PROMOTION_BANNERS, MOCK_HOMEPAGE_VISIBILITY, MOCK_CATEGORIES } from '../../mockData';

export default function CustomerSystem() {
  const [activeTab, setActiveTab] = useState<'banners' | 'categories' | 'cat-banners' | 'promotions' | 'visibility'>('banners');
  const [banners, setBanners] = useState<HomepageBanner[]>(MOCK_HOMEPAGE_BANNERS);
  const [promoBanners, setPromoBanners] = useState<PromotionBanner[]>(MOCK_PROMOTION_BANNERS);
  const [visibility, setVisibility] = useState<HomepageVisibility>(MOCK_HOMEPAGE_VISIBILITY);
  const [categories, setCategories] = useState<Category[]>(MOCK_CATEGORIES);

  const [isEditingBanner, setIsEditingBanner] = useState<string | null>(null);
  const [isEditingPromo, setIsEditingPromo] = useState<string | null>(null);

  const toggleVisibility = (key: keyof HomepageVisibility) => {
    setVisibility(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const deleteBanner = (id: string) => {
    setBanners(prev => prev.filter(b => b.id !== id));
  };

  const deletePromo = (id: string) => {
    setPromoBanners(prev => prev.filter(b => b.id !== id));
  };

  const moveBanner = (index: number, direction: 'up' | 'down') => {
    const newBanners = [...banners];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex >= 0 && targetIndex < newBanners.length) {
      [newBanners[index], newBanners[targetIndex]] = [newBanners[targetIndex], newBanners[index]];
      setBanners(newBanners);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-primary">Customer System</h1>
          <p className="text-secondary text-sm">Manage homepage layout, banners, and visibility</p>
        </div>
        <div className="flex bg-hover p-1 rounded-xl border border-border">
          <button 
            onClick={() => setActiveTab('banners')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'banners' ? 'bg-surface text-active shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            Banners
          </button>
          <button 
            onClick={() => setActiveTab('categories')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'categories' ? 'bg-surface text-active shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            Categories
          </button>
          <button 
            onClick={() => setActiveTab('cat-banners')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'cat-banners' ? 'bg-surface text-active shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            Category Banners
          </button>
          <button 
            onClick={() => setActiveTab('promotions')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'promotions' ? 'bg-surface text-active shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            Promotions
          </button>
          <button 
            onClick={() => setActiveTab('visibility')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === 'visibility' ? 'bg-surface text-active shadow-sm' : 'text-secondary hover:text-primary'}`}
          >
            Visibility
          </button>
        </div>
      </div>

      <div className="bg-surface rounded-2xl border border-border shadow-sm overflow-hidden">
        {activeTab === 'banners' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ImageIcon size={20} className="text-active" />
                Homepage Banner Manager
              </h3>
              <button className="flex items-center gap-2 bg-active text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all">
                <Plus size={18} />
                Add Banner
              </button>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {banners.map((banner, index) => (
                <div key={banner.id} className="flex flex-col md:flex-row items-center gap-6 p-4 border border-border rounded-2xl hover:bg-hover transition-all group">
                  <div className="relative w-full md:w-48 aspect-[16/9] rounded-xl overflow-hidden bg-hover">
                    <img src={banner.image} alt={banner.title} className="w-full h-full object-cover" />
                    <div className="absolute top-2 left-2 px-2 py-1 bg-black/50 backdrop-blur-md text-white text-[10px] font-bold rounded-full">
                      #{index + 1}
                    </div>
                  </div>
                  <div className="flex-1 space-y-1 text-center md:text-left">
                    <h4 className="font-bold text-primary">{banner.title || 'Untitled Banner'}</h4>
                    <p className="text-xs text-secondary truncate max-w-xs">{banner.link || 'No link set'}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2">
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${banner.isVisible ? 'bg-green-100 text-green-600' : 'bg-hover text-secondary'}`}>
                        {banner.isVisible ? 'Visible' : 'Hidden'}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex flex-col gap-1">
                      <button onClick={() => moveBanner(index, 'up')} disabled={index === 0} className="p-1.5 text-secondary hover:text-active disabled:opacity-30">
                        <MoveUp size={16} />
                      </button>
                      <button onClick={() => moveBanner(index, 'down')} disabled={index === banners.length - 1} className="p-1.5 text-secondary hover:text-active disabled:opacity-30">
                        <MoveDown size={16} />
                      </button>
                    </div>
                    <div className="h-8 w-px bg-border mx-2" />
                    <button className="p-2 text-secondary hover:text-active hover:bg-active/5 rounded-lg transition-all">
                      <Edit2 size={18} />
                    </button>
                    <button onClick={() => deleteBanner(banner.id)} className="p-2 text-secondary hover:text-red-500 hover:bg-red-50 rounded-lg transition-all">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Layers size={20} className="text-active" />
                Category Manager
              </h3>
              <button className="flex items-center gap-2 bg-active text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all">
                <Plus size={18} />
                Add Category
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-border">
                    <th className="pb-4 font-bold text-sm text-secondary">Order</th>
                    <th className="pb-4 font-bold text-sm text-secondary">Category</th>
                    <th className="pb-4 font-bold text-sm text-secondary">Status</th>
                    <th className="pb-4 font-bold text-sm text-secondary">Visibility</th>
                    <th className="pb-4 font-bold text-sm text-secondary text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {categories.map((cat, index) => (
                    <tr key={cat.id} className="group hover:bg-hover transition-all">
                      <td className="py-4">
                        <span className="font-mono text-xs text-muted">#{index + 1}</span>
                      </td>
                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-lg bg-hover flex items-center justify-center text-xl">
                            {cat.icon}
                          </div>
                          <div>
                            <div className="font-bold text-primary">{cat.name}</div>
                            <div className="text-[10px] text-muted uppercase tracking-widest">{cat.slug}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${cat.status === 'Active' ? 'bg-green-100 text-green-600' : 'bg-hover text-secondary'}`}>
                          {cat.status}
                        </span>
                      </td>
                      <td className="py-4">
                        <button className={`p-2 rounded-lg transition-all ${cat.isVisible ? 'text-active bg-active/5' : 'text-muted bg-hover'}`}>
                          {cat.isVisible ? <Eye size={18} /> : <EyeOff size={18} />}
                        </button>
                      </td>
                      <td className="py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button className="p-2 text-secondary hover:text-active transition-all">
                            <Edit2 size={18} />
                          </button>
                          <button className="p-2 text-secondary hover:text-red-500 transition-all">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'cat-banners' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <ImageIcon size={20} className="text-active" />
                Category Banner Manager
              </h3>
              <p className="text-xs text-secondary">Manage 16:9 banners for each category page</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat.id} className="border border-border rounded-2xl overflow-hidden group hover:shadow-md transition-all bg-surface">
                  <div className="relative aspect-video bg-hover">
                    <img 
                      src={cat.banner || `https://picsum.photos/seed/${cat.id}/800/450`} 
                      alt={cat.name} 
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all">
                      <div className="flex gap-2">
                        <button className="p-2 bg-surface text-active rounded-lg font-bold text-xs flex items-center gap-1">
                          <Plus size={14} /> Upload
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="p-4 space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-bold text-primary">{cat.name}</div>
                        <div className="text-[10px] text-muted uppercase tracking-widest">Banner Status: Active</div>
                      </div>
                      <button className={`relative w-10 h-5 rounded-full transition-all ${cat.isVisible ? 'bg-active' : 'bg-border'}`}>
                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${cat.isVisible ? 'left-6' : 'left-1'}`} />
                      </button>
                    </div>
                    
                    <div className="space-y-3 pt-2 border-t border-border">
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Banner Title</label>
                        <input 
                          type="text" 
                          defaultValue={cat.bannerTitle || cat.name}
                          className="w-full px-3 py-2 bg-hover border border-border rounded-lg text-sm focus:border-active focus:ring-0 transition-all"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Banner Subtitle</label>
                        <input 
                          type="text" 
                          defaultValue={cat.bannerSubtitle || `Premium ${cat.name} Collection 2026`}
                          className="w-full px-3 py-2 bg-hover border border-border rounded-lg text-sm focus:border-active focus:ring-0 transition-all"
                        />
                      </div>
                      <button className="w-full py-2 bg-active/10 text-active rounded-lg font-bold text-xs hover:bg-active hover:text-white transition-all flex items-center justify-center gap-2">
                        <Save size={14} /> Save Changes
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'promotions' && (
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Zap size={20} className="text-active" />
                Promotion Banner Manager
              </h3>
              <button className="flex items-center gap-2 bg-active text-white px-4 py-2 rounded-xl font-bold text-sm hover:scale-105 transition-all">
                <Plus size={18} />
                Add Promotion
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {promoBanners.map((promo) => (
                <div key={promo.id} className="p-4 border border-border rounded-2xl space-y-4 hover:shadow-md transition-all group bg-surface">
                  <div className="relative aspect-[2/1] rounded-xl overflow-hidden">
                    <img src={promo.image} alt={promo.title} className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-all" />
                    <div className="absolute bottom-3 left-3">
                      <h4 className="text-white font-black text-lg uppercase drop-shadow-md">{promo.title}</h4>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2 text-xs text-secondary">
                        <Calendar size={12} />
                        {promo.startDate} - {promo.endDate}
                      </div>
                      <div className="text-[10px] font-bold text-active uppercase tracking-widest">
                        Linked to: {categories.find(c => c.id === promo.categoryId)?.name || 'General'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-secondary hover:text-active transition-all">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => deletePromo(promo.id)} className="p-2 text-secondary hover:text-red-500 transition-all">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'visibility' && (
          <div className="p-6 space-y-8">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-lg flex items-center gap-2">
                <Settings size={20} className="text-active" />
                Homepage Visibility Control
              </h3>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-6">
                <h4 className="text-xs font-bold text-muted uppercase tracking-widest">Core Sections</h4>
                <div className="space-y-4">
                  {[
                    { key: 'mainBanner', label: 'Main Promotional Banner', icon: ImageIcon },
                    { key: 'categoryNav', label: 'Category Navigation Tabs', icon: Layers },
                    { key: 'searchBar', label: 'Smart Search Bar System', icon: Search },
                    { key: 'promotionBanners', label: 'Product Promotion Banners', icon: Zap },
                    { key: 'productSections', label: 'Main Product Sections', icon: Layout },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between p-4 bg-hover rounded-2xl border border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-surface rounded-xl flex items-center justify-center text-active shadow-sm">
                          <item.icon size={20} />
                        </div>
                        <span className="font-bold text-primary">{item.label}</span>
                      </div>
                      <button 
                        onClick={() => toggleVisibility(item.key as keyof HomepageVisibility)}
                        className={`relative w-12 h-6 rounded-full transition-all duration-300 ${visibility[item.key as keyof HomepageVisibility] ? 'bg-active' : 'bg-border'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all duration-300 ${visibility[item.key as keyof HomepageVisibility] ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <h4 className="text-xs font-bold text-muted uppercase tracking-widest">Scheduling & Rules</h4>
                <div className="p-6 bg-active/5 rounded-2xl border border-active/10 space-y-4">
                  <p className="text-sm text-secondary leading-relaxed">
                    Visibility controls allow you to hide or show entire sections of the homepage without deleting any data. 
                    You can also schedule banners to appear during specific events like Eid, Ramadan, or Flash Sales.
                  </p>
                  <div className="flex items-center gap-3 text-xs font-bold text-active uppercase tracking-widest">
                    <Calendar size={14} />
                    Global Scheduling Active
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
