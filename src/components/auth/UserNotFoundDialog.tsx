import React from 'react';
import { UserPlus } from 'lucide-react';

interface UserNotFoundDialogProps {
  onProceedToRegister: () => void;
  onStayOnLogin: () => void;
}

const UserNotFoundDialog: React.FC<UserNotFoundDialogProps> = ({
  onProceedToRegister,
  onStayOnLogin
}) => {
  return (
    <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-xl p-6 border border-orange-200 text-center space-y-4">
      <div className="flex justify-center">
        <div className="relative">
          <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center shadow-lg" style={{background: 'linear-gradient(135deg, #FF9933 0%, #000080 100%)'}}>
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <circle cx="12" cy="12" r="10" strokeWidth="2"/>
              <polygon points="16.24,7.76 14.12,14.12 7.76,16.24 9.88,9.88 16.24,7.76" strokeWidth="2" fill="currentColor"/>
            </svg>
          </div>
          <div className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center shadow-md" style={{backgroundColor: '#138808'}}>
            <svg className="w-2 h-2 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
            </svg>
          </div>
        </div>
      </div>
      <h3 className="text-lg font-semibold" style={{color: '#000080'}}>
        Start Your Journey
      </h3>
      <p className="text-gray-800 text-sm leading-relaxed">
        We understand you are excited to explore. Please register using the Register link to get started.
      </p>
      <div className="flex space-x-3 justify-center">
        <button
          onClick={onProceedToRegister}
          className="text-white px-4 py-2 rounded-lg font-medium transition-all text-sm flex items-center space-x-2 shadow-md hover:shadow-lg transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #138808 0%, #228B22 100%)',
            boxShadow: '0 4px 15px rgba(19, 136, 8, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #0F6B06 0%, #1F7A1F 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #138808 0%, #228B22 100%)';
          }}
        >
          <UserPlus className="h-4 w-4" />
          <span>Create Account</span>
        </button>
        <button
          onClick={onStayOnLogin}
          className="text-white px-4 py-2 rounded-lg font-medium transition-all text-sm shadow-md hover:shadow-lg transform hover:scale-105"
          style={{
            background: 'linear-gradient(135deg, #FF9933 0%, #FF6600 100%)',
            boxShadow: '0 4px 15px rgba(255, 153, 51, 0.3)'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #E6851F 0%, #E55A00 100%)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'linear-gradient(135deg, #FF9933 0%, #FF6600 100%)';
          }}
        >
          Try Again
        </button>
      </div>
    </div>
  );
};

export default UserNotFoundDialog;