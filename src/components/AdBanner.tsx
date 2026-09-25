import React from 'react';
import { Tag } from 'lucide-react';

interface AdBannerProps {
  placement: 'top' | 'middle' | 'bottom';
  format?: 'banner' | 'leaderboard' | 'responsive';
}

export const AdBanner: React.FC<AdBannerProps> = ({ placement, format = 'leaderboard' }) => {
  const getLabel = () => {
    switch (placement) {
      case 'top':
        return 'Google AdSense Banner Placement · Top Header (728x90 / Responsive)';
      case 'middle':
        return 'Google AdSense In-Article Placement (Responsive Display)';
      case 'bottom':
        return 'Google AdSense Banner Placement · Bottom Footer (970x90 / Responsive)';
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto px-4 my-4">
      <div className="relative group overflow-hidden rounded-2xl border border-dashed border-slate-800 bg-slate-900/30 hover:bg-slate-900/40 transition-colors p-3 sm:p-4 text-center">
        {/* Subtle corner label */}
        <div className="flex items-center justify-between text-[10px] text-slate-500 font-mono mb-2 uppercase tracking-wider px-1">
          <span className="flex items-center gap-1">
            <Tag className="w-3 h-3 text-slate-600" />
            Advertisement / বিজ্ঞাপন
          </span>
          <span>Google AdSense Ready</span>
        </div>

        {/* Ad container placeholder */}
        <div className="w-full min-h-[70px] sm:min-h-[85px] rounded-xl bg-slate-950/40 border border-slate-800/60 flex flex-col items-center justify-center p-3 text-slate-500">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-2 h-2 rounded-full bg-indigo-500/60 animate-ping" />
            <span className="text-xs font-mono text-slate-400 font-semibold tracking-wide">
              {getLabel()}
            </span>
          </div>
          <p className="text-[11px] text-slate-600 max-w-md">
            আপনার Google AdSense পাবলিশার কোড (Ad Unit Client ID ও Slot ID) এখানে যুক্ত করার জন্য প্রস্তুত।
          </p>
        </div>
      </div>
    </div>
  );
};
