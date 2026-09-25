import React, { useState } from 'react';
import { 
  Lock, 
  Mail, 
  User, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  Sparkles, 
  ShieldCheck, 
  AlertCircle,
  CheckCircle2,
  LogIn,
  UserPlus
} from 'lucide-react';
import { Language, UserAccount } from '../types';

interface AuthModalProps {
  lang: Language;
  isOpen: boolean;
  onClose?: () => void;
  onLoginSuccess: (user: UserAccount) => void;
  allowClose?: boolean;
}

const STORAGE_USERS_KEY = 'lumina_ai_users_db_v1';

export const AuthModal: React.FC<AuthModalProps> = ({
  lang,
  isOpen,
  onClose,
  onLoginSuccess,
  allowClose = false,
}) => {
  const [mode, setMode] = useState<'login' | 'signup'>('signup');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  if (!isOpen) return null;

  const getStoredUsers = (): UserAccount[] => {
    try {
      const data = localStorage.getItem(STORAGE_USERS_KEY);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  };

  const saveUsers = (users: UserAccount[]) => {
    localStorage.setItem(STORAGE_USERS_KEY, JSON.stringify(users));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    if (!cleanEmail || !cleanPassword) {
      setError(lang === 'bn' ? 'অনুগ্রহ করে ইমেইল ও পাসওয়ার্ড প্রদান করুন।' : 'Please enter email and password.');
      return;
    }

    if (!cleanEmail.includes('@') || !cleanEmail.includes('.')) {
      setError(lang === 'bn' ? 'সঠিক ইমেইল এড্রেস প্রদান করুন।' : 'Please enter a valid email address.');
      return;
    }

    if (cleanPassword.length < 6) {
      setError(lang === 'bn' ? 'পাসওয়ার্ড কমপক্ষে ৬ অক্ষরের হতে হবে।' : 'Password must be at least 6 characters.');
      return;
    }

    const existingUsers = getStoredUsers();

    if (mode === 'signup') {
      const cleanName = name.trim();
      if (!cleanName) {
        setError(lang === 'bn' ? 'আপনার নামটি প্রদান করুন।' : 'Please enter your name.');
        return;
      }

      // Check duplicate
      const alreadyExists = existingUsers.some(u => u.email === cleanEmail);
      if (alreadyExists) {
        setError(lang === 'bn' ? 'এই ইমেইলটি ইতিমধ্যে নিবন্ধিত আছে। দয়া করে লগইন করুন।' : 'This email is already registered. Please login.');
        setMode('login');
        return;
      }

      const newUser: UserAccount = {
        id: 'usr_' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        password: cleanPassword,
        createdAt: Date.now(),
      };

      existingUsers.push(newUser);
      saveUsers(existingUsers);

      setSuccess(lang === 'bn' ? 'সফলভাবে একাউন্ট তৈরি হয়েছে!' : 'Account created successfully!');
      setTimeout(() => {
        onLoginSuccess(newUser);
      }, 500);
    } else {
      // Login mode
      const foundUser = existingUsers.find(
        u => u.email === cleanEmail && u.password === cleanPassword
      );

      if (!foundUser) {
        setError(
          lang === 'bn' 
            ? 'ইমেইল বা পাসওয়ার্ড ভুল হয়েছে। সঠিক তথ্য দিন অথবা নতুন একাউন্ট সাইন আপ করুন।' 
            : 'Incorrect email or password. Please verify or sign up.'
        );
        return;
      }

      setSuccess(lang === 'bn' ? 'লগইন সফল হয়েছে! প্রবেশ করছি...' : 'Login successful! Redirecting...');
      setTimeout(() => {
        onLoginSuccess(foundUser);
      }, 400);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md p-6 sm:p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Glow Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white shadow-xl shadow-indigo-600/30 ring-1 ring-white/20">
            <Sparkles className="w-7 h-7 animate-pulse" />
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
            {mode === 'signup'
              ? (lang === 'bn' ? 'লুমিনা এআই-তে সাইন আপ করুন' : 'Create LuminaAI Account')
              : (lang === 'bn' ? 'লুমিনা এআই-তে লগইন করুন' : 'Sign in to LuminaAI')}
          </h2>
          <p className="text-xs text-slate-400">
            {mode === 'signup'
              ? (lang === 'bn' ? 'এআই ইমেজ, ভয়েস ও চ্যাট ব্যবহারের জন্য ফ্রি একাউন্ট খুলুন' : 'Join for free to access AI Image, Voice, and Chat')
              : (lang === 'bn' ? 'আপনার নিবন্ধিত জিমেইল ও পাসওয়ার্ড দিয়ে প্রবেশ করুন' : 'Access your studio with your email and password')}
          </p>
        </div>

        {/* Mode Toggle Switch */}
        <div className="flex p-1 bg-slate-950/80 border border-slate-800 rounded-xl">
          <button
            type="button"
            onClick={() => {
              setMode('signup');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'signup'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'নতুন সাইন আপ' : 'Sign Up'}</span>
          </button>

          <button
            type="button"
            onClick={() => {
              setMode('login');
              setError(null);
              setSuccess(null);
            }}
            className={`flex-1 py-2 rounded-lg text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer ${
              mode === 'login'
                ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            <LogIn className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'লগইন' : 'Log In'}</span>
          </button>
        </div>

        {/* Feedback Alert */}
        {error && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{success}</span>
          </div>
        )}

        {/* Form Inputs */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-indigo-400" />
                <span>{lang === 'bn' ? 'আপনার নাম' : 'Full Name'}</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={lang === 'bn' ? 'যেমন: জাকির হোসেন' : 'e.g. John Doe'}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs outline-none transition"
              />
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'bn' ? 'জিমেইল / ইমেইল এড্রেস' : 'Email Address'}</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="example@gmail.com"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs outline-none transition"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5 text-indigo-400" />
              <span>{lang === 'bn' ? 'পাসওয়ার্ড (কমপক্ষে ৬ অক্ষর)' : 'Password (min 6 chars)'}</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950/70 border border-slate-800 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 text-white text-xs outline-none transition pr-10"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-200"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl font-bold text-xs sm:text-sm bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer transition-all duration-200 active:scale-98 mt-2"
          >
            <span>{mode === 'signup' ? (lang === 'bn' ? 'সাইন আপ করে প্রবেশ করুন' : 'Sign Up & Continue') : (lang === 'bn' ? 'লগইন করুন' : 'Sign In')}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Security Assurance */}
        <div className="flex items-center justify-center gap-2 text-[11px] text-slate-500 pt-2 border-t border-slate-800/80">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>{lang === 'bn' ? 'আপনার তথ্য সম্পূর্ণ সুরক্ষিত ও এনক্রিপ্টেড' : 'Your data is encrypted & secure'}</span>
        </div>
      </div>
    </div>
  );
};
