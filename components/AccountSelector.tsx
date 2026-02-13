
import React from 'react';
import { UserProfile, PetAvatarType } from '../types';
import { TRANSLATIONS } from '../constants';

interface Props {
  profiles: UserProfile[];
  onSelect: (p: UserProfile) => void;
  onAdd: () => void;
}

const getAccountPetEmoji = (type: PetAvatarType, streak: number) => {
  const stage = streak >= 60 ? 3 : streak >= 30 ? 2 : streak >= 8 ? 1 : 0;
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
  return visuals[type][stage];
};

const AccountSelector: React.FC<Props> = ({ profiles, onSelect, onAdd }) => {
  const t = TRANSLATIONS['vi']; // Default to VI for selector

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 animate-fadeIn font-sans">
      <div className="text-center mb-16">
        <h1 className="font-display text-5xl md:text-6xl font-black text-slate-950 dark:text-white mb-6 tracking-tight italic">{t.whoIsStudying}</h1>
        <p className="font-display text-slate-600 dark:text-slate-400 font-bold text-2xl">{t.chooseProfile}</p>
      </div>

      <div className="flex flex-wrap justify-center gap-12 max-w-6xl">
        {profiles.map(profile => (
          <button
            key={profile.id}
            onClick={() => onSelect(profile)}
            className="group flex flex-col items-center space-y-6 transition-all duration-300 transform hover:scale-110"
          >
            <div className={`w-40 h-40 md:w-48 md:h-48 rounded-[3.5rem] shadow-2xl flex items-center justify-center text-7xl md:text-8xl transition-all border-4 border-transparent group-hover:border-green-600 bg-white dark:bg-slate-950 relative overflow-hidden`}>
              <span className="relative z-10 filter group-hover:drop-shadow-xl transition-all">
                {profile.avatar || getAccountPetEmoji(profile.pet.avatarType, profile.streak)}
              </span>
              {profile.streak > 0 && (
                <div className="font-display absolute bottom-4 right-4 bg-amber-500 text-slate-950 text-xs font-black px-3 py-1.5 rounded-xl shadow-lg border-2 border-white">
                  🔥 {profile.streak}
                </div>
              )}
            </div>
            <div className="text-center">
              <p className="font-display font-black text-slate-950 dark:text-white text-2xl uppercase tracking-tight">{profile.username}</p>
              <p className="font-display text-[12px] font-black text-slate-500 uppercase tracking-[0.4em] mt-1">{profile.grade}</p>
            </div>
          </button>
        ))}

        <button
          onClick={onAdd}
          className="group flex flex-col items-center space-y-6 transition-all duration-300 transform hover:scale-110"
        >
          <div className="w-40 h-40 md:w-48 md:h-48 rounded-[3.5rem] border-4 border-dashed border-slate-200 dark:border-slate-800 flex items-center justify-center text-5xl text-slate-300 group-hover:border-blue-600 group-hover:text-blue-600 bg-white dark:bg-black transition-all">
            ➕
          </div>
          <div className="text-center">
            <p className="font-display font-black text-slate-400 text-2xl group-hover:text-blue-600">{t.addNew}</p>
            <p className="font-display text-[12px] font-black text-slate-300 uppercase tracking-[0.4em] mt-1">{t.account}</p>
          </div>
        </button>
      </div>
    </div>
  );
};

export default AccountSelector;
