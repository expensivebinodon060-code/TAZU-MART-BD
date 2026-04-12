import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  X, 
  Send, 
  Bot, 
  User, 
  Loader2,
  MinusCircle,
  MessageCircle,
  HelpCircle,
  Phone,
  Image as ImageIcon,
  Paperclip,
  Check,
  CheckCheck,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface Message {
  id?: string;
  role: 'user' | 'ai' | 'admin';
  content: string;
  timestamp: Date;
  status?: 'Sent' | 'Delivered' | 'Seen';
}

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [activeMode, setActiveMode] = useState<'menu' | 'ai' | 'live' | 'help'>('menu');
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'ai',
      content: "Hello! I'm TAZU AI Assistant. How can I help you today?",
      timestamp: new Date()
    }
  ]);
  const [liveMessages, setLiveMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [connectivity, setConnectivity] = useState({
    whatsappNumber: "01834800916",
    messengerLink: "https://m.me/tazumartbd",
    supportPhone: "+8801834800916",
    supportEmail: "support@tazumartbd.com"
  });
  const [faqs, setFaqs] = useState<any[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchConnectivity();
    fetchFaqs();
    const handleOpenChat = () => {
      setIsOpen(true);
      setIsMinimized(false);
      setActiveMode('menu');
    };
    window.addEventListener('open-ai-chat', handleOpenChat);
    return () => window.removeEventListener('open-ai-chat', handleOpenChat);
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, liveMessages, activeMode]);

  // Polling for live chat messages
  useEffect(() => {
    let interval: any;
    if (isOpen && activeMode === 'live') {
      interval = setInterval(fetchLiveMessages, 3000);
    }
    return () => clearInterval(interval);
  }, [isOpen, activeMode]);

  const fetchConnectivity = async () => {
    try {
      const res = await fetch('/api/admin/connectivity');
      const data = await res.json();
      setConnectivity(data);
    } catch (error) {
      console.error('Fetch Connectivity Error:', error);
    }
  };

  const fetchFaqs = async () => {
    try {
      const res = await fetch('/api/faqs');
      const data = await res.json();
      setFaqs(data);
    } catch (error) {
      console.error('Fetch FAQs Error:', error);
    }
  };

  const fetchLiveMessages = async () => {
    try {
      const res = await fetch('/api/live-chat/messages?userId=guest-user'); // In real app, use actual user ID
      const data = await res.json();
      setLiveMessages(data.map((m: any) => ({
        ...m,
        timestamp: new Date(m.timestamp)
      })));
    } catch (error) {
      console.error('Fetch Live Messages Error:', error);
    }
  };

  const handleSendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!message.trim() || isLoading) return;

    const userMessage = message.trim();
    setMessage('');

    if (activeMode === 'ai') {
      const newMessages: Message[] = [...messages, { role: 'user', content: userMessage, timestamp: new Date() }];
      setMessages(newMessages);
      setIsLoading(true);

      try {
        const response = await fetch('/api/ai/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            message: userMessage,
            history: messages.map(m => ({ role: m.role, content: m.content }))
          })
        });

        const data = await response.json();
        if (data.response) {
          setMessages(prev => [...prev, { role: 'ai', content: data.response, timestamp: new Date() }]);
        } else {
          setMessages(prev => [...prev, { role: 'ai', content: "I'm sorry, I'm having trouble connecting right now. Please try again later.", timestamp: new Date() }]);
        }
      } catch (error) {
        console.error('Chat Error:', error);
        setMessages(prev => [...prev, { role: 'ai', content: "Connection error. Please check your internet and try again.", timestamp: new Date() }]);
      } finally {
        setIsLoading(false);
      }
    } else if (activeMode === 'live') {
      try {
        await fetch('/api/live-chat/send', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            userId: 'guest-user',
            content: userMessage,
            role: 'user',
            recipientId: 'admin'
          })
        });
        fetchLiveMessages();
      } catch (error) {
        console.error('Live Chat Send Error:', error);
      }
    }
  };

  const menuOptions = [
    { id: 'messenger', label: 'Messenger', icon: MessageCircle, color: 'bg-[#0084FF]', link: connectivity.messengerLink },
    { id: 'whatsapp', label: 'WhatsApp', icon: MessageSquare, color: 'bg-[#25D366]', link: `https://wa.me/${connectivity.whatsappNumber.replace(/\D/g, '')}` },
    { id: 'live', label: 'Live Chat', icon: MessageSquare, color: 'bg-[#5B4BFF]', action: () => setActiveMode('live') },
    { id: 'help', label: 'Help Center', icon: HelpCircle, color: 'bg-[#FF9F43]', action: () => setActiveMode('help') },
  ];

  const renderStatus = (status?: string) => {
    if (status === 'Sent') return <Check size={14} className="text-secondary" />;
    if (status === 'Delivered') return <CheckCheck size={14} className="text-secondary" />;
    if (status === 'Seen') return <CheckCheck size={14} className="text-[#5B4BFF]" />;
    return null;
  };

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      <AnimatePresence>
        {isOpen && !isMinimized && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="w-[380px] h-[600px] bg-[#000000] border border-white/10 rounded-[32px] shadow-2xl flex flex-col overflow-hidden mb-4"
          >
            {/* Header */}
            <div className="p-6 bg-[#121212] text-white flex items-center justify-between border-b border-white/5">
              <div className="flex items-center gap-3">
                {activeMode !== 'menu' && (
                  <button onClick={() => setActiveMode('menu')} className="p-1 hover:bg-white/10 rounded-lg transition-colors">
                    <ChevronLeft size={20} />
                  </button>
                )}
                <div className="w-10 h-10 bg-[#5B4BFF]/20 rounded-xl flex items-center justify-center text-[#5B4BFF]">
                  <Bot size={24} />
                </div>
                <div>
                  <h3 className="font-bold text-sm">TAZU AI Assistant</h3>
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                    <span className="text-[10px] font-bold uppercase tracking-widest opacity-80">Online</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  onClick={() => setIsMinimized(true)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <MinusCircle size={20} />
                </button>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            {/* Menu Swipe */}
            {activeMode === 'menu' && (
              <div className="flex-1 flex flex-col p-6 space-y-8 overflow-hidden">
                <div className="text-center space-y-2">
                  <h2 className="text-xl font-bold">How can we help?</h2>
                  <p className="text-secondary text-sm">Choose a support channel to get started.</p>
                </div>
                
                <div className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-4 scrollbar-hide -mx-6 px-6">
                  {menuOptions.map((opt) => (
                    <motion.button
                      key={opt.id}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => opt.link ? window.open(opt.link, '_blank') : opt.action?.()}
                      className="snap-center flex-shrink-0 flex flex-col items-center gap-3"
                    >
                      <div className={`w-[100px] h-[100px] ${opt.color} rounded-[24px] flex items-center justify-center text-white shadow-xl shadow-black/20 transition-all group`}>
                        <opt.icon size={32} className="group-hover:scale-110 transition-transform" />
                      </div>
                      <span className="text-[10px] font-bold uppercase tracking-widest">{opt.label}</span>
                    </motion.button>
                  ))}
                </div>

                <div className="flex items-center justify-center gap-2 text-secondary/40 animate-pulse">
                  <span className="text-[8px] font-bold uppercase tracking-widest">← swipe →</span>
                </div>

                <div className="bg-white/5 p-6 rounded-[32px] space-y-4 mt-auto">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#5B4BFF]/20 rounded-xl flex items-center justify-center text-[#5B4BFF]">
                      <Bot size={20} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-widest">Quick AI Help</h4>
                      <p className="text-[10px] text-secondary">Instant answers from TAZU AI</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => setActiveMode('ai')}
                    className="w-full py-4 bg-[#5B4BFF] text-white rounded-2xl font-bold shadow-lg shadow-[#5B4BFF]/20 flex items-center justify-center gap-2"
                  >
                    Start AI Chat
                  </button>
                </div>
              </div>
            )}

            {/* AI Chat Mode */}
            {activeMode === 'ai' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {messages.map((msg, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-[#5B4BFF] text-white' : 'bg-white/5 text-secondary'
                      }`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className={`max-w-[80%] p-4 rounded-2xl text-sm leading-relaxed ${
                        msg.role === 'user' 
                          ? 'bg-[#5B4BFF] text-white rounded-tr-none' 
                          : 'bg-white/5 text-primary rounded-tl-none border border-white/5'
                      }`}>
                        {msg.content}
                      </div>
                    </motion.div>
                  ))}
                  {isLoading && (
                    <div className="flex gap-3">
                      <div className="w-8 h-8 rounded-lg bg-white/5 text-secondary flex items-center justify-center">
                        <Bot size={16} />
                      </div>
                      <div className="bg-white/5 p-4 rounded-2xl rounded-tl-none border border-white/5">
                        <Loader2 size={16} className="animate-spin text-[#5B4BFF]" />
                      </div>
                    </div>
                  )}
                  <div ref={messagesEndRef} />
                </div>
                <ChatInput 
                  message={message} 
                  setMessage={setMessage} 
                  onSubmit={handleSendMessage} 
                  isLoading={isLoading} 
                />
              </div>
            )}

            {/* Live Chat Mode */}
            {activeMode === 'live' && (
              <div className="flex-1 flex flex-col overflow-hidden">
                <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                  {liveMessages.length === 0 && (
                    <div className="text-center py-12 space-y-4">
                      <div className="w-16 h-16 bg-[#5B4BFF]/10 text-[#5B4BFF] rounded-full flex items-center justify-center mx-auto">
                        <MessageSquare size={32} />
                      </div>
                      <h3 className="font-bold">Connecting to Support...</h3>
                      <p className="text-xs text-secondary px-8">Our agents are typically available 10 AM - 10 PM. Please send your message and we'll get back to you.</p>
                    </div>
                  )}
                  {liveMessages.map((msg, idx) => (
                    <motion.div
                      key={msg.id || idx}
                      initial={{ opacity: 0, x: msg.role === 'user' ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
                    >
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${
                        msg.role === 'user' ? 'bg-[#5B4BFF] text-white' : 'bg-white/5 text-secondary'
                      }`}>
                        {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
                      </div>
                      <div className="flex flex-col gap-1 max-w-[80%]">
                        <div className={`p-4 rounded-2xl text-sm leading-relaxed ${
                          msg.role === 'user' 
                            ? 'bg-[#5B4BFF] text-white rounded-tr-none' 
                            : 'bg-white/5 text-primary rounded-tl-none border border-white/5'
                        }`}>
                          {msg.content}
                        </div>
                        {msg.role === 'user' && (
                          <div className="flex justify-end gap-1 items-center">
                            <span className="text-[8px] text-secondary">{msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                            {renderStatus(msg.status)}
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                  <div ref={messagesEndRef} />
                </div>
                <ChatInput 
                  message={message} 
                  setMessage={setMessage} 
                  onSubmit={handleSendMessage} 
                  isLoading={isLoading} 
                  showExtras
                />
              </div>
            )}

            {/* Help Center Mode */}
            {activeMode === 'help' && (
              <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide">
                <div className="space-y-4">
                  <h3 className="font-bold text-lg">Frequently Asked Questions</h3>
                  <div className="space-y-3">
                    {faqs.map((faq) => (
                      <details key={faq.id} className="group bg-white/5 border border-white/5 rounded-2xl overflow-hidden transition-all">
                        <summary className="p-4 cursor-pointer flex items-center justify-between font-bold text-sm list-none">
                          {faq.question}
                          <ChevronRight size={16} className="group-open:rotate-90 transition-transform" />
                        </summary>
                        <div className="p-4 pt-0 text-xs text-secondary leading-relaxed border-t border-white/5 mt-2">
                          {faq.answer}
                        </div>
                      </details>
                    ))}
                  </div>
                </div>
                
                <div className="p-6 bg-[#5B4BFF]/10 border border-[#5B4BFF]/20 rounded-3xl space-y-3">
                  <h4 className="font-bold text-sm text-[#5B4BFF]">Still need help?</h4>
                  <p className="text-xs text-secondary">Our support team is just a message away.</p>
                  <button 
                    onClick={() => setActiveMode('live')}
                    className="w-full py-3 bg-[#5B4BFF] text-white rounded-xl font-bold text-xs"
                  >
                    Contact Live Support
                  </button>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating Button */}
      <motion.div
        layout
        className="flex items-center gap-3"
      >
        {isMinimized && isOpen && (
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={() => setIsMinimized(false)}
            className="bg-[#5B4BFF] text-white px-6 py-3 rounded-2xl font-bold shadow-xl flex items-center gap-2 hover:scale-105 transition-transform"
          >
            <Bot size={20} />
            Support Active
          </motion.button>
        )}
        
        {!isOpen && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsOpen(true)}
            className="w-16 h-16 bg-[#5B4BFF] text-white rounded-full flex items-center justify-center shadow-2xl shadow-[#5B4BFF]/40 transition-all group relative overflow-hidden"
          >
            <motion.div
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute inset-0 bg-white/10 rounded-full"
            />
            <MessageSquare size={28} className="relative z-10 group-hover:rotate-12 transition-transform" />
          </motion.button>
        )}
      </motion.div>
    </div>
  );
}

function ChatInput({ message, setMessage, onSubmit, isLoading, showExtras }: any) {
  return (
    <form onSubmit={onSubmit} className="p-6 border-t border-white/5 bg-white/[0.02]">
      <div className="flex items-center gap-2 mb-3">
        {showExtras && (
          <>
            <button type="button" className="p-2 text-secondary hover:text-primary transition-colors">
              <ImageIcon size={20} />
            </button>
            <button type="button" className="p-2 text-secondary hover:text-primary transition-colors">
              <Paperclip size={20} />
            </button>
          </>
        )}
      </div>
      <div className="relative">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="w-full bg-bg border border-white/10 rounded-2xl pl-4 pr-12 py-3 text-sm outline-none focus:border-[#5B4BFF] transition-all"
        />
        <button
          type="submit"
          disabled={!message.trim() || isLoading}
          className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#5B4BFF] text-white rounded-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:scale-105 transition-transform"
        >
          <Send size={16} />
        </button>
      </div>
      <p className="text-[10px] text-center text-secondary mt-3 uppercase tracking-widest font-bold">
        Powered by TAZU Smart AI
      </p>
    </form>
  );
}
