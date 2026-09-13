import { Player, NiyoushaGoal, Collectible, Enemy, Platform, Checkpoint, LevelTheme } from '../types';

export class SpriteRenderer {
  // Draw Niyousha Character (Playable Player - Beautiful Girl with Long Flowing Hair)
  public static drawNiyoushaPlayer(ctx: CanvasRenderingContext2D, p: Player, gameTime: number) {
    ctx.save();
    ctx.translate(p.x + p.width / 2, p.y + p.height / 2);

    // Flip horizontal if facing left
    if (p.facing === 'left') {
      ctx.scale(-1, 1);
    }

    // Hurt flashing effect
    if (p.invulnerableTimer > 0 && Math.floor(gameTime * 20) % 2 === 0) {
      ctx.globalAlpha = 0.5;
    }

    const state = p.state;
    const isWalking = state === 'walk' || state === 'run';
    const isJumping = state === 'jump';
    const isFalling = state === 'fall';
    const isHurt = state === 'hurt';
    const isVictory = state === 'victory';

    // Dynamic Animation Offsets
    let legOffset = 0;
    let armOffset = 0;
    let hairSway = 0;
    let hairWave = 0;
    let bodyY = 0;
    let skirtSway = 0;

    if (isWalking) {
      const walkCycle = Math.sin(gameTime * 13);
      legOffset = walkCycle * 9;
      armOffset = walkCycle * 7;
      hairSway = -walkCycle * 7 - 5; // Flow backwards when running
      hairWave = Math.sin(gameTime * 16) * 4;
      skirtSway = walkCycle * 4;
      bodyY = Math.abs(walkCycle) * -2.5;
    } else if (isJumping) {
      legOffset = -5;
      armOffset = -14;
      hairSway = 12; // Hair flows down/back when jumping up
      hairWave = Math.sin(gameTime * 10) * 3;
      bodyY = -4;
    } else if (isFalling) {
      legOffset = 5;
      armOffset = 9;
      hairSway = -14; // Hair flutters upward when falling
      hairWave = Math.sin(gameTime * 12) * 4;
      bodyY = 3;
    } else if (isVictory) {
      bodyY = Math.sin(gameTime * 6) * 3 - 2;
      armOffset = -15;
      hairSway = Math.sin(gameTime * 4) * 4;
    } else {
      // Idle breathing
      bodyY = Math.sin(gameTime * 3) * 1.5;
      hairSway = Math.sin(gameTime * 2.5) * 3;
      hairWave = Math.cos(gameTime * 2) * 1.5;
    }

    // Soft Shadow on Ground
    ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
    ctx.beginPath();
    ctx.ellipse(0, p.height / 2 - 2, 15, 4.5, 0, 0, Math.PI * 2);
    ctx.fill();

    ctx.translate(0, bodyY);

    // ==========================================
    // 1. BACK HAIR (Long flowing cascading locks)
    // ==========================================
    const hairColor = '#241715'; // Silky deep dark chocolate chestnut
    const hairShine = '#4a2e2b';
    const hairHighlight = '#6b433e';

    ctx.fillStyle = hairColor;

    // Back main hair flow extending far below shoulders
    ctx.beginPath();
    ctx.moveTo(-13, -22);
    // Left flowing strand curve down to waist
    ctx.bezierCurveTo(
      -18 + hairSway * 0.8, -10,
      -20 + hairSway * 1.2, 8 + hairWave,
      -14 + hairSway * 1.5, 26 + hairWave
    );
    // Strand tips
    ctx.quadraticCurveTo(-10 + hairSway * 1.3, 29 + hairWave, -6 + hairSway * 1.1, 25);
    ctx.quadraticCurveTo(-2 + hairSway * 0.9, 30 + hairWave, 4 + hairSway * 0.7, 24);
    // Right flowing curve back up
    ctx.bezierCurveTo(
      14 + hairSway * 0.5, 12,
      16 + hairSway * 0.3, -8,
      13, -22
    );
    ctx.closePath();
    ctx.fill();

    // Additional layered long hair strands on left/back
    ctx.beginPath();
    ctx.moveTo(-16, -14);
    ctx.bezierCurveTo(
      -22 + hairSway * 1.1, 0,
      -24 + hairSway * 1.4, 16 + hairWave,
      -18 + hairSway * 1.6, 28 + hairWave
    );
    ctx.quadraticCurveTo(-14 + hairSway * 1.2, 26, -12 + hairSway * 0.9, 14);
    ctx.closePath();
    ctx.fillStyle = hairColor;
    ctx.fill();

    // Hair strand glossy highlights
    ctx.strokeStyle = hairHighlight;
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    ctx.moveTo(-14, -16);
    ctx.bezierCurveTo(-18 + hairSway * 0.7, -4, -17 + hairSway * 1.1, 12, -12 + hairSway * 1.3, 22);
    ctx.stroke();

    // ==========================================
    // 2. LEGS & STYLISH BOOTS
    // ==========================================
    // Legs / Thigh-highs (Chic Dark Coffee stockings)
    ctx.fillStyle = '#1e1b2e';
    // Left Leg
    ctx.beginPath();
    ctx.roundRect(-8 + legOffset * 0.5, 6, 5.5, 13, 2.5);
    ctx.fill();
    // Right Leg
    ctx.beginPath();
    ctx.roundRect(2.5 - legOffset * 0.5, 6, 5.5, 13, 2.5);
    ctx.fill();

    // Cute Rose-Gold / Blush Boots with ribbon laces
    ctx.fillStyle = '#f43f5e';
    ctx.beginPath();
    ctx.roundRect(-10 + legOffset * 0.5, 16, 8, 7, 3);
    ctx.roundRect(1.5 - legOffset * 0.5, 16, 8, 7, 3);
    ctx.fill();

    // Boot Soles & Laces
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(-10 + legOffset * 0.5, 21, 8, 2);
    ctx.rect(1.5 - legOffset * 0.5, 21, 8, 2);
    ctx.fill();
    // Tiny gold buckles
    ctx.fillStyle = '#fbbf24';
    ctx.fillRect(-8 + legOffset * 0.5, 18, 4, 1.5);
    ctx.fillRect(3.5 - legOffset * 0.5, 18, 4, 1.5);

    // ==========================================
    // 3. OUTFIT: PLEATED SKIRT & CUTE JACKET
    // ==========================================
    // Cute Pleated Skirt (Blush Rose / Cherry Blossom)
    ctx.fillStyle = '#f472b6';
    ctx.beginPath();
    ctx.moveTo(-12, 1);
    ctx.lineTo(12, 1);
    ctx.lineTo(14 + skirtSway, 9);
    ctx.lineTo(-14 + skirtSway, 9);
    ctx.closePath();
    ctx.fill();

    // Skirt pleat lines
    ctx.strokeStyle = '#db2777';
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-7 + skirtSway * 0.3, 1);
    ctx.lineTo(-9 + skirtSway * 0.8, 9);
    ctx.moveTo(0 + skirtSway * 0.5, 1);
    ctx.lineTo(0 + skirtSway, 9);
    ctx.moveTo(7 + skirtSway * 0.7, 1);
    ctx.lineTo(9 + skirtSway * 1.1, 9);
    ctx.stroke();

