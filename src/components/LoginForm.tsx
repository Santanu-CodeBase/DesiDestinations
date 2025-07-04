import React, { useState, useEffect } from 'react';
import { MapPin, Mail, ArrowRight, Lock, Eye, EyeOff, Clock, Calendar, User, Phone, UserPlus, LogIn } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

interface UserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: string;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showExcitementMessage, setShowExcitementMessage] = useState(false);

  // Beautiful Indian destinations and cultural images
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
    }
  ];

  // Update clock every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Rotate images every 25 seconds
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

  const validateEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password: string) => {
    return password.length >= 6;
  };

  const validatePhone = (phone: string) => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Check if user exists
      const userData = localStorage.getItem(`desiDestinations_user_${email}`);
      
      if (!userData) {
        // Show excitement message and switch to register mode
        setShowExcitementMessage(true);
        setIsLoading(false);
        setTimeout(() => {
          setShowExcitementMessage(false);
          setMode('register');
        }, 3000);
        return;
      }

      const user: UserData = JSON.parse(userData);
      
      if (user.password !== password) {
        alert('Incorrect password. Please check your password and try again.');
        setIsLoading(false);
        return;
      }
      
      // Successful login
      alert(`Welcome back, ${user.name}! Ready to explore India?`);
      localStorage.setItem('desiDestinationsEmail', email);
      onLogin(email);
    } catch (error) {
      console.error('Login error:', error);
      alert('An error occurred during login. Please try again.');
      setIsLoading(false);
    }
    
    setIsLoading(false);
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !password.trim()) return;

    if (!validateEmail(email)) {
      alert('Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      alert('Password must be at least 6 characters long.');
      return;
    }

    if (!validatePhone(phone)) {
      alert('Please enter a valid 10-digit phone number (without country code).');
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Check if user already exists
      const existingUser = localStorage.getItem(`desiDestinations_user_${email}`);
      if (existingUser) {
        alert('Account already exists with this email. Please use the login form.');
        setMode('login');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser: UserData = {
        name: name.trim(),
        email: email.trim(),
        password: password,
        phone: phone ? `+91 ${phone}` : undefined,
        createdAt: new Date().toISOString()
      };

      localStorage.setItem(`desiDestinations_user_${email}`, JSON.stringify(newUser));
      localStorage.setItem('desiDestinationsEmail', email);
      
      alert(`Welcome to DesiDestinations, ${name}! Your account has been created successfully. Let's start exploring India!`);
      onLogin(email);
    } catch (error) {
      console.error('Registration error:', error);
      alert('An error occurred during registration. Please try again.');
      setIsLoading(false);
    }
    
    setIsLoading(false);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail.trim()) return;

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResetLinkSent(true);
    setIsLoading(false);
    
    setTimeout(() => {
      setResetLinkSent(false);
      setMode('login');
      setResetEmail('');
    }, 5000);
  };

  const resetForm = () => {
    setEmail('');
    setPassword('');
    setName('');
    setPhone('');
    setResetEmail('');
    setShowPassword(false);
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    resetForm();
    setMode(newMode);
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Operations (40% width) */}
      <div className="w-2/5 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col relative">
        
        {/* Header with Date and Clock */}
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

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center px-8 py-6">
          <div className="w-full space-y-6">
            {/* Logo and Welcome */}
            <div className="text-center space-y-3">
              <div className="flex items-center justify-center mb-4">
                <img 
                  src="/image.png" 
                  alt="DesiDestinations Logo" 
                  className="h-10 w-10 mr-3 rounded-lg shadow-lg"
                />
                <h1 className="text-2xl font-bold text-gray-900">DesiDestinations</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Discover incredible India, one destination at a time
              </p>
              <p className="text-sm text-amber-700 font-medium">
                आपका स्वागत है! Welcome to your travel companion
              </p>
            </div>

            {/* Excitement Message */}
            {showExcitementMessage && (
              <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-6 text-center space-y-4 animate-pulse">
                <div className="text-4xl">🎉</div>
                <h3 className="text-lg font-semibold text-blue-900">
                  We understand you are excited to explore!
                </h3>
                <p className="text-blue-700 text-sm leading-relaxed">
                  Please register using the Register link to get started and unlock amazing destinations across India.
                </p>
                <div className="flex justify-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                </div>
              </div>
            )}

            {/* Forgot Password Form */}
            {mode === 'forgot' && !showExcitementMessage && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100 space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900">
                    Reset Password
                  </h2>
                  <p className="text-gray-600 text-sm">
                    Enter your email for a 15-minute reset link
                  </p>
                </div>
                
                {resetLinkSent ? (
                  <div className="text-center space-y-4">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
                      <Mail className="h-6 w-6 text-green-600" />
                    </div>
                    <h3 className="text-lg font-semibold text-green-700">Reset Link Sent!</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      Check your email for the reset link (expires in 15 minutes)
                    </p>
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
                          className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                          placeholder="Enter your email"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
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
                        onClick={() => switchMode('login')}
                        className="text-amber-600 hover:text-amber-700 font-medium text-sm"
                      >
                        Back to Login
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* Login Form */}
            {mode === 'login' && !showExcitementMessage && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100 space-y-4">
                <form onSubmit={handleLogin} className="space-y-4">
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
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
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
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                        placeholder="Enter your password"
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

                  <div className="text-right">
                    <button
                      type="button"
                      onClick={() => switchMode('forgot')}
                      className="text-sm text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Forgot Password?
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 px-4 rounded-lg font-medium hover:from-amber-600 hover:to-orange-600 focus:ring-2 focus:ring-amber-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4" />
                        <span>Sign In</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Don't have an account?
                    <button
                      onClick={() => switchMode('register')}
                      className="ml-1 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Register
                    </button>
                  </p>
                </div>
              </div>
            )}

            {/* Registration Form */}
            {mode === 'register' && !showExcitementMessage && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100 space-y-4">
                <div className="text-center space-y-2">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-center space-x-2">
                    <UserPlus className="h-5 w-5 text-green-600" />
                    <span>Create Account</span>
                  </h2>
                  <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
                    ✨ Creating New Account
                  </div>
                </div>
                
                <form onSubmit={handleRegister} className="space-y-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="text"
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                      Password <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        id="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                        placeholder="Create a password (min 6 characters)"
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
                    <p className="text-xs text-gray-500 mt-1">Minimum 6 characters required</p>
                  </div>

                  <div>
                    <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                      Phone Number <span className="text-gray-400">(Optional)</span>
                    </label>
                    <div className="relative">
                      <div className="absolute left-3 top-1/2 transform -translate-y-1/2 flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span className="text-sm text-gray-600 font-medium">+91</span>
                      </div>
                      <input
                        type="tel"
                        id="phone"
                        value={phone}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, '');
                          if (value.length <= 10) {
                            setPhone(value);
                          }
                        }}
                        className="w-full pl-16 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm"
                        placeholder="9876543210"
                        maxLength={10}
                      />
                    </div>
                    <p className="text-xs text-gray-500 mt-1">10-digit mobile number without country code</p>
                  </div>

                  <button
                    type="submit"
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
                  >
                    {isLoading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4" />
                        <span>Create Account</span>
                      </>
                    )}
                  </button>
                </form>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Already have an account?
                    <button
                      onClick={() => switchMode('login')}
                      className="ml-1 text-amber-600 hover:text-amber-700 font-medium"
                    >
                      Sign In
                    </button>
                  </p>
                </div>

                <div className="text-center text-xs text-gray-500">
                  🔒 Secure registration • 🛡️ Your data is protected • ⚡ Start exploring instantly
                </div>
              </div>
            )}

            {/* Cultural Touch */}
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 text-xs text-gray-600">
                <span className="bg-amber-100 px-3 py-1 rounded-full font-medium">🇮🇳 Made in India</span>
                <span className="bg-green-100 px-3 py-1 rounded-full font-medium">🏛️ Incredible India</span>
              </div>
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
        <div className="relative h-full flex flex-col justify-between p-8">
          
          {/* Image Caption Tile */}
          <div className="mt-auto">
            <div className="bg-gradient-to-r from-amber-900/90 to-orange-900/90 backdrop-blur-md rounded-2xl p-6 text-white border border-amber-300/20 shadow-2xl">
              <h3 className="text-2xl font-bold mb-3">{indianImages[currentImageIndex].caption}</h3>
              <p className="text-base opacity-95 mb-4 leading-relaxed">
                {indianImages[currentImageIndex].description}
              </p>
              
              {/* Image Indicators */}
              <div className="flex space-x-2">
                {indianImages.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-500 ${
                      index === currentImageIndex 
                        ? 'bg-amber-300 scale-125 shadow-lg' 
                        : 'bg-white/40 hover:bg-white/60'
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Footer Links with High Contrast */}
          <div className="absolute bottom-4 left-8 right-8">
            <div className="flex justify-end">
              <div className="flex items-center space-x-8 text-xs">
                <button className="text-white hover:text-amber-300 font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl">
                  Accessibility
                </button>
                <button className="text-white hover:text-amber-300 font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl">
                  Privacy Policy
                </button>
                <button className="text-white hover:text-amber-300 font-medium transition-colors drop-shadow-lg hover:drop-shadow-xl">
                  Terms & Conditions
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;