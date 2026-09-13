export type CollectibleType = 'heart' | 'letter' | 'gift' | 'flower' | 'memory' | 'star';
export type EnemyType =
  | 'qahr'
  | 'payam_nadide'
  | 'javabe_khoshk'
  | 'fasoleh'
  | 'rooze_bad'
  | 'delkhori'
  | 'estres'
  | 'souetafahom'
  | 'hesadat'
  | 'bi_hoselegi';

export type PlatformType =
  | 'solid'
  | 'moving'
  | 'disappearing'
  | 'cloud'
  | 'wood'
  | 'metal'
  | 'bouncy'
  | 'neon'
  | 'ice'
  | 'flower'
  | 'golden';

export interface Vector2D {
  x: number;
  y: number;
}

export interface Player {
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  isGrounded: boolean;
  facing: 'left' | 'right';
  state: 'idle' | 'walk' | 'run' | 'jump' | 'fall' | 'hurt' | 'victory';
  invulnerableTimer: number;
  hearts: number;
  maxHearts: number;
  score: number;
  lettersCollected: number;
  memoriesCollectedCount: number;
}

export interface NiyoushaGoal {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Platform {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  type: PlatformType;
  movingDirection?: 'horizontal' | 'vertical';
  moveRange?: number;
  moveSpeed?: number;
  startPos?: number;
  color?: string;
  label?: string;
}

export interface Collectible {
  id: string;
  type: CollectibleType;
  x: number;
  y: number;
  width: number;
  height: number;
  collected: boolean;
  value: number;
  letterText?: string;
  memoryId?: string;
  floatingOffset?: number;
}

export interface Enemy {
  id: string;
  type: EnemyType;
  x: number;
  y: number;
  width: number;
  height: number;
  vx: number;
  vy: number;
  startX: number;
  patrolDist: number;
  active: boolean;
  defeated: boolean;
  label: string;
}

export interface Checkpoint {
  id: string;
  x: number;
  y: number;
  reached: boolean;
}

export interface LevelTheme {
  skyGradient: [string, string];
  groundColor: string;
  platformColor: string;
  accentColor: string;
  weather: 'clear' | 'sakura' | 'night_lights' | 'rain' | 'stars' | 'sunset' | 'snow' | 'autumn' | 'hearts';
  musicMood: 'park' | 'city' | 'rain' | 'cloud' | 'climax';
}

export interface LevelConfig {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  introStoryText?: string;
  theme: LevelTheme;
  worldWidth: number;
  worldHeight: number;
  spawnPoint: Vector2D;
  niyoushaPos: Vector2D;
  endStoryText: string;
  endSubtext?: string;
  platforms: Platform[];
  collectibles: Collectible[];
  enemies: Enemy[];
  checkpoints: Checkpoint[];
}

export interface MemoryItem {
  id: string;
  levelId: number;
  title: string;
  date: string;
  shortText: string;
  fullStory: string;
  unlocked: boolean;
  cardColor: string;
  emoji: string;
}

export interface SaveData {
  unlockedLevels: number[];
  completedLevels: number[];
  totalScore: number;
  unlockedMemoryIds: string[];
  sfxVolume: number;
  musicVolume: number;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  touchControlsEnabled: boolean;
  currentLevelId: number;
}
