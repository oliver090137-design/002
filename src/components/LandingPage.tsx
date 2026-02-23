import React from 'react';

interface LandingPageProps {
  onPlay: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onPlay }) => {
  return (
    <div className="bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-display min-h-screen flex flex-col overflow-x-hidden selection:bg-primary selection:text-white">
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-white/10 bg-background-dark/80 backdrop-blur-md transition-all duration-300">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <div className="size-10 text-primary flex items-center justify-center bg-primary/10 rounded-full border border-primary/20">
                <span className="material-symbols-outlined text-3xl">local_fire_department</span>
              </div>
              <div className="flex flex-col">
                <span className="text-white text-xl font-black tracking-wider uppercase leading-none">永恆</span>
                <span className="text-primary text-sm font-bold tracking-[0.2em] uppercase leading-none">血誓</span>
              </div>
            </div>
            <nav className="hidden md:flex items-center gap-8">
              <a className="text-slate-300 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors relative group" href="#">
                職業介紹
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
              <a className="text-slate-300 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors relative group" href="#">
                世界地圖
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
              <a className="text-slate-300 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors relative group" href="#">
                血盟與攻城
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
              <a className="text-slate-300 hover:text-white text-sm font-bold uppercase tracking-widest transition-colors relative group" href="#">
                社群互動
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
              </a>
            </nav>
            <div className="flex items-center gap-4">
              <button 
                onClick={onPlay}
                className="hidden sm:flex items-center justify-center h-10 px-6 bg-primary hover:bg-primary-dark text-white text-sm font-black uppercase tracking-wider rounded transition-all duration-300 shadow-[0_0_15px_rgba(226,18,36,0.3)] hover:shadow-[0_0_25px_rgba(226,18,36,0.6)] border border-primary-dark cursor-pointer"
              >
                立即開戰
              </button>
              <button className="md:hidden text-white p-2">
                <span className="material-symbols-outlined">menu</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img alt="Dark fantasy castle silhouette against a moody twilight sky with fog" className="w-full h-full object-cover object-center opacity-60" src="https://lh3.googleusercontent.com/aida-public/AB6AXuA4eVNmoWm3b3PcT8544OEL-wQS8B5xfLmldUwBsSp6jarMOBzL9ZGJSISum4UojcclgjdMNZp-rwCGRuDcyEtp3dHO3g6U1o9LX077rFazA7VQHrLDF2vUsfYnojupLPcJ__TtmY-3Pef07m_VyJFNU-fbNqnGnDge_5NtmjfI4yLqjiPr6_1crUQbFTQiGevN4wmXhy2lxrOoCmEm9rhp0cgiSxy1hpdfHPq1o_7dZq-yiSPJhXWFyrsED9Php4QumaLBOa2cedaa"/>
          <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/50 to-transparent"></div>
          <div className="absolute inset-0 bg-gradient-to-r from-background-dark/80 via-transparent to-background-dark/80"></div>
        </div>
        <div className="relative z-10 max-w-7xl mx-auto px-4 flex flex-col items-center text-center">
          <div className="mb-6 flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 backdrop-blur-sm">
            <span className="size-2 rounded-full bg-primary animate-pulse"></span>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-300">第五季：龍之崛起 現已上線</span>
          </div>
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-black text-white tracking-tighter uppercase mb-2 drop-shadow-2xl font-display">
            永恆 <span className="text-transparent bg-clip-text bg-gradient-to-b from-primary to-red-900 text-glow">血誓</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-light text-slate-300 tracking-[0.2em] uppercase mb-8 border-y border-white/10 py-2">
            編年史
          </h2>
          <p className="max-w-2xl text-slate-400 text-lg md:text-xl mb-10 leading-relaxed font-sans">
            無需下載，點擊即玩。在巨龍時代鑄造您的傳奇。這是一場史詩般的網頁 MMORPG 體驗，您的血統將決定您的命運。
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full justify-center">
            <button 
              onClick={onPlay}
              className="h-14 px-8 bg-primary hover:bg-primary-dark text-white text-base font-black uppercase tracking-wider rounded transition-all duration-300 shadow-[0_0_20px_rgba(226,18,36,0.4)] hover:shadow-[0_0_40px_rgba(226,18,36,0.6)] hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span className="material-symbols-outlined">swords</span>
              網頁直接玩
            </button>
            <button className="h-14 px-8 bg-transparent hover:bg-white/5 border border-white/20 text-white text-base font-bold uppercase tracking-wider rounded transition-all duration-300 flex items-center justify-center gap-2 backdrop-blur-sm group cursor-pointer">
              <span className="material-symbols-outlined group-hover:text-primary transition-colors">play_circle</span>
              觀看預告片
            </button>
          </div>
        </div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
          <span className="text-[10px] uppercase tracking-[0.2em] text-slate-500">捲動</span>
          <span className="material-symbols-outlined text-slate-500">keyboard_arrow_down</span>
        </div>
      </section>

      <section className="py-24 bg-surface-dark border-t border-white/5 relative">
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">遊戲特色</h2>
            <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">史詩般的冒險等待著您</h3>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="group relative bg-background-dark border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-colors duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col gap-6">
                <div className="size-14 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">castle</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">壯闊攻城戰火</h4>
                  <p className="text-slate-400 leading-relaxed font-sans">參與大規模 PvP 攻城戰，爭奪城堡統治權。帶領您的公會邁向勝利，並向領地徵收稅金。</p>
                </div>
              </div>
            </div>
            <div className="group relative bg-background-dark border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-colors duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col gap-6">
                <div className="size-14 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">swords</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">經典職業系統</h4>
                  <p className="text-slate-400 leading-relaxed font-sans">掌握具有獨特技能樹和能力的獨特角色。無職業鎖定——在戰場上隨時調整您的策略。</p>
                </div>
              </div>
            </div>
            <div className="group relative bg-background-dark border border-white/5 rounded-xl p-8 hover:border-primary/30 transition-colors duration-300 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <div className="relative z-10 flex flex-col gap-6">
                <div className="size-14 rounded-lg bg-surface-dark border border-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform duration-300">
                  <span className="material-symbols-outlined text-3xl">currency_exchange</span>
                </div>
                <div>
                  <h4 className="text-xl font-bold text-white mb-2 uppercase tracking-wide">自由貿易市場</h4>
                  <p className="text-slate-400 leading-relaxed font-sans">參與完全由玩家驅動的經濟體系，毫無限制。製作、交易並拍賣稀有戰利品以獲取真實價值。</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-background-dark relative overflow-hidden">
        <div className="absolute right-0 top-0 w-1/2 h-full bg-surface-dark/50 skew-x-12 translate-x-1/3"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-primary font-bold tracking-widest uppercase text-sm mb-3">選擇您的道路</h2>
              <h3 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight">王國職業</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              <button className="px-4 py-2 bg-primary text-white text-xs font-bold uppercase tracking-wider rounded shadow-lg shadow-primary/20">戰士</button>
              <button className="px-4 py-2 bg-surface-dark border border-white/10 hover:border-primary/50 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors">牧師</button>
              <button className="px-4 py-2 bg-surface-dark border border-white/10 hover:border-primary/50 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors">法師</button>
              <button className="px-4 py-2 bg-surface-dark border border-white/10 hover:border-primary/50 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors">召喚師</button>
              <button className="px-4 py-2 bg-surface-dark border border-white/10 hover:border-primary/50 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-wider rounded transition-colors">弓箭手</button>
            </div>
          </div>
          <div className="bg-surface-dark border border-white/5 rounded-2xl overflow-hidden shadow-2xl">
            <div className="grid md:grid-cols-2">
              <div className="relative h-[500px] md:h-auto bg-black overflow-hidden group">
                <img alt="Warrior class character portrait with glowing red eyes" className="absolute inset-0 w-full h-full object-cover object-top opacity-80 group-hover:scale-105 transition-transform duration-700" src="https://lh3.googleusercontent.com/aida-public/AB6AXuCi4EBylRxhuOCunKoIC86HonfEPjONdNvHizc7oo_dnc2W5p9uZiDjbKbfmezSf8sQkNPfL9ie1i7_Fbk3TthdIMbPuLSZYBJt9a8gv04h-jviOyklARLDzCnDBKY3IPsi70GOpyxCCB3C5oDhrYGHHzIx0lCbTb-KidukRR_EsPfnOliEDgBNmlEU3pdvAHpXL2VK3LJWckTwZrSFvcPrPAHOPkp8AcqUcqizO9hjRqEUCO_OF6TbJTDQ7druUm5O70C6V37tgzo1"/>
                <div className="absolute inset-0 bg-gradient-to-t from-surface-dark via-transparent to-transparent md:bg-gradient-to-r md:from-transparent md:to-surface-dark"></div>
                <div className="absolute top-6 left-6 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-lg">
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-primary text-sm">shield</span>
                    <span className="text-xs font-bold text-white uppercase tracking-wider">坦克 / 近戰輸出</span>
                  </div>
                </div>
              </div>
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h4 className="text-4xl font-black text-white uppercase mb-2">戰士</h4>
                <p className="text-primary font-bold tracking-widest uppercase text-sm mb-6">北境守護者</p>
                <p className="text-slate-400 mb-8 leading-relaxed font-sans">
                  在無盡戰火中淬鍊而生，戰士是抵禦黑暗的堅固壁壘。憑藉無與倫比的力量和厚重鎧甲，他們衝鋒陷陣，粉碎敵軍陣線，以堅定不移的決心守護盟友。
                </p>
                <div className="space-y-4 mb-8">
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      <span>力量</span>
                      <span>95%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[95%] shadow-[0_0_10px_rgba(226,18,36,0.5)]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      <span>防禦</span>
                      <span>90%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[90%] shadow-[0_0_10px_rgba(226,18,36,0.5)]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      <span>敏捷</span>
                      <span>40%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[40%] shadow-[0_0_10px_rgba(226,18,36,0.5)]"></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-xs font-bold uppercase tracking-wider text-slate-300 mb-1">
                      <span>魔力</span>
                      <span>10%</span>
                    </div>
                    <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-primary w-[10%] shadow-[0_0_10px_rgba(226,18,36,0.5)]"></div>
                    </div>
                  </div>
                </div>
                <button className="self-start text-white border-b border-primary pb-1 hover:text-primary transition-colors text-sm font-bold uppercase tracking-widest group flex items-center gap-2">
                  查看完整技能樹
                  <span className="material-symbols-outlined text-sm group-hover:translate-x-1 transition-transform">arrow_forward</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 relative bg-surface-dark border-y border-white/5">
        <div className="absolute inset-0 opacity-20 bg-[url('https://www.transparenttextures.com/patterns/black-scales.png')]"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tight mb-6">無邊界的世界</h2>
          <p className="max-w-2xl mx-auto text-slate-400 text-lg mb-10 font-sans">
            探索廣闊的亞丁大陸。從北方的冰封山峰到南方的灼熱沙海，每個角落都隱藏著秘密、危險與寶藏。
          </p>
          <div className="relative rounded-xl overflow-hidden border border-white/10 aspect-video max-w-4xl mx-auto shadow-2xl group cursor-pointer">
            <img alt="Map of the Aden Continent showing various territories" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 opacity-60 group-hover:opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuBqsMwbSt68slag8_-dj52fnuvBMzl7ZXBGb0nHzvWl-gjgO9r6S9JFILR9UCsKe4kSsnA-YqBCJnyaDO0XE4PuKqOVRWVE9v3Lab0aKcn__UX7BVhDqsT_lTVz1R7PXqek9eJ5ZY6zn7dfKHYq5yZsB_RbfDOtX5TJWzTYdfXNPLR_UbC9M0qqH6Bf_fnohaMW_OsF4Ya_vm1plMthTfCy45IGAvmHdhlLlMJ6ZHBY_z5MfpBesWFbEDm6jRPoHODQBc1m1YH3iit5"/>
            <div className="absolute inset-0 flex items-center justify-center bg-black/40 group-hover:bg-black/20 transition-colors">
              <div className="size-20 rounded-full bg-primary/90 flex items-center justify-center shadow-lg shadow-primary/40 group-hover:scale-110 transition-transform">
                <span className="material-symbols-outlined text-white text-4xl">public</span>
              </div>
            </div>
            <div className="absolute bottom-4 left-4 bg-black/70 px-4 py-2 rounded border border-white/10 backdrop-blur">
              <span className="text-white text-xs font-bold uppercase tracking-widest flex items-center gap-2">
                <span className="size-2 bg-green-500 rounded-full animate-pulse"></span>
                伺服器線上
              </span>
            </div>
          </div>
        </div>
      </section>

      <footer className="bg-black pt-16 pb-8 border-t border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center gap-2 mb-6">
                <span className="material-symbols-outlined text-primary text-2xl">local_fire_department</span>
                <span className="text-white text-lg font-black tracking-wider uppercase">永恆血誓</span>
              </div>
              <p className="text-slate-500 text-sm leading-relaxed mb-6 font-sans">
                權威的高奇幻網頁 MMORPG 體驗。加入全球數百萬玩家的行列，無需下載，直接開戰。
              </p>
              <div className="flex gap-4">
                <a className="size-10 rounded bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary transition-colors" href="#">
                  <span className="material-symbols-outlined text-lg">videogame_asset</span>
                </a>
                <a className="size-10 rounded bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary transition-colors" href="#">
                  <span className="material-symbols-outlined text-lg">forum</span>
                </a>
                <a className="size-10 rounded bg-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-primary transition-colors" href="#">
                  <span className="material-symbols-outlined text-lg">hub</span>
                </a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">遊戲資訊</h4>
              <ul className="space-y-3 font-sans">
                <li><a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">更新日誌</a></li>
                <li><a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">伺服器狀態</a></li>
                <li><a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">物品資料庫</a></li>
                <li><a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">新手指南</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">支援服務</h4>
              <ul className="space-y-3 font-sans">
                <li><a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">幫助中心</a></li>
                <li><a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">帳號安全</a></li>
                <li><a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">提交回報單</a></li>
                <li><a className="text-slate-500 hover:text-primary transition-colors text-sm" href="#">家長監護</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-white font-bold uppercase tracking-wider mb-6 text-sm">保持更新</h4>
              <form className="flex flex-col gap-3 font-sans">
                <input className="bg-white/5 border border-white/10 rounded px-4 py-3 text-white text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all placeholder:text-slate-600" placeholder="輸入您的電子郵件" type="email"/>
                <button className="bg-white/10 hover:bg-primary text-white text-sm font-bold uppercase tracking-wider py-3 rounded transition-colors" type="button">訂閱</button>
              </form>
            </div>
          </div>
          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-slate-600 text-xs font-sans">
              © 2024 Eternal Bloodline Inc. All rights reserved. 
            </div>
            <div className="flex gap-6 font-sans">
              <a className="text-slate-600 hover:text-slate-400 text-xs" href="#">隱私政策</a>
              <a className="text-slate-600 hover:text-slate-400 text-xs" href="#">服務條款</a>
              <a className="text-slate-600 hover:text-slate-400 text-xs" href="#">聯絡我們</a>
            </div>
            <div className="px-3 py-1 border border-slate-700 rounded bg-white/5">
              <span className="text-slate-500 text-[10px] font-black uppercase tracking-tighter">Rated M for Mature</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
