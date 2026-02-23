export type ClassType = 'warrior' | 'priest' | 'mage' | 'summoner' | 'archer';

export interface Stats {
  hp: number;
  maxHp: number;
  mana: number;
  maxMana: number;
  exp: number;
  maxExp: number;
  strength: number;
  intelligence: number;
  defense: number;
  dexterity: number;
  spirit: number;
  level: number;
  attackRange: number;
  attackSpeed: number; // Attacks per second
  moveSpeed: number;   // Pixels per second
}

export interface Position {
  x: number;
  y: number;
}

export interface Skill {
  id: string;
  name: string;
  description: string;
  cooldown: number;
  lastUsed: number;
  range: number;
  cost: number;
  damageMultiplier: number;
  type: 'PHYSICAL' | 'MAGICAL' | 'HEAL' | 'BUFF' | 'SUMMON';
  targetType: 'SINGLE' | 'AREA' | 'SELF' | 'POINT';
  icon: string;
}
