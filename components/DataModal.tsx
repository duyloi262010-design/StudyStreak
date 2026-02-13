
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface Props {
  onImport: (data: string) => void;
  onClose: () => void;
  profiles: UserProfile[];
}

const DataModal: React.FC<Props> = ({ onImport, onClose, profiles }) => {
  const [importCode, setImportCode] = useState('');
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [copied, setCopied] = useState(false);

  const exportData = JSON.stringify(profiles);

  const handleCopy = () => {
    navigator.clipboard.writeText(exportData);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-md flex items-center justify-center p-4 z-[70] animate-fadeIn">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-[3rem] shadow-2xl overflow-hidden border-b-[10px] border-slate-200 dark:border-slate-800 transition-colors">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-2xl font-black text-slate-950 dark:text-white uppercase tracking-tighter">Đồng bộ dữ liệu</h2>
            <button 
              onClick={onClose} 
              className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 transition-all text-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex space-x-2 mb-8 p-1 bg-slate-100 dark:bg-black rounded-2xl border border-slate-200 dark:border-slate-800">
            <button 
              onClick={() => setActiveTab('export')}
              className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all ${activeTab === 'export' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-400'}`}
            >
              📤 Xuất mã
            </button>
            <button 
              onClick={() => setActiveTab('import')}
              className={`flex-1 py-3 font-black text-xs uppercase tracking-widest rounded-xl transition-all ${activeTab === 'import' ? 'bg-white dark:bg-slate-800 text-slate-950 dark:text-white shadow-sm' : 'text-slate-400'}`}
            >
              📥 Nhập mã
            </button>
          </div>

          {activeTab === 'export' ? (
            <div className="space-y-6">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                Sao chép mã này để chia sẻ toàn bộ hồ sơ học tập và Linh vật sang máy tính hoặc điện thoại khác.
              </p>
              <div className="relative">
                <textarea 
                  readOnly 
                  value={exportData}
                  className="w-full h-32 p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-mono text-[10px] text-slate-400 dark:text-slate-600 outline-none resize-none"
                />
                <button 
                  onClick={handleCopy}
                  className="absolute bottom-4 right-4 px-4 py-2 bg-slate-950 dark:bg-white text-white dark:text-black font-black text-[10px] uppercase rounded-xl hover:scale-105 active:scale-95 transition-all"
                >
                  {copied ? 'ĐÃ SAO CHÉP! ✅' : 'SAO CHÉP MÃ 📋'}
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                Dán mã hồ sơ học tập bạn nhận được vào đây để tải lại toàn bộ tiến trình học tập của mình.
              </p>
              <textarea 
                placeholder="Dán mã tại đây..."
                value={importCode}
                onChange={(e) => setImportCode(e.target.value)}
                className="w-full h-32 p-4 bg-slate-50 dark:bg-black border-2 border-slate-100 dark:border-slate-800 rounded-2xl font-mono text-[10px] text-slate-950 dark:text-white outline-none focus:border-green-600 resize-none transition-all"
              />
              <button 
                onClick={() => onImport(importCode)}
                disabled={!importCode.trim()}
                className="w-full py-5 bg-green-600 text-white font-black text-sm uppercase tracking-widest rounded-2xl hover:bg-green-700 shadow-xl disabled:opacity-30 disabled:cursor-not-allowed transition-all"
              >
                KHÔI PHỤC HỒ SƠ ⚡
              </button>
            </div>
          )}

          <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
             <p className="text-[10px] font-bold text-slate-400 dark:text-slate-600 text-center uppercase tracking-tighter italic">
               * Lưu ý: Khi nhập mã mới, dữ liệu hiện tại trên trình duyệt này sẽ bị thay thế hoàn toàn.
             </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DataModal;
