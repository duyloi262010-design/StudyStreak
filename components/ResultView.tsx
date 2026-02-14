
import React from 'react';
import { motion } from 'framer-motion';
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
    <div className="max-w-2xl mx-auto p-4 md:p-6 mt-10">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: 'spring', damping: 20 }}
        className={`p-10 rounded-[3rem] shadow-2xl relative overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 border-b-[12px] transition-colors ${result.passed ? 'border-emerald-100 dark:border-b-emerald-600' : 'border-rose-100 dark:border-b-rose-600'}`}
      >
        <div className="mb-8">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className={`w-28 h-28 ${result.passed ? 'bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600' : 'bg-rose-100 dark:bg-rose-900/40 text-rose-600'} rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner animate-pulse-slow`}
          >
            <span className="text-6xl">{result.passed ? '🏆' : '🧗'}</span>
          </motion.div>
        </div>

        <motion.h2 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className={`text-center text-4xl font-black mb-4 ${result.passed ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-600 dark:text-rose-400'}`}
        >
          {result.passed ? 'ĐỈNH CỦA CHÓP!' : 'CỐ GẮNG LÊN NÀO!'}
        </motion.h2>
        
        <motion.p 
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-center text-slate-500 dark:text-slate-400 mb-10 font-bold text-lg leading-relaxed"
        >
          {result.passed 
            ? 'Bạn đã vượt qua thử thách một cách ngoạn mục. Streak +1 cực cháy!' 
            : 'Thiếu một chút nữa thôi là thành công rồi. Đừng bỏ cuộc nhé!'}
        </motion.p>

        <div className="grid grid-cols-2 gap-6 mb-10">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700 text-center"
          >
            <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Kết Quả</div>
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{result.score.toFixed(0)}%</div>
          </motion.div>
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-slate-50 dark:bg-slate-800 p-6 rounded-[2rem] border-2 border-slate-100 dark:border-slate-700 text-center"
          >
            <div className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1">Thời Gian</div>
            <div className="text-3xl font-black text-slate-800 dark:text-slate-100">{formatTime(result.timeSpent)}</div>
          </motion.div>
        </div>

        <div className="flex flex-col gap-4">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onReview}
            className="w-full py-5 bg-green-600 text-white font-black text-xl rounded-2xl hover:bg-green-700 shadow-[0_6px_0_rgb(22,101,52)] dark:shadow-[0_6px_0_rgb(21,128,61)] active:translate-y-1 active:shadow-none transition-all"
          >
            XEM LỜI GIẢI (CHỮA BÀI) ✍️
          </motion.button>
          <button
            onClick={onClose}
            className="w-full py-4 text-slate-500 dark:text-slate-400 font-black text-lg rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
          >
            Về Trang Chủ 🏠
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ResultView;
