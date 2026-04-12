import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, 
  Search, 
  Truck, 
  Lock, 
  Ticket as TicketIcon, 
  XCircle, 
  RotateCcw, 
  CreditCard, 
  MapPin, 
  User,
  ChevronDown,
  MessageCircle,
  Mail,
  Phone,
  Plus,
  Clock,
  ExternalLink,
  ShoppingBag
} from 'lucide-react';
import { FAQCategory, HelpFAQ, SupportTicket } from '../../types';

interface HelpCenterProps {
  userId: string;
  onBack: () => void;
  setCurrentView?: (view: any) => void;
}

export default function HelpCenter({ userId, onBack, setCurrentView }: HelpCenterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<FAQCategory[]>([]);
  const [faqs, setFaqs] = useState<HelpFAQ[]>([]);
  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [expandedFaq, setExpandedFaq] = useState<string | null>(null);
  const [showTicketForm, setShowTicketForm] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [userId]);

  const fetchData = async () => {
    try {
      const [catRes, faqRes, tktRes] = await Promise.all([
        fetch('/api/help/categories'),
        fetch('/api/help/faqs'),
        fetch(`/api/help/tickets/${userId}`)
      ]);
      setCategories(await catRes.json());
      setFaqs(await faqRes.json());
      setTickets(await tktRes.json());
    } catch (err) {
      console.error('Failed to fetch help center data', err);
    } finally {
      setIsLoading(false);
    }
  };

  const [selectedCategory, setSelectedCategory] = useState<FAQCategory | null>(null);
  const [selectedArticle, setSelectedArticle] = useState<HelpFAQ | null>(null);
  const [categoryArticles, setCategoryArticles] = useState<HelpFAQ[]>([]);

  useEffect(() => {
    if (selectedCategory) {
      fetch(`/api/help/articles/${selectedCategory.id}`)
        .then(res => res.json())
        .then(setCategoryArticles);
    }
  }, [selectedCategory]);

  const filteredFaqs = searchQuery 
    ? faqs.filter(f => f.question.toLowerCase().includes(searchQuery.toLowerCase()) || f.answer.toLowerCase().includes(searchQuery.toLowerCase()))
    : faqs.filter(f => f.isTopQuestion);

  const handleBack = () => {
    if (selectedArticle) {
      setSelectedArticle(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else {
      onBack();
    }
  };

  if (selectedArticle) {
    return (
      <div className="min-h-screen bg-bg p-4 md:p-8">
        <div className="max-w-3xl mx-auto">
          <button onClick={() => setSelectedArticle(null)} className="flex items-center gap-2 text-secondary hover:text-active mb-8 transition-colors">
            <ArrowLeft size={20} />
            <span className="text-sm font-bold">Back to Articles</span>
          </button>
          <article className="bg-white/5 border border-white/10 rounded-[40px] p-8 md:p-12 space-y-8">
            <div className="space-y-4">
              <h1 className="text-3xl md:text-4xl font-black tracking-tighter leading-tight">{selectedArticle.question}</h1>
              <div className="flex items-center gap-4 text-[10px] text-secondary uppercase font-bold tracking-widest">
                <span className="flex items-center gap-1"><Clock size={12} /> 5 min read</span>
                <span className="flex items-center gap-1"><User size={12} /> Tazu Support Team</span>
              </div>
            </div>
            <div className="h-px bg-white/10 w-full" />
            <div className="prose prose-invert max-w-none">
              <p className="text-secondary leading-relaxed text-lg">{selectedArticle.answer}</p>
              <p className="text-secondary leading-relaxed mt-4">For more detailed assistance, please don't hesitate to reach out to our customer care team directly through the support section.</p>
            </div>
          </article>
        </div>
      </div>
    );
  }

  if (selectedCategory) {
    return (
      <div className="min-h-screen bg-bg p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-12">
            <button onClick={() => setSelectedCategory(null)} className="p-2 hover:bg-white/5 rounded-full transition-colors">
              <ArrowLeft size={24} />
            </button>
            <div>
              <h1 className="text-2xl font-black tracking-tight text-active">{selectedCategory.name}</h1>
              <p className="text-secondary text-sm">Find answers related to {selectedCategory.name.toLowerCase()}.</p>
            </div>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {categoryArticles.map(article => (
              <button 
                key={article.id}
                onClick={() => setSelectedArticle(article)}
                className="bg-white/5 border border-white/10 p-6 rounded-3xl text-left hover:border-active/30 transition-all group flex items-center justify-between"
              >
                <span className="font-bold text-lg group-hover:text-active transition-colors">{article.question}</span>
                <ExternalLink size={18} className="text-secondary group-hover:text-active transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <div className="bg-active px-4 pt-6 pb-20 relative overflow-hidden">
        <div className="relative z-10 flex items-center gap-4 mb-8">
          <button onClick={handleBack} className="p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors">
            <ArrowLeft size={20} className="text-white" />
          </button>
          <h1 className="text-xl font-bold text-white">Help Center</h1>
        </div>
        
        <div className="relative z-10 text-center space-y-2 mb-8">
          <h2 className="text-2xl font-bold text-white uppercase tracking-tighter">Hi, How can we help?</h2>
          <p className="text-white/70 text-sm">Welcome to TAZU MART BD Help Center</p>
        </div>

        {/* Search Bar */}
        <div className="relative z-20 max-w-md mx-auto -mb-14">
          <div className="bg-white rounded-2xl shadow-xl flex items-center px-4 py-4 border border-gray-100">
            <Search className="text-gray-400 mr-3" size={20} />
            <input 
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for orders, delivery, refunds..."
              className="flex-1 bg-transparent outline-none text-primary text-sm"
            />
          </div>
        </div>

        {/* Decorative elements */}
        <div className="absolute -right-10 -top-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
        <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl" />
      </div>

      <div className="p-4 pt-10 space-y-8">
        {/* Categories Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-primary ml-2 uppercase tracking-widest">Categories</h3>
          <div className="grid grid-cols-2 gap-4">
            {categories.map((cat) => (
              <button 
                key={cat.id}
                onClick={() => setSelectedCategory(cat)}
                className="bg-white p-6 rounded-[32px] shadow-sm border border-gray-50 flex flex-col items-center gap-3 hover:shadow-md transition-all group"
              >
                <div className="w-12 h-12 bg-active/5 text-active rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  {cat.name.includes('Order') ? <Truck size={24} /> :
                   cat.name.includes('Payment') ? <CreditCard size={24} /> :
                   cat.name.includes('Return') ? <RotateCcw size={24} /> :
                   cat.name.includes('Account') ? <User size={24} /> :
                   <ShoppingBag size={24} />}
                </div>
                <span className="text-xs font-bold text-primary text-center leading-tight">{cat.name}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Top Questions Section */}
        <section className="space-y-4">
          <h3 className="text-sm font-bold text-primary ml-2 uppercase tracking-widest">Top Questions</h3>
          <div className="space-y-3">
            {filteredFaqs.map((faq) => (
              <div key={faq.id} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-50">
                <button 
                  onClick={() => setExpandedFaq(expandedFaq === faq.id ? null : faq.id)}
                  className="w-full p-4 flex items-center justify-between text-left"
                >
                  <span className="text-xs font-bold text-primary">{faq.question}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-gray-300 transition-transform ${expandedFaq === faq.id ? 'rotate-180' : ''}`} 
                  />
                </button>
                <AnimatePresence>
                  {expandedFaq === faq.id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="px-4 pb-4"
                    >
                      <p className="text-[11px] text-secondary leading-relaxed border-t border-gray-50 pt-3">
                        {faq.answer}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </section>

        {/* Contact Us Section */}
        <section className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-6">
          <div className="text-center space-y-1">
            <h3 className="text-sm font-bold text-primary">Contact TAZU MART BD Support</h3>
            <p className="text-[10px] text-secondary">We are available 9:00 AM – 10:00 PM (Daily)</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setCurrentView?.('support')}
              className="p-4 bg-blue-50 rounded-2xl flex flex-col items-center gap-2 group"
            >
              <MessageCircle className="text-blue-500 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-xs font-bold text-blue-600">Live Chat</span>
            </button>
            <button 
              onClick={() => setCurrentView?.('support')}
              className="p-4 bg-green-50 rounded-2xl flex flex-col items-center gap-2 group"
            >
              <Phone className="text-green-500 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-xs font-bold text-green-600">Contact Support</span>
            </button>
            <button 
              onClick={() => setCurrentView?.('support')}
              className="p-4 bg-orange-50 rounded-2xl flex flex-col items-center gap-2 group col-span-2"
            >
              <Plus className="text-orange-500 group-hover:scale-110 transition-transform" size={24} />
              <span className="text-xs font-bold text-orange-600">Submit Ticket</span>
            </button>
          </div>
        </section>

        {/* Footer Info */}
        <div className="text-center pb-8">
          <p className="text-[10px] text-secondary">Need more help? Visit our full desktop site.</p>
          <div className="flex items-center justify-center gap-2 mt-2 text-active font-bold text-[10px]">
            <span>www.tazumartbd.com</span>
            <ExternalLink size={10} />
          </div>
        </div>
      </div>
    </div>
  );
}
