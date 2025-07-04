import React from 'react';

interface LogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ className = '', size = 'md' }) => {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8', 
    lg: 'h-12 w-12'
  };

  return (
    <div className={`${sizeClasses[size]} ${className} bg-gradient-to-br from-orange-500 via-red-500 to-pink-500 rounded-lg shadow-lg flex items-center justify-center`}>
      <span className="text-white font-bold text-xs">DD</span>
    </div>
  );
};

export default Logo;