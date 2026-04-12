import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Lock, 
  Smartphone, 
  CreditCard, 
  Truck,
  Loader2,
  ChevronRight,
  AlertCircle,
  X,
  Timer
} from 'lucide-react';
import { PaymentMethod, PaymentStatus, PaymentConfig } from '../types';

interface PaymentProps {
  orderDetails: any;
  onBack: () => void;
  onSuccess: (paymentDetails: any) => void;
}

export default function Payment({ orderDetails, onBack, onSuccess }: PaymentProps) {
  const [paymentCategory, setPaymentCategory] = useState<'cod' | 'online' | 'bank'>(orderDetails.selectedPaymentMethod || 'cod');
  const [onlineMethod, setOnlineMethod] = useState<'bKash' | 'Nagad'>('bKash');
  const [transactionId, setTransactionId] = useState('');
  const [customerNote, setCustomerNote] = useState(orderDetails.customerNote || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentConfig, setPaymentConfig] = useState<PaymentConfig | null>(null);

  useEffect(() => {
    fetch('/api/admin/payment-config')
      .then(res => res.json())
      .then(setPaymentConfig);
  }, []);

  const handleConfirm = async () => {
    setIsProcessing(true);
    
    let method: PaymentMethod = 'Cash on Delivery';
    let status: PaymentStatus = 'pending';
    
    if (paymentCategory === 'online') {
      method = onlineMethod;
      status = 'pending';
    } else if (paymentCategory === 'bank') {
      method = 'Bank Transfer';
      status = 'pending';
    }

    // Simulate a small delay for better UX
    setTimeout(() => {
      onSuccess({
        method,
        status,
        transactionId: transactionId || undefined,
        customerNote: customerNote || undefined,
        time: new Date().toLocaleString()
      });
      setIsProcessing(false);
    }, 1500);
  };

  const renderSelection = () => (
    <div className="space-y-8">
      <div className="p-6 md:p-10 bg-white border border-gray-100 rounded-[24px] shadow-sm space-y-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-active/5 text-active rounded-2xl flex items-center justify-center">
            {paymentCategory === 'cod' ? <Truck size={24} /> : 
             paymentCategory === 'online' ? <Smartphone size={24} /> : <CreditCard size={24} />}
          </div>
          <div>
            <h2 className="text-xl font-bold text-primary">
              {paymentCategory === 'cod' ? 'Confirm Order (COD)' : 
               paymentCategory === 'online' ? 'Online Payment' : 'Bank Transfer Details'}
            </h2>
            <p className="text-sm text-secondary">
              {paymentCategory === 'cod' ? 'Please confirm your cash on delivery order' : 
               paymentCategory === 'online' ? 'Complete your payment via bKash or Nagad' : 'Transfer the amount to our bank account'}
            </p>
          </div>
        </div>

        {/* Method Details */}
        <div className="space-y-6">
          {paymentCategory === 'cod' && (
            <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl space-y-3">
              <div className="flex items-center gap-3 text-emerald-700">
                <CheckCircle2 size={20} />
                <span className="font-bold">Cash on Delivery Selected</span>
              </div>
              <p className="text-sm text-emerald-600 leading-relaxed">
                You will pay the total amount of <span className="font-bold">৳{orderDetails.total}</span> when you receive the products at your doorstep.
              </p>
            </div>
          )}

          {paymentCategory === 'online' && (
            <div className="space-y-6">
              <div className="flex gap-4">
                <button 
                  onClick={() => setOnlineMethod('bKash')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                    onlineMethod === 'bKash' ? 'border-[#D12053] bg-[#D12053]/5' : 'border-gray-100'
                  }`}
                >
                  <img src="https://www.logo.wine/a/logo/BKash/BKash-Logo.wine.svg" alt="bKash" className="h-6" />
                  <span className="font-bold text-sm">bKash</span>
                </button>
                <button 
                  onClick={() => setOnlineMethod('Nagad')}
                  className={`flex-1 p-4 rounded-xl border-2 transition-all flex items-center justify-center gap-3 ${
                    onlineMethod === 'Nagad' ? 'border-[#F27D26] bg-[#F27D26]/5' : 'border-gray-100'
                  }`}
                >
                  <img src="https://vignette.wikia.nocookie.net/logopedia/images/e/e3/Nagad_Logo.png/revision/latest?cb=20200114144547" alt="Nagad" className="h-6" />
                  <span className="font-bold text-sm">Nagad</span>
                </button>
              </div>

              <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Send Money To</span>
                  <span className="text-lg font-black text-active">
                    {onlineMethod === 'bKash' ? (paymentConfig?.bkashNumber || paymentConfig?.bkash?.manualNumber) : (paymentConfig?.nagadNumber || paymentConfig?.nagad?.manualNumber)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Account Type</span>
                  <span className="text-sm font-bold text-primary capitalize">
                    {onlineMethod === 'bKash' ? (paymentConfig?.bkashType || 'Personal') : (paymentConfig?.nagadType || 'Personal')}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Amount</span>
                  <span className="text-lg font-black text-primary">৳{orderDetails.total}</span>
                </div>
                
                {(onlineMethod === 'bKash' ? paymentConfig?.bkash?.instruction : paymentConfig?.nagad?.instruction) && (
                  <div className="p-3 bg-active/5 border border-active/10 rounded-xl text-[11px] text-active font-medium leading-relaxed">
                    Note: {onlineMethod === 'bKash' ? paymentConfig?.bkash.instruction : paymentConfig?.nagad.instruction}
                  </div>
                )}

                <div className="space-y-2 pt-4 border-t border-gray-200">
                  <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Transaction ID <span className="text-rose-500">*</span></label>
                  <input 
                    type="text" 
                    value={transactionId}
                    onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                    placeholder="Enter Transaction ID"
                    className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-active"
                  />
                </div>
              </div>
            </div>
          )}

          {paymentCategory === 'bank' && (
            <div className="p-6 bg-gray-50 rounded-2xl space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Bank Name</span>
                  <span className="text-sm font-bold text-primary">{paymentConfig?.bank?.bankName || 'N/A'}</span>
                </div>
                {paymentConfig?.bank?.branch && (
                  <div className="flex justify-between">
                    <span className="text-xs font-bold text-secondary uppercase tracking-widest">Branch</span>
                    <span className="text-sm font-bold text-primary">{paymentConfig.bank.branch}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Account Name</span>
                  <span className="text-sm font-bold text-primary">{paymentConfig?.bank?.accountName || 'N/A'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-xs font-bold text-secondary uppercase tracking-widest">Account Number</span>
                  <span className="text-sm font-bold text-active font-mono">{paymentConfig?.bank?.accountNumber || 'N/A'}</span>
                </div>
              </div>
              <div className="space-y-2 pt-4 border-t border-gray-200">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest">Reference / Transaction ID <span className="text-rose-500">*</span></label>
                <input 
                  type="text" 
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value.toUpperCase())}
                  placeholder="Enter Reference"
                  className="w-full bg-white border border-gray-200 rounded-xl px-4 py-3 text-sm font-bold outline-none focus:border-active"
                />
              </div>
            </div>
          )}
        </div>

        {/* Customer Note */}
        <div className="space-y-2 pt-6 border-t border-gray-100">
          <label className="text-sm font-bold text-primary">Order Note (Optional)</label>
          <textarea 
            value={customerNote}
            onChange={(e) => setCustomerNote(e.target.value)}
            placeholder="Any special instructions for your order..."
            className="w-full h-24 bg-gray-50 border border-gray-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-active resize-none"
          />
        </div>

        {/* Global Instruction */}
        {paymentConfig?.instruction && (
          <div className="p-4 bg-yellow-50 border border-yellow-100 rounded-xl flex items-start gap-3">
            <AlertCircle size={18} className="text-yellow-600 shrink-0 mt-0.5" />
            <p className="text-xs text-yellow-800 leading-relaxed font-medium">
              {paymentConfig.instruction}
            </p>
          </div>
        )}

        <button 
          onClick={handleConfirm}
          disabled={isProcessing || ((paymentCategory === 'online' || paymentCategory === 'bank') && !transactionId)}
          className={`w-full h-[56px] text-white rounded-xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-3 disabled:opacity-50 ${
            paymentCategory === 'cod' ? 'bg-emerald-600 shadow-emerald-500/20' : 'bg-active shadow-active/20'
          } hover:brightness-110 active:scale-[0.98]`}
        >
          {isProcessing ? <Loader2 className="animate-spin" /> : (paymentCategory === 'cod' ? 'Place Order Now' : 'Confirm Payment')}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 md:py-12">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-4 mb-10">
          <button 
            onClick={onBack}
            className="p-2 bg-white border border-gray-200 rounded-xl hover:border-active/30 transition-all text-secondary"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-3xl font-bold tracking-tight text-primary">Checkout</h1>
        </div>

        {renderSelection()}
      </div>
    </div>
  );
}
