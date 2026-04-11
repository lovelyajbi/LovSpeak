
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import { syncFromCloud, getGeminiApiKey } from '../../services/storage';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isActive: boolean;
  hasApiKey: boolean;
  isSyncing: boolean;
  isLoggingIn: boolean;
  login: () => Promise<void>;
  signout: () => Promise<void>;
  refreshStatus: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [hasApiKey, setHasApiKey] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      if (firebaseUser) {
        setIsSyncing(true);
        syncFromCloud().finally(() => {
          setIsSyncing(false);
          checkStatus(firebaseUser.uid);
        });
        checkStatus(firebaseUser.uid);
      } else {
        setIsActive(false);
        setHasApiKey(false);
        setIsSyncing(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const checkStatus = async (uid: string) => {
    try {
      const userDoc = await getDoc(doc(db, `users/${uid}`));
      if (userDoc.exists()) {
        setIsActive(userDoc.data().isActive || false);
      } else {
        setIsActive(false);
      }
      setHasApiKey(!!getGeminiApiKey());
    } catch (e) {
      console.error("Status check error:", e);
    }
  };

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log("Login popup was closed or replaced.");
      } else {
        console.error("Login error:", error);
        throw error;
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signout = async () => {
    await logout();
  };

  const refreshStatus = async () => {
    if (user) await checkStatus(user.uid);
  };

  return (
    <AuthContext.Provider value={{ user, loading, isActive, hasApiKey, isSyncing, isLoggingIn, login, signout, refreshStatus }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
