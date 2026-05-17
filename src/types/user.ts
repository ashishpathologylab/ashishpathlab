import { Timestamp } from 'firebase/firestore';

export type UserRole = 'user' | 'admin' | 'superadmin';

export interface AppUser {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  labId: string;
  labName: string;
  phone?: string;
  photoURL?: string;
  isPremium: boolean;
  trialEndsAt?: string;
  subscriptionId?: string;
  subscriptionPlan?: string;
  subscriptionEndsAt?: string;
  createdAt: string | Timestamp;
  updatedAt: string | Timestamp;
  lastLogin?: string;
  isActive: boolean;
  emailVerified: boolean;
  preferences?: UserPreferences;
  address?: string;
  city?: string;
  state?: string;
  pincode?: string;
  gstNumber?: string;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'en' | 'hi';
  notifications: {
    email: boolean;
    whatsapp: boolean;
    sms: boolean;
    push: boolean;
  };
  currency: string;
  dateFormat: string;
  timeFormat: '12h' | '24h';
  itemsPerPage: number;
  sidebarCollapsed: boolean;
}

export interface UserActivity {
  id: string;
  userId: string;
  action: string;
  details: string;
  ip?: string;
  userAgent?: string;
  timestamp: string;
  type: 'login' | 'logout' | 'create' | 'update' | 'delete' | 'view' | 'download' | 'payment';
  resource: string;
  resourceId?: string;
}

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  theme: 'light',
  language: 'en',
  notifications: {
    email: true,
    whatsapp: true,
    sms: false,
    push: false,
  },
  currency: 'INR',
  dateFormat: 'DD/MM/YYYY',
  timeFormat: '12h',
  itemsPerPage: 20,
  sidebarCollapsed: false,
};

export interface LoginHistory {
  id: string;
  userId: string;
  timestamp: string;
  ip: string;
  device: string;
  browser: string;
  location?: string;
  success: boolean;
  method: 'email' | 'google' | 'phone';
}