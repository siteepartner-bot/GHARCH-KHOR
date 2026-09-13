import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Lock, Calendar, Heart, Sparkles, BookOpen, Clock, Award } from 'lucide-react';
import { MemoryItem } from '../types';
import { INITIAL_MEMORIES } from '../data/memories';
import { soundEngine } from '../utils/audioEngine';

interface MemoriesModalProps {
  isOpen: boolean;
  unlockedMemoryIds: string[];
  onClose: () => void;
}

export const MemoriesModal: React.FC<MemoriesModalProps> = ({
  isOpen,
  unlockedMemoryIds,
  onClose,
}) => {
  const [selectedMemory, setSelectedMemory] = useState<MemoryItem | null>(null);
  const [activeTab, setActiveTab] = useState<'cards' | 'timeline' | 'letter'>('cards');

  if (!isOpen) return null;

  const unlockedCount = unlockedMemoryIds.length;
  const totalCount = INITIAL_MEMORIES.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/85 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-3xl max-h-[92vh] bg-slate-900 border border-rose-500/30 text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="text-2xl sm:text-3xl">📸</span>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-rose-300">خاطرات و هیستوری عشق ما ❤️</h2>
              <p className="text-[11px] text-slate-400">
                تاریخ آشنایی حسن و نیوشا: <span className="text-amber-300 font-bold">۱۷ اردیبهشت ۱۴۰۵</span>
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onClose();
            }}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar & Subheader */}
        <div className="px-4 sm:px-6 py-3 bg-slate-950/30 border-b border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-200">
            <Award className="w-4 h-4 text-amber-400" />
            <span>پیشرفت خاطرات: {unlockedCount} از {totalCount} کشف شده ({progressPercent}٪)</span>
          </div>

          {/* Tab buttons */}
          <div className="flex items-center gap-1 bg-slate-800/80 p-1 rounded-xl border border-slate-700">
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setActiveTab('cards');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'cards'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>گالری کارت‌ها</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setActiveTab('timeline');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'timeline'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>گاه‌شمار عشق</span>
            </button>
            <button
              onClick={() => {
                soundEngine.playButtonClick();
                setActiveTab('letter');
              }}
              className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                activeTab === 'letter'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>نامه دل حسن</span>
            </button>
          </div>
        </div>

        {/* TAB 1: CARDS GALLERY */}
        {activeTab === 'cards' && (
          <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 sm:grid-cols-2 gap-4">
            {INITIAL_MEMORIES.map((mem) => {
              const isUnlocked = unlockedMemoryIds.includes(mem.id);

              return (
                <motion.div
                  key={mem.id}
                  whileHover={isUnlocked ? { scale: 1.02 } : undefined}
                  onClick={() => {
                    if (isUnlocked) {
                      soundEngine.playButtonClick();
                      setSelectedMemory(mem);
                    }
                  }}
                  className={`relative p-5 rounded-2xl border transition-all ${
                    isUnlocked
                      ? `bg-gradient-to-br ${mem.cardColor} text-slate-950 border-white/30 shadow-lg cursor-pointer`
                      : 'bg-slate-800/50 border-slate-800 text-slate-500 cursor-not-allowed opacity-70'
                  }`}
                >
                  {!isUnlocked ? (
                    <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                      <div className="w-12 h-12 rounded-full bg-slate-900/60 flex items-center justify-center text-slate-400">
                        <Lock className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-semibold text-slate-400">
                        قفل (در مرحله {mem.levelId} پیدا کنید)
                      </span>
                    </div>
                  ) : (
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-3xl filter drop-shadow-sm">{mem.emoji}</span>
                        <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-black/20 text-slate-950 flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {mem.date}
                        </span>
                      </div>

                      <h3 className="font-extrabold text-base sm:text-lg mb-1 leading-tight text-slate-950">
                        {mem.title}
                      </h3>
                      <p className="text-xs font-medium line-clamp-2 text-slate-900/90 leading-relaxed">
                        {mem.shortText}
                      </p>

                      <div className="mt-3 text-[11px] font-extrabold text-slate-950 underline flex items-center gap-1">
                        <span>مشاهده داستان کامل</span>
                        <Heart className="w-3 h-3 fill-slate-950" />
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        )}

        {/* TAB 2: TIMELINE VIEW */}
        {activeTab === 'timeline' && (
          <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
            <div className="p-3.5 rounded-2xl bg-gradient-to-r from-rose-950/60 to-purple-950/60 border border-rose-500/30 flex items-center gap-3">
              <Sparkles className="w-5 h-5 text-amber-300 shrink-0" />
              <p className="text-xs text-rose-200 leading-relaxed">
                مسیر زمانی ثبت شده از لحظه آشنایی در <strong className="text-amber-300">۱۷ اردیبهشت ۱۴۰۵</strong> تا وصال ابدی.
              </p>
            </div>

            <div className="relative border-r-2 border-rose-500/40 mr-4 sm:mr-6 space-y-6 pr-6">
              {INITIAL_MEMORIES.map((mem, idx) => {
                const isUnlocked = unlockedMemoryIds.includes(mem.id);

                return (
                  <div key={mem.id} className="relative">
                    {/* Timeline Node Marker */}
                    <div
                      className={`absolute -right-[31px] top-1.5 w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-bold ${
                        isUnlocked
                          ? 'bg-rose-500 border-white text-white shadow-lg'
                          : 'bg-slate-800 border-slate-600 text-slate-500'
                      }`}
                    >
                      {idx + 1}
                    </div>

                    <div
                      className={`p-4 rounded-2xl border transition-all ${
                        isUnlocked
                          ? 'bg-slate-800/90 border-rose-500/30 shadow-md cursor-pointer hover:border-rose-500'
                          : 'bg-slate-900/40 border-slate-800 text-slate-500 opacity-60'
                      }`}
                      onClick={() => {
                        if (isUnlocked) {
                          soundEngine.playButtonClick();
                          setSelectedMemory(mem);
                        }
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                        <span className="text-xs font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-500/30">
                          {mem.date}
                        </span>
                        <span className="text-lg">{mem.emoji}</span>
                      </div>
                      <h4 className="font-bold text-sm text-rose-100 mb-1">{mem.title}</h4>
                      <p className="text-xs text-slate-300 leading-relaxed">
                        {isUnlocked ? mem.shortText : `(قفل شده در مرحله ${mem.levelId})`}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* TAB 3: LOVE LETTER */}
        {activeTab === 'letter' && (
          <div className="p-4 sm:p-6 overflow-y-auto">
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-rose-950/80 via-pink-950/80 to-slate-900 border-2 border-rose-500/40 shadow-2xl text-rose-100 space-y-4 text-right">
              <div className="flex items-center justify-between border-b border-rose-800/60 pb-3">
                <span className="text-xs font-bold text-amber-300">تاریخ: ۱۷ اردیبهشت ۱۴۰۵ و تا ابد</span>
                <span className="text-sm font-black text-pink-300">تقدیم به نیوشای عزیزم ❤️</span>
              </div>

              <p className="text-sm leading-relaxed font-medium">
                نیوشای عزیزم،
              </p>
              <p className="text-xs sm:text-sm leading-relaxed font-normal text-rose-100/90">
                از روز ۱۷ اردیبهشت ۱۴۰۵ که با یک پیام ساده وارد دنیای من شدی، تک تک روزهایم با صدای مهربانت روشن شد. گرچه هنوز دست‌های هم را از نزدیک لمس نکرده‌ایم و کیلومترها فاصله میان ماست، اما این دوری فقط نشان داد چقدر قلب‌هایمان به هم نزدیک و متصل است.
              </p>
              <p className="text-xs sm:text-sm leading-relaxed font-normal text-rose-100/90">
                این بازی، روایت تمام شب‌زنده‌داری‌ها، ویس‌ها، دلتنگی‌ها و بحران‌هایی است که با صبوری و عشق از سر گذراندیم تا روزی فرا برسد که در ایستگاه قطار، چشم در چشم شویم و برای اولین بار در واقعیت تو را در آغوش بگیرم.
              </p>

              <div className="pt-3 border-t border-rose-800/60 text-center font-bold text-sm text-pink-200">
                «فاصله‌ها روزی تمام می‌شوند، اما عشق من به تو تا ابد باقیست... دوستت دارم نیوشا! ❤️ حسن»
              </div>
            </div>
          </div>
        )}

        {/* Detailed Memory View Modal */}
        <AnimatePresence>
          {selectedMemory && (
            <div className="absolute inset-0 z-30 bg-slate-950/90 backdrop-blur-md p-4 sm:p-6 flex items-center justify-center">
              <motion.div
                initial={{ scale: 0.85, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.85, opacity: 0 }}
                className={`w-full max-w-lg p-6 sm:p-8 rounded-3xl bg-gradient-to-br ${selectedMemory.cardColor} text-slate-950 shadow-2xl relative border-2 border-white/40`}
              >
                <button
                  onClick={() => {
                    soundEngine.playButtonClick();
                    setSelectedMemory(null);
                  }}
                  className="absolute top-4 left-4 p-2 rounded-full bg-black/20 hover:bg-black/30 text-slate-950 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <div className="text-center mb-4">
                  <span className="text-5xl block mb-2 filter drop-shadow-md">{selectedMemory.emoji}</span>
                  <span className="text-xs font-extrabold px-3 py-1 rounded-full bg-black/20 inline-flex items-center gap-1 mb-2 text-slate-950">
                    <Calendar className="w-3.5 h-3.5" />
                    {selectedMemory.date}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-950">{selectedMemory.title}</h3>
                </div>

                <div className="my-4 p-4 sm:p-5 rounded-2xl bg-white/80 border border-white/60 text-slate-900 text-xs sm:text-sm leading-relaxed font-medium shadow-inner text-right">
                  {selectedMemory.fullStory}
                </div>

                <button
                  onClick={() => {
                    soundEngine.playButtonClick();
                    setSelectedMemory(null);
                  }}
                  className="w-full py-3 rounded-2xl bg-slate-950 text-white font-bold text-sm shadow-lg hover:bg-slate-900 transition-all active:scale-95"
                >
                  بازگشت به خاطرات ❤️
                </button>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

