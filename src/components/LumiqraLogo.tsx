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
    sm: { img: 'w-7 h-7 rounded-lg', text: 'text-base', badge: 'text-[9px]' },
    md: { img: 'w-9 h-9 sm:w-10 sm:h-10 rounded-xl sm:rounded-2xl', text: 'text-lg sm:text-xl', badge: 'text-[10px]' },
    lg: { img: 'w-12 h-12 rounded-2xl', text: 'text-2xl', badge: 'text-xs' },
    xl: { img: 'w-16 h-16 rounded-3xl', text: 'text-3xl', badge: 'text-sm' },
  };

  const currentSize = sizeMap[size];

  return (
    <div className={`flex items-center space-x-2.5 sm:space-x-3 select-none ${className}`}>
      {/* Official Lumiqra Glowing Glass App Logo Icon */}
      <div className="relative group-hover:scale-105 transition-all duration-300">
        <img
          src="/icon-192.png"
          alt="Lumiqra Logo"
          className={`${currentSize.img} object-contain shadow-lg shadow-cyan-500/25 border border-cyan-400/30 backdrop-blur-sm bg-slate-950/80`}
        />
        {/* Soft neon glow around logo */}
        <div className="absolute inset-0 -z-10 rounded-xl bg-gradient-to-r from-cyan-500/20 via-blue-500/20 to-purple-500/20 blur-md pointer-events-none" />
      </div>

      {showText && (
        <div className="flex items-center gap-1.5 leading-none">
          <span
            className={`font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-400 to-fuchsia-400 ${currentSize.text} ${textClassName}`}
          >
            Lumiqra
          </span>
          <span
            className={`${currentSize.badge} uppercase font-extrabold tracking-wider px-1.5 py-0.5 rounded-md bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-400/40 shadow-sm shadow-cyan-500/10`}
          >
            AI
          </span>
        </div>
      )}
    </div>
  );
};
