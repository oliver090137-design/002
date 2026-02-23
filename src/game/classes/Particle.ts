export class Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  alpha: number = 1;

  constructor(x: number, y: number, color: string, count: number = 1, speed: number = 50, life: number = 500) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.maxLife = life;
    this.life = life;
    this.size = Math.random() * 3 + 2;
    
    const angle = Math.random() * Math.PI * 2;
    const velocity = Math.random() * speed;
    this.vx = Math.cos(angle) * velocity;
    this.vy = Math.sin(angle) * velocity;
  }

  update(dt: number) {
    this.life -= dt;
    this.x += this.vx * (dt / 1000);
    this.y += this.vy * (dt / 1000);
    this.alpha = this.life / this.maxLife;
  }
}
