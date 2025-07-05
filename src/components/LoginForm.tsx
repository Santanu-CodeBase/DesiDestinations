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
  // Form state
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  
  // UI state
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'userNotFound'>('login');
  
  // Reset password state
  const [resetEmail, setResetEmail] = useState('');
  const [resetLinkSent, setResetLinkSent] = useState(false);
  
  // Error states
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');

  // Clear specific problematic email on component mount
  React.useEffect(() => {
    const problematicEmail = 'susmita.work@gmail.com';
    const cleanEmail = problematicEmail.toLowerCase();
    
    // Remove any stored data for this specific email
    localStorage.removeItem(`desiDestinations_user_${cleanEmail}`);
    
    // If this email is currently set as logged in, clear it
    const currentLoggedEmail = localStorage.getItem('desiDestinationsEmail');
    if (currentLoggedEmail && currentLoggedEmail.toLowerCase() === cleanEmail) {
      localStorage.removeItem('desiDestinationsEmail');
    }
  }, []);
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

  // Validation functions
  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
  };

  const validatePassword = (password: string): boolean => {
    return password.length >= 6;
  };

  const validateName = (name: string): boolean => {
    return name.trim().length >= 2;
  };

  const validatePhone = (phone: string): boolean => {
    if (!phone) return true; // Optional field
    const phoneRegex = /^\d{10}$/;
    return phoneRegex.test(phone);
  };

  // Clear all errors
  const clearErrors = () => {
    setPasswordError('');
    setEmailError('');
    setNameError('');
    setPhoneError('');
  };

  // Clear form data
  const clearForm = () => {
    setPassword('');
    setName('');
    setPhone('');
    setShowPassword(false);
    clearErrors();
  };

  // Check if user exists in localStorage
  const getUserData = (email: string): UserData | null => {
    try {
      const cleanEmail = email.trim().toLowerCase();
      const userData = localStorage.getItem(`desiDestinations_user_${cleanEmail}`);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error reading user data:', error);
      return null;
    }
  };

  // Save user data to localStorage
  const saveUserData = (userData: UserData): boolean => {
    try {
      const cleanEmail = userData.email.trim().toLowerCase();
      localStorage.setItem(`desiDestinations_user_${cleanEmail}`, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error('Error saving user data:', error);
      return false;
    }
  };

  // Handle login form submission
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    // Validate inputs
    if (!email.trim()) {
      setEmailError('Email is required');
      return;
    }
    
    if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      return;
    }
    
    if (!password.trim()) {
      setPasswordError('Password is required');
      return;
    }

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      const cleanEmail = email.trim().toLowerCase();
      const userData = getUserData(cleanEmail);
      
      if (!userData) {
        // User doesn't exist - show user not found dialog
        clearErrors(); // Clear any existing errors
        setMode('userNotFound');
        setIsLoading(false);
        return;
      }

      if (userData.password !== password) {
        setPasswordError('Incorrect userid /password. Please check and try again.');
        setIsLoading(false);
        return;
      }
      
      // Successful login
      localStorage.setItem('desiDestinationsEmail', cleanEmail);
      onLogin(cleanEmail);
    } catch (error) {
      console.error('Login error:', error);
      setPasswordError('An error occurred during login. Please try again.');
    }
    
    setIsLoading(false);
  };

  // Handle registration form submission
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    let hasErrors = false;

    // Validate all fields
    if (!name.trim()) {
      setNameError('Full name is required');
      hasErrors = true;
    } else if (!validateName(name)) {
      setNameError('Name must be at least 2 characters long');
      hasErrors = true;
    }

    if (!email.trim()) {
      setEmailError('Email is required');
      hasErrors = true;
    } else if (!validateEmail(email)) {
      setEmailError('Please enter a valid email address');
      hasErrors = true;
    }

    if (!password) {
      setPasswordError('Password is required');
      hasErrors = true;
    } else if (password.length < 6) {
      setPasswordError('Password must be at least 6 characters long');
      hasErrors = true;
    }

    if (phone && !validatePhone(phone)) {
      setPhoneError('Please enter a valid 10-digit phone number');
      hasErrors = true;
    }

    if (hasErrors) return;

    setIsLoading(true);
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    try {
      // Check if user already exists
      const cleanEmail = email.trim().toLowerCase();
      const existingUser = getUserData(cleanEmail);
      if (existingUser) {
        setEmailError('Account already exists with this email. Please sign in instead.');
        setIsLoading(false);
        return;
      }

      // Create new user
      const newUser: UserData = {
        name: name.trim(),
        email: cleanEmail,
        password: password,
        phone: phone ? `+91 ${phone}` : undefined,
        createdAt: new Date().toISOString()
      };

      const saved = saveUserData(newUser);
      if (!saved) {
        setPasswordError('Failed to create account. Please try again.');
        setIsLoading(false);
        return;
      }

      // Auto-login after successful registration
      localStorage.setItem('desiDestinationsEmail', cleanEmail);
      onLogin(cleanEmail);
    } catch (error) {
      console.error('Registration error:', error);
      setPasswordError('An error occurred during registration. Please try again.');
      setIsLoading(false);
    }
    
    setIsLoading(false);
  };

  // Handle forgot password form submission
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearErrors();
    
    if (!resetEmail.trim()) {
      return;
    }

    if (!validateEmail(resetEmail)) {
      return;
    }

    setIsLoading(true);
    
    // Simulate sending reset email
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setResetLinkSent(true);
    setIsLoading(false);
    
    // Auto-return to login after 5 seconds
    setTimeout(() => {
      setResetLinkSent(false);
      switchToMode('login');
    }, 5000);
  };

  // Switch between different modes
  const switchToMode = (newMode: 'login' | 'register' | 'forgot') => {
    clearForm();
    setResetEmail('');
    setResetLinkSent(false);
    setMode(newMode);
  };

  // Handle proceeding to registration from user not found dialog
  const handleProceedToRegister = () => {
    clearErrors();
    setPassword(''); // Clear password but keep email
    setName('');
    setPhone('');
    setShowPassword(false);
    // Keep the email that was entered
    setMode('register');
  };

  // Handle staying on login from user not found dialog
  const handleStayOnLogin = () => {
    clearErrors();
    setPassword('');
    // Keep the email that was entered
    setMode('login');
  };

  // Handle email change with error clearing
  const handleEmailChange = (newEmail: string) => {
    setEmail(newEmail);
    if (emailError) setEmailError('');
  };

  // Handle password change with error clearing
  const handlePasswordChange = (newPassword: string) => {
    setPassword(newPassword);
    if (passwordError) setPasswordError('');
  };

  // Handle name change with error clearing
  const handleNameChange = (newName: string) => {
    setName(newName);
    if (nameError) setNameError('');
  };

  // Handle phone change with error clearing
  const handlePhoneChange = (newPhone: string) => {
    setPhone(newPhone);
    if (phoneError) setPhoneError('');
  };

  return (
    <div className="min-h-screen flex">
      {/* Left Panel - Authentication Forms (40% width) */}
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

            {/* User Not Found Dialog */}
            {mode === 'userNotFound' && !isLoading && (
              <UserNotFoundDialog
                onProceedToRegister={handleProceedToRegister}
                onStayOnLogin={handleStayOnLogin}
              />
            )}

            {/* Forgot Password Form */}
            {mode === 'forgot' && !isLoading && (
              <ForgotPasswordForm
                resetEmail={resetEmail}
                resetLinkSent={resetLinkSent}
                isLoading={isLoading}
                onEmailChange={setResetEmail}
                onSubmit={handleForgotPassword}
                onBackToLogin={() => switchToMode('login')}
              />
            )}

            {/* Login Form */}
            {mode === 'login' && !isLoading && (
              <LoginForm
                email={email}
                password={password}
                showPassword={showPassword}
                passwordError={passwordError}
                emailError={emailError}
                isLoading={isLoading}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleLogin}
                onForgotPassword={() => switchToMode('forgot')}
                onSwitchToRegister={() => switchToMode('register')}
              />
            )}

            {/* Registration Form */}
            {mode === 'register' && !isLoading && (
              <RegisterForm
                name={name}
                email={email}
                password={password}
                phone={phone}
                showPassword={showPassword}
                isLoading={isLoading}
                nameError={nameError}
                emailError={emailError}
                passwordError={passwordError}
                phoneError={phoneError}
                onNameChange={handleNameChange}
                onEmailChange={handleEmailChange}
                onPasswordChange={handlePasswordChange}
                onPhoneChange={handlePhoneChange}
                onTogglePassword={() => setShowPassword(!showPassword)}
                onSubmit={handleRegister}
                onSwitchToLogin={() => switchToMode('login')}
              />
            )}

            {/* Loading State */}
            {isLoading && (
              <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100 text-center space-y-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto"></div>
                <p className="text-gray-600">Processing...</p>
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
      <ImageGallery images={indianImages} />
    </div>
  );
};

export default LoginFormContainer;