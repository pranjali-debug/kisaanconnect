import React, { useState } from 'react';
import { useAuth, UserType } from '../../contexts/AuthContext';
import { UserPlus, Tractor, Building2, ArrowRight } from 'lucide-react';

interface SignupFormProps {
  onClose: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onClose }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [farmerName, setFarmerName] = useState('');
  const [ngoName, setNgoName] = useState('');
  const [userType, setUserType] = useState<UserType>(null);
  const [step, setStep] = useState<'type' | 'details'>(userType ? 'details' : 'type');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { signUp, signInWithGoogle, setError } = useAuth();

  const handleSelectUserType = (type: UserType) => {
    setUserType(type);
    setStep('details');
  };
  
  const handleBack = () => {
    setStep('type');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !confirmPassword || !userType) {
      setError('Please fill in all required fields and select an account type');
      return;
    }
    
    if (userType === 'farmer' && !farmerName) {
      setError('Please enter your name');
      return;
    }
    
    if (userType === 'ngo' && !ngoName) {
      setError('Please enter your organization name');
      return;
    }
    
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const additionalData = userType === 'farmer' 
        ? { farmerName } 
        : { ngoName };
        
      await signUp(email, password, userType, additionalData);
      onClose();
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleSignUp = async () => {
    if (!userType) {
      setError('Please select an account type first');
      return;
    }
    
    if (userType === 'farmer' && !farmerName) {
      setError('Please enter your name');
      return;
    }
    
    if (userType === 'ngo' && !ngoName) {
      setError('Please enter your organization name');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const additionalData = userType === 'farmer' 
        ? { farmerName } 
        : { ngoName };
        
      await signInWithGoogle(userType, additionalData);
      onClose();
    } catch (error) {
      // Error is handled in the auth context
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      {step === 'type' ? (
        <>
          <div className="text-center mb-5">
            <h3 className="text-lg font-medium text-kisaan-darkbrown mb-3">
              I want to join as a:
            </h3>
            <p className="text-sm text-gray-500">
              Please select the type of account you want to create
            </p>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              type="button"
              onClick={() => handleSelectUserType('farmer')}
              className="p-4 border-2 rounded-lg hover:border-kisaan-green group transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-kisaan-cream rounded-full flex items-center justify-center mb-3 group-hover:bg-kisaan-green/10 transition-colors">
                  <Tractor className="h-8 w-8 text-kisaan-green" />
                </div>
                <h3 className="font-medium text-kisaan-darkbrown">Farmer</h3>
                <p className="text-xs text-gray-500 mt-1">I want to sell my agricultural produce</p>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleSelectUserType('ngo')}
              className="p-4 border-2 rounded-lg hover:border-kisaan-green group transition-all"
            >
              <div className="flex flex-col items-center text-center">
                <div className="w-14 h-14 bg-kisaan-cream rounded-full flex items-center justify-center mb-3 group-hover:bg-kisaan-green/10 transition-colors">
                  <Building2 className="h-8 w-8 text-kisaan-green" />
                </div>
                <h3 className="font-medium text-kisaan-darkbrown">NGO/Buyer</h3>
                <p className="text-xs text-gray-500 mt-1">I want to buy agricultural produce</p>
              </div>
            </button>
          </div>

          <div className="text-center text-sm text-gray-500">
            <p>Already have an account? Use the login tab above.</p>
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center mb-4">
            <button onClick={handleBack} className="text-kisaan-green hover:underline text-sm flex items-center">
              <ArrowRight className="h-3 w-3 rotate-180 mr-1" /> Back to account type
            </button>
            
            <div className="ml-auto flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-2 ${
                userType === 'farmer' ? 'bg-kisaan-cream' : 'bg-gray-100'
              }`}>
                <Tractor className={`h-4 w-4 ${
                  userType === 'farmer' ? 'text-kisaan-green' : 'text-gray-400'
                }`} />
              </div>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                userType === 'ngo' ? 'bg-kisaan-cream' : 'bg-gray-100'
              }`}>
                <Building2 className={`h-4 w-4 ${
                  userType === 'ngo' ? 'text-kisaan-green' : 'text-gray-400'
                }`} />
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {userType === 'farmer' && (
              <div>
                <label htmlFor="farmer-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="farmer-name"
                  type="text"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green focus:border-transparent"
                  placeholder="Enter your full name"
                  disabled={isSubmitting}
                />
              </div>
            )}

            {userType === 'ngo' && (
              <div>
                <label htmlFor="ngo-name" className="block text-sm font-medium text-gray-700 mb-1">
                  Organization Name <span className="text-red-500">*</span>
                </label>
                <input
                  id="ngo-name"
                  type="text"
                  value={ngoName}
                  onChange={(e) => setNgoName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green focus:border-transparent"
                  placeholder="Enter your organization name"
                  disabled={isSubmitting}
                />
              </div>
            )}

            <div>
              <label htmlFor="signup-email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green focus:border-transparent"
                placeholder="you@example.com"
                disabled={isSubmitting}
              />
            </div>
            
            <div>
              <label htmlFor="signup-password" className="block text-sm font-medium text-gray-700 mb-1">
                Password <span className="text-red-500">*</span>
              </label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green focus:border-transparent"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              <p className="text-xs text-gray-500 mt-1">Password must be at least 6 characters</p>
            </div>
            
            <div>
              <label htmlFor="confirm-password" className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password <span className="text-red-500">*</span>
              </label>
              <input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-kisaan-green focus:border-transparent"
                placeholder="••••••••"
                disabled={isSubmitting}
              />
            </div>
            
            <div className="flex items-center">
              <input
                id="terms"
                type="checkbox"
                className="h-4 w-4 text-kisaan-green focus:ring-kisaan-green border-gray-300 rounded"
              />
              <label htmlFor="terms" className="ml-2 block text-xs text-gray-700">
                I agree to the <a href="#" className="text-kisaan-green hover:underline">Terms of Service</a> and <a href="#" className="text-kisaan-green hover:underline">Privacy Policy</a>
              </label>
            </div>
            
            <button
              type="submit"
              className="w-full bg-kisaan-green text-white py-2 px-4 rounded-md hover:bg-kisaan-green/90 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating account...' : (
                <>
                  <UserPlus size={16} />
                  <span>Create {userType === 'farmer' ? 'Farmer' : 'NGO'} Account</span>
                </>
              )}
            </button>
          </form>
          
          <div className="mt-5 pt-5 border-t text-center">
            <p className="text-sm text-gray-500 mb-4">Or continue with</p>
            <button
              type="button"
              onClick={handleGoogleSignUp}
              className="w-full border border-gray-300 py-2 px-4 rounded-md hover:bg-gray-50 transition-colors flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              disabled={isSubmitting}
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              <span>Sign up with Google</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default SignupForm;