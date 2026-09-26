import React from 'react';
import { Sparkles, Shield, Heart, Zap, FileText, Info, Mail, AlertTriangle } from 'lucide-react';
import { Language } from '../types';
import { PolicyTab } from './PolicyModal';
import { LumiqraLogo } from './LumiqraLogo';

interface FooterProps {
  lang: Language;
  onOpenPolicy: (tab: PolicyTab) => void;
}

export const Footer: React.FC<FooterProps> = ({ lang, onOpenPolicy }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 space-y-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Brand & info with official Lumiqra Logo */}
          <div className="flex flex-col items-center md:items-start space-y-2.5 text-center md:text-left">
            <LumiqraLogo size="sm" />
            <p className="text-slate-400 max-w-sm text-[12px] leading-relaxed">
              {lang === 'bn'
                ? 'Lumiqra AI (লুমিক্রা এআই) — বাংলা ও ইংরেজির জন্য ১০০% ফ্রি এআই ইমেজ জেনারেটর, ভয়েসওভার ও স্মার্ট চ্যাট সহকারী।'
                : 'Lumiqra AI — 100% Free AI Image, Voice & Universal Chat Assistant for creators worldwide.'}
            </p>
          </div>

          {/* Feature badges */}
          <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
            <div className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-amber-400" />
              <span>{lang === 'bn' ? 'আনলিমিটেড ফ্রি' : 'Unlimited Free'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Shield className="w-3.5 h-3.5 text-emerald-400" />
              <span>{lang === 'bn' ? 'ওয়াটারমার্ক মুক্ত' : 'No Watermark'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Heart className="w-3.5 h-3.5 text-pink-400" />
              <span>{lang === 'bn' ? 'বাংলা ও বহুভাষী' : 'Bangla & Multi-lingual'}</span>
            </div>
          </div>
        </div>

        {/* Mandatory Policy & Navigation Links for Google AdSense Compliance */}
        <div className="border-t border-slate-800/60 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-[11px] font-medium text-slate-400">
            <button
              onClick={() => onOpenPolicy('privacy')}
              className="hover:text-indigo-400 transition cursor-pointer flex items-center gap-1"
            >
              <Shield className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'bn' ? 'গোপনীয়তা নীতি (Privacy)' : 'Privacy Policy'}</span>
            </button>

            <button
              onClick={() => onOpenPolicy('terms')}
              className="hover:text-indigo-400 transition cursor-pointer flex items-center gap-1"
            >
              <FileText className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'bn' ? 'ব্যবহারের শর্তাবলী (Terms)' : 'Terms of Service'}</span>
            </button>

            <button
              onClick={() => onOpenPolicy('about')}
              className="hover:text-indigo-400 transition cursor-pointer flex items-center gap-1"
            >
              <Info className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'bn' ? 'আমাদের সম্পর্কে (About Us)' : 'About Us'}</span>
            </button>

            <button
              onClick={() => onOpenPolicy('contact')}
              className="hover:text-indigo-400 transition cursor-pointer flex items-center gap-1"
            >
              <Mail className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'bn' ? 'যোগাযোগ (Contact)' : 'Contact Us'}</span>
            </button>

            <button
              onClick={() => onOpenPolicy('disclaimer')}
              className="hover:text-indigo-400 transition cursor-pointer flex items-center gap-1"
            >
              <AlertTriangle className="w-3 h-3 text-indigo-400" />
              <span>{lang === 'bn' ? 'ডিসক্লেইমার (Disclaimer)' : 'Disclaimer'}</span>
            </button>
          </div>

          <div className="text-center sm:text-right text-[11px] text-slate-500">
            <p>© {new Date().getFullYear()} Lumiqra AI. All rights reserved.</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
