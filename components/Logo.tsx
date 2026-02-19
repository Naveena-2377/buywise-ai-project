
import React from 'react';

const Logo: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const dimensions = {
    sm: 'h-8 w-auto',
    md: 'h-12 w-auto',
    lg: 'h-20 w-auto'
  };

  return (
    <div className={`flex items-center gap-2 ${size === 'lg' ? 'flex-col' : ''}`}>
      <div className={`relative ${dimensions[size]} aspect-square`}>
        {/* Abstract Cart Shape with Brain Texture */}
        <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
          <defs>
            <linearGradient id="cartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#4f46e5' }} />
              <stop offset="100%" style={{ stopColor: '#9333ea' }} />
            </linearGradient>
            <linearGradient id="brainGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" style={{ stopColor: '#22d3ee' }} />
              <stop offset="100%" style={{ stopColor: '#4f46e5' }} />
            </linearGradient>
          </defs>
          
          {/* Cart Body */}
          <path 
            d="M20,25 L35,25 L45,65 L85,65 L90,35 L30,35" 
            fill="none" 
            stroke="url(#cartGrad)" 
            strokeWidth="5" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
          />
          <circle cx="50" cy="75" r="5" fill="#84cc16" />
          <circle cx="80" cy="75" r="5" fill="#84cc16" />
          
          {/* Brain/Neural Mesh inside Cart */}
          <circle cx="60" cy="40" r="18" fill="url(#brainGrad)" opacity="0.8" />
          <path d="M50,40 Q60,25 70,40 T60,55 T50,40" fill="none" stroke="white" strokeWidth="0.5" opacity="0.5" />
          <circle cx="55" cy="35" r="1" fill="white" />
          <circle cx="65" cy="35" r="1" fill="white" />
          <circle cx="60" cy="45" r="1" fill="white" />
          <line x1="55" y1="35" x2="65" y2="35" stroke="white" strokeWidth="0.2" />
          <line x1="65" y1="35" x2="60" y2="45" stroke="white" strokeWidth="0.2" />
          <line x1="60" y1="45" x2="55" y2="35" stroke="white" strokeWidth="0.2" />
        </svg>
      </div>
      <div className="flex flex-col items-start leading-none">
        <span className="text-2xl font-black tracking-tighter text-indigo-900 flex items-center">
          BUYWISE <span className="ml-1 text-xs bg-indigo-900 text-white px-1 py-0.5 rounded">AI</span>
        </span>
      </div>
    </div>
  );
};

export default Logo;
