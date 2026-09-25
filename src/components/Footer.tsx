import React from 'react';
import { Sparkles, Shield, Heart, Zap } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-10 mt-12 text-slate-400 text-xs">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & info */}
        <div className="flex flex-col items-center md:items-start space-y-2 text-center md:text-left">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-extrabold text-white">LuminaAI Studio</span>
          </div>
          <p className="text-slate-500 max-w-sm text-[11px]">
            {lang === 'bn'
              ? 'LuminaAI - বাংলা ও ইংরেজির জন্য ১০০% ফ্রি এআই ইমেজ জেনারেটর ও ভয়েস স্টুডিও। কোনো সাবস্ক্রিপশন ফি বা সাইন-আপ ছাড়াই যেকোনো সময় তৈরি করুন।'
              : 'LuminaAI - 100% Free AI Image & Voice Studio for creators. Generate unlimited high-resolution artwork and realistic voiceovers instantly.'}
          </p>
        </div>

        {/* Feature badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>{lang === 'bn' ? 'আনলিমিটেড ফ্রি জেনারেশন' : 'Unlimited Free Access'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>{lang === 'bn' ? 'কোনো ওয়াটারমার্ক নেই' : 'No Watermark'}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 text-pink-400" />
            <span>{lang === 'bn' ? 'বাংলা ও বহুভাষী সাপোর্ট' : 'Bangla & Multi-lingual'}</span>
          </div>
        </div>

        {/* Copyright & Disclaimer */}
        <div className="text-center md:text-right text-[11px] text-slate-500 space-y-1">
          <p>© {new Date().getFullYear()} AI Content Studio. All rights reserved.</p>
          <p className="text-slate-600">
            Powered by modern neural networks & Web Speech Synthesis.
          </p>
        </div>
      </div>
    </footer>
  );
};
