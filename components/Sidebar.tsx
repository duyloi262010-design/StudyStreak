
import React from 'react';
import { AppState, Language } from '../types';

interface SidebarProps {
  activeState: AppState;
  onNavigate: (state: AppState) => void;
  onOpenSettings: () => void;
  lang: Language;
}

const Sidebar: React.FC<SidebarProps> = ({ activeState, onNavigate, onOpenSettings, lang }) => {
  const menuItems = [
    { id: AppState.DASHBOARD, label: lang === 'vi' ? 'Tổng quan' : 'Overview', icon: '🏠' },
    { id: AppState.SCHEDULE_MANAGER, label: lang === 'vi' ? 'Lịch học' : 'Schedule', icon: '📅' },
    { id: AppState.PROGRESS, label: lang === 'vi' ? 'Tiến độ' : 'Progress', icon: '📈' },
    { id: AppState.LESSON_INPUT, label: lang === 'vi' ? 'Học' : 'Study', icon: '📖' },
  ];

  return (
    <aside className="fixed bottom-0 left-0 w-full lg:w-72 lg:h-screen lg:sticky lg:top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-lg lg:backdrop-blur-none text-slate-900 dark:text-slate-100 p-1 lg:p-6 flex lg:flex-col z-50 border-t lg:border-t-0 lg:border-r border-slate-200 dark:border-slate-800 transition-all duration-300 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] lg:shadow-none">
      {/* Logo Area - Hidden on Mobile */}
      <div className="hidden lg:flex items-center space-x-3 mb-10 px-4">
        <div className="w-10 h-10 bg-green-600 rounded-xl flex items-center justify-center text-white text-xl shadow-lg shadow-green-200 dark:shadow-none">🦖</div>
        <span className="font-black text-slate-950 dark:text-white text-xl italic tracking-tighter">StudyStreak</span>
      </div>

      {/* Navigation Items */}
      <nav className="flex lg:flex-col flex-1 justify-around lg:justify-start lg:space-y-3 w-full">
        {menuItems.map((item) => {
          const isActive = activeState === item.id || 
            (item.id === AppState.LESSON_INPUT && (activeState === AppState.QUIZ || activeState === AppState.RESULT || activeState === AppState.REVIEW));
          
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={`flex items-center lg:space-x-4 px-2 lg:px-4 py-2 lg:py-4 rounded-xl lg:rounded-2xl transition-all duration-200 group flex-col lg:flex-row flex-1 lg:flex-none ${
                isActive 
                ? 'bg-[#0ea5e9] text-white shadow-lg lg:shadow-sky-200 dark:shadow-none font-black' 
                : 'hover:bg-slate-100 dark:hover:bg-slate-900 text-slate-900 dark:text-slate-300 font-bold'
              }`}
            >
              <span className={`text-xl lg:text-2xl transition-transform duration-200 ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                {item.icon}
              </span>
              <span className={`text-[9px] sm:text-[10px] lg:text-sm mt-0.5 lg:mt-0 uppercase lg:normal-case tracking-tight font-black lg:font-bold ${isActive ? 'opacity-100' : 'opacity-60 group-hover:opacity-100'}`}>
                {item.label}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Settings at Bottom - Hidden on Mobile */}
      <div className="hidden lg:block mt-auto border-t border-slate-100 dark:border-slate-800 pt-6">
        <button
          onClick={onOpenSettings}
          className="flex items-center space-x-4 px-4 py-4 w-full rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-900 transition-all group"
        >
          <span className="text-2xl opacity-80 group-hover:opacity-100 group-hover:rotate-45 transition-all">⚙️</span>
          <span className="text-sm font-black text-slate-900 dark:text-slate-300 opacity-80 group-hover:opacity-100">{lang === 'vi' ? 'Cài đặt' : 'Settings'}</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
