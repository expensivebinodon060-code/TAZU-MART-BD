import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Send, X, User, ShieldCheck, Clock, Check, CheckCheck } from 'lucide-react';

interface Message {
  id: string;
  userId: string;
  text: string;
  timestamp: string;
  isSystem?: boolean;
  status?: 'sent' | 'delivered' | 'read';
  to?: string;
}

interface LiveChatProps {
  userId: string;
  userName: string;
  onClose: () => void;
}

export default function LiveChat({ userId, userName, onClose }: LiveChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const socketRef = useRef<WebSocket | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const socket = new WebSocket(`${protocol}//${window.location.host}`);
    socketRef.current = socket;

    socket.onopen = () => {
      socket.send(JSON.stringify({ type: 'auth', userId }));
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'history') {
        setMessages(data.messages);
      } else if (data.type === 'message') {
        setMessages(prev => [...prev, data.message]);
        if (data.message.userId === 'admin') {
          setIsTyping(false);
        }
      }
    };

    return () => {
      socket.close();
    };
  }, [userId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !socketRef.current) return;

    const message = {
      type: 'message',
      text: inputText,
      userId
    };

    socketRef.current.send(JSON.stringify(message));
    
    // Optimistic update
    const localMsg: Message = {
      id: `local-${Date.now()}`,
      userId,
      text: inputText,
      timestamp: new Date().toISOString(),
      status: 'sent'
    };
    setMessages(prev => [...prev, localMsg]);
    setInputText('');
    
    // Simulate admin typing
    setTimeout(() => setIsTyping(true), 500);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-8 sm:w-[400px] sm:h-[600px] bg-white shadow-2xl rounded-3xl overflow-hidden flex flex-col z-50 border border-gray-100"
    >
      {/* Header */}
      <div className="bg-active p-4 flex items-center justify-between text-white">
        <div className="flex items-center gap-3">
          <div className="relative">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ShieldCheck size={24} />
            </div>
            {isOnline && (
              <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-400 border-2 border-active rounded-full" />
            )}
          </div>
          <div>
            <h3 className="font-bold text-sm">IYABD Support</h3>
            <div className="flex items-center gap-1.5">
              <span className="text-[10px] opacity-80">{isOnline ? 'Online' : 'Offline'}</span>
              <span className="w-1 h-1 bg-white/40 rounded-full" />
              <span className="text-[10px] opacity-80">Typically replies in minutes</span>
            </div>
          </div>
        </div>
        <button 
          onClick={onClose}
          className="p-2 hover:bg-white/10 rounded-full transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      {/* Messages Area */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50"
      >
        <div className="text-center py-4">
          <span className="text-[10px] font-bold text-secondary uppercase tracking-widest bg-gray-100 px-3 py-1 rounded-full">
            Today
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.userId === userId;
          const isAdmin = msg.userId === 'admin' || msg.userId === 'system';
          
          return (
            <div 
              key={msg.id}
              className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[80%] space-y-1 ${isMe ? 'items-end' : 'items-start'} flex flex-col`}>
                <div className={`px-4 py-2.5 rounded-2xl text-sm ${
                  isMe 
                    ? 'bg-active text-white rounded-tr-none' 
                    : 'bg-white text-primary border border-gray-100 rounded-tl-none shadow-sm'
                }`}>
                  {msg.text}
                </div>
                <div className="flex items-center gap-1 px-1">
                  <span className="text-[10px] text-secondary">
                    {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {isMe && (
                    <span className="text-active">
                      {msg.status === 'read' ? <CheckCheck size={12} /> : <Check size={12} />}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-white border border-gray-100 px-4 py-2 rounded-2xl rounded-tl-none shadow-sm flex gap-1">
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }} 
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-1.5 h-1.5 bg-secondary rounded-full" 
              />
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }} 
                transition={{ repeat: Infinity, duration: 1, delay: 0.2 }}
                className="w-1.5 h-1.5 bg-secondary rounded-full" 
              />
              <motion.div 
                animate={{ opacity: [0.4, 1, 0.4] }} 
                transition={{ repeat: Infinity, duration: 1, delay: 0.4 }}
                className="w-1.5 h-1.5 bg-secondary rounded-full" 
              />
            </div>
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100">
        {!isOnline && (
          <p className="text-[10px] text-secondary text-center mb-3">
            If we are offline, please leave a message. We will respond soon.
          </p>
        )}
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <input 
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 bg-gray-50 border border-transparent focus:border-active focus:bg-white rounded-xl px-4 py-3 text-sm outline-none transition-all"
          />
          <button 
            type="submit"
            disabled={!inputText.trim()}
            className="w-12 h-12 bg-active text-white rounded-xl flex items-center justify-center hover:opacity-90 active:scale-95 transition-all disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </motion.div>
  );
}
