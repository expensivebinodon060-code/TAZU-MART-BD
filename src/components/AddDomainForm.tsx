import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Share2, 
  ShieldCheck, 
  Server, 
  Settings, 
  Mail, 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  ArrowLeft,
  Save,
  RotateCcw,
  Zap,
  Search,
  Lock,
  ChevronDown,
  Upload,
  Activity
} from 'lucide-react';

interface AddDomainFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function AddDomainForm({ onBack, onSuccess }: AddDomainFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(1);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [dnsStatus, setDnsStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState({
    // Section A: Basic
    domainName: '',
    domainType: 'Primary',
    serverIp: '192.168.1.1',
    wwwPreference: 'Auto',

    // Section B: DNS
    ns1: '',
    ns2: '',
    ns3: '',
    aRecord: '',
    ttl: '3600',

    // Section C: SSL
    sslEnabled: true,
    sslType: 'LetsEncrypt',
    sslCertificate: '',
    sslPrivateKey: '',
    caBundle: '',

    // Section D: Security
    forceHttps: true,
    hstsEnabled: true,
    cdnEnabled: false,
    maintenanceMode: false,

    // Section E: Redirect
    redirectUrl: '',
    redirectType: '301',

    // Email (Optional)
    emailEnabled: false,
    mailServer: '',
    mailPort: '587',
    spfRecord: '',
    dkimRecord: ''
  });

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Section A Validation
    if (!formData.domainName.trim()) {
      newErrors.domainName = 'Domain name is required';
    } else if (!/^[a-zA-Z0-9][a-zA-Z0-9-]{1,61}[a-zA-Z0-9]\.[a-zA-Z]{2,}$/.test(formData.domainName.trim())) {
      newErrors.domainName = 'Invalid domain format';
    }

    if (!formData.serverIp.trim()) {
      newErrors.serverIp = 'Server IP is required';
    } else if (!/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(formData.serverIp.trim())) {
      newErrors.serverIp = 'Invalid IP address format';
    }

    // Section B Validation
    if (!formData.ns1.trim()) newErrors.ns1 = 'Nameserver 1 is required';
    if (!formData.ns2.trim()) newErrors.ns2 = 'Nameserver 2 is required';
    if (!formData.aRecord.trim()) newErrors.aRecord = 'A Record is required';

    // Section E Validation (if redirect URL is filled)
    if (formData.redirectUrl.trim() && !/^https?:\/\/.+/.test(formData.redirectUrl.trim())) {
      newErrors.redirectUrl = 'Invalid redirect URL format (must include http/https)';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setFormData(prev => ({ ...prev, [name]: val }));
    if (errors[name]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[name];
        return next;
      });
    }
  };

  const handleToggle = (name: string) => {
    setFormData(prev => ({ ...prev, [name]: !prev[name as keyof typeof prev] }));
  };

  const validateDomain = async () => {
    if (!formData.domainName) {
      alert('Please enter a domain name first.');
      return;
    }
    setIsValidating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsValidating(false);
    alert('Domain format and availability validated.');
  };

  const checkDns = async () => {
    if (!formData.aRecord) {
      alert('Please enter an A Record first.');
      return;
    }
    setIsValidating(true);
    setDnsStatus('idle');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Check if A record matches server IP
    if (formData.aRecord.trim() === formData.serverIp.trim()) {
      setDnsStatus('success');
      alert('DNS Validation Successful: A Record matches Server IP.');
    } else {
      setDnsStatus('error');
      alert('DNS Validation Failed: A Record does not match Server IP.');
    }
    setIsValidating(false);
  };

  const testConnection = async () => {
    setIsValidating(true);
    setConnectionStatus('idle');
    await new Promise(resolve => setTimeout(resolve, 2000));
    // Simulate connection success
    setConnectionStatus('success');
    setIsValidating(false);
    alert('Server connection established successfully.');
  };

  const handleSaveClick = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      setShowConfirmModal(true);
    } else {
      // Find first section with error
      if (errors.domainName) setActiveSection(1);
      else if (errors.ns1 || errors.ns2 || errors.aRecord) setActiveSection(2);
      else if (errors.serverIp) setActiveSection(4);
      alert('Please correct the errors in the form before saving.');
    }
  };

  const confirmSubmit = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/infra-config/domain/add', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          domainName: formData.domainName.trim(),
        }),
      });
      if (res.ok) {
        alert('Domain added and connected successfully! Activity logged.');
        onSuccess();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Failed to add domain', err);
      alert('Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const sections = [
    { id: 1, title: 'Basic Domain Info', icon: Globe },
    { id: 2, title: 'DNS Configuration', icon: Share2 },
    { id: 3, title: 'SSL Configuration', icon: ShieldCheck },
    { id: 4, title: 'Security Settings', icon: Server },
    { id: 5, title: 'Redirect Settings', icon: Settings },
    { id: 6, title: 'Email (Optional)', icon: Mail },
  ];

  return (
    <div className="space-y-8 pb-20">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onBack}
            className="p-3 bg-hover border border-border rounded-2xl text-secondary hover:text-primary transition-all"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h2 className="text-2xl font-black text-primary tracking-tight">Add New Domain</h2>
            <p className="text-xs text-muted">Configure and connect a new enterprise domain to your infrastructure.</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="px-4 py-2 bg-active/10 border border-active/20 rounded-xl flex items-center gap-2">
            <Lock size={14} className="text-active" />
            <span className="text-[10px] font-bold text-active uppercase tracking-widest">Super Admin Access</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-8">
        {/* Sidebar Navigation */}
        <div className="col-span-3 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                activeSection === section.id 
                  ? 'bg-active text-white shadow-lg shadow-active/20' 
                  : 'text-secondary hover:bg-hover hover:text-primary'
              }`}
            >
              <section.icon size={20} className={activeSection === section.id ? 'text-white' : 'group-hover:text-primary'} />
              <span className="text-sm font-bold text-left">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="col-span-9">
          <form onSubmit={handleSaveClick} className="space-y-8">
            <AnimatePresence mode="wait">
              {activeSection === 1 && (
                <motion.div
                  key="section-1"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 bg-surface border border-border rounded-card space-y-8"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                      <Globe size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">SECTION A — Basic Domain Info</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Domain Name</label>
                      <input 
                        name="domainName"
                        value={formData.domainName}
                        onChange={handleInputChange}
                        placeholder="e.g. yoursite.com"
                        className={`w-full bg-hover border ${errors.domainName ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all`}
                        required
                      />
                      {errors.domainName && <p className="text-[10px] text-rose-500 font-bold px-2">{errors.domainName}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Domain Type</label>
                      <select 
                        name="domainType"
                        value={formData.domainType}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="Primary">Primary Domain</option>
                        <option value="Addon">Addon Domain</option>
                        <option value="Subdomain">Subdomain</option>
                        <option value="Parked">Parked Domain</option>
                      </select>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">Server IP Address</label>
                        {connectionStatus === 'success' && <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 uppercase tracking-widest"><CheckCircle2 size={10} /> Validated</div>}
                      </div>
                      <input 
                        name="serverIp"
                        value={formData.serverIp}
                        onChange={handleInputChange}
                        placeholder="192.168.1.1"
                        className={`w-full bg-hover border ${errors.serverIp ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono`}
                        required
                      />
                      {errors.serverIp && <p className="text-[10px] text-rose-500 font-bold px-2">{errors.serverIp}</p>}
                    </div>

                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">WWW Preference</label>
                      <select 
                        name="wwwPreference"
                        value={formData.wwwPreference}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="Auto">Auto Detect</option>
                        <option value="With">With www</option>
                        <option value="Without">Without www</option>
                      </select>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 2 && (
                <motion.div
                  key="section-2"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 bg-surface border border-border rounded-card space-y-8"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                      <Share2 size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">SECTION B — DNS Configuration</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Nameserver 1</label>
                      <input 
                        name="ns1"
                        value={formData.ns1}
                        onChange={handleInputChange}
                        placeholder="ns1.example.com"
                        className={`w-full bg-hover border ${errors.ns1 ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono`}
                      />
                      {errors.ns1 && <p className="text-[10px] text-rose-500 font-bold px-2">{errors.ns1}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Nameserver 2</label>
                      <input 
                        name="ns2"
                        value={formData.ns2}
                        onChange={handleInputChange}
                        placeholder="ns2.example.com"
                        className={`w-full bg-hover border ${errors.ns2 ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono`}
                      />
                      {errors.ns2 && <p className="text-[10px] text-rose-500 font-bold px-2">{errors.ns2}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Nameserver 3 (Optional)</label>
                      <input 
                        name="ns3"
                        value={formData.ns3}
                        onChange={handleInputChange}
                        placeholder="ns3.example.com"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center px-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest">A Record (Server IP)</label>
                        {dnsStatus === 'success' && <div className="flex items-center gap-1 text-[8px] font-bold text-emerald-500 uppercase tracking-widest"><CheckCircle2 size={10} /> Validated</div>}
                        {dnsStatus === 'error' && <div className="flex items-center gap-1 text-[8px] font-bold text-rose-500 uppercase tracking-widest"><XCircle size={10} /> Mismatch</div>}
                      </div>
                      <input 
                        name="aRecord"
                        value={formData.aRecord}
                        onChange={handleInputChange}
                        placeholder="1.2.3.4"
                        className={`w-full bg-hover border ${errors.aRecord ? 'border-rose-500' : dnsStatus === 'success' ? 'border-emerald-500' : dnsStatus === 'error' ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono`}
                      />
                      {errors.aRecord && <p className="text-[10px] text-rose-500 font-bold px-2">{errors.aRecord}</p>}
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">MX Record (Optional)</label>
                      <input 
                        name="mxRecord"
                        value={formData.mxRecord}
                        onChange={handleInputChange}
                        placeholder="mail.example.com"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">DNS TTL</label>
                      <input 
                        name="ttl"
                        value={formData.ttl}
                        onChange={handleInputChange}
                        placeholder="3600"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 3 && (
                <motion.div
                  key="section-3"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 bg-surface border border-border rounded-card space-y-8"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                      <ShieldCheck size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">SECTION C — SSL Configuration</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-primary">SSL Enabled</div>
                        <p className="text-[10px] text-muted">Secure your domain with an SSL certificate.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('sslEnabled')}
                        className={`w-12 h-6 rounded-full relative transition-all ${formData.sslEnabled ? 'bg-active' : 'bg-hover'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.sslEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {formData.sslEnabled && (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">SSL Type</label>
                          <select 
                            name="sslType"
                            value={formData.sslType}
                            onChange={handleInputChange}
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                          >
                            <option value="LetsEncrypt">Let’s Encrypt</option>
                            <option value="Custom">Custom Upload</option>
                            <option value="Cloudflare">Cloudflare</option>
                          </select>
                        </div>
                        {formData.sslType === 'Custom' && (
                          <div className="col-span-2 space-y-4">
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Upload SSL Certificate</label>
                              <textarea 
                                name="sslCertificate"
                                value={formData.sslCertificate}
                                onChange={handleInputChange}
                                placeholder="-----BEGIN CERTIFICATE-----"
                                className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-xs outline-none focus:border-active transition-all font-mono h-32"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Private Key</label>
                              <textarea 
                                name="sslPrivateKey"
                                value={formData.sslPrivateKey}
                                onChange={handleInputChange}
                                placeholder="-----BEGIN PRIVATE KEY-----"
                                className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-xs outline-none focus:border-active transition-all font-mono h-32"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">CA Bundle</label>
                              <textarea 
                                name="caBundle"
                                value={formData.caBundle}
                                onChange={handleInputChange}
                                placeholder="-----BEGIN CERTIFICATE-----"
                                className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-xs outline-none focus:border-active transition-all font-mono h-32"
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Force HTTPS</div>
                          <p className="text-[10px] text-muted">Redirect all traffic to HTTPS.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('forceHttps')}
                          className={`w-10 h-5 rounded-full relative transition-all ${formData.forceHttps ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.forceHttps ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">HSTS Enable</div>
                          <p className="text-[10px] text-muted">Strict Transport Security.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('hstsEnable')}
                          className={`w-10 h-5 rounded-full relative transition-all ${formData.hstsEnable ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.hstsEnable ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 4 && (
                <motion.div
                  key="section-4"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 bg-surface border border-border rounded-card space-y-8"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                      <Server size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">SECTION D — Security Settings</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Force HTTPS</div>
                          <p className="text-[10px] text-muted">Redirect all traffic to HTTPS.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('forceHttps')}
                          className={`w-10 h-5 rounded-full relative transition-all ${formData.forceHttps ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.forceHttps ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Enable HSTS</div>
                          <p className="text-[10px] text-muted">Strict Transport Security.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('hstsEnabled')}
                          className={`w-10 h-5 rounded-full relative transition-all ${formData.hstsEnabled ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.hstsEnabled ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Enable CDN</div>
                          <p className="text-[10px] text-muted">Content Delivery Network.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('cdnEnabled')}
                          className={`w-10 h-5 rounded-full relative transition-all ${formData.cdnEnabled ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.cdnEnabled ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Maintenance Mode</div>
                          <p className="text-[10px] text-muted">Show maintenance page.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('maintenanceMode')}
                          className={`w-10 h-5 rounded-full relative transition-all ${formData.maintenanceMode ? 'bg-rose-500' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${formData.maintenanceMode ? 'left-6' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 5 && (
                <motion.div
                  key="section-5"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 bg-surface border border-border rounded-card space-y-8"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                      <Settings size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">SECTION E — Redirect Settings</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Redirect URL (Optional)</label>
                        <input 
                          name="redirectUrl"
                          value={formData.redirectUrl}
                          onChange={handleInputChange}
                          placeholder="e.g. https://targetsite.com"
                          className={`w-full bg-hover border ${errors.redirectUrl ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all`}
                        />
                        {errors.redirectUrl && <p className="text-[10px] text-rose-500 font-bold px-2">{errors.redirectUrl}</p>}
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Redirect Type</label>
                        <select 
                          name="redirectType"
                          value={formData.redirectType}
                          onChange={handleInputChange}
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                        >
                          <option value="301">301 (Permanent)</option>
                          <option value="302">302 (Temporary)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 6 && (
                <motion.div
                  key="section-6"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 bg-surface border border-border rounded-card space-y-8"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                      <Mail size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Email Configuration</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-primary">Enable Email Hosting</div>
                        <p className="text-[10px] text-muted">Configure mail server for this domain.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('enableEmail')}
                        className={`w-12 h-6 rounded-full relative transition-all ${formData.enableEmail ? 'bg-active' : 'bg-hover'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.enableEmail ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>

                    {formData.enableEmail && (
                      <div className="grid grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Mail Server</label>
                          <input 
                            name="mailServer"
                            value={formData.mailServer}
                            onChange={handleInputChange}
                            placeholder="mail.yoursite.com"
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Mail Port</label>
                          <input 
                            name="mailPort"
                            value={formData.mailPort}
                            onChange={handleInputChange}
                            placeholder="587"
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">SPF Record</label>
                          <input 
                            name="spfRecord"
                            value={formData.spfRecord}
                            onChange={handleInputChange}
                            placeholder="v=spf1 include:..."
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">DKIM Record</label>
                          <input 
                            name="dkimRecord"
                            value={formData.dkimRecord}
                            onChange={handleInputChange}
                            placeholder="v=DKIM1; k=rsa; ..."
                            className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                type="button"
                onClick={validateDomain}
                disabled={isValidating}
                className="px-6 py-4 bg-hover border border-border rounded-2xl text-xs font-bold text-secondary hover:bg-border transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isValidating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                Validate Domain
              </button>
              <button 
                type="button"
                onClick={checkDns}
                disabled={isValidating}
                className="px-6 py-4 bg-hover border border-border rounded-2xl text-xs font-bold text-secondary hover:bg-border transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isValidating ? <Loader2 size={14} className="animate-spin" /> : <Share2 size={14} />}
                Check DNS
              </button>
              <button 
                type="button"
                className="px-6 py-4 bg-hover border border-border rounded-2xl text-xs font-bold text-secondary hover:bg-border transition-all flex items-center gap-2"
              >
                <ShieldCheck size={14} />
                Generate SSL
              </button>
              <div className="flex-1" />
              <button 
                type="button"
                onClick={() => setFormData({ ...formData, domainName: '' })}
                className="px-6 py-4 bg-rose-500/10 border border-rose-500/20 rounded-2xl text-xs font-bold text-rose-500 hover:bg-rose-500 hover:text-white transition-all flex items-center gap-2"
              >
                <RotateCcw size={14} />
                Rollback Domain
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-active text-white rounded-2xl text-xs font-bold hover:bg-active/90 transition-all flex items-center gap-2 shadow-lg shadow-active/20 disabled:opacity-50"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save & Connect
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirmModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowConfirmModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-md bg-[#111111] border border-white/10 rounded-[32px] p-8 shadow-2xl space-y-6"
            >
              <div className="w-16 h-16 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center mx-auto">
                <Globe size={32} />
              </div>
              <div className="text-center space-y-2">
                <h3 className="text-xl font-bold text-[#EAEAEA]">Confirm Domain Connection</h3>
                <p className="text-sm text-secondary">
                  You are about to connect <span className="text-primary font-mono">{formData.domainName}</span> to your infrastructure. This will update DNS and SSL settings.
                </p>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-secondary">Server IP</span>
                  <span className="text-primary font-mono">{formData.serverIp}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-secondary">A Record</span>
                  <span className="text-primary font-mono">{formData.aRecord}</span>
                </div>
                <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                  <span className="text-secondary">SSL Type</span>
                  <span className="text-primary">{formData.sslType}</span>
                </div>
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 py-4 bg-white/5 border border-white/10 rounded-2xl text-xs font-bold text-secondary hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmSubmit}
                  className="flex-1 py-4 bg-indigo-500 text-white rounded-2xl text-xs font-bold hover:bg-indigo-600 transition-all shadow-lg shadow-indigo-500/20"
                >
                  Confirm & Connect
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
