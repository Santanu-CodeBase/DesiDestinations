import React from 'react';
import { Mail, ArrowRight, Key, Eye, EyeOff } from 'lucide-react';

interface ForgotPasswordFormProps {
  resetEmail: string;
  resetLinkSent: boolean;
  resetToken: string | null;
  newPassword: string;
  confirmPassword: string;
  showNewPassword: boolean;
  showConfirmPassword: boolean;
  passwordError: string;
  tokenExpiry: Date | null;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onNewPasswordChange: (password: string) => void;
  onConfirmPasswordChange: (password: string) => void;
  onToggleNewPassword: () => void;
  onToggleConfirmPassword: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onResetPassword: (e: React.FormEvent) => void;
  onUseResetLink: () => void;
  onBackToLogin: () => void;
}

const ForgotPasswordForm: React.FC<ForgotPasswordFormProps> = ({
  resetEmail,
  resetLinkSent,
  resetToken,
  newPassword,
  confirmPassword,
  showNewPassword,
  showConfirmPassword,
  passwordError,
  tokenExpiry,
  isLoading,
  onEmailChange,
  onNewPasswordChange,
  onConfirmPasswordChange,
  onToggleNewPassword,
  onToggleConfirmPassword,
  onSubmit,
  onResetPassword,
  onUseResetLink,
  onBackToLogin
}) => {
  const [timeRemaining, setTimeRemaining] = React.useState<string>('');

  // Update countdown timer
  React.useEffect(() => {
    if (!tokenExpiry) return;

    const updateTimer = () => {
      const now = new Date();
      const diff = tokenExpiry.getTime() - now.getTime();
      
      if (diff <= 0) {
        setTimeRemaining('Expired');
        return;
      }

      const minutes = Math.floor(diff / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [tokenExpiry]);

  const isTokenExpired = tokenExpiry && new Date() > tokenExpiry;

  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-amber-100 space-y-4">
      {resetToken ? (
        // Password Reset Form
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
              <Key className="h-6 w-6 text-blue-600" />
            </div>
            <h2 className="text-lg font-semibold text-gray-900">
              Reset Your Password
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your new password below
            </p>
            {tokenExpiry && (
              <div className={`text-sm font-medium ${
                isTokenExpired ? 'text-red-600' : timeRemaining.includes(':') && parseInt(timeRemaining.split(':')[0]) < 5 ? 'text-orange-600' : 'text-green-600'
              }`}>
                {isTokenExpired ? '⚠️ Reset link expired' : `⏰ Time remaining: ${timeRemaining}`}
              </div>
            )}
          </div>

          {isTokenExpired ? (
            <div className="text-center space-y-4">
              <p className="text-red-600 text-sm">
                This reset link has expired. Please request a new one.
              </p>
              <button
                onClick={onBackToLogin}
                className="w-full bg-gray-500 hover:bg-gray-600 text-white py-3 px-4 rounded-lg font-medium transition-colors text-sm"
              >
                Back to Login
              </button>
            </div>
          ) : (
            <form onSubmit={onResetPassword} className="space-y-4">
              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    id="newPassword"
                    value={newPassword}
                    onChange={(e) => onNewPasswordChange(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white text-gray-900"
                    placeholder="Enter new password (min 6 characters)"
                    disabled={isLoading}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={onToggleNewPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                  Confirm New Password <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <Key className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={(e) => onConfirmPasswordChange(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all text-sm bg-white text-gray-900"
                    placeholder="Confirm your new password"
                    disabled={isLoading}
                    required
                    minLength={6}
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={onToggleConfirmPassword}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    disabled={isLoading}
                  >
                    {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {passwordError && (
                <p className="text-red-500 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordError}
                </p>
              )}

              <button
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword || newPassword.length < 6}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 text-sm"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Updating Password...</span>
                  </>
                ) : (
                  <>
                    <Key className="h-4 w-4" />
                    <span>Update Password</span>
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  type="button"
                  onClick={onBackToLogin}
                  className="text-gray-600 hover:text-gray-700 font-medium text-sm"
                >
                  Cancel Reset
                </button>
              </div>
            </form>
          )}
        </div>
      ) : resetLinkSent ? (
        // Reset Link Sent State
        <div className="text-center space-y-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <Mail className="h-6 w-6 text-green-600" />
          </div>
          <h3 className="text-lg font-semibold text-green-700">Reset Link Generated!</h3>
          <p className="text-sm text-gray-600 leading-relaxed">
            Your 15-minute reset link is ready. Click the button below to reset your password.
          </p>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-sm text-green-800 mb-3 font-medium">
              🔗 Password Reset Link (Active for 15 minutes)
            </p>
            <button
              onClick={onUseResetLink}
              className="w-full bg-gradient-to-r from-green-500 to-green-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-600 hover:to-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-all flex items-center justify-center space-x-2 text-sm"
            >
              <Key className="h-4 w-4" />
              <span>Use Reset Link</span>
            </button>
          </div>
          
          <div className="text-center">
            <button
              type="button"
              onClick={onBackToLogin}
              className="text-amber-600 hover:text-amber-700 font-medium text-sm"
            >
              Back to Login
            </button>
          </div>
        </div>
      ) : (
        // Email Input Form
        <div className="space-y-4">
          <div className="text-center space-y-2">
            <h2 className="text-lg font-semibold text-gray-900">
              Reset Password
            </h2>
            <p className="text-gray-600 text-sm">
              Enter your email for a 15-minute reset link
            </p>
          </div>
          
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
                  className="w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition-all text-sm bg-white text-gray-900 placeholder-gray-500 disabled:bg-white disabled:text-gray-900 disabled:opacity-100"
                  placeholder="Enter your email"
                  disabled={isLoading}
                  required
                  autoComplete="email"
                />
              </div>
              {passwordError && (
                <p className="text-red-500 text-sm flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {passwordError}
                </p>
              )}
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
                  <span>Generate Reset Link</span>
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
        </div>
      )}
    </div>
  );
};

export default ForgotPasswordForm;