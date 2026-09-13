import { SaveData } from '../types';

const STORAGE_KEY = 'hasan_niyousha_game_save_v1';

const defaultSave: SaveData = {
  unlockedLevels: [1],
  completedLevels: [],
  totalScore: 0,
  unlockedMemoryIds: [],
  sfxVolume: 0.7,
  musicVolume: 0.5,
  sfxEnabled: true,
  musicEnabled: true,
  touchControlsEnabled: true,
  currentLevelId: 1,
};

export const loadGameData = (): SaveData => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return defaultSave;
    const parsed = JSON.parse(raw);
    return {
      ...defaultSave,
      ...parsed,
    };
  } catch (err) {
    console.warn('Failed to load save data from localStorage:', err);
    return defaultSave;
  }
};

export const saveGameData = (data: Partial<SaveData>): SaveData => {
  try {
    const current = loadGameData();
    const updated: SaveData = { ...current, ...data };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.warn('Failed to save data to localStorage:', err);
    return loadGameData();
  }
};

export const resetGameData = (): SaveData => {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.warn('Failed to clear localStorage:', err);
  }
  return defaultSave;
};
