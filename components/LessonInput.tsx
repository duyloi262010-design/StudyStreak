
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { SubjectLesson } from '../types';

interface Props {
  subjects: string[];
  onSubmit: (lessons: SubjectLesson[]) => void;
  onCancel: () => void;
}

const LessonInput: React.FC<Props> = ({ subjects, onSubmit, onCancel }) => {
  const [lessons, setLessons] = useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = subjects.map(s => ({
      subject: s,
      lesson: lessons[s] || 'Chương hiện tại'
    }));
    onSubmit(data);
  };

  return (
    <div className="w-full max-w-lg mx-auto">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl p-8 md:p-10 border-b-[10px] border-slate-100 dark:border-slate-800 transition-colors">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🌿</div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-800 dark:text-white mb-2 tracking-tight">Hôm nay bạn học gì?</h2>
          <p className="text-slate-500 dark:text-slate-400 font-bold text-sm">Nhập Chương/Bài học để AI soạn đề bám sát nhất.</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {subjects.map(s => (
            <div key={s} className="space-y-1">
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest ml-1">{s}</label>
              <input
                type="text"
                required
                placeholder="VD: Chương 2 - Đạo hàm..."
                value={lessons[s] || ''}
                onChange={(e) => setLessons(prev => ({ ...prev, [s]: e.target.value }))}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-green-500 outline-none font-bold text-sm dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600 shadow-sm"
              />
            </div>
          ))}

          <div className="flex flex-col sm:flex-row gap-3 mt-10">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all uppercase tracking-widest text-xs"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-2 px-8 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-xl shadow-green-200/50 dark:shadow-none transition-all active:scale-95 uppercase tracking-widest text-xs border-b-4 border-green-800"
            >
              Tạo đề thi ⚡
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LessonInput;
