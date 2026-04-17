
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, signInWithGoogle, logout, db } from '../firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, onSnapshot, setDoc } from 'firebase/firestore';
import { syncFromCloud, getGeminiApiKey, clearAllLocalData } from '../../services/storage';

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
  const [isActive, setIsActive] = useState(() => {
    const profile = localStorage.getItem('lovelya_profile');
    if (profile) {
      try {
        return JSON.parse(profile).isActive || false;
      } catch (e) {
        return false;
      }
    }
    return false;
  });
  const [hasApiKey, setHasApiKey] = useState(() => !!localStorage.getItem('lovelya_gemini_api_key'));
  const [isSyncing, setIsSyncing] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  useEffect(() => {
    let unsubscribeStatus: (() => void) | null = null;

    const unsubscribeAuth = onAuthStateChanged(auth, async (firebaseUser) => {
      setUser(firebaseUser);
      setHasApiKey(!!localStorage.getItem('lovelya_gemini_api_key'));
      
      if (firebaseUser) {
        setIsSyncing(true);
        // Initial sync
        syncFromCloud().finally(() => {
          setIsSyncing(false);
          setHasApiKey(!!localStorage.getItem('lovelya_gemini_api_key'));
        });

        // Real-time status sync
        unsubscribeStatus = onSnapshot(doc(db, `users/${firebaseUser.uid}`), (snap) => {
          if (snap.exists()) {
            const data = snap.data();
            setIsActive(data.isActive || false);
          } else {
            // New user - minimal doc to ensure it exists
            setDoc(doc(db, `users/${firebaseUser.uid}`), {
              email: firebaseUser.email,
              name: firebaseUser.displayName,
              createdAt: new Date().toISOString()
            }, { merge: true }).catch(console.error);
          }
        }, (err) => {
          console.error("Status snapshot error:", err);
        });

      } else {
        setIsActive(false);
        setHasApiKey(false);
        setIsSyncing(false);
        if (unsubscribeStatus) unsubscribeStatus();
      }
      setLoading(false);
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeStatus) unsubscribeStatus();
    };
  }, []);

  const login = async () => {
    if (isLoggingIn) return;
    setIsLoggingIn(true);
    try {
      await signInWithGoogle();
    } catch (error: any) {
      if (error.code === 'auth/cancelled-popup-request' || error.code === 'auth/popup-closed-by-user') {
        console.log("Login popup was closed.");
      } else {
        console.error("Login error:", error);
        const confirmNewTab = window.confirm(
          "Waduh! Sepertinya browser Anda memblokir jendela login (Pop-up).\n\nIngin membuka aplikasi di Tab Baru agar login lebih stabil dan lancar?"
        );
        if (confirmNewTab) {
          window.open(window.location.href, '_blank');
        } else {
          alert("Ops! Sepertinya ada kendala saat masuk. Pastikan popup diizinkan. Error: " + error.message);
        }
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const signout = async () => {
    try {
      await logout();
      clearAllLocalData();
    } catch (e) {
      console.error("Signout error:", e);
    }
  };

  const checkStatus = async (uid: string) => {
    try {
      const snap = await getDoc(doc(db, `users/${uid}`));
      if (snap.exists()) {
        const data = snap.data();
        setIsActive(data.isActive || false);
      }
    } catch (e) {
      console.error("Manual status check error:", e);
    }
  };

  const refreshStatus = async () => {
    setHasApiKey(!!localStorage.getItem('lovelya_gemini_api_key'));
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
