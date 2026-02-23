import React from 'react';
import { ClassType } from '../game/types';

interface ClassSelectionProps {
  onSelect: (classType: ClassType) => void;
}

const CLASSES: { id: ClassType; name: string; desc: string; icon: string; color: string }[] = [
  { id: 'warrior', name: '戰士', desc: '坦克 / 近戰輸出', icon: 'shield', color: 'bg-red-600' },
  { id: 'priest', name: '牧師', desc: '治療 / 輔助', icon: 'health_and_safety', color: 'bg-amber-500' },
  { id: 'mage', name: '法師', desc: '遠程魔法輸出', icon: 'auto_fix_high', color: 'bg-blue-600' },
  { id: 'summoner', name: '召喚師', desc: '寵物 / 控場', icon: 'pets', color: 'bg-purple-600' },
  { id: 'archer', name: '弓箭手', desc: '遠程物理輸出', icon: 'gps_fixed', color: 'bg-green-600' },
];

export const ClassSelection: React.FC<ClassSelectionProps> = ({ onSelect }) => {
  return (
    <div className="min-h-screen bg-background-dark flex flex-col items-center justify-center p-4">
      <h2 className="text-4xl font-display font-bold text-white mb-12 uppercase tracking-widest">選擇你的職業</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-7xl w-full">
        {CLASSES.map((cls) => (
          <button
            key={cls.id}
            onClick={() => onSelect(cls.id)}
            className="group relative bg-surface-dark border border-white/10 rounded-xl p-6 hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 flex flex-col items-center gap-4 text-center"
          >
            <div className={`size-20 rounded-full ${cls.color} flex items-center justify-center text-white shadow-lg group-hover:shadow-primary/40 transition-shadow`}>
              <span className="material-symbols-outlined text-4xl">{cls.icon}</span>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white uppercase tracking-wider">{cls.name}</h3>
              <p className="text-slate-400 text-sm mt-2 font-sans">{cls.desc}</p>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-xl pointer-events-none"></div>
          </button>
        ))}
      </div>
    </div>
  );
};
