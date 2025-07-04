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

  // Beautiful Indian destinations and cultural images with warmer tones
  const indianImages = [
    {
      url: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg',
      caption: 'Taj Mahal, Agra - Symbol of Eternal Love',
      description: 'Marvel at the pristine white marble monument that stands as a testament to love'
    },
    {
      url: 'https://images.pexels.com/photos/2413613/pexels-photo-2413613.jpeg',
      caption: 'Kerala Backwaters - God\'s Own Country',
      description: 'Drift through serene waterways surrounded by lush coconut palms'
    },
    {
      url: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
      caption: 'Rajasthan Desert - Golden Sands of Time',
      description: 'Experience the mystical beauty of endless golden dunes under starlit skies'
    },
    {
      url: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
      caption: 'Himalayas - Crown of the World',
      description: 'Stand in awe of snow-capped peaks that touch the heavens'
    },
    {
      url: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg',
      caption: 'Goa Beaches - Coastal Paradise',
      description: 'Relax on pristine shores where golden sands meet azure waters'
    },
    {
      url: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg',
      caption: 'Jaipur Palace - Royal Heritage',
      description: 'Step into the grandeur of Rajputana architecture and royal legacy'
    },
    {
      url: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg',
      caption: 'Varanasi Ghats - Spiritual Awakening',
      description: 'Witness the eternal dance of life along the sacred Ganges'
    },
    {
      url: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg',
      caption: 'Mumbai Skyline - City of Dreams',
      description: 'Discover where tradition meets modernity in India\'s financial capital'
    }
  ];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Rotate images every 25 seconds for reduced distraction
  useEffect(() => {
    const imageTimer = setInterval(() => {
      setCurrentImageIndex((prev) => (prev + 1) % indianImages.length);
    }, 25000);

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
      {/* Left Panel - Login Operations (40% width) */}
      <div className="w-2/5 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col justify-center px-12 py-16 relative">
        {/* Enhanced Date and Time Display - Top Right of Left Panel */}
        <div className="absolute top-8 right-8">
          <div className="bg-gradient-to-br from-amber-900/95 to-orange-900/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 border border-amber-300/30">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-2 text-amber-100 mb-2">
                <Calendar className="h-5 w-5" />
                <span className="text-sm font-bold tracking-wide">{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-amber-200" />
                <span className="text-xl font-black text-amber-100 font-mono tracking-widest bg-amber-800/30 px-3 py-1 rounded-lg">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-lg mx-auto w-full space-y-8">
          {/* Logo and Welcome */}
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center mb-6">
              <MapPin className="h-12 w-12 text-amber-600 mr-3" />
              <h1 className="text-3xl font-bold text-gray-900">DesiDestinations</h1>
            </div>
            <p className="text-gray-700 text-base leading-relaxed">
              Discover incredible India, one destination at a time
            </p>
            <p className="text-base text-amber-700 font-semibold">
              आपका स्वागत है! Welcome to your travel companion
            </p>
          </div>

          {/* Forgot Password Form */}
          {showForgotPassword ? (
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-amber-100 space-y-6">
              <div className="text-center space-y-3">
                <h2 className="text-2xl font-semibold text-gray-900">
                  Reset Password
                </h2>
                <p className="text-gray-600 text-base">
                  Enter your email for a 15-minute reset link
                </p>
              </div>
              
              {resetLinkSent ? (
                <div className="text-center space-y-6">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                    <Mail className="h-8 w-8 text-green-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-green-700">Reset Link Sent!</h3>
                  <p className="text-base text-gray-600 leading-relaxed">
                    Check your email for the reset link (expires in 15 minutes)
                  </p>
                  <button
                    onClick={() => {
                      setShowForgotPassword(false);
                      setResetLinkSent(false);
                      setResetEmail('');
                    }}
                    className="text-amber-600 hover:text-amber-700 font-semibold text-base"
                  >
                    Back to Login
                  </button>
                </div>
              ) : (
                <form onSubmit={handleForgotPassword} className="space-y-6">
                  <div>
                    <label htmlFor="resetEmail" className="block text-base font-medium text-gray-700 mb-3">
                      Email Address
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                      <input
                        type="email"
                        id="resetEmail"
                        value={resetEmail}
                        onChange={(e) => setResetEmail(e.target.value)}
                        className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-base"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-base"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <span>Send Reset Link</span>
                        <ArrowRight className="h-5 w-5" />
                      </>
                    )}
                  </button>

                  <div className="text-center">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(false)}
                      className="text-amber-600 hover:text-amber-700 font-semibold text-base"
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              )}
            </div>
          ) : (
            /* Login/Signup Form */
            <div className="bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-8 border border-amber-100 space-y-6">
              <h2 className="text-2xl font-semibold text-gray-900 text-center">
                {isSignUp ? 'Create Account' : 'Welcome Back'}
              </h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="email" className="block text-base font-medium text-gray-700 mb-3">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-base"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="password" className="block text-base font-medium text-gray-700 mb-3">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      id="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-12 pr-14 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-base"
                      placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                  </div>
                </div>

                {!isSignUp && (
                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-base text-amber-600 hover:text-amber-700 font-semibold"
                    >
                      Forgot Password?
                    </button>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-4 px-6 rounded-xl font-semibold hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-3 text-base"
                >
                  {isLoading ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>{isSignUp ? 'Create Account' : 'Sign In'}</span>
                      <ArrowRight className="h-5 w-5" />
                    </>
                  )}
                </button>
              </form>

              <div className="text-center">
                <p className="text-base text-gray-600">
                  {isSignUp ? 'Already have an account?' : "Don't have an account?"}
                  <button
                    onClick={() => setIsSignUp(!isSignUp)}
                    className="ml-2 text-amber-600 hover:text-amber-700 font-semibold"
                  >
                    {isSignUp ? 'Sign In' : 'Sign Up'}
                  </button>
                </p>
              </div>

              <div className="text-center text-sm text-gray-500">
                Secure login • Password protected • Start exploring instantly
              </div>
            </div>
          )}

          {/* Cultural Touch */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
              <span className="bg-amber-100 px-4 py-2 rounded-full font-medium">🇮🇳 Made in India</span>
              <span className="bg-green-100 px-4 py-2 rounded-full font-medium">🏛️ Incredible India</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Indian Cultural Gallery (60% width) */}
      <div className="w-3/5 relative overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center transition-all duration-[2000ms] ease-in-out"
          style={{
            backgroundImage: `url(${indianImages[currentImageIndex].url})`,
          }}
        >
          {/* Warmer Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-br from-amber-900/20 via-orange-800/10 to-red-900/30"></div>
        </div>

        {/* Content Overlay */}
        <div className="relative h-full flex flex-col justify-end p-16">
          {/* Image Caption */}
          <div className="bg-gradient-to-r from-amber-900/80 to-orange-900/80 backdrop-blur-md rounded-3xl p-8 text-white border border-amber-300/20">
            <h3 className="text-3xl font-bold mb-4">{indianImages[currentImageIndex].caption}</h3>
            <p className="text-lg opacity-95 mb-6 leading-relaxed">
              {indianImages[currentImageIndex].description}
            </p>
            
            {/* Image Indicators */}
            <div className="flex space-x-3">
              {indianImages.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-500 ${
                    index === currentImageIndex 
                      ? 'bg-amber-300 scale-125 shadow-lg' 
                      : 'bg-white/40 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Floating Cultural Elements with warmer styling */}
          <div className="absolute top-12 left-12 bg-gradient-to-br from-amber-800/30 to-orange-800/30 backdrop-blur-md rounded-2xl p-6 text-white border border-amber-300/20">
            <div className="text-3xl mb-3">🕉️</div>
            <p className="text-base font-semibold">Spiritual Journey</p>
          </div>

          <div className="absolute top-12 right-12 bg-gradient-to-br from-amber-800/30 to-orange-800/30 backdrop-blur-md rounded-2xl p-6 text-white border border-amber-300/20">
            <div className="text-3xl mb-3">🏛️</div>
            <p className="text-base font-semibold">Rich Heritage</p>
          </div>

          <div className="absolute bottom-40 right-12 bg-gradient-to-br from-amber-800/30 to-orange-800/30 backdrop-blur-md rounded-2xl p-6 text-white border border-amber-300/20">
            <div className="text-3xl mb-3">🌄</div>
            <p className="text-base font-semibold">Natural Beauty</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;