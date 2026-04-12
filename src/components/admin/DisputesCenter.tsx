import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  AlertCircle, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  ShieldAlert, 
  MessageSquare, 
  Paperclip, 
  Send, 
  Search, 
  Filter, 
  MoreVertical, 
  ChevronRight, 
  ArrowLeft, 
  User, 
  Store, 
  Package, 
  CreditCard, 
  Truck, 
  Lock, 
  Unlock, 
  History,
  FileText,
  ExternalLink,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';
import { 
  Dispute, 
  DisputeStatus, 
  DisputeType, 
  DisputePriority, 
  DisputeMessage 
} from '../../types';

export default function DisputesCenter() {
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [filterStatus, setFilterStatus] = useState<DisputeStatus | 'All'>('All');
  const [newMessage, setNewMessage] = useState('');

  // Mock Data
  const disputes: Dispute[] = [
    {
      id: 'DSP-1001',
      orderId: 'ORD-7829',
      customerId: 'CUST-452',
      customerName: 'Rahat Khan',
      sellerId: 'SEL-001',
      sellerName: 'Fashion Hub',
      type: 'Product Mismatch',
      amount: 2450,
      status: 'Open',
      priority: 'High',
      messages: [
        {
          id: 'MSG-1',
          senderId: 'CUST-452',
          senderName: 'Rahat Khan',
          senderRole: 'Buyer',
          message: 'The color of the shirt is completely different from what was shown in the pictures.',
          attachments: ['https://picsum.photos/seed/shirt1/400/400'],
          createdAt: '2026-02-27 15:00'
        }
      ],
      evidence: ['https://picsum.photos/seed/shirt1/400/400'],
      createdAt: '2026-02-27 15:00',
      updatedAt: '2026-02-27 15:00'
    },
    {
      id: 'DSP-1002',
      orderId: 'ORD-7830',
      customerId: 'CUST-892',
      customerName: 'Anika Ahmed',
      sellerId: 'SEL-005',
      sellerName: 'Gadget Store',
      type: 'Refund Conflict',
      amount: 12500,
      status: 'Under Review',
      priority: 'Urgent',
      messages: [
        {
          id: 'MSG-2',
          senderId: 'CUST-892',
          senderName: 'Anika Ahmed',
          senderRole: 'Buyer',
          message: 'I returned the product 3 days ago but haven\'t received my refund yet.',
          createdAt: '2026-02-28 09:00'
        },
        {
          id: 'MSG-3',
          senderId: 'SEL-005',
          senderName: 'Gadget Store',
          senderRole: 'Seller',
          message: 'We are still inspecting the returned item for any damages.',
          createdAt: '2026-02-28 10:30'
        }
      ],
      evidence: [],
      createdAt: '2026-02-28 09:00',
      updatedAt: '2026-02-28 10:30'
    }
  ];

  const stats = [
    { label: 'Total Disputes', value: 124, icon: AlertCircle, color: 'text-indigo-400' },
    { label: 'Open', value: 12, icon: Clock, color: 'text-amber-400' },
    { label: 'Under Review', value: 8, icon: Activity, color: 'text-blue-400' },
    { label: 'Escalated', value: 3, icon: ShieldAlert, color: 'text-rose-400' },
  ];

  const renderDashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <div key={i} className="p-6 bg-card border border-white/5 rounded-[32px] space-y-4 group hover:border-white/10 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white/5 ${stat.color}`}>
              <stat.icon size={24} />
            </div>
            <div>
              <div className="text-xs text-secondary font-medium">{stat.label}</div>
              <div className="text-2xl font-bold text-[#EAEAEA] mt-1">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Dispute List */}
      <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text"
              placeholder="Search by Dispute ID or Order ID..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-active transition-all"
            />
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white/5 border border-white/10 rounded-xl text-secondary hover:text-active transition-all">
              <Filter size={18} />
            </button>
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value as any)}
              className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-secondary outline-none focus:border-active transition-all"
            >
              <option value="All">All Status</option>
              <option value="Open">Open</option>
              <option value="Under Review">Under Review</option>
              <option value="Escalated">Escalated</option>
              <option value="Closed">Closed</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Dispute Info</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Parties</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Type & Amount</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Priority</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-secondary uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {disputes.map((dsp) => (
                <tr 
                  key={dsp.id} 
                  onClick={() => setSelectedDispute(dsp)}
                  className="hover:bg-white/[0.02] transition-colors group cursor-pointer"
                >
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-[#EAEAEA]">{dsp.id}</div>
                    <div className="text-[10px] text-secondary mt-0.5">Order: {dsp.orderId}</div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-1.5 text-xs text-[#EAEAEA]">
                        <User size={12} className="text-secondary" />
                        {dsp.customerName}
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-secondary">
                        <Store size={12} />
                        {dsp.sellerName}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-xs font-bold text-[#EAEAEA]">{dsp.type}</div>
                    <div className="text-sm font-bold text-active mt-0.5">৳ {dsp.amount.toLocaleString()}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                      dsp.priority === 'Urgent' ? 'bg-rose-500/10 text-rose-400' :
                      dsp.priority === 'High' ? 'bg-orange-500/10 text-orange-400' :
                      'bg-blue-500/10 text-blue-400'
                    }`}>
                      {dsp.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold border ${
                      dsp.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      dsp.status === 'Under Review' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                      'bg-rose-500/10 text-rose-400 border-rose-500/20'
                    }`}>
                      {dsp.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-secondary group-hover:text-active transition-all">
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderDetails = (dsp: Dispute) => (
    <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Detail Header */}
      <div className="flex items-center justify-between">
        <button 
          onClick={() => setSelectedDispute(null)}
          className="flex items-center gap-2 text-secondary hover:text-active transition-all group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-sm font-bold">Back to List</span>
        </button>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white/5 border border-white/10 rounded-2xl text-sm font-bold text-secondary hover:bg-white/10 transition-all flex items-center gap-2">
            <Lock size={18} />
            Freeze Payout
          </button>
          <button className="px-6 py-3 bg-rose-500 text-white rounded-2xl text-sm font-bold hover:bg-rose-600 transition-all flex items-center gap-2">
            <ShieldAlert size={18} />
            Escalate to Super Admin
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Messages & Evidence */}
        <div className="lg:col-span-2 space-y-8">
          {/* Dispute Info Card */}
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl font-bold text-[#EAEAEA]">{dsp.id}</h2>
                <p className="text-sm text-secondary">Created on {dsp.createdAt}</p>
              </div>
              <span className={`px-4 py-2 rounded-2xl text-xs font-bold border ${
                dsp.status === 'Open' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'
              }`}>
                {dsp.status}
              </span>
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <div className="text-[10px] text-secondary uppercase font-bold">Dispute Type</div>
                <div className="text-sm font-bold text-[#EAEAEA]">{dsp.type}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <div className="text-[10px] text-secondary uppercase font-bold">Involved Amount</div>
                <div className="text-sm font-bold text-active">৳ {dsp.amount.toLocaleString()}</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl space-y-1">
                <div className="text-[10px] text-secondary uppercase font-bold">Priority</div>
                <div className="text-sm font-bold text-rose-400">{dsp.priority}</div>
              </div>
            </div>
          </div>

          {/* Chat System */}
          <div className="bg-card border border-white/5 rounded-[40px] flex flex-col h-[600px]">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
              <h3 className="text-sm font-bold text-[#EAEAEA] flex items-center gap-2">
                <MessageSquare size={18} className="text-active" />
                Communication History
              </h3>
              <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">Audit Ready</div>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
              {dsp.messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.senderRole === 'Admin' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[80%] space-y-2 ${msg.senderRole === 'Admin' ? 'items-end' : 'items-start'}`}>
                    <div className="flex items-center gap-2 px-2">
                      <span className="text-[10px] font-bold text-[#EAEAEA]">{msg.senderName}</span>
                      <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded ${
                        msg.senderRole === 'Buyer' ? 'bg-blue-500/10 text-blue-400' :
                        msg.senderRole === 'Seller' ? 'bg-amber-500/10 text-amber-400' :
                        'bg-active/10 text-active'
                      }`}>{msg.senderRole}</span>
                      <span className="text-[10px] text-secondary">{msg.createdAt}</span>
                    </div>
                    <div className={`p-4 rounded-3xl text-sm ${
                      msg.senderRole === 'Admin' 
                        ? 'bg-active text-white rounded-tr-none' 
                        : 'bg-white/5 text-[#EAEAEA] border border-white/10 rounded-tl-none'
                    }`}>
                      {msg.message}
                      {msg.attachments && msg.attachments.length > 0 && (
                        <div className="mt-4 flex flex-wrap gap-2">
                          {msg.attachments.map((att, i) => (
                            <img key={i} src={att} alt="Attachment" className="w-20 h-20 object-cover rounded-xl border border-white/10" />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-6 border-t border-white/5 bg-white/[0.02]">
              <div className="relative">
                <textarea 
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type your message to both parties..."
                  className="w-full bg-white/5 border border-white/10 rounded-[24px] pl-6 pr-24 py-4 text-sm outline-none focus:border-active transition-all resize-none h-24"
                />
                <div className="absolute right-4 bottom-4 flex items-center gap-2">
                  <button className="p-2 text-secondary hover:text-active transition-all">
                    <Paperclip size={20} />
                  </button>
                  <button className="p-3 bg-active text-white rounded-xl shadow-lg shadow-active/20 hover:scale-105 active:scale-95 transition-all">
                    <Send size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Order Info & Actions */}
        <div className="space-y-8">
          {/* Order Summary */}
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
              <Package size={20} className="text-active" />
              Order Summary
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl">
                <div>
                  <div className="text-[10px] text-secondary uppercase font-bold">Order ID</div>
                  <div className="text-sm font-bold text-[#EAEAEA]">{dsp.orderId}</div>
                </div>
                <button className="p-2 text-secondary hover:text-active transition-all">
                  <ExternalLink size={16} />
                </button>
              </div>
              <div className="space-y-3">
                <div className="flex justify-between text-xs">
                  <span className="text-secondary">Customer</span>
                  <span className="text-[#EAEAEA] font-bold">{dsp.customerName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-secondary">Seller</span>
                  <span className="text-[#EAEAEA] font-bold">{dsp.sellerName}</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-secondary">Payment Method</span>
                  <span className="text-[#EAEAEA] font-bold">Credit Card</span>
                </div>
                <div className="flex justify-between text-xs">
                  <span className="text-secondary">Delivery Status</span>
                  <span className="text-emerald-400 font-bold">Delivered</span>
                </div>
              </div>
            </div>
          </div>

          {/* Resolution Actions */}
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
              <ShieldCheck size={20} className="text-emerald-400" />
              Resolution
            </h3>
            <div className="space-y-3">
              <button className="w-full py-4 bg-emerald-500 text-white rounded-2xl font-bold text-sm hover:bg-emerald-600 transition-all flex items-center justify-center gap-2 shadow-lg shadow-emerald-500/20">
                <CheckCircle2 size={18} />
                Approve Refund
              </button>
              <button className="w-full py-4 bg-white/5 border border-white/10 text-[#EAEAEA] rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <XCircle size={18} />
                Reject Dispute
              </button>
              <button className="w-full py-4 bg-white/5 border border-white/10 text-[#EAEAEA] rounded-2xl font-bold text-sm hover:bg-white/10 transition-all flex items-center justify-center gap-2">
                <History size={18} />
                Request More Info
              </button>
            </div>
          </div>

          {/* Admin Notes */}
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-4">
            <h3 className="text-sm font-bold text-[#EAEAEA] flex items-center gap-2">
              <FileText size={18} className="text-secondary" />
              Internal Admin Notes
            </h3>
            <textarea 
              placeholder="Add private notes for other admins..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-xs outline-none focus:border-active transition-all h-32"
            />
            <button className="w-full py-3 bg-white/5 border border-white/10 rounded-xl text-[10px] font-black uppercase tracking-widest text-secondary hover:text-active transition-all">
              Save Notes
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      {!selectedDispute && (
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-rose-500/10 text-rose-500 rounded-2xl flex items-center justify-center">
              <AlertTriangle size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-[#EAEAEA]">Dispute Resolution</h1>
              <p className="text-sm text-secondary">Manage buyer-seller conflicts and refund claims.</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="px-4 py-2 bg-card border border-white/5 rounded-2xl flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs font-bold text-[#EAEAEA]">Live Monitoring</span>
            </div>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          {selectedDispute ? (
            <motion.div key="details">
              {renderDetails(selectedDispute)}
            </motion.div>
          ) : (
            <motion.div key="dashboard">
              {renderDashboard()}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Activity({ size, className }: { size: number, className?: string }) {
  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
      className={className}
    >
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
  );
}
