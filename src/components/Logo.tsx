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
    <div className={`${sizeClasses[size]} ${className}`}>
      <img 
        src="/desidestinations_logo.svg" 
        alt="DesiDestinations Logo" 
        className="w-full h-full object-contain"
      />
    </div>
  );
};

export default Logo;