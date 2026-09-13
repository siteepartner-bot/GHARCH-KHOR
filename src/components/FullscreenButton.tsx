import React from 'react';
import { Maximize, Minimize } from 'lucide-react';
import { useFullscreen } from '../hooks/useFullscreen';
import { soundEngine } from '../utils/audioEngine';

interface FullscreenButtonProps {
  className?: string;
  showText?: boolean;
  text?: string;
  variant?: 'icon-only' | 'badge' | 'button';
  id?: string;
}

export const FullscreenButton: React.FC<FullscreenButtonProps> = ({
  className = '',
  showText = false,
  text,
  variant = 'icon-only',
  id = 'fullscreen-toggle-btn',
}) => {
  const { isFullscreen, toggleFullscreen } = useFullscreen();

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playButtonClick();
    toggleFullscreen();
  };

  if (variant === 'button') {
    return (
      <button
        id={id}
        onClick={handleClick}
        className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl font-semibold text-xs transition-all active:scale-95 shadow-md ${className}`}
        title={isFullscreen ? 'خروج از تمام‌صفحه' : 'حالت تمام‌صفحه'}
      >
        {isFullscreen ? (
          <Minimize className="w-4 h-4 text-rose-300" />
        ) : (
          <Maximize className="w-4 h-4 text-rose-300" />
        )}
        <span>{text || (isFullscreen ? 'خروج از تمام‌صفحه' : 'تمام‌صفحه (فول‌اسکرین)')}</span>
      </button>
    );
  }

  if (variant === 'badge') {
    return (
      <button
        id={id}
        onClick={handleClick}
        className={`flex items-center gap-1.5 py-1.5 px-3 rounded-full bg-slate-900/80 hover:bg-rose-900/90 backdrop-blur-md border border-rose-500/30 text-rose-200 hover:text-white font-medium text-xs transition-all active:scale-95 shadow-lg ${className}`}
        title={isFullscreen ? 'خروج از تمام‌صفحه' : 'حالت تمام‌صفحه'}
      >
        {isFullscreen ? (
          <Minimize className="w-3.5 h-3.5 text-rose-300" />
        ) : (
          <Maximize className="w-3.5 h-3.5 text-rose-300" />
        )}
        {showText && (
          <span>{text || (isFullscreen ? 'خروج تمام‌صفحه' : 'تمام‌صفحه')}</span>
        )}
      </button>
    );
  }

  return (
    <button
      id={id}
      onClick={handleClick}
      className={`p-2.5 rounded-2xl bg-slate-900/80 hover:bg-rose-900/90 backdrop-blur-md border border-rose-500/30 text-rose-200 hover:text-white transition-all shadow-lg active:scale-95 flex items-center justify-center ${className}`}
      title={isFullscreen ? 'خروج از تمام‌صفحه (Esc)' : 'تمام‌صفحه کردن بازی'}
    >
      {isFullscreen ? (
        <Minimize className="w-5 h-5 text-rose-200" />
      ) : (
        <Maximize className="w-5 h-5 text-rose-200" />
      )}
      {showText && (
        <span className="mr-1 text-xs font-bold">{text || (isFullscreen ? 'خروج' : 'تمام‌صفحه')}</span>
      )}
    </button>
  );
};
