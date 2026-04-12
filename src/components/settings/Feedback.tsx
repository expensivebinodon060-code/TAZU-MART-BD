import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowLeft, AlertCircle, Lightbulb, Upload, X, CheckCircle2, ChevronRight } from 'lucide-react';

interface FeedbackProps {
  userId: string;
  onBack: () => void;
}

export default function Feedback({ userId, onBack }: FeedbackProps) {
  const [activeView, setActiveView] = useState<'main' | 'error' | 'suggestion'>('main');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const [errorForm, setErrorForm] = useState({
    errorType: 'Page not loading',
    description: '',
    pageUrl: window.location.href,
  });

  const [suggestionForm, setSuggestionForm] = useState({
    category: 'Website Improvement',
    title: '',
    description: '',
  });

  const handleSubmitError = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback/error-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...errorForm, imageUrls: [] }),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setActiveView('main');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit error report', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitSuggestion = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await fetch('/api/feedback/suggestion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, ...suggestionForm, imageUrls: [] }),
      });
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setActiveView('main');
      }, 2000);
    } catch (err) {
      console.error('Failed to submit suggestion', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f4f4f4]">
      {/* Header */}
      <div className="bg-white px-4 py-4 flex items-center gap-4 sticky top-0 z-10 border-b border-gray-100">
        <button onClick={activeView === 'main' ? onBack : () => setActiveView('main')} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <h1 className="text-xl font-bold text-primary">
          {activeView === 'main' ? 'Feedback' : activeView === 'error' ? 'Report Page Error' : 'Submit Suggestion'}
        </h1>
      </div>

      <AnimatePresence mode="wait">
        {activeView === 'main' && (
          <motion.div
            key="main"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 space-y-4"
          >
            <button 
              className="w-full bg-white p-6 rounded-[32px] flex items-center gap-4 shadow-sm border border-gray-50 group hover:border-amber-200 transition-all"
            >
              <div className="w-14 h-14 bg-amber-50 text-amber-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <CheckCircle2 size={28} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-primary">Rate App</h3>
                <p className="text-[10px] text-secondary">Love using the app? Let us know on the store.</p>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-amber-500 transition-colors" />
            </button>

            <button 
              onClick={() => setActiveView('error')}
              className="w-full bg-white p-6 rounded-[32px] flex items-center gap-4 shadow-sm border border-gray-50 group hover:border-red-200 transition-all"
            >
              <div className="w-14 h-14 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <AlertCircle size={28} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-primary">Report Problem</h3>
                <p className="text-[10px] text-secondary">Found a bug or broken link? Let us know.</p>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-red-500 transition-colors" />
            </button>

            <button 
              onClick={() => setActiveView('suggestion')}
              className="w-full bg-white p-6 rounded-[32px] flex items-center gap-4 shadow-sm border border-gray-50 group hover:border-blue-200 transition-all"
            >
              <div className="w-14 h-14 bg-blue-50 text-blue-500 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                <Lightbulb size={28} />
              </div>
              <div className="flex-1 text-left">
                <h3 className="font-bold text-primary">Suggest Feature</h3>
                <p className="text-[10px] text-secondary">Have an idea to improve our service?</p>
              </div>
              <ChevronRight size={20} className="text-gray-300 group-hover:text-blue-500 transition-colors" />
            </button>
          </motion.div>
        )}

        {activeView === 'error' && (
          <motion.div
            key="error"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4"
          >
            <form onSubmit={handleSubmitError} className="space-y-6">
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Error Type</label>
                  <select 
                    value={errorForm.errorType}
                    onChange={(e) => setErrorForm({...errorForm, errorType: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-bold text-primary border border-transparent focus:border-active/20 transition-all"
                  >
                    <option>Page not loading</option>
                    <option>Broken layout</option>
                    <option>Wrong information</option>
                    <option>Payment error</option>
                    <option>Button not working</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Page URL</label>
                  <input 
                    type="text"
                    value={errorForm.pageUrl}
                    readOnly
                    className="w-full p-4 bg-gray-100 rounded-2xl outline-none text-xs text-secondary border border-transparent"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required
                    value={errorForm.description}
                    onChange={(e) => setErrorForm({...errorForm, description: e.target.value})}
                    placeholder="Please describe what happened..."
                    rows={4}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm text-primary border border-transparent focus:border-active/20 transition-all resize-none"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Screenshot (Optional)</label>
                  <div className="border-2 border-dashed border-gray-100 rounded-2xl p-8 flex flex-col items-center justify-center gap-2 text-gray-400 hover:border-active/20 hover:text-active transition-all cursor-pointer">
                    <Upload size={24} />
                    <span className="text-[10px] font-bold">Tap to upload image</span>
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-active text-white rounded-2xl font-bold shadow-xl shadow-active/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Report'}
              </button>
            </form>
          </motion.div>
        )}

        {activeView === 'suggestion' && (
          <motion.div
            key="suggestion"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-4"
          >
            <form onSubmit={handleSubmitSuggestion} className="space-y-6">
              <div className="bg-white rounded-[32px] p-6 shadow-sm border border-gray-50 space-y-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Category</label>
                  <select 
                    value={suggestionForm.category}
                    onChange={(e) => setSuggestionForm({...suggestionForm, category: e.target.value})}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-bold text-primary border border-transparent focus:border-active/20 transition-all"
                  >
                    <option>Website Improvement</option>
                    <option>New Feature</option>
                    <option>UI Design</option>
                    <option>Payment System</option>
                    <option>Delivery System</option>
                    <option>Other</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Title</label>
                  <input 
                    type="text"
                    required
                    value={suggestionForm.title}
                    onChange={(e) => setSuggestionForm({...suggestionForm, title: e.target.value})}
                    placeholder="E.g., Add dark mode"
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm font-bold text-primary border border-transparent focus:border-active/20 transition-all"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-secondary uppercase tracking-widest ml-1">Description</label>
                  <textarea 
                    required
                    value={suggestionForm.description}
                    onChange={(e) => setSuggestionForm({...suggestionForm, description: e.target.value})}
                    placeholder="Tell us more about your idea..."
                    rows={4}
                    className="w-full p-4 bg-gray-50 rounded-2xl outline-none text-sm text-primary border border-transparent focus:border-active/20 transition-all resize-none"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-active text-white rounded-2xl font-bold shadow-xl shadow-active/20 disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Suggestion'}
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Success Modal */}
      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-[40px] p-10 text-center space-y-4 max-w-xs w-full shadow-2xl"
            >
              <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 size={48} />
              </div>
              <h3 className="text-xl font-black text-primary">Thank You!</h3>
              <p className="text-xs text-secondary leading-relaxed">
                Your feedback has been submitted successfully. We appreciate your contribution!
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
