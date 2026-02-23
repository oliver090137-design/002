import React, { useEffect, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { Monster } from '../game/classes/Monster';

interface AdminPanelProps {
  engine: GameEngine;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ engine, onClose }) => {
  const [fps, setFps] = useState(0);
  const [entityCount, setEntityCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setEntityCount(engine.monsters.length);
      // FPS calculation could be added to engine, simplified here
    }, 500);
    return () => clearInterval(interval);
  }, [engine]);

  const spawnMonster = () => {
    const player = engine.player;
    if (!player) return;
    
    const angle = Math.random() * Math.PI * 2;
    const dist = 200;
    const x = player.position.x + Math.cos(angle) * dist;
    const y = player.position.y + Math.sin(angle) * dist;
    
    engine.monsters.push(new Monster(`spawned_${Date.now()}`, x, y));
  };

  const killAll = () => {
    engine.monsters = [];
  };

  const healPlayer = () => {
    if (engine.player) {
      engine.player.stats.hp = engine.player.stats.maxHp;
      engine.player.stats.mana = engine.player.stats.maxMana;
    }
  };

  const addExp = () => {
    if (engine.player) {
      engine.player.level++;
      engine.player.stats.maxHp += 50;
      engine.player.stats.maxMana += 20;
      engine.player.stats.hp = engine.player.stats.maxHp;
      engine.player.stats.mana = engine.player.stats.maxMana;
    }
  };

  return (
    <div className="absolute top-20 right-4 bg-black/80 border border-white/20 p-4 rounded-lg text-white w-64 backdrop-blur-md">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-primary">GM 控制台</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
      </div>

      <div className="space-y-2 mb-4 text-sm text-gray-300">
        <div>怪物數量: {entityCount}</div>
        <div>玩家座標: {engine.player ? `${Math.round(engine.player.position.x)}, ${Math.round(engine.player.position.y)}` : 'N/A'}</div>
      </div>

      <div className="grid grid-cols-2 gap-2">
        <button onClick={spawnMonster} className="bg-surface-light hover:bg-surface-lighter p-2 rounded text-xs font-bold transition-colors border border-white/10">
          生成怪物
        </button>
        <button onClick={killAll} className="bg-red-900/50 hover:bg-red-800/50 p-2 rounded text-xs font-bold transition-colors border border-red-500/30 text-red-200">
          殺死所有
        </button>
        <button onClick={healPlayer} className="bg-green-900/50 hover:bg-green-800/50 p-2 rounded text-xs font-bold transition-colors border border-green-500/30 text-green-200">
          完全恢復
        </button>
        <button onClick={addExp} className="bg-blue-900/50 hover:bg-blue-800/50 p-2 rounded text-xs font-bold transition-colors border border-blue-500/30 text-blue-200">
          升級 (+LV)
        </button>
      </div>
    </div>
  );
};
