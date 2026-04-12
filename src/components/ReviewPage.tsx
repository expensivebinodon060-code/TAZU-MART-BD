import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Star, Camera, Send, CheckCircle2, User, Calendar } from 'lucide-react';
import { Review } from '../types';
import { MOCK_REVIEWS } from '../mockData';

interface ReviewPageProps {
  onBack: () => void;
}

export default function ReviewPage({ onBack }: ReviewPageProps) {
  const [reviews, setReviews] = useState<Review[]>(MOCK_REVIEWS);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [comment, setComment] = useState('');
  const [image, setImage] = useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // Statistics
  const totalReviews = reviews.length;
  const avgRating = (reviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1);
  
  const starDistribution = [5, 4, 3, 2, 1].map(star => ({
    star,
    count: reviews.filter(r => r.rating === star).length
  }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (rating === 0 || !name || !comment) return;

    const newReview: Review = {
      id: `r${Date.now()}`,
      productId: 'p1', // Mock product ID
      customerName: name,
      rating,
      title,
      comment,
      image: image || undefined,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    setReviews([newReview, ...reviews]);
    setIsSubmitted(true);
    
    // Reset form
    setRating(0);
    setName('');
    setTitle('');
    setComment('');
    setImage(null);

    setTimeout(() => setIsSubmitted(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-30 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full transition-all">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-black uppercase tracking-tight">TAZU MART BD Reviews</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* LEFT SECTION: Statistics & Recent Reviews */}
          <div className="lg:col-span-7 space-y-8">
            <section className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Review Statistics</h2>
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="text-center md:border-r md:border-gray-100 md:pr-8">
                  <div className="text-6xl font-black text-active leading-none">{avgRating}</div>
                  <div className="flex justify-center gap-1 my-2">
                    {[1, 2, 3, 4, 5].map(s => (
                      <Star key={s} size={20} fill={s <= Math.round(Number(avgRating)) ? "#FF6A00" : "none"} className={s <= Math.round(Number(avgRating)) ? "text-active" : "text-gray-200"} />
                    ))}
                  </div>
                  <div className="text-sm text-gray-500 font-bold uppercase tracking-widest">{totalReviews} Reviews</div>
                </div>
                
                <div className="flex-1 w-full space-y-3">
                  {starDistribution.map(({ star, count }) => (
                    <div key={star} className="flex items-center gap-4">
                      <div className="flex items-center gap-1 w-12">
                        <span className="text-sm font-bold">{star}</span>
                        <Star size={14} fill="currentColor" className="text-gray-400" />
                      </div>
                      <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${(count / totalReviews) * 100}%` }}
                          className="h-full bg-active rounded-full"
                        />
                      </div>
                      <div className="w-12 text-right text-xs font-bold text-gray-400">{count}</div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            <section className="space-y-6">
              <h2 className="text-2xl font-black uppercase tracking-tight">Recent Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 space-y-4"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center text-gray-400">
                          <User size={24} />
                        </div>
                        <div>
                          <div className="font-black text-gray-900">{review.customerName}</div>
                          <div className="flex gap-0.5">
                            {[1, 2, 3, 4, 5].map(s => (
                              <Star key={s} size={12} fill={s <= review.rating ? "#FF6A00" : "none"} className={s <= review.rating ? "text-active" : "text-gray-200"} />
                            ))}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                        <Calendar size={14} />
                        {review.date}
                      </div>
                    </div>
                    
                    {review.title && <h4 className="font-black text-lg text-gray-900">{review.title}</h4>}
                    <p className="text-gray-600 leading-relaxed">{review.comment}</p>
                    
                    {review.image && (
                      <div className="w-32 h-32 rounded-2xl overflow-hidden border border-gray-100">
                        <img src={review.image} alt="Review" className="w-full h-full object-cover" />
                      </div>
                    )}

                    {review.status === 'Pending' && (
                      <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-50 text-amber-600 text-[10px] font-bold rounded-full uppercase tracking-widest">
                        Pending Approval
                      </div>
                    )}
                  </motion.div>
                ))}
              </div>
            </section>
          </div>

          {/* RIGHT SECTION: Review Submission Form */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100 sticky top-24">
              <h2 className="text-2xl font-black mb-6 uppercase tracking-tight">Write a Review</h2>
              
              {isSubmitted ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center justify-center py-12 text-center space-y-4"
                >
                  <div className="w-20 h-20 bg-green-50 text-green-500 rounded-full flex items-center justify-center">
                    <CheckCircle2 size={48} />
                  </div>
                  <h3 className="text-xl font-black uppercase">Review Submitted!</h3>
                  <p className="text-gray-500">Thank you for sharing your experience. Your review will be visible after moderation.</p>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Star Rating */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Rating</label>
                    <div className="flex gap-2">
                      {[1, 2, 3, 4, 5].map(s => (
                        <button
                          key={s}
                          type="button"
                          onMouseEnter={() => setHoverRating(s)}
                          onMouseLeave={() => setHoverRating(0)}
                          onClick={() => setRating(s)}
                          className="transition-transform active:scale-90"
                        >
                          <Star 
                            size={32} 
                            fill={s <= (hoverRating || rating) ? "#FF6A00" : "none"} 
                            className={s <= (hoverRating || rating) ? "text-active" : "text-gray-200"} 
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Image Upload */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Product Photo</label>
                    <div className="flex gap-4 items-center">
                      <button
                        type="button"
                        onClick={() => document.getElementById('review-image')?.click()}
                        className="w-20 h-20 border-2 border-dashed border-gray-200 rounded-2xl flex flex-col items-center justify-center text-gray-400 hover:border-active hover:text-active transition-all"
                      >
                        <Camera size={24} />
                        <span className="text-[10px] font-bold mt-1 uppercase">Add</span>
                      </button>
                      <input 
                        type="file" 
                        id="review-image" 
                        hidden 
                        accept="image/*" 
                        onChange={handleImageUpload}
                      />
                      {image && (
                        <div className="relative w-20 h-20 rounded-2xl overflow-hidden border border-gray-100">
                          <img src={image} alt="Preview" className="w-full h-full object-cover" />
                          <button 
                            type="button"
                            onClick={() => setImage(null)}
                            className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-1"
                          >
                            <ArrowLeft size={10} className="rotate-45" />
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Your Name</label>
                    <input 
                      type="text" 
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter your full name"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-active focus:ring-0 transition-all font-medium"
                    />
                  </div>

                  {/* Title */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Review Title (Optional)</label>
                    <input 
                      type="text" 
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Summarize your experience"
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-active focus:ring-0 transition-all font-medium"
                    />
                  </div>

                  {/* Description */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Review Description</label>
                    <textarea 
                      required
                      rows={4}
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      placeholder="Tell us what you liked or disliked about the product..."
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-2xl focus:border-active focus:ring-0 transition-all font-medium resize-none"
                    />
                  </div>

                  <button 
                    type="submit"
                    className="w-full bg-active text-white py-4 rounded-2xl font-black uppercase tracking-widest shadow-lg shadow-active/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center gap-2"
                  >
                    <Send size={20} />
                    Submit Review
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
