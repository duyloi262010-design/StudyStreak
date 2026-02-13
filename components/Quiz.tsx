
import React, { useState, useEffect } from 'react';
import { Question, QuizResult } from '../types';

interface Props {
  questions: Question[];
  onComplete: (result: QuizResult) => void;
}

const Quiz: React.FC<Props> = ({ questions, onComplete }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [timeLeft, setTimeLeft] = useState(0);
  const [startTime] = useState(Date.now());

  const totalMinutes = Array.from(new Set(questions.map(q => q.subject))).length * 10;

  useEffect(() => {
    setTimeLeft(totalMinutes * 60);
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getPointsByDifficulty = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 1;
      case 'medium': return 2;
      case 'hard': return 3;
      default: return 1;
    }
  };

  const handleSubmit = () => {
    let correctCount = 0;
    let xpGained = 0;
    let iqChange = 0;

    questions.forEach(q => {
      const points = getPointsByDifficulty(q.difficulty);
      if (answers[q.id] === q.correctAnswerIndex) {
        correctCount++;
        xpGained += points;
        iqChange += points;
      } else if (answers[q.id] !== undefined) {
        // Trả lời sai bị trừ 1 IQ
        iqChange -= 1;
      }
    });

    const timeSpent = Math.floor((Date.now() - startTime) / 1000);
    const score = (correctCount / questions.length) * 100;

    onComplete({
      score,
      total: questions.length,
      timeSpent,
      date: new Date().toISOString(),
      passed: score >= 80,
      userAnswers: answers,
      questions: questions,
      xpGained,
      iqChange
    });
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const q = questions[currentIndex];

  return (
    <div className="max-w-4xl mx-auto p-2 md:p-6 mt-2 md:mt-4 animate-fadeIn">
      {/* High Contrast Sticky Header - Refined for Mobile */}
      <div className="flex justify-between items-center mb-6 md:mb-10 bg-white/95 dark:bg-black/95 backdrop-blur-xl p-4 md:p-8 rounded-2xl md:rounded-[2.5rem] shadow-xl border border-slate-200 dark:border-slate-800 sticky top-2 z-10 transition-colors">
        <div className="flex flex-col">
          <span className="text-[10px] md:text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">CÂU HỎI</span>
          <div className="flex items-center space-x-1 md:space-x-3">
            <span className="text-xl md:text-3xl font-black text-slate-950 dark:text-white">{currentIndex + 1}</span>
            <span className="text-slate-300 dark:text-slate-800 font-bold text-base md:text-xl">/</span>
            <span className="text-base md:text-xl font-bold text-slate-400 dark:text-slate-600">{questions.length}</span>
          </div>
        </div>
        
        <div className="flex flex-col items-center flex-1 px-4">
           <span className={`text-[8px] md:text-[10px] font-black px-2 py-0.5 md:px-3 md:py-1 rounded-full uppercase mb-1.5 md:mb-2 whitespace-nowrap ${
             q.difficulty === 'easy' ? 'bg-green-100 text-green-600' : 
             q.difficulty === 'medium' ? 'bg-amber-100 text-amber-600' : 
             'bg-rose-100 text-rose-600'
           }`}>
             {q.difficulty === 'easy' ? 'Dễ' : q.difficulty === 'medium' ? 'Thường' : 'Khó'}
           </span>
          <div className="w-full max-w-[120px] md:max-w-[200px] bg-slate-100 dark:bg-slate-900 h-2 md:h-3 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
            <div 
              className="bg-[#0ea5e9] h-full transition-all duration-500" 
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="flex flex-col items-end">
          <span className="text-[10px] md:text-[12px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest mb-0.5 md:mb-1">CÒN LẠI</span>
          <span className={`text-xl md:text-3xl font-mono font-black ${timeLeft < 60 ? 'text-rose-600 animate-pulse' : 'text-slate-950 dark:text-white'}`}>
            {formatTime(timeLeft)}
          </span>
        </div>
      </div>

      <div className="bg-white dark:bg-black rounded-3xl md:rounded-[3.5rem] p-6 md:p-16 shadow-2xl border-2 border-slate-100 dark:border-slate-900 min-h-[400px] md:min-h-[500px] flex flex-col relative overflow-hidden transition-all">
        <div className="mb-6 md:mb-10 relative z-10">
          <span className="px-4 py-2 md:px-6 md:py-3 bg-slate-950 dark:bg-white text-white dark:text-black rounded-xl md:rounded-2xl text-[10px] md:text-sm font-black uppercase tracking-[0.15em] md:tracking-[0.2em] shadow-lg">
            {q.subject}
          </span>
        </div>
        
        <h2 className="text-xl md:text-4xl font-black text-slate-950 dark:text-white mb-8 md:mb-14 leading-[1.3] relative z-10">
          {q.questionText}
        </h2>

        <div className="space-y-3 md:space-y-5 flex-grow relative z-10">
          {q.options.map((opt, idx) => (
            <button
              key={idx}
              onClick={() => setAnswers(prev => ({ ...prev, [q.id]: idx }))}
              className={`w-full p-4 md:p-6 text-left rounded-2xl md:rounded-[2rem] border-2 transition-all flex items-center group relative overflow-hidden ${
                answers[q.id] === idx 
                ? 'border-sky-600 bg-sky-50 dark:bg-sky-900/30 text-slate-950 dark:text-white shadow-xl translate-x-1 md:translate-x-2'
                : 'border-slate-100 dark:border-slate-900 hover:border-slate-300 dark:hover:border-slate-700 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300'
              }`}
            >
              <span className={`w-8 h-8 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center mr-4 md:mr-6 font-black text-sm md:text-xl transition-all ${
                answers[q.id] === idx ? 'bg-sky-600 text-white scale-110' : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-500 group-hover:bg-slate-200 dark:group-hover:bg-slate-800'
              }`}>
                {String.fromCharCode(65 + idx)}
              </span>
              <span className="font-bold text-base md:text-xl">{opt}</span>
              {answers[q.id] === idx && (
                <div className="absolute right-4 md:right-8 text-xl md:text-3xl animate-scaleIn">✔️</div>
              )}
            </button>
          ))}
        </div>

        <div className="flex justify-between items-center mt-10 md:mt-16 relative z-10 gap-3">
          <button
            disabled={currentIndex === 0}
            onClick={() => setCurrentIndex(prev => prev - 1)}
            className="flex-1 md:flex-none px-6 md:px-10 py-4 md:py-5 bg-slate-100 dark:bg-slate-900 text-slate-950 dark:text-white font-black rounded-xl md:rounded-2xl hover:bg-slate-200 dark:hover:bg-slate-800 transition-all disabled:opacity-30 disabled:cursor-not-allowed border-2 border-transparent text-xs md:text-base"
          >
            QUAY LẠI
          </button>
          
          {currentIndex === questions.length - 1 ? (
            <button
              onClick={handleSubmit}
              className="flex-2 md:flex-none px-8 md:px-16 py-5 md:py-6 bg-emerald-600 text-white font-black text-lg md:text-2xl rounded-2xl md:rounded-[2rem] hover:bg-emerald-700 shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              NỘP BÀI 🚀
            </button>
          ) : (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className="flex-2 md:flex-none px-8 md:px-16 py-5 md:py-6 bg-slate-950 dark:bg-white text-white dark:text-black font-black text-lg md:text-2xl rounded-2xl md:rounded-[2rem] hover:bg-slate-800 dark:hover:bg-slate-100 shadow-2xl hover:scale-105 active:scale-95 transition-all"
            >
              TIẾP THEO ➡️
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;
