import React, { useState, useEffect } from 'react';
import { Cookie, X, Check } from 'lucide-react';
import { Language } from '../types';

interface CookieBannerProps {
  lang: Language;
  onOpenPrivacy: () => void;
}

const COOKIE_ACCEPTED_KEY = 'lumiqra_cookies_accepted_v1';

export const CookieBanner: React.FC<CookieBannerProps> = ({ lang, onOpenPrivacy }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const accepted = localStorage.getItem(COOKIE_ACCEPTED_KEY);
    if (!accepted) {
      const timer = setTimeout(() => setIsVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem(COOKIE_ACCEPTED_KEY, 'true');
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-6 sm:max-w-md z-40 animate-fade-in">
      <div className="bg-slate-900/95 border border-slate-700/80 backdrop-blur-xl p-4 rounded-2xl shadow-2xl space-y-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center shrink-0 border border-amber-500/30">
              <Cookie className="w-4 h-4" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-white">
                {lang === 'bn' ? 'কুকিজ ও গোপনীয়তা বিজ্ঞপ্তি' : 'Cookie & Privacy Notice'}
              </h4>
              <p className="text-[11px] text-slate-400 leading-relaxed mt-0.5">
                {lang === 'bn'
                  ? 'আমরা আপনার ব্রাউজিং অভিজ্ঞতা উন্নত করতে এবং প্রাসঙ্গিক বিজ্ঞাপন প্রদানে কুকিজ ব্যবহার করি।'
                  : 'We use cookies and local storage to optimize user experience and serve relevant ads in accordance with Google publisher policies.'}
              </p>
            </div>
          </div>
          <button
            onClick={handleAccept}
            className="text-slate-500 hover:text-slate-300 p-1"
            title="Dismiss"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            onClick={onOpenPrivacy}
            className="text-[11px] text-indigo-400 hover:text-indigo-300 font-medium px-2 py-1 rounded-lg hover:bg-slate-800 transition"
          >
            {lang === 'bn' ? 'নীতিমালা দেখুন' : 'Privacy Policy'}
          </button>
          <button
            onClick={handleAccept}
            className="flex items-center gap-1 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold px-3 py-1.5 rounded-xl transition shadow-md shadow-indigo-600/30 cursor-pointer"
          >
            <Check className="w-3.5 h-3.5" />
            <span>{lang === 'bn' ? 'সম্মত আছি' : 'Accept All'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
