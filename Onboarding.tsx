
import React, { useState } from 'react';
import { UserProfile, TextbookSet, PetAvatarType } from './types';
import { GRADES, TEXTBOOK_OPTIONS, DAYS_OF_WEEK, VALID_SUBJECTS, TRANSLATIONS } from './constants';

interface Props {
  onComplete: (profile: UserProfile) => void;
  onCancel?: () => void;
}

const PET_TYPES: { type: PetAvatarType, emoji: string, label: string, desc: string, color: string }[] = [
  { type: 'classic', emoji: '🦖', label: 'Hệ Cổ Điển', desc: 'Mạnh mẽ và bền bỉ', color: 'bg-green-100 text-green-600 border-green-200' },
  { type: 'cyber', emoji: '🤖', label: 'Hệ Công Nghệ', desc: 'Thông minh và hiện đại', color: 'bg-blue-100 text-blue-600 border-blue-200' },
  { type: 'nature', emoji: '🌿', label: 'Hệ Tự Nhiên', desc: 'Yên bình và tập trung', color: 'bg-emerald-100 text-emerald-600 border-emerald-200' },
  { type: 'magic', emoji: '✨', label: 'Hệ Phép Thuật', desc: 'Sáng tạo và bùng nổ', color: 'bg-purple-100 text-purple-600 border-purple-200' },
  { type: 'ocean', emoji: '🌊', label: 'Hệ Đại Dương', desc: 'Sâu thẳm và kiên trì', color: 'bg-cyan-100 text-cyan-600 border-cyan-200' },
  { type: 'space', emoji: '🚀', label: 'Hệ Vũ Trụ', desc: 'Khám phá và vô tận', color: 'bg-indigo-100 text-indigo-600 border-indigo-200' },
  { type: 'fire', emoji: '🔥', label: 'Hệ Hỏa Long', desc: 'Nhiệt huyết và rực rỡ', color: 'bg-orange-100 text-orange-600 border-orange-200' },
  { type: 'zen', emoji: '🎋', label: 'Hệ Tĩnh Lặng', desc: 'Cân bằng và kỷ luật', color: 'bg-slate-100 text-slate-600 border-slate-200' },
];

