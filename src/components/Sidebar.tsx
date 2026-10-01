import React from 'react';
import { 
  Sparkles, 
  Image as ImageIcon, 
  Mic, 
  Eraser, 
  MessageSquare, 
  Video,
  Layers, 
  User, 
  LogOut, 
  ChevronRight,
  ShieldCheck,
  Zap,
  Globe,
  BarChart3,
  Activity,
  Lock
} from 'lucide-react';
import { Language, UserAccount, AppTab } from '../types';
import { LumiqraLogo } from './LumiqraLogo';
import { isOwnerUser } from '../utils/adminAuth';

interface SidebarProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: AppTab;
  onTabChange: (tab: AppTab) => void;
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
  const isOwner = isOwnerUser(currentUser?.email);

  const baseNavItems = [
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
      labelBn: 'লুমিক্রা চ্যাট',
      labelEn: 'Lumiqra Chat',
      subBn: 'ফুল-স্ক্রিন এআই চ্যাট',
      subEn: 'Full-Screen AI Chat',
      icon: MessageSquare,
      color: 'from-pink-500 to-rose-600',
      activeRing: 'border-pink-500/80 bg-pink-500/10 text-white shadow-lg shadow-pink-500/15',
      iconColor: 'text-pink-400',
    },
    {
      id: 'video' as const,
      labelBn: 'টেক্সট টু ভিডিও',
      labelEn: 'Text to Video',
      subBn: '১০ সেকেন্ড ওয়াটারমার্ক মুক্ত',
      subEn: '10s Watermark-Free MP4',
      icon: Video,
      color: 'from-fuchsia-500 to-pink-600',
      activeRing: 'border-fuchsia-500/80 bg-fuchsia-500/10 text-white shadow-lg shadow-fuchsia-500/15',
      iconColor: 'text-fuchsia-400',
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

  // ONLY show Admin Dashboard if the logged-in user is the verified owner (mdjakirmia373@gmail.com)
  const navItems = isOwner
    ? [
        ...baseNavItems,
        {
          id: 'admin' as const,
          labelBn: 'অ্যাডমিন ড্যাশবোর্ড',
          labelEn: 'Admin Analytics',
          subBn: 'মালিকানা ও লাইভ হিসাব',
          subEn: 'Owner Live Metrics',
          icon: BarChart3,
          color: 'from-indigo-600 to-purple-600',
          activeRing: 'border-indigo-500/80 bg-indigo-500/10 text-white shadow-lg shadow-indigo-500/15',
          iconColor: 'text-indigo-400',
        },
      ]
    : baseNavItems;

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
          <div className="group cursor-pointer" onClick={() => onTabChange('image')}>
            <LumiqraLogo size="md" />
            <p className="text-[11px] text-slate-400 mt-2 pl-0.5">
              {lang === 'bn' ? 'গুগল এআই স্টুডিও অনুপ্রাণিত ক্রিয়েটর' : 'Google AI Studio Inspired Suite'}
            </p>
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
                  className={`w-4 h-4 transition-transform duration-200 ${
                    isActive ? 'text-white translate-x-0.5' : 'text-slate-600 group-hover:text-slate-400'
                  }`}
                />
              </button>
            );
          })}
        </div>

        {/* Bottom User Account Section */}
        <div className="p-4 border-t border-slate-800/80 bg-slate-950/60 space-y-3">
          {currentUser ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2.5 rounded-2xl bg-slate-900/90 border border-slate-800">
                <div className="flex items-center gap-2.5 overflow-hidden">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white shrink-0 font-bold text-xs">
                    {currentUser.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="overflow-hidden">
                    <div className="flex items-center gap-1.5">
                      <p className="text-xs font-bold text-slate-100 truncate">{currentUser.name}</p>
                      {isOwner && (
                        <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/20 text-indigo-300 font-semibold border border-indigo-500/30">
                          Owner
                        </span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{currentUser.email}</p>
                  </div>
                </div>
                <button
                  onClick={onLogout}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-slate-800 transition cursor-pointer shrink-0"
                  title={lang === 'bn' ? 'লগআউট' : 'Sign Out'}
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <button
                onClick={onOpenAuth}
                className="w-full py-2.5 px-3 rounded-2xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/25 transition cursor-pointer flex items-center justify-center gap-2"
              >
                <User className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? 'সাইন ইন / রেজিস্ট্রেশন' : 'Sign In / Register'}</span>
              </button>
            </div>
          )}

          {/* Language Switcher in Sidebar Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-900 text-xs">
            <span className="text-[11px] text-slate-500">
              {lang === 'bn' ? 'ভাষা / Language:' : 'Language:'}
            </span>
            <button
              onClick={onToggleLang}
              className="flex items-center gap-1.5 text-xs text-indigo-400 hover:text-indigo-300 font-semibold py-1 px-2 rounded-lg hover:bg-slate-900 transition cursor-pointer"
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'English' : 'বাংলা'}</span>
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
