import React, { useState, useEffect } from 'react';
import { Calendar, Clock } from 'lucide-react';

const AuthHeader: React.FC = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('en-IN', {
      hour12: false,
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-IN', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="w-full px-6 py-4 bg-gradient-to-r from-amber-900/95 to-orange-900/95 backdrop-blur-md border-b border-amber-300/30">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3 text-amber-100">
          <Calendar className="h-3 w-3" />
          <span className="text-xs font-semibold tracking-wide">{formatDate(currentTime)}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-3 w-3 text-amber-200" />
          <span className="text-xs font-bold text-amber-100 font-mono tracking-wider bg-amber-800/30 px-2 py-1 rounded">
            {formatTime(currentTime)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default AuthHeader;