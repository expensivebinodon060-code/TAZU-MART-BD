import React, { useState, useEffect, useRef } from 'react';
import { motion, Reorder, AnimatePresence } from 'framer-motion';
import { 
  Layers, 
  Plus, 
  Search, 
  GripVertical, 
  Edit3, 
  Trash2, 
  Eye, 
  EyeOff, 
  Star, 
  ChevronRight, 
  Image as ImageIcon,
  TrendingUp,
  BarChart3,
  ArrowUpRight,
  MoreVertical,
  Check,
  X,
  Save,
  RefreshCw,
  Upload,
  Globe,
  Settings,
  Layout,
  Monitor,
  Smartphone,
  Tag,
  AlertCircle,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Category, SubCategory } from '../../types';

type TabType = 'general' | 'media' | 'seo' | 'display';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('general');
  const [isSaving, setIsSaving] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [editingSubId, setEditingSubId] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const bannerRef = useRef<HTMLInputElement>(null);
  const mobileBannerRef = useRef<HTMLInputElement>(null);
  const iconRef = useRef<HTMLInputElement>(null);

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCategoryData, setNewCategoryData] = useState({
    name: '',
    description: '',
    image: '',
    banner: '',
    status: 'Active' as const,
    isVisible: true,
    isFeatured: false,
    showOnHomepage: true,
    showInMenu: true,
    subCategories: [] as SubCategory[]
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/categories');
      if (!res.ok) throw new Error(`Failed to fetch: ${res.status}`);
      const data = await res.json();
      setCategories(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!selectedCategory) return;
    setIsSaving(true);
    try {
      const res = await fetch(`/api/categories/${selectedCategory.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(selectedCategory)
      });
      if (res.ok) {
        await fetchCategories();
        alert('Category updated successfully!');
      }
    } catch (err) {
      console.error('Failed to save category', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleBulkAction = async (action: 'activate' | 'deactivate' | 'delete') => {
    if (selectedIds.length === 0) return;
    
    if (action === 'delete' && !confirm(`Are you sure you want to delete ${selectedIds.length} categories?`)) return;

    setIsSaving(true);
    try {
      for (const id of selectedIds) {
        if (action === 'delete') {
          await fetch(`/api/categories/${id}`, { method: 'DELETE' });
        } else {
          const status = action === 'activate' ? 'Active' : 'Inactive';
          const isVisible = action === 'activate';
          await fetch(`/api/categories/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status, isVisible })
          });
        }
      }
      await fetchCategories();
      setSelectedIds([]);
      alert(`Bulk ${action} completed!`);
    } catch (err) {
      console.error('Bulk action failed', err);
    } finally {
      setIsSaving(false);
    }
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredCategories.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredCategories.map(c => c.id));
    }
  };

  const toggleSelect = (id: string) => {
    setSelectedIds(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const handleImageUpload = (type: 'image' | 'banner' | 'bannerMobile' | 'icon', file: File) => {
    if (!selectedCategory) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setSelectedCategory({
        ...selectedCategory,
        [type]: reader.result as string
      });
    };
    reader.readAsDataURL(file);
  };

  const addSubCategory = () => {
    if (!selectedCategory) return;
    const newSub: SubCategory = {
      id: `sub-${Date.now()}`,
      name: 'New Subcategory',
      slug: 'new-subcategory',
      parentId: selectedCategory.id,
      isVisible: true,
      status: 'Active',
      image: 'https://picsum.photos/seed/sub/300/300',
      order: (selectedCategory.subCategories?.length || 0) + 1
    };
    setSelectedCategory({
      ...selectedCategory,
      subCategories: [...(selectedCategory.subCategories || []), newSub]
    });
    setEditingSubId(newSub.id);
  };

  const updateSubCategory = (subId: string, updates: Partial<SubCategory>) => {
    if (!selectedCategory) return;
    setSelectedCategory({
      ...selectedCategory,
      subCategories: selectedCategory.subCategories?.map(s => 
        s.id === subId ? { ...s, ...updates } : s
      )
    });
  };

  const deleteSubCategory = (subId: string) => {
    if (!selectedCategory) return;
    if (confirm('Delete this subcategory?')) {
      setSelectedCategory({
        ...selectedCategory,
        subCategories: selectedCategory.subCategories?.filter(s => s.id !== subId)
      });
    }
  };

  const handleCreateNew = async () => {
    if (!newCategoryData.name || !newCategoryData.image || !newCategoryData.banner) {
      alert('Please fill all required fields (Name, Image, and Banner)');
      return;
    }

    setIsSaving(true);
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newCategoryData,
          slug: newCategoryData.name.toLowerCase().replace(/ /g, '-'),
          order: categories.length + 1,
        })
      });
      if (res.ok) {
        const newCat = await res.json();
        await fetchCategories();
        setSelectedCategory(newCat);
        setIsCreateModalOpen(false);
        setNewCategoryData({
          name: '',
          description: '',
          image: '',
          banner: '',
          status: 'Active',
          isVisible: true,
          isFeatured: false,
          showOnHomepage: true,
          showInMenu: true,
          subCategories: []
        });
      }
    } catch (err) {
      console.error('Failed to create category', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleNewCategoryImageUpload = (type: 'image' | 'banner', file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setNewCategoryData(prev => ({
        ...prev,
        [type]: reader.result as string
      }));
    };
    reader.readAsDataURL(file);
  };

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 pb-20">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 sticky top-0 z-10 bg-background/80 backdrop-blur-md py-4 border-b border-border">
        <div>
          <h2 className="text-2xl font-black text-primary uppercase tracking-tight">Category Manager</h2>
          <p className="text-xs text-muted mt-1">Advanced control for store hierarchy, media, and SEO.</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsCreateModalOpen(true)}
            className="px-6 py-3 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2 shadow-lg shadow-active/20"
          >
            <Plus size={18} />
            Add Category
          </button>
        </div>
      </header>

      {/* Create Category Modal */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="p-8 border-b border-gray-100 flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Add New Category</h3>
                  <p className="text-xs text-gray-400 font-bold uppercase tracking-widest mt-1">Create a new product category</p>
                </div>
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="p-2 text-gray-400 hover:text-gray-900 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="p-8 overflow-y-auto custom-scrollbar space-y-8">
                {/* Image Uploads */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                      <ImageIcon size={12} /> Category Image (500x500) *
                    </label>
                    <div 
                      onClick={() => iconRef.current?.click()}
                      className="aspect-square w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-active/50 hover:bg-active/5 transition-all group relative overflow-hidden"
                    >
                      {newCategoryData.image ? (
                        <img src={newCategoryData.image} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload size={24} className="text-gray-300" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Image</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={iconRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleNewCategoryImageUpload('image', e.target.files[0])}
                    />
                  </div>

                  <div className="space-y-4">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2 flex items-center gap-2">
                      <Monitor size={12} /> Banner Image (1300x380) *
                    </label>
                    <div 
                      onClick={() => bannerRef.current?.click()}
                      className="aspect-[13/3.8] w-full bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-active/50 transition-all group relative overflow-hidden"
                    >
                      {newCategoryData.banner ? (
                        <img src={newCategoryData.banner} alt="" className="w-full h-full object-cover" />
                      ) : (
                        <>
                          <Upload size={20} className="text-gray-300" />
                          <span className="text-[10px] font-bold text-gray-400 uppercase">Upload Banner</span>
                        </>
                      )}
                    </div>
                    <input 
                      type="file" 
                      ref={bannerRef} 
                      className="hidden" 
                      accept="image/*"
                      onChange={(e) => e.target.files?.[0] && handleNewCategoryImageUpload('banner', e.target.files[0])}
                    />
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Category Name *</label>
                    <input 
                      type="text"
                      value={newCategoryData.name}
                      onChange={(e) => setNewCategoryData({ ...newCategoryData, name: e.target.value })}
                      placeholder="e.g. Electronics, Fashion"
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-active transition-all"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-widest px-2">Description</label>
                    <textarea 
                      rows={3}
                      value={newCategoryData.description}
                      onChange={(e) => setNewCategoryData({ ...newCategoryData, description: e.target.value })}
                      placeholder="Enter category description..."
                      className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3 text-sm text-gray-900 outline-none focus:border-active transition-all resize-none"
                    />
                  </div>
                </div>
              </div>

              <div className="p-8 bg-gray-50 border-t border-gray-100 flex items-center gap-4">
                <button 
                  onClick={() => setIsCreateModalOpen(false)}
                  className="flex-1 px-6 py-4 bg-white text-gray-600 rounded-2xl text-sm font-bold border border-gray-200 hover:bg-gray-50 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={handleCreateNew}
                  disabled={isSaving}
                  className="flex-1 px-6 py-4 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-active/20"
                >
                  {isSaving ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
                  Save Category
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Bulk Actions Bar */}
      <AnimatePresence>
        {selectedIds.length > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="p-4 bg-active/10 border border-active/20 rounded-2xl flex items-center justify-between gap-4"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-active rounded-lg flex items-center justify-center text-white font-bold text-sm">
                {selectedIds.length}
              </div>
              <span className="text-sm font-bold text-primary">Categories Selected</span>
            </div>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handleBulkAction('activate')}
                className="px-4 py-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl text-xs font-bold hover:bg-emerald-500/20 transition-all"
              >
                Activate
              </button>
              <button 
                onClick={() => handleBulkAction('deactivate')}
                className="px-4 py-2 bg-amber-500/10 text-amber-600 border border-amber-500/20 rounded-xl text-xs font-bold hover:bg-amber-500/20 transition-all"
              >
                Deactivate
              </button>
              <button 
                onClick={() => handleBulkAction('delete')}
                className="px-4 py-2 bg-rose-500/10 text-rose-600 border border-rose-500/20 rounded-xl text-xs font-bold hover:bg-rose-500/20 transition-all"
              >
                Delete
              </button>
              <button 
                onClick={() => setSelectedIds([])}
                className="p-2 text-muted hover:text-primary transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Category List Section */}
        <div className="lg:col-span-5 space-y-6">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={18} />
              <input 
                type="text"
                placeholder="Search categories..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-12 pl-12 pr-4 bg-surface border border-border rounded-2xl text-sm text-primary outline-none focus:border-active transition-all"
              />
            </div>
            <button 
              onClick={toggleSelectAll}
              className={`p-3 rounded-2xl border transition-all ${selectedIds.length === filteredCategories.length ? 'bg-active border-active text-white' : 'bg-surface border-border text-muted'}`}
            >
              <CheckCircle2 size={20} />
            </button>
          </div>

          <div className="space-y-3 max-h-[calc(100vh-300px)] overflow-y-auto pr-2 custom-scrollbar">
            {filteredCategories.map((category) => (
              <div 
                key={category.id}
                onClick={() => setSelectedCategory(category)}
                className={`group p-4 bg-surface border rounded-2xl transition-all cursor-pointer relative ${selectedCategory?.id === category.id ? 'border-active ring-1 ring-active' : 'border-border hover:border-active/30'}`}
              >
                <div className="flex items-center gap-4">
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleSelect(category.id); }}
                    className={`w-5 h-5 rounded border transition-all flex items-center justify-center ${selectedIds.includes(category.id) ? 'bg-active border-active text-white' : 'border-border text-transparent'}`}
                  >
                    <Check size={12} />
                  </button>
                  <div className="w-12 h-12 bg-hover rounded-xl overflow-hidden flex-shrink-0 border border-border">
                    <img src={category.image} alt="" className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-sm font-bold text-primary truncate">{category.name}</h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-black uppercase ${category.status === 'Active' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-rose-500/10 text-rose-600'}`}>
                        {category.status}
                      </span>
                      <span className="text-[10px] text-muted uppercase tracking-widest">
                        {category.subCategories?.length || 0} Subs
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        if (confirm(`Are you sure you want to delete ${category.name}?`)) {
                          fetch(`/api/categories/${category.id}`, { method: 'DELETE' }).then(() => fetchCategories());
                        }
                      }}
                      className="p-2 text-muted hover:text-rose-600 transition-colors opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                    <ChevronRight size={18} className={`text-muted transition-transform ${selectedCategory?.id === category.id ? 'rotate-90 text-active' : ''}`} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Details Panel Section */}
        <div className="lg:col-span-7">
          <AnimatePresence mode="wait">
            {selectedCategory ? (
              <motion.div 
                key={selectedCategory.id}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="bg-surface border border-border rounded-[40px] overflow-hidden flex flex-col h-full shadow-sm"
              >
                {/* Panel Header */}
                <div className="p-6 border-b border-border flex items-center justify-between bg-hover/30">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-active/10 rounded-2xl flex items-center justify-center text-active">
                      <Settings size={24} />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-primary uppercase tracking-tight">{selectedCategory.name}</h3>
                      <p className="text-[10px] text-muted uppercase tracking-widest">ID: {selectedCategory.id}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button 
                      onClick={handleSave}
                      disabled={isSaving}
                      className="px-4 py-2 bg-active text-white rounded-xl text-xs font-bold hover:bg-active/90 transition-all flex items-center gap-2"
                    >
                      {isSaving ? <RefreshCw size={14} className="animate-spin" /> : <Save size={14} />}
                      Save Changes
                    </button>
                    <button onClick={() => setSelectedCategory(null)} className="p-2 text-muted hover:text-primary transition-colors">
                      <X size={20} />
                    </button>
                  </div>
                </div>

                {/* Tabs Navigation */}
                <div className="flex border-b border-border px-6">
                  {[
                    { id: 'general', label: 'General', icon: Layout },
                    { id: 'media', label: 'Media', icon: ImageIcon },
                    { id: 'seo', label: 'SEO', icon: Globe },
                    { id: 'display', label: 'Display', icon: Monitor },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as TabType)}
                      className={`flex items-center gap-2 px-6 py-4 text-xs font-bold uppercase tracking-widest transition-all relative ${activeTab === tab.id ? 'text-active' : 'text-muted hover:text-primary'}`}
                    >
                      <tab.icon size={14} />
                      {tab.label}
                      {activeTab === tab.id && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-0.5 bg-active" />
                      )}
                    </button>
                  ))}
                </div>

                {/* Tab Content */}
                <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
                  {activeTab === 'general' && (
                    <div className="space-y-8">
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Category Name</label>
                          <input 
                            type="text"
                            value={selectedCategory.name}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, name: e.target.value })}
                            className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">URL Slug</label>
                          <input 
                            type="text"
                            value={selectedCategory.slug}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, slug: e.target.value })}
                            className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Description</label>
                        <textarea 
                          rows={3}
                          value={selectedCategory.description || ''}
                          onChange={(e) => setSelectedCategory({ ...selectedCategory, description: e.target.value })}
                          className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Status</label>
                          <select 
                            value={selectedCategory.status}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, status: e.target.value as any })}
                            className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all appearance-none"
                          >
                            <option value="Active">Active</option>
                            <option value="Inactive">Inactive</option>
                          </select>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Display Order</label>
                          <input 
                            type="number"
                            value={selectedCategory.order || 0}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, order: parseInt(e.target.value) })}
                            className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                          />
                        </div>
                      </div>

                      {/* Subcategories Section */}
                      <div className="space-y-4">
                        <div className="flex items-center justify-between px-2">
                          <h4 className="text-xs font-bold text-primary uppercase tracking-widest">Sub-Categories</h4>
                          <button 
                            onClick={addSubCategory}
                            className="flex items-center gap-1 text-[10px] font-bold text-active uppercase tracking-widest hover:underline"
                          >
                            <Plus size={12} /> Add New Sub
                          </button>
                        </div>

                        <div className="space-y-3">
                          {selectedCategory.subCategories?.map((sub) => (
                            <div key={sub.id} className="p-4 bg-hover/50 border border-border rounded-2xl space-y-4">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl overflow-hidden bg-hover border border-border">
                                    <img src={sub.image} alt="" className="w-full h-full object-cover" />
                                  </div>
                                  <div>
                                    <div className="text-sm font-bold text-primary">{sub.name}</div>
                                    <div className="text-[10px] text-muted uppercase tracking-widest">{sub.status}</div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-2">
                                  <button 
                                    onClick={() => setEditingSubId(editingSubId === sub.id ? null : sub.id)}
                                    className="p-2 text-muted hover:text-active transition-colors"
                                  >
                                    <Edit3 size={16} />
                                  </button>
                                  <button 
                                    onClick={() => deleteSubCategory(sub.id)}
                                    className="p-2 text-muted hover:text-rose-600 transition-colors"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </div>
                              </div>

                              {editingSubId === sub.id && (
                                <motion.div 
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: 'auto', opacity: 1 }}
                                  className="space-y-4 pt-4 border-t border-border"
                                >
                                  <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-bold text-muted uppercase">Sub Name</label>
                                      <input 
                                        type="text"
                                        value={sub.name}
                                        onChange={(e) => updateSubCategory(sub.id, { name: e.target.value })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-primary"
                                      />
                                    </div>
                                    <div className="space-y-1">
                                      <label className="text-[8px] font-bold text-muted uppercase">Status</label>
                                      <select 
                                        value={sub.status}
                                        onChange={(e) => updateSubCategory(sub.id, { status: e.target.value as any })}
                                        className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-primary"
                                      >
                                        <option value="Active">Active</option>
                                        <option value="Inactive">Inactive</option>
                                      </select>
                                    </div>
                                  </div>
                                  <div className="space-y-1">
                                    <label className="text-[8px] font-bold text-muted uppercase">Image URL</label>
                                    <input 
                                      type="text"
                                      value={sub.image || ''}
                                      onChange={(e) => updateSubCategory(sub.id, { image: e.target.value })}
                                      className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs text-primary"
                                    />
                                  </div>
                                </motion.div>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'media' && (
                    <div className="space-y-8">
                      {/* Main Category Image */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Category Image (500x500px)</label>
                        <div 
                          onClick={() => fileInputRef.current?.click()}
                          className="aspect-square w-48 bg-hover border-2 border-dashed border-border rounded-[32px] flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-active/50 hover:bg-active/5 transition-all group relative overflow-hidden"
                        >
                          {selectedCategory.image ? (
                            <>
                              <img src={selectedCategory.image} alt="" className="w-full h-full object-cover" />
                              <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                <Upload size={24} className="text-white" />
                                <span className="text-[10px] font-bold text-white uppercase">Change Image</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="w-12 h-12 bg-surface rounded-2xl flex items-center justify-center text-muted">
                                <Upload size={24} />
                              </div>
                              <span className="text-[10px] font-bold text-muted uppercase">Upload Image</span>
                            </>
                          )}
                        </div>
                        <input 
                          type="file" 
                          ref={fileInputRef} 
                          className="hidden" 
                          accept="image/*"
                          onChange={(e) => e.target.files?.[0] && handleImageUpload('image', e.target.files[0])}
                        />
                      </div>

                      {/* Banners */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2 flex items-center gap-2">
                            <Monitor size={12} /> Desktop Banner (1200x400px)
                          </label>
                          <div 
                            onClick={() => bannerRef.current?.click()}
                            className="aspect-[3/1] w-full bg-hover border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-active/50 transition-all group relative overflow-hidden"
                          >
                            {selectedCategory.banner ? (
                              <img src={selectedCategory.banner} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Upload size={20} className="text-muted" />
                            )}
                          </div>
                          <input 
                            type="file" 
                            ref={bannerRef} 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && handleImageUpload('banner', e.target.files[0])}
                          />
                        </div>

                        <div className="space-y-4">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2 flex items-center gap-2">
                            <Smartphone size={12} /> Mobile Banner (800x400px)
                          </label>
                          <div 
                            onClick={() => mobileBannerRef.current?.click()}
                            className="aspect-[2/1] w-full bg-hover border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center gap-2 cursor-pointer hover:border-active/50 transition-all group relative overflow-hidden"
                          >
                            {selectedCategory.bannerMobile ? (
                              <img src={selectedCategory.bannerMobile} alt="" className="w-full h-full object-cover" />
                            ) : (
                              <Upload size={20} className="text-muted" />
                            )}
                          </div>
                          <input 
                            type="file" 
                            ref={mobileBannerRef} 
                            className="hidden" 
                            onChange={(e) => e.target.files?.[0] && handleImageUpload('bannerMobile', e.target.files[0])}
                          />
                        </div>
                      </div>

                      {/* Icon */}
                      <div className="space-y-4">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Category Icon (SVG/PNG)</label>
                        <div className="flex items-center gap-4">
                          <div 
                            onClick={() => iconRef.current?.click()}
                            className="w-16 h-16 bg-hover border-2 border-dashed border-border rounded-2xl flex items-center justify-center cursor-pointer hover:border-active/50 transition-all"
                          >
                            {selectedCategory.icon ? (
                              <span className="text-2xl">{selectedCategory.icon}</span>
                            ) : (
                              <Tag size={20} className="text-muted" />
                            )}
                          </div>
                          <div className="flex-1">
                            <input 
                              type="text"
                              placeholder="Or enter emoji/icon class..."
                              value={selectedCategory.icon || ''}
                              onChange={(e) => setSelectedCategory({ ...selectedCategory, icon: e.target.value })}
                              className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-sm text-primary outline-none focus:border-active"
                            />
                          </div>
                        </div>
                        <input type="file" ref={iconRef} className="hidden" />
                      </div>
                    </div>
                  )}

                  {activeTab === 'seo' && (
                    <div className="space-y-8">
                      <div className="p-6 bg-active/5 border border-active/10 rounded-3xl space-y-4">
                        <h4 className="text-sm font-bold text-active flex items-center gap-2">
                          <Globe size={16} /> Google Search Preview
                        </h4>
                        <div className="space-y-1">
                          <div className="text-blue-600 text-lg font-medium hover:underline cursor-pointer truncate">
                            {selectedCategory.seoTitle || selectedCategory.name} | Tazu Mart BD
                          </div>
                          <div className="text-emerald-600 text-xs truncate">
                            https://tazumart.com.bd/category/{selectedCategory.slug}
                          </div>
                          <div className="text-muted text-xs line-clamp-2">
                            {selectedCategory.seoDescription || 'Shop the best products in ' + selectedCategory.name + ' at Tazu Mart BD. High quality and fast delivery across Bangladesh.'}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">SEO Title</label>
                          <input 
                            type="text"
                            value={selectedCategory.seoTitle || ''}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, seoTitle: e.target.value })}
                            className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                            placeholder="Meta title for search engines"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">SEO Description</label>
                          <textarea 
                            rows={4}
                            value={selectedCategory.seoDescription || ''}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, seoDescription: e.target.value })}
                            className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all resize-none"
                            placeholder="Meta description for search engines"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">SEO Keywords</label>
                          <input 
                            type="text"
                            value={selectedCategory.seoKeywords || ''}
                            onChange={(e) => setSelectedCategory({ ...selectedCategory, seoKeywords: e.target.value })}
                            className="w-full bg-surface border border-border rounded-2xl px-4 py-3 text-sm text-primary outline-none focus:border-active transition-all"
                            placeholder="e.g. fashion, clothing, online shopping bd"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === 'display' && (
                    <div className="space-y-6">
                      {[
                        { id: 'isVisible', label: 'Visible on Frontend', desc: 'Show this category to customers', icon: Eye },
                        { id: 'isFeatured', label: 'Featured Category', desc: 'Highlight in featured sections', icon: Star },
                        { id: 'showOnHomepage', label: 'Show on Homepage', desc: 'Display in homepage category grid', icon: Layout },
                        { id: 'showInMenu', label: 'Show in Menu', desc: 'Display in main navigation menu', icon: MoreVertical },
                      ].map((setting) => (
                        <div key={setting.id} className="flex items-center justify-between p-6 bg-hover/30 border border-border rounded-3xl">
                          <div className="flex items-center gap-4">
                            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${(selectedCategory as any)[setting.id] ? 'bg-active/20 text-active' : 'bg-surface text-muted'}`}>
                              <setting.icon size={20} />
                            </div>
                            <div>
                              <div className="text-sm font-bold text-primary">{setting.label}</div>
                              <div className="text-[10px] text-muted uppercase tracking-widest">{setting.desc}</div>
                            </div>
                          </div>
                          <button 
                            onClick={() => setSelectedCategory({ ...selectedCategory, [setting.id]: !(selectedCategory as any)[setting.id] })}
                            className={`w-14 h-7 rounded-full transition-all relative ${(selectedCategory as any)[setting.id] ? 'bg-active' : 'bg-muted/20'}`}
                          >
                            <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-all ${(selectedCategory as any)[setting.id] ? 'left-8' : 'left-1'}`} />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-12 bg-hover/20 border border-dashed border-border rounded-[40px] text-center space-y-4">
                <div className="w-20 h-20 bg-surface rounded-[32px] flex items-center justify-center text-muted/20 border border-border">
                  <Layers size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-primary uppercase tracking-tight">No Category Selected</h3>
                  <p className="text-xs text-muted max-w-[240px] mx-auto mt-2">Select a category from the list to manage its advanced settings, media, and SEO.</p>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
