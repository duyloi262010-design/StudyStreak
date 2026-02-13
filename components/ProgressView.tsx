
import React, { useState, useEffect } from 'react';
import { UserProfile } from '../types';

interface Props {
  profile: UserProfile;
  onBack: () => void;
  // Giả sử App.tsx truyền thêm hàm cập nhật profile vào đây (optional enhancement)
  // Nếu không, ta sẽ dựa vào ProfileModal để đổi. Nhưng để đáp ứng yêu cầu "có thể sửa", 
  // ta sẽ gọi trực tiếp một hàm update từ App nếu được, hoặc ít nhất là cung cấp UI sửa tại đây.
}

const ProgressView: React.FC<Props & { onUpdateProfile?: (updated: UserProfile) => void }> = ({ profile, onBack, onUpdateProfile }) => {
  const [dailyGoal, setDailyGoal] = useState(profile.dailyGoalHours || 3);
  
  // Chuẩn bị dữ liệu cho 7 ngày gần nhất
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const displayDate = d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' });
    const seconds = profile.studyHistory?.[dateStr] || 0;
    const hours = seconds / 3600; 
    return { dateStr, displayDate, hours, seconds };
  });

  const chartHeight = 350;
  const chartWidth = 700;
  const paddingX = 60;
  const paddingY = 40;
  const maxY = 12;

  const points = last7Days.map((day, i) => {
    const x = paddingX + (i * (chartWidth - 2 * paddingX) / 6);
    const visualHours = Math.min(maxY, day.hours);
    const y = chartHeight - paddingY - (visualHours * (chartHeight - 2 * paddingY) / maxY);
    return { x, y, ...day };
  });

  const goalY = chartHeight - paddingY - (dailyGoal * (chartHeight - 2 * paddingY) / maxY);

  const pathD = points.reduce((acc, p, i) => {
    return i === 0 ? `M ${p.x} ${p.y}` : `${acc} L ${p.x} ${p.y}`;
  }, "");

  const areaD = `${pathD} L ${points[points.length - 1].x} ${chartHeight - paddingY} L ${points[0].x} ${chartHeight - paddingY} Z`;

  const totalWeeklySeconds = last7Days.reduce((acc, d) => acc + d.seconds, 0);
  const totalWeeklyHours = (totalWeeklySeconds / 3600).toFixed(1);
  const daysGoalMet = last7Days.filter(d => d.hours >= dailyGoal).length;

  const handleGoalChange = (val: number) => {
    setDailyGoal(val);
    if (onUpdateProfile) {
      onUpdateProfile({ ...profile, dailyGoalHours: val });
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-10 animate-fadeIn">
      <div className="flex items-center justify-between mb-10">
        <div>
           <h2 className="text-3xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Tiến độ học tập 📈</h2>
           <p className="text-slate-500 font-bold text-sm">Cập nhật lịch sử 7 ngày qua</p>
        </div>
        <button 
          onClick={onBack}
          className="px-6 py-3 bg-slate-100 dark:bg-slate-900 border-2 border-slate-200 dark:border-slate-800 rounded-2xl font-black text-xs uppercase text-slate-500 hover:text-slate-950 transition-all"
        >
          Quay lại
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-10">
        <div className="bg-purple-600 p-8 rounded-[2.5rem] text-white shadow-xl shadow-purple-200 dark:shadow-none col-span-1 flex flex-col justify-between">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-2 opacity-80">Tổng thời gian tuần</p>
            <p className="text-4xl font-black">{totalWeeklyHours} <span className="text-lg opacity-60">h</span></p>
          </div>
          <div className="mt-6 pt-6 border-t border-white/20">
             <p className="text-[10px] font-black uppercase tracking-[0.2em] mb-1 opacity-80">Số ngày đạt mục tiêu</p>
             <p className="text-2xl font-black">{daysGoalMet}/7 <span className="text-sm opacity-60">ngày</span></p>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-950 p-8 rounded-[2.5rem] border-2 border-slate-100 dark:border-slate-800 col-span-3">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Biểu đồ phân tích (0H - 12H)</p>
            
            {/* Interactive Goal Slider directly in Chart header */}
            <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-900 p-3 rounded-2xl border border-slate-100 dark:border-slate-800">
                <span className="text-[10px] font-black text-emerald-600 uppercase">Mục tiêu: {dailyGoal}h</span>
                <input 
                    type="range" min="1" max="12" step="0.5" 
                    value={dailyGoal} 
                    onChange={(e) => handleGoalChange(parseFloat(e.target.value))}
                    className="w-24 h-1.5 accent-emerald-500" 
                />
            </div>

            <div className="flex items-center gap-4">
               <div className="flex items-center gap-2">
                 <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
                 <span className="text-[10px] font-black text-slate-400 uppercase">Học</span>
               </div>
            </div>
          </div>
          
          <div className="relative w-full overflow-x-auto custom-scrollbar">
            <svg 
              viewBox={`0 0 ${chartWidth} ${chartHeight}`} 
              className="w-full min-w-[600px] h-auto overflow-visible"
            >
              {[0, 2, 4, 6, 8, 10, 12].map(val => {
                const y = chartHeight - paddingY - (val * (chartHeight - 2 * paddingY) / maxY);
                return (
                  <g key={val}>
                    <line x1={paddingX} y1={y} x2={chartWidth - paddingX} y2={y} stroke="currentColor" className="text-slate-100 dark:text-slate-800/50" strokeWidth="1" strokeDasharray="4" />
                    <text x={paddingX - 15} y={y + 4} textAnchor="end" className="text-[11px] font-black fill-slate-400 uppercase">{val}h</text>
                  </g>
                );
              })}

              <line 
                x1={paddingX} y1={goalY} 
                x2={chartWidth - paddingX} y2={goalY} 
                stroke="#10b981" strokeWidth="3" strokeDasharray="8,4" 
                className="transition-all duration-300"
              />
              <text x={chartWidth - paddingX + 5} y={goalY + 4} className="text-[9px] font-black fill-emerald-600 uppercase transition-all duration-300">🎯 Target {dailyGoal}h</text>

              <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#9333ea" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#9333ea" stopOpacity="0" />
                </linearGradient>
              </defs>

              <path d={areaD} fill="url(#chartGradient)" />
              <path d={pathD} fill="none" stroke="#9333ea" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />

              {points.map((p, i) => (
                <g key={i}>
                  <circle 
                    cx={p.x} cy={p.y} r="6" 
                    fill={p.hours >= dailyGoal ? "#10b981" : "#9333ea"} 
                    stroke="white" strokeWidth="2" 
                    className="shadow-lg cursor-pointer hover:r-8 transition-all" 
                  />
                  <text x={p.x} y={chartHeight - 10} textAnchor="middle" className="text-[11px] font-black fill-slate-500 uppercase">{p.displayDate}</text>
                  <text x={p.x} y={p.y - 15} textAnchor="middle" className={`text-[10px] font-black ${p.hours >= dailyGoal ? 'fill-emerald-600' : 'fill-purple-600'}`}>
                    {p.hours.toFixed(1)}h
                  </text>
                </g>
              ))}
            </svg>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-950 p-10 rounded-[3rem] border-2 border-slate-100 dark:border-slate-800 shadow-sm">
        <div className="flex items-center justify-between mb-8">
           <h3 className="text-xl font-black">Nhật ký chi tiết</h3>
           <div className="bg-emerald-50 dark:bg-emerald-900/10 px-4 py-2 rounded-xl border border-emerald-100 dark:border-emerald-900/30">
              <span className="text-emerald-600 dark:text-emerald-400 font-black text-xs uppercase">🎁 Vượt chỉ tiêu: +1 EXP</span>
           </div>
        </div>
        <div className="space-y-3">
          {last7Days.slice().reverse().map((day, i) => {
            const isTargetMet = day.hours >= dailyGoal;
            return (
              <div key={i} className={`flex items-center justify-between p-5 rounded-2xl border-2 transition-all ${isTargetMet ? 'border-emerald-100 bg-emerald-50/20 dark:border-emerald-900/20 dark:bg-emerald-900/5' : 'border-slate-50 bg-slate-50/50 dark:border-slate-900 dark:bg-slate-900/50'}`}>
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${isTargetMet ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-200 text-slate-400'}`}>
                    {isTargetMet ? '⭐' : '📅'}
                  </div>
                  <div>
                    <span className="font-black text-slate-700 dark:text-slate-300 block">
                      {day.dateStr === new Date().toISOString().split('T')[0] ? 'Hôm nay' : day.displayDate}
                    </span>
                    <span className={`text-[10px] font-black uppercase tracking-widest ${isTargetMet ? 'text-emerald-600' : 'text-slate-400'}`}>
                      {isTargetMet ? 'Đạt chỉ tiêu' : 'Chưa đạt mục tiêu'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="hidden md:block w-40 bg-slate-200 dark:bg-slate-800 h-2.5 rounded-full overflow-hidden">
                     <div 
                       className={`h-full transition-all duration-1000 ${isTargetMet ? 'bg-emerald-500' : 'bg-purple-500'}`} 
                       style={{ width: `${Math.min(100, (day.hours / maxY) * 100)}%` }}
                     ></div>
                  </div>
                  <div className="text-right">
                    <span className={`font-black text-lg block ${isTargetMet ? 'text-emerald-600' : 'text-slate-700 dark:text-slate-300'}`}>
                      {day.hours.toFixed(1)}h
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase">
                      {(day.seconds / 60).toFixed(0)} phút
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressView;
