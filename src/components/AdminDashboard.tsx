import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Eye, 
  Mic, 
  Image as ImageIcon, 
  Eraser, 
  MessageSquare, 
  TrendingUp, 
  Calendar, 
  ShieldCheck, 
  RefreshCw, 
  Activity, 
  Sparkles, 
  BarChart3, 
  Clock, 
  KeyRound, 
  Award,
  Zap,
  Globe,
  ArrowUpRight,
  Database,
  Trash2
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { loadAnalytics, saveAnalytics, AdminStatsData, ActivityLog } from '../utils/analyticsTracker';

interface AdminDashboardProps {
  lang: Language;
  currentUser: UserAccount | null;
  onOpenAuth: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  lang,
  currentUser,
  onOpenAuth,
}) => {
  const [stats, setStats] = useState<AdminStatsData>(() => loadAnalytics());
  const [activeSubTab, setActiveSubTab] = useState<'overview' | 'logs' | 'breakdown'>('overview');
  const [adminPin, setAdminPin] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(() => {
    // If the logged in user is the owner mdjakirmia373@gmail.com, auto-unlock
    if (currentUser?.email?.toLowerCase().includes('mdjakirmia') || currentUser?.email?.toLowerCase().includes('jakir')) {
      return true;
    }
    return sessionStorage.getItem('lumiqra_admin_unlocked') === '1';
  });
  const [pinError, setPinError] = useState(false);

  // Refresh stats periodically and listen to live events
  useEffect(() => {
    const handleUpdate = (e: any) => {
      if (e.detail) {
        setStats(e.detail);
      } else {
        setStats(loadAnalytics());
      }
    };

    window.addEventListener('lumiqra_analytics_updated', handleUpdate);
    const interval = setInterval(() => {
      setStats(loadAnalytics());
    }, 5000);

    return () => {
      window.removeEventListener('lumiqra_analytics_updated', handleUpdate);
      clearInterval(interval);
    };
  }, []);

  // Check user email
  useEffect(() => {
    if (currentUser?.email?.toLowerCase().includes('mdjakirmia') || currentUser?.email?.toLowerCase().includes('jakir')) {
      setIsUnlocked(true);
      sessionStorage.setItem('lumiqra_admin_unlocked', '1');
    }
  }, [currentUser]);

  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default master PIN for the creator (or Jakir's direct unlock)
    if (adminPin === '1012' || adminPin === '373' || adminPin === '7860') {
      setIsUnlocked(true);
      sessionStorage.setItem('lumiqra_admin_unlocked', '1');
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleResetData = () => {
    const confirmPrompt = lang === 'bn' 
      ? 'আপনি কি নিশ্চিত সব অ্যানালিটিক্স ডেটা রিসেট করতে চান?' 
      : 'Are you sure you want to reset all analytics counters?';
    if (window.confirm(confirmPrompt)) {
      const resetState: AdminStatsData = {
        totalVisits: 1,
        totalUniqueVisitors: 1,
        totalVoicesGenerated: 0,
        totalImagesGenerated: 0,
        totalBgRemoved: 0,
        totalChatMessages: 0,
        dailyStats: {},
        recentLogs: [],
        topVoices: {},
        topStyles: {},
      };
      saveAnalytics(resetState);
      setStats(resetState);
    }
  };

  // Calculate today's stats
  const todayKey = new Date().toISOString().split('T')[0];
  const todayStat = stats.dailyStats[todayKey] || {
    visits: 0,
    uniqueVisitors: 0,
    voicesGenerated: 0,
    imagesGenerated: 0,
    bgRemoved: 0,
    chatMessages: 0,
  };

  if (!isUnlocked) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl max-w-lg mx-auto text-center space-y-6 animate-fade-in my-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/25">
          <KeyRound className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white mb-2">
            {lang === 'bn' ? 'অ্যাডমিন কন্ট্রোল প্যানেল' : 'Creator & Admin Portal'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            {lang === 'bn' 
              ? 'এই ড্যাশবোর্ডটি শুধু Lumiqra AI এর মালিক (Md. Jakir Hossain)-এর ব্যবহারের জন্য সুরক্ষিত।' 
              : 'This private dashboard is restricted to the Lumiqra AI owner.'}
          </p>
        </div>

        {currentUser?.email ? (
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-300">
            {lang === 'bn' ? 'লগইন আছেন:' : 'Logged in as:'} <span className="font-semibold text-blue-400">{currentUser.email}</span>
          </div>
        ) : (
          <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs text-slate-400">
            {lang === 'bn' 
              ? 'আপনার মালিকানা জিমেইল দিয়ে লগইন করলে অটোমেটিক আনলক হবে।' 
              : 'Login with your owner email to automatically unlock.'}
            <button
              onClick={onOpenAuth}
              className="block mx-auto mt-2 text-blue-400 hover:underline font-semibold"
            >
              {lang === 'bn' ? 'এখানে ক্লিক করে লগইন করুন' : 'Click here to sign in'}
            </button>
          </div>
        )}

        <form onSubmit={handleUnlockWithPin} className="space-y-4 pt-2">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 text-left">
              {lang === 'bn' ? 'সিক্রেট অ্যাডমিন পিন (Master PIN):' : 'Enter Secret Admin PIN:'}
            </label>
            <input
              type="password"
              value={adminPin}
              onChange={(e) => {
                setAdminPin(e.target.value);
                setPinError(false);
              }}
              placeholder={lang === 'bn' ? 'পিন লিখুন (যেমন: 1012)' : 'Enter PIN (e.g. 1012)'}
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-widest text-lg font-mono"
            />
            {pinError && (
              <p className="text-rose-400 text-xs mt-1.5">
                {lang === 'bn' ? 'ভুল পিন কোড! সঠিক পিন লিখুন।' : 'Incorrect PIN! Try again.'}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-semibold text-sm shadow-lg shadow-indigo-500/20 transition transform active:scale-95"
          >
            {lang === 'bn' ? 'ড্যাশবোর্ডে প্রবেশ করুন' : 'Unlock Admin Dashboard'}
          </button>
        </form>

        <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-500">
          {lang === 'bn' ? 'টিপস: পিন কোড: 1012' : 'Quick PIN: 1012'}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Top Banner Header */}
      <div className="glass-card p-6 sm:p-8 rounded-3xl border border-indigo-500/30 bg-gradient-to-br from-indigo-950/40 via-slate-900/80 to-slate-950 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20"></div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold mb-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>{lang === 'bn' ? 'লাইভ লাইফটাইম ট্র্যাকিং' : 'Live Real-time Analytics'}</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{lang === 'bn' ? 'লুমিক্রা এআই লাইভ অ্যাডমিন প্যানেল' : 'Lumiqra AI Master Analytics'}</span>
              <ShieldCheck className="w-6 h-6 text-blue-400" />
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 max-w-xl">
              {lang === 'bn' 
                ? 'আপনার ওয়েবসাইটে কতজন ভিজিটর ঢুকছে এবং কে কোন ফিচার কতবার ব্যবহার করেছে তার লাইভ হিসাব।'
                : 'Monitor total visitors, voice generations, image generations, and live activity in real time.'}
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-center">
            <button
              onClick={() => setStats(loadAnalytics())}
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-medium"
              title="Refresh Stats"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleResetData}
              className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition flex items-center gap-1.5 text-xs font-medium"
              title="Reset Stats"
            >
              <Trash2 className="w-4 h-4" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'রিসেট' : 'Reset'}</span>
            </button>
          </div>
        </div>

        {/* Sub-tab selection */}
        <div className="flex items-center gap-2 mt-6 pt-4 border-t border-slate-800/80">
          <button
            onClick={() => setActiveSubTab('overview')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {lang === 'bn' ? 'সারসংক্ষেপ (Overview)' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
              activeSubTab === 'logs'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'bn' ? 'লাইভ অ্যাক্টিভিটি লগ' : 'Live Activity Logs'}</span>
            <span className="px-1.5 py-0.5 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {stats.recentLogs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('breakdown')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition ${
              activeSubTab === 'breakdown'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {lang === 'bn' ? 'জনপ্রিয় ফিচার ও স্টাইল' : 'Popular Features'}
          </button>
        </div>
      </div>

      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Main 6 Metric Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4">
            {/* Card 1: Total Visits */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-blue-500/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'মোট সাইট ভিজিট' : 'Total Visits'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:scale-110 transition">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stats.totalVisits.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
                <TrendingUp className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? `আজকের ভিজিট: +${todayStat.visits}` : `Today: +${todayStat.visits}`}</span>
              </div>
            </div>

            {/* Card 2: Unique Visitors */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-purple-500/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'ইউনিক ভিজিটর' : 'Unique Users'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 group-hover:scale-110 transition">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stats.totalUniqueVisitors.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-purple-400">
                <Globe className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? `আজ নতুন ইউজার: +${todayStat.uniqueVisitors}` : `Today New: +${todayStat.uniqueVisitors}`}</span>
              </div>
            </div>

            {/* Card 3: Voices Generated */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-pink-500/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'ভয়েস তৈরি করা হয়েছে' : 'Voices Generated'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-pink-500/10 border border-pink-500/20 flex items-center justify-center text-pink-400 group-hover:scale-110 transition">
                  <Mic className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stats.totalVoicesGenerated.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-pink-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? `আজ ভয়েস তৈরি: +${todayStat.voicesGenerated}` : `Today: +${todayStat.voicesGenerated}`}</span>
              </div>
            </div>

            {/* Card 4: Images Generated */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-amber-500/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'ছবি তৈরি করা হয়েছে' : 'Images Generated'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:scale-110 transition">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stats.totalImagesGenerated.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-amber-400">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? `আজ ছবি তৈরি: +${todayStat.imagesGenerated}` : `Today: +${todayStat.imagesGenerated}`}</span>
              </div>
            </div>

            {/* Card 5: Background Removed */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-emerald-500/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'ব্যাকগ্রাউন্ড রিমুভ' : 'BG Removals'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition">
                  <Eraser className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stats.totalBgRemoved.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-emerald-400">
                <Zap className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? `আজ রিমুভ: +${todayStat.bgRemoved}` : `Today: +${todayStat.bgRemoved}`}</span>
              </div>
            </div>

            {/* Card 6: AI Chat Q&A */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800/80 bg-slate-900/60 hover:border-cyan-500/40 transition group">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs text-slate-400 font-medium">
                  {lang === 'bn' ? 'এআই চ্যাট বার্তা' : 'AI Chat Queries'}
                </span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition">
                  <MessageSquare className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {stats.totalChatMessages.toLocaleString()}
              </div>
              <div className="flex items-center gap-1.5 mt-2 text-[11px] text-cyan-400">
                <Activity className="w-3.5 h-3.5" />
                <span>{lang === 'bn' ? `আজকের চ্যাট: +${todayStat.chatMessages}` : `Today: +${todayStat.chatMessages}`}</span>
              </div>
            </div>
          </div>

          {/* Today's Special Summary Widget */}
          <div className="glass-card p-5 sm:p-6 rounded-2xl border border-slate-800 bg-slate-900/40">
            <h3 className="text-sm font-semibold text-white mb-4 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-indigo-400" />
              <span>{lang === 'bn' ? 'আজকের দিনের বিশেষ পরিসংখ্যান' : "Today's Activity Summary"}</span>
              <span className="text-xs font-normal text-slate-400">({todayKey})</span>
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'আজকের ভিজিট' : 'Visits Today'}</div>
                <div className="text-xl font-bold text-blue-400">{todayStat.visits}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'আজকের ভয়েস' : 'Voices Today'}</div>
                <div className="text-xl font-bold text-pink-400">{todayStat.voicesGenerated}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'আজকের ছবি' : 'Images Today'}</div>
                <div className="text-xl font-bold text-amber-400">{todayStat.imagesGenerated}</div>
              </div>
              <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80">
                <div className="text-xs text-slate-400 mb-1">{lang === 'bn' ? 'আজকের চ্যাট ও বিজি' : 'Chat & BG Today'}</div>
                <div className="text-xl font-bold text-emerald-400">{todayStat.bgRemoved + todayStat.chatMessages}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'logs' && (
        <div className="glass-card rounded-2xl border border-slate-800 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400" />
              <span>{lang === 'bn' ? 'লাইভ কার্যক্রম লগ (সর্বশেষ ৫০টি কাজ)' : 'Live User Activity Feed (Recent 50)'}</span>
            </h3>
            <span className="text-[11px] text-slate-400">
              {lang === 'bn' ? 'প্রতি সেকেন্ডে আপডেট হয়' : 'Auto-updates'}
            </span>
          </div>

          {stats.recentLogs.length === 0 ? (
            <div className="text-center py-10 text-slate-500 text-xs">
              {lang === 'bn' ? 'এখনও কোনো অ্যাক্টিভিটি রেকর্ড হয়নি।' : 'No activity logged yet.'}
            </div>
          ) : (
            <div className="space-y-2 max-h-[420px] overflow-y-auto pr-1">
              {stats.recentLogs.map((log) => {
                const timeString = new Date(log.timestamp).toLocaleTimeString();
                const dateString = new Date(log.timestamp).toLocaleDateString();

                let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                let IconComp = Eye;

                if (log.type === 'voice') {
                  badgeColor = 'bg-pink-500/10 text-pink-400 border-pink-500/20';
                  IconComp = Mic;
                } else if (log.type === 'image') {
                  badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';
                  IconComp = ImageIcon;
                } else if (log.type === 'bg-remover') {
                  badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                  IconComp = Eraser;
                } else if (log.type === 'chat') {
                  badgeColor = 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20';
                  IconComp = MessageSquare;
                }

                return (
                  <div
                    key={log.id}
                    className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 flex items-start justify-between gap-3 text-xs hover:border-slate-700 transition"
                  >
                    <div className="flex items-start gap-2.5">
                      <div className={`p-1.5 rounded-lg border ${badgeColor} mt-0.5`}>
                        <IconComp className="w-3.5 h-3.5" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-200">
                          {lang === 'bn' ? log.descriptionBn : log.descriptionEn}
                        </div>
                        {log.details && (
                          <div className="text-slate-400 text-[11px] mt-0.5 font-mono line-clamp-1">
                            {log.details}
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="text-[10px] text-slate-500 whitespace-nowrap text-right">
                      <div>{timeString}</div>
                      <div>{dateString}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Voices */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-pink-400" />
              <span>{lang === 'bn' ? 'সর্বোচ্চ ব্যবহৃত ভয়েস' : 'Most Popular Voices'}</span>
            </h4>
            {Object.keys(stats.topVoices).length === 0 ? (
              <p className="text-xs text-slate-500">{lang === 'bn' ? 'কোনো ভয়েস ডেটা নেই' : 'No voice data yet'}</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(stats.topVoices)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([name, count]) => (
                    <div key={name} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-slate-300 font-medium truncate max-w-[200px]">{name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-pink-500/10 text-pink-400 font-semibold border border-pink-500/20">
                        {count} {lang === 'bn' ? 'বার' : 'times'}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Top Image Styles */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 space-y-3">
            <h4 className="text-sm font-semibold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-amber-400" />
              <span>{lang === 'bn' ? 'পছন্দের ছবির স্টাইল' : 'Popular Image Styles'}</span>
            </h4>
            {Object.keys(stats.topStyles).length === 0 ? (
              <p className="text-xs text-slate-500">{lang === 'bn' ? 'কোনো স্টাইল ডেটা নেই' : 'No style data yet'}</p>
            ) : (
              <div className="space-y-2">
                {Object.entries(stats.topStyles)
                  .sort((a, b) => b[1] - a[1])
                  .slice(0, 5)
                  .map(([style, count]) => (
                    <div key={style} className="flex items-center justify-between p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs">
                      <span className="text-slate-300 font-medium capitalize">{style}</span>
                      <span className="px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-400 font-semibold border border-amber-500/20">
                        {count} {lang === 'bn' ? 'বার' : 'times'}
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Developer / Owner Signoff */}
      <div className="glass-card p-4 rounded-xl border border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-2">
          <Award className="w-4 h-4 text-amber-400" />
          <span>{lang === 'bn' ? 'মালিকানা যাচাইকৃত:' : 'Verified Owner:'} <strong className="text-white">Md. Jakir Hossain</strong></span>
        </div>
        <div className="text-[11px] text-slate-500">
          Lumiqra AI Analytics v2.0
        </div>
      </div>
    </div>
  );
};
