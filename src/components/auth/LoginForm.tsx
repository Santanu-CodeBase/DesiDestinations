import React, { useState } from 'react';
import { LogIn, Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface LoginFormProps {
  email: string;
  password: string;
  showPassword: boolean;
  passwordError: string;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onPasswordChange: (password: string) => void;
  onTogglePassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onForgotPassword: () => void;
  onSwitchToRegister: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({
  email,
  password,
  showPassword,
  passwordError,
  isLoading,
  onEmailChange,
  onPasswordChange,
  onTogglePassword,
  onSubmit,
  onForgotPassword,
  onSwitchToRegister
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100 space-y-4">
      <form onSubmit={onSubmit} className="space-y-4">
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
              onChange={(e) => onEmailChange(e.target.value)}
              className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm bg-white text-gray-900 placeholder-gray-500 disabled:bg-white disabled:text-gray-900 disabled:opacity-100"
              placeholder="Enter your email"
              disabled={isLoading}
              required
              autoComplete="email"
              style={{ backgroundColor: 'white', color: '#111827' }}
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
              onChange={(e) => onPasswordChange(e.target.value)}
              className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 outline-none transition-all text-sm ${
                passwordError 
                  ? 'border-red-500 focus:ring-red-500 focus:border-red-500' 
                  : 'border-gray-300 focus:ring-amber-500 focus:border-amber-500'
              }`}
              placeholder="Enter your password"
              required
            />
            <button
              type="button"
              onClick={onTogglePassword}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
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
        </div>

        <div className="text-right">
          <button
            type="button"
            onClick={onForgotPassword}
            className="text-sm text-amber-600 hover:text-amber-700 font-medium"
          >
            Forgot Password?
          </button>
        </div>

        <button
          type="submit"
          disabled={isLoading || password.length < 3}
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
            onClick={onSwitchToRegister}
            className="ml-1 text-amber-600 hover:text-amber-700 font-medium"
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;