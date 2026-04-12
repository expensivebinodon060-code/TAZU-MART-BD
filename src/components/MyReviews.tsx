import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Star, 
  ChevronLeft, 
  MessageSquare, 
  Edit3, 
  Trash2, 
  Plus, 
  CheckCircle2,
  Image as ImageIcon
} from 'lucide-react';

interface Review {
  id: string;
  productId: string;
  productName: string;
  image: string;
  rating: number;
  comment: string;
  status: 'reviewed' | 'pending';
  date: string;
}

export default function MyReviews({ onBack, userId }: { onBack: () => void, userId: string }) {
  const [activeTab, setActiveTab] = useState<'reviewed' | 'pending'>('reviewed');
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showReviewForm, setShowReviewForm] = useState<Review | null>(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  useEffect(() => {
    fetchReviews();
  }, [userId]);

  const fetchReviews = async () => {
    try {
      const res = await fetch(`/api/reviews/${userId}`);
      const data = await res.json();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this review?')) return;
    try {
      await fetch(`/api/reviews/${id}`, { method: 'DELETE' });
      setReviews(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmitReview = async () => {
    if (!showReviewForm) return;
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId,
          productId: showReviewForm.productId,
          productName: showReviewForm.productName,
          image: showReviewForm.image,
          rating,
          comment
        })
      });
      if (res.ok) {
        setShowReviewForm(null);
        setRating(5);
        setComment('');
        fetchReviews();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const filteredReviews = reviews.filter(r => r.status === activeTab);

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-active flex items-center gap-2">
              <Star className="text-active" />
              My Reviews
            </h1>
            <p className="text-secondary text-sm">Manage your product reviews and feedback.</p>
          </div>
        </header>

        <div className="flex bg-white/5 p-1 rounded-2xl mb-8">
          <button
            onClick={() => setActiveTab('reviewed')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'reviewed' ? 'bg-active text-white shadow-lg shadow-active/20' : 'text-secondary'
            }`}
          >
            Reviewed Products
          </button>
          <button
            onClick={() => setActiveTab('pending')}
            className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all ${
              activeTab === 'pending' ? 'bg-active text-white shadow-lg shadow-active/20' : 'text-secondary'
            }`}
          >
            Pending Reviews
          </button>
        </div>

        {isLoading ? (
          <div className="py-20 text-center text-secondary">Loading reviews...</div>
        ) : filteredReviews.length === 0 ? (
          <div className="py-20 text-center space-y-4 bg-white/5 rounded-[40px] border border-white/10">
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mx-auto">
              <MessageSquare size={40} className="text-secondary/20" />
            </div>
            <p className="text-secondary font-medium">No {activeTab} reviews found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredReviews.map((review) => (
              <motion.div
                key={review.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col md:flex-row gap-6"
              >
                <div className="w-24 h-24 rounded-2xl overflow-hidden shrink-0 bg-white/10">
                  <img src={review.image} alt={review.productName} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-bold text-lg">{review.productName}</h3>
                      <p className="text-[10px] text-secondary uppercase font-bold tracking-widest">{review.date}</p>
                    </div>
                    {review.status === 'reviewed' && (
                      <div className="flex gap-2">
                        <button className="p-2 text-secondary hover:text-active transition-colors">
                          <Edit3 size={18} />
                        </button>
                        <button onClick={() => handleDelete(review.id)} className="p-2 text-secondary hover:text-red-500 transition-colors">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    )}
                  </div>

                  {review.status === 'reviewed' ? (
                    <div className="space-y-2">
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map(s => (
                          <Star key={s} size={14} className={s <= review.rating ? 'text-yellow-400 fill-yellow-400' : 'text-white/10'} />
                        ))}
                      </div>
                      <p className="text-sm text-secondary leading-relaxed">{review.comment}</p>
                    </div>
                  ) : (
                    <div className="pt-2">
                      <button 
                        onClick={() => setShowReviewForm(review)}
                        className="px-6 py-2 bg-active/10 text-active rounded-xl text-xs font-black hover:bg-active hover:text-white transition-all flex items-center gap-2"
                      >
                        <Plus size={14} />
                        WRITE REVIEW
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {/* Review Form Popup */}
        <AnimatePresence>
          {showReviewForm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm"
            >
              <motion.div
                initial={{ scale: 0.5, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.5, y: 50 }}
                className="bg-white text-[#0B1120] w-full max-w-md rounded-[40px] p-8 relative overflow-hidden"
              >
                <h2 className="text-2xl font-black mb-6 tracking-tighter uppercase text-center">Write a Review</h2>
                
                <div className="space-y-6">
                  <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <img src={showReviewForm.image} alt={showReviewForm.productName} className="w-12 h-12 rounded-xl object-cover" />
                    <p className="font-bold text-sm truncate">{showReviewForm.productName}</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-3 block text-center">Your Rating</label>
                    <div className="flex justify-center gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button key={s} onClick={() => setRating(s)}>
                          <Star size={32} className={s <= rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-200'} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Your Feedback</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="What did you like or dislike about this product?"
                      rows={4}
                      className="w-full bg-gray-100 border-none rounded-2xl p-4 text-sm outline-none focus:ring-2 ring-active/20 resize-none"
                    />
                  </div>

                  <div className="flex gap-2 p-4 bg-active/5 rounded-2xl border border-active/10">
                    <ImageIcon size={20} className="text-active" />
                    <p className="text-[10px] text-active font-bold uppercase">Add Photos (Coming Soon)</p>
                  </div>

                  <div className="pt-4">
                    <button 
                      onClick={handleSubmitReview}
                      className="w-full py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all shadow-xl shadow-black/10"
                    >
                      SUBMIT REVIEW
                    </button>
                    <button 
                      onClick={() => setShowReviewForm(null)}
                      className="w-full mt-2 py-3 text-gray-400 text-xs font-bold hover:text-gray-600 transition-all"
                    >
                      CANCEL
                    </button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
