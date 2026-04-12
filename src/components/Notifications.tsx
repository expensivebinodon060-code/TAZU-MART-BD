import { motion } from 'motion/react';
import { Bell, Check, Trash2, Clock } from 'lucide-react';
import { MOCK_NOTIFICATIONS } from '../mockData';

export default function Notifications() {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Notifications</h1>
          <p className="text-secondary mt-1">Stay updated with your orders and account activity.</p>
        </div>
        <button className="text-active text-sm font-bold hover:underline">Mark all as read</button>
      </header>

      <div className="space-y-4">
        {MOCK_NOTIFICATIONS.map((notif, i) => (
          <motion.div
            key={notif.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
            className={`p-6 rounded-3xl border transition-all group relative ${
              notif.read ? 'bg-card border-white/5 opacity-70' : 'bg-white/5 border-active/20 shadow-lg shadow-active/5'
            }`}
          >
            {!notif.read && (
              <div className="absolute top-6 left-2 w-1.5 h-1.5 bg-active rounded-full" />
            )}
            <div className="flex gap-4">
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                notif.read ? 'bg-white/5 text-secondary' : 'bg-active/10 text-active'
              }`}>
                <Bell size={24} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-1">
                  <h3 className="font-bold">{notif.title}</h3>
                  <div className="flex items-center gap-2 text-[10px] text-secondary font-bold uppercase tracking-wider">
                    <Clock size={12} />
                    {notif.date}
                  </div>
                </div>
                <p className="text-secondary text-sm leading-relaxed">{notif.message}</p>
                <div className="mt-4 flex items-center gap-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button className="flex items-center gap-2 text-xs font-bold text-active hover:underline">
                    <Check size={14} />
                    Mark as Read
                  </button>
                  <button className="flex items-center gap-2 text-xs font-bold text-red-400 hover:underline">
                    <Trash2 size={14} />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
