
import React, { useState } from 'react';
import { UserProfile, Language } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onClose: () => void;
}

const AVATAR_OPTIONS = [
  '👨‍🎓', '👩‍🎓', '🧑‍🏫', '👩‍🏫', '🧑‍🔬', '👩‍🔬', '🧑‍💻', '👩‍💻', '👨‍🚀', '👩‍🚀', '🕵️', '👷',
  '🦖', '🦕', '🦊', '🐱', '🐶', '🐼', '🦁', '🐯', '🐨', '🦉', '🐝', '🦄',
  '🚀', '🧠', '📚', '🎨', '🧪', '🏆', '💡', '🌍', '💎', '🎨', '🎹', '🎸',
  '🥳', '😎', '🤠', '👻', '👾', '🤖', '🌈', '🔥', '✨', '🍎', '🍓', '🎮'
];

const ProfileModal: React.FC<Props> = ({ profile, onSave, onClose }) => {
  const [username, setUsername] = useState(profile.username);
  const [petName, setPetName] = useState(profile.pet.name);
  const [avatar, setAvatar] = useState(profile.avatar || AVATAR_OPTIONS[0]);
  const [language, setLanguage] = useState<Language>(profile.language || 'vi');
  const [dailyGoalHours, setDailyGoalHours] = useState(profile.dailyGoalHours || 3);

  const t = TRANSLATIONS[language];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      ...profile, 
      username, 
      avatar, 
      language,
      dailyGoalHours,
      pet: {
        ...profile.pet,
        name: petName
      }
    });
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-[60] animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden border-b-8 border-slate-200 dark:border-slate-800 transition-colors max-h-[95vh] flex flex-col">
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">{t.profile}</h2>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-950 transition-all text-2xl font-black"
            >
              ✕
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Language Selection */}
            <div className="space-y-2">
              <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t.language}</label>
              <div className="flex gap-1 p-1 bg-slate-50 dark:bg-black rounded-xl border border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setLanguage('vi')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-black text-xs transition-all ${language === 'vi' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-950 dark:text-white' : 'text-slate-400'}`}
                >
                  <span>🇻🇳</span> Tiếng Việt
                </button>
                <button
                  type="button"
                  onClick={() => setLanguage('en')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg font-black text-xs transition-all ${language === 'en' ? 'bg-white dark:bg-slate-800 shadow-sm text-slate-950 dark:text-white' : 'text-slate-400'}`}
                >
                  <span>🇺🇸</span> English
                </button>
              </div>
            </div>

            {/* Daily Goal Selection */}
            <div className="space-y-3 bg-slate-50 dark:bg-black p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <div className="flex justify-between items-center">
                <label className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest">Mục tiêu học tập</label>
                <span className="text-xs font-black text-purple-600 bg-purple-100 dark:bg-purple-900/30 px-2.5 py-1 rounded-md">{dailyGoalHours} giờ / ngày</span>
              </div>
              <input 
                type="range" 
                min="1" 
                max="12" 
                step="0.5"
                value={dailyGoalHours} 
                onChange={(e) => setDailyGoalHours(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-purple-600"
              />
              <p className="text-[10px] font-bold text-slate-400 italic text-center">* Đạt mục tiêu này để nhận +1 EXP mỗi ngày!</p>
            </div>

            <div className="flex flex-col items-center">
              <div className="relative group mb-3">
                <div className="w-20 h-20 bg-slate-50 dark:bg-black rounded-full flex items-center justify-center text-5xl shadow-inner border-4 border-white dark:border-slate-800">
                  {avatar}
                </div>
              </div>
              <p className="text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-[0.3em] mb-3">{t.avatarLabel}</p>
              <div className="w-full bg-slate-50 dark:bg-black/50 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <div className="grid grid-cols-6 gap-2 max-h-32 overflow-y-auto pr-1.5 custom-scrollbar">
                  {AVATAR_OPTIONS.map(a => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAvatar(a)}
                      className={`w-9 h-9 flex items-center justify-center rounded-xl text-xl transition-all ${avatar === a ? 'bg-green-600 text-white' : 'bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800'}`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{t.usernameLabel}</label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-green-600 outline-none font-black text-sm dark:text-white transition-all shadow-sm"
                />
              </div>

              <div className="space-y-1.5">
                <label className="block text-[11px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest ml-1">{(t as any).petNameLabel || "Tên Linh vật của cậu?"}</label>
                <input
                  type="text"
                  value={petName}
                  onChange={(e) => setPetName(e.target.value)}
                  className="w-full p-3.5 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-slate-800 rounded-xl focus:border-green-600 outline-none font-black text-sm dark:text-white transition-all shadow-sm"
                />
              </div>
            </div>

            <div className="flex gap-4 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-4 font-black text-slate-500 hover:text-slate-800 uppercase text-xs tracking-widest transition-colors"
              >
                Quay lại
              </button>
              <button
                type="submit"
                className="flex-2 py-4 px-8 bg-green-600 text-white font-black rounded-xl hover:bg-green-700 shadow-xl transition-all uppercase text-sm tracking-[0.15em]"
              >
                {t.saveProfile} ✨
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileModal;
