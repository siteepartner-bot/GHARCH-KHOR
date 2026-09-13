import React from 'react';
import { motion } from 'motion/react';
import { X, Volume2, VolumeX, Music, Smartphone, Trash2 } from 'lucide-react';
import { soundEngine } from '../utils/audioEngine';

interface SettingsModalProps {
  isOpen: boolean;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  sfxVolume: number;
  musicVolume: number;
  touchEnabled: boolean;
  onUpdateSettings: (settings: {
    sfxEnabled?: boolean;
    musicEnabled?: boolean;
    sfxVolume?: number;
    musicVolume?: number;
    touchEnabled?: boolean;
  }) => void;
  onResetProgress: () => void;
  onClose: () => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  sfxEnabled,
  musicEnabled,
  sfxVolume,
  musicVolume,
  touchEnabled,
  onUpdateSettings,
  onResetProgress,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-md bg-slate-900 border border-rose-500/30 text-white p-6 rounded-3xl shadow-2xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <h2 className="text-xl font-bold text-rose-300">تنظیمات بازی ⚙️</h2>
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

        {/* SFX Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              {sfxEnabled ? <Volume2 className="w-4 h-4 text-rose-400" /> : <VolumeX className="w-4 h-4 text-slate-500" />}
              جلوه‌های صوتی (SFX)
            </span>
            <input
              type="checkbox"
              checked={sfxEnabled}
              onChange={(e) => {
                soundEngine.playButtonClick();
                onUpdateSettings({ sfxEnabled: e.target.checked });
              }}
              className="w-5 h-5 accent-rose-500 rounded cursor-pointer"
            />
          </div>
          {sfxEnabled && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={sfxVolume}
              onChange={(e) => onUpdateSettings({ sfxVolume: parseFloat(e.target.value) })}
              className="w-full accent-rose-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          )}
        </div>

        {/* Music Toggle */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
              <Music className={`w-4 h-4 ${musicEnabled ? 'text-pink-400' : 'text-slate-500'}`} />
              موسیقی پس‌زمینه (BGM)
            </span>
            <input
              type="checkbox"
              checked={musicEnabled}
              onChange={(e) => {
                soundEngine.playButtonClick();
                onUpdateSettings({ musicEnabled: e.target.checked });
              }}
              className="w-5 h-5 accent-pink-500 rounded cursor-pointer"
            />
          </div>
          {musicEnabled && (
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={musicVolume}
              onChange={(e) => onUpdateSettings({ musicVolume: parseFloat(e.target.value) })}
              className="w-full accent-pink-500 bg-slate-800 rounded-lg cursor-pointer"
            />
          )}
        </div>

        {/* Touch Controls Toggle */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-800">
          <span className="text-sm font-semibold text-slate-200 flex items-center gap-2">
            <Smartphone className="w-4 h-4 text-amber-400" />
            کنترل‌های لمسی موبایل
          </span>
          <input
            type="checkbox"
            checked={touchEnabled}
            onChange={(e) => {
              soundEngine.playButtonClick();
              onUpdateSettings({ touchEnabled: e.target.checked });
            }}
            className="w-5 h-5 accent-amber-500 rounded cursor-pointer"
          />
        </div>

        {/* Reset Progress */}
        <div className="pt-4 border-t border-slate-800">
          <button
            onClick={() => {
              if (window.confirm('آیا مطمئن هستید که می‌خواهید تمام پیشرفت و خاطرات ذخیره‌شده پاک شوند؟')) {
                soundEngine.playButtonClick();
                onResetProgress();
              }
            }}
            className="w-full py-2.5 px-4 rounded-xl bg-rose-950/60 hover:bg-rose-900 border border-rose-500/40 text-rose-300 font-semibold text-xs flex items-center justify-center gap-2 transition-colors"
          >
            <Trash2 className="w-4 h-4 text-rose-400" />
            <span>پاکسازی کامل ذخیره بازی</span>
          </button>
        </div>

        {/* Done button */}
        <button
          onClick={() => {
            soundEngine.playButtonClick();
            onClose();
          }}
          className="w-full py-3 rounded-2xl bg-slate-800 hover:bg-slate-700 text-white font-bold text-sm shadow-md transition-all"
        >
          ذخیره و بستن
        </button>
      </motion.div>
    </div>
  );
};
