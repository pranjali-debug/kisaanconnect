import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  User, 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithPopup 
} from 'firebase/auth';
import { auth, db, googleProvider } from '../firebase/config';
import { doc, setDoc, getDoc } from 'firebase/firestore';

export type UserType = 'farmer' | 'ngo' | null;

interface UserData {
  email: string;
  userType: UserType;
  displayName?: string;
  photoURL?: string;
  createdAt: Date;
  // Additional fields for different user types
  farmerName?: string;
  ngoName?: string;
}

interface AuthContextProps {
  currentUser: User | null;
  userData: UserData | null;
  userType: UserType;
  loading: boolean;
  signUp: (email: string, password: string, userType: UserType, additionalData: {
    farmerName?: string;
    ngoName?: string;
  }) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  signInWithGoogle: (userType: UserType, additionalData: {
    farmerName?: string;
    ngoName?: string;
  }) => Promise<void>;
  error: string | null;
  setError: (error: string | null) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [userType, setUserType] = useState<UserType>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch user data from Firestore
  const fetchUserData = async (user: User) => {
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (userDoc.exists()) {
        const userData = userDoc.data() as UserData;
        setUserData(userData);
        setUserType(userData.userType);
      } else {
        setUserData(null);
        setUserType(null);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      
      if (user) {
        await fetchUserData(user);
      } else {
        setUserData(null);
        setUserType(null);
      }
      
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, password: string, userType: UserType, additionalData: {
    farmerName?: string;
    ngoName?: string;
  }) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user data to Firestore
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        userType,
        createdAt: new Date(),
        ...additionalData,
      });
      
      // Update local state
      setUserType(userType);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const login = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const signInWithGoogle = async (userType: UserType, additionalData: {
    farmerName?: string;
    ngoName?: string;
  }) => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      
      // Check if user already exists
      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);
      
      if (!userDoc.exists()) {
        // New user - save user type
        await setDoc(userDocRef, {
          email: user.email,
          userType,
          displayName: user.displayName,
          photoURL: user.photoURL,
          createdAt: new Date(),
          ...additionalData,
        });
      }
      
      // Existing user - will use their stored user type
    } catch (error: any) {
      setError(error.message);
      throw error;
    }
  };

  const value = {
    currentUser,
    userData,
    userType,
    loading,
    signUp,
    login,
    logout,
    signInWithGoogle,
    error,
    setError
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};