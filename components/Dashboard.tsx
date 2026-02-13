
import React from 'react';
import { UserProfile, PetAvatarType } from '../types';
import { DAYS_OF_WEEK, EXCLUDED_SUBJECTS, TRANSLATIONS } from '../constants';

interface Props {
  profile: UserProfile;
  onStartQuiz: () => void;
  onOpenChat: () => void;
  onEditSchedule: () => void;
}

const getIQTitle = (iq: number) => {
  if (iq < 100) return 'Nhập môn';
  if (iq < 200) return 'Có căn bản';
  if (iq < 300) return 'Khá';
  if (iq < 400) return 'Tốt';
  if (iq < 500) return 'Xuất sắc';
  if (iq < 600) return 'Cử nhân';
  if (iq < 700) return 'Thạc sĩ';
  if (iq < 800) return 'Tiến sĩ';
  if (iq < 900) return 'Giáo sư';
  return 'Chuyên gia';
};

const getPetVisual = (type: PetAvatarType, level: number, lang: 'vi' | 'en' = 'vi') => {
  const stage = level >= 10 ? 3 : level >= 5 ? 2 : level >= 2 ? 1 : 0;
  
  const visuals: Record<PetAvatarType, string[]> = {
    classic: ['🥚', '🦖', '🦕', '🐲'],
    cyber: ['💾', '🤖', '🦾', '🛸'],
    nature: ['🌱', '🌿', '🌳', '🐉'],
    magic: ['🔮', '✨', '🦄', '🧙‍♂️'],
    ocean: ['🥚', '🐙', '🦈', '🧜‍♂️'],
    space: ['☄️', '🛸', '👨‍🚀', '🌌'],
    fire: ['🥚', '🔥', '🦅', '🐲'],
    zen: ['🥚', '🎋', '🐼', '🏮']
  };

  const labels: Record<string, Record<PetAvatarType, string[]>> = {
    vi: {
      classic: ['Trứng Khủng Long', 'Dino Con', 'Dino Trưởng Thành', 'Cổ Long Thần Thoại'],
      cyber: ['Chip Khởi Tạo', 'Cyber Bot', 'Android Warrior', 'Hệ Điều Hành Tối Cao'],
      nature: ['Mầm Non Thức Tỉnh', 'Tiểu Thần Rừng', 'Linh Thú Đại Ngàn', 'Thần Long Thiên Nhiên'],
      magic: ['Tinh Thể Pháp Thuật', 'Phù Thủy Tập Sự', 'Kỳ Lân Ánh Sáng', 'Phù Thủy Tối Thượng'],
      ocean: ['Trứng Thủy Tộc', 'Bạch Tuộc Nhí', 'Cá Mập Tri Thức', 'Vua Biển Cả'],
      space: ['Thiên Thạch Con', 'UFO Thăm Dò', 'Phi Hành Gia AI', 'Thực Thể Thiên Hà'],
      fire: ['Hỏa Trứng', 'Đốm Lửa Nhỏ', 'Đại Bàng Lửa', 'Hỏa Long Vĩnh Cửu'],
      zen: ['Hạt Giống Thiền', 'Trúc Nhí', 'Gấu Trúc Tập Sự', 'Đại Sư Tĩnh Lặng']
    },
    en: {
      classic: ['Dino Egg', 'Baby Dino', 'Adult Dino', 'Mythical Dragon'],
      cyber: ['Init Chip', 'Cyber Bot', 'Android Warrior', 'Supreme OS'],
      nature: ['Awakened Sprout', 'Forest Spirit', 'Forest Beast', 'Nature Dragon'],
      magic: ['Magic Crystal', 'Apprentice Mage', 'Light Unicorn', 'Supreme Wizard'],
      ocean: ['Aquatic Egg', 'Baby Octopus', 'Wisdom Shark', 'King of Seas'],
      space: ['Meteorite', 'UFO Probe', 'AI Astronaut', 'Galactic Entity'],
      fire: ['Fire Egg', 'Small Spark', 'Fire Eagle', 'Eternal Fire Dragon'],
      zen: ['Zen Seed', 'Baby Bamboo', 'Apprentice Panda', 'Zen Master']
    }
  };

  return {
    icon: visuals[type][stage],
    label: labels[lang][type][stage],
  };
};

