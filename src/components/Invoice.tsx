import React from 'react';
import { motion } from 'motion/react';
import { 
  CheckCircle2, 
  Download, 
  Home, 
  Printer, 
  FileText,
  Eye,
  MapPin
} from 'lucide-react';
import { Order } from '../types';

interface InvoiceProps {
  order: Order;
  onClose: () => void;
  onBackHome: () => void;
  onViewInvoice?: () => void;
}

export default function Invoice({ order, onClose, onBackHome, onViewInvoice }: InvoiceProps) {
  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-white/95 backdrop-blur-sm overflow-y-auto">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="relative w-full max-w-2xl bg-white p-8 md:p-12 text-center space-y-8 shadow-2xl rounded-[40px] border border-gray-100"
      >
        {/* Success Icon */}
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', damping: 12, stiffness: 200, delay: 0.2 }}
          className="w-24 h-24 bg-emerald-500 text-white rounded-full flex items-center justify-center mx-auto shadow-xl shadow-emerald-200"
        >
          <CheckCircle2 size={48} />
        </motion.div>

        {/* Success Message */}
        <div className="space-y-3">
          <h2 className="text-3xl md:text-4xl font-black text-primary tracking-tight">Your order has been placed successfully!</h2>
          <p className="text-secondary font-medium max-w-md mx-auto">
            Thank you for shopping with <span className="text-active font-bold">TAZU MART BD</span>. Your order is now being processed.
          </p>
        </div>

        {/* Detailed Product Table */}
        <div className="border-t border-gray-100 pt-6 text-left overflow-x-auto">
          <h3 className="text-xs font-bold text-secondary uppercase tracking-widest mb-4">Items Ordered</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-secondary text-[10px] font-bold uppercase tracking-widest">
                <th className="pb-3 text-left">Product</th>
                <th className="pb-3 text-center">Qty</th>
                <th className="pb-3 text-right">Price</th>
                <th className="pb-3 text-right">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {order.items.map((item, idx) => (
                <tr key={idx} className="group">
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div>
                        <p className="font-bold text-primary">{item.name}</p>
                        <p className="text-[10px] text-secondary">{item.variant || 'Standard'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 text-center font-medium text-primary">{item.quantity}</td>
                  <td className="py-4 text-right font-medium text-primary">৳{Number(item.price).toLocaleString()}</td>
                  <td className="py-4 text-right font-bold text-primary">৳{(Number(item.price) * item.quantity).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="border-t border-gray-100">
                <td colSpan={3} className="pt-4 text-right text-secondary font-medium">Subtotal</td>
                <td className="pt-4 text-right text-primary font-bold">৳{(Number(order.amount) - (order.deliveryCharge || 60)).toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={3} className="pt-2 text-right text-secondary font-medium">Delivery Charge</td>
                <td className="pt-2 text-right text-primary font-bold">৳{(order.deliveryCharge || 60).toLocaleString()}</td>
              </tr>
              <tr>
                <td colSpan={3} className="pt-4 text-right text-primary font-black uppercase tracking-wider">Grand Total</td>
                <td className="pt-4 text-right text-active font-black text-xl">৳{Number(order.amount)?.toLocaleString()}</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Order Details Summary */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left print:grid-cols-2">
          <div className="bg-gray-50 p-6 rounded-3xl space-y-4 print:bg-white print:border print:border-gray-200">
            <div className="flex items-center gap-3 text-active mb-2">
              <FileText size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">Order Summary</h3>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-xs text-secondary">Order ID:</span>
                <span className="text-sm font-mono font-bold text-primary">{order.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-secondary">Date:</span>
                <span className="text-sm font-bold text-primary">{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-xs text-secondary">Payment:</span>
                <span className="text-sm font-bold text-primary">{order.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 p-6 rounded-3xl space-y-4 print:bg-white print:border print:border-gray-200">
            <div className="flex items-center gap-3 text-active mb-2">
              <MapPin size={20} />
              <h3 className="font-bold uppercase tracking-widest text-xs">Delivery Address</h3>
            </div>
            <div className="space-y-1">
              <p className="text-sm font-bold text-primary">{order.customerName}</p>
              <p className="text-xs text-secondary leading-relaxed">{order.shippingAddress}</p>
              <p className="text-xs font-bold text-primary mt-2">{order.customerPhone}</p>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 print:hidden">
          <button 
            onClick={onBackHome}
            className="h-14 bg-gray-100 text-primary rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Home size={18} />
            Back to Home
          </button>
          <button 
            onClick={() => window.print()}
            className="h-14 bg-gray-100 text-primary rounded-2xl font-bold hover:bg-gray-200 transition-all flex items-center justify-center gap-2"
          >
            <Printer size={18} />
            Print Invoice
          </button>
          <button 
            onClick={onViewInvoice}
            className="h-14 bg-active text-white rounded-2xl font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-active/20"
          >
            <Eye size={18} />
            View Invoice
          </button>
        </div>

        <p className="text-[10px] text-muted uppercase font-bold tracking-widest pt-4">
          Trusted Online Shop • Tazu Mart BD
        </p>
      </motion.div>
    </div>
  );
}
