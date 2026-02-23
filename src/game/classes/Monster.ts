import { Entity } from './Entity';
import { Player } from './Player';

export class Monster extends Entity {
  aggroRange: number = 150;
  lastAggroCheck: number = 0;

  constructor(id: string, x: number, y: number) {
    super(id, x, y);
    this.color = '#e74c3c';
    this.radius = 16;
    this.spriteKey = 'orc';
    
    this.stats = {
      hp: 80, maxHp: 80,
      mana: 30, maxMana: 30,
      exp: 0, maxExp: 0,
      strength: 12, intelligence: 5, defense: 3,
      dexterity: 8, spirit: 5, level: 1,
      attackRange: 40, attackSpeed: 0.8, moveSpeed: 80
    };
  }

  updateAI(dt: number, player: Player, currentTime: number) {
    if (this.isDead) return;

    // Check aggro every 200ms
    if (currentTime - this.lastAggroCheck > 200) {
      this.lastAggroCheck = currentTime;
      this.checkAggro(player);
    }

    // If has target, chase
    if (this.target) {
      const distance = Math.hypot(
        this.target.position.x - this.position.x,
        this.target.position.y - this.position.y
      );

      if (distance > this.stats.attackRange + 10) {
        // Move to attack range
        this.targetPosition = {
          x: this.target.position.x,
          y: this.target.position.y
        };
      } else {
        // Stop moving, ready to attack
        this.targetPosition = null;
      }
    }
  }

  private checkAggro(player: Player) {
    const distance = Math.hypot(
      player.position.x - this.position.x,
      player.position.y - this.position.y
    );

    // If player in aggro range, or monster damaged
    if (distance < this.aggroRange || this.stats.hp < this.stats.maxHp) {
      this.target = player;
    } else if (distance > this.aggroRange * 1.5) {
      // De-aggro
      this.target = null;
    }
  }
}