const Dashboard: React.FC<Props> = ({ profile, onStartQuiz, onOpenChat, onEditSchedule }) => {
  const lang = profile.language || 'vi';
  const t = TRANSLATIONS[lang];
  const today = DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
  const todaySubjects = profile.schedule[today] || [];
  const studySubjects = todaySubjects.filter(s => !EXCLUDED_SUBJECTS.includes(s));

  const isLocked = profile.lockoutUntil ? Date.now() < profile.lockoutUntil : false;
  const timeLeft = profile.lockoutUntil ? Math.ceil((profile.lockoutUntil - Date.now()) / (1000 * 60)) : 0;

  const petInfo = getPetVisual(profile.pet.avatarType, profile.pet.level, lang);
  
  const expPercentage = profile.pet.xp % 100;
  const iqPercentage = profile.pet.iq % 100;
  const iqTitle = getIQTitle(profile.pet.iq);

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-10 animate-fadeIn">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-4xl font-black text-slate-950 dark:text-white transition-colors">{t.welcome} {profile.username}! 👋</h1>
        </div>
        <button 
          onClick={onEditSchedule}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center gap-3"
        >
          <span>📅</span> {t.editPlan}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 bg-white dark:bg-slate-950 p-10 rounded-[3rem] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center relative transition-all">
          <div className="absolute top-6 right-6 bg-slate-950 dark:bg-white text-white dark:text-black text-[11px] font-black px-4 py-1.5 rounded-full shadow-lg z-10">Cấp {profile.pet.level}</div>
          
          <div className="relative mb-6">
             <div className="w-40 h-40 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-8xl shadow-inner border-4 border-white dark:border-slate-800 animate-float">
               {petInfo.icon}
             </div>
          </div>

          <h2 className="text-3xl font-black text-slate-950 dark:text-white mb-1 leading-tight">{profile.pet.name}</h2>
          <p className={`text-green-600 font-black text-sm uppercase tracking-[0.1em] mb-6`}>{petInfo.label}</p>
          
          {/* Thanh EXP - Màu Tím (Layout mới giống ảnh người dùng cung cấp) */}
          <div className="w-full mb-6">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-black text-purple-600 uppercase">EXP</span>
              <span className="text-sm font-black text-purple-600">{expPercentage}/100</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
              <div className="h-full bg-purple-500 rounded-full transition-all duration-700" style={{ width: `${expPercentage}%` }}></div>
            </div>
          </div>

          {/* Thanh IQ - Màu Cyan */}
          <div className="w-full mb-10">
            <div className="flex justify-between items-center mb-2 px-1">
              <span className="text-xs font-black text-cyan-600 uppercase">IQ: {profile.pet.iq}</span>
              <span className="text-sm font-black text-cyan-600">{iqTitle}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
              <div className="h-full bg-cyan-500 rounded-full transition-all duration-700" style={{ width: `${iqPercentage}%` }}></div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onOpenChat}
            className="w-full py-6 bg-green-600 text-white font-black rounded-[1.8rem] transition-all flex items-center justify-center space-x-3 shadow-xl hover:bg-green-700 active:scale-95 group overflow-hidden"
          >
            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center text-xl group-hover:scale-125 transition-transform">💬</div>
            <span className="text-lg">Chat với {profile.pet.name}</span>
          </button>
        </div>

        <div className="lg:col-span-2 space-y-8">
          <div className={`p-10 rounded-[3rem] text-white shadow-2xl relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-800`}>
             <div className="relative z-10">
               <h2 className="text-3xl font-black mb-4 flex items-center">
                 <span className="mr-3">📖</span> Luyện tập hôm nay
               </h2>
               <p className="text-white/90 font-bold text-lg mb-6">{t.subjectsToFinish} {today}:</p>
               <div className="flex flex-wrap gap-3">
                 {studySubjects.length > 0 ? studySubjects.map(s => (
                   <span key={s} className="px-5 py-3 bg-white/15 backdrop-blur-xl rounded-2xl text-base font-black border border-white/20">
                     {s}
                   </span>
                 )) : <span className="text-white/70 italic font-bold text-lg">{t.restDay}</span>}
               </div>
             </div>
          </div>

          <div className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="text-center md:text-left">
              <div className="text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-2">{t.currentStreak}</div>
              <div className="text-6xl font-black text-amber-500 flex items-center justify-center md:justify-start">
                <span className="mr-4">🔥</span> {profile.streak} <span className="text-2xl ml-4 text-slate-400 font-black uppercase tracking-tighter">{t.streak}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onStartQuiz}
              disabled={isLocked || studySubjects.length === 0}
              className={`w-full md:w-auto px-16 py-8 rounded-[2.5rem] font-black text-2xl shadow-2xl transition-all ${
                isLocked ? 'bg-slate-100 text-slate-400' : 'bg-[#0ea5e9] text-white hover:scale-105 shadow-sky-200/50'
              }`}
            >
              {isLocked ? `Chờ ${timeLeft}p` : `LUYỆN TẬP NGAY ⚡`}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
