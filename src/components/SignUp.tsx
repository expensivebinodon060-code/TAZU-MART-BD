import React, { useState } from 'react';
import { motion } from 'motion/react';
import { User, Mail, Phone, Lock, MapPin, ArrowRight, ArrowLeft } from 'lucide-react';

interface SignUpProps {
  onSignUp: (user: any) => void;
  onBack: () => void;
}

export default function SignUp({ onSignUp, onBack }: SignUpProps) {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    if (formData.password.length < 8) {
      return setError('Password must be at least 8 characters');
    }
    if (formData.password !== formData.confirmPassword) {
      return setError('Passwords do not match');
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();
      if (res.ok) {
        onSignUp(data.user);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-8">
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-secondary hover:text-primary transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Login
      </button>

      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-primary tracking-tight">Create Account</h2>
        <p className="text-secondary text-sm">Join us to start your shopping journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-xs font-bold text-secondary uppercase ml-1">Full Name</label>
          <div className="relative">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="text"
              required
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              placeholder="John Doe"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-2xl outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-secondary uppercase ml-1">Email Address</label>
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="name@example.com"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-2xl outline-none transition-all"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-secondary uppercase ml-1">Mobile Number</label>
          <div className="relative">
            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
            <input 
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              placeholder="017XXXXXXXX"
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-2xl outline-none transition-all"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-2xl outline-none transition-all"
              />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary uppercase ml-1">Confirm</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                type="password"
                required
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-2xl outline-none transition-all"
              />
            </div>
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="text-xs font-bold text-secondary uppercase ml-1">Delivery Address</label>
          <div className="relative">
            <MapPin className="absolute left-4 top-4 text-secondary" size={18} />
            <textarea 
              required
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              placeholder="Enter your full address"
              rows={3}
              className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-2xl outline-none transition-all resize-none"
            />
          </div>
        </div>

        {error && (
          <motion.p 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-red-500 text-sm font-medium ml-1"
          >
            {error}
          </motion.p>
        )}

        <button 
          type="submit"
          disabled={isLoading}
          className="w-full py-4 bg-active text-white rounded-2xl font-bold shadow-xl shadow-active/20 hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {isLoading ? 'Creating Account...' : 'Sign Up Now'}
          {!isLoading && <ArrowRight size={20} />}
        </button>
      </form>
    </div>
  );
}
