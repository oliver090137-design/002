import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { ClassSelection } from './ClassSelection';
import { ClassType } from '../game/types';
import { Player } from '../game/classes/Player';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [playerStats, setPlayerStats] = useState<{ hp: number; maxHp: number; mana: number; maxMana: number; level: number } | null>(null);

  useEffect(() => {
    if (!selectedClass || !canvasRef.current) return;

    // Initialize Engine
    const engine = new GameEngine(canvasRef.current, (player: Player) => {
      // Update UI state
      setPlayerStats({
        hp: player.stats.hp,
        maxHp: player.stats.maxHp,
        mana: player.stats.mana,
        maxMana: player.stats.maxMana,
        level: player.stats.level
      });
    });
    
    engine.startGame(selectedClass);
    engineRef.current = engine;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key >= '1' && e.key <= '5') {
        const index = parseInt(e.key) - 1;
        engine.useSkill(index);
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      engine.destroy();
      engineRef.current = null;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedClass]);

  if (!selectedClass) {
    return <ClassSelection onSelect={setSelectedClass} />;
  }

  const getClassDisplayName = (type: ClassType) => {
    switch (type) {
      case 'warrior': return '戰士';
      case 'priest': return '牧師';
      case 'mage': return '法師';
      case 'summoner': return '召喚師';
      case 'archer': return '弓箭手';
      default: return type;
    }
  };

  return (
    <div className="w-full h-screen bg-black overflow-hidden relative font-sans select-none">
      <canvas ref={canvasRef} className="block w-full h-full" />
      
      {/* UI Overlay */}
      {playerStats && (
        <div className="absolute top-4 left-4 text-white pointer-events-none">
          <div className="flex items-center gap-3 mb-2 bg-black/40 p-2 rounded-lg backdrop-blur-sm border border-white/10">
            <div className="size-12 bg-surface-dark border border-white/20 rounded-full overflow-hidden flex items-center justify-center">
               <span className="material-symbols-outlined text-2xl text-slate-400">person</span>
            </div>
            <div>
               <div className="font-bold text-sm uppercase tracking-wider">{getClassDisplayName(selectedClass)}</div>
               <div className="text-xs text-primary font-bold">等級 {playerStats.level}</div>
            </div>
          </div>
          
          {/* HP/MP Bars */}
          <div className="flex flex-col gap-1 w-64">
            <div className="h-4 bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
               <div 
                 className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-200" 
                 style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
               ></div>
               <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white shadow-sm">
                 {Math.ceil(playerStats.hp)} / {playerStats.maxHp}
               </span>
            </div>
            <div className="h-3 bg-black/60 rounded-full overflow-hidden border border-white/10 relative">
               <div 
                 className="h-full bg-gradient-to-r from-blue-600 to-blue-500 transition-all duration-200" 
                 style={{ width: `${(playerStats.mana / playerStats.maxMana) * 100}%` }}
               ></div>
               <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white shadow-sm">
                 {Math.ceil(playerStats.mana)} / {playerStats.maxMana}
               </span>
            </div>
          </div>
        </div>
      )}

      {/* Action Bar */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-2 bg-black/40 p-2 rounded-xl backdrop-blur-sm border border-white/10">
         {[0, 1, 2, 3, 4].map((index) => {
            const skill = engineRef.current?.player?.skills[index];
            return (
              <div 
                key={index} 
                onClick={() => engineRef.current?.useSkill(index)}
                className="size-12 bg-surface-dark border border-white/20 rounded hover:border-primary cursor-pointer flex items-center justify-center text-slate-500 font-bold text-xs relative group transition-all hover:scale-105 active:scale-95"
                title={skill?.name}
              >
                 <span className="absolute top-0.5 left-1 text-[10px] text-slate-600">{index + 1}</span>
                 <div className="w-full h-full flex items-center justify-center group-hover:bg-white/5">
                    {skill ? (
                      <span className="material-symbols-outlined text-2xl text-white">{skill.icon}</span>
                    ) : (
                      <span className="text-white/10">-</span>
                    )}
                 </div>
              </div>
            );
         })}
      </div>
      
      {/* Instructions */}
      <div className="absolute top-4 right-4 text-white/50 text-xs text-right pointer-events-none">
        <p>左鍵：移動 / 選擇目標</p>
        <p>右鍵：攻擊 (範圍內)</p>
        <p>按鍵 1-5：使用技能</p>
      </div>
    </div>
  );
};
