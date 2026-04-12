import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Gamepad2, 
  RotateCw, 
  Ticket, 
  HelpCircle, 
  Trophy, 
  Gift, 
  ChevronLeft,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

interface Prize {
  id: string;
  name: string;
  type: string;
  value: number;
}

interface Quiz {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  rewardPoints: number;
}

export default function TazuGamesCenter({ onBack, user, onUpdateUser }: { onBack: () => void, user: any, onUpdateUser: (user: any) => void }) {
  const [activeTab, setActiveTab] = useState<'spin' | 'scratch' | 'quiz' | 'lucky'>('spin');
  const [isSpinning, setIsSpinning] = useState(false);
  const [spinResult, setSpinResult] = useState<Prize | null>(null);
  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [quizResult, setQuizResult] = useState<'correct' | 'wrong' | null>(null);
  const [scratchRevealed, setScratchRevealed] = useState(false);

  useEffect(() => {
    if (activeTab === 'quiz') {
      fetch('/api/games/quiz/daily')
        .then(res => res.json())
        .then(setQuiz);
    }
  }, [activeTab]);

  const handleSpin = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSpinResult(null);

    // Simulate animation delay
    setTimeout(async () => {
      try {
        const res = await fetch('/api/games/spin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user?.id })
        });
        const data = await res.json();
        setSpinResult(data.prize);
        setIsSpinning(false);
      } catch (err) {
        console.error(err);
        setIsSpinning(false);
      }
    }, 2000);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null || !quiz) return;
    if (selectedOption === quiz.correctIndex) {
      setQuizResult('correct');
      // In real app, update points on server
    } else {
      setQuizResult('wrong');
    }
  };

  return (
    <div className="min-h-screen bg-bg p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8">
          <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-colors">
            <ChevronLeft size={24} />
          </button>
          <div>
            <h1 className="text-2xl font-black tracking-tight text-active flex items-center gap-2">
              <Gamepad2 className="text-active" />
              Tazu Games Center
            </h1>
            <p className="text-secondary text-sm">Play games, win rewards & have fun!</p>
          </div>
        </header>

        {/* Tabs */}
        <div className="flex bg-white/5 p-1 rounded-2xl mb-8 overflow-x-auto no-scrollbar">
          {[
            { id: 'spin', label: 'Spin & Win', icon: RotateCw },
            { id: 'scratch', label: 'Scratch Card', icon: Ticket },
            { id: 'quiz', label: 'Daily Quiz', icon: HelpCircle },
            { id: 'lucky', label: 'Lucky Draw', icon: Trophy },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all whitespace-nowrap ${
                activeTab === tab.id 
                  ? 'bg-active text-white shadow-lg shadow-active/20' 
                  : 'text-secondary hover:text-primary'
              }`}
            >
              <tab.icon size={18} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="bg-white/5 border border-white/10 rounded-3xl p-8 min-h-[400px] flex flex-col items-center justify-center relative overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'spin' && (
              <motion.div
                key="spin"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="text-center"
              >
                <div className="relative mb-8">
                  <motion.div
                    animate={isSpinning ? { rotate: 360 * 5 } : { rotate: 0 }}
                    transition={isSpinning ? { duration: 2, ease: "easeInOut" } : { duration: 0 }}
                    className="w-48 h-48 md:w-64 md:h-64 rounded-full border-8 border-active/20 flex items-center justify-center relative bg-gradient-to-br from-active/10 to-transparent"
                  >
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-2 h-2 bg-active rounded-full shadow-[0_0_15px_rgba(255,106,0,0.5)]" />
                    </div>
                    {/* Wheel segments placeholder */}
                    <div className="absolute inset-0 border-4 border-dashed border-active/30 rounded-full" />
                  </motion.div>
                  <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-4 h-8 bg-active rounded-b-full shadow-lg z-10" />
                </div>

                <button
                  onClick={handleSpin}
                  disabled={isSpinning}
                  className={`px-12 py-4 rounded-2xl font-black text-lg transition-all ${
                    isSpinning 
                      ? 'bg-gray-500 cursor-not-allowed' 
                      : 'bg-active text-white hover:scale-105 active:scale-95 shadow-xl shadow-active/30'
                  }`}
                >
                  {isSpinning ? 'SPINNING...' : 'SPIN NOW'}
                </button>
                <p className="mt-4 text-secondary text-xs uppercase tracking-widest font-bold">1 Spin Available Today</p>
              </motion.div>
            )}

            {activeTab === 'scratch' && (
              <motion.div
                key="scratch"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="w-full max-w-md text-center"
              >
                <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-8 rounded-3xl shadow-2xl relative overflow-hidden group">
                  <div className="relative z-10">
                    <Ticket size={48} className="mx-auto mb-4 text-white/80" />
                    <h3 className="text-xl font-black text-white mb-2">Daily Scratch Card</h3>
                    <p className="text-indigo-100 text-sm mb-6">Scratch to reveal your hidden reward!</p>
                    
                    <div 
                      className="h-40 bg-white/20 backdrop-blur-md border-2 border-dashed border-white/30 rounded-2xl flex items-center justify-center cursor-pointer relative overflow-hidden"
                      onClick={() => setScratchRevealed(true)}
                    >
                      {!scratchRevealed ? (
                        <div className="flex flex-col items-center gap-2">
                          <Sparkles className="text-white animate-pulse" />
                          <span className="text-white font-bold uppercase tracking-tighter">Scratch Here</span>
                        </div>
                      ) : (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="flex flex-col items-center"
                        >
                          <Gift size={40} className="text-yellow-400 mb-2" />
                          <span className="text-2xl font-black text-white">100 Reward Points</span>
                          <span className="text-xs text-white/70 uppercase mt-1">Added to your wallet</span>
                        </motion.div>
                      )}
                    </div>
                  </div>
                  <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/10 rounded-full blur-3xl group-hover:scale-150 transition-transform" />
                </div>
                <p className="mt-6 text-secondary text-xs uppercase tracking-widest font-bold">Available after your next purchase</p>
              </motion.div>
            )}

            {activeTab === 'quiz' && quiz && (
              <motion.div
                key="quiz"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="w-full max-w-lg"
              >
                <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
                  <div className="flex items-center justify-between mb-6">
                    <span className="px-3 py-1 bg-active/10 text-active text-[10px] font-black uppercase tracking-widest rounded-full">Daily Quiz</span>
                    <span className="text-secondary text-xs font-bold">{quiz.rewardPoints} Points Reward</span>
                  </div>
                  <h3 className="text-xl font-bold mb-8 leading-tight">{quiz.question}</h3>
                  
                  <div className="space-y-3 mb-8">
                    {quiz.options.map((option, idx) => (
                      <button
                        key={idx}
                        disabled={quizResult !== null}
                        onClick={() => setSelectedOption(idx)}
                        className={`w-full p-4 rounded-2xl text-left font-medium transition-all flex items-center justify-between group ${
                          selectedOption === idx 
                            ? 'bg-active text-white shadow-lg shadow-active/20' 
                            : 'bg-white/5 hover:bg-white/10 text-secondary hover:text-primary'
                        } ${
                          quizResult === 'correct' && idx === quiz.correctIndex ? 'bg-green-500 text-white' : ''
                        } ${
                          quizResult === 'wrong' && selectedOption === idx ? 'bg-red-500 text-white' : ''
                        }`}
                      >
                        <span>{option}</span>
                        {selectedOption === idx && <CheckCircle2 size={18} />}
                      </button>
                    ))}
                  </div>

                  {quizResult === null ? (
                    <button
                      onClick={handleQuizSubmit}
                      disabled={selectedOption === null}
                      className={`w-full py-4 rounded-2xl font-black transition-all ${
                        selectedOption === null 
                          ? 'bg-gray-500 cursor-not-allowed' 
                          : 'bg-active text-white hover:shadow-xl hover:shadow-active/30'
                      }`}
                    >
                      SUBMIT ANSWER
                    </button>
                  ) : (
                    <div className={`p-4 rounded-2xl flex items-center gap-3 ${quizResult === 'correct' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                      {quizResult === 'correct' ? <CheckCircle2 /> : <AlertCircle />}
                      <span className="font-bold">
                        {quizResult === 'correct' ? `Correct! You won ${quiz.rewardPoints} points.` : 'Oops! Better luck tomorrow.'}
                      </span>
                    </div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'lucky' && (
              <motion.div
                key="lucky"
                initial={{ opacity: 0, scale: 1.1 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.1 }}
                className="text-center"
              >
                <div className="w-24 h-24 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Trophy size={48} className="text-yellow-400" />
                </div>
                <h2 className="text-3xl font-black text-white mb-2 uppercase tracking-tighter">Monthly Lucky Draw</h2>
                <p className="text-secondary max-w-sm mx-auto mb-8">Participate in our monthly draw to win mega prizes like Smartphones, Smartwatches & more!</p>
                
                <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-8 inline-block">
                  <div className="text-xs text-secondary uppercase font-bold mb-1">Next Draw In</div>
                  <div className="text-2xl font-black text-active tracking-widest">24 : 12 : 45 : 08</div>
                  <div className="text-[10px] text-secondary/50 uppercase flex justify-between mt-1">
                    <span>Days</span>
                    <span>Hrs</span>
                    <span>Min</span>
                    <span>Sec</span>
                  </div>
                </div>

                <div className="block">
                  <button className="px-12 py-4 bg-active text-white rounded-2xl font-black text-lg hover:scale-105 transition-all shadow-xl shadow-active/30">
                    JOIN NOW
                  </button>
                </div>
                <p className="mt-4 text-secondary text-[10px] uppercase font-bold">Entry Fee: 100 TAZU Coins</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Win Popup */}
        <AnimatePresence>
          {spinResult && (
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
                className="bg-white text-[#0B1120] w-full max-w-sm rounded-[40px] p-8 text-center relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 right-0 h-2 bg-active" />
                <div className="w-20 h-20 bg-active/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Sparkles size={40} className="text-active" />
                </div>
                <h2 className="text-3xl font-black mb-2 tracking-tighter">🎉 Congratulations!</h2>
                <p className="text-gray-500 mb-6 font-medium">You won <span className="text-active font-black">{spinResult.name}</span></p>
                
                <div className="bg-gray-100 p-4 rounded-2xl mb-8">
                  <p className="text-xs text-gray-400 uppercase font-bold mb-1">Coupon Code</p>
                  <p className="text-xl font-black tracking-widest">TAZUWIN2026</p>
                </div>

                <button 
                  onClick={() => setSpinResult(null)}
                  className="w-full py-4 bg-[#0B1120] text-white rounded-2xl font-black hover:bg-gray-800 transition-all"
                >
                  CLAIM REWARD
                </button>
                <p className="mt-4 text-[10px] text-gray-400 font-bold uppercase">Use it before 7 days.</p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
