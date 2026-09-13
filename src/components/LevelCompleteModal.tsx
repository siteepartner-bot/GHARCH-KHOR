import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Heart, Star, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface LevelCompleteModalProps {
  isOpen: boolean;
  levelId: number;
  storyText: string;
  subtext?: string;
  score: number;
  letters: number;
  hasNextLevel: boolean;
  onNextLevel: () => void;
  onReplay: () => void;
  onMenu: () => void;
}

export const LevelCompleteModal: React.FC<LevelCompleteModalProps> = ({
  isOpen,
  levelId,
  storyText,
  subtext,
  score,
  letters,
  hasNextLevel,
  onNextLevel,
  onReplay,
  onMenu,
}) => {
  const [displayedStory, setDisplayedStory] = useState('');
  const [displayedSubtext, setDisplayedSubtext] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedStory('');
      setDisplayedSubtext('');
      setIsTypingComplete(false);
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      return;
    }

    setDisplayedStory('');
    setDisplayedSubtext('');
    setIsTypingComplete(false);

    let charIdx = 0;
    const fullStory = storyText;
    const fullSub = subtext || '';

    typingTimerRef.current = window.setInterval(() => {
      if (charIdx < fullStory.length) {
        setDisplayedStory(fullStory.slice(0, charIdx + 1));
        if (charIdx % 3 === 0) {
          soundEngine.playTypewriter();
        }
        charIdx++;
      } else if (charIdx < fullStory.length + fullSub.length) {
        const subIdx = charIdx - fullStory.length;
        setDisplayedSubtext(fullSub.slice(0, subIdx + 1));
        if (subIdx % 3 === 0) {
          soundEngine.playTypewriter();
        }
        charIdx++;
      } else {
        setIsTypingComplete(true);
        if (typingTimerRef.current) {
          clearInterval(typingTimerRef.current);
          typingTimerRef.current = null;
        }
      }
    }, 22);

    return () => {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
    };
  }, [isOpen, storyText, subtext]);

  const handleSkipTyping = () => {
    if (!isTypingComplete) {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      setDisplayedStory(storyText);
      setDisplayedSubtext(subtext || '');
      setIsTypingComplete(true);
    }
  };

  if (!isOpen) return null;

  const isFinalLevel = !hasNextLevel || levelId >= 10;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
      <motion.div
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        onClick={handleSkipTyping}
        className="w-full max-w-lg bg-gradient-to-b from-slate-900 via-rose-950 to-slate-900 border-2 border-rose-500/50 text-white p-6 sm:p-8 rounded-3xl shadow-2xl text-center relative overflow-hidden cursor-pointer select-none"
      >
        {/* Decorative Floating Hearts */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-rose-500/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-pink-500/20 rounded-full blur-2xl pointer-events-none" />

        {/* Character Hug Illustration / Emoji */}
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-gradient-to-tr from-rose-500 via-pink-400 to-amber-300 p-1 shadow-lg flex items-center justify-center text-4xl animate-bounce">
          👩‍❤️‍👨
        </div>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-900/60 border border-rose-500/30 text-rose-200 text-xs font-bold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-amber-300" />
          <span>پایان شیرین و ختم به‌خیر شدن این فصل ❤️</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-rose-300 via-pink-200 to-amber-200 mb-2">
          {isFinalLevel ? 'رسیدن به حسن و وصال ابدی در دنیای واقعی! 👑' : `رسیدن به حسن در مرحله ${levelId}`}
        </h2>

        {/* Story Quotes Box with Typewriter Animation */}
        <div className="my-4 p-4 sm:p-5 bg-rose-950/70 border border-rose-500/30 rounded-2xl shadow-inner text-rose-100 font-semibold leading-relaxed space-y-2 text-sm sm:text-base text-right">
          <p className="text-pink-200 whitespace-pre-line leading-relaxed">
            {displayedStory}
            {!isTypingComplete && (
              <span className="inline-block w-2 h-4 bg-rose-400 mr-1 animate-pulse align-middle" />
            )}
          </p>
          {displayedSubtext && (
            <p className="text-xs sm:text-sm text-amber-200/90 font-medium mt-2 border-t border-rose-800/60 pt-2 leading-relaxed">
              {displayedSubtext}
            </p>
          )}
        </div>

        {/* Level Stats Summary */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <div className="bg-slate-850/90 border border-rose-500/20 p-2.5 rounded-xl flex items-center justify-center gap-2">
            <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-300">امتیاز مرحله:</span>
            <span className="font-bold text-amber-300 text-sm">{score}</span>
          </div>
          <div className="bg-slate-850/90 border border-rose-500/20 p-2.5 rounded-xl flex items-center justify-center gap-2">
            <Heart className="w-4 h-4 text-rose-400 fill-rose-400" />
            <span className="text-xs text-slate-300">نامه‌های عشق:</span>
            <span className="font-bold text-pink-300 text-sm">{letters}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          {hasNextLevel && !isFinalLevel ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playButtonClick();
                onNextLevel();
              }}
              className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
            >
              <span>رفتن به مرحله بعدی ({levelId + 1})</span>
              <ArrowRight className="w-5 h-5 rotate-180" />
            </button>
          ) : (
            <div className="p-3.5 bg-gradient-to-r from-rose-900/90 to-pink-900/90 rounded-2xl border border-pink-400/40 text-pink-200 text-xs sm:text-sm font-bold mb-2 leading-relaxed">
              🎉 تبریک! شما تمامی ۱۰ مرحله شگفت‌انگیز داستان عشق حسن و نیوشا را با پیروزی و ختم به‌خیر کامل فتح کردید! ❤️👑
            </div>
          )}

          <div className="flex gap-3">
            <button
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playButtonClick();
                onReplay();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              <span>تکرار مرحله</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                soundEngine.playButtonClick();
                onMenu();
              }}
              className="flex-1 py-3 px-4 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs sm:text-sm border border-slate-700 transition-all text-xs sm:text-sm"
            >
              منوی اصلی
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
