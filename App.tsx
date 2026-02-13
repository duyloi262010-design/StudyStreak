
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, UserProfile, Question, SubjectLesson, QuizResult, Language } from './types';
import { DAYS_OF_WEEK, EXCLUDED_SUBJECTS, TRANSLATIONS } from './constants';
import { generateStudyQuiz } from './geminiService';
import Onboarding from './components/Onboarding';
import Dashboard from './components/Dashboard';
import LessonInput from './components/LessonInput';
import Quiz from './components/Quiz';
import ResultView from './components/ResultView';
import ReviewBoard from './components/ReviewBoard';
import PetChat from './components/PetChat';
import AccountSelector from './components/AccountSelector';
import ProfileModal from './components/ProfileModal';
import DataModal from './components/DataModal';
import ScheduleManager from './components/ScheduleManager';
import Sidebar from './components/Sidebar';
import ProgressView from './components/ProgressView';

const ACCOUNTS_KEY = 'study_streak_accounts_v4';
const LAST_ACTIVE_ID_KEY = 'study_streak_last_active_id';

const App: React.FC = () => {
  const [appState, setAppState] = useState<AppState>(AppState.ACCOUNT_SELECTOR);
  const [profiles, setProfiles] = useState<UserProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(null);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(false);
  const [lastResult, setLastResult] = useState<QuizResult | null>(null);
  const [saveStatus, setSaveStatus] = useState<'saving' | 'saved'>('saved');
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showDataModal, setShowDataModal] = useState(false);
  const [appError, setAppError] = useState<string | null>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(ACCOUNTS_KEY);
      const lastActiveId = localStorage.getItem(LAST_ACTIVE_ID_KEY);

      if (saved) {
        let loadedProfiles: UserProfile[] = JSON.parse(saved);
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        loadedProfiles = loadedProfiles.map(p => {
          if (!p.language) p.language = 'vi';
          if (!p.pet.iq) p.pet.iq = 50;
          if (!p.studyHistory) p.studyHistory = {};
          if (p.dailyGoalHours === undefined) p.dailyGoalHours = 3;
          
          if (p.lastCompletedDate) {
            const lastDate = new Date(p.lastCompletedDate);
            lastDate.setHours(0, 0, 0, 0);
            const diffTime = Math.abs(today.getTime() - lastDate.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            if (diffDays > 1 && p.streak > 0) {
              return { ...p, streak: 0 };
            }
          }
          return p;
        });

        setProfiles(loadedProfiles);
        localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(loadedProfiles));

        if (lastActiveId) {
          const lastProfile = loadedProfiles.find(p => p.id === lastActiveId);
          if (lastProfile) {
            setActiveProfile(lastProfile);
            setAppState(AppState.DASHBOARD);
          }
        } else if (loadedProfiles.length === 0) {
          setAppState(AppState.ONBOARDING);
        }
      } else {
        setAppState(AppState.ONBOARDING);
      }
    } catch (e) {
      console.error("Initialization Error:", e);
      setAppError("System failed to load. Please refresh.");
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const saveAllProfiles = (updatedProfiles: UserProfile[]) => {
    setSaveStatus('saving');
    setProfiles(updatedProfiles);
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(updatedProfiles));
    setTimeout(() => setSaveStatus('saved'), 600);
  };

  const updateActiveProfile = useCallback((updated: UserProfile) => {
    setActiveProfile(updated);
    const newProfiles = profiles.map(p => p.id === updated.id ? updated : p);
    saveAllProfiles(newProfiles);
  }, [profiles]);

  const handleImportData = (newData: string) => {
    try {
      const parsed = JSON.parse(newData);
      if (Array.isArray(parsed)) {
        saveAllProfiles(parsed);
        setAppState(AppState.ACCOUNT_SELECTOR);
        setShowDataModal(false);
      } else {
        throw new Error("Invalid format.");
      }
    } catch (e) {
      alert("Invalid data code.");
    }
  };

  const toggleTheme = () => {
    if (activeProfile) {
      const newTheme = activeProfile.theme === 'dark' ? 'light' : 'dark';
      updateActiveProfile({ ...activeProfile, theme: newTheme });
    }
  };

  const handleSelectAccount = (profile: UserProfile) => {
    setActiveProfile(profile);
    localStorage.setItem(LAST_ACTIVE_ID_KEY, profile.id);
    setAppState(AppState.DASHBOARD);
  };

  const handleLogout = () => {
    setActiveProfile(null);
    localStorage.removeItem(LAST_ACTIVE_ID_KEY);
    setAppState(AppState.ACCOUNT_SELECTOR);
    setShowProfileMenu(false);
  };

  const handleOnboardingComplete = (newProfile: UserProfile) => {
    const updatedProfiles = [...profiles, newProfile];
    saveAllProfiles(updatedProfiles);
    setActiveProfile(newProfile);
    localStorage.setItem(LAST_ACTIVE_ID_KEY, newProfile.id);
    setAppState(AppState.DASHBOARD);
  };

  const handleQuizComplete = (result: QuizResult) => {
    setLastResult(result);
    if (activeProfile) {
      const updated = { ...activeProfile };
      const today = new Date().toISOString().split('T')[0];
      const dailyGoalSeconds = (updated.dailyGoalHours || 3) * 3600;

      let bonusXp = result.xpGained;
      
      if (!updated.studyHistory) updated.studyHistory = {};
      const secondsTodayBefore = updated.studyHistory[today] || 0;
      const secondsTodayAfter = secondsTodayBefore + result.timeSpent;
      updated.studyHistory[today] = secondsTodayAfter;

      if (secondsTodayBefore < dailyGoalSeconds && secondsTodayAfter >= dailyGoalSeconds) {
        bonusXp += 1; 
      }

      updated.pet.xp += bonusXp;
      updated.pet.level = Math.floor(updated.pet.xp / 100) + 1;
      
      updated.pet.iq = Math.max(10, updated.pet.iq + result.iqChange);

      if (result.passed) {
        const todayStr = new Date().toDateString();
        if (updated.lastCompletedDate !== todayStr) {
          updated.streak += 1;
          updated.lastCompletedDate = todayStr;
        }
        updated.lockoutUntil = null;
      } else {
        updated.lockoutUntil = Date.now() + 30 * 60 * 1000;
      }
      
      updateActiveProfile(updated);
    }
    setAppState(AppState.RESULT);
  };

  const isDarkMode = activeProfile?.theme === 'dark';
  const t = TRANSLATIONS[activeProfile?.language || 'vi'];

  const showSidebar = activeProfile && 
    appState !== AppState.ACCOUNT_SELECTOR && 
    appState !== AppState.ONBOARDING && 
    appState !== AppState.QUIZ;

  if (appError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-rose-50 p-6 text-center">
        <div className="max-w-md bg-white p-10 rounded-[3rem] shadow-xl border-b-8 border-rose-200">
          <span className="text-6xl mb-6 block">⚠️</span>
          <h2 className="text-2xl font-black text-rose-600 mb-4">Error!</h2>
          <p className="text-slate-600 font-bold mb-8">{appError}</p>
          <button onClick={() => window.location.reload()} className="px-8 py-4 bg-rose-600 text-white font-black rounded-2xl shadow-lg">Retry</button>
        </div>
      </div>
    );
  }

  return (
    <div className={`${isDarkMode ? 'dark' : ''} h-screen flex flex-col`}>
      <div className="flex-1 flex flex-col lg:flex-row bg-white dark:bg-black text-slate-950 dark:text-white transition-colors duration-300 overflow-hidden">
        
        {showSidebar && (
          <Sidebar 
            activeState={appState} 
            onNavigate={setAppState} 
            onOpenSettings={() => setIsEditingProfile(true)}
            lang={activeProfile?.language || 'vi'}
          />
        )}

        <div className="flex-1 flex flex-col h-full overflow-y-auto">
          {activeProfile && appState !== AppState.ACCOUNT_SELECTOR && appState !== AppState.ONBOARDING && (
            <header className="bg-white/95 dark:bg-black/95 backdrop-blur-xl px-4 md:px-8 py-3 flex items-center justify-between sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 transition-colors shrink-0">
              <div className="flex lg:hidden items-center space-x-3 cursor-pointer" onClick={() => setAppState(AppState.DASHBOARD)}>
                <div className="w-8 h-8 bg-green-600 rounded-lg flex items-center justify-center text-white text-lg">🦖</div>
                <span className="font-black text-slate-950 dark:text-white text-lg italic">StudyStreak</span>
              </div>
              <div className="hidden lg:block">
                 <span className="text-sm font-black text-slate-400 uppercase tracking-widest">
                    {appState === AppState.DASHBOARD ? t.welcome : appState === AppState.PROGRESS ? "Tiến độ học tập" : t.manageSchedule}
                 </span>
              </div>
              
              <div className="flex items-center space-x-3 md:space-x-5 ml-auto">
                <div className="hidden sm:flex items-center space-x-2 px-4 py-2 bg-slate-100 dark:bg-slate-900 rounded-full border border-slate-200 dark:border-slate-800">
                  <span className="text-[11px] font-black text-amber-700 dark:text-amber-400 uppercase tracking-widest">🔥 {activeProfile.streak} {t.streak}</span>
                </div>
                <button onClick={toggleTheme} className="p-2.5 hover:bg-slate-100 dark:hover:bg-slate-900 rounded-full text-2xl">{isDarkMode ? '☀️' : '🌙'}</button>
                <div className="relative" ref={menuRef}>
                  <button onClick={() => setShowProfileMenu(!showProfileMenu)} className="w-10 h-10 rounded-full bg-slate-100 border-2 border-slate-200 shadow-md flex items-center justify-center text-xl overflow-hidden">
                    {activeProfile.avatar || '👤'}
                  </button>
                  {showProfileMenu && (
                    <div className="absolute right-0 mt-4 w-72 bg-white dark:bg-slate-900 rounded-[2rem] shadow-2xl border border-slate-200 dark:border-slate-800 py-4 animate-scaleIn z-50">
                      <div className="px-6 py-5 flex flex-col items-center border-b border-slate-100 dark:border-slate-800 mb-2">
                        <p className="font-black text-slate-950 dark:text-white text-xl">{activeProfile.username}</p>
                        <button onClick={() => { setIsEditingProfile(true); setShowProfileMenu(false); }} className="w-full mt-4 py-3 bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-950 dark:text-white font-black text-xs rounded-2xl uppercase">{t.manageProfile}</button>
                      </div>
                      <div className="px-2">
                        <button onClick={() => { setAppState(AppState.ACCOUNT_SELECTOR); setShowProfileMenu(false); }} className="w-full flex items-center space-x-4 px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-2xl transition-all">
                          <span className="text-2xl">🔄</span><span className="text-sm font-black dark:text-white">{t.changeAccount}</span>
                        </button>
                        <button onClick={handleLogout} className="w-full flex items-center space-x-4 px-5 py-4 hover:bg-rose-50 dark:hover:bg-rose-900/20 rounded-2xl transition-all">
                          <span className="text-2xl">🚪</span><span className="text-sm font-black text-rose-600">{t.logout}</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </header>
          )}

          <main className={`flex-1 ${showSidebar ? 'pb-24 lg:pb-10' : ''}`}>
            <div className="container mx-auto mt-6 px-4">
              {appState === AppState.ACCOUNT_SELECTOR && (
                <><AccountSelector profiles={profiles} onSelect={handleSelectAccount} onAdd={() => setAppState(AppState.ONBOARDING)} />
                <div className="flex justify-center mt-12 pb-10"><button onClick={() => setShowDataModal(true)} className="flex items-center space-x-2 px-6 py-3 bg-slate-100 dark:bg-slate-900 rounded-2xl text-slate-500 font-black text-xs uppercase tracking-widest transition-all"><span>💾</span><span>{t.dataManagement}</span></button></div></>
              )}
              {appState === AppState.ONBOARDING && (
                <Onboarding onComplete={handleOnboardingComplete} onCancel={() => profiles.length > 0 && setAppState(AppState.ACCOUNT_SELECTOR)} />
              )}
              {appState === AppState.DASHBOARD && activeProfile && (
                <Dashboard 
                  profile={activeProfile} 
                  onStartQuiz={() => setAppState(AppState.LESSON_INPUT)} 
                  onOpenChat={() => setAppState(AppState.PET_CHAT)} 
                  onEditSchedule={() => setAppState(AppState.SCHEDULE_MANAGER)}
                />
              )}
              {appState === AppState.SCHEDULE_MANAGER && activeProfile && (
                <ScheduleManager 
                  profile={activeProfile} 
                  onSave={(updated) => { updateActiveProfile(updated); setAppState(AppState.DASHBOARD); }} 
                  onCancel={() => setAppState(AppState.DASHBOARD)} 
                />
              )}
              {appState === AppState.PROGRESS && activeProfile && (
                <ProgressView profile={activeProfile} onBack={() => setAppState(AppState.DASHBOARD)} onUpdateProfile={updateActiveProfile} />
              )}
              {appState === AppState.LESSON_INPUT && activeProfile && (
                <LessonInput subjects={(activeProfile.schedule[DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1]] || []).filter(s => !EXCLUDED_SUBJECTS.includes(s))} onSubmit={async (lessons) => {
                    if (!activeProfile) return;
                    setLoading(true);
                    try {
                      const enrichedLessons = lessons.map(l => ({ ...l, textbook: activeProfile.subjectTextbooks[l.subject] }));
                      const generatedQuestions = await generateStudyQuiz(activeProfile.grade, enrichedLessons, activeProfile.language);
                      setQuestions(generatedQuestions);
                      setAppState(AppState.QUIZ);
                    } catch (error) {
                      alert('Error generating quiz. Please try again.');
                    } finally { setLoading(false); }
                  }} onCancel={() => setAppState(AppState.DASHBOARD)} />
              )}
              {appState === AppState.QUIZ && questions.length > 0 && (
                <Quiz questions={questions} onComplete={handleQuizComplete} />
              )}
              {appState === AppState.RESULT && lastResult && (
                <ResultView result={lastResult} onClose={() => setAppState(AppState.DASHBOARD)} onReview={() => setAppState(AppState.REVIEW)} />
              )}
              {appState === AppState.REVIEW && lastResult && (
                <ReviewBoard result={lastResult} onBack={() => setAppState(AppState.RESULT)} />
              )}
              {appState === AppState.PET_CHAT && activeProfile && (
                <PetChat profile={activeProfile} onClose={() => setAppState(AppState.DASHBOARD)} />
              )}
            </div>
          </main>
        </div>
      </div>

      {isEditingProfile && activeProfile && (
        <ProfileModal profile={activeProfile} onSave={(updated) => { updateActiveProfile(updated); setIsEditingProfile(false); }} onClose={() => setIsEditingProfile(false)} />
      )}

      {showDataModal && (
        <DataModal onImport={handleImportData} onClose={() => setShowDataModal(false)} profiles={profiles} />
      )}

      {loading && (
        <div className="fixed inset-0 bg-white dark:bg-black flex flex-col items-center justify-center z-[100] animate-fadeIn">
          <div className="relative mb-10"><div className="w-28 h-28 border-8 border-slate-200 border-t-green-600 rounded-full animate-spin" /></div>
          <h2 className="text-4xl font-black mb-4 uppercase text-slate-950 dark:text-white">{t.loadingQuiz}</h2>
          <p className="text-slate-600 dark:text-slate-400 text-xl font-bold">{t.aiThinking}</p>
        </div>
      )}
    </div>
  );
};

export default App;
