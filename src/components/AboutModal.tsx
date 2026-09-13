import React from 'react';
import { motion } from 'motion/react';
import { X, Heart, Sparkles } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface AboutModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AboutModal: React.FC<AboutModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-lg bg-slate-900 border border-rose-500/30 text-white p-6 sm:p-8 rounded-3xl shadow-2xl space-y-5 text-center"
      >
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="absolute top-4 left-4 p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="w-18 h-18 mx-auto rounded-full bg-gradient-to-tr from-rose-500 to-pink-500 p-1 shadow-lg flex items-center justify-center text-3xl">
          💖
        </div>

        <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-rose-300 to-pink-200">
          داستان حسن و نیوشا
        </h2>

        {/* Milestone Date Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-gradient-to-r from-rose-500/20 via-pink-500/20 to-amber-500/20 border border-rose-400/40 text-rose-200 text-xs sm:text-sm font-bold shadow-md">
          <span>🗓️ تاریخ آشنایی:</span>
          <span className="text-amber-300 font-extrabold text-sm sm:text-base">۱۷ اردیبهشت ۱۴۰۵</span>
          <span>❤️</span>
        </div>

        <div className="p-4 bg-rose-950/40 border border-rose-500/20 rounded-2xl text-rose-100 text-xs sm:text-sm font-medium leading-relaxed space-y-3 text-right">
          <p>
            این بازی، روایتی جذاب و واقعی از دلدادگی پاک دو قلب مهربان، <strong className="text-rose-300">«نیوشا و حسن»</strong> است.
          </p>
          <p>
            شما در نقش <strong className="text-pink-300">«نیوشا»</strong> بازی می‌کنید؛ دختری مهربان و باوفا که قصه عشقش در روز طلایی <strong className="text-amber-300">۱۷ اردیبهشت ۱۴۰۵</strong> با اولین پیام مجازی و شب‌زنده‌داری‌های شیرین پشت خط با حسن آغاز شد.
          </p>
          <p>
            ما هنوز همدیگر را از نزدیک ندیده‌ایم؛ در طول این مسیر، ماجراها و بحران‌های پیش‌بینی‌نشده، سوءتفاهم‌های چتی و روزهای دلتنگی اتفاق می‌افتند، اما نیوشا با عشق، شجاعت و جمع‌آوری خاطرات و نامه‌ها، کیلومترها فاصله را پشت سر می‌گذارد تا به <strong className="text-pink-300">لحظه باشکوه اولین دیدار با حسن در دنیای واقعی</strong> برسد.
          </p>
          <p className="text-center font-bold text-pink-300 text-sm border-t border-rose-900/60 pt-2">
            «فاصله‌ها فقط آزمونی هستند تا جهان بداند عشق نیوشا و حسن چقدر نیرومند است! ❤️👑»
          </p>
        </div>

        <div className="flex items-center justify-center gap-1.5 text-xs text-slate-400">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>طراحی اختصاصی برای حسن و نیوشا</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
        </div>

        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-sm shadow-md transition-all active:scale-95"
        >
          بازگشت ❤️
        </button>
      </motion.div>
    </div>
  );
};