    // White Lace Trim on Skirt Bottom
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.rect(-14 + skirtSway, 8, 28, 2);
    ctx.fill();

    // Cute Cropped Romantic Cardigan / Jacket (Rose Pink & Pastel Cream)
    ctx.fillStyle = '#fb7185';
    ctx.beginPath();
    ctx.roundRect(-11, -11, 22, 13, 5);
    ctx.fill();

    // Inner White Blouse Collar
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.moveTo(-5, -11);
    ctx.lineTo(0, -6);
    ctx.lineTo(5, -11);
    ctx.fill();

    // Golden Heart Pendant / Locket Necklace 💛
    ctx.fillStyle = '#fbbf24';
    ctx.beginPath();
    ctx.arc(0, -5.5, 2, 0, Math.PI * 2);
    ctx.fill();

    // Arms
    ctx.fillStyle = '#f43f5e';
    // Back Arm
    ctx.beginPath();
    if (isVictory) {
      // Arms raised up in joy
      ctx.roundRect(-15, -18, 5, 12, 3);
    } else {
      ctx.roundRect(-14, -9 - armOffset * 0.5, 5, 12, 3);
    }
    ctx.fill();
    // Front Arm
    ctx.beginPath();
    if (isVictory) {
      ctx.roundRect(10, -18, 5, 12, 3);
    } else {
      ctx.roundRect(9, -9 + armOffset * 0.5, 5, 12, 3);
    }
    ctx.fill();

    // Delicate Hands
    ctx.fillStyle = '#fed7aa';
    ctx.beginPath();
    if (isVictory) {
      ctx.arc(-12.5, -18, 2.5, 0, Math.PI * 2);
      ctx.arc(12.5, -18, 2.5, 0, Math.PI * 2);
    } else {
      ctx.arc(-11.5, 3 - armOffset * 0.5, 2.3, 0, Math.PI * 2);
      ctx.arc(11.5, 3 + armOffset * 0.5, 2.3, 0, Math.PI * 2);
    }
    ctx.fill();

    // ==========================================
    // 4. HEAD & GORGEOUS FACE
    // ==========================================
    // Soft Fair Skin
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(0, -20, 12.5, 0, Math.PI * 2);
    ctx.fill();

    // Soft Cute Rosy Cheeks (Blush)
    const blushGrad1 = ctx.createRadialGradient(-5, -16, 0, -5, -16, 4.5);
    blushGrad1.addColorStop(0, 'rgba(251, 113, 133, 0.7)');
    blushGrad1.addColorStop(1, 'rgba(251, 113, 133, 0)');
    ctx.fillStyle = blushGrad1;
    ctx.beginPath();
    ctx.arc(-5, -16, 4.5, 0, Math.PI * 2);
    ctx.fill();

    const blushGrad2 = ctx.createRadialGradient(5, -16, 0, 5, -16, 4.5);
    blushGrad2.addColorStop(0, 'rgba(251, 113, 133, 0.7)');
    blushGrad2.addColorStop(1, 'rgba(251, 113, 133, 0)');
    ctx.fillStyle = blushGrad2;
    ctx.beginPath();
    ctx.arc(5, -16, 4.5, 0, Math.PI * 2);
    ctx.fill();

