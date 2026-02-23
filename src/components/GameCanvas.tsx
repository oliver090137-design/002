import React, { useEffect, useRef, useState } from 'react';
import { GameEngine } from '../game/GameEngine';
import { ClassSelection } from './ClassSelection';
import { ClassType } from '../game/types';
import { Player } from '../game/classes/Player';
import { AdminPanel } from './AdminPanel';

export const GameCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const engineRef = useRef<GameEngine | null>(null);
  const lastUpdateRef = useRef<number>(0);
  const [selectedClass, setSelectedClass] = useState<ClassType | null>(null);
  const [playerStats, setPlayerStats] = useState<{ 
    hp: number; maxHp: number; 
    mana: number; maxMana: number; 
    level: number;
    exp: number; maxExp: number;
  } | null>(null);
  const [showAdmin, setShowAdmin] = useState(false);

  useEffect(() => {
    if (!selectedClass || !canvasRef.current) return;

    console.log('Initializing GameEngine with class:', selectedClass);

    // Initialize Engine
    const engine = new GameEngine(canvasRef.current, (player: Player) => {
      // Throttle UI updates to ~30fps to prevent React render bottleneck
      const now = performance.now();
      if (now - lastUpdateRef.current >= 32) { // ~30ms
        lastUpdateRef.current = now;
        setPlayerStats({
          hp: player.stats.hp,
          maxHp: player.stats.maxHp,
          mana: player.stats.mana,
          maxMana: player.stats.maxMana,
          level: player.stats.level,
          exp: player.stats.exp,
          maxExp: player.stats.maxExp
        });
      }
    });
    
    engine.startGame(selectedClass);
    engineRef.current = engine;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '`' || e.key === '~') {
        setShowAdmin(prev => !prev);
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
    <div className="w-full h-screen bg-background-dark text-slate-100 font-display overflow-hidden relative select-none">
      {/* Game Canvas Layer */}
      <div className="absolute inset-0 z-0">
         <canvas ref={canvasRef} className="block w-full h-full" />
      </div>
      
      {/* UI Overlay Layer */}
      <div className="relative z-10 flex flex-col h-full pointer-events-none">
        {/* Header */}
        <header className="flex justify-between items-start px-4 py-2 pointer-events-auto bg-gradient-to-b from-black/80 to-transparent pb-12">
          {playerStats && (
            <div className="flex items-start gap-4">
              <div className="relative group">
                <div className="w-20 h-20 rounded border-2 border-[#673237] overflow-hidden bg-black shadow-lg">
                  <img 
                    alt="Character Portrait" 
                    className="w-full h-full object-cover" 
                    src={`https://api.dicebear.com/9.x/adventurer/svg?seed=${selectedClass}&backgroundColor=b6e3f4`}
                  />
                </div>
                <div className="absolute -bottom-2 -right-2 bg-black border border-[#673237] text-white text-xs px-1.5 py-0.5 rounded font-bold">
                  {playerStats.level}
                </div>
              </div>
              <div className="flex flex-col gap-1 w-64 pt-1">
                <div className="flex justify-between items-baseline">
                  <h2 className="text-white text-lg font-bold tracking-tight shadow-black drop-shadow-md">瓦雷里烏斯</h2>
                  <span className="text-[#c99296] text-xs uppercase tracking-wider font-semibold">{getClassDisplayName(selectedClass)}</span>
                </div>
                {/* HP Bar */}
                <div className="relative w-full h-4 bg-black/60 border border-[#482326] rounded-sm">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-red-900 to-[#e21224] transition-all duration-200" 
                    style={{ width: `${(playerStats.hp / playerStats.maxHp) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-white drop-shadow-md z-10">
                    {Math.ceil(playerStats.hp)} / {playerStats.maxHp}
                  </span>
                </div>
                {/* MP Bar */}
                <div className="relative w-full h-3 bg-black/60 border border-[#482326] rounded-sm mt-0.5">
                  <div 
                    className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-900 to-blue-600 transition-all duration-200"
                    style={{ width: `${(playerStats.mana / playerStats.maxMana) * 100}%` }}
                  ></div>
                  <span className="absolute inset-0 flex items-center justify-center text-[9px] font-bold text-white drop-shadow-md z-10">
                    {Math.ceil(playerStats.mana)} / {playerStats.maxMana}
                  </span>
                </div>
                {/* Buffs */}
                <div className="flex gap-1 mt-1">
                  <div className="w-6 h-6 bg-slate-800 border border-slate-600 rounded-sm flex items-center justify-center" title="Might">
                    <span className="material-symbols-outlined text-yellow-500 text-[16px]">swords</span>
                  </div>
                  <div className="w-6 h-6 bg-slate-800 border border-slate-600 rounded-sm flex items-center justify-center" title="Haste">
                    <span className="material-symbols-outlined text-cyan-400 text-[16px]">speed</span>
                  </div>
                  <div className="w-6 h-6 bg-slate-800 border border-slate-600 rounded-sm flex items-center justify-center" title="Protection">
                    <span className="material-symbols-outlined text-slate-300 text-[16px]">shield</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <div className="hidden md:flex flex-col items-center pt-2">
            <div className="bg-black/40 px-6 py-1 rounded-full border border-[#482326]/50 backdrop-blur-sm">
              <span className="text-[#c99296] text-lg font-display tracking-widest font-bold text-shadow-md">永恆血誓：編年史</span>
            </div>
          </div>

          <div className="flex flex-col items-end gap-2">
            <div className="flex gap-2 mb-2">
              {['mail', 'leaderboard', 'calendar_month', 'settings'].map((icon, i) => (
                <button key={icon} className="icon-btn ui-panel w-9 h-9 flex items-center justify-center rounded hover:bg-[#33191b] transition-colors relative group">
                  <span className="material-symbols-outlined text-[#c99296] text-[20px]">{icon}</span>
                  {i === 0 && <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#e21224] rounded-full border border-black"></div>}
                </button>
              ))}
            </div>
            <div className="ui-panel p-1 rounded-full w-40 h-40 relative flex items-center justify-center border-2 border-[#482326] overflow-hidden bg-black">
              <div className="absolute inset-0 bg-cover bg-center opacity-80" style={{ backgroundImage: "url('https://lh3.googleusercontent.com/aida-public/AB6AXuBEIX6e_9FsemrAkdQ-0D4yw3Oonq_Q2WaYSk5tQ3FbMNO68ZyVD3TyE9vdR2DeQzxXSu6cECjoV0Xux9TaE7SUlswd0E9G3UE0zptOzQJdGae5FY0t8GmCY1tOdOtZ9XAV0cElGhd_cJD-LmzIaKATX4-xvE8YcKX4RoYYWcCrBIhIjFfgjd69kKSM7OAPYP7fU6g6DX6sDGsu1SmQOEuZ5GUw2pZcgo_-8h569E_lwFdHSL68xT_cxInJRKe0akUAeactaBpETBkE')", filter: "grayscale(50%) sepia(20%)" }}></div>
              <div className="absolute inset-0 border-[20px] border-black/20 rounded-full pointer-events-none"></div>
              <div className="absolute w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white] z-20"></div>
              <div className="absolute bottom-2 text-[10px] text-white font-mono bg-black/60 px-2 rounded">128, 456</div>
            </div>
            <div className="text-[#c99296] text-xs font-mono mt-1 bg-black/60 px-2 py-0.5 rounded border border-[#482326]">伺服器時間: 21:42</div>
          </div>
        </header>

        {/* Quest Tracker */}
        <div className="flex-1 flex justify-end px-4 pointer-events-none">
          <div className="w-64 mt-10 pointer-events-auto">
            <div className="ui-panel p-4 rounded-lg bg-opacity-90 backdrop-blur-sm">
              <h3 className="text-[#c99296] font-bold text-sm mb-3 border-b border-[#482326] pb-2 flex items-center gap-2">
                <span className="material-symbols-outlined text-sm">flag</span>
                當前任務
              </h3>
              <div className="flex flex-col gap-4">
                <div className="group cursor-pointer">
                  <h4 className="text-white text-sm font-semibold group-hover:text-[#e21224] transition-colors">死亡之谷的威脅</h4>
                  <p className="text-gray-400 text-xs mt-1">擊敗骷髏兵</p>
                  <div className="w-full bg-black h-1.5 mt-2 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-[#e21224] h-full w-[64%]"></div>
                  </div>
                  <p className="text-right text-[10px] text-gray-500 mt-0.5">32/50</p>
                </div>
                <div className="group cursor-pointer">
                  <h4 className="text-white text-sm font-semibold group-hover:text-[#e21224] transition-colors">稀有礦石收集</h4>
                  <p className="text-gray-400 text-xs mt-1">收集秘銀礦石</p>
                  <div className="w-full bg-black h-1.5 mt-2 rounded-full overflow-hidden border border-white/10">
                    <div className="bg-blue-600 h-full w-[20%]"></div>
                  </div>
                  <p className="text-right text-[10px] text-gray-500 mt-0.5">1/5</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer / Action Bar */}
        <footer className="mt-auto flex flex-col pointer-events-auto bg-gradient-to-t from-black/95 via-black/80 to-transparent pt-10 pb-4 px-4">
          <div className="flex items-end justify-between gap-4 w-full">
            {/* Chat */}
            <div className="w-[350px] flex flex-col ui-panel rounded h-[220px] backdrop-blur-md">
              <div className="flex border-b border-[#482326] bg-black/40">
                <button className="px-3 py-1.5 text-xs text-white bg-[#482326]/50 font-bold border-r border-[#482326]">全球</button>
                <button className="px-3 py-1.5 text-xs text-[#c99296] hover:text-white hover:bg-[#482326]/30 border-r border-[#482326] transition-colors">血盟</button>
                <button className="px-3 py-1.5 text-xs text-[#c99296] hover:text-white hover:bg-[#482326]/30 border-r border-[#482326] transition-colors">私訊</button>
                <button className="px-3 py-1.5 text-xs text-[#c99296] hover:text-white hover:bg-[#482326]/30 transition-colors">系統</button>
              </div>
              <div className="flex-1 overflow-y-auto p-2 text-xs font-sans leading-relaxed custom-scrollbar flex flex-col justify-end gap-1">
                <p className="text-yellow-500"><span className="font-bold">[系統]</span> 伺服器將在 2 小時後進行維護。</p>
                <p className="text-gray-300"><span className="text-[#e21224] font-bold">[全球] 黑暗殺手:</span> 屠龍副本缺坦補，要來的+++！</p>
                <p className="text-cyan-400"><span className="font-bold">[血盟] 艾拉拉:</span> 有人可以幫我做一些魔力藥水嗎？</p>
                <p className="text-purple-400"><span className="font-bold">[私訊] 來自 盜賊一號:</span> 嘿，那把劍你有要賣嗎？</p>
                <p className="text-gray-300"><span className="text-[#e21224] font-bold">[全球] 聖騎士Xx:</span> 出售 +7 長劍 便宜賣，意者密。</p>
              </div>
              <div className="p-1 border-t border-[#482326] bg-black/60 flex gap-1">
                <span className="text-gray-500 px-1 select-none text-xs flex items-center">[全球]</span>
                <input className="w-full bg-transparent border-none text-white text-xs focus:ring-0 p-1 placeholder-gray-600 outline-none" placeholder="按 Enter 鍵發送訊息..." type="text"/>
              </div>
            </div>

            {/* Skill Bar */}
            <div className="flex-1 flex justify-center pb-2">
              <div className="flex flex-col items-center gap-1">
                <div className="ui-panel p-2 rounded-lg flex items-center gap-2 bg-black/80 border-[#673237] relative">
                  <div className="absolute -left-3 top-1/2 -translate-y-1/2 w-3 h-12 bg-[#482326] rounded-l-md border-l border-y border-[#673237]"></div>
                  <div className="absolute -right-3 top-1/2 -translate-y-1/2 w-3 h-12 bg-[#482326] rounded-r-md border-r border-y border-[#673237]"></div>
                  
                  {/* Skills 1-5 */}
                  <div className="flex gap-1">
                    {[0, 1, 2, 3, 4].map((index) => {
                      const skill = engineRef.current?.player?.skills[index];
                      return (
                        <button 
                          key={index}
                          onClick={() => engineRef.current?.useSkill(index)}
                          className="group relative w-10 h-10 bg-[#221112] border border-[#482326] rounded hover:border-[#e21224] transition-colors flex items-center justify-center"
                          title={skill?.name}
                        >
                          {skill ? (
                            <span className="material-symbols-outlined text-white text-lg">{skill.icon}</span>
                          ) : (
                            <span className="text-white/20">-</span>
                          )}
                          <span className="absolute top-0.5 left-0.5 text-[9px] text-gray-400 font-bold leading-none">{index + 1}</span>
                        </button>
                      );
                    })}
                  </div>
                  
                  <div className="w-px h-8 bg-[#482326] mx-1"></div>
                  
                  {/* Extra Buttons (Q, W, E placeholders) */}
                  <div className="flex gap-1">
                    <button className="group relative w-10 h-10 bg-[#221112] border border-[#482326] rounded hover:border-[#e21224] transition-colors flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-red-900 border border-red-500 shadow-[0_0_5px_rgba(239,68,68,0.5)]"></div>
                      <span className="absolute top-0.5 left-0.5 text-[9px] text-gray-400 font-bold leading-none">Q</span>
                      <span className="absolute bottom-0 right-0.5 text-[9px] text-white font-bold leading-none bg-black/70 px-0.5 rounded">45</span>
                    </button>
                    <button className="group relative w-10 h-10 bg-[#221112] border border-[#482326] rounded hover:border-[#e21224] transition-colors flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-blue-900 border border-blue-500 shadow-[0_0_5px_rgba(59,130,246,0.5)]"></div>
                      <span className="absolute top-0.5 left-0.5 text-[9px] text-gray-400 font-bold leading-none">W</span>
                      <span className="absolute bottom-0 right-0.5 text-[9px] text-white font-bold leading-none bg-black/70 px-0.5 rounded">12</span>
                    </button>
                    <button className="group relative w-10 h-10 bg-[#221112] border border-[#482326] rounded hover:border-[#e21224] transition-colors flex items-center justify-center">
                      <div className="w-6 h-6 rounded-full bg-purple-900 border border-purple-500 shadow-[0_0_5px_rgba(168,85,247,0.5)]"></div>
                      <span className="absolute top-0.5 left-0.5 text-[9px] text-gray-400 font-bold leading-none">E</span>
                      <span className="absolute bottom-0 right-0.5 text-[9px] text-white font-bold leading-none bg-black/70 px-0.5 rounded">3</span>
                    </button>
                  </div>
                </div>
                
                {/* EXP Bar */}
                {playerStats && (
                  <>
                    <div className="w-full max-w-[400px] h-2 bg-black border border-[#482326] rounded-full relative mt-1 overflow-hidden">
                      <div className="absolute inset-0 bg-yellow-600/30 w-full h-full"></div>
                      <div 
                        className="absolute inset-0 bg-gradient-to-r from-yellow-700 to-yellow-500 h-full transition-all duration-300"
                        style={{ width: `${(playerStats.exp / playerStats.maxExp) * 100}%` }}
                      ></div>
                    </div>
                    <div className="text-[9px] text-gray-400 tracking-widest uppercase">
                      EXP 經驗值 {((playerStats.exp / playerStats.maxExp) * 100).toFixed(2)}%
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Menu Buttons */}
            <div className="w-[350px] flex justify-end gap-3 pb-2">
              <div className="grid grid-cols-3 gap-2">
                {['person', 'backpack', 'auto_stories', 'shield', 'assignment', 'storefront'].map((icon, i) => (
                  <button key={icon} className="ui-panel w-12 h-12 rounded flex flex-col items-center justify-center gap-0.5 hover:border-[#e21224] group transition-all">
                    <span className="material-symbols-outlined text-[#c99296] group-hover:text-white text-[24px]">{icon}</span>
                    <span className="text-[9px] text-gray-400 group-hover:text-white uppercase">
                      {['角色', '背包', '技能', '血盟', '任務', '商城'][i]}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </div>

      {/* Admin Panel */}
      {showAdmin && engineRef.current && (
        <AdminPanel engine={engineRef.current} onClose={() => setShowAdmin(false)} />
      )}
    </div>
  );
};
