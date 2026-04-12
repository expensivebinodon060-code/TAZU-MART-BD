import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  Mail, 
  CreditCard, 
  Truck,
  ChevronRight,
  CheckCircle2,
  Loader2
} from 'lucide-react';
import { CartItem, PaymentConfig } from '../types';

interface CheckoutProps {
  items: CartItem[];
  onBack: () => void;
  onSuccess: (orderDetails: any) => void;
}

export default function Checkout({ items: initialItems, onBack, onSuccess }: CheckoutProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);

  useEffect(() => {
    setItems(initialItems);
  }, [initialItems]);
  const [formData, setFormData] = useState({
    fullName: '',
    mobileNumber: '',
    address: '',
    email: '',
    division: '',
    district: '',
    upazila: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<'cod' | 'online' | 'bank'>('cod');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);

  const [divisions, setDivisions] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [upazilas, setUpazilas] = useState<any[]>([]);

  // Incomplete Order Tracking
  useEffect(() => {
    const timer = setTimeout(() => {
      if (formData.fullName || formData.mobileNumber || formData.address) {
        fetch('/api/incomplete-orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            ...formData,
            items,
            total: items.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 60,
            date: new Date().toISOString()
          })
        }).catch(err => console.error('Failed to save incomplete order', err));
      }
    }, 2000); // Debounce 2 seconds

    return () => clearTimeout(timer);
  }, [formData, items]);

  useEffect(() => {
    fetch('/api/admin/payment-config')
      .then(res => res.json())
      .then(setPaymentConfig);

    fetch('/api/locations/divisions')
      .then(res => res.json())
      .then(setDivisions);
  }, []);

  useEffect(() => {
    if (formData.division) {
      fetch(`/api/locations/districts/${formData.division}`)
        .then(res => res.json())
        .then(setDistricts);
      setFormData(prev => ({ ...prev, district: '', upazila: '' }));
    } else {
      setDistricts([]);
    }
  }, [formData.division]);

  useEffect(() => {
    if (formData.district) {
      fetch(`/api/locations/upazilas/${formData.district}`)
        .then(res => res.json())
        .then(setUpazilas);
      setFormData(prev => ({ ...prev, upazila: '' }));
    } else {
      setUpazilas([]);
    }
  }, [formData.district]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => {
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const updateQty = (productId: string, delta: number) => {
    setItems(prev => prev.map(item => {
      if (item.productId === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Full Name is required';
    
    const phoneRegex = /^(?:\+8801|8801|01)[3-9]\d{8}$/;
    const cleanPhone = formData.mobileNumber.replace(/\s+/g, '').replace(/-/g, '');
    if (!cleanPhone) {
      newErrors.mobileNumber = 'Mobile Number is required';
    } else if (!phoneRegex.test(cleanPhone)) {
      newErrors.mobileNumber = 'Enter valid BD number (e.g. 017XXXXXXXX)';
    }

    if (!formData.address.trim()) newErrors.address = 'Full Address is required';

    setErrors(newErrors);
    
    if (Object.keys(newErrors).length > 0) {
      const firstErrorField = Object.keys(newErrors)[0];
      const element = document.getElementById(firstErrorField);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const deliveryCharge = 60;
    const total = subtotal + deliveryCharge;

    const orderData = {
      amount: total,
      paymentMethod: selectedPaymentMethod === 'cod' ? 'Cash on Delivery' : selectedPaymentMethod === 'online' ? 'Online Payment' : 'Bank Transfer',
      paymentStatus: 'pending',
      items: items,
      shippingAddress: formData.address,
      customerName: formData.fullName,
      customerPhone: formData.mobileNumber,
      customerEmail: formData.email,
      division: formData.division,
      district: formData.district,
      upazila: formData.upazila,
      deliveryMethod: 'home',
      deliveryCharge: deliveryCharge,
      orderSource: 'website'
    };

    try {
      // Small artificial delay for "Loading (1-2 sec)"
      await new Promise(resolve => setTimeout(resolve, 1500));

      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      
      if (res.ok) {
        const createdOrder = await res.json();
        onSuccess(createdOrder);
      } else {
        const error = await res.json();
        alert(error.error || 'Failed to place order');
      }
    } catch (err) {
      console.error('Order placement failed', err);
      alert('Failed to place order. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const subtotal = items.reduce((sum, item) => sum + (Number(item.price) * item.quantity), 0);
  const deliveryCharge = 60;
  const total = subtotal + deliveryCharge;

  return (
    <div className="min-h-screen bg-gray-50 pb-32">
      {/* Top Banner */}
      <div className="bg-emerald-600 text-white py-3 px-4 text-center text-sm font-bold flex items-center justify-center gap-2">
        <Truck size={18} />
        🛵 Cash on Delivery Available All Over Bangladesh
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button 
            onClick={onBack}
            className="p-2 bg-white rounded-full shadow-sm border border-gray-100 text-gray-600 hover:text-active transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-primary tracking-tight">Checkout</h1>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            {/* Customer Information */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                  <User size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary">Customer Information</h2>
              </div>

              <div className="space-y-4">
                {/* Full Name */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Name <span className="text-rose-500">*</span></label>
                  <div className="relative group">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-active transition-colors" size={18} />
                    <input 
                      type="text"
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) => handleInputChange('fullName', e.target.value)}
                      placeholder="TAZU MART BD"
                      className={`w-full h-14 bg-gray-50 border ${errors.fullName ? 'border-rose-500' : 'border-gray-100'} rounded-2xl pl-12 pr-4 text-sm font-medium outline-none focus:bg-white focus:border-active focus:ring-4 focus:ring-active/5 transition-all placeholder:text-gray-300`}
                    />
                  </div>
                  {errors.fullName && <p className="text-[11px] text-rose-500 font-bold ml-1">{errors.fullName}</p>}
                </div>

                {/* Mobile Number */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Mobile Number <span className="text-rose-500">*</span></label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-active transition-colors" size={18} />
                    <input 
                      type="text"
                      id="mobileNumber"
                      value={formData.mobileNumber}
                      onChange={(e) => handleInputChange('mobileNumber', e.target.value)}
                      placeholder="01XXXXXXXXX"
                      className={`w-full h-14 bg-gray-50 border ${errors.mobileNumber ? 'border-rose-500' : 'border-gray-100'} rounded-2xl pl-12 pr-4 text-sm font-medium outline-none focus:bg-white focus:border-active focus:ring-4 focus:ring-active/5 transition-all font-mono placeholder:text-gray-300`}
                    />
                  </div>
                  {errors.mobileNumber && <p className="text-[11px] text-rose-500 font-bold ml-1">{errors.mobileNumber}</p>}
                </div>

                {/* Full Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Full Address <span className="text-rose-500">*</span></label>
                  <div className="relative group">
                    <MapPin className="absolute left-4 top-4 text-gray-400 group-focus-within:text-active transition-colors" size={18} />
                    <textarea 
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      placeholder="House, Road, Area"
                      rows={3}
                      className={`w-full bg-gray-50 border ${errors.address ? 'border-rose-500' : 'border-gray-100'} rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:bg-white focus:border-active focus:ring-4 focus:ring-active/5 transition-all resize-none placeholder:text-gray-300`}
                    />
                  </div>
                  {errors.address && <p className="text-[11px] text-rose-500 font-bold ml-1">{errors.address}</p>}
                </div>

                {/* Gmail Address */}
                <div className="space-y-1.5">
                  <label className="text-sm font-bold text-gray-700 ml-1">Gmail Address <span className="text-gray-400 font-normal">(Optional)</span></label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-active transition-colors" size={18} />
                    <input 
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full h-14 bg-gray-50 border border-gray-100 rounded-2xl pl-12 pr-4 text-sm font-medium outline-none focus:bg-white focus:border-active focus:ring-4 focus:ring-active/5 transition-all placeholder:text-gray-300"
                    />
                  </div>
                  <p className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-wider">Optional – not required for order</p>
                </div>
              </div>
            </div>

            {/* Optional Location */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center">
                  <MapPin size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary">Optional Location (Clean)</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Division</label>
                  <select 
                    value={formData.division}
                    onChange={(e) => handleInputChange('division', e.target.value)}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs font-bold outline-none focus:bg-white focus:border-active transition-all appearance-none cursor-pointer"
                  >
                    <option value="">Select Division</option>
                    {divisions.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">District</label>
                  <select 
                    value={formData.district}
                    onChange={(e) => handleInputChange('district', e.target.value)}
                    disabled={!formData.division}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs font-bold outline-none focus:bg-white focus:border-active transition-all appearance-none disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">Select District</option>
                    {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-500 ml-1">Upazila</label>
                  <select 
                    value={formData.upazila}
                    onChange={(e) => handleInputChange('upazila', e.target.value)}
                    disabled={!formData.district}
                    className="w-full h-12 bg-gray-50 border border-gray-100 rounded-xl px-4 text-xs font-bold outline-none focus:bg-white focus:border-active transition-all appearance-none disabled:opacity-50 cursor-pointer"
                  >
                    <option value="">Select Upazila</option>
                    {upazilas.map(u => <option key={u.id} value={u.id}>{u.name}</option>)}
                  </select>
                </div>
              </div>
              <p className="text-[10px] text-gray-400 font-bold ml-1 uppercase tracking-wider">Optional – not required for order</p>
            </div>

            {/* Payment Method */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 space-y-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center">
                  <CreditCard size={20} />
                </div>
                <h2 className="text-lg font-bold text-primary">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 gap-3">
                <button 
                  type="button"
                  onClick={() => setSelectedPaymentMethod('cod')}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    selectedPaymentMethod === 'cod' ? 'border-emerald-500 bg-emerald-50' : 'border-gray-50 hover:border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'cod' ? 'bg-emerald-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <Truck size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Cash on Delivery</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Pay when you receive</p>
                    </div>
                  </div>
                  {selectedPaymentMethod === 'cod' && <CheckCircle2 size={20} className="text-emerald-500" />}
                </button>

                <button 
                  type="button"
                  onClick={() => setSelectedPaymentMethod('online')}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    selectedPaymentMethod === 'online' ? 'border-blue-500 bg-blue-50' : 'border-gray-50 hover:border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'online' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <CreditCard size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Online Payment</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Bkash / Nagad / Rocket</p>
                    </div>
                  </div>
                  {selectedPaymentMethod === 'online' && <CheckCircle2 size={20} className="text-blue-500" />}
                </button>

                <button 
                  type="button"
                  onClick={() => setSelectedPaymentMethod('bank')}
                  className={`p-4 rounded-2xl border-2 transition-all flex items-center justify-between ${
                    selectedPaymentMethod === 'bank' ? 'border-indigo-500 bg-indigo-50' : 'border-gray-50 hover:border-gray-100'
                  }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${selectedPaymentMethod === 'bank' ? 'bg-indigo-500 text-white' : 'bg-gray-100 text-gray-400'}`}>
                      <CreditCard size={20} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-sm">Bank Transfer</p>
                      <p className="text-[10px] text-gray-500 font-bold uppercase">Direct Bank Deposit</p>
                    </div>
                  </div>
                  {selectedPaymentMethod === 'bank' && <CheckCircle2 size={20} className="text-indigo-500" />}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-6">
            {/* Product List */}
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
              <h2 className="text-lg font-bold text-primary mb-6">Your Items</h2>
              <div className="space-y-6">
                {items.map((item, idx) => (
                  <div key={idx} className="flex gap-4 items-start border-b border-gray-50 pb-6 last:border-0 last:pb-0">
                    <div className="w-20 h-20 bg-gray-50 rounded-2xl overflow-hidden flex-shrink-0 border border-gray-100">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0 space-y-1">
                      <p className="text-sm font-bold text-primary truncate">{item.name}</p>
                      <p className="text-xs text-secondary font-medium">Price: ৳{Number(item.price).toLocaleString()}</p>
                      
                      {/* Quantity Controller */}
                      <div className="flex items-center gap-3 mt-3">
                        <button 
                          type="button"
                          onClick={() => updateQty(item.productId, -1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          -
                        </button>
                        <span className="text-sm font-bold text-primary w-4 text-center">{item.quantity}</span>
                        <button 
                          type="button"
                          onClick={() => updateQty(item.productId, 1)}
                          className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-500 hover:bg-gray-50 transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-black text-active">৳ {(Number(item.price) * item.quantity).toLocaleString()}</p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mt-1">Total</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-gray-200/50 border border-gray-100 sticky top-6 space-y-6">
              <h2 className="text-xl font-black text-primary tracking-tight">Order Summary</h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">Product Subtotal</span>
                  <span className="text-sm font-bold text-primary">৳ {subtotal.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-secondary">Delivery Charge</span>
                  <span className="text-sm font-bold text-primary">৳ {deliveryCharge}</span>
                </div>
                
                <div className="pt-6 border-t border-gray-100">
                  <div className="flex justify-between items-center">
                    <span className="text-base font-bold text-primary uppercase tracking-wider">Total Amount</span>
                    <span className="text-2xl font-black text-active">৳ {total.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Desktop Confirm Button */}
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full h-16 bg-active text-white rounded-2xl font-black text-xl mt-4 hover:opacity-90 transition-all shadow-2xl shadow-active/30 flex items-center justify-center gap-3 disabled:opacity-50 hidden lg:flex"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Placing Order...
                  </>
                ) : (
                  'Confirm Order'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Mobile Confirm Button */}
      <div className="lg:hidden p-4 bg-white border-t border-gray-100 mt-6 mb-20">
        <button 
          onClick={handleSubmit}
          disabled={isSubmitting}
          className="w-full h-16 bg-active text-white rounded-2xl font-black text-xl hover:opacity-90 transition-all shadow-2xl shadow-active/30 flex items-center justify-center gap-3 disabled:opacity-50"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="animate-spin" size={24} />
              Placing Order...
            </>
          ) : (
            'Confirm Order'
          )}
        </button>
      </div>
    </div>
  );
}
