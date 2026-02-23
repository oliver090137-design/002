import { Player } from './classes/Player';
import { Monster } from './classes/Monster';
import { Entity } from './classes/Entity';
import { ClassType } from './types';

class FloatingText {
  x: number;
  y: number;
  text: string;
  color: string;
  life: number = 1000; // ms
  velocity: { x: number, y: number };

  constructor(x: number, y: number, text: string, color: string) {
    this.x = x;
    this.y = y;
    this.text = text;
    this.color = color;
    this.velocity = {
      x: (Math.random() - 0.5) * 20,
      y: -30 - Math.random() * 20
    };
  }

  update(dt: number) {
    this.life -= dt;
    this.x += this.velocity.x * (dt / 1000);
    this.y += this.velocity.y * (dt / 1000);
    this.velocity.y += 50 * (dt / 1000); // Gravity
  }
}

export class GameEngine {
  player: Player | null = null;
  monsters: Monster[] = [];
  floatingTexts: FloatingText[] = [];
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lastTime: number = 0;
  isRunning: boolean = false;
  animationFrameId: number | null = null;
  
  // Camera
  camera = { x: 0, y: 0 };

  // AI Throttling
  private aiUpdateInterval: number = 100;
  private lastAIUpdate: number = 0;

  // UI Callback
  onUpdate: ((player: Player) => void) | null = null;

  constructor(canvas: HTMLCanvasElement, onUpdate?: (player: Player) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    if (onUpdate) this.onUpdate = onUpdate;
    
    this.resize();
    
    // Bind methods
    this.loop = this.loop.bind(this);
    this.handleInput = this.handleInput.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // Input listeners
    this.canvas.addEventListener('mousedown', this.handleInput);
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('resize', this.handleResize);
  }

  destroy() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.canvas.removeEventListener('mousedown', this.handleInput);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startGame(classType: ClassType) {
    this.player = new Player('player', classType, 0, 0);
    this.monsters = [];
    
    // Spawn some monsters
    for (let i = 0; i < 10; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 200 + Math.random() * 500;
      const mx = Math.cos(angle) * dist;
      const my = Math.sin(angle) * dist;
      this.monsters.push(new Monster(`orc_${i}`, mx, my));
    }

    this.isRunning = true;
    this.lastTime = performance.now();
    this.loop(this.lastTime);
  }

  loop(time: number) {
    if (!this.isRunning) return;
    
    const dt = time - this.lastTime;
    this.lastTime = time;

    this.update(dt);
    this.render();

    if (this.player && this.onUpdate) {
      this.onUpdate(this.player);
    }

    this.animationFrameId = requestAnimationFrame(this.loop);
  }

  update(dt: number) {
    if (!this.player) return;

    // Update Player
    this.player.update(dt);

    // Handle Player Auto-Attack
    if (this.player.target && !this.player.target.isDead) {
      const dist = Math.hypot(
        this.player.target.position.x - this.player.position.x,
        this.player.target.position.y - this.player.position.y
      );
      
      if (dist <= this.player.stats.attackRange) {
        this.performAttack(this.player, this.player.target);
      } else {
        // Move to target (handled in Player.update, but ensuring targetPosition is set)
        this.player.targetPosition = {
          x: this.player.target.position.x,
          y: this.player.target.position.y
        };
      }
    }

    // Update Monsters
    this.monsters.forEach(monster => {
      // AI disabled for now
      // monster.updateAI(dt, this.player!, performance.now());
      monster.update(dt);
    });

    // Remove dead monsters
    this.monsters = this.monsters.filter(m => !m.isDead);

    // Update Floating Texts
    this.floatingTexts.forEach(ft => ft.update(dt));
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);

