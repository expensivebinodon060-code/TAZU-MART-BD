import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Search, 
  Plus, 
  MoreVertical, 
  ChevronRight,
  ChevronLeft,
  X,
  Upload,
  Download,
  Edit3,
  Trash2,
  Eye,
  Check,
  ChevronDown
} from 'lucide-react';
import { Product, Category } from '../../types';
import ProductForm from './ProductForm';

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState<'All Data' | 'Publish' | 'Draft'>('All Data');
  
  // Form Modal
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  
  // Selection
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  
  // Action Menu
  const [openActionMenuId, setOpenActionMenuId] = useState<string | null>(null);
  
  // Delete Modal
  const [productToDelete, setProductToDelete] = useState<Product | null>(null);
  
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/products');
      const data = await res.json();
      setProducts(data);
    } catch (err) {
      console.error('Failed to fetch products', err);
    } finally {
      setIsLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch('/api/categories');
      if (res.ok) {
        const data = await res.json();
        setCategories(data);
      }
    } catch (err) {
      console.error('Failed to fetch categories', err);
    }
  };

  const handleDelete = async () => {
    if (!productToDelete) return;
    
    try {
      const res = await fetch(`/api/admin/products/${productToDelete.id}`, { method: 'DELETE' });
      if (res.ok) {
        setProducts(prev => prev.filter(p => p.id !== productToDelete.id));
        setProductToDelete(null);
      }
    } catch (err) {
      console.error('Failed to delete product', err);
    }
  };

  const togglePublishStatus = async (product: Product) => {
    const newStatus = product.publishStatus === 'Published' ? 'Draft' : 'Published';
    
    // Optimistic update
    setProducts(prev => prev.map(p => 
      p.id === product.id ? { ...p, publishStatus: newStatus } : p
    ));
    
    try {
      await fetch(`/api/admin/products/${product.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ publishStatus: newStatus })
      });
    } catch (err) {
      console.error('Failed to update status', err);
      // Revert on failure
      setProducts(prev => prev.map(p => 
        p.id === product.id ? { ...p, publishStatus: product.publishStatus } : p
      ));
    }
    setOpenActionMenuId(null);
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === currentItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(currentItems.map(p => p.id)));
    }
  };

  const toggleSelect = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setSelectedIds(newSet);
  };

  // Filtering
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (p.sku && p.sku.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (!matchesSearch) return false;
    
    if (activeTab === 'Publish') return p.publishStatus === 'Published';
    if (activeTab === 'Draft') return p.publishStatus === 'Draft';
    return true;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentItems = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="space-y-6 pb-20">
      {/* Header */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-[#1A1A1A]">Product</h1>
          <div className="text-sm text-[#6B7280] mt-1 flex items-center gap-2">
            <span>Dashboard</span>
            <ChevronRight size={14} />
            <span className="text-[#1A1A1A] font-medium">Product</span>
          </div>
        </div>
      </header>

      {/* Control Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          
          {/* Left: Search & Tabs */}
          <div className="flex flex-col sm:flex-row sm:items-center gap-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-[#6B7280]" size={18} />
              <input 
                type="text" 
                placeholder="Search product name, SKU..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-[#F8F9FB] border border-gray-200 rounded-lg text-sm text-[#1A1A1A] focus:ring-2 focus:ring-[#FF6A00]/20 focus:border-[#FF6A00] outline-none w-full sm:w-64 transition-all"
              />
            </div>
            
            <div className="flex items-center gap-6 border-b border-gray-100">
              {['All Data', 'Publish', 'Draft'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setActiveTab(tab as any);
                    setCurrentPage(1);
                  }}
                  className={`pb-3 text-sm font-medium transition-all relative ${
                    activeTab === tab 
                      ? 'text-[#FF6A00]' 
                      : 'text-[#6B7280] hover:text-[#1A1A1A]'
                  }`}
                >
                  {tab}
                  {activeTab === tab && (
                    <motion.div 
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#FF6A00]"
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Buttons */}
          <div className="flex items-center gap-3">
            <AnimatePresence>
              {selectedIds.size > 0 && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex items-center gap-2 mr-2"
                >
                  <button 
                    onClick={() => {
                      // Bulk Publish
                      setProducts(prev => prev.map(p => 
                        selectedIds.has(p.id) ? { ...p, publishStatus: 'Published' } : p
                      ));
                      setSelectedIds(new Set());
                    }}
                    className="px-3 py-2 bg-[#E6F9F0] text-[#00A86B] rounded-lg text-sm font-medium hover:bg-[#d1f4e0] transition-all flex items-center gap-1"
                  >
                    <Check size={14} /> Publish ({selectedIds.size})
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm(`Are you sure you want to delete ${selectedIds.size} products?`)) {
                        setProducts(prev => prev.filter(p => !selectedIds.has(p.id)));
                        setSelectedIds(new Set());
                      }
                    }}
                    className="px-3 py-2 bg-red-50 text-[#FF3B30] rounded-lg text-sm font-medium hover:bg-red-100 transition-all flex items-center gap-1"
                  >
                    <Trash2 size={14} /> Delete ({selectedIds.size})
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <button className="px-4 py-2.5 border border-gray-200 text-[#1A1A1A] rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2">
              <Download size={16} />
              <span className="hidden sm:inline">Import</span>
            </button>
            <button className="px-4 py-2.5 border border-gray-200 text-[#1A1A1A] rounded-lg text-sm font-medium hover:bg-gray-50 transition-all flex items-center gap-2">
              <Upload size={16} />
              <span className="hidden sm:inline">Export CSV</span>
            </button>
            <button 
              onClick={() => {
                setEditingProduct(null);
                setIsFormOpen(true);
              }}
              className="px-5 py-2.5 bg-[#FF6A00] text-white rounded-[10px] text-sm font-medium hover:bg-[#e65f00] transition-all flex items-center gap-2 shadow-sm shadow-[#FF6A00]/20"
            >
              <Plus size={18} />
              Add Product
            </button>
          </div>
        </div>
      </div>

      {/* Desktop Data Table */}
      <div className="hidden lg:block bg-white border border-gray-100 rounded-xl shadow-sm overflow-visible relative z-10">
        <div className="overflow-x-auto overflow-y-visible">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#F8F9FB] border-b border-gray-100">
                <th className="px-4 py-4 w-12 text-center">
                  <input 
                    type="checkbox" 
                    checked={selectedIds.size === currentItems.length && currentItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-[#FF6A00] focus:ring-[#FF6A00]/20 w-4 h-4 cursor-pointer" 
                  />
                </th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">SL</th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Image</th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Name</th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Category</th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Sub Category</th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Priority</th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Tags</th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider">Status</th>
                <th className="px-4 py-4 text-xs font-semibold text-[#6B7280] uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-[#6B7280]">Loading products...</td>
                </tr>
              ) : currentItems.length === 0 ? (
                <tr>
                  <td colSpan={10} className="px-4 py-12 text-center text-[#6B7280]">No products found.</td>
                </tr>
              ) : currentItems.map((product, index) => (
                <tr key={product.id} className="hover:bg-[#F9FAFB] transition-colors group">
                  <td className="px-4 py-4 text-center">
                    <input 
                      type="checkbox" 
                      checked={selectedIds.has(product.id)}
                      onChange={() => toggleSelect(product.id)}
                      className="rounded border-gray-300 text-[#FF6A00] focus:ring-[#FF6A00]/20 w-4 h-4 cursor-pointer" 
                    />
                  </td>
                  <td className="px-4 py-4 text-sm text-[#6B7280]">{startIndex + index + 1}</td>
                  <td className="px-4 py-4">
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      loading="lazy"
                      className="w-10 h-10 rounded-lg object-cover border border-gray-100" 
                    />
                  </td>
                  <td className="px-4 py-4">
                    <div className="text-sm font-bold text-[#1A1A1A] line-clamp-1 max-w-[200px]">{product.name}</div>
                    {product.sku && <div className="text-xs text-[#6B7280] mt-0.5">{product.sku}</div>}
                  </td>
                  <td className="px-4 py-4 text-sm text-[#1A1A1A]">{product.category}</td>
                  <td className="px-4 py-4 text-sm text-[#6B7280]">-</td>
                  <td className="px-4 py-4 text-sm text-[#1A1A1A]">{product.featuredOrder || 0}</td>
                  <td className="px-4 py-4">
                    {product.tags && product.tags.length > 0 ? (
                      <div className="flex flex-wrap gap-1">
                        {product.tags.slice(0, 2).map(tag => (
                          <span key={tag} className="px-2 py-0.5 bg-gray-100 text-[#6B7280] rounded text-[10px] whitespace-nowrap">
                            {tag}
                          </span>
                        ))}
                        {product.tags.length > 2 && (
                          <span className="px-2 py-0.5 bg-gray-100 text-[#6B7280] rounded text-[10px]">
                            +{product.tags.length - 2}
                          </span>
                        )}
                      </div>
                    ) : (
                      <span className="text-xs text-[#6B7280]">-</span>
                    )}
                  </td>
                  <td className="px-4 py-4">
                    <button 
                      onClick={() => togglePublishStatus(product)}
                      className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                        product.publishStatus === 'Published' 
                          ? 'bg-[#E6F9F0] text-[#00A86B]' 
                          : 'bg-[#F1F1F1] text-[#888888]'
                      }`}
                    >
                      {product.publishStatus || 'Draft'}
                    </button>
                  </td>
                  <td className="px-4 py-4 text-right relative">
                    <button 
                      onClick={() => setOpenActionMenuId(openActionMenuId === product.id ? null : product.id)}
                      className="p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded-md transition-colors"
                    >
                      <MoreVertical size={18} />
                    </button>
                    
                    <AnimatePresence>
                      {openActionMenuId === product.id && (
                        <>
                          <div 
                            className="fixed inset-0 z-40"
                            onClick={() => setOpenActionMenuId(null)}
                          />
                          <motion.div 
                            initial={{ opacity: 0, y: 5, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            exit={{ opacity: 0, y: 5, scale: 0.95 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-8 top-10 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 text-left"
                          >
                            <button 
                              onClick={() => {
                                setQuickViewProduct(product);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F3F4F6] flex items-center gap-2 transition-colors"
                            >
                              <Eye size={14} />
                              Quick View
                            </button>
                            <button 
                              onClick={() => {
                                setEditingProduct(product);
                                setIsFormOpen(true);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F3F4F6] flex items-center gap-2 transition-colors"
                            >
                              <Edit3 size={14} />
                              Edit
                            </button>
                            <button 
                              onClick={() => togglePublishStatus(product)}
                              className="w-full px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F3F4F6] flex items-center gap-2 transition-colors"
                            >
                              <Check size={14} />
                              {product.publishStatus === 'Published' ? 'Unpublish' : 'Publish'}
                            </button>
                            <button 
                              onClick={() => {
                                setProductToDelete(product);
                                setOpenActionMenuId(null);
                              }}
                              className="w-full px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F3F4F6] flex items-center gap-2 transition-colors"
                            >
                              <Trash2 size={14} />
                              Delete
                            </button>
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        <div className="px-4 py-4 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white rounded-b-xl">
          <div className="flex items-center gap-2 text-sm text-[#6B7280]">
            <span>Show</span>
            <select 
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="border border-gray-200 rounded-md px-2 py-1 bg-[#F8F9FB] text-[#1A1A1A] outline-none focus:border-[#FF6A00]"
            >
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={50}>50</option>
            </select>
            <span>entries</span>
          </div>
          
          <div className="flex items-center gap-2">
            <button 
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-md border border-gray-200 text-[#6B7280] disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                let pageNum = i + 1;
                // Simple logic to show pages around current page
                if (totalPages > 5) {
                  if (currentPage > 3) {
                    pageNum = currentPage - 2 + i;
                  }
                  if (pageNum > totalPages) {
                    pageNum = totalPages - 4 + i;
                  }
                }
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`w-8 h-8 rounded-md text-sm font-medium transition-colors ${
                      currentPage === pageNum 
                        ? 'bg-[#FF6A00] text-white' 
                        : 'text-[#6B7280] hover:bg-gray-50'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            <button 
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="p-1.5 rounded-md border border-gray-200 text-[#6B7280] disabled:opacity-50 hover:bg-gray-50 transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4">
        {isLoading ? (
          <div className="text-center py-8 text-[#6B7280]">Loading products...</div>
        ) : currentItems.length === 0 ? (
          <div className="text-center py-8 text-[#6B7280] bg-white rounded-xl border border-gray-100">No products found.</div>
        ) : (
          currentItems.map((product) => (
            <motion.div 
              key={product.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm relative"
            >
              <div className="flex gap-4">
                <img 
                  src={product.image} 
                  alt={product.name} 
                  loading="lazy"
                  className="w-20 h-20 rounded-lg object-cover border border-gray-100 flex-shrink-0" 
                />
                <div className="flex-1 min-w-0 pr-8">
                  <div className="font-bold text-[#1A1A1A] line-clamp-2 text-sm">{product.name}</div>
                  <div className="text-[#FF6A00] font-bold mt-1">৳ {product.price?.toLocaleString()}</div>
                  <div className="mt-2">
                    <button 
                      onClick={() => togglePublishStatus(product)}
                      className={`px-3 py-1 rounded-full text-[10px] font-medium transition-colors ${
                        product.publishStatus === 'Published' 
                          ? 'bg-[#E6F9F0] text-[#00A86B]' 
                          : 'bg-[#F1F1F1] text-[#888888]'
                      }`}
                    >
                      {product.publishStatus || 'Draft'}
                    </button>
                  </div>
                </div>
              </div>
              
              {/* Mobile Action Menu */}
              <div className="absolute top-4 right-4">
                <button 
                  onClick={() => setOpenActionMenuId(openActionMenuId === product.id ? null : product.id)}
                  className="p-1.5 text-[#6B7280] hover:bg-[#F3F4F6] rounded-md transition-colors"
                >
                  <MoreVertical size={18} />
                </button>
                
                <AnimatePresence>
                  {openActionMenuId === product.id && (
                    <>
                      <div 
                        className="fixed inset-0 z-40"
                        onClick={() => setOpenActionMenuId(null)}
                      />
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                        className="absolute right-0 top-8 w-40 bg-white rounded-xl shadow-lg border border-gray-100 py-1 z-50 text-left origin-top-right"
                      >
                        <button 
                          onClick={() => {
                            setQuickViewProduct(product);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F3F4F6] flex items-center gap-2"
                        >
                          <Eye size={14} />
                          Quick View
                        </button>
                        <button 
                          onClick={() => {
                            setEditingProduct(product);
                            setIsFormOpen(true);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F3F4F6] flex items-center gap-2"
                        >
                          <Edit3 size={14} />
                          Edit
                        </button>
                        <button 
                          onClick={() => togglePublishStatus(product)}
                          className="w-full px-4 py-2 text-sm text-[#1A1A1A] hover:bg-[#F3F4F6] flex items-center gap-2"
                        >
                          <Check size={14} />
                          {product.publishStatus === 'Published' ? 'Unpublish' : 'Publish'}
                        </button>
                        <button 
                          onClick={() => {
                            setProductToDelete(product);
                            setOpenActionMenuId(null);
                          }}
                          className="w-full px-4 py-2 text-sm text-[#FF3B30] hover:bg-[#F3F4F6] flex items-center gap-2"
                        >
                          <Trash2 size={14} />
                          Delete
                        </button>
                      </motion.div>
                    </>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          ))
        )}
        
        {/* Mobile Pagination */}
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-gray-100">
          <button 
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-[#6B7280] text-sm disabled:opacity-50"
          >
            Prev
          </button>
          <span className="text-sm text-[#1A1A1A] font-medium">Page {currentPage} of {totalPages || 1}</span>
          <button 
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="px-3 py-1.5 rounded-md border border-gray-200 text-[#6B7280] text-sm disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {productToDelete && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setProductToDelete(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden"
            >
              <div className="p-6 text-center">
                <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trash2 size={32} />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A1A] mb-2">Delete Product</h3>
                <p className="text-[#6B7280]">
                  Are you sure you want to delete <span className="font-bold text-[#1A1A1A]">"{productToDelete.name}"</span>? 
                  This action cannot be undone.
                </p>
              </div>
              <div className="flex border-t border-gray-100">
                <button 
                  onClick={() => setProductToDelete(null)}
                  className="flex-1 py-4 text-[#6B7280] font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <div className="w-px bg-gray-100" />
                <button 
                  onClick={handleDelete}
                  className="flex-1 py-4 text-[#FF3B30] font-bold hover:bg-red-50 transition-colors"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Quick View Modal */}
      <AnimatePresence>
        {quickViewProduct && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-sm"
              onClick={() => setQuickViewProduct(null)}
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-xl w-full max-w-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh]"
            >
              <div className="flex items-center justify-between p-4 border-b border-gray-100">
                <h3 className="text-lg font-bold text-[#1A1A1A]">Quick View</h3>
                <button 
                  onClick={() => setQuickViewProduct(null)}
                  className="p-2 text-[#6B7280] hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-6 overflow-y-auto">
                <div className="flex flex-col md:flex-row gap-6">
                  <div className="w-full md:w-1/3">
                    <img 
                      src={quickViewProduct.image} 
                      alt={quickViewProduct.name} 
                      className="w-full aspect-square object-cover rounded-xl border border-gray-100"
                    />
                  </div>
                  <div className="w-full md:w-2/3 space-y-4">
                    <div>
                      <h2 className="text-xl font-bold text-[#1A1A1A]">{quickViewProduct.name}</h2>
                      {quickViewProduct.sku && <p className="text-sm text-[#6B7280] mt-1">SKU: {quickViewProduct.sku}</p>}
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-2xl font-bold text-[#FF6A00]">৳ {quickViewProduct.price?.toLocaleString()}</div>
                      {quickViewProduct.regularPrice && quickViewProduct.regularPrice > quickViewProduct.price && (
                        <div className="text-sm text-[#6B7280] line-through">৳ {quickViewProduct.regularPrice?.toLocaleString()}</div>
                      )}
                    </div>
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold mb-1">Category</div>
                        <div className="text-sm text-[#1A1A1A]">{quickViewProduct.category}</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold mb-1">Status</div>
                        <div className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${
                          quickViewProduct.publishStatus === 'Published' 
                            ? 'bg-[#E6F9F0] text-[#00A86B]' 
                            : 'bg-[#F1F1F1] text-[#888888]'
                        }`}>
                          {quickViewProduct.publishStatus || 'Draft'}
                        </div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold mb-1">Stock</div>
                        <div className="text-sm text-[#1A1A1A]">{quickViewProduct.stockQuantity || 0} units</div>
                      </div>
                      <div>
                        <div className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold mb-1">Priority</div>
                        <div className="text-sm text-[#1A1A1A]">{quickViewProduct.featuredOrder || 0}</div>
                      </div>
                    </div>
                    {quickViewProduct.tags && quickViewProduct.tags.length > 0 && (
                      <div className="pt-4 border-t border-gray-100">
                        <div className="text-xs text-[#6B7280] uppercase tracking-wider font-semibold mb-2">Tags</div>
                        <div className="flex flex-wrap gap-2">
                          {quickViewProduct.tags.map(tag => (
                            <span key={tag} className="px-2.5 py-1 bg-gray-100 text-[#6B7280] rounded-md text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {isFormOpen && (
          <ProductForm 
            product={editingProduct} 
            categories={categories}
            onClose={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
            }}
            onSuccess={() => {
              setIsFormOpen(false);
              setEditingProduct(null);
              fetchProducts();
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
