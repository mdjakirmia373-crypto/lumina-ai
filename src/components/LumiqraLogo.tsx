import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  textClassName?: string;
}

export const LumiqraLogo: React.FC<LogoProps> = ({
  className = '',
  size = 'md',
  showText = true,
  textClassName = '',
}) => {
  const sizeMap = {
    sm: { box: 'w-7 h-7 rounded-lg', icon: 'w-4 h-4', text: 'text-base', badge: 'text-[9px]' },
    md: { box: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl', icon: 'w-5 h-5', text: 'text-lg sm:text-xl', badge: 'text-[10px]' },
    lg: { box: 'w-12 h-12 rounded-2xl', icon: 'w-6 h-6', text: 'text-2xl', badge: 'text-xs' },
    xl: { box: 'w-16 h-16 rounded-3xl', icon: 'w-9 h-9', text: 'text-3xl', badge: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 select-none ${className}`}>
      {/* High-Fidelity Futuristic Quantum Spark Logo Mark */}
      <div
        className={`relative ${currentSize.box} flex items-center justify-center shadow-lg shadow-indigo-600/30 group-hover:scale-105 transition-all duration-300 overflow-hidden`}
        style={{
          background: 'linear-gradient(135deg, #2563eb 0%, #6366f1 45%, #9333ea 75%, #ec4899 100%)',
        }}
      >
        {/* Soft inner glow overlay */}
        <div className="absolute inset-0 bg-white/10 mix-blend-overlay pointer-events-none" />
        
        {/* Quantum 'L' + Cosmic Spark SVG Icon */}
        <svg
          viewBox="0 0 40 40"
          className={`${currentSize.icon} text-white drop-shadow-md`}
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Subtle geometric ring */}
          <circle cx="20" cy="20" r="15" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
          
          {/* Main 4-point Diamond Star / AI Spark */}
          <path
            d="M20 5 C20 13 27 20 35 20 C27 20 20 27 20 35 C20 27 13 20 5 20 C13 20 20 13 20 5 Z"
            fill="url(#sparkGradient)"
            className="animate-pulse"
          />

          {/* Accent secondary sparkle */}
          <circle cx="28" cy="11" r="2.2" fill="#38bdf8" />
          <circle cx="11" cy="29" r="1.6" fill="#f472b6" />

          <defs>
            <linearGradient id="sparkGradient" x1="5" y1="5" x2="35" y2="35" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ffffff" />
              <stop offset="0.6" stopColor="#e0e7ff" />
              <stop offset="1" stopColor="#c084fc" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-pink-400 ${currentSize.text} ${textClassName}`}
          >
            Lumiqra
          </span>
          <span
            className={`${currentSize.badge} uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-indigo-500/20 to-purple-500/20 text-indigo-300 border border-indigo-500/40 shadow-sm shadow-indigo-500/10`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};
