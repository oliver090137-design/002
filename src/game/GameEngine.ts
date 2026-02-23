import { Player } from './classes/Player';
import { Monster } from './classes/Monster';
import { Entity } from './classes/Entity';
import { ClassType } from './types';
import { Particle } from './classes/Particle';
import { Projectile } from './classes/Projectile';
import { ResourceManager } from './ResourceManager';

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
  particles: Particle[] = [];
  projectiles: Projectile[] = [];
  
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  lastTime: number = 0;
  isRunning: boolean = false;
  animationFrameId: number | null = null;
  
  // Camera
  camera = { x: 0, y: 0 };
  screenShake = { x: 0, y: 0, duration: 0, intensity: 0 };

  // AI Throttling
  private aiUpdateInterval: number = 100;
  private lastAIUpdate: number = 0;

  // Input State
  keys: Set<string> = new Set();
  mousePosition: { x: number, y: number } = { x: 0, y: 0 };

  constructor(canvas: HTMLCanvasElement, onUpdate?: (player: Player) => void) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d')!;
    if (onUpdate) this.onUpdate = onUpdate;
    
    this.handleResize();
    
    // Bind methods
    this.loop = this.loop.bind(this);
    this.handleMouseDown = this.handleMouseDown.bind(this);
    this.handleMouseMove = this.handleMouseMove.bind(this);
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
    this.handleResize = this.handleResize.bind(this);

    // Input listeners
    this.canvas.addEventListener('mousedown', this.handleMouseDown);
    this.canvas.addEventListener('mousemove', this.handleMouseMove);
    this.canvas.addEventListener('contextmenu', (e) => e.preventDefault());
    window.addEventListener('keydown', this.handleKeyDown);
    window.addEventListener('keyup', this.handleKeyUp);
    window.addEventListener('resize', this.handleResize);
  }

  destroy() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
    }
    this.canvas.removeEventListener('mousedown', this.handleMouseDown);
    this.canvas.removeEventListener('mousemove', this.handleMouseMove);
    window.removeEventListener('keydown', this.handleKeyDown);
    window.removeEventListener('keyup', this.handleKeyUp);
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  startGame(classType: ClassType) {
    console.log('Starting game with class:', classType);
    this.player = new Player('player', classType, 0, 0);
    this.monsters = [];
    this.particles = [];
    this.projectiles = [];
    this.floatingTexts = [];
    
    // Spawn monsters in the wild (outside village radius 400)
    for (let i = 0; i < 20; i++) {
      const angle = Math.random() * Math.PI * 2;
      const dist = 450 + Math.random() * 500; // 450-950 range
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
    
    let dt = time - this.lastTime;
    if (dt > 100) dt = 100; // Cap dt to prevent physics explosion
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

    // Update Screen Shake
    if (this.screenShake.duration > 0) {
      this.screenShake.duration -= dt;
      this.screenShake.x = (Math.random() - 0.5) * this.screenShake.intensity;
      this.screenShake.y = (Math.random() - 0.5) * this.screenShake.intensity;
    } else {
      this.screenShake.x = 0;
      this.screenShake.y = 0;
    }

    // Update Player
    this.player.update(dt);

    // Handle Keyboard Movement (WASD)
    let dx = 0;
    let dy = 0;
    if (this.keys.has('w') || this.keys.has('arrowup')) dy -= 1;
    if (this.keys.has('s') || this.keys.has('arrowdown')) dy += 1;
    if (this.keys.has('a') || this.keys.has('arrowleft')) dx -= 1;
    if (this.keys.has('d') || this.keys.has('arrowright')) dx += 1;

    if (dx !== 0 || dy !== 0) {
      // Normalize vector
      const len = Math.hypot(dx, dy);
      dx /= len;
      dy /= len;
      
      const speed = this.player.stats.moveSpeed * (dt / 1000);
      this.player.position.x += dx * speed;
      this.player.position.y += dy * speed;
      this.player.targetPosition = null; // Cancel mouse movement if using keys
    }

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
    const now = performance.now();
    this.monsters.forEach(monster => {
      // AI Update
      if (this.player && !this.player.isDead) {
         monster.updateAI(dt, this.player, now);
         
         // Monster Attack Logic
         if (monster.target === this.player) {
            const dist = Math.hypot(this.player.position.x - monster.position.x, this.player.position.y - monster.position.y);
            if (dist <= monster.stats.attackRange) {
               this.performAttack(monster, this.player);
            }
         }
      }
      
      monster.update(dt);
    });

    // Handle Dead Monsters & EXP
    const deadMonsters = this.monsters.filter(m => m.isDead);
    deadMonsters.forEach(m => {
        if (this.player) {
             const exp = m.stats.level * 20;
             const oldLevel = this.player.stats.level;
             this.player.gainExp(exp);
             this.floatingTexts.push(new FloatingText(m.position.x, m.position.y - 20, `+${exp} EXP`, '#ffff00'));
             
             if (this.player.stats.level > oldLevel) {
                 this.floatingTexts.push(new FloatingText(this.player.position.x, this.player.position.y - 60, `LEVEL UP!`, '#00ff00'));
                 this.createExplosion(this.player.position.x, this.player.position.y, '#00ff00', 30);
             }
        }
    });
    this.monsters = this.monsters.filter(m => !m.isDead);

    // Update Projectiles
    this.projectiles.forEach(p => p.update(dt));
    
    // Check Projectile Collisions
    for (const p of this.projectiles) {
      if (p.isDead) continue;
      
      // Check collision with monsters
      if (p.owner === this.player) {
        for (const m of this.monsters) {
          const dist = Math.hypot(p.x - m.position.x, p.y - m.position.y);
          if (dist < m.radius + p.radius) {
            // Hit!
            p.isDead = true;
            if (p.onHit) {
              p.onHit(m);
            } else {
              this.dealDamage(p.owner, m, p.damage);
            }
            this.createExplosion(p.x, p.y, p.color, 5);
            break;
          }
        }
      }
    }
    this.projectiles = this.projectiles.filter(p => !p.isDead);

    // Update Particles
    this.particles.forEach(p => p.update(dt));
    this.particles = this.particles.filter(p => p.life > 0);

    // Update Floating Texts
    this.floatingTexts.forEach(ft => ft.update(dt));
    this.floatingTexts = this.floatingTexts.filter(ft => ft.life > 0);

    // Update Camera
    this.camera.x = this.player.position.x - this.canvas.width / 2;
    this.camera.y = this.player.position.y - this.canvas.height / 2;
  }

  performAttack(attacker: Entity, target: Entity, multiplier: number = 1.0) {
    const now = performance.now();
    
    // Check cooldown (only for basic attacks, skills handle their own cooldown)
    if (multiplier === 1.0 && !attacker.canAttack(now)) {
      return;
    }
    
    if (multiplier === 1.0) {
       attacker.lastAttackTime = now;
    }

    // Ranged classes use projectiles for basic attacks
    if (attacker === this.player && (this.player.classType === 'mage' || this.player.classType === 'archer')) {
      const projSpeed = this.player.classType === 'archer' ? 600 : 400;
      const color = this.player.classType === 'archer' ? '#ffffff' : '#ffaa00';
      
      const baseDamage = attacker.stats.strength || attacker.stats.intelligence || 10;
      const damage = Math.floor(baseDamage * multiplier);

      this.projectiles.push(new Projectile(
        attacker,
        attacker.position.x,
        attacker.position.y,
        target.position.x,
        target.position.y,
        projSpeed,
        damage,
        color
      ));
      return;
    }
    
    // Melee Instant Hit
    const baseDamage = attacker.stats.strength || 10;
    const damage = Math.floor(baseDamage * multiplier);
    this.dealDamage(attacker, target, damage);
  }

  dealDamage(attacker: Entity, target: Entity, amount: number) {
    const defense = target.stats.defense || 0;
    const damage = Math.max(1, Math.floor(amount - defense));
    
    target.takeDamage(damage);
    
    // Visuals
    this.triggerScreenShake(2, 100);
    this.createExplosion(target.position.x, target.position.y, '#ff0000', 3);

    // Spawn Floating Text
    this.floatingTexts.push(new FloatingText(
      target.position.x,
      target.position.y - target.radius - 10,
      `-${damage}`,
      attacker === this.player ? '#ffff00' : '#ff4444'
    ));
  }

  createExplosion(x: number, y: number, color: string, count: number) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color, 1, 100, 500));
    }
  }

  triggerScreenShake(intensity: number, duration: number) {
    this.screenShake.intensity = intensity;
    this.screenShake.duration = duration;
  }

  render() {
    // Clear background
    this.ctx.fillStyle = '#000';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    this.ctx.save();
    // Apply Camera Transform & Screen Shake
    this.ctx.translate(-this.camera.x + this.screenShake.x, -this.camera.y + this.screenShake.y);

    // Draw Map
    this.drawMap();

    // Draw Monsters
    this.monsters.forEach(monster => this.drawEntity(monster));

    // Draw Player
    if (this.player) {
      this.drawEntity(this.player);
      
      // Draw target indicator
      if (this.player.target) {
        this.ctx.strokeStyle = 'rgba(255, 0, 0, 0.5)';
        this.ctx.lineWidth = 2;
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

    // Draw Projectiles
    this.projectiles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();
      // Trail
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = 0.3;
      this.ctx.beginPath();
      this.ctx.arc(p.x - p.vx * 0.05, p.y - p.vy * 0.05, p.radius * 0.8, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
    });

    // Draw Particles
    this.particles.forEach(p => {
      this.ctx.fillStyle = p.color;
      this.ctx.globalAlpha = p.alpha;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.globalAlpha = 1.0;
    });

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

  drawMap() {
    // Draw World Background (Wild)
    this.ctx.fillStyle = '#1a202c'; // Dark background
    this.ctx.fillRect(this.camera.x, this.camera.y, this.canvas.width, this.canvas.height);
    
    // Draw Ground (Playable Area)
    this.ctx.fillStyle = '#2d3748';
    this.ctx.fillRect(-2000, -2000, 4000, 4000);

    // Draw Grid (Faint)
    this.ctx.strokeStyle = 'rgba(255, 255, 255, 0.05)';
    this.ctx.lineWidth = 1;
    this.ctx.beginPath();
    for (let x = -2000; x <= 2000; x += 100) {
      this.ctx.moveTo(x, -2000);
      this.ctx.lineTo(x, 2000);
    }
    for (let y = -2000; y <= 2000; y += 100) {
      this.ctx.moveTo(-2000, y);
      this.ctx.lineTo(2000, y);
    }
    this.ctx.stroke();
    
    // Draw Village (Safe Zone)
    this.ctx.fillStyle = '#2f855a'; // Green
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 400, 0, Math.PI * 2);
    this.ctx.fill();
    this.ctx.strokeStyle = '#48bb78';
    this.ctx.lineWidth = 5;
    this.ctx.stroke();

    // Draw Paths
    this.ctx.strokeStyle = '#d69e2e'; // Dirt path color
    this.ctx.lineWidth = 40;
    this.ctx.lineCap = 'round';
    this.ctx.beginPath();
    // North path
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(0, -600);
    // East path
    this.ctx.moveTo(0, 0);
    this.ctx.lineTo(600, 0);
    this.ctx.stroke();

    // Draw Village Center
    this.ctx.fillStyle = '#4299e1'; // Blue Fountain
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 40, 0, Math.PI * 2);
    this.ctx.fill();
    // Fountain water effect
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
    this.ctx.beginPath();
    this.ctx.arc(0, 0, 30, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw Houses
    this.ctx.fillStyle = '#744210'; // Brown
    // House 1
    this.ctx.fillRect(-150, -200, 80, 60);
    this.ctx.fillStyle = '#975a16'; // Roof
    this.ctx.beginPath();
    this.ctx.moveTo(-160, -200);
    this.ctx.lineTo(-110, -240);
    this.ctx.lineTo(-60, -200);
    this.ctx.fill();

    // House 2
    this.ctx.fillStyle = '#744210';
    this.ctx.fillRect(100, -150, 100, 80);
    this.ctx.fillStyle = '#975a16';
    this.ctx.beginPath();
    this.ctx.moveTo(90, -150);
    this.ctx.lineTo(150, -200);
    this.ctx.lineTo(210, -150);
    this.ctx.fill();

    // House 3
    this.ctx.fillStyle = '#744210';
    this.ctx.fillRect(-120, 120, 60, 60);
    this.ctx.fillStyle = '#975a16';
    this.ctx.beginPath();
    this.ctx.moveTo(-130, 120);
    this.ctx.lineTo(-90, 90);
    this.ctx.lineTo(-50, 120);
    this.ctx.fill();
    
    // Draw "Wild" Label
    this.ctx.fillStyle = 'rgba(255, 255, 255, 0.1)';
    this.ctx.font = '100px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('WILD AREA', 0, -600);
  }

  drawEntity(entity: Entity) {
    // Draw Shadow
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.beginPath();
    this.ctx.ellipse(entity.position.x, entity.position.y + entity.radius/2, entity.radius, entity.radius/2, 0, 0, Math.PI * 2);
    this.ctx.fill();

    // Draw Body or Sprite
    const sprite = entity.spriteKey ? ResourceManager.getInstance().getImage(entity.spriteKey) : undefined;

    if (sprite) {
      this.ctx.save();
      this.ctx.beginPath();
      this.ctx.arc(entity.position.x, entity.position.y, entity.radius, 0, Math.PI * 2);
      this.ctx.clip();
      this.ctx.drawImage(sprite, entity.position.x - entity.radius, entity.position.y - entity.radius, entity.radius * 2, entity.radius * 2);
      this.ctx.restore();
      
      // Draw border/outline
      this.ctx.strokeStyle = entity.color;
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.arc(entity.position.x, entity.position.y, entity.radius, 0, Math.PI * 2);
      this.ctx.stroke();
    } else {
      this.ctx.fillStyle = entity.color;
      this.ctx.beginPath();
      this.ctx.arc(entity.position.x, entity.position.y, entity.radius, 0, Math.PI * 2);
      this.ctx.fill();
    }
    
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

  handleMouseDown(e: MouseEvent) {
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

  handleMouseMove(e: MouseEvent) {
    const rect = this.canvas.getBoundingClientRect();
    this.mousePosition.x = e.clientX - rect.left + this.camera.x;
    this.mousePosition.y = e.clientY - rect.top + this.camera.y;
  }

  handleKeyDown(e: KeyboardEvent) {
    this.keys.add(e.key.toLowerCase());
    // Skills 1-5
    if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        this.useSkill(index);
    }
  }

  handleKeyUp(e: KeyboardEvent) {
    this.keys.delete(e.key.toLowerCase());
  }

  useSkill(index: number) {
    if (!this.player) return;
    
    const skill = this.player.skills[index];
    if (!skill) return;

    const now = performance.now();
    if (now - skill.lastUsed < skill.cooldown) {
      // Cooldown
      this.floatingTexts.push(new FloatingText(
        this.player.position.x, 
        this.player.position.y - 40, 
        '冷卻中', 
        '#aaaaaa'
      ));
      return;
    }

    // Check Cost
    if (this.player.stats.mana < skill.cost) {
      this.floatingTexts.push(new FloatingText(
        this.player.position.x, 
        this.player.position.y - 40, 
        '魔力不足', 
        '#5555ff'
      ));
      return;
    }

    // Execute Skill
    this.player.stats.mana -= skill.cost;
    skill.lastUsed = now;

    // Enhanced Skill Logic with Visuals
    if (skill.type === 'SUMMON') {
       this.floatingTexts.push(new FloatingText(this.player.position.x, this.player.position.y - 40, `${skill.name}!`, '#a855f7'));
       this.createExplosion(this.player.position.x, this.player.position.y, '#a855f7', 20);
       // Placeholder for summon logic
    } else if (skill.type === 'BUFF') {
       this.floatingTexts.push(new FloatingText(this.player.position.x, this.player.position.y - 40, `${skill.name}!`, '#00ff00'));
       this.createExplosion(this.player.position.x, this.player.position.y, '#ffff00', 10);
       // Apply buff logic here (placeholder)
    } else if (skill.type === 'HEAL') {
       const healAmount = 50; // Placeholder
       this.player.heal(healAmount);
       this.floatingTexts.push(new FloatingText(this.player.position.x, this.player.position.y - 40, `+${healAmount}`, '#00ff00'));
       this.createExplosion(this.player.position.x, this.player.position.y, '#00ff00', 10);
    } else {
       // Attack Skill
       if (this.player.target) {
          const dist = Math.hypot(this.player.target.position.x - this.player.position.x, this.player.target.position.y - this.player.position.y);
          
          if (dist <= skill.range) {
             // Projectile Skills
             if (skill.id === 'fireball' || skill.id === 'shadow_bolt' || skill.id === 'precision_shot' || skill.id === 'triple_shot') {
                const color = skill.id === 'fireball' ? '#ff4400' : (skill.id === 'shadow_bolt' ? '#8800ff' : '#ffffff');
                const damage = skill.damageMultiplier * (this.player.stats.intelligence || this.player.stats.strength || 10);
                
                if (skill.id === 'triple_shot') {
                    // Fire 3 projectiles
                    for(let i = -1; i <= 1; i++) {
                        // Calculate offset target
                        const angle = Math.atan2(this.player.target.position.y - this.player.position.y, this.player.target.position.x - this.player.position.x);
                        const spread = 0.3; // radians
                        const finalAngle = angle + (i * spread);
                        const tx = this.player.position.x + Math.cos(finalAngle) * 500;
                        const ty = this.player.position.y + Math.sin(finalAngle) * 500;
                        
                        this.projectiles.push(new Projectile(
                            this.player,
                            this.player.position.x,
                            this.player.position.y,
                            tx,
                            ty,
                            600,
                            damage,
                            color
                        ));
                    }
                } else {
                    this.projectiles.push(new Projectile(
                      this.player,
                      this.player.position.x,
                      this.player.position.y,
                      this.player.target.position.x,
                      this.player.target.position.y,
                      500,
                      damage,
                      color
                    ));
                }
             } else {
               // Instant Hit (Melee or Instant Magic)
               this.dealDamage(this.player, this.player.target, skill.damageMultiplier * (this.player.stats.strength || 10));
             }
             this.floatingTexts.push(new FloatingText(this.player.position.x, this.player.position.y - 40, `${skill.name}!`, '#ffff00'));
          } else {
             this.floatingTexts.push(new FloatingText(this.player.position.x, this.player.position.y - 40, '距離太遠', '#aaaaaa'));
             // Refund cooldown/cost?
             skill.lastUsed = 0;
             this.player.stats.mana += skill.cost;
          }
       } else {
          // No target
          if (skill.targetType === 'AREA' || skill.targetType === 'POINT') {
             // Area skill without target (centered on player for now)
             this.floatingTexts.push(new FloatingText(this.player.position.x, this.player.position.y - 40, `${skill.name}!`, '#ffff00'));
             this.createExplosion(this.player.position.x, this.player.position.y, '#ff0000', 20);
             this.triggerScreenShake(5, 200);
             
             // AOE Damage Logic
             this.monsters.forEach(m => {
               const d = Math.hypot(m.position.x - this.player!.position.x, m.position.y - this.player!.position.y);
               if (d < 150) { // 150 radius
                 this.dealDamage(this.player!, m, skill.damageMultiplier * (this.player!.stats.strength || 10));
               }
             });

          } else {
             this.floatingTexts.push(new FloatingText(this.player.position.x, this.player.position.y - 40, '需要目標', '#aaaaaa'));
             skill.lastUsed = 0;
             this.player.stats.mana += skill.cost;
          }
       }
    }
  }
}
