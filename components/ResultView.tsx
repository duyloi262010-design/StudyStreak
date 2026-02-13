
import React from 'react';
import { QuizResult } from '../types';

interface Props {
  result: QuizResult;
  onClose: () => void;
  onReview: () => void;
}

const ResultView: React.FC<Props> = ({ result, onClose, onReview }) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}p ${secs}s`;
  };

  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6 mt-10 animate-scaleIn">
      <div className={`p-10 rounded-[3rem] shadow-2xl relative overflow-hidden bg-white dark:bg-slate-900 border-b-[12px] transition-colors ${result.passed ? 'border-emerald-100 dark:border-emerald-900/30' : 'border-rose-100 dark:border-rose-900/30'}`}>
        <div className="mb-8">
          {result.passed ? (
            <div className="w-28 h-28 bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-bounce">
              <span className="text-6xl">🏆</span>
            </div>
          ) : (
            <div className="w-28 h-28 bg-rose-100 dark:bg-rose-900/20 text-rose-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <span className="text-6xl">🧗</span>
            </div>
          )}
        </div>

        <h2 className={`text-4xl font-black mb-4 ${result.passed ? 'text-emerald-600' : 'text-rose-600'}`}>
          {result.passed ? 'ĐỈNH CỦA CHÓP!' : 'CỐ GẮNG LÊN NÀO!'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mb-10 font-bold text-lg leading-relaxed">
          {result.passed 
            ? 'Bạn đã vượt qua thử thách một cách ngoạn mục. Streak +1 cực cháy!' 
            : 'Thiếu một chút nữa thôi là thành công rồi. Đừng bỏ cuộc nhé!'}
        </p>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700">
            <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kết Quả</div>
            <div className="text-3xl font-black text-slate-800 dark:text-white">{result.score.toFixed(0)}%</div>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700">
            <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Thời Gian</div>
            <div className="text-3xl font-black text-slate-800 dark:text-white">{formatTime(result.timeSpent)}</div>
          </div>
        </div>

        <div className="flex flex-col gap-4">
          <button
            onClick={onReview}
            className="w-full py-5 bg-green-600 text-white font-black text-xl rounded-2xl hover:bg-green-700 shadow-[0_6px_0_rgb(22,101,52)] active:translate-y-1 active:shadow-none transition-all"
          >
            XEM LỜI GIẢI (CHỮA BÀI) ✍️
          </button>
          <button
            onClick={onClose}
            className="w-full py-4 text-slate-500 dark:text-slate-400 font-black text-lg rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
          >
            Về Trang Chủ 🏠
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultView;
