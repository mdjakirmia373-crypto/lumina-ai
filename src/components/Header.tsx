import React from 'react';
import { Sparkles, Globe, Zap, History, Image as ImageIcon, Mic, MessageSquare } from 'lucide-react';
import { Language } from '../types';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: 'image' | 'voice' | 'chat' | 'history';
  onTabChange: (tab: 'image' | 'voice' | 'chat' | 'history') => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activeTab,
  onTabChange,
  historyCount,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-900/60 sticky top-0 z-40 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 py-3.5 flex items-center justify-between">
        {/* Brand */}
        <div 
          onClick={() => onTabChange('image')} 
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-indigo-500/25 group-hover:scale-105 transition-transform duration-200">
            <Sparkles className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-xl font-extrabold tracking-tight gradient-text">
                LuminaAI
              </span>
              <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                STUDIO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 hidden sm:block">
              {lang === 'bn' ? 'লুমিনা এআই · ফ্রি ইমেজ, ভয়েস ও চ্যাট' : 'LuminaAI · Free Image, Voice & Chat'}
            </p>
          </div>
        </div>

        {/* Center Navigation Shortcuts (Desktop) */}
        <div className="hidden md:flex items-center gap-1 bg-slate-900/80 border border-slate-800 p-1 rounded-xl">
          <button
            onClick={() => onTabChange('image')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'image'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'টেক্সট টু ইমেজ' : 'Text to Image'}</span>
          </button>

          <button
            onClick={() => onTabChange('voice')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'voice'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Mic className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'টেক্সট টু ভয়েস' : 'Text to Voice'}</span>
          </button>

          <button
            onClick={() => onTabChange('chat')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'chat'
                ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'এআই প্রশ্ন-উত্তর' : 'AI Chat Q&A'}</span>
          </button>

          <button
            onClick={() => onTabChange('history')}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${
              activeTab === 'history'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'হিস্ট্রি' : 'History'}</span>
            {historyCount > 0 && (
              <span className="text-[10px] bg-slate-800 text-indigo-400 px-1.5 py-0.2 rounded-full font-bold">
                {historyCount}
              </span>
            )}
          </button>
        </div>

        {/* Right side controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Free Badge */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-amber-300 font-medium bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20">
            <Zap className="w-3 h-3 text-amber-400 fill-amber-400" />
            <span>100% Free AI</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-700/60 text-xs font-medium transition-colors"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">{lang === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
