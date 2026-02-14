
import React from 'react';
import { motion } from 'framer-motion';
import { UserProfile, PetAvatarType } from '../types';
import { DAYS_OF_WEEK, EXCLUDED_SUBJECTS, TRANSLATIONS, STUDY_TIPS } from '../constants';

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
    ocean: ['🥚', '🐙', '鯊', '🧜‍♂️'],
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

  const dateStr = new Date().toDateString();
  const hash = dateStr.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const tipsList = STUDY_TIPS[lang] || STUDY_TIPS['vi'];
  const dailyTip = tipsList[hash % tipsList.length];

  // Container variants for stagger effect
  const containerVariants = {
    animate: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };

  const itemVariants = {
    initial: { opacity: 0, scale: 0.95, y: 15 },
    animate: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { type: 'spring', stiffness: 300, damping: 25 }
    }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="initial"
      animate="animate"
      className="max-w-5xl mx-auto p-4 md:p-6 space-y-6 md:space-y-10 font-sans"
    >
      <motion.div variants={itemVariants} className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6">
        <div className="max-w-full overflow-hidden text-center md:text-left">
          <h1 className="font-display text-3xl md:text-4xl font-black text-slate-950 dark:text-white transition-colors truncate">
            {t.welcome} {profile.username}! 👋
          </h1>
        </div>
        <button 
          onClick={onEditSchedule}
          className="font-display w-full md:w-auto px-6 py-3 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black text-sm uppercase tracking-widest text-slate-600 dark:text-slate-400 hover:bg-white dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-3 shrink-0 active:scale-95"
        >
          <span>📅</span> {t.editPlan}
        </button>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
        <motion.div variants={itemVariants} className="lg:col-span-1 bg-white dark:bg-slate-950 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col items-center text-center relative transition-all">
          <div className="font-display absolute top-4 right-4 md:top-6 md:right-6 bg-slate-950 dark:bg-white text-white dark:text-black text-[10px] md:text-[11px] font-black px-3 py-1 md:px-4 md:py-1.5 rounded-full shadow-lg z-10 uppercase">Cấp {profile.pet.level}</div>
          
          <div className="relative mb-4 md:mb-6 mt-4">
             <motion.div 
               initial={{ rotate: -5, scale: 0.9 }}
               animate={{ rotate: 0, scale: 1 }}
               transition={{ type: 'spring', stiffness: 200, damping: 12 }}
               className="w-32 h-32 md:w-40 md:h-40 bg-slate-50 dark:bg-slate-900 rounded-full flex items-center justify-center text-6xl md:text-8xl shadow-inner border-4 border-white dark:border-slate-800 animate-float"
             >
               {petInfo.icon}
             </motion.div>
          </div>

          <h2 className="font-display text-2xl md:text-3xl font-black text-slate-950 dark:text-white mb-1 leading-tight w-full truncate px-4">{profile.pet.name}</h2>
          <p className={`font-display text-green-600 font-black text-xs md:text-sm uppercase tracking-[0.1em] mb-4 md:mb-6 truncate w-full px-2`}>{petInfo.label}</p>
          
          <div className="w-full mb-4 md:mb-6 px-2">
            <div className="flex justify-between items-center mb-1.5 px-1">
              <span className="font-display text-[10px] font-black text-purple-600 uppercase">EXP</span>
              <span className="font-display text-xs font-black text-purple-600">{expPercentage}/100</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 md:h-4 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${expPercentage}%` }}
                transition={{ duration: 1, delay: 0.3 }}
                className="h-full bg-purple-500 rounded-full"
              ></motion.div>
            </div>
          </div>

          <div className="w-full mb-8 md:mb-10 px-2">
            <div className="flex justify-between items-center mb-1.5 px-1">
              <span className="font-display text-[10px] font-black text-cyan-600 uppercase">IQ: {profile.pet.iq}</span>
              <span className="font-display text-xs font-black text-cyan-600 uppercase">{iqTitle}</span>
            </div>
            <div className="w-full bg-slate-100 dark:bg-slate-900 h-3 md:h-4 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800 p-0.5">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${iqPercentage}%` }}
                transition={{ duration: 1, delay: 0.4 }}
                className="h-full bg-cyan-500 rounded-full"
              ></motion.div>
            </div>
          </div>

          <button 
            type="button"
            onClick={onOpenChat}
            className="font-display w-full py-4 md:py-6 bg-green-600 text-white font-black rounded-[1.5rem] transition-all flex items-center justify-center space-x-3 shadow-xl hover:bg-green-700 active:scale-95 group overflow-hidden"
          >
            <div className="w-8 h-8 md:w-10 md:h-10 bg-white/20 rounded-full flex items-center justify-center text-xl group-hover:scale-125 transition-transform">💬</div>
            <span className="text-base md:text-lg truncate">Chat với {profile.pet.name}</span>
          </button>
        </motion.div>

        <div className="lg:col-span-2 space-y-6 md:space-y-8">
          <motion.div 
            variants={itemVariants}
            className={`p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] text-white shadow-2xl relative overflow-hidden bg-gradient-to-br from-green-600 to-emerald-800`}
          >
             <div className="relative z-10">
               <h2 className="font-display text-2xl md:text-3xl font-black mb-3 md:mb-4 flex items-center">
                 <span className="mr-3">📖</span> Luyện tập hôm nay
               </h2>
               <p className="text-white/90 font-bold text-base md:text-lg mb-4 md:mb-6">{t.subjectsToFinish} {today}:</p>
               <div className="flex flex-wrap gap-2 md:gap-3">
                 {studySubjects.length > 0 ? studySubjects.map((s, idx) => (
                   <motion.span 
                    key={s} 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2 + (idx * 0.05) }}
                    className="font-display px-4 py-2 md:px-6 md:py-3 bg-white/15 backdrop-blur-xl rounded-xl md:rounded-2xl text-sm md:text-lg font-black border border-white/20"
                   >
                     {s}
                   </motion.span>
                 )) : <span className="text-white/70 italic font-bold text-base md:text-lg">{t.restDay}</span>}
               </div>
             </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-amber-50 dark:bg-slate-900/50 p-6 md:p-8 rounded-[2.5rem] border-2 border-amber-100 dark:border-slate-800 shadow-sm flex items-start gap-4 transition-all">
            <div className="w-12 h-12 bg-amber-100 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl shrink-0 shadow-inner">💡</div>
            <div>
              <h3 className="font-display text-xs md:text-sm font-black text-amber-700 dark:text-amber-500 uppercase tracking-widest mb-1">{t.dailyTip}</h3>
              <p className="text-slate-700 dark:text-slate-300 font-bold text-sm md:text-base leading-relaxed">
                {dailyTip}
              </p>
            </div>
          </motion.div>

          <motion.div variants={itemVariants} className="bg-white dark:bg-slate-950 p-6 md:p-10 rounded-[2.5rem] md:rounded-[3rem] shadow-xl border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-6 md:gap-8">
            <div className="text-center md:text-left w-full md:w-auto">
              <div className="font-display text-[10px] md:text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.2em] mb-1 md:mb-2">{t.currentStreak}</div>
              <div className="font-display text-5xl md:text-6xl font-black text-amber-500 flex items-center justify-center md:justify-start">
                <span className="mr-3 md:mr-4">🔥</span> {profile.streak} <span className="font-display text-xl md:text-2xl ml-2 md:ml-4 text-slate-400 font-black uppercase tracking-tighter">{t.streak}</span>
              </div>
            </div>
            <button
              type="button"
              onClick={onStartQuiz}
              disabled={isLocked || studySubjects.length === 0}
              className={`font-display w-full md:w-auto px-8 md:px-16 py-6 md:py-8 rounded-[1.8rem] md:rounded-[2.5rem] font-black text-xl md:text-2xl shadow-2xl transition-all ${
                isLocked ? 'bg-slate-100 text-slate-400 opacity-50' : 'bg-[#0ea5e9] text-white hover:scale-105 active:scale-95 shadow-sky-200/50'
              }`}
            >
              {isLocked ? `Chờ ${timeLeft}p` : `HỌC NGAY ⚡`}
            </button>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
