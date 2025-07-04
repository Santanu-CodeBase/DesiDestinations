import React, { useState } from 'react';
import { MapPin, Mail, ArrowRight } from 'lucide-react';

interface LoginFormProps {
  onLogin: (email: string) => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    onLogin(email);
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-white to-green-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
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

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-orange-100">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Start Your Journey
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

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-3 px-4 rounded-lg font-medium hover:from-orange-600 hover:to-orange-700 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              ) : (
                <>
                  <span>Explore India</span>
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center text-sm text-gray-500">
            Simple email login • No passwords needed • Start exploring instantly
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