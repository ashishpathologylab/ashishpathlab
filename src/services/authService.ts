import { auth, db } from '@/lib/firebase';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  updateProfile,
  User,
} from 'firebase/auth';
import { doc, setDoc, getDoc, updateDoc, serverTimestamp } from 'firebase/firestore';

export interface AuthUser {
  uid: string;
  email: string;
  displayName: string;
  role: 'user' | 'admin' | 'superadmin';
  labId: string;
  labName: string;
  isPremium: boolean;
  trialEndsAt?: string;
  phone?: string;
  photoURL?: string;
}

export async function registerWithEmail(
  email: string,
  password: string,
  name: string,
  labName: string,
  phone?: string
): Promise<AuthUser> {
  const userCred = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  await updateProfile(user, { displayName: name });

  const labId = `lab_${user.uid.slice(0, 8)}`;
  const trialEnd = new Date();
  trialEnd.setDate(trialEnd.getDate() + 14);

  const userData: AuthUser = {
    uid: user.uid,
    email: user.email!,
    displayName: name,
    role: 'user',
    labId,
    labName,
    isPremium: false,
    trialEndsAt: trialEnd.toISOString(),
    phone,
  };

  await Promise.all([
    setDoc(doc(db, 'users', user.uid), {
      ...userData,
      createdAt: serverTimestamp(),
    }),
    setDoc(doc(db, 'labs', labId), {
      name: labName,
      ownerId: user.uid,
      email: user.email,
      phone,
      isActive: true,
      createdAt: serverTimestamp(),
    }),
  ]);

  return userData;
}

export async function loginWithEmail(
  email: string,
  password: string
): Promise<AuthUser> {
  const userCred = await signInWithEmailAndPassword(auth, email, password);
  const user = userCred.user;

  const userDoc = await getDoc(doc(db, 'users', user.uid));
  if (!userDoc.exists()) throw new Error('User data not found');

  return userDoc.data() as AuthUser;
}

export async function logout(): Promise<void> {
  await signOut(auth);
}

export async function resetPassword(email: string): Promise<void> {
  await sendPasswordResetEmail(auth, email);
}

export async function updateUserProfile(
  uid: string,
  data: Partial<AuthUser>
): Promise<void> {
  await updateDoc(doc(db, 'users', uid), data);
}

export async function getUserData(uid: string): Promise<AuthUser | null> {
  const docSnap = await getDoc(doc(db, 'users', uid));
  return docSnap.exists() ? (docSnap.data() as AuthUser) : null;
}