import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Heart, X } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface LetterModalProps {
  isOpen: boolean;
  letterText: string;
  onClose: () => void;
}

export const LetterModal: React.FC<LetterModalProps> = ({ isOpen, letterText, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md">
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 20 }}
          className="relative w-full max-w-md bg-gradient-to-b from-amber-50 to-rose-100 text-slate-800 p-6 sm:p-8 rounded-3xl border-4 border-rose-400 shadow-2xl text-center"
        >
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="absolute top-4 left-4 p-1.5 rounded-full bg-rose-200 hover:bg-rose-300 text-rose-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-rose-500/15 flex items-center justify-center text-3xl shadow-inner">
            💌
          </div>

          <h3 className="text-xl font-bold text-rose-800 mb-2 flex items-center justify-center gap-1.5">
            <span>نامه عاشقانه</span>
            <Heart className="w-5 h-5 fill-rose-500 text-rose-500 animate-pulse" />
          </h3>

          <div className="my-6 p-4 bg-white/80 rounded-2xl border border-rose-200 font-medium text-slate-700 leading-relaxed shadow-sm text-base sm:text-lg">
            {letterText}
          </div>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-base shadow-lg transition-all active:scale-95"
          >
            ادامه بازی ❤️
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
