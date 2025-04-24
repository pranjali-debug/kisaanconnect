import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import { useAuth } from '../../contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialTab?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ 
  isOpen, 
  onClose,
  initialTab = 'login'
}) => {
  const [activeTab, setActiveTab] = useState<'login' | 'signup'>(initialTab);
  const { error, setError } = useAuth();

  // Close modal on ESC key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden'; // Prevent scrolling when modal is open
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'auto';
    };
  }, [isOpen, onClose]);

  // Reset error when changing tabs
  useEffect(() => {
    setError(null);
  }, [activeTab, setError]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 backdrop-blur-sm">
      <div 
        className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden border border-gray-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex justify-between items-center p-5 border-b">
          <h2 className="text-xl font-semibold text-kisaan-darkbrown">
            {activeTab === 'login' ? 'Welcome Back' : 'Join KisaanConnect'}
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors hover:bg-gray-100 p-1.5 rounded-full"
          >
            <X size={20} />
          </button>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b">
          <div className="w-full relative">
            <div className="flex">
              <button
                className={`w-1/2 py-3 text-center font-medium transition-colors ${
                  activeTab === 'login' ? 'text-kisaan-darkbrown' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('login')}
              >
                Login
              </button>
              <button
                className={`w-1/2 py-3 text-center font-medium transition-colors ${
                  activeTab === 'signup' ? 'text-kisaan-darkbrown' : 'text-gray-500'
                }`}
                onClick={() => setActiveTab('signup')}
              >
                Sign Up
              </button>
            </div>
            <div
              className="absolute bottom-0 h-1 bg-kisaan-green transition-all duration-300 rounded-t-full"
              style={{
                width: '50%',
                transform: `translateX(${activeTab === 'login' ? '0%' : '100%'})`,
              }}
            ></div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 text-red-600 p-3 text-sm mx-5 my-3 rounded-md border border-red-100">
            <p>{error}</p>
          </div>
        )}

        {/* Form Content */}
        <div className="p-6">
          {activeTab === 'login' ? (
            <LoginForm onClose={onClose} />
          ) : (
            <SignupForm onClose={onClose} />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;