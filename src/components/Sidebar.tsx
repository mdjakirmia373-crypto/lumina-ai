import React from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Mic, 
  Eraser, 
  MessageSquare, 
  Layers, 
  User, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe
} from 'lucide-react';
import { Language, UserAccount } from '../types';

interface SidebarProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: 'image' | 'voice' | 'bg-remover' | 'chat' | 'history';
  onTabChange: (tab: 'image' | 'voice' | 'bg-remover' | 'chat' | 'history') => void;
  currentUser: UserAccount | null;
  onLogout: () => void;
  onOpenAuth: () => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  lang,
  onToggleLang,
  activeTab,
  onTabChange,
  currentUser,
  onLogout,
  onOpenAuth,
  isOpenMobile,
  onCloseMobile,
}) => {
  const navItems = [
    {
      id: 'image' as const,
      labelBn: 'টেক্সট টু ইমেজ',
      labelEn: 'Text to Image',
      subBn: '৮কে আল্ট্রা এইচডি ছবি',
      subEn: '8K Ultra HD Art',
      icon: ImageIcon,
      color: 'from-blue-500 to-indigo-600',
      activeRing: 'border-blue-500/80 bg-blue-500/10 text-white shadow-lg shadow-blue-500/15',
      iconColor: 'text-blue-400',
    },
    {
      id: 'voice' as const,
      labelBn: 'টেক্সট টু ভয়েস',
      labelEn: 'Text to Voice',
      subBn: 'বাংলা ও ইংরেজি ভয়েসওভার',
      subEn: 'Bangla & English TTS',
      icon: Mic,
      color: 'from-purple-500 to-pink-600',
      activeRing: 'border-purple-500/80 bg-purple-500/10 text-white shadow-lg shadow-purple-500/15',
      iconColor: 'text-purple-400',
    },
    {
      id: 'bg-remover' as const,
      labelBn: 'ব্যাকগ্রাউন্ড রিমুভার',
      labelEn: 'BG Remover',
      subBn: 'ছবি ও ভিডিও ব্যাকগ্রাউন্ড',
      subEn: 'Photo & Video Cutout',
      icon: Eraser,
      color: 'from-emerald-500 to-teal-600',
      activeRing: 'border-emerald-500/80 bg-emerald-500/10 text-white shadow-lg shadow-emerald-500/15',
      iconColor: 'text-emerald-400',
    },
    {
      id: 'chat' as const,
      labelBn: 'এআই চ্যাট (Gemini)',
      labelEn: 'AI Chat (Gemini)',
      subBn: 'প্রশ্নোত্তর ও গল্প লেখা',
      subEn: 'Q&A & Story Writing',
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-600',
      activeRing: 'border-pink-500/80 bg-pink-500/10 text-white shadow-lg shadow-pink-500/15',
      iconColor: 'text-pink-400',
    },
    {
      id: 'history' as const,
      labelBn: 'হিস্ট্রি ও গ্যালারি',
      labelEn: 'History Gallery',
      subBn: 'তৈরিকৃত সব ফাইল',
      subEn: 'Your Saved Creations',
      icon: Layers,
      color: 'from-amber-500 to-orange-600',
      activeRing: 'border-amber-500/80 bg-amber-500/10 text-white shadow-lg shadow-amber-500/15',
      iconColor: 'text-amber-400',
    },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-black/70 backdrop-blur-sm lg:hidden animate-fadeIn"
        />
      )}

      {/* Google AI Studio Style Left Sidebar */}
      <aside
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-950/95 lg:bg-slate-950/80 border-r border-slate-800/80 backdrop-blur-xl flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Top Header Logo */}
        <div className="p-5 border-b border-slate-800/80">
          <div className="flex items-center space-x-3 group cursor-pointer" onClick={() => onTabChange('image')}>
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-transform duration-200">
              <Sparkles className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-extrabold tracking-tight gradient-text">
                  Lumiqra
                </span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                  AI
                </span>
              </div>
              <p className="text-[11px] text-slate-400">
                {lang === 'bn' ? 'গুগল এআই স্টুডিও স্টাইল' : 'Google AI Studio Style'}
              </p>
            </div>
          </div>
        </div>

        {/* Categories Section (Marked Categories on the Left Side) */}
        <div className="flex-1 overflow-y-auto px-3.5 py-4 space-y-1.5">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-500 flex items-center justify-between">
            <span>{lang === 'bn' ? 'স্টুডিও ক্যাটাগরি' : 'Studio Categories'}</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
          </div>

          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onTabChange(item.id);
                  onCloseMobile();
                }}
                className={`w-full p-3 rounded-2xl text-left border transition-all duration-200 flex items-center justify-between group cursor-pointer ${
                  isActive
                    ? item.activeRing
                    : 'border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 hover:border-slate-800'
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105 ${
                      isActive
                        ? `bg-gradient-to-tr ${item.color} text-white shadow-md`
                        : 'bg-slate-900 border border-slate-800 text-slate-400'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="truncate">
                    <p className={`text-xs font-bold truncate ${isActive ? 'text-white' : 'text-slate-200'}`}>
                      {lang === 'bn' ? item.labelBn : item.labelEn}
                    </p>
                    <p className="text-[10px] text-slate-500 truncate">
                      {lang === 'bn' ? item.subBn : item.subEn}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  className={`w-4 h-4 shrink-0 transition-transform duration-200 ${
                    isActive ? 'text-white translate-x-0.5' : 'text-slate-600 opacity-0 group-hover:opacity-100'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Bottom User Account & Settings Section */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
          {/* Language Switch */}
          <div className="flex items-center justify-between px-2 text-xs">
            <span className="text-slate-400 flex items-center gap-1.5 text-xs">
              <Globe className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'bn' ? 'ভাষা:' : 'Lang:'}</span>
            </span>
            <button
              onClick={onToggleLang}
              className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white font-semibold text-[11px] transition cursor-pointer"
            >
              {lang === 'bn' ? 'English (EN)' : 'বাংলা (BN)'}
            </button>
          </div>

          {/* User Profile Card */}
          {currentUser ? (
            <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 space-y-2.5">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 flex items-center justify-center text-white font-bold text-xs shadow-md">
                  {currentUser.name.charAt(0).toUpperCase()}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-white truncate">{currentUser.name}</p>
                  <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                </div>
              </div>

              <button
                onClick={onLogout}
                className="w-full py-1.5 px-3 rounded-xl bg-slate-950/80 hover:bg-red-500/20 text-slate-400 hover:text-red-300 text-[11px] font-semibold flex items-center justify-center gap-1.5 border border-slate-800 transition cursor-pointer"
              >
                <LogOut className="w-3 h-3" />
                <span>{lang === 'bn' ? 'লগআউট করুন' : 'Sign Out'}</span>
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-bold text-xs shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'সাইন আপ / লগইন' : 'Sign Up / Login'}</span>
            </button>
          )}

          <div className="text-[10px] text-slate-500 text-center flex items-center justify-center gap-1">
            <ShieldCheck className="w-3 h-3 text-emerald-400" />
            <span>{lang === 'bn' ? '১০০% ফ্রি ও এনক্রিপ্টেড' : '100% Free & Encrypted'}</span>
          </div>
        </div>
      </aside>
    </>
  );
};
