import React from 'react';
import { Heart, Star, Mail, Camera, Pause } from 'lucide-react';

interface HUDProps {
  hearts: number;
  maxHearts: number;
  score: number;
  lettersCount: number;
  memoriesCount: number;
  levelTitle: string;
  onPause: () => void;
}

export const HUD: React.FC<HUDProps> = ({
  hearts,
  maxHearts,
  score,
  lettersCount,
  memoriesCount,
  levelTitle,
  onPause,
}) => {
  return (
    <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
      {/* Left side: Stats */}
      <div className="flex items-center gap-2 sm:gap-4 bg-slate-900/80 backdrop-blur-md px-3 sm:px-4 py-2 rounded-2xl border border-rose-500/30 shadow-lg pointer-events-auto">
        {/* Hearts */}
        <div className="flex items-center gap-1">
          {Array.from({ length: maxHearts }).map((_, i) => (
            <Heart
              key={i}
              className={`w-5 h-5 transition-transform duration-300 ${
                i < hearts
                  ? 'fill-rose-500 text-rose-500 scale-100 animate-pulse'
                  : 'fill-slate-700 text-slate-700 scale-90'
              }`}
            />
          ))}
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Score */}
        <div className="flex items-center gap-1 text-amber-300 text-xs sm:text-sm font-bold">
          <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
          <span>{score}</span>
        </div>

        <div className="h-4 w-px bg-slate-700" />

        {/* Letters */}
        <div className="flex items-center gap-1 text-pink-300 text-xs sm:text-sm font-bold">
          <Mail className="w-4 h-4 text-pink-400" />
          <span>{lettersCount}</span>
        </div>

        <div className="h-4 w-px bg-slate-700 hidden sm:block" />

        {/* Memories */}
        <div className="hidden sm:flex items-center gap-1 text-purple-300 text-xs sm:text-sm font-bold">
          <Camera className="w-4 h-4 text-purple-400" />
          <span>{memoriesCount}</span>
        </div>
      </div>

      {/* Middle: Level Title */}
      <div className="hidden md:block bg-rose-950/70 backdrop-blur-md border border-rose-500/30 px-4 py-1.5 rounded-full text-rose-200 text-xs font-semibold shadow-md">
        {levelTitle}
      </div>

      {/* Right side: Pause Button */}
      <button
        onClick={onPause}
        className="pointer-events-auto bg-slate-900/80 hover:bg-rose-900/90 backdrop-blur-md p-2.5 rounded-2xl border border-rose-500/30 text-rose-200 hover:text-white transition-all shadow-lg active:scale-95"
        title="توقف بازی"
      >
        <Pause className="w-5 h-5" />
      </button>
    </div>
  );
};