    // Update Camera
    this.camera.x = this.player.position.x - this.canvas.width / 2;
    this.camera.y = this.player.position.y - this.canvas.height / 2;
  }

  performAttack(attacker: Entity, target: Entity) {
    const now = performance.now();
    
    // Check cooldown
    if (!attacker.canAttack(now)) {
      return;
    }
    
    attacker.lastAttackTime = now;
    
    // Calculate Damage
    const baseDamage = attacker.stats.strength || 10;
    const defense = target.stats.defense || 0;
    const damage = Math.max(1, baseDamage - defense);
    
    target.takeDamage(damage);
    
    // Spawn Floating Text
    this.floatingTexts.push(new FloatingText(
      target.position.x,
      target.position.y - target.radius - 10,
      `-${damage}`,
      attacker === this.player ? '#ffff00' : '#ff4444'
    ));
  }

  render() {
    // Clear background
    this.ctx.fillStyle = '#160b0c';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Apply Camera Transform
    this.ctx.translate(-this.camera.x, -this.camera.y);

    // Draw Grid
    this.drawGrid();

    // Draw Monsters
    this.monsters.forEach(monster => this.drawEntity(monster));

    // Draw Player
    if (this.player) {
      this.drawEntity(this.player);
      
      // Draw target indicator
      if (this.player.target) {
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.beginPath();
        this.ctx.arc(this.player.target.position.x, this.player.target.position.y, this.player.target.radius + 5, 0, Math.PI * 2);
        this.ctx.stroke();
      }
      
      if (this.player.targetPosition) {
        this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        this.ctx.beginPath();
        this.ctx.arc(this.player.targetPosition.x, this.player.targetPosition.y, 3, 0, Math.PI * 2);
        this.ctx.fill();
      }
    }

    // Draw Floating Texts
    this.floatingTexts.forEach(ft => {
      this.ctx.fillStyle = ft.color;
      this.ctx.font = 'bold 14px Arial';
      this.ctx.textAlign = 'center';
      this.ctx.globalAlpha = Math.max(0, ft.life / 1000);
      this.ctx.fillText(ft.text, ft.x, ft.y);
      this.ctx.globalAlpha = 1.0;
    });

    this.ctx.restore();
  }

  drawEntity(entity: Entity) {
    // Draw Shadow
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.beginPath();
    this.ctx.ellipse(entity.position.x, entity.position.y + entity.radius/2, entity.radius, entity.radius/2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw Body
    this.ctx.fillStyle = entity.color;
    this.ctx.beginPath();
    this.ctx.arc(entity.position.x, entity.position.y, entity.radius, 0, Math.PI * 2);
    this.ctx.fill();
    
    // Draw HP Bar
    const hpPercent = entity.stats.hp / entity.stats.maxHp;
    const barWidth = 40;
    const barHeight = 5;
    const barX = entity.position.x - barWidth / 2;
    const barY = entity.position.y - entity.radius - 10;

    this.ctx.fillStyle = '#333';
    this.ctx.fillRect(barX, barY, barWidth, barHeight);
    this.ctx.fillStyle = hpPercent > 0.5 ? '#22c55e' : hpPercent > 0.2 ? '#eab308' : '#ef4444';
    this.ctx.fillRect(barX, barY, barWidth * hpPercent, barHeight);
  }

  drawGrid() {
    this.ctx.strokeStyle = '#333';
    this.ctx.lineWidth = 1;
    const gridSize = 100;
    
    // Calculate visible grid range
    const startX = Math.floor(this.camera.x / gridSize) * gridSize;
    const startY = Math.floor(this.camera.y / gridSize) * gridSize;
    const endX = startX + this.canvas.width + gridSize;
    const endY = startY + this.canvas.height + gridSize;

    this.ctx.beginPath();
    for (let x = startX; x <= endX; x += gridSize) {
      this.ctx.moveTo(x, startY);
      this.ctx.lineTo(x, endY);
    }
    for (let y = startY; y <= endY; y += gridSize) {
      this.ctx.moveTo(startX, y);
      this.ctx.lineTo(endX, y);
    }
    this.ctx.stroke();
  }

  handleInput(e: MouseEvent) {
    if (!this.player) return;

    const rect = this.canvas.getBoundingClientRect();
    const clickX = e.clientX - rect.left + this.camera.x;
    const clickY = e.clientY - rect.top + this.camera.y;

    // Check if clicked on monster (Targeting)
    let clickedMonster: Monster | null = null;
    for (const monster of this.monsters) {
      const dx = clickX - monster.position.x;
      const dy = clickY - monster.position.y;
      if (dx * dx + dy * dy < monster.radius * monster.radius + 100) { // Hitbox
        clickedMonster = monster;
        break;
      }
    }

    if (clickedMonster) {
      this.player.target = clickedMonster;
    } else {
      // Move
      this.player.target = null;
      this.player.targetPosition = { x: clickX, y: clickY };
    }
  }

  // Kept for compatibility but currently unused/simplified
  useSkill(index: number) {
     // Placeholder
  }
}
