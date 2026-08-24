import React from 'react';

interface BulBulLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
  onClick?: () => void;
}

export const BulBulLogo: React.FC<BulBulLogoProps> = ({
  size = 'md',
  showText = true,
  className = '',
  onClick
}) => {
  const sizeMap = {
    sm: { icon: 28, text: 'text-lg', badge: 'text-[9px] px-1' },
    md: { icon: 34, text: 'text-xl', badge: 'text-[10px] px-1.5' },
    lg: { icon: 44, text: 'text-2xl', badge: 'text-xs px-2' },
    xl: { icon: 56, text: 'text-3xl', badge: 'text-xs px-2.5' }
  };

  const current = sizeMap[size];

  return (
    <div 
      id="bulbul-brand-logo"
      onClick={onClick}
      className={`inline-flex items-center gap-2.5 cursor-pointer select-none group transition-transform active:scale-95 ${className}`}
    >
      {/* Bird Silhouette + Sonic Waves Original Icon */}
      <div 
        className="relative flex items-center justify-center rounded-2xl bg-gradient-to-tr from-teal-600 via-cyan-500 to-amber-400 p-0.5 shadow-md shadow-teal-500/20 group-hover:shadow-teal-500/35 transition-all duration-300"
        style={{ width: current.icon, height: current.icon }}
      >
        <div className="w-full h-full bg-slate-900 rounded-[14px] flex items-center justify-center overflow-hidden relative">
          {/* Subtle sonic waves aura */}
          <div className="absolute inset-0 bg-radial from-teal-500/30 to-transparent opacity-80" />
          
          <svg 
            viewBox="0 0 40 40" 
            className="w-4/5 h-4/5 text-white transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300 z-10"
            fill="none" 
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Songbird Body & Wing */}
            <path 
              d="M10 24C10 24 13 14 24 12C28 11.27 31 13 33 11C31 16 27 18 25 18C23 18 20 16 16 19C12 22 10 24 10 24Z" 
              fill="url(#birdGrad1)" 
            />
            {/* Dynamic Wing Feather */}
            <path 
              d="M12 27C14 22 20 18 26 21C22 23 18 26 15 30C13 29 12 28 12 27Z" 
              fill="url(#birdGrad2)" 
            />
            {/* Eye point */}
            <circle cx="28" cy="13.5" r="1.5" fill="#FFFFFF" />
            <circle cx="28.5" cy="13.5" r="0.6" fill="#0F172A" />
            {/* Beak */}
            <path d="M33 11.5L37 13L32.5 14.5Z" fill="#F59E0B" />
            {/* Sound Wave Pulses */}
            <path 
              d="M34 9C36 11 37 14 36 17" 
              stroke="#06B6D4" 
              strokeWidth="1.8" 
              strokeLinecap="round" 
              className="animate-pulse"
            />
            <path 
              d="M37 6.5C40 9.5 41 15 39 19.5" 
              stroke="#F59E0B" 
              strokeWidth="1.4" 
              strokeLinecap="round" 
              strokeDasharray="1 2"
            />

            <defs>
              <linearGradient id="birdGrad1" x1="10" y1="12" x2="33" y2="24" gradientUnits="userSpaceOnUse">
                <stop stopColor="#06B6D4" />
                <stop offset="0.6" stopColor="#0D9488" />
                <stop offset="1" stopColor="#10B981" />
              </linearGradient>
              <linearGradient id="birdGrad2" x1="12" y1="18" x2="26" y2="30" gradientUnits="userSpaceOnUse">
                <stop stopColor="#F59E0B" />
                <stop offset="1" stopColor="#EC4899" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Typography Brand Name */}
      {showText && (
        <div className="flex items-center gap-1.5">
          <span className={`font-black tracking-tight bg-gradient-to-r from-slate-900 via-teal-900 to-cyan-900 dark:from-white dark:via-teal-100 dark:to-cyan-300 bg-clip-text text-transparent ${current.text}`}>
            BulBul
          </span>
          <span className={`font-bold rounded-md bg-teal-500/15 text-teal-600 dark:bg-teal-400/20 dark:text-teal-300 uppercase tracking-wider ${current.badge}`}>
            HD
          </span>
        </div>
      )}
    </div>
  );
};
