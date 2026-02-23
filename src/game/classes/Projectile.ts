import { Entity } from './Entity';

export class Projectile {
  x: number;
  y: number;
  vx: number;
  vy: number;
  speed: number;
  damage: number;
  owner: Entity;
  target: Entity | null = null; // If set, homing missile
  life: number = 2000; // Max duration
  color: string;
  radius: number = 5;
  onHit: ((target: Entity) => void) | null = null;
  isDead: boolean = false;

  constructor(
    owner: Entity, 
    x: number, 
    y: number, 
    targetX: number, 
    targetY: number, 
    speed: number, 
    damage: number, 
    color: string,
    onHit?: (target: Entity) => void
  ) {
    this.owner = owner;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.damage = damage;
    this.color = color;
    this.onHit = onHit || null;

    const dx = targetX - x;
    const dy = targetY - y;
    const dist = Math.hypot(dx, dy);
    this.vx = (dx / dist) * speed;
    this.vy = (dy / dist) * speed;
  }

  update(dt: number) {
    this.life -= dt;
    if (this.life <= 0) {
      this.isDead = true;
      return;
    }

    this.x += this.vx * (dt / 1000);
    this.y += this.vy * (dt / 1000);
  }
}
