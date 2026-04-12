import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Search, 
  Filter, 
  MoreVertical, 
  Edit2, 
  Trash2, 
  Eye, 
  MousePointer2,
  Calendar,
  Image as ImageIcon,
  Check,
  X,
  Zap,
  Tag,
  Percent,
  Layout,
  BarChart3,
  ArrowUpRight
} from 'lucide-react';
import { Offer, Product } from '../../types';

export default function OfferManager() {
  const [offers, setOffers] = useState<Offer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Partial<Offer> | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<'list' | 'analytics'>('list');

  useEffect(() => {
    fetchOffers();
    fetchProducts();
  }, []);

  const fetchOffers = async () => {
    try {
      const res = await fetch('/api/offers');
      const data = await res.json();
      setOffers(data);
    } catch (error) {
      console.error('Fetch Offers Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error('Fetch Products Error:', error);
    }
  };

  const handleSaveOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingOffer) return;

    const method = editingOffer.id ? 'PUT' : 'POST';
    const url = editingOffer.id ? `/api/offers/${editingOffer.id}` : '/api/offers';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingOffer)
      });
      if (res.ok) {
        fetchOffers();
        setIsModalOpen(false);
        setEditingOffer(null);
      }
    } catch (error) {
      console.error('Save Offer Error:', error);
    }
  };

  const handleDeleteOffer = async (id: string) => {
    if (!confirm('Are you sure you want to delete this offer?')) return;
    try {
      await fetch(`/api/offers/${id}`, { method: 'DELETE' });
      fetchOffers();
    } catch (error) {
      console.error('Delete Offer Error:', error);
    }
  };

  const filteredOffers = offers.filter(o => 
    o.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    o.type.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight">Offer Manager</h2>
          <p className="text-secondary text-sm">Manage dynamic offers and floating buttons</p>
        </div>
        <button 
          onClick={() => {
            setEditingOffer({
              status: 'Active',
              priority: 1,
              showOnFloatingButton: true,
              showOnHomepage: true,
              showOnBanner: true,
              type: 'Flash Sale',
              discountType: 'Percentage'
            });
            setIsModalOpen(true);
          }}
          className="flex items-center gap-2 px-6 py-3 bg-active text-white rounded-2xl font-bold shadow-lg shadow-active/20 hover:scale-105 transition-transform"
        >
          <Plus size={20} />
          Create New Offer
        </button>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl w-fit">
        <button
          onClick={() => setActiveTab('list')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'list' ? 'bg-white text-black shadow-lg' : 'text-secondary hover:text-primary'
          }`}
        >
          Offer List
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-6 py-2 rounded-xl text-sm font-bold transition-all ${
            activeTab === 'analytics' ? 'bg-white text-black shadow-lg' : 'text-secondary hover:text-primary'
          }`}
        >
          Analytics
        </button>
      </div>

      {activeTab === 'list' ? (
        <div className="space-y-4">
          {/* Search & Filter */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={20} />
              <input
                type="text"
                placeholder="Search offers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-active transition-all"
              />
            </div>
            <button className="p-3 bg-white/5 border border-white/10 rounded-2xl text-secondary hover:text-primary transition-colors">
              <Filter size={20} />
            </button>
          </div>

          {/* Offer Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredOffers.map((offer) => (
              <motion.div
                key={offer.id}
                layout
                className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:border-active/50 transition-all"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="w-16 h-16 bg-white rounded-2xl p-1 shadow-xl border border-white/10">
                      <img 
                        src={offer.image} 
                        alt={offer.name} 
                        className="w-full h-full object-cover rounded-xl"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button 
                        onClick={() => {
                          setEditingOffer(offer);
                          setIsModalOpen(true);
                        }}
                        className="p-2 bg-white/5 rounded-xl text-secondary hover:text-active hover:bg-active/10 transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button 
                        onClick={() => handleDeleteOffer(offer.id)}
                        className="p-2 bg-white/5 rounded-xl text-secondary hover:text-red-500 hover:bg-red-500/10 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 bg-active/10 text-active text-[10px] font-bold rounded-full uppercase">
                          {offer.type}
                        </span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full uppercase ${
                          offer.status === 'Active' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'
                        }`}>
                          {offer.status}
                        </span>
                      </div>
                      <h3 className="text-lg font-bold">{offer.name}</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="bg-white/5 p-3 rounded-2xl">
                        <div className="flex items-center gap-2 text-secondary text-[10px] font-bold uppercase mb-1">
                          <Eye size={12} /> Views
                        </div>
                        <p className="text-lg font-black">{offer.views.toLocaleString()}</p>
                      </div>
                      <div className="bg-white/5 p-3 rounded-2xl">
                        <div className="flex items-center gap-2 text-secondary text-[10px] font-bold uppercase mb-1">
                          <MousePointer2 size={12} /> Clicks
                        </div>
                        <p className="text-lg font-black">{offer.clicks.toLocaleString()}</p>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {offer.showOnFloatingButton && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-white/5 text-[10px] font-bold text-secondary rounded-lg">
                          <Zap size={10} /> Floating
                        </span>
                      )}
                      {offer.showOnHomepage && (
                        <span className="flex items-center gap-1 px-2 py-1 bg-white/5 text-[10px] font-bold text-secondary rounded-lg">
                          <Layout size={10} /> Homepage
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      ) : (
        <div className="bg-white/5 border border-white/10 rounded-[32px] p-8">
          <div className="flex items-center gap-4 mb-8">
            <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
              <BarChart3 size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold">Performance Overview</h3>
              <p className="text-secondary text-sm">Track how your offers are performing</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
              <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Total Views</p>
              <p className="text-3xl font-black">{offers.reduce((sum, o) => sum + o.views, 0).toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
              <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Total Clicks</p>
              <p className="text-3xl font-black">{offers.reduce((sum, o) => sum + o.clicks, 0).toLocaleString()}</p>
            </div>
            <div className="bg-white/5 p-6 rounded-[32px] border border-white/10">
              <p className="text-secondary text-xs font-bold uppercase tracking-widest mb-2">Avg. CTR</p>
              <p className="text-3xl font-black">
                {((offers.reduce((sum, o) => sum + o.clicks, 0) / (offers.reduce((sum, o) => sum + o.views, 0) || 1)) * 100).toFixed(2)}%
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="font-bold text-sm uppercase tracking-widest text-secondary">Top Performing Offers</h4>
            <div className="space-y-2">
              {[...offers].sort((a, b) => b.clicks - a.clicks).map((offer, idx) => (
                <div key={offer.id} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <span className="text-secondary font-bold w-6">#{idx + 1}</span>
                  <img src={offer.image} className="w-10 h-10 rounded-lg object-cover" referrerPolicy="no-referrer" />
                  <div className="flex-1">
                    <p className="font-bold text-sm">{offer.name}</p>
                    <p className="text-[10px] text-secondary uppercase">{offer.type}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-black text-active">{offer.clicks} clicks</p>
                    <p className="text-[10px] text-secondary">{((offer.clicks / (offer.views || 1)) * 100).toFixed(1)}% CTR</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="bg-[#0B1120] border border-white/10 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-[40px] shadow-2xl"
            >
              <form onSubmit={handleSaveOffer} className="p-8 space-y-8">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-black tracking-tight">
                    {editingOffer?.id ? 'Edit Offer' : 'Create New Offer'}
                  </h3>
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 hover:bg-white/5 rounded-full transition-colors"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Basic Info */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Offer Name</label>
                      <input
                        required
                        type="text"
                        value={editingOffer?.name || ''}
                        onChange={(e) => setEditingOffer(prev => ({ ...prev!, name: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-active transition-all"
                        placeholder="e.g. Mega Sale"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Offer Type</label>
                      <select
                        value={editingOffer?.type || ''}
                        onChange={(e) => setEditingOffer(prev => ({ ...prev!, type: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-active transition-all appearance-none"
                      >
                        <option value="Flash Sale">Flash Sale</option>
                        <option value="Discount Offer">Discount Offer</option>
                        <option value="Today Deal">Today Deal</option>
                        <option value="Special Offer">Special Offer</option>
                        <option value="Limited Time Deal">Limited Time Deal</option>
                        <option value="Ramadan Offer">Ramadan Offer</option>
                        <option value="Eid Offer">Eid Offer</option>
                        <option value="Clearance Sale">Clearance Sale</option>
                        <option value="Hot Deal">Hot Deal</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Offer Image URL</label>
                      <div className="flex gap-2">
                        <input
                          required
                          type="text"
                          value={editingOffer?.image || ''}
                          onChange={(e) => setEditingOffer(prev => ({ ...prev!, image: e.target.value }))}
                          className="flex-1 bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-active transition-all"
                          placeholder="https://..."
                        />
                        <div className="w-12 h-12 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center overflow-hidden">
                          {editingOffer?.image ? (
                            <img src={editingOffer.image} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                          ) : (
                            <ImageIcon size={20} className="text-secondary" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Settings */}
                  <div className="space-y-4">
                    <div>
                      <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Discount Settings</label>
                      <div className="flex gap-2 p-1 bg-white/5 rounded-2xl mb-2">
                        <button
                          type="button"
                          onClick={() => setEditingOffer(prev => ({ ...prev!, discountType: 'Percentage' }))}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${
                            editingOffer?.discountType === 'Percentage' ? 'bg-active text-white' : 'text-secondary'
                          }`}
                        >
                          PERCENTAGE
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingOffer(prev => ({ ...prev!, discountType: 'Fixed' }))}
                          className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${
                            editingOffer?.discountType === 'Fixed' ? 'bg-active text-white' : 'text-secondary'
                          }`}
                        >
                          FIXED AMOUNT
                        </button>
                      </div>
                      <input
                        type="number"
                        value={editingOffer?.discountValue || ''}
                        onChange={(e) => setEditingOffer(prev => ({ ...prev!, discountValue: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-active transition-all"
                        placeholder={editingOffer?.discountType === 'Percentage' ? 'e.g. 50 (%)' : 'e.g. 200 (৳)'}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Priority (1-10)</label>
                      <input
                        type="number"
                        min="1"
                        max="10"
                        value={editingOffer?.priority || 1}
                        onChange={(e) => setEditingOffer(prev => ({ ...prev!, priority: Number(e.target.value) }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Target Link</label>
                      <input
                        type="text"
                        value={editingOffer?.link || ''}
                        onChange={(e) => setEditingOffer(prev => ({ ...prev!, link: e.target.value }))}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-active transition-all"
                        placeholder="/category/electronics"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">Start Date</label>
                        <input
                          type="datetime-local"
                          value={editingOffer?.startDate ? new Date(editingOffer.startDate).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setEditingOffer(prev => ({ ...prev!, startDate: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-active transition-all text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-secondary uppercase tracking-widest mb-2">End Date</label>
                        <input
                          type="datetime-local"
                          value={editingOffer?.endDate ? new Date(editingOffer.endDate).toISOString().slice(0, 16) : ''}
                          onChange={(e) => setEditingOffer(prev => ({ ...prev!, endDate: e.target.value }))}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 outline-none focus:border-active transition-all text-xs"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Product Selection */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest">Associated Products</label>
                  <div className="space-y-2">
                    <div className="relative">
                      <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
                      <input
                        type="text"
                        placeholder="Search products to add..."
                        className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 outline-none focus:border-active transition-all text-sm"
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') {
                            e.preventDefault();
                            const query = (e.target as HTMLInputElement).value.toLowerCase();
                            const found = products.find(p => p.name.toLowerCase().includes(query));
                            if (found && !editingOffer?.productIds?.includes(found.id)) {
                              setEditingOffer(prev => ({
                                ...prev!,
                                productIds: [...(prev!.productIds || []), found.id]
                              }));
                              (e.target as HTMLInputElement).value = '';
                            }
                          }
                        }}
                      />
                    </div>
                    <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto p-2 bg-white/5 rounded-2xl border border-white/10">
                      {editingOffer?.productIds?.map(pid => {
                        const p = products.find(prod => prod.id === pid);
                        return (
                          <div key={pid} className="flex items-center gap-2 px-3 py-1.5 bg-active/10 text-active rounded-xl text-xs font-bold border border-active/20">
                            <span className="truncate max-w-[150px]">{p?.name || pid}</span>
                            <button 
                              type="button"
                              onClick={() => setEditingOffer(prev => ({
                                ...prev!,
                                productIds: prev!.productIds?.filter(id => id !== pid)
                              }))}
                              className="hover:text-red-500 transition-colors"
                            >
                              <X size={14} />
                            </button>
                          </div>
                        );
                      })}
                      {(!editingOffer?.productIds || editingOffer.productIds.length === 0) && (
                        <p className="text-[10px] text-secondary font-medium w-full text-center py-2 italic">No products selected. Search and press Enter to add.</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Display Controls */}
                <div className="space-y-4">
                  <label className="block text-xs font-bold text-secondary uppercase tracking-widest">Display Locations</label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {[
                      { key: 'showOnFloatingButton', label: 'Floating Button', icon: Zap },
                      { key: 'showOnHomepage', label: 'Homepage Section', icon: Layout },
                      { key: 'showOnBanner', label: 'Top Banner', icon: ImageIcon },
                    ].map((loc) => (
                      <button
                        key={loc.key}
                        type="button"
                        onClick={() => setEditingOffer(prev => ({ ...prev!, [loc.key]: !prev![loc.key as keyof Offer] }))}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all ${
                          editingOffer?.[loc.key as keyof Offer]
                            ? 'bg-active/10 border-active text-active'
                            : 'bg-white/5 border-white/10 text-secondary hover:border-white/20'
                        }`}
                      >
                        <loc.icon size={20} />
                        <span className="text-xs font-bold">{loc.label}</span>
                        {editingOffer?.[loc.key as keyof Offer] && <Check size={16} className="ml-auto" />}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Status Toggle */}
                <div className="flex items-center justify-between p-6 bg-white/5 rounded-[32px] border border-white/10">
                  <div>
                    <h4 className="font-bold">Offer Status</h4>
                    <p className="text-xs text-secondary">Enable or disable this offer across the platform</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setEditingOffer(prev => ({ ...prev!, status: prev!.status === 'Active' ? 'Inactive' : 'Active' }))}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      editingOffer?.status === 'Active' ? 'bg-green-500' : 'bg-gray-600'
                    }`}
                  >
                    <motion.div
                      animate={{ x: editingOffer?.status === 'Active' ? 24 : 4 }}
                      className="absolute top-1 w-6 h-6 bg-white rounded-full shadow-lg"
                    />
                  </button>
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-4 bg-white/5 hover:bg-white/10 rounded-2xl font-bold transition-all"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-2 py-4 bg-active text-white rounded-2xl font-black shadow-xl shadow-active/20 hover:scale-[1.02] transition-all"
                  >
                    {editingOffer?.id ? 'Update Offer' : 'Create Offer'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
