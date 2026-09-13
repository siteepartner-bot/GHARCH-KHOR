import React, { useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { Play, Camera, Map, Settings, Info, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';
import { SpriteRenderer } from './SpriteRenderer';
import { FullscreenButton } from './FullscreenButton';

interface MainMenuProps {
  onStartGame: () => void;
  onOpenMemories: () => void;
  onOpenLevelSelect: () => void;
  onOpenSettings: () => void;
  onOpenAbout: () => void;
  hasSave: boolean;
  unlockedMemoriesCount: number;
}

export const MainMenu: React.FC<MainMenuProps> = ({
  onStartGame,
  onOpenMemories,
  onOpenLevelSelect,
  onOpenSettings,
  onOpenAbout,
  hasSave,
  unlockedMemoriesCount,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    let animId: number;
    let time = 0;

    const renderMenuCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      time += 0.03;

      // Ensure canvas size matches container
      if (canvas.width !== canvas.clientWidth || canvas.height !== canvas.clientHeight) {
        canvas.width = canvas.clientWidth;
        canvas.height = canvas.clientHeight;
      }

      const w = canvas.width;
      const h = canvas.height;

      // Romantic background gradient
      const grad = ctx.createLinearGradient(0, 0, 0, h);
      grad.addColorStop(0, '#1e1b4b');
      grad.addColorStop(0.5, '#4c1d95');
      grad.addColorStop(1, '#831843');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, w, h);

      // Stars / Hearts particle background
      for (let i = 0; i < 35; i++) {
        const hx = (i * 113 + time * 15) % w;
        const hy = (i * 71 + Math.sin(time + i) * 20) % h;
        ctx.fillStyle = `rgba(244, 63, 94, ${0.2 + (i % 3) * 0.15})`;
        ctx.font = `${12 + (i % 4) * 3}px sans-serif`;
        ctx.fillText(i % 2 === 0 ? '❤️' : '✨', hx, hy);
      }

      // Ground platform for Hasan & Niyousha
      ctx.fillStyle = '#334155';
      ctx.beginPath();
      ctx.roundRect(w / 2 - 160, h * 0.72, 320, 24, 12);
      ctx.fill();

      // Render Niyousha & Hasan standing together
      const niyoushaX = w / 2 - 45;
      const hasanX = w / 2 + 10;
      const charY = h * 0.72 - 38;

      SpriteRenderer.drawNiyoushaPlayer(
        ctx,
        {
          x: niyoushaX,
          y: charY,
          width: 32,
          height: 38,
          vx: 0,
          vy: 0,
          isGrounded: true,
          facing: 'right',
          state: 'idle',
          invulnerableTimer: 0,
          hearts: 3,
          maxHearts: 3,
          score: 0,
          lettersCollected: 0,
          memoriesCollectedCount: 0,
        },
        time
      );

      SpriteRenderer.drawHasanGoal(
        ctx,
        {
          x: hasanX,
          y: charY,
          width: 32,
          height: 38,
        },
        time
      );

      // Heart pulsating above their heads
      const heartY = charY - 25 + Math.sin(time * 3) * 5;
      ctx.fillStyle = '#f43f5e';
      ctx.font = '22px sans-serif';
      ctx.fillText('❤️', w / 2 - 8, heartY);

      animId = requestAnimationFrame(renderMenuCanvas);
    };

    renderMenuCanvas();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, []);

  return (
    <div className="relative w-full h-full flex flex-col items-center justify-between p-4 sm:p-8 select-none overflow-hidden">
      {/* Interactive Background Canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full object-cover z-0" />

      {/* Top Controls Bar */}
      <div className="absolute top-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <FullscreenButton id="main-menu-fullscreen-btn" variant="badge" showText={true} className="pointer-events-auto" />
      </div>

      {/* Top Header Banner */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 text-center space-y-2 mt-2 sm:mt-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs font-semibold shadow-lg backdrop-blur-md">
          <Heart className="w-3.5 h-3.5 fill-rose-500 text-rose-500 animate-pulse" />
          <span>یک بازی پلتفرمر عاشقانه برای حسن و نیوشا</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-rose-200 via-pink-300 to-amber-200 drop-shadow-md">
          داستان حسن و نیوشا ❤️
        </h1>

        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900/60 border border-amber-400/30 text-amber-200 text-[11px] font-medium backdrop-blur-sm shadow-sm">
          <span>🗓️ آغاز قصه عشق ما:</span>
          <strong className="text-amber-300 font-bold">۱۷ اردیبهشت ۱۴۰۵</strong>
          <span>✨</span>
        </div>
      </motion.div>

      {/* Center Spacer */}
      <div className="relative z-10 my-auto" />

      {/* Bottom Menu Buttons */}
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative z-10 w-full max-w-sm space-y-2.5 mb-2 sm:mb-6"
      >
        {/* Start / Continue Button */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onStartGame();
          }}
          className="w-full py-3.5 px-6 rounded-2xl bg-gradient-to-r from-rose-600 via-pink-600 to-rose-500 hover:from-rose-500 hover:to-pink-500 text-white font-extrabold text-base sm:text-lg shadow-xl border border-rose-400/40 transition-all active:scale-95 flex items-center justify-center gap-2"
        >
          <Play className="w-5 h-5 fill-white" />
          <span>{hasSave ? 'ادامه بازی ❤️' : 'شروع بازی ❤️'}</span>
        </button>

        {/* Action Grid */}
        <div className="grid grid-cols-2 gap-2.5">
          {/* Memories */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenMemories();
            }}
            className="py-3 px-4 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-rose-500/30 text-rose-200 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5 relative"
          >
            <Camera className="w-4 h-4 text-purple-400" />
            <span>خاطرات ما</span>
            {unlockedMemoriesCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-purple-500 text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-bold">
                {unlockedMemoriesCount}
              </span>
            )}
          </button>

          {/* Level Select */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenLevelSelect();
            }}
            className="py-3 px-4 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-rose-500/30 text-rose-200 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Map className="w-4 h-4 text-amber-400" />
            <span>مراحل</span>
          </button>

          {/* Settings */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenSettings();
            }}
            className="py-3 px-4 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-rose-500/30 text-rose-200 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Settings className="w-4 h-4 text-slate-300" />
            <span>تنظیمات</span>
          </button>

          {/* About */}
          <button
            onClick={() => {
              soundEngine.playButtonClick();
              onOpenAbout();
            }}
            className="py-3 px-4 rounded-xl bg-slate-900/85 hover:bg-slate-800 backdrop-blur-md border border-rose-500/30 text-rose-200 font-bold text-xs sm:text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-1.5"
          >
            <Info className="w-4 h-4 text-pink-400" />
            <span>درباره ما</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
};
