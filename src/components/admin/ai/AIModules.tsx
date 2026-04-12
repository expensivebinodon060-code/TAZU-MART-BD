import React from 'react';
import { 
  Bot, 
  Wand2, 
  ShieldAlert, 
  LineChart, 
  UserSearch, 
  MessageCircle, 
  BrainCircuit, 
  Sparkles, 
  ScanFace, 
  Target, 
  PieChart,
  Activity,
  Users,
  SearchCode,
  ImageIcon,
  BarChart3,
  Star,
  Megaphone,
  Package,
  MousePointer2,
  ShieldCheck,
  Bell,
  FileText,
  MessageSquare,
  LayoutDashboard,
  AlertTriangle,
  Zap,
  Power,
  Settings,
  Shield,
  Eye,
  TrendingUp,
  Clock,
  Database,
  Lock,
  Search,
  Smartphone,
  RefreshCw,
  CheckCircle2,
  TrendingDown,
  Monitor,
  Tablet,
  Mail,
  Facebook,
  Plus,
  AlertCircle,
  ChevronRight,
  Loader2
} from 'lucide-react';

interface AIModuleProps {
  isEnabled: boolean;
  onToggle: () => void;
}

export const AIDashboard: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [stats, setStats] = React.useState({
    visitors: 12840,
    activeCustomers: 842,
    suspiciousUsers: 14,
    recommendedProducts: 450,
    chatConversations: 1240,
    seoScore: 84,
    performance: 98,
    accuracy: 99.2
  });

  React.useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch('/api/ai/dashboard/stats');
        const data = await res.json();
        setStats(data);
      } catch (err) {
        console.error('Failed to fetch AI stats', err);
      }
    };
    if (isEnabled) fetchStats();
  }, [isEnabled]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
            <LayoutDashboard size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">AI Analytics Overview</h2>
            <p className="text-xs text-secondary mt-1">Real-time AI-powered insights and reporting.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Customer, Phone, Email..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-active transition-all w-64"
            />
          </div>
          <button 
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
            }`}
          >
            <Power size={14} />
            {isEnabled ? 'System Active' : 'System Disabled'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Total Website Visitors', value: stats.visitors.toLocaleString(), icon: Users, color: 'text-blue-400' },
          { label: 'Active Customers', value: stats.activeCustomers.toLocaleString(), icon: Activity, color: 'text-emerald-400' },
          { label: 'Fake / Suspicious Users', value: stats.suspiciousUsers.toLocaleString(), icon: ShieldAlert, color: 'text-rose-400' },
          { label: 'AI Recommended Products', value: stats.recommendedProducts.toLocaleString(), icon: Target, color: 'text-purple-400' },
          { label: 'Chatbot Conversations', value: stats.chatConversations.toLocaleString(), icon: MessageCircle, color: 'text-amber-400' },
          { label: 'SEO Score', value: `${stats.seoScore}/100`, icon: SearchCode, color: 'text-indigo-400' },
          { label: 'Website Performance', value: `${stats.performance}%`, icon: Zap, color: 'text-yellow-400' },
          { label: 'AI Accuracy', value: `${stats.accuracy}%`, icon: BrainCircuit, color: 'text-active' },
        ].map((stat) => (
          <div key={stat.label} className="p-6 bg-card border border-white/5 rounded-3xl space-y-4">
            <div className={`w-10 h-10 bg-white/5 ${stat.color} rounded-xl flex items-center justify-center`}>
              <stat.icon size={20} />
            </div>
            <div>
              <div className="text-[10px] text-secondary font-bold uppercase tracking-widest">{stat.label}</div>
              <div className="text-xl font-bold mt-1 text-[#EAEAEA]">{stat.value}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Real-time Traffic Insights</h3>
            <TrendingUp className="text-active" size={20} />
          </div>
          <div className="space-y-4">
            {[
              { name: 'Today\'s Visitors', count: '1,240', trend: '+12%', up: true },
              { name: 'Most Viewed Product', count: 'Smart Watch Pro', trend: 'High', up: true },
              { name: 'High Probability Buyers', count: '42 Users', trend: '+5', up: true },
              { name: 'Bounce Rate', count: '24%', trend: '-2%', up: false },
            ].map((item) => (
              <div key={item.name} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <div className="text-sm font-medium text-[#EAEAEA]">{item.name}</div>
                  <div className="text-xs text-secondary mt-0.5">{item.count}</div>
                </div>
                <div className={`text-[10px] font-bold px-2 py-1 rounded-lg ${item.up ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                  {item.trend}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">AI Predictions</h3>
          <div className="space-y-4">
            {[
              { action: 'Customer Karim predicted to order', time: 'Just now', probability: '94%' },
              { action: 'Suspicious IP detected from Dhaka', time: '5 mins ago', probability: '88%' },
              { action: 'Product "AirPods" trending up', time: '12 mins ago', probability: 'High' },
              { action: 'Chatbot handled return query', time: '25 mins ago', probability: 'Auto' },
            ].map((log, i) => (
              <div key={i} className="flex items-start gap-3 p-4 hover:bg-white/5 transition-colors rounded-2xl border border-transparent hover:border-white/5">
                <div className="w-8 h-8 bg-active/10 text-active rounded-lg flex items-center justify-center shrink-0">
                  <Sparkles size={14} />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium text-[#EAEAEA]">{log.action}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-secondary">{log.time}</span>
                  </div>
                </div>
                <div className="text-[10px] font-bold text-active uppercase tracking-widest">{log.probability}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AICustomerDetection: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
            <UserSearch size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Customer Intelligence</h2>
            <p className="text-xs text-secondary mt-1">AI-powered identification of real, potential, and spam users.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative hidden md:block">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={16} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Phone, Email, IP..."
              className="bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-xs outline-none focus:border-active transition-all w-64"
            />
          </div>
          <button 
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
            }`}
          >
            <Power size={14} />
            {isEnabled ? 'Active' : 'Disabled'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#EAEAEA]">Live Detection Feed</h3>
              <div className="flex gap-2">
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">Real</span>
                <span className="px-3 py-1 bg-blue-500/10 text-blue-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">Potential</span>
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 rounded-lg text-[10px] font-bold uppercase tracking-widest">Spam</span>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] font-bold text-secondary uppercase tracking-widest border-b border-white/5">
                    <th className="px-4 py-4">Visitor Info</th>
                    <th className="px-4 py-4">IP / Device</th>
                    <th className="px-4 py-4">Behavior</th>
                    <th className="px-4 py-4">AI Score</th>
                    <th className="px-4 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {[
                    { name: 'Karim Ahmed', email: 'karim@example.com', ip: '103.120.4.12', device: 'iPhone 15 Pro', behavior: 'High Intent', score: 98, type: 'Real', badge: 'bg-emerald-500/10 text-emerald-400' },
                    { name: 'Guest_7742', email: 'N/A', ip: '182.16.45.90', device: 'Linux / Chrome', behavior: 'Rapid Clicks', score: 22, type: 'Spam', badge: 'bg-rose-500/10 text-rose-400' },
                    { name: 'Sara Khan', email: 'sara@example.com', ip: '27.147.12.33', device: 'MacBook Air', behavior: 'Browsing', score: 85, type: 'Potential', badge: 'bg-blue-500/10 text-blue-400' },
                    { name: 'Rahat Islam', email: 'rahat@example.com', ip: '45.12.90.11', device: 'Android 14', behavior: 'Cart Addition', score: 92, type: 'Real', badge: 'bg-emerald-500/10 text-emerald-400' },
                  ].map((v, i) => (
                    <tr key={i} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-4 py-4">
                        <div className="text-sm font-bold text-[#EAEAEA]">{v.name}</div>
                        <div className="text-[10px] text-secondary">{v.email}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-xs text-[#EAEAEA] font-mono">{v.ip}</div>
                        <div className="text-[10px] text-secondary flex items-center gap-1">
                          <Smartphone size={10} /> {v.device}
                        </div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="text-[10px] font-bold text-[#EAEAEA] uppercase tracking-widest">{v.behavior}</div>
                      </td>
                      <td className="px-4 py-4">
                        <div className="flex items-center gap-2">
                          <div className="flex-1 w-16 h-1.5 bg-white/5 rounded-full overflow-hidden">
                            <div className={`h-full ${v.score > 80 ? 'bg-emerald-400' : v.score > 50 ? 'bg-blue-400' : 'bg-rose-400'}`} style={{ width: v.score + '%' }} />
                          </div>
                          <span className="text-[10px] font-bold text-[#EAEAEA]">{v.score}%</span>
                        </div>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button className="p-2 hover:bg-emerald-500/10 hover:text-emerald-400 rounded-lg text-secondary transition-all" title="Tag as High Value">
                            <Target size={14} />
                          </button>
                          <button className="p-2 hover:bg-rose-500/10 hover:text-rose-400 rounded-lg text-secondary transition-all" title="Block User">
                            <ShieldAlert size={14} />
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

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Detection Metrics</h3>
            <div className="space-y-4">
              {[
                { label: 'Real Customers', value: '84%', color: 'bg-emerald-400' },
                { label: 'Potential Buyers', value: '12%', color: 'bg-blue-400' },
                { label: 'Spam / Bots', value: '4%', color: 'bg-rose-400' },
              ].map((m) => (
                <div key={m.label} className="space-y-2">
                  <div className="flex justify-between text-[10px] font-bold uppercase tracking-widest">
                    <span className="text-secondary">{m.label}</span>
                    <span className="text-[#EAEAEA]">{m.value}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full ${m.color}`} style={{ width: m.value }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Security Alerts</h3>
            <div className="space-y-4">
              {[
                { msg: 'Multiple accounts from same IP', type: 'High Risk' },
                { msg: 'Rapid checkout attempts', type: 'Suspicious' },
                { msg: 'VPN usage detected', type: 'Info' },
              ].map((alert, i) => (
                <div key={i} className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                  <AlertTriangle className={alert.type === 'High Risk' ? 'text-rose-400' : 'text-amber-400'} size={16} />
                  <div>
                    <div className="text-xs font-bold text-[#EAEAEA]">{alert.msg}</div>
                    <div className="text-[10px] text-secondary uppercase font-bold tracking-widest mt-0.5">{alert.type}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AISmartChatSupport: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  const [autoReply, setAutoReply] = React.useState(true);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
            <MessageSquare size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Chatbot Control Panel</h2>
            <p className="text-xs text-secondary mt-1">Manage automated customer assistance and live monitoring.</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
            <div className={`w-2 h-2 rounded-full ${isEnabled ? 'bg-emerald-400 animate-pulse' : 'bg-rose-400'}`} />
            <span className="text-[10px] font-bold text-[#EAEAEA] uppercase tracking-widest">{isEnabled ? 'Online' : 'Offline'}</span>
          </div>
          <button 
            onClick={onToggle}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
            }`}
          >
            <Power size={14} />
            {isEnabled ? 'Chatbot ON' : 'Chatbot OFF'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#EAEAEA]">Live Chat Monitor</h3>
              <div className="flex gap-2">
                <button className="px-3 py-1.5 bg-active/10 rounded-lg text-[10px] font-bold text-active">Active</button>
                <button className="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] font-bold text-secondary">History</button>
              </div>
            </div>
            <div className="space-y-4">
              {[
                { user: 'Karim Ahmed', msg: 'What is the delivery time for Dhaka?', time: '2m ago', type: 'AI Handled', rating: 5 },
                { user: 'Sara Khan', msg: 'Is the Smart Watch Pro in stock?', time: '5m ago', type: 'AI Handled', rating: 4 },
                { user: 'Rahat Islam', msg: 'I received a broken product.', time: '12m ago', type: 'Human Required', rating: null },
              ].map((chat, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between hover:border-active/30 transition-all cursor-pointer group">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-active/10 text-active rounded-xl flex items-center justify-center font-bold">
                      {chat.user[0]}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">{chat.user}</div>
                      <div className="text-xs text-secondary line-clamp-1">{chat.msg}</div>
                    </div>
                  </div>
                  <div className="text-right flex flex-col items-end gap-1">
                    <div className="text-[10px] text-secondary">{chat.time}</div>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-lg uppercase tracking-widest ${
                      chat.type === 'AI Handled' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'
                    }`}>
                      {chat.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Custom Reply Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { trigger: 'Product Price', reply: 'Our product prices are listed on each product page...' },
                { trigger: 'Delivery Time', reply: 'Standard delivery takes 2-3 business days...' },
                { trigger: 'Order Status', reply: 'You can track your order in the "My Orders" section...' },
                { trigger: 'Return Policy', reply: 'We offer a 7-day return policy for unused items...' },
              ].map((r, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="text-[10px] font-bold text-active uppercase tracking-widest">{r.trigger}</div>
                  <div className="text-xs text-secondary line-clamp-2">{r.reply}</div>
                  <button className="text-[10px] font-bold text-active hover:underline">Edit Reply</button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Chatbot Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <div className="text-sm font-bold text-[#EAEAEA]">Auto Reply System</div>
                  <div className="text-[10px] text-secondary">AI handles common queries</div>
                </div>
                <button 
                  onClick={() => setAutoReply(!autoReply)}
                  className={`w-10 h-5 rounded-full relative transition-all ${autoReply ? 'bg-active' : 'bg-white/10'}`}
                >
                  <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${autoReply ? 'right-1' : 'left-1'}`} />
                </button>
              </div>
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div>
                  <div className="text-sm font-bold text-[#EAEAEA]">Human Escalation</div>
                  <div className="text-[10px] text-secondary">Notify admin for complex issues</div>
                </div>
                <button className="w-10 h-5 bg-active rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full" />
                </button>
              </div>
            </div>
            <div className="pt-4 space-y-4">
              <div className="p-4 bg-active/5 rounded-2xl border border-active/10">
                <div className="text-xs font-bold text-active uppercase tracking-widest mb-2">AI Performance</div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-secondary">Accuracy</span>
                  <span className="text-sm font-bold text-[#EAEAEA]">96.4%</span>
                </div>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-xs text-secondary">Avg Response</span>
                  <span className="text-sm font-bold text-[#EAEAEA]">0.8s</span>
                </div>
              </div>
              <button className="w-full py-3 bg-white/5 text-[#EAEAEA] border border-white/10 rounded-xl font-bold text-xs hover:bg-white/10 transition-all">
                View All Chat History
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIProductContentGenerator: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  const [productName, setProductName] = React.useState('');
  const [category, setCategory] = React.useState('');
  const [features, setFeatures] = React.useState('');
  const [isGenerating, setIsGenerating] = React.useState(false);
  const [generatedData, setGeneratedData] = React.useState({
    title: '',
    description: '',
    features: [] as string[],
    seo: ''
  });

  const handleGenerate = async () => {
    if (!productName || !isEnabled) return;
    setIsGenerating(true);
    try {
      const prompt = `Product: ${productName}, Category: ${category}, Features: ${features}`;
      const res = await fetch('/api/ai/generate-content', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'full product details', prompt })
      });
      const data = await res.json();
      
      // Since the API returns a single string, we'll simulate parsing or just use it
      // In a real scenario, we'd ask for JSON from Gemini
      setGeneratedData({
        title: `${productName} Pro: Ultimate ${category} Experience`,
        description: data.result,
        features: features.split(',').map(f => f.trim()),
        seo: `Buy ${productName} online at best price. High quality ${category} with ${features}.`
      });
    } catch (err) {
      console.error('Generation failed', err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center">
            <FileText size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Product Description Generator</h2>
            <p className="text-xs text-secondary mt-1">Auto-generate high-converting product content using AI.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Input Details</h3>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Product Name</label>
                <input 
                  type="text" 
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  placeholder="e.g. Smart Watch"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Category</label>
                <input 
                  type="text" 
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  placeholder="e.g. Electronics"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Key Features</label>
                <textarea 
                  rows={4}
                  value={features}
                  onChange={(e) => setFeatures(e.target.value)}
                  placeholder="e.g. Heart rate monitor, GPS, Waterproof..."
                  className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all resize-none"
                />
              </div>
              <button 
                onClick={handleGenerate}
                disabled={isGenerating || !isEnabled}
                className="w-full py-4 bg-active text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-active/20 disabled:opacity-50"
              >
                {isGenerating ? <RefreshCw className="animate-spin" size={18} /> : <Sparkles size={18} />}
                {isGenerating ? 'Generating...' : 'Generate AI Content'}
              </button>
            </div>
          </div>

          <div className="space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">AI Generated Output</h3>
            <div className="p-6 bg-white/5 rounded-[32px] border border-white/5 min-h-[400px] space-y-6">
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-active uppercase tracking-widest">Product Title</div>
                <div className="text-lg font-bold text-[#EAEAEA]">{generatedData.title || (productName ? `${productName} Pro: Ultimate ${category} Experience` : 'AI will generate title here...')}</div>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-active uppercase tracking-widest">Short Description</div>
                <p className="text-sm text-secondary leading-relaxed">
                  {generatedData.description || (productName ? `The all-new ${productName} is designed for performance and style. Featuring advanced ${features.split(',')[0] || 'technology'}, it's the perfect companion for your daily life.` : 'AI will generate short description here...')}
                </p>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-active uppercase tracking-widest">Product Features</div>
                <ul className="space-y-1">
                  {(generatedData.features.length > 0 ? generatedData.features : (features ? features.split(',') : ['Feature 1', 'Feature 2', 'Feature 3'])).map((f, i) => (
                    <li key={i} className="text-sm text-secondary flex items-center gap-2">
                      <CheckCircle2 size={12} className="text-emerald-400" /> {f.trim()}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="space-y-2">
                <div className="text-[10px] font-bold text-active uppercase tracking-widest">SEO Description</div>
                <p className="text-xs text-secondary italic">
                  {generatedData.seo || `Buy ${productName} online at best price. High quality ${category} with ${features}. Fast delivery available.`}
                </p>
              </div>
              <div className="pt-6 border-t border-white/5 flex gap-4">
                <button className="flex-1 py-3 bg-white/5 text-[#EAEAEA] rounded-xl font-bold text-xs hover:bg-white/10 transition-all">Copy All</button>
                <button className="flex-1 py-3 bg-active/10 text-active rounded-xl font-bold text-xs hover:bg-active/20 transition-all">Apply to Product</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Placeholder for other modules to keep the file manageable but complete the structure
const PlaceholderModule: React.FC<{ title: string; icon: any; desc: string } & AIModuleProps> = ({ title, icon: Icon, desc, isEnabled, onToggle }) => (
  <div className="space-y-8">
    <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
          <Icon size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-[#EAEAEA]">{title}</h2>
          <p className="text-xs text-secondary mt-1">{desc}</p>
        </div>
      </div>
      <button 
        onClick={onToggle}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
          isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
        }`}
      >
        <Power size={14} />
        {isEnabled ? 'Active' : 'Disabled'}
      </button>
    </div>
    <div className="p-20 text-center space-y-4 bg-card border border-white/5 rounded-[40px]">
      <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
        <Icon size={40} className="text-secondary animate-pulse" />
      </div>
      <h2 className="text-2xl font-bold text-[#EAEAEA]">{title} Module</h2>
      <p className="text-secondary text-sm max-w-md mx-auto">{desc}</p>
      <div className="pt-8">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 text-amber-500 rounded-xl text-xs font-bold border border-amber-500/20">
          <AlertTriangle size={14} />
          Module in Development
        </div>
      </div>
    </div>
  </div>
);

export const AISEOAssistant: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  const [content, setContent] = React.useState('');
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [seoData, setSeoData] = React.useState({
    keywords: [] as string[],
    metaDescription: ''
  });

  const handleAnalyze = async () => {
    if (!content || !isEnabled) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-seo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content })
      });
      const data = await res.json();
      setSeoData(data);
    } catch (err) {
      console.error('SEO Analysis failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-500/10 text-indigo-400 rounded-2xl flex items-center justify-center">
            <SearchCode size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">SEO Optimization Panel</h2>
            <p className="text-xs text-secondary mt-1">AI-powered keyword suggestions and meta tag generation.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Content Analysis</h3>
            <div className="space-y-4">
              <textarea 
                rows={8}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste your product description or blog post here for SEO analysis..."
                className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm outline-none focus:border-active transition-all resize-none"
              />
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !isEnabled}
                className="w-full py-4 bg-active text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-active/20 disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze SEO Score'}
              </button>
            </div>
          </div>

          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Meta Tag Generator</h3>
            <div className="space-y-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="text-[10px] font-bold text-active uppercase tracking-widest">Meta Title</div>
                <div className="text-sm text-[#EAEAEA] font-medium">
                  {seoData.keywords.length > 0 ? `${seoData.keywords[0]} | TAZU MART BD` : 'Best Wireless Headphones 2024 | EliteSound Pro'}
                </div>
                <button className="text-[10px] font-bold text-secondary hover:text-active">Copy Title</button>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                <div className="text-[10px] font-bold text-active uppercase tracking-widest">Meta Description</div>
                <div className="text-xs text-secondary leading-relaxed">
                  {seoData.metaDescription || 'Shop the EliteSound Pro wireless headphones. Industry-leading noise cancellation, 40h battery, and premium sound. Free shipping worldwide.'}
                </div>
                <button className="text-[10px] font-bold text-secondary hover:text-active">Copy Description</button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">SEO Score</h3>
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path className="text-white/5" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  <path className="text-active" stroke="currentColor" strokeWidth="3" strokeDasharray="84, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-[#EAEAEA]">84</span>
                </div>
              </div>
              <span className="text-xs font-bold text-emerald-400 mt-4 uppercase tracking-widest">Good Optimization</span>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Keyword Suggestions</div>
              <div className="flex flex-wrap gap-2">
                {['wireless audio', 'noise cancelling', 'bluetooth 5.2', 'long battery life', 'premium sound'].map(kw => (
                  <span key={kw} className="px-3 py-1 bg-active/10 text-active rounded-lg text-[10px] font-bold">+{kw}</span>
                ))}
              </div>
            </div>
            <div className="pt-4 space-y-3">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Missing Keywords</div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-rose-400">
                  <AlertTriangle size={12} /> <span>"Affordable" not found</span>
                </div>
                <div className="flex items-center gap-2 text-xs text-rose-400">
                  <AlertTriangle size={12} /> <span>"Best Price" missing</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIImageOptimizer: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  const [isOptimizing, setIsOptimizing] = React.useState(false);

  const handleOptimize = () => {
    setIsOptimizing(true);
    setTimeout(() => setIsOptimizing(false), 2000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-active/10 text-active rounded-2xl flex items-center justify-center">
            <ImageIcon size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Image Optimization Panel</h2>
            <p className="text-xs text-secondary mt-1">Auto-compress, background removal, and quality improvement.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Upload & Optimize</h3>
          <div className="border-2 border-dashed border-white/10 rounded-[32px] p-12 text-center space-y-4 hover:border-active/50 transition-all cursor-pointer group">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto group-hover:scale-110 transition-transform">
              <ImageIcon size={32} className="text-secondary" />
            </div>
            <div>
              <p className="text-sm font-bold text-[#EAEAEA]">Drop your product image here</p>
              <p className="text-xs text-secondary mt-1">Supports PNG, JPG, WebP (Max 5MB)</p>
            </div>
            <button className="px-6 py-2 bg-active/10 text-active rounded-xl text-xs font-bold hover:bg-active/20 transition-all">Select File</button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <button className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center space-y-2 hover:border-active/30 transition-all">
              <Zap size={20} className="text-amber-400 mx-auto" />
              <div className="text-[10px] font-bold text-[#EAEAEA] uppercase tracking-widest">Auto Resize</div>
            </button>
            <button className="p-4 bg-white/5 rounded-2xl border border-white/5 text-center space-y-2 hover:border-active/30 transition-all">
              <Sparkles size={20} className="text-purple-400 mx-auto" />
              <div className="text-[10px] font-bold text-[#EAEAEA] uppercase tracking-widest">Clean BG</div>
            </button>
          </div>
          <button 
            onClick={handleOptimize}
            disabled={isOptimizing}
            className="w-full py-4 bg-active text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-active/20 disabled:opacity-50"
          >
            {isOptimizing ? <RefreshCw className="animate-spin" size={18} /> : <Zap size={18} />}
            {isOptimizing ? 'Optimizing...' : 'Start Speed Optimization'}
          </button>
        </div>

        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Optimization Preview</h3>
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Original</div>
              <div className="aspect-square bg-white/5 rounded-2xl border border-white/5 overflow-hidden relative">
                <img src="https://picsum.photos/seed/product/400/400" alt="Original" className="w-full h-full object-cover opacity-50" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-black/50 rounded text-[8px] font-bold text-white">1.2 MB</div>
              </div>
            </div>
            <div className="space-y-3">
              <div className="text-[10px] font-bold text-active uppercase tracking-widest">AI Optimized</div>
              <div className="aspect-square bg-white/5 rounded-2xl border border-active/30 overflow-hidden relative">
                <img src="https://picsum.photos/seed/product/400/400" alt="Optimized" className="w-full h-full object-cover" />
                <div className="absolute top-2 right-2 px-2 py-1 bg-emerald-500/80 rounded text-[8px] font-bold text-white">140 KB</div>
              </div>
            </div>
          </div>
          <div className="space-y-4 pt-4">
            <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-emerald-500/10 text-emerald-400 rounded-lg flex items-center justify-center">
                  <TrendingUp size={16} />
                </div>
                <div>
                  <div className="text-xs font-bold text-[#EAEAEA]">88% Reduction</div>
                  <div className="text-[10px] text-secondary">Faster page load speed</div>
                </div>
              </div>
              <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">WebP Format</span>
            </div>
            <div className="flex gap-4">
              <button className="flex-1 py-3 bg-white/5 text-[#EAEAEA] rounded-xl font-bold text-xs hover:bg-white/10 transition-all">Download</button>
              <button className="flex-1 py-3 bg-active/10 text-active rounded-xl font-bold text-xs hover:bg-active/20 transition-all">Save to Gallery</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIVisitorAnalytics: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
            <BarChart3 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Visitor Intelligence Dashboard</h2>
            <p className="text-xs text-secondary mt-1">Real-time visitor tracking and predictive behavior analysis.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: 'Today Visitors', value: '1,284', change: '+12%', icon: Users, color: 'text-blue-400' },
          { label: 'Avg. Session', value: '4m 32s', change: '+5%', icon: Clock, color: 'text-emerald-400' },
          { label: 'Bounce Rate', value: '24.8%', change: '-2%', icon: TrendingDown, color: 'text-rose-400' },
          { label: 'Page Views', value: '8,432', change: '+18%', icon: Eye, color: 'text-purple-400' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card border border-white/5 rounded-[32px] space-y-4">
            <div className="flex items-center justify-between">
              <div className={`w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center ${stat.color}`}>
                <stat.icon size={20} />
              </div>
              <span className={`text-[10px] font-bold ${stat.change.startsWith('+') ? 'text-emerald-400' : 'text-rose-400'}`}>
                {stat.change}
              </span>
            </div>
            <div>
              <div className="text-2xl font-bold text-[#EAEAEA]">{stat.value}</div>
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mt-1">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Top Locations</h3>
          <div className="space-y-4">
            {[
              { country: 'United States', visitors: 450, flag: '🇺🇸' },
              { country: 'Bangladesh', visitors: 320, flag: '🇧🇩' },
              { country: 'United Kingdom', visitors: 180, flag: '🇬🇧' },
              { country: 'India', visitors: 150, flag: '🇮🇳' },
            ].map((loc, i) => (
              <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <span className="text-xl">{loc.flag}</span>
                  <span className="text-sm font-medium text-[#EAEAEA]">{loc.country}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-active rounded-full" style={{ width: `${(loc.visitors / 450) * 100}%` }}></div>
                  </div>
                  <span className="text-xs font-bold text-secondary">{loc.visitors}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Device Distribution</h3>
          <div className="flex items-center justify-around py-8">
            {[
              { label: 'Mobile', value: '65%', icon: Smartphone, color: 'text-blue-400' },
              { label: 'Desktop', value: '30%', icon: Monitor, color: 'text-purple-400' },
              { label: 'Tablet', value: '5%', icon: Tablet, color: 'text-emerald-400' },
            ].map((device, i) => (
              <div key={i} className="text-center space-y-3">
                <div className={`w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto ${device.color}`}>
                  <device.icon size={28} />
                </div>
                <div>
                  <div className="text-xl font-bold text-[#EAEAEA]">{device.value}</div>
                  <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">{device.label}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIFraudDetection: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-rose-500/10 text-rose-400 rounded-2xl flex items-center justify-center">
            <ShieldAlert size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Fraud & Risk Monitoring</h2>
            <p className="text-xs text-secondary mt-1">AI-powered detection of fake orders and suspicious activities.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Suspicious Activities</h3>
            <div className="space-y-4">
              {[
                { type: 'Multiple Accounts', user: 'user_882', ip: '192.168.1.45', risk: 'High', time: '2 mins ago' },
                { type: 'Fake Order Attempt', user: 'guest_912', ip: '45.22.11.90', risk: 'Critical', time: '15 mins ago' },
                { type: 'Suspicious IP Login', user: 'admin_test', ip: '103.44.22.1', risk: 'Medium', time: '1 hour ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      activity.risk === 'Critical' ? 'bg-rose-500/10 text-rose-400' : 
                      activity.risk === 'High' ? 'bg-orange-500/10 text-orange-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      <AlertTriangle size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">{activity.type}</div>
                      <div className="text-[10px] text-secondary mt-1">User: {activity.user} • IP: {activity.ip}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${
                      activity.risk === 'Critical' ? 'text-rose-400' : 
                      activity.risk === 'High' ? 'text-orange-400' : 'text-amber-400'
                    }`}>{activity.risk} Risk</div>
                    <div className="text-[10px] text-secondary mt-1">{activity.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Risk Overview</h3>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center space-y-2">
                <div className="text-3xl font-bold text-emerald-400">98.2%</div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">System Security Score</div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Blocked IPs</span>
                  <span className="font-bold text-[#EAEAEA]">1,242</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Flagged Orders</span>
                  <span className="font-bold text-[#EAEAEA]">45</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Bot Attacks Prevented</span>
                  <span className="font-bold text-[#EAEAEA]">8,932</span>
                </div>
              </div>
              <button className="w-full py-3 bg-rose-500/10 text-rose-400 rounded-xl font-bold text-xs hover:bg-rose-500/20 transition-all">
                Run Full Security Scan
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIProductRecommendation: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
            <Star size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Smart Recommendation Engine</h2>
            <p className="text-xs text-secondary mt-1">Personalized product suggestions based on user behavior.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">AI Recommended Products</h3>
          <div className="grid grid-cols-2 gap-4">
            {[
              { name: 'Wireless Earbuds', price: '$49', score: '98%', img: 'https://picsum.photos/seed/earbuds/200/200' },
              { name: 'Smart Watch', price: '$129', score: '95%', img: 'https://picsum.photos/seed/watch/200/200' },
              { name: 'Power Bank', price: '$29', score: '92%', img: 'https://picsum.photos/seed/powerbank/200/200' },
              { name: 'Phone Case', price: '$15', score: '88%', img: 'https://picsum.photos/seed/case/200/200' },
            ].map((prod, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-3">
                <div className="aspect-square rounded-xl overflow-hidden">
                  <img src={prod.img} alt={prod.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <div className="text-sm font-bold text-[#EAEAEA]">{prod.name}</div>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-active font-bold">{prod.price}</span>
                    <span className="text-[10px] text-emerald-400 font-bold">{prod.score} Match</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Customer Interest Analysis</h3>
            <div className="space-y-4">
              {[
                { category: 'Electronics', interest: 85, trend: 'up' },
                { category: 'Fashion', interest: 62, trend: 'down' },
                { category: 'Home Decor', interest: 45, trend: 'up' },
                { category: 'Accessories', interest: 38, trend: 'up' },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary">{item.category}</span>
                    <span className="font-bold text-[#EAEAEA]">{item.interest}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className={`h-full rounded-full ${item.trend === 'up' ? 'bg-emerald-500' : 'bg-rose-500'}`} style={{ width: `${item.interest}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Recommendation Settings</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary">Cross-sell on Checkout</span>
                <div className="w-10 h-5 bg-active rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary">Upsell on Product Page</span>
                <div className="w-10 h-5 bg-active rounded-full relative">
                  <div className="absolute right-1 top-1 w-3 h-3 bg-white rounded-full"></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs text-secondary">Personalized Email Recs</span>
                <div className="w-10 h-5 bg-white/10 rounded-full relative">
                  <div className="absolute left-1 top-1 w-3 h-3 bg-white/50 rounded-full"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIReviewAnalyzer: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  const [isAnalyzing, setIsAnalyzing] = React.useState(false);
  const [analysisResult, setAnalysisResult] = React.useState<any>(null);

  const reviews = [
    { user: 'John D.', rating: 5, text: 'Amazing product! The quality is top-notch.', sentiment: 'Positive', score: 0.98 },
    { user: 'Sarah M.', rating: 2, text: 'Delivery was late and the box was damaged.', sentiment: 'Negative', score: 0.15 },
    { user: 'Mike R.', rating: 4, text: 'Good value for money, but battery could be better.', sentiment: 'Neutral', score: 0.65 },
  ];

  const handleAnalyze = async () => {
    if (!isEnabled) return;
    setIsAnalyzing(true);
    try {
      const res = await fetch('/api/ai/analyze-reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviews: reviews.map(r => ({ user: r.user, rating: r.rating, comment: r.text })) })
      });
      const data = await res.json();
      setAnalysisResult(data);
    } catch (err) {
      console.error('Review analysis failed', err);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
            <MessageCircle size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Review Sentiment Analysis</h2>
            <p className="text-xs text-secondary mt-1">AI-powered review filtering and automated response system.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-[#EAEAEA]">Recent Reviews Analysis</h3>
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !isEnabled}
                className="px-4 py-2 bg-active text-white rounded-xl text-xs font-bold flex items-center gap-2 disabled:opacity-50"
              >
                {isAnalyzing ? <RefreshCw className="animate-spin" size={14} /> : <BrainCircuit size={14} />}
                {isAnalyzing ? 'Analyzing...' : 'Analyze All'}
              </button>
            </div>
            <div className="space-y-4">
              {[
                { user: 'John D.', rating: 5, text: 'Amazing product! The quality is top-notch.', sentiment: 'Positive', score: 0.98 },
                { user: 'Sarah M.', rating: 2, text: 'Delivery was late and the box was damaged.', sentiment: 'Negative', score: 0.15 },
                { user: 'Mike R.', rating: 4, text: 'Good value for money, but battery could be better.', sentiment: 'Neutral', score: 0.65 },
              ].map((rev, i) => (
                <div key={i} className="p-5 bg-white/5 rounded-[24px] border border-white/5 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-[#EAEAEA]">{rev.user}</span>
                      <div className="flex text-amber-400">
                        {[...Array(5)].map((_, i) => <Star key={i} size={10} fill={i < rev.rating ? 'currentColor' : 'none'} />)}
                      </div>
                    </div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      rev.sentiment === 'Positive' ? 'bg-emerald-500/10 text-emerald-400' : 
                      rev.sentiment === 'Negative' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'
                    }`}>
                      {rev.sentiment} ({Math.round(rev.score * 100)}%)
                    </div>
                  </div>
                  <p className="text-sm text-secondary leading-relaxed italic">"{rev.text}"</p>
                  <div className="flex gap-3 pt-2">
                    <button className="text-[10px] font-bold text-active hover:underline">Auto-Reply</button>
                    <button className="text-[10px] font-bold text-secondary hover:underline">Mark as Spam</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Sentiment Overview</h3>
            <div className="space-y-6">
              <div className="flex items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-rose-500/20" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" stroke="currentColor" strokeWidth="3" strokeDasharray="75, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-2xl font-bold text-[#EAEAEA]">75%</span>
                    <span className="text-[8px] text-secondary uppercase font-bold">Positive</span>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Total Reviews</span>
                  <span className="font-bold text-[#EAEAEA]">1,452</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Auto-Replied</span>
                  <span className="font-bold text-[#EAEAEA]">1,240</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Flagged for Review</span>
                  <span className="font-bold text-rose-400">12</span>
                </div>
              </div>
              <div className="pt-4 border-t border-white/5 space-y-4">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">AI Summary</div>
                <p className="text-xs text-secondary leading-relaxed">
                  Most customers are happy with product quality but express concerns about shipping speed in the US region.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIMarketingAutomation: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-purple-500/10 text-purple-400 rounded-2xl flex items-center justify-center">
            <Megaphone size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">AI Marketing Suite</h2>
            <p className="text-xs text-secondary mt-1">Automated multi-channel marketing and campaign optimization.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Active Campaigns</h3>
          <div className="space-y-4">
            {[
              { name: 'Summer Sale Blast', channel: 'Email', status: 'Running', reach: '12.4k', conversion: '4.2%' },
              { name: 'New Arrival Promo', channel: 'SMS', status: 'Scheduled', reach: '5.2k', conversion: '-' },
              { name: 'Retargeting Ads', channel: 'Facebook', status: 'Running', reach: '45.8k', conversion: '2.8%' },
            ].map((camp, i) => (
              <div key={i} className="p-5 bg-white/5 rounded-[24px] border border-white/5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-secondary">
                    {camp.channel === 'Email' ? <Mail size={20} /> : camp.channel === 'SMS' ? <Smartphone size={20} /> : <Facebook size={20} />}
                  </div>
                  <div>
                    <div className="text-sm font-bold text-[#EAEAEA]">{camp.name}</div>
                    <div className="text-[10px] text-secondary mt-1">{camp.channel} • {camp.status}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs font-bold text-[#EAEAEA]">{camp.reach} Reach</div>
                  <div className="text-[10px] text-emerald-400 mt-1">{camp.conversion} Conv.</div>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full py-4 bg-active text-white rounded-2xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-active/20">
            <Plus size={18} />
            Create New AI Campaign
          </button>
        </div>

        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Marketing Performance</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Total ROI</div>
                <div className="text-xl font-bold text-emerald-400">340%</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Avg. CPA</div>
                <div className="text-xl font-bold text-[#EAEAEA]">$1.42</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Channel Efficiency</div>
              <div className="space-y-3">
                {[
                  { label: 'Email Marketing', value: 88 },
                  { label: 'Social Media Ads', value: 72 },
                  { label: 'SMS Alerts', value: 45 },
                ].map((item, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-secondary">{item.label}</span>
                      <span className="font-bold text-[#EAEAEA]">{item.value}%</span>
                    </div>
                    <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full bg-active rounded-full" style={{ width: `${item.value}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AISalesPrediction: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
            <LineChart size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Sales Forecasting Engine</h2>
            <p className="text-xs text-secondary mt-1">Predictive revenue analysis and growth forecasting.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Revenue Forecast (Next 6 Months)</h3>
            <div className="h-[300px] flex items-end justify-between gap-4 px-4">
              {[
                { month: 'Apr', value: 45, predicted: true },
                { month: 'May', value: 52, predicted: true },
                { month: 'Jun', value: 48, predicted: true },
                { month: 'Jul', value: 65, predicted: true },
                { month: 'Aug', value: 72, predicted: true },
                { month: 'Sep', value: 85, predicted: true },
              ].map((data, i) => (
                <div key={i} className="flex-1 flex flex-col items-center gap-3">
                  <div 
                    className={`w-full rounded-t-xl transition-all duration-1000 ${data.predicted ? 'bg-active/40 border-t-2 border-dashed border-active' : 'bg-active'}`}
                    style={{ height: `${data.value * 3}px` }}
                  ></div>
                  <span className="text-[10px] font-bold text-secondary uppercase tracking-widest">{data.month}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 bg-card border border-white/5 rounded-[32px] space-y-4">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Predicted Growth</div>
              <div className="text-3xl font-bold text-emerald-400">+24.5%</div>
              <p className="text-xs text-secondary leading-relaxed">Based on current market trends and historical data.</p>
            </div>
            <div className="p-6 bg-card border border-white/5 rounded-[32px] space-y-4">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Target Confidence</div>
              <div className="text-3xl font-bold text-blue-400">92%</div>
              <p className="text-xs text-secondary leading-relaxed">AI confidence score for achieving the Q3 sales target.</p>
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Growth Opportunities</h3>
            <div className="space-y-4">
              {[
                { title: 'New Region Expansion', impact: 'High', potential: '+$12k/mo' },
                { title: 'Product Bundle AI', impact: 'Medium', potential: '+$4.5k/mo' },
                { title: 'Holiday Early Access', impact: 'High', potential: '+$18k/mo' },
              ].map((opp, i) => (
                <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-[#EAEAEA]">{opp.title}</span>
                    <span className={`text-[8px] font-bold px-2 py-0.5 rounded-full uppercase ${opp.impact === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 'bg-blue-500/10 text-blue-400'}`}>
                      {opp.impact} Impact
                    </span>
                  </div>
                  <div className="text-xs text-active font-bold">{opp.potential} Potential</div>
                </div>
              ))}
            </div>
            <button className="w-full py-3 bg-white/5 text-[#EAEAEA] rounded-xl font-bold text-xs hover:bg-white/10 transition-all">
              View Detailed Strategy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIInventoryPrediction: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-amber-500/10 text-amber-400 rounded-2xl flex items-center justify-center">
            <Package size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Smart Inventory Management</h2>
            <p className="text-xs text-secondary mt-1">AI-powered stock prediction and reorder optimization.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Stock Out Predictions</h3>
            <div className="space-y-4">
              {[
                { name: 'Wireless Headphones', stock: 12, dailySales: 4.5, daysLeft: 3, status: 'Critical' },
                { name: 'Smart Watch Series 5', stock: 45, dailySales: 12.2, daysLeft: 4, status: 'Warning' },
                { name: 'USB-C Cable 2m', stock: 8, dailySales: 2.1, daysLeft: 4, status: 'Warning' },
                { name: 'Power Bank 20k', stock: 150, dailySales: 5.4, daysLeft: 28, status: 'Safe' },
              ].map((item, i) => (
                <div key={i} className="flex items-center justify-between p-5 bg-white/5 rounded-[24px] border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                      item.status === 'Critical' ? 'bg-rose-500/10 text-rose-400' : 
                      item.status === 'Warning' ? 'bg-orange-500/10 text-orange-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      <AlertCircle size={20} />
                    </div>
                    <div>
                      <div className="text-sm font-bold text-[#EAEAEA]">{item.name}</div>
                      <div className="text-[10px] text-secondary mt-1">Current Stock: {item.stock} • Avg. Daily Sales: {item.dailySales}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-sm font-bold ${
                      item.status === 'Critical' ? 'text-rose-400' : 
                      item.status === 'Warning' ? 'text-orange-400' : 'text-emerald-400'
                    }`}>{item.daysLeft} Days Left</div>
                    <div className="text-[10px] text-secondary mt-1 uppercase tracking-widest font-bold">{item.status}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Inventory Insights</h3>
            <div className="space-y-6">
              <div className="p-6 bg-white/5 rounded-3xl border border-white/5 text-center space-y-2">
                <div className="text-3xl font-bold text-active">$42,850</div>
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Total Inventory Value</div>
              </div>
              <div className="space-y-4">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Reorder Suggestions</div>
                <div className="space-y-3">
                  <div className="p-3 bg-emerald-500/5 border border-emerald-500/10 rounded-xl">
                    <div className="text-xs font-bold text-emerald-400">Restock Headphones</div>
                    <div className="text-[10px] text-secondary mt-1">Suggested: 50 units (High Demand)</div>
                  </div>
                  <div className="p-3 bg-blue-500/5 border border-blue-500/10 rounded-xl">
                    <div className="text-xs font-bold text-blue-400">Restock Smart Watches</div>
                    <div className="text-[10px] text-secondary mt-1">Suggested: 100 units (Upcoming Promo)</div>
                  </div>
                </div>
              </div>
              <button className="w-full py-3 bg-active text-white rounded-xl font-bold text-xs shadow-lg shadow-active/20">
                Generate Purchase Orders
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AICustomerBehaviorTracker: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
            <MousePointer2 size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">Behavioral Insights Tracker</h2>
            <p className="text-xs text-secondary mt-1">Deep analysis of customer journeys and purchase intent.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Customer Journey Analysis</h3>
            <div className="space-y-6">
              {[
                { user: 'User_442', steps: ['Home', 'Search: Watch', 'Product Page', 'Add to Cart'], intent: 'High', time: '5m 12s' },
                { user: 'User_910', steps: ['Category: Shoes', 'Filter: Red', 'Product Page', 'Exit'], intent: 'Medium', time: '2m 45s' },
                { user: 'User_221', steps: ['Blog Post', 'Home', 'Exit'], intent: 'Low', time: '45s' },
              ].map((journey, i) => (
                <div key={i} className="p-5 bg-white/5 rounded-[24px] border border-white/5 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-sm font-bold text-[#EAEAEA]">{journey.user}</div>
                    <div className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      journey.intent === 'High' ? 'bg-emerald-500/10 text-emerald-400' : 
                      journey.intent === 'Medium' ? 'bg-blue-500/10 text-blue-400' : 'bg-white/5 text-secondary'
                    }`}>
                      {journey.intent} Intent
                    </div>
                  </div>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {journey.steps.map((step, si) => (
                      <React.Fragment key={si}>
                        <div className="px-3 py-1.5 bg-white/5 rounded-lg text-[10px] text-secondary whitespace-nowrap border border-white/5">
                          {step}
                        </div>
                        {si < journey.steps.length - 1 && <ChevronRight size={12} className="text-white/20 flex-shrink-0" />}
                      </React.Fragment>
                    ))}
                  </div>
                  <div className="text-[10px] text-secondary text-right">Session Duration: {journey.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Interest Heatmap</h3>
            <div className="space-y-4">
              {[
                { label: 'Product Images', value: 85 },
                { label: 'Customer Reviews', value: 72 },
                { label: 'Pricing Section', value: 64 },
                { label: 'Shipping Info', value: 45 },
                { label: 'Related Products', value: 38 },
              ].map((item, i) => (
                <div key={i} className="space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-secondary">{item.label}</span>
                    <span className="font-bold text-[#EAEAEA]">{item.value}%</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-400 rounded-full" style={{ width: `${item.value}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-4 border-t border-white/5">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest mb-4">AI Prediction</div>
              <p className="text-xs text-secondary leading-relaxed">
                Users spending more than 2 minutes on the pricing section have a 65% higher chance of conversion.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AISecurityMonitoring: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  const [logs, setLogs] = React.useState<any[]>([]);

  React.useEffect(() => {
    const fetchLogs = async () => {
      try {
        const res = await fetch('/api/ai/security/logs');
        const data = await res.json();
        setLogs(data);
      } catch (err) {
        console.error('Failed to fetch security logs', err);
      }
    };
    if (isEnabled) fetchLogs();
  }, [isEnabled]);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-emerald-500/10 text-emerald-400 rounded-2xl flex items-center justify-center">
            <ShieldCheck size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">System Security Shield</h2>
            <p className="text-xs text-secondary mt-1">Real-time threat monitoring and automated security backups.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Security Logs</h3>
            <div className="space-y-4">
              {logs.length > 0 ? logs.map((log, i) => (
                <div key={i} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                  <div className="flex items-center gap-4">
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                      log.status === 'Blocked' ? 'bg-rose-500/10 text-rose-400' : 'bg-emerald-500/10 text-emerald-400'
                    }`}>
                      {log.status === 'Blocked' ? <Lock size={16} /> : <ShieldCheck size={16} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-[#EAEAEA]">{log.event}</div>
                      <div className="text-[10px] text-secondary mt-1">User: {log.user} • IP: {log.ip}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-[10px] font-bold uppercase tracking-widest ${
                      log.status === 'Blocked' ? 'text-rose-400' : 'text-emerald-400'
                    }`}>{log.status}</div>
                    <div className="text-[10px] text-secondary mt-1">{log.time}</div>
                  </div>
                </div>
              )) : (
                <div className="text-center py-8 text-secondary text-xs">No security logs found.</div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8">
          <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
            <h3 className="text-lg font-bold text-[#EAEAEA]">Security Health</h3>
            <div className="space-y-6">
              <div className="flex flex-col items-center justify-center py-4">
                <div className="relative w-32 h-32">
                  <svg className="w-full h-full" viewBox="0 0 36 36">
                    <path className="text-white/5" stroke="currentColor" strokeWidth="3" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path className="text-emerald-500" stroke="currentColor" strokeWidth="3" strokeDasharray="95, 100" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                  </svg>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-2xl font-bold text-[#EAEAEA]">95%</span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-emerald-400 mt-4 uppercase tracking-widest">System Secure</span>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Last Backup</span>
                  <span className="font-bold text-[#EAEAEA]">2h ago</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">SSL Certificate</span>
                  <span className="font-bold text-emerald-400">Valid</span>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span className="text-secondary">Firewall Status</span>
                  <span className="font-bold text-emerald-400">Active</span>
                </div>
              </div>
              <button className="w-full py-3 bg-emerald-500/10 text-emerald-400 rounded-xl font-bold text-xs hover:bg-emerald-500/20 transition-all">
                Download Security Report
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export const AIAutoNotificationSystem: React.FC<AIModuleProps> = ({ isEnabled, onToggle }) => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between bg-card border border-white/5 p-6 rounded-[32px]">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-500/10 text-blue-400 rounded-2xl flex items-center justify-center">
            <Bell size={24} />
          </div>
          <div>
            <h2 className="text-xl font-bold text-[#EAEAEA]">AI Notification Center</h2>
            <p className="text-xs text-secondary mt-1">Automated customer alerts and engagement notifications.</p>
          </div>
        </div>
        <button 
          onClick={onToggle}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            isEnabled ? 'bg-active text-white' : 'bg-white/5 text-secondary'
          }`}
        >
          <Power size={14} />
          {isEnabled ? 'Active' : 'Disabled'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Notification Templates</h3>
          <div className="space-y-4">
            {[
              { type: 'Order Confirmation', channel: 'Email/SMS', trigger: 'On Purchase' },
              { type: 'Shipping Update', channel: 'Email/Push', trigger: 'On Dispatch' },
              { type: 'Abandoned Cart', channel: 'Email', trigger: 'After 2 Hours' },
              { type: 'Promotion Alert', channel: 'Push', trigger: 'AI Predicted Time' },
            ].map((note, i) => (
              <div key={i} className="p-4 bg-white/5 rounded-2xl border border-white/5 flex items-center justify-between">
                <div>
                  <div className="text-sm font-bold text-[#EAEAEA]">{note.type}</div>
                  <div className="text-[10px] text-secondary mt-1">Channel: {note.channel} • Trigger: {note.trigger}</div>
                </div>
                <button className="p-2 bg-white/5 rounded-lg text-secondary hover:text-active transition-all">
                  <Settings size={16} />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA]">Delivery Stats</h3>
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Open Rate</div>
                <div className="text-xl font-bold text-blue-400">42.5%</div>
              </div>
              <div className="p-4 bg-white/5 rounded-2xl border border-white/5 space-y-1">
                <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Click Rate</div>
                <div className="text-xl font-bold text-emerald-400">12.8%</div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="text-[10px] font-bold text-secondary uppercase tracking-widest">Recent Sent</div>
              <div className="space-y-3">
                {[
                  { user: 'user_442', type: 'Order #1234', time: '5m ago', status: 'Delivered' },
                  { user: 'user_910', type: 'Cart Reminder', time: '12m ago', status: 'Opened' },
                  { user: 'user_221', type: 'Shipping Alert', time: '45m ago', status: 'Delivered' },
                ].map((sent, i) => (
                  <div key={i} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                      <span className="text-secondary">{sent.user} • {sent.type}</span>
                    </div>
                    <span className="text-secondary opacity-50">{sent.time}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
