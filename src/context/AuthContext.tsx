'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { UserData } from '@/types';
import { calculateDaysLeft } from '@/lib/utils';

interface AuthContextType {
  user: User | null;
  userData: UserData | null;
  loading: boolean;
  isAdmin: boolean;
  isPremium: boolean;
  trialDaysLeft: number;
  signup: (data: SignupData) => Promise<void>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  refreshUserData: () => Promise<void>;
}

interface SignupData {
  labName: string;
  ownerName: string;
  mobile: string;
  email: string;
  password: string;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = async (uid: string) => {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data() as UserData;
        data.uid = uid;
        setUserData(data);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        await fetchUserData(currentUser.uid);
      } else {
        setUserData(null);
      }
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const signup = async (data: SignupData) => {
    const userCred = await createUserWithEmailAndPassword(auth, data.email, data.password);
    const trialEnd = new Date();
    trialEnd.setDate(trialEnd.getDate() + 5);

    const userDataToSave: Omit<UserData, 'uid'> = {
      labName: data.labName,
      ownerName: data.ownerName,
      mobile: data.mobile,
      email: data.email,
      role: 'user',
      premium: false,
      trialStart: new Date().toISOString(),
      trialEnd: trialEnd.toISOString(),
      plan: 'trial',
      createdAt: serverTimestamp(),
    };

    await setDoc(doc(db, 'users', userCred.user.uid), userDataToSave);
  };

  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  const logout = async () => {
    await signOut(auth);
    setUserData(null);
  };

  const resetPassword = async (email: string) => {
    await sendPasswordResetEmail(auth, email);
  };

  const refreshUserData = async () => {
    if (user) await fetchUserData(user.uid);
  };

  const isAdmin = userData?.role === 'admin';
  const isPremium = userData?.premium === true;
  const trialDaysLeft = userData?.trialEnd ? calculateDaysLeft(userData.trialEnd) : 0;

  return (
    <AuthContext.Provider
      value={{
        user,
        userData,
        loading,
        isAdmin,
        isPremium,
        trialDaysLeft,
        signup,
        login,
        logout,
        resetPassword,
        refreshUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};