import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { User, Lock, ArrowRight, Mail, Facebook } from 'lucide-react';

interface LoginProps {
  onLogin: (user: any) => void;
  onSignUpClick: () => void;
}

export default function Login({ onLogin, onSignUpClick }: LoginProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      if (!event.origin.endsWith('.run.app') && !event.origin.includes('localhost')) {
        return;
      }

      if (event.data?.type === 'OAUTH_AUTH_SUCCESS') {
        const { user, accessToken } = event.data;
        if (accessToken) localStorage.setItem('access_token', accessToken);
        onLogin(user);
      }
    };

    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onLogin]);

  const [showHelp, setShowHelp] = useState(false);

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/google/url');
      const { url } = await res.json();
      window.open(url, 'google_oauth', 'width=600,height=700');
    } catch (err) {
      setError('Failed to start Google login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFacebookLogin = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/auth/facebook/url');
      const { url } = await res.json();
      window.open(url, 'facebook_oauth', 'width=600,height=700');
    } catch (err) {
      setError('Failed to start Facebook login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        if (data.accessToken) localStorage.setItem('access_token', data.accessToken);
        onLogin(data.user);
      } else {
        setError(data.message || 'Invalid email or password');
      }
    } catch (err) {
      setError('Connection error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] p-4 text-center space-y-8 max-w-md mx-auto">
      <div className="space-y-2">
        <h2 className="text-3xl font-bold text-primary tracking-tight">Welcome Back</h2>
        <p className="text-secondary text-sm">Login to your account to continue</p>
      </div>

      <div className="w-full space-y-6">
        {/* Social Logins (TOP) */}
        <div className="space-y-3">
          <button 
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full py-3.5 bg-white border border-gray-200 text-gray-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-gray-50 transition-all shadow-sm disabled:opacity-50"
          >
            <img src="https://www.google.com/favicon.ico" alt="Google" className="w-5 h-5" referrerPolicy="no-referrer" />
            Continue with Google
          </button>
          
          <button 
            onClick={handleFacebookLogin}
            disabled={isLoading}
            className="w-full py-3.5 bg-[#1877F2] text-white rounded-2xl font-bold flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-sm disabled:opacity-50"
          >
            <Facebook size={20} fill="white" />
            Continue with Facebook
          </button>
        </div>

        <div className="flex items-center gap-4 py-2">
          <div className="h-[1px] flex-1 bg-gray-100" />
          <span className="text-xs text-secondary font-medium uppercase tracking-widest">OR</span>
          <div className="h-[1px] flex-1 bg-gray-100" />
        </div>

        {/* Manual Login */}
        <form onSubmit={handleSubmit} className="space-y-4 text-left">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary uppercase ml-1">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-2xl outline-none transition-all"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-secondary uppercase ml-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-2xl outline-none transition-all"
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
            className="w-full py-4 bg-active text-white rounded-2xl font-bold shadow-lg shadow-active/20 hover:opacity-90 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50"
          >
            {isLoading ? 'Processing...' : 'Confirm'}
            {!isLoading && <ArrowRight size={20} />}
          </button>
        </form>

        <p className="text-sm text-secondary pt-4">
          Don't have an account?{' '}
          <button 
            onClick={onSignUpClick}
            className="text-active font-bold hover:underline"
          >
            Sign Up
          </button>
        </p>

        <div className="pt-8 border-t border-gray-100">
          <button 
            onClick={() => setShowHelp(!showHelp)}
            className="text-[10px] text-secondary font-bold uppercase tracking-widest hover:text-active transition-all"
          >
            {showHelp ? 'Hide Troubleshooting' : 'Login Issues?'}
          </button>
          
          {showHelp && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-4 p-4 bg-gray-50 rounded-2xl text-left space-y-3"
            >
              <p className="text-[10px] font-bold text-secondary uppercase">OAuth Redirect URI</p>
              <div className="p-2 bg-white border border-gray-200 rounded-lg font-mono text-[10px] break-all select-all">
                {window.location.origin}/auth/callback
              </div>
              <p className="text-[10px] text-secondary leading-relaxed">
                If you see <span className="font-bold">invalid_client</span>, ensure this exact URI is added to your Google Cloud Console under "Authorized Redirect URIs" and that your Client ID is correct.
              </p>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
