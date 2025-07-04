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
      weekday: 'long',
      year: 'numeric',
      month: 'long',
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

  if (showForgotPassword) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Date and Time Display */}
          <div className="text-center mb-6">
            <div className="bg-white rounded-lg shadow-sm p-4 border border-orange-200">
              <div className="flex items-center justify-center space-x-2 text-orange-600 mb-2">
                <Calendar className="h-4 w-4" />
                <span className="text-sm font-medium">{formatDate(currentTime)}</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <Clock className="h-5 w-5 text-orange-700" />
                <span className="text-2xl font-bold text-orange-700 font-mono">
                  {formatTime(currentTime)}
                </span>
              </div>
            </div>
          </div>

          {/* Logo */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center mb-4">
              <MapPin className="h-12 w-12 text-orange-600 mr-2" />
              <h1 className="text-3xl font-bold text-gray-900">DesiDestinations</h1>
            </div>
          </div>

          {/* Forgot Password Form */}
          <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 text-center">
              Reset Password
            </h2>
            <p className="text-gray-600 text-center mb-6 text-sm">
              Enter your email address and we'll send you a reset link valid for 15 minutes
            </p>
            
            {resetLinkSent ? (
              <div className="text-center space-y-4">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                  <Mail className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-semibold text-green-700">Reset Link Sent!</h3>
                <p className="text-sm text-gray-600">
                  Check your email for a password reset link. The link will expire in 15 minutes.
                </p>
                <button
                  onClick={() => {
                    setShowForgotPassword(false);
                    setResetLinkSent(false);
                    setResetEmail('');
                  }}
                  className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <form onSubmit={handleForgotPassword} className="space-y-6">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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
                    className="text-orange-600 hover:text-orange-700 font-medium text-sm"
                  >
                    Back to Login
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        {/* Date and Time Display */}
        <div className="text-center mb-6">
          <div className="bg-white rounded-lg shadow-sm p-4 border border-orange-200">
            <div className="flex items-center justify-center space-x-2 text-orange-600 mb-2">
              <Calendar className="h-4 w-4" />
              <span className="text-sm font-medium">{formatDate(currentTime)}</span>
            </div>
            <div className="flex items-center justify-center space-x-2">
              <Clock className="h-5 w-5 text-orange-700" />
              <span className="text-2xl font-bold text-orange-700 font-mono">
                {formatTime(currentTime)}
              </span>
            </div>
          </div>
        </div>

        {/* Logo and Welcome */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <MapPin className="h-12 w-12 text-orange-600 mr-2" />
            <h1 className="text-3xl font-bold text-gray-900">DesiDestinations</h1>
          </div>
          <p className="text-gray-600">
            Discover incredible India, one destination at a time
          </p>
          <p className="text-sm text-orange-600 mt-2 font-medium">
            आपका स्वागत है! Welcome to your travel companion
          </p>
        </div>

        {/* Login/Signup Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
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
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all"
                  placeholder={isSignUp ? 'Create a password' : 'Enter your password'}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
                  className="text-sm text-orange-600 hover:text-orange-700 font-medium"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
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

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              {isSignUp ? 'Already have an account?' : "Don't have an account?"}
              <button
                onClick={() => setIsSignUp(!isSignUp)}
                className="ml-1 text-orange-600 hover:text-orange-700 font-medium"
              >
                {isSignUp ? 'Sign In' : 'Sign Up'}
              </button>
            </p>
          </div>

          <div className="mt-6 text-center text-sm text-gray-500">
            Secure login • Password protected • Start exploring instantly
          </div>
        </div>

        {/* Cultural Touch */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
            <span className="bg-orange-100 px-3 py-1 rounded-full">🇮🇳 Made in India</span>
            <span className="bg-green-100 px-3 py-1 rounded-full">🏛️ Incredible India</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;