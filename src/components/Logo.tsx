import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-8 w-8',
    md: 'h-12 w-12', 
    lg: 'h-16 w-16'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <div className="relative w-full h-full">
        {/* Compass with Indian flag colors */}
        <svg 
          viewBox="0 0 100 100" 
          className="w-full h-full"
          style={{
            filter: 'drop-shadow(0 4px 8px rgba(0, 0, 0, 0.1))'
          }}
        >
          {/* Outer ring with gradient */}
          <defs>
            <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF9933" />
              <stop offset="50%" stopColor="#FFFFFF" />
              <stop offset="100%" stopColor="#138808" />
            </linearGradient>
            <linearGradient id="needleGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#000080" />
              <stop offset="100%" stopColor="#FF9933" />
            </linearGradient>
          </defs>
          
          {/* Outer compass ring */}
          <circle 
            cx="50" 
            cy="50" 
            r="45" 
            fill="url(#compassGradient)" 
            stroke="#000080" 
            strokeWidth="2"
          />
          
          {/* Inner compass face */}
          <circle 
            cx="50" 
            cy="50" 
            r="35" 
            fill="white" 
            stroke="#FF9933" 
            strokeWidth="1.5"
          />
          
          {/* Compass directions */}
          <text x="50" y="20" textAnchor="middle" fontSize="8" fill="#000080" fontWeight="bold">N</text>
          <text x="80" y="55" textAnchor="middle" fontSize="8" fill="#000080" fontWeight="bold">E</text>
          <text x="50" y="85" textAnchor="middle" fontSize="8" fill="#000080" fontWeight="bold">S</text>
          <text x="20" y="55" textAnchor="middle" fontSize="8" fill="#000080" fontWeight="bold">W</text>
          
          {/* Compass needle pointing northeast (journey direction) */}
          <g transform="rotate(45 50 50)">
            <polygon 
              points="50,25 52,48 50,50 48,48" 
              fill="url(#needleGradient)"
              stroke="#000080"
              strokeWidth="0.5"
            />
            <polygon 
              points="50,75 48,52 50,50 52,52" 
              fill="#138808"
              stroke="#000080"
              strokeWidth="0.5"
            />
          </g>
          
          {/* Center dot */}
          <circle 
            cx="50" 
            cy="50" 
            r="3" 
            fill="#000080"
          />
        </svg>
        
        {/* Star accent in Indian green */}
        <div 
          className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-md"
          style={{backgroundColor: '#138808'}}
        >
          <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
          </svg>
        </div>
      </div>
    </div>
  );
};

export default Logo;