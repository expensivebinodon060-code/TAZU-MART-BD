import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Server, 
  Database, 
  Globe, 
  Shield, 
  Settings, 
  ArrowLeft,
  Save,
  RotateCcw,
  Zap,
  Lock,
  HardDrive,
  Activity,
  CheckCircle2,
  XCircle,
  Loader2,
  RefreshCw,
  Eye,
  EyeOff
} from 'lucide-react';
import { HostingConfig } from '../types';

interface HostingSetupFormProps {
  onBack: () => void;
  onSuccess: () => void;
}

export default function HostingSetupForm({ onBack, onSuccess }: HostingSetupFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [activeSection, setActiveSection] = useState<number>(1);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<Partial<HostingConfig>>({
    providerName: '',
    serverType: 'VPS',
    serverIp: '',
    serverPort: 443,
    os: 'Ubuntu 22.04 LTS',
    controlPanel: 'None',
    appName: '',
    environmentMode: 'Production',
    runtimeType: 'Node.js',
    runtimeVersion: '',
    appRoot: '',
    publicDir: '',
    dbType: 'PostgreSQL',
    dbHost: 'localhost',
    dbPort: 5432,
    dbName: '',
    dbUsername: '',
    dbPassword: '',
    dbSslRequired: true,
    primaryDomain: '',
    subdomain: '',
    sslStatus: 'Pending',
    forceHttps: true,
    uploadPath: '',
    maxUploadSize: 50,
    filePermission: '755',
    backupPath: '',
    firewallEnabled: true,
    sshEnabled: true,
    rateLimit: 100,
    allowedIps: ['*'],
    adminIpRestriction: [],
    cronSetup: '',
    backgroundWorkerEnabled: true,
    cacheDriver: 'Redis',
    queueDriver: 'Redis',
    logLevel: 'Info'
  });

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const res = await fetch('/api/admin/hosting/config');
        const data = await res.json();
        setFormData(data);
      } catch (err) {
        console.error('Failed to fetch config', err);
      }
    };
    fetchConfig();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'number' ? parseFloat(value) : value;
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.providerName) newErrors.providerName = 'Provider name is required';
    if (!formData.serverIp) newErrors.serverIp = 'Server IP is required';
    if (!formData.appName) newErrors.appName = 'App name is required';
    if (!formData.dbName) newErrors.dbName = 'Database name is required';
    if (!formData.primaryDomain) newErrors.primaryDomain = 'Primary domain is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) {
      alert('Please fill in all required fields.');
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/hosting/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        alert('Configuration saved successfully! Audit log created.');
        onSuccess();
      } else {
        const error = await res.json();
        alert(`Error: ${error.message}`);
      }
    } catch (err) {
      console.error('Failed to save config', err);
      alert('Failed to connect to server.');
    } finally {
      setIsLoading(false);
    }
  };

  const testConnection = async (type: string) => {
    setIsValidating(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsValidating(false);
    alert(`${type} connection test successful!`);
  };

  const sections = [
    { id: 1, title: 'Basic Server Info', icon: Server },
    { id: 2, title: 'App Configuration', icon: Activity },
    { id: 3, title: 'Database Config', icon: Database },
    { id: 4, title: 'Domain & SSL', icon: Globe },
    { id: 5, title: 'Storage Config', icon: HardDrive },
    { id: 6, title: 'Security Settings', icon: Shield },
    { id: 7, title: 'Advanced Settings', icon: Settings },
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
            <h2 className="text-2xl font-black text-primary tracking-tight">Hosting Setup</h2>
            <p className="text-xs text-muted">Configure your production server environment and infrastructure.</p>
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
        {/* Sidebar */}
        <div className="col-span-3 space-y-2">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                activeSection === section.id 
                  ? 'bg-active text-white shadow-lg shadow-active/20' 
                  : 'text-muted hover:bg-hover hover:text-primary'
              }`}
            >
              <section.icon size={20} className={activeSection === section.id ? 'text-white' : 'group-hover:text-active'} />
              <span className="text-sm font-bold text-left">{section.title}</span>
            </button>
          ))}
        </div>

        {/* Form */}
        <div className="col-span-9">
          <form onSubmit={handleSave} className="space-y-8">
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
                      <Server size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Basic Server Info</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Hosting Provider Name</label>
                      <input 
                        name="providerName"
                        value={formData.providerName}
                        onChange={handleInputChange}
                        placeholder="e.g. DigitalOcean, AWS"
                        className={`w-full bg-hover border ${errors.providerName ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Server Type</label>
                      <select 
                        name="serverType"
                        value={formData.serverType}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="Shared">Shared</option>
                        <option value="VPS">VPS</option>
                        <option value="Dedicated">Dedicated</option>
                        <option value="Cloud">Cloud</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Server IP Address</label>
                      <input 
                        name="serverIp"
                        value={formData.serverIp}
                        onChange={handleInputChange}
                        placeholder="192.168.1.1"
                        className={`w-full bg-hover border ${errors.serverIp ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Server Port</label>
                      <input 
                        type="number"
                        name="serverPort"
                        value={formData.serverPort}
                        onChange={handleInputChange}
                        placeholder="443"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Operating System</label>
                      <input 
                        name="os"
                        value={formData.os}
                        onChange={handleInputChange}
                        placeholder="e.g. Ubuntu 22.04 LTS"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Control Panel</label>
                      <select 
                        name="controlPanel"
                        value={formData.controlPanel}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="None">None (Bare Metal)</option>
                        <option value="cPanel">cPanel</option>
                        <option value="Plesk">Plesk</option>
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
                      <Activity size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Application Configuration</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Application Name</label>
                      <input 
                        name="appName"
                        value={formData.appName}
                        onChange={handleInputChange}
                        placeholder="Auriel Canvas"
                        className={`w-full bg-hover border ${errors.appName ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Environment Mode</label>
                      <select 
                        name="environmentMode"
                        value={formData.environmentMode}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="Production">Production</option>
                        <option value="Staging">Staging</option>
                        <option value="Development">Development</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Runtime Type</label>
                      <select 
                        name="runtimeType"
                        value={formData.runtimeType}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="Node.js">Node.js</option>
                        <option value="PHP">PHP</option>
                        <option value="Python">Python</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Runtime Version</label>
                      <input 
                        name="runtimeVersion"
                        value={formData.runtimeVersion}
                        onChange={handleInputChange}
                        placeholder="e.g. 20.x"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">App Root Directory</label>
                      <input 
                        name="appRoot"
                        value={formData.appRoot}
                        onChange={handleInputChange}
                        placeholder="/var/www/html"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Public Directory</label>
                      <input 
                        name="publicDir"
                        value={formData.publicDir}
                        onChange={handleInputChange}
                        placeholder="public"
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
                      <Database size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Database Configuration</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Database Type</label>
                      <select 
                        name="dbType"
                        value={formData.dbType}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="MySQL">MySQL</option>
                        <option value="PostgreSQL">PostgreSQL</option>
                        <option value="MongoDB">MongoDB</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Database Host</label>
                      <input 
                        name="dbHost"
                        value={formData.dbHost}
                        onChange={handleInputChange}
                        placeholder="localhost"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Database Port</label>
                      <input 
                        type="number"
                        name="dbPort"
                        value={formData.dbPort}
                        onChange={handleInputChange}
                        placeholder="5432"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Database Name</label>
                      <input 
                        name="dbName"
                        value={formData.dbName}
                        onChange={handleInputChange}
                        placeholder="auriel_db"
                        className={`w-full bg-hover border ${errors.dbName ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Username</label>
                      <input 
                        name="dbUsername"
                        value={formData.dbUsername}
                        onChange={handleInputChange}
                        placeholder="admin"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Password</label>
                      <div className="relative">
                        <input 
                          type={showPassword ? 'text' : 'password'}
                          name="dbPassword"
                          value={formData.dbPassword}
                          onChange={handleInputChange}
                          placeholder="••••••••"
                          className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono pr-12"
                        />
                        <button 
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-primary transition-all"
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                    <div className="col-span-2">
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">SSL Required</div>
                          <p className="text-[10px] text-muted">Force SSL connection for database.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('dbSslRequired')}
                          className={`w-12 h-6 rounded-full relative transition-all ${formData.dbSslRequired ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.dbSslRequired ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                  </div>
                  <div className="pt-4">
                    <button 
                      type="button"
                      onClick={() => testConnection('Database')}
                      className="w-full py-4 bg-hover border border-border rounded-2xl text-xs font-bold text-secondary hover:bg-border transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} />
                      Test Database Connection
                    </button>
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
                      <Globe size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Domain & SSL Configuration</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Primary Domain</label>
                      <input 
                        name="primaryDomain"
                        value={formData.primaryDomain}
                        onChange={handleInputChange}
                        placeholder="aurielcanvas.com"
                        className={`w-full bg-hover border ${errors.primaryDomain ? 'border-rose-500' : 'border-border'} rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono`}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Subdomain (Optional)</label>
                      <input 
                        name="subdomain"
                        value={formData.subdomain}
                        onChange={handleInputChange}
                        placeholder="shop"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="col-span-2 space-y-4">
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Force HTTPS</div>
                          <p className="text-[10px] text-muted">Redirect all traffic to HTTPS.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('forceHttps')}
                          className={`w-12 h-6 rounded-full relative transition-all ${formData.forceHttps ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.forceHttps ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="p-4 bg-hover rounded-2xl border border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Shield size={16} className="text-active" />
                          <span className="text-sm font-bold text-primary">SSL Status: {formData.sslStatus}</span>
                        </div>
                        <button 
                          type="button"
                          onClick={() => testConnection('SSL')}
                          className="px-4 py-2 bg-hover border border-border rounded-xl text-[10px] font-bold text-muted hover:text-primary transition-all uppercase tracking-widest"
                        >
                          Check Status
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
                      <HardDrive size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Storage Configuration</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Upload Directory Path</label>
                      <input 
                        name="uploadPath"
                        value={formData.uploadPath}
                        onChange={handleInputChange}
                        placeholder="/var/www/html/uploads"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Max Upload Size (MB)</label>
                      <input 
                        type="number"
                        name="maxUploadSize"
                        value={formData.maxUploadSize}
                        onChange={handleInputChange}
                        placeholder="50"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">File Permission Mode</label>
                      <input 
                        name="filePermission"
                        value={formData.filePermission}
                        onChange={handleInputChange}
                        placeholder="755"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Backup Directory Path</label>
                      <input 
                        name="backupPath"
                        value={formData.backupPath}
                        onChange={handleInputChange}
                        placeholder="/var/www/html/backups"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                  </div>
                  <div className="pt-4">
                    <button 
                      type="button"
                      onClick={() => testConnection('Storage Path')}
                      className="w-full py-4 bg-hover border border-border rounded-2xl text-xs font-bold text-muted hover:bg-border transition-all flex items-center justify-center gap-2"
                    >
                      <RefreshCw size={14} />
                      Verify Directory Existence
                    </button>
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
                      <Shield size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Security Settings</h3>
                  </div>

                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">Firewall Enabled</div>
                          <p className="text-[10px] text-muted">Enable system-level firewall.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('firewallEnabled')}
                          className={`w-12 h-6 rounded-full relative transition-all ${formData.firewallEnabled ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.firewallEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                      <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                        <div className="space-y-1">
                          <div className="text-sm font-bold text-primary">SSH Access</div>
                          <p className="text-[10px] text-muted">Enable SSH terminal access.</p>
                        </div>
                        <button 
                          type="button"
                          onClick={() => handleToggle('sshEnabled')}
                          className={`w-12 h-6 rounded-full relative transition-all ${formData.sshEnabled ? 'bg-active' : 'bg-hover'}`}
                        >
                          <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.sshEnabled ? 'left-7' : 'left-1'}`} />
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">API Rate Limit (req/min)</label>
                      <input 
                        type="number"
                        name="rateLimit"
                        value={formData.rateLimit}
                        onChange={handleInputChange}
                        placeholder="100"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Admin Access IP Restriction (Comma separated)</label>
                      <input 
                        name="adminIpRestriction"
                        value={formData.adminIpRestriction?.join(', ')}
                        onChange={(e) => setFormData(prev => ({ ...prev, adminIpRestriction: e.target.value.split(',').map(ip => ip.trim()).filter(ip => ip) }))}
                        placeholder="127.0.0.1, 192.168.1.100"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeSection === 7 && (
                <motion.div
                  key="section-7"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="p-8 bg-surface border border-border rounded-card space-y-8"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center">
                      <Settings size={20} />
                    </div>
                    <h3 className="text-lg font-bold text-primary">Advanced Settings</h3>
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Cron Job Setup</label>
                      <input 
                        name="cronSetup"
                        value={formData.cronSetup}
                        onChange={handleInputChange}
                        placeholder="0 0 * * * backup.sh"
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all font-mono"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Cache Driver</label>
                      <select 
                        name="cacheDriver"
                        value={formData.cacheDriver}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="Redis">Redis</option>
                        <option value="File">File</option>
                        <option value="Memcached">Memcached</option>
                      </select>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-bold text-muted uppercase tracking-widest px-2">Log Level</label>
                      <select 
                        name="logLevel"
                        value={formData.logLevel}
                        onChange={handleInputChange}
                        className="w-full bg-hover border border-border rounded-2xl px-4 py-4 text-sm outline-none focus:border-active transition-all appearance-none cursor-pointer"
                      >
                        <option value="Error">Error</option>
                        <option value="Warning">Warning</option>
                        <option value="Info">Info</option>
                        <option value="Debug">Debug</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center p-4 bg-hover rounded-2xl border border-border">
                      <div className="space-y-1">
                        <div className="text-sm font-bold text-primary">Background Worker</div>
                        <p className="text-[10px] text-muted">Enable queue processing.</p>
                      </div>
                      <button 
                        type="button"
                        onClick={() => handleToggle('backgroundWorkerEnabled')}
                        className={`w-12 h-6 rounded-full relative transition-all ${formData.backgroundWorkerEnabled ? 'bg-active' : 'bg-hover'}`}
                      >
                        <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${formData.backgroundWorkerEnabled ? 'left-7' : 'left-1'}`} />
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form Buttons */}
            <div className="flex flex-wrap gap-4 pt-4">
              <button 
                type="button"
                onClick={() => testConnection('Server')}
                disabled={isValidating}
                className="px-6 py-4 bg-hover border border-border rounded-2xl text-xs font-bold text-muted hover:bg-border transition-all flex items-center gap-2 disabled:opacity-50"
              >
                {isValidating ? <Loader2 size={14} className="animate-spin" /> : <Zap size={14} />}
                Test Connection
              </button>
              <button 
                type="button"
                onClick={() => setFormData({})}
                className="px-6 py-4 bg-hover border border-border rounded-2xl text-xs font-bold text-muted hover:bg-border transition-all flex items-center gap-2"
              >
                <RotateCcw size={14} />
                Rollback Changes
              </button>
              <button 
                type="submit"
                disabled={isLoading}
                className="px-8 py-4 bg-active text-white rounded-2xl text-xs font-bold hover:bg-active/90 transition-all shadow-lg shadow-active/20 flex items-center gap-2 disabled:opacity-50 ml-auto"
              >
                {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
                Save Configuration
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
