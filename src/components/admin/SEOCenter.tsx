import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Globe, 
  Search, 
  Link as LinkIcon, 
  FileText, 
  Settings, 
  BarChart3, 
  RefreshCw, 
  Plus, 
  Trash2, 
  ExternalLink, 
  ChevronRight, 
  CheckCircle2, 
  AlertCircle, 
  Code, 
  Image as ImageIcon, 
  Twitter, 
  Facebook, 
  Layout, 
  Save, 
  Download, 
  Upload, 
  History,
  Activity,
  Zap
} from 'lucide-react';
import { 
  GlobalSEOSettings, 
  PageSEO, 
  RedirectRule, 
  SEOAnalyticsScripts 
} from '../../types';

type SEOTab = 'global' | 'pages' | 'redirects' | 'analytics' | 'sitemap';

export default function SEOCenter() {
  const [activeTab, setActiveTab] = useState<SEOTab>('global');
  const [selectedPage, setSelectedPage] = useState<PageSEO | null>(null);

  // Mock Data
  const globalSettings: GlobalSEOSettings = {
    metaTitle: 'My Marketplace - Best Online Shopping',
    metaDescription: 'Shop the latest trends in electronics, fashion, and home decor.',
    metaKeywords: 'marketplace, shopping, online store, electronics, fashion',
    canonicalUrl: 'https://mymarketplace.com',
    robotsTxt: 'User-agent: *\nAllow: /\nDisallow: /admin/',
    googleVerification: 'google-site-verification-12345',
    bingVerification: 'bing-site-verification-12345',
    sitemapEnabled: true
  };

  const pages: PageSEO[] = [
    {
      id: 'PAGE-1',
      pageType: 'Home',
      pageName: 'Homepage',
      slug: '/',
      metaTitle: 'Home | My Marketplace',
      metaDescription: 'Welcome to the best marketplace.',
      metaKeywords: 'home, shop',
      ogTitle: 'My Marketplace Home',
      ogDescription: 'Shop now!',
      ogImage: 'https://picsum.photos/seed/og/1200/630',
      twitterCard: 'summary_large_image',
      noIndex: false,
      noFollow: false
    },
    {
      id: 'PAGE-2',
      pageType: 'Category',
      pageName: 'Electronics',
      slug: '/category/electronics',
      metaTitle: 'Electronics | My Marketplace',
      metaDescription: 'Latest gadgets and tech.',
      metaKeywords: 'tech, gadgets',
      ogTitle: 'Shop Electronics',
      ogDescription: 'Best tech deals.',
      ogImage: 'https://picsum.photos/seed/tech/1200/630',
      twitterCard: 'summary_large_image',
      noIndex: false,
      noFollow: false
    }
  ];

  const redirects: RedirectRule[] = [
    { id: 'RED-1', fromUrl: '/old-product', toUrl: '/new-product', type: '301', createdAt: '2026-02-20' }
  ];

  const renderGlobal = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
            <Globe size={20} className="text-active" />
            Default Meta Tags
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Meta Title (Default)</label>
              <input type="text" defaultValue={globalSettings.metaTitle} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Meta Description</label>
              <textarea defaultValue={globalSettings.metaDescription} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all h-24 resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Meta Keywords</label>
              <input type="text" defaultValue={globalSettings.metaKeywords} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
            </div>
          </div>
        </div>

        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
            <Settings size={20} className="text-secondary" />
            Technical Settings
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Robots.txt Editor</label>
              <textarea defaultValue={globalSettings.robotsTxt} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-[#EAEAEA] outline-none focus:border-active transition-all h-32 resize-none" />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Google Verification</label>
                <input type="text" defaultValue={globalSettings.googleVerification} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Bing Verification</label>
                <input type="text" defaultValue={globalSettings.bingVerification} className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3">
        <button className="px-8 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-active/20 hover:bg-active/90 transition-all">
          <Save size={18} />
          Save Global SEO
        </button>
      </div>
    </div>
  );

  const renderPages = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA]">Page-Level SEO</h2>
          <p className="text-sm text-secondary">Optimize individual pages for better search visibility.</p>
        </div>
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-secondary" size={18} />
          <input type="text" placeholder="Search pages..." className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-4 py-3 text-sm outline-none focus:border-active transition-all" />
        </div>
      </div>

      <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Page Name</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Slug</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">SEO Score</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-secondary uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {pages.map((page) => (
                <tr key={page.id} className="hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="text-sm font-bold text-[#EAEAEA]">{page.pageName}</div>
                    <div className="text-[10px] text-secondary mt-0.5">{page.metaTitle}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-white/5 text-secondary rounded-lg text-[10px] font-bold uppercase tracking-widest">
                      {page.pageType}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-secondary font-mono">{page.slug}</td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-white/5 rounded-full overflow-hidden max-w-[60px]">
                        <div className="h-full bg-emerald-500 w-[85%]" />
                      </div>
                      <span className="text-[10px] font-bold text-emerald-400">85/100</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-active transition-all">
                      <Edit size={16} />
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

  const renderRedirects = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div>
          <h2 className="text-2xl font-bold text-[#EAEAEA]">URL Redirect Manager</h2>
          <p className="text-sm text-secondary">Manage 301 and 302 redirects to prevent broken links.</p>
        </div>
        <button className="px-6 py-3 bg-active text-white rounded-2xl text-sm font-bold hover:bg-active/90 transition-all flex items-center gap-2 shadow-lg shadow-active/20">
          <Plus size={18} />
          Add New Redirect
        </button>
      </div>

      <div className="bg-card border border-white/5 rounded-[40px] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-white/5 bg-white/[0.01]">
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">From URL</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">To URL</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Type</th>
                <th className="px-6 py-4 text-[10px] font-bold text-secondary uppercase tracking-widest">Created</th>
                <th className="px-6 py-4 text-right text-[10px] font-bold text-secondary uppercase tracking-widest">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {redirects.map((red) => (
                <tr key={red.id} className="hover:bg-white/[0.02] transition-colors">
                  <td className="px-6 py-4 text-xs text-rose-400 font-mono">{red.fromUrl}</td>
                  <td className="px-6 py-4 text-xs text-emerald-400 font-mono">{red.toUrl}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-active/10 text-active rounded-lg text-[10px] font-black uppercase tracking-widest">
                      {red.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-xs text-secondary">{red.createdAt}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-white/5 rounded-lg text-secondary hover:text-rose-400 transition-all">
                      <Trash2 size={16} />
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

  const renderAnalytics = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
            <BarChart3 size={20} className="text-active" />
            Tracking IDs
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Google Analytics ID</label>
              <input type="text" placeholder="G-XXXXXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Google Tag Manager ID</label>
              <input type="text" placeholder="GTM-XXXXXXX" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Facebook Pixel ID</label>
              <input type="text" placeholder="1234567890" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-sm text-[#EAEAEA] outline-none focus:border-active transition-all" />
            </div>
          </div>
        </div>

        <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-6">
          <h3 className="text-lg font-bold text-[#EAEAEA] flex items-center gap-2">
            <Code size={20} className="text-secondary" />
            Custom Scripts
          </h3>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Header Scripts</label>
              <textarea placeholder="<script>...</script>" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-[#EAEAEA] outline-none focus:border-active transition-all h-24 resize-none" />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-secondary uppercase tracking-widest px-2">Footer Scripts</label>
              <textarea placeholder="<script>...</script>" className="w-full bg-white/5 border border-white/10 rounded-2xl px-4 py-3 text-xs font-mono text-[#EAEAEA] outline-none focus:border-active transition-all h-24 resize-none" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderSitemap = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { label: 'Total URLs', value: '1,240', icon: LinkIcon, color: 'text-active' },
          { label: 'Last Generated', value: '2 hours ago', icon: RefreshCw, color: 'text-emerald-400' },
          { label: 'Sitemap Status', value: 'Healthy', icon: CheckCircle2, color: 'text-indigo-400' },
        ].map((stat, i) => (
          <div key={i} className="p-6 bg-card border border-white/5 rounded-[32px] flex items-center justify-between">
            <div>
              <div className="text-xs text-secondary font-medium">{stat.label}</div>
              <div className="text-lg font-bold text-[#EAEAEA] mt-1">{stat.value}</div>
            </div>
            <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center ${stat.color}`}>
              <stat.icon size={24} />
            </div>
          </div>
        ))}
      </div>

      <div className="p-8 bg-card border border-white/5 rounded-[40px] space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-[#EAEAEA]">Sitemap Management</h3>
            <p className="text-sm text-secondary">Generate and manage XML sitemaps for search engines.</p>
          </div>
          <button className="px-8 py-3 bg-active text-white rounded-2xl font-bold text-sm flex items-center gap-2 shadow-lg shadow-active/20 hover:bg-active/90 transition-all">
            <RefreshCw size={18} />
            Regenerate All Sitemaps
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { name: 'Products Sitemap', count: 850, url: '/sitemap-products.xml' },
            { name: 'Categories Sitemap', count: 120, url: '/sitemap-categories.xml' },
            { name: 'Pages Sitemap', count: 45, url: '/sitemap-pages.xml' },
            { name: 'Blog Sitemap', count: 225, url: '/sitemap-blog.xml' },
          ].map((sm, i) => (
            <div key={i} className="p-6 bg-white/5 border border-white/10 rounded-3xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center text-secondary">
                  <FileText size={20} />
                </div>
                <span className="text-xs font-bold text-active">{sm.count} URLs</span>
              </div>
              <div>
                <div className="text-sm font-bold text-[#EAEAEA]">{sm.name}</div>
                <div className="text-[10px] text-secondary mt-1 font-mono truncate">{sm.url}</div>
              </div>
              <button className="w-full py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest text-secondary hover:text-active transition-all">
                View XML
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-10">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 bg-active/10 text-active rounded-2xl flex items-center justify-center">
            <Globe size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-[#EAEAEA]">SEO Management</h1>
            <p className="text-sm text-secondary">Optimize your marketplace for maximum search engine visibility.</p>
          </div>
        </div>
        <div className="flex items-center gap-2 bg-card border border-white/5 p-1.5 rounded-2xl">
          {[
            { id: 'global', label: 'Global', icon: Globe },
            { id: 'pages', label: 'Pages', icon: Layout },
            { id: 'redirects', label: 'Redirects', icon: LinkIcon },
            { id: 'analytics', label: 'Analytics', icon: BarChart3 },
            { id: 'sitemap', label: 'Sitemap', icon: FileText },
          ].map((tab) => (
            <button 
              key={tab.id}
              onClick={() => setActiveTab(tab.id as SEOTab)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                activeTab === tab.id 
                  ? 'bg-active text-white shadow-lg shadow-active/20' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <tab.icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <div className="relative">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab}>
            {activeTab === 'global' && renderGlobal()}
            {activeTab === 'pages' && renderPages()}
            {activeTab === 'redirects' && renderRedirects()}
            {activeTab === 'analytics' && renderAnalytics()}
            {activeTab === 'sitemap' && renderSitemap()}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

function Edit({ size, className }: { size: number, className?: string }) {
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
      <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
      <path d="m15 5 4 4" />
    </svg>
  );
}
