import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageCircle, 
  MessageSquare, 
  HelpCircle,
  Bot,
  Phone,
  Mail,
  Send,
  ChevronLeft,
  CheckCircle2,
  Paperclip,
  X
} from 'lucide-react';

interface SupportProps {
  setCurrentView: (view: any) => void;
  user: any;
}

export default function Support({ setCurrentView, user }: SupportProps) {
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [ticketData, setTicketData] = useState({
    name: user?.fullName || '',
    contact: user?.email || user?.phone || '',
    orderNumber: '',
    problemType: 'Order & Delivery',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmitTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/help/tickets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          subject: ticketData.problemType,
          ...ticketData
        })
      });
      if (res.ok) {
        setShowSuccess(true);
        setShowTicketForm(false);
        setTicketData({
          name: user?.fullName || '',
          contact: user?.email || user?.phone || '',
          orderNumber: '',
          problemType: 'Order & Delivery',
          message: ''
        });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportChannels = [
    {
      id: 'call',
      label: 'Call Support',
      icon: Phone,
      action: () => window.open('tel:+8801700000000'),
      color: 'bg-green-500',
    },
    {
      id: 'messenger',
      label: 'Messenger',
      icon: MessageCircle,
      action: () => window.open('https://m.me/tazumartbd', '_blank'),
      color: 'bg-blue-500',
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      icon: MessageSquare,
      action: () => window.open('https://wa.me/8801700000000', '_blank'),
      color: 'bg-emerald-500',
    },
    {
      id: 'email',
      label: 'Email Support',
      icon: Mail,
      action: () => window.open('mailto:support@tazumartbd.com'),
      color: 'bg-indigo-500',
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-32">
      <div className="max-w-2xl mx-auto px-4 pt-5 space-y-[30px]">
        {/* 1. Quick Support Section */}
        <section className="space-y-6">
          <header className="flex items-center gap-4">
            <button onClick={() => setCurrentView('dashboard')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
              <ChevronLeft size={24} className="text-gray-600" />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-gray-900">Customer Support</h1>
              <p className="text-gray-500 text-sm font-medium">We're here to help you 24/7.</p>
            </div>
          </header>

          <div className="grid grid-cols-2 gap-4">
            {supportChannels.map((channel) => {
              const gradientMap: Record<string, string> = {
                call: 'from-emerald-50 to-emerald-100 text-emerald-600 border-emerald-200',
                messenger: 'from-blue-50 to-blue-100 text-blue-600 border-blue-200',
                whatsapp: 'from-green-50 to-green-100 text-green-600 border-green-200',
                email: 'from-purple-50 to-purple-100 text-purple-600 border-purple-200'
              };
              const style = gradientMap[channel.id] || 'from-gray-50 to-gray-100 text-gray-600 border-gray-200';
              
              return (
                <motion.button
                  key={channel.id}
                  whileTap={{ scale: 0.95 }}
                  onClick={channel.action}
                  className={`bg-gradient-to-br ${style} border p-5 rounded-3xl flex flex-col items-center justify-center gap-3 shadow-sm hover:shadow-md transition-all group`}
                >
                  <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
                    <channel.icon size={24} />
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider">
                    {channel.label}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </section>

        {/* 2. Submit Ticket Section */}
        <section className="bg-white border border-gray-100 rounded-[32px] p-8 text-center space-y-6 shadow-sm">
          <div className="space-y-2">
            <h3 className="text-xl font-black text-gray-900 uppercase tracking-tight">Submit a Ticket</h3>
            <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
              If you have a complex issue, submit a ticket and our team will respond within 24 hours.
            </p>
          </div>
          <div className="flex justify-center">
            <button 
              onClick={() => setShowTicketForm(true)}
              className="px-10 py-4 bg-gradient-to-r from-active to-orange-600 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:scale-105 transition-all shadow-lg shadow-active/20"
            >
              Open Ticket Form
            </button>
          </div>
        </section>

        {/* 3. AI Support Assistant Section */}
        <section className="bg-gradient-to-br from-purple-500 to-indigo-600 p-8 rounded-[32px] text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col items-center text-center">
            <div className="w-16 h-16 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center mb-4">
              <Bot size={32} />
            </div>
            <h3 className="text-xl font-black mb-2 tracking-tight uppercase">AI Support Assistant</h3>
            <p className="text-sm text-white/80 font-medium mb-6 max-w-xs">
              Get instant answers using our AI-powered chat bot.
            </p>
            <button 
              onClick={() => window.dispatchEvent(new CustomEvent('open-ai-chat'))}
              className="px-8 py-3 bg-white text-indigo-600 rounded-xl text-xs font-black uppercase tracking-widest hover:bg-indigo-50 transition-all shadow-lg"
            >
              Start AI Chat
            </button>
          </div>
          <div className="absolute -right-10 -bottom-10 opacity-10">
            <Bot size={180} />
          </div>
        </section>

        {/* Support Hours (Compact) */}
        <div className="flex items-center justify-center gap-6 text-[10px] font-bold text-gray-400 uppercase tracking-widest pt-4">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
            AI: 24/7
          </div>
          <div className="w-1 h-1 bg-gray-300 rounded-full" />
          <div className="flex items-center gap-2">
            Agents: 10 AM - 10 PM
          </div>
        </div>
      </div>

        {/* Ticket Form Popup */}
        <AnimatePresence>
          {showTicketForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="bg-white text-[#0B1120] w-full max-w-lg rounded-[40px] p-8 relative overflow-hidden"
              >
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-2xl font-black tracking-tighter uppercase">Submit Ticket</h2>
                  <button onClick={() => setShowTicketForm(false)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                    <X size={20} />
                  </button>
                </div>

                <form onSubmit={handleSubmitTicket} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Full Name</label>
                      <input 
                        required
                        type="text" 
                        value={ticketData.name}
                        onChange={(e) => setTicketData(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Email / Phone</label>
                      <input 
                        required
                        type="text" 
                        value={ticketData.contact}
                        onChange={(e) => setTicketData(prev => ({ ...prev, contact: e.target.value }))}
                        className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Order Number (Optional)</label>
                      <input 
                        type="text" 
                        value={ticketData.orderNumber}
                        onChange={(e) => setTicketData(prev => ({ ...prev, orderNumber: e.target.value }))}
                        className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Problem Type</label>
                      <select 
                        value={ticketData.problemType}
                        onChange={(e) => setTicketData(prev => ({ ...prev, problemType: e.target.value }))}
                        className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20 appearance-none"
                      >
                        <option>Order & Delivery</option>
                        <option>Payment Issues</option>
                        <option>Return & Refund</option>
                        <option>Account Problems</option>
                        <option>Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-1 block">Message</label>
                    <textarea 
                      required
                      rows={4}
                      value={ticketData.message}
                      onChange={(e) => setTicketData(prev => ({ ...prev, message: e.target.value }))}
                      className="w-full bg-gray-100 border-none rounded-xl p-4 text-sm outline-none focus:ring-2 ring-active/20 resize-none"
                      placeholder="Describe your issue in detail..."
                    />
                  </div>

                  <div className="flex items-center gap-2 p-4 bg-gray-50 rounded-xl border border-dashed border-gray-200 cursor-pointer hover:bg-gray-100 transition-all">
                    <Paperclip size={18} className="text-gray-400" />
                    <span className="text-[10px] font-bold text-gray-400 uppercase">Attach Screenshot</span>
                  </div>

                  <div className="pt-4">
                    <button 
                      disabled={isSubmitting}
                      type="submit"
                      className="w-full py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-black/10 flex items-center justify-center gap-2"
                    >
                      {isSubmitting ? 'SUBMITTING...' : 'SUBMIT TICKET'}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Popup */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="bg-white text-[#0B1120] w-full max-w-sm rounded-[40px] p-8 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-green-500" />
                <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 size={40} className="text-green-500" />
                </div>
                <h2 className="text-2xl font-black mb-2 tracking-tighter uppercase">Ticket Submitted</h2>
                <p className="text-gray-400 text-xs mb-8 leading-relaxed">
                  Your support ticket has been received. Our team will review your request and get back to you within 24 hours.
                </p>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all"
                >
                  GOT IT
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
  );
}
