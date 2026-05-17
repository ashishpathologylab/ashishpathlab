import { db } from '@/lib/firebase';
import {
  doc,
  getDoc,
  updateDoc,
  setDoc,
  collection,
  addDoc,
  getDocs,
  query,
  where,
  orderBy,
  serverTimestamp,
} from 'firebase/firestore';

export interface Plan {
  id: string;
  name: string;
  price: number;
  duration: number;
  features: string[];
  isPopular?: boolean;
  maxPatients?: number;
  maxReports?: number;
  maxStaff?: number;
  hasWhatsApp?: boolean;
  hasSMS?: boolean;
  hasB2B?: boolean;
  hasAnalytics?: boolean;
}

export interface Subscription {
  id: string;
  labId: string;
  planId: string;
  planName: string;
  amount: number;
  status: 'Active' | 'Expired' | 'Cancelled' | 'Pending';
  startDate: string;
  endDate: string;
  paymentMethod?: string;
  transactionId?: string;
  isAutoRenew?: boolean;
  createdAt: string;
  updatedAt: string;
}

export const PLANS: Plan[] = [
  {
    id: 'trial',
    name: 'Free Trial',
    price: 0,
    duration: 14,
    features: ['Up to 50 patients', 'Up to 100 reports', 'Basic reports', 'Email support'],
    maxPatients: 50,
    maxReports: 100,
    maxStaff: 1,
  },
  {
    id: 'basic',
    name: 'Basic',
    price: 499,
    duration: 30,
    features: ['Unlimited patients', 'Up to 500 reports/month', 'WhatsApp integration', 'Email support'],
    maxPatients: 1000,
    maxReports: 500,
    maxStaff: 3,
    hasWhatsApp: true,
  },
  {
    id: 'professional',
    name: 'Professional',
    price: 999,
    duration: 30,
    features: ['Unlimited patients & reports', 'WhatsApp + SMS', 'B2B module', 'Advanced analytics', 'Priority support'],
    isPopular: true,
    maxPatients: -1,
    maxReports: -1,
    maxStaff: 10,
    hasWhatsApp: true,
    hasSMS: true,
    hasB2B: true,
    hasAnalytics: true,
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    price: 2499,
    duration: 30,
    features: ['Everything in Professional', 'Custom letterhead', 'API access', 'Dedicated manager', '99.9% uptime SLA'],
    maxPatients: -1,
    maxReports: -1,
    maxStaff: -1,
    hasWhatsApp: true,
    hasSMS: true,
    hasB2B: true,
    hasAnalytics: true,
  },
];

export async function getLabSubscription(labId: string): Promise<Subscription | null> {
  const q = query(
    collection(db, 'subscriptions'),
    where('labId', '==', labId),
    orderBy('createdAt', 'desc'),
    // limit(1) removed for Firestore composite index simplicity
  );
  const snap = await getDocs(q);
  if (snap.empty) return null;
  const doc = snap.docs[0];
  return { id: doc.id, ...doc.data() } as Subscription;
}

export async function createSubscription(
  data: Omit<Subscription, 'id' | 'createdAt' | 'updatedAt'>
): Promise<string> {
  const docRef = await addDoc(collection(db, 'subscriptions'), {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });
  return docRef.id;
}

export async function isLabPremium(labId: string): Promise<boolean> {
  const sub = await getLabSubscription(labId);
  if (!sub) return false;
  return sub.status === 'Active' && new Date(sub.endDate) > new Date();
}