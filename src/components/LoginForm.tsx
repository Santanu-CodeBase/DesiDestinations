import React, { useState } from 'react';
import Logo from './Logo';
import LoginForm from './auth/LoginForm';
import RegisterForm from './auth/RegisterForm';
import ForgotPasswordForm from './auth/ForgotPasswordForm';
import UserNotFoundDialog from './auth/UserNotFoundDialog';
import ImageGallery from './auth/ImageGallery';
import AuthHeader from './auth/AuthHeader';

interface LoginFormContainerProps {
  onLogin: (email: string) => void;
}

interface UserData {
  name: string;
  email: string;
  password: string;
  phone?: string;
  createdAt: string;
}

const LoginFormContainer: React.FC<LoginFormContainerProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>('login');
  const [resetEmail, setResetEmail] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);
  const [showUserNotFound, setShowUserNotFound] = useState(false);
  const [passwordError, setPasswordError] = useState('');

  // Beautiful Indian destinations and cultural images
  const indianImages = [
    {
      url: 'https://images.pexels.com/photos/1583339/pexels-photo-1583339.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Taj Mahal, Agra - Symbol of Eternal Love',
      description: 'Marvel at the pristine white marble mausoleum, an architectural masterpiece and UNESCO World Heritage Site that stands as an eternal symbol of love'
    },
    {
      url: 'https://images.pexels.com/photos/2413613/pexels-photo-2413613.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Kerala Backwaters - God\'s Own Country',
      description: 'Drift through tranquil backwaters on traditional houseboats, surrounded by emerald paddy fields and swaying coconut palms in Kerala\'s pristine waterways'
    },
    {
      url: 'https://images.pexels.com/photos/3581368/pexels-photo-3581368.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Rajasthan Desert - Golden Sands of Time',
      description: 'Experience the mystical beauty of the Thar Desert with endless golden sand dunes, camel safaris, and magical starlit nights in Rajasthan\'s royal landscape'
    },
    {
      url: 'https://images.pexels.com/photos/1007426/pexels-photo-1007426.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Himalayas - Crown of the World',
      description: 'Stand in awe of majestic snow-capped peaks that pierce the sky, offering breathtaking views and spiritual serenity in the world\'s highest mountain range'
    },
    {
      url: 'https://images.pexels.com/photos/2325446/pexels-photo-2325446.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2',
      caption: 'Goa Beaches - Coastal Paradise',
      description: 'Relax on pristine golden beaches where palm trees sway gently and crystal-clear waters meet the shore, creating the perfect tropical paradise'
    }
  ];

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
    setPasswordError(''); // Clear any previous error
    
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
        // Show user not found message with consent options
        setShowUserNotFound(true);
        setIsLoading(false);
        return;
      }

      const user: UserData = JSON.parse(userData);
      
      if (user.password !== password) {
        setPasswordError('Incorrect user id / password. Please check and try again');
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
    setPasswordError('');
    setName('');
    setPhone('');
    setResetEmail('');
    setShowPassword(false);
  };

  const switchMode = (newMode: 'login' | 'register' | 'forgot') => {
    resetForm();
    setMode(newMode);
  };

  const handleProceedToRegister = () => {
    setShowUserNotFound(false);
    setMode('register');
  };

  const handleStayOnLogin = () => {
    setShowUserNotFound(false);
    setPasswordError('');
    setEmail('');
    setPassword('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Login Operations (40% width) */}
      <div className="w-2/5 bg-gradient-to-br from-amber-50 via-orange-50 to-red-50 flex flex-col relative">
        
        {/* Header with Date and Clock */}
        <AuthHeader />

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col justify-center px-8 py-6">
          <div className="w-full space-y-6">
            {/* Logo and Welcome */}
            <div className="text-center space-y-3">
              <div className="flex flex-col items-center justify-center mb-6 space-y-3">
                <Logo size="lg" />
                <h1 className="text-3xl font-bold text-gray-900">DesiDestinations</h1>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                Discover incredible India, one destination at a time
              </p>
              <p className="text-sm text-amber-700 font-medium">
                आपका स्वागत है! Welcome to your travel companion
              </p>
            </div>

            {/* User Not Found Message */}
            {showUserNotFound && (
              <UserNotFoundDialog
                onProceedToRegister={handleProceedToRegister}
                onStayOnLogin={handleStayOnLogin}
              />
            )}

            {/* Forgot Password Form */}
            {mode === 'forgot' && !showUserNotFound && (
              <ForgotPasswordForm
                resetEmail={resetEmail}
                resetLinkSent={resetLinkSent}
                isLoading={isLoading}
                onEmailChange={setResetEmail}
                onSubmit={handleForgotPassword}
                onBackToLogin={() => switchMode('login')}
              />
            )}

            {/* Login Form */}
            {mode === 'login' && !showUserNotFound && (
              <LoginForm
                email={email}
                password={password}
                showPassword={showPassword}
                passwordError={passwordError}
                isLoading={isLoading}
                onEmailChange={setEmail}
                onPasswordChange={(pwd) => {
                  setPassword(pwd);
                  if (passwordError) setPasswordError('');
                }}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleLogin}
                onForgotPassword={() => switchMode('forgot')}
                onSwitchToRegister={() => switchMode('register')}
              />
            )}

            {/* Registration Form */}
            {mode === 'register' && !showUserNotFound && (
              <RegisterForm
                name={name}
                email={email}
                password={password}
                phone={phone}
                showPassword={showPassword}
                isLoading={isLoading}
                onNameChange={setName}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onPhoneChange={setPhone}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleRegister}
                onSwitchToLogin={() => switchMode('login')}
              />
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
      <ImageGallery images={indianImages} />
    </div>
  );
};

export default LoginFormContainer;
