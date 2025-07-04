import React from 'react';
import { UserPlus, User, Mail, Lock, Eye, EyeOff, Phone } from 'lucide-react';

interface RegisterFormProps {
  name: string;
  email: string;
  password: string;
  phone: string;
  showPassword: boolean;
  isLoading: boolean;
  nameError: string;
  emailError: string;
  passwordError: string;
  phoneError: string;
  onNameChange: (name: string) => void;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onPhoneChange: (phone: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onSwitchToLogin: () => void;
}

const RegisterForm: React.FC<RegisterFormProps> = ({
  name,
  email,
  password,
  phone,
  showPassword,
  isLoading,
  nameError,
  emailError,
  passwordError,
  phoneError,
  onNameChange,
  onEmailChange,
  onPasswordChange,
  onPhoneChange,
  onTogglePassword,
  onSubmit,
  onSwitchToLogin
}) => {
  const isFormValid = name.trim().length >= 2 && 
                     email.trim().length > 0 && 
                     password.length >= 6 && 
                     (!phone || /^\d{10}$/.test(phone));

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100 space-y-4">
      <div className="text-center space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center justify-center space-x-2">
          <UserPlus className="h-5 w-5 text-green-600" />
          <span>Create Account</span>
        </h2>
        <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">
          ✨ Join the Journey
        </div>
      </div>
      
      <form onSubmit={onSubmit} className="space-y-4">
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
              onChange={(e) => onNameChange(e.target.value)}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 outline-none transition-all text-sm ${
                nameError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
              placeholder="Enter your full name"
              disabled={isLoading}
              required
              autoComplete="name"
            />
          </div>
          {nameError && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {nameError}
            </p>
          )}
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
              onChange={(e) => onEmailChange(e.target.value)}
              className={`w-full pl-10 pr-3 py-3 border rounded-lg focus:ring-2 outline-none transition-all text-sm ${
                emailError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
              placeholder="Enter your email"
              disabled={isLoading}
              required
              autoComplete="email"
            />
          </div>
          {emailError && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {emailError}
            </p>
          )}
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
              onChange={(e) => onPasswordChange(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition-all text-sm ${
                passwordError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
              placeholder="Create a password (min 6 characters)"
              disabled={isLoading}
              required
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              disabled={isLoading}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {passwordError && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {passwordError}
            </p>
          )}
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
                  onPhoneChange(value);
                }
              }}
              className={`w-full pl-16 pr-3 py-3 border rounded-lg focus:ring-2 outline-none transition-all text-sm ${
                phoneError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
              placeholder="9876543210"
              disabled={isLoading}
              maxLength={10}
              autoComplete="tel"
            />
          </div>
          {phoneError && (
            <p className="text-red-500 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {phoneError}
            </p>
          )}
          <p className="text-xs text-gray-500 mt-1">10-digit mobile number without country code</p>
        </div>

        <button
          type="submit"
          disabled={isLoading || !isFormValid}
          className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-emerald-600 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              <span>Creating Account...</span>
            </>
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
            onClick={onSwitchToLogin}
            className="ml-1 text-amber-600 hover:text-amber-700 font-medium"
            disabled={isLoading}
          >
            Sign In
          </button>
        </p>
      </div>

      <div className="text-center text-xs text-gray-500">
        🔒 Secure registration • 🛡️ Your data is protected • ⚡ Start exploring instantly
      </div>
    </div>
  );
};

export default RegisterForm;