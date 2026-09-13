import { useState, useEffect } from 'react';
import { SaveData } from './types';
import { LEVELS } from './data/levels';
import { loadGameData, saveGameData, resetGameData } from './utils/storage';
import { soundEngine } from './utils/audioEngine';
import { MainMenu } from './components/MainMenu';
import { GameCanvas } from './components/GameCanvas';
import { MemoriesModal } from './components/MemoriesModal';
import { LevelSelectModal } from './components/LevelSelectModal';
import { SettingsModal } from './components/SettingsModal';
import { AboutModal } from './components/AboutModal';
import { Smartphone } from 'lucide-react';

export default function App() {
  const [saveState, setSaveState] = useState<SaveData>(loadGameData());
  const [activeScreen, setActiveScreen] = useState<
    'menu' | 'game' | 'memories' | 'levels' | 'settings' | 'about'
  >('menu');

  const [currentLevelId, setCurrentLevelId] = useState<number>(saveState.currentLevelId || 1);
  const [keyResetCounter, setKeyResetCounter] = useState(0);

  // Sync Audio Settings with audioEngine
  useEffect(() => {
    soundEngine.setSettings(
      saveState.sfxEnabled,
      saveState.musicEnabled,
      saveState.sfxVolume,
      saveState.musicVolume
    );
  }, [saveState.sfxEnabled, saveState.musicEnabled, saveState.sfxVolume, saveState.musicVolume]);

  // Handle Level Completion
  const handleLevelComplete = (
    levelId: number,
    score: number,
    lettersCount: number,
    newUnlockedMemories: string[]
  ) => {
    const nextLevelId = levelId + 1;

    const newUnlocked = Array.from(
      new Set([...saveState.unlockedLevels, nextLevelId])
    ).filter((id) => id <= LEVELS.length);

    const newCompleted = Array.from(new Set([...saveState.completedLevels, levelId]));
    const newMemories = Array.from(new Set([...saveState.unlockedMemoryIds, ...newUnlockedMemories]));

    const updated = saveGameData({
      unlockedLevels: newUnlocked,
      completedLevels: newCompleted,
      totalScore: saveState.totalScore + score,
      unlockedMemoryIds: newMemories,
      currentLevelId: Math.min(nextLevelId, LEVELS.length),
    });

    setSaveState(updated);
  };

  const handleStartGame = () => {
    setCurrentLevelId(saveState.currentLevelId || 1);
    setKeyResetCounter((prev) => prev + 1);
    setActiveScreen('game');
  };

  const handleSelectLevel = (id: number) => {
    setCurrentLevelId(id);
    setSaveState((prev) => saveGameData({ currentLevelId: id }));
    setKeyResetCounter((prev) => prev + 1);
    setActiveScreen('game');
  };

  const handleNextLevel = () => {
    const nextId = currentLevelId + 1;
    if (nextId <= LEVELS.length) {
      setCurrentLevelId(nextId);
      setSaveState((prev) => saveGameData({ currentLevelId: nextId }));
      setKeyResetCounter((prev) => prev + 1);
    } else {
      setActiveScreen('menu');
    }
  };

  const handleReplayLevel = () => {
    setKeyResetCounter((prev) => prev + 1);
  };

  const handleUpdateSettings = (partial: {
    sfxEnabled?: boolean;
    musicEnabled?: boolean;
    sfxVolume?: number;
    musicVolume?: number;
    touchEnabled?: boolean;
  }) => {
    const updated = saveGameData({
      sfxEnabled: partial.sfxEnabled ?? saveState.sfxEnabled,
      musicEnabled: partial.musicEnabled ?? saveState.musicEnabled,
      sfxVolume: partial.sfxVolume ?? saveState.sfxVolume,
      musicVolume: partial.musicVolume ?? saveState.musicVolume,
      touchControlsEnabled: partial.touchEnabled ?? saveState.touchControlsEnabled,
    });
    setSaveState(updated);
  };

  const handleResetProgress = () => {
    const fresh = resetGameData();
    setSaveState(fresh);
    setCurrentLevelId(1);
    setActiveScreen('menu');
  };

  const currentLevelConfig = LEVELS.find((l) => l.id === currentLevelId) || LEVELS[0];

  return (
    <div className="w-screen h-screen overflow-hidden bg-rose-950 font-['Vazirmatn',sans-serif] relative select-none">
      {/* Landscape Orientation Recommendation Bar for Small Mobile Screens */}
      <div className="sm:hidden fixed top-0 inset-x-0 z-50 bg-rose-900/90 text-rose-100 text-[10px] py-1 px-2 text-center flex items-center justify-center gap-1 border-b border-rose-500/30">
        <Smartphone className="w-3 h-3 rotate-90" />
        <span>برای تجربه بهتر، گوشی را افقی (Landscape) بگیرید.</span>
      </div>

      {/* Main Menu */}
      {activeScreen === 'menu' && (
        <MainMenu
          onStartGame={handleStartGame}
          onOpenMemories={() => setActiveScreen('memories')}
          onOpenLevelSelect={() => setActiveScreen('levels')}
          onOpenSettings={() => setActiveScreen('settings')}
          onOpenAbout={() => setActiveScreen('about')}
          hasSave={saveState.unlockedLevels.length > 1 || saveState.completedLevels.length > 0}
          unlockedMemoriesCount={saveState.unlockedMemoryIds.length}
        />
      )}

      {/* Main Platformer Gameplay */}
      {activeScreen === 'game' && (
        <GameCanvas
          key={`${currentLevelId}_${keyResetCounter}`}
          levelConfig={currentLevelConfig}
          sfxEnabled={saveState.sfxEnabled}
          musicEnabled={saveState.musicEnabled}
          touchControlsEnabled={saveState.touchControlsEnabled}
          onLevelComplete={handleLevelComplete}
          onSelectNextLevel={handleNextLevel}
          onReplayLevel={handleReplayLevel}
          onReturnToMenu={() => setActiveScreen('menu')}
        />
      )}

      {/* Modals & Overlays */}
      <MemoriesModal
        isOpen={activeScreen === 'memories'}
        unlockedMemoryIds={saveState.unlockedMemoryIds}
        onClose={() => setActiveScreen('menu')}
      />

      <LevelSelectModal
        isOpen={activeScreen === 'levels'}
        unlockedLevels={saveState.unlockedLevels}
        completedLevels={saveState.completedLevels}
        onSelectLevel={handleSelectLevel}
        onClose={() => setActiveScreen('menu')}
      />

      <SettingsModal
        isOpen={activeScreen === 'settings'}
        sfxEnabled={saveState.sfxEnabled}
        musicEnabled={saveState.musicEnabled}
        sfxVolume={saveState.sfxVolume}
        musicVolume={saveState.musicVolume}
        touchEnabled={saveState.touchControlsEnabled}
        onUpdateSettings={handleUpdateSettings}
        onResetProgress={handleResetProgress}
        onClose={() => setActiveScreen('menu')}
      />

      <AboutModal
        isOpen={activeScreen === 'about'}
        onClose={() => setActiveScreen('menu')}
      />
    </div>
  );
}
