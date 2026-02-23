import { Entity } from './Entity';
import { ClassType } from '../types';

export class Player extends Entity {
  classType: ClassType;
  
  // Class specific resources
  rage: number = 0;        // Warrior
  focus: number = 0;       // Archer
  divineGrace: number = 0; // Priest
  elementStacks: { fire: number, ice: number, lightning: number } = { fire: 0, ice: 0, lightning: 0 }; // Mage

  constructor(id: string, classType: ClassType, x: number, y: number) {
    super(id, x, y);
    this.classType = classType;
    this.color = '#3498db';
    this.radius = 18;
    this.initializeClassStats();
    this.initializeSkills();
  }

  private initializeClassStats() {
    const baseStats = {
      hp: 100, maxHp: 100,
      mana: 100, maxMana: 100,
      strength: 15, intelligence: 10, defense: 5,
      dexterity: 10, spirit: 10, level: 1,
      attackRange: 50, attackSpeed: 1.0, moveSpeed: 120
    };

    switch (this.classType) {
      case 'warrior':
        this.stats = {
          ...baseStats,
          maxHp: 200, hp: 200,
          strength: 25, defense: 12,
          attackRange: 45, attackSpeed: 1.2,
          moveSpeed: 100
        };
        this.color = '#ef4444';
        break;

      case 'archer':
        this.stats = {
          ...baseStats,
          maxHp: 120, hp: 120,
          strength: 18, dexterity: 25,
          attackRange: 280, attackSpeed: 1.8,
          moveSpeed: 140
        };
        this.color = '#22c55e';
        break;

      case 'mage':
        this.stats = {
          ...baseStats,
          maxHp: 80, hp: 80,
          intelligence: 30, spirit: 20,
          defense: 2, attackRange: 220,
          attackSpeed: 0.8, moveSpeed: 110
        };
        this.color = '#3b82f6';
        break;

      case 'priest':
        this.stats = {
          ...baseStats,
          maxHp: 130, hp: 130,
          intelligence: 25, spirit: 25,
          defense: 8, attackRange: 180,
          attackSpeed: 1.0, moveSpeed: 115
        };
        this.color = '#fbbf24';
        break;

      case 'summoner':
        this.stats = {
          ...baseStats,
          maxHp: 100, hp: 100,
          intelligence: 28, spirit: 18,
          defense: 5, attackRange: 200,
          attackSpeed: 0.9, moveSpeed: 105
        };
        this.color = '#a855f7';
        break;
    }
  }

