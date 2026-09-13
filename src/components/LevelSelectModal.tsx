import React from 'react';
import { motion } from 'motion/react';
import { X, Lock, Play, Star } from 'lucide-react';
import { LEVELS } from '../data/levels';
import { soundEngine } from '../utils/audioEngine';

interface LevelSelectModalProps {
  isOpen: boolean;
  unlockedLevels: number[];
  completedLevels: number[];
  onSelectLevel: (levelId: number) => void;
  onClose: () => void;
}

export const LevelSelectModal: React.FC<LevelSelectModalProps> = ({
  isOpen,
  unlockedLevels,
  completedLevels,
  onSelectLevel,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-3xl max-h-[90vh] bg-slate-900 border border-rose-500/30 text-white rounded-3xl shadow-2xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
          <div className="flex items-center gap-3">
            <span className="text-2xl">🗺️</span>
            <div>
              <h2 className="text-xl font-bold text-rose-300">انتخاب مراحل داستان ❤️</h2>
              <p className="text-xs text-slate-400 mt-0.5">
                مراحل باز شده: {unlockedLevels.length} از {LEVELS.length} مرحله
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

        {/* Levels Grid */}
        <div className="p-6 overflow-y-auto space-y-4">
          {LEVELS.map((level) => {
            const isUnlocked = unlockedLevels.includes(level.id);
            const isCompleted = completedLevels.includes(level.id);

            return (
              <div
                key={level.id}
                className={`p-5 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 ${
                  isUnlocked
                    ? 'bg-slate-800/80 border-rose-500/30 hover:border-rose-500/60 shadow-md'
                    : 'bg-slate-900/50 border-slate-800 text-slate-500 opacity-60'
                }`}
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-full bg-rose-500/20 text-rose-300 font-bold text-xs flex items-center justify-center">
                      {level.id}
                    </span>
                    <h3 className="font-bold text-lg text-rose-100">{level.title}</h3>
                    {isCompleted && (
                      <span className="text-xs bg-emerald-950 text-emerald-300 border border-emerald-500/30 px-2.5 py-0.5 rounded-full font-semibold flex items-center gap-1">
                        <Star className="w-3 h-3 fill-emerald-300" />
                        تکمیل شده
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-rose-200/70 font-medium">{level.subtitle}</p>
                  <p className="text-xs text-slate-400 max-w-lg">{level.description}</p>
                </div>

                <div className="w-full sm:w-auto flex justify-end">
                  {isUnlocked ? (
                    <button
                      onClick={() => {
                        soundEngine.playButtonClick();
                        onSelectLevel(level.id);
                      }}
                      className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-pink-600 hover:from-rose-500 hover:to-pink-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2"
                    >
                      <Play className="w-4 h-4 fill-white" />
                      <span>شروع مرحله</span>
                    </button>
                  ) : (
                    <div className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-800 text-slate-500 text-xs font-semibold">
                      <Lock className="w-4 h-4" />
                      <span>قفل است</span>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
