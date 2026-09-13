import React from 'react';
import { motion } from 'motion/react';
import { RefreshCw, Home, HeartCrack } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface GameOverModalProps {
  isOpen: boolean;
  onRetry: () => void;
  onMenu: () => void;
}

export const GameOverModal: React.FC<GameOverModalProps> = ({ isOpen, onRetry, onMenu }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-lg">
      <motion.div
        initial={{ scale: 0.8, opacity: 0, y: 20 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        className="w-full max-w-md bg-slate-900 border-2 border-rose-600/60 text-white p-6 sm:p-8 rounded-3xl shadow-2xl text-center"
      >
        <div className="w-18 h-18 mx-auto mb-4 rounded-full bg-rose-500/15 border border-rose-500/30 flex items-center justify-center text-4xl text-rose-500 shadow-inner">
          <HeartCrack className="w-10 h-10 text-rose-500 animate-pulse" />
        </div>

        <h2 className="text-2xl font-bold text-rose-400 mb-2">پایان بازی (Game Over)</h2>
        <p className="text-slate-300 text-sm mb-6 leading-relaxed">
          اشکالی نداره! توی راه عشق همیشه سختی هست، مهم اینه که دوباره بلند شی و ادامه بدی... ❤️
        </p>

        <div className="space-y-3">
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onRetry();
            }}
            className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-base shadow-lg transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            <RefreshCw className="w-5 h-5" />
            <span>دوباره تلاش کن ❤️</span>
          </button>

          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onMenu();
            }}
            className="w-full py-3 px-6 rounded-2xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm border border-slate-700 transition-all flex items-center justify-center gap-2"
          >
            <Home className="w-4 h-4" />
            <span>بازگشت به منو</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
