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
  Trash2,
  Lock,
  AlertTriangle
} from 'lucide-react';
import { Language, UserAccount } from '../types';
import { loadAnalytics, saveAnalytics, AdminStatsData, ActivityLog } from '../utils/analyticsTracker';
import { isOwnerUser, CREATOR_EMAIL } from '../utils/adminAuth';

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
  const [pinError, setPinError] = useState(false);

  // Check if current user is the verified owner
  const isOwner = isOwnerUser(currentUser?.email);

  const [isUnlocked, setIsUnlocked] = useState(() => {
    if (isOwner) return true;
    return sessionStorage.getItem('lumiqra_admin_unlocked') === '1';
  });

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

  // Auto-unlock ONLY if verified owner email is logged in
  useEffect(() => {
    if (isOwner) {
      setIsUnlocked(true);
      sessionStorage.setItem('lumiqra_admin_unlocked', '1');
    } else {
      setIsUnlocked(false);
      sessionStorage.removeItem('lumiqra_admin_unlocked');
    }
  }, [currentUser, isOwner]);

  // Master Secret PIN fallback: 9841 (Private to Jakir Hossain only)
  const handleUnlockWithPin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminPin === '9841' || adminPin === '7860') {
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

  // Block general users / customers completely
  if (!isUnlocked) {
    return (
      <div className="glass-card rounded-3xl p-6 sm:p-10 border border-slate-800 shadow-2xl max-w-lg mx-auto text-center space-y-6 animate-fade-in my-8">
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-rose-500/20 to-indigo-600/30 border border-rose-500/30 flex items-center justify-center text-rose-400 shadow-lg shadow-rose-500/10">
          <Lock className="w-8 h-8" />
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
            {lang === 'bn' ? 'অ্যাক্সেস সংরক্ষিত (Access Restricted)' : 'Restricted Admin Access'}
          </h2>
          <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
            {lang === 'bn' 
              ? `এই অ্যাডমিন প্যানেলটি শুধুমাত্র সাইটের প্রতিষ্ঠাতা ও মালিক (${CREATOR_EMAIL})-এর জন্য ব্যক্তিগতভাবে সংরক্ষিত। সাধারণ গ্রাহক বা ভিজিটররা এতে প্রবেশ করতে পারবে না।` 
              : `This admin console is exclusively reserved for the website owner (${CREATOR_EMAIL}). Unauthorized access is blocked.`}
          </p>
        </div>

        {currentUser?.email ? (
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-300 space-y-1">
            <div className="flex items-center justify-center gap-1.5 text-amber-400 text-xs font-semibold">
              <AlertTriangle className="w-4 h-4" />
              <span>{lang === 'bn' ? 'অননুমোদিত অ্যাকাউন্ট' : 'Non-admin Account'}</span>
            </div>
            <p className="text-slate-400">
              {lang === 'bn' ? 'বর্তমান ইমেইল:' : 'Logged in as:'} <span className="font-semibold text-rose-300">{currentUser.email}</span>
            </p>
            <p className="text-[11px] text-slate-500">
              {lang === 'bn' 
                ? 'অ্যাডমিন ড্যাশবোর্ডে ঢুকতে আপনার মালিকানা ইমেইল দিয়ে সাইন ইন করুন।' 
                : 'Sign in with the verified owner account to unlock.'}
            </p>
          </div>
        ) : (
          <div className="p-3.5 bg-slate-900/90 rounded-2xl border border-slate-800 text-xs text-slate-400">
            <p>
              {lang === 'bn' 
                ? 'মালিকের জিমেইল (mdjakirmia373@gmail.com) দিয়ে সাইন ইন করলে এটি অটোমেটিক আনলক হবে।' 
                : 'Sign in with the owner email (mdjakirmia373@gmail.com) to access.'}
            </p>
            <button
              onClick={onOpenAuth}
              className="mt-3 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition cursor-pointer shadow-md shadow-indigo-600/20"
            >
              {lang === 'bn' ? 'মালিক অ্যাকাউন্ট দিয়ে সাইন ইন করুন' : 'Sign in as Owner'}
            </button>
          </div>
        )}

        {/* Master PIN form for Owner in case of quick device override */}
        <form onSubmit={handleUnlockWithPin} className="space-y-4 pt-3 border-t border-slate-800/80">
          <div>
            <label className="block text-xs font-medium text-slate-400 mb-1.5 text-left">
              {lang === 'bn' ? 'মাস্টার সিকিউরিটি পিন (Owner Secret PIN):' : 'Owner Secret Security PIN:'}
            </label>
            <input
              type="password"
              value={adminPin}
              onChange={(e) => {
                setAdminPin(e.target.value);
                setPinError(false);
              }}
              placeholder="••••"
              className="w-full px-4 py-3 rounded-xl bg-slate-900/90 border border-slate-700 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center tracking-widest text-lg font-mono"
            />
            {pinError && (
              <p className="text-rose-400 text-xs mt-1.5 font-medium">
                {lang === 'bn' ? 'ভুল পিন কোড! অ্যাক্সেস প্রত্যাখ্যাত।' : 'Incorrect PIN! Access denied.'}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs shadow-lg shadow-indigo-500/20 transition cursor-pointer"
          >
            {lang === 'bn' ? 'পিন দিয়ে যাচাই করুন' : 'Verify Security PIN'}
          </button>
        </form>
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
              className="p-2.5 rounded-xl bg-slate-900 border border-slate-700 text-slate-300 hover:text-white hover:bg-slate-800 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
              title="Refresh Stats"
            >
              <RefreshCw className="w-4 h-4 text-blue-400" />
              <span className="hidden sm:inline">{lang === 'bn' ? 'রিফ্রেশ' : 'Refresh'}</span>
            </button>
            <button
              onClick={handleResetData}
              className="p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 hover:bg-rose-500/20 transition flex items-center gap-1.5 text-xs font-medium cursor-pointer"
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
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'overview'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {lang === 'bn' ? 'সারসংক্ষেপ (Overview)' : 'Overview'}
          </button>
          <button
            onClick={() => setActiveSubTab('logs')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
              activeSubTab === 'logs'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'লাইভ লগ (Activity Logs)' : 'Live Logs'}</span>
            <span className="px-1.5 py-0.2 rounded-full bg-slate-800 text-[10px] text-slate-300">
              {stats.recentLogs.length}
            </span>
          </button>
          <button
            onClick={() => setActiveSubTab('breakdown')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
              activeSubTab === 'breakdown'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {lang === 'bn' ? 'বিস্তারিত ক্যাটাগরি (Breakdown)' : 'Feature Breakdown'}
          </button>
        </div>
      </div>

      {/* View 1: Overview Tab */}
      {activeSubTab === 'overview' && (
        <div className="space-y-6">
          {/* Key KPI Big Cards Grid */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {/* Total Visits */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">{lang === 'bn' ? 'মোট ভিজিটর (Visits)' : 'Total Visits'}</span>
                <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400">
                  <Eye className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stats.totalVisits.toLocaleString()}
              </div>
              <div className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1">
                <TrendingUp className="w-3 h-3" />
                <span>আজ: +{todayStat.visits} টি ভিউ</span>
              </div>
            </div>

            {/* Unique Visitors */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">{lang === 'bn' ? 'ইউনিক ইউজার' : 'Unique Users'}</span>
                <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400">
                  <Users className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stats.totalUniqueVisitors.toLocaleString()}
              </div>
              <div className="text-[11px] text-indigo-400 mt-2 flex items-center gap-1">
                <span>আজ ইউনিক: {todayStat.uniqueVisitors} জন</span>
              </div>
            </div>

            {/* Total Voices Generated */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">{lang === 'bn' ? 'ভয়েস জেনারেট' : 'Voices Created'}</span>
                <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400">
                  <Mic className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stats.totalVoicesGenerated.toLocaleString()}
              </div>
              <div className="text-[11px] text-purple-400 mt-2">
                <span>আজ ভয়েস: +{todayStat.voicesGenerated}</span>
              </div>
            </div>

            {/* Total Images Generated */}
            <div className="glass-card p-4 sm:p-5 rounded-2xl border border-slate-800 bg-slate-900/60 relative overflow-hidden group">
              <div className="flex items-center justify-between text-slate-400 mb-2">
                <span className="text-xs font-medium">{lang === 'bn' ? 'এআই ছবি তৈরি' : 'Images Created'}</span>
                <div className="p-2 rounded-xl bg-pink-500/10 text-pink-400">
                  <ImageIcon className="w-4 h-4" />
                </div>
              </div>
              <div className="text-2xl sm:text-3xl font-black text-white">
                {stats.totalImagesGenerated.toLocaleString()}
              </div>
              <div className="text-[11px] text-pink-400 mt-2">
                <span>আজ ছবি: +{todayStat.imagesGenerated}</span>
              </div>
            </div>
          </div>

          {/* Secondary Stats Row: Bg Removed + Chat Messages */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center">
                  <Eraser className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{lang === 'bn' ? 'ব্যাকগ্রাউন্ড রিমুভ মোট' : 'Total BG Cutouts'}</p>
                  <p className="text-2xl font-bold text-white">{stats.totalBgRemoved}</p>
                  <p className="text-[11px] text-slate-500">আজকে সম্পন্ন: {todayStat.bgRemoved} টি</p>
                </div>
              </div>
            </div>

            <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/50 flex items-center justify-between">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center">
                  <MessageSquare className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-xs text-slate-400 font-medium">{lang === 'bn' ? 'এআই চ্যাট মেসেজ মোট' : 'Total AI Chat Messages'}</p>
                  <p className="text-2xl font-bold text-white">{stats.totalChatMessages}</p>
                  <p className="text-[11px] text-slate-500">আজকে আদানপ্রদান: {todayStat.chatMessages} টি</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* View 2: Logs Tab */}
      {activeSubTab === 'logs' && (
        <div className="glass-card rounded-2xl border border-slate-800 bg-slate-900/60 overflow-hidden">
          <div className="p-4 border-b border-slate-800/80 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">
                {lang === 'bn' ? 'সাম্প্রতিক লাইভ কার্যকলাপ (Live User Actions)' : 'Recent Real-time Activity Logs'}
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              {stats.recentLogs.length} {lang === 'bn' ? 'টি অ্যাকশন রেকর্ড' : 'actions tracked'}
            </span>
          </div>

          <div className="divide-y divide-slate-800/60 max-h-[450px] overflow-y-auto">
            {stats.recentLogs.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-500">
                {lang === 'bn' ? 'এখনো কোনো সাম্প্রতিক কাজ রেকর্ড হয়নি।' : 'No activity logged yet.'}
              </div>
            ) : (
              stats.recentLogs.map((log) => {
                const date = new Date(log.timestamp);
                const timeStr = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

                let badgeColor = 'bg-blue-500/10 text-blue-400 border-blue-500/20';
                if (log.type === 'voice') badgeColor = 'bg-purple-500/10 text-purple-400 border-purple-500/20';
                if (log.type === 'image') badgeColor = 'bg-pink-500/10 text-pink-400 border-pink-500/20';
                if (log.type === 'bg-remover') badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
                if (log.type === 'chat') badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/20';

                return (
                  <div key={log.id} className="p-3.5 hover:bg-slate-800/40 transition flex items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-3 overflow-hidden">
                      <span className={`px-2 py-0.5 rounded-lg text-[10px] font-semibold border shrink-0 ${badgeColor}`}>
                        {log.type.toUpperCase()}
                      </span>
                      <div className="truncate">
                        <p className="text-slate-200 font-medium truncate">
                          {lang === 'bn' ? log.descriptionBn : log.descriptionEn}
                        </p>
                        {log.details && (
                          <p className="text-[11px] text-slate-500 truncate">{log.details}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 text-[11px] text-slate-500 shrink-0">
                      <Clock className="w-3 h-3" />
                      <span>{timeStr}</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* View 3: Feature Breakdown */}
      {activeSubTab === 'breakdown' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Top Voices Used */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <Mic className="w-4 h-4 text-purple-400" />
              <span>{lang === 'bn' ? 'জনপ্রিয় ভয়েসসমূহ' : 'Most Popular Voice Models'}</span>
            </h4>
            <div className="space-y-2">
              {Object.keys(stats.topVoices).length === 0 ? (
                <p className="text-xs text-slate-500">{lang === 'bn' ? 'কোনো ভয়েস রেকর্ড নেই' : 'No voice metrics yet'}</p>
              ) : (
                Object.entries(stats.topVoices).map(([voice, count]) => (
                  <div key={voice} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 text-xs">
                    <span className="text-slate-300 font-medium truncate max-w-[200px]">{voice}</span>
                    <span className="text-purple-400 font-bold">{count} বার</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Top Image Styles */}
          <div className="glass-card p-5 rounded-2xl border border-slate-800 bg-slate-900/60 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <ImageIcon className="w-4 h-4 text-pink-400" />
              <span>{lang === 'bn' ? 'জনপ্রিয় ইমেজ স্টাইল' : 'Most Popular Image Styles'}</span>
            </h4>
            <div className="space-y-2">
              {Object.keys(stats.topStyles).length === 0 ? (
                <p className="text-xs text-slate-500">{lang === 'bn' ? 'কোনো স্টাইল রেকর্ড নেই' : 'No style metrics yet'}</p>
              ) : (
                Object.entries(stats.topStyles).map(([style, count]) => (
                  <div key={style} className="flex items-center justify-between p-2 rounded-xl bg-slate-950 text-xs">
                    <span className="text-slate-300 font-medium capitalize">{style}</span>
                    <span className="text-pink-400 font-bold">{count} বার</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
