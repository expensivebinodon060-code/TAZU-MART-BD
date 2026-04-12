import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  User, 
  Mail, 
  Phone, 
  Camera, 
  MapPin, 
  Plus, 
  Edit2, 
  Trash2,
  ShieldCheck,
  ArrowLeft
} from 'lucide-react';

export default function Profile({ onBack }: { onBack: () => void }) {
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-24">
      <header className="flex items-center gap-4">
        <button 
          onClick={onBack}
          className="p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={24} />
        </button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">My Profile</h1>
          <p className="text-secondary mt-1">Manage your personal information and addresses.</p>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Profile Card */}
        <div className="md:col-span-1 space-y-6">
          <div className="bg-card border border-white/5 rounded-3xl p-8 text-center">
            <div className="relative w-32 h-32 mx-auto mb-6">
              <img 
                src="https://picsum.photos/seed/user/200/200" 
                alt="Profile" 
                className="w-full h-full rounded-full object-cover border-4 border-active/20" 
              />
              <button className="absolute bottom-0 right-0 p-2 bg-active text-white rounded-full border-4 border-card hover:scale-110 transition-transform">
                <Camera size={16} />
              </button>
            </div>
            <h2 className="text-xl font-bold">Alex Thompson</h2>
            <p className="text-secondary text-sm">Premium Member</p>
            <div className="mt-6 pt-6 border-t border-white/5 flex justify-center gap-4">
              <div className="text-center">
                <div className="text-lg font-bold">24</div>
                <div className="text-[10px] text-secondary uppercase font-bold tracking-wider">Orders</div>
              </div>
              <div className="w-px h-8 bg-white/5" />
              <div className="text-center">
                <div className="text-lg font-bold">$4.2k</div>
                <div className="text-[10px] text-secondary uppercase font-bold tracking-wider">Spent</div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-white/5 rounded-3xl p-6 space-y-4">
            <h3 className="font-bold text-sm uppercase tracking-wider text-secondary">Security</h3>
            <button className="w-full flex items-center justify-between p-3 hover:bg-white/5 rounded-xl transition-all">
              <div className="flex items-center gap-3">
                <ShieldCheck size={18} className="text-active" />
                <span className="text-sm font-medium">Two-Factor Auth</span>
              </div>
              <div className="w-10 h-5 bg-active rounded-full relative">
                <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
              </div>
            </button>
          </div>
        </div>

        {/* Details & Addresses */}
        <div className="md:col-span-2 space-y-8">
          <div className="bg-card border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Personal Details</h3>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center gap-2 text-active text-sm font-bold hover:underline"
              >
                <Edit2 size={16} />
                {isEditing ? 'Save Changes' : 'Edit Profile'}
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Full Name</label>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <User size={18} className="text-secondary" />
                  <span className="text-sm">Alex Thompson</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Email Address</label>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <Mail size={18} className="text-secondary" />
                  <span className="text-sm">alex.t@enterprise.com</span>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-secondary uppercase tracking-wider">Phone Number</label>
                <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/5">
                  <Phone size={18} className="text-secondary" />
                  <span className="text-sm">+1 (555) 000-1234</span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-card border border-white/5 rounded-3xl p-8">
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-xl font-bold">Address Book</h3>
              <button className="flex items-center gap-2 p-2 bg-active/10 text-active rounded-xl text-xs font-bold hover:bg-active/20 transition-all">
                <Plus size={16} />
                Add New
              </button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Home', address: '123 Tech Lane, Silicon Valley, CA 94025', default: true },
                { label: 'Office', address: '456 Innovation Way, San Francisco, CA 94105', default: false },
              ].map((addr) => (
                <div key={addr.label} className="p-4 bg-white/5 border border-white/5 rounded-2xl flex items-start justify-between group">
                  <div className="flex gap-4">
                    <div className="p-3 bg-active/10 text-active rounded-xl">
                      <MapPin size={20} />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">{addr.label}</span>
                        {addr.default && (
                          <span className="text-[10px] bg-active text-white px-1.5 py-0.5 rounded-full uppercase font-bold">Default</span>
                        )}
                      </div>
                      <p className="text-secondary text-sm mt-1">{addr.address}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-2 hover:bg-white/10 rounded-lg text-secondary"><Edit2 size={16} /></button>
                    <button className="p-2 hover:bg-red-400/10 rounded-lg text-red-400"><Trash2 size={16} /></button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
