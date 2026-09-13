import React, { useEffect, useRef, useState, useCallback } from 'react';
import { Player, LevelConfig, Collectible, Enemy, Platform, Checkpoint } from '../types';
import { SpriteRenderer } from './SpriteRenderer';
import { soundEngine } from '../utils/audioEngine';
import { HUD } from './HUD';
import { TouchControls } from './TouchControls';
import { LetterModal } from './LetterModal';
import { LevelCompleteModal } from './LevelCompleteModal';
import { GameOverModal } from './GameOverModal';
import { LevelStoryIntro } from './LevelStoryIntro';
import { FullscreenButton } from './FullscreenButton';

interface GameCanvasProps {
  levelConfig: LevelConfig;
  sfxEnabled: boolean;
  musicEnabled: boolean;
  touchControlsEnabled: boolean;
  onLevelComplete: (levelId: number, score: number, letters: number, unlockedMemoryIds: string[]) => void;
  onSelectNextLevel: () => void;
  onReplayLevel: () => void;
  onReturnToMenu: () => void;
}

export const GameCanvas: React.FC<GameCanvasProps> = ({
  levelConfig,
  sfxEnabled,
  musicEnabled,
  touchControlsEnabled,
  onLevelComplete,
  onSelectNextLevel,
  onReplayLevel,
  onReturnToMenu,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Input states
  const keysRef = useRef<{ left: boolean; right: boolean; jump: boolean }>({
    left: false,
    right: false,
    jump: false,
  });

  // Modal / Game states
  const [isPaused, setIsPaused] = useState(false);
  const [showStoryIntro, setShowStoryIntro] = useState(true);
  const [activeLetterText, setActiveLetterText] = useState<string | null>(null);
  const [isLevelComplete, setIsLevelComplete] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Reset intro when level changes
  useEffect(() => {
    setShowStoryIntro(true);
    setIsLevelComplete(false);
    setIsGameOver(false);
  }, [levelConfig.id]);

  // Dynamic Level entities
  const playerRef = useRef<Player>({
    x: levelConfig.spawnPoint.x,
    y: levelConfig.spawnPoint.y,
    width: 28,
    height: 38,
    vx: 0,
    vy: 0,
    isGrounded: false,
    facing: 'right',
    state: 'idle',
    invulnerableTimer: 0,
    hearts: 3,
    maxHearts: 3,
    score: 0,
    lettersCollected: 0,
    memoriesCollectedCount: 0,
  });

  const platformsRef = useRef<Platform[]>(
    JSON.parse(JSON.stringify(levelConfig.platforms))
  );
  const collectiblesRef = useRef<Collectible[]>(
    JSON.parse(JSON.stringify(levelConfig.collectibles))
  );
  const enemiesRef = useRef<Enemy[]>(
    JSON.parse(JSON.stringify(levelConfig.enemies))
  );
  const checkpointsRef = useRef<Checkpoint[]>(
    JSON.parse(JSON.stringify(levelConfig.checkpoints))
  );

  const lastCheckpointRef = useRef<{ x: number; y: number }>(levelConfig.spawnPoint);
  const newUnlockedMemoriesRef = useRef<string[]>([]);
  const cameraXRef = useRef<number>(0);

  // HUD display values
  const [hudState, setHudState] = useState({
    hearts: 3,
    score: 0,
    letters: 0,
    memories: 0,
  });

  // Start Background Music for this level mood
  useEffect(() => {
    soundEngine.startBgm(levelConfig.theme.musicMood);
    return () => {
      soundEngine.stopBgm();
    };
  }, [levelConfig.theme.musicMood]);

  // Handle Keyboard Inputs
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        keysRef.current.left = true;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        keysRef.current.right = true;
      }
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        if (!keysRef.current.jump) {
          keysRef.current.jump = true;
        }
      }
      if (e.code === 'Escape') {
        setIsPaused((prev) => !prev);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.code === 'KeyA' || e.code === 'ArrowLeft') {
        keysRef.current.left = false;
      }
      if (e.code === 'KeyD' || e.code === 'ArrowRight') {
        keysRef.current.right = false;
      }
      if (e.code === 'Space' || e.code === 'KeyW' || e.code === 'ArrowUp') {
        keysRef.current.jump = false;
      }
    };

    const handleBlur = () => {
      keysRef.current.left = false;
      keysRef.current.right = false;
      keysRef.current.jump = false;
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    window.addEventListener('blur', handleBlur);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
      window.removeEventListener('blur', handleBlur);
    };
  }, []);

  // Main 60 FPS Platformer Game Loop
  useEffect(() => {
    let animId: number;
    let gameTime = 0;

    const gameLoop = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Handle Canvas resize with High-DPI support
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const displayWidth = canvas.clientWidth || window.innerWidth;
      const displayHeight = canvas.clientHeight || window.innerHeight;

      if (canvas.width !== Math.floor(displayWidth * dpr) || canvas.height !== Math.floor(displayHeight * dpr)) {
        canvas.width = Math.floor(displayWidth * dpr);
        canvas.height = Math.floor(displayHeight * dpr);
      }

      gameTime += 0.016;

      const p = playerRef.current;
      const platforms = platformsRef.current;
      const collectibles = collectiblesRef.current;
      const enemies = enemiesRef.current;
      const checkpoints = checkpointsRef.current;

      if (!isPaused && !isLevelComplete && !isGameOver && activeLetterText === null) {
        // --- 1. MOVEMENT & PHYSICS ---

        // Horizontal velocity
        const moveSpeed = 4.8;
        if (keysRef.current.left) {
          p.vx = -moveSpeed;
          p.facing = 'left';
        } else if (keysRef.current.right) {
          p.vx = moveSpeed;
          p.facing = 'right';
        } else {
          p.vx *= 0.7; // friction
        }

        // Jump physics
        if (keysRef.current.jump && p.isGrounded) {
          p.vy = -12.2;
          p.isGrounded = false;
          soundEngine.playJump();
        }

        // Gravity
        p.vy += 0.55;
        if (p.vy > 13) p.vy = 13; // Terminal velocity

        // Apply velocities
        p.x += p.vx;
        p.y += p.vy;

        // Decrease invulnerability timer
        if (p.invulnerableTimer > 0) {
          p.invulnerableTimer -= 0.016;
        }

        // --- 2. MOVING PLATFORMS UPDATE ---
        platforms.forEach((plat) => {
          if (plat.type === 'moving' && plat.movingDirection && plat.moveRange) {
            const start = plat.startPos || 0;
            const speed = plat.moveSpeed || 1.5;

            if (plat.movingDirection === 'horizontal') {
              const prevX = plat.x;
              plat.x = start + Math.sin(gameTime * speed) * plat.moveRange;
              const deltaX = plat.x - prevX;

              // Move standing player along with platform
              if (
                p.isGrounded &&
                p.x + p.width > plat.x &&
                p.x < plat.x + plat.width &&
                Math.abs(p.y + p.height - plat.y) < 4
              ) {
                p.x += deltaX;
              }
            } else if (plat.movingDirection === 'vertical') {
              const prevY = plat.y;
              plat.y = start + Math.sin(gameTime * speed) * plat.moveRange;
              const deltaY = plat.y - prevY;

              if (
                p.isGrounded &&
                p.x + p.width > plat.x &&
                p.x < plat.x + plat.width &&
                Math.abs(p.y + p.height - prevY) < 4
              ) {
                p.y += deltaY;
              }
            }
          }
        });

        // --- 3. PLATFORM COLLISIONS (AABB) ---
        p.isGrounded = false;

        platforms.forEach((plat) => {
          // Check horizontal overlap
          if (p.x + p.width > plat.x && p.x < plat.x + plat.width) {
            // Falling onto platform top
            if (p.vy >= 0 && p.y + p.height - p.vy <= plat.y + 8 && p.y + p.height >= plat.y) {
              if (plat.type === 'bouncy') {
                // High Trampoline Bounce!
                p.y = plat.y - p.height;
                p.vy = -16.5;
                p.isGrounded = false;
                soundEngine.playJump();
              } else {
                p.y = plat.y - p.height;
                p.vy = 0;
                p.isGrounded = true;
              }
            }
          }
        });

        // Player state animation selector
        if (!p.isGrounded) {
          p.state = p.vy < 0 ? 'jump' : 'fall';
        } else if (Math.abs(p.vx) > 0.5) {
          p.state = 'walk';
        } else {
          p.state = 'idle';
        }

        // --- 4. COLLECTIBLES COLLISIONS ---
        collectibles.forEach((c) => {
          if (!c.collected) {
            if (
              p.x + p.width > c.x &&
              p.x < c.x + c.width &&
              p.y + p.height > c.y &&
              p.y < c.y + c.height
            ) {
              c.collected = true;
              p.score += c.value;

              if (c.type === 'heart') {
                p.hearts = Math.min(p.maxHearts, p.hearts + 1);
                soundEngine.playCollectHeart();
              } else if (c.type === 'flower') {
                p.hearts = Math.min(p.maxHearts + 1, p.hearts + 1);
                p.maxHearts = Math.max(p.maxHearts, p.hearts);
                soundEngine.playCollectHeart();
              } else if (c.type === 'letter') {
                p.lettersCollected += 1;
                soundEngine.playCollectLetter();
                if (c.letterText) {
                  setActiveLetterText(c.letterText);
                }
              } else if (c.type === 'memory') {
                p.memoriesCollectedCount += 1;
                soundEngine.playCollectLetter();
                if (c.memoryId && !newUnlockedMemoriesRef.current.includes(c.memoryId)) {
                  newUnlockedMemoriesRef.current.push(c.memoryId);
                }
              } else {
                soundEngine.playCollectItem();
              }

              setHudState({
                hearts: p.hearts,
                score: p.score,
                letters: p.lettersCollected,
                memories: p.memoriesCollectedCount,
              });
            }
          }
        });

        // --- 5. ENEMY PATROLS & COLLISIONS ---
        enemies.forEach((e) => {
          if (!e.active || e.defeated) return;

          // Enemy patrol AI (horizontal and vertical)
          if (e.patrolDist > 0) {
            e.x += e.vx;
            if (e.x > e.startX + e.patrolDist || e.x < e.startX) {
              e.vx *= -1;
            }
          }
          if (e.vy !== 0) {
            e.y += e.vy;
            if (Math.abs(e.y - (e.y - e.vy)) > 30) {
              e.vy *= -1;
            }
          }

          // Player collision with enemy
          if (
            p.x + p.width > e.x &&
            p.x < e.x + e.width &&
            p.y + p.height > e.y &&
            p.y < e.y + e.height
          ) {
            // Stomp mechanic: Jumping on top of enemy
            if (p.vy > 0 && p.y + p.height - p.vy <= e.y + 12) {
              e.defeated = true;
              p.vy = -8.5; // Bounce off enemy
              p.score += 30;
              soundEngine.playStomp();
            } else if (p.invulnerableTimer <= 0) {
              // Player takes damage
              p.hearts -= 1;
              p.invulnerableTimer = 1.5;
              p.vy = -6;
              p.vx = p.facing === 'left' ? 4 : -4;
              soundEngine.playDamage();

              setHudState((prev) => ({ ...prev, hearts: p.hearts }));

              if (p.hearts <= 0) {
                soundEngine.playGameOver();
                setIsGameOver(true);
              }
            }
          }
        });

        // --- 6. CHECKPOINT CHECK ---
        checkpoints.forEach((cp) => {
          if (!cp.reached && Math.abs(p.x - cp.x) < 30 && Math.abs(p.y - cp.y) < 50) {
            cp.reached = true;
            lastCheckpointRef.current = { x: cp.x, y: cp.y - 30 };
            soundEngine.playCheckpoint();
          }
        });

        // --- 7. PIT FALL CHECK ---
        if (p.y > levelConfig.worldHeight + 50) {
          p.hearts -= 1;
          soundEngine.playDamage();
          setHudState((prev) => ({ ...prev, hearts: p.hearts }));

          if (p.hearts <= 0) {
            soundEngine.playGameOver();
            setIsGameOver(true);
          } else {
            // Respawn at last checkpoint
            p.x = lastCheckpointRef.current.x;
            p.y = lastCheckpointRef.current.y;
            p.vx = 0;
            p.vy = 0;
            p.invulnerableTimer = 1.5;
          }
        }

        // --- 8. NIYOUSHA GOAL CHECK ---
        const goalDist = Math.hypot(
          p.x - levelConfig.niyoushaPos.x,
          p.y - levelConfig.niyoushaPos.y
        );

        if (goalDist < 45 && !isLevelComplete) {
          p.state = 'victory';
          p.vx = 0;
          p.vy = 0;
          soundEngine.playLevelComplete();
          setIsLevelComplete(true);
          onLevelComplete(
            levelConfig.id,
            p.score,
            p.lettersCollected,
            newUnlockedMemoriesRef.current
          );
        }
      }

      // --- 9. DYNAMIC RESPONSIVE CAMERA & VIEWPORT SCALING ---
      // Reference world height is 650
      const DESIGN_WORLD_HEIGHT = 650;
      let scale = displayHeight / DESIGN_WORLD_HEIGHT;

      // On mobile portrait or narrow screens, ensure player can see at least 520 world units horizontally
      const minVisibleWorldWidth = 520;
      if (displayWidth / scale < minVisibleWorldWidth) {
        scale = displayWidth / minVisibleWorldWidth;
      }

      // Clamp scale to prevent extreme zoom-in or zoom-out
      scale = Math.max(0.45, Math.min(2.5, scale));

      const viewWidth = displayWidth / scale;
      const viewHeight = displayHeight / scale;

      // Camera X: Smooth horizontal tracking (center player slightly to the left to see what's ahead)
      const targetCamX = p.x - viewWidth * 0.38;
      const maxCamX = Math.max(0, levelConfig.worldWidth - viewWidth);
      cameraXRef.current = Math.max(0, Math.min(maxCamX, targetCamX));
      const cameraX = cameraXRef.current;

      // Camera Y:
      // When screen is taller than world height (e.g. mobile portrait), align ground with bottom of screen.
      // When screen is shorter, track player vertically smoothly within world bounds.
      let cameraY = 0;
      if (viewHeight >= levelConfig.worldHeight) {
        // Ground is at worldHeight (650). Align bottom of camera with bottom of world!
        cameraY = levelConfig.worldHeight - viewHeight;
      } else {
        const targetCamY = p.y - viewHeight * 0.62;
        const maxCamY = levelConfig.worldHeight - viewHeight;
        cameraY = Math.max(0, Math.min(maxCamY, targetCamY));
      }

      // --- 10. CANVAS RENDERING ---
      ctx.save();
      // Apply High-DPI screen scaling
      ctx.scale(dpr, dpr);

      // Render Atmosphere Background & Weather across full display canvas
      SpriteRenderer.drawBackground(
        ctx,
        levelConfig.theme,
        displayWidth,
        displayHeight,
        cameraX * scale,
        gameTime
      );

      // Apply World Camera Translation & Scale
      ctx.save();
      ctx.scale(scale, scale);
      ctx.translate(-cameraX, -cameraY);

      // Draw Platforms
      platforms.forEach((plat) => {
        SpriteRenderer.drawPlatform(ctx, plat, levelConfig.theme);
      });

      // Draw Checkpoints
      checkpoints.forEach((cp) => {
        SpriteRenderer.drawCheckpoint(ctx, cp, gameTime);
      });

      // Draw Collectibles
      collectibles.forEach((c) => {
        SpriteRenderer.drawCollectible(ctx, c, gameTime);
      });

      // Draw Enemies
      enemies.forEach((e) => {
        SpriteRenderer.drawEnemy(ctx, e, gameTime);
      });

      // Draw Hasan Goal Character (waiting lovingly for Niyousha at the finish line)
      SpriteRenderer.drawHasanGoal(
        ctx,
        {
          x: levelConfig.niyoushaPos.x,
          y: levelConfig.niyoushaPos.y,
          width: 32,
          height: 38,
        },
        gameTime
      );

      // Draw Niyousha Playable Character
      SpriteRenderer.drawNiyoushaPlayer(ctx, p, gameTime);

      ctx.restore(); // Restore world camera transform
      ctx.restore(); // Restore DPR scale

      animId = requestAnimationFrame(gameLoop);
    };

    animId = requestAnimationFrame(gameLoop);

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [
    levelConfig,
    isPaused,
    isLevelComplete,
    isGameOver,
    activeLetterText,
    onLevelComplete,
  ]);

  // Touch control callbacks
  const handleTouchLeft = useCallback((active: boolean) => {
    keysRef.current.left = active;
  }, []);

  const handleTouchRight = useCallback((active: boolean) => {
    keysRef.current.right = active;
  }, []);

  const handleTouchJump = useCallback((active: boolean) => {
    keysRef.current.jump = active;
  }, []);

  return (
    <div className="relative w-full h-full bg-slate-950 select-none overflow-hidden">
      {/* Top HUD */}
      <HUD
        hearts={hudState.hearts}
        maxHearts={3}
        score={hudState.score}
        lettersCount={hudState.letters}
        memoriesCount={hudState.memories}
        levelTitle={levelConfig.title}
        onPause={() => setIsPaused(true)}
      />

      {/* Main 60 FPS HTML5 Canvas */}
      <canvas ref={canvasRef} className="w-full h-full block touch-none" />

      {/* Mobile Touch Controls Overlay */}
      {touchControlsEnabled && (
        <TouchControls
          onLeftPress={handleTouchLeft}
          onRightPress={handleTouchRight}
          onJumpPress={handleTouchJump}
        />
      )}

      {/* Pause Menu Modal */}
      {isPaused && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
          <div className="w-full max-w-sm bg-slate-900 border border-rose-500/30 text-white p-6 rounded-3xl shadow-2xl text-center space-y-4">
            <h3 className="text-xl font-bold text-rose-300">بازی متوقف شد ⏸️</h3>
            <div className="space-y-2">
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  setIsPaused(false);
                }}
                className="w-full py-3 rounded-2xl bg-gradient-to-r from-rose-600 to-pink-600 text-white font-bold text-sm shadow-md"
              >
                ادامه بازی ❤️
              </button>
              <FullscreenButton
                id="pause-fullscreen-btn"
                variant="button"
                className="w-full bg-slate-800 hover:bg-slate-700 text-rose-200 border border-slate-700"
              />
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  onReplayLevel();
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700"
              >
                شروع مجدد مرحله
              </button>
              <button
                onClick={() => {
                  soundEngine.playButtonClick();
                  onReturnToMenu();
                }}
                className="w-full py-3 rounded-2xl bg-slate-800 text-slate-300 font-semibold text-sm border border-slate-700"
              >
                بازگشت به منو
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Romantic Letter Popup Modal */}
      <LetterModal
        isOpen={activeLetterText !== null}
        letterText={activeLetterText || ''}
        onClose={() => setActiveLetterText(null)}
      />

      {/* Narrative Level Story Intro at Level Start (Typewriter effect) */}
      <LevelStoryIntro
        isOpen={showStoryIntro}
        levelId={levelConfig.id}
        title={levelConfig.title}
        subtitle={levelConfig.subtitle}
        storyText={levelConfig.introStoryText || levelConfig.description}
        onStart={() => setShowStoryIntro(false)}
      />

      {/* Level Victory Cutscene Modal (Typewriter resolution story) */}
      <LevelCompleteModal
        isOpen={isLevelComplete}
        levelId={levelConfig.id}
        storyText={levelConfig.endStoryText}
        subtext={levelConfig.endSubtext}
        score={hudState.score}
        letters={hudState.letters}
        hasNextLevel={levelConfig.id < 10}
        onNextLevel={onSelectNextLevel}
        onReplay={onReplayLevel}
        onMenu={onReturnToMenu}
      />

      {/* Game Over Modal */}
      <GameOverModal
        isOpen={isGameOver}
        onRetry={onReplayLevel}
        onMenu={onReturnToMenu}
      />
    </div>
  );
};
