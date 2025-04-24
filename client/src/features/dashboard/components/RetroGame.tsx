import React from 'react';
import 'nes.css/css/nes.min.css';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

// Pixel style button with NES.css inspiration
export const PixelButton: React.FC<{
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'default';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ variant = 'default', children, onClick, disabled, size = 'md', className = '' }) => {
  const colorClasses = {
    primary: 'bg-blue-500 hover:bg-blue-600 border-blue-700 text-white hover:shadow-md',
    success: 'bg-green-500 hover:bg-green-600 border-green-700 text-white hover:shadow-md',
    warning: 'bg-amber-500 hover:bg-amber-600 border-amber-700 text-white hover:shadow-md',
    error: 'bg-red-500 hover:bg-red-600 border-red-700 text-white hover:shadow-md',
    default: 'bg-gray-200 hover:bg-gray-300 border-gray-400 text-gray-800 hover:shadow-md',
  };

  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  };

  const pixelStyle = `
    ${colorClasses[variant]} 
    ${sizeClasses[size]} 
    font-vt323 
    rounded-none 
    border-b-4 
    active:border-b-2 
    active:translate-y-[2px] 
    transition-all 
    duration-75 
    uppercase 
    tracking-wide
    ${disabled ? 'opacity-50 cursor-not-allowed hover:bg-opacity-100' : ''}
    ${className}
  `;

  return (
    <button
      className={`nes-btn pixel-btn ${pixelStyle}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

// Pixel style card for game elements
export const PixelCard: React.FC<{
  children: React.ReactNode;
  variant?: 'primary' | 'success' | 'warning' | 'error' | 'default';
  className?: string;
}> = ({ children, variant = 'default', className = '' }) => {
  const colorClasses = {
    primary: 'bg-blue-100 border-blue-500',
    success: 'bg-green-100 border-green-500',
    warning: 'bg-amber-100 border-amber-500',
    error: 'bg-red-100 border-red-500',
    default: 'bg-white border-gray-800',
  };

  return (
    <div 
      className={`nes-container p-4 ${colorClasses[variant]} pixelated border-4 ${className}`}
      style={{ imageRendering: 'pixelated' }}
    >
      {children}
    </div>
  );
};

// 8-bit style coin component
export const PixelCoin: React.FC<{
  collected: boolean;
  onClick?: () => void;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}> = ({ collected, onClick, size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  return (
    <button
      className={`
        ${sizeClasses[size]} 
        ${collected ? 'nes-icon coin is-large' : 'nes-icon coin is-large is-transparent'} 
        transform transition-transform hover:scale-110 active:scale-95
        ${className}
      `}
      onClick={onClick}
      title={collected ? "Coin collected!" : "Click to collect coin"}
    />
  );
};

// 8-bit style progress bar
export const PixelProgress: React.FC<{
  value: number;
  max: number;
  variant?: 'primary' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ value, max, variant = 'primary', className = '' }) => {
  const percentage = Math.min(Math.max(0, (value / max) * 100), 100);
  
  const variantClasses = {
    primary: 'nes-progress is-primary',
    success: 'nes-progress is-success',
    warning: 'nes-progress is-warning',
    error: 'nes-progress is-error',
  };

  return (
    <progress 
      className={`${variantClasses[variant]} ${className}`} 
      value={value} 
      max={max} 
    />
  );
};

// 8-bit style text
export const PixelText: React.FC<{
  children: React.ReactNode;
  variant?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
}> = ({ children, variant = 'p', className = '' }) => {
  const Component = variant;
  
  const baseClasses = 'font-vt323 tracking-wide';
  
  const variantClasses = {
    h1: 'text-3xl font-bold mb-4',
    h2: 'text-2xl font-bold mb-3',
    h3: 'text-xl font-bold mb-2',
    p: 'text-base mb-2',
    span: 'text-base',
  };

  return (
    <Component className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </Component>
  );
};

// Pixel art avatar component
export const PixelAvatar: React.FC<{
  type: 'octocat' | 'mario' | 'ash' | 'pokeball' | 'kirby' | 'heart' | 'star';
  className?: string;
}> = ({ type, className = '' }) => {
  return (
    <i className={`nes-${type} ${className}`}></i>
  );
};

// 8-bit dialog box
export const PixelDialog: React.FC<{
  children: React.ReactNode;
  className?: string;
}> = ({ children, className = '' }) => {
  return (
    <div className={`nes-dialog pixelated ${className}`}>
      {children}
    </div>
  );
};

// Pixel balloon dialog
export const PixelBalloon: React.FC<{
  children: React.ReactNode;
  variant?: 'normal' | 'success' | 'warning' | 'error';
  className?: string;
}> = ({ children, variant = 'normal', className = '' }) => {
  return (
    <div className={`nes-balloon from-${variant} ${className}`}>
      {children}
    </div>
  );
};

// Animated pixel art character
export const PixelCharacter: React.FC<{
  type: 'hero' | 'trophy' | 'coin' | 'heart';
  className?: string;
}> = ({ type, className = '' }) => {
  let characterClass = '';
  
  switch (type) {
    case 'hero':
      characterClass = 'nes-mario animate-bounce';
      break;
    case 'trophy':
      characterClass = 'nes-icon trophy animate-pulse';
      break;
    case 'coin':
      characterClass = 'nes-icon coin animate-spin';
      break;
    case 'heart':
      characterClass = 'nes-icon heart animate-pulse';
      break;
    default:
      characterClass = 'nes-mario';
  }
  
  return <i className={`${characterClass} ${className}`}></i>;
};

// Pixel confetti effect
export const PixelConfetti: React.FC<{
  count?: number;
  className?: string;
}> = ({ count = 30, className = '' }) => {
  return (
    <div className={`fixed inset-0 pointer-events-none z-50 ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div 
          key={i}
          className="absolute w-2 h-2 bg-current rounded-none pixelated"
          style={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            color: ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'][Math.floor(Math.random() * 6)],
            animation: `fall ${1 + Math.random() * 3}s linear forwards`,
            transform: `rotate(${Math.random() * 360}deg)`,
          }}
        />
      ))}
    </div>
  );
};

// Custom CSS for pixel animations
export const PixelStyles = () => (
  <style dangerouslySetInnerHTML={{ __html: `
    @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
    @import url('https://fonts.googleapis.com/css2?family=VT323&display=swap');
    
    /* Pixel font classes */
    .font-press-start {
      font-family: 'Press Start 2P', cursive;
    }
    
    .font-vt323 {
      font-family: 'VT323', monospace;
    }
    
    /* Pixelated rendering */
    .pixelated {
      image-rendering: pixelated;
      image-rendering: crisp-edges;
    }
    
    /* Pixel buttons */
    .pixel-btn {
      box-shadow: inset -4px -4px 0px 0px rgba(0, 0, 0, 0.3);
      outline: none;
    }
    
    .pixel-btn:focus {
      outline: none;
    }
    
    /* Pixel animation keyframes */
    @keyframes fall {
      0% {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      85% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
      }
    }
    
    /* Scaling pixel art properly */
    .pixel-art {
      transform: scale(3);
      transform-origin: top left;
    }
    
    /* 8-bit container styling */
    .nes-container {
      position: relative;
      border-radius: 0;
      padding: 1rem;
    }
    
    .nes-container::after {
      content: '';
      position: absolute;
      right: -4px;
      bottom: -4px;
      width: calc(100% + 8px);
      height: calc(100% + 8px);
      z-index: -1;
      border: 4px solid transparent;
      opacity: 0.3;
    }
  ` }} />
);