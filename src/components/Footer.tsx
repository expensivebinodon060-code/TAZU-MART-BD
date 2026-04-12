import React from 'react';
import { Facebook, Youtube, Instagram, Mail, Phone, MapPin, ExternalLink } from 'lucide-react';
import { useBranding } from '../contexts/BrandingContext';

const Footer: React.FC = () => {
  const { branding } = useBranding();
  const footer = branding?.footer;

  if (!footer) return null;

  const TikTokIcon = () => (
    <svg 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="w-5 h-5"
    >
      <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
    </svg>
  );

  return (
    <footer className="bg-[#0B132B] text-white pt-[60px] pb-[40px] px-4 md:px-8">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Section 1: Brand Area */}
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            {footer.logoUrl ? (
              <img src={footer.logoUrl} alt="Logo" className="h-10 w-auto" referrerPolicy="no-referrer" />
            ) : (
              <span className="text-xl font-black tracking-tight text-active">TAZU MART BD</span>
            )}
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            {footer.description}
          </p>
          <div className="flex items-center gap-4">
            {footer.facebookUrl && (
              <a href={footer.facebookUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-active hover:text-white transition-all">
                <Facebook size={20} />
              </a>
            )}
            {footer.youtubeUrl && (
              <a href={footer.youtubeUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-active hover:text-white transition-all">
                <Youtube size={20} />
              </a>
            )}
            {footer.instagramUrl && (
              <a href={footer.instagramUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-active hover:text-white transition-all">
                <Instagram size={20} />
              </a>
            )}
            {footer.tiktokUrl && (
              <a href={footer.tiktokUrl} target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-gray-400 hover:bg-active hover:text-white transition-all">
                <TikTokIcon />
              </a>
            )}
          </div>
        </div>

        {/* Section 2: Quick Links */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold">Quick Links</h3>
          <ul className="space-y-3">
            {footer.quickLinks.map((link) => (
              <li key={link.id}>
                <a href={link.url} className="text-gray-400 hover:text-active text-sm transition-colors flex items-center gap-2">
                  <ExternalLink size={12} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 3: Customer Service */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold">Customer Service</h3>
          <ul className="space-y-3">
            {footer.customerServiceLinks.map((link) => (
              <li key={link.id}>
                <a href={link.url} className="text-gray-400 hover:text-active text-sm transition-colors flex items-center gap-2">
                  <ExternalLink size={12} />
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Section 4: Contact Info */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold">Contact Us</h3>
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <MapPin className="text-active shrink-0 mt-1" size={18} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                <div className="text-gray-400 text-sm space-y-0.5">
                  <p>Jatrabari, Rayerbagh Pair of Poles</p>
                  <p>Dhaka, Bangladesh</p>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Phone className="text-active shrink-0 mt-1" size={18} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Phone</p>
                <div className="text-gray-400 text-sm space-y-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Personal Contact</p>
                    <p>01533975029</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Official Contact</p>
                    <p>01834800916</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Mail className="text-active shrink-0 mt-1" size={18} />
              <div>
                <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                <div className="text-gray-400 text-sm space-y-2">
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Primary Email</p>
                    <p>admin.tazumartbd@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Admin</p>
                    <p>admin.tazumartbd@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Moderator</p>
                    <p>moderator.tazumartbd@gmail.com</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-tight">Support</p>
                    <p>support.tazumartbd@gmail.com</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Area */}
      <div className="max-w-7xl mx-auto mt-16 pt-8 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-gray-500 text-xs">
          {footer.copyrightText}
        </p>
        <p className="text-gray-500 text-[10px] font-bold uppercase tracking-widest">
          Developed by TAZU MART Tech Team
        </p>
      </div>
    </footer>
  );
};

export default Footer;