const Onboarding: React.FC<Props> = ({ onComplete, onCancel }) => {
  const [step, setStep] = useState(0); 
  const [authInfo, setAuthInfo] = useState<{ id: string, method: 'google' | 'facebook' | 'guest', avatar?: string } | null>(null);
  const [username, setUsername] = useState('');
  const [grade, setGrade] = useState(GRADES[0]);
  const [schedule, setSchedule] = useState<Record<string, string[]>>({});
  const [subjectTextbooks, setSubjectTextbooks] = useState<Record<string, TextbookSet>>({});
  const [petName, setPetName] = useState('GreenDino');
  const [petAvatar, setPetAvatar] = useState<PetAvatarType>('classic');

  const t = TRANSLATIONS.vi;

  const allSubjects = Array.from(new Set(Object.values(schedule).flat() as string[])).filter(s => s.trim().length > 0);

  const handleSocialLogin = (method: 'google' | 'facebook') => {
    const fakeId = `${method}_${Math.random().toString(36).substr(2, 9)}`;
    setAuthInfo({ id: fakeId, method });
    setStep(1);
  };

  const handleGuestLogin = () => {
    setAuthInfo({ id: `guest_${Date.now()}`, method: 'guest' });
    setStep(1);
  };

  const handleNext = () => {
    if (step === 1) {
      if (!username.trim()) return alert(t.errorEmptyUsername);
      if (!petName.trim()) return alert(t.errorEmptyPetName);
    }
    
    if (step === 2) {
      if (allSubjects.length === 0) {
        return alert(t.errorNoSubjects);
      }
    }

    if (step < 3) setStep(step + 1);
    else {
      const missingTextbooks = allSubjects.filter(s => !subjectTextbooks[s]);
      if (missingTextbooks.length > 0) {
        return alert(`Vui lòng chọn bộ sách cho môn: ${missingTextbooks.join(', ')}`);
      }

      onComplete({
        id: authInfo?.id || Date.now().toString(),
        username,
        grade,
        subjectTextbooks,
        schedule,
        streak: 0,
        lastCompletedDate: null,
        lockoutUntil: null,
        authMethod: authInfo?.method || 'guest',
        theme: 'light',
        language: 'vi',
        studyHistory: {}, // Khởi tạo lịch sử học tập
        pet: {
          name: petName,
          avatarType: petAvatar,
          xp: 0,
          iq: 50,
          level: 1,
          lastTalkedAt: null
        }
      });
    }
  };

  const toggleQuickAdd = (day: string, subject: string) => {
    setSchedule(prev => {
      const current = prev[day] || [];
      if (current.includes(subject)) {
        return { ...prev, [day]: current.filter(s => s !== subject) };
      }
      return { ...prev, [day]: [...current, subject] };
    });
  };

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white dark:bg-slate-900 rounded-[3rem] shadow-2xl mt-6 animate-scaleIn border-b-[12px] border-green-100 dark:border-slate-800 transition-all">
      {step === 0 ? (
        <div className="text-center py-6">
          <div className="w-24 h-24 bg-green-600 rounded-[2rem] flex items-center justify-center text-white text-5xl mx-auto mb-8 shadow-xl rotate-3">🦖</div>
          <h1 className="text-4xl font-black text-slate-800 dark:text-white mb-2">Chào bạn mới!</h1>
          <p className="text-slate-400 dark:text-slate-500 font-bold mb-10">Đăng nhập để bắt đầu học tập và tích lũy Streak nhé!</p>
          
          <div className="space-y-4 max-w-xs mx-auto">
            <button 
              onClick={() => handleSocialLogin('google')}
              className="w-full flex items-center justify-center space-x-3 p-4 border-2 border-slate-100 dark:border-slate-800 rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all font-black text-slate-700 dark:text-slate-300"
            >
              <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="G" />
              <span>Tiếp tục với Google</span>
            </button>
            <button 
              onClick={() => handleSocialLogin('facebook')}
              className="w-full flex items-center justify-center space-x-3 p-4 bg-[#1877F2] text-white rounded-2xl hover:opacity-90 transition-all font-black"
            >
              <svg className="w-6 h-6 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              <span>Tiếp tục với Facebook</span>
            </button>
            <div className="flex items-center space-x-2 py-2">
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
              <span className="text-[10px] font-black text-slate-300 dark:text-slate-700">HOẶC</span>
              <div className="flex-1 h-px bg-slate-100 dark:bg-slate-800"></div>
            </div>
            <button onClick={handleGuestLogin} className="w-full p-4 text-slate-400 dark:text-slate-600 font-bold hover:text-slate-600 transition-all text-sm">
              Sử dụng tài khoản khách
            </button>
          </div>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between mb-10">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-green-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-2xl">
                {step === 1 ? '👤' : step === 2 ? '📅' : '📚'}
              </div>
              <div>
                <h1 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">
                  {step === 1 ? 'Thông tin cá nhân' : step === 2 ? t.onboardingTitle : t.stepTextbook}
                </h1>
                <p className="text-xs font-bold text-slate-400 dark:text-slate-500">{step === 1 ? 'Hãy để tớ biết bạn là ai' : step === 2 ? t.onboardingDesc : 'Chọn tài liệu học tập phù hợp'}</p>
              </div>
            </div>
            <div className="flex space-x-1">
              {[1, 2, 3].map(i => (
                <div key={i} className={`h-2 w-8 rounded-full transition-all ${step >= i ? 'bg-green-600' : 'bg-slate-100 dark:bg-slate-800'}`}></div>
              ))}
            </div>
          </div>

          {step === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 animate-fadeIn">
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Tên của bạn?</label>
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-green-500 outline-none font-bold dark:text-white"
                    placeholder="VD: Minh Anh..."
                  />
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Lớp mấy?</label>
                  <select 
                    value={grade}
                    onChange={(e) => setGrade(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-green-500 outline-none font-bold dark:text-white"
                  >
                    {GRADES.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Đặt tên cho Linh Vật</label>
                  <input
                    type="text"
                    value={petName}
                    onChange={(e) => setPetName(e.target.value)}
                    className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-green-500 outline-none font-bold dark:text-white"
                  />
                </div>
              </div>

              <div className="space-y-4">
                <label className="block text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-2">Chọn Linh hồn Linh Vật</label>
                <div className="grid grid-cols-2 gap-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar">
                  {PET_TYPES.map(pt => (
                    <button
                      key={pt.type}
                      onClick={() => setPetAvatar(pt.type)}
                      className={`p-4 rounded-3xl border-2 transition-all text-center flex flex-col items-center ${
                        petAvatar === pt.type 
                        ? 'border-green-600 bg-green-50 dark:bg-green-900/20 scale-105 shadow-md' 
                        : 'border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900'
                      }`}
                    >
                      <span className="text-4xl mb-2">{pt.emoji}</span>
                      <p className={`text-[10px] font-black uppercase ${petAvatar === pt.type ? 'text-green-600' : 'text-slate-400'}`}>{pt.label}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-1 gap-6 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar p-2">
                {DAYS_OF_WEEK.map(day => (
                  <div key={day} className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
                      <span className="text-lg font-black text-green-600">{day}</span>
                      <div className="flex flex-wrap gap-2">
                        {VALID_SUBJECTS.slice(0, 6).map(sub => (
                          <button
                            key={sub}
                            onClick={() => toggleQuickAdd(day, sub)}
                            className={`px-3 py-1.5 rounded-full text-[10px] font-black uppercase transition-all border-2 ${
                              (schedule[day] || []).includes(sub)
                              ? 'bg-green-600 border-green-600 text-white'
                              : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                            }`}
                          >
                            + {sub}
                          </button>
                        ))}
                      </div>
                    </div>
                    <input
                      type="text"
                      placeholder={t.placeholderSubjects}
                      value={(schedule[day] || []).join(', ')}
                      onChange={(e) => {
                        const subs = e.target.value.split(',').map(s => s.trim()).filter(s => s.length > 0);
                        setSchedule(prev => ({ ...prev, [day]: subs }));
                      }}
                      className="w-full bg-white dark:bg-slate-900 p-4 border-2 border-slate-100 dark:border-slate-700 rounded-2xl outline-none font-bold dark:text-white focus:border-green-500 shadow-sm"
                    />
                    <div className="mt-3 flex flex-wrap gap-2">
                      {(schedule[day] || []).map(s => (
                        <span key={s} className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 text-[10px] font-black rounded-lg">
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <div className="bg-green-50 dark:bg-green-900/10 p-4 rounded-2xl border border-green-100 dark:border-green-900/30 mb-6">
                <p className="text-xs font-bold text-green-700 dark:text-green-400">⚡ Tớ sẽ dùng thông tin bộ sách này để AI soạn đề bám sát chương trình học của cậu nhất!</p>
              </div>
              <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {allSubjects.map(sub => (
                  <div key={sub} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-slate-800 rounded-2xl border-2 border-slate-100 dark:border-slate-700 shadow-sm">
                    <span className="font-black text-slate-700 dark:text-slate-200 mb-2 md:mb-0 text-lg">Môn: {sub}</span>
                    <div className="flex flex-wrap gap-2">
                      {TEXTBOOK_OPTIONS.map(opt => (
                        <button
                          key={opt}
                          onClick={() => setSubjectTextbooks(prev => ({ ...prev, [sub as string]: opt as TextbookSet }))}
                          className={`px-4 py-2 rounded-xl text-xs font-black transition-all border-2 ${
                            subjectTextbooks[sub] === opt
                            ? 'bg-green-600 border-green-600 text-white shadow-lg'
                            : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-400'
                          }`}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="mt-12 flex justify-between">
            <button onClick={() => setStep(step - 1)} className="px-8 py-4 text-slate-400 font-black hover:text-slate-600 transition-colors uppercase tracking-widest text-xs">
              QUAY LẠI
            </button>
            <button
              onClick={handleNext}
              className="px-12 py-4 bg-green-600 text-white font-black rounded-2xl hover:scale-105 active:scale-95 shadow-xl transition-all uppercase tracking-widest text-xs"
            >
              {step === 3 ? 'XONG RỒI! 🦖' : 'TIẾP TỤC ➡️'}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default Onboarding;
