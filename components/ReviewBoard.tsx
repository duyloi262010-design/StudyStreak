
import React from 'react';
import { QuizResult, Question } from '../types';

interface Props {
  result: QuizResult;
  onBack: () => void;
}

const ReviewBoard: React.FC<Props> = ({ result, onBack }) => {
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 animate-fadeIn">
      <div className="flex items-center justify-between mb-8">
        <button 
          onClick={onBack}
          className="flex items-center text-green-600 dark:text-green-400 font-black hover:bg-green-50 dark:hover:bg-green-900/20 px-4 py-2 rounded-xl transition-all"
        >
          <span className="mr-2">⬅️</span> Quay lại
        </button>
        <h2 className="text-2xl font-black text-slate-800 dark:text-white">Chữa Bài Chi Tiết 📝</h2>
      </div>

      <div className="space-y-6">
        {result.questions.map((q, idx) => {
          const userAnswer = result.userAnswers[q.id];
          const isCorrect = userAnswer === q.correctAnswerIndex;

          return (
            <div 
              key={q.id} 
              className={`p-6 rounded-[2.5rem] border-2 transition-all shadow-sm ${
                isCorrect 
                ? 'border-emerald-100 dark:border-emerald-900/30 bg-emerald-50/30 dark:bg-emerald-900/10' 
                : 'border-rose-100 dark:border-rose-900/30 bg-rose-50/30 dark:bg-rose-900/10'
              }`}
            >
              <div className="flex justify-between items-start mb-4">
                <span className="text-[10px] font-black uppercase tracking-widest px-3 py-1 bg-white dark:bg-slate-800 rounded-full shadow-sm text-slate-500 dark:text-slate-400 border border-slate-100 dark:border-slate-700">
                  Câu {idx + 1} • {q.subject}
                </span>
                <span className="text-2xl">{isCorrect ? '✅' : '❌'}</span>
              </div>
              
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 leading-relaxed">
                {q.questionText}
              </p>

              <div className="grid grid-cols-1 gap-3 mb-6">
                {q.options.map((opt, optIdx) => {
                  let styles = "bg-white dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-600 dark:text-slate-400";
                  if (optIdx === q.correctAnswerIndex) {
                    styles = "bg-emerald-500 border-emerald-500 text-white shadow-lg shadow-emerald-200 dark:shadow-none ring-2 ring-emerald-500 ring-offset-2 dark:ring-offset-slate-900";
                  } else if (optIdx === userAnswer && !isCorrect) {
                    styles = "bg-rose-500 border-rose-500 text-white shadow-lg shadow-rose-200 dark:shadow-none";
                  }

                  return (
                    <div key={optIdx} className={`p-4 rounded-2xl border-2 font-bold flex items-center transition-colors ${styles}`}>
                      <span className="w-8 h-8 rounded-full bg-black/10 flex items-center justify-center mr-3 text-sm">
                        {String.fromCharCode(65 + optIdx)}
                      </span>
                      {opt}
                    </div>
                  );
                })}
              </div>

              <div className="bg-green-600 dark:bg-green-900/50 text-white p-6 rounded-3xl shadow-xl relative overflow-hidden">
                <div className="absolute right-0 top-0 text-5xl opacity-10 p-2">🦖</div>
                <div className="flex items-center mb-2 relative z-10">
                  <span className="text-xl mr-2">🧠</span>
                  <span className="font-black uppercase text-[10px] tracking-widest">Lời giải từ Kiến trúc sư AI</span>
                </div>
                <p className="text-green-50 dark:text-green-100 leading-relaxed font-bold relative z-10">
                  {q.explanation}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-12 text-center pb-10">
        <button
          onClick={onBack}
          className="px-12 py-5 bg-slate-800 dark:bg-slate-700 text-white font-black rounded-2xl hover:bg-slate-900 dark:hover:bg-slate-600 shadow-xl transition-all"
        >
          Đã hiểu hết rồi! 🚀
        </button>
      </div>
    </div>
  );
};

export default ReviewBoard;
