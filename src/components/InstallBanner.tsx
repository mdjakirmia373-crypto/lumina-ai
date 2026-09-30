import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { LumiqraLogo } from './LumiqraLogo';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export const InstallBanner: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showBanner, setShowBanner] = useState<boolean>(false);

  useEffect(() => {
    // 1. Service Worker Registration
    if ('serviceWorker' in navigator) {
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').catch((err) => {
          console.warn('PWA Service Worker registration error:', err);
        });
      });
    }

    // 2. Capture native beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowBanner(true);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    // If app installed, hide banner
    const handleAppInstalled = () => {
      setShowBanner(false);
      setDeferredPrompt(null);
    };
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === 'accepted') {
        setShowBanner(false);
      }
    } catch (err) {
      console.warn('Installation error:', err);
    } finally {
      setDeferredPrompt(null);
    }
  };

  if (!showBanner) return null;

  return (
    <div className="sticky top-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-indigo-500/30 px-3 sm:px-5 py-2.5 shadow-2xl flex items-center justify-between gap-3 animate-fade-in">
      {/* Brand Logo & Banner Text */}
      <div className="flex items-center gap-3 text-xs sm:text-sm font-semibold text-slate-100">
        <LumiqraLogo size="sm" showText={false} className="shrink-0" />
        <span className="leading-snug tracking-tight">
          Lumiqra Chat অ্যাপটি আপনার ফোনে ইনস্টল করুন
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={handleInstallClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white text-xs font-bold shadow-lg shadow-indigo-600/30 transition transform hover:scale-105 active:scale-95 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>ইনস্টল করুন</span>
        </button>

        <button
          onClick={() => setShowBanner(false)}
          className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition cursor-pointer"
          title="বন্ধ করুন"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};

export default InstallBanner;