  initializeSkills() {
    // Add basic attack
    this.skills.push({
      id: 'basic_attack',
      name: '普通攻擊',
      description: '標準攻擊',
      cooldown: 1000,
      lastUsed: 0,
      range: this.stats.attackRange,
      cost: 0,
      damageMultiplier: 1.0,
      type: 'PHYSICAL',
      targetType: 'SINGLE',
      icon: 'swords'
    });

    if (this.classType === 'warrior') {
      this.skills.push({
        id: 'charge',
        name: '衝鋒',
        description: '衝向目標',
        cooldown: 8000,
        lastUsed: 0,
        range: 300,
        cost: 30,
        damageMultiplier: 1.5,
        type: 'PHYSICAL',
        targetType: 'SINGLE',
        icon: 'fast_forward'
      });
      this.skills.push({
        id: 'whirlwind',
        name: '旋風斬',
        description: '旋轉攻擊',
        cooldown: 5000,
        lastUsed: 0,
        range: 100,
        cost: 40,
        damageMultiplier: 1.2,
        type: 'PHYSICAL',
        targetType: 'AREA',
        icon: 'cyclone'
      });
      this.skills.push({
        id: 'iron_will',
        name: '鋼鐵意志',
        description: '提升防禦',
        cooldown: 15000,
        lastUsed: 0,
        range: 0,
        cost: 20,
        damageMultiplier: 0,
        type: 'BUFF',
        targetType: 'SELF',
        icon: 'shield'
      });
    } else if (this.classType === 'mage') {
      this.skills.push({
        id: 'fireball',
        name: '火球術',
        description: '發射火球',
        cooldown: 3000,
        lastUsed: 0,
        range: 400,
        cost: 25,
        damageMultiplier: 1.4,
        type: 'MAGICAL',
        targetType: 'SINGLE',
        icon: 'local_fire_department'
      });
      this.skills.push({
        id: 'ice_nova',
        name: '冰霜新星',
        description: '凍結敵人',
        cooldown: 10000,
        lastUsed: 0,
        range: 150,
        cost: 50,
        damageMultiplier: 1.0,
        type: 'MAGICAL',
        targetType: 'AREA',
        icon: 'ac_unit'
      });
      this.skills.push({
        id: 'teleport',
        name: '瞬間移動',
        description: '瞬間移動',
        cooldown: 12000,
        lastUsed: 0,
        range: 300,
        cost: 40,
        damageMultiplier: 0,
        type: 'MAGICAL',
        targetType: 'POINT',
        icon: 'move_up'
      });
    } else if (this.classType === 'archer') {
       this.skills.push({
        id: 'precision_shot',
        name: '精準射擊',
        description: '高額傷害',
        cooldown: 4000,
        lastUsed: 0,
        range: 500,
        cost: 20,
        damageMultiplier: 1.8,
        type: 'PHYSICAL',
        targetType: 'SINGLE',
        icon: 'gps_fixed'
      });
      this.skills.push({
        id: 'triple_shot',
        name: '三重射擊',
        description: '發射三箭',
        cooldown: 6000,
        lastUsed: 0,
        range: 400,
        cost: 35,
        damageMultiplier: 0.8,
        type: 'PHYSICAL',
        targetType: 'SINGLE',
        icon: 'filter_3'
      });
      this.skills.push({
        id: 'sprint',
        name: '疾跑',
        description: '提升速度',
        cooldown: 15000,
        lastUsed: 0,
        range: 0,
        cost: 15,
        damageMultiplier: 0,
        type: 'BUFF',
        targetType: 'SELF',
        icon: 'directions_run'
      });
    } else if (this.classType === 'priest') {
       this.skills.push({
        id: 'heal',
        name: '治療術',
        description: '恢復生命',
        cooldown: 4000,
        lastUsed: 0,
        range: 400,
        cost: 30,
        damageMultiplier: 0,
        type: 'HEAL',
        targetType: 'SINGLE',
        icon: 'healing'
      });
      this.skills.push({
        id: 'smite',
        name: '懲擊',
        description: '神聖傷害',
        cooldown: 3000,
        lastUsed: 0,
        range: 300,
        cost: 20,
        damageMultiplier: 1.2,
        type: 'MAGICAL',
        targetType: 'SINGLE',
        icon: 'flare'
      });
      this.skills.push({
        id: 'shield',
        name: '護盾',
        description: '吸收傷害',
        cooldown: 12000,
        lastUsed: 0,
        range: 400,
        cost: 40,
        damageMultiplier: 0,
        type: 'BUFF',
        targetType: 'SINGLE',
        icon: 'security'
      });
    } else if (this.classType === 'summoner') {
       this.skills.push({
        id: 'summon_wolf',
        name: '召喚狼',
        description: '召喚夥伴',
        cooldown: 20000,
        lastUsed: 0,
        range: 100,
        cost: 60,
        damageMultiplier: 0,
        type: 'SUMMON',
        targetType: 'POINT',
        icon: 'wolf'
      });
      this.skills.push({
        id: 'shadow_bolt',
        name: '暗影箭',
        description: '暗影傷害',
        cooldown: 2000,
        lastUsed: 0,
        range: 350,
        cost: 15,
        damageMultiplier: 1.1,
        type: 'MAGICAL',
        targetType: 'SINGLE',
        icon: 'dark_mode'
      });
    }
  }

  update(dt: number) {
    super.update(dt);
    
    // Handle target chasing for auto-attack
    if (this.target && !this.target.isDead) {
      const distance = Math.hypot(
        this.target.position.x - this.position.x,
        this.target.position.y - this.position.y
      );
      
      if (distance > this.stats.attackRange) {
        // Chase target
        this.targetPosition = {
          x: this.target.position.x,
          y: this.target.position.y
        };
      }
    } else if (this.target?.isDead) {
      // Clear dead target
      this.target = null;
    }
  }
}
