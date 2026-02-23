import { Position, Stats, Skill } from '../types';

export abstract class Entity {
  id: string;
  position: Position;
  stats: Stats;
  radius: number = 15;
  color: string = '#ffffff';
  spriteKey?: string;
  isDead: boolean = false;
  
  // Combat
  target: Entity | null = null;
  lastAttackTime: number = 0;
  skills: Skill[] = []; // Kept for compatibility
  buffs: any[] = []; // Kept for compatibility
  
  // Movement
  targetPosition: Position | null = null;
  isMoving: boolean = false;

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.position = { x, y };
    
    // Default stats (subclasses will override)
    this.stats = {
      hp: 100, maxHp: 100,
      mana: 50, maxMana: 50,
      strength: 10, intelligence: 5, defense: 0,
      dexterity: 10, spirit: 10, level: 1,
      attackRange: 50, attackSpeed: 1.0, moveSpeed: 100
    };
  }

  update(dt: number) {
    if (this.isDead) return;
    
    // Handle movement
    if (this.targetPosition) {
      this.moveTowards(this.targetPosition, dt);
    }
  }

  moveTowards(target: Position, dt: number) {
    const dx = target.x - this.position.x;
    const dy = target.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 5) {
      const moveStep = this.stats.moveSpeed * (dt / 1000);
      const moveX = (dx / distance) * moveStep;
      const moveY = (dy / distance) * moveStep;
      
      this.position.x += moveX;
      this.position.y += moveY;
      this.isMoving = true;
    } else {
      this.targetPosition = null;
      this.isMoving = false;
    }
  }

  takeDamage(amount: number): number {
    const actualDamage = Math.max(1, amount);
    this.stats.hp -= actualDamage;
    
    if (this.stats.hp <= 0) {
      this.stats.hp = 0;
      this.isDead = true;
    }
    
    return actualDamage;
  }

  heal(amount: number) {
    this.stats.hp = Math.min(this.stats.hp + amount, this.stats.maxHp);
  }

  addBuff(buff: any) {
    // Placeholder
  }

  canAttack(currentTime: number): boolean {
    const attackCooldown = 1000 / this.stats.attackSpeed; // ms
    return currentTime - this.lastAttackTime >= attackCooldown;
  }
}
