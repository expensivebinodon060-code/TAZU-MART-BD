import React, { useEffect, useState } from 'react';
import { Order } from '../../types';
import { Package, MapPin, Phone, Mail, User, Globe, ArrowLeft, Printer, Download, Copy, Check } from 'lucide-react';

export default function InvoicePage({ orderId, onBack }: { orderId: string, onBack: () => void }) {
  const [order, setOrder] = useState<Order | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          setOrder(data);
        }
      } catch (err) {
        console.error('Failed to fetch order', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const handleCopy = () => {
    if (!order) return;
    navigator.clipboard.writeText(order.id);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real app, this would generate a PDF. 
    // For now, we'll use print which allows saving as PDF.
    window.print();
  };

  if (isLoading) return <div className="p-20 text-center">Loading Invoice...</div>;
  if (!order) return <div className="p-20 text-center">Order not found.</div>;

  const subtotal = order.items.reduce((acc, item) => acc + (item.price * item.quantity), 0);

  return (
    <div className="min-h-screen bg-white text-[#222222] p-4 md:p-8 print:p-0 relative font-sans">
      {/* Navigation & Actions */}
      <div className="max-w-[800px] mx-auto mb-8 flex items-center justify-between no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-sm font-bold text-secondary hover:text-accent transition-all"
        >
          <ArrowLeft size={18} />
          Back to Orders
        </button>
        <div className="flex gap-3">
          <button 
            onClick={handlePrint}
            className="px-4 py-2 bg-accent text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
          >
            <Printer size={16} />
            Print Invoice
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="px-4 py-2 bg-active text-white rounded-lg text-xs font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-sm"
          >
            <Download size={16} />
            Download PDF
          </button>
        </div>
      </div>

      <div className="max-w-[800px] mx-auto bg-white border border-accent p-8 md:p-12 print:border-0 print:p-0 relative overflow-hidden">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl font-black tracking-tight">
            <span className="text-black">TAZU MART </span>
            <span className="text-active">BD</span>
          </h1>
          <p className="text-xs text-secondary font-medium mt-1 uppercase tracking-widest">Trusted Online Shop</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-12">
          {/* Customer Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-accent uppercase tracking-widest border-b border-accent pb-2">Customer Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex gap-2">
                <span className="font-bold w-20">Name:</span>
                <span>{order.customerName}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold w-20">Phone:</span>
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold w-20">Email:</span>
                <span>{order.customerEmail || 'N/A'}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold w-20">Address:</span>
                <span className="flex-1">{order.shippingAddress}</span>
              </div>
            </div>
          </div>

          {/* Order Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-accent uppercase tracking-widest border-b border-accent pb-2">Order Information</h3>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span className="font-bold w-32">Order ID:</span>
                <span className="font-mono bg-hover px-2 py-0.5 rounded text-xs">{order.id}</span>
                <button onClick={handleCopy} className="text-muted hover:text-active transition-all no-print">
                  {copied ? <Check size={14} className="text-success" /> : <Copy size={14} />}
                </button>
              </div>
              <div className="flex gap-2">
                <span className="font-bold w-32">Order Date:</span>
                <span>{new Date(order.date).toLocaleDateString()}</span>
              </div>
              <div className="flex gap-2">
                <span className="font-bold w-32">Payment Method:</span>
                <span>{order.paymentMethod}</span>
              </div>
              {order.transactionId && (
                <div className="flex gap-2">
                  <span className="font-bold w-32">Transaction ID:</span>
                  <span className="font-mono text-active">{order.transactionId}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Customer Note */}
        {order.customerNote && (
          <div className="mb-12 p-4 bg-gray-50 border-l-4 border-active rounded-r-xl">
            <h3 className="text-xs font-bold text-accent uppercase tracking-widest mb-2">Customer Note</h3>
            <p className="text-sm text-secondary italic">"{order.customerNote}"</p>
          </div>
        )}

        {/* Product Table */}
        <div className="mb-12">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-y border-accent text-[10px] font-bold uppercase tracking-widest">
                <th className="py-4 px-2">Description</th>
                <th className="py-4 px-2 text-center">Quantity</th>
                <th className="py-4 px-2 text-right">Price</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-accent/30">
              {order.items.map((item, idx) => (
                <tr key={idx}>
                  <td className="py-4 px-2">
                    <div className="font-bold text-sm">{item.name}</div>
                    <div className="text-[10px] text-secondary">{item.variant || 'Standard'}</div>
                  </td>
                  <td className="py-4 px-2 text-center text-sm">{item.quantity}</td>
                  <td className="py-4 px-2 text-right text-sm font-bold">৳ {item.price?.toLocaleString() || 0}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Price Summary */}
        <div className="flex justify-end mb-16">
          <div className="w-full md:w-64 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="font-bold">Subtotal:</span>
              <span>৳ {subtotal?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="font-bold">Delivery Charge:</span>
              <span>৳ {order.deliveryCharge?.toLocaleString() || 0}</span>
            </div>
            <div className="flex justify-between text-lg font-black border-t border-accent pt-3 text-active">
              <span>Grand Total:</span>
              <span>৳ {order.amount?.toLocaleString() || 0}</span>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center space-y-6 pt-12 border-t border-accent">
          <p className="text-sm italic text-secondary">Thank you for shopping with us!</p>
          <div className="space-y-1">
            <h4 className="text-lg font-black tracking-tight">TAZU MART BD</h4>
            <p className="text-sm font-bold text-accent">01834800916</p>
          </div>
        </div>

        {/* Action Buttons at Bottom (no-print) */}
        <div className="mt-12 flex justify-center gap-4 no-print">
          <button 
            onClick={handlePrint}
            className="px-8 py-3 bg-accent text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
          >
            <Printer size={20} />
            Print Invoice
          </button>
          <button 
            onClick={handleDownloadPDF}
            className="px-8 py-3 bg-active text-white rounded-lg font-bold hover:opacity-90 transition-all flex items-center gap-2 shadow-lg"
          >
            <Download size={20} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Print Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body { background: white !important; color: #222222 !important; }
          .no-print { display: none !important; }
          @page { margin: 1cm; }
          .print\\:border-0 { border: 0 !important; }
          .print\\:p-0 { padding: 0 !important; }
        }
      `}} />
    </div>
  );
}
