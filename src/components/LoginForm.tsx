import React, { useState, useEffect } from 'react';
import { MapPin, Mail, ArrowRight, Lock, Eye, EyeOff, Clock, Calendar } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Beautiful Indian destinations and cultural images
  const indianImages = [
    {
      url: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg',
      caption: 'Taj Mahal, Agra - Symbol of Love'
    },
    {
      url: 'https://images.pexels.com/photos/2413613/pexels-photo-2413613.jpeg',
      caption: 'Kerala Backwaters - God\'s Own Country'
    },
    {
      url: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
      caption: 'Rajasthan Desert - Golden Sands'
    },
    {
      url: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
      caption: 'Himalayas - Majestic Peaks'
    },
    {
      url: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg',
      caption: 'Goa Beaches - Coastal Paradise'
    },
    {
      url: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
      caption: 'Jaipur Palace - Royal Heritage'
    },
    {
      url: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
      caption: 'Varanasi Ghats - Spiritual Journey'
    },
    {
      url: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg',
      caption: 'Mumbai Skyline - City of Dreams'
    }
  ];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate images every 5 seconds
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % indianImages.length);
    }, 5000);

    return () => clearInterval(imageTimer);
  }, [indianImages.length]);

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Store credentials in localStorage (in production, use proper authentication)
    if (isSignUp) {
      localStorage.setItem(`desiDestinations_${email}`, password);
    } else {
      const storedPassword = localStorage.getItem(`desiDestinations_${email}`);
      if (storedPassword !== password) {
        alert('Invalid email or password');
        setIsLoading(false);
        return;
      }
    }
    
    onLogin(email);
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setIsLoading(true);
    // Simulate sending reset link
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResetLinkSent(true);
    setIsLoading(false);
    
    // Auto hide success message after 5 seconds
    setTimeout(() => {
      setResetLinkSent(false);
      setShowForgotPassword(false);
      setResetEmail('');
    }, 5000);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Operations (1/3 width) */}
      <div className="w-1/3 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col justify-center px-8 py-12 relative">
        {/* Date and Time Display - Top Right of Left Panel */}
        <div className="absolute top-6 right-6">
          <div className="bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-4 border border-amber-200">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-amber-700 mb-1">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-semibold">{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-4 w-4 text-amber-800" />
                <span className="text-lg font-bold text-amber-800 font-mono tracking-wider">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-md mx-auto w-full">
          {/* Logo and Welcome */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-10 w-10 text-amber-600 mr-2" />
              <h1 className="text-2xl font-bold text-gray-900">DesiDestinations</h1>
            </div>
            <p className="text-gray-700 text-sm">
              Discover incredible India, one destination at a time
            </p>
            <p className="text-sm text-amber-700 mt-2 font-medium">
              आपका स्वागत है! Welcome to your travel companion
            </p>
          </div>

          {/* Forgot Password Form */}
          {showForgotPassword ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-2 text-center">
                Reset Password
              </h2>
              <p className="text-gray-600 text-center mb-6 text-sm">
                Enter your email for a 15-minute reset link
              </p>
              
              {resetLinkSent ? (
                <div className="text-center space-y-4">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-6 w-6 text-green-600" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-700">Reset Link Sent!</h3>
                  <p className="text-sm text-gray-600">
                    Check your email for the reset link (expires in 15 minutes)
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetLinkSent(false);
                      setResetEmail('');
                    }}
                    className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-4">
                  <div>
                    <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Login/Signup Form */
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100">
              <h2 className="text-xl font-semibold text-gray-900 mb-6 text-center">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all"
                      placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-4 text-center">
                <p className="text-sm text-gray-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="ml-1 text-amber-600 hover:text-amber-700 font-medium"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              <div className="mt-4 text-center text-xs text-gray-500">
                Secure login • Password protected • Start exploring instantly
              </div>
            </div>
          )}

          {/* Cultural Touch */}
          <div className="mt-6 text-center">
            <div className="flex items-center justify-center space-x-3 text-xs text-gray-600">
              <span className="bg-amber-100 px-2 py-1 rounded-full">🇮🇳 Made in India</span>
              <span className="bg-green-100 px-2 py-1 rounded-full">🏛️ Incredible India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Indian Cultural Gallery (2/3 width) */}
      <div className="w-2/3 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out"
          style={{
            backgroundImage: `url(${indianImages[currentImageIndex].url})`,
          }}
        >
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/50"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-end p-12">
          {/* Image Caption */}
          <div className="bg-black/60 backdrop-blur-sm rounded-2xl p-6 text-white">
            <h3 className="text-2xl font-bold mb-2">{indianImages[currentImageIndex].caption}</h3>
            <p className="text-lg opacity-90 mb-4">
              Experience the magic of India's diverse landscapes and rich cultural heritage
            </p>
            
            {/* Image Indicators */}
            <div className="flex space-x-2">
              {indianImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex 
                      ? 'bg-amber-400 scale-125' 
                      : 'bg-white/50 hover:bg-white/70'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Floating Cultural Elements */}
          <div className="absolute top-8 left-8 bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
            <div className="text-2xl mb-2">🕉️</div>
            <p className="text-sm font-medium">Spiritual Journey</p>
          </div>

          <div className="absolute top-8 right-8 bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
            <div className="text-2xl mb-2">🏛️</div>
            <p className="text-sm font-medium">Rich Heritage</p>
          </div>

          <div className="absolute bottom-32 right-8 bg-white/20 backdrop-blur-sm rounded-xl p-4 text-white">
            <div className="text-2xl mb-2">🌄</div>
            <p className="text-sm font-medium">Natural Beauty</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;