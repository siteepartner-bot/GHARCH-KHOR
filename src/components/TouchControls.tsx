import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUp } from 'lucide-react';

interface TouchControlsProps {
  onLeftPress: (active: boolean) => void;
  onRightPress: (active: boolean) => void;
  onJumpPress: (active: boolean) => void;
}

export const TouchControls: React.FC<TouchControlsProps> = ({
  onLeftPress,
  onRightPress,
  onJumpPress,
}) => {
  const [leftActive, setLeftActive] = useState(false);
  const [rightActive, setRightActive] = useState(false);
  const [jumpActive, setJumpActive] = useState(false);

  const handleLeft = (active: boolean) => {
    setLeftActive(active);
    onLeftPress(active);
  };

  const handleRight = (active: boolean) => {
    setRightActive(active);
    onRightPress(active);
  };

  const handleJump = (active: boolean) => {
    setJumpActive(active);
    onJumpPress(active);
  };

  return (
    <div
      dir="ltr"
      className="absolute inset-0 z-20 pointer-events-none select-none flex justify-between items-end p-3 sm:p-6 pb-4 sm:pb-6"
    >
      {/* Left-side Navigation (Movement: Left & Right) */}
      <div className="flex items-center gap-2.5 pointer-events-auto">
        {/* Move Left Button */}
        <button
          type="button"
          aria-label="حرکت به چپ"
          onPointerDown={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            handleLeft(true);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            try {
              (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {}
            handleLeft(false);
          }}
          onPointerCancel={() => handleLeft(false)}
          onPointerLeave={() => handleLeft(false)}
          className={`w-15 h-15 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center shadow-2xl transition-all duration-75 touch-none select-none border-2 ${
            leftActive
              ? 'bg-rose-600 scale-95 border-rose-300 text-white shadow-rose-600/50'
              : 'bg-slate-900/85 border-rose-500/50 text-rose-200'
          }`}
        >
          <ArrowLeft className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="text-[10px] font-bold">چپ</span>
        </button>

        {/* Move Right Button */}
        <button
          type="button"
          aria-label="حرکت به راست"
          onPointerDown={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            handleRight(true);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            try {
              (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {}
            handleRight(false);
          }}
          onPointerCancel={() => handleRight(false)}
          onPointerLeave={() => handleRight(false)}
          className={`w-15 h-15 sm:w-18 sm:h-18 rounded-2xl flex flex-col items-center justify-center shadow-2xl transition-all duration-75 touch-none select-none border-2 ${
            rightActive
              ? 'bg-rose-600 scale-95 border-rose-300 text-white shadow-rose-600/50'
              : 'bg-slate-900/85 border-rose-500/50 text-rose-200'
          }`}
        >
          <ArrowRight className="w-7 h-7 sm:w-8 sm:h-8" />
          <span className="text-[10px] font-bold">راست</span>
        </button>
      </div>

      {/* Right-side Action (Jump) */}
      <div className="pointer-events-auto">
        <button
          type="button"
          aria-label="پرش"
          onPointerDown={(e) => {
            e.preventDefault();
            (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
            handleJump(true);
          }}
          onPointerUp={(e) => {
            e.preventDefault();
            try {
              (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
            } catch {}
            handleJump(false);
          }}
          onPointerCancel={() => handleJump(false)}
          onPointerLeave={() => handleJump(false)}
          className={`w-18 h-18 sm:w-22 sm:h-22 rounded-full flex flex-col items-center justify-center shadow-2xl transition-all duration-75 touch-none select-none border-4 ${
            jumpActive
              ? 'bg-pink-500 scale-90 border-white text-white shadow-pink-500/60'
              : 'bg-gradient-to-tr from-rose-600 to-pink-500 border-rose-300/60 text-white'
          }`}
        >
          <ArrowUp className="w-8 h-8 sm:w-9 sm:h-9 stroke-[2.5]" />
          <span className="text-[11px] font-black -mt-0.5 tracking-wide">پرش</span>
        </button>
      </div>
    </div>
  );
};


