import React from 'react';
import { Mail, ArrowRight } from 'lucide-react';

interface ForgotPasswordFormProps {
  resetEmail: string;
  resetLinkSent: boolean;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: (e: React.FormEvent) => void;
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  resetEmail,
  resetLinkSent,
  isLoading,
  onEmailChange,
  onSubmit,
  onBackToLogin
}) => {
  return (
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
        <form onSubmit={onSubmit} className="space-y-4">
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
                onChange={(e) => onEmailChange(e.target.value)}
                className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm bg-white text-gray-900 placeholder-gray-500"
                placeholder="Enter your email"
                disabled={false}
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
              onClick={onBackToLogin}
              className="text-amber-600 hover:text-amber-700 font-medium text-sm"
            >
              Back to Login
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ForgotPasswordForm;