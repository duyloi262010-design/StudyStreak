
import React, { useState } from 'react';
import { UserProfile, TextbookSet } from '../types';
import { DAYS_OF_WEEK, VALID_SUBJECTS, TEXTBOOK_OPTIONS, TRANSLATIONS } from '../constants';

interface Props {
  profile: UserProfile;
  onSave: (updated: UserProfile) => void;
  onCancel: () => void;
}

const ScheduleManager: React.FC<Props> = ({ profile, onSave, onCancel }) => {
  const [schedule, setSchedule] = useState<Record<string, string[]>>({ ...profile.schedule });
  const [subjectTextbooks, setSubjectTextbooks] = useState<Record<string, TextbookSet>>({ ...profile.subjectTextbooks });
  const [newSubjectInputs, setNewSubjectInputs] = useState<Record<string, string>>({});

  const t = TRANSLATIONS[profile.language || 'vi'];

  // Fix: Explicitly cast flat result to string[] to resolve trim() error on unknown
  const allSubjects = Array.from(new Set(Object.values(schedule).flat() as string[])).filter(s => s.trim().length > 0);

  const toggleQuickAdd = (day: string, subject: string) => {
    setSchedule(prev => {
      const current = prev[day] || [];
      if (current.includes(subject)) {
        return { ...prev, [day]: current.filter(s => s !== subject) };
      }
      return { ...prev, [day]: [...current, subject] };
    });
  };

  const handleManualAdd = (day: string) => {
    const input = newSubjectInputs[day];
    if (!input?.trim()) return;
    
    setSchedule(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), input.trim()]
    }));
    setNewSubjectInputs(prev => ({ ...prev, [day]: '' }));
  };

  const removeSubject = (day: string, subject: string) => {
    setSchedule(prev => ({
      ...prev,
      [day]: (prev[day] || []).filter(s => s !== subject)
    }));
  };

  const handleSave = () => {
    if (allSubjects.length === 0) {
      alert(t.errorNoSubjects);
      return;
    }

    // Ensure all subjects have a textbook assigned
    const missingTextbooks = allSubjects.filter(s => !subjectTextbooks[s]);
    if (missingTextbooks.length > 0) {
      alert(`${t.textbookFor}: ${missingTextbooks.join(', ')}?`);
      return;
    }

    onSave({
      ...profile,
      schedule,
      subjectTextbooks
    });
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 animate-fadeIn pb-20">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
        <div>
          <h1 className="text-4xl font-black text-slate-950 dark:text-white transition-colors">{t.manageSchedule} 📅</h1>
          <p className="text-slate-500 font-bold">{t.onboardingDesc}</p>
        </div>
        <div className="flex gap-3">
           <button onClick={onCancel} className="px-6 py-4 font-black text-slate-400 uppercase text-xs tracking-widest">{t.back}</button>
           <button 
             onClick={handleSave} 
             className="px-10 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-xl transition-all uppercase text-xs tracking-[0.2em]"
           >
             {t.savePlan}
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Section 1: Weekly Schedule */}
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {DAYS_OF_WEEK.map(day => (
              <div key={day} className="bg-white dark:bg-slate-900 p-8 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm flex flex-col transition-all">
                <span className="text-xl font-black text-green-600 mb-6 block">{day}</span>
                
                <div className="flex-grow space-y-3 mb-6">
                  {(schedule[day] || []).map(s => (
                    <div key={s} className="flex items-center justify-between px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-2xl group transition-all">
                      <span className="font-bold text-slate-700 dark:text-slate-200">{s}</span>
                      <button 
                        onClick={() => removeSubject(day, s)}
                        className="w-6 h-6 flex items-center justify-center rounded-full bg-slate-200 dark:bg-slate-700 text-slate-500 hover:bg-rose-500 hover:text-white transition-all text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
                  {(schedule[day] || []).length === 0 && <p className="text-slate-300 italic text-xs py-4 text-center font-bold">{t.restDay}</p>}
                </div>

                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text"
                      placeholder="..."
                      value={newSubjectInputs[day] || ''}
                      onChange={(e) => setNewSubjectInputs(prev => ({ ...prev, [day]: e.target.value }))}
                      onKeyDown={(e) => e.key === 'Enter' && handleManualAdd(day)}
                      className="flex-1 p-3 bg-slate-100 dark:bg-black border-2 border-slate-200 dark:border-slate-800 rounded-xl outline-none font-bold text-xs dark:text-white focus:border-green-500 transition-all"
                    />
                    <button onClick={() => handleManualAdd(day)} className="p-3 bg-slate-950 dark:bg-white text-white dark:text-black rounded-xl font-black text-xs">＋</button>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {VALID_SUBJECTS.slice(0, 5).map(sub => (
                      <button
                        key={sub}
                        onClick={() => toggleQuickAdd(day, sub)}
                        className={`px-2.5 py-1 rounded-lg text-[9px] font-black uppercase transition-all border ${
                          (schedule[day] || []).includes(sub)
                          ? 'bg-green-600 border-green-600 text-white'
                          : 'bg-white dark:bg-slate-950 border-slate-200 dark:border-slate-800 text-slate-400'
                        }`}
                      >
                        {sub}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 2: Textbook Settings */}
        <div className="bg-slate-50 dark:bg-slate-950 p-10 rounded-[3.5rem] border-2 border-slate-100 dark:border-slate-900">
           <div className="flex items-center gap-4 mb-8">
             <div className="w-12 h-12 bg-white dark:bg-slate-900 rounded-2xl flex items-center justify-center text-2xl shadow-sm">📚</div>
             <h2 className="text-2xl font-black text-slate-800 dark:text-white uppercase tracking-tighter">{t.stepTextbook}</h2>
           </div>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             {allSubjects.map(sub => (
               <div key={sub} className="flex flex-col md:flex-row md:items-center justify-between p-5 bg-white dark:bg-slate-900 rounded-2xl border-2 border-slate-100 dark:border-slate-800 shadow-sm transition-all hover:border-green-100">
                 <span className="font-black text-slate-700 dark:text-slate-200 mb-3 md:mb-0 text-base">Môn: {sub}</span>
                 <div className="flex flex-wrap gap-2">
                   {TEXTBOOK_OPTIONS.map(opt => (
                     <button
                       key={opt}
                       // Fix: Computed property error resolved by ensuring sub is treated as string
                       onClick={() => setSubjectTextbooks(prev => ({ ...prev, [sub as string]: opt as TextbookSet }))}
                       className={`px-4 py-2 rounded-xl text-[10px] font-black transition-all border-2 ${
                         subjectTextbooks[sub] === opt
                         ? 'bg-green-600 border-green-600 text-white shadow-lg'
                         : 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-400'
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
      </div>
    </div>
  );
};

export default ScheduleManager;
