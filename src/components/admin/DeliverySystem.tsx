import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Truck, 
  Globe, 
  Settings, 
  MapPin, 
  DollarSign, 
  History, 
  Plus, 
  Save, 
  Trash2, 
  CheckCircle2, 
  AlertCircle,
  Search,
  ChevronRight,
  ShieldCheck,
  Power,
  ExternalLink
} from 'lucide-react';
import { CourierConfig, DeliveryZone, DeliveryLog } from '../../types';

type Tab = 'couriers' | 'zones' | 'charges' | 'logs';

export default function DeliverySystem() {
  const [activeTab, setActiveTab] = useState<Tab>('couriers');
  const [couriers, setCouriers] = useState<CourierConfig[]>([]);
  const [zones, setZones] = useState<DeliveryZone[]>([]);
  const [logs, setLogs] = useState<DeliveryLog[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [globalRules, setGlobalRules] = useState({ 
    free_delivery_threshold: 2000, 
    global_cod_fee: 50,
    auto_dispatch_steadfast: false,
    auto_dispatch_pathao: false
  });

  useEffect(() => {
    fetchData();
    fetchGlobalRules();
  }, [activeTab]);

  const fetchGlobalRules = async () => {
    try {
      const res = await fetch('/api/admin/delivery/global-rules');
      if (res.ok) {
        setGlobalRules(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch global rules', err);
    }
  };

  const handleUpdateGlobalRules = async () => {
    try {
      const res = await fetch('/api/delivery/global-rules', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(globalRules)
      });
      if (res.ok) {
        alert('Global delivery rules updated successfully!');
      }
    } catch (err) {
      console.error('Failed to update global rules', err);
    }
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'couriers') {
        const res = await fetch('/api/admin/delivery/couriers');
        setCouriers(await res.json());
      } else if (activeTab === 'zones' || activeTab === 'charges') {
        const res = await fetch('/api/admin/delivery/zones');
        setZones(await res.json());
      } else if (activeTab === 'logs') {
        const res = await fetch('/api/admin/delivery/logs');
        setLogs(await res.json());
      }
    } catch (err) {
      console.error('Failed to fetch delivery data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateCourier = async (config: CourierConfig) => {
    try {
      const res = await fetch(`/api/admin/delivery/couriers/${config.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });
      if (res.ok) {
        alert('Courier configuration saved successfully!');
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update courier', err);
    }
  };

  const handleUpdateZone = async (zone: DeliveryZone) => {
    try {
      const res = await fetch(`/api/admin/delivery/zones/${zone.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(zone)
      });
      if (res.ok) {
        fetchData();
      }
    } catch (err) {
      console.error('Failed to update zone', err);
    }
  };

  const divisions = [
    'Dhaka', 'Chattogram', 'Rajshahi', 'Khulna', 'Barishal', 'Sylhet', 'Rangpur', 'Mymensingh'
  ];

  const renderCouriers = () => (
    <div className="space-y-6">
      {couriers.map(courier => (
        <div key={courier.id} className="p-8 bg-card border border-white/5 rounded-[32px] space-y-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
                <Truck size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-[#EAEAEA]">{courier.name}</h3>
                <p className="text-xs text-secondary">API Configuration & Integration Settings</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={() => handleUpdateCourier({ ...courier, isActive: !courier.isActive })}
                className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  courier.isActive ? 'bg-green-500/10 text-green-400' : 'bg-white/5 text-secondary'
                }`}
              >
                <Power size={14} />
                {courier.isActive ? 'Active' : 'Inactive'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Courier Name</label>
                <select 
                  value={courier.name}
                  onChange={(e) => setCouriers(couriers.map(c => c.id === courier.id ? { ...c, name: e.target.value } : c))}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-[#EAEAEA] focus:outline-none focus:border-indigo-500/50 transition-all"
                >
                  <option value="Steadfast Courier">Steadfast Courier</option>
                  <option value="Pathao">Pathao</option>
                  <option value="RedX">RedX</option>
                  <option value="Paperfly">Paperfly</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">API Base URL</label>
                <input 
                  type="text"
                  value={courier.baseUrl}
                  onChange={(e) => setCouriers(couriers.map(c => c.id === courier.id ? { ...c, baseUrl: e.target.value } : c))}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-[#EAEAEA] focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">API Key</label>
                <input 
                  type="password"
                  value={courier.apiKey}
                  onChange={(e) => setCouriers(couriers.map(c => c.id === courier.id ? { ...c, apiKey: e.target.value } : c))}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-[#EAEAEA] focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Secret Key</label>
                <input 
                  type="password"
                  value={courier.secretKey}
                  onChange={(e) => setCouriers(couriers.map(c => c.id === courier.id ? { ...c, secretKey: e.target.value } : c))}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-[#EAEAEA] focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest ml-1">Merchant ID</label>
                <input 
                  type="text"
                  value={courier.merchantId}
                  onChange={(e) => setCouriers(couriers.map(c => c.id === courier.id ? { ...c, merchantId: e.target.value } : c))}
                  className="w-full px-5 py-4 bg-white/5 border border-white/10 rounded-2xl text-sm text-[#EAEAEA] focus:outline-none focus:border-indigo-500/50 transition-all"
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 mt-2">
                <div>
                  <div className="text-sm font-bold text-[#EAEAEA]">Sandbox Mode</div>
                  <p className="text-[10px] text-secondary">Enable for testing without real bookings.</p>
                </div>
                <button 
                  onClick={() => setCouriers(couriers.map(c => c.id === courier.id ? { ...c, isSandbox: !c.isSandbox } : c))}
                  className={`w-12 h-6 rounded-full relative transition-all ${courier.isSandbox ? 'bg-amber-500' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${courier.isSandbox ? 'left-7' : 'left-1'}`} />
                </button>
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-4 pt-4 border-t border-white/5">
            <button className="px-6 py-3 bg-white/5 text-secondary rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2">
              <ExternalLink size={18} />
              Test Connection
            </button>
            <button 
              onClick={() => handleUpdateCourier(courier)}
              className="px-8 py-3 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Save size={18} />
              Save Configuration
            </button>
          </div>
        </div>
      ))}
    </div>
  );

  const renderZones = () => (
    <div className="space-y-6">
      <div className="p-8 bg-card border border-white/5 rounded-[32px] space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
              <MapPin size={24} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-[#EAEAEA]">Delivery Zones</h3>
              <p className="text-xs text-secondary">Manage divisions and districts coverage.</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
              <input 
                type="text"
                placeholder="Search district..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-6 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-[#EAEAEA] focus:outline-none focus:border-indigo-500/50 w-64"
              />
            </div>
            <button className="px-6 py-3 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all flex items-center gap-2">
              <Plus size={18} />
              Add Zone
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5">
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Division</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">District</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Charge</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Time</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">COD Fee</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Status</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-secondary uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody>
              {zones.filter(z => z.district.toLowerCase().includes(searchQuery.toLowerCase())).map(zone => (
                <tr key={zone.id} className="border-b border-white/5 hover:bg-white/5 transition-colors group">
                  <td className="px-6 py-4">
                    <span className="text-sm font-medium text-[#EAEAEA]">{zone.division}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-[#EAEAEA]">{zone.district}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-bold text-indigo-400">৳{zone.charge}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-secondary">{zone.deliveryTime}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs text-secondary">৳{zone.codFee}</span>
                  </td>
                  <td className="px-6 py-4">
                    <button 
                      onClick={() => handleUpdateZone({ ...zone, isActive: !zone.isActive })}
                      className={`w-10 h-5 rounded-full relative transition-all ${zone.isActive ? 'bg-indigo-500' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-3 h-3 rounded-full bg-white transition-all ${zone.isActive ? 'left-6' : 'left-1'}`} />
                    </button>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="p-2 hover:bg-white/10 rounded-lg text-secondary hover:text-active transition-all">
                        <Plus size={16} />
                      </button>
                      <button className="p-2 hover:bg-white/10 rounded-lg text-secondary hover:text-rose-400 transition-all">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );

  const renderCharges = () => (
    <div className="grid grid-cols-2 gap-8">
      <div className="p-8 bg-card border border-white/5 rounded-[32px] space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
            <DollarSign size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#EAEAEA]">Global Delivery Rules</h3>
            <p className="text-xs text-secondary">Set conditions for free delivery and COD.</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold text-[#EAEAEA]">Free Delivery Threshold</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary">৳</span>
                <input 
                  type="number" 
                  value={globalRules.free_delivery_threshold}
                  onChange={(e) => setGlobalRules({ ...globalRules, free_delivery_threshold: parseInt(e.target.value) || 0 })}
                  className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-[#EAEAEA] text-right outline-none focus:border-active"
                />
              </div>
            </div>
            <p className="text-[10px] text-secondary">Orders above this amount will have zero delivery charge.</p>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#EAEAEA]">Auto Dispatch to Steadfast</div>
                <p className="text-[10px] text-secondary">Automatically send to Steadfast when order is Confirmed.</p>
              </div>
              <button 
                onClick={() => setGlobalRules({ ...globalRules, auto_dispatch_steadfast: !globalRules.auto_dispatch_steadfast })}
                className={`w-12 h-6 rounded-full relative transition-all ${globalRules.auto_dispatch_steadfast ? 'bg-active' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${globalRules.auto_dispatch_steadfast ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm font-bold text-[#EAEAEA]">Auto Dispatch to Pathao</div>
                <p className="text-[10px] text-secondary">Automatically send to Pathao when order is Confirmed.</p>
              </div>
              <button 
                onClick={() => setGlobalRules({ ...globalRules, auto_dispatch_pathao: !globalRules.auto_dispatch_pathao })}
                className={`w-12 h-6 rounded-full relative transition-all ${globalRules.auto_dispatch_pathao ? 'bg-active' : 'bg-white/10'}`}
              >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all ${globalRules.auto_dispatch_pathao ? 'left-7' : 'left-1'}`} />
              </button>
            </div>
          </div>

          <div className="p-6 bg-white/5 rounded-2xl border border-white/5 space-y-4">
            <div className="flex justify-between items-center">
              <div className="text-sm font-bold text-[#EAEAEA]">Global COD Fee</div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-secondary">৳</span>
                <input 
                  type="number" 
                  value={globalRules.global_cod_fee}
                  onChange={(e) => setGlobalRules({ ...globalRules, global_cod_fee: parseInt(e.target.value) || 0 })}
                  className="w-24 px-3 py-1 bg-white/5 border border-white/10 rounded-lg text-sm text-[#EAEAEA] text-right outline-none focus:border-active"
                />
              </div>
            </div>
            <p className="text-[10px] text-secondary">Base fee applied to all Cash on Delivery orders.</p>
          </div>

          <div className="flex justify-end pt-4">
            <button 
              onClick={handleUpdateGlobalRules}
              className="px-8 py-3 bg-indigo-500 text-white rounded-xl text-sm font-bold hover:bg-indigo-600 transition-all flex items-center gap-2 shadow-lg shadow-indigo-500/20"
            >
              <Save size={18} />
              Update Rules
            </button>
          </div>
        </div>
      </div>

      <div className="p-8 bg-card border border-white/5 rounded-[32px] space-y-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
            <AlertCircle size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#EAEAEA]">Zone Summary</h3>
            <p className="text-xs text-secondary">Quick overview of delivery costs.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center p-4 border-b border-white/5">
            <span className="text-sm text-secondary">Inside Dhaka</span>
            <span className="text-sm font-bold text-[#EAEAEA]">৳60.00</span>
          </div>
          <div className="flex justify-between items-center p-4 border-b border-white/5">
            <span className="text-sm text-secondary">Outside Dhaka</span>
            <span className="text-sm font-bold text-[#EAEAEA]">৳120.00 (Avg)</span>
          </div>
          <div className="flex justify-between items-center p-4 border-b border-white/5">
            <span className="text-sm text-secondary">Sub-Districts</span>
            <span className="text-sm font-bold text-[#EAEAEA]">৳150.00 (Avg)</span>
          </div>
          <div className="flex justify-between items-center p-4">
            <span className="text-sm text-secondary">Active Zones</span>
            <span className="text-sm font-bold text-emerald-400">{zones.length} Districts</span>
          </div>
        </div>
      </div>
    </div>
  );

  const renderLogs = () => (
    <div className="p-8 bg-card border border-white/5 rounded-[32px] space-y-6">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
            <History size={24} />
          </div>
          <div>
            <h3 className="text-xl font-bold text-[#EAEAEA]">Tracking & Logs</h3>
            <p className="text-xs text-secondary">Real-time courier API logs and tracking history.</p>
          </div>
        </div>
        <button className="px-6 py-3 bg-white/5 text-secondary rounded-xl text-sm font-bold hover:bg-white/10 transition-all flex items-center gap-2">
          <RefreshCw size={18} />
          Clear Logs
        </button>
      </div>

      <div className="space-y-4">
        {logs.length === 0 ? (
          <div className="py-20 text-center space-y-4">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <History size={32} className="text-secondary opacity-20" />
            </div>
            <p className="text-sm text-secondary">No delivery logs found.</p>
          </div>
        ) : (
          logs.map(log => (
            <div key={log.id} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-indigo-500/10 text-indigo-400 rounded-xl flex items-center justify-center">
                  <Truck size={20} />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#EAEAEA]">{log.courierName} - {log.status}</div>
                  <div className="text-[10px] text-secondary">Order: {log.orderId} • {log.timestamp}</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-xs font-mono text-secondary">{log.trackingId}</div>
                <div className="text-[10px] text-emerald-400">{log.message}</div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black text-[#EAEAEA] tracking-tight">DELIVERY SYSTEM</h2>
          <p className="text-secondary text-sm">Configure couriers, zones, and delivery charges.</p>
        </div>
      </div>

      <div className="overflow-x-auto pb-4 custom-scrollbar-hide">
        <div className="flex gap-2 p-1.5 bg-card border border-white/5 rounded-2xl w-max min-w-full md:min-w-0">
          {[
            { id: 'couriers', label: 'Courier Integration', icon: Truck },
            { id: 'zones', label: 'Delivery Zones', icon: MapPin },
            { id: 'charges', label: 'Delivery Charges', icon: DollarSign },
            { id: 'logs', label: 'Tracking & Logs', icon: History },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as Tab)}
              className={`px-6 py-3 rounded-xl text-sm font-bold flex items-center gap-2 transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/20' 
                  : 'text-secondary hover:bg-white/5'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
        >
          {activeTab === 'couriers' && renderCouriers()}
          {activeTab === 'zones' && renderZones()}
          {activeTab === 'charges' && renderCharges()}
          {activeTab === 'logs' && renderLogs()}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function RefreshCw({ size }: { size: number }) {
  return <History size={size} />;
}
