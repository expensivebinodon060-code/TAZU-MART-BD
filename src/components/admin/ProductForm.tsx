import React, { useState, useRef } from 'react';
import { motion } from 'motion/react';
import { X, Upload, Plus, Trash2, GripVertical } from 'lucide-react';
import { Product, Category } from '../../types';

interface ProductFormProps {
  product: Product | null;
  categories: Category[];
  onClose: () => void;
  onSuccess: () => void;
}

export default function ProductForm({ product, categories, onClose, onSuccess }: ProductFormProps) {
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '',
    slug: '',
    price: 0,
    regularPrice: 0,
    salePrice: 0,
    costPrice: 0,
    image: '',
    galleryImages: [],
    category: '',
    categoryId: '',
    description: '',
    shortDescription: '',
    tags: [],
    sku: '',
    stockQuantity: 0,
    lowStockLimit: 5,
    manageStock: true,
    status: 'Active',
    publishStatus: 'Draft',
    stockStatus: 'In Stock',
    variations: [],
    videoUrl: '',
    condition: 'New',
    brand: '',
    warranty: '',
    unitName: '',
    extraDetails: [],
    shippingCharges: []
  });

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = product ? 'PUT' : 'POST';
    const url = product ? `/api/admin/products/${product.id}` : '/api/admin/products';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (res.ok) {
        alert(`Product ${product ? 'updated' : 'added'} successfully!`);
        onSuccess();
      } else {
        const errorData = await res.json();
        alert(`Error: ${errorData.message || 'Failed to save product'}`);
      }
    } catch (err) {
      console.error('Failed to save product', err);
      alert('An error occurred while saving the product.');
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      const newImagesPromises = Array.from(files).map((f: File) => {
        return new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            resolve(reader.result as string);
          };
          reader.readAsDataURL(f);
        });
      });

      Promise.all(newImagesPromises).then((newImages) => {
        const allImages = [...(formData.galleryImages || []), ...newImages].slice(0, 100);
        setFormData({ 
          ...formData, 
          galleryImages: allImages,
          image: allImages[0] || formData.image
        });
      });
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 md:p-8">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 20 }}
        className="w-full max-w-4xl h-full bg-[#f8fafc] rounded-2xl overflow-hidden flex flex-col relative shadow-2xl"
      >
        <div className="flex items-center justify-between p-6 bg-white border-b border-gray-200 shrink-0">
          <h2 className="text-xl font-bold text-gray-800">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 custom-scrollbar pb-32">
          <style dangerouslySetInnerHTML={{ __html: `
            .auriel-form-section {
              background: white;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 24px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.02);
            }
            .auriel-form-section h3 {
              font-size: 16px;
              font-weight: 700;
              color: #1f2937;
              margin-bottom: 16px;
              padding-bottom: 12px;
              border-bottom: 1px solid #f3f4f6;
            }
            .auriel-input {
              width: 100%;
              padding: 12px 14px;
              border: 1.5px solid #d1d5db;
              border-radius: 8px;
              font-size: 14px;
              color: #1f2937;
              background-color: #ffffff;
              outline: none;
              transition: 0.2s ease-in-out;
            }
            .auriel-input:focus {
              border-color: #ff6a00;
              box-shadow: 0 0 0 2px rgba(255,106,0,0.15);
            }
            .form-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            }
            .full-width {
              grid-column: span 2;
            }
            .auriel-label {
              display: block;
              font-size: 13px;
              font-weight: 600;
              color: #4b5563;
              margin-bottom: 8px;
            }
            .two-col {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 16px;
            }
            @media(max-width: 768px) {
              .two-col {
                grid-template-columns: 1fr;
              }
            }
          `}} />

          {/* ① MEDIA SECTION */}
          <div className="auriel-form-section">
            <h3>Media Upload</h3>
            <div className="space-y-4">
              <input 
                type="file" 
                multiple 
                accept="image/*" 
                className="hidden" 
                ref={fileInputRef}
                onChange={handleImageUpload}
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-8 border-2 border-dashed border-gray-300 rounded-xl flex flex-col items-center justify-center text-gray-500 hover:border-blue-500 hover:text-blue-500 transition-colors bg-gray-50"
              >
                <Upload size={32} className="mb-2" />
                <span className="font-medium">Click to upload images</span>
                <span className="text-xs mt-1">Max 100 images. First image will be featured.</span>
              </button>
              
              {formData.galleryImages && formData.galleryImages.length > 0 && (
                <div className="grid grid-cols-4 md:grid-cols-6 gap-4 mt-4">
                  {formData.galleryImages.map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-lg border border-gray-200 overflow-hidden bg-gray-50">
                      <img src={img} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                        <button type="button" className="text-white hover:text-blue-400"><GripVertical size={18} /></button>
                        <button 
                          type="button" 
                          onClick={() => {
                            const newImgs = formData.galleryImages?.filter((_, i) => i !== idx);
                            setFormData({ ...formData, galleryImages: newImgs, image: newImgs?.[0] || '' });
                          }}
                          className="text-white hover:text-red-400"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                      {idx === 0 && (
                        <div className="absolute top-1 left-1 bg-blue-500 text-white text-[10px] px-2 py-0.5 rounded font-bold">
                          Featured
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ② PRODUCT NAME */}
          <div className="auriel-form-section">
            <h3>Product Information</h3>
            <div className="form-grid">
              <div>
                <label className="auriel-label">Product Name</label>
                <input 
                  type="text" 
                  className="auriel-input" 
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/ /g, '-') })}
                  placeholder="Enter product name"
                />
              </div>
              <div>
                <label className="auriel-label">Slug</label>
                <input 
                  type="text" 
                  className="auriel-input" 
                  value={formData.slug || ''}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="product-slug"
                />
              </div>
            </div>
          </div>

          {/* ③ CATEGORY SELECTOR */}
          <div className="auriel-form-section">
            <h3>Category</h3>
            <div>
              <label className="auriel-label">Select Category</label>
              <select 
                className="auriel-input"
                value={formData.categoryId}
                onChange={(e) => {
                  const cat = categories.find(c => c.id === e.target.value);
                  setFormData({ ...formData, categoryId: e.target.value, category: cat?.name || '' });
                }}
              >
                <option value="">Select a category</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* ④ PRODUCT STATUS + CONDITION */}
          <div className="auriel-form-section">
            <h3>Status & Condition</h3>
            <div className="form-grid">
              <div>
                <label className="auriel-label">Product Status</label>
                <select 
                  className="auriel-input"
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                >
                  <option value="Active">Active</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
              <div>
                <label className="auriel-label">Condition</label>
                <select 
                  className="auriel-input"
                  value={formData.condition}
                  onChange={(e) => setFormData({ ...formData, condition: e.target.value as any })}
                >
                  <option value="New">New</option>
                  <option value="Used">Used</option>
                  <option value="Refurbished">Refurbished</option>
                </select>
              </div>
            </div>
          </div>

          {/* ⑤ PRODUCT VIDEO URL SECTION */}
          <div className="auriel-form-section">
            <h3>Product Video URL</h3>
            <div>
              <label className="auriel-label">YouTube or Facebook Video URL</label>
              <input 
                type="text" 
                className="auriel-input" 
                value={formData.videoUrl}
                onChange={(e) => setFormData({ ...formData, videoUrl: e.target.value })}
                placeholder="Paste Product Video URL"
              />
              <p className="text-xs text-gray-500 mt-2">Video will be displayed before images in customer panel.</p>
            </div>
          </div>

          {/* ⑥ SEO SHORT DESCRIPTION */}
          <div className="auriel-form-section">
            <h3>SEO Short Description</h3>
            <div>
              <label className="auriel-label">Short Description (Max 300 chars)</label>
              <textarea 
                className="auriel-input" 
                maxLength={300}
                rows={3}
                value={formData.shortDescription}
                onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                placeholder="Enter a brief summary for SEO and product preview..."
              />
              <div className="text-right text-xs text-gray-400 mt-1">
                {formData.shortDescription?.length || 0}/300
              </div>
            </div>
          </div>

          {/* ⑦ LONG DESCRIPTION */}
          <div className="auriel-form-section">
            <h3>Long Description</h3>
            <div>
              <label className="auriel-label">Full Product Details</label>
              <textarea 
                className="auriel-input" 
                rows={8}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Enter full description (Rich text editor will be implemented here)"
              />
            </div>
          </div>

          {/* ⑧ PRICING SECTION */}
          <div className="auriel-form-section">
            <h3>Pricing</h3>
            <div className="space-y-4">
              <div className="form-grid">
                <div>
                  <label className="auriel-label">Sale Price</label>
                  <input 
                    type="number" 
                    className="auriel-input" 
                    value={formData.salePrice || formData.price}
                    onChange={(e) => setFormData({ ...formData, salePrice: Number(e.target.value), price: Number(e.target.value) })}
                    placeholder="Sale Price"
                  />
                </div>
                <div>
                  <label className="auriel-label">Current Price</label>
                  <input 
                    type="number" 
                    className="auriel-input" 
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    placeholder="Current Price"
                  />
                </div>
              </div>
              <div className="form-grid">
                <div>
                  <label className="auriel-label">Regular Price</label>
                  <input 
                    type="number" 
                    className="auriel-input" 
                    value={formData.regularPrice}
                    onChange={(e) => setFormData({ ...formData, regularPrice: Number(e.target.value) })}
                    placeholder="Regular Price"
                  />
                </div>
                <div>
                  <label className="auriel-label text-blue-600 flex items-center gap-1">
                    Buying Price <span className="text-[10px] bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded">Admin Only</span>
                  </label>
                  <input 
                    type="number" 
                    className="auriel-input border-blue-200 bg-blue-50/30" 
                    value={formData.costPrice}
                    onChange={(e) => setFormData({ ...formData, costPrice: Number(e.target.value) })}
                    placeholder="Buying Price"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ⑨ INVENTORY SECTION */}
          <div className="auriel-form-section">
            <h3>Inventory</h3>
            <div className="space-y-4">
              <div>
                <label className="auriel-label">Product Code (SKU)</label>
                <input 
                  type="text" 
                  className="auriel-input" 
                  value={formData.sku}
                  onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                  placeholder="Product Code"
                />
              </div>
              <div className="form-grid">
                <div>
                  <label className="auriel-label">Brand (Optional)</label>
                  <input 
                    type="text" 
                    className="auriel-input" 
                    value={formData.brand}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    placeholder="Brand"
                  />
                </div>
                <div>
                  <label className="auriel-label">Warranty (Optional)</label>
                  <input 
                    type="text" 
                    className="auriel-input" 
                    value={formData.warranty}
                    onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                    placeholder="Warranty"
                  />
                </div>
              </div>
              <div className="form-grid">
                <div>
                  <label className="auriel-label">Quantity</label>
                  <input 
                    type="number" 
                    className="auriel-input" 
                    value={formData.stockQuantity}
                    onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                    placeholder="Quantity"
                  />
                </div>
                <div>
                  <label className="auriel-label">Unit Name</label>
                  <input 
                    type="text" 
                    className="auriel-input" 
                    value={formData.unitName}
                    onChange={(e) => setFormData({ ...formData, unitName: e.target.value })}
                    placeholder="e.g. pcs, kg, box"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* ⑩ PRODUCT DETAILS (VARIANT SECTION) */}
          <div className="auriel-form-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="mb-0 border-none pb-0">Product Variant</h3>
              <button 
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    variations: [...(formData.variations || []), {
                      id: `v${Date.now()}`,
                      productId: product?.id || '',
                      attributeType: 'other',
                      attributeValue: '',
                      colorCode: '',
                      images: [],
                      isVisible: true,
                      isActive: true,
                      isRequired: false,
                      stockQuantity: 0,
                      priceAdjustment: 0
                    }]
                  })
                }}
                className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                <Plus size={16} /> Add New Variant
              </button>
            </div>
            <div className="space-y-4">
              {(formData.variations || []).map((v, idx) => (
                <div key={v.id} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative">
                  <button 
                    type="button"
                    onClick={() => {
                      const newVars = formData.variations?.filter((_, i) => i !== idx);
                      setFormData({ ...formData, variations: newVars });
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="form-grid pr-8">
                    <div>
                      <label className="auriel-label">Title (e.g. Material, Size)</label>
                      <input 
                        type="text" 
                        className="auriel-input" 
                        value={v.attributeType}
                        onChange={(e) => {
                          const newVars = [...(formData.variations || [])];
                          newVars[idx].attributeType = e.target.value as any;
                          setFormData({ ...formData, variations: newVars });
                        }}
                      />
                    </div>
                    <div>
                      <label className="auriel-label">Description (e.g. Cotton Canvas, 12x18 inch)</label>
                      <input 
                        type="text" 
                        className="auriel-input" 
                        value={v.attributeValue}
                        onChange={(e) => {
                          const newVars = [...(formData.variations || [])];
                          newVars[idx].attributeValue = e.target.value;
                          setFormData({ ...formData, variations: newVars });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!formData.variations || formData.variations.length === 0) && (
                <p className="text-sm text-gray-500 italic">No variants added.</p>
              )}
            </div>
          </div>

          {/* ⑪ EXTRA PRODUCT DETAILS */}
          <div className="auriel-form-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="mb-0 border-none pb-0">Extra Product Details</h3>
              <button 
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    extraDetails: [...(formData.extraDetails || []), { title: '', description: '' }]
                  })
                }}
                className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                <Plus size={16} /> Add Extra Details
              </button>
            </div>
            <div className="space-y-4">
              {(formData.extraDetails || []).map((detail, idx) => (
                <div key={idx} className="p-4 border border-gray-200 rounded-xl bg-gray-50 relative">
                  <button 
                    type="button"
                    onClick={() => {
                      const newDetails = formData.extraDetails?.filter((_, i) => i !== idx);
                      setFormData({ ...formData, extraDetails: newDetails });
                    }}
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500"
                  >
                    <Trash2 size={16} />
                  </button>
                  <div className="form-grid pr-8">
                    <div>
                      <label className="auriel-label">Title</label>
                      <input 
                        type="text" 
                        className="auriel-input" 
                        value={detail.title}
                        onChange={(e) => {
                          const newDetails = [...(formData.extraDetails || [])];
                          newDetails[idx].title = e.target.value;
                          setFormData({ ...formData, extraDetails: newDetails });
                        }}
                      />
                    </div>
                    <div>
                      <label className="auriel-label">Description</label>
                      <input 
                        type="text" 
                        className="auriel-input" 
                        value={detail.description}
                        onChange={(e) => {
                          const newDetails = [...(formData.extraDetails || [])];
                          newDetails[idx].description = e.target.value;
                          setFormData({ ...formData, extraDetails: newDetails });
                        }}
                      />
                    </div>
                  </div>
                </div>
              ))}
              {(!formData.extraDetails || formData.extraDetails.length === 0) && (
                <p className="text-sm text-gray-500 italic">No extra details added.</p>
              )}
            </div>
          </div>

          {/* ⑫ SHIPPING SECTION */}
          <div className="auriel-form-section">
            <div className="flex items-center justify-between mb-4">
              <h3 className="mb-0 border-none pb-0">Shipping Charge</h3>
              <button 
                type="button"
                onClick={() => {
                  setFormData({
                    ...formData,
                    shippingCharges: [...(formData.shippingCharges || []), { division: 'Dhaka', charge: 60 }]
                  })
                }}
                className="flex items-center gap-1 text-sm text-blue-600 font-medium hover:text-blue-700"
              >
                <Plus size={16} /> Add Shipping Charge
              </button>
            </div>
            <div className="space-y-4">
              {(formData.shippingCharges || []).map((shipping, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <div className="flex-1">
                    <select 
                      className="auriel-input"
                      value={shipping.division}
                      onChange={(e) => {
                        const newShipping = [...(formData.shippingCharges || [])];
                        newShipping[idx].division = e.target.value;
                        setFormData({ ...formData, shippingCharges: newShipping });
                      }}
                    >
                      <option value="Dhaka">Dhaka</option>
                      <option value="Chattogram">Chattogram</option>
                      <option value="Rajshahi">Rajshahi</option>
                      <option value="Khulna">Khulna</option>
                      <option value="Barishal">Barishal</option>
                      <option value="Sylhet">Sylhet</option>
                      <option value="Rangpur">Rangpur</option>
                      <option value="Mymensingh">Mymensingh</option>
                    </select>
                  </div>
                  <div className="flex-1 relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500">৳</span>
                    <input 
                      type="number" 
                      className="auriel-input pl-8" 
                      value={shipping.charge}
                      onChange={(e) => {
                        const newShipping = [...(formData.shippingCharges || [])];
                        newShipping[idx].charge = Number(e.target.value);
                        setFormData({ ...formData, shippingCharges: newShipping });
                      }}
                    />
                  </div>
                  <button 
                    type="button"
                    onClick={() => {
                      const newShipping = formData.shippingCharges?.filter((_, i) => i !== idx);
                      setFormData({ ...formData, shippingCharges: newShipping });
                    }}
                    className="p-3 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              ))}
              {(!formData.shippingCharges || formData.shippingCharges.length === 0) && (
                <p className="text-sm text-gray-500 italic">No shipping charges added. Default rates will apply.</p>
              )}
            </div>
          </div>

        </div>

        {/* ⑬ FIXED BOTTOM BUTTON */}
        <div className="absolute bottom-0 left-0 w-full bg-white p-4 border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.05)]">
          <button 
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white h-[52px] rounded-xl font-medium text-base hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20"
          >
            Complete Product
          </button>
        </div>
      </motion.div>
    </div>
  );
}
