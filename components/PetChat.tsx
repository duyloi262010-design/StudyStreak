
import React, { useState, useRef, useEffect } from 'react';
import { UserProfile, PetAvatarType } from '../types';
import { chatWithPetStream } from '../geminiService';
import { DAYS_OF_WEEK } from '../constants';

interface Props {
  profile: UserProfile;
  onClose: () => void;
}

const PetChat: React.FC<Props> = ({ profile, onClose }) => {
  const [messages, setMessages] = useState<{ role: 'user' | 'model', text: string }[]>([
    { role: 'model', text: `Chào ${profile.username}! Tớ là ${profile.pet.name} đây. Hôm nay cậu muốn "ăn" kiến thức môn gì nào? ⚡` }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleSend = async () => {
    if (!input.trim() || isTyping) return;
    
    const userMsg = input.trim();
    setInput('');
    setMessages(prev => [...prev, { role: 'user', text: userMsg }]);
    setIsTyping(true);

    // Tạo một tin nhắn rỗng cho model để bắt đầu stream vào đó
    setMessages(prev => [...prev, { role: 'model', text: '' }]);

    try {
      const history = messages.map(m => ({ role: m.role, parts: [{ text: m.text }] }));
      
      // Lấy ngữ cảnh thực tế cho AI
      const today = DAYS_OF_WEEK[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
      const todaySubjects = profile.schedule[today] || [];
      const todayStr = new Date().toISOString().split('T')[0];
      const timeStudiedToday = profile.studyHistory?.[todayStr] || 0;

      const responseStream = await chatWithPetStream(
        profile, 
        userMsg, 
        history, 
        { todaySubjects, timeStudiedToday }
      );
      
      let fullText = "";
      for await (const chunk of responseStream) {
        const chunkText = chunk.text;
        if (chunkText) {
          fullText += chunkText;
          setMessages(prev => {
            const newMsgs = [...prev];
            newMsgs[newMsgs.length - 1] = { role: 'model', text: fullText };
            return newMsgs;
          });
        }
      }
    } catch (error) {
      console.error("Chat Error:", error);
      setMessages(prev => {
        const newMsgs = [...prev];
        newMsgs[newMsgs.length - 1] = { role: 'model', text: 'Tớ đang bận học một chút, tí tớ trả lời nhé! 🦖' };
        return newMsgs;
      });
    } finally {
      setIsTyping(false);
    }
  };

  const getPetVisualData = (type: PetAvatarType, level: number) => {
    const stage = level >= 10 ? 3 : level >= 5 ? 2 : level >= 2 ? 1 : 0;
    const visuals: Record<PetAvatarType, string[]> = {
      classic: ['🥚', '🦖', '🦕', '🐲'],
      cyber: ['💾', '🤖', '🦾', '🛸'],
      nature: ['🌱', '🌿', '🌳', '🐉'],
      magic: ['🔮', '✨', '🦄', '🧙‍♂️'],
      ocean: ['🥚', '🐙', '🦈', '🧜‍♂️'],
      space: ['☄️', '🛸', '👨‍🚀', '🌌'],
      fire: ['🥚', '🔥', '🦅', '🐲'],
      zen: ['🥚', '🎋', '🐼', '🏮']
    };
    
    const animations = ['animate-pulse', 'animate-bounce', 'animate-float', 'animate-mighty'];
    const bgColors: Record<PetAvatarType, string> = {
      classic: 'bg-green-600',
      cyber: 'bg-blue-600',
      nature: 'bg-emerald-600',
      magic: 'bg-purple-600',
      ocean: 'bg-cyan-600',
      space: 'bg-indigo-600',
      fire: 'bg-orange-600',
      zen: 'bg-slate-600'
    };

    const stageNames = {
      classic: ['Sơ Sinh', 'Dino Nhí', 'Dino Lớn', 'Huyền Thoại'],
      cyber: ['Linh Kiện', 'Bot Học Tập', 'Cyborg', 'Siêu Máy Tính'],
      nature: ['Mầm Xanh', 'Lá Non', 'Thần Rừng', 'Linh Thú'],
      magic: ['Tinh Thể', 'Phù Thủy', 'Kỳ Lân', 'Tối Thượng'],
      ocean: ['Trứng Nước', 'Bạch Tuộc', 'Cá Mập', 'Hải Vương'],
      space: ['Mảnh Vỡ', 'UFO', 'Phi Hành Gia', 'Thực Thể'],
      fire: ['Hỏa Cầu', 'Đốm Lửa', 'Kim Ô', 'Hỏa Long'],
      zen: ['Hạt Giống', 'Trúc Xanh', 'Gấu Trúc', 'Đại Sư']
    };

    return {
      emoji: visuals[type][stage],
      animation: animations[stage],
      bgColor: bgColors[type],
      stageName: stageNames[type][stage]
    };
  };

  const visual = getPetVisualData(profile.pet.avatarType, profile.pet.level);

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-end md:items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[2.5rem] shadow-2xl flex flex-col h-[85vh] md:h-[700px] overflow-hidden animate-scaleIn border-b-8 border-slate-100 dark:border-slate-800 transition-colors">
        {/* Header */}
        <div className={`${visual.bgColor} p-6 text-white relative overflow-hidden`}>
          <div className="absolute right-0 bottom-0 opacity-20 pointer-events-none">
            <span className="text-[10rem]">{visual.emoji}</span>
          </div>
          <div className="flex items-center justify-between relative z-10">
            <div className="flex items-center space-x-4">
              <div className={`bg-white/20 p-3 rounded-3xl backdrop-blur-md border border-white/20 ${visual.animation}`}>
                <span className="text-5xl">{visual.emoji}</span>
              </div>
              <div>
                <h3 className="font-black text-2xl">{profile.pet.name}</h3>
                <p className="text-white/60 text-[11px] font-black uppercase tracking-widest">{visual.stageName} • LV.{profile.pet.level}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onClose} 
                className="px-4 py-2 bg-white/20 backdrop-blur-md rounded-xl font-black text-xs uppercase tracking-widest hover:bg-white/30 transition-all border border-white/10"
              >
                Quay lại
              </button>
              <button onClick={onClose} className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-white/10 transition-all font-black text-2xl">✕</button>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div ref={scrollRef} className="flex-grow overflow-y-auto p-6 space-y-5 bg-slate-50 dark:bg-slate-950 custom-scrollbar transition-colors">
          {messages.map((m, idx) => (
            <div key={idx} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[85%] p-5 rounded-3xl font-bold text-base shadow-sm leading-relaxed transition-all ${
                m.role === 'user' 
                ? `${visual.bgColor} text-white rounded-tr-none` 
                : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-none border border-slate-100 dark:border-slate-700'
              }`}>
                {m.text || (m.role === 'model' && idx === messages.length - 1 ? '...' : '')}
              </div>
            </div>
          ))}
          {isTyping && messages[messages.length-1].text === "" && (
            <div className="flex justify-start">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-3xl rounded-tl-none border border-slate-100 dark:border-slate-700 space-x-1 flex shadow-sm">
                <div className={`w-2.5 h-2.5 rounded-full animate-bounce ${visual.bgColor.replace('bg-', 'bg-opacity-50 bg-')}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full animate-bounce delay-100 ${visual.bgColor.replace('bg-', 'bg-opacity-75 bg-')}`}></div>
                <div className={`w-2.5 h-2.5 rounded-full animate-bounce delay-200 ${visual.bgColor}`}></div>
              </div>
            </div>
          )}
        </div>

        {/* Input */}
        <div className="p-6 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800 transition-colors">
          <div className="flex space-x-3">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder={`Hỏi ${profile.pet.name} bất cứ điều gì...`}
              className="flex-grow bg-slate-50 dark:bg-slate-800 p-4.5 rounded-2xl border-2 border-slate-100 dark:border-slate-700 focus:border-green-500 outline-none font-black text-sm placeholder:text-slate-300 dark:placeholder:text-slate-600 dark:text-white transition-all shadow-sm"
            />
            <button 
              onClick={handleSend}
              disabled={!input.trim() || isTyping}
              className={`w-14 h-14 text-white rounded-2xl flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all disabled:opacity-50 ${visual.bgColor}`}
            >
              🚀
            </button>
          </div>
        </div>
      </div>
      <style>{`
        @keyframes float { 0%, 100% { transform: translateY(0) rotate(0deg); } 50% { transform: translateY(-5px) rotate(2deg); } }
        @keyframes mighty { 0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px currentColor); } 50% { transform: scale(1.1); filter: drop-shadow(0 0 15px currentColor); } }
        .animate-float { animation: float 3s ease-in-out infinite; }
        .animate-mighty { animation: mighty 2s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default PetChat;