    // ==========================================
    // 5. BEAUTIFUL ANIME EYES & EXPRESSION
    // ==========================================
    if (isHurt) {
      // > < cute hurt eyes
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 2;
      ctx.beginPath();
      // Left eye
      ctx.moveTo(-6, -21);
      ctx.lineTo(-2, -19);
      ctx.lineTo(-6, -17);
      // Right eye
      ctx.moveTo(2, -19);
      ctx.lineTo(6, -21);
      ctx.moveTo(2, -19);
      ctx.lineTo(6, -17);
      ctx.stroke();

      // Small pout
      ctx.strokeStyle = '#e11d48';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(0, -13, 2.5, Math.PI, Math.PI * 2);
      ctx.stroke();
    } else if (isVictory) {
      // ^ ^ happy closed eyes with cute lashes
      ctx.strokeStyle = '#831843';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(-4, -18, 3.5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.arc(4, -18, 3.5, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();

      // Big joyful smile
      ctx.fillStyle = '#f43f5e';
      ctx.beginPath();
      ctx.arc(0, -15, 3.5, 0, Math.PI);
      ctx.fill();
    } else {
      // Gorgeous Sparkling Anime Eyes (Deep Warm Hazel with Violet sheen)
      const eyePositions = [-4, 4];
      eyePositions.forEach(ex => {
        // Upper Eyelash line (curved with winged flick)
        ctx.strokeStyle = '#261214';
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.arc(ex, -19.5, 3.8, Math.PI * 1.15, Math.PI * 1.85);
        ctx.stroke();
        // Wing flick
        ctx.beginPath();
        ctx.moveTo(ex + (ex > 0 ? 3 : -2), -20);
        ctx.lineTo(ex + (ex > 0 ? 4.5 : -3.5), -21.5);
        ctx.stroke();

        // Eye Iris (Deep Amber/Hazel gradient)
        ctx.fillStyle = '#451a03';
        ctx.beginPath();
        ctx.ellipse(ex, -18, 2.6, 3.4, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#b45309';
        ctx.beginPath();
        ctx.ellipse(ex, -17.5, 2.2, 2.4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Eye Pupil
        ctx.fillStyle = '#1c1917';
        ctx.beginPath();
        ctx.arc(ex, -18, 1.4, 0, Math.PI * 2);
        ctx.fill();

        // Big Main Sparkle / Catchlight ✨
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(ex - 0.8, -19.5, 1.1, 0, Math.PI * 2);
        ctx.fill();

        // Secondary small bottom twinkle
        ctx.beginPath();
        ctx.arc(ex + 0.9, -17, 0.6, 0, Math.PI * 2);
        ctx.fill();
      });

      // Cute delicate sweet smile
      ctx.strokeStyle = '#be123c';
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.arc(0, -14.5, 2.2, 0.1, Math.PI * 0.9);
      ctx.stroke();
    }

    // ==========================================
    // 6. FRONT HAIR (Cute Bangs, Side Locks & Silk Sheen)
    // ==========================================
    ctx.fillStyle = hairColor;

    // Top hair volume / Crown
    ctx.beginPath();
    ctx.arc(0, -22, 13.5, Math.PI * 0.8, Math.PI * 2.2);
    ctx.fill();

    // Side long framing locks curving around the cheeks
    ctx.beginPath();
    ctx.moveTo(-11, -22);
    ctx.quadraticCurveTo(-14 + hairSway * 0.3, -12, -10 + hairSway * 0.4, 2);
    ctx.quadraticCurveTo(-8 + hairSway * 0.2, -10, -7, -19);
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(11, -22);
    ctx.quadraticCurveTo(14 + hairSway * 0.3, -12, 10 + hairSway * 0.4, 2);
    ctx.quadraticCurveTo(8 + hairSway * 0.2, -10, 7, -19);
    ctx.fill();

    // Front Anime Bangs (Layered sweeping fringe)
    ctx.beginPath();
    ctx.moveTo(-11, -23);
    ctx.quadraticCurveTo(-6, -21, -3, -16);
    ctx.quadraticCurveTo(-1, -22, 1, -15);
    ctx.quadraticCurveTo(4, -22, 7, -16);
    ctx.quadraticCurveTo(9, -21, 11, -23);
    ctx.lineTo(11, -27);
    ctx.lineTo(-11, -27);
    ctx.closePath();
    ctx.fill();

    // Hair Top Silk Gloss (Angel Halo Sheen)
    ctx.strokeStyle = 'rgba(255, 214, 219, 0.65)';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, -25, 9.5, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // ==========================================
    // 7. HAIR ACCESSORIES (Cute Rose Flower & Satin Ribbon)
    // ==========================================
    // Silk Ribbon / Bow on side of hair
    ctx.fillStyle = '#f43f5e';
    // Ribbon loops
    ctx.beginPath();
    ctx.ellipse(-9, -26, 4, 2.5, -Math.PI / 4, 0, Math.PI * 2);
    ctx.ellipse(-5, -28, 4, 2.5, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();
    // Ribbon tails
    ctx.beginPath();
    ctx.moveTo(-8, -25);
    ctx.lineTo(-12 + hairSway * 0.4, -20);
    ctx.lineTo(-7, -23);
    ctx.lineTo(-5 + hairSway * 0.3, -18);
    ctx.closePath();
    ctx.fill();

    // Center Gold Pearl on Ribbon 🌸
    ctx.fillStyle = '#fef08a';
    ctx.beginPath();
    ctx.arc(-7, -26.5, 2, 0, Math.PI * 2);
    ctx.fill();

    // ==========================================
    // 8. VICTORY / SPECIAL EFFECTS
    // ==========================================
    if (isVictory) {
      // Floating hearts and sparkles around Niyousha
      const heartY = Math.sin(gameTime * 6) * 4 - 36;
      ctx.font = '16px sans-serif';
      ctx.fillText('💖', -8, heartY);
      ctx.font = '12px sans-serif';
      ctx.fillText('✨', 8, heartY - 4);
      ctx.fillText('🌸', -18, heartY + 12);
      ctx.fillText('🌸', 14, heartY + 14);
    }

    ctx.restore();
  }

  // Draw Hasan Goal Character (Waiting at the Finish Line with Rose & Open Arms)
  public static drawHasanGoal(ctx: CanvasRenderingContext2D, goal: NiyoushaGoal, gameTime: number) {
    ctx.save();
    ctx.translate(goal.x + goal.width / 2, goal.y + goal.height / 2);

    const bobY = Math.sin(gameTime * 2.5) * 2;
    ctx.translate(0, bobY);

    // Shadow
    ctx.fillStyle = 'rgba(0, 0, 0, 0.2)';
    ctx.beginPath();
    ctx.ellipse(0, goal.height / 2 - 2, 14, 4, 0, 0, Math.PI * 2);
    ctx.fill();

    // Legs (Royal Blue Jeans)
    ctx.fillStyle = '#2563eb';
    ctx.beginPath();
    ctx.roundRect(-8, 6, 6, 14, 3);
    ctx.roundRect(2, 6, 6, 14, 3);
    ctx.fill();

    // Shoes (Charcoal)
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.roundRect(-10, 17, 8, 5, 2);
    ctx.roundRect(2, 17, 8, 5, 2);
    ctx.fill();

    // Body (Romantic Red Hoodie / Jacket)
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.roundRect(-12, -10, 24, 18, 5);
    ctx.fill();

    // Heart Logo on Chest
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-2, -3, 2.5, 0, Math.PI * 2);
    ctx.arc(2, -3, 2.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.moveTo(-4.5, -2);
    ctx.lineTo(0, 2.5);
    ctx.lineTo(4.5, -2);
    ctx.fill();

    // Arms - One holding a rose, one waving
    ctx.fillStyle = '#be123c';
    // Left arm
    ctx.beginPath();
    ctx.roundRect(-15, -8, 5, 12, 3);
    ctx.fill();
    // Right arm raised holding rose
    const waveOffset = Math.sin(gameTime * 4) * 3;
    ctx.beginPath();
    ctx.roundRect(10, -12 + waveOffset, 5, 12, 3);
    ctx.fill();

    // Red Rose in Hand 🌹
    ctx.fillStyle = '#e11d48';
    ctx.beginPath();
    ctx.arc(13, -15 + waveOffset, 3.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#16a34a'; // Green stem/leaf
    ctx.beginPath();
    ctx.arc(14, -13 + waveOffset, 1.5, 0, Math.PI * 2);
    ctx.fill();

    // Head
    ctx.fillStyle = '#ffedd5';
    ctx.beginPath();
    ctx.arc(0, -19, 12, 0, Math.PI * 2);
    ctx.fill();

    // Stylish Modern Hair (Soft dark brown with highlights)
    ctx.fillStyle = '#291811';
    ctx.beginPath();
    ctx.arc(0, -22, 12.5, Math.PI * 0.9, Math.PI * 2.1);
    ctx.fill();
    // Front styled hair layers
    ctx.beginPath();
    ctx.moveTo(-11, -22);
    ctx.quadraticCurveTo(-6, -18, -3, -16);
    ctx.quadraticCurveTo(0, -19, 3, -15);
    ctx.quadraticCurveTo(7, -19, 11, -22);
    ctx.lineTo(11, -26);
    ctx.lineTo(-11, -26);
    ctx.closePath();
    ctx.fill();
    // Hair highlight
    ctx.strokeStyle = '#573322';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -24, 8, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Eyes (Smiling Warmly with Sparkles)
    ctx.strokeStyle = '#1c1917';
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(-4, -18.5, 3, Math.PI * 1.15, Math.PI * 1.85);
    ctx.arc(4, -18.5, 3, Math.PI * 1.15, Math.PI * 1.85);
    ctx.stroke();

    // Eye Iris (Warm Amber / Espresso)
    ctx.fillStyle = '#382216';
    ctx.beginPath();
    ctx.arc(-4, -17.5, 2, 0, Math.PI * 2);
    ctx.arc(4, -17.5, 2, 0, Math.PI * 2);
    ctx.fill();
    // Sparkle catchlights ✨
    ctx.fillStyle = '#ffffff';
    ctx.beginPath();
    ctx.arc(-4.7, -18.3, 0.8, 0, Math.PI * 2);
    ctx.arc(3.3, -18.3, 0.8, 0, Math.PI * 2);
    ctx.fill();

    // Warm Happy Smile
    ctx.strokeStyle = '#991b1b';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(0, -14, 2.8, 0.1, Math.PI * 0.9);
    ctx.stroke();

    // Blushing cheeks
    ctx.fillStyle = 'rgba(244, 63, 94, 0.4)';
    ctx.beginPath();
    ctx.arc(-5, -15, 3, 0, Math.PI * 2);
    ctx.arc(5, -15, 3, 0, Math.PI * 2);
    ctx.fill();

    // Floating Hearts effect around Hasan
    for (let i = 0; i < 3; i++) {
      const hAngle = gameTime * 2 + (i * Math.PI * 2) / 3;
      const hx = Math.cos(hAngle) * 22;
      const hy = -30 + Math.sin(hAngle * 1.5) * 6;
      ctx.fillStyle = '#f43f5e';
      ctx.font = '12px sans-serif';
      ctx.fillText('❤️', hx - 6, hy);
    }

    // Name tag badge above Hasan
    ctx.fillStyle = 'rgba(225, 29, 72, 0.85)';
    ctx.beginPath();
    ctx.roundRect(-22, -48, 44, 16, 8);
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 9px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('حسن ❤️', 0, -36);
    ctx.textAlign = 'left';

    ctx.restore();
  }

  // Backwards compatibility aliases
  public static drawHasan(ctx: CanvasRenderingContext2D, p: Player, gameTime: number) {
    SpriteRenderer.drawNiyoushaPlayer(ctx, p, gameTime);
  }

  public static drawNiyousha(ctx: CanvasRenderingContext2D, goal: NiyoushaGoal, gameTime: number) {
    SpriteRenderer.drawHasanGoal(ctx, goal, gameTime);
  }

  // Draw Enemies
  public static drawEnemy(ctx: CanvasRenderingContext2D, e: Enemy, gameTime: number) {
    if (!e.active || e.defeated) return;

    ctx.save();
    ctx.translate(e.x + e.width / 2, e.y + e.height / 2);

    const bobY = Math.sin(gameTime * 4 + e.x) * 2;
    ctx.translate(0, bobY);

    if (e.type === 'qahr') {
      // "قهر": Cute pouting monster
      ctx.fillStyle = '#ef4444';
      ctx.beginPath();
      ctx.arc(0, 0, e.width / 2 - 2, 0, Math.PI * 2);
      ctx.fill();

      // Angry Pouting Eyebrows
      ctx.strokeStyle = '#7f1d1d';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(-10, -8);
      ctx.lineTo(-2, -4);
      ctx.moveTo(10, -8);
      ctx.lineTo(2, -4);
      ctx.stroke();

      // Eyes
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-6, -2, 4, 0, Math.PI * 2);
      ctx.arc(6, -2, 4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-5, -2, 2, 0, Math.PI * 2);
      ctx.arc(7, -2, 2, 0, Math.PI * 2);
      ctx.fill();

      // Pouting mouth
      ctx.strokeStyle = '#7f1d1d';
      ctx.beginPath();
      ctx.arc(0, 8, 4, Math.PI, Math.PI * 2);
      ctx.stroke();
    } else if (e.type === 'payam_nadide') {
      // "پیام ندیده": Unread envelope with wings & red badge
      ctx.fillStyle = '#fef08a';
      ctx.beginPath();
      ctx.roundRect(-e.width / 2, -e.height / 3, e.width, e.height * 0.7, 4);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Envelope flap
      ctx.beginPath();
      ctx.moveTo(-e.width / 2, -e.height / 3);
      ctx.lineTo(0, 2);
      ctx.lineTo(e.width / 2, -e.height / 3);
      ctx.stroke();

      // Wings
      const wingY = Math.sin(gameTime * 12) * 4;
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.ellipse(-e.width / 2 - 4, -4 + wingY, 8, 4, Math.PI / 4, 0, Math.PI * 2);
      ctx.ellipse(e.width / 2 + 4, -4 + wingY, 8, 4, -Math.PI / 4, 0, Math.PI * 2);
      ctx.fill();

      // Unread "!" Badge
      ctx.fillStyle = '#dc2626';
      ctx.beginPath();
      ctx.arc(8, -e.height / 3 - 2, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('1', 6, -e.height / 3 + 1);
    } else if (e.type === 'javabe_khoshk') {
      // "جواب خشک": Ice block character
      ctx.fillStyle = '#93c5fd';
      ctx.beginPath();
      ctx.roundRect(-e.width / 2, -e.height / 2, e.width, e.height, 6);
      ctx.fill();
      ctx.strokeStyle = '#3b82f6';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Neutral bored eyes
      ctx.fillStyle = '#1e3a8a';
      ctx.beginPath();
      ctx.rect(-8, -4, 5, 2);
      ctx.rect(3, -4, 5, 2);
      ctx.fill();

      // Flat straight mouth
      ctx.beginPath();
      ctx.rect(-5, 4, 10, 2);
      ctx.fill();
    } else if (e.type === 'rooze_bad') {
      // "روز بد": Dark Cloud dropping raindrops
      ctx.fillStyle = '#475569';
      ctx.beginPath();
      ctx.arc(-10, 0, 14, 0, Math.PI * 2);
      ctx.arc(5, -6, 16, 0, Math.PI * 2);
      ctx.arc(14, 2, 12, 0, Math.PI * 2);
      ctx.fill();

      // Angry little eyes
      ctx.fillStyle = '#f87171';
      ctx.beginPath();
      ctx.arc(-4, -2, 2.5, 0, Math.PI * 2);
      ctx.arc(6, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();

      // Dropping raindrops
      for (let i = 0; i < 3; i++) {
        const dropY = (gameTime * 40 + i * 15) % 20;
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(-10 + i * 10, 10 + dropY, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (e.type === 'delkhori' || e.type === 'fasoleh') {
      // Spiky Heart / Gap hazard
      ctx.fillStyle = '#9333ea';
      ctx.font = '24px sans-serif';
      ctx.fillText(e.type === 'fasoleh' ? '🚧' : '💔', -12, 8);
    } else if (e.type === 'estres') {
      // "استرس": Vibrating alarm clock / stress monster
      const shakeX = (Math.sin(gameTime * 30) * 1.5);
      ctx.translate(shakeX, 0);

      // Clock Body
      ctx.fillStyle = '#f97316';
      ctx.beginPath();
      ctx.arc(0, 0, e.width / 2 - 2, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#c2410c';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Bells on top
      ctx.fillStyle = '#ea580c';
      ctx.beginPath();
      ctx.arc(-8, -12, 4, 0, Math.PI * 2);
      ctx.arc(8, -12, 4, 0, Math.PI * 2);
      ctx.fill();

      // Sweating face
      ctx.fillStyle = '#ffffff';
      ctx.beginPath();
      ctx.arc(-5, -2, 3, 0, Math.PI * 2);
      ctx.arc(5, -2, 3, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#000000';
      ctx.beginPath();
      ctx.arc(-5, -2, 1.5, 0, Math.PI * 2);
      ctx.arc(5, -2, 1.5, 0, Math.PI * 2);
      ctx.fill();

      // Sweat drop
      ctx.fillStyle = '#38bdf8';
      ctx.beginPath();
      ctx.arc(10, -6, 2, 0, Math.PI * 2);
      ctx.fill();
    } else if (e.type === 'souetafahom') {
      // "سوءتفاهم": Puzzled swirl / knot creature
      ctx.fillStyle = '#8b5cf6';
      ctx.beginPath();
      ctx.arc(0, 0, e.width / 2 - 1, 0, Math.PI * 2);
      ctx.fill();

      // Question mark above
      ctx.fillStyle = '#fde047';
      ctx.font = 'bold 13px sans-serif';
      ctx.fillText('❓', -7, -e.height / 2);

      // Spiral eyes
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(-5, -2, 3, 0, Math.PI * 1.5);
      ctx.arc(5, -2, 3, 0, Math.PI * 1.5);
      ctx.stroke();
    } else if (e.type === 'hesadat') {
      // "حسادت": Green bat creature
      ctx.fillStyle = '#10b981';
      ctx.beginPath();
      ctx.arc(0, 0, e.width / 2 - 3, 0, Math.PI * 2);
      ctx.fill();

      // Bat wings
      const wingFlap = Math.sin(gameTime * 15) * 6;
      ctx.fillStyle = '#059669';
      ctx.beginPath();
      ctx.moveTo(-e.width / 2, 0);
      ctx.lineTo(-e.width / 2 - 10, -8 + wingFlap);
      ctx.lineTo(-e.width / 2 - 2, 6);
      ctx.closePath();
      ctx.fill();

      ctx.beginPath();
      ctx.moveTo(e.width / 2, 0);
      ctx.lineTo(e.width / 2 + 10, -8 + wingFlap);
      ctx.lineTo(e.width / 2 + 2, 6);
      ctx.closePath();
      ctx.fill();

      // Envious glowing eyes
      ctx.fillStyle = '#facc15';
      ctx.beginPath();
      ctx.arc(-4, -2, 2.5, 0, Math.PI * 2);
      ctx.arc(4, -2, 2.5, 0, Math.PI * 2);
      ctx.fill();
    } else if (e.type === 'bi_hoselegi') {
      // "بی‌حوصلگی": Sleepy snail/slug with Zzz
      ctx.fillStyle = '#94a3b8';
      ctx.beginPath();
      ctx.roundRect(-e.width / 2, -4, e.width, 16, [6, 6, 2, 2]);
      ctx.fill();

      // Shell
      ctx.fillStyle = '#cbd5e1';
      ctx.beginPath();
      ctx.arc(0, -6, 10, 0, Math.PI * 2);
      ctx.fill();

      // Sleepy eyes (- -)
      ctx.fillStyle = '#475569';
      ctx.fillRect(-6, 2, 4, 1.5);
      ctx.fillRect(2, 2, 4, 1.5);

      // Zzz floating
      const zOffset = (gameTime * 10) % 15;
      ctx.fillStyle = '#a855f7';
      ctx.font = 'bold 9px sans-serif';
      ctx.fillText('z', 8, -8 - zOffset * 0.5);
      ctx.fillText('Z', 12, -14 - zOffset * 0.8);
    }

    // Label tag above enemy
    ctx.fillStyle = 'rgba(15, 23, 42, 0.75)';
    ctx.beginPath();
    ctx.roundRect(-e.label.length * 5 - 4, -e.height / 2 - 18, e.label.length * 10 + 8, 14, 4);
    ctx.fill();
    ctx.fillStyle = '#f8fafc';
    ctx.font = '10px Vazirmatn, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(e.label, 0, -e.height / 2 - 7);
    ctx.textAlign = 'left';

    ctx.restore();
  }

  // Draw Collectibles
  public static drawCollectible(ctx: CanvasRenderingContext2D, c: Collectible, gameTime: number) {
    if (c.collected) return;

    ctx.save();
    ctx.translate(c.x + c.width / 2, c.y + c.height / 2);

    const floatY = Math.sin(gameTime * 3 + c.x) * 4;
    ctx.translate(0, floatY);

    // Glowing aura ring
    const auraColor = c.type === 'heart' ? 'rgba(244, 63, 94, 0.3)' : c.type === 'memory' ? 'rgba(168, 85, 247, 0.4)' : 'rgba(251, 191, 36, 0.3)';
    ctx.fillStyle = auraColor;
    ctx.beginPath();
    ctx.arc(0, 0, c.width / 2 + 6 + Math.sin(gameTime * 5) * 2, 0, Math.PI * 2);
    ctx.fill();

    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    if (c.type === 'heart') {
      ctx.font = `${c.width}px sans-serif`;
      ctx.fillText('❤️', 0, 2);
    } else if (c.type === 'letter') {
      ctx.font = `${c.width}px sans-serif`;
      ctx.fillText('💌', 0, 2);
    } else if (c.type === 'gift') {
      ctx.font = `${c.width}px sans-serif`;
      ctx.fillText('🎁', 0, 2);
    } else if (c.type === 'flower') {
      ctx.font = `${c.width}px sans-serif`;
      ctx.fillText('🌹', 0, 2);
    } else if (c.type === 'memory') {
      ctx.font = `${c.width + 4}px sans-serif`;
      ctx.fillText('📸', 0, 2);
    } else if (c.type === 'star') {
      ctx.font = `${c.width}px sans-serif`;
      ctx.fillText('⭐', 0, 2);
    }

    ctx.textAlign = 'left';
    ctx.textBaseline = 'alphabetic';
    ctx.restore();
  }

  // Draw Checkpoints
  public static drawCheckpoint(ctx: CanvasRenderingContext2D, cp: Checkpoint, gameTime: number) {
    ctx.save();
    ctx.translate(cp.x, cp.y);

    // Flag pole
    ctx.fillStyle = '#64748b';
    ctx.fillRect(0, -50, 4, 50);

    // Flag base
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.ellipse(2, 0, 10, 3, 0, 0, Math.PI * 2);
    ctx.fill();

    // Heart Flag on Top
    const waveX = Math.sin(gameTime * 4) * 3;
    ctx.fillStyle = cp.reached ? '#f43f5e' : '#94a3b8';
    ctx.beginPath();
    ctx.moveTo(4, -50);
    ctx.lineTo(28 + waveX, -40);
    ctx.lineTo(4, -30);
    ctx.closePath();
    ctx.fill();

    // Heart icon on flag
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px sans-serif';
    ctx.fillText(cp.reached ? '❤️' : '🤍', 8, -37);

    // Glowing aura if reached
    if (cp.reached) {
      ctx.fillStyle = 'rgba(244, 63, 94, 0.3)';
      ctx.beginPath();
      ctx.arc(2, -50, 10 + Math.sin(gameTime * 6) * 3, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  // Draw Platforms
  public static drawPlatform(ctx: CanvasRenderingContext2D, p: Platform, theme: LevelTheme) {
    ctx.save();

    if (p.type === 'solid') {
      // Main solid platform
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
      grad.addColorStop(0, p.color || theme.platformColor);
      grad.addColorStop(1, theme.groundColor);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 6);
      ctx.fill();

      // Top decorative edge
      ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      ctx.fillRect(p.x + 2, p.y, p.width - 4, 3);
    } else if (p.type === 'moving') {
      // Shiny moving platform
      ctx.fillStyle = p.color || '#fef08a';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 8);
      ctx.fill();
      ctx.strokeStyle = '#eab308';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Little heart pattern on moving platform
      ctx.fillStyle = '#e11d48';
      for (let x = p.x + 15; x < p.x + p.width - 10; x += 25) {
        ctx.font = '10px sans-serif';
        ctx.fillText('❤️', x, p.y + 15);
      }
    } else if (p.type === 'cloud') {
      // Fluffy cloud platform
      ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
      ctx.beginPath();
      ctx.arc(p.x + 15, p.y + 12, 14, 0, Math.PI * 2);
      ctx.arc(p.x + 35, p.y + 8, 16, 0, Math.PI * 2);
      ctx.arc(p.x + p.width - 35, p.y + 8, 16, 0, Math.PI * 2);
      ctx.arc(p.x + p.width - 15, p.y + 12, 14, 0, Math.PI * 2);
      ctx.rect(p.x + 15, p.y + 8, p.width - 30, 16);
      ctx.fill();
    } else if (p.type === 'bouncy') {
      // Bouncy Spring / Trampoline Platform
      ctx.fillStyle = '#ec4899';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y + 4, p.width, p.height - 4, 8);
      ctx.fill();
      ctx.strokeStyle = '#f43f5e';
      ctx.lineWidth = 2;
      ctx.stroke();

      // Top bouncy cushion
      ctx.fillStyle = '#fb7185';
      ctx.beginPath();
      ctx.roundRect(p.x + 2, p.y, p.width - 4, 6, 3);
      ctx.fill();

      // Up arrows / Spring indicator
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 11px sans-serif';
      ctx.textAlign = 'center';
      for (let x = p.x + 20; x < p.x + p.width - 10; x += 30) {
        ctx.fillText('⬆️', x, p.y + p.height - 3);
      }
      ctx.textAlign = 'left';
    } else if (p.type === 'wood') {
      // Warm Wood Planks
      ctx.fillStyle = '#854d0e';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 4);
      ctx.fill();
      ctx.strokeStyle = '#713f12';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Wood plank lines
      ctx.strokeStyle = 'rgba(254, 240, 138, 0.2)';
      for (let x = p.x + 25; x < p.x + p.width; x += 25) {
        ctx.beginPath();
        ctx.moveTo(x, p.y);
        ctx.lineTo(x, p.y + p.height);
        ctx.stroke();
      }
    } else if (p.type === 'neon') {
      // Glowing Cyber/City Neon Platform
      ctx.fillStyle = '#0f172a';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 6);
      ctx.fill();
      ctx.strokeStyle = p.color || '#38bdf8';
      ctx.lineWidth = 2.5;
      ctx.stroke();

      // Glowing Neon Top Line
      ctx.fillStyle = p.color || '#38bdf8';
      ctx.fillRect(p.x + 4, p.y, p.width - 8, 3);
    } else if (p.type === 'ice') {
      // Frosted Crystal Ice Platform
      ctx.fillStyle = 'rgba(186, 230, 253, 0.85)';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 5);
      ctx.fill();
      ctx.strokeStyle = '#7dd3fc';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Ice glimmers
      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      for (let x = p.x + 15; x < p.x + p.width - 10; x += 35) {
        ctx.fillText('❄️', x, p.y + 14);
      }
    } else if (p.type === 'flower') {
      // Flower / Lilypad Platform
      ctx.fillStyle = '#15803d';
      ctx.beginPath();
      ctx.roundRect(p.x, p.y + 4, p.width, p.height - 4, 10);
      ctx.fill();

      // Flower petal on top
      ctx.fillStyle = '#f43f5e';
      ctx.font = '14px sans-serif';
      ctx.fillText('🌸', p.x + 6, p.y + 14);
      ctx.fillText('🌸', p.x + p.width - 20, p.y + 14);
    } else if (p.type === 'golden') {
      // Royal Shimmering Gold Platform
      const grad = ctx.createLinearGradient(p.x, p.y, p.x, p.y + p.height);
      grad.addColorStop(0, '#fef08a');
      grad.addColorStop(0.5, '#eab308');
      grad.addColorStop(1, '#a16207');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(p.x, p.y, p.width, p.height, 6);
      ctx.fill();
      ctx.strokeStyle = '#ca8a04';
      ctx.lineWidth = 2;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = '10px sans-serif';
      ctx.fillText('👑', p.x + p.width / 2 - 6, p.y + 13);
    }

    ctx.restore();
  }

  // Draw Background Atmosphere & Parallax Weather
  public static drawBackground(
    ctx: CanvasRenderingContext2D,
    theme: LevelTheme,
    width: number,
    height: number,
    cameraX: number,
    gameTime: number
  ) {
    // Sky Gradient
    const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
    skyGrad.addColorStop(0, theme.skyGradient[0]);
    skyGrad.addColorStop(1, theme.skyGradient[1]);
    ctx.fillStyle = skyGrad;
    ctx.fillRect(0, 0, width, height);

    // Weather / Atmosphere effects
    if (theme.weather === 'sakura') {
      // Floating Pink Petals
      ctx.fillStyle = 'rgba(251, 207, 232, 0.7)';
      for (let i = 0; i < 40; i++) {
        const px = ((i * 137 + gameTime * 30 + cameraX * 0.1) % (width + 100)) - 50;
        const py = (i * 83 + gameTime * 20) % height;
        ctx.beginPath();
        ctx.ellipse(px, py, 4, 2, Math.sin(gameTime + i), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme.weather === 'night_lights') {
      // City lights & warm Bokeh circles
      for (let i = 0; i < 25; i++) {
        const bx = ((i * 180 - cameraX * 0.2) % (width + 100)) + 50;
        const by = 150 + (i % 5) * 60 + Math.sin(gameTime + i) * 10;
        ctx.fillStyle = `rgba(254, 240, 138, ${0.15 + (i % 3) * 0.1})`;
        ctx.beginPath();
        ctx.arc(bx, by, 15 + (i % 4) * 8, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme.weather === 'rain') {
      // Rain lines
      ctx.strokeStyle = 'rgba(186, 230, 253, 0.4)';
      ctx.lineWidth = 1.2;
      for (let i = 0; i < 60; i++) {
        const rx = ((i * 97 - cameraX * 0.4 + gameTime * 150) % (width + 100)) - 50;
        const ry = (i * 61 + gameTime * 400) % height;
        ctx.beginPath();
        ctx.moveTo(rx, ry);
        ctx.lineTo(rx - 4, ry + 15);
        ctx.stroke();
      }
    } else if (theme.weather === 'stars') {
      // Twinkling Stars
      for (let i = 0; i < 50; i++) {
        const sx = (i * 149 - cameraX * 0.15) % width;
        const sy = (i * 73) % (height * 0.7);
        const alpha = 0.3 + Math.sin(gameTime * 4 + i) * 0.4;
        ctx.fillStyle = `rgba(255, 255, 255, ${Math.max(0.1, alpha)})`;
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3) + 1, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme.weather === 'sunset') {
      // Floating warm hearts atmosphere
      for (let i = 0; i < 20; i++) {
        const hx = ((i * 173 - cameraX * 0.1) % (width + 50)) - 20;
        const hy = ((i * 91 - gameTime * 15) % height + height) % height;
        ctx.fillStyle = `rgba(244, 63, 94, ${0.2 + (i % 3) * 0.1})`;
        ctx.font = `${12 + (i % 4) * 4}px sans-serif`;
        ctx.fillText('❤️', hx, hy);
      }
    } else if (theme.weather === 'snow') {
      // Floating romantic Snowflakes
      ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
      for (let i = 0; i < 45; i++) {
        const sx = ((i * 127 + Math.sin(gameTime + i) * 20 - cameraX * 0.2) % (width + 60)) - 30;
        const sy = (i * 71 + gameTime * 45) % height;
        ctx.beginPath();
        ctx.arc(sx, sy, (i % 3) + 1.5, 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme.weather === 'autumn') {
      // Golden / Orange Autumn falling leaves
      for (let i = 0; i < 35; i++) {
        const lx = ((i * 143 + Math.sin(gameTime * 2 + i) * 35 - cameraX * 0.25) % (width + 60)) - 30;
        const ly = (i * 67 + gameTime * 50) % height;
        ctx.fillStyle = i % 2 === 0 ? 'rgba(249, 115, 22, 0.75)' : 'rgba(234, 179, 8, 0.75)';
        ctx.beginPath();
        ctx.ellipse(lx, ly, 5, 2.5, Math.sin(gameTime * 2 + i), 0, Math.PI * 2);
        ctx.fill();
      }
    } else if (theme.weather === 'hearts') {
      // Shimmering Golden Love Hearts Galaxy
      for (let i = 0; i < 30; i++) {
        const hx = ((i * 157 + Math.sin(gameTime + i) * 15 - cameraX * 0.15) % (width + 60)) - 20;
        const hy = ((i * 83 - gameTime * 30) % height + height) % height;
        const size = 12 + (i % 4) * 5;
        ctx.font = `${size}px sans-serif`;
        ctx.fillText(i % 3 === 0 ? '💖' : i % 3 === 1 ? '✨' : '👑', hx, hy);
      }
    }
  }
}
