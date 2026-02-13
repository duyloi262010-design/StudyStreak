
import React, { useState } from 'react';
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
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-[2.5rem] shadow-2xl max-w-md w-full p-8 border-b-[10px] border-slate-100 dark:border-slate-800 transition-colors">
        <h2 className="text-2xl font-black text-slate-800 dark:text-white mb-2">Hôm nay bạn học gì? 🌿</h2>
        <p className="text-slate-500 dark:text-slate-400 mb-6 font-bold text-sm">Hãy nhập tên Chương/Bài học để AI tạo đề phù hợp nhất.</p>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {subjects.map(s => (
            <div key={s}>
              <label className="block text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-1 ml-1">{s}</label>
              <input
                type="text"
                required
                placeholder="VD: Chương 2 - Đạo hàm..."
                value={lessons[s] || ''}
                onChange={(e) => setLessons(prev => ({ ...prev, [s]: e.target.value }))}
                className="w-full p-4 bg-slate-50 dark:bg-slate-800 border-2 border-slate-100 dark:border-slate-700 rounded-2xl focus:border-green-500 outline-none font-bold text-sm dark:text-white transition-all placeholder:text-slate-300 dark:placeholder:text-slate-600"
              />
            </div>
          ))}

          <div className="flex gap-3 mt-8">
            <button
              type="button"
              onClick={onCancel}
              className="flex-1 px-4 py-4 border-2 border-slate-100 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-black rounded-2xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all"
            >
              Hủy
            </button>
            <button
              type="submit"
              className="flex-2 px-8 py-4 bg-green-600 text-white font-black rounded-2xl hover:bg-green-700 shadow-lg shadow-green-200 dark:shadow-none transition-all active:scale-95"
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
