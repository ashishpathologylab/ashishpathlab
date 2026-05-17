// User Types
export interface UserData {
  uid: string;
  labName: string;
  ownerName: string;
  mobile: string;
  email: string;
  role: 'user' | 'admin';
  premium: boolean;
  trialStart?: string;
  trialEnd?: string;
  plan: 'trial' | 'monthly' | 'halfyearly' | 'yearly';
  createdAt?: any;
  premiumActivatedAt?: string;
}

// Patient Types
export interface Patient {
  id?: string;
  patientId: string;
  name: string;
  age: number;
  sex: 'Male' | 'Female' | 'Other';
  phone: string;
  email: string;
  address: string;
  referredDoctor: string;
  userId: string;
  createdAt: string;
}

// Investigation/Test Types
export interface Investigation {
  id?: string;
  name: string;
  category: string;
  price: number;
  unit: string;
  normalRanges: NormalRange[];
  interpretation: string;
  notes: string;
}

export interface NormalRange {
  gender: 'Male' | 'Female' | 'Both';
  ageMin: number;
  ageMax: number;
  min: number;
  max: number;
}

// Sample Types
export interface Sample {
  id?: string;
  sampleId: string;
  patientName: string;
  sex: string;
  age: number;
  phone: string;
  email: string;
  referredBy: string;
  tests: SelectedTest[];
  totalAmount: number;
  discount: number;
  finalAmount: number;
  paymentStatus: 'Paid' | 'Pending' | 'Partial';
  letterhead: string;
  userId: string;
  status: 'pending' | 'processing' | 'completed';
  createdAt: string;
}

export interface SelectedTest {
  id: string;
  name: string;
  price: number;
}

// Report Types
export interface Report {
  id?: string;
  reportId: string;
  sampleId: string;
  patientName: string;
  patientAge: number;
  patientSex: string;
  referredDoctor: string;
  testResults: TestResult[];
  interpretation: string;
  status: 'draft' | 'finalized';
  technicianSignature: string;
  doctorSignature: string;
  qrCode: string;
  userId: string;
  createdAt: string;
  finalizedAt?: string;
}

export interface TestResult {
  testName: string;
  result: number;
  flag: 'normal' | 'high' | 'low';
  referenceRange: string;
  unit: string;
}

// Bill Types
export interface Bill {
  id?: string;
  billId: string;
  patientName: string;
  patientPhone: string;
  items: BillItem[];
  subtotal: number;
  discount: number;
  tax: number;
  total: number;
  paymentMethod: string;
  status: 'paid' | 'unpaid' | 'partial';
  userId: string;
  createdAt: string;
}

export interface BillItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// Payment Types
export interface Payment {
  id?: string;
  userId: string;
  userEmail: string;
  plan: 'monthly' | 'halfyearly' | 'yearly';
  amount: number;
  screenshot: string;
  utr: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

// Letterhead Types
export interface Letterhead {
  id?: string;
  userId: string;
  name: string;
  logo: string;
  header: string;
  footer: string;
  address: string;
  phone: string;
  email: string;
  signature: string;
  primaryColor: string;
  fontFamily: string;
  showQR: boolean;
  margin: number;
  isDefault: boolean;
  createdAt: string;
}

// Expense Types
export interface Expense {
  id?: string;
  category: string;
  description: string;
  amount: number;
  date: string;
  paymentMethod: string;
  userId: string;
  createdAt: string;
}