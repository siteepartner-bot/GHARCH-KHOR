import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, Sparkles, X, Check, FastForward } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface LevelStoryIntroProps {
  isOpen: boolean;
  levelId: number;
  title: string;
  subtitle: string;
  storyText: string;
  date?: string;
  onStart: () => void;
}

export const LevelStoryIntro: React.FC<LevelStoryIntroProps> = ({
  isOpen,
  levelId,
  title,
  subtitle,
  storyText,
  date = '۱۷ اردیبهشت ۱۴۰۵',
  onStart,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [isTypingComplete, setIsTypingComplete] = useState(false);
  const typingTimerRef = useRef<number | null>(null);

  useEffect(() => {
    if (!isOpen) {
      setDisplayedText('');
      setIsTypingComplete(false);
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      return;
    }

    soundEngine.playStoryPopup();
    setDisplayedText('');
    setIsTypingComplete(false);

    let charIndex = 0;
    const fullText = storyText;

    typingTimerRef.current = window.setInterval(() => {
      if (charIndex < fullText.length) {
        setDisplayedText(fullText.slice(0, charIndex + 1));
        if (charIndex % 3 === 0) {
          soundEngine.playTypewriter();
        }
        charIndex++;
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
  }, [isOpen, storyText]);

  const handleFinishTypingOrDismiss = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!isTypingComplete) {
      if (typingTimerRef.current) {
        clearInterval(typingTimerRef.current);
        typingTimerRef.current = null;
      }
      setDisplayedText(storyText);
      setIsTypingComplete(true);
    } else {
      soundEngine.playButtonClick();
      onStart();
    }
  };

  const handleClose = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playButtonClick();
    onStart();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {/* Non-blocking bottom banner - sits neatly above mobile touch buttons and at bottom center on desktop */}
      <div className="fixed bottom-20 sm:bottom-4 inset-x-3 sm:left-1/2 sm:-translate-x-1/2 sm:w-[90%] sm:max-w-lg z-25 pointer-events-none flex justify-center">
        <motion.div
          initial={{ y: 40, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 40, opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 26, stiffness: 320 }}
          onClick={handleFinishTypingOrDismiss}
          className="w-full bg-slate-900/95 via-rose-950/95 to-slate-900/95 border-2 border-rose-500/60 text-white rounded-2xl p-3 sm:p-4 shadow-2xl backdrop-blur-xl relative overflow-hidden select-none cursor-pointer pointer-events-auto"
        >
          {/* Subtle Ambient Glow */}
          <div className="absolute top-0 right-1/4 w-24 h-24 bg-rose-500/20 rounded-full blur-xl pointer-events-none" />
          <div className="absolute bottom-0 left-1/4 w-24 h-24 bg-pink-500/20 rounded-full blur-xl pointer-events-none" />

          {/* Top Bar: Chapter Tag, Title, and Close/Skip Button */}
          <div className="flex items-center justify-between gap-2 border-b border-rose-800/40 pb-2 mb-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-rose-300 bg-rose-950/90 px-2 py-0.5 rounded-full border border-rose-500/40">
                مرحله {levelId}
              </span>
              <h3 className="text-xs sm:text-sm font-extrabold text-white line-clamp-1">
                {title}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-[10px] font-bold text-amber-300/90 hidden sm:inline">
                {date}
              </span>
              <button
                type="button"
                onClick={handleClose}
                aria-label="بستن داستان"
                className="w-7 h-7 rounded-lg bg-rose-900/60 hover:bg-rose-700/80 text-rose-200 hover:text-white flex items-center justify-center border border-rose-600/40 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Subtitle / Context */}
          {subtitle && (
            <div className="text-[11px] sm:text-xs font-medium text-rose-300/90 mb-1.5 text-right flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-400 shrink-0" />
              <span className="line-clamp-1">{subtitle}</span>
            </div>
          )}

          {/* Typewriter Text Narrative Box */}
          <div className="min-h-[48px] sm:min-h-[56px] p-2.5 sm:p-3 rounded-xl bg-slate-950/80 border border-rose-500/30 text-rose-100 text-xs sm:text-sm font-medium leading-relaxed text-right relative">
            <p className="whitespace-pre-line inline">
              {displayedText}
            </p>
            {!isTypingComplete && (
              <span className="inline-block w-1.5 h-3.5 bg-rose-400 mr-1 animate-pulse align-middle" />
            )}
          </div>

          {/* Footer controls: quick start button */}
          <div className="mt-2.5 flex items-center justify-between gap-2 pt-1 border-t border-rose-900/30">
            <span className="text-[10px] text-slate-400 flex items-center gap-1">
              <Heart className="w-3 h-3 text-rose-400 fill-rose-400 shrink-0" />
              <span className="hidden sm:inline">برای رد کردن کلیک کنید</span>
              <span className="sm:hidden">کلیک برای رد کردن</span>
            </span>

            <button
              type="button"
              onClick={handleFinishTypingOrDismiss}
              className="py-1.5 px-3 sm:px-4 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1"
            >
              {isTypingComplete ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>شروع بازی ❤️</span>
                </>
              ) : (
                <>
                  <FastForward className="w-3.5 h-3.5" />
                  <span>تکمیل متن</span>
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

