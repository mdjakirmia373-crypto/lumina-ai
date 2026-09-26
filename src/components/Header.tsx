import React from 'react';
import { 
  Sparkles, 
  Globe, 
  Zap, 
  Menu, 
  User, 
  LogOut,
  ShieldCheck
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { LumiqraLogo } from './LumiqraLogo';

interface HeaderProps {
  lang: Language;
  onToggleLang: () => void;
  activeTab: 'image' | 'voice' | 'chat' | 'bg-remover' | 'history';
  onTabChange: (tab: 'image' | 'voice' | 'chat' | 'bg-remover' | 'history') => void;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onToggleSidebar: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  lang,
  onToggleLang,
  activeTab,
  onTabChange,
  currentUser,
  onOpenAuth,
  onLogout,
  onToggleSidebar,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/80 sticky top-0 z-30 backdrop-blur-md">
      <div className="w-full px-4 py-3 flex items-center justify-between">
        {/* Left Section: Mobile Menu Button & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
            title="Open Categories Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          {/* Brand */}
          <div 
            onClick={() => onTabChange('image')} 
            className="cursor-pointer group"
          >
            <LumiqraLogo size="md" />
          </div>
        </div>

        {/* Right Section: User Status & Language Toggle */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* 100% Free Badge */}
          <div className="hidden sm:flex items-center gap-1 text-xs text-emerald-400 font-medium bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
            <Zap className="w-3 h-3 text-emerald-400 fill-emerald-400" />
            <span>100% Free</span>
          </div>

          {/* Language Switcher */}
          <button
            onClick={onToggleLang}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 hover:text-white px-2.5 sm:px-3 py-1.5 rounded-xl border border-slate-800 text-xs font-medium transition cursor-pointer"
            title="Switch Language / ভাষা পরিবর্তন করুন"
          >
            <Globe className="w-3.5 h-3.5 text-indigo-400" />
            <span className="font-semibold">{lang === 'bn' ? 'EN' : 'বাংলা'}</span>
          </button>

          {/* User Sign In / Profile */}
          {currentUser ? (
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-200 font-medium">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                <span className="max-w-[100px] truncate hidden sm:inline">{currentUser.name}</span>
              </div>
              <button
                onClick={onLogout}
                className="p-1.5 rounded-xl bg-slate-900 hover:bg-red-500/20 text-slate-400 hover:text-red-300 border border-slate-800 transition cursor-pointer"
                title={lang === 'bn' ? 'লগআউট' : 'Sign Out'}
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center gap-1.5 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white px-3 sm:px-4 py-1.5 rounded-xl text-xs font-bold shadow-md shadow-indigo-600/20 transition cursor-pointer"
            >
              <User className="w-3.5 h-3.5" />
              <span>{lang === 'bn' ? 'লগইন / সাইন আপ' : 'Login / Sign Up'}</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
